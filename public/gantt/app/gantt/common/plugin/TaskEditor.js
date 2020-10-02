Ext.define('Common.plugin.TaskEditor', {
    extend     : 'Gnt.plugin.TaskEditor',
    requires:[ 'Common.widget.AssignmentEditGrid'],
    assignmentGridClass:"Common.widget.AssignmentEditGrid",
    constructor : function(config) {
        this.callParent(arguments);
        this.taskFormConfig.userStore=this.userStore
    },
    showTask: function (task) {
        this.callParent(arguments);
        if(task.isReadOnly()){
            this.down("#teOkBtn").hide()
        }else{
            this.down("#teOkBtn").show()
        }
    },
    title:"任务编辑器",
    dependencyGridClass:"Common.widget.DependencyGrid",
    taskFormClass:"Common.widget.taskeditor.TaskForm",
    taskFormConfig : {
        showBaseline : true
    },
    advancedFormConfig:{
        showCalendar: true,
        showManuallyScheduled:true,
        showConstraint:true
    }
    // buildTaskEditor: function (a) {
    //     this.callParent(arguments);
    // },
    // buildItems: function () {
    //     var self = this;
    //     var items = this.callParent(arguments);
    //     //加入state
    //     self.dependencyGrid = Ext.create(self.taskStateClass);
    //     items.push(self.dependencyGrid)
    //     return items;
    // }
})