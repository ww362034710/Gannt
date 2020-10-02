<!--功能初始生成页面-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="功能编码：">
                        <a-input v-model="searchForm.code" placeholder="请输入功能编码" allowClear />
                    </a-form-item>
                    <a-form-item label="功能名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入功能名称" allowClear />
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="add()">添加</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination">
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>
                        <a-button type="primary" size="small" icon="delete" @click="del(scope)">删除</a-button>
                    </div>
                </a-table>
            </div>
        </div>

        <!-- 添加model -->
        <a-modal title="添加功能" v-model="addModelVisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" okText="保存" cancelText="取消" :width="800">
            <add-feature ref="addFeature" @closeAddModal="closeAddModal" :featureId="featureId" v-if="addModelVisible"></add-feature>
        </a-modal>
    </div>
</template>

<script>
import AddFeature from "../../components/feature/AddFeature";
export default {
    name: "featureIndex",
    components: { AddFeature },
    data() {
        return {
            //枚举类
            searchForm: {
                code: null,
                name: null,
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
                    title: "功能编码",
                    dataIndex: "code",
                },
                {
                    title: "功能名称",
                    dataIndex: "name",
                },
                {
                    title: "操作",
                    //width: 180,
                    scopedSlots: { customRender: "action" }
                }
            ],
            tblData: [],
            loading: false,
            addModelVisible: false,
            confirmLoading: false,            //添加稳定保存 loading
            featureId: null //要传递给下级组件的功能ID
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
            this.featureId = null;
            this.addModelVisible = true;
        },
        //编辑
        edit(data) {
            this.featureId = data.id;
            console.log("向添加功能页面传递featureId", this.featureId);
            this.addModelVisible = true;
        },
        //删除
        del(scope) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => `确定删除此条记录吗？`,
                onOk() {
                    that.$http
                        .postBody('/bs/feature/remove', { ids: [scope.id] })
                        .then((rst) => {
                            that.whenSuccess(rst, (data) => {
                                that.$message.success('删除成功');
                                that.getTableData();
                            });
                        });
                },
                onCancel() {
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
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.current
                }
            );
            this.loading = true;
            //发送ajax 请求
            console.log("params:" + JSON.stringify(params));
            this.$http.postBody("/bs/feature/list", params).then(data => {
                    this.pagination.total = data.data.total;
                    this.tblData = data.data.rows;
                    this.loading = false;
                }).catch(() => {
                    this.loading = false;
                });
        },
        //添加保存
        handleSubmit(e) {
            this.$refs.addFeature.handleSubmit(e);
        },
        closeAddModal() {
            this.addModelVisible = false;
            this.$nextTick(() => {
                this.getTableData();
            })
        },
    },
    created() {
        this.getTableData();
    }
};
</script>
