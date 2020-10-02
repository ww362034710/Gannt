/* eslint-disable no-unused-expressions */

/**
 * @module Scheduler/data/mixin/SharedEventStoreMixin
 */

/**
 * This is a mixin, containing functionality related to managing events.
 *
 * It is consumed by the regular {@link Scheduler.data.EventStore} class and Scheduler Pros counterpart.
 *
 * @mixin
 */
export default Target => class SharedEventStoreMixin extends Target {
    static get defaultConfig() {
        return {
            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 100,
            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 200,

            storeId : 'events',

            /**
             * Configure with `true` to also remove the event when removing the last assignment from the linked
             * AssignmentStore. This config has not effect when using EventStore in legacy `resourceId`-mode.
             * @config {Boolean}
             * @default
             * @category Common
             */
            removeUnassignedEvent : true
        };
    }

    static get properties() {
        return {
            assignmentsAutoAddSuspended : 0
        };
    }

    /**
     * Class used to represent records. Defaults to class EventModel.
     * @property {Scheduler.model.EventModel}
     * @category Records
     * @typings { new(data: object): Model }
     * @name modelClass
     */

    construct(config) {
        super.construct(config, true);

        if (!this.modelClass.isEventModel) {
            throw new Error('The model for the EventStore must subclass EventModel');
        }
    }

    suspendAssignmentsAutoAdd() {
        this.assignmentsAutoAddSuspended++;
    }

    resumeAssignmentsAutoAdd() {
        if (this.assignmentsAutoAddSuspended > 0) {
            this.assignmentsAutoAddSuspended--;
        }
    }

    /**
     * Appends a new record to the store
     * @param {Scheduler.model.EventModel} record The record to append to the store
     */
    append(record) {
        return this.add(record);
    }

    //region Project

    get project() {
        return super.project;
    }

    set project(project) {
        super.project = project;

        this.detachListeners('project');

        if (project) {
            project.on({
                name                  : 'project',
                refresh               : 'onProjectRefresh',
                assignmentStoreChange : 'onProjectAssignmentStoreChange',
                thisObj               : this,
                prio                  : 200 // Before UI updates
            });

            // Project already has AssignmentStore instance? Attach to it
            if (project.assignmentStore && project.assignmentStore.isAssignmentStore) {
                this.attachToAssignmentStore(project.assignmentStore);
            }
        }
    }

    //endregion

    //region Single assignment

    processRecord(eventRecord, isDataset = false) {
        super.processRecord(eventRecord, isDataset);

        const resourceId = eventRecord.get('resourceId');

        if (resourceId != null) {
            const
                me                  = this,
                { assignmentStore } = me,
                existingRecord      = me.getById(eventRecord.id),
                isReplacing         = existingRecord && existingRecord !== eventRecord && !isDataset;

            // Replacing an existing event, repoint the resource of its assignment
            // (already repointed to the new event by engine in EventStoreMixin)
            if (isReplacing) {
                // Have to look assignment up on store, removed by engine in super call above
                const assignment = assignmentStore.find(e => e.eventId === eventRecord.id);
                if (assignment) {
                    assignment.resource = resourceId;
                    me.reassignedFromReplace = true;
                }
            }
            // AssignmentStore found, add an assignment to it if this is no a dataset operation
            else if (assignmentStore && !isDataset && !me.assignmentsAutoAddSuspended) {
                // Cannot use `event.assign(resourceId)` since event is not part of store yet
                // Using a bit shorter generated id to not look so ugly in DOM
                assignmentStore.add({ id : assignmentStore.modelClass.generateId(''), resourceId, eventId : eventRecord.id });
            }
            // No AssignmentStore assigned yet, need to process when that happens. Or if it is a dataset operation,
            // processing will happen at the end of it to not add individual assignment (bad for performance)
            else {
                me.$processResourceIds = true;
            }

            // Flag that we have been loaded using resourceId, checked by CrudManager to exclude the internal
            // AssignmentStore from sync
            me.usesSingleAssignment = true;
        }

        return eventRecord;
    }

    processResourceIds() {
        const { assignmentStore } = this;

        if (this.$processResourceIds && assignmentStore?.isAssignmentStore) {
            const assignments = [];

            // resourceIds used during initialization, convert into assignments
            this.forEach(eventRecord => {
                const { resourceId, id : eventId } = eventRecord;
                if (resourceId != null) {
                    // Using a bit shorter generated id to not look so ugly in DOM
                    assignments.push({
                        id : assignmentStore.modelClass.generateId(''),
                        resourceId,
                        eventId
                    });
                }
            });

            // Disable as much as possible, since we are in full control of this store when using single assignment mode
            assignmentStore.useRawData = {
                disableDefaultValue     : true,
                disableDuplicateIdCheck : true,
                disableTypeConversion   : true
            };
            assignmentStore.data = assignments;

            this.$processResourceIds = false;
        }
    }

    loadData() {
        super.loadData(...arguments);

        this.processResourceIds();
    }

    // Optionally remove unassigned events
    onBeforeRemoveAssignment({ records }) {
        const me = this;

        if (
            me.removeUnassignedEvent && !me.isRemoving && !me.isSettingData && (!me.stm?.isRestoring) &&
            !me.usesSingleAssignment
        ) {
            const toRemove = new Set();

            // Collect all events that are unassigned after the remove
            records.forEach(assignmentRecord => {
                if (assignmentRecord.event.assignments.every(a => records.includes(a)) && !assignmentRecord.event.isRemoved) {
                    toRemove.add(assignmentRecord.event);
                }
            });

            // And remove them
            if (toRemove.size) {
                me.remove([...toRemove]);
            }
        }
    }

    onProjectRefresh() {
        // Events are first rendered on project refresh, but if during initial commit event
        // start date was changed by constraint (dependency, own, etc), this change won't be reflected
        // in UI unless we clear cached date values
        // Covered by SchedulerPro.t
        this.forEach(record => record.clearCachedValues());
    }

    onProjectAssignmentStoreChange({ store }) {
        this.attachToAssignmentStore(store);
    }

    attachToAssignmentStore(assignmentStore) {
        const me = this;

        me.detachListeners('assignmentStore');

        if (assignmentStore) {
            me.processResourceIds();

            assignmentStore.on({
                name : 'assignmentStore',

                // Adding an assignment in single assignment mode should set events resourceId if needed
                add({ records }) {
                    if (me.usesSingleAssignment && !me.isSettingData) {
                        records.forEach(assignment => {
                            const { event } = assignment;
                            if (event?.isEvent && event.resourceId !== assignment.resourceId) {
                                event.set('resourceId', assignment.resourceId);
                            }
                        });
                    }
                },

                // Called both for remove and removeAll
                beforeRemove : 'onBeforeRemoveAssignment',

                // Removing an assignment in single assignment mode should set events resourceId to null
                remove({ records }) {
                    if (me.usesSingleAssignment) {
                        records.forEach(assignment => {
                            // With engine link to event is already broken when we get here, hence the lookup
                            me.getById(assignment.eventId)?.set('resourceId', null);
                        });
                    }
                },

                removeAll() {
                    if (me.usesSingleAssignment && !me.isSettingData) {
                        me.allRecords.forEach(eventRecord => eventRecord.set('resourceId', null));
                    }
                },

                // Keep events resourceId in sync with assignment on changes in single assignment mode
                update({ record, changes }) {
                    if (me.usesSingleAssignment && 'resourceId' in changes) {
                        record.event.set('resourceId', changes.resourceId.value);
                    }
                },
                thisObj : me
            });
        }
    }

    set data(data) {
        this.isSettingData = true;

        // // When using single assignment, remove all assignments when loading a new set of events
        if (this.usesSingleAssignment) {
            this.assignmentStore.removeAll(true);
        }

        super.data = data;

        this.isSettingData = false;
    }

    // Override trigger to decorate update/change events with a flag if resourceId was the only thing changed, in which
    // case the change most likely can be ignored since the assignment will also change
    trigger(eventName, params) {
        const { changes } = params || {};

        if (changes && 'resourceId' in changes && Object.keys(changes).length === 1) {
            params.isAssign = true;
        }

        super.trigger(...arguments);
    }

    //endregion
};
