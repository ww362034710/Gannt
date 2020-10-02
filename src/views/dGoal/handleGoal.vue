<template>
  <div>
    <a-drawer
      :title="item.id?'修改目标需求':'新增目标需求'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :width="600"
      @close="handleCancel"
    >
      <a-form :form="form" style="margin-bottom: 100px">
        <a-form-item label="标题：" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '请输入标题' }] }]"
            placeholder="请输入标题"
            allowClear
          />
        </a-form-item>
        <a-form-item label="优先级" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-select v-decorator="['importance']" placeholder="请选择优先级">
            <a-select-option v-for="item in importanceList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="版本：" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-input
                  v-decorator="['edition', { rules: [{ required: true, message: '版本' }] }]"
                  placeholder="请输入版本"
                  allowClear
          />
        </a-form-item>
        <a-form-item label="期望开始时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-textarea v-decorator="['expectStartTime']" placeholder="期望开始时间" allowClear />

        </a-form-item>
        <a-form-item label="持续时间：" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-input
                  v-decorator="['expectDuration', { rules: [{ required: true, message: '持续时间' }] }]"
                  placeholder="请输入持续时间"
                  allowClear
          />
        </a-form-item>
        <a-form-item label="预计结束时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-textarea v-decorator="['expectEndTime']" placeholder="预计结束时间" allowClear />
        </a-form-item>
        <a-form-item label="内容" :label-col=" { span: 6 }" :wrapper-col="  { span: 16}">
          <a-textarea v-decorator="['content']" placeholder="请输入内容" allowClear />
        </a-form-item>
        <a-form-item label="资源/物资需求" :label-col=" { span: 6 }" :wrapper-col="  { span: 16}">
          <a-textarea v-decorator="['resourceDemand']" placeholder="请输入资源/物资需求" allowClear />
        </a-form-item>



        <a-form-item label="关联事件" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-select v-decorator="['event']" placeholder="请选择">
            <a-select-option v-for="item in []" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务目标" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-select v-decorator="['goal']" placeholder="请选择">
            <a-select-option v-for="item in []" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="运行阶段" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-select v-decorator="['operatingPhase']" placeholder="请选择">
            <a-select-option v-for="item in []" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="责任单位" :label-col=" { span: 6 }" :wrapper-col=" { span: 16 }">
          <a-select v-decorator="['responsibleUnit']" placeholder="请选择">
            <a-select-option v-for="item in []" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'center',
          zIndex: 1,
        }"
      >
        <a-button type="primary" :style="{ marginRight: '80px' }" @click="handleOk">
          保存
        </a-button>
        <a-button  @click="handleCancel">
          提报
        </a-button>
      </div>
    </a-drawer>
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
      modelList: [],
      importanceList: [
        { id: 1, name: "一级" },
        { id: 2, name: "二级" },
        { id: 3, name: "三级" },
        { id: 4, name: "四级" }
      ],
    };
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    sPlanId: {
      type:String,
      default:""
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
          if(v.title){
            this.isEdit = true;
            this.form.setFieldsValue(v);
          }else {
            this.isEdit = false;
            this.form.resetFields();
          }

        });
      },
    },
  },
  created() {
    // 获取数据
  },
  methods: {
    // 初始化模型列表
    async _getInit() {
     /* let res = await this.$http.postBody("/bs/dict/list");
      if (res.code) return false;
      this.modelList = res.rows;*/
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
      data.sPlanId = this.sPlanId;
      let res = await this.$http.postBody("/bs/goal/" + url, data);
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
