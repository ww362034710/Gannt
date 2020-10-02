import Demand from "./base/Demand"

// 事件模板
class EventTemplate extends Demand {

  static CLASS_NAME = "事件模板";

  constructor({id,name,state}){
    super({id, name,state})
  }

}

export default {
  install(Vue) {
    Vue.prototype.EventTemplate = EventTemplate;
  }
}