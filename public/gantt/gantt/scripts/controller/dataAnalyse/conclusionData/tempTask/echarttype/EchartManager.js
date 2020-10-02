// 各种echart类型图的原型
!function(){
    var EchartManager = function(opts) {
        // 配置信息
        this.echartType = 'line';    // 图表类型
        this.selectedXAxisTestProjects = null;      // X轴选择的试验项目
        this.selectedYAxisTestProjects = null;      // Y轴选择的试验项目
        this.selectedBatchTasks = null;             // 选择的批次任务


        // 过程数据
        this.xAxisNameList = [];        // X轴的名字集合  [[Z01-01,Z01-02..],[Z02-01,Z02-02..]..]
    };
    EchartManager.prototype = {
        constructor : EchartManager,
        prepareOption: function(opts) {
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
                        if (originalDataObj) {
                            // 原始数据
                            var originalDataMap = originalDataObj.data.dataElementMap; //[channelName: [[times:[x,x..], datas: [x,x..]]..]

                            // 获取时间列表
                            var channelTimeData = originalDataMap[channelId].times,
                                // 数据列表
                                channelData = originalDataMap[channelId].datas;

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
                                data.push(value);
                            }
                            seriesData.push(data);

                            var item = {
                                name: legendName,
                                type: 'line',
                                data: data,
                                yAxisIndex: yAxisNameList.indexOf(channelName)
                            };
                            series.push(item);
                        }
                    }
                });

                xAxisData = $.unique(xAxisData);

                // xAxisList
                xAxisList.push({
                    type: 'category',
                    scale: true,
                    data: xAxisData
                });
            });
            debug && console.log('echart lineManager option: ', option);


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

                        return productCodeName + "<br>" + seriesName + ": " + value;
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
        prepareData: function(opts){
            var result = [];        // [ [1,2,3],[4,5,6]...]

            var selectedBatchTasks = manager.selectedBatchTasks,
                selectedTestProjects = manager.selectedTestProjects,
                multiTestProject = manager.multiTestProject,
                datas = manager.datas;

            var configOption = configBucket;

            var checkedTasks = manager.selectedTasks,
                checkedChannels = manager.selectedChannels;

            // 数据
            var originalDataMap = {};   // {taskId: [channelName: [xxx,xx]..]..}


            $.each( checkedChannels , function(_i, testProject){
                var testProjectId = parseInt(testProject.id.substring(2)),
                    channels = testProject.children;
                $.each(channels, function (channelIndex, channel) {
                    $.each(selectedBatchTasks, function (batchTaskIndex, batchTask) {
                        var channelData = [];
                        var productCodes = batchTask.children;
                        $.each(productCodes, function (productCodeIndex, productCodeRow) {
                            console.log('productCodeRow: ', productCodeRow);
                            var taskId = productCodeRow.taskId && productCodeRow.taskId[testProjectId];
                            var value = "-";
                            if (taskId) {
                                var taskData = datas[taskId];
                                console.log('taskData: ', taskData);
                                if (taskData) {
                                    var thisChannelData = major.find(taskData, function (_taskData) {
                                        return _taskData.taskTestProjectId == testProjectId && _taskData.name == channel.text;
                                    });
                                    console.log('thisChannelData: ', thisChannelData);
                                    if (thisChannelData) {
                                        value = thisChannelData.measuredValue;
                                    }
                                }
                            }
                            channelData.push(value);
                        });
                        debug && console.log('channelData: ', channelData);
                        result.push(channelData);
                    });
                });
            });

            debug && console.log('result: ', result);
            return result;
        }
    };
    window.EchartManager = EchartManager;
}();