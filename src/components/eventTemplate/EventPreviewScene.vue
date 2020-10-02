<!--事件库中 详情页的相关统计页面-->
<template>
    <div class="main-container">
        <div class="top-container">
            <a-row :gutter="16">
                <a-col :span="20">
                    <h2>相关统计</h2>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="规划层级" value="月事件" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="优先级" value="一级" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="持续时间(天)" value="300" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="下级事件数量" value="54" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="参与规划次数" value="211" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="参与规划次数占比" value="3.6%" style="margin-right: 50px"/>
                </a-col>
            </a-row>
            <hr style="margin-top: 20px;"/>
        </div>
        <div class="left-container">
            <!--            TODO 先这样,当前数据错误太多,先不传值-->
            <my-pie></my-pie>
        </div>

        <div class="right-container">
            <h4 style="font-weight: bold;">&nbsp;&nbsp;&nbsp;事件历史</h4>
            <a-timeline>
                <a-timeline-item color="gray">
                    2015-09-01 09:03:02 创建事件
                </a-timeline-item>
                <a-timeline-item color="gray">
                    2015-09-01 09:03:20 事件提交审核
                </a-timeline-item>
                <a-timeline-item color="red">
                    <p>2015-09-01 09:03:20</p>
                    <p>事件审核未通过</p>
                    <p>驳回原因:事件信息不完整</p>
                </a-timeline-item>
                <a-timeline-item>
                    <p>2015-09-01 09:03:02 修改事件</p>
                </a-timeline-item>
                <a-timeline-item color="gray">
                    <p>2015-09-01 09:03:20 事件提交审核</p>
                </a-timeline-item>
                <a-timeline-item color="green">
                    <p>2015-09-01 09:03:20</p>
                    <p>事件审核通过</p>
                </a-timeline-item>
                <a-timeline-item>
                    <p>2015-09-01 09:03:20</p>
                    <p>事件进入事件库</p>
                </a-timeline-item>
            </a-timeline>
        </div>
    </div>
</template>
<script>
    import MyPie from "../echarts/MyPie";
    export default {
        name: "eventPreviewScene",
        components: {MyPie},
        props: {
            sceneInfo: {
                type: Object,
                required: false,
                default: () => {
                    return {
                        eventList: []
                    }
                }
            }
        },
        data() {
            return {
                tblData: [],
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
                        dataIndex: "name"
                    },
                    {
                        title: "功能编码",
                        dataIndex: "id"
                    },
                    {
                        title: "需求量",
                        dataIndex: "value",
                        customRender: (type, row, index) => {
                            return type + " " + row.unit;
                        }
                    }
                ]
            }
        },
        created() {
            this.tblData = this.sceneInfo.eventList;
        },
        watch: {
            sceneInfo: function (data) {
                this.tblData = data.eventList;
            }
        },
        methods: {
            formatDate (date) {
                if (date === undefined || date === null || date === '') return date;
                return new Date(date).Format('yyyy-MM-dd');
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main-container {
        position: absolute;
        top: 0;
        left: 140px;
        width: 100%;
        height: 100%;
        /*.top-container {*/
        /*    width: 100%;*/
        /*    padding: 16px;*/
        /*}*/

        .left-container {
            position: relative;
            width: 49.5%;
            height: 50%;
           float: left;
        }

        .right-container {
          float: left;
          -webkit-box-flex: 1;
          flex: 1;
            width: 49.5%;
       }
    }
</style>
