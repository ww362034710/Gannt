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
            <!-- 基本信息 -->
            <div class="steps-one" v-show="stepsCur===0">
                <add-basic-info ref="addResourceBasicInfo" v-if="resource !== null" :resource-model="resource"></add-basic-info>
            </div>
            <!-- 功能信息 -->
            <div v-show="stepsCur===1" class="lastSteps">
                <feature-info ref="addStuffFeatureInfo" v-if="stuffFeatureList !== null" :feature-data="stuffFeatureList"></feature-info>
            </div>
        </div>
        <div class="steps-bottom">
            <a-button type="primary" icon="arrow-left" v-if="stepsCur!='0'" @click="stepsCur--"></a-button>

            <a-button type="primary" icon="arrow-right" v-if="stepsCur!='1'" @click="nextSteps()" :loading="loading"></a-button>
            <a-button type="primary" v-if="stepsCur=='1'" @click="addHandler()" :loading="loading">完成</a-button>
        </div>
    </div>
</template>

<script>
import AddBasicInfo from "../../components/resource/AddBasicInfo";
import FeatureInfo from "../../components/stuff/FeatureInfo";
    export default {
        name: "resourceEdit",
        components: { AddBasicInfo, FeatureInfo },
        data() {
            return {
                loading: false,
                stepsCur: 0,
                stepsData: [{
                    title: "基本信息",
                    icon: "snippets"
                }, {
                    title: "功能信息",
                    icon: "block",
                }],
                resourceId: null,
                resource: null,
                stuffFeatureList: null
            };
        },
        computed: {},
        watch: {},
        methods: {
            //下一步
            async nextSteps() {
                this.stepsCur++;
            },
            //需求拆解提交
            addHandler() {
                this.$refs.addResourceBasicInfo.addForm.validateFields((err, values) => {
                    if(!err){
                        console.log('添加物资，基本信息：',values);
                        let featureParams = this.$refs.addStuffFeatureInfo.tblData;
                        console.log('添加物资，功能信息：', featureParams);
                        this.$http
                            .postBody("/bs/resource/edit", Object.assign({}, values, {features: featureParams}))
                            .then(() => {
                                this.$message.success("新增成功", 2);
                            }).catch(() => {
                        });
                        this.$parent.$parent.$parent.tabClose({title: this.$route.params.tags})
                    } else {
                        this.$message.warning("基本信息缺失", 2);
                        if (this.stepsCur != 0)
                            this.stepsCur = 0;
                    }
                })
            },
        },
        created() {
            if (this.$route.params.resourceId !== undefined){
                this.resourceId = this.$route.params.resourceId;
                let that = this;
                /**
                 * TODO 加载物资详细信息
                 */
                this.$http.postForm("/bs/resource/show", Object.assign({}, {id: this.resourceId}))
                    .then(rst => {
                        that.resource = rst.data;
                    }).catch(() => {})
                /**
                 * TODO 加载物资功能列表
                 */
                this.$http.postBody("/bs/stuffFeature/list", Object.assign({}, {stuffId: this.resourceId}))
                    .then(rst => {
                        that.stuffFeatureList = rst.data;
                    }).catch(() => {})
            }
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
