StartTest(function (t) {
    var g = t.getGantt({
        lockedGridConfig    : {
            collapsed   : true
        },
        startDate   : new Date(2010, 1, 1),
        renderTo    : Ext.getBody()
    });
    
    var getById = function (id) { return g.taskStore.getById(id); };
    
    g.on('beforetaskresizefinalize', function (s, context) {
        Ext.Msg.confirm('Please confirm', 'Do you want to resize task?', function (btn) {
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
    
    var task    = getById(117),
        start   = task.getStartDate(),
        end     = task.getEndDate();
    
    t.it('Resize should happen in async mode', function (t) {
        t.chain(
            { waitForEventsToRender : g },
            { action : "drag", target : "gridpanel => .x-grid-row:nth-child(2) > .sch-timetd .sch-resizable-handle-end", offset : [1, 10], by : [34, 0] },
            { action : "click", target : "[itemId=no] => .x-btn-button" },
            function (next) {
                t.is(task.getEndDate(), end, 'End date is correct');
                t.is(task.getStartDate(), start, 'Start date is correct');
                next();
            },
            { action : "drag", target : "gridpanel => .x-grid-row:nth-child(2) > .sch-timetd .sch-resizable-handle-end", offset : [1, 9], by : [-52, 0] },
            { action : "click", target : "[itemId=yes] => .x-btn-button" },
            function (next) {
                t.is(task.getEndDate(), new Date(2010, 1, 9), 'End date is correct');
                t.is(task.getStartDate(), start, 'Start date is correct');
                next();
            }
        );
    });
});