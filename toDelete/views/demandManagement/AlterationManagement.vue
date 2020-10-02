<template>
    <div>
        <div class="content-search-bar" style="padding-top: 6px;padding-left: 0;">
            <a-button type="primary" class="right-space" @click="openPassAlterationModel" :disabled="this.selectRows.length<=0">确认变更</a-button>
            <a-button type="danger" :disabled="this.selectRows.length<=0">取消疑似变更</a-button>
        </div>
        <div>
            <a-table :columns="columns" :dataSource="tblData" :pagination="pagination" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectChanged}">

            </a-table>
        </div>
        <a-modal title="请选择要确认变更的子需求" v-model="model.visible" @ok="handleSubmit" cancelText="取消" :maskClosable="false" width="800px"
                 :destroyOnClose="true"
        >
            <PassAlteration :docEditionUid="docEditionUid" :record="selectRows" ref="passAlteration"></PassAlteration>
        </a-modal>
    </div>
</template>
<script>
    import PassAlteration from "./PassAlteration";
    export default {
        name: "AlterationManagement",
        components: {
            PassAlteration
        },
        props: {
            docEditionUid: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                tblData: [],
                columns: [
                    {
                        title: "标识",
                        dataIndex: "tag"
                    },
                    {
                        title: "标题",
                        dataIndex: "previewContent"
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
                    visible: false
                }
            }
        },
        methods: {
            queryTblData() {
                this.$http.postBody("/bs/item/list", {docEditionUid: this.docEditionUid, alteredStatusId: 2}).then(rst => {
                    this.whenSuccess(rst, data => {
                        this.tblData = data.rows;
                        this.pagination.total = data.total;
                    })
                })
            },
            openPassAlterationModel(){
                console.log("传递到下级组件的数据！", this.selectRows);
                this.model.visible = true;
            },
            handleSubmit(){
                let data = this.$refs.passAlteration.tblData;
                console.log("等待处理的数据是：", data);
                let params = [];
                data.forEach(item => {
                    let p = {
                        itemUid: item.itemUid,
                        sectionUid: item.sectionUid,
                        itemEdition: item.itemEdition,
                        docEditionUid: item.docEditionUid,
                        recordUid: item.recordUid
                    };
                    params.push(p);
                });
                console.log("将要提交的数据是：", params);
                this.$http.postBody("/bs/item/confirmChange", {itemList: params}).then(result => {
                    this.whenSuccess(result, data => {
                        console.log(data);
                    });
                });
                this.model.visible = false;
            }
        },
        created() {
            this.queryTblData();
        }

    }
</script>