Ext.ns('App');

Ext.Loader.setConfig({
    enabled        : true,
    disableCaching : true,
    paths          : {
        'Gnt'   : '../../js/Gnt',
        'Sch'   : '../../js/Sch',
        'MyApp' : './js'
    }
});

var supportedLocales    = {
    en      : ['En', 'English'],
    sv_SE   : ['SvSE', 'Swedish'],
    de      : ['De', 'German'],
    it      : ['It', 'Italian'],
    ru      : ['RuRU', 'Russian'],
    pl      : ['Pl', 'Polish'],
    nl      : ['Nl', 'Dutch']
};

// get requested locale from URL hash
var localeId    = window.location.hash.substr(1);
var localeClass = supportedLocales[localeId] && supportedLocales[localeId][0];

// by default let's use English locale
if (!localeClass) {
    localeClass = 'En';
    localeId    = 'en';
}

// now when we know the requested locale
// we will require Ext to load gantt localization class
Ext.require([
    'Gnt.locale.' + localeClass,
    'MyApp.DemoGanttPanel'
]);

// also we need to include corresponding ExtJS localization file
Ext.Loader.loadScript({
    url     : '../../ext-lang-zh_CN.js',
    onLoad  : function() {
        // after ExtJs locale is applied we invoke rendering
        // (when Ext will load all the required classes)
        Ext.onReady(function () {
            App.Gantt.init();

            Ext.QuickTips.init();
        });
    }
});


App.Gantt = {

    // Initialize application
    init : function () {
        this.gantt = this.createGantt();
	window.gantt = this.gantt;
        Ext.create("Ext.Viewport", {
            layout : 'fit',
            items  : this.gantt
        });
    },

    createGantt : function () {

        Ext.define('MyTaskModel', {
            extend   : 'Gnt.model.Task',

            // A field in the dataset that will be added as a CSS class to each rendered task element
            clsField : 'TaskType',
            fields   : [
                { name : 'TaskType', type : 'string' },
                { name : 'Color', type : 'string'}
            ]
        });

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            model       : 'MyTaskModel',
            calendar    : new Gnt.data.Calendar({
                name        : 'General',
                calendarId  : 'General'
            }),
            rootVisible : false,
            proxy       : 'memory',

            cascadeChanges     : true,
            recalculateParents : true,
            moveParentAsGroup  : true
        });

        var cm = new Gnt.data.CrudManager({
            autoLoad    : true,
            taskStore   : taskStore,
            transport   : {
                load    : {
                    method  : 'GET',
                    url     : 'data/data.js'
                },
                sync    : {
                    url     : 'TODO'
                }
            }
        });

        var g = Ext.create("MyApp.DemoGanttPanel", {
            allowParentTaskMove : true,
            crudManager         : cm,
            region              : 'center',
            rowHeight           : 26,
            selModel            : new Ext.selection.TreeModel({
                ignoreRightMouseSelection : false,
                mode                      : 'MULTI'
            }),
            taskStore           : taskStore,

//            uncomment to enable showing exact drop position for the task
//            dragDropConfig                : { showExactDropPosition : true },
//            resizeConfig                  : { showExactResizePosition : true },
//            snapRelativeToEventStartDate  : true,

            //snapToIncrement : true,    // Uncomment this line to get snapping behavior for resizing/dragging.
            columnLines         : false,
            rowLines            : false,

            startDate           : new Date(2010, 0, 11),
            endDate             : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20),

            localeId            : localeId,
            supportedLocales    : supportedLocales,

            viewPreset          : 'weekAndDayLetter'
        });

        g.on({
            dependencydblclick : function (ga, rec) {
                var from = taskStore.getNodeById(rec.get('From')).get('Name'),
                    to = taskStore.getNodeById(rec.get('To')).get('Name');

                Ext.Msg.alert('Hey', Ext.String.format('You clicked the link between "{0}" and "{1}"', from, to));
            },
            timeheaderdblclick : function (col, start, end) {
                Ext.Msg.alert('Hey', 'You click header cell : ' + Ext.Date.format(start, 'Y-m-d') + ' - ' + Ext.Date.format(end, 'Y-m-d'));
            }
        });

        return g;
    }
};

