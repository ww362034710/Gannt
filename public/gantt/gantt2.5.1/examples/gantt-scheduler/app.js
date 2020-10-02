Ext.ns('App');
Ext.Loader.setConfig({
    enabled: true,
    disableCaching : false,
    paths   : {
        // 'Sch'   :ctx +  '/html/gantt/gantt-5.0.5/Sch',
        // 'Gnt'   :ctx +  '/html/gantt2.5.1/examples/gantt-scheduler/app',
        'Major'   :ctx +  '/html/gantt2.5.1/examples/gantt-scheduler/app',
        'Sch.locale'   :ctx +  '/html/gantt2.5.1/js/Sch/locale',
        'Gnt.locale'   :ctx +  '/html/gantt2.5.1/js/Gnt/locale'/*,
        'Ext.ux'       : '/static/extjs-6.2/packages/ux/classic/src'*/
    }
});
Ext.Loader.setPath('MyApp', '/html/gantt2.5.1/examples/gantt-scheduler/app');
Ext.require(['MyApp.view.Viewport']);
Ext.require('Gnt.locale.Zh');
Ext.application({
    name : 'MyApp',
    appFolder: ctx + "/html/gantt2.5.1/examples/gantt-scheduler/app",
    // autoCreateViewport : true,
    controllers : [
        'Navigation',
        'Settings'
    ],
    launch : function() {
        if (Ext.isIE && Ext.ieVersion < 9) {
            Ext.Msg.alert('Outdated browser detected', 'This sample only works in modern browsers (IE9+)');
            return;
        }
        var viewport = new MyApp.view.Viewport();
        // // viewport created here to enable usage in kitchensink (has its own viewport)
        var panel = Ext.create('Ext.panel.Panel', {
            layout : 'border',
            renderTo:"ganttContainer",
            // renderTo: Ext.getBody(),
            width:"100%",
            height:"100%",
            items  : [viewport]
        });

    }
});
