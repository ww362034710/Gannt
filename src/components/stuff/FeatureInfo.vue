<!--添加物资 功能信息-->
<template>
    <div class="page-main page-demand-item">
        <div class="container-left" style="width: 50%">
            <div>
                <span>功能信息</span>
                <a-button type="primary" icon="plus" @click="addFeature()" style="float: right">添加功能</a-button>
            </div>
            <div style="margin-top: 50px;">
                <a-table :columns="columns" :dataSource="tblData" :pagination="false">
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="default" size="small" @click="editParam(scope)" icon="delete">编辑参数</a-button>
<!--                        <a-button type="danger" size="small" @click="remove(scope)" icon="delete">删除</a-button>-->
                    </div>
                </a-table>
            </div>
        </div>
        <div class="container-content">
            <a-form :form="featureParamForm">
                <a-form-item>
                    <span>公共参数</span>
                    <div style="float: right">
                        <a-button type="primary" icon="save" @click="updateToTable()" :disabled="!curTblRow">更新</a-button>
                    </div>
                </a-form-item>
                <a-form-item v-show="false" label="功能ID：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input v-decorator="['id', featureInfo.id]"/>
                </a-form-item>
                <a-form-item label="取值单位" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['unit', featureInfo.unit]" :options="Unit" allowClear placeholder="选择取值单位">
                        <!--<a-select-option allowClear v-for="item in unit.data" :key="item.value" :value="item.value">-->
                            <!--{{item.text}}-->
                        <!--</a-select-option>-->
                    </a-select>
                </a-form-item>
                <a-form-item label="容量取值类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['continuityType', featureInfo.continuityType]" :options="ContinuityType" allowClear placeholder="选择取值类型">
                        <!--<a-select-option allowClear v-for="item in continuityType.data" :key="item.value" :value="item.value">-->
                            <!--{{item.text}}-->
                        <!--</a-select-option>-->
                    </a-select>
                </a-form-item>
                <a-form-item label="取值范围：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input-group compact>
                        <a-input allowClear :disabled="showDetail" v-decorator="['minValue', featureInfo.minValue ]" placeholder="取值下限" style="width: 35%;" />
                        <div style="text-align: center;font-size: x-large;width: 20%">
                            ~
                        </div>
                        <a-input allowClear :disabled="showDetail" v-decorator="['maxValue', featureInfo.maxValue ]" placeholder="取值上限" style="width: 35%;"/>
                    </a-input-group>
                </a-form-item>
                <a-form-item label="取值列表：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear :disabled="showDetail" v-decorator="['enumValue', featureInfo.enumValue]" placeholder="取值列表" />
                </a-form-item>
                <a-form-item label="数量是否恢复" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-select v-decorator="['recoverableType', featureInfo.recoverableType]" :options="RecoverableType" allowClear placeholder="请选择恢复属性">
                        <!--<a-select-option allowClear v-for="item in recoverableType.data" :key="item.value" :value="item.value">-->
                            <!--{{item.text}}-->
                        <!--</a-select-option>-->
                    </a-select>
                </a-form-item>
                <a-form-item label="转换时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear :disabled="showDetail" v-decorator="['transferInterval', featureInfo.transferInterval]" placeholder="转换时间" />
                </a-form-item>
                <a-form-item label="使用时段：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear :disabled="showDetail" v-decorator="['availableTimeFrame', featureInfo.availableTimeFrame]" placeholder="输入时段" />
                </a-form-item>
            </a-form>
        </div>
        <a-modal title="选择物资功能" :maskClosable="false" @ok="handleSelectFeatureSubmit()" okText="保存" cancelText="取消"
                 v-model="selectFeatureVisible" :width="1000"
        >
            <select-feature :selected="tblData" ref="selectFeature"></select-feature>
        </a-modal>
    </div>
</template>
<script>
    import SelectFeature from "../feature/SelectFeature";
    import {recoverableType, Unit, continuityType} from "../../class/MyEnum";

    export default {
        name: "stuffFeatureInfo",
        components: { SelectFeature },
        props: {
            featureData: {
                type: Array,
                required: false,
                default: () => {
                    return [];
                }
            }

        },
        data() {
            return {
                columns: [
                    {
                        title: "功能名称",
                        dataIndex: "name",
                        width: "30%"
                    },
                    {
                        title: "功能编码",
                        dataIndex: "code",
                        width: "40%"
                    },
                    {
                        title: "操作",
                        width: "30%",
                        scopedSlots: { customRender: "action" }
                    }
                ],
                tblData: [],
                curTblRow: null,
                selectFeatureVisible: false,
                showDetail: false,
                //枚举
                // unit: Unit,
                // continuityType: continuityType,
                // recoverableType: recoverableType,
                featureParamForm: this.$form.createForm(this, {name: 'featureInfo'}),
                featureInfo: {
                    id:{
                        initialValue: null,
                        rules: []
                    },
                    unit: {
                        initialValue: null,
                        rules: []
                    },
                    continuityType: {
                        initialValue: null,
                        rules: []
                    },
                    minValue: {
                        initialValue: null,
                        rules: []
                    },
                    maxValue: {
                        initialValue: null,
                        rules: []
                    },
                    enumValue: {
                        initialValue: null,
                        rules: []
                    },
                    recoverableType: {
                        initialValue: null,
                        rules: []
                    },
                    transferInterval: {
                        initialValue: null,
                        rules: []
                    },
                    availableTimeFrame: {
                        initialValue: null,
                        rules: []
                    }

                }
            }
        },
        methods: {
            addFeature() {
                this.selectFeatureVisible = true;
            },
            editParam(scope) {
                //TODO 加载scope的参数
                if(this.id){ //如果ID存在说明是编辑

                } else { //id 不存在，说明是添加
                    this.curTblRow = scope;
                    this.featureParamForm.resetFields();
                    this.$nextTick(() => {
                        this.featureParamForm.setFieldsValue(scope);
                    })
                }
            },
            remove() {
                //TODO 从资源的关联中移出
            },
            updateToTable() {
                //TODO 将右侧form中的数据更新到左侧的table中
                this.featureParamForm.validateFields((err, value) => {
                    Object.assign(this.curTblRow, value);
                    console.log("修改后的row为：", this.curTblRow)
                });
                this.curTblRow = null;
                this.featureParamForm.resetFields();
            },
            handleSelectFeatureSubmit(){
                let original = this.tblData.filter(function (row, index, arr) {
                    if (this.indexOf(row.featureId) !== -1) return row;
                }, this.$refs.selectFeature.targetKeys);
                let result = this.$refs.selectFeature.relatedData.filter(function (row, index, arr) {
                    if (this.indexOf(row.key) !== -1 && original.map(row => {return row.featureId}).indexOf(row.key) === -1) return row

                }, this.$refs.selectFeature.targetKeys);
                console.log("选择了功能", result);
                this.tblData = original;
                if (result.length > 0) this.tblData = result.concat(original);
                this.selectFeatureVisible = false;

            }
        },
        created() {
            this.tblData = this.featureData;
        },
        watch: {
            featureData(data) {
                this.tblData = data;
            }
        }
    }
</script>
