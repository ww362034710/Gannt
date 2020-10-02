!function(){
    var ConfigBucket = function(){
        this.title = null;
        this.subTitle = null;
        this.showLegend = null;
    };
    $.extend(true, ConfigBucket.prototype, {
        refresh: function() {
            this.title = viewControl.$paramCon.find('#titleId').textbox('getValue') || this.genTitle();
            this.subTitle = viewControl.$paramCon.find('#subTitleId').textbox('getValue');
            this.showLegend = $("#showLegendId").is(":checked");
        },
        genTitle : function() {
            return "数据分析";
        }
    });
    window.ConfigBucket = ConfigBucket;
}();