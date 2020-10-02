import VersionHelper from '../../../Core/helper/VersionHelper.js';
import Model from '../../../Core/data/Model.js';
import TimeSpan from '../../model/TimeSpan.js';

/**
 * @module Scheduler/data/mixin/DependencyStoreMixin
 */

/**
 * This is a mixin, containing functionality related to managing dependencies.
 *
 * It is consumed by the regular {@link Scheduler.data.DependencyStore} class and Scheduler Pros counterpart.
 *
 * @mixin
 */
export default Target => class DependencyStoreMixin extends Target {
    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 400,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 400,

            storeId : 'dependencies'
        };
    }

    // TODO: document
    reduceEventDependencies(event, reduceFn, result, flat = true, depsGetterFn) {
        depsGetterFn = depsGetterFn || (event => this.getEventDependencies(event));

        event = Array.isArray(event) ? event : [event];

        event.reduce((result, event) => {
            if (event.children && !flat) {
                event.traverse(evt => {
                    result = depsGetterFn(evt).reduce(reduceFn, result);
                });
            }
            else {
                result = depsGetterFn(event).reduce(reduceFn, result);
            }
        }, result);

        return result;
    }

    // TODO: document
    mapEventDependencies(event, fn, filterFn, flat, depsGetterFn) {
        return this.reduceEventDependencies(event, (result, dependency) => {
            filterFn(dependency) && result.push(dependency);
            return result;
        }, [], flat, depsGetterFn);
    }

    // TODO: document
    mapEventPredecessors(event, fn, filterFn, flat) {
        return this.reduceEventPredecessors(event, (result, dependency) => {
            filterFn(dependency) && result.push(dependency);
            return result;
        }, [], flat);
    }

    // TODO: document
    mapEventSuccessors(event, fn, filterFn, flat) {
        return this.reduceEventSuccessors(event, (result, dependency) => {
            filterFn(dependency) && result.push(dependency);
            return result;
        }, [], flat);
    }

    /**
     * Returns all dependencies for a certain event (both incoming and outgoing)
     *
     * @param {Scheduler.model.EventModel} event
     * @return {Scheduler.model.DependencyModel[]}
     */
    getEventDependencies(event) {
        return [].concat(event.predecessors || [], event.successors || []);
    }

    /**
     * Returns all incoming dependencies of the given event
     *
     * @param {Scheduler.model.EventModel} event
     * @return {Scheduler.model.DependencyModel[]}
     * @deprecated 5.0.0
     */
    getEventPredecessors(event) {
        VersionHelper.deprecate('scheduler', '5.0.0', 'Superfluous, will be removed in favour of `event.predecessors`');
        return event.predecessors;
    }

    /**
     * Returns all outgoing dependencies of a event
     *
     * @param {Scheduler.model.EventModel} event
     * @return {Scheduler.model.DependencyModel[]}
     * @deprecated 5.0.0
     */
    getEventSuccessors(event) {
        VersionHelper.deprecate('scheduler', '5.0.0', 'Superfluous, will be removed in favour of `event.successors`');
        return event.successors;
    }

    // TODO: document
    removeEventDependencies(event) {
        this.remove(this.getEventDependencies(event));
    }

    // TODO: document
    removeEventPredecessors(event) {
        this.remove(event.predecessors);
    }

    // TODO: document
    removeEventSuccessors(event, flat) {
        this.remove(event.successors);
    }

    getBySourceTargetId(key) {
        //TODO: in original code this uses a keymap
        return this.records.find(r =>
            key == this.constructor.makeDependencySourceTargetCompositeKey(r.from, r.to)
        );
    }

    /**
     * Returns dependency model instance linking tasks with given ids. The dependency can be forward (from 1st
     * task to 2nd) or backward (from 2nd to 1st).
     *
     * @param {Scheduler.model.EventModel|String} sourceEvent 1st event
     * @param {Scheduler.model.EventModel|String} targetEvent 2nd event
     * @return {Scheduler.model.DependencyModel}
     */
    getDependencyForSourceAndTargetEvents(sourceEvent, targetEvent) {
        sourceEvent = Model.asId(sourceEvent);
        targetEvent = Model.asId(targetEvent);

        return this.getBySourceTargetId(this.constructor.makeDependencySourceTargetCompositeKey(sourceEvent, targetEvent));
    }

    /**
     * Returns a dependency model instance linking given events if such dependency exists in the store.
     * The dependency can be forward (from 1st event to 2nd) or backward (from 2nd to 1st).
     *
     * @param {Scheduler.model.EventModel|String} sourceEvent
     * @param {Scheduler.model.EventModel|String} targetEvent
     * @return {Scheduler.model.DependencyModel}
     */
    getEventsLinkingDependency(sourceEvent, targetEvent) {
        return this.getDependencyForSourceAndTargetEvents(sourceEvent, targetEvent) ||
            this.getDependencyForSourceAndTargetEvents(targetEvent, sourceEvent);
    }

    /**
     * Validation method used to validate a dependency. Override and return `true` to indicate that an
     * existing dependency between two tasks is valid. For a new dependency being created please see
     * {@link #function-isValidDependencyToCreate}.
     *
     * @param {Scheduler.model.DependencyModel|Number|String} dependencyOrFromId The dependency model or from event id
     * @param {Number|String} [toId] To event id if the first parameter is not a dependency model instance
     * @param {Number} [type] Dependency {@link Scheduler.model.DependencyBaseModel#property-Type-static}  if the first parameter is not a dependency model instance.
     * @return {Boolean}
     */
    isValidDependency(dependencyOrFromId, toId, type) {
        if (arguments.length === 1) {
            toId = dependencyOrFromId.to || dependencyOrFromId.toEvent;
            dependencyOrFromId = dependencyOrFromId.from || dependencyOrFromId.fromEvent;
        }

        // This condition is supposed to map all model instances to be validated by project. Lowest common ancestor
        // for scheduler event, scheduler pro event and gantt task is TimeSpan
        if (dependencyOrFromId instanceof TimeSpan && toId instanceof TimeSpan) {
            // Not asserting dependency type here. Default value should normally suffice.
            return this.project.isValidDependency(dependencyOrFromId, toId, type);
        }

        return dependencyOrFromId != null && toId != null && dependencyOrFromId !== toId;
    }

    /**
     * Validation method used to validate a dependency while creating. Override and return `true` to indicate that
     * a new dependency is valid to be created.
     *
     * @param {Number|String} fromId `From` event id
     * @param {Number|String} toId `To` event id
     * @param {Number} type Dependency {@link Scheduler.model.DependencyBaseModel#property-Type-static}
     * @return {Boolean}
     */
    isValidDependencyToCreate(fromId, toId, type) {
        return this.isValidDependency(fromId, toId, type);
    }

    /**
     * Returns all dependencies highlighted with the given CSS class
     *
     * @param {String} cls
     * @return {Scheduler.model.DependencyBaseModel[]}
     */
    getHighlightedDependencies(cls) {
        return this.records.reduce((result, dep) => {
            if (dep.isHighlightedWith(cls)) result.push(dep);
            return result;
        }, []);
    }

    static makeDependencySourceTargetCompositeKey(from, to) {
        return `source(${from})-target(${to})`;
    }

    //region Product neutral

    getTimeSpanDependencies(record) {
        return this.getEventDependencies(record);
    }

    //endregion
};
