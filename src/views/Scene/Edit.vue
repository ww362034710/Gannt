<template>
    <div class='main-component addDemad-main'>
        <div class="demand-top">
            <a-steps :current="stepsCur">
                <a-step v-for="(item,index) in stepsData" :title="item.title" :key="index">
                    <a-icon :type="item.icon" slot="icon" />
                </a-step>
            </a-steps>
        </div>
        <div class="demand-content">
            <!-- 基本信息 -->
            <div class="steps-one" v-show="stepsCur===0">
                <basic-info ref="sceneBasicInfoForm"></basic-info>
            </div>
            <!-- 参数初始化 -->
            <div class="steps-param-init" v-show="stepsCur===1">
                <param-init/>
            </div>
            <!-- 资源初始化 -->
            <div v-show="stepsCur===2">
                <stuff-init ref="stuffInitForm"/>
            </div>
            <!-- 选择事件 -->
            <div v-show="stepsCur===3">
                <event-select ref="sceneEventForm"></event-select>
            </div>
            <!-- 场景预览 -->
            <div v-show="stepsCur===4">
                <preview-scene v-if="stepsCur===4" :scene-info="sceneInfo"/>
            </div>
        </div>
        <div class="steps-bottom">
            <a-button type="primary" icon="arrow-left" v-if="stepsCur!='0'" @click="stepsCur--"></a-button>

            <a-button type="primary" icon="arrow-right" v-if="stepsCur!='4'" @click="nextSteps()"></a-button>
            <a-button type="primary" v-if="stepsCur=='4'" @click="addHandler()">完成</a-button>
        </div>
    </div>
</template>
<script>
    import BasicInfo from "../../components/scene/BasicInfo";
    import ParamInit from "../../components/scene/ParamInit";
    import StuffInit from "../../components/scene/StuffInit";
    import EventSelect from "../../components/scene/EventSelect";
    import PreviewScene from "../../components/scene/PreviewScene";
    import moment from 'moment';
    export default {
        name: "editScene",
        components: {
            BasicInfo, EventSelect, ParamInit, StuffInit, PreviewScene
        },
        data () {
            return {
                isEdit: false,
                sceneId: null,
                stepsCur: 0,
                stepsData: [{
                    title: "基本信息",
                    icon: "snippets"
                },{
                    title: "参数初始化",
                    icon: "snippets"
                }, {
                    title: "资源初始化",
                    icon: "block",
                }, {
                    title: "选择事件",
                    icon: "block",
                }, {
                    title: "场景预览",
                    icon: "block",
                }],
                sceneStuffList: [],
                sceneInfo: {
                    eventList: []
                }
            }
        },
        methods: {
            //添加保存
            addHandler() {
                this.$http.postBody("/bs/scene/add", this.sceneInfo)
                    .then( rst => {
                        this.whenSuccess(rst, data => {
                            //TODO 先到这里，后续应该是关闭添加页面相关
                            this.$message.success("新增成功", 2);
                            this.$parent.$parent.$parent.tabClose({title: this.$route.params.tags})
                        })
                    }).catch(() => {
                });
            },
            async nextSteps() {
                if (this.stepsCur === 3) {
                    //先序列化已有数据，将数据展示在 preview 页面上
                    let step = 4;
                    this.$refs.sceneBasicInfoForm.addForm.validateFields((err, values) => {
                        if (!err) {
                            this.sceneInfo = values;
                            this.sceneInfo.eventList = this.$refs.sceneEventForm.getSelectedEvent();
                            console.log("数据：", this.sceneInfo);
                        } else {
                            step = 0;
                        }
                    });
                    //校验初始化资源的表单
                    let successFlag = this.$refs.stuffInitForm.handleSubmit();
                    this.sceneInfo.stuffList = this.$refs.stuffInitForm.tblData;
                    if (!successFlag && step === 4) step = 2;
                    //跳转
                    this.stepsCur = step;
                } else {
                    this.stepsCur++;
                }
            },
        },
        created() {
            if (this.$route.params.isEdit !== undefined) this.isEdit = this.$route.params.isEdit;
            if (this.isEdit) {
                this.$nextTick(() => {
                    this.sceneId = this.$route.params.sceneId;
                    //加载数据
                    this.$http.postForm("/bs/scene/detail", {id: this.sceneId})
                        .then(rst => {
                            this.whenSuccess(rst, data => {
                                data.info.beginTime = moment(data.info.beginTime, 'YYYY-MM-DD');
                                data.info.endTime = moment(data.info.endTime, 'YYYY-MM-DD');
                                this.$refs.sceneBasicInfoForm.addForm.setFieldsValue(data.info);
                                this.$refs.stuffInitForm.tblData = data.sceneStuffList;
                                this.$refs.sceneEventForm.targetKeys = data.eventList.map(record => {return record.id})
                            })
                        })
                });
            }
        }
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
                text-align: left;
            };
            /*.steps-param-init {*/
            /*    width: 80%;*/
            /*    text-align: center;*/
            /*}*/
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
