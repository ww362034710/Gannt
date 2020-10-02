<template>
  <div class="page-main page-demand-list">
    <div class="container-content" id="content">
      <div class="plan-eincident">
        <div class="interim">
          <interimEvent :plan-id="parentPlanId" ref="parentPlanEventList" :tableY="tableLefty"></interimEvent>
        </div>
        <div class="table">
          <div>
            <h3>基础事件库</h3>
           
          </div>
          <baseEvent ref="dictEventList" :tableY="tableY"></baseEvent>
          <div>
            <h3>已选择事件</h3>
            <a-button type="primary" icon="plus" @click="addDictEventToPlan">添加</a-button>
            <a-button type="primary" icon="plus" class="mgl-10" @click.stop="showAddDialog()">自定义事件</a-button>
          </div>
          <selectEvent ref="planEventList" :plan-id="planId" :tableY="tableY"></selectEvent>
        </div>
      </div>
    </div>
    <add-custom-event ref="customEventDialog"></add-custom-event>
  </div>
</template>

<script>
import baseEvent from "../../components/dictEvent/eventList";
import interimEvent from "../../components/planEvent/planEventListRadio";
import selectEvent from "../../components/planEvent/planEventList";
import addCustomEvent from "./addCustomEvent";
export default {
  name: "planEincidentIndex",
  data() {
    return { 
      tableY: 200, 
      tableLefty: 600
    };
  },
  components: {
    baseEvent,
    interimEvent,
    selectEvent,
    addCustomEvent
  },
  methods: {
    showAddDialog(){
      this.$refs.customEventDialog.show();
    },
    // 添加
    addDictEventToPlan() {
      //获取到基础事件库中已选择的事件
      let selectedEventKeys = this.$refs.dictEventList.getSelectedRowKeys();
      console.log("获取到已选择的事件库事件:", selectedEventKeys);
      //获取选择的上级事件id
      let parentId = this.$refs.parentPlanEventList.getSelectedRowKey();
      console.log("选择的上级事件id为:", parentId);

      //将事件添加到规划中
      let resultFlag = this._addDictEventToPlan(this.planId, selectedEventKeys, parentId);
      if (resultFlag) this.$refs.planEventList.refreshTbl();
    },
    //提交要添加到规划中的数据
    async _addDictEventToPlan(planId, dictEventIds, parentId) {
      //将选择的事件添加到场景中
      let rst = await this.$http.postBody("/bs/ns/plan/add/dict/event", {
        planId: planId,
        dictEventIds: dictEventIds,
        parentId: parentId
      });
      if (rst.code) return false;
      this.$message.success("添加成功!");
      return true;
    },
    // 设置高度
    _setHeight() {
      let dom = document.getElementById("content");
      this.tableLefty = dom.offsetHeight - 130;
      this.tableY = (dom.offsetHeight - 360) / 2;
    },
  },
  computed: {
    planId() {
      return this.$route.query.id;
    },
    parentPlanId() {
      return this.$route.query.pid;
    }
  }
};
</script>

<style lang="scss" scoped>
.plan-eincident {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .interim {
    width: 300px;
  }
  .table {
    flex: 1;
  }
}

.plan-eincident h3{
  font-size: 20px;
  font-weight: bold;
}
.mgl-10{
  margin-left: 10px;
}
</style>