<template>
    <a-table
            :columns="columns"
            :pagination="pagination"
            :loading="loading"
            :dataSource="tblData"
            size="middle"
            :scroll="{y:true,x:500}"
            rowKey="uuid"
            @change="pagination"
    >
        <div slot="action" slot-scope="scope" class="main-table-btns">
            <a-button type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>
            <a-button type="primary" size="small" icon="delete" @click="del(scope)">删除</a-button>
        </div>
    </a-table>
</template>

 <script>
    export default {
        components: {},
        props: {
            stuffId: {
                id: String,

            },
            watch:{

                stuffId:{
                    immediate:true,
                    handler(newValue,oldValue){
                        console.log(newValue);
                        this.stuffId = newValue;
                        this.loadStuffFeatures();
                    }
                }
            }
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
                        title: "功能名称",
                        dataIndex: "featureName",
                        width: '25%'
                    },
                    {
                        title: "功能编码",
                        dataIndex: "featureCode",
                        width: '25%'
                    }
                ],
                tblData: [],
                loading: false,
            }
        },
        methods: {
            loadStuffFeatures() {
                this.$http.postBody("/bs/stuffFeature/queryFeatureList", {
                    stuffId: this.stuffId

                }).then((rst)=>{
                    this.tblData = rst.data.rows;
                    console.log(this.stuffId);
                });
            }
        },
        created() {
            this.loadStuffFeatures();
        }
    }
</script>