<template>
    <div class='addRow-main'>
        <h2>功能信息</h2>
        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" @submit="handleSubmit">
            <a-form-item v-show="false"  label="id">
                <a-input placeholder="功能ID" allowClear v-decorator="['id', { initialValue: null }]" />
            </a-form-item>
            <a-form-item label="功能名称">
                <a-input placeholder="请输入功能名称" allowClear v-decorator="['name', { initialValue: null, rules: [{ required: true, message: '请输入功能名称!' }] }]" />
            </a-form-item>

            <a-form-item label="功能编码">
                <a-row type="flex" justify="space-between">
                    <a-col :span="20">
                        <a-input :disabled="featureId != null" placeholder="点击生成功能编码" allowClear v-decorator="['code', { initialValue: null, rules: [{ required: true, message: '请生成编码!' }] }]" />
                    </a-col>
                    <a-col :span="4" style="text-align:right" v-show="featureId == null">
                        <a-button @click="getCoding()">生成</a-button>
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item label="功能参数">
                <div style="text-align:right">
                    <a-button @click="addTblData()">添加</a-button>
                </div>
                <a-table :columns="columns" :rowKey="col => col.id" :dataSource="tableData" size="small" :pagination="false">
                    <a-form-item style="margin-bottom:0" :label-col="{ xs: { span: 0 }, sm: { span: 0 } }" :wrapper-col="{ xs: { span: 24 }, sm: { span: 24 } }"
                                 slot="name" :validate-status="getFildStatus(index,'name').validateStatus"
                                 :help="getFildStatus(index,'name').errorMsg" slot-scope="text, record, index">
                        <a-input style="width: 100%" allowClear v-model="record.name" @change="handleChange(record.name, index,'name')" />
                    </a-form-item>
                    <!--   -->
                    <a-form-item style="margin-bottom:0" :label-col="{xs: { span: 0 }, sm: { span: 0 }}" :wrapper-col="{ xs: { span: 24 }, sm: { span: 24 } }"
                                 slot="id" :validate-status="getFildStatus(index,'id').validateStatus"
                                 :help="getFildStatus(index,'id').errorMsg" slot-scope="text, record, index">
                        <a-input :disabled="featureId != null" style="width: 100%" allowClear v-model="record.id" @change="handleChange(record.id, index,'id')" />
                    </a-form-item>
                    <div slot="action" slot-scope="record, index, indent, expanded">
                        <a href="javascript:;" rel="external nofollow">
                            <a-icon type="delete" title="删除" @click=" delRow(record,index,indent,expanded)" /></a>
                    </div>
                </a-table>

            </a-form-item>
<!--            <a-form-item :wrapper-col="{ span: 4, offset:7 }">-->
<!--                <a-button type="primary" html-type="submit" style="width:100%">-->
<!--                    保存-->
<!--                </a-button>-->
<!--            </a-form-item>-->
        </a-form>
    </div>
</template>

<script>


    export default {
        components: {},
        props: {
            featureId: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                formLayout: 'horizontal',
                form: this.$form.createForm(this),
                columns: [
                    { title: '参数名称', dataIndex: 'name', align: 'center', scopedSlots: { customRender: 'name' } },
                    { title: '参数编码', dataIndex: 'id', align: 'center', scopedSlots: { customRender: 'id' } },
                    { title: '操作', scopedSlots: { customRender: 'action' }, width: '150px', align: 'center', }
                ],
                tableData: [
                    // { index: 1, name: 'dsd', id: 'dd' },
                    // { index: 2, name: 'fff', id: 'ggg' },
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
                    featureId: this.featureId,
                    name: null,
                    id: this.getRandomCode()
                })
            },
            //获取随机数
            getRandomCode() {
                return this.generateUUID();
            },
            //提交保存
            handleSubmit(e) {
                //校验自定义参数名称
                let that = this;
                this.tableData.forEach(function (item, index) {
                    const { errorMsg, validateStatus } = that.validatePrimeNumber(item.name)
                    let rulesIndex = that.tblRules.length > 0 ? that.tblRules.findIndex(v => v.index === index && v.key === "name") : -1;
                    let data = {
                        index: index,
                        key: "name",
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
                if (this.tblRules.length > 0) {
                    console.log("当前错误信息：", this.tblRules);
                    return;
                }
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        // 功能参数数据
                        let param = Object.assign({}, values, {params: this.tableData});
                        if (values.id){
                            this.$http.postBody("/bs/feature/edit", param).then(() => {
                                    this.$message.success("修改成功", 2);
                                    this.$emit('closeAddModal');
                                }).catch(() => {
                            });
                            console.log("修改时提交的功能信息：", param);
                        } else {
                            this.$http.postBody("/bs/feature/add", param).then(() => {
                                    this.$message.success("新增成功", 2);
                                    this.$emit('closeAddModal');
                                }).catch(() => {
                            });
                            console.log("新增时提交的功能信息：", param);
                        }
                    }
                });

            },
            //生成编码
            getCoding() {
                this.form.setFieldsValue({
                    code: this.getRandomCode()
                });
            },
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
            //功能参数表格验证
            validatePrimeNumber(value) {
                return {
                    validateStatus: value === null || value === '' ? 'error' : 'success',
                    errorMsg: value === null || value === '' ? '必填' : '',
                };
            },
            handleChange(value, index, key) {
                const target = this.tableData.find((item, i) => i === index)
                if (target) {
                    const { errorMsg, validateStatus } = this.validatePrimeNumber(value)
                    //let flag = true
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

                    // target.goodModelCount = value
                    // this.tableData = newData
                }
                console.log("当前rules为：", this.tblRules);
            },
            //删除表格数据
            delRow(data, record, index) {
                this.tableData.splice(index, 1)
            }
        },
        created() {
            console.log("添加/编辑功能接收到参数：", this.featureId);
            if (this.featureId){
                //TODO 加载功能信息
                let param = Object.assign({}, {id: this.featureId});
                this.$http
                    .postForm("/bs/feature/show", param)
                    .then(rst => {
                        console.log("请求到功能信息：", rst);
                        this.$nextTick(() => {
                            this.form.setFieldsValue(rst.data);
                            this.tableData = rst.data.parameter;
                            console.log(this.tableData);
                        })
                    }).catch(() => {
                });
            }
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