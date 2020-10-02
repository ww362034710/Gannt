<template>
    <div class='main-component addNewEvent-main'>
        <div class="steps-top">
            <a-steps :current="stepsCur">
                <a-step v-for="(item,index) in stepsData" :title="item.title" :key="index" @click="stepsCur = index" style="cursor:pointer">
                    <a-icon :type="item.icon" slot="icon" />
                </a-step>
            </a-steps>
        </div>
        <div class="steps-content">

            <!-- 事件模板选择 -->
            <select-event v-show="stepsCur==0" ref="selectEvent"></select-event>
            <!-- 基本信息 -->
            <basic-event v-show="stepsCur==1" :form-data="stepsOneData" ref="basicEvent"></basic-event>
            <!-- 关联需求 -->
            <related-requirements v-show="stepsCur==2" ref="relatedEvent"></related-requirements>
            <!-- 资源与约束 -->
            <resources-constraints :curTabs="stepsCur" :tabSteps="3" v-show="stepsCur==3" ref="resources"></resources-constraints>
            <!-- 拆解子事件 -->
            <DismantlingChildEvent v-show="stepsCur==4" :eventModelUid="eventModelUid" ref="dismantlingChildEvent"></DismantlingChildEvent>
        </div>
        <div class="steps-bottom">
            <a-button type="primary" icon="arrow-left" v-if="stepsCur!='0'" @click="stepsCur--"></a-button>
            <a-button type="primary" icon="arrow-right" v-if="stepsCur!='4'" @click="nextSetps()"></a-button>

            <a-button type="primary" v-if="stepsCur=='4'" @click="addHandler()">完成</a-button>
        </div>
    </div>
</template>

<script>
import SelectEvent from '@/components/dismantlingEvent/selectEvent.vue'
import BasicEvent from '@/components/dismantlingEvent/basicEvent.vue'
import RelatedRequirements from '@/components/dismantlingEvent/relatedRequirements.vue'
import ResourcesConstraints from '@/components/dismantlingEvent/ResourcesConstraints.vue'
import DismantlingChildEvent from "@/components/dismantlingEvent/DismantlingChildEvent";

export default {
    name: "dismantlingEventAdd",
    components: { SelectEvent, BasicEvent, RelatedRequirements, ResourcesConstraints, DismantlingChildEvent },
    data() {
        return {
            values: {
                uid: null,
                name: null,
                lastStartTime: null,
                eventFolderUid: null,
                earliestStartTime: null,
                predictDay: null,
                demandItemEditionUid: null,
                resourceId:null,
                constraintId:null
            },
            stepsCur: 0,
            stepsData: [{
                title: "事件模板",
                icon: "snippets",
                status: "finish"
            }, {
                title: "基本信息",
                icon: "hdd",
                status: "finish"
            }, {
                title: "关联需求",
                icon: "link",
                status: "link"
            }, {
                title: "资源与约束",
                icon: "block",
                status: "wait"
            },{
                title: "拆解子事件",
                icon: "table",
                status: "link"
            }],
            stepsOneData: {},//第一步选择得表格数据
            eventModelUid: null
        };
    },
    computed: {},
    watch: {
        "stepsCur": function (n) {
            if (n == 4){
                this.eventModelUid = this.$refs.selectEvent.getData().eventModelUid;
            }
        }
    },
    methods: {
        //下一步
        nextSetps() {
            //第一步获取选中共得表格数据
            if (this.stepsCur === 0) {
                this.stepsOneData = this.$refs.selectEvent.getData();
            }
            this.stepsCur++;
        },
        //完成
        addHandler() {
            //基本信息数据
            this.$refs.basicEvent.addForm.validateFields((err, values) => {
                if (!err) {
                    this.values = values;
                    // console.log("+++++++ " + values);
                    // console.log(this.values);
                    //事件模板数据--选中的行key
                    let a = this.$refs.selectEvent.getData();
                    //管理需求--穿梭框选中数据 key
                    let b = this.$refs.relatedEvent.targetKeys;
                    //判断b关联了几个
                    let demandItemEditionUids = new Array(b.length+1);
                    demandItemEditionUids[0] = this.$route.params.demandItemEditionUid;
                    for (let index = 0;index< b.length; index++){
                        demandItemEditionUids[index+1] = b[index];
                    }
                    this.values.demandItemEditionUid = demandItemEditionUids;
                        console.log(b);
                        console.log(this.values.demandItemEditionUid);
                    //资源与约束
                    let c = this.$refs.resources;
                    let d = {
                        // sourcesData: c.$refs.sourcesTbl.tblData,
                        sourcesData: c.resourceData,
                        //constraintData: c.$refs.constraintTbl.tblData,
                        constraintData: c.constraintData

                    };
                    //拿到事件资源与约束的id
                    // this.
                    // console.log(d.sourcesData)
                    // console.log(d.constraintData);
                    let resourceIds = [];
                    let constraintIds = [];

                    for (let index = 0;index < d.sourcesData.length;index++){
                      resourceIds[index] = d.sourcesData[index].id;
                  }
                    for (let index = 0;index < d.constraintData.length;index++){
                        constraintIds[index] = d.constraintData[index].id;
                    }
                    this.values.resourceId = resourceIds;
                    this.values.constraintId = constraintIds;
                    // console.log(resourceIds);
                    // console.log(this.values.resourceId);
                    // console.log(constraintIds);
                    // console.log(this.values.constraintId);
                    //子事件数据
                    let childEvent = this.$refs.dismantlingChildEvent.tblData;
                    if (childEvent && childEvent.length > 0){
                        values.children = childEvent;
                    }
                    console.log(a);

                    console.log(d);
                    // return;
                    this.$http
                        .postBody("/bs/event/add", this.values)
                        .then(() => {
                            // console.log("执行了")
                            this.$message.success("新增成功", 2);
                            // this.addModelVisible = false;
                            // this.confirmLoading = false;
                            // this.getTableData();
                            //跳转到详情
                            this.goToItemDetail();
                        }).catch(() => {
                            // this.confirmLoading = false;
                            console.log("出错了")
                        });

                } else {
                    this.$message.warning("基本信息缺失", 2);
                    if (this.stepsCur != 1)
                        this.stepsCur = 1;
                }

            });

        },
        //跳转到详情页
        goToItemDetail(){
            console.log("发生了跳转");
            this.$router.push({
                name: "demandManagementItemDetail",
                params: {
                    tags: "需求条目详情",
                    // docUid: data.docUid,
                    // itemUid: data.itemUid,
                    // itemEdition: data.itemEdition,
                    // docEditionUid: data.docEditionUid,
                    // sectionUid: data.sectionUid
                }
            });
        }

    },
    created() {

    },
    mounted() { },
    activated() {

    }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
.addNewEvent-main {
    margin: 16px;
    background-color: #ffffff;
    .steps-content {
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0;
        right: 0;
        padding: 5px 16px;
        box-sizing: border-box;
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
}
</style>