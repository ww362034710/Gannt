<!--事件模板详情页面-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <a-tabs default-active-key="1" tab-position="left" v-tags >
                <a-tab-pane key="1" tab="基本信息">
                    <a-descriptions title="" layout="vertical" :column="{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }">
                        <a-descriptions-item label="目标名称">{{goalTemplate.name}} </a-descriptions-item>
                        <a-descriptions-item label="实验类别">{{goalTemplate.testKind}} </a-descriptions-item>
                        <a-descriptions-item label="重要等级">{{goalTemplate.importantGrade}} </a-descriptions-item>
                        <a-descriptions-item label="规划层级">{{goalTemplate.planGrade}} </a-descriptions-item>
                        <a-descriptions-item label="提出机构">{{goalTemplate.submittingAgency}} </a-descriptions-item>
                        <a-descriptions-item label="描述">{{goalTemplate.description}} </a-descriptions-item>
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
                <a-tab-pane key="3" tab="分解目标">
                    <div class="flow-main" :style="flowStyle">
                        <decompose-scheme-template :schemeTemplateId="schemeTemplateId" schemeTemplateType="goal" editMode="view" />
                    </div>
                </a-tab-pane>
                <a-tab-pane tab="历史记录" key="20">
                    <goal-template-modify-history-table  :schemeTemplateId="schemeTemplateId" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>

import DecomposeSchemeTemplate from "../../components/common/DecomposeSchemeTemplate";
import GoalTemplateModifyHistoryTable from "../../components/goal/GoalTemplateModifyHistoryTable";
export default {
    components: { DecomposeSchemeTemplate, GoalTemplateModifyHistoryTable, },
    name: "goalTemplateView",
    data() {
        return {
            schemeTemplateId: null,   // 当前方案的id
            schemeTemplate: {},       // 当前方案
            goalTemplateId: null,     // 当前事件模板的id
            goalTemplate: {},         // 当前事件模板
            columns: [
                {
                    title: "功能名称",
                    dataIndex: "name",
                },
                {
                    title: "功能编码",
                    dataIndex: "userName",
                    width: "20%"
                },
                {
                    title: "需求量",
                    width: 200
                }
            ],
            tblData: [],
            loading: false,
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
            ziAuto: false,//资源功能依赖表格高度是否自适应
        };
    },
    computed: {
        flowStyle() {
            return {
                height: document.documentElement.clientHeight - 160 + "px"
            }
        }
    },
    watch: {
        schemeTemplateId() {
            this.loadSchemeTemplate();
        },
        goalTemplateId() {
            this.loadBean();
        }
    },
    methods: {
        // 获取方案数据
        loadSchemeTemplate() {
            this.$http.postForm("/bs/resolveSchemeTemplate/show", { id: this.schemeTemplateId }).then(data => {
                this.schemeTemplate = data.data;
                this.goalTemplateId = this.schemeTemplate.rootId;
            }).catch((e) => {
                console.error(e);
            });
        },
        //获取数据
        loadBean() {
            this.$http.postForm("/bs/deprecated/goal/template/show", { id: this.goalTemplateId }).then(data => {
                this.goalTemplate = data.data;
            }).catch((e) => {
                console.error(e);
            });
        },
        //标签页切换
        changeTabs(key) {
           /* if (key === 2 && !this.ziAuto)
                this.$nextTick(() => {
                    this.ziAuto = true;
                });*/
        }
    },
    created() {},
    mounted() {
        console.log('EventView mounted, this.$route.params: ', this.$route.params);
    },
    activated() {
        this.schemeTemplateId = this.$route.params.schemeTemplateId;
        console.log("goal-modify-tianna-table, schemeTemplateId: ", this.schemeTemplateId);
        this.goalTemplateId = this.$route.params.goalTemplateId;
    }
}
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
