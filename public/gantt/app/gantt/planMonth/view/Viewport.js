Ext.define("PlanMonth.view.Viewport", {
    extend                  : 'Ext.panel.Panel',
    layout                  : 'border',
    region   : 'center',
    requires                : [
        'Common.view.ResourceSchedule',
        // 'MyApp.view.Gantt',
        'Common.view.ResourceList',
        'Common.data.CrudManager',
        'Common.panel.ResourceHistogram',
        'Common.view.MyResourceHistogram',
        'Common.view.ResourceHistogram',
        'Common.store.Calendar',
        'Common.store.UserStore',
        'Common.store.TaskStore',
        'Common.model.Resource',
        'Common.model.Calendar',
        'Common.model.Assignment',
        'Common.column.Scale',

        'PlanMonth.view.Gantt'
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

        this.taskStore  = new Common.store.TaskStore({
            calendarManager : new Gnt.data.CalendarManager({ calendarClass : 'Common.store.Calendar',model: "Common.model.Calendar" }),
            /*calendar    : new MyApp.store.Calendar({
            name        : 'gantt',
            calendarId  : 'gantt',
            daysPerMonth:30,
            daysPerWeek:7,
            defaultAvailability:["00:00-24:00"],
            weekendsAreWorkdays:true,
            defaultAvailableAllocation:[100]
        }),*/
            assignmentStore:Ext.create("Gnt.data.AssignmentStore",{model:"Common.model.Assignment"}),
            resourceStore:new Gnt.data.ResourceStore({model: "Common.model.Resource",   groupField : 'Type'})
        });
        this.userStore = new  Common.store.UserStore({});
        window.cm          = new Common.data.CrudManager({
            autoLoad    : true,
            taskStore   : this.taskStore,
            autoSync:false,
            transport   : {
                load    : {
                    // url     : '/html/gantt2.5.1/examples/gantt-scheduler/data_fly_low.json',
                    // url     : '/html/gantt2.5.1/examples/gantt-scheduler/data_task_low.json',
                    //TODO 这里加载真实数据
                    url     : '/html/app/gantt/planMonth/data_'+ganttConfig.taskType+'.json',
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
        window.gantt = this.gantt          = new PlanMonth.view.Gantt({
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

            me.scheduler = new Common.view.ResourceSchedule({
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

            me.histogram = new Common.view.MyResourceHistogram({
                calendar: gantt.taskStore.calendar,
                partnerTimelinePanel    : gantt,
                resourceStore           : gantt.resourceStore,
                taskStore               : gantt.taskStore,
                assignmentStore         : gantt.assignmentStore
            });
            me.histogram.setVisible(true);
        }
    }
});