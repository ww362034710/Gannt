<template>
    <div class='main-component addDemad-main'>
        <div class="demand-top">
            <a-steps :current="stepsCur">
                <a-step v-for="(item,index) in stepsData" :title="item.title" :key="index" @click="stepsCur = index" style="cursor:pointer">
                    <a-icon :type="item.icon" slot="icon" />
                </a-step>
            </a-steps>
        </div>
        <div class="demand-content">
            <!-- 选择模板 -->
            <div class="" v-show="stepsCur===0">
                <select-goods-model @loadGoodsModel="loadGoodsModel"></select-goods-model>
            </div>
            <!-- 基本信息 -->
            <div class="steps-one" v-show="stepsCur===1">
                <add-basic-info ref="addGoodsBasicInfo" :goods-model="goodsData"></add-basic-info>
            </div>
            <!-- 功能信息 -->
            <div v-show="stepsCur===2" class="lastSteps">
                <feature-info ref="addStuffFeatureInfo" :feature-data="stuffFeatureData"></feature-info>
            </div>
        </div>
        <div class="steps-bottom">
            <a-button type="primary" icon="arrow-left" v-if="stepsCur!='0'" @click="stepsCur--"></a-button>

            <a-button type="primary" icon="arrow-right" v-if="stepsCur!='2'" @click="nextSteps()" :loading="loading"></a-button>
            <a-button type="primary" v-if="stepsCur=='2'" @click="addHandler()" :loading="loading">完成</a-button>
        </div>
    </div>
</template>

<script>
import SelectGoodsModel from "../../components/goodsModel/SelectGoodsModel";
import AddBasicInfo from "../../components/goods/AddBasicInfo";
import FeatureInfo from "../../components/stuff/FeatureInfo";
    export default {
        name: "goodsAdd",
        components: { AddBasicInfo, FeatureInfo, SelectGoodsModel},
        data() {
            return {
                loading: false,
                stepsCur: 0,
                stepsData: [{
                    title: "模板信息",
                    icon: "profile"
                },{
                    title: "基本信息",
                    icon: "snippets"
                }, {
                    title: "功能信息",
                    icon: "block",
                }],
                goodsData: null,
                stuffFeatureData: []
            };
        },
        computed: {},
        watch: {},
        methods: {
            //下一步
            async nextSteps() {
                this.stepsCur++;
            },
            async loadGoodsModel(modelId) {
                //TODO 加载模板信息
                /**
                 * {
                 *      物资模型信息 （物资信息不包括 id）
                 *      featureData: [功能信息(功能信息不包括goods_model_id)]
                 * }
                 */
                let that = this;
                this.$http.postBody("/bs/goodsModel/loadModel", {stuffModelId: modelId})
                    .then( rst => {
                        that.stuffFeatureData = rst.data.stuffFeatureData;
                        delete rst.data.stuffFeatureData;
                        that.goodsData = rst.data;
                    });
                this.stepsCur++;
            },
            //需求拆解提交
            addHandler() {
                this.$refs.addGoodsBasicInfo.addForm.validateFields((err, values) => {
                    if(!err){
                        console.log('添加物资，基本信息：',values);
                        let featureParams = this.$refs.addStuffFeatureInfo.tblData;
                        console.log('添加物资，功能信息：', featureParams);
                        this.$http
                            .postBody("/bs/goods/add", Object.assign({}, values, {features: featureParams}))
                            .then(() => {
                                this.$message.success("新增成功", 2);
                                this.$parent.$parent.$parent.tabClose({title: "添加物资"})
                            }).catch(() => {
                        });
                    } else {
                        this.$message.warning("基本信息缺失", 2);
                        if (this.stepsCur != 1)
                            this.stepsCur = 1;
                    }
                })
            },
        },
        created() {

        },
        mounted() {

        },
        activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='scss' scoped>
    .addDemad-main {
        margin: 16px;
        background-color: #ffffff;
        .demand-content {
            position: absolute;
            top: 45px;
            bottom: 50px;
            left: 0;
            right: 0;
            padding: 5px 16px;
            box-sizing: border-box;
            overflow: auto;
            .steps-one {
                width: 80%;
                text-align: center;
            }
        }
        .steps-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            line-height: 50px;
            button {
                width: 120px;
                margin-right: 10px;
            }
        }
        .lastSteps {
            > div {
                min-height: calc(100vh - 242px);
            }
        }
    }
</style>
