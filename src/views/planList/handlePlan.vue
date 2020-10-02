<template>
  <div>
    <a-modal
      :title="item.id?'修改场景':'新增场景'"
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
<!--        <a-form-item label="模型" :label-col=" { span: 4 }" :wrapper-col=" { span: 16 }">-->
<!--          <a-select v-decorator="['dictId']" placeholder="请选择模型">-->
<!--            <a-select-option v-for="item in modelList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
        <a-form-item label="上级场景" :label-col=" { span: 4 }" :wrapper-col=" { span: 16 }">
          <a-select v-decorator="['pid']" placeholder="请选择上级场景">
            <a-select-option v-for="item in planList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-model-item label="开始时间：" :label-col=" { span: 4 }" :wrapper-col=" { span: 16 }">
          <a-date-picker v-decorator="['startTime', {rules: [{ required: true, message: '请选择开始时间' }]}]" placeholder="请选择开始时间" />
        </a-form-model-item>
        <a-form-model-item label="结束时间：" :label-col=" { span: 4 }" :wrapper-col=" { span: 16 }">
          <a-date-picker v-decorator="['endTime', {rules: [{ required: true, message: '请选择结束时间' }]}]" placeholder="请选择结束时间" />
        </a-form-model-item>

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
      //modelList: [],
      planList: [],
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
        this._getPlan();
        this.$nextTick(function () {
          if (v.name) {
            this.isEdit = true;
            this.form.setFieldsValue({
              name: v.name,
              // dictId: v.dictId,
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
  created() {
    // 获取数据
    // this._getInit();
  },
  methods: {
    // 初始化模型列表
/*    async _getInit() {
      let res = await this.$http.postBody("/bs/dict/list");
      if (res.code) return false;
      this.modelList = res.rows;
    },*/
    async _getPlan() {
      let res = await this.$http.postBody("/bs/ns/plan/list");
      if (res.code) return false;
      this.planList = res.data.rows;
    },
    // 确定
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this._handleData(values);
        }
      });
    },
    // 新增/修改
    async _handleData(data) {
      this.confirmLoading = true;
      let url = this.isEdit ? "edit" : "add";
      if (this.isEdit) data.id = this.item.id;
      let res = await this.$http.postBody("/bs/ns/plan/" + url, data);
      this.confirmLoading = false;
      this.$message.success(res.msg);
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
