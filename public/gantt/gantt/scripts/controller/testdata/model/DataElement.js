// 原始数据 - 数据 - 数据元
(function(){
    var DataElement = (function(){
        return function(){
            this.datas = [];
        };
    })();
    DataElement.fromObjMap = function(objMap) {
        var map = {};
        if (objMap) {
            $.each(objMap, function(key, obj) {
                map[key] = DataElement.fromObj(obj);
            });
        }
        return map;
    };
    DataElement.fromObj = function(obj) {
        var bean = new DataElement();
        bean.datas = obj.datas;
        bean.times = obj.times;
        return bean;
    };

    window.DataElement = DataElement;
})();