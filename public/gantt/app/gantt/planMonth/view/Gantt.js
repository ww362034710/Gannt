Ext.define("PlanMonth.view.Gantt", {
    extend              : 'Gnt.panel.Gantt',
    alias               : 'widget.gantt',
    zoomLevels: [
        {width: 40, increment: 1, resolution: 1, preset: "manyYears", resolutionUnit: "YEAR"},
        {width: 80, increment: 1, resolution: 1, preset: "manyYears", resolutionUnit: "YEAR"},
        {width: 30, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
        {width: 50, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
        {width: 100, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
        {width: 200, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
        {width: 100, increment: 1, resolution: 7, preset: "monthAndYear", resolutionUnit: "DAY"},
        {width: 30, increment: 1, resolution: 1, preset: "weekDateAndMonth", resolutionUnit: "DAY"},
        {width: 35, increment: 1, resolution: 1, preset: "weekAndMonth", resolutionUnit: "DAY"},
        {width: 50, increment: 1, resolution: 1, preset: "weekAndMonth", resolutionUnit: "DAY"},
        {width: 20, increment: 1, resolution: 1, preset: "weekAndDayLetter"},
        {width: 50, increment: 1, resolution: 1, preset: "weekAndDay", resolutionUnit: "HOUR"},
        {width: 100, increment: 1, resolution: 1, preset: "weekAndDay", resolutionUnit: "HOUR"},
        {width: 50, increment: 6, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
        {width: 100, increment: 6, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
        {width: 60, increment: 2, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
        {width: 60, increment: 1, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
        {width: 30, increment: 15, resolution: 5, preset: "minuteAndHour"},
        {width: 60, increment: 15, resolution: 5, preset: "minuteAndHour"},
        {width: 130, increment: 15, resolution: 5, preset: "minuteAndHour"},
        {width: 60, increment: 5, resolution: 5, preset: "minuteAndHour"},
        {width: 100, increment: 5, resolution: 5, preset: "minuteAndHour"},
        {width: 50, increment: 2, resolution: 1, preset: "minuteAndHour"},
        {width: 30, increment: 10, resolution: 5, preset: "secondAndMinute"},
        {width: 60, increment: 10, resolution: 5, preset: "secondAndMinute"},
        {width: 130, increment: 5, resolution: 5, preset: "secondAndMinute"},
        {width: 50, increment: 1, resolution: 1, preset: "secondAndMinute"},
        {width: 100, increment: 100,resolution: 1, preset: "msAndsecond"}
    ],

    // Ext JS configs
    requires            : [
        'Common.store.TaskStore',
        'Common.view.GanttToolbar',
        'Common.plugin.TaskContextMenu',
        'Common.widget.DependencyGrid',
        'Common.field.Dependency',
        'Common.field.Assignment',
        'Common.column.ResourceAssignment',
        'Common.widget.DependencyGrid',
        'Common.widget.taskeditor.TaskForm',
        'Common.plugin.TaskEditor',
        'Common.column.ResourceType',
        'Common.controller.Navigation',
        'Common.controller.Settings'
    ],

    flex                : 1,
    //title               : '甘特图',
    lockedGridConfig    : { width : 300,title: ganttConfig.title },
    schedulerConfig:{title: '甘特图'},
    loadMask            : true,
//dragDropConfig:{useTooltip:false},

    // Gantt configs
    leftLabelField      : 'Name',
    highlightWeekends   : true,
    // viewPreset          : 'monthAndYear',
    columnLines         : true,
    cascadeChanges      : true,
    //自定义样式展示
    eventRenderer: function (taskRecord) {
        return {
            ctcls  : "",//整行上添加class
            cls:"",//在task bar 添加样式
            progressBarStyle:""//在progress bar 上添加style
        };
    },
    initComponent : function() {
        var me = this;

        Ext.apply(this, {
            tipCfg : { cls : 'tasktip' },

            // Define an HTML template for the tooltip
            /*tooltipTpl : new Ext.XTemplate(
                '<table>',
                    '<tr><th class="caption" colspan="2">#{Id} {Name}</th></tr>',
                    '<tr>',
                        '<th>Start:</th><td>{[values._record.getDisplayStartDate("y-m-d")]}</td>',
                    '</tr>',
                    '<tr>',
                        '<th>End:</th><td>{[values._record.getDisplayEndDate("y-m-d")]}</td>',
                    '</tr>',
                    '<tr>',
                        '<th>Progress:</th><td>{[Math.round(values.PercentDone)]}%</td>',
                    '</tr>',
                '</table>'
            ),*/

            // tooltipTpl: new Ext.XTemplate(
            //      '<h4 class="tipHeader">{Name}</h4>',
            //      '<table class="taskTip">',
            //      '<tr><td>开始:</td> <td align="right">{[Ext.Date.format(values.StartDate, "y-m-d g:i:s")]}</td></tr>',
            //      '<tr><td>结束:</td> <td align="right">{[Ext.Date.format(Ext.Date.add(values.EndDate, Ext.Date.MILLI, -1), "y-m-d g:i:s")]}</td></tr>',
            //      '<tr><td>进度:</td><td align="right">{PercentDone}%</td></tr>',
            //      '</table>'
            //  ).compile(),

            // tbar : {
            //     xtype : 'gantttoolbar',
            //     gantt : this
            // },

            viewConfig : {
                getRowClass : function(record) {
                    // Output a custom CSS class with some task property that we can use for styling
                    return 'TASKID_' + record.data.Id;
                }
            },

            // Setup your static columns
            columns : [
                {
                    xtype:"resourcetypecolumn",
                    dataIndex: 'deptId',
                    width:50
                }, {
                    header      : ganttConfig.gridNameTitle,
                    xtype       : 'namecolumn',
                    tdCls       : 'namecell',
                    width       : 230
                }
            ],
            plugins : [
                new Common.plugin.TaskEditor({userStore:this.userStore}),
                new Sch.plugin.TreeCellEditing({}),
                new Common.plugin.TaskContextMenu({ })
            ],
            eventRenderer : function (task) {
                if (task.get('Color')) {
                    var style = Ext.String.format('background-color: #{0};border-color:#{0}', task.get('Color'));
                    return {
                        style : style
                    };
                }
            }
        });
        this.callParent(arguments);
    }
});