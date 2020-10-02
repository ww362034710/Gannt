<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="form" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="form.name" placeholder="请输入名称" />
                    </a-form-item>
                    <a-form-item label="类型：">
                        <a-select placeholder="请选择类型" v-model="form.type" style="width:200px">
                            <a-select-option v-for="item in formTypeData" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
                    </a-form-item>
                    <a-form-item style="float:right">
                        <a-button type="primary" icon='plus' @click="addGathering()">采集事件</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" bordered size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination">
                    <span slot="status" slot-scope="scope" v-html="getStatusName(scope)"></span>
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" icon="eye" @click="viewGathering(scope)"> 查看</a-button>
                        <a-button type="default" size="small" icon="check">通过</a-button>
                        <a-button type="danger" size="small" icon="reload">驳回</a-button>
                    </div>
                </a-table>
            </div>

        </div>
    </div>
</template>

<script>

export default {
    components: {},
    name: "demoEventManage",
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
                },
                {
                    title: "编码",
                    dataIndex: "userName",
                    width: "15%"
                },
                {
                    title: "优先级",
                    dataIndex: "level",
                    width: "15%"
                },
                {
                    title: "所属系统",
                    dataIndex: "system",
                    width: "15%"
                },
                {
                    title: "状态",
                    dataIndex: "status",
                    width: "15%",
                    scopedSlots: { customRender: "status" }
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
                name: "demoAddGathering",
                params: {
                    tags: "添加采集事件"
                }
            })
        },
        /**
        * 获取表格数据
        */
        getTablData() {
            let params = Object.assign({}, this.form, {
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
        /**
         * 表格formatter
         * 账号状态
         */
        getStatusName(data) {
            let stautsName = ['审批中', '已入库', '已驳回'],
                status = Number(data)
            return '<span class="event-status event-status-' + status + '">' + stautsName[status - 1] + '</span>'

        },
        //查看
        viewGathering(data) {
            this.$router.push({
                name: "demoViewGathering",
                params: {
                    tags: "查看事件采集"
                }
            })
        }
    },
    created() {
        this.getTablData()
    },
    mounted() {

    },
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
@mixin status-style($bg: #0e77d1) {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $bg;
}
/deep/ .event-status {
    position: relative;
    padding-left: 14px;
}
/deep/ .event-status-1 {
    &:after {
        content: "";
        @include status-style();
    }
}
/deep/ .event-status-2 {
    &:after {
        content: "";
        @include status-style(#00a854);
    }
}
/deep/ .event-status-3 {
    &:after {
        content: "";
        @include status-style(#f04134);
    }
}
</style>