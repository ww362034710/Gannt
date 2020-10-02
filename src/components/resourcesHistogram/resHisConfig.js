import { WidgetHelper, Splitter, SchedulerPro, ProjectModel, Toolbar, ResourceHistogram } from 'major-schedulerpro';
import shared from 'bryntum-resources';
/* eslint-disable no-new */
//region Data
//自定义 工具栏按钮
WidgetHelper.append([{
    type: 'button',
    ref: 'zoomInButton',
    cls: 'b-raised',
    color: 'b-orange',
    icon: 'b-icon b-icon-search-plus',
    tooltip: '缩小',
    onAction: () => scheduler.zoomIn()
}, {
    type: 'button',
    ref: 'zoomOutButton',
    cls: 'b-raised',
    color: 'b-orange',
    icon: 'b-icon b-icon-search-minus',
    tooltip: '放大',
    onAction: () => scheduler.zoomOut()
}], { insertFirst: document.getElementById('tools') || document.body });
//加载数据
const project = window.project = new ProjectModel({
    transport: {
        load: {
            url: 'data/data.json'
        }
    },
    autoLoad: true
});

const scheduler = new SchedulerPro({
    appendTo: 'container',
    minHeight: '10em',
    flex: '1 1 50%',
    startDate: new Date(2020, 3, 26),
    endDate: new Date(2020, 4, 10),
    viewPreset: 'dayAndWeek',
    eventStyle: 'plain',
    tickSize: 70,
    columns: [
        { type: 'resourceInfo', text: '姓名', field: 'name', width: 130, imagePath: '../_shared/images/users/' },
        { text: '城市', field: 'city', width: 90 }
    ],
    project
});

new Splitter({
    appendTo: 'container'
});


//资源冲突
const histogram = window.histogram = new ResourceHistogram({
    // TODO: this option should be collected from partner
    project, //数据
    hideHeaders: false,
    partner: scheduler, //
    appendTo: 'container',
    rowHeight: 60,
    minHeight: '10em',
    flex: '1 1 50%',
    showBarTip: true,
    autoHeight: true,
    //

    //
    // getBarText: (datum) => {
    //     return datum.effort ? new Date(datum.tick.startDate).getDate() : null;
    // },
    ///
    columns: [{
        type: 'resourceInfo',
        text: '姓名',
        field: 'name',
        flex: 1,
        showEventCount: false,
        imagePath: ''
    }, ]
});
//底部复选框
new Toolbar({
    appendTo: this.$el,
    cls: 'histogram-toolbar',
    items: [{
            type: 'checkbox',
            ref: 'showBarText',
            text: 'Show bar texts（文字）',
            tooltip: 'Check to show resource allocation in the bars',
            checked: false,
            onAction({ source }) {
                histogram.showBarText = source.checked;
            }
        },
        {
            type: 'checkbox',
            ref: 'showMaxEffort',
            text: 'Show max allocation',
            tooltip: 'Check to display max resource allocation line',
            checked: true,
            onAction({ source }) {
                histogram.showMaxEffort = source.checked;
            }
        },
        {
            type: 'checkbox',
            ref: 'showBarTip',
            text: 'Enable bar tooltip',
            tooltip: 'Check to show tooltips when moving mouse over bars',
            checked: true,
            onAction({ source }) {
                histogram.showBarTip = source.checked;
            }
        }
    ]
});