import AbstractTimeRanges from './AbstractTimeRanges.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import AttachToProjectMixin from '../data/mixin/AttachToProjectMixin.js';

/**
 * @module Scheduler/feature/NonWorkingTime
 */

/**
 * Feature that allows styling of weekends (and other non working time) by adding timeRanges for those days.
 *
 * By default, Schedulers calendar is empty. When enabling this feature for the basic Scheduler, it injects weekend
 * intervals if no intervals are encountered (saturday and sunday).
 *
 * This feature is **disabled** by default for Scheduler, but **enabled** by default for Scheduler Pro.
 *
 * @extends Scheduler/feature/AbstractTimeRanges
 * @demo Scheduler/configuration
 * @externalexample scheduler/NonWorkingTime.js
 * @classtype nonWorkingTime
 */
export default class NonWorkingTime extends AbstractTimeRanges.mixin(AttachToProjectMixin) {
    //region Default config

    static get $name() {
        return 'NonWorkingTime';
    }

    static get defaultConfig() {
        return {
            /**
             * Highlight weekends
             * @config {Boolean}
             * @default
             */
            highlightWeekends : true,

            showHeaderElements : true,
            showLabelInBody    : true,

            cls : 'b-sch-nonworkingtime'
        };
    }

    static get pluginConfig() {
        return {
            chain : [
                'onPaint',
                'attachToProject'
            ]
        };
    }

    //endregion

    //region Init & destroy

    doDestroy() {
        this.attachToCalendar(null);
        super.doDestroy();
    }

    //endregion

    //region Calendar

    attachToProject(project) {
        super.attachToProject(project);

        this.attachToCalendar(project.calendar);

        project.on({
            name           : 'project',
            calendarChange : () => this.attachToCalendar(this.project.calendar),
            thisObj        : this
        });
    }

    attachToCalendar(calendar) {
        const
            me                  = this,
            { project, client } = me;

        me.detachListeners('calendar');

        if (calendar) {
            if (
                // For basic scheduler...
                !client.isSchedulerPro &&
                !client.isGantt &&
                // ...that uses the default calendar...
                calendar === project.defaultCalendar &&
                // ...and has no defined intervals
                !project.defaultCalendar.intervalStore.count
            ) {
                // Add weekends as non-working time
                calendar.addIntervals([
                    {
                        recurrentStartDate : 'on Sat at 0:00',
                        recurrentEndDate   : 'on Mon at 0:00',
                        isWorking          : false
                    }
                ]);
            }

            calendar.intervalStore.on({
                name    : 'calendar',
                change  : me.renderRanges,
                delay   : 1,
                thisObj : me
            });
        }

        // On changing calendar we react to a data level event which is triggered after project refresh.
        // Redraw right away
        if (client.isEngineReady) {
            me.renderRanges();
        }
        // Initially there is no guarantee we are ready to draw, wait for refresh
        else if (!project.isDestroyed) {
            project.on({
                refresh : me.renderRanges,
                thisObj : me,
                once    : true
            });
        }
    }

    get calendar() {
        return this.project?.calendar;
    }

    //endregion

    //region Draw

    renderRanges() {
        const
            me                             = this,
            { store, calendar }            = me,
            { timeAxis, foregroundCanvas } = me.client;

        // Too early, project not correctly set up yet
        if (!calendar) {
            return;
        }

        if (foregroundCanvas && store && !store.isDestroyed) {
            if (!me.disabled) {
                const shouldPaint = DateHelper.as(timeAxis.unit, 1, 'week') >= 1;

                store.removeAll(true);

                if (calendar && me.highlightWeekends && shouldPaint && timeAxis.count) {
                    const timeRanges = calendar.getNonWorkingTimeRanges(timeAxis.startDate, timeAxis.endDate).map((r, i) => ({
                        id        : `nonworking-${i}`,
                        name      : r.name,
                        cls       : 'b-nonworkingtime',
                        startDate : r.startDate,
                        endDate   : r.endDate
                    }));
                    store.add(timeRanges, true);
                }
            }

            super.renderRanges();
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(NonWorkingTime, false, 'Scheduler');
GridFeatureManager.registerFeature(NonWorkingTime, true, 'SchedulerPro');
GridFeatureManager.registerFeature(NonWorkingTime, true, 'Gantt');
