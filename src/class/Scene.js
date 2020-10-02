import Domain from "@/class/base/Domain";

// 场景
class Scene extends Domain {

    static CLASS_NAME = "场景";

    constructor({id, name, beginTime, endTime, duration, state, planGrade, managerId}) {
        super({id})
        this.name = name;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.duration = duration;
        this.state = state;
        this.planGrade = planGrade;
        this.managerId = managerId;
    }

    static openAddPage() {    // 打开新建页面
        this.$vue.$router.push({
            name: "sceneEdit",
            params: {
                tags: '新建' + this.CLASS_NAME
            }
        });
    }

    static openEditPage(bean) {    // 打开编辑页面
        this.$vue.$router.push({
            name: "sceneEdit",
            params: {
                tags: "编辑场景",
                isEdit: true,
                sceneId: bean.id
            }
        })
    }
}

export default {
    install(Vue) {
        Vue.prototype.Scene = Scene;
    }
}