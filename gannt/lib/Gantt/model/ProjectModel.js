import Model from '../../Core/data/Model.js';
import Store from '../../Core/data/Store.js';
import { GanttProjectMixin } from '../../Engine/quark/model/gantt/GanttProjectMixin.js';
import TimeSpan from '../../Scheduler/model/TimeSpan.js';
import AssignmentStore from '../data/AssignmentStore.js';
import CalendarManagerStore from '../data/CalendarManagerStore.js';
import DependencyStore from '../data/DependencyStore.js';
import ResourceStore from '../data/ResourceStore.js';
import TaskStore from '../data/TaskStore.js';
import AssignmentModel from './AssignmentModel.js';
import CalendarModel from './CalendarModel.js';
import DependencyModel from './DependencyModel.js';
import ResourceModel from './ResourceModel.js';
import TaskModel from './TaskModel.js';
import ProjectCrudManager from '../../SchedulerPro/data/mixin/ProjectCrudManager.js';

/**
 * @module Gantt/model/ProjectModel
 */

/**
 * This class represents a global project of your Project plan or Gantt - a central place for all data.
 *
 * Please refer to [this guide](#guides/project_data.md) for more information.
 *
 * @extends Core/data/Model
 *
 * @mixes SchedulerPro/data/mixin/ProjectCrudManager
 *
 * @typings SchedulerPro/model/ProjectModel -> SchedulerPro/model/SchedulerProProjectModel
 */
export default class ProjectModel extends ProjectCrudManager(GanttProjectMixin.derive(Model)) {
    //region Config

    static get defaults() {
        return {
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
             * @field {Gantt.model.CalendarModel} calendar
             */

            /**
             * State tracking manager instance the project relies on
             * @property {Core.data.stm.StateTrackingManager}
             * @name stm
             */

            /**
             * The {@link Gantt.data.TaskStore store} holding the tasks information.
             *
             * See also {@link Gantt.model.TaskModel}
             *
             * @property {Gantt.data.TaskStore}
             * @name eventStore
             *
             * @ts-ignore
             */

            /**
             * An alias for the {@link #property-eventStore eventStore}
             *
             * See also {@link Gantt.model.TaskModel}
             *
             * @property {Gantt.data.TaskStore}
             * @name taskStore
             *
             * @ts-ignore
             */

            /**
             * The {@link Gantt.data.DependencyStore store} holding the dependencies information.
             *
             * See also {@link Gantt.model.DependencyModel}
             *
             * @property {Gantt.data.DependencyStore}
             * @name dependencyStore
             */

            /**
             * The {@link Gantt.data.ResourceStore store} holding the resources that can be assigned to the tasks in the task store.
             *
             * See also {@link Gantt.model.ResourceModel}
             *
             * @property {Gantt.data.ResourceStore}
             * @name resourceStore
             */

            /**
             * The {@link Gantt.data.AssignmentStore store} holding the assignments information.
             *
             * See also {@link Gantt.model.AssignmentModel}
             *
             * @property {Gantt.data.AssignmentStore}
             * @name assignmentStore
             */

            /**
             * The store, holding the calendars information.
             *
             * @property {Gantt.data.CalendarManagerStore}
             * @name calendarManagerStore
             */

            // root should be always expanded
            expanded : true
        };
    }

    static get defaultConfig() {
        return {
            /**
             * Deprecated, use {@link #config-taskModelClass}
             * @deprecated Use {@link #config-taskModelClass}
             * @config {Gantt.model.TaskModel} [eventModelClass]
             */
            eventModelClass : TaskModel,

            /**
             * The constructor of the event model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link #property-eventStore}
             *
             * @config {Gantt.model.TaskModel} [taskModelClass]
             */
            taskModelClass : TaskModel,

            /**
             * The constructor of the dependency model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link #property-dependencyStore}
             *
             * @config {Gantt.model.DependencyModel} [dependencyModelClass]
             */
            dependencyModelClass : DependencyModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link #property-resourceStore}
             *
             * @config {Gantt.model.ResourceModel} [resourceModelClass]
             */
            resourceModelClass : ResourceModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link #property-assignmentStore}
             *
             * @config {Gantt.model.AssignmentModel} [assignmentModelClass]
             */
            assignmentModelClass : AssignmentModel,

            /**
             * The constructor of the calendar model class, to be used in the project. Will be set as the {@link Core.data.Store#config-modelClass modelClass}
             * property of the {@link #property-calendarManagerStore}
             *
             * @config {Gantt.model.CalendarModel} [calendarModelClass]
             */
            calendarModelClass : CalendarModel,

            /**
             * Deprecated, use {@link #config-taskStoreClass}
             * @deprecated
             * @config {Gantt.data.TaskStore}
             */
            eventStoreClass : TaskStore,

            /**
             * The constructor to create an task store instance with. Should be a class, subclassing the {@link Gantt.data.TaskStore}
             * @config {Gantt.data.TaskStore}
             */
            taskStoreClass : TaskStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link Gantt.data.DependencyStore}
             * @config {Gantt.data.DependencyStore}
             */
            dependencyStoreClass : DependencyStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link Gantt.data.ResourceStore}
             * @config {Gantt.data.ResourceStore}
             */
            resourceStoreClass : ResourceStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link Gantt.data.AssignmentStore}
             * @config {Gantt.data.AssignmentStore}
             */
            assignmentStoreClass : AssignmentStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the {@link Gantt.data.CalendarManagerStore}
             * @config {Gantt.data.CalendarManagerStore}
             */
            calendarManagerStoreClass : CalendarManagerStore,

            /**
             * Start date of the project in the ISO 8601 format. Setting this date will constrain all other tasks in the project,
             * to start no later than it. If this date is not provided, it will be calculated as the earliest date among all events.
             *
             * @field {string|Date} startDate
             */

            /**
             * End date of the project in the ISO 8601 format. If this date is not provided, it will be calculated
             * as the earliest date among all tasks.
             *
             * @field {string|Date} endDate
             */

            /**
             * The scheduling direction of the project events.
             * The `Forward` direction corresponds to the As-Soon-As-Possible (ASAP) scheduling,
             * `Backward` - to As-Late-As-Possible (ALAP).
             *
             * @field {string} direction
             * @default 'Forward'
             */

            /**
             * The initial data, to fill the {@link #property-taskStore taskStore} with.
             * Should be an array of {@link Gantt.model.TaskModel TaskModels} or it's configuration objects.
             *
             * @config {Gantt.model.TaskModel[]}
             */
            tasksData : null,

            // What is actually used to hold initial tasks, tasksData is transformed in construct()
            eventsData : null,

            /**
             * The initial data, to fill the {@link #property-dependencyStore dependencyStore} with.
             * Should be an array of {@link Gantt.model.DependencyModel DependencyModels} or it's configuration objects.
             *
             * @config {Gantt.model.DependencyModel[]}
             */
            dependenciesData : null,

            /**
             * The initial data, to fill the {@link #property-resourceStore resourceStore} with.
             * Should be an array of {@link Gantt.model.ResourceModel ResourceModels} or it's configuration objects.
             *
             * @config {Gantt.model.ResourceModel[]}
             */
            resourcesData : null,

            /**
             * The initial data, to fill the {@link #property-assignmentStore assignmentStore} with.
             * Should be an array of {@link Gantt.model.AssignmentModel AssignmentModels} or it's configuration objects.
             *
             * @config {Gantt.model.AssignmentModel[]}
             */
            assignmentsData : null,

            /**
             * The initial data, to fill the {@link #property-calendarManagerStore calendarManagerStore} with.
             * Should be an array of {@link Gantt.model.CalendarModel CalendarModels} or it's configuration objects.
             *
             * @config {Gantt.model.CalendarModel[]}
             */
            calendarsData : null,

            /**
             * Store that holds time ranges (using the {@link Scheduler.model.TimeSpan} model or subclass thereof) for
             * {@link Scheduler.feature.TimeRanges} feature. A store will be automatically created if none is specified.
             * @config {Object|Core.data.Store}
             */
            timeRangeStore : null,

            convertEmptyParentToLeaf : false
        };
    }

    construct(...args) {
        const config = args[0] || {};

        // put config to arguments (passed to the parent class "construct")
        args[0] = config;

        if ('tasksData' in config) {
            config.eventsData   = config.tasksData;
            delete config.tasksData;
        }

        if ('taskStore' in config) {
            config.eventStore = config.taskStore;
            delete config.taskStore;
        }

        // Maintain backwards compatibility
        // TODO remove for 3.0
        config.eventModelClass = config.taskModelClass || config.eventModelClass || this.defaultEventModelClass;
        config.eventStoreClass = config.taskStoreClass || config.eventStoreClass || this.defaultEventStoreClass;

        if (!config.timeRangeStore) {
            config.timeRangeStore = {
                modelClass : TimeSpan,
                storeId    : 'timeRanges'
            };
        }

        super.construct(...args);
    }

    get defaultEventModelClass() {
        return TaskModel;
    }

    get defaultEventStoreClass() {
        return TaskStore;
    }

    get taskStore() {
        return this.getEventStore();
    }

    get timeRangeStore() {
        return this._timeRangeStore;
    }

    set timeRangeStore(store) {
        const me = this;

        me._timeRangeStore = Store.getStore(store, Store);

        if (!me._timeRangeStore.storeId) {
            me._timeRangeStore.storeId = 'timeRanges';
        }
    }

    async tryInsertChild() {
        return this.tryPropagateWithChanges(() => {
            this.insertChild(...arguments);
        });
    }

    /**
     * Returns a calendar of the project. If task has never been assigned a calendar a project's calendar will be returned.
     *
     * @method
     * @name getCalendar
     * @returns {Gantt.model.CalendarModel}
     */

    /**
     * Sets the calendar of the project. Will cause the schedule to be updated - returns a `Promise`
     *
     * @method
     * @name setCalendar
     * @param {Gantt.model.CalendarModel} calendar The new calendar.
     * @returns {Promise}
     * @propagating
     */

    /**
     * Causes the scheduling engine to re-evaluate the task data and all associated data and constraints
     * and apply necessary changes.
     * @returns {Promise}
     * @function propagate
     */

    /**
     * Suspend {@link #function-propagate propagation} processing. When propagation is suspended,
     * calls to {@link #function-propagate} do not proceed, instead a propagate call is deferred
     * until a matching {@link #function-resumePropagate} is called.
     * @function suspendPropagate
     */

    /**
     * Resume {@link #function-propagate propagation}. If propagation is resumed (calls may be nested
     * which increments a suspension counter), then if a call to propagate was made during suspension,
     * {@link #function-propagate} is executed.
     * @param {Boolean} [trigger] Pass `false` to inhibit automatic propagation if propagate was requested during suspension.
     * @returns {Promise}
     * @function resumePropagate
     */

    afterChange(toSet, wasSet) {
        super.afterChange(...arguments);

        if (wasSet.calendar) {
            this.trigger('calendarChange');
        }
    }
}

ProjectModel.applyConfigs = true;

// Ignored to keep autogenerated typescript typings w/o errors, otherwise there'll be 2 EffectResolutionResult definitions
/*
 * @typedef EffectResolutionResult
 * @property {Number} Cancel    Stop propagation
 * @property {Number} Restart   Restart propagation
 * @property {Number} Resume    Resume propagation from current state
 */
