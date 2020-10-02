/*
* 此文件用于添加不常用的工具函数
* 此函数使用的时候，请在methods里面注册
*/
// 添加到新的页签
function addTabs(title, pathName, closable = true, query = {}) {
    let data = {
        id: parseInt(Math.random() * 10000).toString(),
        title,
        pathName,
        closable,
        query
    };
    let tags = this.$store.state.tags;
    let index = tags.findIndex(item => {
        return item.pathName == data.pathName;
    });
    // 如果发现这个组件已经被打开了，那么就关闭他
    if (index > -1) {
        tags.splice(index, 1);
    }
    tags.push(data);
    this.$store.commit("setTags", tags);
    // this.$store.commit("setVal", {
    //     key: "activeTags",
    //     val: data.id
    // });
    if (data && this.$route.name !== data.pathName) {
        this.$router.push({
            name: data.pathName,
            query
        });
    }
}

export default addTabs // 添加到新的页签
