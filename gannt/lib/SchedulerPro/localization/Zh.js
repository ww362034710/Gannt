import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/Zh.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        ConstraintTypePicker : {
            none                : 'None',
            muststarton         : 'Must start on',
            mustfinishon        : 'Must finish on',
            startnoearlierthan  : 'Start no earlier than',
            startnolaterthan    : 'Start no later than',
            finishnoearlierthan : 'Finish no earlier than',
            finishnolaterthan   : 'Finish no later than'
        },

        CalendarField : {
            'Default calendar' : 'Default calendar'
        },

        TaskEditorBase : {
            editorWidth : '34em',
            Information : 'Information',
            Save        : 'Save',
            Cancel      : 'Cancel',
            Delete      : 'Delete',
            saveError   : 'Can\'t save, please correct errors first'
        },

        TaskEdit : {
            'Edit task' : 'Edit task'
        },

        SchedulerTaskEditor : {
            editorWidth : '30em'
        },

        SchedulerGeneralTab : {
            labelWidth   : '6em',
            General      : 'General',
            Name         : 'Name',
            Resources    : 'Resources',
            '% complete' : '% complete',
            Duration     : 'Duration',
            Start        : 'Start',
            Finish       : 'Finish'
        },

        GeneralTab : {
            labelWidth   : '6.5em',
            General      : 'General',
            Name         : 'Name',
            '% complete' : '% complete',
            Duration     : 'Duration',
            Start        : 'Start',
            Finish       : 'Finish',
            Effort       : 'Effort',
            Dates        : 'Dates'
        },

        SchedulerAdvancedTab : {
            labelWidth           : '9.5em',
            Calendar             : 'Calendar',
            Advanced             : 'Advanced',
            'Manually scheduled' : 'Manually scheduled',
            'Constraint type'    : 'Constraint type',
            'Constraint date'    : 'Constraint date'
        },

        AdvancedTab : {
            labelWidth           : '11.5em',
            Advanced             : 'Advanced',
            Calendar             : 'Calendar',
            'Scheduling mode'    : 'Scheduling mode',
            'Effort driven'      : 'Effort driven',
            'Manually scheduled' : 'Manually scheduled',
            'Constraint type'    : 'Constraint type',
            'Constraint date'    : 'Constraint date',
            Constraint           : 'Constraint',
            Rollup               : 'Rollup'
        },

        DependencyTab : {
            Predecessors                          : 'Predecessors',
            Successors                            : 'Successors',
            ID                                    : 'ID',
            Name                                  : 'Name',
            Type                                  : 'Type',
            Lag                                   : 'Lag',
            'Cyclic dependency has been detected' : 'Cyclic dependency has been detected',
            'Invalid dependency'                  : 'Invalid dependency'
        },

        NotesTab : {
            Notes : 'Notes'
        },

        ResourcesTab : {
            unitsTpl  : ({ value }) => `${value}%`,
            Resources : 'Resources',
            Resource  : '资源',
            Units     : 'Units'
        },

        SchedulingModePicker : {
            Normal           : 'Normal',
            'Fixed Duration' : 'Fixed Duration',
            'Fixed Units'    : 'Fixed Units',
            'Fixed Effort'   : 'Fixed Effort'
        },

        ResourceHistogram : {
            barTipInRange : '<b>{resource}</b> {startDate} - {endDate}<br>{allocated} of {available} available',
            barTipOnDate  : '<b>{resource}</b> on {startDate}<br>{allocated} of {available} available'
        },

        DurationColumn : {
            Duration : 'Duration'
        }
    });

export default locale;
//</umd>

LocaleManager.registerLocale('Zh', { desc : 'Chinese', locale : locale });
