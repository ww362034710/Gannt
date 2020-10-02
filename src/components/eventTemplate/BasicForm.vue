<template>
    <a-form :form="addForm" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item label="id:"  v-show="false">
            <a-input v-decorator="['id']"/>
        </a-form-item>
        <a-form-item label="事件名称：">
            <a-input v-decorator="['name', addFormRule.name]" placeholder="请填写名称"/>
        </a-form-item>
        <a-form-item label="唯一编码：">
            <a-row type="flex" justify="space-between">
                <a-col :span="20">
                    <a-input placeholder="点击生成功能编码" allowClear v-decorator="['code', addFormRule.code]"/>
                </a-col>
                <a-col :span="4" style="text-align:right">
                    <a-button @click="getCoding()" icon="codepen">生成</a-button>
                </a-col>
            </a-row>

        </a-form-item>

        <a-form-item label="所属系统：">
            <a-select placeholder="请选择所属系统" v-decorator="['ownerSystem',addFormRule.ownerSystem]" :options="this.OwnerSystem">
               <!-- <a-select-option v-for="item in ownerSystemData" :key="item.value" :value="item.value">
                    {{item.text}}
                </a-select-option>-->
            </a-select>
        </a-form-item>
        <a-form-item label="任务目标：">
            <a-select v-decorator="['taskCabin',addFormRule.taskCabin]" placeholder="请选择任务目标" :options="this.taskCabinData">
            </a-select>
        </a-form-item>
        <a-form-item label="运行阶段：">
            <a-select v-decorator="['runPhase',addFormRule.runPhase]" placeholder="请选择运行阶段" :options="this.runPhaseData">

            </a-select>
        </a-form-item>

        <a-form-model-item ref="duration" label="持续时间" prop="duration">
            <a-input v-decorator="['duration', addFormRule.duration]"  type="number" placeholder="请填写持续时间"/>
        </a-form-model-item>
        <a-form-item label="责任单位：">
            <a-select mode="multiple" v-decorator=" ['responseOrgs',addFormRule.responseOrgs]"
                      placeholder="请选择责任单位" :options ="this.responseOrgsData">
            </a-select>
        </a-form-item>
        <a-form-item label="优先级：">
            <a-select v-decorator="['priority',addFormRule.priority]" placeholder="请选择优先级" :options="this.PriorityLevel">
            </a-select>
        </a-form-item>

        <a-form-item label="描述">
            <a-textarea v-decorator="['description',addFormRule.description]" placeholder="请输入事件描述">

            </a-textarea>
        </a-form-item>

    </a-form>
</template>
<script>
    export default {
        name: "eventTemplateBasicForm",
        props: {
            eventTemplate: {
                type: Object,
                required: false
            }
        },
        data() {
            return {
                addForm: this.$form.createForm(this, {name: "addForm"}),
                addFormRule: {
                    name: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    code: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    ownerSystem: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    taskCabin: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    runPhase: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    duration:{
                        rules:[{required: true}]
                    },
                    responseOrgs: {initValue:[]},
                    priority: {rules: [{
                            required: true,
                            message: "必填"
                        }]},
                    description: {},
                },
            }
        },
        methods: {
            //生成编码
            getCoding() {
                this.addForm.setFieldsValue({
                    code: (Math.random() * (36 - 1) + 1).toString(36).substr(3, 4)
                });
            },
        },
        created() {
            /*初始化初始化数据*/
            this.$nextTick(() => {
                this.addForm.setFieldsValue(this.eventTemplate);
            })
        },
        watch: {
            /*监听实体类的变化 设置基础数据*/
            eventTemplate(data) {
                //处理一下责任单位
                let responseOrgs = data.responseOrgs
                if(responseOrgs!=null){
                    data.responseOrgs= responseOrgs.split(",");
                }
                this.addForm.setFieldsValue(data);
            }
        }
    }
</script>
