<!--
  目标的详情页面 同样也是分解方案的详情页面
  如果传的参数具有schemeId 则认为是分解方案的详情页面  展示的是根目标的详细信息  以及多出来一个页签"分解方案"
  如果只传了goalId  则认为只是一个目标的详情页面
-->
<template>
    <div class="page-main page-demand-detail">
        <div class="page-main-container">
            <a-tabs default-active-key="1" tab-position="left" v-tags >
                <a-tab-pane key="1" tab="基本信息">
                    <a-descriptions title="" layout="vertical" :column="{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }">
                        <a-descriptions-item label="目标名称">{{goal.name}} </a-descriptions-item>
                        <a-descriptions-item label="实验类别">{{goal.testKind}} </a-descriptions-item>
                        <a-descriptions-item label="重要等级">{{goal.importantGrade}} </a-descriptions-item>
                        <a-descriptions-item label="规划层级">{{goal.planGrade}} </a-descriptions-item>
                        <a-descriptions-item label="提出机构">{{goal.submittingAgency}} </a-descriptions-item>
                        <a-descriptions-item label="描述">{{goal.description}} </a-descriptions-item>
                    </a-descriptions>
                    <!-- <a-row :gutter="16">
                        <a-col :span="8">
                            <a-statistic title="资源名称" :value="eventTemplate.name" style="margin-right: 50px"></a-statistic>
                        </a-col>
                        <a-col :span="4">
                            <a-statistic title="唯一编码" :value="eventTemplate.id" style="margin-right: 50px"></a-statistic>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="4">
                            <a-statistic title="所属系统" :value="eventTemplate.ownerSystem" style="margin-right: 50px"></a-statistic>
                        </a-col>
                        <a-col :span="4">
                            <a-statistic title="任务目标" :value="eventTemplate.taskCabin" style="margin-right: 50px"></a-statistic>
                        </a-col>
                        <a-col :span="4">
                            <a-statistic title="运行阶段" :value="eventTemplate.runPhase" style="margin-right: 50px"></a-statistic>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="4">
                            <a-statistic title="责任单位" :value="eventTemplate.responseOrgs" style="margin-right: 50px"></a-statistic>
                        </a-col>
                        <a-col :span="4">
                            <a-statistic title="优先级" :value="eventTemplate.priority" style="margin-right: 50px"></a-statistic>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-statistic title="描述" :value="eventTemplate.description" style="margin-right: 50px"></a-statistic>
                        </a-col>
                    </a-row> -->
                </a-tab-pane>
                <a-tab-pane tab="目标分解" key="3" v-if="schemeId">
                    <div class="flow-main" :style="flowStyle">
                        <decomposition :scheme-id="schemeId" scheme-type="goal" edit-mode="edit"/>
                    </div>
                </a-tab-pane>
                <a-tab-pane tab="历史记录" key="20">
                    <goal-modify-history-table :resolveSchemeId="schemeId"/>
                </a-tab-pane>
                <a-tab-pane tab="相关统计" key = "10">
                    <goal-statistics/>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    import GoalModifyHistoryTable from "../../components/goal/GoalModifyHistoryTable";
    import Decomposition from "../../components/common/DecomposeScheme";
    import GoalStatistics from "../../components/goal/GoalStatistics";

    export default {
        name: "goalDetail",
        components: {
            GoalModifyHistoryTable,
            Decomposition,
            GoalStatistics
        },
        data() {
            return {
                schemeId: null,   // 当前方案的id
                scheme: {},       // 当前方案
                goalId: null,     // 当前目标的id
                goal: {},         // 当前目标
            };
        },
        watch: {
            schemeId() {
                this.loadScheme();
            },
            goalId() {
                this.loadGoal();
            }
        },
        computed: {
            flowStyle() {
                return {
                    height: document.documentElement.clientHeight - 160 + "px"
                }
            }
        },
        created() {
            console.log("goalView, params", this.$route.params);
            this.schemeId = this.$route.params.schemeId;
            this.goalId = this.$route.params.goalId;
            if (this.schemeId) {
                // 当做分解方案的详情页面
                this.loadScheme();
            }
        },
        mounted() {
        },
        methods: {
            // 加载方案数据
            loadScheme() {
                this.$http.postForm("/bs/resolveScheme/show", {id: this.schemeId})
                        .then(data => {
                            this.scheme = data.data;
                            this.goalId = this.scheme.rootId;
                        })
                        .catch((e) => {
                          console.error(e);
                        });
            },
            // 加载goal数据
            loadGoal() {
                if (this.goalId) {
                    this.$http.postForm("/bs/deprecated/goal/show/" + this.goalId,)
                            .then(data => {
                                console.log(data);
                              this.goal = data.data;
                            })
                            .catch((e) => {
                              console.error(e);
                            });
                } else {
                    this.goal = null;
                }
            }
        }
    };
</script>

<style lang='scss' scoped>
    .tabs-main {
        width: 50%;
        min-width: 600px;
        .gathering-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
            .event-status {
                font-weight: 600;
            }
        }
        .gathering-line {
            margin-bottom: 15px;
            padding: 5px 0;
            border-bottom: 1px solid #ececec;
        }
    }
    .flow-main {
        position: absolute;
        top: 0;
        left: 132px;
        right: 0;
        height: 100%;
    }
    /deep/ .ant-descriptions-item-content {
        font-weight: 600;
        word-break: break-all;
    }
    /deep/ .ant-descriptions-row > td {
        padding-bottom: 8px;
    }
    /deep/ .ant-descriptions-row {
        &:nth-child(2n + 1) {
            margin-bottom: 15px;
        }
    }
</style>
