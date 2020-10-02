!function(){

    var BomTreeManager = function() {
        this.$taskTree = null;

        this.selectedTestProjects = [];

        this.events = {
            loadSuccess: function(row, data) {

            },
            bomChecked: function(row) {
                // manager.events.bomChecked(row.bom);
                controller.autoDraw();
            },
            testProjectChecked: function(row) {
                channelTreeManager.addTestProject(row);
                controller.autoDraw();
            },
            bomUnchecked: function(row) {
                controller.autoDraw();

            },
            testProjectUnchecked: function(row) {
                channelTreeManager.removeTestProject(row);

                var bomId = row.bomTestProject.bomId,
                    bomIdStr = 'b_' + bomId, // b_1
                    checkedNodes = this.$taskTree.treegrid('getCheckedNodes'),
                    found = false;
                $.each(checkedNodes, function(i, node) {
                    if ((node.nodeType == 'tbom' && node.id == bomIdStr) || (node.nodeType == 'test' && node.bomTestProject.bomId == bomId)) {
                        found = true;
                        return false;
                    }
                });
                if (!found) {
                    productTreeManager.removeBomTasks.call(productTreeManager, bomId);
                }
                controller.autoDraw();
            }
        };

        this.init();
        return this;
    };
    $.extend(true, BomTreeManager.prototype, {
        init: function(opts) {
            var self = this;
            // [id: 'b_' + it.id, text: it.name, state: count>0?'closed':'open', nodeType: 'tbom', iconCls: 'tree-icon-tbom']
            // [id: 'p_' + it.id, text: it.name, state: testProjectList.size()>0?'open':'closed',nodeType: 'test', iconCls: 'tree-icon-project']
            self.$taskTree = $("#bomTree").treegrid({
                url: ctx + '/bomBaseinfo/asyncCombobox',
                queryParams:{hasConclusionData:1,dept:true},
                animate: false,
                idField:'id',
                treeField: 'name',
                parentField: 'pid',
                border: false,
                lines: false,
                fit:true,
                fitColumns:true,
                checkbox:true,
                showHeader: false,
                cascadeCheck: false,
                columns : [ [
                    {field:'name',width:280,align:'left',sortable:false,type:"string",editor:'text',
                        formatter:function(value,row,index){
                            return row.text;
                        }
                    }
                ]],
                onCheckNode:function(row,checked){
                    if (checked) {
                        if (row.nodeType == "tbom") {
                            // 如果该节点是收缩的  而且没有子节点  则是没加载  展开
                            if (row.state == "closed" && !row.children) self.$taskTree.treegrid('expand', row.id);
                            // 选中子级试验项目
                            var children = self.$taskTree.treegrid('getChildren', row.id);
                            if (children && children.length > 0) {
                                $.each(children, function (i, child) {
                                    if (child.nodeType == "test" && child._parentId == row.id ) {
                                        self.$taskTree.treegrid('checkNode', child.id);
                                    }
                                })
                            }
                            self.events.bomChecked(row);
                        } else if (row.nodeType == "test") {
                            //
                            // var bomNode = self.$taskTree.treegrid('getParent', row.id);
                            // if(bomNode && bomNode.nodeType == "tbom") {
                            //     productTreeManager.loadBomTasks(bomNode.bom);
                            // }
                            // 清除其他BOM下选择的试验项目(用不到)
                            if (_CONFIG.clearCheckedBomNodeUnderOtherBom) {
                                // 当前选中的所有节点
                                var checkedNodes = self.$taskTree.treegrid('getCheckedNodes');
                                if (checkedNodes && checkedNodes.length>0) {
                                    var nodeList = self.manager.bomStore.getAll(),
                                        parentList = major.upstreamTreeParents(nodeList, row, "pid", "id"),
                                        parentIds = [];
                                    $.each(parentList, function(i, item) {
                                        parentIds.push(item.id);
                                    });
                                    // TODO 确认勾选"引导头"等BOM时,是选中其下所有的试验项目, 还是包含其所有子孙节点的试验项目
                                    // TODO 下面未能排除如果已勾选的节点是本节点的子孙节点的问题
                                    // 非同一父节点下的所有
                                    var allNodes = self.$taskTree.treegrid('getData');
                                    $.each(checkedNodes, function(i, node) {
                                        if (parentIds.indexOf(node.pid)==-1) {
                                            self.$taskTree.treegrid('uncheckNode', node.id);
                                        }
                                    });
                                }
                            }
                            self.events.testProjectChecked(row);
                        }
                        var checkedTests = [],
                            checkedList = self.$taskTree.treegrid('getCheckedNodes');
                        $.each( checkedList , function(i, item) {
                            if (item.nodeType == 'test') {
                                checkedTests.push( item.id.substring(2) );
                            }
                        })
                        if ( checkedTests.length>0)
                            productTreeManager.loadTestProjectTasks( checkedTests) ;
                    } else {
                        if (row.nodeType == "tbom") {
                            // 取消选中子级试验项目
                            var children = self.$taskTree.treegrid('getChildren', row.id);
                            if (children && children.length > 0) {
                                $.each(children, function (i, child) {
                                    if (child.nodeType == "test") {
                                        self.$taskTree.treegrid('uncheckNode', child.id);
                                    }
                                })
                            }
                            // self.events.bomUnchecked(row);
                        } else if (row.nodeType == "test") {
                            var bomTestProject = row.bomTestProject,
                                index = $.indexOf(self.selectedTestProjects, function(item){return item.id == bomTestProject.id});
                            if (index!=-1) {
                                self.selectedTestProjects.splice(index, 1);
                                // 移除通道
                                var testProjectId = "t_" + bomTestProject.id,
                                    checkedChannels = $channelTree.treegrid('getCheckedNodes');
                                $.each(checkedChannels, function(i, item){
                                    if (item.nodeType=="channel") {
                                        if (item.testProjectId == bomTestProject.id) {
                                            // 移除已选通道
                                            var index = $.indexOf(selectedChannels, function(jtem){
                                                return jtem.testProjectId == item.testProjectId
                                            });
                                            if (index!=-1) {
                                                self.selectedTestProjects.splice(index, 1);
                                            }
                                        }
                                    }
                                })
                            }
                            self.events.testProjectUnchecked.call(self, row);
                        }
                    }
                },
                onLoadSuccess: function(row, data) {
                    self.$taskTree.treegrid('autoSizeColumn','name');
                    if (data && data.length>0) {
                        $.each(data, function(i,item) {
                            var id = null;
                            switch (item.nodeType) {
                                case 'tbom':
                                    item.bom = new BomBaseinfo({
                                        id: item.id.substring(2),
                                        name: item.text
                                    });
                                    id = item.bom.id;
                                    break;
                                case 'test':
                                    var bomId = item.pid? item.pid.substring(2): (row? row.id.substring(2): null)
                                    if (bomId) bomId = parseInt(bomId);
                                    item.bomTestProject = new BomTestProject({
                                        id: item.id.substring(2),
                                        name: item.text,
                                        bomId:bomId
                                    });
                                    id = item.bomTestProject.id;
                                    break;
                            }
                            // 判断是否已在已选择的节点中  是则勾选 (防止的是出现搜索后又恢复原样, 则新加载出来的节点应该是勾选的)
                            if ($.indexOf(self.selectedTestProjects, function(jtem){return jtem.id == id;})!=-1) {
                                self.$taskTree.treegrid('checkNode', row.id);
                            }
                        });
                    }
                    self.events.loadSuccess(row, data);
                }
            });
            return self;
        }
    });
    window.BomTreeManager = BomTreeManager;
}();