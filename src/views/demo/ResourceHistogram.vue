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
    import ProjectModel from 'gantt-schedule/SchedulerPro/model/ProjectModel.js';
    import Toolbar from 'gantt-schedule/Core/widget/Toolbar.js';
    import ResourceHistogram from 'gantt-schedule/SchedulerPro/view/ResourceHistogram.js';
    import moment from 'moment';
    import $ from 'jquery';
    export default {
        name: "ResourceHistogram",
        components: {},
        data() {
            return {
                startDate: null,
                endDate: null
            };
        },
        computed: {},
        watch: {},
        methods: {
            mergeLines(mid, histogramins){
                let $tomergedele;
                let newSVg;
                $('.b-timeline-subgrid').each(function(ind,ele){
                    let $origressvgdom = $(ele).find("[data-id="+mid+"]");
                    if($origressvgdom.length){
                        if(!$tomergedele){
                            $tomergedele = $origressvgdom;
                        } else{
                            let mergedDom = $origressvgdom.find('svg')[0].innerHTML;
                            $tomergedele.find('svg').append(mergedDom);
                            newSVg = $tomergedele.find('svg')[0].outerHTML;
                            $tomergedele.find('svg').remove();
                            $tomergedele.find('.b-resourcehistogram-histogram').append(newSVg);
                            histogramins.destroy();
                        }
                    } 
                });
            },
            removeUnneededFunction(){
                let _self = this;
                let allhistogram = $("div[id*='b-resourcehistogram-']");  
                allhistogram.each(function(ind,ele){ 
                   $(ele).removeClass('b-split');//去掉分隔线
                   if(ind == 0) {
                       $(ele).find('.b-grid-header-scroller-locked').find('.b-level-0').removeClass('b-grid-header-resizable');
                       $(ele).find('.b-last-leaf').removeClass('b-sortable');
                   }
                   if(ind != (allhistogram.length - 1)) $(ele).find('.b-virtual-scroller').hide();
                   if(ind == allhistogram.length - 1){
                       _self.bindScrollIntoOne($(ele), allhistogram);
                   }
                })
            },
            bindScrollIntoOne(lastEle, allEle){
                let $lastScrollEleDom = lastEle.find('.b-timeline-subgrid');
                $lastScrollEleDom.scroll(function(){
                   let scrollLeftDis = $lastScrollEleDom.scrollLeft();
                   allEle.each(function(ind,ele){
                      if(ind != (allEle.length - 1)){
                        $(ele).find('.b-timeline-subgrid').scrollLeft(scrollLeftDis);
                      } 
                   })
                })
            }
        },
        created() {},
        mounted() {
            // let project = window.project = new ProjectModel({
            //     transport: {
            //         load: {
            //             url: 'data/histogramonly.json'
            //         }
            //     },
            //     autoLoad: true
            // });
            let _self = this;
            let calendarsData = [{
                "id"        : "weekends",
                "name"      : "Weekends",
                "intervals" : [
                    {
                        "recurrentStartDate" : "on Sat at 0:00",
                        "recurrentEndDate"   : "on Mon at 0:00",
                        "isWorking"          : true
                    }
                ]
            }];
            let resourcesData = [{
                "id"   : "r1",
                "name" : "普通数值型资源"
            }];

            let eventsData = [
            {
                "id"        : 1,
                "startDate" : "2020-04-27",
                "duration"  : 0.4,
                "name"      : "Conference"
            },
            {
                "id"        : 16,
                "startDate" : "2020-04-28",
                "duration"  : 0.8,
                "name"      : "Conference1"
            },
            {
                "id"        : 17,
                "startDate" : "2020-04-29",
                "duration"  : 0.6,
                "name"      : "Conference2"
            },
            {
                "id"        : 18,
                "startDate" : "2020-04-30",
                "duration"  : 0.4,
                "name"      : "Conference3"
            },
            {
                "id"         : 2,
                "startDate"  : "2020-04-28",
                "endDate"    : "2020-04-30",
                "name"       : "Prototype"
            },
            {
                "id"         : 3,
                "duration"   : 1,
                "name"       : "Test"
            },
            {
                "id"         : 4,
                "duration"   : 2,
                "name"       : "Manufacture"
            },
            {
                "id"         : 5,
                "startDate"  : "2020-04-29",
                "duration"   : 3,
                "name"       : "Brainstorm"
            },
            {
                "id"         : 6,
                "startDate"  : "2020-04-27",
                "duration"   : 7,
                "name"       : "Maintenance"
            },
            {
                "id"         : 7,
                "startDate"  : "2020-04-27",
                "duration"   : 0,
                "name"       : "Design"
            },
            {
                "id"         : 8,
                "duration"   : 0,
                "name"       : "Build"
            },
            {
                "id"         : 9,
                "duration"   : 0,
                "name"       : "Sell"
            },
            {
                "id"         : 10,
                "startDate"  : "2020-05-01",
                "duration"   : 1,
                "name"       : "Survey"
            },
            {
                "id"        : 11,
                "startDate" : "2020-05-05",
                "duration"  : 0.1,
                "name"      : "Conference"
            },
            {
                "id"         : 12,
                "startDate"  : "2020-05-04",
                "duration"   : 0.1,
                "name"       : "Brainstorm"
              
            },
            {
                "id"         : 13,
                "startDate"  : "2020-05-05",
                "duration"   : 0.1,
                "name"       : "Design"
                
            },
            {
                "id"         : 14,
                "duration"   : 3,
                "name"       : "Build"
               
            },
            {
                "id"         : 15,
                "startDate"  : "2020-05-06",
                "duration"   : 3,
                "name"       : "Prototype"
            }    
            ];

            let assignmentsData = [
            {
                "id"       : 1,
                "resource" : "r1",
                "event"    : 1
            },
            {
                "id"       : 111,
                "resource" : "r1",
                "event"    : 16
            },
            {
                "id"       : 112,
                "resource" : "r1",
                "event"    : 17
            },
            {
                "id"       : 113,
                "resource" : "r1",
                "event"    : 18
            },
            {
                "id"       : 2,
                "resource" : "r2",
                "event"    : 1
            },
            {
                "id"       : 3,
                "resource" : "r8",
                "event"    : 1
            },
            {
                "id"       : 4,
                "resource" : "r2",
                "event"    : 2
            },
            {
                "id"       : 5,
                "resource" : "r4",
                "event"    : 3
            },
            {
                "id"       : 6,
                "resource" : "r5",
                "event"    : 4
            },
            {
                "id"       : 7,
                "resource" : "r6",
                "event"    : 5
            },
            {
                "id"       : 8,
                "resource" : "r7",
                "event"    : 5
            },
            {
                "id"       : 9,
                "resource" : "r9",
                "event"    : 5
            },
            {
                "id"       : 10,
                "resource" : "r10",
                "event"    : 6
            },
            {
                "id"       : 11,
                "resource" : "r3-1",
                "event"    : 7
            },
            {
                "id"       : 12,
                "resource" : "r3-1",
                "event"    : 8
            },
            {
                "id"       : 13,
                "resource" : "r3-1",
                "event"    : 9
            },
            {
                "id"       : 31,
                "resource" : "r3-2",
                "event"    : 7
            },
            {
                "id"       : 32,
                "resource" : "r3-2",
                "event"    : 8
            },
            {
                "id"       : 33,
                "resource" : "r3-2",
                "event"    : 9
            },
            {
                "id"       : 14,
                "resource" : "r7",
                "event"    : 10
            },
            {
                "id"       : 15,
                "resource" : "r4",
                "event"    : 11
            },
            {
                "id"       : 16,
                "resource" : "r6",
                "event"    : 11
            },
            {
                "id"       : 17,
                "resource" : "r9",
                "event"    : 11
            },
            {
                "id"       : 18,
                "resource" : "r1",
                "event"    : 12
            },
            {
                "id"       : 19,
                "resource" : "r7",
                "event"    : 12
            },
            {
                "id"       : 20,
                "resource" : "r8",
                "event"    : 12
            },
            {
                "id"       : 21,
                "resource" : "r7",
                "event"    : 13
            },
            {
                "id"       : 22,
                "resource" : "r8",
                "event"    : 14
            },
            {
                "id"       : 23,
                "resource" : "r2",
                "event"    : 15
            }
            ];

            let project = {
                calendar : "weekends",
                eventsData: eventsData,
                resourcesData: resourcesData,
                calendarsData: calendarsData,
                assignmentsData: assignmentsData
            }
            const histogram = window.histogram = new ResourceHistogram({
                    project,
                    startDate         : new Date(2020, 3, 19),
                    endDate           : new Date(2020, 4, 15),
                    appendTo          : 'container',
                    rowHeight         : 180,
                    autoHeight        : true,
                    showBarTip        : false,
                    showBarText       : false,
                    zoomOnTimeAxisDoubleClick: false,
                    listeners:{
                        transitionend(){
                            console.log('is everything ok1 ？');
                            let dateObj = histogram.taskStore.getTotalTimeSpan();
                            _self.startDate = dateObj.startDate;
                            _self.endDate = dateObj.endDate;
                            histogram.timeAxis.setTimeSpan(_self.startDate, _self.endDate);
                        }
                    },
                    viewPreset: {
                        base: 'weekAndDay',
                        tickWidth  : 54,
                    },
                    customScalePoints       : [
                        {
                            value: 0,
                            text: 0 + '焦耳'
                        },
                        {
                            value : 3,
                            text: 400 + '焦耳'
                        },
                        {
                            value : 6,
                            text  : 800 + '焦耳'
                        },
                        {
                            value : 9,
                            text  : 1200 + '焦耳'
                        },
                        {
                            value : 12,
                            text  : 1600 + '焦耳'
                        },
                        {
                            value : 15,
                            text  : 2000 + '焦耳'
                        },
                        {
                            value : 18,
                            text  : 2400 + '焦耳'
                        },
                        {
                            value : 21,
                            text  : 2800 + '焦耳'
                        },
                        {
                            value : 24,
                            text  : 3200 + '焦耳',
                            unit: 'hour'
                        }
                    ],
                    columns           : [
                        {
                            type  : 'resourceInfo',
                            width : 150,
                            showEventCount    : false,
                            showImage: false,
                            field : 'name',
                            text  : '资源',
                            enableHeaderContextMenu: false,
                            sortable:false,
                            enableCellContextMenu:false
                        }
                    ]
            });

            let project1 = window.project1 = new ProjectModel({
                transport: {
                    load: {
                        url: 'data/histogramonly1.json'
                    }
                },
                autoLoad: true
            });
            const histogram1 = window.histogram1 = new ResourceHistogram({
                    project: project1,
                    startDate         : new Date(2020, 3, 19),
                    endDate           : new Date(2020, 4, 15),
                    appendTo          : 'container',
                    rowHeight         : 60,
                    autoHeight        : true,
                    showBarTip        : false,
                    hideHeaders:      true,
                    showBarText       : false,
                    zoomOnTimeAxisDoubleClick: false,
                    listeners:{
                        resumerefresh(){
                            console.log('is everything ok2 ？');
                            let dateObj = histogram1.taskStore.getTotalTimeSpan();
                            _self.startDate = dateObj.startDate;
                            _self.endDate = dateObj.endDate;
                            histogram1.timeAxis.setTimeSpan(_self.startDate, _self.endDate);
                        }
                    },
                    viewPreset: {
                        base: 'weekAndDay',
                        tickWidth  : 54,
                    },
                    customScalePoints       : [
                        {
                            value: 0,
                            text: '未占用'
                        },
                        {
                            value : 24,
                            text: '占用',
                            unit: 'hour'
                        }
                    ],
                    columns           : [
                        {
                            type  : 'resourceInfo',
                            width : 150,
                            showEventCount    : false,
                            showImage: false,
                            field : 'name',
                            text  : '资源',
                            enableHeaderContextMenu: false,
                            sortable:false,
                            enableCellContextMenu:false
                        }
                    ]
            });

            let project2 = window.project2 = new ProjectModel({
                transport: {
                    load: {
                        url: 'data/histogramonly2.json'
                    }
                },
                autoLoad: true
            });
            const histogram2 = window.histogram2 = new ResourceHistogram({
                    project: project2,
                    startDate         : new Date(2020, 3, 19),
                    endDate           : new Date(2020, 4, 15),
                    appendTo          : 'container',
                    rowHeight         : 100,
                    autoHeight        : true,
                    showBarTip        : false,
                    hideHeaders:      true,
                    showBarText       : false,
                    zoomOnTimeAxisDoubleClick: false,
                    listeners:{
                        resumerefresh(){
                            console.log('is everything ok3 ？');
                            let dateObj = histogram2.taskStore.getTotalTimeSpan();
                            _self.startDate = dateObj.startDate;
                            _self.endDate = dateObj.endDate;
                            histogram2.timeAxis.setTimeSpan(_self.startDate, _self.endDate);
                        }
                    },
                    viewPreset: {
                        base: 'weekAndDay',
                        tickWidth  : 54,
                    },
                    customScalePoints       : [
                        {
                            value: 0,
                            text: '未占用'
                        },
                        {
                            value: 6,
                            text: '状态A'
                        },
                        {
                            value: 12,
                            text: '状态B'
                        },
                        {
                            value: 18,
                            text: '状态C'
                        },
                        {
                            value : 24,
                            text: '状态D',
                            unit: 'hour'
                        }
                    ],
                    columns           : [
                        {
                            type  : 'resourceInfo',
                            width : 150,
                            showEventCount    : false,
                            showImage: false,
                            field : 'name',
                            text  : '资源',
                            enableHeaderContextMenu: false,
                            sortable:false,
                            enableCellContextMenu:false
                        }
                    ]
            });
            

            let project3 = window.project3 = new ProjectModel({
                transport: {
                    load: {
                        url: 'data/histogramonly4.json'
                    }
                },
                autoLoad: true
            });

            let mergeResid = 'rr1';  //状态型资源merge多条曲线
            const histogram3 = window.histogram3 = new ResourceHistogram({
                    project: project3,
                    startDate         : new Date(2020, 3, 19),
                    endDate           : new Date(2020, 4, 15),
                    appendTo          : 'container',
                    rowHeight         : 100,
                    autoHeight        : true,
                    showBarTip        : false,
                    hideHeaders:      true,
                    showBarText       : false,
                    zoomOnTimeAxisDoubleClick: false,
                    viewPreset: {
                        base: 'weekAndDay',
                        tickWidth  : 54,
                    },
                    listeners:{
                        resumerefresh(){
                            let dateObj = histogram3.taskStore.getTotalTimeSpan();
                            console.log('task store ? ', histogram3.taskStore);
                            _self.startDate = dateObj.startDate;
                            _self.endDate = dateObj.endDate;
                            histogram3.timeAxis.setTimeSpan(_self.startDate, _self.endDate);
                            setTimeout(()=>{
                              console.log('is everything ok4 ？');
                              _self.mergeLines(mergeResid,histogram3);
                              _self.removeUnneededFunction();
                            },100);
                        },
                    },
                    customScalePoints       : [
                        {
                            value: 0,
                            text: '未占用'
                        },
                        {
                            value: 6,
                            text: '状态A'
                        },
                        {
                            value: 12,
                            text: '状态B'
                        },
                        {
                            value: 18,
                            text: '状态C'
                        },
                        {
                            value : 24,
                            text: '状态D',
                            unit: 'hour'
                        }
                    ],
                    columns           : [
                        {
                            type  : 'resourceInfo',
                            width : 150,
                            showEventCount    : false,
                            showImage: false,
                            field : 'name',
                            text  : '资源',
                            enableHeaderContextMenu: false,
                            sortable:false,
                            enableCellContextMenu:false
                        }
                    ]
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

    /deep/ .b-virtual-scroller::-webkit-scrollbar-thumb{
        background-color: #d1d1d1 !important;
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