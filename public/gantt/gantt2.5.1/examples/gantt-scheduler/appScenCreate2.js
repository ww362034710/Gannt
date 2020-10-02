/**
 * 月事件任务规划 / 场景创建第二步
 * 带资源冲突检测
 */
Ext.ns('App');
Ext.Loader.setConfig({
    enabled: true,
    disableCaching : false,
    paths   : {
        'Major'   :ctx +  '/html/gantt2.5.1/examples/gantt-scheduler/app',
        'Sch.locale'   :ctx +  '/html/gantt2.5.1/js/Sch/locale',
        'Gnt.locale'   :ctx +  '/html/gantt2.5.1/js/Gnt/locale'
    }
});
Ext.Loader.setPath('MyApp', '/html/gantt2.5.1/examples/gantt-scheduler/app');

// 根据设置 设置甘特图第一列是checkbox还是部门图例
var ganttColumns = [];
if (ganttConfig.grid && ganttConfig.grid.firstColumnType === "checkbox") {
    ganttColumns.push({
        text : ' ',
        xtype : 'checkcolumn',
        tdCls : 'assignedcell',
        dataIndex: 'draggable',
        width : 50,
        listeners: {
            checkchange: function (checkcolumn, rowIndex, checked, record, eOpts) {
                // 增加资源与约束
                appendResource();
                appendConstraints();
            }
        }
    });
} else {
    ganttColumns.push({
        // xtype:"assignedcolumn",
        xtype:"resourcetypecolumn",
        dataIndex: 'deptId',
        width:50
    });
}

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

        'Major.column.Assigned',
        'Major.column.ResourceType',
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
            columns : ganttColumns.concat([
                {
                    header      : ganttConfig.gridNameTitle,
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
            ]),
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


Ext.define("MyApp.view.Viewport", {
    // extend                  : 'Ext.Viewport',
    extend                  : 'Ext.panel.Panel',
    layout                  : 'border',
    region   : 'center',
    requires                : [
        'MyApp.view.ResourceSchedule',
        // 'MyApp.view.Gantt',
        'MyApp.view.ResourceList',
        'MyApp.data.CrudManager',
        'MyApp.panel.ResourceHistogram',
        'MyApp.view.MyResourceHistogram',
        'MyApp.view.ResourceHistogram',
        'MyApp.store.UserStore',
        'MyApp.store.Calendar',
        'MyApp.model.Resource',
        'MyApp.model.Calendar',
        'MyApp.model.Assignment',
        'MyApp.column.Scale'
    ],

    initComponent : function() {
        var me = this;
        Sch.preset.Manager.registerPreset("msAndsecond",{
            timeColumnWidth: 30,
            rowHeight: 24,
            resourceColumnWidth: 100,
            displayDateFormat: "G:i:s:u",
            shiftIncrement: 50,
            shiftUnit: "MILLI",
            defaultSpan: 1,
            timeResolution: {unit: "MILLI", increment: 1},
            headerConfig: {
                middle: {unit: "MILLI", increment: 10, align: "center", dateFormat: "u"},
                top: {unit: "SECOND", align: "center", dateFormat: "D, d g:i:sA"}
            }
        })

        this.taskStore  = new MyApp.store.TaskStore({
            calendarManager : new Gnt.data.CalendarManager({ calendarClass : 'MyApp.store.Calendar',model: "MyApp.model.Calendar" }),
            /*calendar    : new MyApp.store.Calendar({
            name        : 'gantt',
            calendarId  : 'gantt',
            daysPerMonth:30,
            daysPerWeek:7,
            defaultAvailability:["00:00-24:00"],
            weekendsAreWorkdays:true,
            defaultAvailableAllocation:[100]
        }),*/
            assignmentStore:Ext.create("Gnt.data.AssignmentStore",{model:"MyApp.model.Assignment"}),
            resourceStore:new Gnt.data.ResourceStore({model: "MyApp.model.Resource",   groupField : 'Type'})
        });
        this.userStore = new  MyApp.store.UserStore({});
        window.cm          = new MyApp.data.CrudManager({
            autoLoad    : true,
            taskStore   : this.taskStore,
            autoSync:false,
            transport   : {
                load    : {
                    // url     : '/html/gantt/data/ganttdata2.json'
                    url     : '/html/gantt2.5.1/examples/gantt-scheduler/data_'+ganttConfig.taskType+'.json',
                    method: 'get'
                },
                sync    : {
                    url     : '/'
                }
            },
            listeners: {
                'beforeloadapply': function(w, data) {
                    window.ganttData = $.extend(true, {}, data);
                }
            }
        });
        cm.addStore(this.userStore,0);
        window.gantt = this.gantt          = new MyApp.view.Gantt({
            id              : 'ganttchart',
            crudManager     : cm,
            height: 500,
            // startDate       : new Date(2020, 0, 2),
            // startDate       : new Date(2019, 10, 11),
            userStore:this.userStore,
            autoFitOnLoad : false,
            cascadeChanges: true,
            progressBarResizeConfig:{
                // increment:3600*24
                increment:3600
            }
        });
        if (ganttConfig.showHistogram) {
            getHistogram();
        }
        Ext.apply(this, {
            width:"100%",
            height:"100%",
            items : [
                // {
                //     xtype : 'navigation',
                //     id    : 'navigation'
                // },
                {
                    xtype   : 'container',
                    itemId  : 'maincontainer',
                    region  : 'center',
                    layout  : { type : 'vbox', align : 'stretch' },
                    items   : [this.gantt, this.histogram]
                }/*,
                {
                    xtype   : 'container',
                    itemId  : 'maincontainer2',
                    region  : 'south',
                    height: 500,
                    layout  : { type : 'vbox', align : 'stretch' },
                    items   : this.scheduler
                }*//*,
                {
                    xtype : 'settings'
                }*/
            ]
        });

        this.callParent(arguments);


        function getScheduler() {
            var gantt = me.gantt;

            me.scheduler = new MyApp.view.ResourceSchedule({
                resourceStore   : gantt.taskStore.resourceStore,
                eventStore      : gantt.taskStore,
                assignmentStore : gantt.assignmentStore,

                partnerTimelinePanel   : gantt,

                // Share non-working time visualization
                workingTimeStore : gantt.getWorkingTimePlugin().store/*,

                features      : [
                    {
                        id                 : 'group1',
                        ftype              : 'scheduler_grouping',
                        groupHeaderTpl     : '{name}',
                        hideGroupedHeader  : true,
                        enableGroupingMenu : false
                    }
                ]*/

            });

            // this.getMainContainer().add(this.scheduler);

            var ganttViewEl = gantt.getSchedulingView().el;
            var schedulerViewEl = me.scheduler.getSchedulingView().el;

            // Sync the scrolling
            // schedulerViewEl.on('scroll', function(ev, el) { ganttViewEl.scrollTo('left', el.scrollLeft); });
            // ganttViewEl.on('scroll', function(ev, el) { schedulerViewEl.scrollTo('left', el.scrollLeft); });
            //
            // gantt.on('zoomchange', function() {
            //     this.scheduler.normalGrid.scrollTask.cancel();
            //
            //     this.scheduler.zonesPlugin.setDisabled(Sch.util.Date.compareUnits(this.scheduler.timeAxis.unit, Sch.util.Date.WEEK) > 0);
            // }, this);
        }

        function getHistogram() {
            var gantt = me.gantt;

            me.histogram = new MyApp.view.MyResourceHistogram({
                calendar: gantt.taskStore.calendar,
                partnerTimelinePanel    : gantt,
                resourceStore           : gantt.resourceStore,
                taskStore               : gantt.taskStore,
                assignmentStore         : gantt.assignmentStore/*,
                features      : [
                    {
                        id                 : 'group',
                        ftype              : 'scheduler_grouping',
                        groupHeaderTpl     : '{name}',
                        hideGroupedHeader  : true,
                        enableGroupingMenu : false
                    }
                ]*/
            });
            me.histogram.setVisible(true);
        }
    }
});

// Ext.require(['MyApp.view.Viewport']);
// Ext.require('Sch.locale.Zh');
Ext.require('Gnt.locale.Zh');

if (ganttConfig.autoInit!==false) {
    initGantt();
}

function initGantt() {
    Ext.application({
        name: 'MyApp',
        appFolder: ctx + "/html/gantt2.5.1/examples/gantt-scheduler/app",
        // autoCreateViewport : true,
        controllers: [
            'Navigation',
            'Settings'
        ],
        launch: function () {
            if (Ext.isIE && Ext.ieVersion < 9) {
                Ext.Msg.alert('Outdated browser detected', 'This sample only works in modern browsers (IE9+)');
                return;
            }
            var viewport = new MyApp.view.Viewport();
            // // viewport created here to enable usage in kitchensink (has its own viewport)
            var containerName = Ext.getElementById('gantt') && "gantt" || "ganttContainer";
            var panel = Ext.create('Ext.panel.Panel', {
                layout: 'border',
                renderTo: containerName,
                // renderTo: Ext.getBody(),
                width: "100%",
                height: "100%",
                items: [viewport]
            });

        }
    });
}