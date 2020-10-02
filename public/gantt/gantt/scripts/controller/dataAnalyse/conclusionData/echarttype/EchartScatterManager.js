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
            switch (configOption.xAxis) {
                case 'productCode':
                    /**
                     * 选中的 批次任务+产品编号
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
                    var productCodes = manager.selectedBatchTasks;
                    if(!productCodes || productCodes.length == 0) {
                        return {
                            success : false,
                            msg : '请选择产品编号'
                        };
                    }
                    /**
                     * 选中的 试验项目+参数
                     * @type {Array}
                     */
                    var selectedTestProjects = manager.selectedTestProjects;

                    // 产品编号数组
                    var productCodeNameList = [];   // [[aa,bb],[cc,dd]..]

                    // 几个批次
                    var batches = [],       //[{id:xx, name:xx}..]
                        batchSize = 0,
                        multiBatch = false,
                        batchNameList = [];

                    // 几个试验项目
                    var multiTestProject = manager.multiTestProject,   // 是否多个试验项目(影响展示时的文字)
                        testProjects = [],
                        testProjectSize = 0;

                    // 试验任务
                    var taskIds = [];

                    // option
                    // X轴
                    var xAxisList = [],
                        yAxisList = [];

                    // 分解勾选的产品编号  准备X轴
                    for (var i=0;i<productCodes.length;i++) {
                        var currentI = i;

                        var batchTask = productCodes[i];
                        batchNameList.push(batchTask.name);

                        // 将同批次的产品编号组为一行
                        batchSize++;
                        batches.push({
                            id: batchTask.id,
                            name: batchTask.name
                        });

                        // 该批次的产品编号名字
                        var productNames = [];
                        // X轴索引
                        var xData = [];

                        for (var j=0;j<batchTask.children.length;j++) {
                            var product = batchTask.children[j];
                            // 试验任务
                            product.taskId && taskIds.push(product.taskId);
                            // 产品编号名
                            productNames.push(product.name);
                            // X索引
                            xData.push(j);
                        }
                        productCodeNameList.push(productNames);

                        // xAxisList
                        xAxisList.push((function(currentI){
                            return {
                                type: 'category',
                                axisLabel: {
                                    formatter: function (v) {
                                        return productCodeNameList[currentI][v];
                                    }
                                },
                                scale: true,
                                axisLine: { show: true, onZero:false},
                                data: xData
                            }
                        })(currentI));
                    }
                    if (batchSize>1) multiBatch = true;
                    debug && console.log('productCodes', productCodes);


                    var channels = manager.getYAxisSelectedChannels();
                    debug && console.log('channels:', channels);

                    // 图例
                    var legendData = [];
                    var legendsTheoValueData={};
                    // 检测通道数量与设置的最大Y轴数量
                    var legendTopNum = selectedTestProjects.length>_CONFIG.maxYAxisCount && _CONFIG.maxYAxisCount!=1 ? _CONFIG.maxYAxisCount : 100;
                    var _loop = 0;
                    $.each(selectedTestProjects, function(i, testProject) {
                        var testProjectId = parseInt(testProject.id.substring(2));
                        var channels = testProject.children;
                        if (channels && channels.length>0) {
                            $.each(channels, function(j, channel) {
                                $.each(productCodes, function(productCodeIndex, batchTask){
                                    if(batchTask.children.length>0){
                                        var taskIds = batchTask.children[0].taskId;
                                        var taskId = taskIds[testProjectId];     // {试验项目id: taskId...}
                                        if(taskId){
                                            var taskData = manager.datas[taskId];
                                            if(taskData){
                                                var thisChannelData = major.find(taskData, function (_taskData) {
                                                    return _taskData.taskTestProjectId == testProjectId && _taskData.name == channel.text;
                                                });
                                                console.log("thisChannelData",thisChannelData);
                                            }
                                        }else{
                                            return true;
                                        }
                                    }

                                    if (_loop<=legendTopNum) {
                                        console.log('legendData: channel', channel);
                                        _loop++;
                                        var legendText = '';
                                        // 是否需要批次前缀
                                        if (multiBatch) legendText += batchTask.name + ' - ';

                                        if (multiTestProject) legendText += testProject.text + " - " + channel.text;
                                        else legendText += channel.text;

                                        legendData.push(legendText);
                                        legendsTheoValueData[legendText]=thisChannelData.theoValue;
                                    } else {
                                        return false;
                                    }
                                });
                            })
                        }
                    });
                    debug && console.log('legendData', legendData);
                    if (legendData.length == 0) {
                        return {
                            success: false,
                            msg: '请选择Y轴参数'
                        }
                    } else {
                        manager.legends = legendData;
                        manager.legendsTheoValue = legendsTheoValueData;
                    }

                    // 结论数据
                    var preparedData = this._prepareData();    // [[14,20,18..], [29,33,..]..]
                    var series = [];

                    // 检测通道数量与设置的最大Y轴数量
                    var yAxisTopNum = preparedData.length>_CONFIG.maxYAxisCount && _CONFIG.maxYAxisCount!=1 ? _CONFIG.maxYAxisCount : preparedData.length;
                    for (var i=0;i<yAxisTopNum;i++){
                        var item = preparedData[i];
                        if(item.length>0){
                            var dataValueEnums = [];
                            var dataValueType = manager.getDataType(item);
                            // 添加Y轴
                            var yAxis;
                            if (dataValueType=="string") {
                                dataValueEnums = manager.getDataEnums(item);
                                series.push({
                                    type: 'scatter',
                                    name: legendData[i],
                                    scale: true,
                                    yAxisIndex:_CONFIG.maxYAxisCount==1? 0 : i,
                                    data: item
                                });
                                yAxis = {
                                    type: 'category',
                                    scale: true,
                                    axisLine: { show: true},
                                    position: i || _CONFIG.maxYAxisCount==1? 'left' : 'right' ,
                                    splitNumber : _CONFIG.yAxisSplitNumber,
                                    data: dataValueEnums,
                                };
                            } else {
                                series.push({
                                    type: 'scatter',
                                    name: legendData[i],
                                    scale: true,
                                    yAxisIndex: _CONFIG.maxYAxisCount==1? 0 : i,
                                    data: item
                                });
                                yAxis = {
                                    type: 'value',
                                    position: i || _CONFIG.maxYAxisCount==1? 'left' : 'right' ,
                                    splitNumber : _CONFIG.yAxisSplitNumber,
                                    scale: true,
                                    axisLine: { show: true}
                                };
                            }

                            yAxisList.push(yAxis);
                        }

                    }


                    // 分解勾选的试验项目与参数  准备Y轴
                    for (var i=0;i<selectedTestProjects.length;i++) {

                    }


                    // 整合成echart设置

                    // 计算X轴最多显示的点数
                    var c_x_zoom_percent = _CONFIG.maxXPointCount / productCodeNameList.length * 100;
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

                                var productCodeName = productCodeNameList[0][params.value[0]],
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
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        xAxis: xAxisList,
                        yAxis: _CONFIG.maxYAxisCount==1? yAxis : yAxisList,
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
                    debug && console.log('echart scatterManager option: ', option);
                    break;
                case 'testProject':
                    /**
                     * 选中的 批次任务+产品编号
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
                    var selectedBatchTasks = manager.selectedBatchTasks;

                    /**
                     * X轴选中的 试验项目
                     * @type {Array}
                     */
                    var selectedTestProjects = manager.selectedXAxisTestProjects;
                    if (selectedTestProjects.length==0) {
                        return {
                            success: false,
                            msg: '请选择X轴的试验项目'
                        }
                    }

                    /**
                     * Y轴选中的 试验项目
                     * @type {Array}
                     */
                    var selectedYTestProjects = manager.selectedTestProjects;

                    // 试验项目名称数组
                    var testProjectNameList = [];   // [[aa,bb],[cc,dd]..]

                    // 几个批次
                    var batches = [],       //[{id:xx, name:xx}..]
                        batchSize = 0;

                    // 几个试验项目
                    var multiTestProject = manager.multiTestProject,   // 是否多个试验项目(影响展示时的文字)
                        testProjects = [],
                        testProjectSize = 0;

                    // 试验任务
                    var taskIds = [];

                    // option
                    // X轴
                    var xAxisList = [],
                        yAxisList = [];

                    // 分解勾选的试验项目  准备X轴
                    // 准备Y轴 (不同试验项目的相同名称通道合并)
                    var yAxisTopNum = _CONFIG.maxYAxisCount ;
                    // Y轴的名字集合
                    var yNameList = [];

                    var xNameList = [], // X轴名字集合
                        xNameIdList = [], // 选中的试验项目的id列表
                        xData = [];     // X轴索引
                    var _yLoop = 0;
                    $.each( selectedTestProjects , function( testProjectIndex , testProject ) {
                        // xAxisList
                        xNameList.push( testProject.text );
                        xNameIdList.push( testProject.id );
                        xData.push( testProjectIndex );
                    });
                    $.each( selectedYTestProjects , function( testProjectIndex , testProject ) {
                        if (_yLoop<yAxisTopNum) {
                            var channels = testProject.children;
                            $.each(channels, function (channelIndex, channel) {
                                if (_yLoop<yAxisTopNum) {
                                    if ( yNameList.indexOf( channel.text ) == -1 ) {
                                        yNameList.push( channel.text );
                                        _yLoop++;
                                    }
                                } else {
                                    return false;
                                }
                            });
                        }
                    });
                    xAxisList.push({
                        type: 'category',
                        axisLabel: {
                            formatter: function (v) {
                                return xNameList[v];
                            }
                        },
                        scale: true,
                        axisLine: { show: true, onZero:false},
                        data: xData
                    });

                    // 选中的产品编号
                    var productCodes = [],
                        productCodeTaskIdMap = {};  // {产品编号: {试验项目id: taskId..}..}
                    $.each( selectedBatchTasks , function( batchTaskIndex , batchTask ) {
                        var productCodeList = batchTask.children;
                        if (productCodeList && productCodeList.length>0) {
                            $.each(productCodeList, function(productCodeIndex, productCodeRow) {
                                var productCodeName = productCodeRow.name;
                                if (productCodes.indexOf( productCodeName ) == -1 ) {
                                    productCodes.push( productCodeName );
                                    productCodeTaskIdMap[ productCodeName ] = productCodeRow.taskId;
                                }
                            });
                        }
                    });


                    // 图例
                    var legendData = [];
                    // 检测通道数量与设置的legend数量
                    $.each(productCodes, function( productCodeIndex , productCode ) {
                        $.each( yNameList , function( yNameIndex , yName ) {
                            legendData.push( productCode + ' - ' + yName );
                        });
                    });
                    debug && console.log('legendData', legendData);


                    // for (var i=0;i<selectedTestProjects.length;i++) {
                    //     for (var j=0;j<batchTask.children.length;j++) {
                    //         var product = batchTask.children[j];
                    //         // 产品编号名
                    //         testProjectNameList.push(batchTask.name);
                    //         // X索引
                    //         xData.push(j);
                    //     }
                    //
                    //
                    // }
                    // debug && console.log('testProjectNameList', testProjectNameList);
                    //
                    //

                    //
                    //
                    // var channels = manager.getYAxisSelectedChannels();
                    // debug && console.log('channels:', channels);
                    //
                    //
                    //
                    // for (var i=0;i<yAxisTopNum;i++){
                    //
                    //
                    //
                    //     var item = preparedData[i];
                    //
                    //     var dataValueEnums = [];
                    //     var dataValueType = manager.getDataType(item);
                    //     // 添加Y轴
                    //     var yAxis;
                    //     if (dataValueType=="string") {
                    //         dataValueEnums = manager.getDataEnums(item);
                    //         series.push({
                    //             type: 'scatter',
                    //             name: legendData[i],
                    //             scale: true,
                    //             yAxisIndex: i,
                    //             data: item
                    //         });
                    //         yAxis = {
                    //             type: 'category',
                    //             scale: true,
                    //             position: i ? 'right' : 'left' ,
                    //             data: dataValueEnums
                    //         };
                    //     } else {
                    //         series.push({
                    //             type: 'scatter',
                    //             name: legendData[i],
                    //             scale: true,
                    //             yAxisIndex: i,
                    //             data: item
                    //         });
                    //         yAxis = {
                    //             type: 'value',
                    //             position: i ? 'right' : 'left' ,
                    //             scale: true
                    //         };
                    //     }
                    //
                    //     yAxisList.push(yAxis);
                    // }



                    // 结论数据
                    var preparedData = this._prepareData({
                        xNameList : xNameList,
                        xNameIdList : xNameIdList,
                        yNameList : yNameList,
                        productCodes : productCodes,
                        productCodeTaskIdMap : productCodeTaskIdMap
                    });    // [[14,20,18..], [29,33,..]..]


                    var series = [];
                    // 将多条线的同一个Y轴的数据合并   用于检测数据的类型是value还是category
                    var mergedYData = [];
                    $.each(preparedData , function( preparedDataIndex , preparedData ) {
                        var mod = preparedDataIndex % yNameList.length;
                        if (!mergedYData[mod]) mergedYData[mod] = [];
                        mergedYData[mod] = mergedYData[mod].concat(preparedData);
                        // 添加series
                        series.push({
                            type: 'scatter',
                            name: legendData[preparedDataIndex],
                            scale: true,
                            yAxisIndex: mod,
                            data: preparedData
                        });
                    });
                    $.each(mergedYData , function( mergedYDataIndex , mergedYData ) {
                        var dataValueEnums = [];
                        var dataValueType = manager.getDataType(mergedYData);
                        // 添加Y轴
                        var yAxis;
                        if (dataValueType=="string") {
                            dataValueEnums = manager.getDataEnums(mergedYData);
                            yAxis = {
                                type: 'category',
                                scale: true,
                                axisLine: { show: true},
                                splitNumber : _CONFIG.yAxisSplitNumber,
                                position: mergedYDataIndex ? 'right' : 'left' ,
                                data: dataValueEnums
                            };
                        } else {
                            yAxis = {
                                type: 'value',
                                position: mergedYDataIndex ? 'right' : 'left' ,
                                splitNumber : _CONFIG.yAxisSplitNumber,
                                scale: true,
                                axisLine: { show: true}
                            };
                        }
                        yAxisList.push(yAxis);
                    });








                    // 整合成echart设置

                    // 计算X轴最多显示的点数
                    var c_x_zoom_percent = _CONFIG.maxXPointCount / testProjectNameList.length * 100;
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
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
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
                    debug && console.log('echart scatterManager option: ', option);
                    break;
                default:
                    throw new Error('失败', '散点图暂不支持所选择的X轴类型', 'info');
            }
            return {
                success:true,
                msg: '',
                obj: option
            };
        },
        _prepareData: function(opts){
            var opts = opts ||{};
            var result = [];        // [ [1,2,3],[4,5,6]...]

            var selectedBatchTasks = manager.selectedBatchTasks,
                selectedTestProjects = manager.selectedTestProjects,
                multiTestProject = manager.multiTestProject,
                datas = manager.datas;

            var configOption = configBucket;

            switch ( configOption.xAxis ) {
                case 'productCode' :
                    $.each(selectedTestProjects, function (_i, testProject) {
                        var testProjectId = parseInt(testProject.id.substring(2)),
                            channels = testProject.children;
                        $.each(channels, function (channelIndex, channel) {
                            $.each(selectedBatchTasks, function (batchTaskIndex, batchTask) {
                                var channelData = [];
                                var productCodes = batchTask.children;
                                $.each(productCodes, function (productCodeIndex, productCodeRow) {
                                    console.log('productCodeRow: ', productCodeRow);
                                    var taskId = productCodeRow.taskId && productCodeRow.taskId[testProjectId];     // {试验项目id: taskId...}
                                    var value = null;
                                    if (taskId) {
                                        var taskData = datas[taskId];
                                        console.log('taskData: ', taskData);
                                        if (taskData) {
                                            var thisChannelData = major.find(taskData, function (_taskData) {
                                                return _taskData.taskTestProjectId == testProjectId && _taskData.name == channel.text;
                                            });
                                            console.log('thisChannelData: ', thisChannelData);
                                            if (thisChannelData) {
                                                value = [productCodeIndex, thisChannelData.measuredValue];
                                            }
                                        }
                                    }
                                    if (value) channelData.push(value);
                                });
                                debug && console.log('channelData: ', channelData);
                                if(channelData.length>0){
                                    result.push(channelData);
                                }

                            });
                        });
                    });
                    break;
                case 'testProject' :
                    // 选中的产品编号:
                    var productCodes = opts.productCodes,
                        productCodeTaskIdMap = opts.productCodeTaskIdMap,       // {产品编号: {试验项目id: taskId..}..}
                        xNameList = opts.xNameList,
                        xNameIdList = opts.xNameIdList,
                        yNameList = opts.yNameList;

                    $.each( productCodes , function( productCodeIndex , productCode ) {
                        $.each( yNameList , function( yNameIndex , yName ) {    //电压
                            var seriesData = [];        // 一个legend的数据
                            $.each( xNameIdList , function( testProjectIdIndex , testProjectId ) {
                                testProjectId = parseInt(testProjectId.substring(2));
                                var taskTestProjectTaskIdMap = productCodeTaskIdMap[productCode],       //{试验项目id: taskId..}
                                    taskId = taskTestProjectTaskIdMap && taskTestProjectTaskIdMap[testProjectId];
                                if (taskId) {
                                    var taskData = datas[taskId];          // [{taskId: taskId, taskName: taskName, name: name, productCode: productCode, taskTestProjectId: taskTestProjectId, unit: unit, measuredValue: measuredValue, qualified: qualified}..]
                                    if (taskData) {
                                        var data = major.find(taskData, function (_data) {
                                            return _data.name == yName && _data.productCode == productCode && _data.taskTestProjectId == testProjectId;
                                        });
                                        if (data) {
                                            seriesData.push([testProjectIdIndex, data.measuredValue]);
                                        }
                                    }
                                }
                            });
                            result.push( seriesData );
                        });
                    });
                    break;
            }
            debug && console.log('result: ', result);
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