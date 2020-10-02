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
                <a-row :gutter="16" >
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
            <a-tab-pane tab="物资功能" key="10" >
                <stuff-feature-table :stuffId="id" v-if="renderComponent" />
            </a-tab-pane>
<!--            <a-tab-pane tab="历史记录" key="20">-->
<!--                <goods-modify-history-table :goodsId="id" />-->
<!--            </a-tab-pane>-->
<!--            <a-tab-pane tab="资源态势" key="30">-->
<!--                <stuff-situation-table :stuffId="id"/>-->
<!--            </a-tab-pane>-->
        </a-tabs>
    </div>
</template>
<script>
    // import GoodsModifyHistoryTable from "../../components/goods/GoodsModifyHistoryTable"
    import StuffFeatureTable from "../../components/feature/StuffFeatureTable"
    // import StuffSituationTable from "../../components/stuff/stuffSituationTable"
    export default {
        name: "goodsDetail",
        components: {StuffFeatureTable},
        props:{
            detail:{
                goodsId:String,
            },
        },
        watch: {
            detail:{
                immediate:true,
                handler(newValue,oldValue){

                    // console.log("==================================="+oldValue+"============="+newValue);
                    this.id = newValue;
                    this.reloadBean();
                    this.forceRerender();
                },
                deep: true
            }
        },
        data() {
            return {
                id:null,
                bean: {},
                renderComponent:true,
            };
        },
        methods: {
            reloadBean() { // 加载物资对象信息
                this.$http.postForm('/bs/goods/show', {id: this.id}).then((rst)=>{
                    this.bean = rst.data;
                });
            },
            forceRerender(){//每次打开时重新加载组件
                //从DOM中删除my-component组件
                this.renderComponent = false;
                this.$nextTick(() =>{
                   this.renderComponent = true;
                });
            }
        },
        created() {
            this.reloadBean();
        }
    }
</script>