// 原始数据 - 规格 - 通道
(function(scope){
    var Channel = (function(){
        return function(){
            this.direction = null;  //方向
            this.abscissa = null;   // 横坐标??
            this.name = null;       // 名称
            this.type = null;       // 类型
            this.dimension = null;  // 量纲
            this.encoding = null;   // 编码
        }
    })();

    Channel.fromObjList = function(objList) {
        var channelList = [];

        $.each(objList, function(i, obj) {
            channelList.push(Channel.fromObj(obj));
        });

        return channelList;
    };

    Channel.fromObj = function(obj) {
        var bean = new Channel();
        console.log('channelObj', obj);
        bean.id=obj.id;
        bean.direction = obj.direction;
        bean.abscissa = obj.abscissa;
        bean.name = obj.name;
        bean.type = obj.type;
        bean.dimension = obj.dimension;
        bean.encoding = obj.encoding;
        return bean;
    };

    window.Channel = Channel;
})(window);