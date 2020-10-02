<template>
    <div class='' v-auto:[auto] :data-diff="diff">
        <a-table :columns="columns" :pagination="pagination" :rowSelection="rowSelectionCom" @change="tblPagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="scroll" rowKey="uuid">
            <div slot="action" slot-scope="scope" class="main-table-btns">
                <a-button size="small" type="primary" @click="select(scope)">使用</a-button>
            </div>
        </a-table>
    </div>
</template>
<script>
    export default {
        name: "selectGoodsModel",
        components: {},
        props: {
            auto: {
                type: Boolean,
                default: true
            },
            scroll: {
                type: Object,
                default: () => {
                    return { y: true, x: 500 }
                }
            },
            url: {
                type: String,
                default: "/bs/goodsModel/list"
            },
            static: Boolean,
            dataSource: {
                type: Array,
                default: () => {
                    return []
                }
            },
            diff: {
                type: Number,
                default: 175
            },
            rowSelection: Boolean,
            rowSelectionType: {
                type: String,
                default: "radio"
            },
            params: {
                type: Object,
                eventModelFolderUid: null,
                identification:2,
                default: () => {
                    return {}
                }
            },
            columns: {
                type: Array,
                default: () => {
                    return [
                        {
                            title: "物资模型名称",
                            dataIndex: "name"
                        },{
                            title: "操作",
                            width: 350,
                            scopedSlots: {customRender: "action"}
                        }
                    ]
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
                tblData: [{uuid: "123", name: "ming"}],
                loading: false,
                msg1: ''
            };
        },
        computed: {
            rowSelectionCom() {
                if (this.rowSelection) {
                    return { selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange, type: this.rowSelectionType }
                } else {
                    return null
                }
            }
        },
        watch: {
            dataSource(value) {
                this.tblData = value
            }
        },
        methods: {
            //获取表格数据
            getTableData() {
                this.loading = true;

                let params = Object.assign({},{
                        pageSize: this.pagination.pageSize,
                        pageNumer: this.pagination.current,
                        identification: 2
                    }
                );
                console.log(params);
                this.$http.postBody(this.url, params).then(data => {
                    console.log(data)
                    this.tblData = data.data.rows;
                    console.log(this.tblData);
                    this.pagination.total = this.tblData.length;
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
            },
            //表格选中行
            onSelectChange(selectedRowKeys, rows) {
                this.selectedRowKeys = selectedRowKeys;
                console.log(this.selectedRowKeys)
                //根据选中的数据key 获取数据
                this.selectedRowDatas = rows;
                this.$emit("select", this.selectedRowKeys);
            },
            //表格分页事件
            tblPagination(pagination) {
                //保存当前分页信息
                this.pagination.current = pagination.current;
                this.pagination.pageSize = pagination.pageSize;
                //刷新表格
                this.getTableData();
            },
            //表格数据删除
            delEvent(data) {
                this.$emit('delete', data)
            },
            //删除选中的数据
            deleteSelectData(key) {
                this.selectedRowKeys.splice(this.selectedRowKeys.findIndex(item => item === key), 1)
            },
            select(row) {
                this.$emit("loadGoodsModel", row.id);
            }
        },
        created() {
            if (this.static) {
                this.tblData = this.dataSource
            } else {
                this.getTableData()
            }

        },
        mounted() {

        }
    }
</script>