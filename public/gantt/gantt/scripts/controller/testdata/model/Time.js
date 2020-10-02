// 原始数据 - 时间
(function(scope){
    var Time = (function(){
        return function(){
            this.pattern = null;
            this.startTime = null;
            this.timeInterval = null;
        };
    })();
    Time.fromObj = function(obj) {
        var bean = new Time();
        bean.pattern = obj.pattern;
        bean.startTime = StartTime.fromObj(obj.startTime);
        bean.timeInterval = TimeInterval.fromObj(obj.timeInterval);
        return bean;
    };
    // TODO 不支持毫秒级以下的精度
    Time.UNITS = {};
    Time.UNITS.ms = 1;                              // 毫秒
    Time.UNITS.s = 1000 * Time.UNITS.ms;            // 秒
    Time.UNITS.m = 60 * Time.UNITS.s;               // 分
    Time.UNITS.h = 60 * Time.UNITS.m;               // 时
    Time.UNITS.D = 24 * Time.UNITS.h;               // 天
    Time.UNITS.M = 30 * Time.UNITS.D;               // 月
    Time.UNITS.Y = 365 * Time.UNITS.D;              // 年


    scope.Time = Time;
})(window);