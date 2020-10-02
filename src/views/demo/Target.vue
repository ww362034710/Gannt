<template>
    <div class="page-main">
        <div class="page-main-container">
            <!-- target  表示目标分解-->
            <div :style="gojsStyle" class="gojs-main">
                <GojsDe @click="setNodeAttr" ref="gojs" target @handlerData="handlerData" @addTemplate="addTemplate" />
            </div>
            <!-- 节点属性抽屉 -->
            <a-drawer title="目标信息" :get-container="false" placement="right" :mask="false" width="600" :maskClosable="false" :visible="nodeAttrVisible" @close="nodeAttrVisible=false">
                <div class="drawer-main">
                    <NodeForm ref="targetForm" @setBasicForm="setBasicForm" v-show="showTargetForm" />
                    <DecompoEventDrawer ref="eventForm" @setBasicForm="setBasicForm" v-show="!showTargetForm" />
                </div>
            </a-drawer>
        </div>

        <!-- 选择模板数据 -->
        <a-modal title="模板数据" :width="650" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="visible=false">
            <m-table ref="template" :scroll="scroll" tsize="small" url="system/user/list" rowSelection :columns="columns" />
        </a-modal>

    </div>
</template>

<script>
import GojsDe from '@/components/eventTemplate/DecompositionEvent.vue'
//基本信息
import NodeForm from '@/components/goalTemplate/BasicInfoForm'
//事件模板
import DecompoEventDrawer from '@/components/eventTemplate/FullInfoTab'
import MTable from "@/components/common/MTable";
export default {
    components: { GojsDe, NodeForm, DecompoEventDrawer, MTable },
    name: "demoTarget",
    data() {
        return {
            gojsStyle: {
                width: '100%',
            },
            columns: [
                {
                    title: "名称",
                    dataIndex: "name",
                },
                {
                    title: "编码",
                    dataIndex: "code",
                    width: "20%"
                }, {
                    title: "优先级",
                    dataIndex: "priority",
                    width: "20%"
                }, {
                    title: "所属系统",
                    dataIndex: "ownerSystem",
                    width: "20%"
                },
            ],
            visible: false,
            confirmLoading: false,
            nodeAttrVisible: false,//节点属性抽屉
            showTargetForm: false//显示事件模板表单
        };
    },
    computed: {
        //表格高度
        scroll() {
            return {
                y: Math.ceil(document.documentElement.clientHeight * 0.6) - 100
            }
        }
    },
    watch: {
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
        //保存模块信息
        handlerData() {
            //流程图信息
            let data = this.$refs.gojs.getData()
            console.log(data)
        },

        /** 
         * 流程图点击节点事件
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
                if (this.showTargetForm)
                    this.$refs.targetForm.setFormData(data)
                else
                    this.$refs.eventForm.setFormData(data)
            })
        },
        //基础信息改变 流程图数据同步
        setBasicForm(data) {
            let nodeData = this.$refs.gojs.getSelectNodeData().data
            let newNodeData = Object.assign({}, nodeData, { entity: data })
            /**
             * 修改流程图节点数据
             * @param {*} newNodeData 修改数据
             * @param {*} 'data'  节点属性名称 
            */
            this.$refs.gojs.saveNodeData(newNodeData, 'data')
            //修改基础信息 同时修改节点名称
            this.$refs.gojs.saveNodeData(data.name, 'name')
        },
        getData() {
            let a = [{
                name: '事件1',            // 都无所谓  不关心
                key: 'TE_000001',
                value: 'TE_000001',
                data: {
                    node: {
                        id: null,
                        nodeType: 'goal',
                        nodeId: null,   // 数据库中的id
                    },
                    entity: {
                        id: null,
                        name: "事件1",
                        code: "TE_0000001",
                        ownerSystem: "1"
                    }
                },
                children: [
                    {
                        name: '事件1.1',            // 都无所谓  不关心
                        key: 'TE_000001',
                        value: 'TE_000001',
                        data: {
                            node: {
                                id: null,
                                nodeType: 'event',
                                nodeId: null,   // 数据库中的id
                            },
                            entity: {
                                id: null,
                                name: "事件1.1",
                                code: "TE_0000002",
                                ownerSystem: "1"
                            }
                        },
                        children: [

                        ]
                    }
                ]
            }]
            //绘制流程图
            this.$refs.gojs.initGojs(a)
        },
        //选择模板
        addTemplate() {
            //显示弹窗表格
            this.visible = true
        },
        //选择完数据模板
        handleOk() {
            //选择的模板数据
            let data = this.$refs.template.selectedRowDatas
            //请求数据
            this.confirmLoading = true
            setTimeout(() => {
                //将请求数据放入gojs  流程图进行处理
                this.$refs.gojs.addMultiNode([])
                //关闭弹窗
                this.confirmLoading = false
                this.visible = false
            }, 3000)
        },
    },
    created() {

    },
    mounted() {
        this.getData()

    },
}
</script>
<style lang='scss' scoped>
.gojs-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.drawer-main {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    bottom: 15px;
    padding: 15px 5px;
    box-sizing: border-box;
    overflow: auto;
}
</style>