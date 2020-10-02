import GridRowModel from '../../Grid/data/GridRowModel.js';
import ResourceModelMixin from '../../Scheduler/model/mixin/ResourceModelMixin.js';
import { SchedulerProResourceMixin } from '../../Engine/quark/model/scheduler_pro/SchedulerProResourceMixin.js';
import PartOfProject from '../data/mixin/PartOfProject.js';

/**
 * @module SchedulerPro/model/ResourceModel
 */

/**
 * This class represents a single resource in your Scheduler Pro project.
 *
 * If you want to add or change some fields, describing resources - subclass this class:
 *
 * ```javascript
 * class MyResourceModel extends ResourceModel {
 *
 *   static get fields() {
 *     return [
 *       { name: 'company', type: 'string' }
 *     ]
 *   }
 * }
 * ```
 *
 * @extends Scheduler/model/ResourceModel
 *
 * @typings Scheduler/model/ResourceModel -> Scheduler/model/SchedulerResourceModel
 */
export default class ResourceModel extends PartOfProject(ResourceModelMixin(SchedulerProResourceMixin.derive(GridRowModel))) {

    //region Calendar

    /**
     * Sets the calendar of the task. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setCalendar
     * @param {SchedulerPro.model.CalendarModel} calendar The new calendar. Provide `null` to use the project calendar.
     * @returns {Promise}
     * @propagating
     */

    /**
     * Returns a calendar of the task. If no calendar was assigned, then project's calendar will be returned.
     *
     * @method
     * @name getCalendar
     * @returns {SchedulerPro.model.CalendarModel}
     */

    //endregion

    //region Config

    static get $name() {
        return 'ResourceModel';
    }

    static get fields() {
        return [
            /**
             * The calendar, assigned to the entity. Allows you to set the time when entity can perform the work.
             *
             * All entities are by default assigned to the project calendar, provided as the {@link SchedulerPro.model.ProjectModel#property-calendar} option.
             *
             * @field {SchedulerPro.model.CalendarModel} calendar
             */

        ];
    }

    //endregion

}
