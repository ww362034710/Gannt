// 控制前台原始数据的展示
(function(){
    var Control = {};

    // 内部变量
    var taskId = null,
        backOriginalDataList = [],  // 后台原始数据对象
        originalDataList = [],      // 原始数据对象数组
        originalDataGroup = {},     // 原始数据分组 [group: [channel: data]]
        groupList = [];             // 原始数据分类列表

    // DOM
    var $groupPanel = null, // 分类
        $groupRadios = null,            // 分类中的选项
        $channelPanel = null,
        $channelRadios = null;

    var datagrid = null,           // 列表控件
        myEchart = null;
    // 状态
    var currentGroup,
        currentChannel,
        currentChannelData,
        currentOriginalData;
    var timeDatas = [];
    
    Control.init = function(opts){
        // 设置变量
        taskId = opts.taskId;
        backOriginalDataList = opts.backOriginalDataList;

        console.log('backOriginalDataList', backOriginalDataList);
        originalDataList = OriginalData.fromObjList(backOriginalDataList);
        console.log('originalDataList', originalDataList);

        // 如果有数据的话
        if (originalDataList.length>0) {
            Control._init();
        } else {    // 没有原始数据的话
            Control._initBlank();
        }
    };
    // 初始化控件/事件
    Control._init = function() {
        console.log('Control._init');

        var myChart = document.getElementById('echart');
        var myChartParent = $("#echartparent").panel({
            onResize:function(width,height){
                console.log('resize');
                myChart.style.width = width + 'px';
                //myChart.style.height = height+ 'px';
                myEchart.resize();
            }
        });
        myEchart = echarts.init(myChart);
        // 触发resize
        $("#echartparent").panel('resize');

        // 转换数据结构
        $.each(originalDataList, function(i,originalData) {
            console.log('i', i);
            console.log('originalData', originalData);
            var group = originalData.group;
            if (!originalDataGroup.hasOwnProperty(group)) originalDataGroup[group] = {};
            // todo 确认data中的map对象的键是什么
            var data = originalData.data,
                dataElementMap = data.dataElementMap;
            console.log('dataElementMap', dataElementMap );
            // todo data中的fileDataMap未存储
            if ($.isPlainObject(dataElementMap)) {
                $.each(dataElementMap, function(channelId, datas){
                    if (!originalDataGroup[group].hasOwnProperty(channelId)) originalDataGroup[group][channelId] = [];
                    originalDataGroup[group][channelId].push(datas);
                });
            }
            console.log('originalDataGroup', originalDataGroup);
        });

        // 生成分类控件
        // var groupPanelHtml = '';
        var groupData = [];

        $.each(originalDataList, function(i,item) {
            var group = {id:'g_'+item.id,name:item.group,parentId:null,type:"group"}
            groupData.push(group);
            var channelList =originalDataList[i].specification.channelList;
            $.each(channelList, function(i,it){
                var channel = {id:'c_'+it.id,name:it.name,parentId:group.id,type:"channel"};
                groupData.push(channel);
            })
        });

        $groupPanel = $("#groupList tbody").tree({
            data:groupData,
            animate: true,
            checkbox : true,
            onlyLeafCheck : true,
            idField:'id',
            textField:'name',
            parentField:'parentId',
            lines: true,
            onClick: function(node){
                if(node.type == 'channel'){
                    var parentNode = $groupPanel.tree('getParent',node.target);
                    for (var i = 0;i<originalDataList.length;i++) {
                        if (originalDataList[i].id==parentNode.id.substring(2)) {
                            currentOriginalData = originalDataList[i];
                            currentChannel = node.id.substring(2);
                            break;
                        }
                    }
                    if(currentOriginalData){
                        $("#searchDiv").show();
                        $("#startTime").text(currentOriginalData.time.startTime.value);
                        $("#timeInterval").text(currentOriginalData.time.timeInterval.value+currentOriginalData.time.timeInterval.dimension);
                        //drawData();
                    }
                }
            },
            onBeforeCheck : function(node,checked){
                if(checked){
                    var nodes =  $groupPanel.tree('getChecked');
                    if(nodes && nodes.length >=2){
                        $.messager.show({ title : '提示', msg : '最多只能对比两个通道' });
                        $groupPanel.tree('uncheck', node.target);
                        return false;
                    }
                }

            },
            onCheck : function(node, checked) {
                if(originalDataList[0].hasOriginalData){
                    $("#echart").show();
                    $("#blankTips").hide();
                    dealData();
                }else {
                    $("#echart").hide();
                    $("#blankTips").show();
                    $("#echartConfigWarning").text("该通道没有原始数据可以展示");
                }

            }
        });

        // 分类控件
        // $groupPanel.html(groupPanelHtml);
        // $groupRadios = $groupPanel.find(".groupRadio");
        // 分类控件事件
        /*
       $groupRadios.on('change', function() {
            currentGroup = $groupRadios.filter(":checked").val();
            console.log('currentGroup', currentGroup);
            // 加载该分类的通道
            // 查找到该分类的原始数据
            var originalData = null;
            for (var i = 0;i<originalDataList.length;i++) {
                if (originalDataList[i].group==currentGroup) {
                    originalData =originalDataList[i];
                    break;
                }
            }
            // var foundResult = $.grep(originalDataList, function(elem, i) {
            //     return elem.group = currentGroup;
            // });
            console.log('originalDataList', originalDataList );
            console.log('originalData', originalData );
            if (originalData) {
                // 通道
                var specification = originalData.specification,
                    channelList = specification.channelList;
                console.log('specification', specification);
                console.log('channelList', channelList);
                // 生成通道控件/事件
                if (channelList && channelList.length > 0) {
                    var channelPanelHtml = '', channelNameList = [];
                    $.each(channelList, function(i, channel) {
                        channelPanelHtml += '<tr><td>' +
                            '<label>' +
                            '<input type="radio" class="channelRadio" name="channel" value="'+channel.name+'" />' + channel.name +
                            '</label>' +
                            '</td></tr>';
                        channelNameList.push(channel.name);
                    });
                    $channelPanel = $("#channelList tbody");
                    $channelPanel.html(channelPanelHtml);
                    // 绑定radio点击事件
                    $channelPanel.find('.channelRadio').on('change', function(){
                        currentChannel = $channelPanel.find('.channelRadio').filter(":checked").val();
                        // 该通道的数据
                        console.log('currentGroup', currentGroup);
                        var currentGroupData = null;
                        for (var i=0;i<originalDataList.length;i++) {
                            if (originalDataList[i].group == currentGroup) {
                                currentGroupData = originalDataList[i];
                                currentOriginalData = originalDataList[i];
                                break;
                            }
                        }
                        console.log('currentGroupData', currentGroupData);
                        drawData(currentGroupData);
                    });
                }
            }
        });

        //------------无分类，只有通道版本。begin-------------

        var channelList;

        for (var i = 0;i<originalDataList.length;i++) {
            var originalData = originalDataList[i];
            var specification = originalData.specification;
            channelList=specification.channelList;
            currentGroup = originalDataList[i].group;
        }
        // 通道
        console.log('channelList', channelList);
        // 生成通道控件/事件
        if (channelList && channelList.length > 0) {
            var channelPanelHtml = '', channelNameList = [];
            $.each(channelList, function(i, channel) {
                channelPanelHtml += '<tr><td>' +
                    '<label>' +
                    '<input type="radio" class="channelRadio" name="channel" value="'+channel.name+'" />' + channel.name +
                    '</label>' +
                    '</td></tr>';
                channelNameList.push(channel.name);
            });
            $channelPanel = $("#channelList tbody");
            $channelPanel.html(channelPanelHtml);
            // 绑定radio点击事件
            $channelPanel.find('.channelRadio').on('change', function(){
                currentChannel = $channelPanel.find('.channelRadio').filter(":checked").val();
                // 该通道的数据
                console.log('currentGroup', currentGroup);
                var currentGroupData = null;
                for (var i=0;i<originalDataList.length;i++) {
                    if (originalDataList[i].group == currentGroup) {
                        currentGroupData = originalDataList[i];
                        currentOriginalData = originalDataList[i];
                        break;
                    }
                }
                console.log('currentGroupData', currentGroupData);

                drawData(currentGroupData);
            });
        }

        //------------无分类，只有通道版本。End-------------


        //绘制原始数据 start
        function drawData(){
            if (currentOriginalData) {
                $.each(currentOriginalData.data.dataElementMap , function(channelName, dataElement) {

                    if (channelName == currentChannel) {
                        currentChannelData = dataElement.datas;
                        return false;
                    }

                });
                console.log('currentChannelData', currentChannelData);

                //通道名称
                var channelNameList = [];
                var channelList =currentOriginalData.specification.channelList;
                $.each(channelList , function(i, it) {
                    if(it.name == currentChannel){
                        channelNameList.push(it.name);
                    }
                    // channelNameList.push(it.name);
                });

                // 转换时间格式
                var time = currentOriginalData.time,
                    timePattern = time.pattern,
                    startTimeObj = time.startTime,
                    timeIntervalObj = time.timeInterval;

                console.log('timePattern', timePattern);
                // if (timePattern == 0) { // 绝对时间
                var startTime = new Date(startTimeObj.value),
                    timeIntervalValue = timeIntervalObj.value,
                    timeIntervalUnit = timeIntervalObj.dimension;
                console.log('startTime',startTime);
                console.log('timeIntervalUnit',timeIntervalUnit);
                console.log('Time.UNITS[timeIntervalUnit]',Time.UNITS[timeIntervalUnit]);
                var datagridData = [];
                var xAxis = [];

                $.each(currentChannelData, function(i,item){
                    // TODO 不支持毫秒级以下的精度
                    var timeValue = new Date(startTime.getTime() + i * timeIntervalValue  * Time.UNITS[timeIntervalUnit]);
                    var thisTime = major.dateFormatYMDHms(timeValue);

                    datagridData.push({time: thisTime, value: item});

                    xAxis.push(thisTime);
                });
                // console.log('datagridData',datagridData);
                datagrid.datagrid('loadData', datagridData );
                // console.log('currentChannel',currentChannel);
                // 绘制折线图

                // echaart 默认设置
                var d_x_point_count = 500       // 横坐标显示500个点


                // 计算设置
                // var o_max_value = major.MATH.max(currentChannelData),           // 数据中的最小值
                //     o_min_value = major.MATH.min(currentChannelData);                // 数据中的最大值


                var c_x_zoom_percent = d_x_point_count / xAxis.length * 100;
                console.log('c_x_zoom_percent',c_x_zoom_percent);
                var option = {
                    title: {
                        text: currentOriginalData.group
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            params = params[0];
                            return params.value;
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data:legendData
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            myTool1: {
                                show: true,
                                title: '导出Excel',
                                icon: 'image:///static/images/excel.png',
                                onclick: function (){
                                    var param = {taskId:taskId,group:currentOriginalData.group,channel:currentChannel}
                                    var form = $('<form style="dispaly:none" class="hiddenDataGridForm" action="'+ctx+'/dataExport/exportOriginalData?' + major.URL.object2Params( param ) + '" target="_blank" method="post" ></form>');
                                    $("body").append(form);
                                    form.submit();
                                }
                            },
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis: [
                        {
                            data: xAxisData,
                            position:'bottom'
                        }],
                    yAxis: [
                        {
                        type: 'value',
                        scale: true,
                        position:'left'
                        // min: 100500,
                        // max: 100600
                        // boundaryGap: [0.03, 0.03]
                        // axisLine: {onZero: true}
                        }
                    ],
                    dataZoom : {
                        show : true,
                        realtime: true,
                        start : 0,
                        end : 100
                    },
                    series: seriess
                };
                console.log('option',option);
                optiondata = option;
                myEchart.clear();
                myEchart.setOption(option);

                // } else {    // 相对时间

                // }

                // echart
                // echart =

                // datagrid
                // 数据转为datagrid接受的形式
            } else {
                // 没有数据
            }
        }
        //绘制原始数据 End
*/
        var legendData = [];
        var seriess = [];
        var seriesData = [];
        var xAxisData = [];
        var yAxisList = [];
        var group = "";
        var channelIds = [];
        //处理数据想
        function dealData(){
            // legendData.splice(0,legendData.length);
            // seriess.splice(0,seriess.length);
            // seriesData.splice(0,seriesData.length);
            // xAxisData.splice(0,xAxisData.length);
            // timeDatas.splice(0,timeDatas.length);
            // channelIds.splice(0,channelIds.length);
            legendData = [];
            seriess = [];
            seriesData = [];
            xAxisData = [];
            timeDatas = [];
            channelIds = [];
            yAxisList = [];

            nodes =  $groupPanel.tree('getChecked');
            channelDatas = [];
            if(nodes && nodes.length > 0 ){
                $.each(nodes,function (i,item) {
                    console.log('nodes item:', item);
                    var itemId = item.id.substring( 2 );
                    var parentId = item.parentId.substring(2);
                    var OriginalData;
                    var channelData = [];
                    var timeData = [];
                    var parentNode = $groupPanel.tree('getParent',item.target);
                    group = parentNode.name;
                    for (var i = 0;i<originalDataList.length;i++) {
                        if (originalDataList[i].id==parentId) {
                            OriginalData = originalDataList[i];
                            break;
                        }
                    }
                    //图例
                    legendData.push(item.name);
                    channelIds.push(itemId);

                    $.each(OriginalData.data.dataElementMap , function(channelId, dataElement) {
                       if(channelId == itemId){
                           channelData = dataElement.datas;
                           timeData = dataElement.times;
                           return false;
                       }
                    });
                    //数据
                    channelDatas.push(channelData);
                    //时间
                    // TODO 未将时间轴合并
                    // timeDatas =$.unique(timeDatas.concat(timeData));
                    timeDatas = [timeData] ;
                });
                //处理时间
                // TODO 未进行时间排序整理
                //timeDatas = timeDatas.sort();
                console.log('timeDatas sorted');
                var startTime = new Date(timeDatas[0]),
                    timeIntervalValue = originalDataList[0].time.timeInterval.value,
                    timeIntervalUnit = originalDataList[0].time.timeInterval.dimension;
                var times = (new Date(timeDatas[timeDatas.length-1]) - new Date(timeDatas[0])) / Time.UNITS[timeIntervalUnit];

                for (var i = 0;i<channelDatas.length;i++) {
                    // var data = [];
                    // for (var j = 0;j<times;j++){
                    //     var timeValue = new Date(startTime.getTime() + j * timeIntervalValue  * Time.UNITS[timeIntervalUnit]);
                    //     var thisTime = major.dateFormatYMDHms(timeValue);
                    //     xAxisData.push(thisTime);
                    //     var value = findValueByTime(thisTime,channelDatas[i]);
                    //     data.push(value);
                    // }
                    // seriesData.push(data);
                    seriesData.push(channelDatas[i]);

                    console.log('channelDatas[i]:', channelDatas[i]);
                }
                // xAxisData = $.unique(xAxisData);
                xAxisData = timeDatas[0]
                $.each(seriesData,function(i,item){
                    yAxisList.push({
                        type: 'value',
                        position: yAxisList.length==0 ? 'left' : 'right',
                        scale: true
                    })

                    var item={
                        name:legendData[i],
                        type:'line',
                        data:seriesData[i],
                        yAxisIndex: i
                    }
                    seriess.push(item);
                });
                var  seriesHasEffectData = false;
                if (seriess && seriess.length>0) {
                    $.each( seriess , function( i , seriesData ) {
                        if ( seriesData.data && seriesData.data.length>0 ) {
                            seriesHasEffectData = true;
                        }
                    });
                }
                if ( seriesHasEffectData ) {
                    drawMulti();
                }else{
                    $("#echart").hide();
                    $("#blankTips").show();
                    $("#echartConfigWarning").text("没有找到有效的数据用于展示");
                }

            }else{
                $("#echart").hide();
                $("#blankTips").show();
                $("#echartConfigWarning").text("请选择通道");
            }
        }

        function findValueByTime(time,data) {
            for (var i = 0;i<timeDatas.length;i++) {
                var timeValue = new Date(timeDatas[i]);
                var thisTime = major.dateFormatYMDHms(timeValue);
                if(time == thisTime){
                    return data[i];
                }
            }
            return "-";
        }
        //多选画多条折线
        function  drawMulti() {

            // 计算缩放比例
            var visibleLimit = 1000,
                zoomPercent =xAxisData.length>visibleLimit? ( visibleLimit / xAxisData.length * 100) : 100;

            var option = {
                title: {
                    text: group
                },
                tooltip: {
                    trigger: 'axis'
                    // formatter: function (params) {
                    //     params = params[0];
                    //     return params.value;
                    // },
                    // axisPointer: {
                    //     animation: false
                    // }
                },
                legend: {
                    data:legendData
                },
                toolbox: {
                    show : true,
                    feature : {
                        myTool1: {
                            show: true,
                            title: '导出Excel',
                            icon: 'image:///static/images/excel.png',
                            onclick: function (){
                                var param = {taskId:taskId,group:group,channel:channelIds}
                                var form = $('<form style="display:none" class="hiddenDataGridForm" action="'+ctx+'/dataExport/exportOriginalData?' + major.URL.object2Params( param ) + '" target="_blank" method="post" ></form>');
                                $("body").append(form);
                                form.submit();
                            }
                        },
                        saveAsImage : {show: true}
                    }
                },
                xAxis: [
                    {
                        data: xAxisData,
                        position:'bottom'
                    }],
                yAxis: yAxisList,
                dataZoom : {
                    show : true,
                    realtime: true,
                    start : 0,
                    end : zoomPercent
                },
                series: seriess
            };
            console.log('option:', option);
            myEchart.clear();
            myEchart.setOption(option);
        }
        
        datagrid = $('#datagrid').datagrid({
            data: [],
            pagination : true,
            fit:true,
            fitColumns:true,
            border:false,
            columns : [ [
                {field:'ck',checkbox:true},
                {field:'time',width:100,title:'时间', align:'center',sortable:true,type:"string",editor:'text',
                    formatter:function(value,row,index){
                        return row.time;
                    }
                },                {field:'value',width:100,title:'实验值',align:'center',sortable:true,type:"string",editor:'text',
                    formatter:function(value,row,index){
                        return row.value;
                    }
                }
            ] ]
        });
    }
    Control._initBlank = function() {
        console.log('blank');
        $("#mainLayout").html('<div class="datagrid-empty">无数据</div>');
    }
    Control.setOptionData = function(startTime,endTime){
        var start,end;
        var time1 = (new Date(startTime) - new Date(timeDatas[0])) / Time.UNITS[originalDataList[0].time.timeInterval.dimension];
        var time2 = (new Date(endTime) - new Date(timeDatas[0])) / Time.UNITS[originalDataList[0].time.timeInterval.dimension];
        if(time1 < time2){
            if(time1 <= 0 || time1 >= timeDatas.length){
                start = 0;
            }else{
                start = (time1 / timeDatas.length) * 100;
            }
            if(time2 <= 0 || time2 >= timeDatas.length){
                end = 100;
            }else{
                end = (time2 / timeDatas.length) * 100;
            }
        }else{
            start = 0;
            end = 100;
        }

        var oldOption = myEchart.getOption();
        var newOption=$.extend(true,{},oldOption, {
            dataZoom : {
                show : true,
                realtime: true,
                start : start,
                end : end
            }
        });
        myEchart.clear();
        myEchart.setOption(newOption)
    }
    window.Control = Control;
})();

function search1(){
    var startTime = $('#planStartTimeId').datetimebox('getValue');
    var endTime = $('#planEndTimeId').datetimebox('getValue');

    Control.setOptionData(startTime,endTime);
}