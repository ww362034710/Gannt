// 原始数据 - 时间 - 模式
(function(scope){
    var TimePattern = (function(){
        return function(){
            this.value = null;
        };
    })();
    TimePattern.TYPE = {0: '绝对时间', 1:'相对时间'};
    TimePattern.fromObj = function(obj) {
        var bean = new TimePattern();
        bean.value = obj.value;
        return bean;
    };

    scope.TimePattern = TimePattern;
})(window);