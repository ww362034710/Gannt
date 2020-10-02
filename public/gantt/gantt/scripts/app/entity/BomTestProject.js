!function(){
    var BomTestProject = function(opts) {
        opts = opts || {};

        this.id = opts.hasOwnProperty('id')? opts.id: null;
        this.name = opts.hasOwnProperty('name')? opts.name: null;
        this.bomId = opts.hasOwnProperty('bomId')? opts.bomId: null;
        this.testType = opts.hasOwnProperty('testType')? opts.testType: null;
        this.craftsName = opts.hasOwnProperty('craftsName')? opts.craftsName: null;
        this.craftsNo = opts.hasOwnProperty('craftsNo')? opts.craftsNo: null;
        this.testBrief = opts.hasOwnProperty('testBrief')? opts.testBrief: null;
        this.taskBook = opts.hasOwnProperty('taskBook')? opts.taskBook: null;
        this.intention = opts.hasOwnProperty('intention')? opts.intention: null;
        this.requirement = opts.hasOwnProperty('requirement')? opts.requirement: null;
        this.environmentConditions = opts.hasOwnProperty('environmentConditions')? opts.environmentConditions: null;
        this.testMethod = opts.hasOwnProperty('testMethod')? opts.testMethod: null;
        this.attention = opts.hasOwnProperty('attention')? opts.attention: null;
        this.testRemark = opts.hasOwnProperty('testRemark')? opts.testRemark: null;
        this.isDelete = opts.hasOwnProperty('isDelete')? opts.isDelete: null;
        this.type = opts.hasOwnProperty('type')? opts.type: null;


    };
    window.BomTestProject = BomTestProject;
}();