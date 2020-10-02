<template>
    <div class="page-main page-demand-detail">
        <a-tabs default-active-key="5" type="card" tab-position="left">
            <a-tab-pane tab="基本信息" key="5">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic title="资源名称" :value="bean.name" style="margin-right: 50px"></a-statistic>
                    </a-col>
                    <a-col :span="4">
                        <m-statistic title="所属系统" :value="bean.ownerSystem" style="margin-right: 50px"></m-statistic>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="4">
                        <a-statistic title="用户数量" :value="bean.meanwhileEventLimit" style="margin-right: 50px"></a-statistic>
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane tab="资源功能" key="10">
                <stuff-model-feature-table :stuffModelId="id" v-if="renderComponent"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import StuffModelFeatureTable from "../../components/stuffModelFeature/StuffModelFeatureTable"
    export default {
        name: "resourceModelDetail",
        components: {StuffModelFeatureTable},
        data() {
            return {
                id:null,
                bean: {},
                renderComponent: true
            };
        },
        methods: {
            reloadBean() { // 加载物资对象信息
                this.$http.postForm('/bs/resourceModel/show', {id: this.id}).then((rst)=>{
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
