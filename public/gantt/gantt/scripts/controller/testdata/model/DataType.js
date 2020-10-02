// TODO 已经不使用了  只保留枚举
// 原始数据 - 规格 - 通道 - 数据类型
(function(scope){
    var DataType = (function(){
        return function() {
            this.value = null;
        }
    })();
    DataType.TYPE = {0: '数值', 1: '枚举', 2: '文本', 3: '图像', 4: '音频', 5: '视频' };
    DataType.fromObj = function(obj) {
        var bean = new DataType();
        bean.value = obj.value;
        return bean;
    };

    window.DataType = DataType;
})(window);
