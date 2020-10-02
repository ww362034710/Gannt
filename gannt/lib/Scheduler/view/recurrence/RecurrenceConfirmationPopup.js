import Popup from '../../../Core/widget/Popup.js';

/**
 * @module Scheduler/view/recurrence/RecurrenceConfirmationPopup
 */

/**
 * Confirmation dialog showing up before modifying a recurring event or some of its occurrences.
 * For recurring events the dialog notifies user that the event change/removal will cause all its occurrences
 * change/removal and asks to confirm the action.
 *
 * And for occurrences the dialog allows to choose if user wants to affect all further occurrences, this occurrence only or cancel the change.
 *
 * Usage example:
 *
 * ```javascript
 * const confirmation = new RecurrenceConfirmationPopup();
 *
 * confirmation.confirm({
 *     eventRecord : recurringEvent,
 *     actionType  : "delete",
 *     changerFn   : () => recurringEvent.remove(event)
 * });
 * ```
 *
 * @classType recurrenceconfirmation
 * @extends Core/widget/Popup
 */
export default class RecurrenceConfirmationPopup extends Popup {

    static get $name() {
        return 'RecurrenceConfirmationPopup';
    }

    // Factoryable type name
    static get type() {
        return 'recurrenceconfirmation';
    }

    static get defaultConfig() {
        return {
            localizableProperties : [],
            align                 : 'b-t',
            autoShow              : false,
            autoClose             : false,
            closeAction           : 'onRecurrenceClose',
            modal                 : true,
            centered              : true,
            scrollAction          : 'realign',
            constrainTo           : window,
            draggable             : true,
            closable              : true,
            floating              : true,
            eventRecord           : null,
            cls                   : 'b-sch-recurrenceconfirmation',
            bbar                  : {
                defaults : {
                    localeClass : this
                },
                items : {
                    /**
                     * Reference to the "apply changes to multiple occurrences" button, if used
                     * @member {Core.widget.Button} changeMultipleButton
                     * @readonly
                     */
                    changeMultipleButton : {
                        color   : 'b-green',
                        text    : 'L{Object.Yes}',
                        onClick : 'up.onChangeMultipleButtonClick'
                    },
                    /**
                     * Reference to the button that causes changing of the event itself only, if used
                     * @member {Core.widget.Button} changeSingleButton
                     * @readonly
                     */
                    changeSingleButton : {
                        color   : 'b-gray',
                        text    : 'L{update-only-this-btn-text}',
                        onClick : 'up.onChangeSingleButtonClick'
                    },
                    /**
                     * Reference to the cancel button, if used
                     * @member {Core.widget.Button} cancelButton
                     * @readonly
                     */
                    cancelButton : {
                        color   : 'b-gray',
                        text    : 'L{Object.Cancel}',
                        onClick : 'up.onCancelButtonClick'
                    }
                }
            }
        };
    }

    onChangeMultipleButtonClick() {
        this.processMultipleRecords();
        this.hide();
    }

    onChangeSingleButtonClick() {
        this.processSingleRecord();
        this.hide();
    }

    onCancelButtonClick() {
        this.cancelFn && this.cancelFn.call(this.thisObj);
        this.hide();
    }

    onRecurrenceClose() {
        if (this.cancelFn) {
            this.cancelFn.call(this.thisObj);
        }
        this.hide();
    }

    /**
     * Displays the confirmation.
     * Example usage:
     *
     * ```javascript
     * const popup = new RecurrenceConfirmationPopup();
     *
     * popup.confirm({
     *     eventRecord,
     *     actionType : "delete",
     *     changerFn  : () => eventStore.remove(record)
     * });
     * ```
     *
     * @param {Object}                     config               The following config options are supported:
     * @param {Scheduler.model.EventModel} config.eventRecord   Event being modified.
     * @param {String}                     config.actionType    Type of modification to be applied to the event. Can be either "update" or "delete".
     * @param {Function}                   config.changerFn     A function that should be called to apply the change to the event upon user choice.
     * @param {Function}                   [config.thisObj]     `changerFn` and `cancelFn` functions scope.
     * @param {Function}                   [config.cancelFn]    Function called on `Cancel` button click.
     */
    confirm(config = {}) {
        const me = this;

        //<debug>
        if (!config || !config.actionType || !config.eventRecord) {
            throw new Error('actionType and eventRecord must be specified for Scheduler.view.recurrence.RecurrenceConfirmationPopup');
        }
        //</debug>

        [
            'actionType',
            'eventRecord',
            'title',
            'html',
            'changerFn',
            'cancelFn',
            'thisObj'
        ].forEach(prop => {
            if (prop in config) me[prop] = config[prop];
        });

        me.updatePopupContent();

        return super.show(config);
    }

    updatePopupContent() {
        const
            me                                                         = this,
            { changeMultipleButton, changeSingleButton, cancelButton } = me.widgetMap,
            { eventRecord, actionType = 'update' }                     = me,
            isMaster                                                   = eventRecord && eventRecord.isRecurring;

        // Do not remove. Assertion strings for Localization sanity check.
        // 'L{delete-further-message}'
        // 'L{update-further-message}'
        // 'L{delete-all-message}'
        // 'L{update-all-message}'
        // 'L{delete-further-btn-text}'
        // 'L{update-further-btn-text}'
        // 'L{delete-only-this-btn-text}'
        // 'L{update-only-this-btn-text}'

        if (isMaster) {
            changeMultipleButton.text = me.L('L{Object.Yes}');
            me.html = me.L(`${actionType}-all-message`);
        }
        else {
            changeMultipleButton.text = me.L(`${actionType}-further-btn-text`);
            me.html = me.L(`${actionType}-further-message`);
        }

        changeSingleButton.text = me.L(`${actionType}-only-this-btn-text`);
        cancelButton.text = me.L('L{Object.Cancel}');

        // TODO: so far we hide 'Only this event' option for a recurring event itself until this case is supported
        if (isMaster) {
            changeSingleButton.hide();
        }
        else {
            changeSingleButton.show();
        }

        me.width = me.L('L{width}');

        // the following lines are added to satisfy the 904_unused localization test
        // to let it know that these locales are used:
        // this.L('L{delete-title}') not found
        // this.L('L{update-title}') not found

        me.title = me.L(`${actionType}-title`);
    }

    processMultipleRecords() {
        const { eventRecord, changerFn, thisObj } = this;

        eventRecord.beginBatch();

        // Apply changes to the occurrence.
        // It is not joined to any stores, so this has no consequence.
        this.callback(changerFn, thisObj, [eventRecord]);

        // afterChange will promote it to being an new recurring base because there's still recurrence
        eventRecord.endBatch();
    }

    processSingleRecord() {
        const { eventRecord, changerFn, thisObj } = this;

        eventRecord.beginBatch();

        // When the changes apply, because there's no recurrence, it will become an exception
        eventRecord.recurrence = null;

        // Apply changes to the occurrence.
        // It is not joined to any stores, so this has no consequence.
        this.callback(changerFn, thisObj, [eventRecord]);

        // Must also change after the callback in case the callback sets the rule.
        // This will update the batch update data block to prevent it being set back to recurring.
        eventRecord.recurrenceRule = null;

        // afterChange will promote it to being an exception because there's no recurrence
        eventRecord.endBatch();
    }

    updateLocalization() {
        this.updatePopupContent();
        super.updateLocalization();
    }

};

// Register this widget type with its Factory
RecurrenceConfirmationPopup.initClass();
