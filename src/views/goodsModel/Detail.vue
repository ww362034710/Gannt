<template>
    <div class="page-main page-demand-detail">
        <a-tabs default-active-key="5" type="card" tab-position="left">
            <a-tab-pane tab="基本信息" key="5">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic title="资源名称" :value="bean.name" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="所属系统" :value="bean.ownerSystem" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="物资代号" :value="bean.goodsCode" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="批次号" :value="bean.batchNo" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="重要等级" :value="bean.importantGrade" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="规划层级" :value="bean.planGrade" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="质量" :value="bean.mass" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="体积" :value="bean.volume" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="物质形态" :value="bean.physicalForm" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="长" :value="bean.length" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="宽" :value="bean.width" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <a-statistic title="高" :value="bean.height" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane tab="物资功能" key="10">
                <stuff-model-feature-table :stuffModelId="id" v-if="renderComponent" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import StuffModelFeatureTable from "../../components/stuffModelFeature/StuffModelFeatureTable";
    export default {
        name: "goodsModelDetail",
        components: {StuffModelFeatureTable},
        data() {
            return {
                id:null,
                bean: {},
                renderComponent:true
            };
        },
        methods: {
            reloadBean() { // 加载物资对象信息
                this.$http.postForm('/bs/goodsModel/show', {id: this.id}).then((rst)=>{
                    this.bean = rst.data;
                });
            },
            forceRerender(){
                //从DOM中删除my-component组件 解决详情不刷新的问题
                this.renderComponent = false;
                this.$nextTick(() =>{
                    this.renderComponent = true;
                });
            }
        },
        created() {},
        activated() {
            this.id=this.$route.params.id;
            this.reloadBean();
            if (this.id!=null){
                this.forceRerender();
            }
        }
    }
</script>
