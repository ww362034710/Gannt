<template>
    <!-- 选择模板数据 -->
        <m-table ref="template" :scroll="scroll" tsize="middle" url="/bs/goodsModifyHistory/list" rowSelection :columns="columns" :params="{goodsId: this.goodsId}"/>
    <!--<a-table
            :columns="columns"
            :pagination="pagination"
            :loading="loading"
            :dataSource="tblData"
            size="middle"
            :scroll="{y:true,x:500}"
            rowKey="uuid"
            @change="tblPagination"
    ></a-table>-->
</template>

<script>
    //表格组件
    import MTable from "../../components/common/MTable";
    export default {
        components: { MTable },
        name: "goods-modify-history-table",
        props: {
            goodsId: String
        },
        data() {
            return {
                /*pagination: {
                    current: 1,
                    pageSize: 10,
                    pageSizeOptions: ["10", "20", "30", "40"],
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: total => {
                        return "共：" + total + "条记录 ";
                    },
                    total: 0
                },*/
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
            /*/!**
             * 表格分页、排序、筛选变化时触发
             *!/
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
                    goodsId:this.goodsId
                };
                this.loading = true;
                //发送ajax 请求
                console.log("params:" + JSON.stringify(params));
                this.$http
                    .postBody("bs/goodsModifyHistory/list", params)
                    .then(result => {
                        var data=JSON.stringify(result);
                        data = eval("("+data+")");
                        this.pagination.total = data.data.total;
                        this.tblData = data.data.rows;
                        this.loading = false;
                    }).catch(() => {
                    this.loading = false;
                });
            }*/
        },
        created() {
            console.log("goods-modify-history-table, goodsId: ", this.goodsId);
            // this.getTableData();
        }
    }
</script>

<style scoped>

</style>