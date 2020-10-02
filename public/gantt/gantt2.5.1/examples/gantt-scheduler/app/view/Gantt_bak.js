Ext.define("MyApp.view.Gantt", {
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
        'MyApp.store.TaskStore',
        'MyApp.view.GanttToolbar',
        'MyApp.plugin.TaskContextMenu',
        'MyApp.widget.DependencyGrid',
        'MyApp.field.Dependency',
        'MyApp.field.Assignment',
        'MyApp.column.ResourceAssignment',
        'MyApp.widget.DependencyGrid',
        'MyApp.widget.taskeditor.TaskForm',
        'MyApp.plugin.TaskEditor',

        'Major.column.Assigned'
    ],

    flex                : 1,
    //title               : '甘特图',
    lockedGridConfig    : { width : 300,title:"任务列表1" },
    schedulerConfig:{title: '甘特图'},
    loadMask            : true,
//dragDropConfig:{useTooltip:false},

    // Gantt configs
    leftLabelField      : 'Name',
    highlightWeekends   : true,
    viewPreset          : 'weekAndDay',
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
                // new Gnt.column.WBS(),
                /*{
                    header:"ID",
                    dataIndex:"Id",
                    width:50
                },*/
                {
                    xtype:"assignedcolumn",
                    width:50
                },
                {
                    header      : '任务名称',
                    xtype       : 'namecolumn',
                    tdCls       : 'namecell',
                    width       : 230
                }
                // ,
                // {
                //     width       : 150,
                //     tdCls       : 'resourcecell',
                //     xtype       : 'myappresourceassignmentcolumn'
                // },
                // {
                //     xtype       : 'startdatecolumn'
                // },
                // {
                //     xtype       : 'durationcolumn'
                // },
                // {
                //     xtype: 'percentdonecolumn'
                // },
                // {
                //     xtype       : 'predecessorcolumn',
                //     editor : new MyApp.field.Dependency({})
                // },
                // {
                //     width: 80,
                //     dataIndex:"Person",
                //     header: '负责人',
                //     renderer:function(value,metaData,record ){
                //         var user = me.userStore.getById(value);
                //         if(user){
                //             return user.get("Name");
                //         }
                //     }
                //
                // },
                // {
                //     hearder:"颜色",
                //     dataIndex: 'color'
                // },
                // {
                //     xtype       : 'addnewcolumn'
                // }
            ],
            plugins : [
                new MyApp.plugin.TaskEditor({userStore:this.userStore}),
                new Sch.plugin.TreeCellEditing({}),
                new MyApp.plugin.TaskContextMenu({ })
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
