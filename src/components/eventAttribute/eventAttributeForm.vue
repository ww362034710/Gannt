<template>
  <div :class="formClass" v-show="curStep == 2 || forceShow">
    <div class="operate-zone" v-show="showOperate">
      <a-icon type="plus" @click="addAttributeForm()"/>
      <a-icon type="delete" @click="deleteAttributeForm()"/>
    </div>
    <a-form :form="form" @submit="handleSubmit" autocomplete="off">
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="spanCol">
        <a-input
          v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }] "
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item label="值类型" :label-col="{ span: 5 }" :wrapper-col="spanCol">
        <a-select v-decorator="['dataType']" placeholder="请选择值类型">
          <a-select-option
            v-for="item in dataTypeList"
            :key="item.key"
            :value="item.value"
          >{{item.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="默认值" :label-col="{ span: 5 }" :wrapper-col="spanCol">
        <a-input v-decorator="['value']" placeholder="请输入默认值" />
      </a-form-item>
      <a-form-item label="单位" :label-col="{ span: 5 }" :wrapper-col="spanCol">
        <a-select v-decorator="['units']" placeholder="请选择单位">
          <a-select-option
            v-for="item in unitsList"
            :key="item.value"
            :value="item.value"
          >{{item.dictLabel}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="spanCol">
        <a-textarea v-decorator="['description']" placeholder="请输入描述" />
      </a-form-item>
    </a-form>
  </div>
  
</template>

<script>
export default {
  name: "eventAttribute",
  data() {
    return {
      form: null,
      dataTypeList: [], // 资源列表
      unitsList: [], //单位列表
    };
  },
  created() {
    this._getInit();
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    formClass: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    curStep: {
      type: Number,
      default: -1
    },
    spanCol:{
      type:Object,
      default() {
        return {span: 10};
      },
    },
    showOperate:{
      type:Boolean,
      default: false
    },
    forceShow:{
      type:Boolean,
      default: false
    }
  },
  mounted() {
    if (this.item.name) this._getDetail();
    this.form = this.$form.createForm(this, { name: 'attributeForm' })
  },
  methods: {
    addAttributeForm(){
      this.$eventBus.$emit('addAttributeForm');
    },
    deleteAttributeForm(){
      this.$eventBus.$emit('deleteAttributeForm',this);
    },
    async _getInit() {
      {
        let res = await this.$http.get("/bs/dict/resource/list/value/type");
        if (res.code) return false;
        this.dataTypeList = res.data;
      }
      {
        let res = await this.$http.get("/system/dict/data/list/ns_dict_unit");
        if (res.code) return false;
        // console.log("资源单位列表:", res.data);
        this.unitsList = res.data;
      }
    },
    // 获取详情
    async _getDetail() {
      let params = {
        id: this.item.key,
      };
      let res = await this.$http.get("/bs/dict/attribute/show", params);
      if (res.code) return false;
      let data = res.data;
      this.$nextTick(function () {
        this.form.setFieldsValue({
          name: data.name,
          dataType: data.dataType,
          value: data.value,
          units: data.units,
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
      let api = "add";
      if (this.item.name) {
        api = "edit";
        data.id = this.item.key;
      } else {
        data.dictActivityId = this.item.key;
      }
      let res = await this.$http.postBody("/bs/dict/attribute/" + api, data);
      if (res.code) return false;
      this.loading = false
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
.operate-zone{display: flex;width: 100%;height:35px;justify-content: flex-end;align-items: center;}
.operate-zone i{margin-right: 10px;font-size: 18px;cursor: pointer;}
.operate-zone i:last-child{margin-right: 20px;}
.custom-form-class{width: 100%;height: 100%;}
</style>