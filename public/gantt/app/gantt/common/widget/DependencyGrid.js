Gnt.widget.DependencyGrid
Ext.define('Common.widget.DependencyGrid', {
    extend: 'Gnt.widget.DependencyGrid',
    allowParentTaskDependencies:false,
    l10n:{
        idText                      : 'ID编号',
        taskText                    : '任务名称',
        blankTaskText               : '请选择任务',
        invalidDependencyText       : '错误的依赖关系',
        parentChildDependencyText   : '父子节点含有依赖关系',
        duplicatingDependencyText   : '有重复的依赖关系',
        transitiveDependencyText    : '存在传递的依赖关系',
        cyclicDependencyText        : '依赖关系中存在环路',
        typeText                    : '类型',
        lagText                     : '延隔时间',
        clsText                     : 'CSS类',
        endToStartText              : '结束开始',
        startToStartText            : '开始开始',
        endToEndText                : '结束结束',
        startToEndText              : '开始结束'
    },
    filterTasks:function(task){
        return this.callParent(arguments) && !task.isReadOnly()
    }
})