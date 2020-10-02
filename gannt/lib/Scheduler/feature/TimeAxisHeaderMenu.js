import HeaderMenu from '../../Grid/feature/HeaderMenu.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module Scheduler/feature/TimeAxisHeaderMenu
 */

/**
 * Adds scheduler specific menu items to the timeline header context menu.
 *
 * By default the menu has the following items:
 *
 * * Filter tasks (if {@link Scheduler.feature.EventFilter EventFilter} is enabled);
 * * Zoom;
 * * Date range;
 *
 * Can be populated by other features.
 *
 * Add extra items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem() {
 *                         ...
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Remove existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             items : {
 *                 zoomLevel : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         timeAxisHeaderMenu : {
 *             // Process items before menu is shown
 *             processItems({ items }) {
 *                  // Add an extra item dynamically
 *                 items.coolItem = {
 *                     text : 'Cool action',
 *                     onItem() {
 *                           // ...
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * This feature is **enabled** by default
 *
 * @extends Grid/feature/HeaderMenu
 * @demo Scheduler/basic
 * @classtype timeAxisHeaderMenu
 * @externalexample scheduler/TimeAxisHeaderMenu.js
 */
export default class TimeAxisHeaderMenu extends HeaderMenu {

    //region Config

    static get $name() {
        return 'TimeAxisHeaderMenu';
    }

    static get defaultConfig() {
        return {
            type : 'timeAxisHeader',

            defaultItems : {
                zoomLevel : true,
                dateRange : true
            }
        };
    }

    //endregion

    //region Events

    /**
     * Fired from Scheduler before the context menu is shown for the time axis header.
     * Allows manipulation of the items to show in the same way as in the {@link Grid.feature.base.ContextMenuBase#config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event timeAxisHeaderContextMenuBeforeShow
     * @preventable
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Time axis column
     */

    /**
     * Fired from grid after the context menu is shown for a header
     * @event timeAxisHeaderContextMenuShow
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Time axis column
     */

    /**
     * Fired from grid when an item is selected in the header context menu.
     * @event timeAxisHeaderContextMenuItem
     * @param {Scheduler.view.Scheduler} source The scheduler
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Time axis column
     */

    //endregion

    construct() {
        super.construct(...arguments);

        if (this.triggerEvent.includes('click') && this.client.zoomOnTimeAxisDoubleClick) {
            this.client.zoomOnTimeAxisDoubleClick = false;
        }
    }

    shouldShowMenu(eventParams) {
        const { column } = eventParams;

        return column && column.enableHeaderContextMenu !== false && column === this.client.timeAxisColumn;
    }

    showContextMenu(eventParams) {
        const me = this;

        // super.showContextMenu(...arguments);

        // if (me.menu) {
        //     // the TimeAxis's context menu probably will cause scrolls because it manipulates the dates.
        //     // The menu should not hide on scroll when for a TimeAxisColumn
        //     me.menu.scrollAction = 'realign';
        // }
    }

    get namedItems() {
        const
            me         = this,
            { client } = me,
            dateStep   = {
                magnitude : client.timeAxis.shiftIncrement,
                unit      : client.timeAxis.shiftUnit
            };

        if (!me._namedItems) {
            me._namedItems = {
                zoomLevel : {
                    text        : 'L{pickZoomLevel}',
                    localeClass : this,
                    icon        : 'b-fw-icon b-icon-search-plus',
                    disabled    : !client.presets.count || me.disabled,
                    weight      : -160,
                    menu        : {
                        type  : 'popup',
                        items : [{
                            type      : 'slider',
                            showValue : false,
                            listeners : {
                                input   : me.onZoomSliderChange,
                                thisObj : me
                            },
                            // set width for IE11
                            minWidth : 130
                        }],
                        onBeforeShow({ source : menu }) {
                            const [zoom] = menu.items;

                            zoom.min = client.minZoomLevel;
                            zoom.max = client.maxZoomLevel;
                            zoom.value = client.zoomLevel;
                        }
                    }
                },
                dateRange : {
                    text        : 'L{activeDateRange}',
                    localeClass : this,
                    icon        : 'b-fw-icon b-icon-calendar',
                    weight      : -150,
                    menu        : {
                        type     : 'popup',
                        width    : '20em',
                        defaults : {
                            localeClass : me
                        },
                        items : {
                            startDateField : {
                                type       : 'datefield',
                                label      : 'L{startText}',
                                weight     : -500,
                                labelWidth : '6em',
                                required   : true,
                                step       : dateStep,
                                listeners  : {
                                    change  : me.onRangeDateFieldChange,
                                    thisObj : me
                                }
                            },
                            endDateField : {
                                type       : 'datefield',
                                label      : 'L{endText}',
                                weight     : -400,
                                labelWidth : '6em',
                                required   : true,
                                step       : dateStep,
                                listeners  : {
                                    change  : me.onRangeDateFieldChange,
                                    thisObj : me
                                }
                            },
                            leftShiftBtn : {
                                type      : 'button',
                                weight    : -300,
                                cls       : 'b-left-nav-btn',
                                icon      : 'b-icon b-icon-prev',
                                color     : 'b-blue b-raised',
                                flex      : 1,
                                margin    : 0,
                                listeners : {
                                    click   : me.onLeftShiftBtnClick,
                                    thisObj : me
                                }
                            },
                            todayBtn : {
                                type      : 'button',
                                weight    : -200,
                                cls       : 'b-today-nav-btn',
                                color     : 'b-blue b-raised',
                                text      : 'L{todayText}',
                                flex      : 4,
                                margin    : '0 8',
                                listeners : {
                                    click   : me.onTodayBtnClick,
                                    thisObj : me
                                }
                            },
                            rightShiftBtn : {
                                type      : 'button',
                                weight    : -100,
                                cls       : 'b-right-nav-btn',
                                icon      : 'b-icon b-icon-next',
                                color     : 'b-blue b-raised',
                                flex      : 1,
                                listeners : {
                                    click   : me.onRightShiftBtnClick,
                                    thisObj : me
                                }
                            }
                        },
                        listeners : {
                            paint   : me.initDateRangeFields,
                            thisObj : me
                        }
                    }
                }
            };
        }

        return me._namedItems;
    }

    onZoomSliderChange({ value }) {
        const me = this;

        // Zooming maintains timeline center point by scrolling the newly rerendered timeline to the
        // correct point to maintain the visual center. Temporarily inhibit context menu hide on scroll
        // of its context element.
        me.menu.scrollAction = 'realign';

        me.client.zoomLevel = value;

        me.menu.setTimeout({
            fn                : () => me.menu.scrollAction = 'hide',
            delay             : 100,
            cancelOutstanding : true
        });
    }

    initDateRangeFields({ source : dateRange, firstPaint }) {
        const me = this;

        if (firstPaint) {
            const { widgetMap } = dateRange;

            me.startDateField = widgetMap.startDateField;
            me.endDateField = widgetMap.endDateField;
        }

        me.initDates();
    }

    initDates() {
        const me = this;

        me.startDateField.suspendEvents();
        me.endDateField.suspendEvents();

        // The actual scheduler start dates may include time, but our Date field cannot currently handle
        // a time portion and throws it away, so when we need the value from an unchanged field, we need
        // to use the initialValue set from the timeAxis values.
        // Until our DateField can optionally include a time value, this is the solution.
        me.startDateField.value = me.startDateFieldInitialValue = me.client.startDate;
        me.endDateField.value = me.endDateFieldInitialValue = me.client.endDate;

        me.startDateField.resumeEvents();
        me.endDateField.resumeEvents();
    }

    onRangeDateFieldChange({ source }) {
        const
            me               = this,
            startDateChanged = (source === me.startDateField),
            { client }       = me,
            { timeAxis }     = client,
            startDate        = me.startDateFieldInitialValue && !startDateChanged ? me.startDateFieldInitialValue : me.startDateField.value;

        let endDate = me.endDateFieldInitialValue && startDateChanged ? me.endDateFieldInitialValue : me.endDateField.value;

        // When either of the fields is changed, we no longer use its initialValue from the timeAxis start or end
        // so that gets nulled to indicate that it's unavailable and the real field value is to be used.
        if (startDateChanged) {
            me.startDateFieldInitialValue = null;
        }
        else {
            me.endDateFieldInitialValue = null;
        }

        // Because the start and end dates are exclusive, avoid a zero
        // length time axis by incrementing the end by one tick unit
        // if they are the same.
        if (!(endDate - startDate)) {
            endDate = DateHelper.add(endDate, timeAxis.shiftIncrement, timeAxis.shiftUnit);
        }
        // if start date got bigger than end date set end date to start date plus one tick
        else if (endDate < startDate) {
            endDate = DateHelper.add(startDate, timeAxis.shiftIncrement, timeAxis.shiftUnit);
        }

        client.preserveViewCenter(() => client.timeAxis.setTimeSpan(startDate, endDate));

        me.initDates();
    }

    onLeftShiftBtnClick() {
        const me = this;

        me.client.timeAxis.shiftPrevious();
        me.initDates();
    }

    onTodayBtnClick() {
        const
            me    = this,
            today = DateHelper.clearTime(new Date());

        me.client.timeAxis.setTimeSpan(today, DateHelper.add(today, 1, 'day'));
        me.initDates();
    }

    onRightShiftBtnClick() {
        const me = this;

        me.client.timeAxis.shiftNext();
        me.initDates();
    }
}

TimeAxisHeaderMenu._$name = '';

GridFeatureManager.registerFeature(TimeAxisHeaderMenu, true, ['Scheduler', 'Gantt']);
