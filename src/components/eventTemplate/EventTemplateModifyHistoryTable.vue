<template>
    <a-table v-auto data-diff="125" :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination"></a-table>
</template>

<script>
export default {
    name: "event-template-modify-history-table",
    props: {
        schemeTemplateId: String
    },
    data() {
        return {
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
                    title: "操作类型",
                    dataIndex: "opType",
                    customRender: opType => {
                        return this.ModifyStatus.getText(opType);
                    }
                },
                {
                    title: "操作人",
                    dataIndex: "sysUser.userName"
                },
                {
                    title: "操作时间",
                    dataIndex: "opTime"
                }
            ],
            tblData: [],
            loading: false
        }
    },
    methods: {
        /**
         * 表格分页、排序、筛选变化时触发
         */
        tblPagination(pagination) {
            //保存当前分页信息
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.getTableData();
        },
        //获取表格数据
        getTableData() {
            let params = {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current,
                schemeTemplateId: this.schemeTemplateId
            };
            this.loading = true;
            //发送ajax 请求
            console.log("params:" + JSON.stringify(params));
            this.$http
                .postBody("/bs/resolveSchemeTemplateHistory/list", params)
                .then(data => {
                    this.pagination.total = data.data.total;
                    this.tblData = data.data.rows;
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
        }
    },
    created() {
        console.log("event-template-modify-history-table, eventTemplateId: ", this.eventTemplateId);
        this.getTableData();
    }
}
</script>

<style scoped>
</style>