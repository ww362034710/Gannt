Ext.define("Common.view.GanttToolbar-bak", {
    extend      : 'Ext.Toolbar',
    alias       : 'widget.gantttoolbar.bak',
    cls         : 'gantt-toolbar',

    initComponent : function() {
        this.defaults = { scale : 'medium', scope : this };
        var taskStore = this.gantt.taskStore;

        Ext.apply(this, {

            items :[
                {
                    iconCls : 'icon-backward',
                    handler : function() {
                        this.gantt.shiftPrevious();
                    }
                },
                {
                    iconCls : 'icon-forward',
                    handler : function() {
                        this.gantt.shiftNext();
                    }
                },
                {
                    iconCls : 'icon-plus',
                    handler : function() {
                        this.gantt.zoomIn();
                    }
                },
                {
                    iconCls : 'icon-minus',
                    handler : function() {
                        this.gantt.zoomOut();
                    }
                },
                {
                    text : 'Weeks',
                    handler : function() {
                        this.gantt.switchViewPreset('weekAndDayLetter');
                    }
                },{
                    text : 'Months',
                    handler : function() {
                        this.gantt.switchViewPreset('monthAndYear');
                    }
                },
                {
                    text : 'Years',
                    handler : function() {
                        this.gantt.switchViewPreset('year', new Date(this.gantt.getStart().getFullYear(), 1, 1), new Date(this.gantt.getStart().getFullYear()+5, 1, 1));
                    }
                },
                '->',
                {
                    text : 'Collapse all',
                    handler : function() {
                        this.gantt.collapseAll();
                    }
                },
                {
                    text : 'Expand all',
                    handler : function() {
                        this.gantt.expandAll();
                    }
                },
                {
                    text : 'View full screen',
                    disabled : !this._fullScreenFn,
                    handler : function() {
                        this.gantt.el.down('.x-panel-body').dom[this._fullScreenFn]();
                    }
                },
                {
                    iconCls : 'icon-calendar',
                    text    : 'Edit working time',
                    handler : function(){
                        var editorWindow  = new Gnt.widget.calendar.CalendarWindow({
                            calendar        : this.gantt.taskStore.getCalendar()
                        });

                        editorWindow.show();
                    }
                },
                {
                    xtype       : 'textfield',
                    emptyText   : 'Find task...',
                    width       : 150,
                    enableKeyEvents : true,
                    listeners : {
                        keyup : {
                            fn      : function(field, e) {
                                var value   = field.getValue();
                                var regexp  = new RegExp(Ext.String.escapeRegex(value), 'i')

                                if (value) {
                                    taskStore.filterTreeBy(function (task) {
                                        return regexp.test(task.get('Name'))
                                    });
                                } else {
                                    taskStore.clearTreeFilter();
                                }
                            },
                            buffer  : 300
                        },
                        specialkey : {
                            fn : function(field, e) {
                                if (e.getKey() === e.ESC) {
                                    field.reset();

                                    taskStore.clearTreeFilter();
                                }
                            }
                        }
                    }
                },
                {
                    text : 'Save',
                    handler : function() {
                        taskStore.saveDataSet();
                    }
                },
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
