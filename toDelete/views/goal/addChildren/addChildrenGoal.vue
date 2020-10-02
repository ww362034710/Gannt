<template>
    <div class="page-main ">
            <a-form :form="addForm">
                <a-form-item label="上级目标：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['name', addFormRule.name]"
                            placeholder="请填写目标名称"
                    />
                </a-form-item>
                <a-form-item v-show="false">
                    <a-input allowClear v-decorator="['id', {}]"/>
                </a-form-item>
                <a-form-item label="目标名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['name', addFormRule.name]"
                            placeholder="请填写目标名称"
                    />
                </a-form-item>
                <a-form-item label="实验类别：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['testKind', addFormRule.testKind]"
                            placeholder="请填写实验类别"
                    />
                </a-form-item>
                <a-form-item label="重要等级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['importantGrade',addFormRule.importantGrade]" placeholder="选择等级">
                        <a-select-option allowClear v-for="item in importantGrade" :key="item.value" :value="item.value">{{item.text}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="规划层级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['planGrade', addFormRule.planGrade]"
                            placeholder="请填写规划层级"
                    />
                </a-form-item>
                <a-form-item label="提出机构：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input
                            allowClear
                            v-decorator="['createPerson', addFormRule.submittingAgency]"
                            placeholder="请填写提出机构"
                    />
                </a-form-item>
            </a-form>
    </div>
</template>

<script>
    export default {
        name: "addChildrenGoal",
        data(){
            return{
                addForm: null,    // 编辑目标的表单组件
                addFormData: {},  //
                addFormRule: {
                    name: {
                        initialValue: "",
                        rules: [
                        ]
                    },
                    testKind: {
                        initialValue: "",
                        rules: [
                        ]
                    },
                    importantGrade: [
                        { value: 1, text: "重大目标" },
                        { value: 2, text: "重要目标" },
                        { value: 3, text: "普通目标" },
                        { value: 4, text: "一般目标" }
                    ],
                    planGrade: {
                        initialValue: "",
                        rules: [
                        ]
                    },
                    submittingAgency:{

                    },
                    createPerson: {
                        initialValue: "",
                        rules: [
                        ]
                    },
                    updatePerson: {
                        initialValue: "",
                        rules: [
                        ]
                    },
                    mark: {
                        initialValue: "",
                        rules: [
                        ]
                    },

                },
                addModelVisible: false,
                confirmLoading: false,            //添加稳定保存 loading
                showDetail: false,                //编辑  详情 标识
            };
        },
        methods:{
            addGoalChildren(value) {
                debugger;
                // return this.$http.postBody("/bs/deprecated/goal/add", this.$refs.GoalChildren.addForm.values).then(() => {
                //     resolve('成功')
                // }).catch(() => {
                //     reject(false)
                // });
                 console.log(value);
                            console.log("数据：" + JSON.stringify(value));
                            this.$http.postBody("/bs/deprecated/goal/add", value).then(() => {

                            }).catch(() => {

                            });
            },
        }
    }
</script>

<style scoped>

</style>