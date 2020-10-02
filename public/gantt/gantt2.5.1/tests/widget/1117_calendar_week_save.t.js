StartTest(function (t) {

    // #1460 - Calendar panel resets added week override on applyChanges call

    //http://www.sencha.com/forum/showthread.php?268333-4.2.1-IE-quot-Focus-quot-method-can-break-on-destroyed-grid-views&p=982906#post982906
    Ext.Component.override({
        onDestroy : function () {
            if (this.focusTask) this.focusTask.cancel();

            this.callParent(arguments);
        }
    });

    var calendarWidget, calendar, weekGrid, weekStore;

    var generateDataSet = function (activeTab) {

        calendar = new Gnt.data.calendar.BusinessTime({
            name            : 'Calendar',
            data            : [
                {
                    Id                  : 13,
                    Type                : 'WEEKDAYOVERRIDE',
                    OverrideStartDate   : '2012-02-25',
                    OverrideEndDate     : '2012-02-28',
                    Weekday             : -1,
                    Name                : 'Non standard feb week'
                },
                {
                    Id                  : 14,
                    Type                : 'WEEKDAYOVERRIDE',
                    OverrideStartDate   : '2012-02-25',
                    OverrideEndDate     : '2012-02-28',
                    Weekday             : 0,
                    Name                : 'Non standard feb week'
                },
                {
                    Id                  : 15,
                    Type                : 'WEEKDAYOVERRIDE',
                    OverrideStartDate   : '2012-02-25',
                    OverrideEndDate     : '2012-02-28',
                    Weekday             : 1,
                    Name                : 'Non standard feb week',
                    Availability        : [ '08:00-12:00' ]
                },
                {
                    Id                  : 16,
                    Type                : 'WEEKDAYOVERRIDE',
                    OverrideStartDate   : '2012-02-25',
                    OverrideEndDate     : '2012-02-28',
                    Weekday             : 2,
                    Name                : 'Non standard feb week',
                    Availability        : [ '13:00-15:00' ]
                }
            ]
        });

        if (calendarWidget) calendarWidget.destroy();

        calendarWidget = new Gnt.widget.calendar.Calendar({
            calendar    : calendar,
            height      : 550,
            width       : 600,
            renderTo    : Ext.getBody()
        });

        weekGrid        = calendarWidget.getWeekGrid();
        weekStore       = weekGrid.getStore();

        if (activeTab != null) weekGrid.ownerCt.getLayout().setActiveItem(activeTab);
    };

    t.it('Added week override should stay in grid after applyChanges call', function (t) {
        generateDataSet(1);

        t.chain(
            // test adding empty week override
            { click : function () { return weekGrid.el.down('.gnt-action-add'); } },

            function (next) {
                t.is(weekStore.getCount(), 2, 'Week override successfully added.');

                calendarWidget.applyChanges();

                t.is(weekStore.getCount(), 2, 'Week override stayed in the grid after applyChanges call.');
            }
        );
    });
});
