import Demand from "./base/Demand";

// 分解方案
class ResolveScheme extends Demand {

    static CLASS_NAME = '分解方案';

    static GOAL_TYPE = 'goal';
    static EVENT_TYPE = 'event';

    static ROOT_TYPE_NAME_MAP = {[this.GOAL_TYPE]:'目标', [this.EVENT_TYPE]:'规划事件'};

    constructor({id, name, rootType, rootId, submitSystem, state, description, rootName,taskCabin,runPhase,priority,ownerSystem,testKind,importantGrade,planGrade,submittingAgency}) {
        super({id, name, state});
        // 持久化字段
        this.id = id;
        this.name = name;
        this.rootType = rootType;
        this.rootId = rootId;
        this.submitSystem = submitSystem;
        this.state = state;
        this.description = description;

        this.taskCabin =taskCabin;
        this.runPhase =runPhase;
        this.priority =priority;
        this.ownerSystem =ownerSystem;
        this.importantGrade =importantGrade;
        this.planGrade =planGrade;
        this.testKind =testKind;
        this.submittingAgency =submittingAgency;

        // 非持久化字段
        this.rootName = rootName;
    }

    getNodeTypeName() {   // 获得根节点类型的中文名称
        return this.constructor.getNodeTypeName(this.rootType);
    }

    static getNodeTypeName(rootType) {   // 获得根节点类型的中文名称
        return this.ROOT_TYPE_NAME_MAP[rootType];
    }
    static openAddPage(rootType) {    // 打开新建页面
        this.$vue.$router.push({
            name: "goalEdit",
            params: {
                tags: "采集" + this.getNodeTypeName(rootType),
                schemeType: rootType
            }
        });
    }
    static openEditPage(bean) {    // 打开新建页面
        this.$vue.$router.push({
            name: "dGoalDecompose",
            params: {
                tags: "编辑" + bean.getNodeTypeName(),
                schemeId: bean.id,
                schemeType: bean.rootType
            }
        });
    }
    static openViewPage(bean) {    // 打开新建页面
        switch (bean.rootType) {
            case 'goal':
                this.$vue.$router.push({
                    name: "goalView",
                    params: {
                        tags: "目标-" + bean.name,
                        schemeId: bean.id,
                        goalId: bean.rootId
                    }
                });
                break;
            default:
                console.error("未知的分解方案根节点类型:", bean.rootType)
                throw ("未知的分解方案根节点类型: " + bean.rootType)
        }
    }
}

export default {
    install(Vue) {
        Vue.prototype.ResolveScheme = ResolveScheme;
    }
}
