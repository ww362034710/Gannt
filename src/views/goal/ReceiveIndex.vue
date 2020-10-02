// 目标接收页面  管理人员审核目标的地方
<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="目标名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入目标名称" allowClear />
                    </a-form-item>
                    <!--                    <a-form-item label="实验类别：">-->
                    <!--                        <a-input v-model="searchForm.testKind" placeholder="请输入实验类别" allowClear/>-->
                    <!--                    </a-form-item>-->
                    <!--                    <a-form-item label="重要等级：">-->
                    <!--                        <a-input v-model="searchForm.importantGrade" placeholder="请输入重要等级" allowClear/>-->
                    <!--                    </a-form-item>-->
                    <!--                    <a-form-item label="规划层级：">-->
                    <!--                        <a-input v-model="searchForm.planGrade" placeholder="请输入规划层级" allowClear/>-->
                    <!--                    </a-form-item>-->
                    <!--                    <a-form-item label="创建人：">-->
                    <!--                        <a-input v-model="searchForm.createPerson" placeholder="请输入创建人" allowClear/>-->
                    <!--                    </a-form-item>-->
                    <!--                    <a-form-item label="修改人：">-->
                    <!--                        <a-input v-model="searchForm.updatePerson" placeholder="请输入修改人" allowClear/>-->
                    <!--                    </a-form-item>-->
                    <!--                    <a-form-item label="预留：">-->
                    <!--                        <a-input v-model="searchForm.mark" placeholder="请输入预留" allowClear/>-->
                    <!--                    </a-form-item>-->
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                        <!--                        <a-button icon="plus" style="margin-left:10px" @click="addGoal()">添加</a-button>-->
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <a-table bordered :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination">
                    <span slot="state" slot-scope="scope" v-html="scope.getStateHTML()"></span>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye" @click="scope.openViewPage()">查看</a-button>
                        <a-button type="default" size="small" icon="check" @click="approval(scope)">审批</a-button>
                    </div>
                </a-table>
            </div>
        </div>

        <!-- 添加model -->
        <a-modal title="添加目标" v-model="addModelVisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" okText="保存" cancelText="取消">
            <a-form :form="addForm">
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['uid', {}]" />
                </a-form-item>
                <a-form-item label="目标名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['name', addFormRule.name]" placeholder="请填写目标名称" />
                </a-form-item>
                <a-form-item label="实验类别：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['testKind', addFormRule.testKind]" placeholder="请填写实验类别" />
                </a-form-item>
                <a-form-item label="重要等级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['importantGrade',addFormRule.importantGrade]" placeholder="选择类型">
                        <a-select-option allowClear v-for="item in importantGrade" :key="item.value" :value="item.value">{{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="规划层级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['planGrade', addFormRule.planGrade]" placeholder="请填写规划层级" />
                </a-form-item>
                <a-form-item label="提出机构：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['submittingAgency', addFormRule.submittingAgency]" placeholder="请填写提出机构" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 审批 -->
        <a-modal title="审批操作" v-model="approvalWnd.show" :maskClosable="false" :width="800" :confirmLoading="approvalWnd.submitDisabled" @ok="approvalEventTemplate" okText="确认" cancelText="取消">
            <a-form :form="approvalForm" layout="horizontal">
                <a-form-item label="审批意见：">
                    <a-radio-group v-model="approvalFormData.result">
                        <!--                        todo 应该是审批结果  而不是状态  此处省事了-->
                        <a-radio value="approved">同意</a-radio>
                        <a-radio value="rejected">拒绝</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="审批意见：">
                    <a-textarea v-model="approvalFormData.description" placeholder="请输入" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import VueSupport from '../../class/base/VueSupport'
import EventTemplate from '../../class/EventTemplate'
import Goal from '../../class/Goal'

export default {
    name: "s_goal",
    data() {
        return {
            rootId: null,
            nodeId: null,
            schemeId: null,
            //枚举类
            searchForm: {
                name: null,
                testKind: null,
                importantGrade: null,
                planGrade: null,
                createPerson: null,
                updatePerson: null,
                mark: null,
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
                    title: "目标名称",
                    dataIndex: "name"
                },
                {
                    title: "实验类别",
                    dataIndex: "testKind"
                },
                {
                    title: "重要等级",
                    dataIndex: "importantGrade"
                },
                {
                    title: "规划层级",
                    dataIndex: "planGrade"
                },
                {
                    title: "提出机构",
                    dataIndex: "submittingAgency"
                },
                {
                    title: "状态",
                    scopedSlots: { customRender: "state" }
                },
                // {
                //     title: "创建人",
                //     dataIndex: "createPerson"
                // },
                // {
                //     title: "修改人",
                //     dataIndex: "updatePerson"
                // },
                // {
                //     title: "预留",
                //     dataIndex: "mark"
                // },
                {
                    title: "操作",
                    width: 200,
                    scopedSlots: { customRender: "action" }
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
                testKind: {
                    initialValue: "",
                    rules: [
                    ]
                },

                planGrade: {
                    initialValue: "",
                    rules: [
                    ]
                },
                submittingAgency: {
                    rules: []
                },
                createPerson: {
                    initialValue: "",
                    rules: [
                    ]
                },
                updatePerson: {
                    initialValue: "",
                    rules: [
                    ]
                },
                mark: {
                    initialValue: "",
                    rules: [
                    ]
                },

            },
            importantGrade: [
                { value: 1, text: "重大目标" },
                { value: 2, text: "重要目标" },
                { value: 3, text: "普通目标" },
                { value: 4, text: "一般目标" }
            ],
            addModelVisible: false,
            confirmLoading: false,            //添加稳定保存 loading
            showDetail: false,                //编辑  详情 标识

            approvalWnd: {
                show: false,
                submitDisabled: false
            },
            approvalForm: this.$form.createForm(this, { name: 'approvalForm' }),
            approvalFormData: {
                resolveSchemeId: null,
                result: null,
                description: null // TODO 保存审批时的意见
            }
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
        edit(scope) {
            this.schemeId = scope.resolveSchemeId;
            this.nodeId = scope.nodeId;
            // data.url = '/bs/deprecated/goal/edit';
            // console.log(data);
            // this.addModelVisible = true;
            // //弹窗标题 控制
            // this.showDetail = true;

            this.$router.push({
                name: "goalEdit",
                params: {
                    tags: "编辑",
                    type: "编辑",
                    uid: scope.uid,
                    parentId: scope.parentId,
                    resolveSchemeId: scope.resolveSchemeId,
                    data: scope
                }
            });
            //     this.$nextTick(() => {
            //         this.addForm.setFieldsValue(data);
            // });
        },
        //删除
        del(scope) {
            let that = this;
            let data = { uid: scope.uid, schemeId: scope.resolveSchemeId, nodeId: scope.nodeId };
            // data.idsList = [scope.uid,scope.resolveSchemeId,scope.nodeId];
            console.log(data);
            this.$confirm({
                title: "系统提示",
                content: () => `确定删除此条记录吗？`,
                onOk() {
                    that.$http
                        .postBody('/bs/deprecated/goal/remove', { ids: [scope.uid, scope.resolveSchemeId, scope.nodeId] })
                        .then((rst) => {
                            that.whenSuccess(rst, () => {
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
                    rootType: this.ResolveScheme.GOAL_TYPE,
                    state: "approving",
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.current
                }
            );
            this.loading = true;
            //发送ajax 请求
            console.log("params:" + JSON.stringify(params));
            this.$http.postBody("/bs/resolveScheme/list", params).then(data => {
                this.pagination.total = data.total;
                this.tblData = this.ResolveScheme.createFrom(data.data.rows);
                this.loading = false;
            }).catch((e) => {
                console.error(e);
                this.loading = false;
            });
        },
        //添加目标
        addGoal(scope) {
            this.$router.push({
                name: "goalAddGoal",
                params: {
                    tags: "添加目标",
                    //  parentId: scope.rootId,
                    // parentName:scope.name,
                    // resolveSchemeId:scope.resolveSchemeId
                }
            })
        },
        testTree(scope) {
            let params = { uid: scope.resolveSchemeId }
            this.$http.postBody("/bs/deprecated/goal/queryTree", params).then(data => {
                console.log(data);
            }).catch(() => {
                console.log("出错了!");
            })
        },

        //跳转到拆解事件
        goToEvent(data) {
            console.log(data);
            //打开一个标签页 params 加上tags 名称
            this.$router.push({
                name: "dismantlingEventIndex",
                params: {
                    tags: "事件列表",
                    goalId: data.resolveSchemeId

                }
            });
        },

        //添加保存
        handleSubmit(e) {
            let url = '/bs/deprecated/goal/add';
            e.preventDefault();
            this.addForm.validateFields((err, values) => {
                if (!err) {
                    console.log("数据：" + JSON.stringify(values));
                    this.confirmLoading = true;
                    // values.parentId
                    //     values.nodeType = '目标';
                    //     values.state = '未提交';
                    values.schemeId = this.schemeId;
                    values.nodeId = this.nodeId;
                    console.log(values);
                    // if (values.rootId!==null&&values.goalId!=null){
                    //     url = '/bs/deprecated/goal/edit';
                    // }
                    this.$http
                        .postBody("/bs/deprecated/goal/edit", values)
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
        },
        /** 弹出审批窗口 */
        approval(data) {
            console.log('data', data);
            this.approvalFormData.resolveSchemeId = data.id;
            this.approvalWnd.show = true;
        },
        /** 审批 */
        approvalEventTemplate() {
            this.approvalWnd.submitDisabled = true;
            this.$http.postBody("/bs/resolveScheme/approval", this.approvalFormData).then(data => {
                if (data.code === 0) {
                    this.$message.success(data.msg);
                    this.approvalWnd.show = false;
                    this.getTableData();
                } else {
                    this.$message.error(data.msg);
                }
                this.approvalWnd.submitDisabled = false;
            });
        }
    },
    created() {
        this.getTableData();
    }
};
</script>
