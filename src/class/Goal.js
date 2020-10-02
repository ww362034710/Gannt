import Demand from "./base/Demand"

// 目标
class Goal extends Demand {

    static CLASS_NAME = "目标";

    constructor({id, name, state, parentId, resolveSchemeId}) {
        super({id, name, state})
        // 持久化字段
        // 非持久化字段
        this.parentId = parentId;
        this.resolveSchemeId = resolveSchemeId;
    }

}

export default {
    install(Vue) {
        Vue.prototype.Goal = Goal;
    }
}