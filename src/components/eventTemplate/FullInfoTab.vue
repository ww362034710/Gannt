<template>
    <a-tabs v-model="activeKey" @change="changeTabs">
        <a-tab-pane key="1" tab="基本信息">
            <EventForm ref="eventForm" @setBasicForm="formChanged" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="功能需求">
            <!-- data为表格数据 -->
            <StuffFeatureForm ref="stuff" @changed="featureChanged" />
        </a-tab-pane>

        <a-tab-pane key="3" tab="逻辑约束">
            <logic ref="logic" @change="logicChange"></logic>
        </a-tab-pane>

        <a-tab-pane key="4" tab="时序约束">
            <timing ref="timing" @change="timingChange"></timing>
        </a-tab-pane>

    </a-tabs>
</template>

<script>
/**
 * 事件分解抽屉模板
*/
//事件基本信息模板
import EventForm from '../../components/eventTemplate/BasicInfoForm'
//事件功能需求
import StuffFeatureForm from '../../components/eventTemplate/StuffFeatureForm'
//约束组件
import Logic from './LogicTemplate'
import Timing from './TimeTemplate'
export default {
    components: { EventForm, StuffFeatureForm, Logic ,Timing},
    data() {
        return {
            logicList:[],
            timeList:[],
            activeKey: '1',
            logic: false,//逻辑约束 tab
            timing: false,//时序约束 tab
            selNodeData: {
                data: []
            },
            formData: {},
            loadTabs: false,
            logicData: [{
                label: "Eb>Ea",
                id: "ebea"
            }, {
                label: "Eb=Ea∩Sb>Sa",
                id: "d"
            }]
        };
    },
    computed: {},
    watch: {

    },
    methods: {
        //标签页切换
        changeTabs(tabs) {
            this.$nextTick(() => {
                //等待第二个标签加载完成
                if (tabs === '2' && !this.loadTabs) {
                    this.loadTabs = true;
                    //表格数据
                    this.$refs.stuff.setData(this.selNodeData.data.featureList);
                } else if (tabs === '3' && !this.logic) {//逻辑约束
                    this.logic = true;
                    this.$refs.logic.setData(this.selNodeData.data.tplLogicList);
                } else if (tabs === '4' && !this.timing) {//时序约束
                    this.timing = true;
                    this.$refs.timing.setData(this.selNodeData.data.tplTimeList);
                }
            })
        },
        //初始化节点数据信息
        setData(event) {
            //当前选中节点数据
            this.selNodeData = event;
            console.log("FullInfoTab, data:", event);
            this.$nextTick(() => {
                //基础信息表单
                this.$refs.eventForm.setFormData(event);
                //表格数据
                if (this.$refs.stuff){
                    this.$refs.stuff.setData(event.data.featureList);
                }
                if (this.$refs.logic){
                    this.$refs.logic.setData(event.data.tplLogicList);
                }
                if (this.$refs.timing){
                    this.$refs.timing.setData(event.data.tplTimeList);
                }

            })

        },
        // 监听基础表单数据变更事件
        formChanged(formData) {
            console.log('FullInfoTab 触发 formChanged 事件', formData);
            this.selNodeData.data.entity = formData;
            this.emitChangeEvent();
        },
        // 当选择的功能列表变更时 触发该方法
        featureChanged(data) {
            // console.log('FullInfoTab 触发 featureChanged 事件', featureList);
            //选择表格数据
            console.log("@##@#@@##@# ");

            this.selNodeData.data.featureList = data
            // this.selNodeData.data.featureList = featureList;
            this.$emit("changed", this.selNodeData);
        },
        // 向上抛出数据变更事件
        emitChangeEvent() {
            console.log('FullInfoTab 触发 change 事件', this.selNodeData);
            this.$emit("changed", this.selNodeData);
        },
        //逻辑约束选择数据
        logicChange(data) {
            this.selNodeData.data.tplLogicList = data;
            console.log("$%$%$%%$");
            console.log(this.selNodeData.data.tplLogicList);
            this.$emit("changed", this.selNodeData);

        },
        //时序约束change
        timingChange(data) {
            this.selNodeData.data.tplTimeList = data
            this.$emit("changed", this.selNodeData);
        }
    },
    created() {

    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
</style>
