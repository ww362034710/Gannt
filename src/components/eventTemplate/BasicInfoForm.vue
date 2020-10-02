<template>
    <a-form-model :model="addForm" ref="addForm" :rules="addFormRule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">

        <a-form-model-item ref="name" label="事件名称" prop="name">
            <a-input v-model="addForm.name" placeholder="请填写名称" />
        </a-form-model-item>

        <a-form-model-item ref="code" label="唯一编码:" prop="code">
            <a-row type="flex" justify="space-between">
                <a-col :span="20">
                    <a-input placeholder="点击生成功能编码" allowClear v-model="addForm.code" />
                </a-col>
                <a-col :span="4" style="text-align:right">
                    <a-button @click="getCoding()" icon="codepen">生成</a-button>
                </a-col>
            </a-row>
        </a-form-model-item>

        <a-form-model-item ref="ownerSystem" label="所属系统：" prop="ownerSystem">
            <a-select placeholder="请选择所属系统" v-model="addForm.ownerSystem" :options="this.OwnerSystem" ></a-select>
        </a-form-model-item>

        <a-form-model-item ref="taskCabin" label="任务目标：" prop="taskCabin">
            <a-select v-model="addForm.taskCabin" placeholder="请选择任务目标" :options="this.taskCabinData">
            </a-select>
        </a-form-model-item>

        <a-form-model-item ref="runPhase" label="运行阶段：" prop="runPhase">
            <a-select v-model="addForm.runPhase" placeholder="请选择运行阶段" :options="this.runPhaseData">
            </a-select>
        </a-form-model-item>
        <a-form-model-item ref="duration" label="持续时间" prop="duration">
            <a-input v-model="addForm.duration"  type="number" placeholder="请填写持续时间"/>
        </a-form-model-item>

        <a-form-model-item ref="responseOrgs" label="责任单位：" prop="responseOrgs">
            <a-select mode="multiple" v-model="addForm.responseOrgs" placeholder="请选择责任单位" :options="this.responseOrgsData" >
            </a-select>
        </a-form-model-item>

        <a-form-model-item ref="priority" label="优先级：" prop="priority">
            <a-select v-model="addForm.priority" placeholder="请选择优先级" :options="this.PriorityLevel">
            </a-select>
        </a-form-model-item>

        <a-form-model-item ref="description" label="描述" prop="description">
            <a-textarea v-model="addForm.description" placeholder="请输入事件描述"> </a-textarea>
        </a-form-model-item>

    </a-form-model>
</template>
<script>
export default {
    name: "eventTemplateBasicInfoForm",
    data() {
        return {
            addForm: {
                name: "",
                code: "",
                ownerSystem: "",
                taskCabin: "",
                runPhase: "",
                duration:"",
                responseOrgs: [],
                priority: "",
                description: ""
            },
            addFormRule: {
                name: [{
                    required: true,
                    message: "必填"
                }, {
                    min: 2,
                    message: "最小长度2"
                }, {
                    max: 20,
                    message: "最大长度6"
                }],
                code: [{
                    required: true,
                    message: "必填"
                }],
                ownerSystem: [{
                    required: true,
                    message: "必填"
                }],
            }
        }
    },
    watch: {
        addForm: {
            handler(value) {
                this.$emit('setBasicForm', value)
            },
            deep: true
        }
    },
    computed: {

    },
    methods: {
        //生成编码
        getCoding() {
            this.addForm.code = (Math.random() * (36 - 1) + 1).toString(36).substr(3, 4)
        },
        //初始化表单值
        setFormData(data) {
            this.addForm = Object.assign({}, this.$options.data().addForm);
            let responseOrgs = data.data.entity.responseOrgs;
            if(responseOrgs!=null){
                if(!(responseOrgs instanceof Array)){
                    data.data.entity.responseOrgs= responseOrgs.split(",");
                }
            }
            this.addForm = data.data.entity;
            //处理一下责任单位
        },
    }
}
</script>
