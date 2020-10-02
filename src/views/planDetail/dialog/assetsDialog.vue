<template>
  <a-modal
    title="资源详情"
    :visible="visible"
    width="1000px"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    class="assets-dialog"
  >
    <div class="assets-dialog-content" @click="handleClickDialog">
      <div class="tree" id="tree-content">
        <a-tree
          :defaultExpandAll="true"
          v-if="treeData.length>0"
          :tree-data="treeData"
          :replaceFields="replaceFields"
          @rightClick="handleRightItem"
          @select="selectTree"
        />
        <!-- 右键菜单 -->
        <div class="menu" :style="{left:menu.menuLeft+'px',top:menu.menuTop+'px'}" v-if="rightMenu">
          <template v-if="type=='type'">
            <li class="menu__item" @click="addAssets">新增资源</li>
          </template>
          <template v-if="type=='resource' || type=='goods' ">
            <li class="menu__item" @click="delAssets">删除资源</li>
          </template>
        </div>
      </div>
      <div class="form">
        <!-- 编辑资源 -->
        <a-form :form="form" @submit="handleOk" autocomplete="off">
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
            <a-input
              v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
              placeholder="请输入名称"
            />
          </a-form-item>
          <a-form-item label="资源类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
            <a-select v-decorator="['type']" placeholder="请选则值类型">
              <a-select-option
                v-for="item in resourceTypeList"
                :key="item.key"
                :value="item.value"
              >{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="值类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
            <a-select v-decorator="['dataType']" @change="changeDataType" placeholder="请选则值类型">
              <a-select-option
                v-for="item in dataTypeList"
                :key="item.key"
                :value="item.value"
              >{{item.text}}</a-select-option>
            </a-select>
          </a-form-item>
          <div class="flex" v-if="resourceDataType =='numerical'">
            <a-form-item label="初始值" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
              <a-input v-decorator="['defaultValue']" placeholder="请输入初始值" />
            </a-form-item>
            <a-form-item label="范围" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
              <a-input-group compact>
                <a-input
                  style=" width: 100px; text-align: center"
                  placeholder="最小值"
                  v-decorator="['minValue']"
                />
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                  placeholder="~"
                  disabled
                />
                <a-input
                  style="width: 100px; text-align: center; border-left: 0"
                  placeholder="最大值"
                  v-decorator="['maxValue']"
                />
              </a-input-group>
            </a-form-item>
          </div>
          <div class="flex" v-if="resourceDataType =='state'">
            <a-form-item label="枚举" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
              <a-select
                v-decorator="['enumType']"
                @change="handleResourceEnumTypeChange"
                placeholder="请选则枚举"
              >
                <a-select-option
                  v-for="item in enumTypeList"
                  :key="item.dictType"
                  :value="item.dictType"
                >{{item.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="初始值" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
              <a-select v-decorator="['defaultValue']" placeholder="请选则初始值">
                <a-select-option
                  v-for="item in defaultTypeValueList"
                  :key="item.value"
                  :value="item.value"
                >{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-form-item
            v-if="resourceDataType =='boolean'"
            label="初始值"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 10 }"
          >
            <a-select v-decorator="['defaultValue']" placeholder="请选则初始值">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="resourceDataType =='interval'"
            label="初始值"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 10 }"
          >
            <!--            <a-time-picker v-decorator="['defaultValue']" valueFormat="hh:mm:ss" placeholder="请选则初始值" />-->
            <a-input v-decorator="['defaultValue']" placeholder="请选则初始值,例: hh:mm:ss" />
          </a-form-item>
          <a-form-item label="业务类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
            <a-input
              v-decorator="['category',{ rules: [{ required: false, message: '请输入业务类型' }] }]"
              placeholder="请输入业务类型"
            />
          </a-form-item>
          <a-form-item label="形态" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
            <a-radio-group v-decorator="['materialForm']">
              <a-radio
                v-for="item in materialFormList"
                :key="item.value"
                :value="item.value"
              >{{item.dictLabel}}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="单位" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
            <a-select v-decorator="['units']" placeholder="请选则单位">
              <a-select-option
                v-for="item in unitsList"
                :key="item.value"
                :value="item.value"
              >{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-textarea v-decorator="['description']" placeholder="请输入描述" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 12 }">
            <a-button type="primary" html-type="submit">保存</a-button>
          </a-form-item>
        </a-form>
        <!--  -->
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "assetsDialog",
  data() {
    return {
      visible: false, // 是否显示dialog
      confirmLoading: false, //是否正在加载
      treeData: [], // 树的数据
      form: this.$form.createForm(this, { name: "assetsDialog" }),
      replaceFields: {
        children: "children",
        title: "name",
        key: "key",
      },
      rightMenu: false, // 右键菜单
      allTree: [], // 树的所有数据
      menu: {
        // 菜单的位置
        menuTop: 0,
        menuLeft: 0,
      },
      selectItem: {}, // 选中的数据
      type: "", // 类型
      //表单中使用到的枚举类
      resourceTypeList: [], //资源类型列表
      materialFormList: [], //物质形态列表
      dataTypeList: [], // 资源列表
      enumTypeList: [], //资源使用的枚举列表
      defaultTypeValueList: [], //状态类型资源默认值列表
      unitsList: [], //单位列表
      resourceDataType: "numerical",
    };
  },
  props: {
    show: {
      //是否显示dialog
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler: function (v) {
        this.visible = v;
      },
    },
  },
  created() {
    this._getTreeData();
    this._getInit();
  },
  methods: {
    async _getInit() {
      // 获取资源类型列表
      {
        let res = await this.$http.get("/bs/dict/resource/list/resource/type");
        if (res.code) return false;
        // console.log("值类型的数据是:", res.data);
        this.resourceTypeList = res.data;
        this.$nextTick(function () {
          this.form.setFieldsValue({
            type: this.resourceTypeList[0].value,
          });
        });
      }
      // 物质形态列表 ns_material_form
      {
        let res = await this.$http.get(
          "/system/dict/data/list/ns_material_form"
        );
        if (res.code) return false;
        // console.log("物质形态的数据是:", res.data)
        this.materialFormList = res.data;
        // 设置默认值
        this.$nextTick(function () {
          this.form.setFieldsValue({
            materialForm: this.materialFormList[0].value,
          });
        });
      }
      // 值类型列表 这个请求后台用的是枚举,不是字典所以跟其它不一样
      {
        let res = await this.$http.get("/bs/dict/resource/list/value/type");
        if (res.code) return false;
        // console.log("值类型的数据是:", res.data);
        this.dataTypeList = res.data;
        this.$nextTick(function () {
          this.form.setFieldsValue({
            dataType: this.dataTypeList[0].value,
          });
        });
      }
      // 资源使用状态列表
      {
        let res = await this.$http.get("/bs/dict/status/list");
        if (res.code) return false;
        // console.log("资源状态列表:", res.data);
        this.enumTypeList = res.data;
      }
      // 资源单位列表
      {
        let res = await this.$http.get("/system/dict/data/list/ns_dict_unit");
        if (res.code) return false;
        // console.log("资源单位列表:", res.data);
        this.unitsList = res.data;
      }
    },
    //获取树的数据
    async _getTreeData() {
      let res = await this.$http.get(
        "/bs/ns/plan/resource/tree/" + this.$route.query.id
      );
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
    // 新增资源
    addAssets() {
      //将选中的节点置为空
      this.selectItem = {};
      this.form.resetFields();
    },
    // 删除资源
    async delAssets() {
      let data = {
        id: this.selectItem.key,
      };
      let that = this;
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http.postBody("/ns/plan/resource/remove", data).then((res) => {
            if (res.code) return false;
            that.whenSuccess(() => {
              that.$message.success("删除成功");
            });
            that._getTreeData();
          });
        }
      });
    },
    // 点击右键菜单
    handleRightItem({ event, node }) {
      let dom = document.getElementById("tree-content");

      let rect = node.$el.getBoundingClientRect();
      this.menu = {
        menuLeft: event.clientX - rect.x + dom.offsetWidth - rect.width,
        menuTop: event.clientY - dom.offsetTop - 30,
      };
      // 查找数据
      let id = node.value;
      this._handleIdData(id);
      this.rightMenu = true;
    },
    // 选择树
    selectTree(item) {
      if (item.length < 1) return;
      let id = item[0];
      this._handleIdData(id);
      console.log(this.selectItem);
      console.log(this.type);
      // 通过id 获取详情，渲染
      if (this.type === "resource" || this.type === "goods") this._loadForm();
    },
    async _loadForm() {
      let planResourceId = this.selectItem.key;
      let res = await this.$http.get(
        "/bs/ns/plan/resource/show/" + planResourceId
      );
      if (res.code) {
        this.$message.error(res.msg);
      } else {
        let data = res.data;
        this.resourceDataType = data.dataType;
        if (data.dataType === "state") {
          this.handleResourceEnumTypeChange(data.enumType);
        }
        this.$nextTick(function () {
          setTimeout(() => {
            this.form.setFieldsValue({
              name: data.name,
              type: data.type,
              category: data.category,
              materialForm: data.materialForm,
              dataType: data.dataType,
              defaultValue: data.defaultValue,
              minValue: data.minValue,
              maxValue: data.maxValue,
              enumType: data.enumType,
              units: data.units,
              description: data.description,
            });
          },0);
        });
      }
    },
    // 根据id设置类型,设置当前的数据
    _handleIdData(id) {
      let data = this.allTree.find(($item) => {
        return $item.key == id;
      });
      this.selectItem = data;
      let type = data.type;
      this.type = type;
      console.log("点击的类型是:", this.type);
    },
    // 确定
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this._handleData(values);
        }
      });
    },
    // 提交数据
    async _handleData(data) {
      // 进行接口提交数据
      let api = "add";
      if (this.selectItem.key !== undefined && this.selectItem.type != "type") {
        api = "edit";
        data.id = this.selectItem.key;
      } else {
        data.planId = this.$route.query.id;
      }
      let res = await this.$http.postBody("/bs/ns/plan/resource/" + api, data);
      if (res.code) return false;
      await this._getTreeData();
      this.$message.success("操作成功");
    },
    // 关闭
    handleCancel() {
      this.$emit("close");
      this.visible = false;
    },
    //点击关闭右键菜单
    handleClickDialog() {
      this.rightMenu = false;
    },
    //切换值类型
    changeDataType(type) {
      console.log(type);
      this.resourceDataType = type;
    },
    async handleResourceEnumTypeChange(type) {
      let res = await this.$http.get("/system/dict/data/list/" + type);
      if (res.code) return false;
      console.log("状态类型资源默认值列表:", res.data);
      this.defaultTypeValueList = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.assets-dialog {
  .assets-dialog-content {
    display: flex;
    .tree {
      width: 250px;
    }
    .form {
      flex: 1;
    }
  }
  .menu {
    width: 90px;
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