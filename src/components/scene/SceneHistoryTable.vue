<template>
    <div>
        <a-table :bordered="true" :dataSource="tableData" :columns="columns" :loading="loading" :pagination="pagination">
            <div slot="action" slot-scope="scope" class="main-table-btns">
                <a-button type="primary" size="small" @click="historyDetail(scope)" icon="edit" :disabled="true">查看详情</a-button>
            </div>
        </a-table>
    </div>
</template>
<script>
    export default {
        name: "SceneHistoryTable",
        props: {
            sceneId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                loading: false,
                tableData: [
                    {version: "当前版本", time: "2017-10-10"}
                ],
                columns: [
                    {
                        title: "版本",
                        dataIndex: "version"
                    },
                    {
                        title: "时间",
                        dataIndex: "beginTime",
                        customRender: (beginTime, row, index) => {
                            return beginTime + "--" + row.endTime;
                        },
                    },
                    {
                        title: "操作",
                        scopedSlots: {
                            customRender: "action"
                        }
                    }
                ],
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
            historyDetail(scope){
                console.log("查看此记录的详细信息", scope);
            },
            queryTblData(){
                this.loading = true;
                let param = {
                    sceneId: this.sceneId,
                    pageNum: this.pagination.current,
                    pageSize: this.pagination.pageSize
                };
                this.$http.postBody("/bs/sceneEdition/list", param).then(rst => {
                    this.whenSuccess(rst, data => {
                        this.tableData = data.rows;
                        this.pagination.total = data.total;
                    })
                });
                this.loading = false;
            }
        },
        created() {
            this.queryTblData();
        }
    }
</script>