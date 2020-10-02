<!-- 分解目标方案-->
<template>
    <div class="gojs-con">
        <!-- target  表示目标分解-->
        <div :style="gojsStyle" class="gojs-main">
            <GojsDe :schemeType="schemeType" :edit-mode="editMode"  @click="setNodeAttr" ref="gojs" target @handlerData="handlerData" />
        </div>
        <!-- 节点属性抽屉 -->
        <a-drawer :title="title" placement="right" :mask="false" width="600" :maskClosable="false" :visible="nodeAttrVisible" @close="nodeAttrVisible=false">
            <div class="drawer-main">
                <goal-basic-info-form ref="targetForm" @setBasicForm="onNodeChange" v-show="showTargetForm" />
                <event-full-info-tab ref="eventFullInfoTab" @changed="onNodeChange" v-show="!showTargetForm" />
            </div>
        </a-drawer>
    </div>
</template>

<script>
    import GojsDe from '../../components/eventTemplate/DecompositionEvent.vue'
    //基本信息
    import GoalBasicInfoForm from "../goal/BasicInfoForm";
    //事件模板
    import EventFullInfoTab from "../event/FullInfoTab";

    export default {
        name: 'DecomposeScheme',
        components: { GojsDe, GoalBasicInfoForm, EventFullInfoTab },
        props: {
            schemeId: String,     // 当前分解方案的id
            schemeType: {
                type: String,
                default: "goal"
            },   // 当前分解方案的类型  goal/event,,   // 当前分解方案的类型  goal/event,
            templateUrl: String,        // 模板列表数据地址
            editMode: {         // 当前页面的编辑模式  'edit' 编辑     'view' 仅查看
                type: null,
                default: 'view'
            },
        },
        data() {
            return {
                scheme: {},     // 当前分解方案 对象
                gojsStyle: {
                    width: '100%',
                },
                title: "事件信息",
                nodeAttrVisible: false,//节点属性抽屉
                showTargetForm: false,//显示事件模板表单
                defaultNode: {              // 默认的新节点的信息
                    goal: {
                        key: 'root',
                        name: '新目标',
                        data: {
                            node: {
                                id: null,
                                nodeType: 'goal',
                                nodeId: null,
                            },
                            entity: {
                                id: null,
                                name: "新目标"
                            },
                        }
                    },
                    // event: {
                    //     key: 'root',
                    //     name: '新事件',
                    //     data: {
                    //         node: {
                    //             id: null,
                    //             nodeType: 'event',
                    //             nodeId: null,
                    //         },
                    //         entity: {
                    //             id: null,
                    //             name: "新事件"
                    //         },
                    //         featureList: []
                    //     }
                    // }
                }
            };
        },
        computed: {},
        watch: {
            schemeId:{
                handler(v){
                    //重新获取流程图
                    this.getData();
                },
                deep:true
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
                let dataToSave = {scheme: this.scheme, treeNodes: treeNodes};
                console.log('保存到后台的数据: ' , dataToSave);
                 debugger;//TODO 验证

                // this.$refs.targetForm.form.validateFields((err,values) =>{
                //     if (!err){
                //         console.log(values);
                //     }else {
                //         console.log("有异常！");
                //     }
                // });

                this.$http.postBody("/bs/resolveScheme/save", dataToSave).then(rst => {
                    if (rst.code === 0) {
                        this.scheme = rst.data;
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
                    if (this.showTargetForm){
                        this.title="目标信息";
                        this.$refs.targetForm.setFormData(data)
                    }
                    else{
                        this.title="事件信息";
                        this.$refs.eventFullInfoTab.setData(data);
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
                console.log(data);
                this.$refs.gojs.saveNodeData(data.data, 'data')
                //修改基础信息 同时修改节点名称
                this.$refs.gojs.saveNodeData(data.data.entity.name, 'name')
            },
            getData() {
                // console.log("schemeId: "+this.schemeId);
                if (this.schemeId!=null) {
                    // console.log("schemeId: "+this.schemeId);
                    // 修改 则从后台获取
                    this.$http.postBody("/bs/resolveScheme/getSchemeTreeData", { schemeId: this.schemeId}).then(rst => {
                        if (rst.code === 0) {
                            this.scheme = rst.data.scheme;
                            //绘制流程图
                            this.$refs.gojs.initGojs(rst.data.treeNodes)
                        } else {
                            this.$message.error(rst.msg);
                        }
                    });
                } else {
                    // 构建一个新节点
                    let a = [this.defaultNode[this.schemeType]];
                    //绘制流程图
                    this.$refs.gojs.initGojs(a)
                }
            }
        },
        created() {
            console.log("goalEdit, params", this.$route.params);
            this.schemeId = this.$route.params.schemeId;
            // console.log(this.schemeId+"=======================")
            this.getData();
        },
        mounted() {
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
