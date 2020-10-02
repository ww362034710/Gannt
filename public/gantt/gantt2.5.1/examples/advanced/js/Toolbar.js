Ext.define("MyApp.Toolbar", {
    extend : "Ext.Toolbar",
    cls    : 'my-toolbar',
    alias  : 'widget.primarytoolbar',

    gantt : null,

    initComponent : function () {
        var gantt = this.gantt;

        var taskStore = gantt.taskStore || gantt.crudManager && gantt.crudManager.getTaskStore();

        taskStore.on({
            'filter-set'   : function () {
                this.down('[iconCls*=icon-collapseall]').disable();
                this.down('[iconCls*=icon-expandall]').disable();
            },
            'filter-clear' : function () {
                this.down('[iconCls*=icon-collapseall]').enable();
                this.down('[iconCls*=icon-expandall]').enable();
            },
            scope          : this
        });

        var items = [
            {
                tooltip : 'Previous timespan',
                iconCls : 'icon icon-left',
                handler : function () {
                    gantt.shiftPrevious();
                }
            },
            {
                tooltip : 'Next timespan',
                iconCls : 'icon icon-right',
                handler : function () {
                    gantt.shiftNext();
                }
            },
            {
                tooltip : 'Collapse all',
                iconCls : 'icon icon-collapseall',
                handler : function () {
                    gantt.collapseAll();
                }
            },
            {
                tooltip : 'Expand all',
                iconCls : 'icon icon-expandall',
                handler : function () {
                    gantt.expandAll();
                }
            },
            {
                tooltip : 'Zoom out',
                iconCls : 'icon icon-zoomout',
                handler : function () {
                    gantt.zoomOut();
                }
            },
            {
                tooltip : 'Zoom in',
                iconCls : 'icon icon-zoomin',
                handler : function () {
                    gantt.zoomIn();
                }
            },
            {
                tooltip : 'Zoom to fit',
                iconCls : 'icon icon-zoomfit',
                handler : function () {
                    gantt.zoomToFit(null, { leftMargin : 100, rightMargin : 100 });
                }
            },
            {
                tooltip  : 'View full screen',
                iconCls  : 'icon icon-fullscreen',
                disabled : !this._fullScreenFn,
                handler  : function () {
                    this.showFullScreen();
                },
                scope    : this
            },
            {
                tooltip      : 'Highlight critical path',
                iconCls      : 'icon icon-criticalpath',
                enableToggle : true,
                handler      : function (btn) {
                    var v = gantt.getSchedulingView();
                    if (btn.pressed) {
                        v.highlightCriticalPaths(true);
                    } else {
                        v.unhighlightCriticalPaths(true);
                    }
                }
            },
            {
                tooltip      : 'Add new task',
                iconCls      : 'icon icon-add',
                handler      : function (btn) {
                    var task = gantt.taskStore.getRootNode().appendChild({
                        Name : 'New Task',
                        leaf : true
                    });
                    gantt.getSchedulingView().scrollEventIntoView(task);
                    gantt.editingInterface.startEdit(task, 1);
                }
            },
            {
                tooltip      : 'Remove selected task(s)',
                iconCls      : 'icon icon-delete',
                handler      : function (btn) {
                    gantt.getSelectionModel().selected.each(function (task) {
                        task.remove();
                    });
                }
            },
            {
                tooltip      : 'Indent',
                iconCls      : 'icon icon-indent',
                handler      : function (btn) {
                    gantt.taskStore.indent(gantt.getSelectionModel().getSelection());
                }
            },
            {
                tooltip      : 'Outdent',
                iconCls      : 'icon icon-outdent',
                handler      : function (btn) {
                    gantt.taskStore.outdent(gantt.getSelectionModel().getSelection());
                }
            }
        ];

        if (gantt.taskStore && gantt.taskStore.calendarManager) {
            items.push({
                tooltip      : 'Manage calendars',
                iconCls      : 'icon icon-calendarmgr',
                scope        : this,
                handler      : function (btn) {
                    var editorWindow  = new Gnt.widget.calendar.CalendarManagerWindow({
                        title           : 'Manage Calendars',
                        height          : 550,
                        constrain       : true,
                        calendarManager : gantt.taskStore.calendarManager
                    });
                    editorWindow.show();
                    editorWindow.alignTo(btn);
                }
            });
        }


        if (gantt.crudManager) {
            items.push({
                tooltip : 'Save changes',
                iconCls : 'icon icon-save',
                itemId  : 'save-button',
                handler : function () {
                    gantt.crudManager.sync();
                }
            });
        }

        items.push('->', 'Language: ',
            {
                xtype         : 'combo',
                store         : new Ext.data.ArrayStore({
                    fields : ['code', 'language'],
                    data   : (function () {
                        var result = [];

                        Ext.Object.each(gantt.supportedLocales, function (id, info) {
                            result.push([ id, info[1] ]);
                        });

                        return result;
                    })()
                }),
                displayField  : 'language',
                valueField    : 'code',
                mode          : 'local',
                triggerAction : 'all',
                emptyText     : 'Select a language...',
                selectOnFocus : true,
                value         : gantt.localeId || '',
                listeners     : {
                    select : function (f, record) {
                        window.location.hash = '#' + record[0].get('code');
                        window.location.reload(true);
                    }
                }
            },
            {
                text    : 'Try more features...',
                handler : function () {
                    this.fireEvent('togglesecondary', this);
                },
                scope   : this
            });

        Ext.apply(this, {
            defaults : { scale : 'medium' },

            items : items
        });

        this.callParent(arguments);
    },

    applyPercentDone : function (value) {
        this.gantt.getSelectionModel().selected.each(function (task) {
            task.setPercentDone(value);
        });
    },

    showFullScreen : function () {
        this.gantt.el.down('.x-panel-body').dom[this._fullScreenFn](Element.ALLOW_KEYBOARD_INPUT);
    },

    // Experimental, not X-browser
    _fullScreenFn  : (function () {
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
