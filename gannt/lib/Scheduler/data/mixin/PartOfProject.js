import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/mixin/PartOfProject
 */

/**
 * This is a mixin, included in all models and stores of the Scheduler project. It provides a common API for accessing
 * all stores of the project.
 *
 * @mixin
 */
export default Target => class PartOfProject extends (Target || Base) {
    /**
     * Returns a task store of the project this entity belongs to.
     *
     * @method getEventStore
     * @return {Scheduler.data.EventStore}
     */

    /**
     * Returns a resource store of the project this entity belongs to.
     *
     * @method getResourceStore
     * @return {Scheduler.data.ResourceStore}
     */

    /**
     * Returns an assignment store of the project this entity belongs to.
     *
     * @method getAssignmentStore
     * @return {Scheduler.data.AssignmentStore}
     */

    /**
     * Returns a dependency store of the project this entity belongs to.
     *
     * @method getDependencyStore
     * @return {Scheduler.data.DependencyStore}
     */

    // /**
    //  * Returns a calendar manager store of the project this entity belongs to.
    //  *
    //  * @method getCalendarManagerStore
    //  * @return {Scheduler.data.CalendarManagerStore}
    //  */

    /**
     * Returns a project this entity belongs to.
     *
     * @method getProject
     * @return {Scheduler.model.ProjectModel}
     */

    /**
     * Returns a project this entity belongs to.
     *
     * @property {Scheduler.model.ProjectModel} project
     * @readonly
     */

    /**
     * Returns the event store of the project this entity belongs to.
     *
     * @member {Scheduler.data.EventStore} eventStore
     * @readonly
     */

    /**
     * Returns the dependency store of the project this entity belongs to.
     *
     * @member {Scheduler.data.DependencyStore} dependencyStore
     * @readonly
     */

    /**
     * Returns the assignment store of the project this entity belongs to.
     *
     * @member {Scheduler.data.AssignmentStore} assignmentStore
     * @readonly
     */

    /**
     * Returns a the resource store of the project this entity belongs to.
     *
     * @member {Scheduler.data.ResourceStore} resourceStore
     * @readonly
     */
};
