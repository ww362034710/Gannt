<template>
    <div id="container"></div>
</template>

<script>
    import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
    // import 'bryntum-schedulerpro/schedulerpro.stockholm.css'
    import 'bryntum-gantt/gantt.stockholm.css';
    import 'bryntum-gantt/myProject.css';
    import Splitter from 'gantt-schedule/Core/widget/Splitter.js';
    import WidgetHelper from 'gantt-schedule/Core/helper/WidgetHelper.js';
    import Gantt from 'gantt-schedule/Gantt/view/Gantt.js';
    import SchedulerPro from 'gantt-schedule/SchedulerPro/view/SchedulerPro.js';
    import Scheduler from 'gantt-schedule/Scheduler/view/Scheduler.js';
    import ProjectModel from 'gantt-schedule/Gantt/model/ProjectModel.js';
    import 'gantt-schedule/Scheduler/column/ResourceInfoColumn.js';
    import 'gantt-schedule/Gantt/column/ResourceAssignmentColumn.js';
    import 'gantt-schedule/Gantt/feature/Labels.js';
    import 'gantt-schedule/Scheduler/feature/EventDragCreate.js';
    import 'gantt-schedule/Scheduler/feature/EventDragSelect.js';
    import EventDrag from 'gantt-schedule/Scheduler/feature/EventDrag.js';
    import 'gantt-schedule/Grid/feature/Stripe.js';
    import ResourceHistogram from 'gantt-schedule/SchedulerPro/view/ResourceHistogram.js';

    export default {
        name: "Mosic",
        components: {},
        data() {
            return {
                startDate: null,
                endDate: null
            };
        },
        computed: {},
        watch: {},
        methods: {},
        created() {},
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

            const gantt = new Gantt({
                project,

                appendTo : 'container',
                flex     : '1 1 65%',
                rowHeight           : 40,
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

                viewPreset  : 'weekAndDayLetter',
                columnLines : true,

                columns : [
                    { type : 'name', width : 280 },
                    { type : 'resourceassignment', text : 'Assigned Resources', width : 170 }
                ],

                startDate : '2019-01-11',
                listeners:{
                    catchAll(event) {
                        // Uncomment this line to log events being emitted to console
                        //console.log('AAAAAAAAA : ' , event.type);
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
            });

            new Splitter({
                appendTo : 'container'
            });

            const scheduler = new SchedulerPro({
                project,

                appendTo            : 'container',
                minHeight           : '10em',
                flex                : '1 1 35%',
                partner             : gantt,
                rowHeight           : 40,
                eventColor          : 'gantt-green',
                useInitialAnimation : false,
                hideHeaders : true,
                resourceImagePath : 'images/users/',

                features : {
                    dependencies : true,
                    scheduleTooltip: false,
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
            new Splitter({
                appendTo : 'container'
            });
            const histogram = window.histogram = new ResourceHistogram({
                project,
                hideHeaders: true,
                partner: scheduler,
                appendTo: 'container',
                rowHeight: 40,
                minHeight: '10em',
                flex: '1 1 50%',
                showBarTip: false,
                columns: [{
                    type: 'resourceInfo',
                    text: 'Name',
                    field: 'name',
                    flex: 1,
                    showEventCount: false,
                    imagePath: 'images/users/'
                }]
            });
            new Splitter({
                appendTo : 'container'
            });
            let scheduler3 = new SchedulerPro({
                ref: 'bottom-scheduler',
                appendTo: 'container',
                partner: scheduler,
                rowHeight           : 40,
                flex: '1 1 50%',
                hideHeaders : true,
                features: {
                    stripe: true,
                    sort: 'name',
                    scheduleTooltip: false,
                    eventDrag: {
                        // Allow drag outside of this Scheduler
                        constrainDragToTimeline: false
                    },
                    eventDragCreate: false,
                    eventDragSelect: true
                },

                columns: [{
                    type: 'resourceInfo',
                    imagePath: 'images/users/',
                    text: 'Stockholm office',
                    width: '15em'
                },
                {
                        text     : 'Assigned tasks',
                        field    : 'events.length',
                        width    : 170,
                        editor   : false,
                        renderer : ({ value }) => `${value} task${value !== 1 ? 's' : ''}`
                    }
                ],

                resources: [{
                        id: 11,
                        name: 'Angelo'
                    },
                    {
                        id: 12,
                        name: 'Gloria'
                    },
                    {
                        id: 13,
                        name: 'Madison'
                    },
                    {
                        id: 14,
                        name: 'Malik'
                    },
                    {
                        id: 15,
                        name: 'Mark'
                    },
                    {
                        id: 16,
                        name: 'Rob'
                    }
                ],
                events: [{
                        id: 11,
                        resourceId: 11,
                        name: 'Implement Feature X',
                        startDate: "2019-01-13",//"endDate": "2019-03-16",
                        duration: 7,
                        durationUnit: 'd'
                    },
                    {
                        id: 12,
                        resourceId: 12,
                        name: 'Refactoring',
                        startDate: "2019-01-13",
                        duration: 6,
                        durationUnit: 'd'
                    },
                    {
                        id: 13,
                        resourceId: 16,
                        name: 'Write application tests',
                        startDate: "2019-01-13",
                        duration: 8,
                        durationUnit: 'd'
                    }
                ]
            });


            // gantt.taskStore.on({
            //     change : ()=>{
            //         console.log('KKKKKKKKKKKKKKKKKKK', gantt.taskStore.getTotalTimeSpan());
            //     },
            //     thisObj : this
            // });
        },
    }
</script>
<style lang='scss' scoped>
    #container {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(to bottom , #001825, #00667B);
    }

    /deep/ .b-grid-body-container {
        width: 100%;
        height: 100%;
        background: transparent;
    }
</style>