import FormTab from './FormTab.js';
import '../CalendarField.js';
import '../ConstraintTypePicker.js';
import '../../../Core/widget/DateField.js';
import '../../../Core/widget/Checkbox.js';
import '../SchedulingModePicker.js';

/**
 * @module SchedulerPro/widget/taskeditor/SchedulerAdvancedTab
 */

/**
 * Advanced task options for {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or
 * {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} tab.* Contains the following fields by default (with their default weight):
 *
 * * calendarField (1) - Only shown when using calendars
 * * constraintTypeField (2)
 * * constraintDateField (3)
 * * manuallyScheduledField (4)
 *
 * To customize the tab or its fields:
 *
 * ```javascript
 * {
 *     features : {
 *         taskEdit : {
 *             items : {
 *                 advancedTab : {
 *                     // Custom title
 *                     title: 'Advanced',
 *                     // Customized items
 *                     items : {
 *                         // Hide the manually scheduled field
 *                         manuallyScheduledField : false,
 *                         // Customize the constraint date field
 *                         constraintDateField : {
 *                             format : 'YYYY-mm-dd'
 *                         },
 *                         // Add a custom field
 *                         styleField : {
 *                             type   : 'text',
 *                             label  : 'Style',
 *                             // name maps to a field on the event record
 *                             name   : 'eventStyle',
 *                             // place after calendar field
 *                             weight : 1
 *                         }
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 * ```
 *
 * @extends  SchedulerPro/widget/taskeditor/FormTab
 * @classtype scheduleradvancedtab
 * @internal
 */
export default class SchedulerAdvancedTab extends FormTab {

    static get $name() {
        return 'SchedulerAdvancedTab';
    }

    static get type() {
        return 'scheduleradvancedtab';
    }

    static get defaultConfig() {
        return {
            title : '<i class="b-icon b-icon-advanced" data-btip="L{Advanced}"></i>',
            cls   : 'b-advanced-tab',

            defaults : {
                localeClass : this,
                labelWidth  : this.localize('labelWidth')
            },

            namedItems : {
                calendarField : {
                    type  : 'calendarfield',
                    name  : 'calendar',
                    label : 'L{Calendar}'
                },
                constraintTypeField : {
                    type      : 'constrainttypepicker',
                    name      : 'constraintType',
                    label     : 'L{Constraint type}',
                    clearable : true
                },
                constraintDateField : {
                    type  : 'date',
                    name  : 'constraintDate',
                    label : 'L{Constraint date}'
                },
                manuallyScheduledField : {
                    type  : 'checkbox',
                    name  : 'manuallyScheduled',
                    text  : 'L{Manually scheduled}',
                    label : '&nbsp;'
                }
            },

            items : {
                calendarField          : true,
                constraintTypeField    : true,
                constraintDateField    : true,
                manuallyScheduledField : true
            }
        };
    }

    get calendarField() {
        return this.widgetMap.calendarField;
    }

    get constraintTypeField() {
        return this.widgetMap.constraintTypeField;
    }

    get constraintDateField() {
        return this.widgetMap.constraintDateField;
    }

    get manuallyScheduledField() {
        return this.widgetMap.manuallyScheduledField;
    }

    loadEvent(eventRecord) {
        const
            me                = this,
            firstLoad         = !me.record,
            { calendarField } = me;

        //<debug>
        console.assert(
            firstLoad || me.project === eventRecord.project,
            'Loading of a record from another project is not currently supported!'
        );
        //</debug>

        if (calendarField) {
            calendarField.store = eventRecord.project.calendarManagerStore;
            calendarField.hidden = !eventRecord.project.calendarManagerStore.count;
        }

        super.loadEvent(eventRecord);
    }
}

SchedulerAdvancedTab.initClass();
