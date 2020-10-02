<!--事件模板采集列表页面 - 给用户录入事件模板使用-->
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
                        <a-button type="primary" size="small" icon="eye" @click="scope.openViewPage()" v-if="scope.state == 'approving' || scope.state == 'approved'"> 查看</a-button>
                        <a-button type="primary" size="small" icon="edit" @click="scope.openEditPage()" v-if="scope.state == 'draft'">编辑</a-button>
                        <a-button type="primary" size="small" icon="edit" @click="scope.openEditPage()" v-if="scope.state == 'rejected'">重新编辑</a-button>
                        <a-button type="success" size="small" icon="logout" @click="submit(scope)" v-if="scope.state == 'draft'">提交</a-button>
                        <a-button type="danger" size="small" icon="delete" @click="remove(scope)" v-if="scope.state == 'rejected' || scope.state == 'draft'">删除</a-button>
                    </div>
                </a-table>
            </div>
        </div>

    </div>

</template>

<script>
export default {
    components: {},
    name: "eventTemplateGatherIndex",
    data() {
        return {
            form: {
                name: "",
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
            // priority: [
            //     {value:1,text:"一级"},
            //     {value:2,text:"二级"},
            //     {value:3,text:"三级"},
            //     {value:4,text:"四级"}
            // ],
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
                    // filters:[
                    //     {text:"1",value: "一级"},
                    //     {text:"2",value: "二级"},
                    // ],
                    width: "15%",
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
                rootType: this.ResolveSchemeTemplate.EVENT_TYPE,
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.current
            });
            this.loading = true;
            this.$http.postBody("/bs/resolveSchemeTemplate/list", params).then(data => {
                this.tblData = this.ResolveSchemeTemplate.createFrom(data.data.rows);
                this.pagination.total = data.data.total;
                console.log(data.data);
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
        /** 编辑 */
        edit(data) {
            this.$router.push({
                name: "eventTemplateEdit",
                params: {
                    tags: "编辑采集事件",
                    schemeTemplateId: data.id,
                    schemeTemplateType: 'event'
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
        this.getTablData()
    },
    mounted() {
    },
    activated() {
        this.getTablData();
        console.log("我被触发")
    }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
</style>
