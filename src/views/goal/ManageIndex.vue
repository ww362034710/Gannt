<!--目标采集页面  用户编写/提交目标-->
<template>
    <div class="page-main page-demand-list">
        <div class="container-content">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="目标名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入目标名称" allowClear/>
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
                    </a-form-item>
                    <a-form-item style="float:right">
                        <a-button type="primary" icon='plus' @click="ResolveScheme.openAddPage('goal')">采集目标</a-button>
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
                        bordered
                >
<!--                <m-table ref="table"   url="/bs/resolveScheme/list"  :columns="columns" :params="{rootType: this.ResolveScheme.GOAL_TYPE}"/>-->
                   <span slot="state" slot-scope="scope" v-html="scope.getStateHTML()"></span>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye" @click="scope.openViewPage()"> 查看</a-button>
                        <a-button type="primary" size="small" icon="edit" @click="scope.openEditPage()">编辑</a-button> <!--TODO-->
                        <a-button  size="small" icon="save" @click="saveToTemplate(scope)">另存模板</a-button> <!--TODO-->
                        <a-button type="danger" size="small" icon="delete" @click="del(scope)">删除</a-button>
                    </div>
                 </a-table>
            </div>
        </div>
    </div>
</template>

<script>
    import MTable from "../../components/common/MTable";
    export default {
        name: "s_goal",
        components: {MTable},
        data() {
            return {
                rootId:null,
                nodeId:null,
                schemeId:null,
                dataToSave: {},//另存为模板设置
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
                        title:"提出机构",
                        dataIndex:"submittingAgency"
                    },
                    {
                        title:"状态",
                        scopedSlots: {customRender: "state"}
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
                        width: 350,
                        scopedSlots: {customRender: "action"}
                    }
                ],
                tblData: [],
                loading: false,
                importantGrade: [
                    { value: 1, text: "重大目标" },
                    { value: 2, text: "重要目标" },
                    { value: 3, text: "普通目标" },
                    { value: 4, text: "一般目标" }
                ]
            };
        },
        methods: {
            /*
            另存为目标模板
            * */
            saveToTemplate(data){
                let that =this;
                this.$http.postBody("/bs/resolveScheme/getSchemeTreeData", { schemeId: data.id}).then(rst => {
                    if (rst.code === 0) {
                        this.dataToSave = { schemeTemplate:  rst.data.scheme, treeNodes: rst.data.treeNodes };
                        console.log('获取到的数据: ', this.dataToSave);
                    } else {
                        this.$message.error(rst.msg);
                    }
                });

                this.$confirm({
                    title: "系统提示",
                    content: () => `确定将此记录另存为模板吗？`,
                    onOk(){
                        that.dataToSave.saveToTemplate = true;
                        console.log('保存到后台的数据: ', that.dataToSave);
                        that.$http.postBody("/bs/resolveSchemeTemplate/save", that.dataToSave).then(rst => {
                            if (rst.code === 0) {
                                that.$message.success(rst.msg);
                            } else {
                                that.$message.error(rst.msg);
                            }
                        });
                    },
                    onCancel(){
                        console.log("Cancel");
                    }
                });

            },
            //查询
            doSearch() {
                //分页信息修改
                this.pagination.current = 1;
                this.getTableData();
            },
            //删除
            del(scope){
                console.log(scope);
                let that =this;
                // let data = {uid:scope.uid,schemeId:scope.resolveSchemeId,nodeId:scope.nodeId};
                // data.idsList = [scope.uid,scope.resolveSchemeId,scope.nodeId];
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定删除此条记录吗？`,
                    onOk(){
                    that.$http
                        .postBody('/bs/resolveScheme/remove', {ids:[scope.id]})
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
            /** 提交 */
            submit(data) {
                this.$http.postBody("/bs/resolveScheme/approval", {resolveSchemeId: data.id, result: 'approving'}).then(data=>{      // TODO 使用枚举
                    if (data.code === 0) {
                        this.$message.success(data.msg);
                        this.getTableData();
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            },
            //获取表格数据
            getTableData() {
                let params = Object.assign(
                        this.searchForm,
                        {
                            state:"approved",
                            rootType: this.ResolveScheme.GOAL_TYPE,
                            pageSize: this.pagination.pageSize,
                            pageNum: this.pagination.current
                        }
                );
                this.loading = true;
                this.$http.postBody("/bs/resolveScheme/list",params).then(data => {
                    this.tblData = this.ResolveScheme.createFrom(data.data.rows);
                    this.pagination.total = data.data.total;
                    this.loading = false;
                }).catch((e) => {
                    console.error(e);
                    this.loading = false;
                });
            }
        },
        created() {
            this.getTableData();
        }
    };
</script>
