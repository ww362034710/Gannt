<template>
    <div>
        <a-form :form="addForm">
            <a-form-item v-show="false">
                <a-input allowClear v-decorator="['id', {}]"/>
            </a-form-item>
            <a-form-item label="场景名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input
                        allowClear
                        v-decorator="['name', addFormRule.name]"
                        placeholder="请填写场景名称"
                />
            </a-form-item>
            <a-form-item label="场景类型：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-select v-decorator="['planGrade', addFormRule.planGrade]" placeholder="请选择场景类型">
                    <a-select-option
                            allowClear
                            v-for="item in typeData"
                            :key="item.value"
                            :value="item.value"
                    >{{item.str}}
                    </a-select-option>
                </a-select>
            </a-form-item>
<!--            <a-form-item label="规划层级" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-select v-decorator="['planGrade', {}]" placeholder="选择规划层级">
                    <a-select-option allowClear v-for="item in ImportantGrade" :key="item.value" :value="item.value">{{item.text}}
                    </a-select-option>
                </a-select>
            </a-form-item>-->
            <a-form-item label="开始时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-date-picker
                        allowClear
                        v-decorator="['beginTime', addFormRule.beginTime]"
                />
            </a-form-item>
            <a-form-item label="结束时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-date-picker
                        allowClear
                        v-decorator="['endTime', addFormRule.endTime]"
                />
            </a-form-item>
<!--            <a-form-item label="状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
<!--                <a-select v-decorator="['state',{}]" placeholder="请选择状态">-->
<!--                    <a-select-option allowClear v-for="item in stateData" :key="item.value" :value="item.value">{{item.str}}</a-select-option>-->
<!--                </a-select>-->
<!--            </a-form-item>-->
            <a-form-item label="场景负责人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-input
                        allowClear
                        v-decorator="['managerId', addFormRule.managerId]"
                        placeholder="请填写场景负责人"
                />
            </a-form-item>
            <a-form-item label="场景说明：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-textarea
                        allowClear
                        v-decorator="['description', addFormRule.description]"
                        placeholder="请填写场景说明"
                />
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
    import {sceneType, /*sceneStateType*/} from "@/utils/Enum.js";
    export default {
        name: "sceneBasicInfo",
        data() {
            return {
                addForm: this.$form.createForm(this, { name: "sceneBasicInfoForm" }),   // 编辑文档的表单组件
                addFormRule: {
                    name: {
                        initialValue: null,
                        rules: [
                            {
                                required: true,
                                message: '必填'
                            }
                        ]
                    },
                    planGrade: {
                        initialValue: undefined,
                        rules: [{
                            required: true,
                            message: '必选'
                        }]
                    },
                    beginTime: {
                        initialValue: undefined,
                        rules: [{
                            required: true,
                            message: '必填'
                        }]
                    },
                    endTime: {
                        initialValue: undefined,
                        rules: [{
                            required: true,
                            message: '必填'
                        },{
                            //校验结束时间不能早于开始时间
                            validator: this.handleTimeValidator,
                        }]
                    },
                    managerId: {
                        initialValue: null,
                        rules: [
                        ]
                    },
                    description: {
                        initialValue: null,
                        rules: [
                        ]
                    },
                    protoSceneId: {
                        initialValue: null,
                        rules: [
                        ]
                    },
                },
                typeData: sceneType,
                // stateData: sceneStateType,
                planGrade: [
                    {value: "中期规划", text: "中期规划"},
                    {value: "飞行任务", text: "飞行任务"},
                    {value: "月事件", text: "月事件"}
                ]
            }
        },
        methods: {
            handleTimeValidator(rule, endTime, callback) {
                let beginTime = this.addForm.getFieldValue("beginTime");
                if (endTime < beginTime) callback("结束时间不能早于开始时间!");
                callback();
            }
        }
    }
</script>
