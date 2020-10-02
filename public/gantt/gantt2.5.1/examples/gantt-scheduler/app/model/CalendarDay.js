Ext.define('MyApp.model.CalendarDay', {
    extend: 'Gnt.model.CalendarDay',
    fields : [
        {name: "availableAllocation", convert: function (b, a) {
            if (b) {
                return Ext.typeOf(b) === "string" ? [b] : b
            } else {
                return[]
            }
        }}
    ],
    parseInterval: function (b) {/*重写解析方法*/
        var a = /(\d\d):(\d\d):(\d\d)-(\d\d):(\d\d):(\d\d)/.exec(b);
        if(a){
            return {startTime: new Date(0, 0, 0, a[1], a[2], a[3]), endTime: new Date(0, 0, 0, a[4], a[5], a[6])}
        }else{
            return this.callParent(arguments);
        }
    },
    stringifyInterval:function (b) {/*重写字符串化方法*/
        if(b.startTime.getSeconds()>0 || b.endTime.getSeconds()>0){
            var c = b.startTime;
            var a = b.endTime;
            return this.prependZero(c.getHours()) + ":" + this.prependZero(c.getMinutes()) + ":" + this.prependZero(c.getSeconds()) + "-" + (a.getDate() == 1 ? 24 : this.prependZero(a.getHours())) + ":" + this.prependZero(a.getMinutes()) + ":" + this.prependZero(a.getSeconds());
        }else{
            return this.callParent(arguments);
        }
    },
    getAvailabilityIntervalsFor: function (d) {
        d = typeof d == "number" ? new Date(d) : d;
        var c = d.getFullYear();
        var e = d.getMonth();
        var b = d.getDate();
        var a = [];
        Ext.Array.each(this.getAvailability(), function (f) {
            var g = f.endTime.getDate();
            if(f.startTime.getSeconds()>0 || f.endTime.getSeconds()>0){
                a.push({startDate: new Date(c, e, b, f.startTime.getHours(), f.startTime.getMinutes(), f.startTime.getSeconds()), endDate: new Date(c, e, b + (g == 1 ? 1 : 0), f.endTime.getHours(), f.endTime.getMinutes(), f.endTime.getSeconds())})
            }else{
                a.push({startDate: new Date(c, e, b, f.startTime.getHours(), f.startTime.getMinutes()), endDate: new Date(c, e, b + (g == 1 ? 1 : 0), f.endTime.getHours(), f.endTime.getMinutes())})
            }
        });
        return a
    }
})