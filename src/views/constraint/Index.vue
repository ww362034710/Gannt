<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="约束名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入约束名称" allowClear/>
                    </a-form-item>
                    <a-form-item label="约束类型：">
                        <a-select v-model="searchForm.type" :defaultValue="typeData[0].value" style="width: 120px">
                            <a-select-option
                                    allowClear
                                    v-for="item in typeData"
                                    :key="item.value"
                                    :value="item.value"
                            >{{item.text}}
                            </a-select-option>
                        </a-select>
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
                title="添加约束"
                v-model="addModelVisible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                @ok="handleSubmit"
                okText="保存"
                cancelText="取消"
        >
            <a-form :form="addForm">
                <a-form-item label="约束名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['name', addFormRule.name]"
                            placeholder="请填写约束名称"
                    />
                </a-form-item>
                <a-form-item label="约束类型：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['type',addFormRule.type]" placeholder="选择约束类型">
                        <a-select-option
                                allowClear
                                v-for="item in typeData"
                                :key="item.value"
                                :value="item.value"
                        >{{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="需要：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['model', addFormRule.model]"
                            placeholder="请填写需要"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "t_constraint",
        data() {
            return {
                //枚举类
                typeData: [
                    {text: "option1", value: 1},
                    {text: "option2", value: 2}
                ],
                searchForm: {
                    name: "",
                    type: "",
                    model: "",
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
                        title: "约束名称",
                        dataIndex: "name",
                        width: 200
                    },
                    {
                        title: "约束类型",
                        dataIndex: "type",
                        width: 200
                    },
                    {
                        title: "需要",
                        dataIndex: "model",
                        width: 200
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
                    name: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    type: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    model: {
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
                for (let item in this.addFormRule) {
                    this.addFormRule[item].initialValue = data[item];
                }
                this.$nextTick(() => {
                    this.addForm.setFieldsValue(this.addFormData);
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
                        .postBody('/bs/constraint/remove', {ids: [scope.id]})
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
                        .postBody("/bs/constraint/list", params)
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
                //详情关闭
                if (this.showDetail) {
                    this.addModelVisible = false;
                    return;
                }
                this.addForm.validateFields((err, values) => {
                    if (!err) {
                    console.log("数据：" + JSON.stringify(values));
                    this.confirmLoading = true;
                    this.$http
                        .postBody("/bs/constraint/add", values)
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
