var bomTree;
var projectDatagrid, ldSelectWnd, createTaskWnd;
// 勿删   在app.js中用到
var projectTemplate, // 项目(任务书)模板
    rootTask,       // 根任务
    testProjects;   // 各级指标

var appInit = function(){
    var crudManager = gantt.crudManager;
    $(function(){
        projectDatagrid = $('#projectDatagrid').datagrid({
            url : ctx + '/pmProjectInfo/datagrid',
            pagination : false,
            fit:true,
            fitColumns:true,
            border:false,
            singleSelect: true,
            columns : [ [
                {field:'name',title:'名称',align:'left',sortable:true,type:"string",editor:'text',
                    formatter:function(value,row,index){
                        return row.name;
                    }
                }] ],
            onSelect: function(index, node){
                var id = node.id;

                $.messager.progress();
                try {
                    $.ajax(ctx + "/pmProjectInfo/show", {
                        data: {id: id},
                        success: function (rst) {
                            GanttConfig.projectId = id;
                            crudManager.transport.load.params.projectId = id;
                            crudManager.transport.sync.params.projectId = id;
                            crudManager.load(
                                // here is callback
                                function () {
                                },
                                // here is errback
                                function (response) {
                                    alert('错误: ' + response.message);
                                }
                            );

                            var projectTemplate = rst.obj;
                            projectTemplate.prepareStartTime = Ext.Date.parse(projectTemplate.prepareStartTime, Ext.Date.patterns.ISO8601Long);
                            projectTemplate.prepareEndTime = Ext.Date.parse(projectTemplate.prepareEndTime, Ext.Date.patterns.ISO8601Long);
                            projectTemplate.implementStartTime = Ext.Date.parse(projectTemplate.implementStartTime, Ext.Date.patterns.ISO8601Long);
                            projectTemplate.implementEndTime = Ext.Date.parse(projectTemplate.implementEndTime, Ext.Date.patterns.ISO8601Long);
                            projectTemplate.assessmentStartTime = Ext.Date.parse(projectTemplate.assessmentStartTime, Ext.Date.patterns.ISO8601Long);
                            projectTemplate.assessmentEndTime = Ext.Date.parse(projectTemplate.assessmentEndTime, Ext.Date.patterns.ISO8601Long);
                            window.projectTemplate = projectTemplate;
                            // // 创建一个任务书任务
                            // var roottask = new Major.model.Task();
                            // roottask.setName(projectTemplate.name);
                            // roottask.set('taskInfoType',Enum.PmTaskInfo.TaskInfoTypeObj.book.type);
                            // roottask.set('bomId',projectTemplate.bomId);
                            // window.rootTask = roottask;
                            // 查询该模板的子任务
                            $.ajax(ctx + "/bomTestProject/combox", {
                                data: {bomId: projectTemplate.bomId},
                                async: false,
                                success: function (rst) {
                                    var tree = major.buildTree(rst, 'parentId', 'id', 'name');
                                    window.testProjects = tree;
                                }
                            });
                            // 直接使用点击新建批次时请求的试验列表
                            // gantt.taskStore.append(roottask);
                        }
                    });
                }catch(e) {
                    $.messager.alert("错误", "数据加载失败", 'error');
                } finally {
                    $.messager.progress('close');
                }
            }
        });

        $("#ganttContainer").panel({
            onResize : function (width,height) {
                resizeGanttPanel(width,height);
            }
        });

        $('#bomPanel').panel({
            onResize:function (width, height) {
                var columnOption = $("#bomTree").treegrid('getColumnOption','name');
                var w = columnOption.width/width*100;
                w = w > 100 ? w : 100;
                $("#bomTreeParentId")[0].style.width=w+"%";
                $("#bomPanel").panel('doLayout');
            }
        });

        // 新建任务窗口
        createTaskWnd = $('#createTaskWnd').dialog({
            title: '新建任务',
            closed: true,
            cache: false,
            width: 600,
            height: 600,
            modal: true/*,
            buttons: [{
                text:'确定',
                handler:function() {
                    var data = $("#createTaskFrame")[0].contentWindow.getData();
                    if (data.success) {
                        Major.plugin.TaskContextMenu.prototype.itemHandlers.createTask(data.data);
                        createTaskWnd.dialog('close');
                    }
                }
            },{
                text:'取消',
                handler:function() {
                    createTaskWnd.dialog('close');
                }
            }]*/
        });

        // 分配资源窗口
        $('#assignResourceDiv').dialog({
            title: '分配资源',
            maximized: true,
            closed: true,
            cache: false,
            modal: true,
            buttons: [{
                text:'确定',
                handler:function() {
                    Major.plugin.TaskContextMenu.prototype.submitAssign($('#assignResourceDiv').data("task"));
                    $('#assignResourceDiv').dialog('close');
                }
            },{
                text:'取消',
                handler:function() {
                    $('#assignResourceDiv').dialog('close');
                }
            }]
        });

        // 选择分队窗口
        ldSelectWnd = $('#ldSelectWnd').dialog({
            title: '选择分队',
            closed: true,
            cache: false,
            modal: true,
            width: 500,
            height: 640
        });

        // initGantt();
    });

};

// 获得选中的项目
function getSelectedProject() {
    return projectDatagrid.datagrid('getSelected');
}

function search(){
    var params =  $.extend({}, {dept: true}, $("#queryForm").serializeForm())
    bomTree.treegrid('load', params);
}
var ganttLoadParams = {bomId: 0};
var GanttConfig = {
    editMode: "edit",
    transport: {
        load: {
            params: ganttLoadParams
        }
    },
    listeners: {
        launched: appInit,
        select: function(o, n, i, c) {
            currentTask = o;
        }
    }
};