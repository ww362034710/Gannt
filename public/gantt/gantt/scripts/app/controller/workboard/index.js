var projectTodo, projectPassed, projectFailed, projectAll,
    taskTodo, taskPassed, taskFailed, taskAll,
    problemTodo, problemDoing, problemResolved, problemAll;

$(function(){
    projectTodo = $('#projectTodo').mdatagrid({
        class: 'PmProjectInfo',
        extraParams: {"approvalState": enums.APPROVAL.TODO.type},
        singleSelect:true,
        columns : [
            'name','prepareStartTime','prepareEndTime','implementStartTime','implementEndTime','assessmentStartTime','assessmentEndTime',
            { name: 'op', width: 100, title: '操作', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="btn btn-xs btn-success" onclick="approvalProject(' + row.id + ','+ enums.APPROVAL.PASSED.type+')">通过 </a>'+'&nbsp;&nbsp;' +
                        '<a href="javascript: void(0);" class="btn btn-xs btn-primary" onclick="approvalProject(' + row.id + ','+ enums.APPROVAL.FAILED.type+')"> 驳回</a>';
                }
            }
        ]
    });
    projectPassed = $("#projectPassed");
    projectFailed = $("#projectFailed");
    projectAll = $("#projectAll");

    taskTodo = $('#taskTodo').mdatagrid({
        class: 'PmTaskInfo',
        extraParams: {"approvalState": enums.APPROVAL.TODO.type, taskInfoType: PmTaskInfo.TASKINFOTYPE.NORMAL.type},
        singleSelect:true,
        columns : [
            'bomName','name','departmentName','projectName','startDate','endDate',
            { name: 'op', width: 100, title: '操作', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="btn btn-xs btn-success" onclick="approvalTask(' + row.id + ','+ enums.APPROVAL.PASSED.type+')">通过 </a>'+'&nbsp;&nbsp;' +
                        '<a href="javascript: void(0);" class="btn btn-xs btn-primary" onclick="approvalTask(' + row.id + ','+ enums.APPROVAL.FAILED.type+')"> 驳回</a>';
                }
            }
        ]
    });
    taskPassed = $("#taskPassed");
    taskFailed = $("#taskFailed");
    taskAll = $("#taskAll");

    problemTodo = $('#problemTodo').mdatagrid({
        class: 'PmProblem',
        extraParams: {"state": problemState.TODO.type},
        parentField: 'pid',
        singleSelect:true,
        columns: [
            'taskName', 'organName', 'unitedName', 'weaponModel', 'firstType', 'problemLevel', 'managerName', 'description',
            { name: 'file', width: 100, title: '文件', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a class="link"  href="javascript:void(0);" onclick="downloadFile('+row.problemFile+')">'+row.fileName+'</a>';
                }
            }, { name: 'op', width: 100, title: '操作', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="btn btn-xs btn-primary" onclick="changeState(' + row.id + ','+problemState.DOING.type+')">处理</a>';
                }
            }]
    });

    problemDoing = $('#problemDoing').mdatagrid({
        class: 'PmProblem',
        extraParams: {"state": problemState.DOING.type},
        parentField: 'pid',
        singleSelect:true,
        columns: [
            'taskName', 'organName', 'unitedName', 'weaponModel', 'firstType', 'problemLevel', 'managerName', 'description',
            { name: 'description', width: 100, title: '详细报告', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="link" onclick="dealProblem(' + row.id +',0'+')">查看详细报告</a>';
                }
            },{ name: 'file', width: 100, title: '文件', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a class="link"  href="javascript:void(0);" onclick="downloadFile('+row.problemFile+')">'+row.fileName+'</a>';
                }
            }, { name: 'op', width: 100, title: '操作', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="btn btn-xs btn-primary" onclick="dealProblem(' + row.id +',1'+')">处理</a>';
                }
            }]
    });

    problemResolved = $('#problemResolved').mdatagrid({
        class: 'PmProblem',
        extraParams: {"state": problemState.FINISH.type},
        parentField: 'pid',
        singleSelect:true,
        columns: [
            'taskName', 'organName', 'unitedName', 'weaponModel', 'firstType', 'problemLevel', 'managerName', 'description',
            { name: 'file', width: 100, title: '文件', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a class="link"  href="javascript:void(0);" onclick="downloadFile('+row.problemFile+')">'+row.fileName+'</a>';
                }
            }, { name: 'description', width: 100, title: '详细报告', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="link" onclick="dealProblem(' + row.id +',0'+')">查看详细报告</a>';
                }
            }]
    });

    problemAll = $('#problemAll').mdatagrid({
        class: 'PmProblem',
        parentField: 'pid',
        singleSelect:true,
        columns: [
            'taskName', 'organName', 'unitedName', 'weaponModel', 'firstType', 'problemLevel', 'managerName', 'description',
            { name: 'description', width: 100, title: '详细报告', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a href="javascript: void(0);" class="link" onclick="dealProblem(' + row.id +',0'+')">查看详细报告</a>';
                }
            },{ name: 'file', width: 100, title: '文件', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return '<a class="link"  href="javascript:void(0);" onclick="downloadFile('+row.problemFile+')">'+row.fileName+'</a>';
                }
            }, { name: 'state', width: 100, title: '问题状态', align: 'center', sortable:false, type: "date", editor: "datebox",
                formatter: function (value, row, index) {
                    return problemStateobj[row.state]
                }
            }]
    });


    //问题
    //$("#problemOrginFormId").combobox({
    //    url:ctx+"/department/comboBox?parentIdIsNull=1",
    //    valueField:'id',
    //    textField:'name',
    //    editable:false,
    //    onChange:function (newValue,oldValue) {
    //        var url = ctx+"/department/comboBox?parentId="+newValue;
    //        $('#problemUnitedFormId').combobox('reload',url);
    //    }
    //});
    //
    //$("#problemUnitedFormId").combobox({
    //    valueField:'id',
    //    textField:'name',
    //    editable:false,
    //    onLoadSuccess:function () {
    //        $("#problemUnitedFormId").combobox("clear")
    //    }
    //});

    $('#problemInfoWindow').dialog({
        cls:'dialog',
        title : '详细报告',
        closed: true,
        onResize:function(){
            $(this).dialog('center');
        }
    });
    $("#problemInfoForm").form({
        onSubmit: function(){
            var isValid = $("#problemInfoForm").form('validate');
            if (!isValid){
                $.messager.progress('close');
            }
            return isValid;
        },
        success:function(data){
            data = $.parseJSON(data);
            $.messager.progress('close');
            if(data.success){
                $.messager.show({title : '提示',msg : '处理成功！'});
                problemTodo.datagrid('reload');
                problemDoing.datagrid('reload');
                problemResolved.datagrid('reload');
                problemAll.datagrid('reload');
                $('#problemInfoWindow').dialog('close');
            }else{
                $.messager.alert('提示', data.msg, 'error');
            }
        }
    });
    $("#saveBtn").on("click", function () {
        $("#problemInfoForm").submit();
    });

    // 查询任务
    $(".searchProjectBtn").on('click', function(){
        var tabPanel = $("#projectTab").tabs("getSelected");
        var grid = $(".datagrid-f", tabPanel);
        var params = $(".projectQueryForm").serializeForm();
        grid.datagrid('load', params);
    });

    $(".searchTaskBtn").on('click', function(){
        var tabPanel = $("#taskTab").tabs("getSelected");
        var grid = $(".datagrid-f", tabPanel);
        var params = $(".taskQueryForm").serializeForm();
        grid.datagrid('load', params);
    });

    // 查询问题
    $(".searchProblemBtn").on('click', function(){
        var tabPanel = $("#problemTab").tabs("getSelected");
        var grid = $(".datagrid-f", tabPanel);
        var params = $(".problemQueryForm").serializeForm();
        grid.datagrid('load', params);
    });

});


function changeState(id,state) {
    $.ajax(ctx + '/pmProblem/changeState', {
        data: {id: id, state: state},
        success: function (rst) {
            if ( rst.success ) {
                $.messager.show({title: '提示', msg: '操作成功！'});
                problemTodo.datagrid('reload');
                problemDoing.datagrid('reload');
                problemResolved.datagrid('reload');
                problemAll.datagrid('reload')
            } else {
                $.messager.alert('失败' , rst.msg || defaultErrorMsg );
            }
        },
        error: function() {
            $.messager.alert('错误' ,  defaultErrorMsg );
        }
    })
}
//处理问题
function dealProblem(id,flag) {
    $.ajax({
        url:"/pmProblem/show",
        data:{id:id},
        dataType:"json",
        success:function(response){
            $("#problemInfoForm").form("load",response.obj);
            $("#stateFormId").val(problemState.FINISH.type)
            $('#problemInfoWindow').dialog('open');
            if(flag==0){
                $("#opinionFormId").textbox("readonly",true);
                $("#saveBtn").hide()
            }else{
                $("#opinionFormId").textbox("readonly",false);
                $("#saveBtn").show();
            }
        }
    });
}

//审批任务
function approvalProject(id,approvalState) {
    var title = approvalState== enums.APPROVAL.PASSED.type?"您确定通过该"+L.get('PmProjectInfo')+"？":"您确定驳回该"+L.get('PmProjectInfo')+"？"
    $.messager.confirm('请确认', title, function(r) {
        if (r) {
            $.ajax(ctx + '/pmProjectInfo/changeState', {
                data: {id: id, approvalState: approvalState},
                success: function (rst) {
                    if ( rst.success ) {
                        $.messager.show({title: '提示', msg: '操作成功！'});
                       projectTodo.datagrid('reload');
                       projectPassed.datagrid('reload');
                       projectFailed.datagrid('reload');
                       projectAll.datagrid('reload');
                    } else {
                        $.messager.alert('失败' , rst.msg || defaultErrorMsg );
                    }
                },
                error: function() {
                    $.messager.alert('错误' ,  defaultErrorMsg );
                }
            })
        }
    })

}

function approvalTask(id,approvalState) {
    var title = approvalState==taskAprovalState.PASS.type?"您确定通过该"+L.get('PmTaskInfo')+"？":"您确定驳回该"+L.get('PmTaskInfo')+"？"
    $.messager.confirm('请确认', title, function(r) {
        if (r) {
            $.ajax(ctx + '/pmTaskInfo/approve', {
                data: {id: id, approvalState: approvalState},
                success: function (rst) {
                    if ( rst.success ) {
                        $.messager.show({title: '提示', msg: '操作成功！'});
                        taskTodo.datagrid('reload');
                        taskPassed.datagrid('reload');
                        taskFailed.datagrid('reload');
                        taskAll.datagrid('reload');
                    } else {
                        $.messager.alert('失败' , rst.msg || defaultErrorMsg );
                    }
                },
                error: function() {
                    $.messager.alert('错误' ,  defaultErrorMsg );
                }
            })
        }
    })

}

function downloadFile(sysFileId) {
    window.location.href = ctx + '/file/downloadFile?id='+sysFileId;
}