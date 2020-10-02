!function(){

    // 试验项目与通道的缓存
    var CACHE_TASK_CHANNELS = {};  // taskId: group: [channels]
    var CACHE_DATA = {};    // channelNodeId: data

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
                treeField: 'name',
                parentField: 'pid',
                lines: false,
                fit:true,
                fitColumns: true,
                emptyMsg : '请在上方列表中选择一个任务',
                border: false,
                checkbox : function( row ) {
                    console.log('nodeType: ' , row.nodeType);
                    return ( row.nodeType == 'channel' );
                },
                cascadeCheck:false,
                showHeader: false,
                columns : [ [
                    {field:'name',width:280,align:'left',sortable:false,type:"string",editor:'text',
                        formatter:function(value,row,index){
                            return row.name;
                        }
                    }
                ]],
                onLoadSuccess:function(row,data){
                    $("#channelTree").treegrid('autoSizeColumn','name');
                },
                onBeforeCheckNode:function(row,checked){
                    if (checked) {
                        if (row.nodeType == "channel") {
                            // 找到该通道的任务
                            var taskRow = self.fn.getChannelTask( row );
                            // 判断是否超过了同时对比的任务上限
                            var checkedTasks = self.data.getCheckedTasks();
                            if ( checkedTasks.length >= _CONFIG.maxXAxisCount && !major.find( checkedTasks , 'id' , taskRow.id )) {
                                $.messager.show({ title : '提示', msg : '最多只能对比两个任务' });
                                self.$channelTree.treegrid('uncheck', row.id);
                                return false;
                            }
                            // 判断是否超过了同时对比的通道上限
                            var checkedChannelNames = self.data.getCheckedChannelNames();
                            console.log('超过俩', checkedChannelNames.length >= _CONFIG.maxYAxisCount && checkedChannelNames.indexOf(row.name)==-1);
                            console.log(checkedChannelNames,row.name);
                            if ( checkedChannelNames.length >= _CONFIG.maxYAxisCount && checkedChannelNames.indexOf(row.name)==-1) {
                                $.messager.show({ title : '提示', msg : '最多只能对比两个同名通道' });
                                self.$channelTree.treegrid('uncheck', row.id);
                                return false;
                            }
                        }
                    }
                },
                onCheckNode:function(row,checked){
                    if (checked) {
                        if (row.nodeType == "channel") {


                            self.events.channelChecked.call(self, row);
                        }
                    } else {
                        self.events.channelUnchecked.call(self, row);
                    }
                }
            });
            return self;
        },
        addTask: function(row) {
            var self = this;
            var taskId = row.id;
            // 加载通道
            if ( !row.channels ) {
                var taskChannels = [];
                // if (CACHE_TASK_CHANNELS.hasOwnProperty(taskId)) {
                    taskChannels = CACHE_TASK_CHANNELS[taskId]
                //     appendRow( row );
                // } else {
                    $.messager.progress();
                    $.ajax(ctx + "/testData/getTaskOriginalDataList", {
                        data: {
                            taskId: taskId
                        },
                        async: false,
                        success: function (originalDataObjList) {
                            console.log('getTaskOriginalDataList:',originalDataObjList);
                            if (originalDataObjList && originalDataObjList.length > 0) {
                                var childNodes = [];
                                $.each(originalDataObjList, function (i, dataObj) {
                                    var groupName = dataObj.group,
                                        groupNodeId = taskId + '_group_' + groupName + '_' + i,
                                        groupNode = {
                                            id : groupNodeId,
                                            name : groupName,
                                            state : 'open',
                                            nodeType : 'group',
                                            taskId : taskId,
                                            pid : row.id,
                                            children : []
                                        },
                                        channelList = dataObj.specification.channelList;

                                    if ( channelList && channelList.length > 0 ) {
                                        $.each( channelList , function( j , channel ) {
                                            var channelNode = {
                                                id : taskId + '_channel_' + channel.name + '_' + j,
                                                name : channel.name,
                                                taskId : taskId,
                                                pid : groupNodeId,
                                                channelId : channel.id,
                                                groupName: groupName,
                                                nodeType : 'channel'
                                            };
                                            groupNode.children.push( channelNode );
                                        });
                                    }
                                    childNodes.push( groupNode );
                                    // 缓存数据
                                    var data = dataObj.data. dataElementMap;
                                    if ( data && data.length > 0 ) {
                                        $.each( data , function( channelName , channelData ) {
                                            CACHE_DATA[ channelName ] = channelData;
                                        });
                                    }
                                });
                                row.channels = childNodes;
                                manager.CACHE_DATA[row.id] = originalDataObjList;
                                if( !row.channels && row.name.indexOf('无原始数据')==-1){
                                    row.name = row.name+"(无原始数据)";
                                }
                                appendRow( row );
                            } else if(self.$channelTree.treegrid('getData').length==0) {
                                appendRow({
                                    name: '无数据',
                                    id: -1
                                });
                            }
                        },
                        complete: function() {
                            $.messager.progress('close');
                        }
                    });
                // }
            } else {
                appendRow( row );
            }

            function appendRow( row ) {
                var data = self.$channelTree.treegrid('getData');
                // 清理"无数据"消息
                if (data.length==1 && data[0].id == -1) {
                    self.$channelTree.treegrid('loadData', []);
                }

                var taskNode = $.extend(true, {}, row);
                taskNode.children = taskNode.channels;
                self.$channelTree.treegrid('append', {
                    data: [taskNode]
                });
            }
        },
        removeTask: function(row) {
            debug && console.log('channelTreeManager.removeTestProject row:', row);
            var self = this,
                taskId = row.id,
                checkedNodes = self.$channelTree.treegrid('getCheckedNodes'),
                checkedGroups = $.grep(checkedNodes, function(i){return i.nodeType=="bomTestProject" && i.testProjectId== taskId }),
                checkedChannels = $.grep(checkedNodes, function(i){return i.nodeType=="channel" && i.testProjectId== taskId });
            debug && console.log('channelTreeManager.channels: ', checkedChannels);

            if (checkedGroups && checkedGroups.length>0) {
                $.each( checkedGroups , function( groupIndex , group ) {
                    self.events.groupUnchecked(row);
                })
            }
            if (checkedChannels && checkedChannels.length>0) {
                $.each(checkedChannels, function(i, channel) {
                    self.events.channelUnchecked(channel);
                });
            }
            self.$channelTree.treegrid('remove', taskId );
        },
        events: {
            channelChecked: function(row) {
                controller.autoDraw();
            },
            channelUnchecked: function(row) {
                controller.autoDraw();
            }
        },
        data: {
            // 获得勾选的通道所处的任务
            getCheckedTasks: function() {
                var checkedChannels = channelTreeManager.data.getCheckedChannels(),
                    checkedTasks = [];
                $.each( checkedChannels, function(i, item) {
                    var taskRow = channelTreeManager.fn.getChannelTask( item);
                    if (taskRow && !major.find( checkedTasks , 'id', taskRow.id)) checkedTasks.push( taskRow );
                });
                return checkedTasks;
            },
            // 获得勾选的通道
            getCheckedChannels: function() {
                return channelTreeManager.$channelTree.treegrid( 'getCheckedNodes' );
            },
            // 获得勾选的通道名称
            getCheckedChannelNames: function() {
                var checkedChannels = channelTreeManager.data.getCheckedChannels(),
                    checkedChannelNames = [];
                $.each( checkedChannels , function(i, item) {
                    checkedChannelNames.push( item.name );
                })
                return checkedChannelNames;
            }
        },
        fn: {
            // 获得一个通道所处的任务
            getChannelTask: function(channelRow) {
                var groupRow = channelTreeManager.$channelTree.treegrid( 'getParent' , channelRow.id ),
                    taskRow = channelTreeManager.$channelTree.treegrid( 'getParent' , groupRow.id );
                return taskRow;
            }
        }
    });
    window.ChannelTreeManager = ChannelTreeManager;
}();