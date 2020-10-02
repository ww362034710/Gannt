/* eslint-disable no-unused-expressions */
import DomSync from '../../../Core/helper/DomSync.js';
import Base from '../../../Core/Base.js';
import Model from '../../../Core/data/Model.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import AttachToProjectMixin from '../../data/mixin/AttachToProjectMixin.js';
import BaseRendering from './BaseRendering.js';

/**
 * @module Scheduler/view/orientation/HorizontalRendering
 */

const
    releaseEventActions = {
        releaseElement : 1, // Not used at all at the moment
        reuseElement   : 1  // Used by some other element
    },
    renderEventActions  = {
        newElement      : 1,
        reuseOwnElement : 1,
        reuseElement    : 1
    },
    MAX_WIDTH           = 9999999,
    heightEventSorter   = ({ startDateMS : lhs }, { startDateMS : rhs }) => lhs - rhs,
    chronoFields        = {
        startDate : 1,
        endDate   : 1,
        duration  : 1
    };

function getStartEnd(view, timeAxis, date, dateMS, useEnd) {
    if (view.fillTicks) {
        let tick = timeAxis.getTickFromDate(date);

        if (tick >= 0) {
            // If date matches a tick start/end, use the earlier tick
            if (useEnd && tick === Math.round(tick) && tick > 0) {
                tick--;
            }

            const
                tickIndex  = Math.floor(tick),
                tickRecord = timeAxis.getAt(tickIndex);

            return tickRecord[useEnd ? 'endDate' : 'startDate'].getTime();
        }
    }

    return dateMS;
}

/**
 * Handles event rendering in Schedulers horizontal mode. Reacts to project/store changes to keep the UI up to date.
 *
 * @internal
 */
export default class HorizontalRendering extends Base.mixin(BaseRendering, AttachToProjectMixin) {
    //region Config & Init

    static get properties() {
        return {
            // Map with event DOM configs, keyed by resource id
            resourceMap  : new Map(),
            // Map with visible events DOM configs, keyed by row instance
            rowMap       : new Map(),
            eventConfigs : []
        };
    }

    construct(scheduler) {
        const me = this;

        me.client = me.scheduler = scheduler;

        me.eventSorter = me.eventSorter.bind(scheduler);

        scheduler.rowManager.on({
            name            : 'rowManager',
            renderDone      : 'onRenderDone',
            removeRows      : 'onRemoveRows',
            translateRow    : 'onTranslateRow',
            beforeRowHeight : 'onBeforeRowHeightChange',
            thisObj         : me
        });

        me.toDrawOnProjectRefresh = new Set();

        super.construct({});
    }

    init() {}

    //endregion

    //region Region, dates & coordinates

    get visibleDateRange() {
        return this._visibleDateRange;
    }

    getDateFromXY(xy, roundingMethod, local, allowOutOfRange = false) {
        let coord = xy[0];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        return this.scheduler.timeAxisViewModel.getDateFromPosition(coord, roundingMethod, allowOutOfRange);
    }

    translateToScheduleCoordinate(x) {
        const pos = x - this.scheduler.timeAxisSubGridElement.getBoundingClientRect().left;
        return pos + this.scheduler.scrollLeft;
    }

    translateToPageCoordinate(x) {
        const element = this.scheduler.timeAxisSubGridElement;
        return x + element.getBoundingClientRect().left - element.scrollLeft;
    }

    /**
     * Gets the region, relative to the page, represented by the schedule and optionally only for a single resource.
     * This method will call getDateConstraints to allow for additional resource/event based constraints. By overriding
     * that method you can constrain events differently for different resources.
     * @param {Core.data.Model} rowRecord (optional) The row record
     * @param {Scheduler.model.EventModel} eventRecord (optional) The event record
     * @return {Rectangle} The region of the schedule
     */
    getScheduleRegion(rowRecord, eventRecord, local = true) {
        const
            me                                   = this,
            { scheduler }                        = me,
            { timeAxisSubGridElement, timeAxis } = scheduler;

        let region;

        if (rowRecord) {
            const eventElement = eventRecord && me.getElementsFromEventRecord(eventRecord, rowRecord)[0];

            region = Rectangle.from(scheduler.getRowById(rowRecord.id).getElement('locked'));

            if (eventElement) {
                const eventRegion = Rectangle.from(eventElement, timeAxisSubGridElement);

                region.y = eventRegion.y;
                region.bottom = eventRegion.bottom;
            }
            else {
                region.y = region.y + scheduler.resourceMargin;
                region.bottom = region.bottom - scheduler.resourceMargin;
            }
        }
        else {
            // TODO: This is what the bizarre function that was removed here did.
            // The coordinate space needs to be sorted out here!
            region = Rectangle.from(timeAxisSubGridElement).moveTo(null, 0);
            region.width = timeAxisSubGridElement.scrollWidth;

            region.y = region.y + scheduler.resourceMargin;
            region.bottom = region.bottom - scheduler.resourceMargin;
        }

        const
            taStart         = timeAxis.startDate,
            taEnd           = timeAxis.endDate,
            dateConstraints = scheduler.getDateConstraints(rowRecord, eventRecord) || {
                start : taStart,
                end   : taEnd
            };

        let startX          = scheduler.getCoordinateFromDate(DateHelper.max(taStart, dateConstraints.start)),
            endX            = scheduler.getCoordinateFromDate(DateHelper.min(taEnd, dateConstraints.end));

        if (!local) {
            startX = me.translateToPageCoordinate(startX);
            endX = me.translateToPageCoordinate(endX);
        }

        region.left = Math.min(startX, endX);
        region.right = Math.max(startX, endX);

        return region;
    }

    /**
     * Gets the Region, relative to the timeline view element, representing the passed row and optionally just for a
     * certain date interval.
     * @param {Core.data.Model} rowRecord The row record
     * @param {Date} startDate A start date constraining the region
     * @param {Date} endDate An end date constraining the region
     * @return {Core.helper.util.Rectangle} The Rectangle which encapsulates the row
     */
    getRowRegion(rowRecord, startDate, endDate) {
        const
            { scheduler } = this,
            { timeAxis }  = scheduler,
            row           = scheduler.getRowById(rowRecord.id);

        // might not be rendered
        if (!row) {
            return null;
        }

        const
            taStart    = timeAxis.startDate,
            taEnd      = timeAxis.endDate,
            start      = startDate ? DateHelper.max(taStart, startDate) : taStart,
            end        = endDate ? DateHelper.min(taEnd, endDate) : taEnd,
            startX     = scheduler.getCoordinateFromDate(start),
            endX       = scheduler.getCoordinateFromDate(end, true, true),
            y          = row.top,
            x          = Math.min(startX, endX),
            bottom     = y + row.offsetHeight;

        return new Rectangle(x, y, Math.max(startX, endX) - x, bottom - y);
    }

    getResourceEventBox(eventRecord, resourceRecord, includeOutside) {
        const resourceData = this.resourceMap.get(resourceRecord.id);

        let eventLayout  = null,
            approx       = false;

        if (resourceData) {
            eventLayout = resourceData.eventsData.find(d => d.eventRecord === eventRecord);
        }

        // Outside of view, layout now if supposed to be included
        if (!eventLayout) {
            eventLayout = this.getTimeSpanRenderData(
                eventRecord,
                resourceRecord,
                { viewport : true, timeAxis : includeOutside }
            );
            approx = true;
        }

        if (eventLayout) {
            // Event layout is relative to row, need to make to absolute before returning
            const
                rowBox      = this.scheduler.getRecordCoords(resourceRecord, true),
                absoluteTop = eventLayout.top + rowBox.top,
                box         = new Rectangle(eventLayout.left, absoluteTop, eventLayout.width, eventLayout.height);

            // Flag informing other parts of the code that this box is approximated
            if (approx) {
                box.layout = false;
            }

            box.rowTop = rowBox.top;
            box.rowBottom = rowBox.bottom;

            return box;
        }

        return null;
    }

    //endregion

    //region Element <-> Record mapping

    resolveRowRecord(elementOrEvent) {
        const
            me             = this,
            { scheduler }  = me,
            element        = elementOrEvent instanceof Event ? elementOrEvent.target : elementOrEvent,
            // Fix for FF on Linux having text nodes as event.target
            el             = element.nodeType === 3 ? element.parentElement : element,
            eventNode      = DomHelper.up(el, scheduler.eventSelector);

        if (eventNode) {
            return me.resourceStore.getById(eventNode.dataset.resourceId);
        }

        return scheduler.getRecordFromElement(el);
    }

    //endregion

    //region Project

    attachToProject(project) {
        super.attachToProject(project);

        this.refreshAllWhenReady = true;

        if (project) {
            project.on({
                name    : 'project',
                refresh : 'onProjectRefresh',
                thisObj : this
            });
        }
    }

    onProjectRefresh() {
        const
            me                                    = this,
            { scheduler, toDrawOnProjectRefresh } = me;

        if (!scheduler.refreshSuspended) {
            // Either refresh all rows (on for example dataset)
            if (me.refreshAllWhenReady) {
                scheduler.calculateAllRowHeights(true);

                // Rows rendered? Refresh
                if (scheduler.rowManager.topRow) {
                    me.clearAll();
                    scheduler.refreshWithTransition();
                }
                // No rows yet, reinitialize (happens if initial project empty and then non empty project assigned)
                else {
                    scheduler.rowManager.reinitialize();
                }

                me.refreshAllWhenReady = false;
            }
            // Or only affected rows (if any)
            else if (toDrawOnProjectRefresh.size) {
                //me.clearResources(toDrawOnProjectRefresh);
                me.refreshResources(toDrawOnProjectRefresh);
            }

            toDrawOnProjectRefresh.clear();
        }
    }

    //endregion

    //region AssignmentStore

    attachToAssignmentStore(assignmentStore) {
        this.refreshAllWhenReady = true;

        super.attachToAssignmentStore(assignmentStore);

        if (assignmentStore) {
            assignmentStore.on({
                name    : 'assignmentStore',
                change  : 'onAssignmentStoreChange',
                refresh : 'onAssignmentStoreRefresh',
                thisObj : this
            });
        }
    }

    onAssignmentStoreChange({ action, records, replaced, record, changes }) {
        const
            me                = this,
            assignmentRecords = records || (record ? [record] : []),
            resourceIds       = new Set(assignmentRecords.map(assignmentRecord => assignmentRecord.resourceId));

        // Ignore assignment changes caused by removing resources, the remove will redraw things anyway
        // Also ignore case when resource id is changed. In this case row will be refreshed by the grid
        if (me.resourceStore.isRemoving || me.resourceStore.isChangingId) {
            return;
        }

        const transition = true;

        switch (action) {
            // These operations will invalidate the graph, need to draw later
            case 'dataset': {
                // Ignore dataset when using single assignment mode
                if (!me.eventStore.usesSingleAssignment) {
                    me.refreshResourcesWhenReady(resourceIds);
                }
                return;
            }

            case 'add':
            case 'remove':
            case 'updateMultiple': // TODO: Dont think updateMultiple is covered by any test...
                me.refreshResourcesWhenReady(resourceIds);
                return;

            case 'removeall':
                me.refreshAllWhenReady = true;
                return;

            case 'replace':
                // Gather resources from both the old record and the new one
                replaced.forEach(([oldAssignment, newAssignment]) => {
                    resourceIds.add(oldAssignment.resourceId);
                    resourceIds.add(newAssignment.resourceId);
                });
                // And refresh them
                me.refreshResourcesWhenReady(resourceIds);
                return;

            // These operations wont invalidate the graph, redraw now
            case 'filter':
                me.clearAll();
                me.scheduler.calculateAllRowHeights(true);
                me.scheduler.refreshWithTransition();
                return;

            case 'update': {
                if ('eventId' in changes || 'resourceId' in changes) {
                    // When reassigning, clear old resource also
                    if ('resourceId' in changes) {
                        resourceIds.add(changes.resourceId.oldValue);
                    }
                    me.refreshResources(resourceIds, transition);
                }
            }
        }
    }

    onAssignmentStoreRefresh({ action, records }) {}

    //endregion

    //region EventStore

    attachToEventStore(eventStore) {
        this.refreshAllWhenReady = true;

        super.attachToEventStore(eventStore);

        if (eventStore) {
            eventStore.on({
                name    : 'eventStore',
                refresh : 'onEventStoreRefresh',
                thisObj : this
            });
        }
    }

    onEventStoreRefresh({ action }) {
        if (action === 'batch') {
            if (this.scheduler.isEngineReady) {
                this.clearAll();
                this.scheduler.refreshWithTransition();
            }
            // else {
            //     this.refreshAllWhenReady = true;
            // }
        }
    }

    onEventStoreChange({ action, records, record, replaced, changes, batch }) {
        const
            me                  = this,
            eventRecords        = records || (record ? [record] : []),
            isResourceTimeRange = eventRecords[0] && eventRecords[0].isResourceTimeRange,
            resourceIds         = new Set();

        eventRecords.forEach(eventRecord => {
            // When rendering a Gantt project, the project model also passes through here -> no `resources`
            eventRecord.resources?.forEach(resourceRecord => resourceIds.add(resourceRecord.id));
        });

        if (isResourceTimeRange) {
            me.refreshResources(resourceIds);
        }
        else {
            switch (action) {
                // No-ops
                case 'sort':  // Order in EventStore does not matter, so these actions are no-ops
                case 'group':
                case 'move':
                    return;

                case 'remove':
                    // Remove is a no-op since assignment will also be removed
                    return;

                case 'clearchanges':
                case 'dataset':
                    me.clearAll();
                    me.refreshAllWhenReady = true;
                    return;

                case 'add':
                case 'updateMultiple':
                    // Just refresh below
                    break;

                case 'replace':
                    // Gather resources from both the old record and the new one
                    replaced.forEach(([, newEvent]) => {
                        // Old cleared by changed assignment
                        newEvent.resources.map(resourceRecord => resourceIds.add(resourceRecord.id));
                    });
                    break;

                case 'removeall':
                case 'filter':
                    // Filter might be caused by add retriggering filters, in which case we need to refresh later
                    if (!me.scheduler.isEngineReady) {
                        me.refreshAllWhenReady = true;
                        return;
                    }

                    // Clear all when filtering for simplicity. If that turns out to give bad performance, one would need to
                    // figure out which events was filtered out and only clear their resources.
                    me.clearAll();
                    me.scheduler.calculateAllRowHeights(true);
                    me.scheduler.refreshWithTransition();
                    return;

                case 'update': {
                    // Check if changes are graph related or not
                    const allChrono = record.$entity
                        ? !Object.keys(changes).some(name => !record.$entity.getField(name))
                        : !Object.keys(changes).some(name => !chronoFields[name]);

                    let dateChanges = 0;
                    'startDate' in changes && dateChanges++;
                    'endDate' in changes && dateChanges++;
                    'duration' in changes && dateChanges++;
                    'calendar' in changes && dateChanges++;

                    // Always redraw non chrono changes (name etc) and chrono changes that can affect appearance
                    if (!allChrono || dateChanges > 1 || 'percentDone' in changes) {
                        me.clearResources(resourceIds);
                        me.refreshResources(resourceIds);
                    }
                    return;
                }
            }

            me.refreshResourcesWhenReady(resourceIds);
        }
    }

    //endregion

    //region ResourceStore

    attachToResourceStore(resourceStore) {

        this.refreshAllWhenReady = true;

        super.attachToResourceStore(resourceStore);

        if (resourceStore) {
            resourceStore.on({
                name    : 'resourceStore',
                change  : 'onResourceStoreChange',
                thisObj : this
            });
        }
    }

    onResourceStoreChange({ action, isExpand, record, records, changes }) {
        const
            me          = this,
            resourceIds = record ? [record.id] : records?.map(r => r.id);

        switch (action) {
            case 'add':
                // #635 Events disappear when toggling other node
                // If we are expanding project won't fire refresh event
                if (!isExpand) {
                    me.refreshResourcesWhenReady(resourceIds);
                }
                return;
            case 'update': {
                // Ignore changes from project commit, if they affect events they will be redrawn anyway
                // Also ignore explicit transformation of leaf <-> parent
                if (!me.project.isBatchingChanges && !changes.isLeaf) {
                    // Resource changes might affect events, refresh
                    me.refreshResources(resourceIds);
                }
                return;
            }
            case 'filter':
                // Bail out on filter action. Map was already updated on `refresh` event triggered before this `change`
                // one. And extra records are removed from rowMap by `onRemoveRows`
                return;
            case 'removeall':
                me.clearAll();
                return;
        }

        me.clearResources(resourceIds);
    }

    //endregion

    //region RowManager

    onTranslateRow({ row }) {
        // Newly added rows are translated prior to having an id, rule those out since they will be rendered later
        if (row.id != null) {
            // Event layouts are stored relative to the resource, only need to rerender the row to have its absolute
            // position updated to match new translation
            this.refreshRow(row, false);
        }
    }

    // Used to pre-calculate row heights
    calculateRowHeight(resourceRecord) {
        const { scheduler } = this;

        if (
            scheduler.eventLayout === 'stack' &&
            scheduler.isEngineReady &&
            !resourceRecord.meta.specialRow &&
            resourceRecord.events.length > 1
        ) {
            const
                {
                    assignmentStore,
                    eventStore,
                    timeAxis,
                    resourceMargin,
                    barMargin
                }               = scheduler,
                heightPerEvent  = scheduler.rowHeight - resourceMargin * 2,
                // When using an AssignmentStore we will get all events for the resource even if the EventStore is
                // filtered
                eventFilter     = eventRecord =>
                    eventRecord.assignments.some(a => a.resource === resourceRecord && assignmentStore.includes(a)),
                events          = eventStore
                    .getEvents({
                        resourceRecord,
                        includeOccurrences : scheduler.enableRecurringEvents,
                        startDate          : timeAxis.startDate,
                        endDate            : timeAxis.endDate,
                        filter             : eventFilter
                    })
                    .sort(heightEventSorter)
                    .map(eventRecord => ({
                        eventRecord,
                        startMS : eventRecord.startDateMS,
                        endMS   : eventRecord.endDate ? eventRecord.endDateMS : eventRecord.startDateMS
                    })),
                nbrOfBandsRequired = scheduler.currentEventLayout.layoutEventsInBands(events);

            return (nbrOfBandsRequired * heightPerEvent) + ((nbrOfBandsRequired - 1) * barMargin) + resourceMargin * 2;
        }
        else {
            return scheduler.rowHeight;
        }
    }

    //endregion

    //region TimeAxis

    doUpdateTimeView() {
        this.updateFromHorizontalScroll(this.scheduler.timeAxisSubGrid.scrollable.x);
    }

    onTimeAxisViewModelUpdate() {
        this.clearAll();

        // If refresh is suspended, update timeview as soon as refresh gets unsuspended
        if (this.scheduler.refreshSuspended) {
            this.scheduler.on({
                resumeRefresh() {
                    this.doUpdateTimeView();
                },
                thisObj : this,
                once    : true
            });
        }
        else {
            this.doUpdateTimeView();
        }
    }

    //endregion

    //region Dependency connectors

    /**
     * Gets displaying item start side
     *
     * @param {Scheduler.model.EventModel} eventRecord
     * @return {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorStartSide(eventRecord) {
        return 'left';
    }

    /**
     * Gets displaying item end side
     *
     * @param {Scheduler.model.EventModel} eventRecord
     * @return {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorEndSide(eventRecord) {
        return 'right';
    }

    //endregion

    //region Scheduler hooks

    refreshRows(reLayoutEvents) {
        if (reLayoutEvents) {
            this.clearAll();
        }
    }

    // Clear events in case they use date as part of displayed info
    onLocaleChange() {
        this.clearAll();
    }

    // Called when viewport size changes
    onViewportResize() {
        // TODO: Could do something cheaper
        // Refresh without discarding any available layouts
        //        this.scheduler.refresh(); // Seems not needed? Will be updated by horizontal scroll anyway
    }

    // Called from EventDrag
    onDragAbort({ context, dragData }) {
        // Aborted a drag in a scrolled scheduler, with origin now out of view. Element is no longer needed
        if (this.resourceStore.indexOf(dragData.record.resource) < this.scheduler.topRow.dataIndex) {
            context.element.remove();
        }
    }

    // Called from EventSelection
    toggleCls(assignmentRecord, cls, add = true, useWrapper = false) {
        const
            element      = this.getElementFromAssignmentRecord(assignmentRecord, useWrapper),
            // TODO: Should be assignmentRecord.resourceId, but breaks engine. Hoping https://github.com/bryntum/bryntum-suite/pull/1252 will fix it
            resourceData = this.resourceMap.get(assignmentRecord.isModel ? assignmentRecord.get('resourceId') : assignmentRecord.resourceId),
            eventData    = resourceData?.eventsData.find(d => d.eventId === assignmentRecord.eventId);

        // Update cached config
        if (eventData) {
            eventData[useWrapper ? 'wrapperCls' : 'cls'][cls] = add;
        }

        // Live update element
        if (element) {
            // Update element
            element.classList[add ? 'add' : 'remove'](cls);
            // And its DOM config
            element.lastDomConfig.className[cls] = add;
        }
    }

    // React to rows being removed, refreshes view without any relayouting needed since layout is cached relative to row
    onRemoveRows({ rows }) {
        rows.forEach(row => this.rowMap.delete(row));
        this.onRenderDone();
    }

    // Update header range on horizontal scroll. No need to draw any tasks, Gantt only cares about vertical scroll
    updateFromHorizontalScroll(scrollLeft) {
        const
            { scheduler }                 = this,
            { timeAxisSubGrid, timeAxis } = scheduler,
            width                         = timeAxisSubGrid.width,
            // If there are few pixels left from the right most position then just render all remaining ticks,
            // there wouldn't be many. It makes end date reachable with more page zoom levels while not having any poor
            // implications.
            // 5px to make TimeViewRangePageZoom test stable in puppeteer.
            returnEnd                     = timeAxisSubGrid.scrollable.maxX <= Math.round(scrollLeft) + 5,
            startDate                     = scheduler.getDateFromCoordinate(scrollLeft),
            endDate                       = returnEnd ? timeAxis.endDate : (scheduler.getDateFromCoordinate(scrollLeft + width) || timeAxis.endDate);

        if (startDate) {
            this._visibleDateRange = { startDate, endDate, startMS : startDate.getTime(), endMS : endDate.getTime() };

            // Update timeaxis header making it display the new dates
            scheduler.timeView.range = { startDate, endDate };

            scheduler.trigger('visibleRangeChange', { startDate, endDate });

            // If refresh is suspended, someone else is responsible for updating the UI later
            if (!scheduler.refreshSuspended && scheduler.rowManager.rows.length) {
                // Gets here too early in Safari for ResourceHistogram. ResizeObserver triggers a scroll before rows are
                // rendered first time. Could not track down why, bailing out
                if (scheduler.rowManager.rows[0].id === null) {
                    return;
                }

                scheduler.rowManager.rows.forEach(row => this.refreshRow(row, false));

                this.onRenderDone();
            }
        }
    }

    // Called from SchedulerEventRendering
    repaintEventsForResource(resourceRecord) {
        this.refreshResources([resourceRecord.id]);
    }

    onBeforeRowHeightChange(event) {
        const
            { scheduler } = this,
            newHeight     = event ? event.height : scheduler.rowHeight;

        // Row height is cached per resource, all have to be re-laid out
        this.clearAll();

        // RowHeight could be set while scheduler.foregroundCanvas is not set yet
        if (scheduler.foregroundCanvas) {
            scheduler.foregroundCanvas.style.fontSize = `${newHeight - scheduler.resourceMargin * 2}px`;
        }
    }

    //endregion

    //region Refresh resources

    /**
     * Clears resources directly and redraws them on next project refresh
     * @param {Number[]|String[]} resourceIds
     * @private
     */
    refreshResourcesWhenReady(resourceIds) {
        this.clearResources(resourceIds);
        resourceIds.forEach(id => this.toDrawOnProjectRefresh.add(id));
    }

    /**
     * Clears and redraws resources directly. Respects schedulers refresh suspension
     * @param {Number[]|String[]} ids Resource ids
     * @param {Boolean} [transition] Use transition or not
     * @private
     */
    refreshResources(ids, transition = true) {
        const
            me            = this,
            { scheduler } = me,
            rows          = [],
            noRows        = [];

        me.clearResources(ids);

        if (!scheduler.refreshSuspended) {
            ids.forEach(id => {
                const row = scheduler.getRowById(id);
                if (row) {
                    rows.push(row);
                }
                else {
                    noRows.push(row);
                }
            });

            scheduler.runWithTransition(() => {
                // Rendering rows populates row heights, but not all resources might have a row in view
                scheduler.calculateRowHeights(noRows.map(id => this.resourceStore.getById(id)), true);

                // Render those that do
                scheduler.rowManager.renderRows(rows);
            }, transition);
        }
    }

    //endregion

    //region Stack & pack

    layoutEventVerticallyStack(bandIndex) {
        const { resourceMargin, rowHeight, barMargin } = this.scheduler;
        return bandIndex === 0
            ? resourceMargin
            : resourceMargin + bandIndex * (rowHeight - resourceMargin * 2) + bandIndex * barMargin;
    }

    layoutEventVerticallyPack(topFraction, heightFraction) {
        const
            { resourceMargin, rowHeight, barMargin } = this.scheduler,
            // TODO reduce grid row borders when available, https://app.assembla.com/spaces/bryntum/tickets/5840-measure-grid-row-border-at-first-render/details#
            availableHeight = rowHeight - (2 * resourceMargin),
            count           = 1 / heightFraction,
            bandIndex       = topFraction * count, // "y" within row
            height          = (availableHeight - ((count - 1) * barMargin)) * heightFraction,
            top             = resourceMargin + bandIndex * height + bandIndex * barMargin;

        return {
            top, height
        };
    }

    //endregion

    //region Render

    /**
     * Used by event drag features to bring into existence event elements that are outside of the rendered block.
     * @param {Scheduler.model.TimeSpan} eventRecord The event to render
     * @param {Scheduler.model.ResourceModel} [resourceRecord] The event to render
     * @private
     */
    addTemporaryDragElement(eventRecord, resourceRecord = eventRecord.resource) {
        const
            { scheduler } = this,
            tplData       = scheduler.generateRenderData(eventRecord, resourceRecord, { timeAxis : true, viewport : true });

        tplData.absoluteTop = tplData.row ? (tplData.top + tplData.row.top) : scheduler.getResourceEventBox(eventRecord, resourceRecord, true).top;

        const
            domConfig = this.renderEvent(tplData),
            { dataset } = domConfig;

        delete domConfig.tabIndex;
        delete dataset.eventId;
        delete dataset.resourceId;
        delete dataset.syncId;
        dataset.transient = true;
        domConfig.parent = this.scheduler.foregroundCanvas;

        // So that the regular DomSyncing which may happen during scroll does not
        // sweep up and reuse the temporary element.
        domConfig.retainElement = true;

        const result = DomHelper.createElement(domConfig);

        result.innerElement = result.firstChild;

        eventRecord.instanceMeta(scheduler).hasTemporaryDragElement = true;

        return result;
    }

    // Earlier start dates are above later tasks
    // If same start date, longer tasks float to top
    // If same start + duration, sort by name
    // Fn can be called with layout date or event records (from EventNavigation)
    eventSorter(a, b) {
        if (this.horizontalEventSorterFn) {
            return this.horizontalEventSorterFn(a.eventRecord || a, b.eventRecord || b);
        }

        const
            // TODO: Rename startMS -> startDateMS to not have to have isModel check here (and to be consistent)
            startA    = a.isModel ? a.startDateMS : a.dataStartMS || a.startMS, // dataXX are used if configured with fillTicks
            endA      = a.isModel ? a.endDateMS : a.dataEndMS || a.endMS,
            startB    = b.isModel ? b.startDateMS : b.dataStartMS || b.startMS,
            endB      = b.isModel ? b.endDateMS :  b.dataEndMS || b.endMS,
            nameA     = a.isModel ? a.name : a.eventRecord.name,
            nameB     = b.isModel ? b.name : b.eventRecord.name,
            sameStart = (startA === startB);

        if (sameStart) {
            if (endA - endB === 0) {
                return nameA < nameB ? -1 : 1;
            }
            return endA > endB ? -1 : 1;
        }

        return (startA < startB) ? -1 : 1;
    }

    /**
     * Converts a start/endDate into a MS value used when rendering the event. If scheduler is configured with
     * `fillTicks: true` the value returned will be snapped to tick start/end.
     * @private
     * @param {Scheduler.model.EventModel} eventRecord
     * @returns {Object} Object of format { startMS, endMS, durationMS }
     */
    calculateMS(eventRecord) {
        const
            me                              = this,
            { scheduler }                   = me,
            { timeAxis, timeAxisViewModel } = scheduler;

        let startMS    = getStartEnd(scheduler, timeAxis, eventRecord.startDate, eventRecord.startDateMS, false),
            endMS      = getStartEnd(scheduler, timeAxis, eventRecord.endDate, eventRecord.endDateMS, true),
            durationMS = endMS - startMS;

        if (scheduler.milestoneLayoutMode !== 'default' && durationMS === 0) {
            const
                pxPerMinute = timeAxisViewModel.getSingleUnitInPixels('minute'),
                lengthInPx  = scheduler.getMilestoneLabelWidth(eventRecord),
                duration    = lengthInPx * (1 / pxPerMinute);

            durationMS = duration * 60 * 1000;

            switch (scheduler.milestoneAlign) {
                case 'start':
                case 'left':
                    endMS = startMS + durationMS;
                    break;
                case 'end':
                case 'right':
                    endMS = startMS;
                    startMS = endMS - durationMS;
                    break;
                default: // using center as default
                    endMS = startMS + durationMS / 2;
                    startMS = endMS - durationMS;
                    break;
            }
        }

        return {
            startMS,
            endMS,
            durationMS
        };
    }

    /**
     * Gets timespan coordinates etc. Relative to containing row. If the timespan is outside of the zone in
     * which timespans are rendered, that is outside of the TimeAxis, or outside of the vertical zone in which timespans
     * are rendered, then `undefined` is returned.
     * @private
     * @param {Scheduler.model.TimeSpan} timeSpan TimeSpan record
     * @param {Core.data.Model} rowRecord Row record
     * @param {Boolean|Object} includeOutside Specify true to get boxes for timespans outside of the rendered zone in both
     * dimensions. This option is used when calculating dependency lines, and we need to include routes from timespans
     * which may be outside the rendered zone.
     * @param {Boolean} includeOutside.timeAxis Pass as `true` to include timespans outside of the TimeAxis's bounds
     * @param {Boolean} includeOutside.viewport Pass as `true` to include timespans outside of the vertical timespan viewport's bounds.
     * @returns {{event/task: *, left: number, width: number, start: (Date), end: (Date), startMS: number, endMS: number, startsOutsideView: boolean, endsOutsideView: boolean}}
     */
    getTimeSpanRenderData(timeSpan, rowRecord, includeOutside = false) {
        const
            me                              = this,
            { scheduler }                   = me,
            { timeAxis, timeAxisViewModel } = scheduler,
            includeOutsideTimeAxis          = includeOutside === true || includeOutside.timeAxis,
            includeOutsideViewport          = includeOutside === true || includeOutside.viewport;

        // If timespan is outside the TimeAxis, give up trying to calculate a layout (Unless we're including timespans
        // outside our zone)
        if (includeOutsideTimeAxis || timeAxis.isTimeSpanInAxis(timeSpan)) {
            const row = scheduler.getRowById(rowRecord);

            if (row || includeOutsideViewport) {
                const
                    pxPerMinute                    = timeAxisViewModel.getSingleUnitInPixels('minute'),
                    timespanStart                  = timeSpan.startDate,
                    timespanEnd                    = timeSpan.endDate || timespanStart, // Allow timespans to be rendered even when they are missing an end date
                    viewStartMS                    = timeAxis.startMS,
                    viewEndMS                      = timeAxis.endMS,
                    { startMS, endMS, durationMS } = me.calculateMS(timeSpan),
                    // These flags have two components because includeOutsideViewport
                    // means that we can be calculating data for events either side of
                    // the TimeAxis.
                    // The start is outside of the view if it's before *or after* the TimeAxis range.
                    // 1 set means the start is before the TimeAxis
                    // 2 set means the start is after the TimeAxis
                    // Either way, a truthy value means that the start is outside of the TimeAxis.
                    startsOutsideView              = startMS < viewStartMS  | ((startMS >  viewEndMS)   << 1),
                    // The end is outside of the view if it's before *or after* the TimeAxis range.
                    // 1 set means the end is after the TimeAxis
                    // 2 set means the end is before the TimeAxis
                    // Either way, a truthy value means that the end is outside of the TimeAxis.
                    endsOutsideView                = endMS   > viewEndMS    | ((endMS   <= viewStartMS) << 1),
                    durationMinutes                = durationMS / (1000 * 60),
                    width                          = endsOutsideView ? pxPerMinute * durationMinutes : null;

                let endX = scheduler.getCoordinateFromDate(endMS, {
                        local            : true,
                        respectExclusion : true,
                        isEnd            : true
                    }), startX, clippedStart = false, clippedEnd = false;

                // If event starts outside of view, estimate where.
                if (startsOutsideView) {
                    startX = (startMS - viewStartMS) / (1000 * 60) * pxPerMinute;
                }
                // Starts in view, calculate exactly
                else {
                    // If end date is included in time axis but start date is not (when using time axis exclusions), snap start date to next included data
                    startX = scheduler.getCoordinateFromDate(startMS, {
                        local              : true,
                        respectExclusion   : true,
                        isEnd              : false,
                        snapToNextIncluded : endX !== -1
                    });

                    clippedStart = startX === -1;
                }

                if (endsOutsideView) {
                    endX = startX + width;
                }
                else {
                    clippedEnd = endX === -1;
                }

                if (clippedEnd && !clippedStart) {
                    // We know where to start but not where to end, snap it (the opposite is already handled by the
                    // snapToNextIncluded flag when calculating startX above)
                    endX = scheduler.getCoordinateFromDate(endMS, {
                        local              : true,
                        respectExclusion   : true,
                        isEnd              : true,
                        snapToNextIncluded : true
                    });
                }

                // If the element is very wide there's no point in displaying it all.
                // Indeed the element may not be displayable at extremely large widths.
                if (width > MAX_WIDTH) {
                    // The start is before the TimeAxis start
                    if (startsOutsideView === 1) {
                        // Both ends outside - spans TimeAxis
                        if (endsOutsideView === 1) {
                            startX = -100;
                            endX = scheduler.timeAxisColumn.width + 100;
                        }
                        // End is in view
                        else {
                            startX = endX - MAX_WIDTH;
                        }
                    }
                    // The end is after, but the start is in view
                    else if (endsOutsideView === 1) {
                        endX = startX + MAX_WIDTH;
                    }
                }

                if (clippedStart && clippedEnd) {
                    // Both ends excluded, but there might be some part in between that should be displayed...
                    startX = scheduler.getCoordinateFromDate(startMS, {
                        local              : true,
                        respectExclusion   : true,
                        isEnd              : false,
                        snapToNextIncluded : true,
                        max                : endMS
                    });

                    endX = scheduler.getCoordinateFromDate(endMS, {
                        local              : true,
                        respectExclusion   : true,
                        isEnd              : true,
                        snapToNextIncluded : true,
                        min                : startMS
                    });

                    if (startX === endX) {
                        // Raise flag on instance meta to avoid duplicating this logic
                        timeSpan.instanceMeta(scheduler).excluded = true;
                        // Excluded by time axis exclusion rules, render nothing
                        return null;
                    }
                }

                const data = {
                    eventRecord : timeSpan,
                    taskRecord  : timeSpan, // Helps with using Gantt projects in Scheduler Pro
                    left        : Math.min(startX, endX),
                    // Use min width 1 for normal events, 0 for milestones (wont have width specified at all in the end)
                    width       : Math.abs(endX - startX) || (timeSpan.isMilestone ? 0 : 1),
                    start       : timespanStart,
                    end         : timespanEnd,
                    rowId       : rowRecord.id,
                    children    : [],
                    startMS,
                    endMS,
                    startsOutsideView,
                    endsOutsideView,
                    clippedStart,
                    clippedEnd,
                    row
                };

                // If filling ticks we need to also keep datas MS values, since they are used for sorting timespans
                if (scheduler.fillTicks) {
                    data.dataStartMS = data.start.getTime();
                    data.dataEndMS = data.end.getTime();
                }

                data.top = Math.max(0, scheduler.resourceMargin);

                if (scheduler.managedEventSizing) {
                    // Timespan height should be at least 1px
                    data.height = Math.max(scheduler.rowManager.rowHeight - (2 * scheduler.resourceMargin), 1);
                }

                return data;
            }
        }
    }

    // Lay out events within a resource, relative to the resource
    layoutResourceEvents(resourceRecord, includeOutside = false) {
        const
            me                   = this,
            { scheduler }        = me,
            {
                eventStore,
                assignmentStore,
                timeAxis
            }                    = scheduler,
            // Events for this resource
            resourceEvents = eventStore.getEvents({
                includeOccurrences : scheduler.enableRecurringEvents,
                resourceRecord,
                startDate          : timeAxis.startDate,
                endDate            : timeAxis.endDate,
                filter             : eventRecord =>
                    eventRecord.assignments.some(a => a.resource === resourceRecord && assignmentStore.includes(a))
            }),
            // Call a chainable template function on scheduler to allow features to add additional "events" to render
            // Currently used by ResourceTimeRanges
            allEvents            = scheduler.getEventsToRender(resourceRecord, resourceEvents) || [],
            // Generate layout data
            eventsData           = allEvents.reduce((result, eventRecord) => {
                // Only those in time axis (by default)
                if ((includeOutside || timeAxis.isTimeSpanInAxis(eventRecord))) {
                    const eventBox = scheduler.generateRenderData(eventRecord, resourceRecord, false);

                    // Collect layouts of visible events
                    if (eventBox) {
                        result.push(eventBox);
                    }
                }

                return result;
            }, []);

        // Ensure the events are rendered in natural order so that navigation works.
        eventsData.sort(me.eventSorter);

        let rowHeight = scheduler.rowHeight;

        const
            layout          = scheduler.currentEventLayout,
            // Only events and tasks should be considered during layout (not resource time ranges if any)
            layoutEventData = eventsData.filter(d => d.eventRecord.isEvent);

        // Event data is now gathered, calculate layout properties for each event
        if (scheduler.eventLayout === 'stack') {
            const
                nbrOfBandsRequired = layout.applyLayout(layoutEventData, resourceRecord),
                heightPerEvent     = scheduler.rowHeight - scheduler.resourceMargin * 2;

            rowHeight = (nbrOfBandsRequired * heightPerEvent) + ((nbrOfBandsRequired - 1) * scheduler.barMargin) + scheduler.resourceMargin * 2;
        }
        else if (scheduler.eventLayout === 'pack') {
            layout.applyLayout(layoutEventData, resourceRecord);
        }

        return { rowHeight, eventsData };
    }

    // Generates a DOMConfig for an EventRecord
    renderEvent(data, rowHeight) {
        const
            { scheduler }                        = this,
            { resourceRecord, assignmentRecord, eventRecord } = data,
            // Sync using assignment id for events and event id for ResourceTimeRanges. Add eventId for occurrences to make them unique
            syncId                               = assignmentRecord
                // Assignment, might be an occurrence
                ? this.assignmentStore.getOccurrence(assignmentRecord, eventRecord).id
                // Some thine else, probably a ResourceTimeRange
                : data.eventId,
            // Event element config, applied to existing element or used to create a new one below
            elementConfig                        = {
                className : data.wrapperCls,
                tabIndex  : '0',
                children  : [
                    {
                        className : data.cls,
                        style     : data.style || '',
                        children  : data.children,
                        dataset   : {
                            // Each feature putting contents in the event wrap should have this to simplify syncing and
                            // element retrieval after sync
                            taskFeature : 'event'
                        },
                        syncOptions : {
                            syncIdField : 'taskBarFeature'
                        }
                    },
                    ...data.wrapperChildren
                ],
                style : {
                    transform : `translate(${data.left}px, ${data.absoluteTop}px)`,
                    // ResourceTimeRanges fill row height, cannot be done earlier than this since row height is not
                    // known initially
                    height    : data.fillSize ? rowHeight : data.height,
                    // DomHelper appends px to dimensions when using numbers. Ignore width for milestones
                    width     : data.width > 0 ? data.width : null,
                    zIndex    : data.zIndex,
                    style     : data.wrapperStyle
                },
                dataset : {
                    resourceId : resourceRecord.id,
                    eventId    : data.eventId, // Not using eventRecord.id to distinguish between Event and ResourceTimeRange
                    syncId
                },
                // Will not be part of DOM, but attached to the element
                elementData   : data,
                // Dragging etc. flags element as retained, to not reuse/release it during that operation. Events
                // always use assignments, but ResourceTimeRanges does not
                retainElement : (assignmentRecord || eventRecord).instanceMeta(scheduler).retainElement,
                // Options for this level of sync, lower levels can have their own
                syncOptions   : {
                    syncIdField      : 'taskFeature',
                    // Remove instead of release when a feature is disabled
                    releaseThreshold : 0
                }
            };

        // Do not want to spam dataset with empty prop when not using assignments (ResourceTimeRanges)
        if (assignmentRecord) {
            elementConfig.dataset.assignmentId = assignmentRecord.id;
        }

        data.elementConfig = elementConfig;

        scheduler.trigger('beforeRenderEvent', { renderData : data, domConfig : elementConfig });

        return elementConfig;
    }

    /**
     * Refresh a row/record, clearing its cache and forcing DOM refresh.
     * @param {Scheduler.model.ResourceModel} recordOrRow Record or row to refresh
     * @param {Boolean} [force] Specify `false` to prevent clearing cache and forcing DOM refresh
     * @internal
     */
    refreshRow(recordOrRow, force = true) {
        let row, record;

        if (recordOrRow.isModel) {
            row = this.scheduler.rowManager.getRowFor(recordOrRow);
            record = recordOrRow;
        }
        else {
            row = recordOrRow;
            record = this.resourceStore.getById(recordOrRow.id);
        }

        if (force) {
            this.clearResources([recordOrRow]);
        }

        if (row) {
            this.renderer({ row, record });

            if (force) {
                this.onRenderDone();
            }
        }
    }

    // Called per row in "view", collect configs
    renderer({ row, record : resourceRecord, size = {} }) {
        // Bail out for group headers/footers
        if (resourceRecord.meta.specialRow) {
            // Clear any cached layout for row retooled to special row, and bail out
            this.rowMap.delete(row);
            return;
        }

        const
            me                 = this,
            { startMS, endMS } = me.visibleDateRange,
            eventDOMConfigs    = [];

        // Used stored layouts if available
        let resourceLayout = me.resourceMap.get(resourceRecord.id);

        if (!resourceLayout || resourceLayout.invalid) {
            // Previously we would bail out here if engine wasn't ready. Now we instead allow drawing in most cases,
            // since data can be read and written during commit (previously it could not)
            if (me.suspended) {
                return;
            }

            resourceLayout = me.layoutResourceEvents(resourceRecord);
            me.resourceMap.set(resourceRecord.id, resourceLayout);
        }

        // Size row
        size.height = resourceLayout.rowHeight;

        // Only collect configs for those actually in view
        resourceLayout.eventsData.forEach(layout => {
            if (layout.endMS >= startMS && layout.startMS <= endMS) {
                layout.absoluteTop = layout.top + row.top;
                eventDOMConfigs.push(me.renderEvent(layout, resourceLayout.rowHeight));
            }
        });

        this.rowMap.set(row, eventDOMConfigs);
    }

    // Called when the current row rendering "pass" is complete, sync collected configs to DOM
    onRenderDone() {
        const
            { scheduler, rowMap }  = this,
            visibleEventDOMConfigs = [];

        // Concat all rows event configs
        rowMap.forEach(eventDOMConfigs => visibleEventDOMConfigs.push.apply(visibleEventDOMConfigs, eventDOMConfigs));

        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : visibleEventDOMConfigs
            },
            targetElement : scheduler.foregroundCanvas,
            syncIdField   : 'syncId',

            // Called by DomHelper when it creates, releases or reuses elements
            callback({ action, domConfig, lastDomConfig, targetElement }) {
                // If element is a task wrap, trigger appropriate events
                if (action !== 'none' && domConfig?.className?.[`${scheduler.eventCls}-wrap`]) {
                    const
                        // Some actions are considered first a release and then a render (reusing another element).
                        // This gives clients code a chance to clean up before reusing an element
                        isRelease = releaseEventActions[action],
                        isRender  = renderEventActions[action];

                    // Trigger release for events (it might be a proxy element, skip those)
                    if (isRelease && lastDomConfig?.elementData) {
                        const
                            { eventRecord, resourceRecord, assignmentRecord } = lastDomConfig.elementData,
                            event = {
                                renderData : lastDomConfig.elementData,
                                element    : targetElement,
                                eventRecord,
                                resourceRecord,
                                assignmentRecord
                            };

                        // Some browsers do not blur on set to display:none, so releasing the active element
                        // must *explicitly* move focus outwards to the view.
                        if (targetElement === document.activeElement) {
                            scheduler.focusElement.focus();
                        }

                        // This event is documented on Scheduler
                        scheduler.trigger('releaseEvent', event);
                    }

                    if (isRender) {
                        const
                            { eventRecord, resourceRecord, assignmentRecord } = domConfig.elementData,
                            event = {
                                renderData       : domConfig.elementData,
                                tplData          : domConfig.elementData, // DEPRECATED IN 4.0
                                element          : targetElement,
                                isReusingElement : action === 'reuseElement',
                                isRepaint        : action === 'reuseOwnElement',
                                eventRecord,
                                resourceRecord,
                                assignmentRecord
                            };

                        // This event is documented on Scheduler
                        scheduler.trigger('renderEvent', event);
                    }
                }
            }
        });

        // There are multiple pathways that might lead to the first render of events. This is the first reliable
        // place were we can determine that something will be rendered
        visibleEventDOMConfigs.length && scheduler._firstRenderDone && scheduler._firstRenderDone();
    }

    //endregion

    //region Cache

    // Clears cached resource layout
    clearResources(recordsOrIds) {
        if (recordsOrIds instanceof Set) {
            recordsOrIds = Array.from(recordsOrIds);
        }
        else if (!Array.isArray(recordsOrIds)) {
            recordsOrIds = [recordsOrIds];
        }

        const resourceIds = recordsOrIds.map(Model.asId);

        //<debug>
        if (window.DEBUG) console.log('%Clearing resources ' + Array.from(resourceIds).join(','), 'color: #770000');
        //</debug>

        resourceIds.forEach(resourceId => {
            // Invalidate resourceLayout, keeping it around in case we need it before next refresh
            const cached = this.resourceMap.get(resourceId);
            if (cached) {
                cached.invalid = true;
            }

            const row = this.scheduler.getRowById(resourceId);
            row && this.rowMap.delete(row);
        });
    }

    clearAll() {
        //<debug>
        if (window.DEBUG) console.log('%Clearing all', 'color: #770000');
        //</debug>

        this.resourceMap.clear();
        this.rowMap.clear();
    }

    //endregion
}
