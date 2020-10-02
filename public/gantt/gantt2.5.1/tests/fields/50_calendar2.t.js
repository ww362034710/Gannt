StartTest(function (t) {

    // #1426

    var rootCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId      : 'General',
        name            : 'General'
    });

    var holidaysCalendar    = new Gnt.data.calendar.BusinessTime({
        calendarId      : 'Holidays',
        name            : 'Holidays'
    });

    var nightShiftCalendar = new Gnt.data.calendar.BusinessTime({
        calendarId              : 'NightShift',
        name                    : 'Night shift',
        defaultAvailability     : [ '00:00-06:00', '22:00-24:00' ]
    });

    var calendarField   = new Gnt.field.Calendar();

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        taskStore   : t.getTaskStore({
            DATA    : [{
                Id          : 1,
                Name        : "1",
                StartDate   : "2010-01-18",
                Duration    : 16,
                expanded    : true,
                PercentDone : 50,
                CalendarId  : 'General',
                children    : [{
                    Id          : 2,
                    leaf        : true,
                    Name        : "2",
                    StartDate   : "2010-01-18",
                    Duration    : 16,
                    PercentDone : 50,
                    CalendarId  : 'NightShift'
                }]
            }]
        }),

        columns     : [{
            header      : 'Calendar',
            dataIndex   : 'CalendarId',
            width       : 100,
            renderer    : function(value, meta, record, col, index, store) {
                if (!value) {
                    meta.tdCls = 'gnt-default';
                    value = store.getCalendar().calendarId;
                }

                return calendarField.valueToVisible(value, record);
            },
            editor      : calendarField
        }],

        plugins         : {
            ptype           : 'scheduler_treecellediting',
            clicksToEdit    : 1
        }
    });

    t.chain(
        { waitForRowsVisible : g },

        { click : function () { return t.getCell(g.lockedGrid, 0, 0); }},

        { waitForCQVisible : 'calendarfield' },

        function (next) {
            t.is(calendarField.getValue(), 'General', 'Editor value is correct');
            next();
        },

        { click : "calendarfield => .x-form-trigger" },

        { click : function() { return calendarField.getPicker().el.down('.x-boundlist-item:nodeValue(Holidays)'); } },

        { click : "ganttpanel treepanel => .sch-locked-horizontal-scroll" },

        function (next) {
            t.is(g.taskStore.getById(1).getCalendarId(), 'Holidays', 'Value is correct');
        }
    );
});
