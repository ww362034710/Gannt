import Model from '../../../Core/data/Model.js';

/**
 * @module Scheduler/data/mixin/AssignmentStoreMixin
 */

/**
 * This is a mixin, containing functionality related to managing assignments.
 *
 * It is consumed by the regular {@link Scheduler.data.AssignmentStore} class and Scheduler Pros counterpart.
 *
 * @mixin
 */
export default Target => class AssignmentStoreMixin extends Target {
    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 300,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 300,

            storeId : 'assignments'
        };
    }

    add(newAssignments) {
        if (!Array.isArray(newAssignments)) {
            newAssignments = [newAssignments];
        }
        for (let i = 0; i < newAssignments.length; i++) {
            let a = newAssignments[i];

            if (!(a instanceof Model)) {
                newAssignments[i] = a = this.createRecord(a);
            }
            if (this.storage.findIndex('eventResourceKey', a.eventResourceKey, true) !== -1) {
                throw new Error(`Duplicate assignment Event: ${a.eventId} to resource: ${a.resourceId}`);
            }
        }
        return super.add(newAssignments);
    }

    //region Init & destroy

    set storage(storage) {
        super.storage = storage;

        // This allows a map based, fast lookup of assignments by their eventResourceKey.
        // This is so that the test for duplicate assignment adding is fast.
        this.storage.addIndex('eventResourceKey');
    }

    get storage() {
        return super.storage;
    }

    //endregion

    //region Stores

    // To not have to do instanceof checks
    get isAssignmentStore() {
        return true;
    }

    //endregion

    //region Recurrence

    /**
     * Returns a "fake" assignment used to identify a certain occurrence of a recurring event.
     * If passed the original event, it returns `originalAssignment`.
     * @param {Scheduler.model.AssignmentModel} originalAssignment
     * @param {Scheduler.model.EventModel} occurrence
     * @returns {Object} Temporary assignment
     * @internal
     */
    getOccurrence(originalAssignment, occurrence) {
        // Pass along the original assignment for non occurrence related calls
        if (!originalAssignment || !occurrence?.isOccurrence) {
            return originalAssignment;
        }

        // Not for saving chars, needed in fn below
        const me = this;

        return {
            id           : `${occurrence.id}:a${originalAssignment.id}`,
            event        : occurrence,
            resource     : originalAssignment.resource,
            eventId      : occurrence.id,
            resourceId   : originalAssignment.resource.id,
            isAssignment : true,
            // Not being an actual record, instanceMeta is stored on the store instead
            instanceMeta(instanceOrId) {
                return me.occurrenceInstanceMeta(this, instanceOrId);
            }
        };
    }

    // Per fake assignment instance meta, stored on store since fakes are always generated on demand
    occurrenceInstanceMeta(occurrenceAssignment, instanceOrId) {
        const
            me         = this,
            instanceId = instanceOrId.id || instanceOrId,
            { id }     = occurrenceAssignment;

        let { occurrenceMeta } = me;

        if (!occurrenceMeta) {
            occurrenceMeta = me.occurrenceMeta = {};
        }

        if (!occurrenceMeta[id]) {
            occurrenceMeta[id] = {};
        }

        return occurrenceMeta[id][instanceId] || (occurrenceMeta[id][instanceId] = {});
    }

    //endregion

    //region Mapping

    /**
     * Maps over event assignments.
     *
     * @param {Scheduler.model.EventModel} event
     * @param {Function} [fn]
     * @param {Function} [filterFn]
     * @return {Scheduler.model.EventModel[]|Array}
     */
    mapAssignmentsForEvent(event, fn, filterFn) {
        event = this.eventStore.getById(event);

        const
            fnSet           = Boolean(fn),
            filterFnSet     = Boolean(filterFn);

        if (fnSet || filterFnSet) {
            return event.assignments.reduce((result, assignment) => {
                const mapResult = fnSet ? fn(assignment) : assignment;

                if (!filterFnSet || filterFn(mapResult)) {
                    result.push(mapResult);
                }

                return result;
            }, []);
        }

        return event.assignments;
    }

    /**
     * Maps over resource assignments.
     *
     * @param {Scheduler.model.ResourceModel|Number|String} resource
     * @param {Function} [fn]
     * @param {Function} [filterFn]
     * @return {Scheduler.model.ResourceModel[]|Array}
     */
    mapAssignmentsForResource(resource, fn, filterFn) {
        resource = this.resourceStore.getById(resource);

        const
            fnSet           = Boolean(fn),
            filterFnSet     = Boolean(filterFn);

        if (fnSet || filterFnSet) {
            return resource.assignments.reduce((result, assignment) => {
                const mapResult = fnSet ? fn(assignment) : assignment;

                if (!filterFnSet || filterFn(mapResult)) {
                    result.push(mapResult);
                }

                return result;
            }, []);
        }

        return resource.assignments;
    }

    /**
     * Returns all assignments for a given event.
     *
     * @param {Scheduler.model.TimeSpan} event
     * @return {Scheduler.model.AssignmentModel[]}
     */
    getAssignmentsForEvent(event) {
        return event.assignments;
    }

    /**
     * Removes all assignments for given event
     *
     * @param {Scheduler.model.TimeSpan} event
     */
    removeAssignmentsForEvent(event) {
        return this.remove(event.assignments);
    }

    /**
     * Returns all assignments for a given resource.
     *
     * @param {Scheduler.model.ResourceModel} resource
     * @return {Scheduler.model.AssignmentModel[]}
     */
    getAssignmentsForResource(resource) {
        resource = this.resourceStore.getById(resource);
        return resource.assignments;
    }

    /**
     * Removes all assignments for given resource
     *
     * @param {Scheduler.model.ResourceModel|*} resource
     */
    removeAssignmentsForResource(resource) {
        this.remove(this.getAssignmentsForResource(resource));
    }

    /**
     * Returns all resources assigned to an event.
     *
     * @param {Scheduler.model.EventModel} event
     * @return {Scheduler.model.ResourceModel[]}
     */
    getResourcesForEvent(event) {
        return event.resources;
    }

    /**
     * Returns all events assigned to a resource
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @return {Scheduler.model.TimeSpan[]}
     */
    getEventsForResource(resource) {
        resource = this.resourceStore.getById(resource);

        return resource && resource.events;
    }

    /**
     * Creates and adds assignment record(s) for a given event and resource(s).
     *
     * @param {Scheduler.model.TimeSpan} event
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} resources The resource(s) to assign to the event
     * @param {Boolean} [removeExistingAssignments] `true` to remove assignments for other resources
     * @return {Scheduler.model.AssignmentModel[]} An array with the created assignment(s)
     */
    assignEventToResource(event, resources, assignmentSetupFn = o => o, removeExistingAssignments = false) {
        const
            me            = this,
            toRemove      = removeExistingAssignments ? new Set(event.assignments) : null,
            oldAutoCommit = me.autoCommit;

        resources     = Array.isArray(resources) ? resources : [resources];

        // Use same code path as other single assignments if already assigned
        if (me.eventStore && me.eventStore.usesSingleAssignment && event.assignments.length) {
            if (!me.isEventAssignedToResource(event, resources[0])) {
                event.resource = resources[0];
            }

            return [];
        }

        let newAssignments = [];

        me.autoCommit = false;

        // Assign
        resources.forEach(resource => {
            const assignment = me.getAssignmentForEventAndResource(event, resource);
            if (!assignment) {
                let assignment = {
                    eventId    : Model.asId(event),
                    resourceId : Model.asId(resource)
                };

                assignment = assignmentSetupFn(assignment);

                newAssignments.push(assignment);
            }
            else if (removeExistingAssignments) {
                toRemove.delete(assignment);
            }
        });

        newAssignments = me.add(newAssignments);

        if (removeExistingAssignments) {
            me.remove(Array.from(toRemove));
        }

        // If true, will trigger a commit
        me.autoCommit = oldAutoCommit;

        return newAssignments;
    }

    /**
     * Removes assignment record for a given event and resource.
     *
     * @param {Scheduler.model.TimeSpan|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} [resources] The resource to unassign the event from. If omitted, all resources of the events will be unassigned
     * @return {Scheduler.model.AssignmentModel|Scheduler.model.AssignmentModel[]}
     */
    unassignEventFromResource(event, resources) {
        const
            me = this,
            assignmentsToRemove = [];

        if (!resources) {
            return me.removeAssignmentsForEvent(event);
        }

        if (!Array.isArray(resources)) {
            resources = [resources];
        }

        for (let i = 0; i < resources.length; i++) {
            if (me.isEventAssignedToResource(event, resources[i])) {
                assignmentsToRemove.push(me.getAssignmentForEventAndResource(event, resources[i]));
            }
        }

        return me.remove(assignmentsToRemove);
    }

    /**
     * Checks whether an event is assigned to a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event Event record or id
     * @param {Scheduler.model.ResourceModel|String|Number} resource Resource record or id
     * @return {Boolean}
     */
    isEventAssignedToResource(event, resource) {
        return Boolean(this.getAssignmentForEventAndResource(event, resource));
    }

    /**
     * Returns an assignment record for a given event and resource
     *
     * @param {Scheduler.model.EventModel|String|Number} event The event or its id
     * @param {Scheduler.model.ResourceModel|String|Number} resource The resource or its id
     * @return {Scheduler.model.AssignmentModel}
     */
    getAssignmentForEventAndResource(event, resource) {
        event    = this.eventStore.getById(event);
        resource = this.resourceStore.getById(resource);

        if (!event || !resource) {
            return null;
        }

        return this.getOccurrence(event.assignments.find(a => a.resource === resource), event);
    }

    //endregion
};
