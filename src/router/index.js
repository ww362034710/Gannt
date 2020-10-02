import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index'
import routes from './routerConfig.js';

// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err);
// };

Vue.use(Router);

let router = new Router({
    base: process.env.BASE_URL,
    routes: routes
});
/** 
 * 根据路由名称获取tags
 * @param {*} pathName  路由名称
 * @param {*} title 标签页名称
 */
function setTagsName(pathName, title) {
    let { item, tags, index } = getActiveTagsByPathName(pathName);
    if (!item) {
        let _id = new Date().getTime() + "";
        tags.push({
            id: _id,
            title: title,
            closable: true,
            pathName: pathName
        });
        store.commit('setTags', tags);
        //添加缓存
        let names = store.state.keepAliveName + "," + pathName
        store.commit('setkeepAliveName', names);
        store.commit('setActiveTags', _id);
    } else {
        //修改tabs name
        tags[index].title = title;
        store.commit('setActiveTags', tags[index].id);
        store.commit('setTags', tags);
    }
}
//获取当前活动tabs pathName
function getActiveTagsName(pathName) {
    let { item } = getActiveTagsByPathName(pathName)
    if (item && store.state.activeTags !== item.id) {
        store.commit('setActiveTags', item.id);
    }
}
//根据pathName 获取tag是
function getActiveTagsByPathName(pathName) {
    let tags = store.state.tags,
        index = tags.findIndex(v => {
            return v.pathName === pathName
        });
    return {
        item: tags[index] || null,
        tags: tags,
        index: index
    }
}
router.beforeEach((to, from, next) => {
    if (to.params.tags) {
        setTagsName(to.name, to.params.tags)
    } else {
        //路由切换进行tabs 定位
        getActiveTagsName(to.name)
    }
    next();
})

export default router;
/** 
 * 路由配置命名规则 
 * 文件夹+模块名 
 * name:ScenceManagement+Index => scenceManagementindex
 * path:ScenceManagement+Index => /scenceManagementindex
 */