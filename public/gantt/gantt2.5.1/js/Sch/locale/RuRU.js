/*

Ext Gantt 2.5.1
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * Russia translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.RuRU', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    constructor : function (config) {

        Ext.apply(this , {
            l10n        : {
                'Sch.util.Date' : {
                    unitNames : {
                        YEAR        : { single : 'год',     plural : 'лет',         abbrev : 'г' },
                        QUARTER     : { single : 'квартал', plural : 'кварталов',   abbrev : 'квар' },
                        MONTH       : { single : 'месяц',   plural : 'месяцев',     abbrev : 'мес' },
                        WEEK        : { single : 'неделя',  plural : 'недели',      abbrev : 'нед' },
                        DAY         : { single : 'день',    plural : 'дней',        abbrev : 'д' },
                        HOUR        : { single : 'час',     plural : 'часов',       abbrev : 'ч' },
                        MINUTE      : { single : 'минута',  plural : 'минут',       abbrev : 'мин' },
                        SECOND      : { single : 'секунда',  plural : 'секунд',     abbrev : 'с' },
                        MILLI       : { single : 'миллисек',      plural : 'миллисек',      abbrev : 'мс' }
                    }
                },

                'Sch.panel.TimelineGridPanel' : {
                    loadingText : 'Загрузка, пожалуйста подождите...',
                    savingText  : 'Сохраняю данные, пожалуйста подождите...'
                },

                'Sch.panel.TimelineTreePanel' : {
                    loadingText : 'Загрузка, пожалуйста подождите...',
                    savingText  : 'Сохраняю данные, пожалуйста подождите...'
                },

                'Sch.mixin.SchedulerView' : {
                    loadingText : "Загружаем данные..."
                },

                'Sch.plugin.CurrentTimeLine' : {
                    tooltipText : 'Текущеее время'
                },

                'Sch.plugin.EventEditor' : {
                    saveText    : 'Сохранить',
                    deleteText  : 'Удалить',
                    cancelText  : 'Отмена'
                },

                'Sch.plugin.SimpleEditor' : {
                    newEventText    : 'Новое событие...'
                },

                'Sch.widget.ExportDialog' : {
                    generalError                : 'Произошла ошибка, попробуйте еще раз.',
                    title                       : 'Настройки экспорта',
                    formatFieldLabel            : 'Размер листа',
                    orientationFieldLabel       : 'Ориентация',
                    rangeFieldLabel             : 'Диапазон экспорта',
                    showHeaderLabel             : 'Добавить номера страниц',
                    orientationPortraitText     : 'Портрет',
                    orientationLandscapeText    : 'Ландшафт',
                    completeViewText            : 'Полное расписание',
                    currentViewText             : 'Текущая видимая область',
                    dateRangeText               : 'Диапазон дат',
                    dateRangeFromText           : 'Экспортировать с',
                    pickerText                  : 'Выставите желаемые размеры столбцов/строк',
                    dateRangeToText             : 'Экспортировать по',
                    exportButtonText            : 'Экспортировать',
                    cancelButtonText            : 'Отмена',
                    progressBarText             : 'Экспортирование...',
                    exportToSingleLabel         : 'Экспортировать как одну страницу',
                    adjustCols                  : 'Настройка ширины столбцов',
                    adjustColsAndRows           : 'Настройка ширины столбцов и высоты строк',
                    specifyDateRange            : 'Укажите диапазон'
                },

                // -------------- View preset date formats/strings -------------------------------------
                'Sch.preset.Manager' : {
                    hourAndDay : {
                        displayDateFormat : 'g:i A',
                        middleDateFormat : 'g A',
                        topDateFormat : 'd.m.Y'
                    },

                    secondAndMinute : {
                        displayDateFormat : 'g:i:s A',
                        topDateFormat : 'D, d H:i'
                    },

                    dayAndWeek : {
                        displayDateFormat : 'd.m h:i A',
                        middleDateFormat : 'd.m.Y'
                    },

                    weekAndDay : {
                        displayDateFormat : 'd.m',
                        bottomDateFormat : 'd M',
                        middleDateFormat : 'Y F d'
                    },

                    weekAndMonth : {
                        displayDateFormat : 'd.m.Y',
                        middleDateFormat : 'd.m',
                        topDateFormat : 'd.m.Y'
                    },

                    weekAndDayLetter : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'D d M Y'
                    },

                    weekDateAndMonth : {
                        displayDateFormat : 'd.m.Y',
                        middleDateFormat : 'd',
                        topDateFormat : 'Y F'
                    },

                    monthAndYear : {
                        displayDateFormat : 'd.m.Y',
                        middleDateFormat : 'M Y',
                        topDateFormat : 'Y'
                    },

                    year : {
                        displayDateFormat : 'd.m.Y',
                        middleDateFormat : 'Y'
                    },

                    manyYears : {
                        displayDateFormat : 'd.m.Y',
                        middleDateFormat : 'Y'
                    }
                }
            }
        });

        this.callParent(arguments);
    }
});
