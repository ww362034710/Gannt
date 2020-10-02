<template>
    <div class='addRow-main'>
        <h2>功能信息</h2>
        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" @submit="handleSubmit">
            <a-form-item label="功能名称">
                <a-input placeholder="请输入功能名称" allowClear v-decorator="['name', { rules: [{ required: true, message: '请输入功能名称!' }] }]" />
            </a-form-item>

            <a-form-item label="功能编码">
                <a-row type="flex" justify="space-between">
                    <a-col :span="20">
                        <a-input placeholder="点击生成功能编码" allowClear v-decorator="['coding', { rules: [{ required: true, message: '请生成编码!' }] }]" />
                    </a-col>
                    <a-col :span="4" style="text-align:right">
                        <a-button @click="getCoding()">生成</a-button>
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item label="功能参数">
                <div style="text-align:right">
                    <a-button @click="addTblData()">添加</a-button>
                </div>
                <a-table :columns="columns" :rowKey="col => col.id" :dataSource="tableData" size="small" :pagination="false">
                    <a-form-item style="margin-bottom:0" slot="paramName" :validate-status="getFildStatus(record.id,'paramName').validateStatus" :help="getFildStatus(record.id,'paramName').errorMsg" slot-scope="text, record">
                        <a-input style="width: 100%" allowClear v-model="record.paramName" @change="handleChange(record.paramName, record.id,'paramName')" />
                    </a-form-item>
                    <!--   -->
                    <a-form-item style="margin-bottom:0" :label-col="{
   xs: { span: 0 },
   sm: { span: 0 },
  }" :wrapper-col="{
   xs: { span: 24 },
   sm: { span: 24 },
  }" slot="paramCode" :validate-status="getFildStatus(record.id,'paramCode').validateStatus" :help="getFildStatus(record.id,'paramCode').errorMsg" slot-scope="text, record">
                        <a-input style="width: 100%" allowClear v-model="record.paramCode" @change="handleChange(record.paramCode, record.id,'paramCode')" />
                    </a-form-item>

                    <div slot="action" slot-scope="record, index, indent, expanded">
                        <a href="javascript:;" rel="external nofollow">
                            <a-icon type="delete" title="删除" @click=" delRow(record,index,indent,expanded)" /></a>
                    </div>
                </a-table>

            </a-form-item>
            <a-form-item :wrapper-col="{ span: 4, offset:7 }">
                <a-button type="primary" html-type="submit" style="width:100%">
                    保存
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>


export default {
    components: {},
    data() {
        return {
            formLayout: 'horizontal',
            form: this.$form.createForm(this, { name: 'coordinated' }),
            columns: [
                { title: '参数名称', dataIndex: 'paramName', align: 'center', scopedSlots: { customRender: 'paramName' } },
                { title: '参数编码', dataIndex: 'paramCode', align: 'center', scopedSlots: { customRender: 'paramCode' } },
                { title: '操作', scopedSlots: { customRender: 'action' }, width: '150px', align: 'center', }
            ],
            tableData: [
                { id: 1, paramName: 'dsd', paramCode: 'dd' },
                { id: 2, paramName: 'fff', paramCode: 'ggg' },
            ],
            tblRules: []//功能参数验证
        };
    },
    computed: {},
    watch: {},
    methods: {
        //添加表格数据
        addTblData() {
            this.tableData.push({
                id: this.getRandomCode(),
                paramName: this.getRandomCode(),
                paramCode: this.getRandomCode()
            })
        },
        //获取随机数
        getRandomCode() {
            return (Math.random() * (36 - 1) + 1).toString(36).substr(3, 4)
        },
        //提交保存
        handleSubmit(e) {

            //功能参数未填写
            if (this.tblRules.length > 0) {
                return
            }
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    // 功能参数数据
                    console.log(this.tableData)
                    console.log(values);
                }
            });
        },
        //生成编码
        getCoding() {
            this.form.setFieldsValue({
                coding: this.getRandomCode()
            });
        },
        getFildStatus(id, key) {
            const data = this.tblRules.find(item => id === item.id && key === item.key)
            if (data) {
                return data
            } else {
                return {
                    errorMsg: '',
                    validateStatus: 'success'
                }
            }
        },
        //功能参数表格验证
        validatePrimeNumber(value) {
            return {
                validateStatus: value === '' ? 'error' : 'success',
                errorMsg: value === '' ? '必填' : '',
            };
        },
        handleChange(value, id, key) {
            const target = this.tableData.find(item => item.id === id)
            if (target) {
                const { errorMsg, validateStatus } = this.validatePrimeNumber(value)
                let flag = true
                let index = this.tblRules.findIndex(v => v.id === id && v.key === key)
                let data = {
                    id,
                    key,
                    errorMsg,
                    validateStatus
                }
                if (index !== -1) {
                    if (validateStatus === 'error')
                        this.$set(this.tblRules, index, data)
                    else this.tblRules.splice(index, 1)
                } else {
                    this.tblRules.push(data)
                }

                // target.goodModelCount = value
                // this.tableData = newData
            }
        },
        //删除表格数据
        delRow(data, record, index) {
            this.tableData.splice(index, 1)
        }
    },
    created() {

    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
.addRow-main {
    max-height: 100%;
    overflow: auto;
    padding: 15px 30px;
    box-sizing: border-box;

    background-color: #ffffff;
}
</style>