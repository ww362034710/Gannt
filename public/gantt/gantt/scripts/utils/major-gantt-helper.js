/**
 * 甘特图帮助类
*/
(function(scope){
    var GanttHelper = {
        // 获得项目(试验大纲)任务
        getBookTask: function() {
            return gantt.getTaskStore().toArray().find(function(task){return task.getTaskInfoType() === PmTaskInfo.TASKINFOTYPE.BOOK.type});
        },
        // 获得所有任务
        getAllTasks: function() {
            return gantt.getTaskStore().toArray();
        },
        // 数据是否变更了(是否编辑过了)
        dataChanged: function(){
            return gantt.crudManager.hasChanges();
        },
        // 重新加载数据
        reload: function() {
            gantt.crudManager.load(
                // here is callback
                function () { },
                // here is errback
                function (response) { alert('错误:  '+response.message); }
            );
        },
        getSelectedTask: function() {
            return gantt.getSelectionModel().getSelection()[0];
        },
        // 检测拖动合法性
        fun: {
            /*
             检测在拖动一个任务时是否合法
             position:   before/append/after
              */
            checkDropValid: function(srcTask, destTask, position ){
                var allowed = false;
                // 检测业务逻辑性
                var srcTaskInfoType = srcTask.getTaskInfoType(),
                    destTaskInfoType = destTask.getTaskInfoType(),
                    srcBomId = srcTask.bomId,
                    destBomId = destTask.bomId;

                // 目标位置的上级节点
                var targetParentTask = position == "append"? destTask: (destTask.parentNode? destTask.parentNode: null),
                    targetParentTaskId = targetParentTask? targetParentTask.getId(): null,
                    targetParentTaskInfoType = targetParentTask? targetParentTask.getTaskInfoType(): null,
                    targetParentTaskBomId = targetParentTask? targetParentTask.getBomId(): null,
                    targetParentTaskTestProjectId = targetParentTask? targetParentTask.getBomTestProjectId(): null;

                switch (srcTaskInfoType) {
                    case PmTaskInfo.TASKINFOTYPE.NORMAL.type:
                        // 试验任务
                        // 可以变更上级为testproject/smallbatch中的一种  而且要确保在同一个 bom / testproject 下
                        allowed = [PmTaskInfo.TASKINFOTYPE.TESTPROJECT.type, PmTaskInfo.TASKINFOTYPE.SMALLBATCH.type ].indexOf( targetParentTaskInfoType ) != -1 && getParentTestProjectTask(srcTask) == getParentTestProjectTask(targetParentTask);
                        break;
                    case PmTaskInfo.TASKINFOTYPE.SMALLBATCH.type:
                        // 小批次
                        allowed = [PmTaskInfo.TASKINFOTYPE.TESTPROJECT.type, PmTaskInfo.TASKINFOTYPE.SMALLBATCH.type ].indexOf( targetParentTaskInfoType ) != -1 && getParentTestProjectTask(srcTask) == getParentTestProjectTask(targetParentTask);
                        break;
                    default:
                        // batch testproject smallbatch 都不可以变更其上级
                        allowed = srcTask.parentNode == targetParentTask;
                }
                return allowed;

                // 往上找到testProjectTask
                function getParentTestProjectTask(_t) {
                    if (!_t) {
                        return null;
                    } else if (_t.getTaskInfoType() == PmTaskInfo.TASKINFOTYPE.TESTPROJECT.type ) {
                        return _t;
                    } else if (_t.parentNode) {
                        return getParentTestProjectTask( _t.parentNode )
                    } else {
                        return null
                    }
                }
            }
        }
    };

    scope.GanttHelper = GanttHelper;
})(window);