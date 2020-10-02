<!--添加物资 基本信息-->
<template>
  <div>
      <a-form :form="addForm">
          <a-form-item v-show="false" label="物资ID：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input v-decorator="['id', {}]" />
          </a-form-item>
          <a-form-item label="资源名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['name', addFormRule.name]" placeholder="请填写物资名称" />
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
          <a-form-item label="用户数量：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-input allowClear :disabled="showDetail" v-decorator="['meanwhileEventLimit', {}]" placeholder="请填写可同时使用用户数量" />
          </a-form-item>
      </a-form>
  </div>
</template>

<script>

    export default {
        name: "resourceAddBasicInfo",
        props: {
            resourceModel: {
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
                    }
               },
                // ownerSystem: OwnerSystem,
                // planGrade: PlanGrade,
                // importantGrade: ImportantGrade,
            }
        },
        created() {
            this.$nextTick(() => {
                this.addForm.setFieldsValue(this.resourceModel);
            })
        },
        watch: {
            resourceModel(data) {
                this.addForm.setFieldsValue(data);
            }
        }
    }
</script>
<style>

</style>
