Ext.define("Common.view.Viewport", {
    extend                  : 'Ext.Viewport',
    layout                  : 'border',
    requires                : [
        'Common.view.ResourceSchedule',
        'Common.view.Gantt',
        'Common.view.ResourceList',
        'Common.panel.ResourceHistogram',
        'Common.view.MyResourceHistogram',
        'Common.view.ResourceHistogram',
        'Common.store.UserStore',
        'Common.store.Calendar',
        'Common.model.Resource',
        'Common.model.Calendar',
        'Common.model.Assignment',
        'Common.column.Scale'
    ],

    initComponent : function() {
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
           calendarManager : new Gnt.data.CalendarManager({ calendarClass : 'Common.store.Calendar',model: "Demo.model.Calendar" }),
            weekendsAreWorkdays:true,
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
        window.cm          = new Gnt.data.CrudManager({
            autoLoad    : true,
            taskStore   : this.taskStore,
            autoSync:false,
            transport   : {
                load    : {
                    url     : '/demo/data'
                },
                sync    : {
                    url     : '/'
                }
            }
        });
        cm.addStore(this.userStore,0);
        window.gantt = this.gantt          = new Common.view.Gantt({
            id              : 'ganttchart',
            crudManager     : cm,
            startDate       : new Date(2010, 0, 11),
            userStore:this.userStore,
            autoFitOnLoad :true,
            cascadeChanges: true,
            progressBarResizeConfig:{
                increment:3600*24
            }
        });
        Ext.apply(this, {
            items : [
                {
                    xtype : 'navigation',
                    id    : 'navigation'
                },
                {
                    xtype   : 'container',
                    itemId  : 'maincontainer',
                    region  : 'center',
                    layout  : { type : 'vbox', align : 'stretch' },
                    items   : this.gantt
                }/*,
                {
                    xtype : 'settings'
                }*/
            ]
        });

        this.callParent(arguments);
    }
});