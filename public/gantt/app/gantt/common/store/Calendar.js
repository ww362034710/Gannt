Ext.define("Common.store.Calendar", {
    extend      : 'Gnt.data.Calendar',
    model: "Common.model.CalendarDay",
    daysPerMonth:30,
    daysPerWeek:7,
    hoursPerDay: 24,
    defaultAvailability:["00:00:00-24:00:00"],
    weekendsAreWorkdays:true,
    defaultAvailableAllocation:[0],
    getDefaultWeekAvailability:function(){
        var c = this.callParent(arguments);
        var d = this.weekendFirstDay;
        var a = this.weekendSecondDay;
        for (var i = 0; i < c.length; i++) {
            var b = c[i];
            if(this.weekendsAreWorkdays || b != d && b != a){
                b.set("availableAllocation",Ext.Array.clone(this.defaultAvailableAllocation));
            }else{
                b.set("availableAllocation",[]);
            }
        }
        return c;
    }
});
