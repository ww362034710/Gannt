<template>
    <div class="page-main">
        <div class="page-main-container">
            <a-tabs default-active-key="1" tab-position="left">
                <a-tab-pane key="1" tab="基本信息">
                    <div class="tabs-main">
                        <div class="gathering-title">
                            <span>XX事件</span>
                            <span class="event-status" v-html="getStatus"></span>
                        </div>
                        <div class="gathering-line">
                            <p>事件描述</p>
                            <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
                        </div>
                        <a-descriptions title="" layout="vertical">
                            <a-descriptions-item :label="item.label" v-for="item in gatheRingData" :key="item.id">
                                {{item.content}}
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>

                </a-tab-pane>
                <a-tab-pane key="2" tab="资源功能依赖">
                    <div v-auto>
                        <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination"></a-table>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    name: "demoViewGathering",
    data() {
        return {
            status: 1,//状态
            gatheRingData: [],
            columns: [
                {
                    title: "功能名称",
                    dataIndex: "name",
                },
                {
                    title: "功能编码",
                    dataIndex: "userName",
                    width: "20%"
                },
                {
                    title: "需求量",
                    width: 200,
                    dataIndex: "status",
                }
            ],
            tblData: [],
            loading: false,
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
        };
    },
    computed: {
        getStatus() {
            let statusName = [{
                name: '审核通过',
                color: '#67C671'
            }, {
                name: '审核不通过',
                color: '#ef3a10'
            }, {
                name: '驳回',
                color: '#000000'
            }]
            return `<span style="color:${statusName[this.status].color}">${statusName[this.status].name}</span>`
        }

    },
    methods: {
        //获取数据
        getDatas() {
            this.$http.get("/getStatus").then(data => {
                this.gatheRingData = data.data.events
                this.status = data.data.status
            }).catch(() => {
            });
        },
        /**
       * 表格分页、排序、筛选变化时触发
       */
        tblPagination(pagination) {
            //保存当前分页信息
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.getTablData();
        },
        /**
         *  获取model表格数据
         */
        getTablData() {
            let params = {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            };
            this.loading = true;
            this.$http.post("system/user/list").then(data => {
                this.tblData = data.data.rows
                this.pagination.total = data.data.total;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
    },
    created() {
        this.getDatas()
        //获取表格数据
        this.getTablData()
    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
.tabs-main {
    width: 50%;
    min-width: 600px;
    .gathering-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40px;
        .event-status {
            font-weight: 600;
        }
    }
    .gathering-line {
        margin-bottom: 15px;
        padding: 5px 0;
        border-bottom: 1px solid #ececec;
    }
}
/deep/ .ant-descriptions-item-content {
    font-weight: 600;
}
</style>