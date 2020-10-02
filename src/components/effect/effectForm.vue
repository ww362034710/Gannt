<template>
  <div :class="formClass" v-show="curStep == 3 || forceShow">
    <div class="operate-zone" v-show="showOperate">
      <a-icon type="plus" @click="addEffectForm()"/>
      <a-icon type="delete" @click="deleteEffectForm()"/>
    </div>
    <a-form :form="form" @submit="submit" autocomplete="off" >
    <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
      <a-input
        v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
        placeholder="请输入名称"
      />
    </a-form-item>
    <a-form-item label="资源" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
      <a-select v-decorator="['dictResourceId']" placeholder="请选择资源">
        <a-select-option v-for="item in dataTypeList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <div class="flex">
      <a-form-item label="开始偏移量" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-decorator="['startOffset',{
            initialValue:'START,P0D'
            
          }]"
          placeholder="请输入开始偏移量"
        />
      </a-form-item>
      <a-form-item label="结束偏移量" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-decorator="['endOffset',{
              initialValue:'END,P0D'
          }] "
          placeholder="请输入结束偏移量"
        />
      </a-form-item>
    </div>
    <div class="flex">
      <a-form-item label="开始时影响" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
        <a-input v-decorator="['startEffect']" placeholder="支持表达式" />
      </a-form-item>
      <a-form-item label="结束时影响" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-input v-decorator="['endEffect']" placeholder="支持表达式" />
      </a-form-item>
    </div>
    <a-form-item label="计算模式" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
      <a-select v-decorator="['mode']" placeholder="选择计算模式">
        <a-select-option
          v-for="item in modeList"
          :key="item.dictValue"
          :value="item.dictValue"
        >{{item.dictLabel}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-textarea v-decorator="['description']" placeholder="请输入描述" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 12 }">
      <slot></slot>
    </a-form-item>
  </a-form>
  </div>
  
</template>

<script>
export default {
  name: "influence",
  data() {
    return {
      form: this.$form.createForm(this, { name: "influence" }),
      dataTypeList: [], // 资源列表
      modeList: [], // 模式列表
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
    dictId: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: ""
    },
    formClass: {
      type: String,
      default: ""
    },
    curStep: {
      type: Number,
      default: -1
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
  },
  methods: {
    addEffectForm(){
      this.$eventBus.$emit('addEffectForm');
    },
    deleteEffectForm(){
      this.$eventBus.$emit('deleteEffectForm',this);
    },
    //提交数据
    submit(e) {
      e.preventDefault();
      let _this = this;
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            let data = _this._handleString(values);
            resolve(data);
          } else {
            reject();
          }
        });
      });
    },
    async _getInit() {
      // 资源列表
      {
        let data = {
          dictId: this.dictId,
        };
        let res = await this.$http.postBody(
          "/bs/dict/resource/list",
          data
        );
        if (res.code) return false;
        this.dataTypeList = res.data.rows;
      }
      // 计算模式列表
      {
        let res = await this.$http.get(
          "/system/dict/data/list/ns_calculate_mode"
        );
        if (res.code) return false;
        this.modeList = res.data;
      }
    },
    // 获取详情
    async _getDetail() {
      let params = {
        id: this.item.key,
      };
      let res = await this.$http.get("/bs/dict/effect/show", params);
      if (res.code) return false;
      let data = res.data;
      if (this.item.name) {
        this.$nextTick(function () {
          // 设置控件的值
          this.form.setFieldsValue({
            name: data.name,
            dictResourceId: data.dictResourceId,
            startOffset: data.startOffset,
            endOffset: data.endOffset,
            startEffect: data.startEffect,
            endEffect: data.endEffect,
            mode: data.mode,
            description: data.description,
          });
        });
      }
    },
    // 字符串
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