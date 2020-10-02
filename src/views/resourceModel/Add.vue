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
                <add-basic-info ref="addresourceBasicInfo"></add-basic-info>
            </div>
            <!-- 功能信息 -->
            <div v-show="stepsCur===1" class="lastSteps">
                <feature-info ref="addStuffModelFeatureInfo"></feature-info>
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
        name: "resourceModelAdd",
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
                }]
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
                this.$refs.addresourceBasicInfo.addForm.validateFields((err, values) => {
                    if(!err){
                        console.log('添加资源，基本信息：',values);
                        let featureParams = this.$refs.addStuffModelFeatureInfo.tblData;
                        console.log('添加资源，功能信息：', featureParams);
                        this.$http
                            .postBody("/bs/resourceModel/add", Object.assign({}, values, {features: featureParams}))
                            .then(() => {
                                this.$message.success("新增成功", 2);
                                this.$parent.$parent.$parent.tabClose({title: this.$route.params.tags})
                            }).catch(() => {
                        });

                    } else {
                        this.$message.warning("基本信息缺失", 2);
                        if (this.stepsCur != 0)
                            this.stepsCur = 0;
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
