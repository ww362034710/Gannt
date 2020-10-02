import Combo from '../../Core/widget/Combo.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';

/**
 * @module Gantt/widget/DependencyTypePicker
 */

const buildItems = (items) => items.map((item, index) => [index, item]);

/**
 * Selects a Dependency linkage type between two tasks.
 *
 * @extends Core/widget/Combo
 *
 * @classType dependencytypepicker
 */
export default class DependencyTypePicker extends Combo {

    //region Config

    static get $name() {
        return 'DependencyTypePicker';
    }

    // Factoryable type name
    static get type() {
        return 'dependencytypepicker';
    }

    //endregion

    //region Constructor

    construct(config) {
        super.construct(config);

        // Update when changing locale
        LocaleManager.on({
            locale : () => {
                this.items = buildItems(this.L('L{DependencyType.long}'));
            },
            thisObj : this
        });
    }

    //endregion

    //region Internal

    get store() {
        if (!this._items) {
            this.items = this._items = buildItems(this.L('L{DependencyType.long}'));
        }

        return super.store;
    }

    set store(store) {
        super.store = store;
    }

    //endregion

}

// Register this widget type with its Factory
DependencyTypePicker.initClass();
