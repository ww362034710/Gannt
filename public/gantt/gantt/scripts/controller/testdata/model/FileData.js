// 原始数据 - 数据 - 文件数据
(function(){
    var FileData = (function(){
        return function(){
            this.filename = null;
            this.fileByte = null;
        };
    })();
    FileData.fromObjMap = function(objMap) {
        var map = {};
        if (objMap) {
            $.each(objMap, function(key, obj) {
                map[key] = FileData.fromObj(obj);
            });
        }
        return map;
    };
    FileData.fromObj = function(obj) {
        var bean = new FileData();
        bean.filename = obj.filename;
        bean.fileByte = obj.fileByte;
        return bean;
    };

    window.FileData = FileData;
})();