<!--为事件模板 约束关系关系-->
<template>
    <div>
        <a-button type="primary" size="small" @click="selRequire=true" style="margin-bottom:10px;float:right;z-index:10">添加约束
        </a-button>
        <div v-auto data-diff="160">
            <m-table :columns="columns" :data-source="selTblData" ref='logicTbl'>
                <div slot="action" slot-scope="{row:scope}" style="text-align:center">
                    <!-- <a-button type="primary" size="small" icon="del">删除{{scope.status}}</a-button> -->
                    <a-icon type="delete" class="delStyle" title="删除" @click="delRequire(scope)" />
                </div>
            </m-table>
        </div>
        <a-modal v-model="selRequire" title="事件库" :width="800" ok-text="确认" cancel-text="取消" @ok="setSelRows()">
            <div v-auto data-diff="330">
                <m-table @selectChange="selectChange" @setCollectionChange="setCollectionChange" :selected-keys="selectedKeys"  :columns="modelColumns" ref='tbl' url="/bs/template/list" rowSelection rowSelectionType='checkbox'>
                   <!-- <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye"> 查看</a-button>
                        <a-button type="default" size="small" icon="upcircle">同上</a-button>
                    </div>-->
                </m-table>
            </div>
            <div>
                <a-form-model :model="form" layout="inline" :label-col="{span:6}" :wrapper-col="{span:18}">
                    <a-form-model-item label="约束类型" class="logic-form-1">
                        <a-select v-model="form.logic" placeholder="请选择约束条件" :options="this.LogicData">
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>

    </div>
</template>
<script>
//表格插件
import MTable from '../common/MTable'
export default {
    components: { MTable },
    props: {
        url: String,
        eventTemplateId:null,
    },
    data() {
        return {
            logicImg: null,
            form: {
                logic: null
            },
            /**/
            columns: [{
                title: "事件名称",
                dataIndex: "name",
            }, {
                title: "约束关系",
                dataIndex: "type"
            },
            {
                title: "操作",
                scopedSlots: { customRender: "action" }
            }],
            modelColumns: [{
                title: "名称",
                dataIndex: "name",
            }, {
                title: "优先级",
                dataIndex: "priority",
            }, {
                title: "所属系统",
                dataIndex: "ownerSystem"
            }],
            selRequire: false,//
            selectedKeys: [],
            tblRules: [],
            selTblData: [], // 该事件模板已经选择的逻辑约束事件(所有  不止于"已选择"表格中当前页的数据)

        }
    },
    watch: {
    },
    methods: {
        // 设置已选择的逻辑约束列表
        setData(data) {
            this.selTblData = data;
            //已选择表格数据key
            this.selectedKeys = data.map(v => v.id);
        },
        //删除功能需求表格数据
        delRequire(data) {
            let that = this;
            this.$confirm({
                title: "删除确认?",
                content: "确定要删除吗?",
                onOk() {
                    return new Promise((resolve, reject) => {
                        let index = that.selTblData.findIndex(v => v.id === data.id);
                        console.log(index);
                        that.selTblData.splice(index, 1);
                        //已选择数据删除
                        let _index = that.selectedKeys.findIndex(v => v === data.id)
                        that.selectedKeys.splice(_index, 1);
                        resolve()
                    }).catch(() => console.log('异常!'));
                },
                onCancel() {
                },
            });
        },
        //选择完逻辑约束 关闭弹窗
        setSelRows() {
            this.selRequire = false
        },
        /**
         * 选择逻辑约束（）
         * @param {*} data 选择行数据
         * @param {*} type true：选择 false:取消选择
         */
        selectChange(data, type) {

            data.type = this.form.logic
            // this.selTblData
            if (type) {
                this.selTblData = [... this.selTblData, data]
            } else {
                let index = this.selTblData.findIndex(v => v.id === data.id)
                if (index !== -1)
                    this.selTblData.splice(index, 1)
            }
            this.$emit('change', this.selTblData)
        },
        /**
         * 批量选择选择逻辑约束
         * @param {*} data 选择数据集合
         * @param {*} type true：选择 false:取消选择
         */
        setCollectionChange(data, type) {
            for (let i = 0 ; i<data.length;i++) {
                data[i].type = this.form.logic
            }
            //选中
            if (type) {
                this.selTblData = [...new Set([... this.selTblData, ...data])]
            } else {
                this.selTblData = this.selTblData.filter(v => !data.find(vl => vl.id === v.id))
            }
            this.$emit('change', this.selTblData)
        },
/*        /!**
         * 选择逻辑约束 向上抛出change事件
         * @param {*} data 选择行数据
        *!/
        selectChange(data) {
           for (let i = 0 ; i<data.length;i++) {
               console.log(data[i]);
               data[i].type = this.form.logic
            }
            this.selTblData = data;

            this.$emit('change', this.selTblData)
        },*/
        // 清空备选表格的数据 和 已选择的数据
        clear() {
            this.selTblData = [];
        },
    },
    computed: {
        modelImgStyle() {
            return document.documentElement.clientHeight * 0.7 - 100 + 'px'
        }
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
.logic-form-1 {
    width: 35%;
}
.delStyle {
    color: red;
}
</style>
