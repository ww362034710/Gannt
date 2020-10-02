// 原始数据 - 规格 - 模式
(function(scope){
    var SpecificationPattern = (function(){
        return function(){
            this.pattern = null;
        }
    })();
    SpecificationPattern.PATTERN = {0: '通道', 1: '采样' };
    SpecificationPattern.fromObj = function(obj){
        var bean = new SpecificationPattern();
        bean.pattern = obj.value;
        return bean;
    };

    window.SpecificationPattern = SpecificationPattern;
})(window);