// 原始数据 - 规格
(function(scope){
    var Specification = (function(){
        return function(){
            this.specificationPattern = null;
            this.channelList = [];
        }
    })();

    Specification.fromObj = function(obj) {
        var bean = new Specification();

        bean.pattern = obj.pattern;
        bean.channelList = Channel.fromObjList(obj.channelList);

        return bean;
    };

    window.Specification = Specification;
})(window);