<template>
    <div class=''>
        <a-form :form="addForm">
            <a-form-item v-show="false" label="文档名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input v-decorator="['uid', {}]" />
            </a-form-item>

            <a-form-item label="文档名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear :disabled="showDetail" v-decorator="['name', addFormRule.name]" placeholder="请填写文档名称" />
            </a-form-item>

            <a-form-item label="标识前缀" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear :disabled="showDetail" v-decorator="['tagPrefix', addFormRule.tagPrefix]" placeholder="请填写标识前缀" />
            </a-form-item>

            <a-form-item label="文档类型：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-select v-decorator="['docType',addFormRule.docType]" placeholder="选择类型">
                    <a-select-option allowClear v-for="item in docTypeData" :key="item.value" :value="item.value">{{item.text}}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="主管部门：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear v-decorator="['deptId', addFormRule.deptId]" placeholder="请填写主管部门" />
            </a-form-item>

            <a-form-item label="负责人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input allowClear :disabled="showDetail" v-decorator="['manager', addFormRule.manager]" placeholder="请填写负责人" />
            </a-form-item>
            <a-form-item label="备注：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-textarea allowClear :disabled="showDetail" v-decorator="['comm', addFormRule.comm]" placeholder="请填写备注" :rows="4" />
            </a-form-item>
        </a-form>
    </div>
</template>

<script>

export default {
    components: {},
    props: {
        showDetail: Boolean,
        type: Boolean//标识 true 主页新增 false 添加需求
    },
    data() {
        return {
            addForm: this.$form.createForm(this, { name: "addFormData" }),    // 编辑文档的表单组件
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
                tagPrefix: {
                    initialValue: "",
                    rules: [{ required: true, message: "请填写标识前缀" }]
                },
                docType: {
                    initialValue: 100,
                    rules: [{ required: true, message: "请选择文档类型" }]
                },
                deptId: {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入主管部门" }]
                },
                manager: {
                    initialValue: "",
                    rules: [
                        {
                            required: true,
                            message: "请填写负责人"
                        },
                        {
                            min: 6,
                            message: "最小长度6"
                        },
                        {
                            max: 10,
                            message: "最大长度10"
                        }
                    ]
                },
                comm: {
                    initialValue: ""
                }
            },
            docTypeData: [
                { value: 100, text: "用户需求" },
                { value: 200, text: "接口设计" }
            ],
        };
    },
    computed: {},
    watch: {},
    methods: {
    },
    created() {

    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
</style>