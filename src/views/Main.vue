<template>
  <div class="components-layout-demo-custom-trigger main-container">
    <div class="main-left" :style="{width:collapsed?'80px':'210px'}">
      <div class="logo">
        <img src="@/assets/images/logo.png" height="48" alt v-if="!collapsed" />
        <img src="@/assets/images/logo-mini.png" class="miniImg" alt v-else />
      </div>
      <div class="sidebar-user" title="用户信息">
        <a-avatar :src="userInfo.avatar==''?avatar:userInfo.avatar" size="large" />
        <div class="userTool-con" v-show="!collapsed">
          <div class="userName" :title="userInfo.remark">{{userInfo.remark}}</div>
          <div class="userTool">
            <div title="在线">
              <i class="iconfont icondian"></i>在线
            </div>
            <div title="注销" @click="logout">
              <i class="iconfont icontuichu1"></i>注销
            </div>
          </div>
        </div>
      </div>
      <div class="slideMain">
        <!-- 左侧菜单        -->
        <a-menu
          theme="dark"
          :openKeys="collapsed?['']:menuOpenKeys"
          mode="inline"
          :selectedKeys="menuSelectd"
          @openChange="onOpenChange"
          @select="onMenuItemClick"
          :inlineCollapsed="collapsed"
        >
          <template v-for="item in menuData">
            <a-menu-item
              v-if="!item.children || item.children.length===0"
              :key="item.id"
              :disabled="item.disabled"
            >
              <a-icon :type="item.iconCls|| 'home'" :theme="item.theme" />
              <span>{{item.title}}</span>
            </a-menu-item>
            <a-sub-menu v-else :key="item.id" :disabled="item.disabled">
              <span slot="title">
                <a-icon :type="item.iconCls || 'home'" :theme="item.theme" />
                <span>{{item.title}}</span>
              </span>

              <template v-for="itemc in item.children">
                <a-menu-item
                  v-if="!itemc.children || item.children.length===0"
                  :key="itemc.id"
                  :disabled="itemc.disabled"
                >
                  <span>{{itemc.title}}</span>
                </a-menu-item>
                <a-sub-menu v-else :key="itemc.id ">
                  <span slot="title">
                    <span>{{itemc.title}}</span>
                  </span>
                  <a-menu-item
                    v-for="$item in itemc.children"
                    :key="$item.id"
                    :disabled="$item.disabled"
                  >
                    <span>{{$item.title}}</span>
                  </a-menu-item>
                </a-sub-menu>
              </template>
            </a-sub-menu>
          </template>
        </a-menu>
      </div>
    </div>
    <div class="main-right" :style="{left:collapsed?'80px':'210px'}">
      <a-layout-header class="layout-header">
        <a-icon
          class="trigger"
          style="color:#ffffff"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        {{activeTags}}
      </a-layout-header>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <div class="tags-main">
            <div class="tags">
              <Tags :data="tags" :activeKey="activeTags" @change="tabSelect" @tabClose="tabClose" />
            </div>
            <div class="refresh" @click="refreshRoute()">
              <a-icon type="reload" />刷新
            </div>
          </div>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout-content class="main-content">
        <!-- <transition :name="transitionName"> -->
        <keep-alive :include="$store.state.keepAliveName">
          <!-- <router-view v-if="refreshRouter" class="transitionBody"></router-view> -->
          <router-view v-if="refreshRouter"></router-view>
        </keep-alive>
        <!-- </transition> -->
      </a-layout-content>
    </div>
  </div>
</template>
<script>
import Tags from "@/components/MainTags";
import menu from "@/router/menu.js";
import addTabs from "@/utils/addTabs";
export default {
  components: {
    Tags,
  },
  data() {
    return {
      avatar: require("../assets/images/avatar.png"),
      transitionName: "transitionLeft",
      collapsed: false,
      refreshRouter: true,
      menuSelectd: [],
      menuOpenKeys: [],
      menuData: menu,
      tblData: [],

      userInfo: {
        avatar: "",
        remark: "admin",
      }, // 用户信息
    };
  },
  watch: {
    //路由切换
    $route(to, from) {
      if (to.meta.index < from.meta.index) {
        this.transitionName = "transitionRight";
      } else {
        this.transitionName = "transitionLeft";
      }
    },
  },
  created() {
    //页面刷新不在首页进行相关菜单的设置
    let pathName = this.$route.name;
    if (pathName !== "home") {
      this.refreshLocation(pathName);
    }
  },
  methods: {
    addTabs,
    // 退出登录
    async logout() {
      await this.$http.post("/mpts-manage/logout");
      this.$router.push("/login");
    },
    /**
     * 左侧导航菜单点击
     * @param {*} data 当前菜单数据
     */
    onMenuItemClick(data) {
      let item = this.getMenuDataByKey(data.key);
      let tags = this.$store.state.tags;
      let itemIndex = tags.findIndex((v) => {
        return v.id === item.id;
      });
      if (itemIndex === -1) {
        tags.push({
          id: item.id,
          title: item.title,
          closable: true,
          pathName: item.pathName,
        });
        this.$store.commit("setTags", tags);
      }
      if (this.$route.name !== item.pathName) {
        let names = this.$store.state.keepAliveName + "," + item.pathName;
        this.$store.commit("setkeepAliveName", names);
      }
      //切换路由
      this.changeRoute(item);
      this.$nextTick(() => {
        this.activeTags = item.id;
      });

      this.setMenuSelectedStatus(item);
    },

    onOpenChange(openKeys) {
      if (openKeys.length > 1) {
        let lastLength = openKeys[openKeys.length - 1].length;
        let lastButOneLength = openKeys[openKeys.length - 2].length;
        if (lastLength < lastButOneLength) {
          this.menuOpenKeys = [openKeys.pop()];
        } else if (lastLength === lastButOneLength) {
          //关闭上一个
          openKeys.splice(openKeys.length - 2, 1);
          this.menuOpenKeys = [...openKeys];
        } else {
          //打开的是下一级
          this.menuOpenKeys = [...openKeys];
        }
      } else {
        this.menuOpenKeys = [...openKeys];
      }
    },
    /**
     * tags 切换
     * @param {*} item tags 数据
     */
    tabSelect(item) {
      //查找到路由
      // let data = this.tags.find(v => {
      //   return v.id === item.id;
      // });
      this.setMenuSelectedStatus(item);
    },
    //设置导航菜单选中状态
    setMenuSelectedStatus(item) {
      this.activeTags = item.id;
      this.menuOpenKeys = [];
      //菜单选中状态
      this.menuSelectd = [item.id];
      if (item.id.includes(".")) {
        this.menuOpenKeys.push(...this._handleIdData(item.id));
      } else {
        this.menuOpenKeys.push(item.id);
      }
      this.menuOpenKeys = [...new Set(this.menuOpenKeys)];
      //菜单选中状态
      this.menuSelectd = [item.id];
      // if (item.id.includes(".")) {
      //   this.menuOpenKeys = [item.id.split(".")[0]];
      // } else {
      //   this.menuOpenKeys = [item.id];
      // }
      //  this.menuOpenKeys = [...new Set(this.menuOpenKeys)];
      //路由切换
      this.changeRoute(item);
    },
    // 根据id 设置当前选择菜单
    _handleIdData(id) {
      let arrId = id.split(".");
      let len = arrId.length;
      let arrData = [];
      switch (len) {
        case 1:
          arrData = arrId;
          break;
        case 2:
          arrData = arrId[0];
          break;
        case 3:
          arrData.push(arrId[0], arrId[0] + "." + arrId[1]);
          break;
      }
      return arrData;
    },
    /**
     * tags 关闭
     * @param {*} panel
     */
    tabClose(panel) {
      //取消缓存
      this.keepAlive = false;
      let names = this.$store.state.keepAliveName.split(",");
      if (names.length > 0) {
        let item = this.tags.find((v) => {
          return v.title === panel.title;
        });
        names = names.filter((v) => {
          return v !== item.pathName;
        });
        this.$store.commit("setkeepAliveName", names.join(","));
        console.log(this.$store.state.keepAliveName);
      }
      let tags = this.$store.state.tags;
      tags = tags.filter((v) => {
        return v.title !== panel.title;
      });
      this.$store.commit("setTags", tags);
      tags = null;
      this.setMenuSelectedStatus(this.tags[this.tags.length - 1]);
    },
    //切换路由
    changeRoute(item) {
      if (item && this.$route.name !== item.pathName) {
        this.$router.push({
          name: item.pathName,
          query: item.query,
        });
        this.keepAlive = true;
      }
    },
    //根据 id 获取菜单数据
    getMenuDataByKey(key) {
      return this.menuDataCom.find((v) => {
        return v.id === key;
      });
    },
    //刷新页面
    refreshLocation(pathName) {
      // let tags = this.$store.state.tags;
      let menuData = this.menuData;
      let _menuData = [],
        l = menuData.length,
        i = 0;
      menuData.forEach((item) => {
        _menuData.push(item);
        if (item.children) {
          _menuData = this._getMenuData(_menuData, item);
        }
      });
      // 进行特殊判断
      let specialMenu = [
        {
          _pathName: "modelDetailIndex",
          redirect: "modelListIndex",
        },
        {
          _pathName: "planDetailIndex",
          redirect: "planListIndex",
        },
        {
          _pathName: "planEincidentIndex",
          redirect: "planListIndex",
        },
      ];

      let specialIndex = specialMenu.findIndex(
        (item) => item._pathName == pathName
      );
      if (specialIndex > -1) {
        let $item = specialMenu[specialIndex];
        let params = this.$route.query;
        pathName = $item.redirect;
        setTimeout(() => {
          this.addTabs(params.name, $item._pathName, true, params);
        }, 0);
      }

      //菜单找到当前数据
      let data = _menuData.find((v) => {
        return v.pathName === pathName;
      });
      if (data) {
        data.key = data.id;
        this.setMenuItemState(data);
        // data
      } else {
        //新增、编辑...
        // this.$router.push("/");
      }
    },
    //递归添加数据
    _getMenuData(arr, item) {
      item.children.forEach(($item) => {
        arr.push($item);
        if ($item.children && $item.children.length) {
          this._getMenuData(arr, $item);
        }
      });
      return arr;
    },
    setMenuItemState(item) {
      //tags保存
      this.onMenuItemClick(item);
      //组件缓存
      this.setKeepAliveName(item);
    },
    //保存缓存组件名称
    setKeepAliveName(item) {
      let names = this.$store.state.keepAliveName + "," + item.pathName;
      this.$store.commit("setkeepAliveName", names);
    },
    //刷新路由
    refreshRoute() {
      this.refreshRouter = false;
      let item = this.tags.find((v) => {
        return v.id === this.activeTags;
      });
      //从缓存组件中移除
      let newTags = this.$store.state.keepAliveName.split(",");
      newTags = newTags.filter((v) => {
        return v !== item.pathName;
      });
      this.$store.commit("setkeepAliveName", newTags.join(","));
      this.$nextTick(() => {
        //加入缓存组件中
        let tags = this.$store.state.keepAliveName;
        tags += "," + item.pathName;
        this.$store.commit("setkeepAliveName", tags);
        this.refreshRouter = true;
      });
    },
  },
  computed: {
    menuDataCom() {
      let data = [];
      this.menuData.forEach((element) => {
        data = [...data, element, ...(element.children || [])];
        if (element.children) {
          element.children.forEach(($v) => {
            if ($v.children) {
              data = [...data, ...$v.children];
            }
          });
        }
      });
      return data;
    },
    //标签页
    tags() {
      return this.$store.state.tags;
    },
    activeTags: {
      get() {
        return this.$store.state.activeTags;
      },
      set(v) {
        this.$store.commit("setActiveTags", v);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../scss/mainView.scss";
</style>
