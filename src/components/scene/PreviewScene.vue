<template>
    <div class="main-container">
        <div class="top-container">
            <a-row :gutter="16">
                <a-col :span="20">
                    <h2>场景概览</h2>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="场景类型" :value="SceneType.getText(sceneInfo.planGrade)|| '- '" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="开始时间" :value="formatDate(sceneInfo.beginTime)|| '- '" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="结束时间" :value="formatDate(sceneInfo.endTime)|| '- '" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="事件总数" :value="sceneInfo.eventList.length|| '- '" style="margin-right: 50px"/>
                </a-col>
                <a-col :span="8">
                    <a-statistic title="事件总时长" :value="Math.round((sceneInfo.endTime - sceneInfo.beginTime)/(1000*60*60)) + '小时'||'- '" style="margin-right: 50px"/>
                </a-col>
            </a-row>
            <hr style="margin-top: 20px;"/>
        </div>
        <div class="left-container">
            <!--            TODO 先这样,当前数据错误太多,先不传值-->
            <m-pie></m-pie>
        </div>
        <div class="right-container">
            <h2>需求功能合集</h2>
            <a-table :dataSource="tblData" :columns="columns" :pagination="pagination" rowKey="id" size="middle">
            </a-table>
        </div>
    </div>
</template>
<script>
    import MPie from "@/components/echarts/MPie";
    export default {
        name: "previewScene",
        components: {MPie},
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
        left: 0;
        width: 100%;
        height: 100%;
        .top-container {
            width: 100%;
            padding: 16px;
        }

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