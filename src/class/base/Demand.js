import Domain from "./Domain"

// 需求
export default class Demand extends Domain {
    constructor({id,name, state}){
      super({id});
      this.name = name;
      this.state = state
    }
    getStateHTML() {    // 返回关于state的html文本 带圆点
        console.log('getStateHTML', this);
        
        let stautsName = {draft: '编写中', approving: '审批中',  approved: '已入库', rejected: '已驳回'};
        return '<span class="event-status event-status-' + this.state + '">' + stautsName[this.state] + '</span>'
    }
}