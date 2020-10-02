<!--事件模板管理页面  管理人员管理事件库中的事件模板  !!其实管理的是方案 ResolveSchemeTemplate-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="form" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="form.name" placeholder="请输入名称" />
                    </a-form-item>
                    <a-form-item label="所属系统：">
                        <a-select placeholder="请选择所属系统" v-model="form.ownerSystem" allowClear style="width:200px">
                            <a-select-option v-for="item in ownerSystem" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
                    </a-form-item>
                    <a-form-item style="float:right">
                        <a-button type="primary" icon='plus' @click="ResolveSchemeTemplate.openAddPage('event')">采集事件</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="id" @change="tblPagination">
                    <span slot="state" slot-scope="scope" v-html="scope.getStateHTML()"></span>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye" @click="scope.openViewPage()"> 查看</a-button>
                        <a-button type="primary" size="small" icon="edit" @click="scope.openEditPage()">编辑</a-button>
                        <!--TODO-->
                        <a-button type="danger" size="small" icon="delete" @click="remove(scope)">删除</a-button>
                    </div>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
        name: "eventTemplateManageIndex",
        data() {
            return {
                form: {
                    name: undefined,
                    ownerSystem: undefined,
                },
                ownerSystem: [
                    {value: "运行控制中心", text: "运行控制中心"},
                    {value: "AST支持中心", text: "AST支持中心"},
                    {value: "在轨HTQ支持中心", text: "在轨HTQ支持中心"},
                    {value: "有效载荷运营管理中心", text: "有效载荷运营管理中心"},
                    {value: "TSJSSY管理中心", text: "TSJSSY管理中心"},
                    {value: "工程信息中心", text: "工程信息中心"}
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
                columns: [
                    {
                        title: "名称",
                        dataIndex: "name",
                        width: "15%"
                    },
                    {
                        title: "任务目标",
                        dataIndex: "taskCabin",
                        width: "15%"
                    },
                    {
                        title: "运行阶段",
                        dataIndex: "runPhase",
                        width: "15%"
                    },
                    {
                        title: "优先级",
                        dataIndex: "priority",
                        width: "15%"
                    },
                    {title:"持续时间",
                        dataIndex:"duration",
                        width:"15%"
                    },
                    {
                        title: "所属系统",
                        dataIndex: "ownerSystem",
                        width: "15%"
                    },
                    {
                        title: "状态",
                        width: "15%",
                        scopedSlots: { customRender: "state" }
                    },
                    {
                        title: "操作",
                        width: 300,
                        scopedSlots: { customRender: "action" }
                    }
                ],
                tblData: [],
                loading: false,

        };
    },
    computed: {},
    watch: {},
    methods: {
        //查询
        doSearch() {
            this.getTablData()
        },
        /**
         * 获取表格数据
         */
        getTablData() {
            let params = Object.assign({}, this.form, {
                state: 'approved',
                rootType: this.ResolveSchemeTemplate.EVENT_TYPE,
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            });
            this.loading = true;
            this.$http.postBody("/bs/resolveSchemeTemplate/list", params).then(data => {
                this.tblData = this.ResolveSchemeTemplate.createFrom(data.data.rows);
                console.log(this.tblData);
                this.pagination.total = data.data.total;
                this.loading = false;
            }).catch((e) => {
                console.error(e);
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
        }
    },
    created() {
        this.getTablData()
    },
    mounted() {

    },
    activated() {
            this.getTablData();
    }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
</style>
