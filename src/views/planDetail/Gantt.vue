<!--
 *- Gantt component
 -->
<template>
    <bryntum-gantt
        container          = "content"
        :viewPreset        = "viewPreset"
        :projectLinesBarFeature = "projectLinesBarFeature"
        :readOnly           = "readOnly"
        ref                = "gantt"
        :project           = "project"
        :columns           = "columns"
        :taskTooltipFeature = "draggable"
        :percentBarFeature = "draggable"
    />
</template>
<!-- :taskResizeFeature = "draggable" 
 :taskDragFeature   = "draggable"
 :taskContextMenuFeature = "draggable"
        :taskDragCreateFeature   = "draggable"
        :taskEditFeature = "draggable"
-->
<script>
    import BryntumGantt from 'bryntum-vue-shared/src/BryntumGantt.vue';
    import { ProjectModel,LocaleManager } from 'bryntum-gantt';
    import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
    export default {
        name : 'app-gantt',

        components : {
            BryntumGantt
        },

        created() {
            this.$eventBus.$on('onShowHeadersClick', this.handleShowHeaders);
            this.setLocaleLang();
        },

        data() {
            return {
                project: new ProjectModel({
                    autoLoad : true,
                    transport : {
                        load : {
                            url : 'data/timeranges.json'
                        }
                    }
                }),
                draggable: false,
                readOnly: false,
                projectLinesBarFeature: false,
                viewPreset: {
                    base: 'weekAndDay',
                    tickWidth  : 54,
                },
                columnLines : false,
                columns : [
                    { type : 'name',  text: '名字', field : 'name', width : 200,enableHeaderContextMenu: false,sortable:false,
                        enableCellContextMenu:false }
                ],
                listeners:{
                    catchAll(event) {
                        if(event.type == "transitionend"){
                            let dateObj = gantt.taskStore.getTotalTimeSpan();
                            if(!this.startDate){
                                this.startDate = dateObj.startDate;
                                this.endDate = dateObj.endDate;

                                gantt.timeAxis.setTimeSpan(this.startDate, this.endDate);
                            }
                            
                        }
                    },

                    thisObj : this
                }
            } // eo return from data
        }, // eo data

        methods : {
            //国际化
            setLocaleLang() {
                LocaleManager.registerLocale('Cn', { locale: Cn });
                LocaleManager.locale = Cn;
            },
            handleShowHeaders({source}) {
                //this.$refs.gantt.ganttInstance.features.timeRanges.disabled = !source.pressed;
            }
        }
    }
</script>

<!-- eof -->
