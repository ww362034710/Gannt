<template>
    <div class="page-main">
        <div class="page-main-container">
            <!-- target  表示目标分解-->
            <div :style="gojsStyle" class="gojs-main">
                <GojsDe @click="setNodeAttr" ref="gojs" target @handlerData="handlerData" />
            </div>
            <!-- 节点属性抽屉 -->
            <a-drawer title="目标信息" :get-container="false" placement="right" :mask="false" width="600" :maskClosable="false" :visible="nodeAttrVisible" @close="nodeAttrVisible=false">
                <div class="drawer-main">
                    <!-- <a-tabs default-active-key="1">
                        <a-tab-pane key="1">
                            <span slot="tab">
                                <a-icon type="apple" />
                                基本信息
                            </span>
                            <EventForm ref="eventForm" @setBasicForm="setBasicForm" />
                        </a-tab-pane>
                        <a-tab-pane key="2">
                            <span slot="tab">
                                <a-icon type="android" />
                                功能需求
                            </span>
                            <StuffFeatureForm />
                        </a-tab-pane>
                    </a-tabs> -->
                    <0 @setBasicForm="setBasicForm" ref="drawerFrom" />
                </div>
            </a-drawer>
        </div>
    </div>
</template>

<script>
//gojs 
import GojsDe from '@/components/eventTemplate/DecompositionEvent'
import DecompoEventDrawer from '@/components/eventTemplate/FullInfoTab'
export default {
    components: { GojsDe, DecompoEventDrawer },
    name: "demoEvent",
    data() {
        return {
            customStyle:
                'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
            activeKey: 1,
            gojsStyle: {
                width: '100%',
            },
            nodeAttrVisible: false,//节点属性抽屉
        };
    },
    computed: {},
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
        //保存节点属性
        saveNodeData() {
            //获取表单值
            let data = this.addForm.getFieldsValue()
            this.$refs.gojs.saveNodeData(data)
        },
        //获取流程图数据
        getGojsData() {
            let data = this.$refs.gojs.getData()
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
        /** 
         * 点击节点事件
         * @param {*} data 当前节点数据
        */
        setNodeAttr(data) {
            console.log(data)
            //点击空白处  关闭抽屉
            if (!data) {
                this.nodeAttrVisible = false;
                return
            }
            //显示抽屉
            if (!this.nodeAttrVisible)
                this.nodeAttrVisible = true;
            this.$nextTick(() => {
                // this.$refs.eventForm.setFormData(data)
                this.$refs.drawerFrom.setFormData(data)
            })

        },
        getData() {
            let a = [{
                name: '事件1',            // 都无所谓  不关心
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
            }];
            //绘制流程图
            this.$refs.gojs.initGojs(a)
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