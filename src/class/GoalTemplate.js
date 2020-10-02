import Demand from "./base/Demand"

// 目标模板
class GoalTemplate extends Demand {

  static CLASS_NAME = "目标模板";

  constructor({id,name,state}){
    super({id, name,state})
  }

}

export default {
  install(Vue) {
    Vue.prototype.GoalTemplate = GoalTemplate;
  }
}