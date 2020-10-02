(function(){
    var PmTaskInfo = function(opts) {
        opts = opts || {};

        // 持久化属性
        this.projectId = opts.projectId;
        this.taskInfoType = opts.taskInfoType;
        this.parentId = opts.parentId;
        this.name = opts.name;
        this.code = opts.code;
        this.priority = opts.priority;
        this.taskType = opts.taskType;
        this.manager = opts.manager;
        this.state = opts.state;
        this.intention = opts.intention;
        this.startDate = opts.startDate ? typeof opts.startDate == "string" ? moment(opts.startDate).toDate() : opts.startDate : null;
        this.endDate = opts.endDate ? typeof opts.endDate == "string" ? moment(opts.endDate).toDate() : opts.endDate : null;
        this.realStartTime = opts.realStartTime ? typeof opts.realStartTime == "string" ? moment(opts.realStartTime).toDate() : opts.realStartTime : null;
        this.realEndTime = opts.realEndTime ? typeof opts.realEndTime == "string" ? moment(opts.realEndTime).toDate() : opts.realEndTime : null;
        this.duration = opts.duration;
        this.durationUnit = opts.durationUnit;
        this.cls = opts.cls;
        this.isDelete = opts.isDelete;
        this.deviceId = opts.deviceId;
        this.deviceTestTypeId = opts.deviceTestTypeId;
        this.attrUploadedData = opts.attrUploadedData;
        this.attrAddedInfo = opts.attrAddedInfo;
        this.attrMountToTbom = opts.attrMountToTbom;
        this.latestUpdateDate = opts.latestUpdateDate;
        this.level = opts.level;
        // 不再返回 lft rgt
        // this.lft = opts.lft;
        // this.rgt = opts.rgt;
        // 关联属性
        this.managerName = opts.managerName;
        this.projectName = opts.projectName;

    };
    // 到补充信息页面
    PmTaskInfo.prototype.toImproveInfo = function () {
        PmTaskInfo.toImproveInfo(this.id, this.name);
    };
    // 确认补充信息
    PmTaskInfo.prototype.confirmImproveInfo = function () {
        PmTaskInfo.confirmImproveInfo(this.id, this.name);
    };
    // 已到警告时间
    PmTaskInfo.prototype.underAlarm = function () {
        return PmTaskInfo.underAlarm(this.state, this.endDate);
    };
    // 已到延期时间
    PmTaskInfo.prototype.underDelay = function () {
        return PmTaskInfo.underDelay(this.state, this.endDate);
    };
    // 操作 - 挂载产品
    PmTaskInfo.prototype.mountTask = function () {
        PmTaskInfo.mountTask();
    };
    // 操作 - 上传数据文件
    PmTaskInfo.prototype.uploadDataFile = function () {
        PmTaskInfo.uploadDataFile();
    };
    // 操作 - 开始任务
    PmTaskInfo.prototype.changeStateToDoing = function () {
        PmTaskInfo.changeStateToDoing(this.id);
    };
    // 操作 - 完成任务
    PmTaskInfo.prototype.changeStateToComplete = function () {
        PmTaskInfo.changeStateToComplete(this.id);
    };


    // 静态方法
    // 获得信息
    PmTaskInfo.get = function(id) {
        var task = null;
        $.ajax(ctx + "/pmTaskInfo/show", {
            data: {id: id},
            async: false,
            success: function(rst) {
                task = rst.obj;
            }
        });
        return task;
    };
    // 到补充信息页面
    PmTaskInfo.toImproveInfo = function (id) {
        TabRegister.open(new TabRegister.TABS.PmTaskInfo.detail({id: id}));
    };
    // 确认补充信息
    PmTaskInfo.confirmImproveInfo = function (id, name, callback) {
        $.messager.confirm('提示', '确认该任务的信息已经补充完整?', function (r) {
            $.post(ctx + "/pmTaskInfo/edit", {id: id, attrAddedInfo: 1} , function(rst) {
                if (rst.success) {
                    $.messager.show({
                        title: '成功',
                        msg: '操作成功'
                    });
                    typeof callback == "function"? callback():null;
                }
            })
        });
    };
    // 已到警告时间
    PmTaskInfo.underAlarm = function (state, endDate) {
        return (state != PmTaskInfo.STATE.COMPLETE.type && endDate < moment().add(CONFIG.alarmDays, 'days').toDate());
    };
    // 已到延期时间
    PmTaskInfo.underDelay = function (state, endDate) {
        return (state != PmTaskInfo.STATE.COMPLETE.type && endDate < moment().subtract(CONFIG.delayDays, 'days').toDate());
    };
    // 操作 - 挂接任务
    PmTaskInfo.mountTask = function (id,name ){
        //$.messager.alert('提示', '此处有挂载!', 'info');
        console.log("id:"+id);
        mountDialog.show(id,name);
    };
    // 操作 - 挂载数据
    PmTaskInfo.mountData = function (id,name ){
        mountDataDialog.show(id,name);
    };
    // 操作 - 上传数据文件
    PmTaskInfo.uploadDataFile = function (id) {
        $.messager.alert('提示', '请使用采集软件上传试验数据文件', 'info');
    };
    // 操作 - 开始任务
    PmTaskInfo.changeStateToDoing = function (id,func) {
        $.messager.confirm('提示', '确认要开始该任务吗?', function (r) {
            if (r) {
                $.ajax(ctx + '/pmTaskInfo/changeState', {
                    // TODO state使用枚举
                    data: {id: id, state: "20"},
                    success: function (rst) {
                        if ( rst.success ) {
                            $.messager.show({title: '提示', msg: '操作成功！'});
                            typeof func == "function" && func( );
                        } else {
                            $.messager.alert('失败' , rst.msg || defaultErrorMsg );
                        }
                    },
                    error: function() {
                        $.messager.alert('错误' ,  defaultErrorMsg );
                    }
                })
            }
        });
    };
    // 操作 - 完成任务
    PmTaskInfo.changeStateToComplete = function (id,func) {
        var task;
        if (!(id instanceof PmTaskInfo)) {
            task = PmTaskInfo.get(id);
        } else {
            task = id;
        }
        if (!task.attrUploadedData) {
            $.messager.alert("提示", "上传数据后才能完成任务, 请先上传数据", "info");
            return false;
        }
        if (!task.attrAddedInfo) {
            $.messager.alert("提示", "补充任务信息后才能完成任务, 请先补充任务信息", "info");
            return false;
        }
        // if (!task.attrMountToTbom) {
        //     $.messager.alert("提示", "挂载产品后才能完成任务, 请先挂载产品", "info");
        //     return false;
        // }
        $.messager.confirm('提示', '确认要完成该任务吗?', function (r) {
            if (r) {
                $.ajax(ctx + '/pmTaskInfo/changeState', {
                    data: {id: id, state: "100"},
                    success: function (rst) {
                        $.messager.show({title : '提示',msg : '操作成功！'});
                        //TODO 刷新列表
                        func();
                    }
                })
            }
        });
    };
    // 操作 - 重新开始任务
    PmTaskInfo.restartTask = function (id,func) {
        $.messager.confirm('提示', '确认要重新开始该任务吗?', function (r) {
            if (r) {
                $.ajax(ctx + '/pmTaskInfo/changeState', {
                    // TODO state使用枚举
                    data: {id: id, state: "20"},
                    success: function (rst) {
                        if ( rst.success ) {
                            $.messager.show({title: '提示', msg: '操作成功！'});
                            typeof func == "function" && func( );
                        } else {
                            $.messager.alert('失败' , rst.msg || defaultErrorMsg );
                        }
                    },
                    error: function() {
                        $.messager.alert('错误' ,  defaultErrorMsg );
                    }
                })
            }
        });
    };
    // 操作 - 上传数据到主站
    PmTaskInfo.uploadTestDataToMain = function (id,func) {
        $.messager.confirm('提示', '确认要将该任务的信息及数据提交到主站吗?', function (r) {
            if (r) {
                $.ajax(ctx + '/rfSync/syncTaskToTDM', {
                    data: {taskId: id},
                    success: function (rst) {
                        if ( rst.success ) {
                            $.messager.show({title: '提示', msg: '操作成功！'});
                            typeof func == "function" && func( );
                        } else {
                            $.messager.alert('失败' , rst.msg || defaultErrorMsg );
                        }
                    },
                    error: function() {
                        $.messager.alert('错误' ,  defaultErrorMsg );
                    }
                })
            }
        });
    };
    PmTaskInfo.toAssignmentResource = function(opts) {
        opts = opts || {};
        if ($("#taskAssignmentResourceWindow").length==0) {
            init();
        }
        var paramString = major.URL.object2Params(opts);
        var frame = document.getElementById('taskAssignmentResourceFrame');
        frame.src = ctx + "/gantt/assignResourceWnd?" + paramString;
        var wnd = frame.window || frame.contentWindow;
        taskAssignmentResourceWindow.dialog('open');

        function init() {
            var html = '<div id="taskAssignmentResourceWindow" style="width:60%;height:100%;max-width:800px;"> <iframe src="" frameborder="0" id="taskAssignmentResourceFrame" style="width:100%; height:98%;"></iframe> </div>';
            $(document.body).append(html);

            taskAssignmentResourceWindow = $('#taskAssignmentResourceWindow').dialog({
                cls: 'dialog',
                title: '分配资源',
                closed: true,
                modal: true,
                maximized: true,
                width: 1200,
                maxWidth: 100000
            });
        }
    };
    // 将一份数据文件应用到任务上
    PmTaskInfo.applyProductTestInfo = function( taskId , testInfoId ) {
        $.messager.confirm('提示', '确定要将数据文件应用到该任务上吗?' , function ( r) {
            if (r ) {
                $.post( ctx + '/pmTaskInfo/applyProductTestInfo', {
                    taskId : taskId,
                    testInfoId : testInfoId
                }, function(rst) {
                    if (rst.success ) {
                        $.messager.show({title: '成功', content: rst.msg || '操作成功'});
                    } else{
                        $.messager.alert('失败', rst.msg || defaultErrorMsg , 'error');
                    }
                })
            }
        })
    };
    window.PmTaskInfo = PmTaskInfo;
})();