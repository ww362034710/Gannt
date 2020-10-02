<template>
    <div class="page-main page-demand-detail">
        <a-tabs default-active-key="5" type="card" tab-position="left">
            <a-tab-pane tab="基本信息" key="5">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic title="规划名称" :value="bean.name" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="规划层级" :value="bean.planGrade" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16" >
                    <a-col :span="4">
                        <a-statistic title="状态" :value="bean.state" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="公文文件数量" :value="bean.sysFileId" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="描述" :value="bean.description" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="计划开始时间" :value="bean.planStartTime" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="计划结束时间" :value="bean.planEndTime" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="采集开始时间" :value="bean.gatherStartTime" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="采集结束时间" :value="bean.gatherFinishTime" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    export default {
        name: "Detail",
        data() {
            return {
                id:null,
                bean: {}
            };
        },
        methods: {
            reloadBean() { // 加载规划计划对象信息
                this.$http.postForm('/bs/plan/show', {id: this.$route.params.id}).then((rst)=>{
                    this.bean = rst.data;
                });
            }
        },
        created() {
            this.reloadBean();
        },
        activated() {
        }
    }
</script>