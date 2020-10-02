<template>
  <div class="page-main page-demand-list" @click="handleClickDialog">
    <div class="container-content">
      <div class="content-search-bar">
        <!--  -->
        <div class="model-detail" id="model-detail">
          <div class="model-detail-tree" id="model-tree">
            <a-tree
              :defaultExpandAll="true"
              v-if="treeData.length>0"
              :tree-data="treeData"
              :replaceFields="replaceFields"
              @rightClick="handleRightItem"
              @select="selectTree"
            />
          </div>
          <div class="model-detail-content">
            <!-- 树详情 -->
            <treeDetail v-if="isShow.treeDetail" :item="detailItem"></treeDetail>
            <!-- 新增活动 -->
            <addActivities v-if="isShow.addActivities" :item="selectItem" @update="_updata"></addActivities>
            <!-- 新增资源 -->
            <addResources v-if="isShow.addResources" :item="selectItem" @update="_updata"></addResources>
            <!-- 新增属性 -->
            <addProperty v-if="isShow.addProperty" :item="selectItem" @update="_updata"></addProperty>
            <!-- 新增影响 -->
            <addInfluence v-if="isShow.addInfluence" :item="selectItem" @update="_updata"></addInfluence>
            <!-- 新增约束 -->
            <addConstraint v-if="isShow.addConstraint" :item="selectItem" @update="_updata"></addConstraint>
          </div>
          <!-- 右键菜单 -->
          <div
            class="menu"
            :style="{left:menu.menuLeft+'px',top:menu.menuTop+'px'}"
            v-if="rightMenu"
          >
            <!-- 活动右键 -->
            <template v-if="type=='activityModel'">
              <li class="menu__item" @click="_openData('addActivities',false)">新增活动</li>
            </template>
            <!-- 资源右键 -->
            <template v-if="type=='resourceModel'">
              <li class="menu__item" @click="_openData('addResources',false)">新增资源</li>
            </template>

            <!-- 活动的实例右键 -->
            <template v-if="type=='activityExample'">
              <li class="menu__item" @click="_openData('addProperty',false)">新增属性</li>
              <li class="menu__item" @click="_openData('addInfluence',false)">新增资源影响</li>
              <li class="menu__item" @click="_openData('addConstraint',false)">新增约束</li>
              <li class="menu__item" @click="_deleteData('/bs/dict/activity/remove')">删除活动</li>
            </template>
            <!-- 属性右键 -->
            <template v-if="type=='attribute'">
              <li class="menu__item" @click="_deleteData('/bs/dict/attribute/remove')">删除</li>
            </template>
            <!-- 资源影响右键 -->
            <template v-if="type=='effect'">
              <li class="menu__item" @click="_deleteData('/bs/dict/effect/remove')">删除</li>
            </template>
            <!-- 约束右键 -->
            <template v-if="type=='constraint'">
              <li class="menu__item" @click="_deleteData('/bs/dict/constraint/remove')">删除</li>
            </template>
            <!--  资源实例 -->
            <template v-if="type=='resourceExample'">
              <li class="menu__item" @click="_deleteData('/bs/dict/resource/remove')">删除</li>
            </template>
          </div>
          <!--  -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addActivities from "./addActivities";
import addResources from "./addResources";
import addProperty from "./addProperty";
import addInfluence from "./addInfluence";
import addConstraint from "./addConstraint";
import treeDetail from "./treeDetail";
export default {
  name: "modelDetailIndex",
  components: {
    treeDetail, // 树详情
    addActivities, //新增活动
    addResources, // 新增资源
    addProperty, // 新增属性
    addInfluence, // 新增影响
    addConstraint, //新增约束
  },
  created() {
    this._getInit();
    this._getTree();
  },
  data() {
    return {
      selectItem: {},
      detailItem: {},
      replaceFields: {
        children: "children",
        title: "name",
        key: "key",
      },
      treeData: [], // 树
      //
      isShow: {
        treeDetail: true, // 树详情
        addActivities: false, //新增活动
        addResources: false, // 新增资源
        addProperty: false, // 新增属性
        addInfluence: false, // 新增影响
        addConstraint: false, //新增约束
      },
      menu: {
        // 菜单的位置
        menuTop: 0,
        menuLeft: 0,
      },
      rightMenu: false, // 右键菜单
      allTree: [],
      type: "", // 类型
    };
  },
  methods: {
    async _getInit() {
      let data = { id: this.$route.query.id };
      // 获取模型详情
      let res = await this.$http.get("/bs/dict/show", data);
      if (res.code) return false;
      console.log(res.data);
      this.detailItem = res.data;
    },
    // 更新数据后执行的函数
    _updata() {
      this._getTree();
      this._openData("treeDetail", false, false);
    },
    // 获取树
    async _getTree() {
      let data = { id: this.$route.query.id };
      let res = await this.$http.get("/bs/dict/queryTree", data);
      if (res.code) return false;
      this.treeData = res.data;
      this.allTree = this._allTree([], res.data);
    },
    // 把所有数据都存起来
    _allTree(arr, data) {
      data.forEach((item) => {
        arr.push(item);
        if (item.children) {
          this._allTree(arr, item.children);
        }
      });
      return arr;
    },
    // 左键选中
    selectTree(item) {
      let id = item[0];

      let data = this.allTree.find(($item) => {
        return $item.key == id;
      });
      console.log(data);
      let type = data.type;
      this.type = type;
      this.selectItem = data;
      switch (type) {
        // case "activityModel": {
        //   this._openData("addActivities", true);
        //   this.selectItem = data;
        //   break;
        // }
        case "activityExample": {
          this._openData("addActivities", true);
          break;
        }
        case "attribute": {
          this._openData("addProperty", true);
          break;
        }
        case "constraint": {
          this._openData("addConstraint", true);
          break;
        }
        case "effect": {
          this._openData("addInfluence", true);
          break;
        }
        case "resourceExample": {
          this._openData("addResources", true);
          break;
        }
      }
    },
    //右键
    handleRightItem({ event, node }) {
      this.rightMenu = true;
      let dom = document.getElementById("model-detail");
      let _dom = document.getElementById('model-tree')

      let rect = node.$el.getBoundingClientRect();
      this.menu = {
        menuLeft: event.clientX - rect.x + _dom.offsetWidth - rect.width,
        menuTop: event.clientY - dom.offsetTop - 90,
      };
      // 查找数据
      let id = node.value;
      let data = this.allTree.find(($item) => {
        return $item.key == id;
      });
      this.selectItem = data;
      let type = data.type;
      this.type = type;
    },
    //点击关闭右键菜单
    handleClickDialog() {
      this.rightMenu = false;
    },

    // 关闭所有打开某一个条
    _openData(name, edit = true) {
      if (!edit) {
        let data = JSON.parse(JSON.stringify(this.selectItem));
        this.selectItem = {
          key: data.key,
        };
      }

      this.isShow[name] = false;
      Object.keys(this.isShow).forEach((key) => {
        if (key == name) {
          this.$nextTick(function () {
            this.isShow[key] = true;
          });
        } else {
          this.isShow[key] = false;
        }
      });
    },
    _deleteData(url) {
      let data = [this.selectItem.key];
      let that = this;
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http.postBody(url, data).then((res) => {
            if (res.code) return false;
            that.whenSuccess(() => {
              that.$message.success("删除成功");
            });
            that._getTree();
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
  },
};
</script>

<style lang="scss">
.model-detail {
  display: flex;
  .model-detail-tree {
    width: 400px;
  }
  .model-detail-content {
    flex: 1;
  }
  .model-detail-content {
    li {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      span {
        width: 12em;
        text-align: right;
        display: inline-block;
      }
      p {
        width: 30em;
      }
    }
  }
  .con-title {
    font-size: 16px;
    margin-top: 20px;
    padding-left: 40px;
  }
  .flex {
    display: flex;
    .ant-form-item {
      width: 50%;
    }
  }
  // 右键菜单
  .menu {
    width: 110px;
    position: absolute;
    border-radius: 7px;
    background-color: #1890ff;
    z-index: 9999;
    color: rgba(255, 255, 255, 0.9);
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    .menu__item {
      display: block;
      line-height: 30px;
      cursor: pointer;
    }
  }
}
</style>