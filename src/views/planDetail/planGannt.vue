<template>
    <div id="container">

    </div>
</template>

<script>
    import 'bryntum-gantt/gantt.stockholm.css';
    import Gantt from 'gantt-schedule/Gantt/view/Gantt.js';
    import ProjectModel from 'gantt-schedule/Gantt/model/ProjectModel.js';
    import 'gantt-schedule/Scheduler/column/ResourceInfoColumn.js';
    import 'gantt-schedule/Gantt/column/ResourceAssignmentColumn.js';
    import 'gantt-schedule/Gantt/feature/Labels.js';
    import 'gantt-schedule/Gantt/feature/TaskEdit.js';
    import 'gantt-schedule/Gantt/feature/TaskContextMenu.js';
    import LocaleManager from 'gantt-schedule/Core/localization/LocaleManager.js';
    import 'gantt-schedule/Gantt/localization/Zh.js';
    import moment from 'moment';

    import { mapGetters, mapMutations } from 'vuex';

    import changeSceneData from '@mixins/changeSceneData';

    export default {
        name: 'planGannt',
        components: {

        },
        mixins: [ changeSceneData ],
        computed: {
            ...mapGetters('Scene', ['sceneList'])
        },
        data() {
            return {
                startDate: null,
                endDate: null,

                ganttData: []
            }
        },
        methods: {
            ...mapMutations('Scene', ['SET_SCENE']),
            // editActivity(param){
            //     this.$http.postBody("/bs/ns/plan/activity/edit",param);
            // }
        },
        mounted() {
            // 从数据副本中抽离甘特图数据.
            this.sceneList.forEach(scene => {
                if(scene.activity.startTime) {
                    this.ganttData.push({
                        id: scene.activity.id,
                        name: scene.activity.name,
                        manuallyScheduled: true,
                        duration: scene.activity.duration,
                        startDate: scene.activity.startTime.split(' ').shift()
                    });
                }
            });

            LocaleManager.applyLocale('Zh');
            const project = window.project = new ProjectModel({
                calendar : 'general',
                eventsData: this.ganttData
            });

            const gantt = new Gantt({
                project,

                appendTo : 'container',
                flex     : '1 1 65%',
                
                listeners:{
                    // catchAll(event) {
                    //     // Uncomment this line to log events being emitted to console
                    //     console.log('AAAAAAAAA : ' , event.type);
                    //     if(event.type == "projectrefresh"){
                    //         let dateObj = gantt.taskStore.getTotalTimeSpan();
                    //         if(!this.endDate){
                    //             this.startDate = dateObj.startDate;
                    //             this.endDate = dateObj.endDate;
                    //             gantt.timeAxis.setTimeSpan(this.startDate, this.endDate);
                    //         }
                    //     }
                    // },
                    projectrefresh(){
                        let dateObj = gantt.taskStore.getTotalTimeSpan();
                        if(!this.endDate){
                            this.startDate = dateObj.startDate;
                            this.endDate = dateObj.endDate;
                            gantt.timeAxis.setTimeSpan(this.startDate, this.endDate);
                        }
                    },

                    // 调整甘特图位置时同时修改数据副本.
                    afterTaskDrop(data){
                        console.log('source');
                        setTimeout(() => {
                            const taskIns = data.context.draggedRecords[0];
                            for(let i=0; i<this.sceneList.length; i++) {
                                    if(this.sceneList[i].activity.id === taskIns.id) {
                                        // 修改vuex中的数据副本.
                                        this.changeDataStore(taskIns.id, { startTime:  moment(taskIns.startDate).format('YYYY-MM-DD HH:mm:ss')});
                                        break;
                                    }
                                }
                        }, 100);
                        // setTimeout(()=>{
                        //     this.editActivity({id: taskins.id,name: taskins.name,duration:taskins.duration,endTime:moment(taskins.endDate).format('YYYY-MM-DD HH:mm:ss'),startTime:moment(taskins.startDate).format('YYYY-MM-DD HH:mm:ss')});
                        // },500);
                    },

                    // 调整甘特图大小时同时修改数据副本.
                    taskResizeEnd(data){
                        console.log('task');
                        if(data.changed) {
                            setTimeout(() => {
                                const taskIns = data.taskRecord._data;
                                for(let i=0; i<this.sceneList.length; i++) {
                                    if(this.sceneList[i].activity.id === taskIns.id) {
                                        // 修改vuex中的数据副本.
                                        this.changeDataStore(taskIns.id, { 
                                            duration: taskIns.duration,
                                            startTime:  moment(taskIns.startDate).format('YYYY-MM-DD HH:mm:ss')
                                        });
                                        break;
                                    }
                                }
                            }, 100);

                            // setTimeout(()=>{
                            //     let taskins = data.taskRecord._data;
                            //     this.editActivity({id: taskins.id,name: taskins.name,duration:taskins.duration,endTime:moment(taskins.endDate).format('YYYY-MM-DD HH:mm:ss'),startTime:moment(taskins.startDate).format('YYYY-MM-DD HH:mm:ss')});
                            // },500);
                        }
                    },
                    thisObj : this
                },
                features : {
                    // labels : {
                    //     left : {
                    //         field  : 'name',
                    //         editor : {
                    //             type : 'textfield'
                    //         }
                    //     }
                    // },
                    cellEdit:false,
                    taskEdit: false,
                    taskResize:{
                      showTooltip:false
                    },
                    taskTooltip: false,
                    taskDragCreate: false,
                    taskMenu:false,
                    taskContextMenu:false,
                    projectLines: false,
                    percentBar: false,
                    timeAxisHeaderMenu: false,
                    dependencies:false,
                    taskDrag:{
                      showTooltip:false
                    }
                },
                zoomOnTimeAxisDoubleClick: false,
                preventTooltipOnTouch: true,
                viewPreset: {
                    base: 'weekAndDay'
                } ,
                columnLines : true,
                columns : [
                    { type : 'name', text: '名称', width : 280 ,enableHeaderContextMenu: false,sortable:false,enableCellContextMenu:false}
                ],

                // startDate : '2019-01-11'
            });
        },
        beforeDestroy() {
            
        }
    }
</script>

<style lang="scss">
    #container {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        height: 88% !important;
    }
</style>