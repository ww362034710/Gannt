<template>
    <div class=''>
        <a-form-model :form="addForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" :rules="addFormRule">
            <a-form-model-item label="标题：" prop="title">
                <a-input placeholder="请输入标题" v-model="addForm.title" />
            </a-form-model-item>

            <a-form-model-item label="优先级：">
                <a-select v-model="addForm.importance" v-decorator="['importance']" placeholder="请选择优先级" :options="this.importanceList"/>
            </a-form-model-item>
            <a-form-model-item label="版本：">
                <a-input v-model="addForm.edition" v-decorator="['edition', { rules: [{ required: true, message: '版本' }] }]" placeholder="请输入版本"/>
            </a-form-model-item>
            <a-form-model-item label="期望开始时间：">
                <a-textarea v-model="addForm.expectStartTime" v-decorator="['expectStartTime']" placeholder="期望开始时间"/>
            </a-form-model-item>

            <a-form-model-item label="持续时间：">
                <a-input v-model="addForm.expectDuration" v-decorator="['expectDuration', { rules: [{ required: true, message: '持续时间' }] }]" placeholder="请输入持续时间"/>
            </a-form-model-item>
            <a-form-model-item label="预计结束时间">
                <a-textarea v-model="addForm.expectEndTime" v-decorator="['expectEndTime']" placeholder="预计结束时间" />
            </a-form-model-item>
            <a-form-model-item label="内容">
                <a-textarea v-model="addForm.resourceDemand" v-decorator="['resourceDemand']" placeholder="请输入资源/物资需求" />
            </a-form-model-item>

            <a-form-model-item label="关联事件">
                <a-select :option="[]" v-decorator="['event']" placeholder="请选择"/>
            </a-form-model-item>
            <a-form-model-item label="任务目标">
                <a-select :option="[]" v-decorator="['goal']" placeholder="请选择"/>
            </a-form-model-item>
            <a-form-model-item label="运行阶段">
                <a-select :option="[]" v-decorator="['operatingPhase']" placeholder="请选择"/>
            </a-form-model-item>
            <a-form-model-item label="责任单位">
                <a-select :option="[]" v-decorator="['responsibleUnit']" placeholder="请选择"/>
            </a-form-model-item>

        </a-form-model>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            data: {},
            addForm: {
                title: "",
                importance: "",
                edition: "",
                expectStartTime: "",
                expectDuration: "",
                expectEndTime: "",
                content: "",
                resourceDemand: "",
                //parentName: "",
                id: "",
            },
            form: this.$form.createForm(this, { name: 'addForm' }),
            addFormRule: {
                title: {
                    rules: [{
                        required: true,
                        message: '请输入标题'
                    }]
                },

            },
            importanceList: [
                { value: 1, label: "一级" },
                { value: 2, label: "二级" },
                { value: 3, label: "三级" },
                { value: 4, label: "四级" }
            ],
            planGrade: [
                { value: 1, text: "短期规划" },
                { value: 2, text: "长期规划" },
                { value: 3, text: "飞行任务" },
                { value: 4, text: "月事件规划" }
            ],
        };
    },
    computed: {},
    watch: {
        addForm: {
            handler() {
                this.$emit('setBasicForm', this.data);
            },
            deep: true,

        }
    },
    methods: {
        //初始化表单值
        setFormData(data) {
            this.data = data;
            this.addForm = this.data.data.entity;
            this.addForm.parentName = data.parentName || "上级名称"
        },
        checkData(values) {
            let _that = this;
            return new Promise((resolve, reject) => {
            _that.addForm.validateFields((err, values) => {
                if (!err) {
                    console.log("数据：" + JSON.stringify(values));
                    resolve(values);
                } else {
                    console.log("出错了");
                    reject("请填写必填选项",values);
                }
            });
            }).catch(()=>console.log("有异常！"));
        }

    },
    created() {

    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
</style>
