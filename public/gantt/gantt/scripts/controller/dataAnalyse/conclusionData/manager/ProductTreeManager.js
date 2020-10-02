!function(){

    var ProductTreeManager = function() {
        this.$productTree = null;
        this.currentBomId = null;
        this.init();
    };
    $.extend(true, ProductTreeManager.prototype, {
        init: function(opts) {
            var self = this;
            this.$productTree = $("#productTree").treegrid({
                data: [],
                animate: true,
                cascadeCheck: true,
                idField: 'id',
                fit: true,
                fitColumns:true,
                emptyMsg : '请在TBOM树中选择一个试验项目',
                treeField: 'name',
                parentField: 'parentId',
                checkbox: true,
                showHeader: false,
                lines: true,
                columns : [ [
                    {field:'name',width:280,align:'left',sortable:false,type:"string",editor:'text',
                        formatter:function(value,row,index){
                            return row.name;
                        }
                    }
                ]],
                onCheckNode: function (node, checked) {
                    if (checked) {
                        if (node.nodeType == "task") {
                            self.events.taskChecked.call(self, node);
                        } else if (node.nodeType == "productCode") {
                            self.events.productChecked.call(self, node);
                        }
                    } else {
                        if (node.nodeType == "task") {
                            self.events.taskUnchecked.call(self, node);
                        } else if (node.nodeType == "productCode") {
                            self.events.productUnchecked.call(self, node);
                        }
                    }
                },
                onLoadSuccess: function(row, data) {
                    $("#productTree").treegrid('autoSizeColumn','name');
                    // if (data && data.length>0) {
                    //     $.each(data, function(i, node) {
                    //         data.task = self.transRowToTask(node);
                    //     });
                    // }
                }
            });
            return this.$productTree;
        },
        loadTestProjectTasks: function(testProjectIds) {
            var self = this;
            $.messager.progress();
            $.ajax(ctx + "/pmTaskInfo/taskAndProductCodeTree", {
                data: {
                    testProjectIds: testProjectIds,
                    hasChild:"1"
                },
                async: false,
                success: function (rst) {
                    if (typeof rst == 'string') {
                        try {
                            rst = JSON.parse(rst);
                        } catch(e) {
                            console.error("解析/pmTaskInfo/taskAndProductCodeTree返回的数据出错, rst:" + rst);
                            return parent.$.messager.alert('失败', defaultErrorMsg , 'error');
                        }
                    }
                    if( rst.success != false ) {
                        // [{id:x, nodeType:'task', state:'open', bomId: bomId, children: [{id: i++, name: it, nodeType: 'productCode' , parentId: map.id , taskId : task?.id }..]}..]s
                        self.$productTree.treegrid('loadData', rst);
                    } else {
                        parent.$.messager.alert('失败', rst.msg || defaultErrorMsg , 'error');
                    }
                },
                error: function() {
                    parent.$.messager.alert('失败', '加载产品失败' , 'error');
                },
                complete: function() {
                    $.messager.progress('close');
                }
            });
        },
        loadBomTasks: function(bom) {
            var self = this;
            if (bom.id != this.currentBomId) {
                $.ajax(ctx + "/pmTaskInfo/taskAndProductCodeTree", {
                    data: {
                        bomId: bom.id,
                        hasChild:"1"
                    },
                    async: false,
                    success: function (rst) {
                        // [{id:x, nodeType:'task', state:'open', bomId: bomId, children: [{id: i++, name: it, nodeType: 'productCode' , parentId: map.id , taskId : task?.id }..]}..]
                        self.$productTree.treegrid('loadData', rst);
                    }
                });
                self.currentBomId = bom.id;
            }
        },
        removeBomTasks: function(bomId) {
            var self = this;
            var data = this.$productTree.treegrid('getData' );
            var idsToRemove = [];
            $.each(data, function(i, row){
                if(row.nodeType == 'task' && row.bomId == bomId) {
                    idsToRemove.push(row.id);
                }
            });
            if (idsToRemove.length>0) {
                $.each(idsToRemove, function(i, id) {
                    self.$productTree.treegrid('uncheckNode', id);
                    self.$productTree.treegrid('remove', id);
                });
                if (self.currentBomId==bomId) self.currentBomId = null;
            }
        },
        findBatch: function(row) {      // 找到某节点所属于的大批次
            return this.$productTree.treegrid('getParent', row.id);
            // var self = this,
            //     batch = findBatch(row);
            // return batch;
            //
            // function _find(node) {
            //     var parent = self.$productTree.treegrid('getParent', node.id);
            //     if (parent) {
            //         if (parent.taskInfoType == PmTaskInfo.TASKINFOTYPE.BATCH.type) {
            //             return parent;
            //         } else {
            //             _find(parent);
            //         }
            //     } else {
            //         return null;
            //     }
            // }
        },
        // transRowToTask: function(row) {        // 将row转为batch
        //     return new PmTaskInfo({
        //         id: row.entityId,
        //         name: row.name,
        //         taskInfoType: PmTaskInfo.TASKINFOTYPE.BATCH.type
        //     });
        // },
        events: {
            taskChecked: function(row) {
                // var batchRow = this.findBatch(row);
                // if (batchRow) {
                //     xAxisSelector.addBatch(batchRow);
                // }
                controller.autoDraw();
            },
            taskUnchecked: function(row) {
                // xAxisSelector.removeBatch(row);
                controller.autoDraw();
            },
            productChecked: function(row) {
                // var batchRow = this.findBatch(row);
                // if (batchRow) {
                //     xAxisSelector.addBatch(batchRow);
                // }
                // // 增加产品编号
                // xAxisSelector.addProduct(row);
                controller.autoDraw();
            },
            productUnchecked: function(row) {
                // 移除产品编号
                // xAxisSelector.removeProduct(row);
                controller.autoDraw();
            }
        },
        data: {
            getSelectedBatchTasks: function(){
                var self = this;
                // 获得勾选的产品编号
                // 返回: [{id: 1, name: '生一批', productCodes: ['Z01-01'...]},..]    批次任务信息 + 产品编号
                var result = [];
                var nodes = this.$productTree.treegrid('getCheckedNodes');
                if (nodes && nodes.length>0) {
                    $.each(nodes, function(i,item){
                        if (item.nodeType == "task") {
                            addTaskNode(item);
                        } else if (item.nodeType == "productCode") {
                            // 找寻批次任务
                            var task = major.find(result, 'id', item.parentId.substring(2));
                            if (!task) {
                                // 添加批次任务
                                var taskRow = self.$productTree.treegrid('getParent', item.id );
                                task = addTaskNode(taskRow);
                            }
                            task.children.push($.extend(true, {}, item));
                        }
                    });

                    function addTaskNode(row) {
                        var taskId = row.id.substring(2),
                            task = major.find(result, 'id', taskId);
                        if (!task) {
                            task = $.extend(true, {}, row);
                            task.id = taskId;
                            task.children = [];
                            result.push(task);
                        }
                        return task;
                    }
                }
                return result;
            }
        }
    });
    window.ProductTreeManager = ProductTreeManager;
}();