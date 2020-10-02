StartTest(function(t) {
    t.it("should hide the tooltip even if the resize didn't update the task", function(t) {
        var g = t.getGantt2({
            startDate   : new Date(2010, 1, 1),
            height      : 200,
            cls         : 'one',
            renderTo    : Ext.getBody()
        });

        t.chain(
            {
                waitFor     : 'rowsVisible', args : g
            },
            {
                moveCursorTo : '.one .sch-resizable-handle-start'
            },
            {
                moveCursorTo : '.one .sch-resizable-handle-start',
                offset       : [-3, 6]
            },

            function(next) {

                t.it('should see the resize handle on top of bar elements', function(t) {
                    var el = Ext.getBody().down('.one .sch-resizable-handle-start');
                    var x = el.getX() - 1;
                    var y = el.getY() + 5;

                    t.moveByWithCallback([6, 0], function(e) {
                        var foundEl = t.elementFromPoint(e.getX(), e.getY());
                        var ok = Ext.fly(foundEl).hasCls('sch-gantt-terminal') || Ext.fly(foundEl).hasCls('sch-resizable-handle');

                        t.ok(ok, 'Should not see underlying bar elements');
                    }, next);
                });
            },

            {
                moveCursorTo : '.one .sch-resizable-handle-start'
            },

            {
                action : 'mouseDown'
            },
            { waitFor : 1000 },

            function(next) {
                t.selectorNotExists('.sch-tip', 'Should not see tooltip visible after long mousedown without move');
            }
        );
    });

    t.it("should not start a resize if right clicking resize handle", function(t) {
        var g = t.getGantt2({
            startDate   : new Date(2010, 1, 1),
            renderTo    : Ext.getBody(),
            height      : 200,
            cls         : 'two'
        });

        t.wontFire(g, 'beforetaskresize');

        t.chain(
            {
                waitFor     : 'rowsVisible', args : g
            },
            {
                moveCursorTo : '.two .sch-gantt-task-handle'
            },
            {
                action : 'rightClick'
            },

            { waitFor : 100 },

            {
                action : 'moveCursor',
                by     : [-20, 0]
            },

            function() {
            }
        );
    });
    
    t.it('Should show exact drop position', function (t) {
        var g = t.getGantt2({
            startDate   : new Date(2010, 1, 1),
            renderTo    : Ext.getBody(),
            height      : 200,
            taskStore   : t.getTaskStore({
                calendar    : new Gnt.data.Calendar({
                    name        : 'General',
                    calendarId  : 'General'
                })
            }),
            cls         : 'three',
            resizeConfig: { 
                showExactResizePosition : true
            }
        });
        
        var tickWidth = g.timeAxisViewModel.getTickWidth();
        
        t.chain(
            { moveCursorTo : '.three .sch-gantt-task-bar' },

            { mouseDown : '.three .sch-gantt-task-bar .sch-resizable-handle-start' },

            { moveMouseBy : [[10, 0]] },

            { action : 'mouseUp' },

            { moveMouseBy : [[10, 0]] },

            function (next) {
                var element = g.el.down('.sch-gantt-task-bar');

                t.is(Ext.get(element).getWidth(), 8 * tickWidth, 'Task hasn\'t resized');

                next();
            },

            { mouseDown : '.three .sch-gantt-task-bar .sch-resizable-handle-start' },

            { moveMouseBy : [[15, 0]] },

            { action : 'mouseUp' },

            { moveMouseBy : [[10, 0]] },

            function (next) {
                var element = g.el.down('.sch-gantt-task-bar');
                t.is(Ext.get(element).getWidth(), 7 * tickWidth, 'Task resized correctly');
                next();
            },

            { mouseDown : '.three .sch-gantt-task-bar .sch-resizable-handle-end' },

            { moveMouseBy : [[10, 0]] },

            { action : 'mouseUp' },

            { moveMouseBy : [[10, 0]] },

            function (next) {
                var element = g.el.down('.sch-gantt-task-bar');
                t.is(Ext.get(element).getWidth(), 7 * tickWidth, 'Task hasn\'t resized');
                next();
            },

            { mouseDown : '.three .sch-gantt-task-bar .sch-resizable-handle-end' },

            { moveMouseBy : [[15, 0]] },

            { action : 'mouseUp' },

            { moveMouseBy : [[10, 0]] },

            function (next) {
                var element = g.el.down('.sch-gantt-task-bar');
                t.is(Ext.get(element).getWidth(), 8 * tickWidth, 'Task resized correctly');
                next();
            },

            { mouseDown : '.three .sch-gantt-task-bar .sch-resizable-handle-end' },

            { moveMouseBy : [[4 * tickWidth, 0]] },

            { action : 'mouseUp' },

            { moveMouseBy : [[10, 0]] },

            function (next) {
                var element = g.el.down('.sch-gantt-task-bar');
                t.is(Ext.get(element).getWidth(), 12 * tickWidth, 'Task resized correctly');
                next();
            },

            { mouseDown : '.three .sch-gantt-task-bar .sch-resizable-handle-start' },

            { moveMouseBy : [[2 * tickWidth, 0]] },

            { action : 'mouseUp' },

            { moveMouseBy : [[10, 0]] },

            function (next) {
                var element = g.el.down('.sch-gantt-task-bar');
                t.is(Ext.get(element).getWidth(), 8 * tickWidth, 'Task resized correctly');
                next();
            }
        );
    });

    t.it('Should not start a resize if no mouse move happened', function(t) {
        // See issue #1449
        // https://www.assembla.com/spaces/bryntum/tickets/1449-task-resize-feature-doesn-t-fire--aftertaskresize--sometimes--despite-that--taskresizestart--was---- 
        var g = t.getGantt2({
            startDate   : new Date(2010, 1, 1),
            renderTo    : Ext.getBody(),
            height      : 200,
            cls         : 'four'
        });

        t.firesOk({
            observable : g,
            events : {
                beforetaskresize : 2,
                taskresizestart : 1,
                aftertaskresize : 1
            }
        });

        t.chain(
            { waitFor     : 'rowsVisible', args : g },
            { moveCursorTo : '.four .sch-gantt-task-handle'},
            { action : 'mouseDown'},
            { waitFor : 10 },
            { action : 'mouseUp'},
            { waitFor : 10 },
            { action : 'mouseDown'},
            { action : 'moveCursor', by : [-20, 0] },
            { action : 'mouseUp'} 
        );

    });

});
