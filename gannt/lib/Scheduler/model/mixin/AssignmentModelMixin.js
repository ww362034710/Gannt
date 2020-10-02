/**
 * @module Scheduler/model/mixin/AssignmentModelMixin
 */

/**
 * Mixin that holds configuration shared between assignments in Scheduler and Scheduler Pro.
 * @mixin
 */
export default Target => class AssignmentModelMixin extends Target {

    //region Fields

    static get fields() {
        return [
            /**
             * Id for the resource assigned
             * @field {String|Number} resourceId
             */
            { name : 'resourceId' },

            /**
             * Id for the event assigned
             * @field {String|Number} eventId
             */
            { name : 'eventId' },

            /**
             * Specify `false` to opt out of drawing dependencies from/to this assignment
             * @field {Boolean} drawDependencies
             */
            { name : 'drawDependencies', type : 'boolean' }
        ];
    }

    //endregion

    construct(data, ...args) {
        data = data || {};

        // Engine expects event and resource, not eventId and resourceId. We need to support both
        if (data.eventId != null) {
            data.event = data.eventId;
        }

        if (data.resourceId != null) {
            data.resource = data.resourceId;
        }

        super.construct(data, ...args);
    }

    //region Event & resource

    /**
     * A key made up from the event id and the id of the resource assigned to.
     * @property eventResourceKey
     * @readonly
     */
    get eventResourceKey() {
        return `${this.event ? this.eventId : this.data.eventId || this.internalId}-${this.resource ? this.resourceId : this.data.resourceId || this.internalId}`;
    }

    afterChange(toSet, wasSet, silent, fromRelationUpdate) {
        // Resource was set, store its id as resourceId and announce it
        if (wasSet.resource) {
            const
                resource = wasSet.resource.value,
                value    = resource?.isModel ? resource.id : resource,
                // Get old value, bypassing getter intentionally to check data
                oldValue = this.get('resourceId');

            if (value !== oldValue) {
                wasSet.resourceId = { value, oldValue };

                this.setData('resourceId', value);
            }
        }

        // Same for event
        if (wasSet.event) {
            const
                event    = wasSet.event.value,
                value    = event?.isModel ? event.id : event,
                // Get old value, bypassing getter intentionally to check data
                oldValue = this.get('eventId');

            if (value !== oldValue) {
                wasSet.eventId = { value, oldValue };

                this.setData('eventId', value);
            }
        }

        super.afterChange(...arguments);
    }

    // Settings resourceId relays to `resource`. Underlying data will be updated in `afterChange()` above
    set resourceId(value) {
        const { resource } = this;

        // When assigning a new id to a resource, it will update the resourceId of the assignment. But the assignments
        // resource is still the same so we need to announce here
        if (resource?.isModel && resource.id === value) {
            this.set('resourceId', value);
        }
        else {
            this.resource = value;
        }
    }

    get resourceId() {
        // If assigned using `resource` and not `resourceId` there will be no resourceId
        return this.get('resourceId') || this.resource?.id;
    }

    // Same for event as for resourceId
    set eventId(value) {
        const { event } = this;

        // When assigning a new id to an event, it will update the eventId of the assignment. But the assignments
        // event is still the same so we need to announce here
        if (event?.isModel && event.id === value) {
            this.set('eventId', value);
        }
        else {
            this.event = value;
        }
    }

    get eventId() {
        // If assigned using `event` and not `eventId` there will be no eventId
        return this.get('eventId') || this.event?.id;
    }

    /**
     * Convenience property to get the name of the associated event.
     * @property {String}
     * @readonly
     */
    get eventName() {
        return this.event?.name;
    }

    /**
     * Convenience property to get the name of the associated resource.
     * @property {String}
     * @readonly
     */
    get resourceName() {
        return this.resource?.name;
    }

    // TODO : Deprecate in favor of `get resource`
    /**
     * Returns the resource associated with this assignment.
     *
     * @return {Scheduler.model.ResourceModel} Instance of resource
     */
    getResource() {
        return this.resource;
    }

    //endregion

    // Convenience getter to not have to check `instanceof AssignmentModel`
    get isAssignment() {
        return true;
    }

    /**
     * Returns true if the Assignment can be persisted (e.g. task and resource are not 'phantoms')
     *
     * @return {Boolean} true if this model can be persisted to server.
     */
    get isPersistable() {
        const
            {
                event,
                resource,
                unjoinedStores,
                assignmentStore
            }           = this,
            crudManager = assignmentStore?.crudManager;

        let result;

        if (assignmentStore) {
            // if crud manager is used it can deal with phantom event/resource since it persists all records in one batch
            // if no crud manager used we have to wait till event/resource are persisted
            result = this.isValid && (crudManager || !event.hasGeneratedId && !resource.hasGeneratedId);
        }
        // if we remove the record
        else {
            result = Boolean(unjoinedStores[0]);
        }

        return result;
    }

    get isValid() {
        return this.resource != null && this.event != null;
    }

};
