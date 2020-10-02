Ext.define('MyApp.plugin.TaskEditor', {
    extend     : 'Gnt.plugin.TaskEditor',
    requires:[ 'MyApp.widget.AssignmentEditGrid'],
    assignmentGridClass:"MyApp.widget.AssignmentEditGrid",
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
    dependencyGridClass:"MyApp.widget.DependencyGrid",
    taskFormClass:"MyApp.widget.taskeditor.TaskForm",
    taskFormConfig : {
        showBaseline : true
    },
    advancedFormConfig:{
        showCalendar: true,
        showManuallyScheduled:true,
        showConstraint:true
    }
})