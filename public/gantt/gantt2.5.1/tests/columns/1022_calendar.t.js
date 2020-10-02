StartTest(function(t) {

    var employee_calendar = new Gnt.data.calendar.BusinessTime({
            calendarId  : 'employee',
            name        : 'Employee calendar'
        }),
        minion_calendar = new Gnt.data.Calendar({
            calendarId          : 'minion',
            name                : 'Minion calendar',
            weekendsAreWorkdays : true
        });

    function getGantt(col_config)
    {
        return t.getGantt({
            renderTo  : Ext.getBody(),
            plugins   : [{ptype : 'scheduler_treecellediting', clicksToEdit : 1}],
            columns   : [{
                xtype : 'namecolumn'
            }, Ext.apply({
                xtype : 'calendarcolumn',
                tdCls : 'calcolcell'
            }, col_config)],
            taskStore : new Gnt.data.TaskStore({
                root : {
                    children : [
                        { leaf : true, Name : 'Test task', StartDate : new Date(2010, 0, 4), Duration : 7, PercentDone : '50' }
                    ]
                },
                calendar : employee_calendar
            })
        });
    }

    var gantt;

    t.describe('A task column', function(t) {

        t.it('Should display task assigned calendar initially', function(t) {

            gantt = getGantt();

            t.chain(

                { waitFor : 'selector', args : '.calcolcell' },

                function(next) {
                    t.matchGridCellContent(gantt.lockedGrid, 0, 1, 'Employee calendar');
                    t.isDateEqual(
                        gantt.store.getRootNode().firstChild.get('EndDate'),
                        new Date(2010, 0, 12, 17),
                        'Being employee a person should finish the task by Jan 12th, 2010 17:00'
                    );
                }
            );
        });

        t.it('Should allow changing calendars', function(t) {

            t.chain(
                { click : '.calcolcell'},

                { waitFor : 'selectorAtCursor', args : 'input'},

                { type : 'Minion calendar[ENTER]'},

                function(next) {
                    t.matchGridCellContent(gantt.lockedGrid, 0, 1, 'Minion calendar');

                    t.isDateEqual(
                        gantt.store.getRootNode().firstChild.get('EndDate'),
                        new Date(2010, 0, 6, 8),
                        'To be an evil minion means working on 24 hours/day, so the task will be done way faster'
                    );
                }
            );
        });
    });
});
