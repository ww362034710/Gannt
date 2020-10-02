<template>
    <div class="">
        <input type="text">
        <!-- 新增model -->
        <a-modal title="新增" v-model="addModelVisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" okText="保存" cancelText="取消">
            <a-form :form="addForm">
                <a-form-item label="姓名" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input v-decorator="['name', addFormRule.name]" placeholder="请填写名称" />
                </a-form-item>
                <a-form-item label="类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['type',addFormRule.type]" placeholder="选择类型">
                        <a-select-option v-for="item in formTypeData" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-date-picker v-decorator="['createTime', addFormRule.createTime]" placeholder style="width:100%" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "demoIndex",
    components: {},
    data() {
        return {
            form: {
                name: "名称",
                startDate: moment("2015/01/01", "YYYY/MM/DD"),
                endDate: moment("2015/01/01", "YYYY/MM/DD"),
                type: 2
            },
            formTypeData: [],
            addForm: null,
            addFormRule: {
                name: {
                    initialValue: "默认值",
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
                type: {
                    initialValue: 2,
                    rules: [{ required: true, message: "必选" }]
                },
                createTime: {
                    initialValue: moment("2015/01/01", "YYYY/MM/DD"),
                    rules: [
                        { required: true, message: "必选" },
                        {
                            validator: (rule, val, callback) => {
                                if (val && val.format("YYYY-MM-DD") > "2020-01-01") {
                                    callback("最大日期2020-01-01");
                                }
                                callback();
                            },
                            message: "最大日期至2020-01-01"
                        }
                    ]
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
            columns: [
                {
                    title: "姓名",
                    dataIndex: "name",
                    width: "20%"
                },
                {
                    title: "任务类型",
                    dataIndex: "type"
                },
                {
                    title: "时间",
                    dataIndex: "createTime",
                    width: 120
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    width: 80,
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "操作",
                    width: 180,
                    scopedSlots: { customRender: "action" }
                }
            ],
            tblData: [],
            loading: false,
            addModelVisible: false,
            confirmLoading: false
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
            for (let item in this.addFormRule) {
                this.addFormRule[item].initialValue = data[item];
            }
            //时间格式特殊处理
            this.addFormRule.createTime.initialValue = moment(
                data.createTime,
                "YYYY-MM-DD"
            );
            this.$nextTick(() => {
                this.addForm = this.$form.createForm(this, { name: "addForm" });
            });
        },
        //删除
        del(data) {
            let that = this;
            this.$confirm({
                title: "系统提示",
                content: () => <div style="color:red;">确定要删除吗？</div>,
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
         * 获取表格高度
         */
        getTablData() {
            let params = Object.assign({}, this.form, {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            });
            //时间格式化
            params.startDate = new Date(params.startDate).Format("yyyy-MM-dd");
            params.endDate = new Date(params.endDate).Format("yyyy-MM-dd");
            this.loading = true;
            this.$http
                .get("/table")
                .then(data => {
                    this.tblData = data.tblData;
                    this.pagination.total = data.tblData.length;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
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
         */
        getStatusName(data) {
            return data == "1"
                ? '<span style="color:red">开始</span>'
                : data == "2"
                    ? '<span style="color:green">开始</span>'
                    : '<span style="color:#03a9f4">结束</span>';
        },
        //新增
        add() {
            this.addModelVisible = true;
            this.confirmLoading = false;
            this.$nextTick(() => {
                //初始化form表单
                this.addForm = this.$form.createForm(this, { name: "addForm" });
            });
        },
        /**
         * 新增保存
         */
        handleSubmit(e) {
            e.preventDefault();
            this.addForm.validateFields((err, values) => {
                if (!err) {
                    console.log("数据：" + JSON.stringify(values));
                    this.confirmLoading = true;
                    this.$ajax
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
        //获取下拉数据
        getSelectData() {
            this.$http
                .get("/comboBox")
                .then(data => {
                    this.formTypeData = data;
                })
                .catch();
        }
    },
    created() {
        //表格数据
        this.getTablData();
        //查询条件 下拉数据
        this.getSelectData();
    }
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
