import Field from './Field.js';

//TODO: label should be own element

/**
 * @module Core/widget/TextField
 */

/**
 * Textfield widget. Wraps native &lt;input type="text"&gt;
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Grid.column.Column Column}, {@link Grid.column.TemplateColumn TemplateColumn},
 * {@link Grid.column.TreeColumn TreeColumn}, and for other columns if another editor is not specified explicitly,
 * or disabled by setting `false` value.
 *
 * @extends Core/widget/Field
 *
 * @example
 * let textField = new TextField({
 *   placeholder: 'Enter some text'
 * });
 *
 * @classType textfield
 * @externalexample widget/TextField.js
 */
export default class TextField extends Field {

    // Factoryable type name
    static get type() {
        return 'textfield';
    }

    // Factoryable type alias
    static get alias() {
        return 'text';
    }

    static get defaultConfig() {
        return {
            /**
             * The tab index of the input field
             * @config {Number} tabIndex
             */

            /**
             * The min number of characters for the input field
             * @config {Number} minLength
             */

            /**
             * The max number of characters for the input field
             * @config {Number} maxLength
             */

            localizableProperties : ['label', 'title', 'placeholder'],

            nullValue : ''
        };
    }

    static get $name() {
        return 'TextField';
    }

    construct(config) {
        if (config.inputType === 'hidden') {
            config.hidden = true;
        }
        super.construct(...arguments);
    }

    set placeholder(value) {
        this._placeholder = value;

        if (this.input) {
            this.input.placeholder = value ?? '';
        }
    }

    get placeholder() {
        return this._placeholder;
    }
}

// Register this widget type with its Factory
TextField.initClass();
