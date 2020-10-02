<template>
    <div>
        <a-form>

        </a-form>
        <a-table rowKey='id' :columns="columns" :dataSource="tableData" :pagination="pagination" :loading="loading" bordered size="small"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,onSelect:selectOneRows,onSelectAll:onSelectAll}" @change="tblPagination">
        </a-table>
    </div>
</template>

<script>
    export default {
        name: "StuffSelect",
        props: {
            selectedKeys: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        watch: {
            selectedKeys(value) {
                this.selectedRowKeys = value;
            }
        },
        data() {
            return {
                columns: [{
                    title: "名称",
                    dataIndex: 'name'
                },{
                    title: '规划层级',
                    dataIndex: 'planGrade',
                    width:"40%"
                }],
                tableData: [],
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
                //table的数据状态
                selectedRows: [],
                selectedRowKeys: []
            }
        },
        methods: {
            getTablData() {
                let params = Object.assign({}, this.searchForm, {
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.current,
                    selectedKeys: this.selectedKeys
                });
                this.loading = true;
                this.$http.postBody("/bs/stuff/list", params).then(data => {
                    this.tableData = data.data.rows;
                    this.pagination.total = data.data.total;
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
            //model 表格选中数据
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
            //表格化 选择变化
            selectOneRows(record, selected) {
                this.$emit('selectChange', record, selected)
            },
            //表格全选/取消
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, changeRows, selectedRows)
                this.$emit("setCollectionChange", changeRows, selected)
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
        },
        created() {
            this.getTablData();
        }
    }
</script>

<style scoped>

</style>