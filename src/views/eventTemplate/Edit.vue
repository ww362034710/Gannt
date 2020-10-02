<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="steps-main">
                <a-steps :current="steps" size="small">
                    <a-step title="事件基本信息"/>
                    <a-step title="功能需求"/>
                </a-steps>
            </div>
            <div class="gathering-main">
                <div class="steps" v-show="steps==0">
                    <basic-form ref="eventTemplateBasicInfoForm" :event-template="eventTemplate"/>
                </div>
                <div class="steps" v-show="steps==1">
                    <stuff-feature-form ref="eventTemplateStuffFeatureForm" :event-template-id="eventTemplateId"/>
                </div>
            </div>
            <div class="gathering-bottom">
                <a-button icon="arrow-right" type="primary" style="width:120px" @click="nextSteps()"
                          v-if="steps!=1"></a-button>
                <a-button icon="arrow-left" type="primary" style="width:120px" @click="steps--"
                          v-if="steps!=0"></a-button>
                <a-button icon="check" type="primary" @click="addHandler()" style="width:120px" v-if="steps==1">完成
                </a-button>
            </div>
        </div>


    </div>
</template>

<script>
    import BasicForm from "../../components/eventTemplate/BasicForm";
    import StuffFeatureForm from "../../components/eventTemplate/StuffFeatureForm";

    export default {
        components: {StuffFeatureForm, BasicForm},
        name: "eventTemplateEdit",
        data() {
            return {
                params:null,
                url:null,
                treeNodes:null,
                resolveTemplateSchemeId:"1111",
                nodeTemplateId:null,
                steps: 0,
                autoLayout: false,//表格高度自适应
                schemeTemplateId: null, // 当前分解方案的id
                eventTemplateId: null, //
                schemeTemplate: {},
                eventTemplate:{},
                //modelForm: this.$form.createForm(this, {name: "modelForm"}),
            }
        },
        watch: {},
        methods: {
            //下一步
            async nextSteps() {
                this.steps++
            },


            //完成
            addHandler() {
                let that = this;
                //第一步数据
                this.$refs.eventTemplateBasicInfoForm.addForm.validateFields((err, values) => {
                    if (!err) {
                        /*  //第二步表格信息验证 TODO 暂时不进行校验
                        if (this.$refs.eventTemplateStuffFeatureForm.tblRules.length) {
                            //第一步表单数据

                        }*/
                        console.log(values)
                        //表格数据
                        let stuffFeatureList = this.$refs.eventTemplateStuffFeatureForm.selTblData;
                        let node = {id:null,nodeId:this.eventTemplate.id,nodeType:"event"}
                        let allData = {node:node,entity:values,featureList:stuffFeatureList};

                        let taskId = this.$route.query.taskId;
                        let instanceId = this.$route.query.InstanceId;
                        let bpmData = {taskId:taskId,instanceId:instanceId};

                        let params = Object.assign({}, {resolveTemplateSchemeId:that.resolveTemplateSchemeId}, {allData: allData},{bpmData:bpmData})
                        this.$http.postBody("/bs/resolveSchemeTemplate/saveResolveTemplateSchemeForEvent", params) //存储模板分解方案根节点
                            .then(rst => {
                                if (rst.code === 0) {
                                    this.schemeTemplate = rst.data;
                                    this.$message.success(rst.msg);

                                } else {
                                    this.$message.error(rst.msg);
                                }
                            });

                        if(this.eventTemplateId!==null){
                            this.$parent.$parent.$parent.tabClose({title: "编辑事件"});
                        }else{
                            this.$parent.$parent.$parent.tabClose({title: "采集事件"});
                        }
                    } else {
                        //第一步填写信息有误 跳转回第一步
                        this.steps = 0
                    }
                });

            },
        },
        created() {
           this.resolveTemplateSchemeId = this.$route.params.resolveTemplateSchemeId;
            if (this.$route.params.eventTemplateId !== undefined){
                this.eventTemplateId = this.$route.params.eventTemplateId;
                let that = this;
                /**
                 * TODO 加载详细信息
                 */
                this.$http.postForm("/bs/template/show", Object.assign({}, { id: this.eventTemplateId }))
                    .then(rst => {
                        that.eventTemplate = rst.data;
                    }).catch(() => {});
                /**
                 * TODO 加载物资功能列表
                 */
                // 查询列表
                this.$http.postBody("/bs/eventTemplate/demand/queryFeatureList", Object.assign({}, { eventTemplateId: this.eventTemplateId }))
                    .then(data => {
                    that.$refs.eventTemplateStuffFeatureForm.setData(data.data.rows);
                }).catch(() => {
                });

            }
        },
        mounted() {

        },
    }
</script>
<style lang='scss' scoped>
    .steps-main {
        width: 60%;
        min-width: 600px;
        margin: 0 auto;
    }

    .gathering-main {
        position: absolute;
        top: 70px;
        left: 15px;
        right: 15px;
        bottom: 70px;
        padding: 10px 0;
        overflow: auto;
        box-shadow: inset 0 0 5px #ececec;

        .steps {
            width: 60%;
            min-width: 600px;
            margin: 0 auto;
        }

        /deep/ .ant-form-item-label {
            text-align: left !important;
        }
    }

    .gathering-bottom {
        position: absolute;
        bottom: 18px;
        left: 15px;
        right: 15px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        // border-top: 1px solid #ebeef5;
        button {
            margin: 0 10px;
        }
    }

</style>
