import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import $ from 'jquery'
Vue.config.productionTip = false
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import '@/scss/common.scss';
import "@/scss/main.scss";
import "@/scss/style.scss";

//日期格式化
import "@/utils/formatDate";
//表格高度自适应
import '@/utils/tableAutoResize'
import '@/utils/TagsLayout.js'
// 辅助工具类
import expand from '@/utils/expand.js'

//引入mock
//import '@/mock/index'
Vue.use(Antd);
import http from "@/http";
import Router from 'vue-router';

const eventBus = new Vue();

Vue.prototype.$$ = $;
Vue.prototype.$http = http;
Vue.prototype.$eventBus = eventBus;
Object.assign(Vue.prototype, expand);

// 加载系统业务类
import VueSupport from './class/base/VueSupport'
import EventTemplate from './class/EventTemplate'
import GoalTemplate from './class/GoalTemplate'
import ResolveSchemeTemplate from './class/ResolveSchemeTemplate'
import Goal from './class/Goal'
import Scene from './class/Scene'
import ResolveScheme from './class/ResolveScheme'
import MyEnum from './class/MyEnum'

Vue.use(EventTemplate);
Vue.use(GoalTemplate);
Vue.use(ResolveSchemeTemplate);
Vue.use(Goal);
Vue.use(Scene);
Vue.use(ResolveScheme);
Vue.use(MyEnum);

let $vue = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
VueSupport.$vue = $vue;