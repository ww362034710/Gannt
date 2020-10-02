<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="事件名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入事件名称" allowClear/>
                    </a-form-item>
                    <a-form-item label="开始时间：">
                        <a-date-picker v-model="searchForm.startTime" name="startTime"/>
                    </a-form-item>
                    <a-form-item label="结束时间：">
                        <a-date-picker v-model="searchForm.endTime" name="endTime"/>
                    </a-form-item>
                    <a-form-item label="预计工期：">
                        <a-input v-model="searchForm.predictDay" placeholder="请输入预计工期" allowClear/>
                    </a-form-item>
                    <a-form-item label="状态：">
                        <a-select v-model="searchForm.status" :defaultValue="statusData[0].value" style="width: 120px">
                            <a-select-option
                                    allowClear
                                    v-for="item in statusData"
                                    :key="item.value"
                                    :value="item.value"
                            >{{item.text}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="事件原型：">
                        <a-input v-model="searchForm.eventUid" placeholder="请输入事件原型" allowClear/>
                    </a-form-item>
                    <a-form-item label="版本号：">
                        <a-input v-model="searchForm.eventNum" placeholder="请输入版本号" allowClear/>
                    </a-form-item>
                    <a-form-item label="负责人：">
                        <a-input v-model="searchForm.userId" placeholder="请输入负责人" allowClear/>
                    </a-form-item>
                    <a-form-item label="是否删除：">
                        <a-input v-model="searchForm.isDeleted" placeholder="请输入是否删除" allowClear/>
                    </a-form-item>
                    <a-form-item label="是否当前版本：">
                        <a-input v-model="searchForm.isCurrent" placeholder="请输入是否当前版本" allowClear/>
                    </a-form-item>
                    <a-form-item label="是否受影响：">
                        <a-input v-model="searchForm.beInfluenced" placeholder="请输入是否受影响" allowClear/>
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
                title="添加事件版本"
                v-model="addModelVisible"
                :maskClosable="false"
                :confirmLoading="confirmLoading"
                @ok="handleSubmit"
                okText="保存"
                cancelText="取消"
        >
            <a-form :form="addForm">
                <a-form-item label="事件名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['name', addFormRule.name]"
                            placeholder="请填写事件名称"
                    />
                </a-form-item>
                <a-form-item label="开始时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['startTime', addFormRule.startTime]"
                    />
                </a-form-item>
                <a-form-item label="结束时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker
                            allowClear
                            v-decorator="['endTime', addFormRule.endTime]"
                    />
                </a-form-item>
                <a-form-item label="预计工期：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['predictDay', addFormRule.predictDay]"
                            placeholder="请填写预计工期"
                    />
                </a-form-item>
                <!-- RadioButton -->
                <a-form-item label="状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['status',addFormRule.status]" placeholder="选择状态">
                        <a-select-option
                                allowClear
                                v-for="item in statusData"
                                :key="item.value"
                                :value="item.value"
                        >{{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="事件原型：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['eventUid', addFormRule.eventUid]"
                            placeholder="请填写事件原型"
                    />
                </a-form-item>
                <a-form-item label="版本号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['eventNum', addFormRule.eventNum]"
                            placeholder="请填写版本号"
                    />
                </a-form-item>
                <a-form-item label="负责人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['userId', addFormRule.userId]"
                            placeholder="请填写负责人"
                    />
                </a-form-item>
                <a-form-item label="是否删除：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['isDeleted', addFormRule.isDeleted]"
                            placeholder="请填写是否删除"
                    />
                </a-form-item>
                <a-form-item label="是否当前版本：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['isCurrent', addFormRule.isCurrent]"
                            placeholder="请填写是否当前版本"
                    />
                </a-form-item>
                <a-form-item label="备注：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea
                            allowClear
                            v-decorator="['comm', addFormRule.comm]"
                            placeholder="请填写备注" :rows="4"
                    />
                </a-form-item>
                <a-form-item label="是否受影响：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['beInfluenced', addFormRule.beInfluenced]"
                            placeholder="请填写是否受影响"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "t_event_edition",
        data() {
            return {
                //枚举类
                statusData: [
                    {text: "option1", value: 1},
                    {text: "option2", value: 2}
                ],
                searchForm: {
                    name: "",
                    startTime: "",
                    endTime: "",
                    predictDay: "",
                    status: "",
                    eventUid: "",
                    eventNum: "",
                    userId: "",
                    isDeleted: "",
                    isCurrent: "",
                    comm: "",
                    beInfluenced: "",
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
                        title: "事件名称",
                        dataIndex: "name"
                    },
                    {
                        title: "开始时间",
                        dataIndex: "startTime"
                    },
                    {
                        title: "结束时间",
                        dataIndex: "endTime"
                    },
                    {
                        title: "预计工期",
                        dataIndex: "predictDay"
                    },
                    {
                        title: "状态",
                        dataIndex: "status"
                    },
                    {
                        title: "事件原型",
                        dataIndex: "eventUid"
                    },
                    {
                        title: "版本号",
                        dataIndex: "eventNum"
                    },
                    {
                        title: "负责人",
                        dataIndex: "userId"
                    },
                    {
                        title: "是否删除",
                        dataIndex: "isDeleted"
                    },
                    {
                        title: "是否当前版本",
                        dataIndex: "isCurrent"
                    },
                    {
                        title: "备注",
                        dataIndex: "comm"
                    },
                    {
                        title: "是否受影响",
                        dataIndex: "beInfluenced"
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
                    startTime: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    endTime: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    predictDay: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    status: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    eventUid: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    eventNum: {
                        initialValue: "",
                            rules: [
                                {
                                    required: true,
                                    message: "必填"
                                },
                            ]
                        },
                    userId: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    isDeleted: {
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
                                {
                                    required: true,
                                    message: "必填"
                                },
                            ]
                        },
                    comm: {
                        initialValue: "",
                            rules: [
                            ]
                        },
                    beInfluenced: {
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
                        .postBody('/bs/edition/remove', {ids: [scope.id]})
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
                        .postBody("/bs/edition/list", params)
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
                        .postBody("/bs/edition/add", values)
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
