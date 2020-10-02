Ext.define("Common.controller.Navigation", {
    extend : 'Ext.app.Controller',

    views  : ['Navigation'],

    refs : [
        // This auto-generates a "getEmployeeScheduler" getter for this ComponentQuery selector
        // See http://docs.sencha.com/ext-js/4-1/#!/api/Ext.app.Controller-cfg-refs
        { ref : "mainContainer",    selector : '#maincontainer' },
        { ref : "gantt",            selector : 'gantt' },
        { ref : "settings",         selector : 'settings' }
    ],

    init : function() {
        this.control({
            'navigation button' : {
                click : this.onNavigationClick
            }
        });
    },

    onNavigationClick : function(btn) {

        switch(btn.itemId) {
            case 'gantt':
                this.resourceList && this.resourceList.hide();
                this.scheduler && this.scheduler.hide();
                this.histogram && this.histogram.hide();

                this.getGantt().show();
                break;

            case 'resourceschedule':
                var sched = this.scheduler = this.getResourceScheduler();

                this.resourceList && this.resourceList.hide();
                this.histogram && this.histogram.hide();

                sched.setVisible(btn.pressed);
                break;

            case 'resourcelist':
                var resourceList = this.resourceList = this.getResourceList();

                this.scheduler && this.scheduler.hide();
                this.histogram && this.histogram.hide();
                this.getGantt().hide();

                resourceList.show();
                break;

            case 'settings':
                var settings = this.settings = this.getSettings();

                settings.setVisible(btn.pressed);

                break;

            case 'histogram':
                var histogram = this.histogram = this.getHistogram();

                this.resourceList && this.resourceList.hide();
                this.scheduler && this.scheduler.hide();

                histogram.setVisible(btn.pressed);
                break;
        }
    },

    getResourceScheduler : function() {
        if (!this.scheduler) {
            var gantt = this.getGantt();

            this.scheduler = new Common.view.ResourceSchedule({
                resourceStore   : gantt.taskStore.resourceStore,
                eventStore      : gantt.taskStore,
                assignmentStore : gantt.assignmentStore,

                partnerTimelinePanel   : gantt,

                // Share non-working time visualization
                workingTimeStore : gantt.getWorkingTimePlugin().store/*,

                features      : [
                    {
                        id                 : 'group1',
                        ftype              : 'scheduler_grouping',
                        groupHeaderTpl     : '{name}',
                        hideGroupedHeader  : true,
                        enableGroupingMenu : false
                    }
                ]*/

            });

            this.getMainContainer().add(this.scheduler);

            var ganttViewEl = gantt.getSchedulingView().el;
            var schedulerViewEl = this.scheduler.getSchedulingView().el;

            // Sync the scrolling
            schedulerViewEl.on('scroll', function(ev, el) { ganttViewEl.scrollTo('left', el.scrollLeft); });
            ganttViewEl.on('scroll', function(ev, el) { schedulerViewEl.scrollTo('left', el.scrollLeft); });

            gantt.on('zoomchange', function() {
                this.scheduler.normalGrid.scrollTask.cancel();

                this.scheduler.zonesPlugin.setDisabled(Sch.util.Date.compareUnits(this.scheduler.timeAxis.unit, Sch.util.Date.WEEK) > 0);
            }, this);
        }

        return this.scheduler;
    },

    getResourceList : function() {
        if (!this.resourceList) {
            var gantt = this.getGantt();

            this.resourceList = this.getMainContainer().add({
                xtype : 'resourcelist',
                store : gantt.resourceStore
            });

        }

        return this.resourceList;
    },

    getHistogram : function() {
        if (!this.histogram) {
            var gantt = this.getGantt();

            this.histogram = new Common.view.MyResourceHistogram({
                partnerTimelinePanel    : gantt,
                resourceStore           : gantt.resourceStore,
                taskStore               : gantt.taskStore,
                assignmentStore         : gantt.assignmentStore/*,
                features      : [
                    {
                        id                 : 'group',
                        ftype              : 'scheduler_grouping',
                        groupHeaderTpl     : '{name}',
                        hideGroupedHeader  : true,
                        enableGroupingMenu : false
                    }
                ]*/
            });

            this.getMainContainer().add(this.histogram);
        }

        return this.histogram;
    }
});