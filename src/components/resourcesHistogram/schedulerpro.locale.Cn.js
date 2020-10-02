/*!
 *
 * Bryntum Scheduler Pro 1.0.1 (TRIAL VERSION)
 *
 * Copyright(c) 2020 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 * Vendor resources
 *
 * chronograph by Bryntum AB - https://bryntum.github.io/chronograph
 * License - http://opensource.org/licenses/MIT (MIT license)
 *
 * Later.js by Bunkat - https://bunkat.github.io/later/
 * License - http://opensource.org/licenses/MIT (MIT license)
 * 
 */
! function(e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("Cn", [], t) : "object" == typeof exports ? exports.Cn = t() : (e.bryntum = e.bryntum || {}, e.bryntum.locales = e.bryntum.locales || {}, e.bryntum.locales.Cn = t()) }(window, (function() {
    return function(e) {
        var t = {};

        function n(r) { if (t[r]) return t[r].exports; var o = t[r] = { i: r, l: !1, exports: {} }; return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports }
        return n.m = e, n.c = t, n.d = function(e, t, r) { n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r }) }, n.r = function(e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, n.t = function(e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (n.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e)
                for (var o in e) n.d(r, o, function(t) { return e[t] }.bind(null, o));
            return r
        }, n.n = function(e) { var t = e && e.__esModule ? function() { return e.default } : function() { return e }; return n.d(t, "a", t), t }, n.o = function(e, t) { return Object.prototype.hasOwnProperty.call(e, t) }, n.p = "", n(n.s = 6)
    }({
        6: function(e, t, n) {
            "use strict";
            n.r(t);
            var r = {
                    localeName: "zh-CN",
                    localeDesc: "chinese",
                    Object: { Yes: "Yes", No: "No", Cancel: "Cancel", Custom: "Custom", allday: "All day" },
                    InstancePlugin: { fnMissing: function(e) { return "Trying to chain fn ".concat(e.plugIntoName, "#").concat(e.fnName, ", but plugin fn ").concat(e.pluginName, "#").concat(e.fnName, " does not exist") }, overrideFnMissing: function(e) { return "Trying to override fn ".concat(e.plugIntoName, "#").concat(e.fnName, ", but plugin fn ").concat(e.pluginName, "#").concat(e.fnName, " does not exist") } },
                    Field: { invalidValue: "Invalid field value", minimumValueViolation: "Minimum value violation", maximumValueViolation: "Maximum value violation", fieldRequired: "This field is required", validateFilter: "Value must be selected from the list" },
                    DateField: { invalidDate: "Invalid date input" },
                    NumberFormat: { locale: "zh-CN", currency: "CN" },
                    TimeField: { invalidTime: "Invalid time input" },
                    DateHelper: {
                        locale: "zh-CN",
                        shortWeek: "W",
                        shortQuarter: "季度", //"q",
                        week: "Week",
                        weekStartDay: 0,
                        unitNames: [
                            // { single: "millisecond", plural: "ms", abbrev: "ms" },
                            { single: "毫秒", plural: "毫秒", abbrev: "毫秒" },

                            // { single: "second", plural: "seconds", abbrev: "s" },
                            { single: "秒", plural: "秒", abbrev: "秒" },

                            // { single: "minute", plural: "minutes", abbrev: "min" },
                            { single: "分", plural: "分", abbrev: "分" },


                            // { single: "hour", plural: "hours", abbrev: "h" },
                            { single: "时", plural: "时", abbrev: "时" }, //对应资源冲突单位

                            // { single: "day", plural: "days", abbrev: "d" },
                            { single: "天", plural: "天", abbrev: "天" },

                            // { single: "week", plural: "weeks", abbrev: "w" },
                            { single: "周", plural: "周", abbrev: "周" },

                            // { single: "month", plural: "months", abbrev: "mon" },
                            { single: "月", plural: "月", abbrev: "月" },

                            // { single: "quarter", plural: "quarters", abbrev: "q", },
                            { single: "季度", plural: "季度", abbrev: "季度", },


                            // { single: "year", plural: "years", abbrev: "yr" }
                            { single: "年", plural: "年", abbrev: "年" },



                        ],
                        unitAbbreviations: [
                            ["mil"],
                            ["s", "sec"],
                            ["m", "min"],
                            ["时", "时"], // ["h", "hr"],
                            ["d"],
                            ["w", "wk"],
                            ["mo", "mon", "mnt"],
                            ["季度", "季度", "季度"], //  ["q", "quar", "qrt"]
                            ["y", "yr"],
                        ],
                        // parsers: { L: "MM/DD/YYYY", LT: "HH:mm A" },
                        parsers: { L: "YYYY-mm-DD", LT: "HH:mm A" },
                        ordinalSuffix: function(e) { return e + ({ 1: "st", 2: "nd", 3: "rd" }[e[e.length - 1]] || "th") }
                    },
                    PagingToolbar: { firstPage: "Go to first page", prevPage: "Go to previous page", page: "Page", nextPage: "Go to next page", lastPage: "Go to last page", reload: "Reload current page", noRecords: "No records to display", pageCountTemplate: function(e) { return "of ".concat(e.lastPage) }, summaryTemplate: function(e) { return "Displaying records ".concat(e.start, " - ").concat(e.end, " of ").concat(e.allCount) } },
                    List: { loading: "加载中..." }
                },
                o = {
                    TemplateColumn: { noTemplate: "TemplateColumn needs a template", noFunction: "TemplateColumn.template must be a function" },
                    ColumnStore: { columnTypeNotFound: function(e) { return "Column type '".concat(e.type, "' not registered") } },
                    ColumnPicker: { columnsMenu: "Columns", hideColumn: "Hide column", hideColumnShort: "Hide" },
                    Filter: { applyFilter: "Apply filter", filter: "Filter", editFilter: "Edit filter", on: "On", before: "Before", after: "After", equals: "Equals", lessThan: "Less than", moreThan: "More than", removeFilter: "Remove filter" },
                    FilterBar: { enableFilterBar: "Show filter bar", disableFilterBar: "Hide filter bar" },
                    Group: { groupAscending: "Group ascending", groupDescending: "Group descending", groupAscendingShort: "Ascending", groupDescendingShort: "Descending", stopGrouping: "Stop grouping", stopGroupingShort: "Stop" },
                    Search: { searchForValue: "Search for value" },
                    Sort: { sortAscending: "Sort ascending", sortDescending: "Sort descending", multiSort: "Multi sort", removeSorter: "Remove sorter", addSortAscending: "Add ascending sorter", addSortDescending: "Add descending sorter", toggleSortAscending: "Change to ascending", toggleSortDescending: "Change to descending", sortAscendingShort: "Ascending", sortDescendingShort: "Descending", removeSorterShort: "Remove", addSortAscendingShort: "+ Ascending", addSortDescendingShort: "+ Descending" },
                    Tree: { noTreeColumn: "To use the tree feature one column must be configured with tree: true" },
                    Grid: { featureNotFound: function(e) { return "Feature '".concat(e, "' not available, make sure you have imported it") }, invalidFeatureNameFormat: function(e) { return "Invalid feature name '".concat(e, "', must start with a lowercase letter") }, removeRow: "Delete record", removeRows: "Delete records", moveColumnLeft: "Move to left section", moveColumnRight: "Move to right section" },
                    GridBase: {
                        loadFailedMessage: "Data loading failed!",
                        syncFailedMessage: "Data synchronization failed!",
                        serverResponseLabel: "Server response:",
                        unspecifiedFailure: "Unspecified failure",
                        networkFailure: "Network error",
                        parseFailure: "Failed to parse server response",
                        loadMask: "任务加载中...",
                        syncMask: "Saving changes, please wait...",
                        noRows: "No records to display"
                    },
                    CellMenu: { removeRow: "Delete record", removeRows: "Delete records" },
                    PdfExport: { "Waiting for response from server...": "Waiting for response from server...", "Export failed": "Export failed", "Server error": "Server error" },
                    ExportDialog: { width: "40em", labelWidth: "12em", exportSettings: "Export settings", export: "Export", exporterType: "Control pagination", cancel: "Cancel", fileFormat: "File format", rows: "Rows", alignRows: "Align rows", columns: "Columns", paperFormat: "Paper format", orientation: "Orientation" },
                    ExportRowsCombo: { all: "All rows", visible: "Visible rows" },
                    ExportOrientationCombo: { portrait: "Portrait", landscape: "Landscape" },
                    SinglePageExporter: { singlepage: "Single page" },
                    MultiPageExporter: {
                        multipage: "Multiple pages",
                        exportingPage: function(e) {
                            var t = e.currentPage,
                                n = e.totalPages;
                            return "Exporting page ".concat(t, "/").concat(n)
                        }
                    }
                };
            for (var a in r) o[a] = r[a];
            var i = o,
                l = {
                    SchedulerCommon: {},
                    ExcelExporter: { "No resource assigned": "无事件" },
                    ResourceInfoColumn: {
                        eventCountText: (e, a, b, c) => {
                            return '共' + e + "个事件" + (1 !== e ? "s" : "")
                        }
                    },
                    Dependencies: { from: "From", to: "To", valid: "Valid", invalid: "Invalid", Checking: "Checking…" },
                    DependencyEdit: { From: "From", To: "To", Type: "Type", Lag: "Lag", "Edit dependency": "Edit dependency", Save: "Save", Delete: "Delete", Cancel: "Cancel", StartToStart: "Start to Start", StartToEnd: "Start to End", EndToStart: "End to Start", EndToEnd: "End to End" },
                    EventEdit: { Name: "Name", Resource: "Resource", Start: "Start", End: "End", Save: "Save", Delete: "Delete", Cancel: "Cancel", "Edit Event": "Edit event", Repeat: "Repeat" },
                    EventDrag: { eventOverlapsExisting: "Event overlaps existing event for this resource", noDropOutsideTimeline: "Event may not be dropped completely outside the timeline" },
                    Scheduler: { "Add event": "Add event", "Delete event": "删除事件", "Unassign event": "取消事件分配" },
                    HeaderContextMenu: { pickZoomLevel: "缩放", activeDateRange: "日期", startText: "开始日期", endText: "结束日期", todayText: "今日" },
                    TimeAxisHeaderMenu: { pickZoomLevel: "缩放", activeDateRange: "日期", startText: "开始日期", endText: "结束日期", todayText: "今日" },
                    EventFilter: { filterEvents: "查找任务", byName: "名称：" },
                    TimeRanges: { showCurrentTimeLine: "Show current timeline" },
                    PresetManager: {
                        minuteAndHour: { topDateFormat: "ddd MM/DD, hA" },
                        hourAndDay: { topDateFormat: "ddd MM/DD" },
                        weekAndDay: { displayDateFormat: "hh:mm A" },
                    },
                    RecurrenceConfirmationPopup: { "delete-title": "You are deleting an event", "delete-all-message": "Do you want to delete all occurrences of this event?", "delete-further-message": "Do you want to delete this and all future occurrences of this event, or only the selected occurrence?", "delete-further-btn-text": "Delete All Future Events", "delete-only-this-btn-text": "Delete Only This Event", "update-title": "You are changing a repeating event", "update-all-message": "Do you want to change all occurrences of this event?", "update-further-message": "Do you want to change only this occurrence of the event, or this and all future occurrences?", "update-further-btn-text": "All Future Events", "update-only-this-btn-text": "Only This Event", Yes: "Yes", Cancel: "Cancel", width: 600 },
                    RecurrenceLegend: {
                        " and ": " and ",
                        Daily: "Daily",
                        "Weekly on {1}": function(e) { var t = e.days; return "Weekly on ".concat(t) },
                        "Monthly on {1}": function(e) { var t = e.days; return "Monthly on ".concat(t) },
                        "Yearly on {1} of {2}": function(e) {
                            var t = e.days,
                                n = e.months;
                            return "Yearly on ".concat(t, " of ").concat(n)
                        },
                        "Every {0} days": function(e) { var t = e.interval; return "Every ".concat(t, " days") },
                        "Every {0} weeks on {1}": function(e) {
                            var t = e.interval,
                                n = e.days;
                            return "Every ".concat(t, " weeks on ").concat(n)
                        },
                        "Every {0} months on {1}": function(e) {
                            var t = e.interval,
                                n = e.days;
                            return "Every ".concat(t, " months on ").concat(n)
                        },
                        "Every {0} years on {1} of {2}": function(e) {
                            var t = e.interval,
                                n = e.days,
                                r = e.months;
                            return "Every ".concat(t, " years on ").concat(n, " of ").concat(r)
                        },
                        position1: "the first",
                        position2: "the second",
                        position3: "the third",
                        position4: "the fourth",
                        position5: "the fifth",
                        "position-1": "the last",
                        day: "day",
                        weekday: "weekday",
                        "weekend day": "weekend day",
                        daysFormat: function(e) {
                            var t = e.position,
                                n = e.days;
                            return "".concat(t, " ").concat(n)
                        }
                    },
                    RecurrenceEditor: { "Repeat event": "Repeat event", Cancel: "Cancel", Save: "Save", Frequency: "Frequency", Every: "Every", DAILYintervalUnit: "day(s)", WEEKLYintervalUnit: "week(s) on:", MONTHLYintervalUnit: "month(s)", YEARLYintervalUnit: "year(s) in:", Each: "Each", "On the": "On the", "End repeat": "End repeat", "time(s)": "time(s)" },
                    RecurrenceDaysCombo: {
                        day: "day",
                        weekday: "weekday",
                        "weekend day": "weekend day"
                    },
                    RecurrencePositionsCombo: { position1: "first", position2: "second", position3: "third", position4: "fourth", position5: "fifth", "position-1": "last" },
                    RecurrenceStopConditionCombo: { Never: "Never", After: "After", "On date": "On date" },
                    RecurrenceFrequencyCombo: { Daily: "Daily", Weekly: "Weekly", Monthly: "Monthly", Yearly: "Yearly" },
                    RecurrenceCombo: { None: "None", "Custom...": "Custom..." },
                    ScheduleRangeCombo: { completeview: "Complete schedule", currentview: "Visible schedule", daterange: "Date range", completedata: "Complete schedule (for all events)" },
                    SchedulerExportDialog: { "Schedule range": "Schedule range", "Export from": "From", "Export to": "To" }
                };
            for (var s in i) l[s] = i[s];
            var d = l,
                c = {
                    SchedulerProCommon: { SS: "SS", SF: "SF", FS: "FS", FF: "FF", StartToStart: "Start-to-Start", StartToEnd: "Start-to-End", EndToStart: "End-to-Start", EndToEnd: "End-to-End", dependencyTypes: ["SS", "SF", "FS", "FF"], dependencyTypesLong: ["Start-to-Start", "Start-to-End", "End-to-Start", "End-to-End"] },
                    ConstraintTypePicker: { muststarton: "Must start on", mustfinishon: "Must finish on", startnoearlierthan: "Start no earlier than", startnolaterthan: "Start no later than", finishnoearlierthan: "Finish no earlier than", finishnolaterthan: "Finish no later than" },
                    TaskEditorBase: { editorWidth: "34em", Information: "Information", Save: "Save", Cancel: "Cancel", Delete: "Delete" },
                    SchedulerTaskEditor: { editorWidth: "30em" },
                    SchedulerGeneralTab: { labelWidth: "6em", General: "General", Name: "Name", Resources: "Resources", "% complete": "% complete", Duration: "Duration", Start: "Start", Finish: "Finish" },
                    GeneralTab: { labelWidth: "6.5em", General: "General", Name: "Name", "% complete": "% complete", Duration: "Duration", Start: "Start", Finish: "Finish", Effort: "Effort", Dates: "Dates" },
                    SchedulerAdvancedTab: { labelWidth: "9.5em", Calendar: "Calendar", Advanced: "Advanced", "Manually scheduled": "Manually scheduled", "Constraint type": "Constraint type", "Constraint date": "Constraint date" },
                    AdvancedTab: { labelWidth: "11.5em", Advanced: "Advanced", Calendar: "Calendar", "Scheduling mode": "Scheduling mode", "Effort driven": "Effort driven", "Manually scheduled": "Manually scheduled", "Constraint type": "Constraint type", "Constraint date": "Constraint date", Constraint: "Constraint", Rollup: "Rollup" },
                    DependencyTab: { Predecessors: "Predecessors", Successors: "Successors", ID: "ID", Name: "Name", Type: "Type", Lag: "Lag", "Cyclic dependency has been detected": "Cyclic dependency has been detected" },
                    NotesTab: { Notes: "Notes" },
                    ResourcesTab: { unitsTpl: function(e) { var t = e.value; return "".concat(t, "%") }, Resources: "Resources", Resource: "Resource", Units: "Units" },
                    SchedulingModePicker: { Normal: "Normal", "Fixed Duration": "Fixed Duration", "Fixed Units": "Fixed Units", "Fixed Effort": "Fixed Effort" },
                    //资源冲突tip
                    ResourceHistogram: {
                        barTipInRange: "<b>{resource}</b> {startDate} - {endDate}<br>{allocated} of {available} available",
                        barTipOnDate: "<b>{resource}</b> 在 {startDate}<br> {allocated} 至 {available} available"
                    }
                };
            for (var u in d) c[u] = d[u];
            t.default = c
        }
    }).default
}));