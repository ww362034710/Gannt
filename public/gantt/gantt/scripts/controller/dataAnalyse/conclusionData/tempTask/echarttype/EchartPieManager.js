// echart饼图类型图的原型
!function(){
    var EchartPieManager = function(opts) {

    };
    $.extend(true, EchartPieManager.prototype, {
        prepareOption: function(opts) {
            var self = this,
                result = self.checkLegal();
            if (result.success) {
                result = self._prepareOption();
            }
            return result;
        },
        _prepareOption: function() {
            var option = {};

            // 数据类型:  string文本/number数字
            var dataValueType = "number";

            var configOption = configBucket;
            var preparedDataResult = this._prepareData();    // {a:4, b:2....}
            if (!preparedDataResult.success) return preparedDataResult;
            var preparedData = preparedDataResult.obj;
            var series = {type: 'pie', data: []};
            var legendNames = [];
            if ($.isPlainObject(preparedData)) {
                $.each(preparedData, function (i, item) {
                    legendNames.push(i);
                    series.data.push({
                        name: i,
                        value: item
                    });   //todo 仅支持一个channel
                })
            }
            // series = [series];


            var option = {
                title: {
                    text: configOption.title
                },
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function (_o) {
                        return _o.name + "<br>" + _o.value + "( " + _o.percent + "% )";
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: false,
                            title: {
                                mark: '辅助线开关',
                                markUndo: '删除辅助线',
                                markClear: '清空辅助线'
                            },
                            lineStyle: {
                                width: 2,
                                color: '#1e90ff',
                                type: 'dashed'
                            }
                        },
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },

                series: [series]
            };
            if (configOption.showLegend) {
                option.legend = {
                    data: legendNames
                };
            }
            return {
                success: true,
                msg: '',
                obj: option
            };
        },
        _prepareData: function(){
            // 准备原始数据
            var preparedData = [];
            var datas = manager.datas;
            var configOption = configBucket;
            var selectedTestProjects = manager.selectedTestProjects;
            var channels = [];
            $.each(selectedTestProjects, function(testProjectIndex, testProject) {
                if (testProject.children) {
                    $.each(testProject.children, function(channelIndex, channel) {
                        channels.push(channel);
                    })
                }
            })
            $.each(channels, function (i, channel) {
                var d = [];
                $.each(datas, function (taskId, taskData) {
                    if (taskData && taskData.length > 0) {
                        $.each(taskData, function (dataIndex, data) {
                            debug && console.log("__d:", data);
                            debug && console.log("__d.name", data.name, channel);
                            if(data.name == channel.text) {
                                preparedData.push(data.measuredValue);
                            }
                        });
                    }
                });
                return false;
            });
            // 判断数据类型
            var dataValueType = "number";
            if (manager.getDataType(preparedData)=="string") {
                dataValueType = "string";
            }


            var result = {};        // [{value:335, name:'直接访问'}],

            var pieDataMap = {},    // [">5":12, "<=5":10]
                pieFunMap = {};     // [">5": function(){xx>5},

            var paramFuns = [];     // 过滤函数
            var $paramGroups = $(".pieParamGroupCon .pieParamGroup");
            if ($paramGroups && $paramGroups.length>0) {
                $.each($paramGroups, function(i, idom) {
                    var $i = $(idom);
                    var $paramExpressions = $i.find('.pieParamExpression');
                    if ($paramExpressions && $paramExpressions.length>0) {
                        var groupName = $i.find("[name=groupName]").val();
                        var expressions = [];
                        $.each($paramExpressions, function(j, jdom) {
                            debug && console.log('jdom', $(jdom));
                            var $j = $(jdom);
                            var logic = $j.find("[name=pieParamLogic]").val(),
                                value = $j.find("[name=pieParamValue]").val();
                            debug && console.log('logic',logic);
                            debug && console.log('value',value);
                            if (value != "") {
                                if (dataValueType=="number") {
                                    console.log(1);
                                    console.log("item" + logic + value);
                                    expressions.push("item" + logic + value);
                                } else {
                                    console.log(2);
                                    console.log("item" + logic + '"' + value + '"');
                                    expressions.push("item" + logic + '"' + value + '"');
                                }
                            }
                        });
                        if (expressions.length>0) {
                            var expression = expressions.join(" && ");      // 表达式
                            var expressionFun = eval("(function(item){ return " + expression + "})");
                            if (!pieFunMap.hasOwnProperty(groupName)) pieFunMap[groupName] = expressionFun;
                        }
                    }
                });
                debug && console.log('pieFunMap', pieFunMap);
                if ($.isEmptyObject(pieFunMap)) return {
                    success: false,
                    msg :'请在右侧设置饼图的分组参数'
                };
                // 用函数过滤数据
                if ($.isPlainObject(pieFunMap)) {
                    $.each(pieFunMap, function(i,item) {
                        pieDataMap[i] = 0;
                    });

                    debug && console.log('preparedData',preparedData);
                    // 使用过滤函数统计数据
                    if (preparedData.length>0) {
                        $.each(preparedData, function(i,_d) {
                            $.each(pieFunMap, function(j, fun) {
                                if (fun(_d)==true) {
                                    pieDataMap[j]++;
                                    return false;
                                }
                            });
                        });
                    }
                    debug && console.log('pieDataMap',pieDataMap);

                }
            }
            debug && console.log("pieDataMap:",pieDataMap);
            return {
                success: true,
                obj: pieDataMap
            };
        },
        checkLegal: function() {
            var success = true,
                msg = '';
            return {
                success: success,
                msg: msg
            }
            // if (!preparedOption.legend || !preparedOption.legend.data || preparedOption.legend.data.length == 0) {
            //     return $.messager.alert('提示', '未对数据进行分组, 请先设置分组参数再绘制', 'info')
            // }
        }
    });
    window.EchartPieManager = EchartPieManager;
}();