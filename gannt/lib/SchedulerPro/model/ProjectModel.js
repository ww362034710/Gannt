import { SchedulerProProjectMixin } from '../../Engine/quark/model/scheduler_pro/SchedulerProProjectMixin.js';
import ProjectModelMixin from '../../Scheduler/model/mixin/ProjectModelMixin.js';

import ProjectCrudManager from '../data/mixin/ProjectCrudManager.js';

import AssignmentModel from './AssignmentModel.js';
import CalendarModel from './CalendarModel.js';
import DependencyModel from './DependencyModel.js';
import EventModel from './EventModel.js';
import ResourceModel from './ResourceModel.js';

import CalendarManagerStore from '../data/CalendarManagerStore.js';
import DependencyStore from '../data/DependencyStore.js';
import EventStore from '../data/EventStore.js';
import ResourceStore from '../data/ResourceStore.js';
import AssignmentStore from '../data/AssignmentStore.js';

/**
 * @module SchedulerPro/model/ProjectModel
 */

/**
 * Scheduler Pro Project model class.
 *
 * @mixes SchedulerPro/data/mixin/PartOfProject
 *
 * @extends Scheduler/model/mixin/ProjectModelMixin
 *
 * @typings Scheduler/model/ProjectModel -> Scheduler/model/SchedulerProjectModel
 */
export default class ProjectModel extends ProjectCrudManager(SchedulerProProjectMixin.derive(ProjectModelMixin())) {

    //region Config

    static get $name() {
        return 'ProjectModel';
    }

    /**
     * The number of hours per day (is used when converting the duration from one unit to another).
     * @field {number} hoursPerDay
     * @default 24
     */

    /**
     * The number of days per week (is used when converting the duration from one unit to another).
     * @field {number} daysPerWeek
     * @default 7
     */

    /**
     * The number of days per month (is used when converting the duration from one unit to another).
     * @field {number} daysPerMonth
     * @default 30
     */

    /**
     * The source of the calendar for dependencies (the calendar used for taking dependencies lag into account).
     * Possible values are:
     *
     * - `ToEvent` - successor calendar will be used (default);
     * - `FromEvent` - predecessor calendar will be used;
     * - `Project` - the project calendar will be used.
     *
     * @field {string} dependenciesCalendar
     * @default 'ToEvent'
     */

    /**
     * The project calendar.
     * @field {SchedulerPro.model.CalendarModel} calendar
     */

    /**
     * Causes the scheduling engine to re-evaluate the task data and all associated data and constraints
     * and apply necessary changes.
     * @returns {Promise}
     * @function propagate
     */

    /**
     * Collection of the project calendars.
     * @property {SchedulerPro.data.CalendarManagerStore} calendarManagerStore
     */

    static get defaultConfig() {
        return {
            calendarModelClass   : CalendarModel,
            dependencyModelClass : DependencyModel,
            eventModelClass      : EventModel,
            assignmentModelClass : AssignmentModel,
            resourceModelClass   : ResourceModel,

            calendarManagerStoreClass : CalendarManagerStore,
            dependencyStoreClass      : DependencyStore,
            eventStoreClass           : EventStore,
            assignmentStoreClass      : AssignmentStore,
            resourceStoreClass        : ResourceStore
        };
    }

    //endregion

}
