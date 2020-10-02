import Base from '../../../Core/Base.js';
import ProjectConsumer from '../../../Scheduler/data/mixin/ProjectConsumer.js';
import ProjectModel from '../../model/ProjectModel.js';

/**
 * @module Gantt/view/mixin/GanttStores
 */

/**
 * Functions for store assignment and store event listeners.
 * Properties are aliases to corresponding
 * ones of Gantt's {@link Gantt.model.ProjectModel project} instance.
 *
 * @mixin
 */
export default Target => class GanttStores extends ProjectConsumer(Target || Base) {

    // This is the static definition of the Stores we consume from the project, and
    // which we must provide *TO* the project if we or our CrudManager is configured
    // with them.
    // The property name is the store name, and within that there is the dataname which
    // is the property which provides static data definition. And there is a listeners
    // definition which specifies the listeners *on this object* for each store.
    //
    // To process incoming stores, implement an updateXxxxxStore method such
    // as `updateEventStore(eventStore)`.
    //
    // To process an incoming Project implement `updateProject`. __Note that
    // `super.updateProject(...arguments)` must be called first.__
    static get projectStores() {
        return {
            calendarManagerStore : {},

            resourceStore : {
                dataName : 'resources'
            },

            eventStore : {
                dataName : 'events'
            },

            dependencyStore : {
                dataName : 'dependencies'
            },

            assignmentStore : {
                dataName : 'assignments'
            }
        };
    }

    static get configurable() {
        return {
            // Overridden. ProjectConsumer defaults to Scheduler's ProjectModel
            projectModelClass : ProjectModel,

            /**
             * Inline tasks, will be loaded into an internally created TaskStore.
             * @config {Gantt.model.TaskModel[]|Object[]}
             * @category Data
             */
            tasks : null,

            /**
             * The {@link Gantt.data.TaskStore} holding the tasks to be rendered into the gantt.
             * @config {Gantt.data.TaskStore}
             * @category Data
             */
            taskStore : null

            /**
             * Inline dependencies, will be loaded into an internally created DependencyStore.
             * @config {Gantt.model.DependencyModel[]|Object[]} dependencies
             * @category Data
             */

            /**
             * The optional {@link Gantt.data.DependencyStore}.
             * @config {Gantt.data.DependencyStore} dependencyStore
             * @category Data
             */
        };
    }

    construct() {
        // queue af calls to trigger on "propagation-is-finished" moments
        this.onRefreshCallsQueue = [];

        super.construct(...arguments);
    }

    updateProject(project, oldProject) {
        super.updateProject(project, oldProject);

        this.detachListeners('ganttStores');

        if (project) {
            project.on({
                name               : 'ganttStores',
                startApplyResponse : 'onProjectStartApplyResponse',
                refresh            : 'internalOnProjectRefresh',
                progress           : 'onProjectProgress',
                //commit            : 'onProjectCommit',

                thisObj : this
            });
        }
    }

    get replica() {
        return this.project.replica;
    }

    onProjectStartApplyResponse() {
        this.suspendRefresh();
    }

    internalOnProjectRefresh({ isInitialCommit }) {
        const me = this;

        if (me.project.enableProgressNotifications && me.masked) {
            me.unmask();
        }

        if (!me.appliedViewStartDate && !('startDate' in me.initialConfig) && me.project.startDate) {
            me.startDate = me.project.startDate;
            me.appliedViewStartDate = true;
        }

        // Need to clear cached date values because we are drawing tasks on refresh and old cached values might be used
        // Covered by TaskEditAdvanced.t
        this.taskStore.forEach(record => record.clearCachedValues());

        me.resumeRefresh(true);

        if (!me.suspendRendering) {
            if (me.refreshAfterProjectRefresh) {
                me.refreshWithTransition();
                me.refreshAfterProjectRefresh = false;
            }

            me.trigger('projectRefresh', { initial : false });
        }

        // // storing feature into variable allows to save quite a few time on big projects
        // const dependencyFeature = this.features.dependencies;
        // // Add all dependencies to the cache, required dependencies will be drawn in next animation frame and will be
        // // properly updated on view scroll
        // this.dependencies.forEach(dep => dependencyFeature.addToGridCache(dep));
    }

    // onProjectCommit({ records }) {
    //     const
    //         { rowManager } = this,
    //         rows = [];
    //
    //     for (const record of records) {
    //         if (record.isTask && this.taskStore.isAvailable(record)) {
    //             const row = rowManager.getRowFor(record);
    //             if (row) {
    //                 rows.push(row);
    //             }
    //         }
    //     }
    //
    //     rows.sort((a, b) => a.index - b.index);
    //
    //     this.runWithTransition(() => {
    //         rowManager.renderRows(rows);
    //     });
    // }

    get isEngineReady() {
        const { replica } = this.project;

        return replica && !(replica.dirty && (replica.hasPendingAutoCommit() || replica.isCommitting));
    }
    //endregion

    //region TaskStore

    /**
     * Get/set tasks, applies to the backing project's EventStore.
     * @property {Gantt.model.TaskModel[]|Object[]}
     * @category Data
     */
    get tasks() {
        return this.project.eventStore.records;
    }

    changeTasks(tasks) {
        const { project } = this;

        if (this.buildingProjectConfig) {
            // Set the property in the project config object.
            project.eventsData = tasks;
        }
        else {
            // Live update the project when in use.
            project.eventStore.data = tasks;
        }
    }

    /**
     * Get/set the event store instance of the backing project.
     * @member {Gantt.data.TaskStore} taskStore
     * @category Data
     */
    changeTaskStore(taskStore) {
        const { project } = this;

        if (this.buildingProjectConfig) {
            // Set the property in the project config object.
            // Must not go through the updater. It's too early to
            // inform host of store change.
            project.eventStore = taskStore;
            return;
        }

        // Live update the project when in use.
        if (!this.initializingProject) {
            if (project.eventStore !== taskStore) {
                project.setEventStore(taskStore);
                taskStore = project.eventStore;
            }
        }
        return taskStore;
    }

    updateEventStore(eventStore) {
        const me = this;

        eventStore.metaMapId = me.id;

        // taskStore is used for rows (store) and tasks
        me.taskStore = me.store = me.timeAxisViewModel.store = eventStore;

        // apply the store change to some features (otherwise they have old store reference)
        // TODO: this actually should be done not for gantt only ..fixing here since observe exceptions in demo bigdataset monkeys
        ['tree', 'sort'].forEach(feature => {
            if (me.features[feature]) {
                me.features[feature].store = eventStore;
            }
        });

        me.currentOrientation.bindTaskStore(eventStore);
    }

    //endregion

    //region Internal

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}

    //endregion
};
