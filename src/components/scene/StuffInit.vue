<template>
    <div>
        <div style="text-align:right">
            <a-button @click="addTblData()">添加</a-button>
        </div>
        <a-table :columns="columns" :rowKey="col => col.id" :dataSource="tblData" size="small" :pagination="false">
            <a-form-item style="margin-bottom:0" :label-col="{ xs: { span: 0 }, sm: { span: 0 } }" :wrapper-col="{ xs: { span: 24 }, sm: { span: 24 } }"
                         slot="value" :validate-status="getFildStatus(record.id,'value').validateStatus"
                         :help="getFildStatus(record.id,'value').errorMsg" slot-scope="text, record/*, index*/">
                <a-input-number style="width: 100%" allowClear v-model="record.value" @change="handleChange(record.value, record.id,'value')" />
            </a-form-item>
            <div slot="action" slot-scope="record, index, indent, expanded">
                <a href="javascript:;" rel="external nofollow">
                    <a-icon type="delete" title="删除" @click=" delRow(record,index,indent,expanded)" /></a>
            </div>
        </a-table>
        <a-modal title='可用物列表' :width="800" v-model="selectStuff" ok-text="确认" cancel-text="取消" @ok="setRows()">
            <stuff-select :selected-keys="selectedKeys" @selectChange="selectChange" @onSelectAll="onSelectAll"/>
        </a-modal>
    </div>
</template>
<script>
    import StuffSelect from "@/components/scene/StuffSelect";
    export default {
        name: "stuffInit",
        components: {StuffSelect},
        data() {
            return {
                columns: [
                    {title: '名称', dataIndex: 'name', align: 'center'},
                    {title: '可用量', dataIndex: 'value', align: 'center', scopedSlots: { customRender: 'value'}},
                    {title: '操作', dataIndex: 'action', align: 'center', scopedSlots: {customRender: 'action'}}
                ],
                tblData: [],
                selectedKeys: [],
                tblRules: [],
                selectStuff: false,
            }
        },
        methods: {
            handleSubmit() {
                //校验自定义参数名称
                let that = this;
                this.tblData.forEach(function (item) {
                    const { errorMsg, validateStatus } = that.validatePrimeNumber(item.value)
                    let rulesIndex = that.tblRules.length > 0 ? that.tblRules.findIndex(v => v.id === item.id && v.key === "value") : -1;
                    let data = {
                        id: item.id,
                        key: "value",
                        errorMsg,
                        validateStatus
                    }
                    if (rulesIndex !== -1) {
                        if (validateStatus === 'error')
                            that.$set(that.tblRules, rulesIndex, data);
                        else
                            that.tblRules.splice(rulesIndex, 1);
                    } else {
                        if (validateStatus !== 'success' )
                            that.tblRules.push(data);
                    }
                })
                //功能参数未填写
                let successFlag = true;
                if (this.tblRules.length > 0) {
                    console.log("当前错误信息：", this.tblRules);
                    successFlag = false;
                }
                return successFlag;
            },
            addTblData() {
                //重置一下已选
                this.selectedKeys = this.tblData.map(row => { return row.id });
                console.log("this.selectedKeys is:", this.selectedKeys);
                this.selectStuff = true;
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
            handleChange(value, id, key) {
                const target = this.tblData.find(item => item.id === id)
                if (target) {
                    const { errorMsg, validateStatus } = this.validatePrimeNumber(value)
                    let rulesIndex = this.tblRules.length > 0 ? this.tblRules.findIndex(v => v.id === id && v.key === key) : -1;
                    let data = {
                        id: id,
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
                let flag = value === undefined || value === null || value === ''
                return {
                    validateStatus: flag ? 'error' : 'success',
                    errorMsg: flag ? '必填' : '',
                };
            },
            //删除表格数据
            delRow(data, record, index) {
                this.tblData.splice(index, 1)
            },
            setRows(){
                this.selectStuff = false;
            },/**
             * 选择资源列表
             * @param {*} data 选择行数据
             * @param {*} type true：选择 false:取消选择
             */
            selectChange(data, type) {
                if (type) {
                    this.tblData = [... this.tblData, data]
                } else {
                    let index = this.tblData.findIndex(v => v.id === data.id)
                    if (index !== -1)
                        this.tblData.splice(index, 1)
                }
            },
            /**
             * 批量设置改变节点
             * @param {*} data 选择数据集合
             * @param {*} type true：选择 false:取消选择
             */
            onSelectAll(data, type) {
                //选中
                if (type) {
                    this.tblData = [...new Set([... this.tblData, ...data])]
                } else {
                    this.tblData = this.tblData.filter(v => !data.find(vl => vl.id === v.id))
                }
            },
        }
    }
</script>