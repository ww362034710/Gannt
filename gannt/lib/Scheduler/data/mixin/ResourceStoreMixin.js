import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/mixin/ResourceStoreMixin
 */

/**
 * This is a mixin for the ResourceStore functionality. It is consumed by the {@link Scheduler.data.ResourceStore}.
 *
 * @mixin
 */
export default Target => class ResourceStoreMixin extends (Target || Base) {

    get isResourceStore() {
        return true;
    }

    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 200,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 100,
            storeId      : 'resources',
            autoTree     : true
        };
    }

    construct(config) {
        super.construct(config);

        if (!this.modelClass.isResourceModel) {
            throw new Error('Model for ResourceStore must subclass ResourceModel');
        }
    }

    removeAll() {
        const result = super.removeAll(...arguments);

        // Removing all resources removes all assignments
        result && this.assignmentStore.removeAll();

        return result;
    }

    // Apply id changes also to assignments (used to be handled automatically by relations earlier, but engine does not
    // care about ids so needed now)
    // problems:
    // 1. orientation/HorizontalRendering listens to assignment store changes and is trying to refresh view
    // When we update resource id on assignment, listener will be invoken and view will try to refresh. And it will
    // fail, because row is not updated yet. Flag is raised on resource store to make HorizontalRendering to skip
    // refreshing view in this particular case of resource id changing
    onRecordIdChange({ record, oldValue, value }) {
        super.onRecordIdChange({ record, oldValue, value });

        if (record.isFieldModified('id')) {
            this.isChangingId = true;

            record.updateAssignmentResourceIds();

            this.isChangingId = false;
        }
    }
};
