<template>
  <a-modal
    title="编辑活动"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    width="600px"
  >
    <planevents ref="planevents" :forceShow="showme"></planevents>
  </a-modal>
</template>

<script>
import planevents from "../../../components/planEvent/planEventForm";
export default {
  name: "activityDialog",
  data() {
    return {
      visible: false, // 是否显示dialog
      showme: true,
      confirmLoading: false, //是否正在加载
      form: this.$form.createForm(this, "addActivity"),
      dictActivityList: [], //活动列表
    };
  },
  props: {
    show: {
      //是否显示dialog
      type: Boolean,
      default: false,
    },
    planActivityId: {
      type: String,
      default: null,
    },
    groupId: {
      type: String,
      default: null,
    },
  },
  components: { planevents /*StuffFeatureForm*/ /*,Logic ,Timing*/ },
  watch: {
    show: {
      immediate: true,
      handler: function (v) {
        this.visible = v;
      },
    },
  },
  methods: {
    // 确定
    async handleOk(e) {
      let data = await this.$refs.planevents.submit(e);
      if (data) {
        this._handleData(data);
      }
    },
    // 提交数据
    async _handleData(data) {
      let api = "";
      if (this.planActivityId) {
        api = "edit";
        data.id = this.planActivityId;
      } else {
        api = "add";
        data.planId = this.$route.query.id;
        data.type = "activity";
        data.groupId = this.groupId;
      }
      let res = await this.$http.postBody("/bs/ns/plan/activity/" + api, data);
      if (res.code) return false;
      this.$message.success("操作成功");
      this.$emit("update");
      this.handleCancel();
    },
    // 关闭
    handleCancel() {
      this.$emit("close");
      this.visible = false;
    },
    //加载一个规划活动
    async _loadPlanActivity() {
      let rst = await this.$http.get(
        "/bs/ns/plan/activity/show",
        Object.assign({ id: this.planActivityId })
      );
      if (rst.code) {
        this.$message.error(rst.msg);
      } else {
        let data = rst.data;
        this.$nextTick(function () {
          // 设置控件的值
          this.form.setFieldsValue({
            dictActivityId: data.dictActivityId,
            name: data.name,
            subSystem: data.subSystem,
            duration: data.duration,
            description: data.description,
          });
        });
      }
    },
  },
};
</script>

<style scoped>
</style>