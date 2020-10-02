import Model from '../../../Core/data/Model.js';
import EventModel from '../EventModel.js';
import DependencyModel from '../DependencyModel.js';
import ResourceModel from '../ResourceModel.js';
import AssignmentModel from '../AssignmentModel.js';
import ResourceTimeRangeModel from '../ResourceTimeRangeModel.js';
import TimeSpan from '../TimeSpan.js';
import Store from '../../../Core/data/Store.js';
import EventStore from '../../data/EventStore.js';
import DependencyStore from '../../data/DependencyStore.js';
import ResourceStore from '../../data/ResourceStore.js';
import AssignmentStore from '../../data/AssignmentStore.js';
import ResourceTimeRangeStore from '../../data/ResourceTimeRangeStore.js';

/**
 * @module Scheduler/model/mixin/ProjectModelMixin
 */

/**
 * Mixin that holds configuration shared between projects in Scheduler and Scheduler Pro.
 * @mixin
 */
export default Target => class ProjectModelMixin extends (Target || Model) {
    //region Config

    static get defaultConfig() {
        return {
            /**
             * Configuration options to provide to the STM manager
             *
             * @config {Object|Core.data.stm.StateTrackingManager}
             * @category Advanced
             */
            stm : {},

            /**
             * The constructor of the event model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-eventStore}
             *
             * @config {Scheduler.model.EventModel}
             */
            eventModelClass : EventModel,

            /**
             * The constructor of the dependency model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-dependencyStore}
             *
             * @config {Scheduler.model.DependencyModel}
             */
            dependencyModelClass : DependencyModel,

            timeRangeModelClass         : TimeSpan,
            resourceTimeRangeModelClass : ResourceTimeRangeModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-resourceStore}
             *
             * @config {Scheduler.model.ResourceModel}
             */
            resourceModelClass : ResourceModel,

            /**
             * The constructor of the resource model class, to be used in the project. Will be set as the
             * {@link Core.data.Store#config-modelClass modelClass} property of the {@link #property-assignmentStore}
             *
             * @config {Scheduler.model.AssignmentModel}
             */
            assignmentModelClass : AssignmentModel,

            /**
             * The constructor to create an event store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.EventStore}
             * @config {Scheduler.data.EventStore}
             */
            eventStoreClass : EventStore,

            /**
             * The constructor to create a dependency store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.DependencyStore}
             * @config {Scheduler.data.DependencyStore}
             */
            dependencyStoreClass : DependencyStore,

            /**
             * The constructor to create a resource store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.ResourceStore}
             * @config {Scheduler.data.ResourceStore}
             */
            resourceStoreClass : ResourceStore,

            /**
             * The constructor to create an assignment store instance with. Should be a class, subclassing the
             * {@link Scheduler.data.AssignmentStore}
             * @config {Scheduler.data.AssignmentStore}
             */
            assignmentStoreClass : AssignmentStore,

            timeRangeStoreClass         : Store,
            resourceTimeRangeStoreClass : ResourceTimeRangeStore,

            eventStore             : {},
            assignmentStore        : {},
            dependencyStore        : {},
            resourceStore          : {},
            timeRangeStore         : null,
            resourceTimeRangeStore : null

            /**
             * The initial data, to fill the {@link #property-eventStore eventStore} with.
             * Should be an array of {@link Scheduler.model.EventModel EventModels} or it's configuration objects.
             *
             * @config {Scheduler.model.EventModel[]} [eventsData]
             */

            /**
             * The initial data, to fill the {@link #property-dependencyStore dependencyStore} with.
             * Should be an array of {@link Scheduler.model.DependencyModel DependencyModels} or it's configuration
             * objects.
             *
             * @config {Scheduler.model.DependencyModel[]} [dependenciesData]
             */

            /**
             * The initial data, to fill the {@link #property-resourceStore resourceStore} with.
             * Should be an array of {@link Scheduler.model.ResourceModel ResourceModels} or it's configuration objects.
             *
             * @config {Scheduler.model.ResourceModel[]} [resourcesData]
             */

            /**
             * The initial data, to fill the {@link #property-assignmentStore assignmentStore} with.
             * Should be an array of {@link Scheduler.model.AssignmentModel AssignmentModels} or it's configuration objects.
             *
             * @config {Scheduler.model.AssignmentModel[]} [assignmentsData]
             */

            /**
             * The initial data, to fill the {@link #property-timeRangeStore timeRangeStore} with.
             * Should be an array of {@link Scheduler.model.TimeSpan TimeSpan} or it's configuration objects.
             *
             * @config {Scheduler.model.TimeSpan[]} [timeRangesData]
             */

            /**
             * The initial data, to fill the {@link #property-resourceTimeRangeStore resourceTimeRangeStore} with.
             * Should be an array of {@link Scheduler.model.ResourceTimeRangeModel ResourceTimeRangeModel} or it's configuration objects.
             *
             * @config {Scheduler.model.ResourceTimeRangeModel[]} [resourceTimeRangesData]
             */
        };
    }

    //endregion

    //region Properties

    /**
     * Project's calendar.
     *
     * @member {Scheduler.model.Calendar} calendar
     */

    /**
     * State tracking manager instance the project relies on
     * @member {Core.data.stm.StateTrackingManager} stm
     */

    /**
     * The {@link Scheduler.data.EventStore store} holding the events information.
     *
     * See also {@link Scheduler.model.EventModel}
     *
     * @member {Scheduler.data.EventStore} eventStore
     */

    /**
     * The {@link Scheduler.data.DependencyStore store} holding the dependencies information.
     *
     * See also {@link Scheduler.model.DependencyModel}
     *
     * @member {Scheduler.data.DependencyStore} dependencyStore
     */

    /**
     * The {@link Scheduler.data.ResourceStore store} holding the resources that can be assigned to the events
     * in the event store.
     *
     * See also {@link Scheduler.model.ResourceModel}
     *
     * @member {Scheduler.data.ResourceStore} resourceStore
     */

    /**
     * The {@link Scheduler.data.AssignmentStore store} holding the assignments information.
     *
     * See also {@link Scheduler.model.AssignmentModel}
     *
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     */

    /**
     * The {@link Core.data.Store store} holding the time ranges information.
     *
     * See also {@link Scheduler.model.TimeSpan}
     *
     * @member {Core.data.Store} timeRangeStore
     */

    /**
     * The {@link Scheduler.data.ResourceTimeRangeStore store} holding the resource time ranges information.
     *
     * See also {@link Scheduler.model.ResourceTimeRangeModel}
     *
     * @member {Scheduler.data.ResourceTimeRangeStore} resourceTimeRangeStore
     */

    //endregion

    //region Init

    construct(config = {}) {
        super.construct(...arguments);

        // These stores are not handled by engine, but still held on project

        const me = this;

        if (!me.timeRangeStore) {
            me.timeRangeStore = new me.timeRangeStoreClass({
                modelClass : me.timeRangeModelClass,
                storeId    : 'timeRanges'
            });
        }

        if (!me.resourceTimeRangeStore) {
            me.resourceTimeRangeStore = new me.resourceTimeRangeStoreClass({
                modelClass : me.resourceTimeRangeModelClass
            });
        }

        if (me.resourceTimeRangesData) {
            me.resourceTimeRangeStore.data = me.resourceTimeRangesData;
        }

        if (me.timeRangesData) {
            me.timeRangeStore.data = me.timeRangesData;
        }
    }

    //endregion

    afterChange(toSet, wasSet) {
        super.afterChange(...arguments);

        if (wasSet.calendar) {
            this.trigger('calendarChange');
        }
    }
};
