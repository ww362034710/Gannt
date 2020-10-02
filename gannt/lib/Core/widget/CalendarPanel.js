import Panel from './Panel.js';
import Widget from './Widget.js';
import DateHelper from '../helper/DateHelper.js';
import Month from '../util/Month.js';
import './Tooltip.js';
import LocaleManager from '../localization/LocaleManager.js';
import ObjectHelper from '../helper/ObjectHelper.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/CalendarPanel
 */

/**
 * A Panel which can display a month of date cells.
 *
 * This is a base class for UI widgets which need to make use of a calendar layout
 * and should not be used directly.
 */
export default class CalendarPanel extends Panel {
    static get $name() {
        return 'CalendarPanel';
    }

    // Factoryable type name
    static get type() {
        return 'calendarpanel';
    }

    static get configurable() {
        return {
            textContent : false,

            /**
             * The date which this CalendarPanel encapsulates. Setting this causes the
             * content to be refreshed.
             * @config {Date|String}
             */
            date : null,

            month : {},

            year : null,

            /**
             * The week start day, 0 meaning Sunday, 6 meaning Saturday.
             * Defaults to the locale's week start day.
             * @config {Number}
             */
            weekStartDay : false,

            /**
             * Configure as `true` to always show a six week calendar.
             * @config {Boolean}
             * @default
             */
            sixWeeks : true,

            /**
             * Configure as `true` to show a week number column at the start of the calendar block.
             * @deprecated 4.0.0 Use {@link #config-showWeekColumn} instead.
             * @config {Boolean}
             */
            showWeekNumber : null,

            /**
             * Configure as `true` to show a week number column at the start of the calendar block.
             * @config {Boolean}
             */
            showWeekColumn : null,

            /**
             * Either an array of `Date` objects which are to be disabled, or
             * a function, which, when passed a `Date` returns `true` if the
             * date is disabled.
             * @config {Function|Date[]}
             */
            disabledDates : null,

            /**
             * A function which creates content in, and may mutate a day header element.
             * The following parameters are passed:
             *  - cell [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) The header element.
             *  - day [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) The day number conforming to the specified {@link #config-weekStartDay}. Will be in the range 0 to 6.
             *  - weekDay [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) The canonial day number where Monday is 0 and Sunday is.
             * @config {Function}
             */
            headerRenderer : null,

            /**
             * A function which creates content in, and may mutate the week cell element at the start of a week row.
             * The following parameters are passed:
             *  - cell [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) The header element.
             *  - week [Number[]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) An array containing `[year, weekNumber]`.
             * @config {Function}
             */
            weekRenderer : null,

            /**
             * A function which creates content in, and may mutate a day cell element.
             * The following parameters are passed:
             *  - cell [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) The header element.
             *  - date [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) The date for the cell.
             *  - cellIndex [Number[]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) The cell index, 0 to 6.
             * @config {Function}
             */
            cellRenderer : null,

            /**
             * Configure as `true` to render weekends as {@link #config-disabledDates}.
             * @config {Boolean}
             */
            disableWeekends : null,

            hideNonWorkingDays : null,

            hideNonWorkingDaysCls : 'b-hide-nonworking-days',

            /**
             * An object with number properties (0-6) whose values define the non-working days.
             * @config {Object}
             * @default
             */
            nonWorkingDays : {
                0 : true,
                6 : true
            },

            /**
             * A config object to create a tooltip which will show on hover of a date cell
             * including disabled, weekend, and "other month" cells.
             *
             * It is the developer's responsibility to hook the `beforeshow` event
             * to either veto the show by returning `false` or provide contextual
             * content for the date.
             *
             * The tip instance will be primed with a `currentDate` property.
             * @config {Object}
             */
            tip : null,

            dayCellCls : 'b-calendar-cell',

            /**
             * The class name to add to disabled calendar cells.
             * @config {String}
             * @private
             */
            disabledCls : 'b-disabled-date',

            /**
             * The class name to add to calendar cells which are in the previous or next month.
             * @config {String}
             * @private
             */
            otherMonthCls : 'b-other-month',

            /**
             * The class name to add to calendar cells which are weekend dates.
             * @config {String}
             * @private
             */
            weekendCls : 'b-weekend',

            /**
             * The class name to add to the calendar cell which contains today's date.
             * @config {String}
             * @private
             */
            todayCls : 'b-today',

            /**
             * The class name to add to calendar cells which are {@link #config-nonWorkingDays}.
             * @config {String}
             * @private
             */
            nonWorkingDayCls : 'b-nonworking-day',

            /**
             * The {@link Core.helper.DateHelper DateHelper} format string to format the day names.
             * @config {String}
             * @default
             */
            dayNameFormat : 'ddd',

            /**
             * By default, week rows flex to share available Panel height equally.
             *
             * Set this config if the available height is too small, and the cell height needs
             * to be larger to show events.
             *
             * Setting this config causes the month grid to become scrollable in the `Y` axis.
             */
            minRowHeight : {
                $config : ['lazy'],
                value   : null
            },

            /**
             * By default, day cells flex to share available Panel width equally.
             *
             * Set this config if the available width is too small, and the cell width needs
             * to be larger to show events.
             *
             * Setting this config causes the month grid to become scrollable in the `X` axis.
             */
            minColumnWidth : {
                $config : ['lazy'],
                value   : null
            }
        };
    }

    construct(config) {
        LocaleManager.on({
            locale  : 'updateDayNameFormat',
            thisObj : this
        });
        super.construct(config);

        if (!this.refreshCount) {
            this.refresh();
        }
    }

    onPaint({ firstPaint }) {
        // Invoke the lazy configs when we first hit the visible DOM
        if (firstPaint) {
            // The cell structure must exist for the configs to apply to.
            if (!this.refreshCount) {
                this.refresh();
            }
            this.getConfig('minColumnWidth');
            this.getConfig('minRowHeight');
        }
    }

    get overflowElement() {
        return this.weeksElement;
    }

    doDestroy() {
        this.tip && this.tip.destroy();

        super.doDestroy();
    }

    ingestDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
            if (isNaN(date)) {
                throw new Error('CalendarPanel date ingestion must be passed a Date, or a valid argument to the Date constructor');
            }
            // Edge parses YYYY-MM-DD as UTC, not local, so in other locales, the value
            // may end up not being 00:00:00 in the date, so remove any time zone offset.
            const tzo = date.getTimezoneOffset();
            if (tzo) {
                date = DateHelper.add(date, tzo, 'minute');
            }
        }
        return DateHelper.clearTime(date);
    }

    changeMinRowHeight(minRowHeight) {
        // Fall back to 75 on platforms that do not support CSS vars
        const minValue = parseInt(DomHelper.getStyleValue(this.element, '--min-row-height'), 10) || 75;

        return minRowHeight == null ? minRowHeight : Math.max(parseInt(minRowHeight) || 0, minValue);
    }

    updateMinRowHeight(minRowHeight) {
        this.weekElements.forEach(w => DomHelper.setLength(w, 'flexBasis', minRowHeight));

        this.scrollable = {
            overflowY : minRowHeight ? 'auto' : false
        };
    }

    changeMinColumnWidth(minColumnWidth) {
        // Fall back to 75 on platforms that do not support CSS vars
        const minValue = parseInt(DomHelper.getStyleValue(this.element, '--min-column-width'), 10) || 75;

        return minColumnWidth == null ? minColumnWidth : Math.max(parseInt(minColumnWidth) || 0, minValue);
    }

    updateMinColumnWidth(minColumnWidth) {
        const me = this;

        me.weekdayCells.forEach(c => DomHelper.setLength(c, 'minWidth', minColumnWidth));
        me.cellElements.forEach(c => c.matches(`.${me.dayCellCls}`) && DomHelper.setLength(c, 'minWidth', minColumnWidth));

        me.scrollable = {
            overflowX : minColumnWidth ? 'auto' : false
        };
        me.overflowElement.classList[minColumnWidth ? 'add' : 'remove']('b-min-columnwidth');
    }

    getDateFromEvent(domEvent) {
        const element = (domEvent.nodeType === 1 ? domEvent : domEvent.target).closest(`#${this.id} [data-date]`);

        if (element) {
            return DateHelper.parseKey(element.dataset.date);
        }
    }

    changeTip(tip, oldTip) {
        const listeners = {
            pointerOver : 'onTipOverCell',
            thisObj     : this
        };

        if (oldTip) {
            oldTip.un(listeners);
        }
        if (tip) {
            if (!(tip instanceof Widget)) {
                tip = Widget.create(Object.assign({
                    owner       : this,
                    type        : 'tooltip',
                    id          : `${this.id}-cell-tip`,
                    forElement  : this.bodyElement,
                    forSelector : `.${this.dayCellCls}`
                }, tip));
            }
            tip.on(listeners);
        }
        return tip;
    }

    changeElement(element) {
        const me = this;

        element = super.changeElement(...arguments);

        me.updateHideNonWorkingDays(me.hideNonWorkingDays);
        me.weekElements = Array.from(element.querySelectorAll('.b-calendar-week'));
        me.weekDayElements = Array.from(element.querySelectorAll('.b-calendar-days'));
        me.cellElements = [];

        for (let i = 0, { length } = me.weekDayElements; i < length; i++) {
            me.cellElements.push(me.weekDayElements[i].previousSibling, ...me.weekDayElements[i].children);
        }
        return element;
    }

    changeDate(date) {
        return this.ingestDate(date);
    }

    /**
     * The date which this CalendarPanel encapsulates. Setting this causes the
     * content to be refreshed.
     * @property {Date}
     */
    updateDate(value) {
        // We respond to Month chahge events to update the UI
        this.month.date = value;
    }

    updateDayNameFormat() {
        // 4th June 2000 was a Sunday
        const d = new Date('2000-06-04T12:00:00');

        this.shortDayNames = [];

        // Collect local shortDayNames in default order.
        for (let date = 4; date < 11; date++) {
            d.setDate(date);
            this.shortDayNames.push(DateHelper.format(d, this.dayNameFormat));
        }
    }

    changeWeekStartDay(weekStartDay) {
        return typeof weekStartDay === 'number' ? weekStartDay : DateHelper.weekStartDay;
    }

    /**
     * Set to 0 for Sunday (the default), 1 for Monday etc.
     *
     * Set to `null` to use the default value from {@link Core.helper.DateHelper DateHelper}.
     */
    updateWeekStartDay(weekStartDay) {
        const me = this;

        if (me._month) {
            me.month.weekStartDay = weekStartDay;

            me.dayNames = [];

            // So, if they set weekStartDay to 1 meaning Monday which is ISO standard, we will
            // dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            for (let i = 0; i < 7; i++) {
                me.dayNames[i] = me.shortDayNames[me.canonicalDayNumbers[i]];
            }

            me.refresh();
        }
    }

    updateHideNonWorkingDays(hideNonWorkingDays) {
        this.contentElement.classList[hideNonWorkingDays ? 'add' : 'remove'](this.hideNonWorkingDaysCls);
        this.scrollable?.syncOverflowState();
        if (this._month) {
            this.month.hideNonWorkingDays = hideNonWorkingDays;
        }
    }

    changeNonWorkingDays(nonWorkingDays) {
        return ObjectHelper.assign({}, nonWorkingDays);
    }

    updateNonWorkingDays(nonWorkingDays) {
        if (this._month) {
            this.month.nonWorkingDays = nonWorkingDays;
            this.refresh();
            this.scrollable?.syncOverflowState();
        }
    }

    get visibleDayColumnIndex() {
        return this.month.visibleDayColumnIndex;
    }

    get dayColumnIndex() {
        return this.month.dayColumnIndex;
    }

    get canonicalDayNumbers() {
        return this.month.canonicalDayNumbers;
    }

    get visibleColumnCount() {
        return this.month.visibleColumnCount;
    }

    get weekLength() {
        return this.month.weekLength;
    }

    /**
     * The date of the first day cell in this panel.
     * Note that this may *not* be the first of this panel's current month.
     * @property {Date}
     * @readonly
     */
    get startDate() {
        return this.month.startDate;
    }

    get duration() {
        // The endDate is "exclusive" because it means 00:00:00 of that day.
        return DateHelper.diff(this.month.startDate, this.month.endDate, 'day') + 1;
    }

    /**
     * The end date of this view. Note that in terms of full days, this is exclusive,
     * ie: 2020-01-012 to 2020-01-08 is *seven* days. The end is 00:00:00 on the 8th.
     *
     * Note that this may *not* be the last date of this panel's current month.
     * @property {Date}
     * @readonly
     */
    get endDate() {
        return DateHelper.add(this.month.endDate, 1, 'day');
    }

    changeMonth(month, currentMonth) {
        const me = this;

        if (!(month instanceof Month)) {

            // Setting month to a number when we already have a Month means
            // just updating the month number of our Month
            if (typeof month === 'number') {
                if (currentMonth) {
                    currentMonth.month = month;
                    return;
                }
                const date = me.date || DateHelper.clearTime(new Date());

                date.setMonth(month);
                month = {
                    date
                };
            }
            month = new Month(ObjectHelper.assign({
                weekStartDay       : me.weekStartDay,
                nonWorkingDays     : me.nonWorkingDays,
                hideNonWorkingDays : me.hideNonWorkingDays,
                sixWeeks           : me.sixWeeks
            }, month));
        }

        month.on({
            dateChange : 'onMonthDateChange',
            thisObj    : me
        });

        return month;
    }

    onMonthDateChange({ source : month, newDate, oldDate }) {
        const me = this;

        // Ensure we're always in sync with the data our Month holds
        me.year = month.year;

        if (!me.isConfiguring) {
            me.refresh();

            if (oldDate - newDate) {
                /**
                 * Fires when the date of this CalendarPanel is set.
                 * @event dateChange
                 * @param {Date[]} value The new date.
                 * @param {Date[]} oldValue The old date.
                 */
                me.trigger('dateChange', {
                    value    : newDate,
                    oldValue : oldDate
                });
            }
        }
    }

    updateYear(year) {
        this.month.year = year;
    }

    updateShowWeekNumber(showWeekNumber) {
        this.updateShowWeekColumn(showWeekNumber);
    }

    updateShowWeekColumn(showWeekColumn) {
        const me = this;

        me.element.classList[showWeekColumn ? 'add' : 'remove']('b-show-week-column');
        if (me.floating) {
            // Must realign because content change might change dimensions
            if (!me.isAligning) {
                me.realign();
            }
        }
    }

    refresh() {
        // Ensure sub elements are all present
        this.getConfig('element');

        const
            me    = this,
            today = DateHelper.clearTime(new Date()),
            {
                cellElements,
                weekElements,
                weekDayElements,
                date,
                month,
                dayCellCls,
                disabledCls,
                otherMonthCls,
                weekendCls,
                todayCls,
                nonWorkingDayCls,
                canonicalDayNumbers
            } = me;

        // If we have not been initialized with a current date, use today
        if (!date) {
            return me.date = today;
        }

        // Make sure we've calculated our shortDayNames
        me.getConfig('dayNameFormat');

        // Reset all cell classNames
        for (let i = 0, len = cellElements.length; i < len; i++) {
            cellElements[i].className = dayCellCls;
        }

        for (let i = 0; i < 7; i++) {
            const
                cell          = me.weekdayCells[i],
                cellDay       = me.canonicalDayNumbers[i],
                cellClassList = cell.classList;

            cell.className = cell.innerHTML = '';
            if (me.headerRenderer) {
                me.headerRenderer(cell, i, cellDay);
            }
            else {
                cell.innerHTML = me.shortDayNames[cellDay];
            }
            cellClassList.add('b-calendar-day-header');

            if (cellDay === 0 || cellDay === 6) {
                cell.classList.add(weekendCls);
            }
            if (me.nonWorkingDays[cellDay]) {
                cellClassList.add(nonWorkingDayCls);
            }
        }

        // Create cell content
        let weekIndex = 0,
            cellIndex = 0,
            lastWorkingColumn = 6;

        // Which column is the last working day so it can be tagged with an identifying class
        for (let columnIndex = 6; columnIndex >= 0; columnIndex--) {
            if (!me.nonWorkingDays[canonicalDayNumbers[columnIndex]]) {
                lastWorkingColumn = columnIndex;
                break;
            }
        }

        month.eachWeek((week, dates) => {
            const
                weekDayElement = weekDayElements[weekIndex],
                weekCells = [weekDayElement.previousSibling, ...weekDayElement.children];

            // Stamp week into week row's dataset
            weekElements[weekIndex].dataset.week = `${week[0]},${week[1]}`;

            weekCells[0].className = 'b-week-number-cell';
            if (me.weekRenderer) {
                me.weekRenderer(weekCells[0], week);
            }
            else {
                weekCells[0].innerHTML = week[1];
            }

            for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
                const
                    date          = dates[columnIndex],
                    day           = date.getDay(),
                    cell          = weekCells[columnIndex + 1],
                    cellClassList = cell.classList;

                if (me.isDisabledDate(date)) {
                    cellClassList.add(disabledCls);
                }
                if (date.getMonth() !== month.month) {
                    cellClassList.add(otherMonthCls);
                }
                if (day === 0 || day === 6) {
                    cellClassList.add(weekendCls);
                }
                if (date.getTime() === today.getTime()) {
                    cellClassList.add(todayCls);
                }
                if (me.nonWorkingDays[day]) {
                    cellClassList.add(nonWorkingDayCls);
                }

                // Tag the last working day in a week with a class
                cellClassList[columnIndex === lastWorkingColumn ? 'add' : 'remove']('b-last-working-day');

                cell.dataset.date = DateHelper.makeKey(date);
                cell.dataset.cellIndex = cellIndex;
                cell.dataset.columnIndex = columnIndex;

                if (me.cellRenderer) {
                    me.cellRenderer({
                        cell,
                        date,
                        day,
                        cellIndex,
                        columnIndex,
                        visibleColumnIndex : me.visibleDayColumnIndex[day],
                        week
                    });
                }
                else {
                    cell.innerHTML = date.getDate();
                }
                cellIndex++;
            }

            weekIndex++;
        });
        if (me.floating) {
            // Must realign because content change might change dimensions
            if (!me.isAligning) {
                me.realign();
            }
        }

        me.refreshCount = (me.refreshCount || 0) + 1;

        /**
         * Fires when this CalendarPanel refreshes.
         * @event refresh
         */
        me.trigger('refresh');
    }

    isDisabledDate(date) {
        const day = date.getDay(),
            disabledDates = this.disabledDates;

        if (this.disableWeekends && (day === 0 || day === 6)) {
            return true;
        }

        if (disabledDates) {
            if (typeof disabledDates === 'function') {
                return disabledDates(date);
            }
            if (Array.isArray(disabledDates)) {
                return disabledDates.some(d => DateHelper.clearDate(d, true).getTime() === DateHelper.clearDate(date, true).getTime());
            }
        }
    }

    get bodyConfig() {
        const result = super.bodyConfig,
            weeksContainerChildren = [];

        result.children = [{
            tag       : 'div',
            className : 'b-calendar-row b-calendar-weekdays',
            reference : 'weekdaysHeader',
            children  : this.dayNameCells
        }, {
            // `notranslate` prevents google translate messing up the DOM, https://github.com/facebook/react/issues/11538
            className : 'b-weeks-container notranslate',
            reference : 'weeksElement',
            children  : weeksContainerChildren
        }];
        for (let i = 0; i < 6; i++) {
            const weekRow = {
                className : 'b-calendar-row b-calendar-week',
                children  : [{
                    // the week number cell
                }, {
                    className : 'b-calendar-days',
                    children  : []
                }]
            };
            // Generate cells seven dys
            for (let j = 0; j < 7; j++) {
                weekRow.children[1].children.push({});
            }
            weeksContainerChildren.push(weekRow);
        }

        return result;
    }

    get dayNameCells() {
        const me = this,
            weekNumberHeader = document.createElement('div'),
            result = [weekNumberHeader],
            weekdayCells = me.weekdayCells = [];

        weekNumberHeader.className = 'b-week-number-cell';

        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('div');
            result.push(cell);
            weekdayCells.push(cell);
        }
        return result;
    }

    get firstVisibleDate() {
        for (const date = this.month.startDate; ; date.setDate(date.getDate() + 1)) {
            if (!this.hideNonWorkingDays || !this.nonWorkingDays[date.getDay()]) {
                return date;
            }
        }
    }

    getCell(date) {
        if (!(typeof date === 'string')) {
            date = DateHelper.makeKey(date);
        }
        return this.weeksElement.querySelector(`[data-date="${date}"]`);
    }

    onTipOverCell({ source : tip, target }) {
        tip.date = DateHelper.parseKey(target.dataset.date);
    }
}

// Register this widget type with its Factory
CalendarPanel.initClass();
