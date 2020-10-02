import Base from '../../../Core/Base.js';
import '../recurrence/RecurrenceConfirmationPopup.js';

/**
 * @module Scheduler/view/mixin/RecurringEvents
 */

/**
 * A mixin that adds recurring events functionality to the Scheduler.
 *
 * The main purpose of the code in here is displaying  a {@link Scheduler.view.recurrence.RecurrenceConfirmationPopup special confirmation}
 * on user mouse dragging/resizing/deleting recurring events and their occurrences.
 *
 * @mixin
 */
export default Target => class RecurringEvents extends (Target || Base) {
    static get configurable() {
        return {
            /**
             * Enables showing occurrences of recurring events across ths scheduler's time axis.
             *
             * Enables extra recurrence UI fields in the system-provided event editor.
             * @config {Boolean}
             * @default false
             */
            enableRecurringEvents : false,

            recurrenceConfirmationPopup : {
                $config : ['lazy'],
                value   : {
                    type : 'recurrenceconfirmation'
                }
            }
        };
    }

    construct(config) {
        super.construct(config);

        this.on({
            beforeeventdropfinalize   : 'onBeforeEventDropFinalize',
            beforeeventresizefinalize : 'onBeforeEventResizeFinalize',
            beforeEventDelete         : 'onRecurrableEventBeforeDelete',
            thisObj                   : this
        });
    }

    changeRecurrenceConfirmationPopup(recurrenceConfirmationPopup, oldRecurrenceConfirmationPopup) {
        // Widget.reconfigure reither reconfigures an existing instance, or creates a new one, or,
        // if the configuration is null, destroys the existing instance.
        const result = this.constructor.reconfigure(oldRecurrenceConfirmationPopup, recurrenceConfirmationPopup, 'recurrenceconfirmation');
        result.owner = this;
        return result;
    }

    showDisplayConfirmationOnEventDelete(eventRecord) {
        const { eventEdit } = this.features;

        // show confirmation if we deal with a recurring event (or its occurrence)
        // and if the record is not being edited by event editor (since event editor has its own confirmation)
        return (eventRecord.supportsRecurring && (eventRecord.isRecurring || eventRecord.isOccurrence) &&
            (!eventEdit || !eventEdit.isEditing || eventEdit.eventRecord !== eventRecord));
    }

    onRecurrableEventBeforeDelete({ eventRecords, context }) {
        const [eventRecord] = eventRecords;

        if (this.enableRecurringEvents && this.showDisplayConfirmationOnEventDelete(eventRecord)) {
            this.recurrenceConfirmationPopup.confirm({
                actionType : 'delete',
                eventRecord,
                changerFn() {
                    context.finalize(true);
                },
                cancelFn() {
                    context.finalize(false);
                }
            });

            return false;
        }
    }

    onBeforeEventDropFinalize({ context }) {
        if (this.enableRecurringEvents) {
            const
                { eventRecords } = context,
                recurringEvents = eventRecords.filter(eventRecord => eventRecord.supportsRecurring && (eventRecord.isRecurring || eventRecord.isOccurrence));

            if (recurringEvents.length) {
                context.async = true;

                this.recurrenceConfirmationPopup.confirm({
                    actionType  : 'update',
                    eventRecord : recurringEvents[0],
                    changerFn() {
                        context.finalize(true);
                    },
                    cancelFn() {
                        context.finalize(false);
                    }
                });
            }
        }
    }

    onBeforeEventResizeFinalize({ context }) {
        if (this.enableRecurringEvents) {
            const
                { eventRecord } = context,
                isRecurring     = eventRecord.supportsRecurring && (eventRecord.isRecurring || eventRecord.isOccurrence);

            if (isRecurring) {
                context.async = true;

                this.recurrenceConfirmationPopup.confirm({
                    actionType : 'update',
                    eventRecord,
                    changerFn() {
                        context.finalize(true);
                    },
                    cancelFn() {
                        context.finalize(false);
                    }
                });
            }
        }
    }

    /**
     * Returns occurrences of the provided recurring event across the date range of this Scheduler.
     * @param  {Scheduler.model.TimeSpan} recurringEvent Recurring event for which occurrences should be retrieved.
     * @return {Scheduler.model.TimeSpan[]} Array of the provided timespans occurrences.
     * 
     * __Empty if the passed event is not recurring, or has no occurrences in the date range.__
     *
     * __If the date range encompasses the start point, the recurring event itself will be the first entry.__
     */
    getOccurrencesFor(recurringEvent) {
        return this.eventStore.getOccurrencesForTimeSpan(recurringEvent, this.timeAxis.startDate, this.timeAxis.endDate);
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
