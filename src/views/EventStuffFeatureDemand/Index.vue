<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
<!--                    <a-form-item label="可用物功能id：">-->
<!--                        <a-input v-model="searchForm.stuffId" placeholder="请输入可用物功能id" allowClear/>-->
<!--                    </a-form-item>-->
<!--                    <a-form-item label="功能ID：">-->
<!--                        <a-input v-model="searchForm.featureId" placeholder="请输入功能ID" allowClear/>-->
<!--                    </a-form-item>-->
<!--                    <a-form-item label="需求值：">-->
<!--                        <a-input v-model="searchForm.value" placeholder="请输入需求值" allowClear/>-->
<!--                    </a-form-item>-->
                    <a-form-item>
<!--                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>-->
                        <a-button icon="plus" style="margin-left:10px" @click="add()">添加</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
<!--                <m-table url="/bs/event/stuff/demand/list" columns="columns"></m-table>-->
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
                title="添加事件对可用物需求"
                v-model="addModelVisible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                @ok="handleSubmit"
                okText="保存"
                cancelText="取消"
        >
            <a-form :form="addForm">
                <a-form-item label="事件ID：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['eventId', addFormRule.eventId]"
                            placeholder="请填写事件id"
                    />
                </a-form-item>
                <a-form-item label="可用物功能id：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['stuffId', addFormRule.stuffId]"
                            placeholder="请填写可用物功能id"
                    />
                </a-form-item>
                <a-form-item label="功能ID：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['featureId', addFormRule.featureId]"
                            placeholder="请填写功能ID"
                    />
                </a-form-item>
                <a-form-item label="需求值：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['value', addFormRule.value]"
                            placeholder="请填写需求值"
                    />
                </a-form-item>
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['createBy', {}]"/>
                </a-form-item>
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['createTime', {}]"/>
                </a-form-item>
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['updateBy', {}]"/>
                </a-form-item>
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['updateTime', {}]"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import MTable from "../../components/common/MTable";
    export default {
        name: "s_event_stuff_feature_demand",
        components: {MTable},
        data() {
            return {
                //枚举类
                searchForm: {
                    stuffId: null,
                    featureId: null,
                    value: null,
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
                        title: "事件id",
                        dataIndex: "eventId"
                    },
                    {
                        title: "可用物功能id",
                        dataIndex: "stuffId"
                    },
                    {
                        title: "功能ID",
                        dataIndex: "featureId"
                    },
                    {
                        title: "需求值",
                        dataIndex: "value"
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
                    eventId:{},
                    stuffId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    featureId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    value: {
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
                        .postBody('/bs/event/stuff/demand/remove', {ids: [scope.id]})
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
                        .postBody("/bs/event/stuff/demand/list", params)
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
                        .postBody("/bs/event/stuff/demand/add", values)
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
