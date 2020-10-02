<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入名称" allowClear/>
                    </a-form-item>
                    <a-form-item label="类型：">
                        <a-select placeholder="请选择类型" v-model="searchForm.planGrade" :options="SceneType" allowClear style="width: 150px"></a-select>
                    </a-form-item>
                    <a-form-item label="开始时间：">
                        <a-date-picker v-model="searchForm.beginTime" name="beginTime"/>
                    </a-form-item>
                    <a-form-item label="结束时间：">
                        <a-date-picker v-model="searchForm.endTime" name="endTime"/>
                    </a-form-item>
                    <a-form-item label="状态：">
                        <a-select placeholder="请选择状态" v-model="searchForm.state" :options="SceneState" allowClear style="width: 150px"></a-select>
                    </a-form-item>
                    <a-form-item label="场景负责人：">
                        <a-input v-model="searchForm.managerId" placeholder="请输入场景负责人" allowClear/>
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="Scene.openAddPage()">添加</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <m-table :params="searchForm" :columns="columns" url="/bs/scene/list" ref="sceneTable" :clazz="Scene">
                    <div slot="state" slot-scope="{row: state}" v-html="SceneState.getStateHTML(state)"></div>
                    <div slot="action" slot-scope="{row: scope}" class="main-table-btns">
                        <a-button class="edit-btn" v-if="scope.state === 'draft' || scope.state === 'rejected'"
                                  type="primary" size="small" icon="edit" @click="scope.openEditPage()">{{scope.state === 'draft' ? '编辑' : '重新编辑'}}</a-button>
                        <a-button class="commit-btn" v-if="scope.state === 'draft'" type="primary" size="small" icon="check"
                                  @click="commit(scope)">提交</a-button>

                        <a-button class="detial-btn" v-if="scope.state === 'approving' || scope.state === 'planning' || scope.state === 'planed'"
                                  type="default" size="small" icon="exception" @click="detail(scope)">查看</a-button>

                        <a-button class="plan-btn" v-if="scope.state === 'planning'"
                                  type="primary" size="small" icon="build" @click="assign(scope)">分派</a-button>

                        <a-button class="approve-btn" v-if="scope.state === 'approving'" type="primary" size="small" icon="check"
                                  @click="approve(scope)">通过</a-button>

                        <a-button v-if="scope.state === 'approving'"
                                  type="danger" size="small" icon="close" @click="reject(scope)">驳回</a-button>

                        <!--
                                                <a-button type="primary" size="small" icon="setting" @click="eventPlanning(scope)">任务规划</a-button>-->

                        <a-button class="del-btn" v-if="scope.state === 'draft' || scope.state === 'rejected'"
                                  type="danger" ghost size="small" icon="delete" @click="del(scope)">删除</a-button>
                    </div>
                </m-table>

            </div>
        </div>

<!--        场景详情-->
        <a-drawer title="场景详情" placement="right" :visible="detailDrawer.visible" v-if="detailDrawer.visible" @close="detailDrawer.visible = false" :width="'90vw'">
            <Detail :sceneId="curScene.id"></Detail>
        </a-drawer>
<!--        分派给不同人员进行排期规划-->
        <a-modal @ok="handleSubmit" v-model="assignModalVisible" title="分派规划人员" okText="保存" cancelText="取消">
            <assign-planners-form :sceneId="curScene.id" ref="assignPlannersForm"/>
        </a-modal>
    </div>
</template>

<script>
    import Detail from './Detail';
    import MTable from "@/components/common/MTable";
    import AssignPlannersForm from "@/components/scene/AssignPlannersForm";
    import moment from 'moment';

    export default {
        name: "sceneIndex",
        components: {
            AssignPlannersForm,
            MTable, Detail
        },
        data() {
            return {
                curScene: {},
                //枚举类
                searchForm: {
                    name: null,
                    beginTime: null,
                    endTime: null,
                    planGrade:undefined,
                    state: undefined,
                    managerId: null
                },
                columns: [
                    // {
                    //     title: "场景ID",
                    //     dataIndex: "id",
                    //     width: 150
                    // },
                    {
                        title: "名称",
                        dataIndex: "name",
                        width: 150
                    },
                    {
                        title: "类型",
                        dataIndex: "planGrade",
                        width: 100,
                        customRender: planGrade => {
                            return this.SceneType.getText(planGrade);
                        }
                    },
                    {
                        title: "开始时间",
                        dataIndex: "beginTime",
                        width: 120
                    },
                    {
                        title: "结束时间",
                        dataIndex: "endTime",
                        width: 120
                    },
                    {
                        title: "场景负责人",
                        dataIndex: "managerId",
                        width: 100
                    },
                    {
                        title: "状态",
                        dataIndex: "state",
                        width: 100,
                        scopedSlots: {
                            customRender: "state"
                        }
                    },
                    {
                        title: "操作",
                        width: 250,
                        scopedSlots: {customRender: "action"},
                    }
                ],
                tblData: [],

                addModelVisible: false,
                confirmLoading: false,            //添加稳定保存 loading
                showDetail: false,                //编辑  详情 标识
                detailDrawer: {
                    visible: false
                },
                assignModalVisible: false
            };
        },
        methods: {
            //查询
            doSearch() {
                //利用moment对象格式化选择的日期
                if(this.searchForm.beginTime != null){
                    this.searchForm.beginTime = moment(this.searchForm.beginTime).format("YYYY-MM-DD");
                }
                if(this.searchForm.endTime != null){
                    this.searchForm.endTime = moment(this.searchForm.endTime).format("YYYY-MM-DD");
                }
                this.$refs.sceneTable.getTableData();

                //分页信息修改
                // this.getTableData();
            },
            commit(scope) {
                let that = this;
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定将此条记录提交审核吗？`,
                    onOk() { //TODO 这个请求没完成
                        that.$http
                            .postForm('/bs/scene/commit', {id: scope.id})
                            .then((rst) => {
                                that.whenSuccess(rst, (data) => {
                                    that.$message.success('已提交审核');
                                    that.$refs.sceneTable.getTableData();
                                });
                            });
                    },
                    onCancel() {
                        console.log("Cancel");
                    }
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
                        .postBody('/bs/scene/remove', {ids: [scope.id]})
                        .then((rst) => {
                            that.whenSuccess(rst, data => {
                                that.$message.success('删除成功');
                                that.$refs.sceneTable.getTableData();
                            });
                        });
                    },
                    onCancel(){
                        console.log("Cancel");
                    }
                });
            },
            detail(scope){
                this.curScene = scope;
                this.detailDrawer.visible = true;
            },
            assign(scope){
                this.curScene = scope;
                this.assignModalVisible = true;
            },
            handleSubmit() {
                this.$refs.assignPlannersForm.handleSubmit();
                this.assignModalVisible = false;
            },
            approve(scope){
                let that = this;
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定通过此条记录吗？`,
                    onOk() {//TODO 这个请求没完成
                        that.$http
                            .postForm('/bs/scene/approval', {id: scope.id})
                            .then((rst) => {
                                that.whenSuccess(rst, (data) => {
                                    that.$message.success('已通过！');
                                    that.$refs.sceneTable.getTableData();
                                });
                            });
                    },
                    onCancel() {
                        console.log("Cancel");
                    }
                });
            },
            reject(scope){
                let that = this;
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定驳回此条记录吗？`,
                    onOk() { //TODO 这个请求没完成
                        that.$http
                            .postForm('/bs/scene/reject', {id: scope.id})
                            .then((rst) => {
                                that.whenSuccess(rst, (data) => {
                                    that.$message.success('已驳回！');
                                    that.$refs.sceneTable.getTableData();
                                });
                            });
                    },
                    onCancel() {
                        console.log("Cancel");
                    }
                });
            }
        },
        created() {
            this.$nextTick(() => {
                //初始化form表单
                this.addForm = this.$form.createForm(this, {name: "addFormData"});
            });
            //this.getTableData();
        },
        activated() {
            this.$refs.sceneTable.getTableData();
        }
    };
</script>
<style lang="scss" scoped>
    .main-table-btns {
        .approve-btn {
            background-color: #00aa00;
            border-color: #00aa00;
        }

        .commit-btn {
            background-color: #50D4FD;
            border-color: #50D4FD;
        }
    }
</style>
