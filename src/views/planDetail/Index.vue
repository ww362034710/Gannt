<template>
    <div
        :class="{'flex-col': showGannt || showSchedule}"
        class="page-main page-demand-list"
        id="content"
    >
        <div class="container-content">
            <div class="main-container content-search-bar">
                <div class="bar">
                    <a-button-group>
                        <a-button @click="hidePlanGannt()" type="primary">列表</a-button>
                        <a-button @click="showPlanGannt()" type="primary">时间轴</a-button>
                        <a-button @click="showResource()" type="primary">资源图</a-button>
                    </a-button-group>
                    <a-button-group>
                        <a-button @click="addGroup" type="primary">新增组</a-button>
                        <a-button
                            :disabled="selectedGroup.length > 1"
                            @click="addActivity"
                            type="primary"
                        >新增活动</a-button>
                        <!-- <a-button @click="addResource" type="primary">资源</a-button> -->
                    </a-button-group>
                    <a-button-group>
                        <a-button
                            :disabled="selectedGroup.length > 0 || selectedActivity.length < 1 || selectedActivity.length > 2"
                            @click="chainOperation"
                            type="primary"
                        >链</a-button>
                        <a-button
                            :disabled="selectedActivity.length != 2"
                            @click="dialog.timeDialog=true "
                            type="primary"
                        >约束</a-button>
                    </a-button-group>
                    <a-button-group>
                        <a-button @click="test" type="primary"><a-icon type="retweet" /> 提交</a-button>
                    </a-button-group>
                </div>
                <a-table
                    :columns="columns"
                    :data-source="sceneList"
                    :loading="loading"
                    :pagination="pagination"
                    :row-selection="rowSelection"
                    :scroll="{ y: tableY }"
                    bordered
                    :rowKey="d => d.activity.id"
                    v-if="!showGannt && !showSchedule">
                    <div
                        class="activity-name"
                        slot="activityName"
                        slot-scope="scope">
                        <span v-if="scope.activity.type === 'group'">{{scope.activity.name}}</span>
                        <a
                            @click="activityDetail(scope)"
                            style="color: #0a9dc7"
                            v-if="scope.activity.type === 'activity'"
                        >{{scope.activity.name}}</a>
                    </div>
                    <div class="main-table-btns" slot="action" slot-scope="scope">
                        <a-button
                            @click.stop="editActivity(scope)"
                            icon="edit"
                            size="small"
                            type="primary"
                            v-if="scope.activity.type === 'activity'"
                        >编辑</a-button>
                        <a-button
                            @click.stop="editGroup(scope)"
                            icon="edit"
                            size="small"
                            type="primary"
                            v-if="scope.activity.type === 'group'"
                        >编辑</a-button>
                        <a-button
                            @click="deleteItem(scope)"
                            icon="delete"
                            size="small"
                            type="danger"
                        >删除</a-button>
                        <!-- <a-button
                            @click="addEffect(scope)"
                            icon="import"
                            size="small"
                            type="primary"
                            v-if="scope.activity.type === 'activity'"
                        >影响</a-button>
                        <a-button
                            @click="addConstraint(scope)"
                            icon="import"
                            size="small"
                            type="primary"
                            v-if="scope.activity.type === 'activity'"
                        >需求</a-button> -->
                    </div>
                </a-table>

                <!-- 监视器 -->
                <!-- <monitorTable :tableY="tableY" v-if="!showGannt && !showSchedule"></monitorTable> -->
            </div>
            <planGannt v-if="showGannt"></planGannt>
            <planSchedule v-if="showSchedule"></planSchedule>
        </div>
        <!-- dialog -->
        <!-- 新增组 -->
        <groupDialog
            :plan-activity-id="curPlanActivityId"
            :show="dialog.groupDialog"
            @close="dialog.groupDialog = false"
            @update="getPlanList"
            v-if="dialog.groupDialog"
        ></groupDialog>
        <!-- 新增活动 -->
        <activityDialog
            :groupId="curGroupId"
            :plan-activity-id="curPlanActivityId"
            :show="dialog.activityDialog"
            @close="dialog.activityDialog = false"
            @update="getPlanList"
            v-if="dialog.activityDialog"
        ></activityDialog>
        <!--活动详情  -->
        <activityDetailDialog
            :plan-activity-id="curPlanActivityId"
            :show="dialog.activityDetailDialog"
            @close="dialog.activityDetailDialog = false"
            v-if="dialog.activityDetailDialog"
        ></activityDetailDialog>
        <!-- 资源详情 -->
        <assetsDialog
            :show="dialog.assetsDialog"
            @close="dialog.assetsDialog = false"
            v-if="dialog.assetsDialog"
        ></assetsDialog>
        <!-- 新增约束 -->
        <constraintDialog
            :planActivityId="curPlanActivityId"
            :show="dialog.constraintDialog"
            @close="dialog.constraintDialog = false"
            v-if="dialog.constraintDialog"
        ></constraintDialog>
        <!-- 新增影响 -->
        <effectDialog
            :planActivityId="curPlanActivityId"
            :show="dialog.effectDialog"
            @close="dialog.effectDialog = false"
            v-if="dialog.effectDialog"
        ></effectDialog>
        <!-- 新增时间约束 -->
        <timeDialog
            :item="selectedActivity"
            :show="dialog.timeDialog"
            @close="dialog.timeDialog = false"
            v-if="dialog.timeDialog"
        ></timeDialog>
    </div>
</template>

<script>
import groupDialog from './dialog/groupDialog';
import activityDialog from './dialog/activityDialog';
import activityDetailDialog from './dialog/activityDetaDialog';
import assetsDialog from './dialog/assetsDialog';
import constraintDialog from './dialog/constraintDialog';
import effectDialog from './dialog/effectDialog';
import timeDialog from './dialog/timeDialog';
import monitorTable from './monitorTable.vue';
import planGannt from './planGannt.vue';
import planSchedule from './planSchedule.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'planDetailIndex',
    components: {
        groupDialog, //新增组
        activityDialog, //新增活动
        activityDetailDialog, //活动详情
        assetsDialog, //资源详情
        constraintDialog, //新增约束
        effectDialog, // 新增影响
        timeDialog, // 新增时间约束
        monitorTable,
        planSchedule, //资源图
        planGannt, //甘特图
    },
    computed: {
        ...mapGetters('Scene', ['sceneList'])
    },
    data() {
        return {
            showGannt: false,
            showSchedule: false,
            // 弹窗
            dialog: {
                groupDialog: false, //新增组
                activityDialog: false, //新增活动
                activityDetailDialog: false, //活动详情
                assetsDialog: false, //资源详情
                constraintDialog: false, //新增约束
                effectDialog: false, //新增影响
                timeDialog: false, // 新增时间约束
            },
            planId: null, //当前的规划id
            curPlanActivityId: null, //当前的活动id
            curGroupId: null, //当前选择的groupId,用作向group下添加活动的传值
            columns: [
                {
                    title: '名称',
                    // dataIndex: 'activity.name',
                    scopedSlots: {
                        customRender: 'activityName',
                    },
                    width: '7%'
                },
                {
                    title: '开始时间',
                    dataIndex: 'activity.startTime',
                    width: '12%'
                },
                {
                    title: '活动时间',
                    dataIndex: 'activity.createTime',
                    width: '12%'
                },
                {
                    title: '固定开始',
                    dataIndex: 'activity.pin',
                    width: '12%'
                },
                {
                    title: '最早开始',
                    dataIndex: 'activity.earliest',
                    width: '12%'
                },
                {
                    title: '最晚结束',
                    dataIndex: 'activity.latest',
                    width: '12%'
                },
                {
                    title: '计划内',
                    dataIndex: 'activity.scheduled',
                    width: '7%'
                },
                {
                    title: '链',
                    dataIndex: 'activity.preActivityId',
                    customRender: (data) => {
                        if (data != null && data != '') {
                            return '1';
                        }
                    },
                    width: '4%'
                },
                {
                    title: '约束',
                    dataIndex: 'constraints',
                    customRender: (data) => {
                        if (data.length) return data.length;
                    },
                    width: '6%'
                },
                {
                    title: '操作',
                    width: '17%',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            // planData: [],
            rowSelection: {
                onChange: (selectedRowKeys, selectedRows) => {
                    console.log(
                        `selectedRowKeys: ${selectedRowKeys}`,
                        'selectedRows: ',
                        selectedRows
                    );
                    //将对象分别塞到两个已选的group中
                    this.selectedGroup = [];
                    this.selectedActivity = [];
                    selectedRows.forEach((v) => {
                        if (v.activity.type === 'activity') {
                            this.selectedActivity.push(v);
                        } else {
                            this.selectedGroup.push(v);
                        }
                    });
                    console.log('已选择的活动:', this.selectedActivity);
                    console.log('已选择的组:', this.selectedGroup);
                },
                onSelect: (record, selected, selectedRows) => {
                    console.log(record, selected, selectedRows);
                },
                onSelectAll: (selected, selectedRows, changeRows) => {
                    console.log(selected, selectedRows, changeRows);
                },
            },
            selectedGroup: [],
            selectedActivity: [],
            tableY: 200,
            pagination: {
                // 分页
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30', '40'],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => {
                    return '共：' + total + '条记录 ';
                },
                total: 0,
            },
            loading: false,
        };
    },
    methods: {
        test() {
            console.log(this.sceneList);
        },
        ...mapMutations('Scene', ['SET_SCENE_LIST', 'REMOVE_SCENE']),

        showResource() {
            this.showSchedule = true;
            this.showGannt = false;
        },
        showPlanGannt() {
            this.showGannt = true;
            this.showSchedule = false;
        },
        hidePlanGannt() {
            // this.getPlanList();
            this.showGannt = false;
            this.showSchedule = false;
        },
        //链操作
        async chainOperation() {
            if (this.selectedActivity.length === 1) {
                let res = await this.$http.post(
                    '/bs/ns/plan/activity/delChain/' +
                        this.selectedActivity[0].key
                );
                if (res.code) {
                    this.$message.error(res.msg);
                } else {
                    this.$message.success('成功删除链!');
                }
            } else if (this.selectedActivity.length === 2) {
                let res = await this.$http.postBody(
                    '/bs/ns/plan/activity/addChain',
                    {
                        ids: [
                            this.selectedActivity[0].key,
                            this.selectedActivity[1].key,
                        ],
                    }
                );
                if (res.code) {
                    this.$message.error(res.msg);
                } else {
                    this.$message.success('成功添加链!');
                }
            }
        },
        //打开活动详情
        activityDetail(data) {
            // this.curPlanActivityId = data.key;
            this.curPlanActivityId = data.activity.id;
            this.dialog.activityDetailDialog = true;
        },
        //添加组
        addGroup() {
            this.curPlanActivityId = null;
            this.dialog.groupDialog = true;
        },
        //添加活动
        addActivity() {
            this.curPlanActivityId = null;
            if (this.selectedGroup.length === 1) {
                this.curGroupId = this.selectedGroup[0].key;
            }
            this.dialog.activityDialog = true;
        },
        addResource() {
            this.dialog.assetsDialog = true;
        },
        //编辑活动
        editActivity(activity) {
            console.log('编辑后面的活动', activity);
            this.curPlanActivityId = activity.key;
            this.dialog.activityDialog = true;
        },
        //编辑组
        editGroup(group) {
            console.log('编辑后面的活动', group);
            this.curPlanActivityId = group.key;
            this.dialog.groupDialog = true;
        },
        //删除活动
        async deleteItem(activity) {
            let that = this;
            this.$confirm({
                title: '系统提示',
                content: () => `确定删除此条记录吗？`,
                onOk() {
                    that.$http
                        .postBody('/bs/ns/plan/activity/remove', {
                            ids: [activity.activity.id],
                        })
                        .then((res) => {
                            if (res.code) return false;
                            that.whenSuccess(() => {
                                that.$message.success('删除成功');
                            });

                            // 删除后, 更新vuex数据.
                            that.REMOVE_SCENE(activity.activity.id);
                        });
                }
            });
        },
        //增加活动
        addEffect(activity) {
            // console.log('为后面的活动添加影响:', activity);
            this.curPlanActivityId = activity.key;
            this.dialog.effectDialog = true;
        },
        //增加约束
        addConstraint(activity) {
            console.log('为后面的活动添加影响:', activity);
            this.dialog.constraintDialog = true;
        },
        //请求计划列表
        async getPlanList() {
            this.loading = true;
            const res = await this.$http.post(`/bs/ns/plan/getAllData?id=${this.planId}`);
            if (res.code) return false;
            this.loading = false;

            // 设置场景列表到vuex中.
            this.SET_SCENE_LIST(res.data.data.activityList);
        },
        // 设置高度
        _setHeight() {
            let dom = document.getElementById('content');
            this.tableY = (dom.offsetHeight - 360) / 2;
        },
    },
    created() {
        this.planId = this.$route.query.id;
        this.getPlanList();

        // content
    },
    mounted() {
        this.$nextTick(function () {
            this._setHeight();
        });
    },
};
</script>

<style lang="scss" scoped>
.flex-col {
    flex-direction: column !important;
}
.page-demand-list {
    width: 100%;
    height: 100%;
}
.container-content {
    .main-container {
        // height: 600px;

        .bar {
            width: 100%;
            height: 6%;
            display: flex;
            /*flex-direction: column;*/
            /*align-items: stretch;*/
            background-color: #ffffff;
            margin: 10px auto;

            .ant-btn-group {
                margin-left: 8px;
            }
        }
    }

    .monitor-container {
        height: 500px;
        border-top: 1px solid #e8e8e8;

        .bar {
            margin-top: 2px;

            .ant-btn-group {
                margin-left: 8px;
            }

            .right-button-group {
                float: right;
                margin-right: 20px;
            }
        }
    }
}
</style>