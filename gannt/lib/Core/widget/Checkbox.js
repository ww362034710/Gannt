import Field from './Field.js';
import Widget from './Widget.js';
import DomHelper from '../helper/DomHelper.js';

/**
 * @module Core/widget/Checkbox
 */

/**
 * Checkbox field, wraps <code>&lt;input type="checkbox"&gt;</code>.
 * Color can be specified and you can optionally configure {@link #config-text}
 * to display in a label to the right of the checkbox in addition to a standard
 * field {@link #config-label}.
 *
 * This field can be used as an {@link Grid.column.Column#config-editor editor} for the {@link Grid.column.Column Column}.
 *
 * @extends Core/widget/Field
 *
 * @example
 * // checkbox with a label and a handler
 * let checkbox = new Checkbox({
 *   text: 'Check me, please',
 *   onAction: () => {}
 * });
 *
 * @classType checkbox
 * @externalexample widget/Checkbox.js
 */
export default class Checkbox extends Field {
    //region Config
    static get $name() {
        return 'Checkbox';
    }

    // Factoryable type name
    static get type() {
        return 'checkbox';
    }

    // Factoryable type alias
    static get alias() {
        return 'check';
    }

    static get defaultConfig() {
        return {
            inputType : 'checkbox',

            /**
             * Text to display on checkbox label
             * @config {String}
             */
            text : '',

            /**
             * Checkbox color, must have match in css
             * @config {String}
             */
            color : null,

            /**
             * Sets input fields value attribute
             * @config {String}
             */
            value : '',

            toggleGroup : null,

            defaultBindProperty : 'value',

            localizableProperties : ['label', 'text']
        };
    }

    //endregion

    //region Init

    construct(config) {
        super.construct(config);

        const me = this;

        if (me.initialConfig.readOnly) me.readOnly = true;

        me.isConfiguring = true;
        if (me.initialConfig.checked) me.checked = true;
        me.isConfiguring = false;

    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            this.inputElement,
            {
                tag       : 'label',
                class     : 'b-checkbox-label',
                for       : `${this.id}-input`,
                reference : 'textLabel',
                html      : this.text || ''
            }
        ];
    }

    get inputElement() {
        const
            me     = this,
            config = super.inputElement;

        if (me.toggleGroup) {
            config.dataset = {
                group : me.toggleGroup
            };
        }

        return config;
    }

    set element(element) {
        const me = this;

        super.element = element;

        if (me.color) {
            me.element.classList.add(me.color);
        }
        if (me.text) {
            me.element.classList.add('b-text');
        }
    }

    get element() {
        return super.element;
    }
    //endregion

    //region Toggle

    /**
     * Get/set label
     * @property {String}
     */
    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        if (this.textLabel) {
            this.textLabel.innerHTML = value;
        }
    }

    /**
     * Get/set value
     * @property {String}
     */
    get value() {
        return this.checked;
    }

    set value(value) {
        this.checked = value === 'false' ? false : Boolean(value);
    }

    /**
     * Get/set checked state
     * @property {Boolean}
     */
    get checked() {
        return this.input.checked;
    }

    set checked(checked) {
        const me = this;
        checked = Boolean(checked);

        // Only do action if change needed.
        if (!me.inputting && me.input.checked !== checked) {
            me.input.checked = checked;

            me.uncheckToggleGroupMembers();

            // The change event does not fire on programmatic change of input.
            if (!me.isConfiguring) {
                me.triggerChange(false);
            }
        }
    }

    getToggleGroupMembers() {
        const
            me = this,
            { checked, toggleGroup, input : checkedElement } = me,
            result = [];

        if (checked && toggleGroup) {
            DomHelper.forEachSelector(`input[type=checkbox][data-group=${toggleGroup}]`, inputEl => {
                if (inputEl !== checkedElement) {
                    const partnerCheckbox = Widget.fromElement(inputEl);
                    partnerCheckbox && result.push(partnerCheckbox);
                }
            });
        }

        return result;
    }

    uncheckToggleGroupMembers() {
        if (this.checked && this.toggleGroup) {
            this.getToggleGroupMembers().forEach(widget => widget.checked = false);
        }
    }

    /**
     * Get/set readonly state (disabled underlying input)
     * @property {Boolean} readOnly
     */
    updateReadOnly(readOnly) {
        this.input.disabled = readOnly;

        // Field and Widget have a say too. Widget adds the class and fires the event
        super.updateReadOnly(readOnly);
    }

    /**
     * Check the box
     */
    check() {
        this.checked = true;
    }

    /**
     * Uncheck the box
     */
    uncheck() {
        this.checked = false;
    }

    /**
     * Toggle checked state. If you want to force a certain state, assign to {@link #property-checked} instead.
     */
    toggle() {
        this.checked = !this.checked;
    }

    //endregion

    //region Events

    /**
     * Triggers events when user toggles the checkbox
     * @fires beforeChange
     * @fires change
     * @fires action
     * @private
     */
    internalOnChange(event) {
        /**
         * Fired before checkbox is toggled. Returning false from a listener prevents the checkbox from being toggled.
         * @event beforeChange
         * @preventable
         * @param {Core.widget.Checkbox} source Checkbox
         * @param {Boolean} checked Checked or not
         */

        /**
         * Fired when checkbox is toggled
         * @event change
         * @param {Core.widget.Checkbox} source Checkbox
         * @param {Boolean} checked Checked or not
         */

        this.triggerChange(true);
    }

    /**
     * Triggers events when checked state is changed
     * @fires beforeChange
     * @fires change
     * @fires action
     * @private
     */
    triggerChange(userAction) {
        const me = this,
            { checked } = me.input;

        // Prevent uncheck if this checkbox is part of a toggleGroup (radio-button mode) ..also ensure the group has visible active members
        const prevented = (!checked && userAction && me.toggleGroup && me.getToggleGroupMembers().filter(widget => widget.isVisible && !widget.disabled).length) ||
            // Since Widget has Events mixed in configured with 'callOnFunctions' this will also call onBeforeChange, onChange and onAction
            !me.callPreventable(
                'change',

                { checked, value : checked, userAction, valid : true },

                eventObject => {

                    me.triggerFieldChange(eventObject, false);

                    if (userAction) {
                        me.uncheckToggleGroupMembers();
                    }

                    /**
                    * User performed the default action (toggled the checkbox)
                    * @event action
                    * @param {Core.widget.Checkbox} source Checkbox
                    * @param {Boolean} checked Checked or not
                    */
                    me.trigger('action', eventObject);

                    return true;
                }
            );

        // If prevented need to rollback the checkbox input
        if (prevented) {
            // Input change is not preventable, so need to revert the changes
            // The change event does not fire on programmatic change of input, so no need to suspend
            me.input.checked = !me.input.checked;
        }
    }

    //endregion
}

// Register this widget type with its Factory
Checkbox.initClass();
