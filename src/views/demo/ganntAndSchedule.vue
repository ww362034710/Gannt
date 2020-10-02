<template>
    <div id="container">

    </div>
</template>

<script>
    import 'bryntum-gantt/gantt.stockholm.css';
    import 'bryntum-gantt/myProject.css';
    import Splitter from 'gantt-schedule/Core/widget/Splitter.js';
    import WidgetHelper from 'gantt-schedule/Core/helper/WidgetHelper.js';
    import Gantt from 'gantt-schedule/Gantt/view/Gantt.js';
    import SchedulerPro from 'gantt-schedule/SchedulerPro/view/SchedulerPro.js';
    import ProjectModel from 'gantt-schedule/Gantt/model/ProjectModel.js';
    import 'gantt-schedule/Scheduler/column/ResourceInfoColumn.js';
    import 'gantt-schedule/Gantt/column/ResourceAssignmentColumn.js';
    import 'gantt-schedule/Gantt/feature/Labels.js';
    import { TimeAxis } from "gantt-schedule/Scheduler/data/TimeAxis";
    import LocaleManager from 'gantt-schedule/Core/localization/LocaleManager.js';
    import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
    export default {
        name: 'ganntAndSchedule',

        components: {

        },

        data() {
            return {
                schedulerInstance: null
            }
        },
        computed: {
            schedulerEngine() {
                console.warn('schedulerEngine is deprecated. Use schedulerInstance instead.')
                return this.schedulerInstance;
            }
        },
        mounted() {
            // //load scheduler instance
            // LocaleManager.registerLocale('Cn', { locale: Cn });
            // LocaleManager.locale = Cn;
            const project = window.project = new ProjectModel({
                startDate : '2019-01-16',
                endDate   : '2019-02-13',

                // General calendar is used by default
                calendar : 'general',

                transport : {
                    load : {
                        url : 'data/launch-saas.json'
                    }
                },
                autoLoad : true
            });

            const gantt = new Gantt({
                project,

                appendTo : 'container',
                flex     : '1 1 65%',

                features : {
                    labels : {
                        left : {
                            field  : 'name',
                            editor : {
                                type : 'textfield'
                            }
                        }
                    }
                },

                viewPreset  : 'weekAndDay',
                columnLines : true,

                columns : [
                    { type : 'name', width : 280 },
                    { type : 'resourceassignment', text : 'Assigned Resources', width : 170 }
                ],

                startDate : '2019-01-11'
            });

            new Splitter({
                appendTo : 'container'
            });

            const scheduler = new SchedulerPro({
                project,

                appendTo            : 'container',
                minHeight           : '20em',
                flex                : '1 1 35%',
                partner             : gantt,
                rowHeight           : 45,
                eventColor          : 'gantt-green',
                useInitialAnimation : false,

                resourceImagePath : 'images/users/',

                features : {
                    dependencies : true,
                    percentBar   : true
                },

                columns : [
                    {
                        type           : 'resourceInfo',
                        field          : 'name',
                        text           : 'Resource',
                        showEventCount : false,
                        width          : 280
                    },
                    {
                        text     : 'Assigned tasks',
                        field    : 'events.length',
                        width    : 170,
                        editor   : false,
                        renderer : ({ value }) => `${value} task${value !== 1 ? 's' : ''}`
                    }
                ]
            });
        },
        beforeDestroy() {
            if (this.schedulerInstance) this.schedulerInstance.destroy();
        }
    }
</script>

<style lang="scss">
    #container {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        height: 100%;
        background: linear-gradient(to bottom , #001825, #00667B);
    }

    .b-schedulerpro-container {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
    }
</style>