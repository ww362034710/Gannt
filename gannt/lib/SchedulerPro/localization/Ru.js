import LocaleManager from '../../Core/localization/LocaleManager.js';
//<umd>
import parentLocale from '../../Scheduler/localization/Ru.js';
import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const
    locale = LocaleHelper.mergeLocales(parentLocale, {

        ConstraintTypePicker : {
            none                : 'Нет',
            muststarton         : 'Фиксированное начало',
            mustfinishon        : 'Фиксированное окончание',
            startnoearlierthan  : 'Начало не раньше',
            startnolaterthan    : 'Начало не позднее',
            finishnoearlierthan : 'Окончание не раньше',
            finishnolaterthan   : 'Окончание не позднее'
        },

        CalendarField : {
            'Default calendar' : 'Основной календарь'
        },

        TaskEditorBase : {
            editorWidth : '60em',
            Information : 'Информация',
            Save        : 'Сохранить',
            Cancel      : 'Отменить',
            Delete      : 'Удалить',
            saveError   : 'Сохранение невозможно, исправьте ошибки'
        },

        TaskEdit : {
            'Edit task' : 'Изменить задачу'
        },

        SchedulerTaskEditor : {
            editorWidth : '60em'
        },

        SchedulerGeneralTab : {
            labelWidth   : '9em',
            General      : 'Основные',
            Name         : 'Имя',
            Resources    : 'Ресурсы',
            '% complete' : '% выполнено',
            Duration     : 'Длительность',
            Start        : 'Начало',
            Finish       : 'Окончание'
        },

        GeneralTab : {
            labelWidth   : '9em',
            General      : 'Основные',
            Name         : 'Имя',
            '% complete' : '% выполнено',
            Duration     : 'Длительность',
            Start        : 'Начало',
            Finish       : 'Окончание',
            Effort       : 'Трудозатраты',
            Dates        : 'Даты'
        },

        SchedulerAdvancedTab : {
            labelWidth           : '10em',
            Advanced             : 'Дополнительно',
            Calendar             : 'Календарь',
            'Manually scheduled' : 'Ручное планирование',
            'Constraint type'    : 'Тип ограничения',
            'Constraint date'    : 'Дата ограничения'
        },

        AdvancedTab : {
            labelWidth           : '18em',
            Advanced             : 'Дополнительные',
            Calendar             : 'Календарь',
            'Scheduling mode'    : 'Тип планирования',
            'Effort driven'      : 'Управляемое трудозатратами',
            'Manually scheduled' : 'Ручное планирование',
            'Constraint type'    : 'Тип ограничения',
            'Constraint date'    : 'Дата ограничения',
            Constraint           : 'Ограничение',
            Rollup               : 'Сведение'
        },

        DependencyTab : {
            Predecessors                          : 'Предшественники',
            Successors                            : 'Последователи',
            ID                                    : 'Идентификатор',
            Name                                  : 'Имя',
            Type                                  : 'Тип',
            Lag                                   : 'Запаздывание',
            'Cyclic dependency has been detected' : 'Обнаружена цикличная зависимость',
            'Invalid dependency'                  : 'Неверная зависимость'
        },

        ResourcesTab : {
            unitsTpl  : ({ value }) => `${value}%`,
            Resources : 'Ресурсы',
            Resource  : 'Ресурс',
            Units     : '% Занятости'
        },

        NotesTab : {
            Notes : 'Заметки'
        },

        SchedulingModePicker : {
            Normal           : 'Нормальный',
            'Fixed Duration' : 'Фиксированная длительность',
            'Fixed Units'    : 'Фиксированные единицы',
            'Fixed Effort'   : 'Фиксированные трудозатраты'
        },

        ResourceHistogram : {
            barTipInRange : '<b>{resource}</b> {startDate} - {endDate}<br>{allocated} из {available} доступных',
            barTipOnDate  : '<b>{resource}</b> {startDate}<br>{allocated} из {available} доступных'
        },

        DurationColumn : {
            Duration : 'Длительность'
        }

    });

export default locale;
//</umd>

LocaleManager.registerLocale('Ru', { desc : 'Русский', locale : locale });
