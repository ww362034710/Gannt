StartTest({overrideSetTimeout : false}, function (t) {
    t.diag('Setup: Clearing all components');

    Ext.ComponentQuery.query('*').forEach(function(c) {
        c.destroy();
    })

    function assertNoComponents(t, message) {
        var nbrComponents = Ext.ComponentQuery.query('*').length;

        // TODO remove this wrapper when this is fixed: http://www.sencha.com/forum/showthread.php?265975-Locked-grid-leaks-its-header-columns-editors-etc&p=974451#post974451
        t.knownBugIn('4.2.2.1144', function(t) {
            t.is(nbrComponents, 0, message);
        });

        if (nbrComponents > 0) {
            t.cq('*').forEach(function(c) {
                // for some reason `window.console && console()` fails in IE9 - very weird
                if (typeof console != 'undefined') console.log(c.xtype)
            })
        }
    }

    assertNoComponents(t, 'No components found initially');

    var resourceStore = t.getResourceStore(),
        assignmentStore = t.getAssignmentStore({resourceStore : resourceStore}),
        taskStore = t.getTaskStore();

    var getGantt = function () {
        return t.getGantt({
            height                   : 350,
            width                    : 1000,
            highlightWeekends        : false,
            showTodayLine            : true,
            enableBaseline           : true,
            baselineVisible          : true,
            loadMask                 : true,
            enableDependencyDragDrop : false,
            snapToIncrement          : true,
            renderTo                 : Ext.getBody(),

            taskStore       : taskStore,
            resourceStore   : resourceStore,
            assignmentStore : assignmentStore,

            calendar : t.getCalendar(),
            plugins  : t.getAllPlugins().concat([
                Ext.create("Sch.plugin.Pan"),
                Ext.create('Sch.plugin.TreeCellEditing')
            ]),
            columns  : t.getAllColumns()
        });
    };

    t.it('No dangling components found after simple create/destroy', function(t) {
        getGantt().destroy();

        assertNoComponents(t, 'No components found after simple create/destroy');
    })

    t.it('No dangling components found after simple create/render/destroy', function(t) {

        var g = getGantt();

        t.pass("Rendering completed");

        g.destroy();

        assertNoComponents(t, 'No components found after simple create/render/destroy');

        t.pass("Simple destroy completed, without rendering");
    })

    t.it('Test Gantt inside Ext.Panel', function(t) {
        var p = Ext.create('Ext.panel.Panel', {
            height   : 350,
            width    : 1000,
            renderTo : Ext.getBody(),
            layout   : 'fit',
            items    : getGantt()
        });

        p.removeAll(true);
        p.add({ html : "Something else" });
        t.pass("Gantt removed and replaced by different component")

        p.removeAll(true);
        p.add(getGantt());
        t.pass("Gantt added back to the panel");

        p.destroy();
    });


    t.it('Should not crash when destroying task editor', function(t) {
        var ed = new Gnt.plugin.TaskEditor();
        var p = t.getGantt({
            renderTo    : document.body,
            plugins     : [ed]
        });

        ed.destroy();
    })
})
