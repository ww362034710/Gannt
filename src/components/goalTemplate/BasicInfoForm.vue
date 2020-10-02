<template>
    <div class=''>
        <a-form-model :form="addForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-form-model-item label="名称：">
                <a-input placeholder="请输入名称" allowClear v-model="addForm.name" />
            </a-form-model-item>
            <a-form-model-item label="实验类别：">
                <a-select placeholder="请选择实验类别" v-model="addForm.testKind" :options="this.testKindData">
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="提出机构：">
                <a-select v-model="addForm.submittingAgency" placeholder="请选择提出机构" :options="this.submittingAgencyData">
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="规划层级：">
                <a-select  v-model="addForm.planGrade" placeholder="请选择规划层级" :options="this.PlanGrade">
                </a-select >
            </a-form-model-item>
            <a-form-model-item label="重要等级：">
                <a-select v-model="addForm.importantGrade" placeholder="重要等级" :options="this.ImportantGrade">
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="描述">
                <a-textarea v-model="addForm.description" placeholder="请输入任务描述"></a-textarea>
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
                    parentName: "",
                    name: "",
                    id: "",
                    testKind: "",
                    planGrade: "",
                    submittingAgency: [],
                    importantGrade: "",
                    description: "",
                }
            };
        },
        computed: {},
        watch: {
            addForm: {
                handler() {
                    this.$emit('setBasicForm', this.data)
                },
                deep: true
            }
        },
        methods: {
            //初始化表单值
            setFormData(data) {
                this.data = data;
                this.addForm = this.data.data.entity;
                this.addForm.parentName = data.parentName || "上级名称"
            },

        },
        created() {

        },
        mounted() {

        },
    }
</script>
<style lang='scss' scoped>
</style>
