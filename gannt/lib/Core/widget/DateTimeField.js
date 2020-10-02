import Field from './Field.js';
import TimeField from './TimeField.js';
import DateField from './DateField.js';
import DateHelper from '../helper/DateHelper.js';
import ObjectHelper from '../helper/ObjectHelper.js';

/**
 * @module Core/widget/DateTimeField
 */

/**
 * A field combining a {@link Core.widget.DateField} and a {@link Core.widget.TimeField}.
 *
 * @extends Core/widget/Field
 * @private
 */
export default class DateTimeField extends Field {
    static get configurable() {
        return {
            timeField : {},

            dateField : {},

            inputTemplate : () => ''
        };
    }

    static get $name() {
        return 'DateTimeField';
    }

    static get type() {
        return 'datetimefield';
    }

    // Factoryable type alias
    static get alias() {
        return 'datetime';
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            this.dateField.element,
            this.timeField.element
        ];
    }

    // Converts the timeField config into a TimeField
    changeTimeField(config) {
        const
            me = this,
            result = new TimeField(ObjectHelper.assign({
                flex : '0 0 45%',

                updateInvalid() {
                    const updatingInvalid = me.updatingInvalid;

                    TimeField.prototype.updateInvalid.apply(this, arguments);
                    me.timeField && !updatingInvalid && me.updateInvalid();
                }
            }, config));

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            result.readOnly = true;
        }

        return result;
    }

    // Set up change listener when TimeField is available. Not in timeField config to enable users to supply their own
    // listeners block there
    updateTimeField(timeField) {
        const me = this;

        timeField.on({
            change({ userAction, value }) {
                if (userAction && !me.$settingValue) {
                    const dateAndTime = me.dateField.value;
                    me._isUserAction = true;
                    me.value = dateAndTime ? DateHelper.copyTimeValues(dateAndTime, value) : null;
                    me._isUserAction = false;
                }
            },
            thisObj : me
        });
    }

    // Converts the dateField config into a DateField
    changeDateField(config) {
        const
            me = this,
            result = new DateField(ObjectHelper.assign({
                // To be able to use transformDateValue for parsing without loosing time, a bit of a hack
                keepTime : true,
                flex     : 1,
                step     : '1 d',

                updateInvalid() {
                    const updatingInvalid = me.updatingInvalid;

                    DateField.prototype.updateInvalid.apply(this, arguments);
                    me.dateField && !updatingInvalid && me.updateInvalid();
                }
            }, config));

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        if (me.readOnly) {
            result.readOnly = true;
        }

        return result;
    }

    get childItems() {
        return [this.dateField, this.timeField];
    }

    // Set up change listener when DateField is available. Not in dateField config to enable users to supply their own
    // listeners block there
    updateDateField(dateField) {
        const me = this;

        dateField.on({
            change({ userAction, value }) {
                if (userAction && !me.$isInternalChange) {
                    me._isUserAction = true;
                    me.value = value;
                    me._isUserAction = false;
                }
            },
            thisObj : me
        });
    }

    // Apply our value to our underlying fields
    syncInputFieldValue(skipHighlight = this.isConfiguring) {
        super.syncInputFieldValue(true);

        if (!skipHighlight && !this.highlightExternalChange) {
            skipHighlight = true;
        }

        const
            me            = this,
            highlightDate = me.dateField.highlightExternalChange,
            highlightTime = me.timeField.highlightExternalChange;

        me.$isInternalChange = true;

        me.dateField.highlightExternalChange = false;

        // Prevent dateField from keeping its time value
        // TODO: Should be doable without this hack
        me.dateField.value = null;

        me.dateField.highlightExternalChange = highlightDate;

        if (skipHighlight) {
            me.timeField.highlightExternalChange = me.dateField.highlightExternalChange = false;
        }

        me.timeField.value = me.dateField.value = me.inputValue;

        me.dateField.highlightExternalChange = highlightDate;
        me.timeField.highlightExternalChange = highlightTime;

        me.$isInternalChange = false;

        // Must evaluate after child fields have been updated since our validity state depends on theirs.
        me.updateInvalid();
    }

    get required() {
        return this._required;
    }

    // Make us and our underlying fields required
    set required(required) {
        super.required = required;

        this.timeField.required = this.dateField.required = required;
    }

    // Make us and our underlying fields disabled
    onDisabled(value) {
        this.timeField.disabled = this.dateField.disabled = value;
    }

    hasChanged(oldValue, newValue) {
        return !DateHelper.isEqual(oldValue, newValue);
    }

    get isValid() {
        return this.timeField.isValid && this.dateField.isValid;
    }

    getErrors() {
        const errors = [...(this.dateField.getErrors() || []), ...(this.timeField.getErrors() || [])];

        return errors.length ? errors : null;
    }
}

DateTimeField.initClass();
