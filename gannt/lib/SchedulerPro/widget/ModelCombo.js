import Combo from '../../Core/widget/Combo.js';

/**
 * @module Gantt/widget/ModelCombo
 */

/**
 * Special combo class returning a model from the store as it's value
 */
export default class ModelCombo extends Combo {

    //region Config

    static get $name() {
        return 'ModelCombo';
    }

    // Factoryable type name
    static get type() {
        return 'modelcombo';
    }

    //endregion

    //region Internal

    get value() {
        const
            superValue = super.value,
            model      = this.store.getById(superValue);

        return model || superValue;
    }

    set value(v) {
        super.value = v;
    }

    //endregion

}

// Register this widget type with its Factory
ModelCombo.initClass();
