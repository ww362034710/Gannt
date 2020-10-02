<!--场景参数初始化-->
<!--TODO 这部分有待商榷,这些参数可能是从态势取-->
<template>
    <a-form :form="form">
        <a-table :columns="columns" :rowKey="col => col.id" :dataSource="tblData" size="small" :pagination="false">
            <a-form-item style="margin-bottom:0" :label-col="{ xs: { span: 0 }, sm: { span: 0 } }" :wrapper-col="{ xs: { span: 24 }, sm: { span: 24 } }"
                         slot="value" :validate-status="getFildStatus(index,'value').validateStatus"
                         :help="getFildStatus(index,'value').errorMsg" slot-scope="text, record, index">
                <a-input style="width: 100%" allowClear v-model="record.value" @change="handleChange(record.value, index,'value')" />
            </a-form-item>
        </a-table>
    </a-form>
</template>
<script>
    export default {
        name: "paramInit",
        data() {
            return {
                form: this.$form.createForm(this),
                columns: [
                    {title: '所属系统', dataIndex: 'ownerSystem', align: 'center'},
                    {title: '参数名称', dataIndex: 'name', align: 'center'},
                    {title: '参数值', dataIndex: 'value', align: 'center', scopedSlots: {customRender: 'value'}}
                ],
                tblData: [
                    { ownerSystem: "AST系统", name: '航天员人数', id: '1' },
                    { ownerSystem: "AST系统", name: '能否进行舱外活动', id: '2' },
                    { ownerSystem: "AST系统", name: '具备生物学知识', id: '3' },
                    { ownerSystem: "AST系统", name: '普通睡眠时长', id: '4' },
                    { ownerSystem: "AST系统", name: '高负责下睡眠时长', id: '5' },
                    { ownerSystem: "AST系统", name: '基础功耗', id: '6' },
                    { ownerSystem: "平台系统", name: '姿态调整角速度', id: '7' },
                    { ownerSystem: "平台系统", name: '太阳能板默认功率', id: '8' },
                    { ownerSystem: "平台系统", name: '推进力', id: '9' },
                    { ownerSystem: "平台系统", name: '储物空间', id: '10' }
                ],
                tblRules: []
            }
        },
        methods: {
            getFildStatus(index, key) {
                const data = this.tblRules.find(item => index === item.index && key === item.key)
                if (data) {
                    return data
                } else {
                    return {
                        errorMsg: '',
                        validateStatus: 'success'
                    }
                }
            },
            handleChange(value, index, key) {
                const target = this.tableData.find((item, i) => i === index)
                if (target) {
                    const { errorMsg, validateStatus } = this.validatePrimeNumber(value)
                    let rulesIndex = this.tblRules.length > 0 ? this.tblRules.findIndex(v => v.index === index && v.key === key) : -1;
                    let data = {
                        index: index,
                        key,
                        errorMsg,
                        validateStatus
                    }
                    if (rulesIndex !== -1) {
                        if (validateStatus === 'error')
                            this.$set(this.tblRules, rulesIndex, data)
                        else this.tblRules.splice(rulesIndex, 1)
                    } else {
                        if (validateStatus !== 'success' )
                            this.tblRules.push(data);
                    }
                }
                console.log("当前rules为：", this.tblRules);
            },
            //功能参数表格验证
            validatePrimeNumber(value) {
                return {
                    validateStatus: value === null || value === '' ? 'error' : 'success',
                    errorMsg: value === null || value === '' ? '必填' : '',
                };
            },
        }
    }
</script>