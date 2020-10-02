!function(){

    var ChannelTreeManager = function() {
        this.$channelTree = null;
        this.init();
    };
    $.extend(true, ChannelTreeManager.prototype, {
        init: function(opts) {
            var self = this;
            self.$channelTree = $("#channelTree").treegrid({
                data: [],
                animate: false,
                idField:'id',
                treeField: 'text',
                parentField: 'pid',
                lines: false,
                fit:true,
                fitColumns:true,
                emptyMsg : '请在TBOM树中选择一个试验项目',
                border: false,
                checkbox:true,
                cascadeCheck:false,
                showHeader: false,
                columns : [ [
                    {field:'text',width:280,align:'left',sortable:false,type:"string",editor:'text',
                        formatter:function(value,row,index){
                            return row.text;
                        }
                    }
                ]],
                onLoadSuccess:function(row,data){
                    $("#channelTree").treegrid('autoSizeColumn','text');
                },
                onCheckNode:function(row,checked){
                    if (checked) {
                        if (row.nodeType == "bomTestProject" || row.nodeType == "bomTestProjects" ) {
                            var children = self.$channelTree.treegrid('getChildren', row.id);
                            if (children && children.length>0) {
                                // 根据 已check的子节点数 与 每个试验任务下可以check的通道数上限 , 确定自动勾选的通道数量
                                var checkedChildrenCount = children ? $.grep( children , function( nodeIndex , node ) { return node.checked; }).length : 0,
                                    toCheckCount = _CONFIG.selectedChannelLimitInATestProject > checkedChildrenCount ? _CONFIG.selectedChannelLimitInATestProject - checkedChildrenCount : 0,
                                    checkLoop = 0;
                                $.each( children , function( i , item ){
                                    if (checkLoop < toCheckCount ) {
                                        if ((item.nodeType == "channel" || item.nodeType == "channels")  && !item.checked) {
                                            checkLoop++;
                                            self.$channelTree.treegrid('checkNode', item.id);
                                        }
                                    } else {
                                        return false;
                                    }
                                });
                            }
                            self.events.testProjectChecked.call(self, row);
                        } else if (row.nodeType == "channel"  || row.nodeType == "channels" ) {
                            self.events.channelChecked.call(self, row);
                        }
                    } else {
                        if (row.nodeType == "bomTestProject" || row.nodeType == "bomTestProjects" ) {
                            var children = self.$channelTree.treegrid('getChildren', row.id);
                            if (children && children.length>0) {
                                $.each(children, function(i, item){
                                    if (item.nodeType == "channel" || item.nodeType == "channels") {
                                        self.$channelTree.treegrid('uncheckNode', item.id);
                                    }
                                })
                            }
                            self.events.testProjectUnchecked.call(self, row);
                        } else if (row.nodeType == "channel" || row.nodeType == "channels") {
                            self.events.channelUnchecked.call(self, row);
                        }
                    }
                }
            });
            return self;
        },
        addTestProject: function(row) {
            var self = this;
            var bomTestProject = row.bomTestProject;
            // 加载通道
            if (!bomTestProject.channels) {
                $.ajax(ctx + "/dataAnalyse/getTestProjectConParams", {
                    data: {
                        id: bomTestProject.id
                    },
                    async: false,
                    success: function (rst) {
                        bomTestProject.channels = rst;
                    }
                });
            }
            // 追加通道
            var testProjectNode = {
                id: "t_" + bomTestProject.id,
                text: bomTestProject.name,
                nodeType : "bomTestProject",
                bomTestProject: bomTestProject
            };
            if (bomTestProject.channels && bomTestProject.channels.length>0) {
                var channelNodes = [];
                $.each(bomTestProject.channels, function(i,channel ){
                    var channelNode = {
                        id: channel.id,
                        text: channel.name,
                        nodeType: 'channel',
                        testProjectId: bomTestProject.id,
                        channel: channel
                    };
                    channelNodes.push(channelNode);
                });
                testProjectNode.children = channelNodes;
                testProjectNode.state = "open";
                self.$channelTree.treegrid('append', {
                    data: [testProjectNode]
                });
                self.findSameChannel();

            }else {
                $.messager.show({ title : '提示', msg : '该试验项目没有参数' });
            }

        },
        removeTestProject: function(row) {
            debug && console.log('channelTreeManager.removeTestProject row:', row);
            var self = this,
                checkedNodes = self.$channelTree.treegrid('getCheckedNodes'),
                checkedChannels = $.grep(checkedNodes, function(i){return (i.nodeType=="channel" || i.nodeType == "channels") && i.testProjectId==row.id}),
                checkedTestProject = $.grep(checkedNodes, function(i){return (i.nodeType=="bomTestProject" || i.nodeType=="bomTestProjects") && i.testProjectId==row.id});
            debug && console.log('channelTreeManager.channels: ', checkedChannels);
            if (checkedChannels && checkedChannels.length>0) {
                $.each(checkedChannels, function(i, channel) {
                    self.events.channelUnchecked(channel);
                });
            }
            if (checkedTestProject && checkedTestProject.length>0) {
                self.events.testProjectUnchecked(row);
            }


            var rowId = row.id=="t_undefined"?"t_undefined":"t_" + row.id.substring(2);
            self.$channelTree.treegrid('checkNode', rowId);
            self.$channelTree.treegrid('uncheckNode', rowId);
            self.$channelTree.treegrid('remove', rowId);

            self.findSameChannel();
        },
        findSameChannel:function () {
            //找出相同的参数
            var self = this;
            var allChildNode = [];
            var roots = self.$channelTree.treegrid('getRoots');
            $.each(roots,function (i,root) {
                var children = self.$channelTree.treegrid('getChildren',root.id);
                allChildNode = allChildNode.concat(children);
            })
            var sameNodes = [];
            $.each(allChildNode,function (i,childNode) {

                var testProjectIds = []
                var testProjectNodes = []
                var channels = []
                $.each(roots,function (i,root) {
                    if (root.id != 't_undefined'){
                        var children = self.$channelTree.treegrid('getChildren',root.id);
                        $.each(children,function (i,child) {
                            if(child.text==childNode.text){
                                testProjectIds.push(child._parentId)
                                testProjectNodes.push(root.bomTestProject)
                                channels.push(child)
                            }
                        });
                    }

                });
                if(testProjectIds.length>1 && !major.find(sameNodes, 'text', childNode.text)){
                    var sameNode = {
                        id:'same_'+childNode.id,
                        text: childNode.text,
                        nodeType: 'channels',
                        testProjectIds: testProjectIds,
                        testProjectNodes:testProjectNodes,
                        channels: channels
                    };
                    sameNodes.push(sameNode)
                }
            });
            if(sameNodes.length>1){
                //追加相同的参数
                var sameTestProjectNode = {
                    id: 't_undefined',
                    text: "共同的参数",
                    nodeType : "bomTestProjects",
                    children:sameNodes,
                    state:'open'
                };
                var sameParent = self.$channelTree.treegrid('find', 't_undefined');
                if(sameParent){
                    self.$channelTree.treegrid('remove', 't_undefined');
                }
                self.$channelTree.treegrid('append', {
                    data: [sameTestProjectNode]
                });
            }else{
                var sameParent = self.$channelTree.treegrid('find', 't_undefined');
                if(sameParent){
                    // self.$channelTree.treegrid('remove', 't_undefined');
                    self.removeTestProject(sameParent);
                }
            }
        },
        events: {
            testProjectChecked: function(row) {
                xAxisSelector.addTestProject(row);
                yAxisSelector.addTestProject(row);
                controller.autoDraw();
            },
            channelChecked: function(row) {
                // 获得该通道的试验项目
                var testProjectNode = this.$channelTree.treegrid('getParent', row.id);
                if (testProjectNode && (testProjectNode.nodeType == "bomTestProject" || testProjectNode.nodeType == "bomTestProjects")) {
                    xAxisSelector.addTestProject(testProjectNode);
                    yAxisSelector.addTestProject(testProjectNode);
                }
                // xAxisSelector.addChannel(row);
                yAxisSelector.addChannel(row);
                controller.autoDraw();
            },
            testProjectUnchecked: function(row) {
                xAxisSelector.removeTestProject(row);
                yAxisSelector.removeTestProject(row);
                controller.autoDraw();
            },
            channelUnchecked: function(row) {
                // xAxisSelector.removeChannel(row);
                yAxisSelector.removeChannel(row);
                controller.autoDraw();
            }
        }
    });
    window.ChannelTreeManager = ChannelTreeManager;
}();