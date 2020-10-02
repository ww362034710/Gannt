<template>
  <div :class="formClass" v-show="curStep == 4 || forceShow">
    <div class="operate-zone" v-show="showOperate">
      <a-icon type="plus" @click="addContraintForm()"/>
      <a-icon type="delete" @click="deleteContraintForm()"/>
    </div>
    <a-form :form="form" @submit="handleSubmit" autocomplete="off">
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input
          palceholder="请填写名称"
          v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
          placeholder="请输入名称"
        />
      </a-form-item>
      <div class="flex">
        <a-form-item label="生效模式" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-select v-decorator="['periodType']" placeholder="请选则生效模式">
            <a-select-option
              v-for="item in periodType"
              :key="item.dictValue"
              :value="item.dictValue"
            >{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-radio-group v-decorator="['dataType']" @change="changeType" placeholder="请选则类型">
            <a-radio v-for="item in dataTypeList" :key="item.key" :value="item.value">{{item.text}}</a-radio>
            <!--            <a-radio value="数值">数值</a-radio>-->
          </a-radio-group>
        </a-form-item>
      </div>
      <div class="flex">
        <a-form-item label="开始偏移量" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-input v-decorator="['startOffset',{initialValue:'START,P0D'}]" placeholder="请输入开始偏移量" />
        </a-form-item>
        <a-form-item label="结束偏移量" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-input v-decorator="['endOffset',{initialValue:'END,P0D'}]" placeholder="请输入结束偏移量" />
        </a-form-item>
      </div>
      <div class="flex" v-if="isStatus">
        <a-form-item
          label="状态"
          :label-col="{ span: 10 }"
          :wrapper-col="{ span: 10 }"
          v-show="false"
        >
          <a-input v-decorator="['enumType']" />
          <!--          <a-select v-decorator="['enumType']" @change="handleResourceEnumTypeChange">-->
          <!--            <a-select-option-->
          <!--                    v-for="item in statusList"-->
          <!--                    :key="item.dictType"-->
          <!--                    :value="item.dictType"-->
          <!--            >{{item.dictName}}</a-select-option>-->
          <!--          </a-select>-->
        </a-form-item>
        <a-form-item label="资源" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-select
            v-decorator="['resourceId']"
            @change="handleResourceEnumTypeChange"
            placeholder="请选则资源"
          >
            <a-select-option
              v-for="item in resourceList"
              :key="item.id"
              :value="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="阈值" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-input v-decorator="['threshold']" placeholder="请输入阈值" />
        </a-form-item>
      </div>
      <div class="flex" v-if="isStatus">
        <a-form-item label="禁止状态" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-select v-decorator="['disallowedState']" mode="multiple" placeholder="请选则禁止状态">
            <a-select-option
              v-for="item in statusDataList"
              :key="item.value"
              :value="item.value"
            >{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="必须状态" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
          <a-select v-decorator="['requiredState']" mode="multiple" placeholder="请选则必须状态">
            <a-select-option
              v-for="item in statusDataList"
              :key="item.value"
              :value="item.value"
            >{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <a-form-item v-if="!isStatus" label="公式" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
        <a-input v-decorator="['expression']" placeholder="请输入公式" />
      </a-form-item>

      <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-textarea v-decorator="['description']" placeholder="请输入描述" />
      </a-form-item>
    </a-form>
  </div>

</template>

<script>
export default {
  name: "eventContraint",
  data() {
    return {
      form: this.$form.createForm(this, { name: "constraint" }),
      periodType: [], // 生效模式
      dataTypeList: [], //约束类型列表
      // statusList: [], // 状态列表
      resourceList: [], // 资源列表
      statusDataList: [], //状态中可用数据的列表
      isStatus: true,
      loading: false
    };
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
    },
    resId:{
      type:String,
      default: ''
    }
  },
  mounted() {
    this._getInit();
    if (this.item.name) this._getDetail();
  },
  methods: {
    addContraintForm(){
      this.$eventBus.$emit('addContraintForm');
    },
    deleteContraintForm(){
      this.$eventBus.$emit('deleteContraintForm',this);
    },
    // 初始化数据
    async _getInit() {
      // 生效模式
      {
        let res = await this.$http.get("/system/dict/data/list/ns_period_type");
        if (res.code) return false;
        this.periodType = res.data;
      }
      // 约束类型
      {
        let res = await this.$http.get("/bs/dict/constraint/type/list");
        if (res.code) return false;
        console.log("约束类型列表是:", res.data);
        this.dataTypeList = res.data;
      }
      // // 获取字典状态列表
      // {
      //   let res = await this.$http.get("/bs/dict/status/list");
      //   if (res.code) return false;
      //   this.statusList = res.data;
      //   console.log("状态", res.data);
      // }
      //获取资源列表
      {
        let resid = this.resId || (this.$route && this.$route.query.id);
        if(resid){
          let params = { dictId: resid, dataType: "state" };
          let res = await this.$http.postBody(
            "/bs/dict/resource/list",
            params
          );
          if (res.code) return false;
          this.resourceList = res.data.rows;
          console.log("资源");
          console.log(res.data);
        }
      }
    },
    async _loadForm() {
      let res = await this.$http.get("/bs/dict/constraint/show", {
        id: this.item.key,
      });
      if (res.code) return false;
      let data = res.data;
      this.$nextTick(function () {
        // 设置控件的值
        this.form.setFieldsValue(data);
      });
    },
    // 切换类型选择
    changeType(e) {
      let val = e.target.value;
      this.isStatus = val == "state" ? true : false;
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = this._handleString(values);
          this._submit(data);
          console.log("Received values of form: ", data);
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
        data.dictActivityId = this.item.key;
      }
      let res = await this.$http.postBody("/bs/dict/constraint/" + api, data);
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
    async handleResourceEnumTypeChange(resourceId) {
      //通过id找到对应的enumType
      let resource = this.resourceList.find(
        (resource) => resource.id === resourceId
      );
      let res = await this.$http.get(
        "/system/dict/data/list/" + resource.enumType
      );
      if (res.code) return false;
      this.statusDataList = res.data;
      this.$nextTick(function () {
        this.form.setFieldsValue({
          enumType: resource.enumType,
        });
      });
    }
  },
};
</script>

<style scoped>
.operate-zone{display: flex;width: 100%;height:35px;justify-content: flex-end;align-items: center;}
.operate-zone i{margin-right: 10px;font-size: 18px;cursor: pointer;}
.operate-zone i:last-child{margin-right: 20px;}
.custom-form-class{width: 100%;height: 100%;}
</style>