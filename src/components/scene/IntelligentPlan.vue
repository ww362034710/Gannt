<template>
    <div class="page-demand-list">
        <div class="container-left" style="width: 50%">
            <a-form :form="planForm" layout="inline">
                <p style="color:green;font-size:20px;">方案设置：</p>
                    <a-form-item label="任务分布">
                        <a-radio-group v-model="planFormData.distribution" size="default">
                        <a-radio value="compact_mode">紧凑模式</a-radio>
                        <a-radio value="loose_mode">宽松模式</a-radio>
                    </a-radio-group>
                    </a-form-item>
                    <a-form-item label="权重">
                        <a-input-number v-model="planFormData.distribution_weight" :min="1" :max="100" />
                    </a-form-item>
                    <a-form-item label="任务规划" prop="plan">
                        <a-radio-group v-model="planFormData.plan" size="default">
                            <a-radio value="task_priority">任务优先</a-radio>
                            <a-radio value="resource_priority">资源优先</a-radio>
                            <a-radio value="constraint_priority">约束优先</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="权重">
                        <a-input-number v-model="planFormData.plan_weight" :min="1" :max="100" />
                    </a-form-item>
                    <a-form-item label="资源设置" prop="install">
                        <a-radio-group v-model="planFormData.install" size="default">
                            <a-radio value="minimum_use">最少资源使用</a-radio>
                            <a-radio value="average_distribution">平均资源分布</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="权重">
                        <a-input-number v-model="planFormData.install_weight" :min="1" :max="100" />
                    </a-form-item>
                <p style="color:green;font-size:20px;">高级设置：</p>
                    <a-form-item label="搜索方式" prop="search">
                        <a-checkbox-group v-model="planFormData.search" size="default">
                            <a-row>
                                <a-col :span="12">
                                    <a-checkbox value="simulated_annealing">模拟退火</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="meta_heuristics">元启发法</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="spatial_search">空间搜索</a-checkbox>
                                </a-col>
                                <a-col :span="12">
                                    <a-checkbox value="local_search">本地搜索</a-checkbox>
                                </a-col>
                            </a-row>
                        </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="结束方式" prop="endWay">
                        <a-radio-group v-model="planFormData.endWay" size="default">
                            <a-radio value="fastest_solution">最快求解</a-radio>
                            <a-radio value="hand_end">手工结束</a-radio>
                            <a-radio value="not_solution_end"><a-input-number v-model="planFormData.endWay_not"/> 秒没有更优解结束</a-radio>
                            <a-radio value="optimal_solution"><a-input-number v-model="planFormData.endWay_optimal"/> 秒内的最优解</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label-width="0" prop="beginPlan">
                        <!--<a-button type="primary" icon="a-icon-circle-check" size="default"> 开始规划 </a-button>-->
                        <a-button icon="a-icon-circle-check" type="primary" @click="beginPlan()">开始规划</a-button>
                    </a-form-item>
                    <!--<a-form-item size="default">-->
                        <!--<a-button type="primary" @click="submitForm">提交</a-button>-->
                        <!--<a-button @click="resetForm">重置</a-button>-->
                    <!--</a-form-item>-->
            </a-form>
        </div>
        <div class="container-content" v-auto>
            <a-table :columns="columns" :dataSource="tblData" :pagination="false">
                <div slot="action" slot-scope="scope" class="main-table-btns">
                    <a-button type="default" size="small" icon="exception" @click="">上图</a-button>
                </div>
            </a-table>
        </div>
    </div>
</template>
<script>
    export default {
        components: {},
        props: [],
        data() {
            return {
                columns: [
                    {
                        title: "方案",
                        dataIndex: "name",
                        width: 100
                    },
                    {
                        title: "操作",
                        width: 100,
                        scopedSlots: {
                            customRender: "action"
                        }
                    }
                ],
                tblData: [
                    {
                        name: "2020-01-02 13:24:24",
                    },{
                        name: "2020-01-02 13:24:30",
                    },{
                        name: "2020-01-02 13:24:31",
                    }
                ],
                planForm: this.$form.createForm(this, {name: "planForm"}),
                planFormData: {
                    distribution: null,
                    distribution_weight:30,
                    plan: null,
                    plan_weight:30,
                    install: null,
                    install_weight:30,
                    search: [],
                    endWay: null,
                    endWay_not:null,
                    endWay_optimal:null,
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
            }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        methods: {
            beginPlan() {

            },
        }
    }

</script>
<style scoped>
    .page-main {
        height: 0%;
    }
</style>