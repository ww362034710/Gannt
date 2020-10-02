//TODO 已经不使用了
// 原始数据 - 规格 - 通道 - 方向
(function(scope){
    var ChannelDirection = (function(){
        return function(){
            this.value = null;  //方向   0: 输入   1: 输出
        }
    })();
    ChannelDirection.TYPE = {0: '输入', 1: '输出' };
    ChannelDirection.fromObj = function(obj) {
        var bean = new ChannelDirection();
        bean.value = obj.value;
        return bean;
    };

    window.ChannelDirection = ChannelDirection;
})(window);
