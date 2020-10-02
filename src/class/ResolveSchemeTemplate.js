import Demand from "./base/Demand";

// 模板分解方案
class ResolveSchemeTemplate extends Demand {

    static CLASS_NAME = '模板分解方案';

    static GOAL_TYPE = 'goal';
    static EVENT_TYPE = 'event';

    static ROOT_TYPE_NAME_MAP = {[this.GOAL_TYPE]:'目标模板', [this.EVENT_TYPE]:'事件'};

    constructor({id, name, root_type, root_id, submit_system, state, description, rootName,task_cabin,run_phase,priority,owner_system,test_kind,important_grade,plan_grade}) {
        super({id, name, state});
        // 持久化字段
        this.id = id;
        this.name = name;
        this.rootType = root_type;
        this.rootId = root_id;
        this.submitSystem = submit_system;
        this.state = state;
        this.description = description;
        this.taskCabin =task_cabin;
        this.runPhase =run_phase;
        this.priority =priority;
        this.ownerSystem =owner_system;
        this.importantGrade =important_grade;
        this.planGrade =plan_grade;
        this.testKind =test_kind;

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
            name: rootType+"TemplateEdit",
            params: {
                tags: "采集" + this.getNodeTypeName(rootType),
                schemeTemplateType: rootType
            }
        });
    }
    static openEditPage(bean) {
        switch (bean.rootType) {
            case 'goal':
                // 打开新建页面
                this.$vue.$router.push({
                    name: "goalTemplateEdit",
                    params: {
                        tags: "编辑" + bean.getNodeTypeName(),
                        schemeTemplateId: bean.id,
                        schemeTemplateType: bean.rootType,
                        goalTemplateId:bean.rootId
                    }
                });
                break;
            case 'event':
                // 打开新建页面
                this.$vue.$router.push({
                    name: "eventTemplateEdit",
                    params: {
                        tags: "编辑" + bean.getNodeTypeName(),
                        resolveTemplateSchemeId: bean.id,
                        schemeTemplateType: bean.rootType,
                        eventTemplateId:bean.rootId
                    }
                });
                break;
            default:
                console.error("未知的模板分解方案根节点类型:", bean.rootType)
                throw ("未知的模板分解方案根节点类型: " + bean.rootType)
        }
    }
    static openDecomPage(bean) {    // 打开分解页面
        this.$vue.$router.push({
            name: "eventTemplateDecompose",
            params: {
                tags: "分解" + bean.getNodeTypeName(),
                schemeTemplateId: bean.id,
                schemeTemplateType: bean.rootType
            }
        });
    }
    static openViewPage(bean) {    // 打开新建页面
        switch (bean.rootType) {
            case 'goal':
                this.$vue.$router.push({
                    name: "goalTemplateView",
                    params: {
                        tags: bean.getNodeTypeName() + "-" + bean.name,
                        schemeTemplateId: bean.id,
                        goalTemplateId: bean.rootId,
                    }
                });
                break;
            case 'event':
                this.$vue.$router.push({
                    name: "eventTemplateView",
                    params: {
                        tags: bean.getNodeTypeName() + "-" + bean.name,
                        schemeTemplateId: bean.id,
                        eventTemplateId: bean.rootId,
                    }
                });
                break;
            default:
                console.error("未知的模板分解方案根节点类型:", bean.rootType)
                throw ("未知的模板分解方案根节点类型: " + bean.rootType)
        }
    }
}

export default {
    install: function (Vue) {
        Vue.prototype.ResolveSchemeTemplate = ResolveSchemeTemplate;
    }
}
