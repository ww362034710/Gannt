// 控制前台原始数据的展示
(function() {

    var Echart = function(){

        this._echart = null;
        this.$paramCn = null;

        this.echartOption = {};

        this.autoRefresh = true;

        this.MARKLINE_COLORS = [ "#e60000", "#03d100", "#004ee0" , "#e100d0"];
        this.colorIndex = 0;
        // 记录标题是否手动变更  手动变更的话不再自动更新标题  否则(或者为空)时自动更新
        var titleAuto = true;

        this.init();

        return this;
    };
    $.extend(true, Echart.prototype, {
        init: function(opts) {
            var myChart = document.getElementById('echartDiv'),
                chartObj = echarts.init(myChart, 'infographic');
            this._echart = chartObj;
        },
        setTitle: function(_t) {
            if ($.isPlainObject(this.echartOption)) {
                this.echartOption.title.text = _t;
            }
        },
        setType: function(type) {
            if ($.isPlainObject(this.echartOption)) {
                var o_type = this.echartOption.series && this.echartOption.series.length>0?this.echartOption.series[0].type: null;
                if (o_type!=type) {
                    switch (type) {
                        case "scatter":     //散点图

                            break;
                        case "pie":         //饼图
                            // 获得饼图参数
                            // TODO 只支持一个饼图
                            // var pieParams = this.getPieParams();
                            break;
                    }
                }
            }
        },
        setWidth: function(_w) {
            this._echart.dom.style.width = (_w - 20) + 'px';
        },
        setHeight: function(_h) {
            this._echart.dom.style.height = _h + 'px';
        },
        resize: function() {
            this._echart.resize();
        },
        draw: function(_o) {
            this.clear();
            this.colorIndex = 0;
            this._echart.setOption(_o || this.echartOption);
            this.addEnvelopeLine(); //添加包络线
        },
        addEnvelopeLine: function() {
            var self = this,
                configs = viewControl.envelopeLineGrid.data.getData.call(viewControl.envelopeLineGrid);// {振动-电压: {u:20, d: 10}..}
            if (configs && !$.isEmptyObject(configs)) {
                $.each(configs, function(channelName, config) {
                    var upperLine = config.u,
                        fewLine = config.d;
                    if (upperLine) {
                        if (!$.isNumeric(upperLine)) return $.messager.alert('错误', '包络线上限必须是数字', 'error');
                        upperLine = parseFloat(upperLine);
                        self.addUpperMarkLine({name: channelName, value: upperLine});
                    }
                    if (fewLine) {
                        if (!$.isNumeric(fewLine)) return $.messager.alert('错误', '包络线下限必须是数字', 'error');
                        fewLine = parseFloat(fewLine);
                        self.addFewMarkLine({name: channelName, value: fewLine});
                    }
                })
            }


        },
        addUpperMarkLine: function(_o) {
            var value = _o.value,
                name = _o.name,
                color = this.getColor();

            this.addMarkLine({
                symbol: '包络线',
                data: [[{
                    name: (name? name + ' - ': '') + '上限',
                    value: value,
                    xAxis: -1,
                    yAxis: value,
                    itemStyle: {
                        normal: {
                            color: color,
                            symbolSize: 2,
                            lineStyle: {
                                type: 'solid',
                                width: 6
                            }
                        }
                    }
                },{
                    name: (name? name + ' - ': '') + '上限',
                    value: value,
                    xAxis: 10000000,
                    yAxis: value,
                    itemStyle: {
                        normal: {
                            color: color,
                            symbolSize: 2,
                            lineStyle: {
                                type: 'solid',
                                width: 6
                            }
                        }
                    }
                }]]
            });
        },
        addFewMarkLine: function(_o) {
            var value = _o.value,
                color = this.getColor();
            this.addMarkLine({
                symbol: '包络线',
                effect: {
                    show: false
                },
                data: [[{
                    name: (name? name + ' - ': '') + '下限',
                    value: value,
                    xAxis: -1,
                    yAxis: value
                },{
                    name: (name? name + ' - ': '') + '下限',
                    value: value,
                    xAxis: 10000000,
                    yAxis: value,
                    itemStyle: {
                        normal: {
                            symbol: 'circle',
                            color: color,
                            lineStyle: {
                                type: 'solid',
                                width: 6
                            }
                        }
                    }
                }]]
            });
        },
        addMarkLine: function(_o) {
            this._echart.addMarkLine(0, _o);
        },
        getColor: function() {
            var color = this.MARKLINE_COLORS[this.colorIndex%this.MARKLINE_COLORS.length];
            this.colorIndex++;
            return color;
        },
        _genTitle: function() { // 自动生成一个title
            var channels = _that.getSelectedChannels();
            return channels.join('/') + " 数据分析";
        },
        clear: function() {
            this._echart.clear();
        }
    });
    window.Echart = Echart;
})();