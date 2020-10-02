var msg = function(title, msg) {
    Ext.Msg.show({
        title: title,
        msg: msg,
        minWidth: 200,
        modal: true,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
    });
};
TaskPriority = {
    Low: 0,
    Normal: 1,
    High: 2
};
/*导入Project的弹出窗口*/
Ext.define('MyApp.view.MSProjectImportPanel', {
    //extend : 'Ext.form.Panel',
    extend : 'Ext.window.Window',
    width: 300,
    frame: true,
    title: '导入Project文件',
    bodyPadding: '10 10 0',
    layout : "fit",
    defaults: {
        anchor: '100%',
        allowBlank: false,
        msgTarget: 'side',
        labelWidth: 50
    },
    initComponent : function() {
        this.addEvents('dataavailable');
        var w = this;
        /*
         有一个非常奇怪的错误会导致以下的【导入Project】窗口运行错误。
         当新建了一个项目的时候，数据集为空。 这时候浏览器会报parentNode的错误。
         这时候你要是点击【导入Project】， 窗口不能展示
         */
        Ext.apply(this, {
            items:[new Ext.form.Panel({
                title: "表单",
                height: 120,
                width: 200,
                frame: true,
                collapsible: true,
                layout : "fit",
                items: [{
                    xtype: 'filefield',
                    id: 'form-file',
                    emptyText: '上传 .mpp 文件',
                    fieldLabel: '选择文件',
                    name: 'file',
                    buttonText: '选择文件',
                    buttonConfig: {
                        iconCls: 'upload-icon'
                    }
                }],
                buttons: [{
                    text: '上传',
                    handler: function(){
                        var panel = this.up('form');
                        var form = panel.getForm();
                        if(form.isValid()){
                            form.submit({
                                url: APIVAR.url.upload + '?pid=' + pid,
                                waitMsg: '正在加载数据...',
                                failure : function(form, action) {
                                    msg('上传出错', '请确认上传文件格式是否正确. 错误位置: ' + action.result.msg);
                                },
                                success: function(form, action) {
                                    //w.fireEvent('dataavailable', panel, action.result.data);
                                    location.reload() ;
                                }
                            });
                        }
                    }
                },
                    {
                        text: '重置',
                        handler: function() {
                            this.up('form').getForm().reset();
                        }
                    }]
            })]

        });

        this.callParent(arguments);
    }
});

Ext.define("MyApp.view.GanttToolbar", {
    extend      : 'Ext.Toolbar',
    alias       : 'widget.gantttoolbar',
    cls         : 'gantt-toolbar',
    fit:true,
    initComponent : function() {
        this.defaults = { scale : 'medium', scope : this };
        var taskStore = this.gantt.taskStore;
        var gantt = this.gantt;
        Ext.apply(this, {

            items :[{
                xtype: 'buttongroup',
                title: '视图',
                columns: 6,
                items: [
                    {
                        //iconCls: 'icon-prev',
                        text: '后退',
                        scope: gantt,
                        handler: function () {
                            gantt.shiftPrevious();
                        }
                    },
                    {
                        //iconCls: 'icon-next',
                        text: '前进',
                        scope: gantt,
                        handler: function () {
                            gantt.shiftNext();
                        }
                    },
                    {
                        text: '折叠所有',
                        iconCls: 'icon-collapseall',
                        scope: gantt,
                        handler: function () {
                            gantt.collapseAll();
                        }
                    },
                    {
                        text: '展开所有',
                        iconCls: 'icon-expandall',
                        scope: gantt,
                        handler: function () {
                            gantt.expandAll();
                        }
                    },
                    {
                        text: '全屏',
                        iconCls: 'icon-fullscreen',
                        disabled: !this._fullScreenFn,
                        handler: function () {
                            gantt.el.down('.x-panel-body').dom[this._fullScreenFn]();
                        },
                        scope: this
                    },
                    {
                        text: '合适屏幕',
                        iconCls: 'zoomfit',
                        handler: function () {
                            gantt.zoomToFit();
                        },
                        scope: gantt
                    }
                ]
            },
                {
                    xtype: 'buttongroup',
                    title: '缩放',
                    columns: 6,
                    items: [
                        {
                            text: '放大',
                            scope: gantt,
                            handler: function () {
                                gantt.zoomIn();
                            }
                        },
                        {
                            text: '缩小',
                            scope: gantt,
                            handler: function () {
                                gantt.zoomOut();
                            }
                        },
                        {
                            text: '6 周',
                            scope: gantt,
                            handler: function () {
                                var sp = this.taskStore.getTotalTimeSpan();
                                gantt.switchViewPreset('weekAndMonth', sp.start, sp.end);
                            }
                        },
                        {
                            text: '10 周',
                            scope: gantt,
                            handler: function () {
                                var sp = gantt.taskStore.getTotalTimeSpan();
                                this.switchViewPreset('weekAndDayLetter', sp.start, sp.end);
                            }
                        },
                        {
                            text: '1 年',
                            scope: gantt,
                            handler: function () {
                                var sp = gantt.taskStore.getTotalTimeSpan();
                                this.switchViewPreset('monthAndYear', sp.start, sp.end);
                            }
                        },
                        {
                            text: '5 年',
                            scope: gantt,
                            handler: function () {
                                var sp = this.taskStore.getTotalTimeSpan();

                                this.switchViewPreset('monthAndYear',  sp.start, sp.end);
                            }
                        }
                    ]
                },
                //编辑功能
                {
                    xtype: 'buttongroup',
                    title: '编辑',
                    columns: 3,
                    items: [
                        {
                            text: '添加任务',
                            //iconCls: 'icon-add',
                            scope: gantt,
                            handler: function () {
                                var original = gantt.getSelectionModel().selected.items[0];
                                var model = gantt.getTaskStore().model;

                                var newTask = new model({
                                    leaf : true
                                });

                                newTask.setPercentDone(0);
                                newTask.setName("新任务...");
                                //newTask.setStartDate((original && original.getStartDate()) || null);
                                ///newTask.setEndDate((original && original.getEndDate()) || null);
                                // newTask.setDuration((original && original.getDuration()) || null);
                                //newTask.setDurationUnit((original && original.getDurationUnit()) || 'd');

                                newTask.set(newTask.startDateField, (original && original.getStartDate()) || null);
                                newTask.set(newTask.endDateField, (original && original.getEndDate()) || null);
                                newTask.set(newTask.durationField, (original && original.getDuration()) || null);
                                newTask.set(newTask.durationUnitField, (original && original.getDurationUnit()) || 'd');

                                if (original) {
                                    original.addTaskBelow(newTask);
                                } else {
                                    gantt.taskStore.getRootNode().appendChild(newTask);
                                }
                            }

                        },
                        {
                            enableToggle: true,
                            id:"demo-readonlybutton",
                            scope: gantt,
                            text: '只读模式',
                            pressed: false,
                            handler: function () {
                                gantt.setReadOnly(Ext.getCmp("demo-readonlybutton").pressed);
                            }
                        }/*,
                        {
                            text: '任务降级',
                            //iconCls : 'indent',
                            scope: gantt,
                            handler: function () {
                                var sm = gantt.lockedGrid.getSelectionModel();
                                gantt.taskStore.indent(sm.getSelection());
                            }
                        },
                        {
                            text: '任务升级',
                            //iconCls : 'outdent',
                            scope: gantt,
                            handler: function () {
                                var sm = gantt.lockedGrid.getSelectionModel();
                                gantt.taskStore.outdent(sm.getSelection());
                            }
                        }*/, {
                            text: '保存修改',
                            //iconCls: 'icon-save',
                            scope: gantt,
                            handler: function () {
                                gantt.taskStore.sync({
                                    success:function(){

                                        Ext.MessageBox.alert("恭喜", "数据保存成功！");
                                    },
                                    failure:function(){

                                        Ext.MessageBox.alert("错误", "数据保存错误");
                                    }
                                });
                            }
                        }


                    ]
                },
                /* 解决工具条太长的问题
                 {
                 xtype: 'buttongroup',
                 title: '日程',
                 columns: 5,
                 defaults: { scale: "large" },
                 items: [{
                 text: '0%',
                 scope: this,
                 handler: function () {
                 this.applyPercentDone(0);
                 }
                 },
                 {
                 text: '25%',
                 scope: this,
                 handler: function () {
                 this.applyPercentDone(25);
                 }
                 },
                 {
                 text: '50%',
                 scope: this,
                 handler: function () {
                 this.applyPercentDone(50);
                 }
                 },
                 {
                 text: '75%',
                 scope: this,
                 handler: function () {
                 this.applyPercentDone(75);
                 }
                 },
                 {
                 text: '100%',
                 scope: this,
                 handler: function () {
                 this.applyPercentDone(100);
                 }
                 }
                 ]
                 },*/
                /*{
                    xtype: 'buttongroup',
                    title: '面板',
                    columns: 3,
                    defaults: { scale: "large" },
                    items: [{
                        text: '日历面板',
                        scope: this,
                        handler: function () {
                            var conf = {
                                calendar: gantt.taskStore.calendar
                            };

                            var editorWindow = new Gnt.widget.calendar.CalendarWindow(conf);
                            editorWindow.show();
                        }
                    },
                        {
                            text: '任务面板',
                            scope: this,
                            handler: function () {
                                var st = gantt.getView().getSelectionModel().getSelection();
                                if (st.length > 0) {
                                    gantt.taskEditor.showTask(st[0]);
                                } else {
                                    Ext.Msg.alert('提示', '请选择一个任务');
                                }
                            }
                        }/!*,{
                            text: '导入Project',
                            scope: this,
                            handler: function () {
                                var g = this;
                                var window =  new MyApp.view.MSProjectImportPanel({
                                    listeners : {
                                        dataavailable: function(form, data) {
                                            //msg('Success', 'Data from .mpp file loaded ');

                                            g.taskStore.setRootNode(data.tasks);
                                            g.resourceStore.loadData(data.resources);
                                            g.assignmentStore.loadData(data.assignments);
                                            g.dependencyStore.loadData(data.dependencies);

                                            var column,
                                                xtype;

                                            for (var i=0, l=data.columns.length; i<l; i++){

                                                xtype = data.columns[i].xtype;
                                                delete data.columns[i].xtype;

                                                column = Ext.widget(xtype, data.columns[i]);

                                                g.lockedGrid.headerCt.add(column);
                                            }
                                            g.lockedGrid.headerCt.remove(0);
                                            g.lockedGrid.getView().refresh();

                                            g.expandAll();

                                            var span = g.taskStore.getTotalTimeSpan();
                                            if (span.start && span.end) {
                                                g.setTimeSpan(span.start, span.end);
                                            }
                                        }
                                    }
                                });
                                window.show();
                            }
                        } *!/]
                },
                '->',
                {
                    xtype: 'buttongroup',
                    title: '可扩展功能',
                    columns: 4,
                    items: [
                        {
                            text: '关键路径高亮显示',
                            iconCls: 'togglebutton',
                            scope: gantt,
                            enableToggle: true,
                            handler: function (btn) {
                                var v = gantt.getSchedulingView();
                                if (btn.pressed) {
                                    v.highlightCriticalPaths(true);
                                } else {
                                    v.unhighlightCriticalPaths(true);
                                }
                            }
                        },
                        {
                            iconCls: 'action',
                            text: '高亮显示7天以上的任务',
                            scope: gantt,
                            handler: function (btn) {
                                gantt.taskStore.getRootNode().cascadeBy(function (task) {
                                    if (Sch.util.Date.getDurationInDays(task.get('StartDate'), task.get('EndDate')) > 7) {
                                        var el = this.getSchedulingView().getElementFromEventRecord(task);
                                        el && el.frame('lime');
                                    }
                                }, gantt);
                            }
                        },
                        {
                            iconCls: 'togglebutton',
                            text: '过滤: 进度小于30%的任务',
                            scope: this,
                            enableToggle: true,
                            toggleGroup: 'filter',
                            handler: function (btn) {
                                if (btn.pressed) {
                                    gantt.taskStore.filter(function (task) {
                                        return task.get('PercentDone') < 30;
                                    });
                                } else {
                                    gantt.taskStore.clearFilter();
                                }
                            }
                        },
                        {
                            iconCls: 'togglebutton',
                            text: '前置任务影响',
                            scope: gantt,
                            enableToggle: true,
                            handler: function (btn) {
                                gantt.setCascadeChanges(btn.pressed);
                            }
                        },
                        {
                            iconCls: 'action',
                            text: '滚动到最后一个任务',
                            scope: gantt,

                            handler: function (btn) {
                                var latestEndDate = new Date(0),
                                    latest;
                                gantt.taskStore.getRootNode().cascadeBy(function (task) {
                                    if (task.get('EndDate') >= latestEndDate) {
                                        latestEndDate = task.get('EndDate');
                                        latest = task;
                                    }
                                });
                                gantt.getSchedulingView().scrollEventIntoView(latest, true);
                            }
                        },
                        {
                            xtype: 'textfield',
                            emptyText: '按关键字查找',
                            scope: this,
                            width: 150,
                            enableKeyEvents: true,
                            listeners: {
                                keyup: {
                                    fn: function (field, e) {
                                        var value = field.getValue();

                                        if (value) {
                                            gantt.taskStore.filter('Name', field.getValue(), true, false);
                                        } else {
                                            gantt.taskStore.clearFilter();
                                        }
                                    },
                                    scope: gantt
                                },
                                specialkey: {
                                    fn: function (field, e) {
                                        if (e.getKey() === e.ESC) {
                                            field.reset();
                                        }
                                        gantt.taskStore.clearFilter();
                                    },
                                    scope: gantt
                                }
                            }
                        },
                        {
                            text: '查看计划',
                            enableToggle: true,
                            pressed: false,
                            scope: gantt,
                            handler: function () {
                                gantt.el.toggleCls('sch-ganttpanel-showbaseline');
                            }
                        }

                    ]
                }*/
            ]
        });

        this.callParent(arguments);
    },

    // Experimental, not X-browser
    _fullScreenFn : (function() {
        var docElm = document.documentElement;

        if (docElm.requestFullscreen) {
            return "requestFullscreen";
        }
        else if (docElm.mozRequestFullScreen) {
            return "mozRequestFullScreen";
        }
        else if (docElm.webkitRequestFullScreen) {
            return "webkitRequestFullScreen";
        }
        else if (docElm.msRequestFullscreen) {
            return "msRequestFullscreen";
        }
    })()
});
