Ext.define("Gnt.widget.taskeditor.TaskForm", {
    extend: "Ext.form.Panel",
    alias: "widget.taskform",
    requires: ["Gnt.model.Task", "Ext.form.FieldContainer", "Ext.form.field.Text", "Ext.form.field.Date", "Gnt.field.Percent", "Gnt.field.StartDate", "Gnt.field.EndDate", "Gnt.field.Duration", "Gnt.field.SchedulingMode", "Gnt.field.Effort", "Gnt.field.ConstraintType", "Gnt.field.ConstraintDate"],
    mixins: ["Gnt.mixin.Localizable"],
    alternateClassName: ["Gnt.widget.TaskForm"],
    task: null,
    taskBuffer: null,
    taskStore: null,
    highlightTaskUpdates: true,
    showGeneral: true,
    showBaseline: true,
    editBaseline: false,
    showCalendar: false,
    showSchedulingMode: false,
    showWbsCode: false,
    showRollup: false,
    showConstraint: false,
    l10n: {
        taskNameText: "Name",
        durationText: "Duration",
        datesText: "Dates",
        baselineText: "Baseline",
        startText: "Start",
        finishText: "Finish",
        percentDoneText: "Percent Complete",
        baselineStartText: "Start",
        baselineFinishText: "Finish",
        baselinePercentDoneText: "Percent Complete",
        effortText: "Effort",
        invalidEffortText: "Invalid effort value",
        calendarText: "Calendar",
        schedulingModeText: "Scheduling Mode",
        wbsCodeText: "WBS code",
        "Constraint Type": "Constraint Type",
        "Constraint Date": "Constraint Date"
    },
    taskNameConfig: null,
    durationConfig: null,
    startConfig: null,
    finishConfig: null,
    percentDoneConfig: null,
    baselineStartConfig: null,
    baselineFinishConfig: null,
    baselinePercentDoneConfig: null,
    effortConfig: null,
    calendarConfig: null,
    schedulingModeConfig: null,
    wbsCodeConfig: null,
    rollupConfig: null,
    constraintTypeConfig: null,
    constraintDateConfig: null,
    constructor: function (b) {
        b = b || {};
        this.showBaseline = b.showBaseline;
        this.editBaseline = b.editBaseline;
        var a = b.taskStore ? b.taskStore.model.prototype : Gnt.model.Task.prototype;
        this.fieldNames = {
            baselineEndDateField: a.baselineEndDateField,
            baselinePercentDoneField: a.baselinePercentDoneField,
            baselineStartDateField: a.baselineStartDateField,
            calendarIdField: a.calendarIdField,
            clsField: a.clsField,
            draggableField: a.draggableField,
            durationField: a.durationField,
            durationUnitField: a.durationUnitField,
            effortField: a.effortField,
            effortUnitField: a.effortUnitField,
            endDateField: a.endDateField,
            manuallyScheduledField: a.manuallyScheduledField,
            nameField: a.nameField,
            percentDoneField: a.percentDoneField,
            resizableField: a.resizableField,
            rollupField: a.rollupField,
            schedulingModeField: a.schedulingModeField,
            startDateField: a.startDateField,
            noteField: a.noteField,
            constraintTypeField: a.constraintTypeField,
            constraintDateField: a.constraintDateField
        };
        Ext.apply(this, b, {border: false, layout: "anchor", defaultType: "textfield"});
        if (this.task) {
            this.fieldNames = this.getFieldNames(this.task)
        }
        if (!this.items) {
            this.buildFields()
        }
        this.callParent(arguments);
        if (this.task) {
            this.loadRecord(this.task, this.taskBuffer)
        }
    },
    getFieldNames: function (b) {
        if (!b) {
            return
        }
        var a = {};
        for (var c in this.fieldNames) {
            a[c] = b[c]
        }
        return a
    },
    renameFields: function (b) {
        var a = this.getFieldNames(b);
        if (!a) {
            return
        }
        var d = this.getForm(), f = false, e;
        for (var c in this.fieldNames) {
            e = d.findField(this.fieldNames[c]);
            if (e && a[c] && a[c] != e.name) {
                f = true;
                e.name = a[c]
            }
        }
        if (f) {
            this.fieldNames = a
        }
    },
    buildFields: function () {
        var d = this, e = this.fieldNames, c = this.task, b = this.taskStore, i = '<table class="gnt-fieldcontainer-label-wrap"><td width="1" class="gnt-fieldcontainer-label">', h = '<td><div class="gnt-fieldcontainer-separator"></div></table>';
        var g = function (f) {
            return c ? c.get(e[f]) : ""
        };
        var a = function (k, f) {
            var j = {taskStore: d.taskStore, task: d.task, highlightTaskUpdates: d.highlightTaskUpdates};
            if (!k.readOnly && d.task) {
                j.readOnly = !d.task.isEditable(k.name)
            }
            return Ext.apply(k, j, f)
        };
        this.items = this.items || [];
        if (this.showGeneral) {
            this.items.push({
                xtype: "fieldcontainer",
                layout: "hbox",
                defaults: {allowBlank: false},
                items: [a({
                    xtype: "textfield",
                    fieldLabel: this.L("taskNameText"),
                    name: e.nameField,
                    labelWidth: 110,
                    flex: 1,
                    value: g(e.nameField)
                }, this.taskNameConfig), a({
                    xtype: "durationfield",
                    fieldLabel: this.L("durationText"),
                    name: e.durationField,
                    margins: "0 0 0 6",
                    labelWidth: 90,
                    width: 170,
                    value: g(e.durationField)
                }, this.durationConfig)]
            }, a({
                xtype: "percentfield",
                fieldLabel: this.L("percentDoneText"),
                name: e.percentDoneField,
                labelWidth: 110,
                width: 200,
                allowBlank: false,
                value: g(e.percentDoneField)
            }, this.percentDoneConfig), {
                xtype: "fieldcontainer",
                fieldLabel: this.L("datesText"),
                labelAlign: "top",
                labelSeparator: "",
                beforeLabelTextTpl: i,
                afterLabelTextTpl: h,
                layout: "hbox",
                defaults: {labelWidth: 110, flex: 1, allowBlank: false},
                items: [a({
                    xtype: "startdatefield",
                    fieldLabel: this.L("startText"),
                    name: e.startDateField,
                    value: g(e.startDateField)
                }, this.startConfig), a({
                    xtype: "enddatefield",
                    fieldLabel: this.L("finishText"),
                    name: e.endDateField,
                    margins: "0 0 0 6",
                    value: g(e.endDateField)
                }, this.finishConfig)]
            }, a({
                xtype: "effortfield",
                fieldLabel: this.L("effortText"),
                name: e.effortField,
                invalidText: this.L("invalidEffortText"),
                labelWidth: 110,
                width: 200,
                margins: "0 0 0 6",
                allowBlank: true,
                value: g(e.effortField)
            }, this.effortConfig))
        }
        if (this.showBaseline) {
            this.items.push({
                xtype: "fieldcontainer",
                fieldLabel: this.L("baselineText"),
                labelAlign: "top",
                labelSeparator: "",
                beforeLabelTextTpl: i,
                afterLabelTextTpl: h,
                layout: "hbox",
                defaultType: "datefield",
                defaults: {labelWidth: 110, flex: 1, cls: "gnt-baselinefield"},
                items: [a({
                    fieldLabel: this.L("baselineStartText"),
                    name: e.baselineStartDateField,
                    value: g(e.baselineStartDateField),
                    readOnly: !this.editBaseline
                }, this.baselineStartConfig), a({
                    fieldLabel: this.L("baselineFinishText"),
                    name: e.baselineEndDateField,
                    margins: "0 0 0 6",
                    value: g(e.baselineEndDateField),
                    readOnly: !this.editBaseline
                }, this.baselineFinishConfig)]
            }, a({
                xtype: "percentfield",
                fieldLabel: this.L("baselinePercentDoneText"),
                name: e.baselinePercentDoneField,
                labelWidth: 110,
                width: 200,
                cls: "gnt-baselinefield",
                value: g(e.baselinePercentDoneField),
                readOnly: !this.editBaseline
            }, this.baselinePercentDoneConfig))
        }
        if (this.showCalendar) {
            this.items.push(a({
                xtype: "calendarfield",
                fieldLabel: this.L("calendarText"),
                name: e.calendarIdField,
                value: g(e.calendarIdField)
            }, this.calendarConfig))
        }
        if (this.showSchedulingMode) {
            this.items.push(a({
                xtype: "schedulingmodefield",
                fieldLabel: this.L("schedulingModeText"),
                name: e.schedulingModeField,
                value: g(e.schedulingModeField),
                allowBlank: false
            }, this.schedulingModeConfig))
        }
        if (this.showWbsCode) {
            this.items.push(a({
                xtype: "displayfield",
                fieldLabel: this.L("wbsCodeText"),
                name: "wbsCode",
                value: this.task && this.task.getWBSCode()
            }, this.wbsCodeConfig))
        }
        if (this.showRollup) {
            this.items.push(a({
                xtype: "checkboxfield",
                fieldLabel: this.L("rollupText"),
                name: e.rollupField,
                value: g(e.rollupField)
            }, this.rollupConfig))
        }
        if (this.showConstraint) {
            this.items.push(a({
                xtype: "constrainttypefield",
                fieldLabel: this.L("Constraint Type"),
                name: e.constraintTypeField,
                value: g(e.constraintTypeField)
            }, this.constraintTypeConfig), a({
                xtype: "constraintdatefield",
                fieldLabel: this.L("Constraint Date"),
                name: e.constraintDateField,
                value: g(e.constraintDateField)
            }, this.constraintDateConfig))
        }
    },
    setSuppressTaskUpdate: function (b) {
        var a = this.getForm().getFields();
        a.each(function (c) {
            c.setSuppressTaskUpdate && c.setSuppressTaskUpdate(b)
        })
    },
    loadRecord: function (b, a) {
        if (b && b !== this.task) {
            this.renameFields(b)
        }
        this.task = b;
        this.taskBuffer = a;
        if (!this.taskBuffer) {
            this.taskBuffer = b.copy();
            this.taskBuffer.taskStore = b.taskStore
        }
        var d = this, c = d.getForm();
        c._record = b;
        this.suspendLayouts();
        Ext.iterate(b.getData(), function (e, g) {
            var f = c.findField(e);
            if (f) {
                if (f.setTask) {
                    f.setSuppressTaskUpdate(true);
                    f.setTask(d.taskBuffer);
                    f.setSuppressTaskUpdate(false)
                } else {
                    f.setValue(g);
                    if (!f.disabled) {
                        if (f.editable === false) {
                            if (!d.taskBuffer.isEditable(f.name)) {
                                f.setReadOnly(true)
                            } else {
                                if (f.inputEl) {
                                    f.setReadOnly(false);
                                    f.inputEl.dom.readOnly = true
                                }
                            }
                        } else {
                            f.setReadOnly(!d.taskBuffer.isEditable(f.name))
                        }
                    }
                }
                f.resetOriginalValue()
            }
        });
        this.resumeLayouts(true);
        this.fireEvent("afterloadrecord", this, b)
    },
    updateRecord: function (c) {
        var e = this, d, b;
        c = c || this.task;
        var a = function () {
            e.setSuppressTaskUpdate(true);
            var f = e.getForm().getFields();
            c.beginEdit();
            f.each(function (h) {
                var g = c.fields.getByKey(h.name);
                if (h.name == e.fieldNames.constraintTypeField) {
                    d = h
                } else {
                    if (h.name == e.fieldNames.constraintDateField) {
                        b = h
                    } else {
                        if (h.applyChanges) {
                            h.applyChanges(c)
                        } else {
                            if (g && g.persist) {
                                c.set(h.name, h.getValue())
                            }
                        }
                    }
                }
            });
            c.endEdit();
            if (d && b && c.setConstraint) {
                c.setConstraint(d.getValue(), b.getValue())
            }
            e.setSuppressTaskUpdate(false);
            e.fireEvent("afterupdaterecord", e, c)
        };
        if (c && e.fireEvent("beforeupdaterecord", e, c, a) !== false) {
            a();
            return true
        }
        return false
    },
    isDataChanged: function () {
        return this.isDirty()
    }
});