import PickerField from './PickerField.js';
import Objects from '../helper/util/Objects.js';
import EventHelper from '../helper/EventHelper.js';

/**
 * @module Core/widget/TextAreaField
 */

/**
 * TextAreaField widget. Wraps native &lt;textarea&gt;
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 *
 * @extends Core/widget/Field
 *
 * @example
 * let textAreaField = new TextAreaField({
 *   placeholder: 'Enter some text'
 * });
 *
 * @classType textareafield
 */
export default class TextAreaField extends PickerField {
    static get $name() {
        return 'TextAreaField';
    }

    // Factoryable type name
    static get type() {
        return 'textareafield';
    }

    // Factoryable type alias
    static get alias() {
        return 'textarea';
    }

    static get configurable() {
        return {
            picker : {
                type         : 'widget',
                cls          : 'b-textareafield-picker',
                floating     : true,
                scrollAction : 'realign',
                align        : {
                    align    : 't-b',
                    axisLock : true
                },
                autoShow : false
            }
        };
    }

    static get defaultConfig() {
        return {
            triggers : null, // Override PickerField. We don't have a trigger by default

            /**
             * Configure as `false` to have the field render as a non-editable picker field which
             * shows a `<textarea>` input when expanded.
             * @config {Boolean}
             * @default
             */
            inline : true,

            /**
             * The resize style to apply to the `<textarea>` element.
             * @config {String}
             * @default
             */
            resize : 'none',

            inputType : null
        };
    }

    startConfigure(config) {
        // Read the inline config which will force evaluation of triggers.
        this._thisIsAUsedExpression(this.inline);
        super.startConfigure(config);
    }

    get inputElement() {
        const result = super.inputElement;

        if (this.inline) {
            result.tag = 'textarea';
            result.style = (result.style || '') + `;resize:${this.resize}`;
        }
        else {
            result.readOnly = 'readonly';
            result.reference = 'displayElement';
        }

        return result;
    }

    get focusElement() {
        return this.inline || this._picker && this._picker.isVisible ? this.input : this.displayElement;
    }

    showPicker() {
        const { picker } = this;

        picker.width = this.pickerWidth || this[this.pickerAlignElement].offsetWidth;

        // Always focus the picker.
        super.showPicker(true);
    }

    focusPicker() {
        this.input.focus();
    }

    onPickerKeyDown(keyEvent) {
        const
            me = this,
            realInput = me.input;

        switch (keyEvent.key.trim() || keyEvent.code) {
            case 'Escape':
                // TODO: revert value?
                me.picker.hide();
                return;
            case 'Enter':
                if (keyEvent.ctrlKey) {
                    me.syncInputFieldValue();
                    me.picker.hide();
                }
                break;
        }

        // Super's onPickerKeyDown fires through this.input, so avoid infinite recursion
        // by redirecting it through the displayElement.
        me.input = me.displayElement;
        const result = super.onPickerKeyDown(keyEvent);
        me.input = realInput;

        return result;
    }

    syncInputFieldValue(skipHighlight) {
        if (this.displayElement) {
            this.displayElement.value = this.inputValue;
        }
        super.syncInputFieldValue(skipHighlight);
    }

    set value(value) {
        super.value = value == null ? '' : value;
    }

    get value() {
        return super.value;
    }

    set inline(inline) {
        this._inline = inline;
        if (!inline && !this.triggers) {
            this.triggers = {};
        }
    }

    set triggers(triggers) {
        if (!this.inline) {
            (triggers || (triggers = {})).expand = {
                cls     : 'b-icon-picker',
                handler : 'onTriggerClick'
            };
        }
        super.triggers = triggers;
    }

    get triggers() {
        return super.triggers;
    }

    get inline() {
        return this._inline;
    }

    changePicker(picker, oldPicker) {
        const
            me          = this,
            pickerWidth = me.pickerWidth || picker?.width;

        picker = TextAreaField.reconfigure(oldPicker, picker ? Objects.merge({
            owner        : me,
            forElement   : me[me.pickerAlignElement],
            align        : {
                matchSize : pickerWidth == null,
                anchor   : me.overlayAnchor,
                target   : me[me.pickerAlignElement]
            },
            html     : `<textarea id="${me.id + '-input'}" style="resize:${me.resize}">${me.value}</textarea>`
        }, picker) : null, me);

        // May have been set to null (destroyed)
        if (picker) {
            const input = me.input = picker.element.querySelector(`#${me.id}-input`);

            me.inputListenerRemover = EventHelper.on({
                element  : input,
                thisObj  : me,
                focus    : 'internalOnInputFocus',
                change   : 'internalOnChange',
                input    : 'internalOnInput',
                keydown  : 'internalOnKeyPress',
                keypress : 'internalOnKeyPress',
                keyup    : 'internalOnKeyPress'
            });
        }

        return picker;
    }
}

// Register this widget type with its Factory
TextAreaField.initClass();
