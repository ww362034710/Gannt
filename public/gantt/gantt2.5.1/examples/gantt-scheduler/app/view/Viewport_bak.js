Ext.define("MyApp.view.Viewport", {
    // extend                  : 'Ext.Viewport',
    extend                  : 'Ext.panel.Panel',
    layout                  : 'border',
    region   : 'center',
    requires                : [
        'MyApp.view.ResourceSchedule',
        'MyApp.view.Gantt',
        'MyApp.view.ResourceList',
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
        window.cm          = new Gnt.data.CrudManager({
            autoLoad    : true,
            taskStore   : this.taskStore,
            autoSync:false,
            transport   : {
                load    : {
                    // url     : '/html/gantt/data/ganttdata2.json'
                    url     : '/html/gantt2.5.1/examples/gantt-scheduler/data.json',
                    method: 'get'
                },
                sync    : {
                    url     : '/'
                }
            }
        });
        cm.addStore(this.userStore,0);
        window.gantt = this.gantt          = new MyApp.view.Gantt({
            id              : 'ganttchart',
            crudManager     : cm,
            height: 500,
            startDate       : new Date(2010, 0, 11),
            userStore:this.userStore,
            autoFitOnLoad : false,
            cascadeChanges: true,
            progressBarResizeConfig:{
                // increment:3600*24
                increment:3600
            }
        });
        // getScheduler();
        // this.scheduler.setVisible(true);
        getHistogram();
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
