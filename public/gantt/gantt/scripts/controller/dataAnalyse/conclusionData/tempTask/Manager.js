!function() {
    var Manager = function(opts) {
        opts = opts || {};

        this.oldBomId = null;           // 之前选中的bomId
        this.currentBomId = null;       // 当前选中的bomId

        // 缓存任务数据
        this.CACHE_DATA = {};

        // 绘图保存的数据
        // 原始数据
        this.selectedBom = null;          // 选中的试验项目
        this.selectedTasks = null;   // 选中的任务+产品编号   [{id: 1, name: '生一批', productCodes: [{id:索引, name:x, nodeType:'productCodde', parentId:xx, taskId: taskId}...]},..]
        this.selectedTestProjects = null;  // 选中的试验项目+通道信息
        this.multiTestProject = false;      // 是否选中多个试验项目
        this.selectedChannels = null;       // 选中的通道
        this.selectedXAxisTestProjects = null;// 选中的X轴的试验项目
        // 加工过的数据
        this.echartManager = null;
        this.datas = null;              // 任务数据 {taskId: [{taskId: taskId, taskName: taskName, name: name, productCode: productCode, taskTestProjectId: taskTestProjectId, unit: unit, measuredValue: measuredValue, qualified: qualified}..]}
        this.xAxisNameList = null;      // [[Z01-01, Z01-02],[Z02-01,Z02-02]..]
        this.legends = null;
    };

    $.extend(true, Manager.prototype, {
        refresh: function() {
            this.selectedTasks = this.getSelectedTasks();
            this.selectedChannels = this.getSelectedChannels();

            // 获取数据
            this.datas = {};
            this.xAxisNameList = [];
            this.prepareTaskData();
        },
        getSelectedTasks: function() {
            return channelTreeManager.data.getCheckedTasks();
        },
        getSelectedChannels: function() {
            return channelTreeManager.data.getCheckedChannels();
        },
        prepareTaskData: function() {
            var self = this;
            var taskIdsToQuery = [];

            $.each(this.selectedTasks, function(_i, taskRow){
                var taskId = taskRow.id;
                if (!self.CACHE_DATA.hasOwnProperty(taskId)) {
                    taskIdsToQuery.push(taskId);
                }
            });

            // 请求任务的数据
            if (taskIdsToQuery.length>0) {
                this.requestTaskData(taskIdsToQuery);
            }

        },
        requestTaskData : function (ids) { //远程请求任务的原始数据
            var self = this;

            debug && console.log('远程请求任务数据:' + ids);
            // $.messager.progress();
            // $.ajax(ctx + '/dataAnalyse/getTaskConclusionData', {
            //     data: {taskIds: ids},
            //     async: false,
            //     success: function (rst) {
            //         debug && console.log('获得远程数据:' , rst);
            //         // $.each(rst, function (i, item) {
            //         //     if (item && item.length>0) {
            //         //         self.datas[item.taskId] = item;
            //         //         self.CACHE_DATA[item.taskId] = item;
            //         //     }
            //         // });
            //         $.each(rst, function(taskId, taskParamData) {
            //             if (taskParamData && taskParamData.length>0) {
            //                 self.datas[taskId] = taskParamData;
            //                 self.CACHE_DATA[taskId] = taskParamData;
            //             }
            //         })
            //         console.log('请求后的datas: ', self.datas);
            //     },
            //     complete: function() {
            //         $.messager.progress('close');
            //     }
            // });
        },
        getDataType: function(channelData) { //返回通道数据的类型  文字或者数字
            var r = 'number';
            if (channelData && channelData.length>0) {
                $.each(channelData, function(i, _i) {
                    if (_i) {
                        var valueToTest = (controller.echartType == "scatter")? _i[1]: _i;
                        if (valueToTest!='-' && !$.isNumeric(valueToTest)) {
                            r = 'string';
                            return false;
                        }
                    }
                })
            }
            return r;
        },
        getDataEnums: function(channelData) { //返回通道数据的去重  一般是文字的话才用
            var r = [];
            if (channelData && channelData.length>0) {
                $.each(channelData, function(i, _i) {
                    var valueToPush = (controller.echartType=="scatter") ? _i[1] : _i;
                    if (valueToPush!="-" && r.indexOf(valueToPush) == -1) {
                        r.push(valueToPush);
                    }
                })
            }
            return r;
        },
        events: {
            afterDraw: function() {

            }
        }
    });

    window.Manager = Manager;
}();