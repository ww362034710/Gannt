<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="bold" />基本信息
      </span>
      <planevents ref="planevents" :forceShow="showme" @setBasicForm="formChanged" />
    </a-tab-pane>
    <!-- <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="table" />功能需求
      </span>
      &lt;!&ndash; data为表格数据 &ndash;&gt;
      <StuffFeatureForm ref="stuff" @changed="featureChanged" />
    </a-tab-pane>
    <a-tab-pane key="3" tab="逻辑约束">
      <logic ref="logic" @change="logicChange"></logic>
    </a-tab-pane>

    <a-tab-pane key="4" tab="时序约束">
      <timing ref="timing" @change="timingChange"></timing>
    </a-tab-pane>-->
  </a-tabs>
</template>

<script>
/**
 * 事件分解抽屉模板
 */
//事件基本信息模板
import planevents from "../planEvent/planEventForm";
//事件功能需求
// import StuffFeatureForm from "../../components/event/StuffFeatureForm";
// //约束组件
// import Logic from "../eventTemplate/LogicTemplate";
// import Timing from "../eventTemplate/TimeTemplate";

export default {
  components: { planevents },
  // components: { planevents, StuffFeatureForm, Logic, Timing },
  data() {
    return {
      selNodeData: {
        data: [],
      },
      showme: true,
      formData: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    changeTabs() {
      if (!this.loadTabs) {
        this.loadTabs = true;
        //表格数据
        this.$nextTick(() => {
          // this.$refs.stuff.setData(this.selNodeData.data.featureList);
          // this.$refs.logic.setData(this.selNodeData.data.tplLogicList);
          // this.$refs.timing.setData(this.selNodeData.data.tplTimeList);
        });
      }
    },
    //初始化节点数据信息
    setData(event) {
      //当前选中节点数据
      this.selNodeData = event;
      console.log("FullInfoTab, data:", event);
      //基础信息表单
      this.$refs.planevents.setFormData(event);
      //表格数据
      // if (this.$refs.stuff){
      //     this.$refs.stuff.setData(event.data.featureList);
      // }
      // if (this.$refs.logic){
      //     this.$refs.logic.setData(event.data.tplLogicList);
      // }
      // if (this.$refs.timing){
      //     this.$refs.timing.setData(event.data.tplTimeList);
      // }
    },
    // 监听基础表单数据变更事件
    formChanged(formData) {
      console.log("FullInfoTab 触发 formChanged 事件", formData);
      this.selNodeData.data.entity = formData;
      this.emitChangeEvent();
    },
    // 当选择的功能列表变更时 触发该方法
    featureChanged(featureList) {
      console.log("FullInfoTab 触发 featureChanged 事件", featureList);
      this.selNodeData.data.featureList = featureList;
      this.emitChangeEvent();
    },
    // 向上抛出数据变更事件
    emitChangeEvent() {
      console.log("FullInfoTab 触发 change 事件", this.selNodeData);
      this.$emit("changed", this.selNodeData);
    },
    //逻辑约束选择数据
    // logicChange(data) {
    //     this.selNodeData.data.tplLogicList = data;
    //     console.log("$%$%$%%$");
    //     console.log(this.selNodeData.data.tplLogicList);
    //     this.$emit("changed", this.selNodeData);
    //
    // },
    //时序约束change
    // timingChange(data) {
    //     this.selNodeData.data.tplTimeList = data
    //     this.$emit("changed", this.selNodeData);
    // }
  },
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
</style>
