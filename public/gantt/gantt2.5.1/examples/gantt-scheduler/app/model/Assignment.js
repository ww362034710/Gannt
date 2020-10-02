Ext.define('MyApp.model.Assignment', {
	idProperty: "id",
    extend: 'Gnt.model.Assignment',
    fields : [
        {name: "Units"}
    ],getUnits: function () {

        if(!this.getResource().get("unitsType")=="3" && !this.getResource().get("unitsType")=="4"){
            return this.callParent(arguments);
        }
        return this.get(this.unitsField)
    }, setUnits: function (a) {
        /*if(!this.getResource().get("unitsType")=="3" && !this.getResource().get("unitsType")=="4"){
            return this.callParent(arguments);
        }*/
        this.set(this.unitsField, a)
    }, getEffort: function (b) {
        var a = this.getTask(), c = this.getResource(), d = 0;
        if (!c) {
            return 0
        }
        a.forEachAvailabilityIntervalWithResources({startDate: a.getStartDate(), endDate: a.getEndDate(), resources: [c]}, function (h, g, f) {
            var j;
            for (var e in f) {
                if(c.get("unitsType")=="3" || c.get("unitsType")=="4"){
                    j = f[e].units?100:0
                }else{
                    j = f[e].units
                }
            }
            d += (g - h) * j / 100
        });
        return a.getProjectCalendar().convertMSDurationToUnit(d, b || a.getEffortUnit())
    }/*,
    resourceIdField:"resourceId",
    taskIdField:"taskId",
    unitsField:"unitsVal"*/
})