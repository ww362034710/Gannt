<!--为事件模板 选择其所依赖的 资源与功能-->
<template>
    <div>
        <a-button type="primary" size="small" @click="selectStuffFeature" style="margin-bottom:10px;float:right;z-index:10">选择资源功能
        </a-button>
        <div v-auto:[autoLayout] data-diff="210">
            <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="selTblData" bordered size="small" :scroll="{y:true,x:500}" rowKey="uuid">
                <!-- <div slot-scope="scope" slot="status" class="gathering-tbl">
                <a-input placeholder="请输入需求量" v-model="scope.status" @change="setStatus(scope)" />
                <span v-html="getHtml(scope)"></span>
            </div> -->
                <a-form-item style="margin-bottom:0" slot="value" :validate-status="getFildStatus(record.uuid,'value').validateStatus" :help="getFildStatus(record.uuid,'value').errorMsg" slot-scope="text, record">
                    <div class="gathering-tbl">
                        <a-input-number :min="0" size="small" allowClear v-model="record.value" @change="handleChange(record.value, record.uuid,'value')" />
                        <span v-html="getHtml(record)"></span>
                    </div>
                </a-form-item>

                <div slot="action" slot-scope="scope" style="text-align:center">
                    <!-- <a-button type="primary" size="small" icon="del">删除{{scope.status}}</a-button> -->
                    <a-icon type="delete" class="delStyle" title="删除" @click="delRequire(scope)" />
                </div>
            </a-table>
        </div>
        <a-modal v-model="selRequire" title="资源功能列表" :width="800" ok-text="确认" cancel-text="取消" @ok="setSelRows()">
            <stuff-feature-selection :selected-keys="selectedKeys" @selectChange="selectChange" @setCollectionChange="setCollectionChange" ref="stuffFeatureSelection" />
        </a-modal>
    </div>
</template>
<script>
import StuffFeatureSelection from "./StuffFeatureSelection";

export default {
    name: 'eventTemplateStuffFeatureForm',
    components: { StuffFeatureSelection },
    props: {

    },
    data() {
        return {
            columns: [
                {
                    title: "资源名称",
                    dataIndex: "stuffName",
                },
                {
                    title: "功能名称",
                    dataIndex: "featureName",
                    width: '15%'
                },
                {
                    title: "功能编码",
                    dataIndex: "featureCode",
                    width: '15%'
                },
                {
                    title: "需求量",
                    dataIndex: "value",
                    width: 150,
                    scopedSlots: { customRender: "value" }
                },
                {
                    title: "操作",
                    width: 50,
                    scopedSlots: { customRender: "action" }
                }
            ],
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
            loading: false,
            selTblData: [], // 该事件模板已经选择的资源与功能(所有  不止于"已选择"表格中当前页的数据)
            selRequire: false,//选择资源需求
            autoLayout: false,//表格高度自适应
            selectedKeys: [],
            tblRules: [],
        }
    },
    watch: {
    },
    methods: {
        // 设置已选择的资源功能列表
        setData(data) {
            this.selTblData = data;
            //已选择表格数据key
            this.selectedKeys = data.map(v => v.uuid)
            // this.$refs.stuffFeatureSelection.reload();
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
            const target = this.selTblData.find(item => item.uuid === id)
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
        //显示需求单位名称
        getHtml(data) {
            //return data.value == 1 ? '升' : `M<sup>3</sup>`
            return data.unit;
        },
        //删除功能需求表格数据
        delRequire(data) {
            let that = this;
            this.$confirm({
                title: "删除确认?",
                content: "确定要删除    " + data.stuffName + "的" + data.featureName + "    功能吗?",
                onOk() {
                    return new Promise((resolve, reject) => {
                        let index = that.selTblData.findIndex(v => v.uuid === data.uuid)
                        that.selTblData.splice(index, 1);
                        //已选择数据删除
                        let _index = that.selectedKeys.findIndex(v => v === data.uuid)
                        that.selectedKeys.splice(_index, 1);
                        resolve()
                    }).catch(() => console.log('异常!'));
                },
                onCancel() {
                },
            });
        },
        //选择完 资源功能
        setSelRows() {
            this.selRequire = false
            // //TODO 这里拿到的仅仅是当前页面已选的数据
            // this.selTblData = this.selTblData.concat(this.$refs.stuffFeatureSelection.selectedRows);
            // //关闭弹窗
            // this.selRequire = false
            // // 触发更新数据事件
            // console.log('StuffFeatureForm 触发changed事件', this.selTblData);
            // this.$emit("changed", this.selTblData);
        },
        /**
         * 选择资源列表
         * @param {*} data 选择行数据
         * @param {*} type true：选择 false:取消选择
        */
        selectChange(data, type) {
            // this.selTblData
            if (type) {
                this.selTblData = [... this.selTblData, data]
            } else {
                let index = this.selTblData.findIndex(v => v.uuid === data.uuid)
                if (index !== -1)
                    this.selTblData.splice(index, 1)
            }
            this.$emit('changed', this.selTblData)
        },
        /**
         * 批量设置改变节点
         * @param {*} data 选择数据集合
         * @param {*} type true：选择 false:取消选择
        */
        setCollectionChange(data, type) {
            //选中
            if (type) {
                this.selTblData = [...new Set([... this.selTblData, ...data])]
            } else {
                this.selTblData = this.selTblData.filter(v => !data.find(vl => vl.uuid === v.uuid))
            }
            this.$emit('changed', this.selTblData)
        },
        selectStuffFeature() {
            //将所有的已选参数
            // this.selectedKeys = this.selTblData.map((record) => {
            //     return record.uuid
            // });
            this.selRequire = true;
        },
        //功能参数表格验证
        validatePrimeNumber(value) {
            return {
                validateStatus: !value ? 'error' : 'success',
                errorMsg: !value ? '必填' : '',
            };
        },
        // 清空备选表格的数据 和 已选择的数据
        clear() {
            this.selTblData = [];
        }
    },
    computed: {
    },
    created() {
    }
}
</script>
<style lang='scss' scoped>
.gathering-tbl {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
        display: inline-block;
        width: 40px;
        margin-left: 2px;
        font-size: 12px;
    }
}

.delStyle {
    color: red;
}
</style>
