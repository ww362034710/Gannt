<template>
    <div class='dismantling-main'>
        <div class="dismantling-op">
            <a-form layout="inline">
                <a-form-item style="float:right">
                    <a-button type="primary" icon="plus" @click="addNewEvent()">新建事件</a-button>
                    <a-button icon="share-alt" @click="connectNewEvent()">关联事件</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class="dismantling-table">

        </div>
        <div v-auto>
            <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="uuid">
                <div slot="action" slot-scope="scope" class="main-table-btns">
                    <a-button type="danger" size="small" @click="delEvent(scope)" icon="delete">删除</a-button>
                </div>
            </a-table>
        </div>

    </div>

</template>

<script>

export default {
    name: "dismantlingEventIndex",
    components: {},
    data() {
        return {
			params:{
				itemUid:null,
				itemEdition: null,
				uid: null
			},
			
            pagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ["10", "20", "30", "40"],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: total => {
                    return "共：" + total + "条记录 ";
                },
                total: 0
            },
            columns: [
                {
                    title: "事件名称",
                    dataIndex: "name",
                },
                {
                    title: "最早开始时间",
                    dataIndex: "earliestStartTime",
                    width: "20%"
                },
                {
                    title: "最晚开始时间",
                    dataIndex: "latestStartTime",
                    width: "20%"
                },
                {
                    title: "预计工期（天）",
                    dataIndex: "predictDay",
                    width: 150
                },
                {
                    title: "操作",
                    width: 100,
                    scopedSlots: { customRender: "action" }
                }
            ],
            tblData: [],
            loading: false,
        };
    },
    computed: {},
    watch: {},
    methods: {
        //获取表格数据
        getTableData() {
            this.loading = true;
			
            this.$http.postBody("/bs/event/list",this.params).then(data => {
				console.log("222222222222222222");
				console.log(this.params)
				console.log(data);
                this.tblData = data.rows;
                this.pagination.total = this.tblData.length;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        /** 
         * 删除事件
         * @param {*}  data 当前行数据
        */
        delEvent(data) {
            let that = this;
			that.params.uid = data.uid;
			
            this.$confirm({
                title: "系统提示",
                content: () => <div style="color:red;">确定要删除当前事件吗？</div>,
                onOk() {
                    that.$http.postBody("/bs/event/removeOne",that.params).then(() => {
						console.log(data.uid);
                        that.$message.success("删除成功", 2);
                        //刷新表格
                       that.getTableData();
                    });
					 
                }
				
            });
			this.getTableData();
        },
        //新建事件
        addNewEvent() {
            this.$router.push({
                name: "dismantlingEventAdd",
                params: {
                    tags: "新建事件",
                    demandItemEditionUid: this.params.itemUid
                }
            })
        },
        //关联事件
        connectNewEvent() {
            this.$router.push({
                name: "dismantlingEventConnect",
                params: {
                    tags: "关联事件" + (Math.random().toString(36).substr(3, 10))
                }
            })
        }
    },
    created() {
        //获取表格数据
        this.getTableData();
		this.params.itemUid =this.$route.params.itemUid;
		this.params.itemEdition = this.$route.params.itemEdition;
    },
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
.dismantling-main {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
    background-color: #ffffff;
    .dismantling-op {
        button {
            margin: 0 0 10px 10px;
        }
    }
    .dismantling-table {
        clear: both;
        background-color: blue;
    }
}
</style>