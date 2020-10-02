import FormTab from './FormTab.js';
import '../../widget/StartDateField.js';
import '../../widget/EndDateField.js';
import '../../widget/EffortField.js';
import '../../../Core/widget/NumberField.js';

/**
 * @module SchedulerPro/widget/taskeditor/GeneralTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or
 * {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the general information for a task.
 *
 * @extends SchedulerPro/widget/taskeditor/FormTab
 * @classtype generaltab
 * @internal
 */
export default class GeneralTab extends FormTab {
    static get $name() {
        return 'GeneralTab';
    }

    // Factoryable type name
    static get type() {
        return 'generaltab';
    }

    static get defaultConfig() {
        return {
            title : 'L{General}',
            cls   : 'b-general-tab',

            defaults : {
                localeClass : this,
                labelWidth  : this.L('labelWidth')
            },

            namedItems : {
                name : {
                    type      : 'text',
                    required  : true,
                    label     : 'L{Name}',
                    clearable : true,
                    name      : 'name',
                    cls       : 'b-name'
                },
                percentDone : {
                    type  : 'number',
                    label : 'L{% complete}',
                    name  : 'renderedPercentDone',
                    cls   : 'b-percent-done b-inline',
                    flex  : '1 0 50%',
                    min   : 0,
                    max   : 100
                },
                effort : {
                    type  : 'effort',
                    label : 'L{Effort}',
                    name  : 'fullEffort',
                    flex  : '1 0 50%'
                },
                divider : {
                    html    : '',
                    dataset : {
                        text : this.L('L{Dates}')
                    },
                    cls  : 'b-divider',
                    flex : '1 0 100%'
                },
                startDate : {
                    type  : 'startdate',
                    label : 'L{Start}',
                    name  : 'startDate',
                    cls   : 'b-start-date b-inline',
                    flex  : '1 0 50%'
                },
                endDate : {
                    type  : 'enddate',
                    label : 'L{Finish}',
                    name  : 'endDate',
                    cls   : 'b-end-date',
                    flex  : '1 0 50%'
                },
                duration : {
                    type  : 'durationfield',
                    label : 'L{Duration}',
                    name  : 'fullDuration',
                    flex  : '.5 0',
                    cls   : 'b-inline'
                }
            },

            items : {
                name        : true,
                percentDone : true,
                effort      : true,
                divider     : true,
                startDate   : true,
                endDate     : true,
                duration    : true
            }
        };
    }

    loadEvent(record) {
        const
            step = {
                unit      : record.durationUnit,
                magnitude : 1
            },
            { isParent } = record,
            {
                duration,
                percentDone,
                startDate,
                endDate,
                effort
            } = this.widgetMap;

        // Editing duration, percentDone & endDate disallowed for parent tasks
        if (duration) {
            duration.disabled = isParent;
        }

        if (percentDone) {
            percentDone.disabled = isParent;
        }

        if (startDate) {
            startDate.step = step;
        }

        if (endDate) {
            endDate.step = step;
            endDate.disabled = isParent;
        }

        if (effort) {
            effort.unit = record.effortUnit;
            effort.disabled = isParent;
        }

        super.loadEvent(record);
    }
}

// Register this widget type with its Factory
GeneralTab.initClass();
