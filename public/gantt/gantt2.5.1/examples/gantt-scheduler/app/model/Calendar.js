Ext.define('MyApp.model.Calendar', {
    extend: 'Gnt.model.Calendar',
    //CalendarClass:"",
    fields : [
        {name: "defaultAvailableAllocation"}
    ],
    getCalendarConfig:function(){
        var c = this.callParent(arguments);
        c.defaultAvailableAllocation=this.get("defaultAvailableAllocation");
        return c;
    }
})