import FormTab from './FormTab.js';
import '../CalendarField.js';
import '../ConstraintTypePicker.js';
import '../../../Core/widget/DateField.js';
import '../../../Core/widget/Checkbox.js';
import '../SchedulingModePicker.js';

/**
 * @module SchedulerPro/widget/taskeditor/AdvancedTab
 */

/**
 * Advanced task options {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or
 * {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} tab.
 *
 * @internal
 * @extends SchedulerPro/widget/taskeditor/FormTab
 * @classtype advancedtab
 */
export default class AdvancedTab extends FormTab {

    static get $name() {
        return 'AdvancedTab';
    }

    // Factoryable type name
    static get type() {
        return 'advancedtab';
    }

    static get defaultConfig() {
        return {
            localeClass : this,
            title       : 'L{Advanced}',
            cls         : 'b-advanced-tab',

            defaults : {
                localeClass : this,
                labelWidth  : this.L('labelWidth')
            },

            namedItems : {
                calendarField : {
                    type  : 'calendarfield',
                    ref   : '',
                    name  : 'calendar',
                    label : 'L{Calendar}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                },
                manuallyScheduledField : {
                    type  : 'checkbox',
                    name  : 'manuallyScheduled',
                    label : 'L{Manually scheduled}',
                    flex  : '1 0 50%'
                },
                schedulingModeField : {
                    type  : 'schedulingmodecombo',
                    name  : 'schedulingMode',
                    label : 'L{Scheduling mode}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                },
                effortDrivenField : {
                    type  : 'checkbox',
                    name  : 'effortDriven',
                    label : 'L{Effort driven}',
                    flex  : '1 0 50%'
                },
                divider : {
                    html    : '',
                    dataset : {
                        text : this.L('L{Constraint}')
                    },
                    cls  : 'b-divider',
                    flex : '1 0 100%'
                },
                constraintTypeField : {
                    type      : 'constrainttypepicker',
                    name      : 'constraintType',
                    label     : 'L{Constraint type}',
                    clearable : true,
                    flex      : '1 0 50%',
                    cls       : 'b-inline'
                },
                constraintDateField : {
                    type  : 'date',
                    name  : 'constraintDate',
                    label : 'L{Constraint date}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                },
                rollupField : {
                    type  : 'checkbox',
                    name  : 'rollup',
                    label : 'L{Rollup}',
                    flex  : '1 0 50%',
                    cls   : 'b-inline'
                }
            },

            items : {
                calendarField          : true,
                manuallyScheduledField : true,
                schedulingModeField    : true,
                effortDrivenField      : true,
                divider                : true,
                constraintTypeField    : true,
                constraintDateField    : true,
                rollupField            : true
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

    get effortDrivenField() {
        return this.widgetMap.effortDrivenField;
    }

    get manuallyScheduledField() {
        return this.widgetMap.manuallyScheduledField;
    }

    get rollupField() {
        return this.widgetMap.rollupField;
    }

    get schedulingModeField() {
        return this.widgetMap.schedulingModeField;
    }

    loadEvent(eventRecord) {
        const
            me        = this,
            firstLoad = !me.record;

        //<debug>
        console.assert(
            firstLoad || me.project === eventRecord.project,
            'Loading of a record from another project is not currently supported!'
        );
        //</debug>

        const { calendarField } = me;

        if (calendarField && firstLoad) {
            calendarField.store = eventRecord.project.calendarManagerStore;
        }

        super.loadEvent(eventRecord);
    }
}

// Register this widget type with its Factory
AdvancedTab.initClass();
