StartTest(function (t) {
    var g = t.getGantt({
        lockedGridConfig    : {
            collapsed   : true
        },
        startDate   : new Date(2010, 1, 1),
        renderTo    : Ext.getBody()
    });
    
    var getById = function (id) { return g.taskStore.getById(id); };
    
    g.on('beforetaskdropfinalize', function (s, context) {
        Ext.Msg.confirm('Please confirm', 'Do you want to drop task?', function (btn) {
            context.finalize(btn === 'yes');
        });
                        
        // HACK
        // style x-dd-drag-proxy has setting z-index : 1000000 !important;
        // so we need to override it in order to window to be on top of drag proxy
        // implement this in your code to avoid drag proxy to cover window
        var window = Ext.WindowManager.getActive();
        window.el.setZIndex(1100000);
        
        return false;
    });
    
    var task    = getById(116),
        start   = task.getStartDate(),
        end     = task.getEndDate();
    
    t.it('Drag drop should happen in async mode', function (t) {
        t.chain(
            { drag : "ganttpanel => .x-grid-row:nth-child(5) > .sch-timetd .sch-gantt-task-bar", by : [50, -2] },

            { click : ">>[itemId=no]" },

            function (next) {
                t.is(task.getStartDate(), start, 'Start date is correct');
                t.is(task.getEndDate(), end, 'End date is correct');
                next();
            },

            { drag : "ganttpanel => " + Ext.grid.View.prototype.itemSelector + ":nth-child(5) .sch-gantt-task-bar", by : [g.timeAxisViewModel.getTickWidth(), -2] },
            { click : ">>[itemId=yes]" },

            function (next) {
                t.is(task.getStartDate(), new Date(2010, 1, 19), 'Start date is correct');
                t.is(task.getEndDate(), new Date(2010, 1, 26), 'End date is correct');
            }
        );
    });
});