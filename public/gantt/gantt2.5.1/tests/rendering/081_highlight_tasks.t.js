StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    
    var gantt = t.getGantt({
        renderTo        : Ext.getBody(),
        
        startDate       : new Date(2010, 1, 1),
        endDate         : new Date(2010, 2, 1)
    });
    
    t.verifyCachedDependenciesState(gantt.taskStore)
    
    t.waitForTasksAndDependenciesToRender(gantt, function () {
        var taskStore   = gantt.taskStore;
        var ganttView   = gantt.getSchedulingView()

        ganttView.highlightTask(117);
        
        Ext.each([ 117, 115, 116 ], function (taskId) {
            t.hasCls(ganttView.getNode(taskStore.getById(taskId)), 'sch-gantt-task-highlighted', 'Task has been highlighted');
        });
        
        ganttView.unhighlightTask(115);
        
        t.hasCls(ganttView.getNode(taskStore.getById(117)), 'sch-gantt-task-highlighted', '117 is still highlighted');
        t.hasNotCls(ganttView.getNode(taskStore.getById(115)), 'sch-gantt-task-highlighted', '115 is not');
        t.hasNotCls(ganttView.getNode(taskStore.getById(116)), 'sch-gantt-task-highlighted', '116 is not');
    })
})    
