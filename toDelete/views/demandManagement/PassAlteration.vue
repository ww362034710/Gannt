<template>
    <div>
        <div class="content-search-bar" style="padding-top: 6px;padding-left: 0;">
            <a-button type="primary" class="right-space" @click="openModel" :disabled="!this.selectRows.length>0">添加变更依据</a-button>
        </div>
        <div>
<!--            变更列表中所选择的变更记录-->
            <a-table :columns="columns" :dataSource="tblData" :pagination="pagination" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectChanged}">
            </a-table>
        </div>
        <a-modal v-model="model.visible" @ok="addAlterRecord" :maskClosable="false">
            <div>
<!--                变更依据列表-->
                <a-table :columns="model.columns" :dataSource="model.tblData" :pagination="model.pagination" :rowSelection="{selectedRowKeys: model.selectedRowKeys, onChange: model.selectChanged}">

                </a-table>
            </div>
        </a-modal>
    </div>
</template>
<script>
    export default {
        name: "SelectChangeRecord",
        props: {
            docEditionUid: {
                type: String,
                required: true
            },
            record: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                tblData: JSON.parse(JSON.stringify(this.record)),
                columns: [
                    {
                        title: "标识",
                        dataIndex: "tag"
                    },
                    {
                        title: "标题",
                        dataIndex: "previewContent"
                    },
                    {
                        title: "变更依据",
                        dataIndex: "recordTitle"
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
                selectedRowKeys: [],
                selectRows: [],
                selectChanged: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectRows = selectedRows;
                },
                model: {
                    visible: false,
                    loading: false,
                    tblData: [],
                    columns: [
                        {
                            title: "名称",
                            dataIndex: "title"
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
                    selectedRowKeys: [],
                    selectRows: [],
                    selectChanged: (selectedRowKeys, selectedRows) => {
                        this.model.selectedRowKeys = selectedRowKeys;
                        this.model.selectRows = selectedRows;
                    },
                    refresh: () => {
                        let table = this.model;
                        let params = Object.assign({ effectEdition: this.docEditionUid }, {
                            pageNumber: table.pagination.current,
                            pageSize: table.pagination.pageSize
                        });
                        table.loading = true;
                        //发送ajax 请求
                        console.log("请求变更依据数据  参数:" + JSON.stringify(params));

                        this.$http.postBody('/bs/demandItemChangedRecord/list', params).then(data => {
                            table.pagination.total = data.total;
                            table.tblData = data.rows;
                            table.loading = false
                        }).catch(() => {
                            table.loading = false
                        })
                    }
                }
            }
        },
        methods: {
            openModel() {
                this.model.visible = true;
                this.model.refresh();
            },
            addAlterRecord() {
                this.selectRows.forEach(item => {
                    if (this.model.selectRows.length > 0){
                        let record = this.model.selectRows[0];
                        item.recordUid = record.uid;
                        item.recordTitle = record.title;
                    } else {
                        item.recordUid = null;
                        item.recordTitle = null;
                    }

                });
                this.model.visible = false;
            }
        },
        created() {

        },
        mounted() {
        }
    }
</script>