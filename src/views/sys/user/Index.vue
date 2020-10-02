<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar" style="padding-top:0;margin-bottom: 16px;">
                <a-form :form="form" layout="inline">
                    <a-form-item label="登录账号：">
                        <a-input v-model="form.loginName" placeholder="请输入账号" />
                    </a-form-item>

                    <a-form-item label="手机号码：">
                        <a-input v-model="form.phonenumber" placeholder="请输入手机号码" />
                    </a-form-item>

                    <a-form-item label="帐号状态：">
                        <a-select showSearch placeholder="请选择类型" v-model="form.status">
                            <a-select-option v-for="item in formTypeData" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="add()">新增</a-button>
                    </a-form-item>

                    <a-form-item style="float:right">
                        <a-button type="danger" icon="delete" @click="del(scope)">删除</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
                    <span slot="status" slot-scope="tags" v-html="getStatusName(tags)"></span>

                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" @click="edit(scope)" icon="book">详情</a-button>
                        <a-button type="default" size="small" icon="reload" @click="resetPwd(scope)">重置</a-button>
                    </div>
                </a-table>
            </div>
            <!-- 新增model -->
            <a-modal :title="!showDetail?'新增用户':'用户详情'" v-model="addModelVisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" :okText="!showDetail?'保存':'关闭'" cancelText="取消">
                <a-form :form="addForm">
                    <a-form-item label="用户昵称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input :disabled="showDetail" v-decorator="['userName', addFormRule.userName]" placeholder="请填写昵称" />
                    </a-form-item>

                    <a-form-item label="归属部门：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-tree-select :disabled="showDetail" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="deptTreeArray" placeholder="请选择部门" treeDefaultExpandAll v-decorator="['deptId', addFormRule.deptId]">
                            <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">节点{{value}}</span>
                        </a-tree-select>
                    </a-form-item>

                    <a-form-item label="手机号码：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input :disabled="showDetail" v-decorator="['phonenumber', addFormRule.phonenumber]" placeholder="请填写手机号码" />
                    </a-form-item>

                    <a-form-item label="登录账号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input :disabled="showDetail" v-decorator="['loginName', addFormRule.loginName]" placeholder="请填写登录账号" />
                    </a-form-item>
                    <a-form-item label="登录密码：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-input :disabled="showDetail" v-decorator="['userId', addFormRule.userId]" placeholder="请填写登录密码" />
                    </a-form-item>
                    <a-form-item label="账号状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                        <a-radio-group :disabled="showDetail" name="statusGroup" v-decorator="['status', addFormRule.status]">
                            <a-radio value="0">正常</a-radio>
                            <a-radio value="1">停用</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>

<script>
// import moment from "moment";

export default {
    name: "sysuserIndex",
    components: {},
    data() {
        return {
            form: {
                loginName: "",
                phonenumber: "",
                status: ""
            },
            formTypeData: [
                { value: "", text: "全部" },
                { value: "0", text: "正常" },
                { value: "1", text: "停用" }
            ],
            addForm: null,
            addFormRule: {
                userName: {
                    initialValue: "",
                    rules: [
                        {
                            required: true,
                            message: "必填"
                        },
                        {
                            min: 2,
                            message: "最小长度2"
                        },
                        {
                            max: 6,
                            message: "最大长度6"
                        }
                    ]
                },
                deptId: {
                    initialValue: "",
                    rules: [{ required: true, message: "请选择部门" }]
                },
                phonenumber: {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入手机号码" }]
                },
                loginName: {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入登录账号" }]
                },
                userId: {
                    initialValue: "",
                    rules: [
                        {
                            required: true,
                            message: "必填"
                        },
                        {
                            min: 6,
                            message: "最小长度6"
                        },
                        {
                            max: 10,
                            message: "最大长度10"
                        }
                    ]
                },
                status: {
                    initialValue: "0"
                }
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
            selectedRowKeys: [],
            columns: [
                {
                    title: "用户ID",
                    dataIndex: "userId",
                    width: 120
                },
                {
                    title: "登录账号",
                    dataIndex: "loginName",
                    width: 120
                },
                {
                    title: "用户昵称",
                    dataIndex: "userName",
                    width: 120
                },
                {
                    title: "部门",
                    dataIndex: "dept.deptName",
                    width: 80
                },
                {
                    title: "手机号码",
                    dataIndex: "phonenumber",
                    width: 120
                },
                {
                    title: "账号状态",
                    dataIndex: "status",
                    width: 80,
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "创建时间",
                    dataIndex: "createTime",
                    width: 120
                },
                {
                    title: "操作",
                    width: 150,
                    scopedSlots: { customRender: "action" }
                }
            ],
            tblData: [],
            loading: false,
            addModelVisible: false,
            confirmLoading: false,
            showDetail: false,
            deptTreeArray: [
                {
                    title: "部门1",
                    value: "0-0",
                    key: "0-0"
                },
                {
                    title: "部门2",
                    value: "0-1",
                    key: "0-1"
                }
            ]
        };
    },
    computed: {},
    watch: {},
    methods: {
        /**
         * 查询 开始时间结束时间校验
         */
        checkTime() {
            if (this.form.startDate > this.form.endDate) {
                [this.form.startDate, this.form.endDate] = [
                    this.form.endDate,
                    this.form.startDate
                ];
            }
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
                this.addForm = this.$form.createForm(this, { name: "addForm" });
            });
        },
        //重置
        resetPwd(data) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => <div style="color:red;">确定要重置吗？</div>,
                onOk() {
                    that.$http
                        .post("/del", {
                            id: data.uuid
                        })
                        .then(() => {
                            that.$message.success("删除成功", 2);
                            //刷新表格
                            this.getTablData();
                        });
                },
                onCancel() {
                    console.log("Cancel");
                }
            });
        },
        /**
         * 查询
         */
        doSearch() {
            //分页信息修改
            this.pagination.current = 1;
            this.getTablData();
        },
        /**
         * 获取表格数据
         */
        getTablData() {
            let params = Object.assign({}, this.form, {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            });
            this.loading = true;
            this.$http.postBody("/system/user/list", params)
                .then(data => {
                    this.tblData = data.data.rows;
                    this.pagination.total = data.data.total;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //表格选中行
        onSelectChange(selectedRowKeys) {
            console.log("selectedRowKeys changed: ", selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        /**
         * 表格分页、排序、筛选变化时触发
         */
        tblPagination(pagination) {
            //保存当前分页信息
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.getTablData();
        },
        /**
         * 表格formatter
         * 账号状态
         */
        getStatusName(data) {
            return data == "0"
                ? '<span style="color:green">正常</span>'
                : data == "1"
                    ? '<span style="color:red">停用</span>'
                    : '<span style="color:#03a9f4">未知</span>';
        },
        //新增
        add() {
            this.addModelVisible = true;
            this.confirmLoading = false;
            this.showDetail = false;
            this.$nextTick(() => {
                //初始化form表单
                this.addForm = this.$form.createForm(this, { name: "addForm" });
            });
        },
        //删除
        del() {
            if (this.selectedRowKeys.length == 0) {
                return;
            } else {
                this.$confirm({
                    title: "系统提示",
                    content: () => <div style="color:red;">确定删除当前用户吗？</div>,
                    onOk() {
                        that.$http
                            .post("system/user/remove", {
                                id: this.selectedRowKeys.join(",")
                            })
                            .then(() => {
                                that.$message.success("删除成功", 2);
                                //刷新表格
                                this.getTablData();
                            });
                    },
                    onCancel() {
                        console.log("Cancel");
                    }
                });
            }
        },
        /**
         * 新增保存
         */
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
                        .post("/add")
                        .then(() => {
                            this.$message.success("新增成功", 2);
                            this.addModelVisible = false;
                            this.confirmLoading = false;
                        })
                        .catch(() => {
                            this.confirmLoading = false;
                        });
                }
            });
        },
        //部门
        getTreeData() {
            // 获得部门列表
            this.$http.post("system/dept/treeData").then(data => {
                this.deptTreeArray = data;
            });
        }
    },
    created() {
        //表格数据
        this.getTablData();
    },
    mounted() { },
    beforeCreate() { }
};
</script>
<style lang='scss' scoped>
.main {
    .search-main {
        padding: 8px 0;
        box-sizing: border-box;
    }
}
</style>
