import ColumnStore from '../../Grid/data/ColumnStore.js';
import NumberColumn from '../../Grid/column/NumberColumn.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import '../../Core/widget/DurationField.js';

/**
 * @module SchedulerPro/column/DurationColumn
 */

/**
 * A column showing the task {@link Scheduler/model/TimeSpan#property-fullDuration duration}. Please note, this column
 * is preconfigured and expects its field to be of the {@link Core.data.Duration} type.
 *
 * The default editor is a {@link Core.widget.DurationField DurationField}. It parses time units,
 * so you can enter "4d" indicating 4 days duration, or "4h" indicating 4 hours, etc.
 *
 * @extends Grid/column/NumberColumn
 * @classType duration
 */
export default class DurationColumn extends NumberColumn {

    //region Config

    static get $name() {
        return 'DurationColumn';
    }

    static get type() {
        return 'duration';
    }

    static get isGanttColumn() {
        return true;
    }

    static get fields() {
        return [
            /**
             * Precision of displayed duration, defaults to use {@link SchedulerPro.view.SchedulerPro#config-durationDisplayPrecision}.
             * Specify an integer value to override that setting, or `false` to use raw value
             * @config {Number|Boolean} decimalPrecision
             */
            { name : 'decimalPrecision', defaultValue : 1 }
        ];
    }

    static get defaults() {
        return {
            field         : 'fullDuration',
            text          : 'L{Duration}',
            min           : 0,
            step          : 1,
            instantUpdate : true,

            sortable : (task1, task2) => {
                const
                    ms1 = task1.isScheduled ? task1.calendar.calculateDurationMs(task1.startDate, task1.endDate) : 0,
                    ms2 = task2.isScheduled ? task2.calendar.calculateDurationMs(task2.startDate, task2.endDate) : 0;

                return ms1 === ms2 ? 0 : (ms1 < ms2 ? -1 : 1);
            }
        };
    }

    //endregion

    //region Internal

    get durationUnitField() {
        return `${this.field}Unit`;
    }

    formatValue(duration, durationUnit) {
        const
            nbrDecimals = typeof this.grid.durationDisplayPrecision === 'number' ? this.grid.durationDisplayPrecision : this.decimalPrecision,
            multiplier  = Math.pow(10, nbrDecimals),
            rounded     = Math.round(duration * multiplier) / multiplier;

        return rounded + ' ' + DateHelper.getLocalizedNameOfUnit(durationUnit, duration !== 1);
    }

    // * reactiveRenderer() {
    //     const { column : me, record } = this;
    //
    //     return me.formatValue(yield record.$.duration, yield record.$.durationUnit);
    // }

    get defaultEditor() {
        return {
            type : 'duration',
            name : this.field
        };
    }

    // Can only edit leafs
    canEdit(record) {
        return record.isLeaf;
    }

    //endregion

    //region Render

    defaultRenderer({ record, isExport }) {
        const
            value         = record[this.field],
            type          = typeof value,
            durationValue = type === 'number' ? value : value && value.magnitude,
            durationUnit  = type === 'number' ? record[this.durationUnitField] : value && value.unit;

        // in case of bad input (for instance NaN, undefined or NULL value)
        if (typeof durationValue !== 'number') {
            return isExport ? '' : null;
        }

        return this.formatValue(durationValue, durationUnit);
    }

    //endregion

}

ColumnStore.registerColumnType(DurationColumn);
