// echart折线类型图的原型
!function(){
    var EchartLineManager = function () {
        EchartManager.call(this);
    };
    EchartLineManager.prototype = new EchartManager();
    window.EchartLineManager = EchartLineManager;
}();