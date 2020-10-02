StartTest(function (t) {

    var taskStore = new Gnt.data.TaskStore({
        proxy : 'memory',
        root  : {
            loaded   : true,
            expanded : true,
            children : [
                {
                    "StartDate"   : Ext.Date.parse("2010-01-17", 'Y-m-d'),
                    "EndDate"     : Ext.Date.parse("2010-01-19", 'Y-m-d'),
                    "Id"          : 11,
                    "leaf"        : true,
                },
                {
                    "StartDate"   : Ext.Date.parse("2010-01-17", 'Y-m-d'),
                    "EndDate"     : Ext.Date.parse("2010-01-19", 'Y-m-d'),
                    "Id"          : 21,
                    "leaf"        : true,
                },
                {
                    "StartDate"   : Ext.Date.parse("2010-01-17", 'Y-m-d'),
                    "EndDate"     : Ext.Date.parse("2010-01-19", 'Y-m-d'),
                    "Id"          : 22,
                    "leaf"        : false,
                    children      : []
                }
            ]
        }
    });

    var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
        data : [
            {
                From : 11,
                To   : 21,
                Type : 2
            }
        ]
    });

    var g = t.getGantt2({
        renderTo        : Ext.getBody(),
        startDate       : new Date(2010, 0, 4),
        endDate         : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 10),
        taskStore       : taskStore,
        dependencyStore : dependencyStore
    });


    function verifyTaskEventSignature() {
        return arguments &&
            arguments[0] instanceof Gnt.view.Gantt &&
            arguments[1] instanceof Gnt.model.Task && !!arguments[2].getTarget;
    }

    function verifyDependencyEventSignature() {
        return arguments &&
            arguments[0] instanceof Gnt.view.Dependency &&
            arguments[1] instanceof Gnt.model.Dependency && !!arguments[2].getTarget;
        arguments[2] instanceof HTMLElement;
    }

    g.on({
        taskclick             : verifyTaskEventSignature,
        taskdblclick          : verifyTaskEventSignature,
        taskcontextmenu       : verifyTaskEventSignature,
        dependencyclick       : verifyDependencyEventSignature,
        dependencycontextmenu : verifyDependencyEventSignature,
        dependencydblclick    : verifyDependencyEventSignature
    });

    t.it('task events (leaf)', function(t) {
        t.firesOk(g, {
            taskclick             : 3, // 2 extra from dblclick
            taskdblclick          : 1,
            taskcontextmenu       : 1
        });

        t.chain(
            // Click task element
            { click : '.sch-gantt-task' },

            { waitFor : 300 },

            { dblclick : '.sch-gantt-task' },

            { waitFor : 300 },

            { rightclick : '.sch-gantt-task' }
        );
    })

    t.it('task events (parent)', function(t) {
        t.firesOk(g, {
            taskclick             : 3, // 2 extra from dblclick
            taskdblclick          : 1,
            taskcontextmenu       : 1
        });

        t.chain(
            // Click task element
            { click : '.sch-gantt-parent-task' },

            { waitFor : 300 },

            { dblclick : '.sch-gantt-parent-task' },

            { waitFor : 300 },

            { rightclick : '.sch-gantt-parent-task' }
        );
    });

    t.it('dependency events', function(t) {
        t.firesOk(g, {
            dependencyclick       : 3, // 2 extra from dblclick
            dependencycontextmenu : 1,
            dependencydblclick    : 1
        });

        t.chain(
            // Click dependency element
            { click : '.sch-dependency-line-v' },

            { waitFor : 300 },

            { dblclick : '.sch-dependency-line-v' },

            { waitFor : 300 },

            { rightclick : '.sch-dependency-line-v' }
        )
    })
})
