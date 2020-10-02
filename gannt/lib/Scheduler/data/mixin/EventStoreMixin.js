import Base from '../../../Core/Base.js';
import Model from '../../../Core/data/Model.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import AssignmentModel from '../../model/AssignmentModel.js';
import VersionHelper from '../../../Core/helper/VersionHelper.js';

/**
 * @module Scheduler/data/mixin/EventStoreMixin
 */

const
    returnTrue = () => true,
    emptyArray = Object.freeze([]),
    emptyIndex = Object.freeze({}),
    MS_PER_DAY = 864e5;

/**
 * This is a mixin, containing functionality related to managing events.
 *
 * It is consumed by the regular {@link Scheduler.data.EventStore} class and the Gantt `TaskStore` classes
 * to allow data sharing between a Gantt chart and a Scheduler.
 *
 * @mixin
 */
export default Target => class EventStoreMixin extends (Target || Base) {

    //region Init & destroy

    construct(config) {
        super.construct(config);

        Object.assign(this, {
            autoTree : true
        });
    }

    //endregion

    //region Indices

    // Override to syncIndices on initial load
    afterLoadData() {
        this.syncIndices('splice', this.storage.allValues);
        // Babel cannot transpile ?. version of this correctly for some reason
        super.afterLoadData && super.afterLoadData();
    }

    /**
     * Responds to mutations of the underlying storage Collection.
     *
     * Maintain indices for fast finding of events by date.
     * @param {Object} event
     * @private
     */
    onDataChange({ action, added, removed, replaced }) {
        // Indices must be synced before responding to change
        this.syncIndices(action, added, removed, replaced);
        super.onDataChange(...arguments);
    }

    // TODO: Improve Collection indices to handle this

    // Keeps date & startDate indices up to date, used by Calendar and recurrence
    // The indices are initialized lazily on first access, and then kept up to date on changes
    syncIndices(action, added = emptyArray, removed = emptyArray, replaced) {
        const
            me            = this,
            replacedCount = replaced?.length;

        // Only create indices if they have been requested
        if (me.dateIndicesRequested) {

            switch (action) {
                case 'clear':
                    me._startDateIndex = {};
                    me._dateIndex = {};
                    break;

                // Add and remove
                case 'splice':
                    // Handle replacement of records by instances with same ID
                    if (replacedCount) {
                        added = added.slice();
                        removed = removed.slice();

                        for (let i = 0; i < replacedCount; i++) {
                            removed.push(replaced[i][0]);
                            added.push(replaced[i][1]);
                        }
                    }

                    const
                        addedCount   = added.length,
                        removedCount = removed.length;

                    let dateMS, endDateMS;

                    // Remove entries from indices
                    if (removedCount) {
                        for (let i = 0; i < removedCount; i++) {
                            const outgoingEvent = removed[i];

                            dateMS        = DateHelper.clearTime(outgoingEvent.startDate)?.getTime();
                            endDateMS     = outgoingEvent.endDate?.getTime() ?? dateMS;

                            // Must handle unscheduled events
                            if (dateMS) {
                                me.removeIndexEntry('startDate', outgoingEvent, DateHelper.makeKey(dateMS));

                                do {
                                    me.removeIndexEntry('date', outgoingEvent, DateHelper.makeKey(dateMS));
                                    dateMS += MS_PER_DAY;
                                } while (dateMS < endDateMS);
                            }
                        }
                    }

                    // Add entries to indices
                    if (addedCount) {
                        for (let i = 0; i < addedCount; i++) {
                            const newEvent  = added[i];

                            // Can only be date-indexed if it's scheduled
                            if (newEvent.isScheduled) {
                                dateMS    = DateHelper.clearTime(newEvent.startDate)?.getTime();
                                endDateMS = newEvent.endDate?.getTime() ?? dateMS;

                                // Must handle unscheduled events
                                if (dateMS) {
                                    me.addIndexEntry('startDate', newEvent, DateHelper.makeKey(dateMS));

                                    do {
                                        me.addIndexEntry('date', newEvent, DateHelper.makeKey(dateMS));
                                        dateMS += MS_PER_DAY;
                                    } while (dateMS < endDateMS);
                                }
                            }
                        }
                    }
                    break;
            }
        }
    }

    onModelChange(record, toSet, wasSet, silent, fromRelationUpdate) {
        // Ensure by-date indices are up to date.
        if (('startDate' in wasSet) || ('endDate' in wasSet)) {
            record = [record];
            this.syncIndices('splice', record, record);
        }

        super.onModelChange(...arguments);
    }

    addIndexEntry(indexName, value, key = value[indexName]) {
        const
            indexPropName = `_${indexName}Index`,
            index         = this[indexPropName] || (this[indexPropName] = {}),
            entry         = index[key] || (index[key] = new Set());

        entry.add(value);
    }

    removeIndexEntry(indexName, value, key = value[indexName]) {
        const
            indexPropName = `_${indexName}Index`,
            index         = this[indexPropName] || (this[indexPropName] = {}),
            entry         = index[key];

        if (entry) {
            entry.delete(value);
        }
    }

    // Retrieve the date or startDate index, building them on first request
    getDateIndex(indexName) {
        const me = this;

        // Date indices are created on first usage and after that kept up to date on changes
        if (!me.dateIndicesRequested) {
            me.dateIndicesRequested = true;
            me.syncIndices('splice', me.storage.allValues);
        }

        return me[`_${indexName}Index`];
    }

    //endregion

    //region Events records, iteration etc.

    /**
     * Returns events between the supplied start and end date
     *
     * @param {Date} startDate The start date
     * @param {Date} endDate The end date
     * @param {Boolean} allowPartial false to only include events that start and end inside of the span
     * @param {Boolean} onlyAssigned true to only include events that are assigned to a resource
     * @return {Scheduler.model.EventModel[]} the events
     * @category Events
     * @deprecated 4.0.0 Use {@link #function-getEvents}
     */
    getEventsInTimeSpan(startDate, endDate, allowPartial = true, onlyAssigned = false) {
        VersionHelper.deprecate('Scheduler', '5.0.0', '`getEventsInTimeSpan` method deprecated, in favor of `getEvents`');

        return this.getEvents({
            startDate,
            endDate,
            allowPartial,
            onlyAssigned
        });
    }

    /**
     * Returns all events that starts on the specified day.
     *
     * @param {Date} startDate Start date
     * @returns {Scheduler.model.EventModel[]} Events starting on specified day
     * @category Events
     * @deprecated 4.0.0 Use {@link #function-getEvents}
     */
    getEventsByStartDate(startDate) {
        VersionHelper.deprecate('Scheduler', '5.0.0', '`getEventsByStartDate` method deprecated, in favor of `getEvents`');

        return this.getEvents({
            startDate,
            startOnly : true
        });
    }

    /**
     * Returns an array of events for the date range specified by the `startDate` and `endDate` options.
     *
     * By default, for any date, this includes any event which *intersects* that date.
     *
     * To only include events that are fully contained *within* the date range, pass the `allowPartial`
     * option as `false`
     *
     * By default, any occurrences of recurring events are included in the resulting array. If that is not
     * required, pass the `includeOccurrences` option as `false`
     *
     * example:
     *
     * ```javascript
     *  visibleEvents = eventStore.getEvents({
     *      resourceRecord : myResource,
     *      startDate      : scheduler.timeAxis.startDate,
     *      endDate        : scheduler.timeAxis.endDate
     *  });
     * ```
     *
     * @param {Date} [options.date] If only one date is required, pass this option instead of the
     * `startDate` and `endDate` options.
     * @param {Date} [options.startDate] The start date for the range of events to include.
     * @param {Date} [options.endDate] The end date for the range of events to include.
     * @param {Scheduler.model.ResourceModel} options.resourceRecord Pass a resource to only return events assigned to
     *   this resource.
     * @param {Function} [options.filter] A function to filter out events which are not required.
     * @param {Boolean} [options.includeOccurrences=true] Occurrences of recurring events are included by default.
     * @param {Boolean} [options.allowPartial=true] Events which start before or after the range, but *intersect* the
     *   range are included by default.
     * @param {Boolean} [options.startOnly] Pass `true` to only include events which *start on* each date in the range.
     * @param {Boolean} [options.onlyAssigned] Pass `true` to only include events that are assigned to a resource
     * @returns {Scheduler.model.EventModel[]} Events which match the passed configuration.
     * @category Events
     */
    getEvents({
        filter,
        date,
        resourceRecord,
        startDate = date,           // Events which intersect the startDate/endDate
        endDate,                    // will be returned
        startOnly,                  // Only events which start on each date will be returned
        includeOccurrences = true,  // Interpolate occurrences into the returned event set
        allowPartial = !startOnly,  // Include events which *intersect* the date range
        onlyAssigned = false        // Only include events that are assigned to a resource
    }) {
        const
            me    = this,
            events = [];

        if (me.count) {
            const storeFilterFn = me.isFiltered ? eventRecord => me.indexOf(eventRecord) > -1 : null;

            let dateFilter,
                candidateEvents = resourceRecord ? me.getEventsForResource(resourceRecord) : new Set();

            // Default to a one day range if only startDate passed
            if (!endDate) {
                if (startDate) {
                    endDate = DateHelper.clearTime(startDate);
                    endDate.setDate(endDate.getDate() + 1);
                }
                // If no dates passed, the dateFilter will include all.
                else {
                    dateFilter = returnTrue;
                }
            }

            if (!dateFilter) {
                // Filter for events according to our date matching options.
                if (allowPartial) {
                    dateFilter = e => e.startDate && DateHelper.intersectSpans(e.startDate, e.endDate || e.startDate, startDate, endDate);
                }
                else if (startOnly) {
                    dateFilter = e => e.startDate && !(DateHelper.clearTime(e.startDate) - startDate);
                }
                else {
                    dateFilter = e => e.startDate && e.startDate >= startDate && (e.endDate || e.startDate) <= endDate;
                }
            }

            // If there *was* a resourceRecord, candidateEvents will already be set up using me.getEventsForResource.
            // If no resourceRecord specified, we are gathering by date, so use the indices.
            if (!resourceRecord) {
                const
                    eventSet = new Set(),
                    index    = me.getDateIndex(startOnly ? 'startDate' : 'date') || emptyIndex;

                // Add all recurring events which started on or before our date range.
                me.recurringEvents.forEach(e => {
                    if (DateHelper.clearTime(e.startDate) <= startDate) {
                        eventSet.add(e);
                    }
                });

                // Iterate the date range, using the indices to find qualifed events.
                for (const date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
                    const coincidingEvents = index[DateHelper.makeKey(date)];

                    if (coincidingEvents) {
                        coincidingEvents.forEach(e => eventSet.add(e));
                    }
                }

                // We gathered all events which *coincide* with each date.
                // We also added in all recurring events which started on or before our date range.
                // All these were made unique by the Set.
                // Return it to array form.
                candidateEvents = [...eventSet];
            }

            // Events found from the date indices won't be filtered.
            // On the other side, when using getEventForResource we will get all events for
            // the resource even if the EventStore is filtered, handle this by excluding "invisible" events here
            if (storeFilterFn) {
                candidateEvents = candidateEvents.filter(storeFilterFn);
            }

            // Go through candidates.
            // For a recurring event, and we are including recurrences, add date-qualifying occurrences.
            // For a non-recurring event, add it if it's date-qualified.
            for (let i = 0, { length } = candidateEvents; i < length; i++) {
                const e = candidateEvents[i];

                // For recurring events, add date-qualifying occurrences, not the base
                if (e.isRecurring && includeOccurrences) {
                    events.push.apply(events, e.getOccurrencesForDateRange(startDate, endDate).filter(dateFilter));
                }
                // For ordinary events, add if it's date-qualified
                else {
                    if (dateFilter(e)) {
                        events.push(e);
                    }
                }
            }
        }

        filter = filter && onlyAssigned ? e => filter(e) && e.resources.length : onlyAssigned ? e => e.resources.length : filter;

        return filter ? events.filter(filter) : events;
    }

    /**
     * Calls the supplied iterator function once for every scheduled event, providing these arguments
     * - event : the event record
     * - startDate : the event start date
     * - endDate : the event end date
     *
     * Returning false cancels the iteration.
     *
     * @param {Function} fn iterator function
     * @param {Object} thisObj `this` reference for the function
     * @category Events
     */
    forEachScheduledEvent(fn, thisObj = this) {
        this.forEach(event => {
            const { startDate, endDate } = event;

            if (startDate && endDate) {
                return fn.call(thisObj, event, startDate, endDate);
            }
        });
    }

    /**
     * Returns an object defining the earliest start date and the latest end date of all the events in the store.
     *
     * @return {Object} An object with 'start' and 'end' Date properties (or null values if data is missing).
     * @category Events
     */
    getTotalTimeSpan() {
        let earliest = new Date(9999, 0, 1),
            latest   = new Date(0);

        this.forEach(event => {
            if (event.startDate) {
                earliest = DateHelper.min(event.startDate, earliest);
            }
            if (event.endDate) {
                latest = DateHelper.max(event.endDate, latest);
            }
        });

        // TODO: this will fail in programs designed to work with events in the past (after Jan 1, 1970)
        earliest = earliest < new Date(9999, 0, 1) ? earliest : null;
        latest   = latest > new Date(0) ? latest : null;

        // keep last calculated value to be able to track total timespan changes
        return (this.lastTotalTimeSpan = {
            startDate : earliest || null,
            endDate   : latest || earliest || null
        });
    }

    /**
     * Checks if given event record is persistable. By default it always is, override EventModels `isPersistable` if you
     * need custom logic.
     *
     * @param {Scheduler.model.EventModel} event
     * @return {Boolean}
     * @category Events
     */
    isEventPersistable(event) {
        return event.isPersistable;
    }

    //endregion

    //region Resource

    /**
     * Checks if a date range is allocated or not for a given resource.
     * @param {Date} start The start date
     * @param {Date} end The end date
     * @param {Scheduler.model.EventModel} excludeEvent An event to exclude from the check (or null)
     * @param {Scheduler.model.ResourceModel} resource The resource
     * @return {Boolean} True if the timespan is available for the resource
     * @category Resource
     */
    isDateRangeAvailable(start, end, excludeEvent, resource) {
        if (excludeEvent instanceof AssignmentModel) {
            const
                currentEvent = excludeEvent.event,
                resources    = currentEvent.resources,
                allEvents    = new Set(resource.events);

            resources.forEach(resource => {
                resource.events.forEach(e => allEvents.add(e));
            });

            allEvents.delete(currentEvent);

            return !Array.from(allEvents).some(ev => DateHelper.intersectSpans(start, end, ev.startDate, ev.endDate));
        }

        return !this.getEventsForResource(resource).some(event =>
            !(event === excludeEvent || !event.isScheduled || !DateHelper.intersectSpans(start, end, event.startDate, event.endDate))
        );
    }

    /**
     * Filters the events associated with a resource, based on the function provided. An array will be returned for those
     * events where the passed function returns true.
     * @param {Scheduler.model.ResourceModel} resource
     * @param {Function} fn The function
     * @param {Object} [thisObj] `this` reference for the function
     * @return {Scheduler.model.EventModel[]} the events in the time span
     * @private
     * @category Resource
     */
    filterEventsForResource(resource, fn, thisObj = this) {
        return resource.getEvents(this).filter(fn.bind(thisObj));
    }

    /**
     * Returns all resources assigned to an event.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @return {Scheduler.model.ResourceModel[]}
     * @category Resource
     */
    getResourcesForEvent(event) {
        // If we are sent an occurrence, use its parent
        if (event.isOccurrence) {
            event = event.recurringTimeSpan;
        }

        return this.assignmentStore.getResourcesForEvent(event);
    }

    /**
     * Returns all events assigned to a resource.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource Resource or resource id.
     *   *NOTE:* this does not include occurrences of recurring events. Use the {@link #function-getEvents} API
     *   to include occurrences of recurring events.
     * @return {Scheduler.model.EventModel[]}
     * @category Resource
     */
    getEventsForResource(resource) {
        return this.assignmentStore.getEventsForResource(resource);
    }

    //endregion

    //region Assignment

    /**
     * Returns all assignments for a given event.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @return {Scheduler.model.AssignmentModel[]}
     * @category Assignment
     */
    getAssignmentsForEvent(event) {
        return this.assignmentStore.getAssignmentsForEvent(event) || [];
    }

    /**
     * Returns all assignments for a given resource.
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @return {Scheduler.model.AssignmentModel[]}
     * @category Assignment
     */
    getAssignmentsForResource(resource) {
        return this.assignmentStore.getAssignmentsForResource(resource) || [];
    }

    /**
     * Creates and adds assignment record for a given event and a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number|Scheduler.model.ResourceModel[]|String[]|number[]} resource The resource(s) to assign to the event
     * @param {Boolean} [removeExistingAssignments] `true` to first remove existing assignments
     * @return {Scheduler.model.AssignmentModel[]} An array with the created assignment(s)
     * @category Assignment
     */
    assignEventToResource(event, resource, removeExistingAssignments = false) {
        return this.assignmentStore.assignEventToResource(event, resource, undefined, removeExistingAssignments);
    }

    /**
     * Removes assignment record for a given event and a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @category Assignment
     */
    unassignEventFromResource(event, resource) {
        this.assignmentStore.unassignEventFromResource(event, resource);
    }

    /**
     * Reassigns an event from an old resource to a new resource
     *
     * @param {Scheduler.model.EventModel}    event    An event or id of the event to reassign
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} oldResource A resource or id to unassign from
     * @param {Scheduler.model.ResourceModel|Scheduler.model.ResourceModel[]} newResource A resource or id to assign to
     * @category Assignment
     */
    reassignEventFromResourceToResource(event, oldResource, newResource) {
        const
            me            = this,
            newResourceId = Model.asId(newResource),
            assignment    = me.assignmentStore.getAssignmentForEventAndResource(event, oldResource);

        if (assignment) {
            assignment.resourceId = newResourceId;
        }
        else {
            me.assignmentStore.assignEventToResource(event, newResource);
        }

    }

    /**
     * Checks whether an event is assigned to a resource.
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @return {Boolean}
     * @category Assignment
     */
    isEventAssignedToResource(event, resource) {
        return this.assignmentStore.isEventAssignedToResource(event, resource);
    }

    /**
     * Removes all assignments for given event
     *
     * @param {Scheduler.model.EventModel|String|Number} event
     * @category Assignment
     */
    removeAssignmentsForEvent(event) {
        this.assignmentStore.removeAssignmentsForEvent(event);
    }

    /**
     * Removes all assignments for given resource
     *
     * @param {Scheduler.model.ResourceModel|String|Number} resource
     * @category Assignment
     */
    removeAssignmentsForResource(resource) {
        this.assignmentStore.removeAssignmentsForResource(resource);
    }

    //endregion
};
