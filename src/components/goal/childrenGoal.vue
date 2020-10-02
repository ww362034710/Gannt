<template>
    <div class=''>
        <a-form :form="addForm">
            <a-form-item v-show="false">
                <a-input allowClear v-decorator="['uid', {}]" />
            </a-form-item>
            <a-form-item label="目标名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear v-decorator="['name', addFormRule.name]" placeholder="请填写目标名称" />
            </a-form-item>
            <a-form-item label="实验类别：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear v-decorator="['testKind', addFormRule.testKind]" placeholder="请填写实验类别" />
            </a-form-item>
            <a-form-item label="重要等级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <!--                <a-input-->
                <!--                        allowClear-->
                <!--                        v-decorator="['importantGrade', addFormRule.importantGrade]"-->
                <!--                        placeholder="请填写重要等级"-->
                <!--                />-->
                <a-select v-decorator="['importantGrade',addFormRule.importantGrade]" placeholder="选择重要等级">
                    <a-select-option allowClear v-for="item in importantGrade" :key="item.value" :value="item.value">{{item.text}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="规划层级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <!--                <a-input-->
                <!--                        allowClear-->
                <!--                        v-decorator="['planGrade', addFormRule.planGrade]"-->
                <!--                        placeholder="请填写规划层级"-->
                <!--                />-->
                <a-select v-decorator="['planGrade',addFormRule.planGrade]" placeholder="选择类型">
                    <a-select-option allowClear v-for="item in planGrade" :key="item.value" :value="item.text">{{item.text}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="提出机构：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear v-decorator="['submittingAgency', addFormRule.submittingAgency]" placeholder="请填写提出机构" />
            </a-form-item>
            <a-form-item label="描述：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-textarea style="height: 160px" allowClear v-decorator="['description', addFormRule.description]" placeholder="请填写描述" />
            </a-form-item>
        </a-form>
    </div>
</template>

<script>

export default {
    components: {},
    props: {
        showDetail: Boolean,
        type: Boolean,//标识 true 主页新增 false 添加需求

    },
    data() {
        return {
            addForm: this.$form.createForm(this, { name: "addFormData" }),    // 编辑文档的表单组件
            addFormRule: {
                name: {
                    initialValue: "",
                    rules: [
                    ]
                },
                textKind: {
                    initialValue: "",
                    rules: [{ required: true, message: "请填写实验类别" }]
                },
                planGrade: {
                    rules: [{ required: true, message: "请填写规划层级" }]
                },

                parentId: {
                },
                submittingAgency: {
                    initialValue: "",
                    rules: [{ required: true, message: "请填写提出机构" }]
                },
                description: {
                    rules: [{ required: false }]
                },
                rootId: {},
                resolveSchemeId: {}
            },
            importantGrade: [
                { value: 1, text: "重大目标" },
                { value: 2, text: "重要目标" },
                { value: 3, text: "普通目标" },
                { value: 4, text: "一般目标" }
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
    watch: {},
    methods: {
        getChildrenData() {
            return new Promise((resolve, reject) => {
                this.addForm.validateFields((err, values) => {
                    if (!err) {
                        console.log("数据：" + JSON.stringify(values));
                        resolve(values);

                    } else {
                        reject(false);
                    }
                });

            });
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