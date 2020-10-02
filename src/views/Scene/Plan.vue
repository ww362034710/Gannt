<template>
    <div class="page-main">
        <div class="page-main-container">
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="场景名称：">
                        <a-input v-model="searchForm.nameL" placeholder="请输入场景名称" allowClear />
                    </a-form-item>
                    <a-form-item>
                        <a-button icon="search" type="primary" @click="doSearch()">查询</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <m-table ref="planTable" :params="searchForm" :columns="columns" url="/bs/sceneEdition/listPlan">
                    <div slot="state" slot-scope="{row: state}" v-html="SceneState.getStateHTML(state)"></div>
                    <div slot="action" slot-scope="{row: scope}" class="main-table-btns">
                        <a-button class="detial-btn" v-if="scope.state === 'planning' || scope.state === 'planed'"
                                  type="default" size="small" icon="exception" @click="detail(scope)">查看</a-button>

                        <a-button class="plan-btn" v-if="scope.state === 'planning'"
                                  type="primary" size="small" icon="build" @click="plan(scope)">规划</a-button>
                    </div>
                </m-table>
            </div>
        </div>
        <!--        场景详情   sceneId 是场景id-->
        <a-drawer title="场景详情" placement="right" :visible="detailDrawerVisible" v-if="detailDrawerVisible" @close="detailDrawerVisible = false" :width="'90vw'" :height="'50vw'">
            <Detail :sceneId="curScene.sceneId"></Detail>
        </a-drawer>
    </div>
</template>

<script>
    import MTable from "@/components/common/MTable";
    import Detail from "./Detail";
    export default {
        name: "scenePlan",
        components: {MTable, Detail},
        data() {
            return {
                /*search from*/
                searchForm: {
                    nameL: undefined
                },

                //table info
                columns: [
                    {
                        title: "场景版本ID",    //s_scene_edition表的id，作为主键，规划的时候会用到
                        dataIndex: "id",
                        width: 100
                    },{
                        title: "场景名称",
                        dataIndex: "name",
                        width: 100
                    },{
                        title: "场景开始时间",
                        dataIndex: "beginTime",
                        width: 100
                    },{
                        title: "结束时间",
                        dataIndex: "endTime",
                        width: 100
                    },{
                        title: "状态",
                        dataIndex: "state",
                        width: 100,
                        scopedSlots: {
                            customRender: "state"
                        }
                    },{
                        title: "操作",
                        width: 150,
                        scopedSlots: {customRender: "action"},
                    }
                ],
                curScene: {},
                detailDrawerVisible: false
            }
        },
        methods: {
            /*search from*/
            doSearch() {
                this.$refs.planTable.getTableData()
            },

            detail(scope) {
                this.curScene = scope;
                this.detailDrawerVisible = true;
            },
            plan(scope) {
                this.curScene = scope;
                this.$router.push({
                    name: "sceneScheduler",
                    params: {
                        tags: "场景事件规划",
                        sceneEditionId: scope.id,
                        startDate: scope.beginTime,
                        endDate: scope.endTime
                    }
                });
                // this.$router.push({
                //     name: "ganttGanttIframe",
                //     params: {
                //         tags: "场景事件规划",
                //         sceneId: scope.id
                //     }
                // });
            }
        }
    }
</script>

<style scoped>

</style>