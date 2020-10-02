<template>
  <a-modal
    title="新增约束"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    width="1000px"
  >
    <a-form :form="form" autocomplete="off">
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
                  v-decorator="['planResourceId']"
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
  </a-modal>
</template>

<script>
export default {
  name: "constraintDialog",
  data() {
    return {
      visible: false, // 是否显示dialog
      confirmLoading: false, //是否正在加载
      form: this.$form.createForm(this,{name: "addConstraint"}),
      periodType: [], // 生效模式
      dataTypeList: [], //约束类型列表
      isStatus: true,
      resourceList: [], // 资源列表
      statusDataList: [], //状态类型资源值列表
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
      if (false) {
        api = "edit";
        data.id = this.item.key;
      } else {
        api = "add";
        data.planId = this.$route.query.id;
        data.planActivityId = this.planActivityId;
      }
      let res = await this.$http.postBody("/bs/ns/plan/constraint/" + api, data);
      if (res.code) return false;
      this.$message.success("操作成功!");
      this.handleCancel();
    },
    // 关闭
    handleCancel() {
      this.$emit("close");
      this.visible = false;
    },
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
      //获取资源列表
      {
        let params = { dictId: this.$route.query.id, dataType: "state" };
        let res = await this.$http.get(
                "/bs/ns/plan/resource/list/state/" + this.$route.query.id,
                params
        );
        if (res.code) return false;
        this.resourceList = res.data;
        console.log("资源");
        console.log(res.data);
      }
    },
    // 切换类型选择
    changeType(e) {
      let val = e.target.value;
      this.isStatus = val == "state" ? true : false;
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
      console.log("状态类型资源默认值列表:", res.data);
      this.statusDataList = res.data;
      this.$nextTick(function () {
        this.form.setFieldsValue({
          enumType: resource.enumType,
        });
      });
    },
    async _loadForm() {
      let res = await this.$http.get("/bs/ns/plan/constraint/show", {
        id: this.item.key,
      });
      if (res.code) return false;
      let data = res.data;
      this.$nextTick(function () {
        // 设置控件的值
        this.form.setFieldsValue(data);
      });
    },
  },
  created() {
    this._getInit();
  },
  mounted() {
    if (false) {
      this._loadForm();
    } else {
      //设置生效模式默认值
      //设置类型默认值
      this.$nextTick(function () {
        this.form.setFieldsValue({
          periodType: "THROUGHOUT",
          dataType: "state",
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;

  .ant-form-item {
    width: 50%;
  }
  }
</style>