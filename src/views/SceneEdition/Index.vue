<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="null：">
                        <a-input v-model="searchForm.version" placeholder="请输入null" allowClear/>
                    </a-form-item>
                    <a-form-item label="是否当前版本：">
                        <a-input v-model="searchForm.isCurrent" placeholder="请输入是否当前版本" allowClear/>
                    </a-form-item>
                    <a-form-item label="状态：">
                        <a-input v-model="searchForm.state" placeholder="请输入状态" allowClear/>
                    </a-form-item>
                    <a-form-item label="场景负责人：">
                        <a-input v-model="searchForm.managerId" placeholder="请输入场景负责人" allowClear/>
                    </a-form-item>
                    <a-form-item label="场景说明：">
                        <a-input v-model="searchForm.description" placeholder="请输入场景说明" allowClear/>
                    </a-form-item>
                    <a-form-item label="场景id：">
                        <a-input v-model="searchForm.sceneId" placeholder="请输入场景id" allowClear/>
                    </a-form-item>
                    <a-form-item label="场景原型id：">
                        <a-input v-model="searchForm.protoSceneId" placeholder="请输入场景原型id" allowClear/>
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="add()">添加</a-button>
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
                        rowKey="uuid"
                        @change="tblPagination"
                >
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>
                        <a-button type="primary" size="small" icon="delete" @click="del(scope)">删除</a-button>
                    </div>
                </a-table>
            </div>
        </div>

        <!-- 添加model -->
        <a-modal
                title="添加场景版本"
                v-model="addModelVisible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                @ok="handleSubmit"
                okText="保存"
                cancelText="取消"
        >
            <a-form :form="addForm">
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['id', {}]"/>
                </a-form-item>
                <a-form-item label="null：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['version', addFormRule.version]"
                            placeholder="请填写null"
                    />
                </a-form-item>
                <a-form-item label="是否当前版本：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['isCurrent', addFormRule.isCurrent]"
                            placeholder="请填写是否当前版本"
                    />
                </a-form-item>
                <a-form-item label="状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['state', addFormRule.state]"
                            placeholder="请填写状态"
                    />
                </a-form-item>
                <a-form-item label="场景负责人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['managerId', addFormRule.managerId]"
                            placeholder="请填写场景负责人"
                    />
                </a-form-item>
                <a-form-item label="场景说明：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['description', addFormRule.description]"
                            placeholder="请填写场景说明"
                    />
                </a-form-item>
                <a-form-item label="场景id：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['sceneId', addFormRule.sceneId]"
                            placeholder="请填写场景id"
                    />
                </a-form-item>
                <a-form-item label="场景原型id：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['protoSceneId', addFormRule.protoSceneId]"
                            placeholder="请填写场景原型id"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "t_scene_edition",
        data() {
            return {
                //枚举类
                searchForm: {
                    version: null,
                    isCurrent: null,
                    state: null,
                    managerId: null,
                    description: null,
                    sceneId: null,
                    protoSceneId: null,
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
                        title: "null",
                        dataIndex: "version"
                    },
                    {
                        title: "是否当前版本",
                        dataIndex: "isCurrent"
                    },
                    {
                        title: "状态",
                        dataIndex: "state"
                    },
                    {
                        title: "场景负责人",
                        dataIndex: "managerId"
                    },
                    {
                        title: "场景说明",
                        dataIndex: "description"
                    },
                    {
                        title: "场景id",
                        dataIndex: "sceneId"
                    },
                    {
                        title: "场景原型id",
                        dataIndex: "protoSceneId"
                    },
                    {
                        title: "操作",
                        width: 350,
                        scopedSlots: {customRender: "action"}
                    }
                ],
                tblData: [],
                loading: false,
                addForm: null,    // 编辑文档的表单组件
                addFormData: {},  // 编辑文档的表单数据         // 目录表单数据
                addFormRule: {
                    version: {
                        initialValue: "",
                            rules: [
                                {
                                    required: true,
                                    message: "必填"
                                },
                            ]
                        },
                    isCurrent: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    state: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    managerId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    description: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    sceneId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    protoSceneId: {
                        initialValue: "",
                            rules: [
                            ]
                        },

                },
                addModelVisible: false,
                confirmLoading: false,            //添加稳定保存 loading
                showDetail: false,                //编辑  详情 标识
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
                this.addModelVisible = true;
                this.showDetail = false;
                this.confirmLoading = false;
                // this.$nextTick(() => {
                this.addForm.resetFields();
                // });
            },
            //编辑
            edit(data) {
                this.addModelVisible = true;
                //弹窗标题 控制
                this.showDetail = true;
                this.$nextTick(() => {
                    this.addForm.setFieldsValue(data);
            });
            },
            //删除
            del(scope){
                let that =this;
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定删除此条记录吗？`,
                    onOk(){
                    that.$http
                        .postBody('/bs/sceneEdition/remove', {ids: [scope.id]})
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
                            pageSize: this.pagination.pageSize,
                            pageNum: this.pagination.current
                        }
                );
                this.loading = true;
                //发送ajax 请求
                console.log("params:" + JSON.stringify(params));
                this.$http
                        .postBody("/bs/sceneEdition/list", params)
                        .then(data => {
                    this.pagination.total = data.total;
                this.tblData = data.rows;
                this.loading = false;
            }).catch(() => {
                    this.loading = false;
                });
            },
            //添加保存
            handleSubmit(e) {
                e.preventDefault();
                this.addForm.validateFields((err, values) => {
                    if (!err) {
                    console.log("数据：" + JSON.stringify(values));
                    this.confirmLoading = true;
                    this.$http
                        .postBody("/bs/sceneEdition/add", values)
                        .then(() => {
                            this.$message.success("新增成功", 2);
                            this.addModelVisible = false;
                            this.confirmLoading = false;
                            this.getTableData();
                        }).catch(() => {
                                this.confirmLoading = false;
                        });
                }
            });
            }
        },
        created() {
            this.$nextTick(() => {
                //初始化form表单
                this.addForm = this.$form.createForm(this, {name: "addFormData"});
            });
            this.getTableData();
        }
    };
</script>
