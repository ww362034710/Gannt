import ModelCombo from './ModelCombo.js';

/**
 * @module SchedulerPro/widget/CalendarField
 */

/**
 * Event calendar selector combo.
 */
export default class CalendarField extends ModelCombo {

    //region Config

    static get $name() {
        return 'CalendarField';
    }

    // Factoryable type name
    static get type() {
        return 'calendarfield';
    }

    static get defaultConfig() {
        return {
            valueField   : 'id',
            displayField : 'name',
            editable     : false,

            listItemTpl : c => {
                return c && c.name ? c.name : this.L('L{Default calendar}');
            },

            displayValueRenderer : c => {
                return c ? c.name : this.L('L{Default calendar}');
            }
        };
    }

    //endregion

    //region Internal

    get value() {
        return super.value;
    }

    set value(v) {
        if (v && v.isDefault && v.isDefault()) {
            v = null;
        }
        super.value = v;
    }

    //endregion

}

// Register this widget type with its Factory
CalendarField.initClass();
