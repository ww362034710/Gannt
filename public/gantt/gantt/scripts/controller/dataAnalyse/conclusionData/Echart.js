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
                var index = 0;
                $.each(configs, function(channelName, config) {
                    var upperLine = config.u,
                        fewLine = config.d;
                    if (upperLine && upperLine.trim()) {
                        if (!$.isNumeric(upperLine)) return $.messager.alert('错误', '包络线上限必须是数字', 'error');
                        upperLine = parseFloat(upperLine);
                        self.addMarkLine({index:index,name: channelName, value: upperLine, type: 'upper'});
                    }
                    if (fewLine && fewLine.trim()) {
                        if (!$.isNumeric(fewLine)) return $.messager.alert('错误', '包络线下限必须是数字', 'error');
                        fewLine = parseFloat(fewLine);
                        self.addMarkLine({index:index,name: channelName, value: fewLine, type: 'few'});
                    }
                    index++;
                })
            }


        },
        addMarkLine: function(_o) {
            var value = _o.value,
                name = _o.name,
                index = _o.index,
                type = _o.type,
                typeText = {'upper':'上限', "few":'下限]'}[type],
                color = this.getColor();

            var opts = this._echart.getOption();
            var data = [];
            $.each(opts.series,function (i,item) {
                data = data.concat(item.data)
            });
            var yAxis = _CONFIG.maxYAxisCount==1 ? opts.yAxis[0]: opts.yAxis[index],
                max = yAxis.hasOwnProperty('max')? yAxis.max: getSeriesMax(data),
                min = yAxis.hasOwnProperty('min')? yAxis.min: getSeriesMin(data);

            var tMax = Math.max(value,max),
                tMin = Math.min(value,min); //新的max min

            var needRedraw = false; //是否需要重绘
            if (tMax != max) {
                needRedraw = true;
                // 更新yAxis的max
                yAxis.max = tMax;
            }
            if (tMin != min) {
                needRedraw = true;
                // 更新Min
                yAxis.min = tMin;
            }
            if (needRedraw) {
                this.clear();
                this._echart.setOption(opts);
            }

            this._echart.addMarkLine(index,{
                symbol: (name? name + ' - ': '') + typeText,
                symbolSize: 0,
                data: [[{
                    xAxis: -1,
                    yAxis: value,
                    tooltip: {
                        formatter: function (d) {
                            return "包络线 - "+d.seriesName + " - " + typeText + ': ' + d.data.yAxis;
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: color,
                            symbolSize: 2,
                            lineStyle: {
                                type: 'solid',
                                width: 5
                            }
                        }
                    }
                },{
                    xAxis: 10000000,
                    yAxis: value
                }]]
            });

            function getSeriesMax(list) {
                var max = null;
                for (var i in list ){
                    var v = parseFloat(list[i][1]);
                    console.log(v)
                    if (max == null) {
                        max = v;
                    } else if (v>max) {
                        max = v;
                    }
                }
                return max;
            }


            function getSeriesMin(list) {
                var min = null;
                for (var i in list ){
                    var v = parseFloat(list[i][1]);
                    if (min == null) {
                        min = v;
                    } else if (v<min) {
                        min = v;
                    }
                }
                return min;
            }
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