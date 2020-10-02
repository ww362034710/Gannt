(function(){
    var PmBook = function(opts) {
        opts = opts || {};

        // 持久化属性
        this.name = opts.name;
        this.state = opts.state;
        this.approvalState = opts.approvalState;
        this.prepareStartTime = opts.prepareStartTime;
        this.prepareEndTime = opts.prepareEndTime;
        this.implementStartTime = opts.implementStartTime;
        this.implementEndTime = opts.implementEndTime;
        this.assessmentStartTime = opts.assessmentStartTime;
        this.assessmentEndTime = opts.assessmentEndTime;
        this.taskFileId = opts.taskFileId;
        this.examinationBrief = opts.examinationBrief;
        this.examinationReport = opts.examinationReport;
        this.resourceIds = opts.resourceIds;
        this.isDelete = opts.isDelete;
    };
    // 到补充信息页面 TODO NOT COMPLETE
    PmBook.prototype.toImproveInfo = function () {
        PmBook.toImproveInfo(this.id, this.name);
    };


    // 静态方法
    // 获得信息
    PmBook.get = function(id) {
        var task = null;
        $.ajax(ctx + "/pmBook/show", {
            data: {id: id},
            async: false,
            success: function(rst) {
                task = rst.obj;
            }
        });
        return task;
    };
    window.PmBook = PmBook;
})();