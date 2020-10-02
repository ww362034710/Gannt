<template>
    <div class="page-main page-scene-detail">
        <a-tabs default-active-key="5" type="card" tab-position="left">
            <a-tab-pane tab="基本信息" key="5">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic title="场景名称" :value="scene.name" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="16">
                        <a-button icon="export" style="float: right;" @click="add()">导出</a-button>
                    </a-col>
                    <a-col :span="24" style="margin-top: 20px;margin-bottom: 20px;">
                        <hr/>
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="开始时间" :value="scene.beginTime||'- '" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="结束时间" :value="scene.endTime||'- '" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="场景类型" :value="SceneType.getText(scene.planGrade)" style="margin-right: 50px" />
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane tab="规划方案" key="20">
                ......
            </a-tab-pane>
            <a-tab-pane tab="场景事件" key="15">
                <RelatedEvent :sceneId="sceneId"></RelatedEvent>
            </a-tab-pane>
            <a-tab-pane tab="相关目标" key="10">
                <concerned-goal :scene-id="sceneId"/>
            </a-tab-pane>
            <a-tab-pane tab="历史记录" key="17">
                <HistoryTable :sceneId="sceneId"></HistoryTable>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
import RelatedEvent from "@/components/scene/RelatedEvent";
import HistoryTable from "@/components/scene/SceneHistoryTable";
import ConcernedGoal from "@/components/scene/ConcernedGoal";

    export default {
        name: "sceneDetail",
        components: {
            ConcernedGoal,
            RelatedEvent,
            HistoryTable
        },
        props: {
            sceneId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                scene: []
            }
        },
        methods: {
            getScene() {
                this.$http.postForm('/bs/scene/show', {id: this.sceneId}).then((rst) => {
                    this.whenSuccess(rst, (data)=>{
                        this.scene = data;
                    });
                });
                console.log("当前scene是：", this.scene);
            }
        },
        beforeCreate(){
        },
        created() {
            this.getScene();
        }
    }
</script>