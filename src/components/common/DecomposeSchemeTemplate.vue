<!-- 分解模板方案-->
<template>
    <div class="gojs-con">
        <!-- target  表示目标分解-->
        <div :style="gojsStyle" class="gojs-main">
            <GojsDe :edit-mode="editMode" @click="setNodeAttr" ref="gojs" target @handlerData="handlerData" />
        </div>
        <!-- 节点属性抽屉 -->
        <a-drawer :title="title" :get-container="false" placement="right" :mask="false" width="600" :maskClosable="false" :visible="nodeAttrVisible" @close="nodeAttrVisible=false">
            <div class="drawer-main">
                <goal-template-basic-info-form ref="targetForm" @setBasicForm="onNodeChange" v-show="showTargetForm" />
                <event-template-full-info-tab ref="eventFullInfoTab" @changed="onNodeChange" v-show="!showTargetForm" />
            </div>
        </a-drawer>
    </div>
</template>

<script>
import GojsDe from '../../components/eventTemplate/DecompositionEvent.vue'
//基本信息
import GoalTemplateBasicInfoForm from "../goalTemplate/BasicInfoForm";
//事件模板
import EventTemplateFullInfoTab from "../eventTemplate/FullInfoTab";

export default {
    name: 'DecomposeSchemeTemplate',
    components: { GojsDe, GoalTemplateBasicInfoForm, EventTemplateFullInfoTab },
    props: {
        schemeTemplateId: String,     // 当前分解方案的id
        schemeTemplateType: {
            type: String,
            default: "goal"
        },   // 当前分解方案的类型  goal/event,
        templateUrl: String,        // 模板列表数据地址
        editMode: {         // 当前页面的编辑模式  'edit' 编辑     'view' 仅查看
            type: null,
            default: 'view'
        },
    },
    data() {
        return {
            title: "事件信息",
            schemeTemplate: {},     // 当前分解方案 对象
            gojsStyle: {
                width: '100%',
            },
            nodeAttrVisible: false,//节点属性抽屉
            showTargetForm: false,//显示事件模板表单
            defaultNode: {              // 默认的新节点的信息
                // goal: {
                //     key: 'root',
                //     name: '',
                //     data: {
                //         node: {
                //             id: null,
                //             nodeType: 'goal',
                //             nodeId: null,
                //         },
                //         entity: {
                //             id: null,
                //             name: ""
                //         }
                //     }
                // },
                // event: {
                //     key: 'root',
                //     name: '',
                //     data: {
                //         node: {
                //             id: null,
                //             nodeType: 'event',
                //             nodeId: null,
                //         },
                //         entity: {
                //             id: null,
                //             name: ""
                //         },
                //         featureList: [],
                //         tplLogicList: [],
                //         tplTimeList: []
                //     }
                // }
            }
        };
    },
    computed: {},
    watch: {
        schemeTemplateId: {
            handler(v) {
                //重新获取流程图
                this.getData();
            },
            deep: true
        },
        nodeAttrVisible(value) {
            this.gojsStyle = {
                width: value ? 'calc(100% - 600px)' : "100%"
            }
            this.$nextTick(() => {
                this.$refs.gojs.zoomFit()
            })
        }
    },
    methods: {
        handlerData() {
            let treeNodes = this.$refs.gojs.getData();
            let dataToSave = { schemeTemplate: this.schemeTemplate, treeNodes: treeNodes };
            console.log('保存到后台的数据: ', dataToSave);
            this.$http.postBody("/bs/resolveSchemeTemplate/save", dataToSave).then(rst => {
                if (rst.code === 0) {
                    this.schemeTemplate = rst.data;
                    this.$message.success(rst.msg);
                } else {
                    this.$message.error(rst.msg);
                }
            });
        },
        /**
         * 点击节点事件
         * @param {*} data 当前节点数据
         */
        setNodeAttr(data) {
            //点击空白处  关闭抽屉
            if (!data) {
                this.nodeAttrVisible = false
                return
            }
            //含有类型属性 表示当前点击节点为事件节点
            this.showTargetForm = !Object.prototype.hasOwnProperty.call(data, 'category')
            //显示抽屉
            if (!this.nodeAttrVisible)
                this.nodeAttrVisible = true;
            this.$nextTick(() => {
                //根据点击节点不同初始化不同表单
                if (this.showTargetForm) {
                    this.title = "目标信息";
                    this.$refs.targetForm.setFormData(data)
                }
                else {
                    this.title = "事件信息";
                    this.$refs.eventFullInfoTab.setData(data)
                }
            })
        },
        //基础信息改变 流程图数据同步
        onNodeChange(data) {
            // let nodeData = this.$refs.gojs.getSelectNodeData().data;     // 增量更新可以考虑使用该方式  但目前使用的是全量更新
            // let newNodeData = Object.assign({}, nodeData, data);
            /**
             * 修改流程图节点数据
             * @param {*} newNodeData 修改数据
             * @param {*} 'data'  节点属性名称
             */
            this.$refs.gojs.saveNodeData(data.data, 'data')
            //修改基础信息 同时修改节点名称
            this.$refs.gojs.saveNodeData(data.data.entity.name, 'name')
        },
        getData() {
            console.log(this.schemeTemplateId, "流程图")
            if (this.schemeTemplateId!=null) {
                // 修改 则从后台获取
                this.$http.postBody("/bs/resolveSchemeTemplate/getSchemeTreeData", { schemeTemplateId: this.schemeTemplateId }).then(rst => {
                    if (rst.code === 0) {
                        this.schemeTemplate = rst.data.schemeTemplate;
                        //绘制流程图
                        this.$refs.gojs.initGojs(rst.data.treeNodes)
                    } else {
                        this.$message.error(rst.msg);
                    }
                });
            } else {
                // console.log(this.schemeTemplateType+"===================")
                // 构建一个新节点
                let a = [JSON.parse(JSON.stringify(this.defaultNode[this.schemeTemplateType]))];
                //绘制流程图
                this.$refs.gojs.initGojs(a)
            }
        }
    },
    created() {

    },
    mounted() {
        this.getData();
    },
}
</script>
<style lang='scss' scoped>
.gojs-con {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .gojs-main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .a {
        @extend .gojs-main;
        z-index: 100;
    }
}
</style>
