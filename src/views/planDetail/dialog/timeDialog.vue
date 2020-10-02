<template>
  <a-modal
    title="新增时间约束"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form :form="form" class="time-dialog" autocomplete="off">
      <a-form-item label="活动1" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input class="input-text" disabled v-decorator="['planActivityAName']" />
        <a-input class="input-text" v-show="false" v-decorator="['planActivityA']" />
      </a-form-item>
      <a-form-item label="时间点" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-radio-group
          class="radio-group"
          v-decorator="['startStopTypeA', {initialValue: 'endTime'}]"
        >
          <div class="flex">
            <a-radio value="startTime">开始时间</a-radio>
            <a-radio value="endTime">结束时间</a-radio>
          </div>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-radio-group class="type-group" v-decorator="['operatorType', {initialValue: 'anytime'}]">
          <div class="list">
            <a-radio value="anytime">任意时间前</a-radio>
          </div>
          <div class="list">
            <a-radio value="immediately">马上</a-radio>
          </div>
          <div class="item">
            <a-radio value="least">
              <a-input
                addon-before="小于"
                addon-after="前"
                placeholder="时间"
                style="width:180px"
                v-model="leastModel.minTime"
              />
            </a-radio>
            <a-radio value="exactly">
              <a-input-group compact>
                <a-input
                  addon-before="等于"
                  placeholder="时间"
                  style="width:145px"
                  v-model="exactlyModel.minTime"
                />
                <a-select v-model="exactlyModel.minTimeType">
                  <a-select-option value="before">前</a-select-option>
                  <a-select-option value="after">后</a-select-option>
                </a-select>
              </a-input-group>
            </a-radio>
            <a-radio value="between">
              <a-input-group compact>
                <a-input
                  addon-before="介于"
                  style="width: 145px"
                  placeholder="时间"
                  v-model="betweenModel.minTime"
                />
                <a-select v-model="betweenModel.minTimeType">
                  <a-select-option value="before">前</a-select-option>
                  <a-select-option value="after">后</a-select-option>
                </a-select>
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                  placeholder="~"
                  disabled
                />
                <a-input
                  style="width: 100px; text-align: center; border-left: 0"
                  placeholder="时间"
                  v-model="betweenModel.maxTime"
                />
                <a-select v-model="betweenModel.minTimeType">
                  <a-select-option value="before">前</a-select-option>
                  <a-select-option value="after">后</a-select-option>
                </a-select>
              </a-input-group>
            </a-radio>
          </div>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="活动2" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-input class="input-text" disabled v-decorator="['planActivityBName']" />
        <a-input class="input-text" v-show="false" v-decorator="['planActivityB']" />
      </a-form-item>
      <a-form-item label="时间点" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-radio-group v-decorator="['startStopTypeB', {initialValue: 'startTime'}]">
          <a-radio value="startTime">开始时间</a-radio>
          <a-radio value="endTime">结束时间</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="原因" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-textarea v-decorator="['rationale']" placeholder="请输入描述" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "timeDialog",
  data() {
    return {
      visible: false, // 是否显示dialog
      confirmLoading: false, //是否正在加载
      form: this.$form.createForm(this, "timeDialog"),
      leastModel: {
        minTime: "",
        minTimeType: "before",
      },
      exactlyModel: {
        minTime: "",
        minTimeType: "before",
      },
      betweenModel: {
        minTime: "",
        minTimeType: "after",
        maxTime: "",
        maxTimeType: "before",
      },
    };
  },
  props: {
    show: {
      //是否显示dialog
      type: Boolean,
      default: false,
    },
    item: {
      type: Array,
      required: true,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler: function (v) {
        this.visible = v;
      },
    },
  },
  // 初始化数据
  mounted() {
    this._getInit();
  },
  methods: {
    async _getInit() {
      console.log(this.item);
      // 初始化数据
      this.$nextTick(function () {
        this.form.setFieldsValue({
          planActivityAName: this.item[0].name,
          planActivityBName: this.item[1].name,
          planActivityA: this.item[0].key,
          planActivityB: this.item[1].key,
        });
      });
    },
    // 确定
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this._handleData(values);
          //console.log(values);
        }
      });
    },
    // 提交数据
    _handleData(data) {
      let param = { planId: this.$route.query.id };
      switch (data.operatorType) {
        case "least": {
          Object.assign(param, data, this.leastModel);
          console.log(this.leastModel);
          if (!this.leastModel.minTime) {
            this.$message.error("【类型】小于 后的输入框，不得为空");
            return false;
          }

          break;
        }
        case "exactly": {
          Object.assign(param, data, this.exactlyModel);
          if (!this.exactlyModel.minTime) {
            this.$message.error("【类型】等于 后的输入框，不得为空");
            return false;
          }

          break;
        }
        case "between": {
          Object.assign(param, data, this.betweenModel);
          if (!this.betweenModel.minTime || !this.betweenModel.maxTime) {
            this.$message.error("【类型】介于 后的输入框，不得为空");
            return false;
          }
          break;
        }
        default: {
          Object.assign(param, data);
        }
      }
      console.log("提交信息:", param);
      let res = this.$http.postBody("/bs/ns/planConstraintTime/add", param);
      if (res.code) return false;
      this.$message.success("添加成功!");
      this.handleCancel();
    },
    // 关闭
    handleCancel() {
      this.$emit("close");
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.time-dialog {
  .radio-group {
    .flex {
      margin-bottom: 5px;
    }
  }
  .list {
    display: flex;
    flex-direction: column;
    .ant-radio-wrapper {
      margin-bottom: 10px;
    }
  }
  .item {
    .ant-radio-wrapper {
      margin-bottom: 10px;
    }
  }
  .input-text {
    border: none;
    pointer-events: none;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>