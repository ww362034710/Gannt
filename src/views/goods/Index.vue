<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入名称" allowClear />
                    </a-form-item>
                    <a-form-item label="所属系统：">
                        <a-select placeholder="请选择所属系统" v-model="searchForm.ownerSystem" :options="OwnerSystem" allowClear style="width: 180px">
                        </a-select>
                    </a-form-item>
                    <a-form-item label="状态：">
                        <a-select placeholder="请选择状态" v-model="searchForm.state" :options="DemandState" allowClear style="width: 120px">
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="add()">添加</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" size="middle" :scroll="{y:true,x:500}" rowKey="id" @change="tblPagination">
                    <div slot="state" slot-scope="scope" v-html="DemandState.getStateHTML(scope)">
                    </div>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button class="edit-btn" v-if="scope.state === 'draft' || scope.state === 'rejected'" type="primary" size="small" icon="edit" @click="edit(scope)">编辑
                        </a-button>

                        <a-button class="commit-btn" v-if="scope.state === 'draft'" type="primary" size="small" icon="check" @click="commit(scope)">提交
                        </a-button>

                        <a-button class="detial-btn" v-if="scope.state === 'approving' || scope.state === 'approved'" type="default" size="small" icon="exception" @click="detail(scope)">查看
                        </a-button>

                        <a-button class="approve-btn" v-if="scope.state === 'approving'" type="primary" size="small" icon="check" @click="approve(scope)">通过
                        </a-button>

                        <a-button v-if="scope.state === 'approving'" type="danger" size="small" icon="close" @click="reject(scope)">驳回
                        </a-button>

                        <a-button class="del-btn" v-if="scope.state === 'draft' || scope.state === 'rejected'" type="danger" ghost size="small" icon="delete" @click="del(scope)">删除
                        </a-button>
                    </div>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "goodsIndex",
    data() {
        return {
            searchForm: {
                type: undefined,
                name: undefined,
                ownerSystem: undefined,
                state: undefined,
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
                    width: "20%"
                },
                {
                    title: "名称",
                    dataIndex: "name",
                    width: "10%"
                },
                {
                    title: "所属系统",
                    dataIndex: "ownerSystem",
                    width: "10%"
                },
                {
                    title: "状态",
                    dataIndex: "state",
                    width: "10%",
                    scopedSlots: { customRender: "state" }
                },
                {
                    title: "操作",
                    width: 250,
                    scopedSlots: { customRender: "action" }
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
                name: "goodsAdd",
                params: {
                    tags: "添加物资"
                }
            })

        },
        detail(data) {
            console.log("查看data的内容：", data);
            this.$router.push({
                name: "goodsDetail",
                params: {
                    tags: "物资详情-" + data.id,
                    id: data.id
                }
            })
        },
        approve(data) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => `确定通过此条记录吗？`,
                onOk() {//TODO 这个请求没完成
                    that.$http
                        .postForm('/bs/goods/approval', { id: data.id })
                        .then((rst) => {
                            that.whenSuccess(rst, (data) => {
                                that.$message.success('已通过！');
                                that.getTableData();
                            });
                        });
                },
                onCancel() {
                    console.log("Cancel");
                }
            });
        },
        reject(scope) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => `确定驳回此条记录吗？`,
                onOk() { //TODO 这个请求没完成
                    that.$http
                        .postForm('/bs/goods/reject', { id: scope.id })
                        .then((rst) => {
                            that.whenSuccess(rst, (data) => {
                                that.$message.success('已驳回！');
                                that.getTableData();
                            });
                        });
                },
                onCancel() {
                    console.log("Cancel");
                }
            });
        },
        //编辑
        edit(data) {
            this.$router.push({
                name: "goodsEdit",
                params: {
                    tags: "编辑物资模型",
                    goodsId: data.id
                }
            })
        },
        commit(scope) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => `确定将此条记录提交审核吗？`,
                onOk() { //TODO 这个请求没完成
                    that.$http
                        .postForm('/bs/goods/commit', { id: scope.id })
                        .then((rst) => {
                            that.whenSuccess(rst, (data) => {
                                that.$message.success('已提交审核');
                                that.getTableData();
                            });
                        });
                },
                onCancel() {
                    console.log("Cancel");
                }
            });
        },
        //删除
        del(scope) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => `确定删除此条记录吗？`,
                onOk() {
                    that.$http
                        .postBody('/bs/goods/remove', { ids: [scope.id] })
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
                    type: "goods",
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.current
                }
            );
            this.loading = true;
            //发送ajax 请求
            console.log("params:" + JSON.stringify(params));
            this.$http
                .postBody("/bs/stuff/list", params)
                .then(data => {
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
    mounted() { },
    activated() {
        this.getTableData();
    }, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
.main-table-btns {
    .approve-btn {
        background-color: #00aa00;
        border-color: #00aa00;
    }

    .commit-btn {
        background-color: #50d4fd;
        border-color: #50d4fd;
    }
}
</style>
