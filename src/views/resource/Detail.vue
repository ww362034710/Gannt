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
                        <a-statistic title="用户数量" :value="bean.meanwhileEventLimit" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane tab="资源功能" key="10">
                <stuff-feature-table :stuffId="id" v-if="renderComponent"/>
            </a-tab-pane>
            <a-tab-pane tab="历史记录" key="20">
               <resource-modify-history-table :resourceId="id" v-if="renderComponent"/>
            </a-tab-pane>
            <a-tab-pane tab="资源态势" key="30">
                <stuff-situation-table :stuffId="id" v-if="renderComponent"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import StuffFeatureTable from "../../components/feature/StuffFeatureTable"
    import ResourceModifyHistoryTable from "../../components/resource/ResourceModifyHistoryTable"
    import StuffSituationTable from "../../components/stuff/stuffSituationTable"
    export default {
        name: "resourceDetail",
        components: {ResourceModifyHistoryTable, StuffFeatureTable,StuffSituationTable},
        data() {
            return {
                id:null,
                bean: {},
                renderComponent:true
            };
        },
        methods: {
            reloadBean() { // 加载物资对象信息
                this.$http.postForm('/bs/resource/show', {id: this.id}).then((rst)=>{
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
        created() {
        },
        activated() {//使用activated 解决跳转时详情不刷新
            this.id=this.$route.params.id;
            this.reloadBean();
            if (this.id!=null){
                this.forceRerender();
            }
        }
    }
</script>
