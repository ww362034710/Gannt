// echart散点类型图的原型
!function(){
    var EchartScatterManager = function(opts) {

    };
    $.extend(true, EchartScatterManager.prototype, {
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

            /**
             * 选中的 任务+产品编号
             * [
             *     id: 't_1',
             *     nodeType: 'task',
             *     children: [
             *          [id: 1, name:'Z01-01', nodeType: 'productCode', parentId: 't_1', taskId: [
             *                  10: 1,      // bom的试验项目id: 试验任务id
             *                  11: 2
             *          ]]
             *     ]
             */
            var selectedTasks = manager.selectedTasks,
                selectedChannels = manager.selectedChannels;
            if (!selectedChannels || selectedChannels.length == 0) {
                return {
                    success : false,
                    msg : '请勾选通道'
                };
            }

            // 图例
            var legendData = [];

            // 产品编号数组
            var productCodeNameList = major.collect( selectedTasks , function(_t) {return _t.productCode;});   // [[aa,bb],[cc,dd]..]
            debug && console.log('--产品编号:' , productCodeNameList);

            // 选中的任务id数组
            var taskIds = major.collect( selectedTasks , function( _t) { return _t.id; });

            // echart配置
            // X轴
            var xAxisList = [],
                yAxisList = [],
                yAxisNameList = [];
            //
            var series = [],
                seriesData = [];

            // 选中的通道名称  用于Y轴
            $.each(selectedChannels, function(i, item) {
                if (yAxisNameList.indexOf(item.name)==-1) {
                    yAxisNameList.push(item.name);
                    // Y轴
                    yAxisList.push({
                        type: 'value',
                        position: yAxisList.length==0 ? 'left' : 'right',
                        scale: true
                    })
                }

            })

            // 产品时间  准备X轴
            // var taskOriginalDataObjMap = {};   // {taskId: [channelName: [[times:[x,x..], datas: [x,x..]]..]..}
            var timesArr = [];  // [['2017-10-1 0:0:0', ..] ..]  X轴的时间
            var timeIndexArr = [];  // [[0,1,2,3..]..]  X轴的索引数组
            $.each(selectedTasks, function(selectedTaskIndex, selectedTask) {
                var taskId = selectedTask.id;

                var xAxisData = []

                $.each(selectedChannels, function(selectedChannelIndex,selectedChannel){
                    if (selectedChannel.taskId == selectedTask.id ) {
                        var groupName = selectedChannel.groupName,
                            channelName = selectedChannel.name,
                            channelId = selectedChannel.channelId,
                            // 原始数据对象
                            originalDataObjList = manager.CACHE_DATA[taskId],  //[id:,group:,remark:,time:,specification:..]
                            originalDataObj = major.find(originalDataObjList, 'group', groupName);
                        if (originalDataObj.hasOriginalData) {
                            // 原始数据
                            var originalDataMap = originalDataObj.data.dataElementMap; //[channelName: [[times:[x,x..], datas: [x,x..]]..]

                            // 获取时间列表
                            var channelTimeData = originalDataMap[channelId].times,
                                // 数据列表
                                channelData = originalDataMap[channelId].datas;
                            if(channelTimeData && channelData){
                                //处理时间
                                channelTimeData = channelTimeData.sort();
                                var startTime = new Date(channelTimeData[0]),
                                    timeIntervalValue = originalDataObj.time.timeInterval.value,
                                    timeIntervalUnit = originalDataObj.time.timeInterval.dimension;
                                var times = (new Date(channelTimeData[channelTimeData.length - 1]) - new Date(channelTimeData[0])) / Time.UNITS[timeIntervalUnit];

                                var legendName = selectedTask.name + '(' + selectedTask.code + ') - ' + selectedChannel.name;
                                legendData.push(legendName);

                                var data = [];
                                for (var j = 0; j < times; j++) {
                                    var timeValue = new Date(startTime.getTime() + j * timeIntervalValue * Time.UNITS[timeIntervalUnit]);
                                    var thisTime = major.dateFormatYMDHms(timeValue);
                                    xAxisData.push(thisTime);
                                    var value = findValueByTime(channelTimeData, thisTime, channelData);
                                    data.push([ j , value ]);
                                }
                                seriesData.push(data);

                                var item = {
                                    name: legendName,
                                    type: 'scatter',
                                    data: data,
                                    yAxisIndex: yAxisNameList.indexOf(channelName)
                                };
                                series.push(item);
                            }
                        }
                    }
                });

                if(xAxisData.length>0){
                    xAxisData = $.unique(xAxisData);
                    timesArr.push( xAxisData );

                    // 生成从0到xAxisData长度的数组 [0, 1,2,3,4..]
                    var thisTimeIndexArr = [];
                    for (var _i=0;_i<xAxisData.length;_i++) {
                        thisTimeIndexArr.push( _i );
                    }
                    timeIndexArr.push( thisTimeIndexArr );

                    // xAxisList
                    xAxisList.push((function(currentI){
                        return {
                            type: 'category',
                            axisLabel: {
                                formatter: function (v) {
                                    if(currentI>=timesArr.length-1){
                                        currentI = timesArr.length-1;
                                    }
                                    return timesArr[currentI][v];
                                }
                            },
                            scale: true,
                            data: thisTimeIndexArr
                        }
                    })(selectedTaskIndex));
                }

            });
            debug && console.log('echart scatterManager option: ', option);


            // 整合成echart设置

            // 计算X轴最多显示的点数
            var c_x_zoom_percent = /*_CONFIG.maxXPointCount / testProjectNameList.length **/ 100;
            if (c_x_zoom_percent>100) c_x_zoom_percent = 100;

            // 准备标题设置
            var _titleObj = { text: configOption.title },
                _subTitle = configOption.subTitle;
            if (_subTitle) _titleObj.subtext = _subTitle;


            option = {
                title: _titleObj,
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var productCodeName = legendData[params.value[0]],
                            seriesName = params.seriesName,
                            value = params.value[1];

                        return seriesName + ": " + value;
                    },
                    axisPointer: {
                        animation: false
                    }
                },

                toolbox: {
                    show : true,
                    feature : {
                        myTool1: {
                            show: true,
                            title: '导出Excel',
                            icon: 'image:///static/images/excel.png',
                            onclick: function (){
                                controller.exportData();
                            }
                        },
                        saveAsImage : {show: true}
                    }
                },
                xAxis: xAxisList,
                yAxis: yAxisList,
                dataZoom: {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: c_x_zoom_percent
                },

                series: series
            };
            if (configOption.showLegend) {
                option.legend = {
                    data: legendData
                };
            }


            return {
                success:true,
                msg: '',
                obj: option
            };

            function findValueByTime(channelTimeData, time,data) {
                for (var i = 0;i<channelTimeData.length;i++) {
                    var timeValue = new Date(channelTimeData[i]);
                    var thisTime = major.dateFormatYMDHms(timeValue);
                    if(time == thisTime){
                        return data[i];
                    }
                }
                return "-";
            }
        },
        _prepareData: function(opts){
            opts = opts ||{};
            var result = [];        // [ [1,2,3],[4,5,6]...]

            return result;
        },
        checkLegal: function() {
            var success = true,
                msg = '';
            return {
                success: success,
                msg: msg
            }
        }
    });
    window.EchartScatterManager = EchartScatterManager;
}();