<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="规划名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入规划名称" allowClear/>
                    </a-form-item>
                    <!--<a-form-item label="规划层级：">-->
                        <!--<a-input v-model="searchForm.planGrade" placeholder="请输入规划层级" allowClear/>-->
                    <!--</a-form-item>-->
                    <!--<a-form-item label="状态：">-->
                        <!--<a-input v-model="searchForm.state" placeholder="请输入状态" allowClear/>-->
                    <!--</a-form-item>-->
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
                        <a-button type="primary" size="small" icon="eye" @click="detail(scope)">查看</a-button>
                        <a-button type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>
                        <a-button type="primary" size="small" icon="delete" @click="del(scope)">删除</a-button>
                    </div>
                </a-table>
            </div>
        </div>

        <!-- 添加model -->
        <a-modal
                title="添加规划计划"
                v-model="addModelVisible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                :width="750"
                @ok="handleSubmit"
                okText="保存"
                cancelText="取消"
        >
            <a-form :form="addForm">
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['id', {}]"/>
                </a-form-item>
                <a-form-item label="规划名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['name', addFormRule.name]"
                            placeholder="请填写规划名称"
                    />
                </a-form-item>
                <!--<a-form-item label="规划层级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
                    <!--<a-input-->
                            <!--allowClear-->
                            <!--v-decorator="['planGrade', addFormRule.planGrade]"-->
                            <!--placeholder="请填写规划层级"-->
                    <!--/>-->
                <!--</a-form-item>-->
                <a-form-item label="规划层级" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['planGrade']" placeholder="请选择规划层级">
                        <a-select-option
                                v-for="item in planGradeList"
                                :key="item.key"
                                :value="item.value"
                        >{{item.text}}</a-select-option>
                    </a-select>
                </a-form-item>
                <!--<a-form-item label="状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
                    <!--<a-input-->
                            <!--allowClear-->
                            <!--v-decorator="['state', addFormRule.state]"-->
                            <!--placeholder="请填写状态"-->
                    <!--/>-->
                <!--</a-form-item>-->
                <a-form-item label="状态" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['state']" placeholder="请选择状态">
                        <a-select-option
                                v-for="item in stateList"
                                :key="item.key"
                                :value="item.value"
                        >{{item.text}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="公文文件数量：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['sysFileId', addFormRule.sysFileId]"
                            placeholder="请输入公文文件数量"
                    />
                </a-form-item>
                <a-form-item label="描述：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea
                            allowClear
                            v-decorator="['description', addFormRule.description]"
                            placeholder="请填写描述"
                    />
                </a-form-item>
                <a-form-item label="计划开始时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['planStartTime', addFormRule.planStartTime]"
                    />
                </a-form-item>
                <a-form-item label="计划结束时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['planEndTime', addFormRule.planEndTime]"
                    />
                </a-form-item>
                <a-form-item label="采集开始时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['gatherStartTime', addFormRule.gatherStartTime]"
                    />
                </a-form-item>
                <a-form-item label="采集结束时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['gatherFinishTime', addFormRule.gatherFinishTime]"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "s_plan",
        data() {
            return {
                //枚举类
                searchForm: {
                    name: null,
                    planGradeList: [],
                    stateList: [],
                    sysFileId: null,
                    description: null,
                    planStartTime: null,
                    planEndTime: null,
                    gatherStartTime: null,
                    gatherFinishTime: null,
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
                        title: "规划名称",
                        dataIndex: "name"
                    },
                    // {
                    //     title: "规划层级",
                    //     dataIndex: "planGrade"
                    // },
                    // {
                    //     title: "状态",
                    //     dataIndex: "state"
                    // },
                    // {
                    //     title: "公文文件",
                    //     dataIndex: "sysFileId"
                    // },
                    {
                        title: "描述",
                        dataIndex: "description"
                    },
                    {
                        title: "计划开始时间",
                        dataIndex: "planStartTime"
                    },
                    {
                        title: "计划结束时间",
                        dataIndex: "planEndTime"
                    },
                    {
                        title: "采集开始时间",
                        dataIndex: "gatherStartTime"
                    },
                    {
                        title: "采集结束时间",
                        dataIndex: "gatherFinishTime"
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
                                {
                                    required: true,
                                    message: "必填"
                                },
                            ]
                        },
                    // planGrade: {
                    //     initialValue: "",
                    //         rules: [
                    //         ]
                    //     },
                    // state: {
                    //     initialValue: "",
                    //         rules: [
                    //         ]
                    //     },
                    sysFileId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    description: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    planStartTime: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    planEndTime: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    gatherStartTime: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    gatherFinishTime: {
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
            //获取规划计划中规划层级和状态枚举信息
            async _getInit() {
                {
                    let res = await this.$http.get("/bs/plan/enum/planGrade");
                    if (res.code) return false;
                    this.planGradeList = res.data;
                }
                {
                    let res = await this.$http.get("/bs/plan/enum/planState");
                    if (res.code) return false;
                    this.stateList = res.data;
                }
            },
            //查询
            doSearch() {
                //分页信息修改
                this.pagination.current = 1;
                this.getTableData();
            },
            // 查看详情
            detail(data) {
                this.$router.push({
                    name: "sPlanDetail",
                    params: {
                        tags: "规划计划详情-" + data.name,
                        id: data.id
                    }
                })
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
                        .postBody('bs/plan/remove', {ids: [scope.id]})
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
                        .postBody("/bs/plan/list", params)
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
                        .postBody("/bs/plan/add", values)
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
            this._getInit();
            this.$nextTick(() => {
                //初始化form表单
                this.addForm = this.$form.createForm(this, {name: "addFormData"});
            });
            this.getTableData();
        }
    };
</script>
