<template>
  <a-modal
    title="新增组"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" autocomplete="off">
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input
            v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
            placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-textarea v-decorator="['description']" placeholder="请输入描述"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "groupDialog",
  data() {
    return {
      visible: false, // 是否显示dialog
      confirmLoading: false, //是否正在加载
      form: this.$form.createForm(this, "addGroup"),

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
      default: null
    }
  },
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
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this._handleData(values);
          console.log(values);
        }
      });
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
        data.type = "group";
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
      let rst = await this.$http.get("/bs/ns/plan/activity/show", Object.assign({id: this.planActivityId}));
      if (rst.code) {
        this.$message.error(rst.msg);
      } else {
        let data = rst.data;
        this.$nextTick(function () {
          // 设置控件的值
          this.form.setFieldsValue({
            name: data.name,
            description: data.description,
          });
        });
      }
    },
  },
  mounted() {
    if (this.planActivityId) {
      this._loadPlanActivity();
    }
  }
};
</script>

<style scoped>
</style>