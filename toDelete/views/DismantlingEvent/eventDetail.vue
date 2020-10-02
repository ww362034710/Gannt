<template>
    <div class="page-main page-demand-detail">
        <a-tabs defaultActiveKey="1" tabPosition="left" type="card">
            <a-tab-pane tab="基本信息" key="1">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic
                                title="名称"
                                :value="item.name"
                                style="margin-right: 50px"
                        />
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic
                                title="任务类型"
                                :value="item.demandSectionItem.itemTypeId"
                                style="margin-right: 50px"
                        />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic
                                title="重要程度"
                                :value="item.demandSectionItem.expectedLevelId"
                                style="margin-right: 50px"
                        />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic
                                title="优先级"
                                :value="item.demandSectionItem.priority"
                                style="margin-right: 50px"
                        />
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic
                                title="最早开始时间"
                                :value="item.earliestStartTime"
                                style="margin-right: 50px"
                        />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic
                                title="最早结束时间"
                                :value="item.earliestEndTime"
                                style="margin-right: 50px"
                        />
                    </a-col>
<!--                    <a-col :span="8">-->
<!--                        <a-statistic-->
<!--                                title="最晚结束时间"-->
<!--                                :value="item.latestEndTime"-->
<!--                                style="margin-right: 50px"-->
<!--                        />-->
<!--                    </a-col>-->
                    <a-col :span="8">
                        <a-statistic
                                title="计划工期"
                                :value="item.predictDay"
                                style="margin-right: 10px"
                        />
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane tab="相关需求" key="3">
<!--                <a-button icon="plus" style="margin-left:10px" @click="eventAndItemEditionMode = true">添加关联需求</a-button>-->
<!--                <a-modal title="添加关联需求" v-model="eventAndItemEditionMode" width="700px" @ok="addEventAndItemEdition()">-->
<!--                    <EventTable :columns="resourcesColumns" :auto="false" :scroll="{y:300,x:true}" :msg="msg" ref="eventResources" url="/bs/resource/list" :diff="200" rowSelection rowSelectionType="checkbox" />-->
<!--                </a-modal>-->
                <a-table
                        :columns="columns"
                        :pagination="fatherPagination"
                        :loading="loading"
                        :dataSource="fatherItemTblData"
                        size="middle"
                        :scroll="{y:true,x:500}"
                        rowKey="uuid"
                        @change="fatherTblPagination"
                >


                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="danger" size="small" @click="deleteResourceOrConstraint(scope,2) " icon="delete">删除</a-button>
                    </div>
                </a-table>
            </a-tab-pane>
            <a-tab-pane tab="子事件" >
                <ChildrenEvent :uid="uid" :parentEditionUid="editionUid" @gotoDetail="gotoChildDetail"></ChildrenEvent>
            </a-tab-pane>
            <a-tab-pane tab="资源依赖" key="8">
                <a-button icon="plus" style="margin-left:10px" @click="eventResources = true">添加资源</a-button>
                <a-modal title="添加事件资源" v-model="eventResources" width="700px" @ok="addResource()">
                    <EventTable :columns="resourcesColumns" :auto="false" :scroll="{y:300,x:true}" :msg="msg" ref="eventResources" url="/bs/resource/list" :diff="200" rowSelection rowSelectionType="checkbox" />
                </a-modal>
                <a-table
                        :columns="resourcesColumns"
                        :pagination="resourcePagination"
                        :loading="loading"
                        :dataSource="resourceTblData"
                        size="middle"
                        :scroll="{y:true,x:500}"
                        rowKey="uuid"
                        @change="resourceTblPagination"
                >
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="danger" size="small" @click="deleteResourceOrConstraint(scope,0)" icon="delete">删除</a-button>
                    </div>
                </a-table>

               <a-button icon="plus" style="margin-left:10px" @click="eventConstraints = true">添加约束</a-button>
                <a-modal title="添加事件约束" v-model="eventConstraints" width="700px" @ok="addConstraint()">
                    <EventTable :columns="constraintColumns" :auto="false" :scroll="{y:300,x:true}" :msg="msg" ref="eventConstraints" url="/bs/constraint/list" :diff="200" rowSelection rowSelectionType="checkbox" />
                </a-modal>
                <a-table
                        :columns="constraintColumns"
                        :pagination="constraintPagination"
                        :loading="loading"
                        :dataSource="constraintTblData"
                        size="middle"
                        :scroll="{y:true,x:500}"
                        rowKey="uuid"
                        @change="constraintTblPagination"
                >
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="danger" size="small" @click="deleteResourceOrConstraint(scope,1)" icon="delete">删除</a-button>
                    </div>
                </a-table>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    let eventDetail = null;
    import ChildrenEvent from "../../../src/views/eventCopy/ChildrenEvent";
    import EventTable from '@/components/dismantlingEvent/table.vue'
    export default {
        name: "demandManagementItemDetail",
        components: {
            ChildrenEvent,EventTable
        },
        data() {
            return {
                uid: null,
                editionUid: null,
                msg: "dd",
                eventParams: {
                    uid:""
                },
                itemParams:{

                },
                changeHistoryList: [],
                infoType:1,       // 默认显示第一个
                item: {},
                eventTblData:[],
                columns: [
                    {
                        title: "名称",
                        dataIndex: "previewContent"
                    },
                    {
                        title: "操作",
                        width: 100,
                        scopedSlots: { customRender: "action" }
                    }
                ],
                eventColumns: [
                    {
                        title: "事件名称",
                        dataIndex: "name",
                    },
                    {
                        title: "最早开始时间",
                        dataIndex: "earliestStartTime",
                        width: "15%"
                    },
                    {
                        title: "最晚开始时间",
                        dataIndex: "latestStartTime",
                        width: "15%"
                    },
                    {
                        title: "预计工期（天）",
                        dataIndex: "predictDay",
                        width: "30"
                    },
                    {
                        title: "操作",
                        width: 100,
                        scopedSlots: { customRender: "action" }
                    }
                ],
                eventResources: false,//事件资源 model
                eventAndItemEditionMode:false,
                resourcesColumns: [{
                    title: "名称",
                    dataIndex: "name"
                },
                    {
                        title: "创建时间",
                        dataIndex: "createTime",
                        width: 120
                    }, {
                        title: "资源类型",
                        dataIndex: "type",
                        width: 120
                    }, {
                        title: "装载类型",
                        dataIndex: "loadType",
                        width: 120
                    },
                    {
                        title: "操作",
                        width: 80,
                        scopedSlots: {customRender: "action"}
                    }
                ],
                eventConstraints:false,//约束model
                constraintColumns: [
                    {
                        title: "名称",
                        dataIndex: "name"
                    },
                    {
                        title: "创建时间",
                        dataIndex: "createTime",
                        width: 120
                    }, {
                        title: "约束类型",
                        dataIndex: "type",
                        width: 120
                    }, {
                        title: "约束模型",
                        dataIndex: "model",
                        width: 120
                    },
                    {
                        title: "操作",
                        width: 80,
                        scopedSlots: {customRender: "action"}
                    }
                ],
                constraintData: [],
                resourceData: [],
                fatherPagination: {
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
                resourcePagination: {
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
                constraintPagination: {
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
                loading: false,
                //相关需求
                fatherItemTblData: [],
                fatherTblPagination(pagination) {
                    //保存当前分页信息
                    this.fatherPagination.current = pagination.current;
                    this.fatherPagination.pageSize = pagination.pageSize;
                    this.getFatherItems();
                },
                //相关资源
                resourceTblData: [],
                resourceTblPagination(pagination) {
                    //保存当前分页信息
                    this.resourcePagination.current = pagination.current;
                    this.resourcePagination.pageSize = pagination.pageSize;
                    this.getResources();
                },
                constraintTblData: [],
                constraintTblPagination(pagination) {
                    //保存当前分页信息
                    this.constraintPagination.current = pagination.current;
                    this.constraintPagination.pageSize = pagination.pageSize;
                    this.getConstraint();
                },
                eventPagination: {
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
                childItemTblData: [],
                childTblPagination(pagination) {
                    //保存当前分页信息
                    this.childPagination.current = pagination.current;
                    this.childPagination.pageSize = pagination.pageSize;
                    this.queryChildItems();
                },
                eventList(pagination){
                    //保存当前分页信息
                    this.eventPagination.current = pagination.current;
                    this.eventPagination.pageSize = pagination.pageSize;
                    this.queryEventList();
                },
                gotoChildDetail(row){
                    eventDetail.$router.replace({
                        name: "eventChildrenDetail",
                        params: {
                            tags: "子事件详情",
                            uid: row.uid,
                            editionUid: null
                        }
                    });
                }
            };
        },
        computed:{

        },
        created() {
            eventDetail = this;
            this.uid = this.$route.params.uid;
            this.editionUid = this.$route.params.editionUid;
            this.eventParams = Object.assign({}, this.$route.params);
            console.log(this.eventParams);
            this.getFatherItems();
            this.queryEventByUid();
            this.getResources();
            this.getConstraint();
        },
        mounted() {},
        methods: {
            getFatherItems() {
                //TODO 没有携带分页信息
                this.$http.postBody("/bs/event/itemList", this.eventParams)
                    .then(data => {
                        console.log(data);
                        this.fatherPagination.total = data.total;
                        this.fatherItemTblData = data.rows;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            getResources() {
                //TODO 获取资源
                this.$http.postBody("/bs/resource/resourceList", this.eventParams)
                    .then(data => {
                        console.log(data);
                        this.resourcePagination.total = data.total;
                        this.resourceTblData = data.rows;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            //删除事件中的资源
            deleteResourceOrConstraint(scope,index){
                console.log(scope);
                let url =['/bs/resource/removeResource','/bs/constraint/removeConstraint','/bs/event/delete'];
                let ids = null;
                if (index===1){
                    url = url[1];
                    ids = [scope.id];
                }else if (index===0){
                    url = url[0];
                    ids = [scope.id]
                }else {
                    url = url[2];
                    ids = [scope.uid];
                }
                console.log("删除事件中的资源")
                let that = this;
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定删除此条记录吗？`,
                    onOk() {
                        that.$http
                            .postBody(url, {
                                ids:ids
                            })
                            .then((rst) => {
                                that.whenSuccess(rst, (data) => {
                                    that.$message.success('删除成功');
                                    that.getConstraint();
                                });
                            });
                    },
                    onCancel() {
                        console.log("Cancel");
                    }
                });
            },

            getConstraint() {
                //TODO 获取约束
                this.$http.postBody("/bs/constraint/constraintList", this.eventParams)
                    .then(data => {
                        console.log(data);
                        this.constraintPagination.total = data.total;
                        this.constraintTblData = data.rows;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            //打开添加资源的
            addResource(){
                console.log("添加资源");
                console.log('选择数据为：', this.$refs.eventResources.selectedRowDatas)
                this.resourceData = JSON.parse(JSON.stringify(this.$refs.eventResources.selectedRowDatas))

                let eventAndResource = {
                    uid:this.uid,
                    resourceId:[]
                };
                for (let index=0;index<this.resourceData.length;index++){
                    eventAndResource.resourceId[index] = this.resourceData[index].id
                }
                this.$http
                    .postBody("/bs/resource/addEventAndResource", eventAndResource)
                    .then(() => {
                        this.$message.success("新增成功", 2);
                        this.eventResources = false;
                        this.getResources();
                    }).catch(() => {
                    this.confirmLoading = false;
                });
            },
          //打开添加约束
          addConstraint(){
            console.log("添加约束");
            console.log('选择数据为：', this.$refs.eventConstraints.selectedRowDatas)
            this.constraintData = JSON.parse(JSON.stringify(this.$refs.eventConstraints.selectedRowDatas))

            let eventAndConstraint = {
              uid:this.uid,
              constraintId:[]
            };
            for (let index=0;index < this.constraintData.length;index++){
              eventAndConstraint.constraintId[index] = this.constraintData[index].id
            }
            this.$http
                    .postBody("/bs/constraint/addEventAndConstraint", eventAndConstraint)
                    .then(() => {
                      this.$message.success("新增成功", 2);
                      this.eventConstraints = false;
                      this.getConstraint();
                    }).catch(() => {
              this.confirmLoading = false;
            });
          },

            queryEventByUid() {
                //查询事件基本信息
                this.$http.postBody("/bs/event/show", this.eventParams)
                    .then(data => {
                        // this.eventPagination.total = data.total;
                        this.item = data.data;
                        console.log(data.data);
                        // this.loading = false;
                        console.log(data);
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            // //添加关联需求
            // addEventAndItemEdition(){
            //
            // },
            queryHistoryList() {
                let params = {
                    docEditionUid: this.itemParams.docEditionUid,
                    itemUid: this.itemParams.itemUid
                };
                this.$http.postBody("/bs/itemDisposeHistory/changeHistory", params)
                    .then(data => {
                        this.changeHistoryList = data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            }
        }
    };
</script>

<style lang='scss' scoped>
    .demand-detail {
        .detail-card {
            position: relative;
            width: 100%;
            top: 0;
            left: 0;
        }
    }
</style>
