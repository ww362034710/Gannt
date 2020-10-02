/*

Ext Gantt 2.5.1
Copyright(c) 2009-2014 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * Polish translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.Pl', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    constructor : function (config) {

        Ext.apply(this , {
            l10n        : {
                'Sch.util.Date' : {
                    unitNames : {
                        YEAR        : { single : 'rok',     plural : 'lata',     abbrev : 'r' },
                        QUARTER     : { single : 'kwartał', plural : 'kwartały', abbrev : 'kw' },
                        MONTH       : { single : 'miesiąc', plural : 'miesiące', abbrev : 'm' },
                        WEEK        : { single : 'tydzień', plural : 'tygodnie', abbrev : 't' },
                        DAY         : { single : 'dzień',   plural : 'dni',      abbrev : 'd' },
                        HOUR        : { single : 'godzina', plural : 'godziny',  abbrev : 'g' },
                        MINUTE      : { single : 'minuta',  plural : 'minuty',   abbrev : 'min' },
                        SECOND      : { single : 'sekunda', plural : 'sekundy',  abbrev : 's' },
                        MILLI       : { single : 'ms',      plural : 'ms',       abbrev : 'ms' }
                    }
                },

                'Sch.panel.TimelineGridPanel' : {
                    loadingText : 'Wczytywanie, proszę czekać...',
                    savingText  : 'Zapisywanie, proszę czekać...'
                },

                'Sch.panel.TimelineTreePanel' : {
                    loadingText : 'Wczytywanie, proszę czekać...',
                    savingText  : 'Zapisywanie, proszę czekać...'
                },

                'Sch.mixin.SchedulerView' : {
                    loadingText : "Wczytywanie danych..."
                },

                'Sch.plugin.CurrentTimeLine' : {
                    tooltipText : 'Obecny czas'
                },

                'Sch.plugin.EventEditor' : {
                    saveText    : 'Zapisz',
                    deleteText  : 'Usuń',
                    cancelText  : 'Anuluj'
                },

                'Sch.plugin.SimpleEditor' : {
                    newEventText    : 'Nowe zdarzenie...'
                },

                'Sch.widget.ExportDialog' : {
                    generalError                : 'Wystąpił bład, spróbuj ponownie.',
                    title                       : 'Ustawienia eksportowania',
                    formatFieldLabel            : 'Format papieru',
                    orientationFieldLabel       : 'Orientacja',
                    rangeFieldLabel             : 'Zasięg eksportu',
                    showHeaderLabel             : 'Dodaj numer strony',
                    orientationPortraitText     : 'Pionowa',
                    orientationLandscapeText    : 'Pozioma',
                    completeViewText            : 'Kompletny grafik',
                    currentViewText             : 'Obecny widok',
                    dateRangeText               : 'Zesięg dat',
                    dateRangeFromText           : 'Eksportuj od',
                    pickerText                  : 'Zmień rozmiary kolumn/rzedów',
                    dateRangeToText             : 'Eksportuj do',
                    exportButtonText            : 'Eksportuj',
                    cancelButtonText            : 'Anuluj',
                    progressBarText             : 'Eksportowanie...',
                    exportToSingleLabel         : 'Exportuj jako pojedyncza strona',
                    adjustCols                  : 'Dostosuj szerokość kolumn',
                    adjustColsAndRows           : 'Dostosuj szerokość kolumn i wysokość wierszy',
                    specifyDateRange            : 'Wybierz zakres dat'
                },

                // -------------- View preset date formats/strings -------------------------------------
                'Sch.preset.Manager' : {

                    hourAndDay : {
                        displayDateFormat : 'g:i A',
                        middleDateFormat : 'g A',
                        topDateFormat : 'd/m/Y'
                    },

                    secondAndMinute : {
                        displayDateFormat : 'g:i:s A',
                        topDateFormat : 'D, d H:i'
                    },

                    dayAndWeek : {
                        displayDateFormat : 'd/m h:i A',
                        middleDateFormat : 'd/m/Y'
                    },

                    weekAndDay : {
                        displayDateFormat : 'd/m',
                        bottomDateFormat : 'd M',
                        middleDateFormat : 'Y F d'
                    },

                    weekAndMonth : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'd/m',
                        topDateFormat : 'd/m/Y'
                    },

                    weekAndDayLetter : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'D d M Y'
                    },

                    weekDateAndMonth : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'd',
                        topDateFormat : 'Y F'
                    },

                    monthAndYear : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'M Y',
                        topDateFormat : 'Y'
                    },

                    year : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'Y'
                    },

                    manyYears : {
                        displayDateFormat : 'd/m/Y',
                        middleDateFormat : 'Y'
                    }
                }
            }
        });

        this.callParent(arguments);
    }
});
