<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="steps-main">
                <a-steps :current="steps" size="small">
                    <a-step title="事件基本信息" />
                    <a-step title="功能需求" />
                </a-steps>
            </div>
            <div class="gathering-main">
                <div class="steps" v-show="steps==0">
                    <a-form :form="addForm" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <a-form-item label="名称：">
                            <a-input v-decorator="['name', addFormRule.name]" placeholder="请填写名称" />
                        </a-form-item>
                        <a-form-item label="唯一编码：">
                            <a-row type="flex" justify="space-between">
                                <a-col :span="20">
                                    <a-input placeholder="点击生成功能编码" allowClear v-decorator="['id', addFormRule.id]" />
                                </a-col>
                                <a-col :span="4" style="text-align:right">
                                    <a-button @click="getCoding()" icon="codepen">生成</a-button>
                                </a-col>
                            </a-row>

                        </a-form-item>

                        <a-form-item label="所属系统：">
                            <a-select placeholder="请选择所属系统" v-decorator="['ownerSysteme',addFormRule.ownerSysteme]">
                                <a-select-option v-for="item in ownerSystemeData" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="任务目标：">
                            <a-select v-decorator="['taskCabin',addFormRule.taskCabin]" placeholder="请选择任务目标">
                                <a-select-option v-for="item in taskCabinData" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="运行阶段：">
                            <a-select v-decorator="['runPhase',addFormRule.runPhase]" placeholder="请选择运行阶段">
                                <a-select-option v-for="item in runPhaseData" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="责任单位：">
                            <a-select mode="multiple" v-decorator=" ['responseOrgs',addFormRule.responseOrgs]" placeholder="请选择责任单位">
                                <a-select-option v-for="item in responseOrgsData" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="优先级：">
                            <a-select v-decorator="['priority',addFormRule.priority]" placeholder="请选择优先级">
                                <a-select-option v-for="item in priorityData" :key="item.value" :value="item.value">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="描述">
                            <a-textarea v-decorator="['description',addFormRule.userName]" placeholder="请输入任务描述">

                            </a-textarea>
                        </a-form-item>

                    </a-form>
                </div>
                <div class="steps" v-show="steps==1">
                    <a-button type="primary" size="small" @click="selRequire=true" style="margin-bottom:10px;float:right;z-index:10">选择资源功能</a-button>
                    <div v-auto:[autoLayout] data-diff="210">
                        <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="selTblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination">
                            <!-- <div slot-scope="scope" slot="status" class="gathering-tbl">
                            <a-input placeholder="请输入需求量" v-model="scope.status" @change="setStatus(scope)" />
                            <span v-html="getHtml(scope)"></span>
                        </div> -->
                            <a-form-item style="margin-bottom:0" slot="status" :validate-status="getFildStatus(record.uuid,'status').validateStatus" :help="getFildStatus(record.uuid,'status').errorMsg" slot-scope="text, record">
                                <div class="gathering-tbl">
                                    <a-input-number :min="0" allowClear v-model="record.status" @change="handleChange(record.status, record.uuid,'status')" />
                                    <span v-html="getHtml(record)"></span>
                                </div>
                            </a-form-item>

                            <div slot="action" slot-scope="scope" style="text-align:center">
                                <!-- <a-button type="primary" size="small" icon="del">删除{{scope.status}}</a-button> -->
                                <a-icon type="delete" class="delStyle" title="删除" @click="delRequire(scope)" />
                            </div>
                        </a-table>
                    </div>
                </div>
            </div>
            <div class="gathering-bottom">
                <a-button icon="arrow-right" type="primary" style="width:120px" @click="nextSteps()" v-if="steps!=1"></a-button>
                <a-button icon="arrow-left" type="primary" style="width:120px" @click="steps--" v-if="steps!=0"></a-button>
                <a-button icon="check" type="primary" @click="addHandler()" style="width:120px" v-if="steps==1">完成</a-button>
            </div>
        </div>
        <a-modal v-model="selRequire" title="资源功能列表" :width="650" ok-text="确认" cancel-text="取消" @ok="setSelRows()">
            <a-form :form="modelForm" layout="inline">
                <a-form-item label="名称：">
                    <a-input size="small" v-model="searchForm.name" placeholder="请填写名称" />
                </a-form-item>
                <a-form-item label="唯一编码：">
                    <a-input size="small" v-model="searchForm.id" placeholder="请填写名称" />
                </a-form-item>
                <a-form-item>
                    <a-button size="small" type="primary" icon="search" @click="getTablData()">查询</a-button>
                </a-form-item>
            </a-form>
            <a-table :columns="reColumns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="small" :scroll="modelTbl" rowKey="uuid" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            </a-table>
        </a-modal>

    </div>
</template>

<script>

export default {
    components: {},
    name: "demoAddGathering",
    data() {
        return {
            steps: 0,
            addForm: this.$form.createForm(this, { name: "addForm" }),
            addFormRule: {
                name: {
                    rules: [{
                        required: true,
                        message: "必填"
                    }, {
                        min: 2,
                        message: "最小长度2"
                    }, {
                        max: 6,
                        message: "最大长度6"
                    }]
                },
                id: {
                    rules: [{
                        required: true,
                        message: "必填"
                    }]
                },
                ownerSysteme: {
                    rules: [{
                        required: true,
                        message: "必填"
                    }]
                },
                taskCabin: {},
                runPhase: {},
                responseOrgs: { initialValue: [] },
                priority: {},
                description: {},
            },
            ownerSystemeData: [{
                name: "a",
                value: 1
            }, {
                name: "b",
                value: 2
            }],
            taskCabinData: [{
                name: "d",
                value: 1
            }],
            runPhaseData: [{
                name: "d",
                value: 1
            }],
            responseOrgsData: [{
                name: "d",
                value: 1
            }, {
                name: "d",
                value: 2
            }],
            priorityData: [{
                name: "d",
                value: 1
            }],
            autoLayout: false,//表格高度自适应
            columns: [
                {
                    title: "功能名称",
                    dataIndex: "name",
                },
                {
                    title: "功能编码",
                    dataIndex: "userName",
                    width: "20%"
                },
                {
                    title: "需求量",
                    width: 200,
                    scopedSlots: { customRender: "status" }
                },
                {
                    title: "操作",
                    width: 80,
                    scopedSlots: { customRender: "action" }
                }
            ],
            selTblData: [],//已选择数据
            tblData: [],//model table 数据
            loading: false,
            pagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ["10", "20", "30", "40"],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: total => {
                    return "共：" + total + "条记录 ";
                },
                total: 0
            },
            tblRules: [],
            modelForm: this.$form.createForm(this, { name: "modelForm" }),
            searchForm: {
                name: "名称",
                id: "125"
            },
            reColumns: [
                {
                    title: "功能名称",
                    dataIndex: "name",
                },
                {
                    title: "功能编码",
                    dataIndex: "userName",
                    width: "20%"
                },
            ],
            selectedRowKeys: [],//表格已选择数据 uuid
            selRequire: false,//选择资源需求
        }
    },
    computed: {
        //表格高度
        modelTbl() {
            return {
                y: document.documentElement.clientHeight * 0.8 - 200
            }
        }
    },
    watch: {},
    methods: {
        /**
         *  获取model表格数据
         */
        getTablData() {
            let params = Object.assign({}, this.searchForm, {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            });
            this.loading = true;
            this.$http.post("system/user/list").then(data => {
                this.tblData = data.data.rows;
                this.pagination.total = data.data.total;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        /**
       * 表格分页、排序、筛选变化时触发
       */
        tblPagination(pagination) {
            //保存当前分页信息
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            this.getTablData();
        },
        //下一步
        nextSteps() {
            this.steps++
            if (!this.autoLayout)
                this.autoLayout = true;
        },
        //生成编码
        getCoding() {
            this.addForm.setFieldsValue({
                id: (Math.random() * (36 - 1) + 1).toString(36).substr(3, 4)
            });
        },
        //删除功能需求表格数据
        delRequire(data) {
            let that = this
            this.$confirm({
                title: '删除确认?',
                content: '确定要删除 ' + data.name + " 功能需求吗?",
                onOk() {
                    return new Promise((resolve, reject) => {
                        let index = that.selTblData.findIndex(v => v.uuid === data.uuid)
                        that.selTblData.splice(index, 1)
                        //已选择数据删除
                        let _index = that.selectedRowKeys.findIndex(v => v === data.uuid)
                        that.selectedRowKeys.splice(index, 1)
                        resolve()
                    }).catch(() => console.log('异常!'));
                },
                onCancel() { },
            });
        },
        //显示需求单位名称
        getHtml(data) {
            return data.status == 1 ? '升' : `
            M<sup>3</sup>
            `
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
            const target = this.tblData.find(item => item.uuid === id)
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
            }
        },
        //model 表格选中数据
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        //功能参数表格验证
        validatePrimeNumber(value) {
            return {
                validateStatus: !value ? 'error' : 'success',
                errorMsg: !value ? '必填' : '',
            };
        },
        //选择完 资源功能
        setSelRows() {
            this.selTblData = this.tblData.filter(v => this.selectedRowKeys.includes(v.uuid))
            //关闭弹窗
            this.selRequire = false
        },
        //完成
        addHandler() {
            //第一步数据
            this.addForm.validateFields((err, values) => {
                if (!err) {
                    //第二步表格信息验证
                    if (this.tblRules.length == 0) {
                        //第一步表单数据
                        console.log(values)
                        //表格数据
                        console.log(this.selTblData)
                    }
                } else {
                    //第一步填写信息有误 跳转回第一步
                    debugger
                    this.steps = 0
                }
            })
        }
    },
    created() {
        this.getTablData()
    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
.steps-main {
    width: 60%;
    min-width: 600px;
    margin: 0 auto;
}
.gathering-main {
    position: absolute;
    top: 70px;
    left: 15px;
    right: 15px;
    bottom: 70px;
    padding: 10px 0;
    overflow: auto;
    box-shadow: inset 0 0 5px #ececec;
    .steps {
        width: 60%;
        min-width: 600px;
        margin: 0 auto;
    }
    /deep/ .ant-form-item-label {
        text-align: left !important;
    }
}
.gathering-bottom {
    position: absolute;
    bottom: 18px;
    left: 15px;
    right: 15px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    // border-top: 1px solid #ebeef5;
    button {
        margin: 0 10px;
    }
}
.gathering-tbl {
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
        margin-left: 5px;
    }
}
.delStyle {
    color: red;
}
</style>