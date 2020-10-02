<template>
  <div>
    <a-modal
      :title="item.id?'修改模型':'新增模型'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="名称：" :label-col=" { span: 4 }" :wrapper-col=" { span: 16 }">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入目标名称' }] }]"
            placeholder="请输入名称"
            allowClear
          />
        </a-form-item>
        <a-form-item label="描述" :label-col=" { span: 4 }" :wrapper-col="  { span: 16}">
          <a-textarea v-decorator="['description']" placeholder="请输入描述" allowClear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: "handleModel",
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      visible: false,
      confirmLoading: false,
      isEdit: false,
    };
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否显示
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler: function (v) {
        this.visible = v;
      },
    },
    item: {
      deep: true,
      immediate: true,
      handler(v) {
        this.$nextTick(function () {
          if (v.name) {
            this.isEdit = true;
            this.form.setFieldsValue({
              name: v.name,
              description: v.description,
            });
          } else {
            this.isEdit = false;
            this.form.resetFields();
          }
        });
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
    // 新增/修改
    async _handleData(data) {
      this.confirmLoading = true;
      let url = this.isEdit ? "edit" : "add";
      if (this.isEdit) data.id = this.item.id;
      let res = await this.$http.postBody("/bs/dict/" + url, data);
      this.$message.success(res.msg);
      this.confirmLoading = false;
      this.$emit("update");
      this.$emit("close");
    },
    // 关闭
    handleCancel() {
      this.$emit("close");
      this.visible = false;
    },
  },
};
</script>
