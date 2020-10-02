// 服务器文件, 可能为sysFile  或者是Uuid 为主键
!function(){
    var store = {};

    var StorageFile = function(opts) {
        opts = opts || {};

        this.engineType = null; // sysFile还是uuid
        this.id = opts.hasOwnProperty('id')? opts.id: null;
        this.fileName = opts.hasOwnProperty('fileName')? opts.fileName: null;
        this.viewURL = opts.hasOwnProperty('viewURL')? opts.viewURL: null;
        this.downloadURL = opts.hasOwnProperty('downloadURL')? opts.downloadURL: null;
    };
    // 静态方法
    $.extend( true , StorageFile, {
        // 获得信息
        get : function(id) {
            var storageFile = store.hasOwnProperty(id)? store[id]: null;
            if (!storageFile && id ) {
                var engineType = '';
                if (isNaN(id)) {
                    engineType = "uuid";
                    $.ajax(ctx + '/file/getDocFileInfo', {
                        data: {uuid: id},
                        async: false,
                        success: function (rst) {
                            var obj = $.extend(rst.obj, {engineType: engineType});
                            storageFile = new StorageFile(obj);
                            storageFile.fileName = obj.originFileName;

                            store[id] = storageFile;
                            return storageFile;
                        }
                    });
                } else {
                    engineType = "SysFile";
                    $.ajax(ctx + '/sysFile/show', {
                        data: {id: id},
                        async: false,
                        success: function (rst) {
                            var obj = $.extend(rst.obj, {engineType: engineType});
                            storageFile = new StorageFile(obj);
                            store[id] = storageFile;
                            return storageFile;
                        }
                    });
                }
            }
            return storageFile;
        }
    });

    window.StorageFile = StorageFile;
}();