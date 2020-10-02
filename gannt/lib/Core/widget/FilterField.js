import TextField from '../../Core/widget/TextField.js';

/**
 * @module Core/widget/FilterField
 */

/**
 * A simple text field for filtering a store
 * @extends Core/widget/TextField
 * @classType filterfield
 */
export default class FilterField extends TextField {
    static get $name() {
        return 'FilterField';
    }

    // Factoryable type name
    static get type() {
        return 'filterfield';
    }

    static get configurable() {
        return {
            /**
             * The model field name to filter by
             * @config {String}
             */
            field : null,

            /**
             * The store to filter
             * @config {Core.data.Store}
             */
            store : null,

            clearable            : true,
            keyStrokeChangeDelay : 100,

            onChange({ value }) {
                const filterId = `${this.field}-Filter`;

                if (value.length === 0) {
                    this.store.removeFilter(filterId);
                }
                else {
                    // We filter using a RegExp, so quote significant characters
                    value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                    // A filter with an id replaces any previous filter with that id.
                    // Leave any other filters which may be in use in place.
                    this.store.filter({
                        id       : filterId,
                        filterBy : record => record.get(this.field).match(new RegExp(value, 'i'))
                    });
                }
            }
        };
    }
};

FilterField.initClass();
