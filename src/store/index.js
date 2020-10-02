import Vue from 'vue'
import Vuex from 'vuex'
import Scene from './scene';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tags: [{
            id: 'home',
            title: '首页',
            closable: false,
            pathName: 'home'
        }], //标签页
        activeTags: "home",
        keepAliveName: 'home', //缓存组件

    },
    mutations: {
        //设置缓存组件名称
        setkeepAliveName(state, value) {
            state.keepAliveName = value
        },
        //设置标签页
        setTags(state, value) {
            state.tags = value
        },
        //设置活动标签页
        setActiveTags(state, value) {
            state.activeTags = value
        }
    },
    actions: {

    },
    modules: {
        Scene
    }
})