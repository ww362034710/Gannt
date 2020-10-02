<!--事件模板详情页面-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <a-tabs default-active-key="1" tab-position="left" v-tags @change="changeTabs">
                <a-tab-pane key="1" tab="基本信息">
                    <a-descriptions title="" layout="vertical" :column="{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }">
                        <a-descriptions-item label="事件名称">{{eventTemplate.name}} </a-descriptions-item>
                        <a-descriptions-item label="唯一编码">{{eventTemplate.id}} </a-descriptions-item>
                        <a-descriptions-item label="所属系统">{{eventTemplate.ownerSystem}} </a-descriptions-item>
                        <a-descriptions-item label="任务目标">{{eventTemplate.ownerSystem}} </a-descriptions-item>
                        <a-descriptions-item label="运行阶段">{{eventTemplate.runPhase}} </a-descriptions-item>
                        <a-descriptions-item label="责任单位">{{eventTemplate.responseOrgs}} </a-descriptions-item>
                        <a-descriptions-item label="持续时间(天)">{{eventTemplate.duration}} </a-descriptions-item>
                        <a-descriptions-item label="优先级">{{eventTemplate.priority}} </a-descriptions-item>
                        <a-descriptions-item label="描述">{{eventTemplate.description}} </a-descriptions-item>
                    </a-descriptions>

                </a-tab-pane>
                <a-tab-pane key="2" tab="资源功能依赖">
                    <event-template-stuff-feature-demand-table :eventTemplateId="eventTemplateId" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="逻辑约束">
                    <event-template-logic-constraint-table :eventTemplateId="eventTemplateId" />
                </a-tab-pane>
                <a-tab-pane key="4" tab="时序约束">
                    <event-template-time-constraint-table :eventTemplateId="eventTemplateId" />
                </a-tab-pane>
                <a-tab-pane key="5" tab="分解事件">
                    <div class="flow-main" :style="flowStyle">
                        <decompose-scheme-template :schemeTemplateId="schemeTemplateId" schemeTemplateType="event" editMode="view" />
                    </div>
                </a-tab-pane>
                <a-tab-pane tab="历史记录" key="20">
                    <event-template-modify-history-table :schemeTemplateId="schemeTemplateId" />
                </a-tab-pane>
                <a-tab-pane tab = "相关统计" key = "99">
                    <event-preview-scene/>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>

import DecomposeSchemeTemplate from "../../components/common/DecomposeSchemeTemplate";
import EventTemplateStuffFeatureDemandTable from "../../components/eventTemplateStuffFeatureDemand/EventTemplateStuffFeatureDemandTable";
import EventTemplateModifyHistoryTable from "../../components/eventTemplate/EventTemplateModifyHistoryTable";
import EventTemplateLogicConstraintTable from "../../components/eventTemplateConstraint/EventTemplateLogicConstraintTable";
import EventTemplateTimeConstraintTable from "../../components/eventTemplateConstraint/EventTemplateTimeConstraintTable";
import EventPreviewScene from "../../components/eventTemplate/EventPreviewScene";

export default {
    components: {EventTemplateLogicConstraintTable,EventTemplateTimeConstraintTable,
        DecomposeSchemeTemplate, EventTemplateModifyHistoryTable,
        EventTemplateStuffFeatureDemandTable, EventPreviewScene},
    name: "eventTemplateView",
    data() {
        return {
            schemeTemplateId: null,   // 当前方案的id
            schemeTemplate: {},       // 当前方案
            eventTemplateId: null,     // 当前事件模板的id
            eventTemplate: {},         // 当前事件模板
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
        schemeTemplateId(newId,oldId) {
            this.loadBean();
        },
        eventTemplateId() {
            this.loadSchemeTemplate();
        }
    },
    methods: {
        // 获取方案数据
        loadSchemeTemplate() {
            this.$http.postForm("/bs/resolveSchemeTemplate/show", { id: this.schemeTemplateId }).then(data => {
                this.schemeTemplate = data.data;
            }).catch((e) => {
                console.error(e);
            });
        },
        //获取数据
        loadBean() {
            this.$http.postForm("/bs/template/show", { id: this.eventTemplateId }).then(data => {//使用方案表ID查
                this.eventTemplate = data.data;
            }).catch((e) => {
                console.error(e);
            });
        },
        //标签页切换
        changeTabs(key) {
            if (key === 2 && !this.ziAuto)
                this.$nextTick(() => {
                    this.ziAuto = true;
                });
        }
    },
    created() {
    },
    mounted() {
        console.log('EventView mounted, this.$route.params: ', this.$route.params);
    },
    activated() {
        this.schemeTemplateId = this.$route.params.schemeTemplateId;
        this.eventTemplateId = this.$route.params.eventTemplateId;
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
