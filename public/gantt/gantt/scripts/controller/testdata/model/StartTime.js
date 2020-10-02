// 原始数据 - 时间 - 开始时间
(function(){
    var StartTime = (function(){
        return function(){
            this.dimension = null;
            this.value = null;
        };
    })();
    StartTime.fromObj = function(obj) {
        var bean = new StartTime();
        bean.dimension = obj.dimension;
        bean.value = obj.value;
        return bean;
    };

    window.StartTime = StartTime;
})();