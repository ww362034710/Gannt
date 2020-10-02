Ext.define('Common.model.Calendar', {
    extend: 'Gnt.model.Calendar',
    //CalendarClass:"",
    fields : [
        {name: "defaultAvailableAllocation"}
    ],
    getCalendarConfig:function(){
        var c = this.callParent(arguments);
        c.defaultAvailableAllocation=this.get("defaultAvailableAllocation");
        return c;
    },
    idProperty: "id",
    nameField: "name",
    daysPerMonthField: "daysPerMonth",
    daysPerWeekField: "daysPerWeek",
    hoursPerDayField: "hoursPerDay",
    weekendsAreWorkdaysField: "weekendsAreWorkdays",
    weekendFirstDayField: "weekendFirstDay",
    weekendSecondDayField: "weekendSecondDay",
    defaultAvailabilityField: "defaultAvailability",
    daysField: "days",
    calendarClassField: "calendarClass",
    phantomIdField: "phantomId",
    phantomParentIdField: "phantomParentId"
})