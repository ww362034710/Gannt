<!--事件模板采集列表页面 - 给用户录入事件模板使用-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="form" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="form.name" placeholder="请输入名称" />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="id" @change="tblPagination">
                    <span slot="state" slot-scope="scope" v-html="scope.getStateHTML()"></span>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye" @click="scope.openViewPage()"> 查看</a-button>
                        <a-button type="primary" size="small" icon="scissor" @click="decom(scope)" >分解</a-button>
                    </div>
                </a-table>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    components: {},
    name: "eventTemplateDecomposeIndex",
    data() {
        return {
            form: {
                name: "",
                type: '0'
            },
            formTypeData: [{
                text: "全部",
                value: '0'
            }, {
                text: "类型一",
                value: '1'
            }, {
                text: "类型二",
                value: '2'
            }],
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
                    width: 230,
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
        //添加采集事件
        addGathering() {
            this.$router.push({
                name: "eventTemplateAdd",
                params: {
                    tags: "添加采集事件",
                    schemeTemplateType: 'event'
                }
            })
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
        },
        /** 分解 */
        decom(data) {
            this.$router.push({
                name: "eventTemplateDecompose",
                params: {
                    tags: "分解事件",
                    schemeTemplateId: data.id,
                    schemeTemplateType: data.rootType
                }
            })
        },
        /** 提交 */
        submit(data) {
            this.$http.postBody("/bs/resolveSchemeTemplate/approval", { resolveSchemeTemplateId: data.id, result: 'approving' }).then(data => {      // TODO 使用枚举
                if (data.code === 0) {
                    this.$message.success(data.msg);
                    this.getTablData();
                } else {
                    this.$message.error(data.msg);
                }
            });
        },
        /** TODO 删除 */
        remove(data) {

        },
    },
    created() {
        this.getTablData();
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
