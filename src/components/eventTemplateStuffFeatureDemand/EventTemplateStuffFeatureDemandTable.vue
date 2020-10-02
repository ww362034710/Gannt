<!--事件模板对资源及其功能的依赖列表-->
<template>
    <a-table v-auto data-diff="125" :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="eventTemplateId" @change="tblPagination">
    </a-table>
</template>
<script>

export default {
    name: 'eventTemplateStuffFeatureDemandTable',
    props: {
        eventTemplateId: null,
        stuffId: null,
    },
    data() {
        return {
            columns: [
                {
                    title: "资源编码",
                    dataIndex: "stuffId",
                },
                {
                    title: "资源名称",
                    dataIndex: "stuffName",
                    width: "20%"
                },
                {
                    title: "功能名称",
                    dataIndex: "featureName",
                    width: "20%"
                },
                {
                    title: "功能编码",
                    dataIndex: "featureCode",
                    width: "20%"
                },
                {
                    title: "需求量",
                    dataIndex: "value",
                    width: "10%"
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
            this.$http.postBody("/bs/eventTemplate/demand/queryFeatureList", params).then(data => {
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