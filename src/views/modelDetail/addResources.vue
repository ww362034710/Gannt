<template>
  <div :class="formClass">
    <h3 class="con-title" v-show="showtitle">资源</h3>
    <a-form :form="form" @submit="handleSubmit" autocomplete="off">
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input
          v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item label="资源类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-select v-decorator="['type']" placeholder="请选择资源类型">
          <a-select-option
            v-for="item in resourceTypeList"
            :key="item.key"
            :value="item.value"
          >{{item.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="值类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-select v-decorator="['dataType']" @change="changeDataType" placeholder="请选则值类型">
          <a-select-option
            v-for="item in dataTypeList"
            :key="item.key"
            :value="item.value"
          >{{item.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <div class="flex" v-if="type =='numerical'">
        <a-form-item label="初始值" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-input v-decorator="['defaultValue']" placeholder="请输入初始值" />
        </a-form-item>
        <a-form-item label="范围" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input-group compact>
            <a-input
              style=" width: 100px; text-align: center"
              placeholder="最小值"
              v-decorator="['minValue']"
            />
            <a-input
              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-input
              style="width: 100px; text-align: center; border-left: 0"
              placeholder="最大值"
              v-decorator="['maxValue']"
            />
          </a-input-group>
        </a-form-item>
      </div>
      <div class="flex" v-if="type =='state'">
        <a-form-item label="枚举" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-select
            v-decorator="['enumType']"
            @change="handleResourceEnumTypeChange"
            placeholder="请选则枚举"
          >
            <a-select-option
              v-for="item in enumTypeList"
              :key="item.dictType"
              :value="item.dictType"
            >{{item.dictName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="初始值" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
          <a-select v-decorator="['defaultValue']" placeholder="请选则初始值">
            <a-select-option
              v-for="item in defaultTypeValueList"
              :key="item.value"
              :value="item.value"
            >{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <a-form-item
        v-if="type =='boolean'"
        label="初始值"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 5 }"
      >
        <a-select v-decorator="['defaultValue']" placeholder="请选则初始值">
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-if="type =='interval'"
        label="初始值"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 5 }"
      >
        <a-time-picker v-decorator="['defaultValue']" valueFormat="hh:mm:ss" placeholder="请选则初始值" />
      </a-form-item>
      <a-form-item label="业务类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input
          v-decorator="['category',{ rules: [{ required: false, message: '请输入业务类型' }] }]"
          placeholder="请输入业务类型"
        />
      </a-form-item>
      <a-form-item label="形态" :label-col="{ span: 5 }" :wrapper-col="{ span: 7 }">
        <a-radio-group v-decorator="['materialForm']">
          <a-radio
            v-for="item in materialFormList"
            :key="item.value"
            :value="item.value"
          >{{item.dictLabel}}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="单位" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-select v-decorator="['units']" placeholder="请选则单位">
          <a-select-option
            v-for="item in unitsList"
            :key="item.value"
            :value="item.value"
          >{{item.dictLabel}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-textarea v-decorator="['description']" placeholder="请输入描述" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 12 }" v-show="showtitle">
        <a-button type="primary" html-type="submit" :loading="loading">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "addResources",
  data() {
    return {
      form: this.$form.createForm(this, { name: "addResources" }),
      resourceTypeList: [], //资源类型列表
      dataTypeList: [], // 资源列表
      materialFormList: [], //物质形态列表
      enumTypeList: [], //资源使用的枚举列表
      defaultTypeValueList: [], //状态类型资源默认值列表
      unitsList: [], //单位列表
      type: "numerical", //如果是编辑,则要取编辑的资源的类型
      loading: false,
    };
  },
  props: {
    formClass: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    showtitle: {
      type: Boolean,
      default: true
    },
  },
  mounted() {
    this._getInit();
  },
  methods: {
    async _getInit() {
      // 获取资源类型列表
      {
        let res = await this.$http.get("/bs/dict/resource/list/resource/type");
        if (res.code) return false;
        // console.log("值类型的数据是:", res.data);
        this.resourceTypeList = res.data;
        this.$nextTick(function () {
          this.form.setFieldsValue({
            type: this.resourceTypeList[0].value,
          });
        });
      }
      // 物质形态列表 ns_material_form
      {
        let res = await this.$http.get(
          "/system/dict/data/list/ns_material_form"
        );
        if (res.code) return false;
        // console.log("物质形态的数据是:", res.data)
        this.materialFormList = res.data;
        // 设置默认值
      }
      // 值类型列表 这个请求后台用的是枚举,不是字典所以跟其它不一样
      {
        let res = await this.$http.get("/bs/dict/resource/list/value/type");
        if (res.code) return false;
        // console.log("值类型的数据是:", res.data);
        this.dataTypeList = res.data;
        this.$nextTick(function () {
          this.form.setFieldsValue({
            materialForm: this.materialFormList[0].value,
            dataType: this.dataTypeList[0].value,
          });
        });
      }
      // 详情
      {
        if (this.item.name) {
          let params = { id: this.item.key };
          let res = await this.$http.get("/bs/dict/resource/show", params);
          if (res.code) return false;
          let data = res.data;
          if (this.item.name) {
            //赋值值类型
            this.changeDataType(data.dataType);
            if (data.enumType) this.handleResourceEnumTypeChange(data.enumType);
            //初始化表单
            this.$nextTick(function () {
              this.form.setFieldsValue({
                name: data.name,
                type: data.type,
                category: data.category,
                materialForm: data.materialForm,
                dataType: data.dataType,
                defaultValue: data.defaultValue,
                minValue: data.minValue,
                maxValue: data.maxValue,
                enumType: data.enumType,
                units: data.units,
                description: data.description,
              });
            });
          }
        }
      }

      // 资源使用状态列表
      {
        let res = await this.$http.get("/bs/dict/status/list");
        if (res.code) return false;
        // console.log("资源状态列表:", res.data);
        this.enumTypeList = res.data;
      }
      // 资源单位列表
      {
        let res = await this.$http.get("/system/dict/data/list/ns_dict_unit");
        if (res.code) return false;
        // console.log("资源单位列表:", res.data);
        this.unitsList = res.data;
      }
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
        if(this.showtitle) fdata.dictId = this.$route.query.id;
      }
      let res = await this.$http.postBody("/bs/dict/resource/" + api, data);
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
    //切换值类型
    changeDataType(type) {
      console.log(type);
      this.type = type;
    },
    async handleResourceEnumTypeChange(type) {
      let res = await this.$http.get("/system/dict/data/list/" + type);
      if (res.code) return false;
      console.log("状态类型资源默认值列表:", res.data);
      this.defaultTypeValueList = res.data;
    },
  },
};
</script>

<style scoped>
.custom-form-class{width: 100%;height: 100%;}
</style>