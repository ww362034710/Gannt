<template>
    <div>
        <a-table :bordered="true" :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination">
        </a-table>
    </div>
</template>
<script>
    export default {
        name: "sceneRelatedEvent",
        props: {
            sceneId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                data: [
                    {name: "事件名称实例"}
                ],
                columns: [
                    {
                        title: "名称",
                        dataIndex: "name"
                    }, {
                        title: "编码",
                        dataIndex: "id",
                        width: '15%'
                    },{
                        title: "优先级",
                        dataIndex: "priority",
                    },{
                        title: "所属系统",
                        dataIndex: "ownerSystem"
                    }
                ],
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
            }
        },
        methods: {
            queryTblData() {
                this.loading = true;
                let param = {
                    sceneId: this.sceneId,
                    pageNum: this.pagination.current,
                    pageSize: this.pagination.pageSize
                };
                this.$http.postBody("/bs/event/list", param).then(data => {
                    this.data = data.rows;
                    this.pagination.total = data.total;
                });
                this.loading = false;
            }
        },
        created() {
            this.queryTblData();
        }
    }
</script>