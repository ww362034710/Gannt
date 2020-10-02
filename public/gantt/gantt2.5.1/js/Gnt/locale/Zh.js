
Ext.define("Gnt.locale.Zh", {
    extend: "Sch.locale.Locale",
    requires: "Sch.locale.En",
    singleton: true,
    constructor : function (config) {

        Ext.apply(this , {
            l10n: {
                "Gnt.util.DurationParser": {
                    unitsRegex: {
                        MILLI: /^ms$|^mil/i,
                        SECOND: /^s$|^sec/i,
                        MINUTE: /^m$|^min/i,
                        HOUR: /^h$|^hr$|^hour/i,
                        DAY: /^d$|^day/i,
                        WEEK: /^w$|^wk|^week/i,
                        MONTH: /^mo|^mnt/i,
                        QUARTER: /^q$|^quar|^qrt/i,
                        YEAR: /^y$|^yr|^year/i
                    }
                },
                "Gnt.util.DependencyParser": {
                    typeText: {
                        SS: "SS",
                        SF: "SF",
                        FS: "FS",
                        FF: "FF"
                    }
                },
                "Gnt.panel.Timeline": {
                    start: "开始",
                    end: "结束",
                    format: "m/d/Y"
                },
                "Gnt.field.ShowInTimeline": {
                    yes: "是",
                    no: "否"
                },
                "Gnt.column.ShowInTimeline": {text: "Show in timeline"},
                "Gnt.field.ConstraintType": {
                    none: "None",
                    invalidText: "Invalid value"
                },
                "Gnt.field.Duration": {invalidText: "Invalid value"},
                "Gnt.field.Effort": {invalidText: "Invalid value"},
                "Gnt.field.Percent": {invalidText: "Invalid value"},
                "Gnt.field.SchedulingMode": {
                    Normal: "Normal",
                    FixedDuration: "Fixed duration",
                    EffortDriven: "Effort driven",
                    DynamicAssignment: "Dynamic assignment",
                    invalidText: "Invalid value"
                },
                "Gnt.field.TaskState": {
                    none: '请选择'
                },
                "Gnt.template.Deadline": {deadline: "Deadline"},
                "Gnt.column.DeadlineDate": {text: "Deadline"},
                "Gnt.Tooltip": {
                    startText: "Starts: ",
                    endText: "Ends: ",
                    durationText: "Duration: "
                },
                "Gnt.template.TaskTooltip": {
                    startText: "Start",
                    endText: "End",
                    percentText: "Complete",
                    format: "m/d/Y"
                },
                "Gnt.plugin.TaskContextMenu": {
                    taskInformation: "任务详情",
                    projectInformation: "项目信息",
                    newTaskText: "新建任务",
                    deleteBatch: "删除批次任务",
                    deleteTask: "删除任务",
                    editLeftLabel: "修改左边标签",
                    editRightLabel: "修改右边标签",
                    add: "添加...",
                    deleteDependency: "删除前后置关系...",
                    addTaskAbove: "任务到上方",
                    addTaskBelow: "任务到下方",
                    addMilestone: "里程碑",
                    addSubtask: "子任务",
                    addSuccessor: "后继任务",
                    addPredecessor: "前置任务",
                    convertToMilestone: "转换成里程碑",
                    convertToRegular: "转化成普通任务",
                    splitTask: "拆分任务"
                },
                "Gnt.plugin.DependencyEditor": {
                    fromText: '从',
                    toText: '到',
                    typeText: '类型',
                    lagText: '延迟',
                    endToStartText: '结束开始',
                    startToStartText: '开始开始',
                    endToEndText: '结束结束',
                    startToEndText: '开始结束',
                    okButtonText: "确定",
                    cancelButtonText: "取消",
                    deleteButtonText: "删除"
                },
                "Gnt.widget.calendar.Calendar": {
                    dayOverrideNameHeaderText: '名称',
                    overrideName: "Name",
                    startDate: "开始日期",
                    endDate: "结束日期",
                    error: "Error",
                    dateText: '日期',
                    addText: '添加',
                    editText: '编辑',
                    removeText: '删除',
                    workingDayText: '工作日',
                    weekendsText: '周末',
                    overriddenDayText: '过载天',
                    overriddenWeekText: '过载周',
                    workingTimeText: '工作时间',
                    nonworkingTimeText: '非工作时间',
                    dayOverridesText: '过载的天',
                    weekOverridesText: '过载的周',
                    okText: '确定',
                    cancelText: '取消',
                    parentCalendarText: '父日历',
                    noParentText: '无父日历',
                    selectParentText: '请选择父日历',
                    newDayName: '[未命名]',
                    calendarNameText: '日历名称',
                    isProjectCalendarText: "Project calendar",
                    tplTexts: {
                        tplWorkingHours: '工时',
                        tplIsNonWorking: '非工作的',
                        tplOverride: '过载',
                        tplInCalendar: '在日历中',
                        tplDayInCalendar: '日历中标准天',
                        tplBasedOn: "Based on"
                    },
                    overrideErrorText: '日期已过载',
                    overrideDateError: "There is already a week override on this date: {0}",
                    startAfterEndError: "Start date should be less than end date",
                    weeksIntersectError: "Week overrides should not intersect"
                },
                "Gnt.widget.calendar.AvailabilityGrid": {
                    startText: '开始',
                    endText: '结束',
                    addText: '添加',
                    removeText: '删除',
                    error: "Error"
                },
                "Gnt.widget.calendar.DayEditor": {
                    workingTimeText: '工作时间',
                    nonworkingTimeText: '非工作时间'
                },
                "Gnt.widget.calendar.WeekEditor": {
                    defaultTimeText: '默认时间',
                    workingTimeText: '工作时间',
                    nonworkingTimeText: '非工作时间',
                    error: "Error",
                    noOverrideError: "Week override contains only 'default' days - can't save it"
                },
                "Gnt.widget.calendar.ResourceCalendarGrid": {
                    name: "Name",
                    calendar: "Calendar"
                },
                "Gnt.widget.calendar.CalendarWindow": {
                    title: "Calendar",
                    ok: "Ok",
                    cancel: "Cancel"
                },
                "Gnt.widget.calendar.CalendarManager": {
                    addText: "Add",
                    removeText: "Remove",
                    add_child: "Add child",
                    add_node: "Add calendar",
                    add_sibling: "Add sibling",
                    remove: "Remove",
                    calendarName: "Calendar",
                    confirm_action: "Confirm action",
                    confirm_message: "Calendar has unsaved changes. Would you like to save your changes?"
                },
                "Gnt.widget.calendar.CalendarManagerWindow": {
                    title: "Calendar manager",
                    ok: "Apply changes",
                    cancel: "Close",
                    confirm_action: "Confirm action",
                    confirm_message: "Calendar has unsaved changes. Would you like to save your changes?"
                },
                "Gnt.field.Assignment": {
                    cancelText: '取消',
                    closeText: '保存并关闭'
                },
                "Gnt.column.AssignmentUnits": {text: "单位"},
                "Gnt.column.Duration": {text: "工期"},
                "Gnt.column.Effort": {text: "投入"},
                "Gnt.column.EndDate": {text: "完成"},
                "Gnt.column.PercentDone": {text: "% 完成"},
                "Gnt.column.ResourceAssignment": {text: "已分配资源"},
                "Gnt.column.ResourceName": {text: "资源名称"},
                "Gnt.column.Rollup": {
                    text: "Rollup task",
                    no: "No",
                    yes: "Yes"
                },
                "Gnt.field.ManuallyScheduled": {
                    yes: "Yes",
                    no: "No"
                },
                "Gnt.field.ReadOnly": {yes: "Yes", no: "No"},
                "Gnt.column.ManuallyScheduled": {text: "Manual mode"},
                "Gnt.column.SchedulingMode": {text: "模式"},
                "Gnt.column.Predecessor": {text: "前置任务"},
                "Gnt.column.Successor": {text: "后续任务"},
                "Gnt.column.StartDate": {text: "开始"},
                "Gnt.column.WBS": {text: "WBS"},
                "Gnt.column.Sequence": {text: "#"},
                "Gnt.column.Calendar": {text: "Calendar"},
                "Gnt.column.ReadOnly": {text: "Read Only"},
                "Gnt.widget.taskeditor.ProjectForm": {
                    projectText: "Project",
                    nameText: "Name",
                    datesText: "Dates",
                    startText: "Start",
                    finishText: "Finish",
                    calendarText: "Calendar",
                    readOnlyText: "Read Only",
                    allowDependenciesText: "Allow cross-project dependencies"
                },
                "Gnt.widget.taskeditor.TaskForm": {
                    taskNameText: '名称',
                    durationText: '工期',
                    datesText: '日期',
                    baselineText: '基线',
                    startText: '开始',
                    finishText: '结束',
                    percentDoneText: '完成百分比',
                    baselineStartText: '开始',
                    baselineFinishText: '结束',
                    baselinePercentDoneText: '完成百分比',
                    effortText: '工时',
                    invalidEffortText: '错误的投入值',
                    calendarText: '日历',
                    manuallyScheduledText: "Manually Scheduled",
                    schedulingModeText: '排程模式',
                    rollupText: 'Rollup',
                    wbsCodeText: 'WBS编码',
                    "Constraint Type": "约束类型",
                    "Constraint Date": "约束日期",
                    readOnlyText: "Read Only"
                },
                "Gnt.widget.DependencyGrid": {
                    idText: "ID编号",
                    snText: "SN",
                    taskText: "任务名称",
                    blankTaskText: "请选择任务",
                    invalidDependencyText: "错误的依赖关系",
                    parentChildDependencyText: "父子节点含有依赖关系",
                    duplicatingDependencyText: "有重复的依赖关系",
                    transitiveDependencyText: "存在传递的依赖关系",
                    cyclicDependencyText: "依赖关系中存在环路",
                    typeText: "类型",
                    lagText: "延隔时间",
                    clsText: "CSS类",
                    endToStartText: "结束开始",
                    startToStartText: "开始开始",
                    endToEndText: "结束结束",
                    startToEndText: "开始结束",
                    predecessorsText: "前置任务",
                    successorsText: "后续任务"
                },
                "Gnt.widget.AssignmentEditGrid": {
                    confirmAddResourceTitle: "确认",
                    confirmAddResourceText: "未找到{0}相关资源/约束。要新建该资源/约束?",
                    noValueText: "请选择要分配的资源/约束。",
                    noResourceText: "未找到{0}相关资源/约束。"
                },
                "Gnt.widget.taskeditor.TaskEditor": {
                    generalText: "常规",
                    resourcesText: "资源",
                    addDependencyText: "添加",
                    dropDependencyText: "删除",
                    notesText: "备注",
                    advancedText: "高级",
                    addAssignmentText: "添加",
                    dropAssignmentText: "删除"
                },
                "Gnt.widget.taskeditor.ProjectEditor": {
                    generalText: "General",
                    descriptionText: "描述"
                },
                "Gnt.plugin.taskeditor.BaseEditor": {
                    title: "任务信息",
                    alertCaption: "信息",
                    alertText: "请在保存前修改相关的错误",
                    okText: "确定",
                    cancelText: "取消"
                },
                "Gnt.plugin.taskeditor.ProjectEditor": {title: "项目信息"},
                "Gnt.field.EndDate": {endBeforeStartText: "End date is before start date"},
                "Gnt.column.Note": {text: "Note"},
                "Gnt.column.AddNew": {text: "Add new column..."},
                "Gnt.column.EarlyStartDate": {text: "Early Start"},
                "Gnt.column.EarlyEndDate": {text: "Early Finish"},
                "Gnt.column.LateStartDate": {text: "Late Start"},
                "Gnt.column.LateEndDate": {text: "Late Finish"},
                "Gnt.field.Calendar": {
                    calendarNotApplicable: "Task calendar has no overlapping with assigned resources calendars",
                    invalidText: "Invalid value"
                },
                "Gnt.column.Slack": {text: "Slack"},
                "Gnt.column.Name": {text: "Task Name"},
                "Gnt.column.BaselineStartDate": {text: "Baseline Start Date"},
                "Gnt.column.BaselineEndDate": {text: "Baseline End Date"},
                "Gnt.column.Milestone": {text: "Milestone"},
                "Gnt.field.Milestone": {yes: "Yes", no: "No"},
                "Gnt.field.Dependency": {
                    invalidFormatText: "Invalid dependency format",
                    invalidDependencyText: "Invalid dependency found, please make sure you have no cyclic paths between your tasks",
                    invalidDependencyType: "Invalid dependency type {0}. Allowed values are: {1}."
                },
                "Gnt.constraint.Base": {
                    name: "A constraint",
                    "Remove the constraint": "Remove the constraint",
                    "Cancel the change and do nothing": "Cancel the change and do nothing"
                },
                "Gnt.constraint.FinishNoEarlierThan": {
                    name: "Finish no earlier than",
                    "Move the task to finish on {0}": "Move the task to finish on {0}"
                },
                "Gnt.constraint.FinishNoLaterThan": {
                    name: "Finish no later than",
                    "Move the task to finish on {0}": "Move the task to finish on {0}"
                },
                "Gnt.constraint.MustFinishOn": {
                    name: "Must finish on",
                    "Move the task to finish on {0}": "Move the task to finish on {0}"
                },
                "Gnt.constraint.MustStartOn": {
                    name: "Must start on",
                    "Move the task to start at {0}": "Move the task to start at {0}"
                },
                "Gnt.constraint.StartNoEarlierThan": {
                    name: "Start no earlier than",
                    "Move the task to start at {0}": "Move the task to start at {0}"
                },
                "Gnt.constraint.StartNoLaterThan": {
                    name: "Start no later than",
                    "Move the task to start at {0}": "Move the task to start at {0}"
                },
                "Gnt.column.ConstraintDate": {text: "Constraint date"},
                "Gnt.column.ConstraintType": {text: "Constraint"},
                "Gnt.widget.ConstraintResolutionForm": {
                    dateFormat: "m/d/Y",
                    OK: "OK",
                    Cancel: "Cancel",
                    "Resolution options": "Resolution options",
                    "Don't ask again": "Don't ask again",
                    "Task {0} violates constraint {1}": "Task \"{0}\" violates constraint {1}",
                    "Task {0} violates constraint {1} {2}": "Task \"{0}\" violates constraint {1} {2}"
                },
                "Gnt.widget.ConstraintResolutionWindow": {"Constraint violation": "Constraint violation"},
                "Gnt.panel.ResourceHistogram": {resourceText: "Resource"}
            }
        });
    }
});

Ext.Date.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
// Ext.onReady(function() {
    if (Sch.plugin) {
        if (Sch.plugin.SummaryColumn) {
            Ext.override(Sch.plugin.SummaryColumn, {
                dayText : 'd',
                hourText : 'h',
                minuteText : 'min'
            });
        }

        if (Sch.plugin.CurrentTimeLine) {
            Sch.plugin.CurrentTimeLine.prototype.tooltipText = '当前时间';
        }
    }

    var M = Sch.preset.Manager,
        vp = M.getPreset("hourAndDay");

    if (vp) {
        vp.displayDateFormat = 'g:i A';
        vp.headerConfig.middle.dateFormat = 'g A';
        vp.headerConfig.top.dateFormat = 'Y年m月d日';
    }

    vp = M.getPreset("dayAndWeek");
    if (vp) {
        vp.displayDateFormat = 'm/d h:i A';
        vp.headerConfig.middle.dateFormat = 'Y年m月d日';
        vp.headerConfig.top.renderer = function(start, end, cfg) {
            var w = start.getWeekOfYear();
            return 'w.' + ((w < 10) ? '0' : '') + w + ' ' + Sch.util.Date.getShortMonthName(start.getMonth()) + ' ' + start.getFullYear();
        };
    }

    vp = M.getPreset("weekAndDay");
    if (vp) {
        vp.displayDateFormat = 'm月d日';
        vp.headerConfig.bottom.dateFormat = 'm月d日';
        vp.headerConfig.middle.dateFormat = 'Y年m月d日';
    }

    vp = M.getPreset("weekAndDayLetter");
    if (vp) {
        vp.displayDateFormat = 'm月d日';
        vp.headerConfig.bottom.dateFormat = 'M月d日';
        vp.headerConfig.bottom.renderer = function(start, end, cfg) {
            //将星期一变为一
            return Ext.Date.dayNames[start.getDay()].substr(2, 1);
        };
        vp.headerConfig.middle.dateFormat = 'Y年m月d日';
    }

    vp = M.getPreset("weekAndMonth");
    if (vp) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.middle.dateFormat = 'm月d日';
        vp.headerConfig.middle.renderer = function(start, end, cfg) {
            cfg.align = 'left';
            return Ext.Date.format(start, 'm月d日');
        };
        vp.headerConfig.top.dateFormat = 'Y年m月d日';

    }

    vp = M.getPreset("monthAndYear");
    if (vp) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.middle.dateFormat = 'Y年m月';
        vp.headerConfig.top.dateFormat = 'Y年';
    }

    vp = M.getPreset("year");
    if (vp.year) {
        vp.displayDateFormat = 'Y年m月d日';
        vp.headerConfig.bottom.renderer = function(start, end, cfg) {
            return Ext.String.format('{0}季度', Math.floor(start.getMonth() / 3) + 1);
        };
        vp.headerConfig.middle.dateFormat = 'Y年';
    }
// });