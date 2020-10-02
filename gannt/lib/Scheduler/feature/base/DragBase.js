/* eslint-disable no-unused-expressions */
import InstancePlugin from '../../../Core/mixin/InstancePlugin.js';
import DateHelper from '../../../Core/helper/DateHelper.js';
import DomHelper from '../../../Core/helper/DomHelper.js';
import DragHelper from '../../../Core/helper/DragHelper.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import ClockTemplate from '../../tooltip/ClockTemplate.js';
import Tooltip from '../../../Core/widget/Tooltip.js';
import EventHelper from '../../../Core/helper/EventHelper.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import Widget from '../../../Core/widget/Widget.js';

/**
 * @module Scheduler/feature/base/DragBase
 */

//TODO: shift to copy
//TODO: dragging of event that starts & ends outside of view

/**
 * Base class for EventDrag (Scheduler) and TaskDrag (Gantt) features. Contains shared code. Not to be used directly.
 *
 * @extends Core/mixin/InstancePlugin
 * @abstract
 */
export default class DragBase extends InstancePlugin {
    //region Config

    static get defaultConfig() {
        return {
            // documented on Schedulers EventDrag feature and Gantts TaskDrag
            dragTipTemplate : data => `
                <div class="b-sch-tip-${data.valid ? 'valid' : 'invalid'}">
                    ${data.startClockHtml}
                    ${data.endClockHtml}
                    <div class="b-sch-tip-message">${data.message}</div>
                </div>
            `,

            // documented on Schedulers EventDrag feature, not used for Gantt
            constrainDragToResource : true,

            /**
             * Specifies whether or not to show tooltip while dragging event
             * @config {Boolean}
             * @default
             */
            showTooltip : true,

            /**
             * When enabled, the event being dragged always "snaps" to the exact start date that it will have after drop.
             * @config {Boolean}
             * @default
             */
            showExactDropPosition : false,

            /**
             * Set to `false` to allow dragging tasks outside of the client Scheduler.
             * Useful when you want to drag tasks between multiple Scheduler instances
             * @config {Boolean}
             * @default
             */
            constrainDragToTimeline : true,

            /*
             * The store from which the dragged items are mapped to the UI.
             * In Scheduler's implementation of this base class, this will be
             * an EventStore, in Gantt's implementations, this will be a TaskStore.
             * Because both derive from this base, we must refer to it as this.store.
             * @private
             */
            store : null,

            /**
             * An object used to configure the internal {@link Core.helper.DragHelper} class
             * @config {Object}
             * @default
             */
            dragHelperConfig : null,

            tooltipCls : null
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['render']
        };
    }

    //endregion

    //region Init

    /**
     * Called when scheduler is rendered. Sets up drag and drop and hover tooltip.
     * @private
     */
    render() {
        const
            me                                  = this,
            { client, constrainDragToTimeline } = me;

        me.drag?.destroy();

        me.drag = new DragHelper(Object.assign({
            name                                      : me.constructor.name, // useful when debugging with multiple draggers
            mode                                      : 'translateXY',
            [client.isHorizontal ? 'lockY' : 'lockX'] : me.constrainDragToResource,
            [client.isHorizontal ? 'lockX' : 'lockY'] : me.constrainDragToTimeSlot,
            minX                                      : true, // Allows dropping with start before time axis
            maxX                                      : true, // Allows dropping with end after time axis
            constrain                                 : false,
            cloneTarget                               : !constrainDragToTimeline,
            dragWithin                                : constrainDragToTimeline ? null : document.body,
            hideOriginalElement                       : true,
            outerElement                              : client.timeAxisSubGridElement,
            targetSelector                            : client.eventSelector,
            isElementDraggable                        : (el, event) => !client.readOnly && me.isElementDraggable(el, event),
            scrollManager                             : constrainDragToTimeline ? client.scrollManager : null,
            transitionDuration                        : client.transitionDuration,
            listeners                                 : {
                beforedragstart : 'onBeforeDragStart',
                dragstart       : 'onDragStart',
                drag            : 'onDrag',
                drop            : 'onDrop',
                abort           : 'onDragAbort',
                reset           : 'onDragReset',
                thisObj         : me
            }
        }, me.dragHelperConfig));

        client.rowManager.on({
            changeTotalHeight : 'updateYConstraint',
            thisObj           : me
        });

        if (me.showTooltip) {
            me.clockTemplate = new ClockTemplate({
                scheduler : client
            });
        }
    }

    doDestroy() {
        this.drag?.destroy();
        this.clockTemplate?.destroy();
        this.tip?.destroy();
        super.doDestroy();
    }

    //endregion

    //region Drag events

    onBeforeDragStart({ context }) {
        const
            me          = this,
            { client }       = me,
            name        = client.scheduledEventName,
            eventRecord = client.resolveEventRecord(context.element);

        if (me.disabled || !eventRecord || eventRecord.isDraggable === false) {
            return false;
        }

        // Cache the date corresponding to the drag start point so that on drag, we can always
        // perform the same calculation to then find the time delta without having to calculate
        // the new start end end times from the position that the element is.
        context.pointerStartDate = client.getDateFromXY([context.startClientX, context.startPageY], null, false);

        const result = client.trigger(`before${name}Drag`, {
            eventRecord,
            context : me.dragData
        }) !== false;

        if (result !== false) {
            me.updateYConstraint(eventRecord);
        }

        return result;
    }

    // Constrain to time slot means lockX if we're horizontal, otherwise lockY
    set constrainDragToTimeSlot(value) {
        const axis = this.client.isHorizontal ? 'lockX' : 'lockY';

        this._constrainDragToTimeSlot = value;

        if (this.drag) {
            this.drag[axis] = value;
        }
    }

    get constrainDragToTimeSlot() {
        return this._constrainDragToTimeSlot;
    }

    // Constrain to resource means lockY if we're horizontal, otherwise lockX
    set constrainDragToResource(value) {
        const axis = this.client.isHorizontal ? 'lockY' : 'lockX';

        this._constrainDragToResource = value;

        if (this.drag) {
            this.drag[axis] = value;
        }
    }

    get constrainDragToResource() {
        return this._constrainDragToResource;
    }

    /**
     * Triggered when dragging of an event starts. Initializes drag data associated with the event being dragged.
     * @private
     */
    onDragStart({ context, event }) {
        const
            me         = this,
            { client } = me;

        me.currentOverClient = client;
        me.scrollClients = {};

        me.onMouseOverNewTimeline(client);

        const dragData = me.dragData = me.getDragData(context, event);

        // Do not let DomSync reuse the element
        context.element.retainElement = true;

        if (me.showTooltip) {
            const tipTarget = dragData.context.dragProxy ? dragData.context.dragProxy.firstChild : context.element;

            if (!me.tip) {
                me.tip = new Tooltip({
                    id                       : `${client.id}-event-drag-tip`,
                    align                    : 'b-t',
                    autoShow                 : true,
                    updateContentOnMouseMove : true,
                    clippedBy                : me.constrainDragToTimeline ? [client.timeAxisSubGridElement, client.bodyContainer] : null,
                    forElement               : tipTarget,
                    getHtml                  : me.getTipHtml.bind(me),
                    // During drag, it must be impossible for the mouse to be over the tip.
                    style                    : 'pointer-events:none',
                    cls                      : me.tooltipCls
                });

                me.tip.on('innerhtmlupdate', me.updateDateIndicator, me);
            }
            else {
                me.tip.showBy(tipTarget);
            }
        }

        // me.copyKeyPressed = me.isCopyKeyPressed();
        //
        // if (me.copyKeyPressed) {
        //     dragData.refElements.addCls('sch-event-copy');
        //     dragData.originalHidden = true;
        // }

        me.triggerDragStart(dragData);
    }

    updateDateIndicator() {
        const
            { startDate, endDate } = this.dragData,
            { tip }                = this,
            endDateElement         = tip.element.querySelector('.b-sch-tooltip-enddate');

        this.clockTemplate.updateDateIndicator(tip.element, startDate);

        endDateElement && this.clockTemplate.updateDateIndicator(endDateElement, endDate);
    }

    /**
     * Triggered while dragging an event. Updates drag data, validation etc.
     * @private
     */
    onDrag({ context, event }) {
        const
            me    = this,
            dd    = me.dragData,
            start = dd.startDate;

        let client;

        if (me.constrainDragToTimeline) {
            client = me.client;
        }
        else {
            let target = event.target;

            // Can't detect target under a touch event
            if (/^touch/.test(event.type)) {
                const center = Rectangle.from(dd.context.element, null, true).center;

                target = DomHelper.elementFromPoint(center.x, center.y);
            }

            client = Widget.fromElement(target, 'timelinebase');
        }

        const
            depFeature = me.client.features.dependencies,
            x          = context.newX,
            y          = context.newY;

        if (!client) {
            if (depFeature) {
                depFeature.updateDependenciesForTimeSpan(dd.draggedRecords[0], dd.context.element);
            }
            return;
        }

        if (client !== me.currentOverClient) {
            me.onMouseOverNewTimeline(client);
        }

        //this.checkShiftChange();

        me.updateDragContext(context, event);

        // Snapping not supported when dragging outside a scheduler
        if (me.constrainDragToTimeline && (me.showExactDropPosition || me.client.timeAxisViewModel.snap)) {
            const
                newDate   = client.getDateFromCoordinate(me.getCoordinate(dd.draggedRecords[0], context.element, [x, y])),
                timeDiff  = newDate - dd.sourceDate,
                realStart = new Date(dd.origStart - 0 + timeDiff),
                offset    = client.timeAxisViewModel.getDistanceBetweenDates(realStart, dd.startDate);

            if (dd.startDate >= client.timeAxis.startDate && offset != null) {
                DomHelper.addTranslateX(context.element, offset);
            }
        }

        // Let product specific implementations trigger drag event (eventDrag, taskDrag)
        me.triggerEventDrag(dd, start);

        let valid = me.checkDragValidity(dd, event);

        if (valid && typeof valid !== 'boolean') {
            context.message = valid.message || '';
            valid = valid.valid;
        }

        context.valid = valid !== false;

        if (me.showTooltip) {
            me.tip.realign();
        }

        if (depFeature) {
            depFeature.updateDependenciesForTimeSpan(dd.draggedRecords[0], dd.context.element.querySelector(client.eventInnerSelector), dd.newResource);
        }
    }

    onMouseOverNewTimeline(newTimeline) {
        const
            me            = this,
            scrollClients = me.scrollClients || {};

        me.currentOverClient.element.classList.remove('b-dragging-' + me.currentOverClient.scheduledEventName);

        newTimeline.element.classList.add('b-dragging-' + newTimeline.scheduledEventName);

        if (!(newTimeline.id in scrollClients)) {
            const scrollManager = newTimeline.scrollManager;

            scrollManager.startMonitoring({
                element : newTimeline.timeAxisSubGridElement
            });
            scrollClients[newTimeline.id] = newTimeline;
        }

        me.currentOverClient = newTimeline;
    }

    /**
     * Triggered when dropping an event. Finalizes the operation.
     * @private
     */
    onDrop({ context, event }) {
        const
            me                              = this,
            { currentOverClient, dragData } = me;

        let modified = false;

        me.updateDragContext(context, event);

        me.tip?.hide();

        if (context.valid && dragData.startDate && dragData.endDate) {
            dragData.finalize = (...params) => {
                me.finalize(...params);
                context.finalize(...params);
            };

            // Allow implementer to take control of the flow, by returning false from this listener,
            // to show a confirmation popup etc. This event is documented in EventDrag and TaskDrag
            currentOverClient.trigger(`before${currentOverClient.capitalizedEventName}DropFinalize`, {
                context : dragData,
                event
            });

            context.async = dragData.async;

            // Internal validation, making sure all dragged records fit inside the view
            if (!context.async && me.isValidDrop(dragData)) {
                modified = (dragData.startDate - dragData.origStart) !== 0 || dragData.newResource !== dragData.resourceRecord;
            }
        }

        if (!context.async) {
            me.finalize(dragData.valid && context.valid && modified);
        }
    }

    onDragAbort({ context }) {
        const me = this;

        me.client.currentOrientation.onDragAbort({ context, dragData : me.dragData });

        // otherwise the event disappears on next refresh (#62)
        me.resumeElementRedrawing(me.dragData.record);

        me.tip?.hide();

        // Trigger eventDragAbort / taskDragAbort depending on product
        me.triggerDragAbort(me.dragData);
    }

    // For the drag across multiple schedulers, tell all involved scroll managers to stop monitoring
    onDragReset({ source : dragHelper }) {
        const
            me            = this,
            scrollClients = me.scrollClients || {};

        for (const managerId in scrollClients) {
            scrollClients[managerId].scrollManager.stopMonitoring(scrollClients[managerId].timeAxisSubGridElement);
        }

        if (dragHelper.context && dragHelper.context.started) {
            const { eventBarEls } = me.dragData;

            eventBarEls[0].classList.remove('b-drag-main');
        }

        me.scrollClients = null;

        me.currentOverClient?.element.classList.remove('b-dragging-' + me.currentOverClient.scheduledEventName);

        // Dependencies are updated dynamically during drag, so ensure they are redrawn
        // if the event snaps back with no change after abort or an invalid drop.
        if (me.dragData?.context.valid === false && me.currentOverClient.features.dependencies) {
            me.currentOverClient.features.dependencies.scheduleDraw(true);
        }

        // TODO we should clean this up, requires review of the flow first
        // me.dragData = null;
    }

    /**
     * Triggered internally on invalid drop.
     * @private
     */
    onInternalInvalidDrop() {
        this.tip?.hide();

        this.drag.abort();

        this.triggerAfterDrop(this.dragData, false);
    }

    //endregion

    //region Finalization & validation

    /**
     * Called on drop to update the record of the event being dropped.
     * @private
     * @param {Boolean} updateRecords Specify true to update the record, false to treat as invalid
     */
    async finalize(updateRecords) {
        const
            me                                       = this,
            { dragData }                = me,
            { context, draggedRecords }              = dragData;

        let result;

        draggedRecords.forEach((record, i) => {
            me.resumeElementRedrawing(record);

            dragData.eventBarEls[i].classList.remove(me.drag.draggingCls);
            dragData.eventBarEls[i].retainElement = false;
        });

        if (updateRecords) {
            // updateRecords may or may not be async.
            // We see if it returns a Promise.
            result = me.updateRecords(dragData);

            // If updateRecords is async, the calling DragHelper must know this and
            // go into a awaitingFinalization state.
            if (ObjectHelper.isPromise(result)) {
                context.async = true;
                await result;
            }

            // If the finalize handler decided to change the dragData's validity...
            if (!dragData.valid) {
                me.onInternalInvalidDrop();
            }
            else {
                me.drag.reset();

                me.triggerAfterDrop(dragData, true);
            }
        }
        else {
            me.onInternalInvalidDrop();
        }

        return result;
    }

    //endregion

    //region Drag data

    /**
     * Updates drag datas dates and validity (calls #validatorFn if specified)
     * @private
     */
    updateDragContext(info, event) {
        const
            me                  = this,
            { drag }            = me,
            dd                  = me.dragData,
            client              = me.currentOverClient,
            { isHorizontal }    = client,
            element             = info.element,
            proxyRegion         = Rectangle.from(element, client.timeAxisSubGridElement),
            record              = dd.draggedRecords[0],
            eventRecord         = record.isAssignment ? record.event : record,
            constrainToTimeSlot = me.constrainDragToTimeSlot || (isHorizontal ? drag.lockX : drag.lockY);

        dd.browserEvent = event;

        if (constrainToTimeSlot) {
            dd.timeDiff = 0;
        }
        else {
            if (client.timeAxis.isContinuous) {
                const
                    { dateConstraints } = dd,
                    { timeAxisSubGrid } = client,
                    { scrollable }      = timeAxisSubGrid,
                    timeAxisRegion      = scrollable.viewport,
                    timeAxisPosition    = client.isHorizontal ? info.clientX - timeAxisRegion.x + scrollable.x : info.clientY - timeAxisRegion.y + scrollable.y,

                    // Use the localized coordinates to ask the TimeAxisViewModel what date the mouse is at.
                    // Pass allowOutOfRange as true in case we have dragged out of either side of the timeline viewport.
                    pointerDate         = client.timeAxisViewModel.getDateFromPosition(timeAxisPosition, null, true),
                    timeDiff            = dd.timeDiff = pointerDate - info.pointerStartDate;

                // calculate and round new startDate based on actual dd.timeDiff
                dd.startDate = me.adjustStartDate(dd.origStart, timeDiff);

                if (dateConstraints) {
                    dd.startDate = DateHelper.constrain(dd.startDate, dateConstraints.start, new Date(dateConstraints.end - eventRecord.durationMS));
                }
                dd.endDate = new Date(dd.startDate - 0 + dd.duration);
            }
            else {
                const range = me.resolveStartEndDates(proxyRegion);

                dd.startDate = range.startDate;
                dd.endDate = range.endDate;
            }
            dd.timeDiff = dd.startDate - dd.origStart;
        }

        Object.assign(dd, me.getProductDragContext(dd));

        if (dd.valid) {
            // If it's fully outside, we don't allow them to drop it - the event would disappear from their control.
            if ((dd.endDate <= client.timeAxis.startDate || dd.startDate >= client.timeAxis.endDate)) {
                dd.context.valid = false;
                dd.context.message = me.L('L{EventDrag.noDropOutsideTimeline}');
            }
            else {
                const result = !event || me.checkDragValidity(dd, event);

                if (!result || typeof result === 'boolean') {
                    dd.context.valid = result !== false;
                    dd.context.message = '';
                }
                else {
                    dd.context.valid = result.valid !== false;
                    dd.context.message = result.message;
                }
            }
        }
        else {
            dd.context.valid = false;
        }
    }

    suspendElementRedrawing(record, suspend = true) {
        const element = this.getRecordElement(record);

        if (element) {
            element.retainElement = suspend;
        }

        record.instanceMeta(this.client).retainElement = suspend;
    }

    resumeElementRedrawing(record) {
        this.suspendElementRedrawing(record, false);
    }

    /**
     * Initializes drag data (dates, constraints, dragged events etc). Called when drag starts.
     * @private
     * @param info
     * @param event
     * @returns {*}
     */
    getDragData(info, event) {
        const
            me                                                       = this,
            { client, drag }  = me,
            {
                record,
                dateConstraints,
                eventBarEls,
                draggedRecords
            }                 = me.setupProductDragData(info),
            timespan          = record.isAssignment ? record.event : record,
            origStart         = timespan.startDate,
            origEnd           = timespan.endDate,
            timeAxis          = client.timeAxis,
            startsOutsideView = origStart < timeAxis.startDate,
            endsOutsideView   = origEnd > timeAxis.endDate,
            coordinate        = me.getCoordinate(timespan, info.element, [info.elementStartX, info.elementStartY]),
            clientCoordinate  = me.getCoordinate(timespan, info.element, [info.startClientX, info.startClientY]);

        // prevent elements from being released when out of view
        draggedRecords.forEach(record => me.suspendElementRedrawing(record));

        // Select current without deselecting other events if Ctrl key is pressed
        if (drag.startEvent.ctrlKey) {
            if (record.isAssignment) {
                client.selectAssignment(record, true);
            }
            else {
                client.selectEvent(record, true);
            }
        }

        const dragData = {
            context : info,

            dateConstraints,

            eventBarEls,

            record,
            draggedRecords,

            sourceDate       : startsOutsideView ? origStart : client.getDateFromCoordinate(coordinate),
            screenSourceDate : client.getDateFromCoordinate(clientCoordinate, null, false),
            origStart        : origStart,
            origEnd          : origEnd,
            startDate        : origStart,
            endDate          : origEnd,
            timeDiff         : 0,

            startsOutsideView,
            endsOutsideView,

            duration     : origEnd - origStart,
            browserEvent : event // So we can know if SHIFT/CTRL was pressed
        };

        eventBarEls.forEach(el => {
            el.classList.add(drag.draggingCls);
            el.classList.remove('b-sch-event-hover');
            el.classList.remove('b-active');
            el.classList.remove('b-first-render');
        });

        if (eventBarEls.length > 1) {
            // RelatedElements are secondary elements moved by the same delta as the grabbed element
            if (!me.constrainDragToTimeline) {
                // Will be dragging a clone, need to do the same for all selected elements
                // TODO: This should be handled by DragHelper! It is basically a copy of code there for the main element
                info.relatedElements = eventBarEls.slice(1).map(eventBar => {
                    // TODO: Should be able to simplify this to only use DomSync.addChild
                    const
                        offsetX      = DomHelper.getOffsetX(eventBar, drag.dragWithin),
                        offsetY      = DomHelper.getOffsetY(eventBar, drag.dragWithin),
                        offsetWidth  = eventBar.offsetWidth,
                        offsetHeight = eventBar.offsetHeight,
                        element      = drag.createProxy(eventBar);

                    // Match the grabbed element's size and position.
                    DomHelper.setTranslateXY(element, offsetX, offsetY);
                    element.style.width = `${offsetWidth}px`;
                    element.style.height = `${offsetHeight}px`;

                    //element.classList.add(drag.dragProxyCls);
                    drag.dragWithin.appendChild(element);

                    eventBar.classList.add('b-drag-original');

                    if (drag.hideOriginalElement) {
                        eventBar.classList.add('b-hidden');
                    }

                    return element;
                });
            }
            else {
                info.relatedElements = eventBarEls.slice(1);
            }
            info.relatedElStartPos = [];
            info.relatedElDragFromPos = [];

            // Move the selected events into a unified cascade.
            if (me.unifiedDrag) {
                // EventBarEls should animate into the cascade
                me.client.isAnimating = true;

                EventHelper.on({
                    element : eventBarEls[1],
                    transitionend() {
                        me.client.isAnimating = false;
                    },
                    once : true
                });

                // Main dragged element should not look different. The relatedElements do.
                eventBarEls[0].classList.add('b-drag-main');

                let [x, y] = DomHelper.getTranslateXY(info.element);

                info.relatedElements.forEach((el, i) => {
                    // Cache the start pos for reversion in case of invalid drag
                    info.relatedElStartPos[i] = DomHelper.getTranslateXY(el);

                    // Move into cascade and cache the dragFrom pos
                    x += 10;
                    y += 10;
                    DomHelper.setTranslateXY(el, x, y);
                    info.relatedElDragFromPos[i] = [x, y];
                });
            }
            else {
                // Start pos and dragFrom pos are the same for non-unified
                info.relatedElements.forEach((el, i) => {
                    info.relatedElStartPos[i] = info.relatedElDragFromPos[i] = DomHelper.getTranslateXY(el);
                });
            }
        }

        return dragData;
    }

    // Provide your custom implementation of this to allow additional selected records to be dragged together with the original one.
    getRelatedRecords(record) {
        return [];
    }

    //endregion

    //region Constraints

    // private
    setupConstraints(constrainRegion, elRegion, tickSize, constrained) {
        const
            me        = this,
            xTickSize = !me.showExactDropPosition && tickSize > 1 ? tickSize : 0,
            yTickSize = 0;

        // If `constrained` is false then we haven't specified getDateConstraint method and should constrain mouse position to scheduling area
        // else we have specified date constraints and so we should limit mouse position to smaller region inside of constrained region using offsets and width.
        if (constrained) {
            me.setXConstraint(constrainRegion.left, constrainRegion.right - elRegion.width, xTickSize);
        }
        // And if not constrained, release any constraints from the previous drag.
        else {
            // minX being true means allow the start to be before the time axis.
            // maxX being true means allow the end to be after the time axis.
            me.setXConstraint(true, true, xTickSize);
        }
        me.setYConstraint(constrainRegion.top, constrainRegion.bottom - elRegion.height, yTickSize);
    }

    updateYConstraint(eventRecord) {
        const
            me          = this,
            { client }  = me,
            { context } = me.drag,
            tickSize    = client.timeAxisViewModel.snapPixelAmount;

        // If we're dragging when the vertical size is recalculated by the host grid,
        // we must update our Y constraint unless we are locked in the Y axis.
        if (context && !me.drag.lockY) {
            let constrainRegion;

            // This calculates a relative region which the DragHelper uses within its outerElement
            if (me.constrainDragToTimeline) {
                constrainRegion = client.getScheduleRegion(null, eventRecord);
            }
            // Not constraining to timeline.
            // Unusual configuration, but this must mean no Y constraining.
            else {
                me.setYConstraint(null, null, tickSize);
                return;
            }

            me.setYConstraint(
                constrainRegion.top,
                constrainRegion.bottom - context.element.offsetHeight,
                tickSize
            );
        }
        else {
            me.setYConstraint(null, null, tickSize);
        }
    }

    setXConstraint(iLeft, iRight, iTickSize) {
        const { drag } = this;

        drag.leftConstraint = iLeft;
        drag.rightConstraint = iRight;

        drag.minX = iLeft;
        drag.maxX = iRight;
    }

    setYConstraint(iUp, iDown, iTickSize) {
        const { drag } = this;

        drag.topConstraint = iUp;
        drag.bottomConstraint = iDown;

        drag.minY = iUp;
        drag.maxY = iDown;
    }

    //endregion

    //region Other stuff

    adjustStartDate(startDate, timeDiff) {
        return this.client.timeAxis.roundDate(
            new Date(startDate - 0 + timeDiff),
            this.client.snapRelativeToEventStartDate ? startDate : false
        );
    }

    resolveStartEndDates(proxyRect) {
        const { start, end } = this.client.getStartEndDatesFromRectangle(proxyRect, 'round', this.dragData.duration);

        return {
            startDate : start,
            endDate   : end
        };
    }

    //endregion

    //region Dragtip

    /**
     * Gets html to display in tooltip while dragging event. Uses clockTemplate to display start & end dates.
     */
    getTipHtml() {
        const
            me                                     = this,
            { dragData, client }                   = me,
            { startDate, endDate, draggedRecords } = dragData,
            startText                              = client.getFormattedDate(startDate),
            endText                                = client.getFormattedEndDate(endDate, startDate),
            { valid, message }                     = dragData.context,
            dragged                                = draggedRecords[0],
            // Scheduler always drags assignments
            timeSpanRecord                         = dragged.isTask ? dragged : dragged.event;

        return me.dragTipTemplate({
            valid,
            startDate,
            endDate,
            startText,
            endText,
            dragData,
            message                                : message || '',
            [client.scheduledEventName + 'Record'] : timeSpanRecord,
            startClockHtml                         : me.clockTemplate.template({
                date : startDate,
                text : startText,
                cls  : 'b-sch-tooltip-startdate'
            }),
            endClockHtml : timeSpanRecord.isMilestone ? '' : me.clockTemplate.template({
                date : endDate,
                text : endText,
                cls  : 'b-sch-tooltip-enddate'
            })
        });
    }

    //endregion

    //region Product specific, implemented in subclasses

    // Check if element can be dropped at desired location
    isValidDrop(dragData) {
        throw new Error('Implement in subclass');
    }

    // Similar to the fn above but also calls validatorFn
    checkDragValidity(dragData) {
        throw new Error('Implement in subclass');
    }

    // Update records being dragged
    updateRecords(context) {
        throw new Error('Implement in subclass');
    }

    // Determine if an element can be dragged
    isElementDraggable(el, event) {
        throw new Error('Implement in subclass');
    }

    // Get coordinate for correct axis
    getCoordinate(record, element, coord) {
        throw new Error('Implement in subclass');
    }

    // Product specific drag data
    setupProductDragData(info) {
        throw new Error('Implement in subclass');
    }

    // Product specific data in drag context
    getProductDragContext(dd) {
        throw new Error('Implement in subclass');
    }

    getRecordElement(record) {
        throw new Error('Implement in subclass');
    }

    //endregion
}
