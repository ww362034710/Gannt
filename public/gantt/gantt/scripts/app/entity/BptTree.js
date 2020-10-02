!function(){
    var BptTree = function(opts) {
        opts = opts || {};

        this.entityId = opts.hasOwnProperty('entityId')? opts.entityId: null;
        this.entityType = opts.hasOwnProperty('entityType')? opts.entityType: null;
        this.name = opts.hasOwnProperty('name')? opts.name: null;

        //TODO WHAT IS THIS
        this.generateLink()
    };
    BptTree.prototype.generateLink = function() {
        var classMap = {};
        classMap[BptTree.TYPE.TASK.type] = "PmTaskInfo";
        console.log(classMap);
        var clazzName = classMap[this.entityType];
        console.log(clazzName);
        return LinkGenerator.TYPE.hasOwnProperty(clazzName) ? LinkGenerator.create(clazzName, {id: this.entityId, name: this.name }): this.name;
    };
    window.BptTree = BptTree;
}();