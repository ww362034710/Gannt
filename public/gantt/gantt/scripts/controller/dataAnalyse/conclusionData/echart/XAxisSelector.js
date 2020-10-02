!function(){
    var XAxisSelector = function() {
        this.$con = $("#xAxisSelectCon");
        this.$selector = $("#xAxisSelect");
        this.$list = $("#xAxisList");

        this.$testProjectList = null;

        // 当前模式  (批次batch/产品编号productCode/试验项目testProject/参数channel/时间time/序号index)
        this.currentMode = null;

        this.batches = [];      // 批次候选
        this.products = [];     // 产品任务
        this.testProjects = [];     // 试验项目
        this.channels = [];     // 通道

        this.init();
    };

    $.extend(true, XAxisSelector.prototype, {
        init: function() {
            var self = this;

            // this.$batchTree = $("#xAxisTree_batch").treegrid({
            //     animate: true,
            //     cascadeCheck: true,
            //     border: false,
            //     idField: 'id',
            //     // fit: true,
            //     treeField: 'name',
            //     parentField: 'parentId',
            //     checkbox: true,
            //     showHeader: false,
            //     lines: true,
            //     columns : [ [
            //         {field:'name',width:280,align:'left',sortable:false,type:"string",editor:'text',
            //             formatter:function(value,row,index){
            //                 return row.name;
            //             }
            //         }
            //     ]]
            // });
            // this.$productCodeTree = $("#xAxisTree_productCode").treegrid({
            //     animate: true,
            //     cascadeCheck: true,
            //     idField: 'id',
            //     border: false,
            //     fit: true,
            //     treeField: 'name',
            //     parentField: 'parentId',
            //     checkbox: true,
            //     showHeader: false,
            //     lines: true,
            //     columns : [ [
            //         {field:'name',width:280,align:'left',sortable:false,type:"string",editor:'text',
            //             formatter:function(value,row,index){
            //                 return row.name;
            //             }
            //         }
            //     ]]
            // });
            this.$testProjectList = $("#xAxisTree_testProject").datalist({
                border: false,
                // fit: true,
                panelWidth: 150,
                panelHeight: 150,
                singleSelect: false,
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
                onCheck: function(row, checked) {
                    controller.autoDraw();
                },
                onUncheck: function(row, checked) {
                    controller.autoDraw();
                }
            });
            // this.$channelTree = $("#xAxisTree_channel").treegrid({
            //     animate: true,
            //     cascadeCheck: true,
            //     idField: 'id',
            //     border: false,
            //     // fit: true,
            //     panelWidth: 150,
            //     panelHeight: 150,
            //     treeField: 'text',
            //     parentField: 'pid',
            //     checkbox: true,
            //     showHeader: false,
            //     lines: true,
            //     columns : [ [
            //         {field:'text',width:280,align:'left',sortable:false,type:"string",editor:'text',
            //             formatter:function(value,row,index){
            //                 return row.text;
            //             }
            //         }
            //     ]]
            // });

            this.$selector.on('change', function(){
                var v = $(this).val();
                $(".xAxisList").hide().filter('[for=' + v + ']').show();
                // 重定义treegrid大小
                switch(v) {
                    case 'testProject' :
                        self.$testProjectList.datalist( 'resize' , { width : 150 , height : 150 });
                        break;
                }
                controller.autoDraw();
            })
        },
        // addBatch: function(batch) {
        //     if (!$.any(this.batches, 'id', batch.id)) {
        //         var batchClone = $.extend(true, {}, batch);
        //         batchClone.children = [];
        //         this.$batchTree.treegrid('append', {
        //             data: [batchClone]
        //         });
        //         this.batches.push(batchClone);
        //     }
        // },
        // removeBatch: function(batch) {
        //     this.$batchTree.treegrid('remove', batch.id);
        //     var index = $.indexOf(this.batches, 'id', batch.id);
        //     if (index!=-1) {
        //         this.batches.splice(index, 1);
        //     }
        // },
        // addProduct: function(product) {
        //     if (!$.any(this.products, 'id', product.id)) {
        //         var productClone = $.extend(true, {}, product);
        //         this.$productCodeTree.treegrid('append', {
        //             data: [productClone]
        //         });
        //         this.products.push(productClone);
        //     }
        // },
        // removeProduct: function(product) {
        //     this.$productCodeTree.treegrid('remove', product.id);
        //     var index = $.indexOf(this.products, 'id', product.id);
        //     if (index!=-1) {
        //         this.products.splice(index, 1);
        //     }
        // },
        addTestProject: function(testProjectRow) {
            if (!$.any(this.testProjects, 'id', testProjectRow.id)) {
                var testProjectClone = $.extend(true, {}, testProjectRow);
                testProjectClone.children = [];
                this.$testProjectList.datalist( 'appendRow', testProjectClone );
                this.testProjects.push(testProjectClone);

                var testProjectClone2 = $.extend(true, {}, testProjectClone);
                controller.autoDraw();
            }
        },
        removeTestProject: function(testProjectRow) {
            var allData = this.$testProjectList.datalist('getData').rows,
                rowIndex = -1;
            $.each( allData , function( index , data ) {
                if ( data.id == testProjectRow.id ) {
                    rowIndex = index;
                }
            });
            if ( rowIndex != -1 ) {
                this.$testProjectList.datalist('deleteRow', rowIndex);
                this.testProjects.splice(rowIndex, 1);
                controller.autoDraw();
                // var index = $.indexOf(this.testProjects, 'id', testProjectRow.id);
                // if (index != -1) {
                //     this.testProjects.splice(index, 1);
                //     controller.autoDraw();
                // }
            }
        },
        // addChannel: function(channelRow) {
        //     if (!$.any(this.channels, 'id', channelRow.id)) {
        //         var channelClone = $.extend(true, {}, channelRow);
        //         this.$channelTree.treegrid('append', {
        //             parent: "t_" + channelClone.testProjectId,
        //             data: [channelClone]
        //         });
        //         this.channels.push(channelClone);
        //     }
        // },
        // removeChannel: function(channelRow) {
        //     this.$channelTree.treegrid('remove', channelRow.id);
        //     var index = $.indexOf(this.channels, 'id', channelRow.id);
        //     if (index!=-1) {
        //         this.channels.splice(index, 1);
        //     }
        // },
        // getMode: function() {
        //     return this.$selector.val();
        // },
        data: {
        //     getSelectedProductCodes: function(){
        //         // 获得勾选的产品编号
        //         // 返回: [{id: 1, name: '生一批', productCodes: ['Z01-01'...]},..]    批次任务信息 + 产品编号
        //         var result = [];
        //         var nodes = this.$productCodeTree.treegrid('getCheckedNodes');
        //         if (nodes && nodes.length>0) {
        //             $.each(nodes, function(i,item){
        //                 if (item.nodeType == "task") {
        //                     addTaskNode(item);
        //                 } else if (item.nodeType == "productCode") {
        //                     // 找寻批次任务
        //                     var task = major.find(result, 'id', item.parentId.substring(2));
        //                     if (!task) {
        //                         // 添加批次任务
        //                         var taskRow = this.$productCodeTree.treegrid('getParent', item.id );
        //                         task = addTaskNode(taskRow);
        //                     }
        //                     task.children.push($.extend(true, {}, item));
        //                 }
        //             });
        //
        //             function addTaskNode(row) {
        //                 var task = $.extend(true, {}, row);
        //                 task.id = task.id.substring(2);
        //                 task.children = [];
        //                 result.push(task);
        //                 return task;
        //             }
        //         }
        //     }
            // 获得X轴选中的试验项目
            getSelectedTestProjects: function() {
                var result = xAxisSelector.$testProjectList.datalist('getChecked');
                return result;
            }
        }
    });

    window.XAxisSelector = XAxisSelector;
}();