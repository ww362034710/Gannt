<template>
  <div>
    <h3 class="con-title">活动</h3>
    <a-form :form="form" @submit="handleSubmit" autocomplete="off">
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input
          v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item label="子系统" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input v-decorator="['subSystem']" placeholder="请输入子系统" />
      </a-form-item>
      <a-form-item label="活动时长" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
<!--        <a-time-picker-->
<!--          style="width:100%"-->
<!--          v-decorator="['duration']"-->
<!--          placeholder="请选择活动时长"-->
<!--          valueFormat="hh:mm:ss"-->
<!--        />-->
        <a-input v-decorator="['duration']" placeholder="请输入时间" />
      </a-form-item>
      <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-textarea v-decorator="['description']" placeholder="请输入描述" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 9 }">
        <a-button type="primary" html-type="submit" :loading="loading">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "addActivities",
  data() {
    return {
      form: this.$form.createForm(this, { name: "addActivities" }),
      data: {},
      loading: false,
    };
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    if (this.item.name) {
      this._getInit();
    }
  },
  methods: {
    // 获取详情
    async _getInit() {
      let params = {
        id: this.item.key,
      };
      let res = await this.$http.get("/bs/dict/activity/show", params);
      if (res.code) return false;
      let data = res.data;
      this.data = res.data;
      this.$nextTick(function () {
        // 设置控件的值
        this.form.setFieldsValue({
          name: data.name,
          subSystem: data.subSystem,
          duration: data.duration,
          description: data.description,
        });
      });
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = this._handleString(values);
          this._submit(data);
        }
      });
    },
    // 提交数据
    async _submit(data) {
      this.loading = true;
      let api = "";
      if (this.item.name) {
        api = "edit";
        data.id = this.item.key;
      } else {
        api = "add";
        data.dictId = this.$route.query.id;
      }
      let res = await this.$http.postBody("/bs/dict/activity/" + api, data);
      if (res.code) return false;
      this.loading = false;
      this.$message.success("操作成功");
      this.$emit("update");
    },
    // 处理字符串
    _handleString(data) {
      Object.keys(data).forEach((key) => {
        if (data[key] == void 0) {
          data[key] = "";
        }
      });
      return data;
    },
  },
};
</script>

<style scoped>
</style>