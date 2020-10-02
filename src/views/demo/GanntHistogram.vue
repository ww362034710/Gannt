<template>
    <div id="container"></div>
</template>

<script>
    import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
    import 'bryntum-schedulerpro/schedulerpro.stockholm.css';
    import 'bryntum-gantt/gantt.stockholm.css';
    import WidgetHelper from 'gantt-schedule/Core/helper/WidgetHelper.js';
    import Splitter from 'gantt-schedule/Core/widget/Splitter.js';
    import 'gantt-schedule/Grid/feature/Stripe.js';

    import SchedulerPro from 'gantt-schedule/SchedulerPro/view/SchedulerPro.js';
    import 'gantt-schedule/Scheduler/column/ResourceInfoColumn.js';
    import ProjectModel from 'gantt-schedule/Gantt/model/ProjectModel.js';
    import Toolbar from 'gantt-schedule/Core/widget/Toolbar.js';
    import ResourceHistogram from 'gantt-schedule/SchedulerPro/view/ResourceHistogram.js';
    import Gantt from 'gantt-schedule/Gantt/view/Gantt.js';
    import { TimeAxis } from "gantt-schedule/Scheduler/data/TimeAxis";
    import 'gantt-schedule/Gantt/feature/Labels.js';
    import 'gantt-schedule/Gantt/column/ResourceAssignmentColumn.js';

    export default {
        name: "GanntHistogram",
        components: {},
        data() {
            return {

            };
        },
        computed: {},
        watch: {},
        methods: {},
        created() {

        },
        mounted() {
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
            // const gantt = new Gantt({
            //     project,

            //     appendTo : 'container',
            //     flex     : '1 1 65%',

            //     features : {
            //         labels : {
            //             left : {
            //                 field  : 'name',
            //                 editor : {
            //                     type : 'textfield'
            //                 }
            //             }
            //         }
            //     },

            //     viewPreset  : 'weekAndDay',
            //     columnLines : true,

            //     columns : [
            //         { type : 'name', width : 280 },
            //         { type : 'resourceassignment', text : 'Assigned Resources', width : 170 }
            //     ],

            //     startDate : '2019-01-11'
            // });
            // new Splitter({
            //     appendTo: 'container'
            // });
            const histogram = window.histogram = new ResourceHistogram({
                project,
                hideHeaders: false,
                appendTo: 'container',
                //partner: gantt,
                rowHeight: 50,
                flex: '1 1 50%',
                showBarTip: true,
                columns: [{
                    flex: 1,
                    field: 'name'
                }]
            });
        },
    }
</script>
<style lang='scss' scoped>
    #container {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        height: 100%;
    }

    /deep/ .b-grid-body-container {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
    }

    .histogram-toolbar {
        justify-content: flex-end;
        min-height: 60px;
        max-height: 60px;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.08);
    }

    .histogram-toolbar .b-checkbox {
        margin-right: 1em;
    }
</style>