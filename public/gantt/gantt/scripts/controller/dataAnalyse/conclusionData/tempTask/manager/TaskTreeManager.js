!function(){

    var TaskTreeManager = function() {
        this.$taskTree = null;
        this.firstLoad = true;

        this.selectedTasks = [];

        this.events = {
            loadSuccess: function(row, data) {

            },
            taskChecked: function(row) {
                channelTreeManager.addTask( row );
            },
            taskUnchecked: function(row) {
                channelTreeManager.removeTask(row);
                controller.autoDraw();
            }
        };

        this.init();
        return this;
    };
    $.extend(true, TaskTreeManager.prototype, {
        init: function(opts) {
            console.log('init');
            var self = this;
            // [id: 'b_' + it.id, text: it.name, state: count>0?'closed':'open', nodeType: 'tbom', iconCls: 'tree-icon-tbom']
            // [id: 'p_' + it.id, text: it.name, state: testProjectList.size()>0?'open':'closed',nodeType: 'test', iconCls: 'tree-icon-project']
            self.$taskTree = $("#taskTree").treegrid({
                animate: false,
                idField:'id',
                treeField: 'name',
                parentField: 'parentId',
                border: false,
                lines: false,
                emptyMsg : '无临时任务数据',
                fit:true,
                fitColumns: true,
                checkbox: function(row) {
                    return row.id != "temp";
                },
                showHeader: false,
                cascadeCheck: false ,
                columns : [ [
                    {field:'name',width:280,align:'left',sortable:false,type:"string",editor:'text',
                        formatter:function(value,row,index){
                            return row.name;
                        }
                    }
                ]],
                onCheckNode:function(row,checked){
                    if (checked) {
                        self.events.taskChecked.call( self , row );
                    } else {
                        self.events.taskUnchecked.call(self, row);
                    }
                },
                onLoadSuccess: function(row, data) {
                    $("#taskTree").treegrid('autoSizeColumn','name');
                }
            });
            self.fn.load.call(self);
            return self;
        },
        fn: {
            load: function(opts) {
                opts = opts || {};

                var self = this;
                opts = $.extend({
                    taskInfoType: PmTaskInfo.TASKINFOTYPE.TEMP.type,
                    assigned: -1,
                    hasOriginalData: 1
                }, opts );

                $.post(ctx + '/pmTaskInfo/combox', opts, function (rst) {
                    self.$taskTree.treegrid('loadData', []);
                    if (rst && rst.length>0) {
                        self.$taskTree.treegrid('append', {
                            data : [ { id: "temp", name : '临时任务', state: 'open' , children : [] }]
                        });
                        $.each( rst , function( i, row ) {
                            row.parentId = 'temp';
                        });
                        self.$taskTree.treegrid('append', {
                            parent:"temp",
                            data: rst
                        });
                    }
                });
            }
        }
    });
    window.TaskTreeManager = TaskTreeManager;
}();