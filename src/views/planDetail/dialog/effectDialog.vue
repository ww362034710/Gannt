<template>
    <a-modal
            title="新增影响"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            width="1000px"
    >
        <a-form :form="form" autocomplete="off">
            <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
                <a-input
                        v-decorator="['name',{ rules: [{ required: true, message: '请输入名称' }] }]"
                        placeholder="请输入名称"
                />
            </a-form-item>
            <a-form-item label="资源" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
                <a-select v-decorator="['planResourceId']" placeholder="请选择资源">
                    <a-select-option
                            v-for="item in resourceList"
                            :key="item.id"
                            :value="item.id"
                    >{{item.name}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <div class="flex">
                <a-form-item label="开始偏移量" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
                    <a-input v-decorator="['startOffset',{ initialValue:'START,P0D' }]" placeholder="请输入开始偏移量"/>
                </a-form-item>
                <a-form-item label="结束偏移量" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
                    <a-input v-decorator="['endOffset',{ initialValue:'END,P0D' }] " placeholder="请输入结束偏移量"/>
                </a-form-item>
            </div>
            <div class="flex">
                <a-form-item label="开始时影响" :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
                    <a-input v-decorator="['startEffect']" placeholder="支持表达式"/>
                </a-form-item>
                <a-form-item label="结束时影响" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
                    <a-input v-decorator="['endEffect']" placeholder="支持表达式"/>
                </a-form-item>
            </div>
            <a-form-item label="计算模式" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
                <a-select v-decorator="['mode']" placeholder="选择计算模式">
                    <a-select-option
                            v-for="item in modeList"
                            :key="item.dictValue"
                            :value="item.dictValue"
                    >{{item.dictLabel}}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
                <a-textarea v-decorator="['description']" placeholder="请输入描述"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    export default {
        name: "effectDialog",
        data() {
            return {
                visible: false, // 是否显示dialog
                confirmLoading: false, //是否正在加载
                form: this.$form.createForm(this, {name: "addEffect"}),
                resourceList: [],
                modeList: []
            };
        },
        props: {
            show: {
                //是否显示dialog
                type: Boolean,
                default: false,
            },
            effect: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            planActivityId: {
                type: String,
                default: null
            }
        },
        watch: {
            show: {
                immediate: true,
                handler: function (v) {
                    this.visible = v;
                },
            },
        },
        methods: {
            // 确定
            handleOk(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this._handleData(values);
                        console.log(values);
                    }
                });
            },
            // 提交数据
            async _handleData(data) {
                let param = Object.assign({}, data, {planId: this.$route.query.id, planActivityId: this.planActivityId})
                let rst = await this.$http.postBody("/bs/ns/plan/effect/add", param);
                if (rst.code) {
                    this.$message.error(rst.msg);
                } else {
                    this.$message.success("添加成功!")
                    this.handleCancel();
                }
            },
            // 关闭
            handleCancel() {
                this.$emit("close");
                this.visible = false;
            },
            async _initData() {
                // 资源列表
                {
                    let res = await this.$http.get("/bs/ns/plan/resource/list/" + this.$route.query.id);
                    if (res.code) return false;
                    this.resourceList = res.data;
                }
                // 计算模式列表
                {
                    let res = await this.$http.get(
                        "/system/dict/data/list/ns_calculate_mode"
                    );
                    if (res.code) return false;
                    this.modeList = res.data;
                }
            }
        },
        created() {
            this._initData();
        }
    };
</script>

<style lang="scss" scoped>
    .flex {
        display: flex;

        .ant-form-item {
            width: 50%;
        }
    }
</style>