<!--添加物资 基本信息-->
<template>
  <div>
      <a-form :form="addForm">
          <a-form-item v-show="false" label="物资ID：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-decorator="['id', {}]" />
          </a-form-item>
          <a-form-item label="物资名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['name', addFormRule.name]" placeholder="请填写物资名称" />
          </a-form-item>
          <a-form-item label="物资代号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['goodsCode', addFormRule.goodsCode]" placeholder="请填写物资代号" />
          </a-form-item>
          <a-form-item label="所属系统" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-select v-decorator="['ownerSystem', addFormRule.ownerSystem]" :options="OwnerSystem" allowClear placeholder="选择所属系统">
                  <!--<a-select-option allowClear v-for="item in ownerSystem.data" :key="item.value" :value="item.value">{{item.text}}-->
                  <!--</a-select-option>-->
              </a-select>
          </a-form-item>
          <a-form-item label="规划层级" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-select v-decorator="['planGrade', addFormRule.planGrade]" :options="PlanGrade" allowClear placeholder="选择规划层级">
                  <!--<a-select-option allowClear v-for="item in planGrade.data" :key="item.value" :value="item.value">{{item.text}}-->
                  <!--</a-select-option>-->
              </a-select>
          </a-form-item>
<!--          <a-form-item label="唯一编码：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
<!--              <a-tooltip :trigger="['focus']" placement="topLeft" overlayClassName="numeric-input">-->
<!--                  <span slot="title" class="numeric-input-title">提示：保存后不可修改</span>-->
<!--                  <a-input allowClear :disabled="showDetail" v-decorator="['id', {}]"-->
<!--                           placeholder="请输入编码"/>-->
<!--              </a-tooltip>-->
<!--          </a-form-item>-->
          <a-form-item label="批次号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['batchNo',addFormRule.batchNo]" placeholder="请填写批次号" />
          </a-form-item>
          <a-form-item label="重要等级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-select v-decorator="['importantGrade', {}]" :options="ImportantGrade" allowClear placeholder="选择重要等级">
                  <!--<a-select-option allowClear v-for="item in importantGrade.data" :key="item.value" :value="item.value">{{item.text}}-->
                  <!--</a-select-option>-->
              </a-select>
          </a-form-item>
          <a-form-item label="质量：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['mass', {}]" placeholder="请填写质量" addonAfter="千克"/>
          </a-form-item>
          <a-form-item label="体积：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['volume', {}]" placeholder="请填写体积" addonAfter="立方米"/>
          </a-form-item>
          <a-form-item label="长：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['length', {}]" placeholder="请填写长" addonAfter="米"/>
          </a-form-item>
          <a-form-item label="宽：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['width', {}]" placeholder="请填写宽" addonAfter="米"/>
          </a-form-item>
          <a-form-item label="高：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['height', {}]" placeholder="请填写高" addonAfter="米"/>
          </a-form-item>
          <a-form-item label="物质形态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['physicalForm', {}]" placeholder="请填写物质形态"/>
          </a-form-item>
          <a-form-item label="功耗：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['power', {}]" placeholder="请填写功耗"/>
          </a-form-item>
      </a-form>
  </div>
</template>

<script>

    export default {
        name: "goodsAddBasicInfo",
        props: {
            goodsModel: {
                type: Object,
                required: false
            }
        },
        data() {
            return {
                showDetail: false,
                addForm: this.$form.createForm(this, { name: "addFormData" }),
                addFormRule: {
                   name: {
                       initialValue: "",
                       rules: [
                           {
                               required: true,
                               message: "必填"
                           },
                           {
                               min: 2,
                               message: "最小长度2"
                           },
                           {
                               max: 30,
                               message: "最大长度30"
                           }
                       ]
                   },
                   goodsCode:{
                       initialValue: "",
                       rules: [
                           {
                               required: true,
                               message: "必填"
                           }
                       ]
                   },
                    ownerSystem: {
                        initialValue: null,
                        rules: [{
                            required: true,
                            message: '必选'
                        }]
                    },
                    planGrade: {
                        initialValue: null,
                        rules: [{
                            required: true,
                            message: '必选'
                        }]
                    },
                    batchNo:{
                        initialValue: "",
                        rules: [
                            {
                                required: true,
                                message: "必填"
                            }
                        ]
                    },
               },
                // ownerSystem: OwnerSystem,
                // planGrade: PlanGrade,
                // importantGrade: ImportantGrade,
            }
        },
        created() {
            this.$nextTick(() => {
                this.addForm.setFieldsValue(this.goodsModel);
            })
        },
        watch: {
            goodsModel(data) {
                this.addForm.setFieldsValue(data);
            }
        }
    }
</script>
<style>

</style>
