<template>
    <div>
        <m-table :columns="columns" url="/bs/scene/listGoal" :params="{sceneId: sceneId}"></m-table>
    </div>
</template>

<script>
    import MTable from "../common/MTable";

    export default {
        name: "ConcernedGoal",
        components: {MTable: MTable},
        props: {
            sceneId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                //table信息
                columns: [
                    {
                        title: "名称",
                        dataIndex: "name",
                        width: 100
                    },{
                        title: "编码",
                        dataIndex: "id",
                        width: 150
                    },{
                        title: "优先级",
                        dataIndex: "importantGrade",
                        width: 100
                    },{
                        title: "目标层级",
                        dataIndex: "planGrade",
                        width: 100
                    },{
                        title: "提出机构",
                        dataIndex: "submittingAgency",
                        width: 100
                    }
                ]
            }
        },
        created() {

        }
    }
</script>

<style scoped>

</style>