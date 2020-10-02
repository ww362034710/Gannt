<template>
    <div>
        <a-form :form="searchForm" layout="inline">
            <a-form-item label="资源名称：">
                <a-input size="small" style="width:130px" v-model="searchForm.stuffName" placeholder="请填写资源名称" />
            </a-form-item>
            <a-form-item label="功能名称：">
                <a-input size="small" style="width:130px" v-model="searchForm.featureName" placeholder="请填写功能名称" />
            </a-form-item>
            <a-form-item label="功能编码：">
                <a-input size="small" style="width:130px" v-model="searchForm.featureCode" placeholder="请填写功能编码" />
            </a-form-item>
            <a-form-item>
                <a-button size="small" type="primary" icon="search" @click="getTablData()">查询</a-button>
            </a-form-item>
        </a-form>
        <a-table :columns="reColumns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="small" :scroll="modelTbl" rowKey="uuid" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,onSelect:selectOneRows,onSelectAll:onSelectAll}" @change="tblPagination">
            <div slot="action" slot-scope="scope" class="main-table-btns">
                <a-button size="small" type="primary" icon="eye" @click="getGoodsDetail(scope)">详情</a-button>
            </div>
        </a-table>

        <a-modal v-model="resourceStuffDetail" title="资源功能详情" :width="800" :height="700" cancel-text="取消">
            <StuffFeatureDetail ref="stuffFeatureDetail" :detail="resourceId"/>
        </a-modal>
        <a-modal v-model="goodsStuffDetail" title="资源功能详情" :width="800" :height="700" cancel-text="取消">
            <stuff-feature-goods-detail ref="stuffFeatureDetail" :detail="goodsId"/>
        </a-modal>
        <!-- <div class="tree-main" :style="treeStyle">
            <a-tree checkable :selected-keys="selectedRowKeys" @check="checkTreeNode" :tree-data="treeData" key="featureId" title="title" />
        </div> -->

    </div>
</template>
<script>
    import StuffFeatureDetail from "./StuffFeatureDetail";
    import StuffFeatureGoodsDetail from "./StuffFeatureGoodsDetail";
export default {
    name: "eventTemplateStuffFeatureSelection",
    components: { StuffFeatureDetail, StuffFeatureGoodsDetail},
    props: {
        //请求列表数据时携带，过滤已经选择的数据
        selectedKeys: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    watch: {
        //监听已选择表格 key
        selectedKeys(value) {
            this.selectedRowKeys = value;
        }
    },
    data() {
        return {
            searchForm: {
                stuffName: null,
                featureName: null,
                featureCode: null
            },
            reColumns: [
                {
                    title: "资源名称",
                    dataIndex: "stuffName"
                },
                {
                    title: "功能名称",
                    dataIndex: "featureName",
                },
                {
                    title: "功能编码",
                    dataIndex: "featureCode",
                    width: "20%"
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: "action" },
                    width: "20%"
                },
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
            tblData: [],//model table 数据
            selectedRowKeys: [],//表格已选择数据 uuid
            selectedRows: [],
            loading: false,
            goodsStuffDetail:false,
            resourceStuffDetail:false,
            resourceId:null,
            goodsId:null,
            detail:{
                goodsId:null,
                resourceId:null
            }
        }
    },
    computed: {
        //表格高度
        modelTbl() {
            return {
                y: document.documentElement.clientHeight * 0.8 - 200
            }
        },
        //树数据
        treeData() {
            let mapTree = {};
            for (let i = 0, l = this.tblData.length; i < l; i++) {
                let data = this.tblData[i]
                if (!mapTree[data.resourceId]) mapTree[data.resourceId] = {
                    title: data.stuffName,
                    key: data.resourceId + "parent",
                    children: []
                };
                mapTree[data.resourceId].children.push({
                    title: `${data.featureName}(${data.featureCode})`,
                    key: data.resourceId
                })
            }
            return Object.values(mapTree)
        },
        //设置树高度
        treeStyle() {
            return {
                width: "100%",
                height: document.documentElement.clientHeight * 0.6 - 50 + 'px'
            }
        }
    },
    methods: {
        /**
         *  获取model表格数据
         */
        getTablData() {
            let params = Object.assign({}, this.searchForm, {
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current,
                selectedKeys: this.selectedKeys
            });
            //TODO 查询分页数据
            this.loading = true;
            this.$http.postBody("/bs/stuffFeature/featureListWithStuffApproved", params).then(data => {
                console.log(data.rows);
                this.tblData = data.rows;
                this.pagination.total = data.total;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });

        },
        //model 表格选中数据
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        },
        //表格化 选择变化
        selectOneRows(record, selected) {
            this.$emit('selectChange', record, selected)
        },
        //表格全选/取消
        onSelectAll(selected, selectedRows, changeRows) {
            console.log(selected, changeRows, selectedRows)
            this.$emit("setCollectionChange", changeRows, selected)
        },
        /*
        *查询资源功能详情并弹出展示
        */
        getGoodsDetail(scope){
            if (scope.stuffType!==null&&scope.stuffType==='resource'){
                this.resourceStuffDetail = true;
                this.resourceId = scope.stuffId;
                this.goodsStuffDetail =false;
            }else {
                this.goodsStuffDetail = true;
                this.goodsId = scope.stuffId;
                this.resourceStuffDetail = false;
            }

            // console.log(scope);
            // this.resourceId = scope.resourceId;
            console.log(this.resourceId)
            // this.$refs.stuffFeatureDetail.getResourceId(scope.resourceId);

        },
        /**
         * 树节点选中
        */
        checkTreeNode(checkedKeys, e) {
            console.log(checkedKeys)
            console.log(e)
        },
        //异步加载树节点
        onLoadData(treeNode) {
            console.log(treeNode)
            return new Promise(resolve => {
                // if (treeNode.dataRef.children) {
                //     resolve();
                //     return;
                // }
                setTimeout(() => {
                    treeNode.dataRef.children = [
                        { title: 'Child Node', key: `${treeNode.eventKey}-0` },
                        { title: 'Child Node', key: `${treeNode.eventKey}-1` },
                    ];
                    this.treeData = [...this.treeData];
                    resolve();
                }, 1000);
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
        // 重新加载表格
        reload() {
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.pagination.total = 0;
            this.selectedRowKeys = [];
            this.getTablData();
        }
    },
    created() {
        this.getTablData();
    }
}
</script>
<style lang="scss" scoped>
.tree-main {
    overflow: auto;
    box-shadow: inset 0 0 3px #ececec;
}
</style>
