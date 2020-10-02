<!--事件模板接收列表页面 - 给管理人员审批事件模板使用-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="form" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="form.name" placeholder="请输入名称" />
                    </a-form-item>
                    <a-form-item label="所属系统：">
                        <a-select placeholder="请选择所属系统" v-model="form.ownerSystem" allowClear style="width:200px">
                            <a-select-option v-for="item in ownerSystem" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
                    </a-form-item>
                    <a-form-item style="float:right">
                        <a-button type="primary" icon='plus' @click="planning()">规划场景</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="id" @change="tblPagination">
                    <span slot="state" slot-scope="scope" v-html="scope.getStateHTML()"></span>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye" @click="scope.openViewPage()"> 查看</a-button>
                        <a-button type="default" size="small" icon="check" @click="approval(scope)">审批</a-button>
                    </div>
                </a-table>
            </div>
        </div>

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
    import EventTemplate from "../../class/EventTemplate"
    export default {
        components: {},
        name: "eventTemplateManageIndex",
        data() {
            return {
                form: {
                    name: undefined,
                    ownerSystem: undefined,
                },
                ownerSystem: [
                    {value: "运行控制中心", text: "运行控制中心"},
                    {value: "AST支持中心", text: "AST支持中心"},
                    {value: "在轨HTQ支持中心", text: "在轨HTQ支持中心"},
                    {value: "有效载荷运营管理中心", text: "有效载荷运营管理中心"},
                    {value: "TSJSSY管理中心", text: "TSJSSY管理中心"},
                    {value: "工程信息中心", text: "工程信息中心"}
                ],
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
                        title: "名称",
                        dataIndex: "name",
                        width: "15%"
                    },
                    {
                        title: "任务目标",
                        dataIndex: "taskCabin",
                        width: "15%"
                    },
                    {
                        title: "运行阶段",
                        dataIndex: "runPhase",
                        width: "15%"
                    },
                    {
                        title: "优先级",
                        dataIndex: "priority",
                        width: "15%"
                    },
                    {title:"持续时间",
                        dataIndex:"duration",
                        width:"15%"
                    },
                    {
                        title: "所属系统",
                        dataIndex: "ownerSystem",
                        width: "15%"
                    },
                    {
                        title: "状态",
                        width: "15%",
                        scopedSlots: { customRender: "state" }
                    },
                    {
                        title: "操作",
                        width: 230,
                        scopedSlots: { customRender: "action" }
                    }
                ],
                tblData: [],
                loading: false,

                approvalWnd: {
                    show: false,
                    submitDisabled: false
                },
                approvalForm: this.$form.createForm(this, { name: 'approvalForm' }),
                approvalFormData: {
                    eventTemplateId: null,
                    result: null,
                    description: null // TODO 保存审批时的意见
                }
            };
        },
        computed: {},
        watch: {},
        methods: {
            planning(){
                let params = Object.assign({}, {
                    taskId: this.$route.query.taskId,
                    instId: this.$route.query.InstanceId
                });
                this.$http.postBody("/bs/resolveSchemeTemplate/planning",params).then(data => {
                    if (data.code === 0) {
                        this.$message.success(data.msg);
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch((e) => {
                    console.error(e);
                    this.loading = false;
                });
            },
            //查询
            doSearch() {
                this.getTablData()
            },
            //添加采集事件
            addGathering() {
                this.$router.push({
                    name: "eventTemplateEdit",
                    params: {
                        tags: "添加采集事件"
                    }
                })
            },
            /**
             * 获取表格数据
             */
            getTablData() {
                let params = Object.assign({}, this.form, {
                    state: "approving",
                    rootType: this.ResolveSchemeTemplate.EVENT_TYPE,
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.current
                });
                this.loading = true;
                this.$http.postBody("/bs/resolveSchemeTemplate/list",params).then(data => {
                    this.tblData = this.ResolveSchemeTemplate.createFrom(data.data.rows);
                    this.pagination.total = data.data.total;
                    this.loading = false;
                }).catch((e) => {
                    console.error(e);
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
             * 账号状态
             */
            getStatusName(state) {
                console.log('state' , state);
                let stautsName = {draft: '编写中', approving: '审批中',  approved: '已入库', rejected: '已驳回'};
                return '<span class="event-status event-status-' + state + '">' + stautsName[state] + '</span>'
            },
            //查看
            viewGathering(data) {
                console.log('viewGathering data', data);
                this.$router.push({
                    name: "demoViewGathering",
                    params: {
                        tags: "查看事件采集"
                    }
                })
            },
            /** 弹出审批窗口 */
            approval(data) {
                console.log('data', data);
                this.approvalFormData.resolveSchemeTemplateId = data.id;
                this.approvalWnd.show = true;
            },
            /** 审批事件模板 */
            approvalEventTemplate() {
                this.approvalWnd.submitDisabled = true;
                this.$http.postBody("/bs/resolveSchemeTemplate/approval", this.approvalFormData).then(data=>{
                    if (data.code === 0) {
                        this.$message.success(data.msg);
                        this.approvalWnd.show = false;
                        this.getTablData();
                    } else {
                        this.$message.error(data.msg);
                    }
                    this.approvalWnd.submitDisabled = false;
                });
            }
        },
        created() {
            this.getTablData()
        },
        mounted() {

        },
        activated() {
            this.getTablData();
        }, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='scss' scoped>

</style>
