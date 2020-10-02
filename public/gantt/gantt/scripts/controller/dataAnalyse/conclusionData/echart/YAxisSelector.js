!function(){
    var YAxisSelector = function() {
        this.$con = $("#yAxisSelectCon");
        this.$selector = $("#yAxisSelect");
        this.$list = $("#yAxisList");

        // 当前模式  (参数channel)
        this.currentMode = null;

        this.testProjects = [];     // 试验项目
        this.channels = [];     // 通道

        this.init();
    };

    $.extend(true, YAxisSelector.prototype, {
        init: function() {
            this.$channelTree = $("#yAxisTree_channel").treegrid({
                animate: true,
                cascadeCheck: true,
                idField: 'id',
                fit: true,
                treeField: 'text',
                parentField: 'parentId',
                checkbox: true,
                showHeader: false,
                lines: true,
                columns : [ [
                    {field:'text',width:280,align:'left',sortable:false,type:"string",editor:'text',
                        formatter:function(value,row,index){
                            return row.text;
                        }
                    }
                ]],
                onCheckNode: function(row, checked) {
                    controller.autoDraw();
                }
            });
        },
        addTestProject: function(testProjectRow) {
            if (!$.any(this.testProjects, 'id', testProjectRow.id)) {
                var testProjectClone = $.extend(true, {}, testProjectRow);
                testProjectClone.children = [];
                this.$channelTree.treegrid('append', {
                    data: [testProjectClone]
                });
                this.testProjects.push(testProjectClone);
                controller.autoDraw();
            }
        },
        removeTestProject: function(testProjectRow , skipDraw ) {
            try {
                var children = this.$channelTree.treegrid('getChildren', testProjectRow.id);
                if (children && children.length > 0) {
                    $.each(children, function (i, child) {
                        this.removeChannel(child, true);
                    });
                }

                this.$channelTree.treegrid('remove', testProjectRow.id);
                var index = $.indexOf(this.testProjects, 'id', testProjectRow.id);
                if (index!=-1) {
                    this.testProjects.splice(index, 1);
                    if (!skipDraw )
                        controller.autoDraw();
                }
            } catch(e) {}
        },
        addChannel: function(channelRow) {
            if (!$.any(this.channels, 'id', channelRow.id)) {
                var channelClone = $.extend(true, {}, channelRow);
                this.$channelTree.treegrid('append', {
                    parent: "t_" + channelClone.testProjectId,
                    data: [channelClone]
                });
                this.testProjects.push(channelClone);
                controller.autoDraw();
            }
        },
        removeChannel: function(channelRow , skipDraw ) {

            // 获得父级
            var parent = this.$channelTree.treegrid( 'getParent' , channelRow.id );

            // 移除通道
            this.$channelTree.treegrid('remove', channelRow.id);

            // 如果父级 试验项目 仅有这一个了  则移除 试验项目
            if ( parent ) {
                var parentChildren = this.$channelTree.treegrid('getChildren', parent.id);
                if (parentChildren.length == 0) {
                    this.removeTestProject(parent);
                }
            }

            var index = $.indexOf(this.channels, 'id', channelRow.id);
            if (index!=-1) {
                this.channels.splice(index, 1);
                if (!skipDraw)
                    controller.autoDraw();
            }
        },
        getMode: function() {
            return this.$selector.val();
        },
        data: {
            // 获得勾选的试验项目
            // 返回: [{id: 1, name: '高低温', children: ['电压'...]},..]    试验项目信息 + 参数
            getSelectedChannels: function(){
                var self = this;
                // 获得勾选的试验项目
                // 返回: [{id: 1, name: '高低温', children: ['电压'...]},..]    试验项目信息 + 参数
                var result = [];
                var nodes = this.$channelTree.treegrid('getCheckedNodes');
                if (nodes && nodes.length>0) {
                    $.each(nodes, function(i,item){
                        if (item.nodeType == "bomTestProject") {
                            addTestProjectNode(item);
                        } else if (item.nodeType == "channel") {
                            // 找寻试验项目
                            var testProject = major.find(result, 'id', item._parentId);
                            if (!testProject) {
                                // 添加批次任务
                                var testProjectRow = self.$channelTree.treegrid('getParent', item.id );
                                testProject = addTestProjectNode(testProjectRow);
                            }
                            testProject.children.push($.extend(true, {}, item));
                        }else if(item.nodeType == "bomTestProjects"){
                            $.each(item.children,function (i,child) {
                                $.each(child.channels,function (i,row) {
                                    // 找寻试验项目
                                    var testProject = major.find(result, 'id', row._parentId);
                                    if (!testProject) {
                                        // 添加批次任务
                                        var testProjectRow = {
                                            id:child.testProjectIds[i],
                                            text:child.testProjectNodes[i].name,
                                            nodeType:"bomTestProject",
                                            bomTestProject:child.testProjectNodes[i]
                                        };
                                        testProject = addTestProjectNode(testProjectRow);
                                    }
                                    var channel = major.find(testProject.children, 'id', row.id);
                                    if(!channel){
                                        testProject.children.push($.extend(true, {}, row));
                                    }
                                })
                            });
                        }else if(item.nodeType == "channels"){
                            $.each(item.channels,function (i,row) {
                                // 找寻试验项目
                                var testProject = major.find(result, 'id', row._parentId);
                                if (!testProject) {
                                    // 添加批次任务
                                    var testProjectRow = {
                                        id:item.testProjectIds[i],
                                        text:item.testProjectNodes[i].name,
                                        nodeType:"bomTestProject",
                                        bomTestProject:item.testProjectNodes[i]
                                    };
                                    testProject = addTestProjectNode(testProjectRow);
                                }
                                var channel = major.find(testProject.children, 'id', row.id);
                                if(!channel){
                                    testProject.children.push($.extend(true, {}, row));
                                }
                            })
                        }
                    });

                    function addTestProjectNode(row) {
                        var projectId = row.id,
                            testProject = major.find(result, 'id', projectId);
                        if (!testProject) {
                            testProject = $.extend(true, {}, row);
                            testProject.id = projectId;
                            testProject.children = [];
                            result.push(testProject);
                        }
                        return testProject;
                    }
                }
                return result;
            }
        }
    });

    window.YAxisSelector = YAxisSelector;
}();