<!--事件模板对资源及其功能的依赖列表-->
<template>
    <a-table v-auto data-diff="125" :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="eventTemplateId" @change="tblPagination">
    </a-table>
</template>
<script>

export default {
    name: 'EventTemplateLogicConstraintTable',
    props: {
        eventTemplateId: null,
        stuffId: null,
    },
    data() {
        return {
            columns: [
                {
                    title: "事件名称",
                    dataIndex: "eventName",
                },
                {
                    title: "角色",
                    dataIndex: "roleType",
                    width: "20%"
                },
                {
                    title: "类型",
                    dataIndex: "type",
                    width: "20%"
                },
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
            loading: false,
            tblData: []
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
            this.getTablData();
        },
        /**
         *  获取model表格数据
         */
        getTablData() {
            let params = Object.assign({}, this.searchForm, {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            },{eventTemplateId: this.eventTemplateId });
            this.loading = true;
            // console.log(this.eventTemplateId);
            // 查询列表
            this.$http.postBody("/bs/tpllogic/queryLogicListWithRole", params).then(data => {
                this.tblData = data.data.rows;
                this.pagination.total = data.data.total;
                this.loading = false;
            }).catch(() => {
            });
        },
    },
    created() {
        this.getTablData();
    }
}
</script>
