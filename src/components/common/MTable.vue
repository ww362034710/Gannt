<!--对table进行了封装 推荐使用-->
<template>
    <a-table :columns="columns" :pagination="pagination" :rowSelection="rowSelectionCom" @change="tblPagination" :loading="loading" :dataSource="tblData" bordered :size="tsize" :scroll="scroll" :rowKey="rowKey" v-auto>
        <!-- 设置动态slot -->
        <div v-for="item in scopedSlots" :slot="item" :key="item" slot-scope="scoped">
            <slot :name="item" :row="scoped"> </slot>
        </div>
    </a-table>
</template>

<script>

export default {
    components: {},
    props: {
        // 常用参数
        url: {//数据请求地址
            type: String,
            default: null
        },
        columns: {
            type: Array,
            default: () => {
                return []
            }
        },
        clazz: {
            type: Function,
            default: null
        },
        // 不常用参数
        tsize: {            // 表格的行高
            type: String,
            default: "middle",
        },
        scroll: {//表格宽 高设置
            type: Object,
            default: () => {
                return { y: true, x: 500 }
            }
        },
        dataSource: {           //表格数据 当static为真时才有效
            type: Array,
            default: () => {
                return []
            }
        },
        rowSelection: Boolean,  // 表格选择框的开关
        rowSelectionType: {     // 表格选择框的类型 在开关打开时才有用
            type: String,
            default: "radio"
        },
        params: {//表格请求参数
            type: Object,
            default: () => {
                return {}
            }
        },
        rowKey: {
            type: String,
            default: "id"
        },
        selectedKeys: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            selectedRowDatas: [],
            selectedRowKeys: [],//表格选中行
            selectTreeNodeKey: "",//事件模型目录uid
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
            tblData: [],
            loading: false,
        };
    },
    computed: {
        //设置表格是否有复选框
        rowSelectionCom() {
            if (this.rowSelection) {
                return { selectedRowKeys: this.selectedRowKeys,  onChange: this.onSelectChange ,onSelect:this.selectOneRows,onSelectAll:this.onSelectAll, type: this.rowSelectionType }
            } else {
                return null
            }
        },
        scopedSlots() {
            let data = []
            this.columns.forEach(v => {
                if (Object.prototype.hasOwnProperty.call(v, 'scopedSlots')) {
                    data.push(v.scopedSlots.customRender)
                }
            });
            return data
        }
    },
    watch: {
        //监听已选择表格 key
        selectedKeys(value) {
            console.log("selectedKeys");
            this.selectedRowKeys = value;
        },
        dataSource(value) {
            console.log("dataSource");

            this.tblData = value
        },
        url(v) {
            console.log("url");

            // 清空分页信息
            this.clearPagination();
            if (v) {
                // 加载新数据
                this.getTableData();
            } else {
                // 加载空数据
                this.tblData = [];
            }
        }
    },
    methods: {
        //获取表格数据
        getTableData() {
            if (!this.url) {
                console.error('url 错误', this.url);
                return
            }
            this.loading = true;
            let params = Object.assign({}, this.params, {
                pageSize: this.pagination.pageSize,
                pageNumer: this.pagination.current
            });
            // return;
            this.$http.postBody(this.url, params).then(data => {
                if (this.clazz) {
                    this.tblData = this.clazz.createFrom(data.data.rows);
                } else {
                    this.tblData = data.data.rows;
                }
                this.pagination.total = data.data.total;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
      /*  //表格选中行
        onSelectChange(selectedRowKeys, rows) {
            this.selectedRowKeys = selectedRowKeys;
            console.log(this.selectedRowKeys)
            //根据选中的数据key 获取数据
            this.selectedRowDatas = rows;
            this.$emit("select", this.selectedRowDatas);
        },*/
        //model 表格选中数据
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRowDatas = selectedRows;
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
        //表格分页事件
        tblPagination(pagination) {
            //保存当前分页信息
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            //刷新表格
            this.getTableData();
        },
        // 清空分页信息
        clearPagination() {
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.pagination.total = 0;
        }
    },
    created() { },
    mounted() {
        this.$nextTick(() => {
            //静态表格数据
            if (this.dataSource.length !== 0) {
                this.tblData = this.dataSource
            } else {
                this.getTableData()
            }
        })
    }
}
</script>
<style lang='scss' scoped>
</style>
