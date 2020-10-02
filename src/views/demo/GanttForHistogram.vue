<template>
    <div class="schedule-main">
        <div>
            <a-button type="primary" size="small" @click="handleSubmit()">测试</a-button>
        </div>
        <div id="container" class="scheduler"></div>
        <!-- <div id="gantt" class="gantt"></div> -->
    </div>
</template>

<script>
// This CSS must be imported here because it is in package
import 'major-schedulerpro/schedulerpro.stockholm.css';
import 'major-gantt/gantt.stockholm.css';

import { WidgetHelper, Splitter, SchedulerPro, ProjectModel, ResourceHistogram, Toolbar, LocaleManager, TimelineBase } from 'major-schedulerpro';
//甘特图
import { Gantt, LocaleManager as GanttLocale, ProjectModel as GanttProject } from 'major-gantt';

import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
import { parse } from 'path';

export default {
    name: "demoResourceHistogram",
    components: {},
    data() {
        return {

            images: require('@/assets/images/avatar.png'),
            project: null,//资源负荷数据
            scheduler: null,//资源负荷实例对象
            histogram: null,//资源冲突 实例对象
            gantt: null,//甘特图 实例对象
            ganttProject: null,//gantt  projectModel
        };
    },
    computed: {},
    watch: {},
    methods: {
        async init() {
            // //国际化
            this.setLocaleLang()
            // //获取资源负荷数据
            let data = await this.getProjectData()
            // // //加载数据
            //const { project } = this.getData(data.data.data)
            //甘特图
            this.ganttPro(data.data.data)
            // //加载资源负荷图
            // this.setSchedulerPro({ project: project })
            new Splitter({
                appendTo: 'container'
            });

            //资源冲突部分
            this.resourceHistogram(data.data.data)
            //底部操作栏
            // this.setBottomToolBar()

        },
        //资源负荷数据
        getData(data) {
            const project = new ProjectModel({
                resourcesData: data.resourcesData,
                eventsData: data.eventsData,
                assignmentsData: data.assignmentsData,
                dependenciesData: data.dependenciesData,
            })
            return { project: project }

        },
        //获取资源负荷数据
        getProjectData() {
            return this.$http.get('/gantt')
        },
        // 资源负荷
        setSchedulerPro({ project }) {
            this.scheduler = new SchedulerPro({
                appendTo: 'container',
                minHeight: '10em',
                flex: '1 1 50%',
                defaultResourceImageName: '/',//对应图片名称后缀
                rowHeight: 50,
                startDate: new Date(2020, 3, 26),
                endDate: new Date(2020, 4, 10),
                viewPreset: 'dayAndWeek',
                eventStyle: 'plain',
                tickSize: 70,
                columns: [
                    {
                        type: 'resourceInfo', showEventCount: true, showRole: true, editor: false, imagePath: this.images, showImage: true, text: '资源', field: 'name',
                    },
                    // { text: '城市', field: 'city', width: 90 }
                ],
                project
            });
        },
        //资源冲突部分
        resourceHistogram(data) {
            // //加载数据
            const { project } = this.getData(data)
            // TODO: this option should be collected from partner
            this.histogram = new ResourceHistogram({
                project, //数据
                hideHeaders: false,
                startDate: new Date(2020, 3, 26),
                endDate: new Date(2020, 4, 10),
                // partner: this.gantt, //
                appendTo: 'container',
                rowHeight: 50,
                minHeight: '10em',
                flex: '1 1 50%',
                showBarTip: true,
                showBarText: true,
                autoHeight: true,
                // getBarText: (datum) => {
                //     return datum.effort ? new Date(datum.tick.startDate).getDate() : null;
                // },
                columns: [{
                    type: 'resourceInfo',
                    text: '资源',
                    field: 'name',
                    // flex: 1,
                    width: 160,
                    showImage: false,
                    showEventCount: false,
                    imagePath: ''
                },]
            });
        },
        //gantt projectModel
        getGanttProject(data) {
            return new GanttProject(data)
        },
        //初始化gantt
        ganttPro(data) {
            this.ganttProject = this.getGanttProject(data)
            this.gantt = new Gantt({
                project: this.ganttProject,
                appendTo: 'container',
                resourceImageFolderPath: '../_shared/images/users/',
                startDate: new Date(2020, 3, 26),
                endDate: new Date(2020, 4, 10),
                columns: [{ text: '名称', type: "name", field: "name", width: 250 }],
                subGridConfigs: {
                    locked: {
                        // flex: 3
                        width: 200
                    },
                    // normal: {
                    //     flex: 4
                    // }
                },
                listeners: {
                    catchAll: event => {
                        if (event.type === 'rendertask') {
                        }
                    },
                },
                columnLines: true,
                taskRenderer({ taskRecord }) {
                    if (taskRecord.isLeaf && !taskRecord.isMilestone) {
                        return taskRecord.name + " 完成(" + taskRecord.percentDone + "%)";
                    }
                }
            });
        },
        //国际化
        setLocaleLang() {
            //甘特图国际化
            GanttLocale.registerLocale('Cn', { locale: Cn });
            GanttLocale.locale = Cn;
            //资源负荷图国际化
            LocaleManager.registerLocale('Cn', { locale: Cn });
            LocaleManager.locale = Cn;
        },
        //底部操作栏
        setBottomToolBar() {
            new Toolbar({
                appendTo: "container",
                cls: 'histogram-toolbar',
                items: [{
                    type: 'checkbox',
                    ref: 'showBarText',
                    text: '资源负荷文本&emsp;',
                    tooltip: '',
                    checked: false,
                    onAction: ({ source }) => {
                        this.histogram.showBarText = source.checked;
                    }
                },
                {
                    type: 'checkbox',
                    ref: 'showMaxEffort',
                    text: '资源分配曲线&emsp;',
                    tooltip: '',
                    checked: true,
                    onAction: ({ source }) => {
                        this.histogram.showMaxEffort = source.checked;
                    }
                },
                {
                    type: 'checkbox',
                    ref: 'showBarTip',
                    text: 'Enable bar toolti ',
                    tooltip: '',
                    checked: true,
                    onAction: ({ source }) => {
                        this.histogram.showBarTip = source.checked;
                    }
                }
                ]
            });
        },
        //获取gantt 数据
        getGanttData() {
            //获取gantt 数据
            let taskData = this.gantt.taskStore//ganttProject
            let ganttData = this.gantt.taskStore.records
            let data = ganttData.map(v => {
                return {
                    id: v.id,
                    name: v.name,
                    startDate: v.startDate,
                    endDate: v.endDate
                }
            })
            console.log(ganttData)
        },
        //重新实例化资源冲突图
        async  handleSubmit() {
            this.getGanttData()
            let data = await this.getProjectData()
            //添加一个事件
            data.data.data.eventsData.push({
                "id": 4,
                "startDate": "2020-04-29",
                "endDate": "2020-04-30",
                "name": "新增一个事件",
                "percentDone": 50,
                "iconCls": "b-fa b-fa-pen",
                "eventColor": "red"
            })
            let sourceData = ['r1', 'r2', 'r3'];
            let resourceData = "r1"
            let random = Math.floor(Math.random() * (3 - 0) + 0)
            resourceData = sourceData[random]
            data.data.data.assignmentsData.push({
                "id": 6,
                "resource": resourceData,
                "event": 4
            })
            this.histogram.destroy()
            this.resourceHistogram(data.data.data)
        }

    },
    created() {

    },
    mounted() {
        this.init()
    },
}
</script>
<style lang='scss' scoped>
.schedule-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    .scheduler {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
}
</style>