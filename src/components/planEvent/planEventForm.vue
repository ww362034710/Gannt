<template>
  <a-form-model
    :model="addForm"
    ref="addForm"
    :class="formClass"
    :rules="addFormRule"
    :label-col="{ span: 4 }"
    :form="form"
    :wrapper-col="spanCol"
    v-show="$parent.curStep == 1 || forceShow"
  >
    <a-form-model-item ref="name" label="事件名称" prop="name">
      <a-input v-model="addForm.name" placeholder="请填写名称" />
    </a-form-model-item>
    <a-form-model-item ref="ownerSystem" label="所属系统：" prop="ownerSystem">
      <a-input v-model="addForm.ownerSystem" placeholder="请输入子系统" />
    </a-form-model-item>

    <a-form-model-item ref="startTime" label="开始时间：" prop="startTime">
      <a-date-picker v-model="addForm.startTime" placeholder="请选择开始时间" />
    </a-form-model-item>

    <a-form-model-item ref="duration" label="持续时间" prop="duration">
      <a-input v-model="addForm.duration" placeholder="请填写持续时间" />
    </a-form-model-item>

    <a-form-model-item ref="endTime" label="结束时间：" prop="endTime">
      <a-date-picker v-model="addForm.endTime" placeholder="请选择结束时间" />
    </a-form-model-item>

    <a-form-model-item ref="description" label="描述" prop="description">
      <a-textarea v-model="addForm.description" placeholder="请输入事件描述"></a-textarea>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import moment from "moment";
export default {
  name: "planeventsForm",
  data() {
    return {
      addForm: {
        name: "",
        ownerSystem: "",
        startTime: moment(),
        duration: null,
        endTime: moment(),
        description: "",
      },
      form: this.$form.createForm(this, { name: "planevents" }),
      addFormRule: {
        name: [
          {
            required: true,
            message: "必填",
          },
          {
            min: 2,
            message: "最小长度2",
          },
          {
            max: 20,
            message: "最大长度20",
          },
        ],
        ownerSystem: [
          {
            required: true,
            message: "必填",
          },
        ],
        duration: [
          {
            required: true,
            message: "必填",
          },
        ],
        startTime: [
          {
            required: true,
            message: "必填",
          },
        ],
        endTime: [
          {
            required: true,
            message: "必填",
          },
        ],
      },
    };
  },
  props: {
    formClass: {
      type: String,
      default: ""
    },
    spanCol:{
      type:Object,
      default() {
        return {span: 20};
      },
    },
    forceShow:{
      type:Boolean,
      default: false
    }
  },
  watch: {
    addForm: {
      handler(value) {
        this.$emit("setBasicForm", value);
      },
      deep: true,
    }
  },
  computed: {

  },
  methods: {
    //生成编码
    getCoding() {
      this.addForm.code = (Math.random() * (36 - 1) + 1)
        .toString(36)
        .substr(3, 4);
    },
    //初始化表单值
    setFormData(data) {
      this.addForm = Object.assign({}, this.$options.data().addForm);
      // this.$options.data().addForm 相当于 this.addForm
      this.addForm = data.data.entity;
      /* for (let item in this.addForm) {
                this.addForm[item] = data.data.entity[item]
            }*/
    },
    // 提交数据
    submit(e) {
      if(e) e.preventDefault();
      return new Promise((resolve, reject) => {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            resolve(this.addForm);
          } else {
            reject();
          }
        });
      });
    },
  },
};
</script>
