// 原始数据 - 时间 - 时间间隔
(function(scope){
    var TimeInterval = (function(){
        return function(){
            this.dimension = null;
            this.value = null;
        };
    })();
    TimeInterval.fromObj = function(obj) {
        var bean = new TimeInterval();
        bean.dimension = obj.dimension;
        bean.value = obj.value;
        return bean;
    };

    scope.TimeInterval = TimeInterval;
})(window);