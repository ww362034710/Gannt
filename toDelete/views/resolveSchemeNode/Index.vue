<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="分解方案id：">
                        <a-input v-model="searchForm.resolveSchemeId" placeholder="请输入分解方案id" allowClear/>
                    </a-form-item>
                    <a-form-item label="节点类型(目标/事件)：">
                        <a-select v-model="searchForm.nodeType" :defaultValue="nodeTypeData[0].value" style="width: 120px">
                            <a-select-option
                                    allowClear
                                    v-for="item in nodeTypeData"
                                    :key="item.value"
                                    :value="item.value"
                            >{{item.text}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="节点：">
                        <a-input v-model="searchForm.nodeId" placeholder="请输入节点" allowClear/>
                    </a-form-item>
                    <a-form-item label="顺序号：">
                        <a-input v-model="searchForm.orderNo" placeholder="请输入顺序号" allowClear/>
                    </a-form-item>
                    <a-form-item label="上级节点：">
                        <a-input v-model="searchForm.parentId" placeholder="请输入上级节点" allowClear/>
                    </a-form-item>
                    <a-form-item label="节点对应时间：">
                        <a-date-picker v-model="searchForm.nodeTime" name="nodeTime"/>
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
                title="添加分解方案节点"
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
                <a-form-item label="分解方案id：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['resolveSchemeId', addFormRule.resolveSchemeId]"
                            placeholder="请填写分解方案id"
                    />
                </a-form-item>
                <a-form-item label="节点类型(目标/事件)：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['nodeType',addFormRule.nodeType]" placeholder="选择节点类型(目标/事件)">
                        <a-select-option
                                allowClear
                                v-for="item in nodeTypeData"
                                :key="item.value"
                                :value="item.value"
                        >{{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="节点：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['nodeId', addFormRule.nodeId]"
                            placeholder="请填写节点"
                    />
                </a-form-item>
                <a-form-item label="顺序号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['orderNo', addFormRule.orderNo]"
                            placeholder="请填写顺序号"
                    />
                </a-form-item>
                <a-form-item label="上级节点：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['parentId', addFormRule.parentId]"
                            placeholder="请填写上级节点"
                    />
                </a-form-item>
                <a-form-item label="节点对应时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['nodeTime', addFormRule.nodeTime]"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "s_resolve_scheme_node",
        data() {
            return {
                //枚举类
                nodeTypeData: [
                    {text: "option1", value: 1},
                    {text: "option2", value: 2}
                ],
                searchForm: {
                    resolveSchemeId: null,
                    nodeType: null,
                    nodeId: null,
                    orderNo: null,
                    parentId: null,
                    nodeTime: null,
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
                        title: "分解方案id",
                        dataIndex: "resolveSchemeId"
                    },
                    {
                        title: "节点类型(目标/事件)",
                        dataIndex: "nodeType"
                    },
                    {
                        title: "节点",
                        dataIndex: "nodeId"
                    },
                    {
                        title: "顺序号",
                        dataIndex: "orderNo"
                    },
                    {
                        title: "上级节点",
                        dataIndex: "parentId"
                    },
                    {
                        title: "节点对应时间",
                        dataIndex: "nodeTime"
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
                    resolveSchemeId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    nodeType: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    nodeId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    orderNo: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    parentId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    nodeTime: {
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
                        .postBody('/bs/node/remove', {ids: [scope.id]})
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
                        .postBody("/bs/node/list", params)
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
                        .postBody("/bs/node/add", values)
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
