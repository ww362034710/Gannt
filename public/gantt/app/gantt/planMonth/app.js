/**
 * 月事件任务规划
 * 带资源冲突检测
 */
Ext.ns('PlanMonth');
Ext.Loader.setConfig({
    enabled: true,
    disableCaching : false,
    paths   : {
        'PlanMonth'   :ctx +  '/gantt/app/gantt/planMonth',
        'Common'   :ctx +  '/gantt/app/gantt/common',
        'Major'   :ctx +  '/gantt/gantt-major',
        'Sch.locale'   :ctx +  '/gantt/gantt2.5.1/js/Sch/locale',
        'Gnt.locale'   :ctx +  '/gantt/gantt2.5.1/js/Gnt/locale'
    }
});

Ext.require('Gnt.locale.Zh');

Ext.application({
    name: 'PlanMonth',
    appFolder: ctx + "/gantt/app/gantt/planMonth",
    requires                : [
        'PlanMonth.view.Viewport'
    ],
    launch: function () {
        if (Ext.isIE && Ext.ieVersion < 9) {
            Ext.Msg.alert('不支持的浏览器', '仅支持IE9以上浏览器');
            return;
        }
        var viewport = new PlanMonth.view.Viewport();
        var panel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            renderTo: 'ganttContainer',
            width: "100%",
            height: "100%",
            items: [viewport]
        });

    }
});