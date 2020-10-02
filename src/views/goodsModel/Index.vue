<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入名称" allowClear/>
                    </a-form-item>
                    <a-form-item label="所属系统：">
                        <a-select placeholder="请选择所属系统" v-model="searchForm.ownerSystem" :options="OwnerSystem" allowClear style="width: 200px">
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="add()">添加</a-button>
                        <!--<a-button icon="plus" style="margin-left:10px" @click="importData()">导入</a-button>-->
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <a-table
                        :columns="columns"
                        :pagination="pagination"
                        :loading="loading"
                        :dataSource="tblData"
                        size="middle"
                        :scroll="{y:true,x:500}"
                        rowKey="id"
                        @change="tblPagination"
                >
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="default" size="small" icon="exception" @click="detail(scope)">详情</a-button>
                        <a-button type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>
                        <a-button type="primary" size="small" icon="delete" @click="del(scope)">删除</a-button>
                    </div>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
    import {OwnerSystem} from "../../class/MyEnum";
    export default {
        name: "goodsModelIndex",
        data() {
            return {
                searchForm: {
                    type: undefined,
                    name: undefined,
                    ownerSystem: undefined
                },
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
                        title: "编码",
                        dataIndex: "id",
                        width: "30%"
                    },
                    {
                        title: "名称",
                        dataIndex: "name",
                        width: "20%"
                    },
                    {
                        title: "所属系统",
                        dataIndex: "ownerSystem",
                        width: "20%"
                    },
                    {
                        title: "操作",
                        width: "35%",
                        scopedSlots: {customRender: "action"}
                    }
                ],
                tblData: [],
                loading: false,
                confirmLoading: false,            //添加稳定保存 loading
            };
        },
        methods: {
            //查询
            doSearch() {
                //分页信息修改
                this.pagination.current = 1;
                this.getTableData();
            },
            //添加页面
            add() {
                this.$router.push({
                    name: "goodsModelAdd",
                    params: {
                        tags: "添加物资模型"
                    }
                })

            },
            //导入模板数据
            importData(){

            },
            // 数据格式化
            formatJson(filterVal, jsonData){
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            detail(data) {
              console.log("查看data的内容：", data);
              this.$router.push({
                  name: "goodsModelDetail",
                  params: {
                      tags: "物资模型详情-" + data.id,
                      id: data.id
                  }
              })
            },
            //编辑
            edit(data) {
                this.$router.push({
                    name: "goodsModelEdit",
                    params: {
                        tags: "添加物资模型",
                        goodsModelId: data.id
                    }
                })
            },
            //删除
            del(scope){
                let that = this;
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定删除此条记录吗？`,
                    onOk(){
                        that.$http
                            .postBody('/bs/goodsModel/remove', {ids: [scope.id]})
                            .then((rst) => {
                                that.whenSuccess(rst, (data)=>{
                                    that.$message.success('删除成功');
                                    that.getTableData();
                                });
                            });
                    },
                    onCancel(){
                        console.log("Cancel");
                    }
                });
            },
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
                let params = Object.assign(
                    this.searchForm,
                    {
                        type: "goods",
                        pageSize: this.pagination.pageSize,
                        pageNum: this.pagination.current
                    }
                );
                this.loading = true;
                //发送ajax 请求
                console.log("params:" + JSON.stringify(params));
                this.$http.postBody("/bs/goodsModel/list", params).then(data => {
                        this.pagination.total = data.data.total;
                        this.tblData = data.data.rows;
                        this.loading = false;
                    }).catch(() => {
                    this.loading = false;
                });
            },
        },
        created() {
        },
        activated() {
            this.getTableData();
        }
    };
</script>
