import { ScheduleRange } from '../../../feature/export/Utils.js';
import LocalizableCombo from '../../../../Grid/view/export/field/LocalizableCombo.js';

export default class ScheduleRangeCombo extends LocalizableCombo {
    static get $name() {
        return 'ScheduleRangeCombo';
    }

    // Factoryable type name
    static get type() {
        return 'schedulerangecombo';
    }

    static get defaultConfig() {
        return {
            editable : false
        };
    }

    buildLocalizedItems() {
        const me = this;

        // Do not remove. Assertion strings for Localization sanity check.
        // 'L{completeview}'
        // 'L{currentview}'
        // 'L{daterange}'
        // 'L{completedata}'

        return Object.entries(ScheduleRange).map(([id, text]) => ({ id, text : me.L(`L{${text}}`) }));
    }
}

// Register this widget type with its Factory
ScheduleRangeCombo.initClass();
