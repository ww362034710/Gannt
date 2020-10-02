// 原始数据 - 数据
(function(){
    var Data = (function(){
        return function() {
            this.dataElementMap = {};
            this.fileDataMap = {};
        };
    })();
    Data.fromObj = function(obj) {
        var bean = new Data();
        console.log('dataElementMap',obj.dataElementMap);
        bean.dataElementMap = DataElement.fromObjMap(obj.dataElementMap);
        bean.fileDataMap = FileData.fromObjMap(obj.fileDataMap);
        return bean;
    };

    window.Data = Data;
})();