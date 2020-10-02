/*

 This file belongs to the trial scheduler distribution,
 included in Gantt, to demonstrate the combined Gantt+Scheduler
 usage. Do not include it on your page if you need only Gantt
 functionality.

 Ext Scheduler 2.5.1

 Copyright(c) 2009-2014 Bryntum AB
 http://bryntum.com/contact
 http://bryntum.com/license

 */
Ext.define("Sch.locale.Locale", {l10n: null, legacyMode: true, localeName: null, namespaceId: null, constructor: function () {
    if (!Sch.locale.Active) {
        Sch.locale.Active = {};
        this.bindRequire()
    }
    var b = this.self.getName().split(".");
    var a = this.localeName = b.pop();
    this.namespaceId = b.join(".");
    var c = Sch.locale.Active[this.namespaceId];
    if (!(a == "En" && c && c.localeName != "En")) {
        this.apply()
    }
}, bindRequire: function () {
    var a = Ext.ClassManager.triggerCreated;
    Ext.ClassManager.triggerCreated = function (d) {
        a.apply(this, arguments);
        var c = Ext.ClassManager.get(d);
        for (var b in Sch.locale.Active) {
            Sch.locale.Active[b].apply(c)
        }
    }
}, apply: function (a) {
    if (this.l10n) {
        var h = this, f, e;
        var g = this.self.getName();
        var d = function (l, k) {
            k = k || Ext.ClassManager.get(l);
            if (k && (k.activeLocaleId !== g)) {
                var i = h.l10n[l];
                if (typeof i === "function") {
                    i(l)
                } else {
                    if (k.singleton) {
                        k.l10n = Ext.apply({}, i, k.prototype && k.prototype.l10n)
                    } else {
                        Ext.override(k, {l10n: i})
                    }
                }
                if (h.legacyMode) {
                    var n;
                    if (k.prototype) {
                        n = k.prototype
                    } else {
                        if (k.singleton) {
                            n = k
                        }
                    }
                    if (n && n.legacyMode) {
                        if (n.legacyHolderProp) {
                            if (!n[n.legacyHolderProp]) {
                                n[n.legacyHolderProp] = {}
                            }
                            n = n[n.legacyHolderProp]
                        }
                        for (var m in i) {
                            if (typeof n[m] !== "function") {
                                n[m] = i[m]
                            }
                        }
                    }
                }
                k.activeLocaleId = g;
                if (k.onLocalized) {
                    k.onLocalized()
                }
            }
        };
        if (a) {
            if (!Ext.isArray(a)) {
                a = [a]
            }
            var b, j;
            for (f = 0, e = a.length; f < e; f++) {
                if (Ext.isObject(a[f])) {
                    if (a[f].singleton) {
                        j = a[f];
                        b = Ext.getClassName(Ext.getClass(j))
                    } else {
                        j = Ext.getClass(a[f]);
                        b = Ext.getClassName(j)
                    }
                } else {
                    j = null;
                    b = "string" === typeof a[f] ? a[f] : Ext.getClassName(a[f])
                }
                if (b && b in this.l10n) {
                    d(b, j)
                }
            }
        } else {
            Sch.locale.Active[this.namespaceId] = this;
            for (var c in this.l10n) {
                d(c)
            }
        }
    }
}});
Ext.define("Sch.locale.En", {extend: "Sch.locale.Locale", singleton: true, constructor: function (a) {
    Ext.apply(this, {l10n: {"Sch.util.Date": {unitNames: {YEAR: {single: "year", plural: "years", abbrev: "yr"}, QUARTER: {single: "quarter", plural: "quarters", abbrev: "q"}, MONTH: {single: "month", plural: "months", abbrev: "mon"}, WEEK: {single: "week", plural: "weeks", abbrev: "w"}, DAY: {single: "day", plural: "days", abbrev: "d"}, HOUR: {single: "hour", plural: "hours", abbrev: "h"}, MINUTE: {single: "minute", plural: "minutes", abbrev: "min"}, SECOND: {single: "second", plural: "seconds", abbrev: "s"}, MILLI: {single: "ms", plural: "ms", abbrev: "ms"}}}, "Sch.panel.TimelineGridPanel": {loadingText: "Loading, please wait...", savingText: "Saving changes, please wait..."}, "Sch.panel.TimelineTreePanel": {loadingText: "Loading, please wait...", savingText: "Saving changes, please wait..."}, "Sch.mixin.SchedulerView": {loadingText: "Loading events..."}, "Sch.plugin.CurrentTimeLine": {tooltipText: "Current time"}, "Sch.plugin.EventEditor": {saveText: "Save", deleteText: "Delete", cancelText: "Cancel"}, "Sch.plugin.SimpleEditor": {newEventText: "New booking..."}, "Sch.widget.ExportDialog": {generalError: "An error occured, try again.", title: "Export Settings", formatFieldLabel: "Paper format", orientationFieldLabel: "Orientation", rangeFieldLabel: "Export range", showHeaderLabel: "Add page number", orientationPortraitText: "Portrait", orientationLandscapeText: "Landscape", completeViewText: "Complete schedule", currentViewText: "Current view", dateRangeText: "Date range", dateRangeFromText: "Export from", pickerText: "Resize column/rows to desired value", dateRangeToText: "Export to", exportButtonText: "Export", cancelButtonText: "Cancel", progressBarText: "Exporting...", exportToSingleLabel: "Export as single page", adjustCols: "Adjust column width", adjustColsAndRows: "Adjust column width and row height", specifyDateRange: "Specify date range"}, "Sch.preset.Manager": {hourAndDay: {displayDateFormat: "G:i", middleDateFormat: "G:i", topDateFormat: "D d/m"}, secondAndMinute: {displayDateFormat: "g:i:s", topDateFormat: "D, d g:iA"}, dayAndWeek: {displayDateFormat: "m/d h:i A", middleDateFormat: "D d M"}, weekAndDay: {displayDateFormat: "m/d", bottomDateFormat: "d M", middleDateFormat: "Y F d"}, weekAndMonth: {displayDateFormat: "m/d/Y", middleDateFormat: "m/d", topDateFormat: "m/d/Y"}, weekAndDayLetter: {displayDateFormat: "m/d/Y", middleDateFormat: "D d M Y"}, weekDateAndMonth: {displayDateFormat: "m/d/Y", middleDateFormat: "d", topDateFormat: "Y F"}, monthAndYear: {displayDateFormat: "m/d/Y", middleDateFormat: "M Y", topDateFormat: "Y"}, year: {displayDateFormat: "m/d/Y", middleDateFormat: "Y"}, manyYears: {displayDateFormat: "m/d/Y", middleDateFormat: "Y"}}}});
    this.callParent(arguments)
}});
Ext.define("Sch.util.Patch", {target: null, minVersion: null, maxVersion: null, reportUrl: null, description: null, applyFn: null, ieOnly: false, overrides: null, onClassExtended: function (a, b) {
    if (Sch.disableOverrides) {
        return
    }
    if (b.ieOnly && !Ext.isIE) {
        return
    }
    if ((!b.minVersion || Ext.versions.extjs.equals(b.minVersion) || Ext.versions.extjs.isGreaterThan(b.minVersion)) && (!b.maxVersion || Ext.versions.extjs.equals(b.maxVersion) || Ext.versions.extjs.isLessThan(b.maxVersion))) {
        if (b.applyFn) {
            b.applyFn()
        } else {
            Ext.ClassManager.get(b.target).override(b.overrides)
        }
    }
}});
Ext.define("Sch.patches.ColumnResize", {override: "Sch.panel.TimelineGridPanel", afterRender: function () {
    this.callParent(arguments);
    var a = this.lockedGrid.headerCt.findPlugin("gridheaderresizer");
    if (a) {
        a.getConstrainRegion = function () {
            var d = this, b = d.dragHd.el, c;
            if (d.headerCt.forceFit) {
                c = d.dragHd.nextNode("gridcolumn:not([hidden]):not([isGroupHeader])");
                if (!d.headerInSameGrid(c)) {
                    c = null
                }
            }
            return d.adjustConstrainRegion(Ext.util.Region.getRegion(b), 0, d.headerCt.forceFit ? (c ? c.getWidth() - d.minColWidth : 0) : d.maxColWidth - b.getWidth(), 0, d.minColWidth)
        }
    }
}});
Ext.define("Sch.patches.ColumnResizeTree", {override: "Sch.panel.TimelineTreePanel", afterRender: function () {
    this.callParent(arguments);
    var a = this.lockedGrid.headerCt.findPlugin("gridheaderresizer");
    if (a) {
        a.getConstrainRegion = function () {
            var d = this, b = d.dragHd.el, c;
            if (d.headerCt.forceFit) {
                c = d.dragHd.nextNode("gridcolumn:not([hidden]):not([isGroupHeader])");
                if (!d.headerInSameGrid(c)) {
                    c = null
                }
            }
            return d.adjustConstrainRegion(Ext.util.Region.getRegion(b), 0, d.headerCt.forceFit ? (c ? c.getWidth() - d.minColWidth : 0) : d.maxColWidth - b.getWidth(), 0, d.minColWidth)
        }
    }
}});
if (!Ext.ClassManager.get("Sch.patches.ElementScroll")) {
    Ext.define("Sch.patches.ElementScroll", {override: "Sch.mixin.TimelineView", _onAfterRender: function () {
        this.callParent(arguments);
        if (Ext.versions.extjs.isLessThan("4.2.1") || Ext.versions.extjs.isGreaterThan("4.2.2")) {
            return
        }
        this.el.scroll = function (i, a, c) {
            if (!this.isScrollable()) {
                return false
            }
            i = i.substr(0, 1);
            var h = this, e = h.dom, g = i === "r" || i === "l" ? "left" : "top", b = false, d, f;
            if (i === "r" || i === "t" || i === "u") {
                a = -a
            }
            if (g === "left") {
                d = e.scrollLeft;
                f = h.constrainScrollLeft(d + a)
            } else {
                d = e.scrollTop;
                f = h.constrainScrollTop(d + a)
            }
            if (f !== d) {
                this.scrollTo(g, f, c);
                b = true
            }
            return b
        }
    }})
}
Ext.define("Sch.mixin.Localizable", {requires: ["Sch.locale.En"], legacyMode: true, activeLocaleId: "", l10n: null, isLocaleApplied: function () {
    var b = (this.singleton && this.activeLocaleId) || this.self.activeLocaleId;
    if (!b) {
        return false
    }
    for (var a in Sch.locale.Active) {
        if (b === Sch.locale.Active[a].self.getName()) {
            return true
        }
    }
    return false
}, applyLocale: function () {
    for (var a in Sch.locale.Active) {
        Sch.locale.Active[a].apply(this.singleton ? this : this.self.getName())
    }
}, L: function () {
    return this.localize.apply(this, arguments)
}, localize: function (b, d, g) {
    if (!this.isLocaleApplied() && !g) {
        this.applyLocale()
    }
    if (this.hasOwnProperty("l10n") && this.l10n.hasOwnProperty(b) && "function" != typeof this.l10n[b]) {
        return this.l10n[b]
    }
    var c = this.self && this.self.prototype;
    if (this.legacyMode) {
        var a = d || this.legacyHolderProp;
        var h = a ? this[a] : this;
        if (h && h.hasOwnProperty(b) && "function" != typeof h[b]) {
            return h[b]
        }
        if (c) {
            var e = a ? c[a] : c;
            if (e && e.hasOwnProperty(b) && "function" != typeof e[b]) {
                return e[b]
            }
        }
    }
    var i = c.l10n && c.l10n[b];
    if (i === null || i === undefined) {
        var f = c && c.superclass;
        if (f && f.localize) {
            i = f.localize(b, d, g)
        }
        if (i === null || i === undefined) {
            throw"Cannot find locale: " + b + " [" + this.self.getName() + "]"
        }
    }
    return i
}});
Ext.define("Sch.tooltip.ClockTemplate", {extend: "Ext.XTemplate", constructor: function () {
    var i = Math.PI / 180, l = Math.cos, j = Math.sin, m = 7, c = 2, d = 10, k = 6, f = 3, a = 10, e = Ext.isIE && (Ext.isIE8m || Ext.isIEQuirks);

    function b(n) {
        var q = n * i, o = l(q), t = j(q), r = k * j((90 - n) * i), s = k * l((90 - n) * i), u = Math.min(k, k - r), p = n > 180 ? s : 0, v = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + o + ", M12 = " + (-t) + ", M21 = " + t + ", M22 = " + o + ")";
        return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", v, u + f, p + a)
    }

    function h(n) {
        var q = n * i, o = l(q), t = j(q), r = m * j((90 - n) * i), s = m * l((90 - n) * i), u = Math.min(m, m - r), p = n > 180 ? s : 0, v = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + o + ", M12 = " + (-t) + ", M21 = " + t + ", M22 = " + o + ")";
        return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", v, u + c, p + d)
    }

    function g(n) {
        return Ext.String.format("transform:rotate({0}deg);-ms-transform:rotate({0}deg);-moz-transform: rotate({0}deg);-webkit-transform: rotate({0}deg);-o-transform:rotate({0}deg);", n)
    }

    this.callParent(['<div class="sch-clockwrap {cls}"><div class="sch-clock"><div class="sch-hourIndicator" style="{[this.getHourStyle((values.date.getHours()%12) * 30)]}">{[Ext.Date.monthNames[values.date.getMonth()].substr(0,3)]}</div><div class="sch-minuteIndicator" style="{[this.getMinuteStyle(values.date.getMinutes() * 6)]}">{[values.date.getDate()]}</div></div><span class="sch-clock-text">{text}</span></div>', {compiled: true, disableFormats: true, getMinuteStyle: e ? h : g, getHourStyle: e ? b : g}])
}});
Ext.define("Sch.tooltip.Tooltip", {extend: "Ext.tip.ToolTip", requires: ["Sch.tooltip.ClockTemplate"], autoHide: false, anchor: "b", padding: "0 3 0 0", showDelay: 0, hideDelay: 0, quickShowInterval: 0, dismissDelay: 0, trackMouse: false, valid: true, anchorOffset: 5, shadow: false, frame: false, constructor: function (b) {
    var a = new Sch.tooltip.ClockTemplate();
    this.renderTo = document.body;
    this.startDate = this.endDate = new Date();
    if (!this.template) {
        this.template = Ext.create("Ext.XTemplate", '<div class="{[values.valid ? "sch-tip-ok" : "sch-tip-notok"]}">', '{[this.renderClock(values.startDate, values.startText, "sch-tooltip-startdate")]}', '{[this.renderClock(values.endDate, values.endText, "sch-tooltip-enddate")]}', "</div>", {compiled: true, disableFormats: true, renderClock: function (d, e, c) {
            return a.apply({date: d, text: e, cls: c})
        }})
    }
    this.callParent(arguments)
}, update: function (a, e, d, f) {
    if (this.startDate - a !== 0 || this.endDate - e !== 0 || this.valid !== d || f) {
        this.startDate = a;
        this.endDate = e;
        this.valid = d;
        var c = this.schedulerView.getFormattedDate(a), b = this.schedulerView.getFormattedEndDate(e, a);
        if (this.mode === "calendar" && e.getHours() === 0 && e.getMinutes() === 0 && !(e.getYear() === a.getYear() && e.getMonth() === a.getMonth() && e.getDate() === a.getDate())) {
            e = Sch.util.Date.add(e, Sch.util.Date.DAY, -1)
        }
        this.callParent([this.template.apply({valid: d, startDate: a, endDate: e, startText: c, endText: b})])
    }
}, show: function (b, a) {
    if (!b) {
        return
    }
    a = a || 18;
    if (Sch.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Sch.util.Date.DAY) >= 0) {
        this.mode = "calendar";
        this.addCls("sch-day-resolution")
    } else {
        this.mode = "clock";
        this.removeCls("sch-day-resolution")
    }
    this.mouseOffsets = [a - 18, -7];
    this.setTarget(b);
    this.callParent();
    this.alignTo(b, "bl-tl", this.mouseOffsets);
    this.mon(Ext.getDoc(), "mousemove", this.onMyMouseMove, this);
    this.mon(Ext.getDoc(), "mouseup", this.onMyMouseUp, this, {single: true})
}, onMyMouseMove: function () {
    this.el.alignTo(this.target, "bl-tl", this.mouseOffsets)
}, onMyMouseUp: function () {
    this.mun(Ext.getDoc(), "mousemove", this.onMyMouseMove, this)
}, afterRender: function () {
    this.callParent(arguments);
    this.el.on("mouseenter", this.onElMouseEnter, this)
}, onElMouseEnter: function () {
    this.alignTo(this.target, "bl-tl", this.mouseOffsets)
}});
Ext.define("Sch.crud.AbstractManager", {mixins: {observable: "Ext.util.Observable"}, revision: null, stores: null, storesIndex: null, activeRequests: null, delayedSyncs: null, transport: null, phantomIdField: "$PhantomId", autoLoad: false, autoSyncTimerId: null, autoSyncTimeout: 100, autoSync: false, syncApplySequence: null, ignoreUpdates: 0, createMissingRecords: false, constructor: function (a) {
    a = a || {};
    this.addEvents("beforeload", "loadcanceled", "load", "loadfail", "beforeloadapply", "nochanges", "haschanges", "beforesync", "synccanceled", "sync", "syncfail", "beforesyncapply", "syncdelayed");
    this.mixins.observable.constructor.call(this, a);
    this.activeRequests = {};
    this.delayedSyncs = [];
    this.transport = this.transport || {};
    delete this.stores;
    this.stores = [];
    this.addStore(a.stores);
    if (a.syncApplySequence) {
        this.syncApplySequence = null;
        this.addStoreToApplySequence(a.syncApplySequence)
    }
    if (this.autoLoad) {
        this.load()
    }
}, updateStoreIndex: function () {
    var b = {};
    var c;
    for (var d = 0, a = this.stores.length; d < a; d++) {
        c = this.stores[d];
        if (c.storeId) {
            b[c.storeId] = this.stores[d]
        }
    }
    this.storesIndex = b
}, getStore: function (b) {
    if (!b) {
        return
    }
    if (b instanceof Ext.data.AbstractStore) {
        for (var c = 0, a = this.stores.length; c < a; c++) {
            if (this.stores[c].store === b) {
                return this.stores[c]
            }
        }
    }
    return this.storesIndex[b]
}, addStore: function (m, h, a) {
    if (!m) {
        return
    }
    if (!Ext.isArray(m)) {
        m = [m]
    }
    var o, e = [], g;
    for (var f = 0, c = m.length; f < c; f++) {
        o = m[f];
        if (o instanceof Ext.data.AbstractStore) {
            g = o.getModel && o.getModel() || o.model;
            g = g && g.prototype;
            o = {store: o, storeId: o.storeId, phantomIdField: g && g.phantomIdField}
        } else {
            o.storeId = o.storeId || o.store.storeId;
            g = o.store.getModel && o.store.getModel() || o.store.model;
            g = g && g.prototype;
            if (o.stores) {
                if (!Ext.isArray(o.stores)) {
                    o.stores = [o.stores]
                }
                for (var d = 0, b = o.stores.length; d < b; d++) {
                    if ("string" === typeof o.stores[d]) {
                        o.stores[d] = {storeId: o.stores[d]}
                    }
                }
            }
        }
        if (!o.idProperty) {
            o.idProperty = g && g.idProperty
        }
        e.push(o);
        o.store.crudManager = this;
        this.mon(o.store, {add: this.onStoreChange, append: this.onStoreChange, insert: this.onStoreChange, update: this.onStoreChange, remove: this.onStoreChange, clear: this.onStoreChange, scope: this})
    }
    if (typeof h === "undefined") {
        this.stores.push.apply(this.stores, e)
    } else {
        var k = h;
        if (a) {
            k += Ext.Array.indexOf(this.stores, a)
        }
        this.stores.splice.apply(this.stores, [].concat([k, 0], e))
    }
    this.updateStoreIndex()
}, removeStore: function (b) {
    for (var c = 0, a = this.stores.length; c < a; c++) {
        var d = this.stores[c];
        if (d === b || d.store === b || d.storeId === b) {
            this.mun(d.store, {add: this.onStoreChange, append: this.onStoreChange, insert: this.onStoreChange, update: this.onStoreChange, remove: this.onStoreChange, clear: this.onStoreChange, scope: this});
            delete this.storesIndex[d.storeId];
            this.stores.splice(c, 1);
            if (this.syncApplySequence) {
                this.removeStoreFromApplySequence(b)
            }
            break
        }
    }
}, addStoreToApplySequence: function (g, e, a) {
    if (!g) {
        return
    }
    if (!Ext.isArray(g)) {
        g = [g]
    }
    var c = [];
    for (var d = 0, b = g.length; d < b; d++) {
        var h = g[d];
        if ("object" == typeof h) {
            h = h.storeId || h.store.storeId
        }
        var j = this.getStore(h);
        if (j) {
            c.push(j)
        }
    }
    if (!this.syncApplySequence) {
        this.syncApplySequence = []
    }
    if (typeof e === "undefined") {
        this.syncApplySequence.push.apply(this.syncApplySequence, c)
    } else {
        var f = e;
        if (a) {
            f += Ext.Array.indexOf(this.syncApplySequence, a)
        }
        this.syncApplySequence.splice.apply(this.syncApplySequence, [].concat([f, 0], c))
    }
}, removeStoreFromApplySequence: function (b) {
    for (var c = 0, a = this.syncApplySequence.length; c < a; c++) {
        var d = this.syncApplySequence[c];
        if (d === b || d.store === b || d.storeId === b) {
            this.syncApplySequence.splice(c, 1);
            break
        }
    }
}, onStoreChange: function () {
    if (this.ignoreUpdates) {
        return
    }
    var a = this;
    this.fireEvent("haschanges", this);
    if (this.autoSync) {
        if (!this.autoSyncTimerId) {
            this.autoSyncTimerId = setTimeout(function () {
                a.autoSyncTimerId = null;
                a.sync()
            }, this.autoSyncTimeout)
        }
    }
}, hasChanges: function (b) {
    var c;
    if (b) {
        c = this.getStore(b);
        if (!c) {
            return
        }
        return Boolean(c.store.getModifiedRecords() || c.store.getRemovedRecords())
    }
    for (var d = 0, a = this.stores.length; d < a; d++) {
        c = this.stores[d].store;
        if (c.getModifiedRecords() || c.getRemovedRecords()) {
            return true
        }
    }
    return false
}, getLoadPackage: function (k) {
    var g = {type: "load", requestId: this.getRequestId(), stores: []};
    var j = this.stores, b = g.stores;
    for (var e = 0, c = j.length; e < c; e++) {
        var h = j[e], a = k && k[h.storeId], f = h.pageSize || h.store.pageSize;
        if (a || f) {
            var d = Ext.apply({storeId: h.storeId, page: 1, pageSize: f}, a);
            j[e].currentPage = d.page;
            b.push(d)
        } else {
            b.push(h.storeId)
        }
    }
    return g
}, prepareAdded: function (h, m, k) {
    var o = [];
    for (var c = 0, a = h.length; c < a; c++) {
        var d = h[c], b = {}, e = d.fields.items;
        if (!b.hasOwnProperty(m)) {
            b[m] = d.internalId
        }
        for (var g = 0, n = e.length; g < n; g++) {
            var j = e[g];
            if (j.persist && d.data.hasOwnProperty(j.name)) {
                if (j.serialize) {
                    b[j.name] = j.serialize(d.data[j.name], d)
                } else {
                    b[j.name] = d.data[j.name]
                }
            }
        }
        if (k) {
            this.processSubStores(d, b, k)
        }
        o.push(b)
    }
    return o
}, prepareUpdated: function (j, m) {
    var n = [], b, e;
    for (var c = 0, a = j.length; c < a; c++) {
        e = j[c];
        b = e.getChanges();
        b[e.idProperty] = e.getId();
        var d = e.fields.getByKey("parentId");
        if (d && d.persist && !b.hasOwnProperty("parentId")) {
            b.parentId = e.data.parentId
        }
        var h = e.fields.getByKey("index");
        if (h && h.persist && !b.hasOwnProperty("index")) {
            b.index = e.data.index
        }
        for (var g in b) {
            var k = e.fields.get(g);
            if (!k.persist) {
                delete b[g]
            } else {
                if (k.serialize) {
                    b[g] = k.serialize(b[g], e)
                }
            }
        }
        if (m) {
            this.processSubStores(e, b, m)
        }
        n.push(b)
    }
    return n
}, prepareRemoved: function (e) {
    var a = [], d;
    for (var c = 0, b = e.length; c < b; c++) {
        d = {};
        d[e[c].idProperty] = e[c].getId();
        a.push(d)
    }
    return a
}, processSubStores: function (b, f, a) {
    for (var d = 0, h = a.length; d < h; d++) {
        var g = a[d].storeId, c = b.get(g);
        if (c) {
            var e = this.getStoreChanges(Ext.apply({store: c}, a[d]));
            if (e) {
                f[g] = Ext.apply(e, {$store: true})
            } else {
                delete f[g]
            }
        } else {
            delete f[g]
        }
    }
}, getStoreChanges: function (d, g) {
    g = g || d.phantomIdField || this.phantomIdField;
    var f = d.store, e = f.getNewRecords(), c = f.getUpdatedRecords(), h = f.getRemovedRecords(), b = d.stores;
    var a;
    if (e.length) {
        e = this.prepareAdded(e, g, b)
    }
    if (c.length) {
        c = this.prepareUpdated(c, b)
    }
    if (h.length) {
        h = this.prepareRemoved(h)
    }
    if (e.length || c.length || h.length) {
        a = {};
        if (e.length) {
            a.added = e
        }
        if (c.length) {
            a.updated = c
        }
        if (h.length) {
            a.removed = h
        }
    }
    return a
}, getChangeSetPackage: function () {
    var d = {type: "sync", requestId: this.getRequestId(), revision: this.revision};
    var f = this.stores, j = 0;
    for (var b = 0, a = f.length; b < a; b++) {
        var e = f[b], g = e.phantomIdField || this.phantomIdField, h = e.storeId;
        var c = this.getStoreChanges(e, g);
        if (c) {
            j++;
            d[h] = c
        }
    }
    return j ? d : null
}, getSubStoresData: function (h, f, g, e) {
    if (!h) {
        return
    }
    var j = [];
    var a = function (n, o) {
        for (var l = 0, i = o.length; l < i; l++) {
            var k = o[l].storeId;
            if (n[k]) {
                j.push({id: n[g], storeDesc: o[l], data: n[k]});
                delete n[k]
            }
        }
    };
    var d = 0, c = h.length;
    if (e) {
        for (; d < c; d++) {
            a(h[d], f);
            var b = this.getSubStoresData(h[d].children, f, g, true);
            if (b) {
                j = j.concat(b)
            }
        }
    } else {
        for (; d < c; d++) {
            a(h[d], f)
        }
    }
    return j
}, loadDataToStore: function (a, d) {
    var h = a.store, j = a.stores, k = a.idProperty || "id", f = h instanceof Ext.data.TreeStore, g;
    var m = d && d.rows;
    h.metaData = d && d.metaData;
    if (m) {
        if (j) {
            g = this.getSubStoresData(m, j, k, f)
        }
        h.__loading = true;
        if (f) {
            h.proxy.data = m;
            h.load()
        } else {
            h.totalCount = d.total;
            h.currentPage = a.currentPage;
            h.loadData(m);
            h.fireEvent("load", h, h.getRange(), true)
        }
        if (g) {
            for (var c = 0, b = g.length; c < b; c++) {
                var e = g[c];
                this.loadDataToStore(Ext.apply({store: h[f ? "getNodeById" : "getById"](e.id).get(e.storeDesc.storeId)}, e.storeDesc), e.data)
            }
        }
        h.__loading = false
    }
}, loadData: function (b) {
    for (var c = 0, a = this.stores.length; c < a; c++) {
        var e = this.stores[c], d = b[e.storeId];
        if (d) {
            this.loadDataToStore(e, d)
        }
    }
}, applyChangesToRecord: function (k, o, r) {
    var m = k.fields, h = k.data, f = {}, d = false, a;
    if (r) {
        for (var e = 0, b = r.length; e < b; e++) {
            a = r[e].storeId;
            if (o.hasOwnProperty(a)) {
                f[a] = true;
                var q = k.get(a);
                if (q) {
                    this.applyChangesToStore(Ext.apply({store: q}, r[e]), o[a])
                } else {
                    Ext.log("Can't find store for the response sub-package")
                }
            }
        }
    }
    for (var g = 0, c = m.getCount(); g < c; g++) {
        a = m.getAt(g).name;
        if (o.hasOwnProperty(a) && !f[a]) {
            var p = o[a];
            if (!k.isEqual(h[a], p)) {
                if (!d) {
                    d = true;
                    k.beginEdit()
                }
                if (a === k.idProperty) {
                    k.setId(p)
                } else {
                    k.set(a, p)
                }
            }
        }
    }
    this.ignoreUpdates++;
    if (d) {
        k.endEdit()
    }
    this.ignoreUpdates--;
    k.commit()
}, applyChangesToStore: function (h, z) {
    var v, t, q;
    var a = h.phantomIdField || this.phantomIdField, i = h.idProperty, o = h.store;
    if (!i) {
        var e = o.getModel && o.getModel() || o.model;
        e = e && e.prototype;
        i = e && e.idProperty || "id"
    }
    var r = function (j) {
        return o.data.getByKey(j)
    }, y = function (j) {
        return o.getById(j)
    }, g = function (j) {
        return o.getNodeById(j)
    }, u, B;
    var n, m;
    if (o instanceof Ext.data.TreeStore) {
        n = m = g;
        u = function (k) {
            var j = (k.parentId && o.getNodeById(k.parentId)) || o.getRootNode();
            return j.appendChild(k)
        };
        B = function (j) {
            return j.parentNode.removeChild(j)
        }
    } else {
        n = r;
        m = y;
        u = function (j) {
            return o.add(j)[0]
        };
        B = function (j) {
            return o.remove(j)
        }
    }
    var l = z.rows, w = z.removed, c;
    if (l) {
        var A, d, f = h.stores;
        for (v = 0, t = l.length; v < t; v++) {
            A = l[v];
            d = A[a];
            q = A[i];
            c = null;
            if (d != null) {
                c = n(d)
            } else {
                if (i) {
                    c = m(q)
                }
            }
            if (c) {
                this.applyChangesToRecord(c, A, f)
            } else {
                this.ignoreUpdates++;
                c = u(A);
                this.ignoreUpdates--;
                c.commit()
            }
        }
    }
    if (w) {
        var p = false;
        for (v = 0, t = w.length; v < t; v++) {
            q = w[v][i];
            for (var x = 0, b = o.removed.length; x < b; x++) {
                if (o.removed[x].getId() == q) {
                    o.removed.splice(x, 1);
                    p = true;
                    break
                }
            }
        }
        if (!p) {
            c = m(q);
            if (c) {
                this.ignoreUpdates++;
                B(c);
                Ext.Array.remove(o.removed, c);
                this.ignoreUpdates--
            } else {
                Ext.log("Can't find record to remove from the response package")
            }
        }
    }
}, applyChangeSetResponse: function (c) {
    var b = this.syncApplySequence || this.stores;
    for (var d = 0, a = b.length; d < a; d++) {
        var e = c[b[d].storeId];
        if (e) {
            this.applyChangesToStore(b[d], e)
        }
    }
}, getRequestId: function () {
    return Ext.Date.now()
}, onLoad: function (b, c) {
    var a = this.decode(b);
    if (!a || !a.success) {
        this.fireEvent("loadfail", this, a, c);
        this.warn("CrudManager: Load failed, please inspect the server response", b);
        return a
    }
    this.revision = a.revision;
    this.activeRequests.load = null;
    if (this.fireEvent("beforeloadapply", this, a) !== false) {
        this.loadData(a);
        this.fireEvent("load", this, a, c);
        this.fireEvent("nochanges", this)
    }
    return a
}, onSync: function (b, c) {
    var a = this.decode(b);
    if (!a || !a.success) {
        this.fireEvent("syncfail", this, a, c);
        this.warn("CrudManager: Sync failed, please inspect the server response", b);
        return a
    }
    this.revision = a.revision;
    if (this.fireEvent("beforesyncapply", this, a) !== false) {
        this.applyChangeSetResponse(a);
        this.fireEvent("sync", this, a, c);
        if (!this.hasChanges()) {
            this.fireEvent("nochanges", this)
        }
    }
    return a
}, load: function (e, a, d) {
    var b;
    if (typeof e === "object") {
        b = e;
        e = a;
        a = d;
        d = arguments[3]
    }
    var c = this.getLoadPackage(b);
    if (this.fireEvent("beforeload", this, c) !== false) {
        d = d || this;
        if (this.activeRequests.load) {
            this.cancelRequest(this.activeRequests.load.desc);
            this.fireEvent("loadcanceled", this, c)
        }
        this.activeRequests.load = {id: c.requestId};
        this.activeRequests.load.desc = this.sendRequest({data: this.encode(c), type: "load", success: function (g, h) {
            var f = this.onLoad(g, h);
            if (a && (!f || !f.success)) {
                a.call(d, f, g)
            } else {
                if (e) {
                    e.call(d, f, g)
                }
            }
        }, failure: function () {
            if (a) {
                a.apply(d, arguments)
            }
            this.activeRequests.sync = null
        }, scope: this})
    } else {
        this.fireEvent("loadcanceled", this, c)
    }
}, sync: function (d, a, c) {
    if (this.activeRequests.sync) {
        this.delayedSyncs.push(arguments);
        this.fireEvent("syncdelayed", this, arguments);
        return
    }
    var b = this.getChangeSetPackage();
    c = c || this;
    if (!b) {
        if (d) {
            d.call(c, null, null)
        }
        return
    }
    if (this.fireEvent("beforesync", this, b) === false) {
        this.fireEvent("synccanceled", this, b);
        return
    }
    this.activeRequests.sync = {id: b.requestId};
    this.activeRequests.sync.desc = this.sendRequest({data: this.encode(b), type: "sync", success: function (h, f) {
        var e = this.onSync(h, f);
        var g = this.activeRequests.sync;
        this.activeRequests.sync = null;
        if (a && (!e || !e.success)) {
            a.call(c, e, h, g)
        } else {
            if (d) {
                d.call(c, e, h, g)
            }
        }
        this.runDelayedSync()
    }, failure: function (g, f) {
        var e = this.onSync(g, f);
        if (a) {
            a.apply(c, arguments)
        }
        this.activeRequests.sync = null;
        this.runDelayedSync()
    }, scope: this})
}, runDelayedSync: function () {
    var a = this.delayedSyncs.shift();
    if (!a) {
        return
    }
    this.sync.apply(this, a)
}, commit: function () {
    for (var b = 0, a = this.stores.length; b < a; b++) {
        this.stores[b].store.commitChanges()
    }
}, reject: function () {
    for (var b = 0, a = this.stores.length; b < a; b++) {
        this.stores[b].store.rejectChanges()
    }
}, warn: function () {
    if ("console"in window) {
        var a = console;
        a.log && a.log.apply && a.log.apply(a, arguments)
    }
}, isLoading: function () {
    return!!this.activeRequests.load
}});
Ext.define("Sch.crud.transport.Ajax", {defaultMethod: "POST", cancelRequest: function (a) {
    Ext.Ajax.abort(a)
}, sendRequest: function (b) {
    var c = b.data, d = this.transport[b.type], e = d.paramName, f = Ext.apply({}, d && d.params), g = d.method || this.defaultMethod;
    this.fireEvent("beforesend", this, f, b.type);
    var a = {url: d.url, method: g, params: f, failure: b.failure, success: function (h, i) {
        if (b.success) {
            b.success.call(b.scope || this, h.responseXml || h.responseText)
        }
    }, scope: b.scope};
    if (!e) {
        if (this.format === "xml") {
            Ext.apply(a, {xmlData: c})
        } else {
            Ext.apply(a, {jsonData: c})
        }
    } else {
        f[e] = c
    }
    return Ext.Ajax.request(a)
}});
Ext.define("Sch.crud.encoder.Json", {format: "json", encode: function (a) {
    return Ext.JSON.encode(a)
}, decode: function (a) {
    if (typeof a == "object") {
        return a
    }
    return Ext.JSON.decode(a, true)
}});
Ext.define("Sch.crud.encoder.Xml", {requires: ["Ext.XTemplate"], format: "xml", stringReplaces: [
    [/&/g, "&amp;"],
    [/</g, "&lt;"],
    [/>/g, "&gt;"],
    [/"/g, "&quot;"]
], encodeString: function (e) {
    if (!e) {
        return e
    }
    var a = e.toString(), c = this.stringReplaces;
    for (var d = 0, b = c.length; d < b; d++) {
        a = a.replace(c[d][0], c[d][1])
    }
    return a
}, encodeRecords: function (c) {
    var a = "";
    for (var d = 0, b = c.length; d < b; d++) {
        a += this.encodeRecord(c[d])
    }
    return a
}, encodeRecord: function (b) {
    var a = "<record>";
    for (var c in b) {
        var d = b[c];
        a += '<field id="' + this.encodeString(c) + '">' + (d && d.$store ? this.encodeStoreChanges({storeId: c}, d) : this.encodeString(d)) + "</field>"
    }
    a += "</record>";
    return a
}, encodeStoreChanges: function (b, c) {
    var a = '<store id="' + this.encodeString(b.storeId) + '">';
    if (c.added) {
        a += "<added>" + this.encodeRecords(c.added) + "</added>"
    }
    if (c.updated) {
        a += "<updated>" + this.encodeRecords(c.updated) + "</updated>"
    }
    if (c.removed) {
        a += "<removed>" + this.encodeRecords(c.removed) + "</removed>"
    }
    a += "</store>";
    return a
}, encode: function (e) {
    var a, d, b, c;
    switch (e.type) {
        case"load":
            a = '<load requestId="' + this.encodeString(e.requestId) + '">';
            for (d = 0, b = e.stores.length; d < b; d++) {
                c = e.stores[d];
                if (typeof c === "string") {
                    a += '<store id="' + this.encodeString(c) + '"/>'
                } else {
                    a += '<store id="' + this.encodeString(c.storeId) + '" page="' + this.encodeString(c.page) + '" pageSize="' + this.encodeString(c.pageSize) + '"/>'
                }
            }
            a += "</load>";
            return a;
        case"sync":
            a = '<sync requestId="' + this.encodeString(e.requestId) + '" revision="' + this.encodeString(e.revision) + '">';
            for (d in e) {
                if (e.hasOwnProperty(d)) {
                    c = this.getStore(d);
                    if (c) {
                        a += this.encodeStoreChanges(c, e[d])
                    }
                }
            }
            a += "</sync>";
            break
    }
    return a
}, stringToXML: function (b) {
    if (!b) {
        return
    }
    var a;
    if (window.DOMParser) {
        a = (new DOMParser()).parseFromString(b, "text/xml")
    } else {
        if (window.ActiveXObject) {
            a = new ActiveXObject("Microsoft.XMLDOM");
            a.async = false;
            a.loadXML(b)
        }
    }
    return a
}, decodeRecords: function (d) {
    var b = [];
    for (var c = 0, a = d.length; c < a; c++) {
        b.push(this.decodeRecord(d[c]))
    }
    return b
}, decodeRecord: function (f) {
    var b = f.childNodes, a = {}, g;
    for (var e = 0, c = b.length; e < c; e++) {
        var h = b[e];
        if (h.nodeName == "field") {
            g = "";
            if (h.firstChild) {
                var d = this.getElementByTagName(h, "store");
                g = d ? this.decodeStore(d) : h.firstChild.nodeValue
            }
            a[h.getAttribute("id")] = g
        }
    }
    return a
}, getElementsByTagName: function (f, c) {
    var e = f.childNodes, b = [];
    for (var d = 0, a = e.length; d < a; d++) {
        if (e[d].nodeName == c) {
            b.push(e[d])
        }
    }
    return b
}, getElementByTagName: function (e, b) {
    var d = e.childNodes;
    for (var c = 0, a = d.length; c < a; c++) {
        if (d[c].nodeName == b) {
            return d[c]
        }
    }
}, decodeStore: function (a) {
    var d = {}, c = this.getElementsByTagName(a, "rows");
    if (c.length) {
        d.rows = this.decodeRecords(this.getElementsByTagName(c[0], "record"));
        var b = parseInt(c[0].getAttribute("total"), 10);
        if (isNaN(b) || b < d.rows.length) {
            b = d.rows.length
        }
        d.total = b
    }
    var e = this.getElementByTagName(a, "removed");
    if (e) {
        d.removed = this.decodeRecords(this.getElementsByTagName(e, "record"))
    }
    return d
}, decode: function (a) {
    var d = typeof a == "string" ? this.stringToXML(a) : a;
    if (!d) {
        return
    }
    var k = {}, e = d.documentElement, g = e.getElementsByTagName("store"), f, h;
    k.requestId = e.getAttribute("requestId");
    k.revision = e.getAttribute("revision");
    k.success = e.getAttribute("success") || "false";
    k.success = k.success.toLowerCase() == "true";
    if (!k.success) {
        k.code = e.getAttribute("code");
        var j = e.getElementsByTagName("message")[0];
        k.message = j && j.firstChild && j.firstChild.nodeValue
    }
    for (var c = 0, b = g.length; c < b; c++) {
        f = g[c];
        h = f.getAttribute("id");
        if (this.getStore(h)) {
            k[h] = this.decodeStore(f)
        }
    }
    return k
}});
Ext.define("Sch.data.CrudManager", {extend: "Sch.crud.AbstractManager", mixins: ["Sch.crud.encoder.Json", "Sch.crud.transport.Ajax"], resourceStore: null, eventStore: null, constructor: function (b) {
    b = b || {};
    var d = b.resourceStore, c = b.eventStore, a = [];
    if (d) {
        if (d instanceof Ext.data.AbstractStore) {
            d = {store: d, storeId: d.storeId}
        }
        delete b.resourceStore;
        this.resourceStore = d;
        a.push(d)
    }
    if (c) {
        if (c instanceof Ext.data.AbstractStore) {
            c = {store: c, storeId: c.storeId}
        }
        delete b.eventStore;
        this.eventStore = c;
        a.push(c)
    }
    if (a.length) {
        b.stores = (b.stores || []).concat(a)
    }
    this.callParent([b])
}, getResourceStore: function () {
    return this.resourceStore && this.resourceStore.store
}, getEventStore: function () {
    return this.eventStore && this.eventStore.store
}});
Ext.define("Sch.util.Date", {requires: "Ext.Date", mixins: ["Sch.mixin.Localizable"], singleton: true, stripEscapeRe: /(\\.)/g, hourInfoRe: /([gGhHisucUOPZ]|MS)/, unitHash: null, unitsByName: {}, constructor: function () {
    var a = Ext.Date;
    var c = this.unitHash = {MILLI: a.MILLI, SECOND: a.SECOND, MINUTE: a.MINUTE, HOUR: a.HOUR, DAY: a.DAY, WEEK: "w", MONTH: a.MONTH, QUARTER: "q", YEAR: a.YEAR};
    Ext.apply(this, c);
    var b = this;
    this.units = [b.MILLI, b.SECOND, b.MINUTE, b.HOUR, b.DAY, b.WEEK, b.MONTH, b.QUARTER, b.YEAR]
}, onLocalized: function () {
    this.setUnitNames(this.L("unitNames"))
}, setUnitNames: function (f, b) {
    var e = this.unitsByName = {};
    this.l10n.unitNames = f;
    this._unitNames = Ext.apply({}, f);
    var c = this.unitHash;
    for (var a in c) {
        if (c.hasOwnProperty(a)) {
            var d = c[a];
            this._unitNames[d] = this._unitNames[a];
            e[a] = d;
            e[d] = d
        }
    }
}, betweenLesser: function (b, d, a) {
    var c = b.getTime();
    return d.getTime() <= c && c < a.getTime()
}, constrain: function (b, c, a) {
    return this.min(this.max(b, c), a)
}, compareUnits: function (c, b) {
    var a = Ext.Array.indexOf(this.units, c), d = Ext.Array.indexOf(this.units, b);
    return a > d ? 1 : (a < d ? -1 : 0)
}, isUnitGreater: function (b, a) {
    return this.compareUnits(b, a) > 0
}, copyTimeValues: function (b, a) {
    b.setHours(a.getHours());
    b.setMinutes(a.getMinutes());
    b.setSeconds(a.getSeconds());
    b.setMilliseconds(a.getMilliseconds())
}, add: function (b, c, e) {
    var f = Ext.Date.clone(b);
    if (!c || e === 0) {
        return f
    }
    switch (c.toLowerCase()) {
        case this.MILLI:
            f = new Date(b.getTime() + e);
            break;
        case this.SECOND:
            f = new Date(b.getTime() + (e * 1000));
            break;
        case this.MINUTE:
            f = new Date(b.getTime() + (e * 60000));
            break;
        case this.HOUR:
            f = new Date(b.getTime() + (e * 3600000));
            break;
        case this.DAY:
            f.setDate(b.getDate() + e);
            break;
        case this.WEEK:
            f.setDate(b.getDate() + e * 7);
            break;
        case this.MONTH:
            var a = b.getDate();
            if (a > 28) {
                a = Math.min(a, Ext.Date.getLastDateOfMonth(this.add(Ext.Date.getFirstDateOfMonth(b), this.MONTH, e)).getDate())
            }
            f.setDate(a);
            f.setMonth(f.getMonth() + e);
            break;
        case this.QUARTER:
            f = this.add(b, this.MONTH, e * 3);
            break;
        case this.YEAR:
            f.setFullYear(b.getFullYear() + e);
            break
    }
    return f
}, getUnitDurationInMs: function (a) {
    return this.add(new Date(1, 0, 1), a, 1) - new Date(1, 0, 1)
}, getMeasuringUnit: function (a) {
    if (a === this.WEEK) {
        return this.DAY
    }
    return a
}, getDurationInUnit: function (e, a, c, d) {
    var b;
    switch (c) {
        case this.YEAR:
            b = this.getDurationInYears(e, a);
            break;
        case this.QUARTER:
            b = this.getDurationInMonths(e, a) / 3;
            break;
        case this.MONTH:
            b = this.getDurationInMonths(e, a);
            break;
        case this.WEEK:
            b = this.getDurationInDays(e, a) / 7;
            break;
        case this.DAY:
            b = this.getDurationInDays(e, a);
            break;
        case this.HOUR:
            b = this.getDurationInHours(e, a);
            break;
        case this.MINUTE:
            b = this.getDurationInMinutes(e, a);
            break;
        case this.SECOND:
            b = this.getDurationInSeconds(e, a);
            break;
        case this.MILLI:
            b = this.getDurationInMilliseconds(e, a);
            break
    }
    return d ? b : Math.round(b)
}, getUnitToBaseUnitRatio: function (b, a) {
    if (b === a) {
        return 1
    }
    switch (b) {
        case this.YEAR:
            switch (a) {
                case this.QUARTER:
                    return 1 / 4;
                case this.MONTH:
                    return 1 / 12
            }
            break;
        case this.QUARTER:
            switch (a) {
                case this.YEAR:
                    return 4;
                case this.MONTH:
                    return 1 / 3
            }
            break;
        case this.MONTH:
            switch (a) {
                case this.YEAR:
                    return 12;
                case this.QUARTER:
                    return 3
            }
            break;
        case this.WEEK:
            switch (a) {
                case this.DAY:
                    return 1 / 7;
                case this.HOUR:
                    return 1 / 168
            }
            break;
        case this.DAY:
            switch (a) {
                case this.WEEK:
                    return 7;
                case this.HOUR:
                    return 1 / 24;
                case this.MINUTE:
                    return 1 / 1440
            }
            break;
        case this.HOUR:
            switch (a) {
                case this.DAY:
                    return 24;
                case this.MINUTE:
                    return 1 / 60
            }
            break;
        case this.MINUTE:
            switch (a) {
                case this.HOUR:
                    return 60;
                case this.SECOND:
                    return 1 / 60;
                case this.MILLI:
                    return 1 / 60000
            }
            break;
        case this.SECOND:
            switch (a) {
                case this.MILLI:
                    return 1 / 1000
            }
            break;
        case this.MILLI:
            switch (a) {
                case this.SECOND:
                    return 1000
            }
            break
    }
    return-1
}, getDurationInMilliseconds: function (b, a) {
    return(a - b)
}, getDurationInSeconds: function (b, a) {
    return(a - b) / 1000
}, getDurationInMinutes: function (b, a) {
    return(a - b) / 60000
}, getDurationInHours: function (b, a) {
    return(a - b) / 3600000
}, getDurationInDays: function (c, b) {
    var a = c.getTimezoneOffset() - b.getTimezoneOffset();
    return(b - c + a * 60 * 1000) / 86400000
}, getDurationInBusinessDays: function (g, b) {
    var c = Math.round((b - g) / 86400000), a = 0, f;
    for (var e = 0; e < c; e++) {
        f = this.add(g, this.DAY, e).getDay();
        if (f !== 6 && f !== 0) {
            a++
        }
    }
    return a
}, getDurationInMonths: function (b, a) {
    return((a.getFullYear() - b.getFullYear()) * 12) + (a.getMonth() - b.getMonth())
}, getDurationInYears: function (b, a) {
    return this.getDurationInMonths(b, a) / 12
}, min: function (b, a) {
    return b < a ? b : a
}, max: function (b, a) {
    return b > a ? b : a
}, intersectSpans: function (c, d, b, a) {
    return this.betweenLesser(c, b, a) || this.betweenLesser(b, c, d)
}, getNameOfUnit: function (a) {
    a = this.getUnitByName(a);
    switch (a.toLowerCase()) {
        case this.YEAR:
            return"YEAR";
        case this.QUARTER:
            return"QUARTER";
        case this.MONTH:
            return"MONTH";
        case this.WEEK:
            return"WEEK";
        case this.DAY:
            return"DAY";
        case this.HOUR:
            return"HOUR";
        case this.MINUTE:
            return"MINUTE";
        case this.SECOND:
            return"SECOND";
        case this.MILLI:
            return"MILLI"
    }
    throw"Incorrect UnitName"
}, getReadableNameOfUnit: function (b, a) {
    if (!this.isLocaleApplied()) {
        this.applyLocale()
    }
    return this._unitNames[b][a ? "plural" : "single"]
}, getShortNameOfUnit: function (a) {
    if (!this.isLocaleApplied()) {
        this.applyLocale()
    }
    return this._unitNames[a].abbrev
}, getUnitByName: function (a) {
    if (!this.isLocaleApplied()) {
        this.applyLocale()
    }
    if (!this.unitsByName[a]) {
        Ext.Error.raise("Unknown unit name: " + a)
    }
    return this.unitsByName[a]
}, getNext: function (c, g, a, f) {
    var e = Ext.Date.clone(c);
    f = arguments.length < 4 ? 1 : f;
    a = a == null ? 1 : a;
    switch (g) {
        case this.MILLI:
            e = this.add(c, g, a);
            break;
        case this.SECOND:
            e = this.add(c, g, a);
            if (e.getMilliseconds() > 0) {
                e.setMilliseconds(0)
            }
            break;
        case this.MINUTE:
            e = this.add(c, g, a);
            if (e.getSeconds() > 0) {
                e.setSeconds(0)
            }
            if (e.getMilliseconds() > 0) {
                e.setMilliseconds(0)
            }
            break;
        case this.HOUR:
            e = this.add(c, g, a);
            if (e.getMinutes() > 0) {
                e.setMinutes(0)
            }
            if (e.getSeconds() > 0) {
                e.setSeconds(0)
            }
            if (e.getMilliseconds() > 0) {
                e.setMilliseconds(0)
            }
            break;
        case this.DAY:
            var d = c.getHours() === 23 && this.add(e, this.HOUR, 1).getHours() === 1;
            if (d) {
                e = this.add(e, this.DAY, 2);
                Ext.Date.clearTime(e);
                return e
            }
            Ext.Date.clearTime(e);
            e = this.add(e, this.DAY, a);
            if (e.getHours() === 1) {
                Ext.Date.clearTime(e)
            }
            break;
        case this.WEEK:
            Ext.Date.clearTime(e);
            var b = e.getDay();
            e = this.add(e, this.DAY, f - b + 7 * (a - (f <= b ? 0 : 1)));
            if (e.getDay() !== f) {
                e = this.add(e, this.HOUR, 1)
            } else {
                Ext.Date.clearTime(e)
            }
            break;
        case this.MONTH:
            e = this.add(e, this.MONTH, a);
            e.setDate(1);
            Ext.Date.clearTime(e);
            break;
        case this.QUARTER:
            e = this.add(e, this.MONTH, ((a - 1) * 3) + (3 - (e.getMonth() % 3)));
            Ext.Date.clearTime(e);
            e.setDate(1);
            break;
        case this.YEAR:
            e = new Date(e.getFullYear() + a, 0, 1);
            break;
        default:
            throw"Invalid date unit"
    }
    return e
}, getNumberOfMsFromTheStartOfDay: function (a) {
    return a - Ext.Date.clearTime(a, true) || 86400000
}, getNumberOfMsTillTheEndOfDay: function (a) {
    return this.getStartOfNextDay(a, true) - a
}, getStartOfNextDay: function (b, f, e) {
    var d = this.add(e ? b : Ext.Date.clearTime(b, f), this.DAY, 1);
    if (d.getDate() == b.getDate()) {
        var c = this.add(Ext.Date.clearTime(b, f), this.DAY, 2).getTimezoneOffset();
        var a = b.getTimezoneOffset();
        d = this.add(d, this.MINUTE, a - c)
    }
    return d
}, getEndOfPreviousDay: function (b, c) {
    var a = c ? b : Ext.Date.clearTime(b, true);
    if (a - b) {
        return a
    } else {
        return this.add(a, this.DAY, -1)
    }
}, timeSpanContains: function (c, b, d, a) {
    return(d - c) >= 0 && (b - a) >= 0
}, compareWithPrecision: function (e, c, f) {
    var d = Sch.util.Date, b = Ext.Date, a;
    switch (f) {
        case d.DAY:
            e = Number(b.format(e, "Ymd"));
            c = Number(b.format(c, "Ymd"));
            break;
        case d.WEEK:
            e = Number(b.format(e, "YmW"));
            c = Number(b.format(c, "YmW"));
            break;
        case d.MONTH:
            e = Number(b.format(e, "Ym"));
            c = Number(b.format(c, "Ym"));
            break;
        case d.QUARTER:
            e = e.getFullYear() * 4 + Math.floor(e.getMonth() / 3);
            c = c.getFullYear() * 4 + Math.floor(c.getMonth() / 3);
            break;
        case d.YEAR:
            e = e.getFullYear();
            c = c.getFullYear();
            break;
        default:
        case d.MILLI:
        case d.SECOND:
        case d.MINUTE:
        case d.HOUR:
            f = f && this.getUnitDurationInMs(f) || 1;
            e = Math.floor(e.valueOf() / f);
            c = Math.floor(c.valueOf() / f);
            break
    }
    ((e < c) && (a = -1)) || ((e > c) && (a = +1)) || (a = 0);
    return a
}, getValueInUnits: function (a, b) {
    switch (b) {
        case this.MONTH:
            return a.getMonth();
        case this.DAY:
            return a.getDate();
        case this.HOUR:
            return a.getHours();
        case this.MINUTE:
            return a.getMinutes();
        case this.SECOND:
            return a.getSeconds()
    }
}, mergeDates: function (c, b, a) {
    var d = Ext.Date.clone(c);
    switch (a) {
        case this.YEAR:
            d.setFullYear(b.getFullYear());
        case this.MONTH:
            d.setMonth(b.getMonth());
        case this.WEEK:
        case this.DAY:
            if (a === this.WEEK) {
                d = this.add(d, this.DAY, b.getDay() - d.getDay())
            } else {
                d.setDate(b.getDate())
            }
        case this.HOUR:
            d.setHours(b.getHours());
        case this.MINUTE:
            d.setMinutes(b.getMinutes());
        case this.SECOND:
            d.setSeconds(b.getSeconds());
        case this.MILLI:
            d.setMilliseconds(b.getMilliseconds())
    }
    return d
}, splitToSubUnits: function (d, c, a, b) {
    a = a || 1;
    b = arguments.length < 4 ? 1 : b;
    switch (c) {
        case this.MONTH:
            return this.splitMonth(d, a, b);
        case this.WEEK:
        case this.DAY:
            return this.splitDay(d, a);
        default:
            break
    }
}, splitYear: function (e, c) {
    var b = Ext.Date.clearTime(e, true);
    b.setMonth(0);
    b.setDate(1);
    var a = [];
    for (var d = 0; d <= 12; d = d + c) {
        a.push(this.add(b, this.MONTH, d))
    }
    return a
}, splitMonth: function (h, c, g) {
    var b = Ext.Date.clearTime(h, true);
    b.setDate(1);
    b = this.add(b, this.DAY, g - b.getDay());
    var d = Ext.Date.clone(b);
    var f = this.add(b, this.MONTH, 1);
    var a = [];
    for (var e = 0; d.getTime() < f.getTime(); e = e + c) {
        d = this.add(b, this.WEEK, e);
        a.push(d)
    }
    return a
}, splitWeek: function (f, c, e) {
    var b = this.add(f, this.DAY, e - f.getDay());
    b = Ext.Date.clearTime(b);
    var a = [];
    for (var d = 0; d <= 7; d = d + c) {
        a.push(this.add(b, this.DAY, d))
    }
    return a
}, splitDay: function (e, b) {
    var d = Ext.Date.clearTime(e, true);
    var a = [];
    for (var c = 0; c <= 24; c = c + b) {
        a.push(this.add(d, this.HOUR, c))
    }
    return a
}, splitHour: function (e, b) {
    var d = new Date(e.getTime());
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    var a = [];
    for (var c = 0; c <= 60; c = c + b) {
        a.push(this.add(d, this.MINUTE, c))
    }
    return a
}, splitMinute: function (e, b) {
    var d = Ext.Date.clone(e);
    d.setSeconds(0);
    d.setMilliseconds(0);
    var a = [];
    for (var c = 0; c <= 60; c = c + b) {
        a.push(this.add(d, this.SECOND, c))
    }
    return a
}});
Ext.define("Sch.util.Debug", {singleton: true, runDiagnostics: function () {
    var d;
    var g = this;
    var b = window.console;
    if (b && b.log) {
        d = function (m) {
            b.log(m)
        }
    } else {
        if (!g.schedulerDebugWin) {
            g.schedulerDebugWin = new Ext.Window({height: 400, width: 500, bodyStyle: "padding:10px", closeAction: "hide", autoScroll: true})
        }
        g.schedulerDebugWin.show();
        g.schedulerDebugWin.update("");
        d = function (m) {
            g.schedulerDebugWin.update((g.schedulerDebugWin.body.dom.innerHTML || "") + m + "<br/>")
        }
    }
    var e = Ext.select(".sch-schedulerpanel");
    if (e.getCount() === 0) {
        d("No scheduler component found")
    }
    var l = Ext.getCmp(e.elements[0].id), j = l.getResourceStore(), c = l.getEventStore();
    if (!c.isEventStore) {
        d("Your event store must be or extend Sch.data.EventStore")
    }
    d("Scheduler view start: " + l.getStart() + ", end: " + l.getEnd());
    if (!j) {
        d("No store configured");
        return
    }
    if (!c) {
        d("No event store configured");
        return
    }
    d(j.getCount() + " records in the resource store");
    d(c.getCount() + " records in the eventStore");
    var k = c.model.prototype.idProperty;
    var a = j.model.prototype.idProperty;
    var i = c.model.prototype.fields.getByKey(k);
    var f = j.model.prototype.fields.getByKey(a);
    if (!(c.model.prototype instanceof Sch.model.Event)) {
        d("Your event model must extend Sch.model.Event")
    }
    if (!(j.model.prototype instanceof Sch.model.Resource)) {
        d("Your resource model must extend Sch.model.Resource")
    }
    if (!i) {
        d("idProperty on the event model is incorrectly setup, value: " + k)
    }
    if (!f) {
        d("idProperty on the resource model is incorrectly setup, value: " + a)
    }
    var h = l.getSchedulingView();
    d(h.el.select(h.eventSelector).getCount() + " events present in the DOM");
    if (c.getCount() > 0) {
        if (!c.first().getStartDate() || !(c.first().getStartDate()instanceof Date)) {
            d("The eventStore reader is misconfigured - The StartDate field is not setup correctly, please investigate");
            d("StartDate is configured with dateFormat: " + c.model.prototype.fields.getByKey(c.model.prototype.startDateField).dateFormat);
            d("See Ext JS docs for information about different date formats: http://docs.sencha.com/ext-js/4-0/#!/api/Ext.Date")
        }
        if (!c.first().getEndDate() || !(c.first().getEndDate()instanceof Date)) {
            d("The eventStore reader is misconfigured - The EndDate field is not setup correctly, please investigate");
            d("EndDate is configured with dateFormat: " + c.model.prototype.fields.getByKey(c.model.prototype.endDateField).dateFormat);
            d("See Ext JS docs for information about different date formats: http://docs.sencha.com/ext-js/4-0/#!/api/Ext.Date")
        }
        if (c.proxy && c.proxy.reader && c.proxy.reader.jsonData) {
            d("Dumping jsonData to console");
            console && console.dir && console.dir(c.proxy.reader.jsonData)
        }
        d("Records in the event store:");
        c.each(function (n, m) {
            d((m + 1) + ". " + n.startDateField + ":" + n.getStartDate() + ", " + n.endDateField + ":" + n.getEndDate() + ", " + n.resourceIdField + ":" + n.getResourceId());
            if (!n.getStartDate()) {
                d(n.getStartDate())
            }
        })
    } else {
        d("Event store has no data. Has it been loaded properly?")
    }
    if (j instanceof Ext.data.TreeStore) {
        j = j.nodeStore
    }
    if (j.getCount() > 0) {
        d("Records in the resource store:");
        j.each(function (n, m) {
            d((m + 1) + ". " + n.idProperty + ":" + n.getId());
            return
        })
    } else {
        d("Resource store has no data.");
        return
    }
    d("Everything seems to be setup ok!")
}});
Ext.define("Sch.util.DragTracker", {extend: "Ext.dd.DragTracker", requires: ["Ext.util.Region"], xStep: 1, yStep: 1, constructor: function () {
    this.callParent(arguments);
    this.on("dragstart", function () {
        var a = this.el;
        a.on("scroll", this.onMouseMove, this);
        this.on("dragend", function () {
            a.un("scroll", this.onMouseMove, this)
        }, this, {single: true})
    })
}, setXStep: function (a) {
    this.xStep = a
}, startScroll: null, setYStep: function (a) {
    this.yStep = a
}, getRegion: function () {
    var j = this.startXY, f = this.el.getScroll(), l = this.getXY(), c = l[0], b = l[1], h = f.left - this.startScroll.left, m = f.top - this.startScroll.top, i = j[0] - h, g = j[1] - m, e = Math.min(i, c), d = Math.min(g, b), a = Math.abs(i - c), k = Math.abs(g - b);
    return new Ext.util.Region(d, e + a, d + k, e)
}, onMouseDown: function (b, a) {
    this.callParent(arguments);
    this.lastXY = this.startXY;
    this.startScroll = this.el.getScroll()
}, onMouseMove: function (g, f) {
    if (this.active && g.type === "mousemove" && Ext.isIE9m && !g.browserEvent.button) {
        g.preventDefault();
        this.onMouseUp(g);
        return
    }
    g.preventDefault();
    var d = g.type === "scroll" ? this.lastXY : g.getXY(), b = this.startXY;
    if (!this.active) {
        if (Math.max(Math.abs(b[0] - d[0]), Math.abs(b[1] - d[1])) > this.tolerance) {
            this.triggerStart(g)
        } else {
            return
        }
    }
    var a = d[0], h = d[1];
    if (this.xStep > 1) {
        a -= this.startXY[0];
        a = Math.round(a / this.xStep) * this.xStep;
        a += this.startXY[0]
    }
    if (this.yStep > 1) {
        h -= this.startXY[1];
        h = Math.round(h / this.yStep) * this.yStep;
        h += this.startXY[1]
    }
    var c = this.xStep > 1 || this.yStep > 1;
    if (!c || a !== d[0] || h !== d[1]) {
        this.lastXY = [a, h];
        if (this.fireEvent("mousemove", this, g) === false) {
            this.onMouseUp(g)
        } else {
            this.onDrag(g);
            this.fireEvent("drag", this, g)
        }
    }
}});
Ext.define("Sch.util.ScrollManager", {singleton: true, vthresh: 25, hthresh: 25, increment: 100, frequency: 500, animate: true, animDuration: 200, activeEl: null, scrollElRegion: null, scrollProcess: {}, pt: null, scrollWidth: null, scrollHeight: null, direction: "both", constructor: function () {
    this.doScroll = Ext.Function.bind(this.doScroll, this)
}, triggerRefresh: function () {
    if (this.activeEl) {
        this.refreshElRegion();
        this.clearScrollInterval();
        this.onMouseMove()
    }
}, doScroll: function () {
    var c = this.scrollProcess, d = c.el, b = c.dir[0], a = this.increment;
    if (b === "r") {
        a = Math.min(a, this.scrollWidth - this.activeEl.dom.scrollLeft - this.activeEl.dom.clientWidth)
    } else {
        if (b === "d") {
            a = Math.min(a, this.scrollHeight - this.activeEl.dom.scrollTop - this.activeEl.dom.clientHeight)
        }
    }
    d.scroll(b, Math.max(a, 0), {duration: this.animDuration, callback: this.triggerRefresh, scope: this})
}, clearScrollInterval: function () {
    var a = this.scrollProcess;
    if (a.id) {
        clearTimeout(a.id)
    }
    a.id = 0;
    a.el = null;
    a.dir = ""
}, isScrollAllowed: function (a) {
    switch (this.direction) {
        case"both":
            return true;
        case"horizontal":
            return a === "right" || a === "left";
        case"vertical":
            return a === "up" || a === "down";
        default:
            throw"Invalid direction: " + this.direction
    }
}, startScrollInterval: function (b, a) {
    if (!this.isScrollAllowed(a)) {
        return
    }
    if (Ext.versions.extjs.isLessThan("4.2.2")) {
        if (a[0] === "r") {
            a = "left"
        } else {
            if (a[0] === "l") {
                a = "right"
            }
        }
    }
    this.clearScrollInterval();
    this.scrollProcess.el = b;
    this.scrollProcess.dir = a;
    this.scrollProcess.id = setTimeout(this.doScroll, this.frequency)
}, onMouseMove: function (d) {
    var k = d ? d.getPoint() : this.pt, j = k.x, h = k.y, f = this.scrollProcess, a, b = this.activeEl, i = this.scrollElRegion, c = b.dom, g = this;
    this.pt = k;
    if (i && i.contains(k) && b.isScrollable()) {
        if (i.bottom - h <= g.vthresh && (this.scrollHeight - c.scrollTop - c.clientHeight > 0)) {
            if (f.el != b) {
                this.startScrollInterval(b, "down")
            }
            return
        } else {
            if (i.right - j <= g.hthresh && (this.scrollWidth - c.scrollLeft - c.clientWidth > 0)) {
                if (f.el != b) {
                    this.startScrollInterval(b, "right")
                }
                return
            } else {
                if (h - i.top <= g.vthresh && b.dom.scrollTop > 0) {
                    if (f.el != b) {
                        this.startScrollInterval(b, "up")
                    }
                    return
                } else {
                    if (j - i.left <= g.hthresh && b.dom.scrollLeft > 0) {
                        if (f.el != b) {
                            this.startScrollInterval(b, "left")
                        }
                        return
                    }
                }
            }
        }
    }
    this.clearScrollInterval()
}, refreshElRegion: function () {
    this.scrollElRegion = this.activeEl.getRegion()
}, activate: function (a, b) {
    this.direction = b || "both";
    this.activeEl = Ext.get(a);
    this.scrollWidth = this.activeEl.dom.scrollWidth;
    this.scrollHeight = this.activeEl.dom.scrollHeight;
    this.refreshElRegion();
    this.activeEl.on("mousemove", this.onMouseMove, this)
}, deactivate: function () {
    this.clearScrollInterval();
    this.activeEl.un("mousemove", this.onMouseMove, this);
    this.activeEl = this.scrollElRegion = this.scrollWidth = this.scrollHeight = null;
    this.direction = "both"
}});
Ext.define("Sch.preset.ViewPreset", {name: null, rowHeight: null, timeColumnWidth: 50, timeRowHeight: null, timeAxisColumnWidth: null, displayDateFormat: "G:i", shiftUnit: "HOUR", shiftIncrement: 1, defaultSpan: 12, timeResolution: null, headerConfig: null, columnLinesFor: "middle", headers: null, mainHeader: 0, constructor: function (a) {
    Ext.apply(this, a)
}, getHeaders: function () {
    if (this.headers) {
        return this.headers
    }
    var a = this.headerConfig;
    this.mainHeader = a.top ? 1 : 0;
    return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || [])
}, getMainHeader: function () {
    return this.getHeaders()[this.mainHeader]
}, getBottomHeader: function () {
    var a = this.getHeaders();
    return a[a.length - 1]
}, clone: function () {
    var a = {};
    var b = this;
    Ext.each(["rowHeight", "timeColumnWidth", "timeRowHeight", "timeAxisColumnWidth", "displayDateFormat", "shiftUnit", "shiftIncrement", "defaultSpan", "timeResolution", "headerConfig"], function (c) {
        a[c] = b[c]
    });
    return new this.self(Ext.clone(a))
}});
Ext.define("Sch.preset.Manager", {extend: "Ext.util.MixedCollection", requires: ["Sch.util.Date", "Sch.preset.ViewPreset"], mixins: ["Sch.mixin.Localizable"], singleton: true, defaultPresets: {secondAndMinute: {timeColumnWidth: 30, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "G:i:s", shiftIncrement: 10, shiftUnit: "MINUTE", defaultSpan: 24, timeResolution: {unit: "SECOND", increment: 5}, headerConfig: {middle: {unit: "SECOND", increment: 10, align: "center", dateFormat: "s"}, top: {unit: "MINUTE", align: "center", dateFormat: "D, d g:iA"}}}, minuteAndHour: {timeColumnWidth: 100, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "G:i", shiftIncrement: 1, shiftUnit: "HOUR", defaultSpan: 24, timeResolution: {unit: "MINUTE", increment: 30}, headerConfig: {middle: {unit: "MINUTE", increment: "30", align: "center", dateFormat: "i"}, top: {unit: "HOUR", align: "center", dateFormat: "D, gA/d"}}}, hourAndDay: {timeColumnWidth: 60, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "G:i", shiftIncrement: 1, shiftUnit: "DAY", defaultSpan: 24, timeResolution: {unit: "MINUTE", increment: 30}, headerConfig: {middle: {unit: "HOUR", align: "center", dateFormat: "G:i"}, top: {unit: "DAY", align: "center", dateFormat: "D d/m"}}}, dayAndWeek: {timeColumnWidth: 100, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d G:i", shiftUnit: "DAY", shiftIncrement: 1, defaultSpan: 5, timeResolution: {unit: "HOUR", increment: 1}, headerConfig: {middle: {unit: "DAY", align: "center", dateFormat: "D d M"}, top: {unit: "WEEK", align: "center", renderer: function (c, b, a) {
    return Sch.util.Date.getShortNameOfUnit("WEEK") + "." + Ext.Date.format(c, "W M Y")
}}}}, weekAndDay: {timeColumnWidth: 100, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftUnit: "WEEK", shiftIncrement: 1, defaultSpan: 1, timeResolution: {unit: "DAY", increment: 1}, headerConfig: {bottom: {unit: "DAY", align: "center", increment: 1, dateFormat: "d/m"}, middle: {unit: "WEEK", dateFormat: "D d M"}}}, weekAndMonth: {timeColumnWidth: 100, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftUnit: "WEEK", shiftIncrement: 5, defaultSpan: 6, timeResolution: {unit: "DAY", increment: 1}, headerConfig: {middle: {unit: "WEEK", renderer: function (c, b, a) {
    return Ext.Date.format(c, "d M")
}}, top: {unit: "MONTH", align: "center", dateFormat: "M Y"}}}, monthAndYear: {timeColumnWidth: 110, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftIncrement: 3, shiftUnit: "MONTH", defaultSpan: 12, timeResolution: {unit: "DAY", increment: 1}, headerConfig: {middle: {unit: "MONTH", align: "center", dateFormat: "M Y"}, top: {unit: "YEAR", align: "center", dateFormat: "Y"}}}, year: {timeColumnWidth: 100, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftUnit: "YEAR", shiftIncrement: 1, defaultSpan: 1, timeResolution: {unit: "MONTH", increment: 1}, headerConfig: {middle: {unit: "QUARTER", align: "center", renderer: function (c, b, a) {
    return Ext.String.format(Sch.util.Date.getShortNameOfUnit("QUARTER").toUpperCase() + "{0}", Math.floor(c.getMonth() / 3) + 1)
}}, top: {unit: "YEAR", align: "center", dateFormat: "Y"}}}, manyYears: {timeColumnWidth: 50, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftUnit: "YEAR", shiftIncrement: 1, defaultSpan: 1, timeResolution: {unit: "YEAR", increment: 1}, headerConfig: {middle: {unit: "YEAR", align: "center", dateFormat: "Y", increment: 5}, bottom: {unit: "YEAR", align: "center", increment: 1, renderer: Ext.emptyFn}}}, weekAndDayLetter: {timeColumnWidth: 20, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftUnit: "WEEK", shiftIncrement: 1, defaultSpan: 10, timeResolution: {unit: "DAY", increment: 1}, headerConfig: {bottom: {unit: "DAY", align: "center", renderer: function (a) {
    return Ext.Date.dayNames[a.getDay()].substring(0, 1)
}}, middle: {unit: "WEEK", dateFormat: "D d M Y"}}}, weekDateAndMonth: {timeColumnWidth: 30, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "Y-m-d", shiftUnit: "WEEK", shiftIncrement: 1, defaultSpan: 10, timeResolution: {unit: "DAY", increment: 1}, headerConfig: {middle: {unit: "WEEK", align: "center", dateFormat: "d"}, top: {unit: "MONTH", dateFormat: "Y F"}}}, day: {timeRowHeight: 40, calendarColumnWidth: 200, displayDateFormat: "G:i", shiftIncrement: 1, shiftUnit: "DAY", defaultSpan: 24, timeResolution: {unit: "MINUTE", increment: 30}, headerConfig: {bottom: {unit: "HOUR", align: "center", renderer: function (a) {
    return Ext.String.format('<div class="sch-calendarcolumn-ct"><span class="sch-calendarcolumn-hours">{0}</span><span class="sch-calendarcolumn-minutes">{1}</span></div>', Ext.Date.format(a, "H"), Ext.Date.format(a, "i"))
}}, middle: {unit: "DAY", align: "center", dateFormat: "D d/m", splitUnit: "DAY"}}}, week: {timeRowHeight: 40, calendarColumnWidth: 164, displayDateFormat: "G:i", shiftIncrement: 1, shiftUnit: "WEEK", defaultSpan: 24, timeResolution: {unit: "MINUTE", increment: 30}, headerConfig: {bottom: {unit: "HOUR", align: "center", dateFormat: "H:i", renderer: function (a) {
    return Ext.String.format('<div class="sch-calendarcolumn-ct"><span class="sch-calendarcolumn-hours">{0}</span><span class="sch-calendarcolumn-minutes">{1}</span></div>', Ext.Date.format(a, "H"), Ext.Date.format(a, "i"))
}}, middle: {unit: "WEEK", align: "center", dateFormat: "D d", splitUnit: "DAY"}}}, month: {timeColumnWidth: 60, rowHeight: 24, resourceColumnWidth: 100, displayDateFormat: "G:i", shiftIncrement: 1, shiftUnit: "MONTH", defaultSpan: 4, timeResolution: {unit: "HOUR", increment: 12}, headerConfig: {bottom: {unit: "DAY", align: "center", dateFormat: "D", splitUnit: "WEEK"}, middle: {unit: "WEEK", align: "center", dateFormat: "D d/m"}, top: {unit: "MONTH", align: "center", renderer: function (c, b, a) {
    return Ext.Date.format(c, "d/m") + " - " + Ext.Date.format(b, "d/m, Y")
}, splitUnit: "WEEK"}}}}, constructor: function () {
    this.callParent(arguments);
    this.registerDefaults()
}, onLocalized: function () {
    var a = this;
    this.eachKey(function (c, d) {
        if (a.l10n[c]) {
            var b = a.L(c);
            b.displayDateFormat && (d.displayDateFormat = b.displayDateFormat);
            b.middleDateFormat && (d.headerConfig.middle.dateFormat = b.middleDateFormat);
            b.topDateFormat && (d.headerConfig.top.dateFormat = b.topDateFormat);
            b.bottomDateFormat && (d.headerConfig.bottom.dateFormat = b.bottomDateFormat)
        }
    })
}, registerPreset: function (b, a) {
    if (a) {
        var c = a.headerConfig;
        var f = Sch.util.Date;
        for (var g in c) {
            if (c.hasOwnProperty(g)) {
                if (f[c[g].unit]) {
                    c[g].unit = f[c[g].unit.toUpperCase()]
                }
                if (f[c[g].splitUnit]) {
                    c[g].splitUnit = f[c[g].splitUnit.toUpperCase()]
                }
            }
        }
        if (!a.timeColumnWidth) {
            a.timeColumnWidth = 50
        }
        if (!a.rowHeight) {
            a.rowHeight = 24
        }
        var d = a.timeResolution;
        if (d && f[d.unit]) {
            d.unit = f[d.unit.toUpperCase()]
        }
        var e = a.shiftUnit;
        if (e && f[e]) {
            a.shiftUnit = f[e.toUpperCase()]
        }
    }
    if (this.isValidPreset(a)) {
        if (this.containsKey(b)) {
            this.removeAtKey(b)
        }
        a.name = b;
        this.add(b, new Sch.preset.ViewPreset(a))
    } else {
        throw"Invalid preset, please check your configuration"
    }
}, isValidPreset: function (a) {
    var e = Sch.util.Date, c = true, d = Sch.util.Date.units, b = {};
    for (var f in a.headerConfig) {
        if (a.headerConfig.hasOwnProperty(f)) {
            b[f] = true;
            c = c && Ext.Array.indexOf(d, a.headerConfig[f].unit) >= 0
        }
    }
    if (!(a.columnLinesFor in b)) {
        a.columnLinesFor = "middle"
    }
    if (a.timeResolution) {
        c = c && Ext.Array.indexOf(d, a.timeResolution.unit) >= 0
    }
    if (a.shiftUnit) {
        c = c && Ext.Array.indexOf(d, a.shiftUnit) >= 0
    }
    return c
}, getPreset: function (a) {
    return this.get(a)
}, deletePreset: function (a) {
    this.removeAtKey(a)
}, registerDefaults: function () {
    var b = this, a = this.defaultPresets;
    for (var c in a) {
        b.registerPreset(c, a[c])
    }
}});
if (!Ext.ClassManager.get("Sch.feature.AbstractTimeSpan")) {
    Ext.define("Sch.feature.AbstractTimeSpan", {extend: "Ext.AbstractPlugin", mixins: {observable: "Ext.util.Observable"}, lockableScope: "top", schedulerView: null, timeAxis: null, containerEl: null, expandToFitView: false, disabled: false, cls: null, clsField: "Cls", template: null, store: null, renderElementsBuffered: false, renderDelay: 15, refreshSizeOnItemUpdate: true, _resizeTimer: null, _renderTimer: null, showHeaderElements: false, headerTemplate: null, innerHeaderTpl: null, headerContainerCls: "sch-header-secondary-canvas", headerContainerEl: null, renderingDoneEvent: null, constructor: function (a) {
        this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
        Ext.apply(this, a);
        this.mixins.observable.constructor.call(this);
        this.callParent(arguments)
    }, setDisabled: function (a) {
        if (a) {
            this.removeElements()
        }
        this.disabled = a
    }, removeElements: function () {
        this.removeBodyElements();
        if (this.showHeaderElements) {
            this.removeHeaderElements()
        }
    }, getBodyElements: function () {
        if (this.containerEl) {
            return this.containerEl.select("." + this.uniqueCls)
        }
        return null
    }, getHeaderContainerEl: function () {
        var c = this.headerContainerEl, b = Ext.baseCSSPrefix, a;
        if (!c || !c.dom) {
            if (this.schedulerView.isHorizontal()) {
                a = this.panel.getTimeAxisColumn().headerView.containerEl
            } else {
                a = this.panel.el.down("." + b + "grid-inner-locked ." + b + "panel-body ." + b + "grid-view")
            }
            if (a) {
                c = a.down("." + this.headerContainerCls);
                if (!c) {
                    c = a.appendChild({cls: this.headerContainerCls})
                }
                this.headerContainerEl = c
            }
        }
        return c
    }, getHeaderElements: function () {
        var a = this.getHeaderContainerEl();
        if (a) {
            return a.select("." + this.uniqueCls)
        }
        return null
    }, removeBodyElements: function () {
        var a = this.getBodyElements();
        if (a) {
            a.each(function (b) {
                b.destroy()
            })
        }
    }, removeHeaderElements: function () {
        var a = this.getHeaderElements();
        if (a) {
            a.each(function (b) {
                b.destroy()
            })
        }
    }, getElementId: function (a) {
        return this.uniqueCls + "-" + a.internalId
    }, getHeaderElementId: function (a) {
        return this.uniqueCls + "-header-" + a.internalId
    }, getTemplateData: function (a) {
        return this.prepareTemplateData ? this.prepareTemplateData(a) : a.data
    }, getElementCls: function (a, c) {
        var b = a.clsField || this.clsField;
        if (!c) {
            c = this.getTemplateData(a)
        }
        return this.cls + " " + this.uniqueCls + " " + (c[b] || "")
    }, getHeaderElementCls: function (a, c) {
        var b = a.clsField || this.clsField;
        if (!c) {
            c = this.getTemplateData(a)
        }
        return"sch-header-indicator " + this.uniqueCls + " " + (c[b] || "")
    }, init: function (a) {
        if (Ext.versions.touch && !a.isReady()) {
            a.on("viewready", function () {
                this.init(a)
            }, this);
            return
        }
        if (Ext.isString(this.innerHeaderTpl)) {
            this.innerHeaderTpl = new Ext.XTemplate(this.innerHeaderTpl)
        }
        var b = this.innerHeaderTpl;
        if (!this.headerTemplate) {
            this.headerTemplate = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" class="{cls}" style="{side}:{position}px;">' + (b ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {renderInner: function (c) {
                return b.apply(c)
            }})
        }
        this.schedulerView = a.getSchedulingView();
        this.panel = a;
        this.timeAxis = a.getTimeAxis();
        this.store = Ext.StoreManager.lookup(this.store);
        if (!this.store) {
            Ext.Error.raise("Error: You must define a store for this plugin")
        }
        if (!this.schedulerView.getEl()) {
            this.schedulerView.on({afterrender: this.onAfterRender, scope: this})
        } else {
            this.onAfterRender()
        }
        this.schedulerView.on({destroy: this.onDestroy, scope: this})
    }, onAfterRender: function (c) {
        var a = this.schedulerView;
        this.containerEl = a.getSecondaryCanvasEl();
        this.storeListeners = {load: this.renderElements, datachanged: this.renderElements, clear: this.renderElements, add: this.refreshSingle, remove: this.renderElements, update: this.refreshSingle, addrecords: this.refreshSingle, removerecords: this.renderElements, updaterecord: this.refreshSingle, scope: this};
        this.store.on(this.storeListeners);
        if (Ext.data.NodeStore && a.store instanceof Ext.data.NodeStore) {
            if (a.animate) {
            } else {
                a.mon(a.store, {expand: this.renderElements, collapse: this.renderElements, scope: this})
            }
        }
        a.on({bufferedrefresh: this.renderElements, refresh: this.renderElements, itemadd: this.refreshSizeOnItemUpdate ? this.refreshSizes : this.renderElements, itemremove: this.refreshSizeOnItemUpdate ? this.refreshSizes : this.renderElements, itemupdate: this.refreshSizeOnItemUpdate ? this.refreshSizes : this.renderElements, groupexpand: this.renderElements, groupcollapse: this.renderElements, columnwidthchange: this.renderElements, resize: this.renderElements, scope: this});
        if (a.headerCt) {
            a.headerCt.on({add: this.renderElements, remove: this.renderElements, scope: this})
        }
        this.panel.on({viewchange: this.renderElements, show: this.refreshSizes, modechange: this.forceNewRenderingTimeout, scope: this});
        var b = a.getRowContainerEl();
        if (b && b.down(".sch-timetd")) {
            this.renderElements()
        }
    }, forceNewRenderingTimeout: function () {
        this.renderElementsBuffered = false;
        clearTimeout(this._renderTimer);
        clearTimeout(this._resizeTimer);
        this.renderElements()
    }, refreshSizesInternal: function () {
        if (!this.schedulerView.isDestroyed && this.schedulerView.isHorizontal()) {
            var a = this.schedulerView.getTimeSpanRegion(new Date(), null, this.expandToFitView);
            this.getBodyElements().setHeight(a.bottom - a.top)
        }
    }, refreshSizes: function () {
        clearTimeout(this._resizeTimer);
        this._resizeTimer = Ext.Function.defer(this.refreshSizesInternal, this.renderDelay, this)
    }, renderElements: function () {
        if (this.renderElementsBuffered || this.disabled) {
            return
        }
        this.renderElementsBuffered = true;
        clearTimeout(this._renderTimer);
        this._renderTimer = Ext.Function.defer(this.renderElementsInternal, this.renderDelay, this)
    }, setElementX: function (b, a) {
        if (this.panel.rtl) {
            b.setRight(a)
        } else {
            b.setLeft(a)
        }
    }, getHeaderElementPosition: function (b) {
        var a = this.schedulerView.getTimeAxisViewModel();
        return Math.round(a.getPositionFromDate(b))
    }, renderBodyElementsInternal: function (a) {
        Ext.DomHelper.append(this.containerEl, this.generateMarkup(false, a))
    }, getHeaderElementData: function (a, b) {
        throw"Abstract method call"
    }, renderHeaderElementsInternal: function (a) {
        var b = this.getHeaderContainerEl();
        if (b) {
            Ext.DomHelper.append(b, this.generateHeaderMarkup(false, a))
        }
    }, renderElementsInternal: function () {
        this.renderElementsBuffered = false;
        if (this.disabled || this.schedulerView.isDestroyed) {
            return
        }
        if (Ext.versions.extjs && !this.schedulerView.el.down("table")) {
            return
        }
        this.removeElements();
        this.renderBodyElementsInternal();
        if (this.showHeaderElements) {
            this.headerContainerEl = null;
            this.renderHeaderElementsInternal()
        }
        if (this.renderingDoneEvent) {
            this.fireEvent(this.renderingDoneEvent, this)
        }
    }, generateMarkup: function (c, b) {
        var e = this.timeAxis.getStart(), a = this.timeAxis.getEnd(), d = this.getElementData(e, a, b, c);
        return this.template.apply(d)
    }, generateHeaderMarkup: function (b, a) {
        var c = this.getHeaderElementData(a, b);
        return this.headerTemplate.apply(c)
    }, getElementData: function (d, c, a, b) {
        throw"Abstract method call"
    }, updateBodyElement: function (b) {
        var c = Ext.get(this.getElementId(b));
        if (c) {
            var e = this.timeAxis.getStart(), a = this.timeAxis.getEnd(), d = this.getElementData(e, a, [b])[0];
            if (d) {
                c.dom.className = d.$cls;
                c.setTop(d.top);
                this.setElementX(c, d.left);
                c.setSize(d.width, d.height)
            } else {
                Ext.destroy(c)
            }
        } else {
            this.renderBodyElementsInternal([b])
        }
    }, updateHeaderElement: function (a) {
        var b = Ext.get(this.getHeaderElementId(a));
        if (b) {
            var c = this.getHeaderElementData([a])[0];
            if (c) {
                b.dom.className = c.cls;
                if (this.schedulerView.isHorizontal()) {
                    this.setElementX(b, c.position);
                    b.setWidth(c.size)
                } else {
                    b.setTop(c.position);
                    b.setHeight(c.size)
                }
            } else {
                Ext.destroy(b)
            }
        } else {
            this.renderHeaderElementsInternal([a])
        }
    }, onDestroy: function () {
        clearTimeout(this._renderTimer);
        clearTimeout(this._resizeTimer);
        if (this.store.autoDestroy) {
            this.store.destroy()
        }
        this.store.un(this.storeListeners)
    }, refreshSingle: function (b, a) {
        Ext.each(a, this.updateBodyElement, this);
        if (this.showHeaderElements) {
            Ext.each(a, this.updateHeaderElement, this)
        }
    }})
}
Ext.define("Sch.feature.DragCreator", {requires: ["Ext.XTemplate", "Sch.util.Date", "Sch.util.ScrollManager", "Sch.util.DragTracker", "Sch.tooltip.Tooltip", "Sch.tooltip.ClockTemplate"], disabled: false, showHoverTip: true, showDragTip: true, dragTip: null, dragTolerance: 2, validatorFn: Ext.emptyFn, validatorFnScope: null, hoverTipTemplate: null, constructor: function (a) {
    Ext.apply(this, a || {});
    this.lastTime = new Date();
    this.template = this.template || new Ext.Template('<div class="sch-dragcreator-proxy"><div class="sch-event-inner">&#160;</div></div>', {compiled: true, disableFormats: true});
    this.schedulerView.on("destroy", this.onSchedulerDestroy, this);
    this.schedulerView.el.on("mousemove", this.setupTooltips, this, {single: true});
    this.callParent([a])
}, setDisabled: function (a) {
    this.disabled = a;
    if (this.hoverTip) {
        this.hoverTip.setDisabled(a)
    }
    if (this.dragTip) {
        this.dragTip.setDisabled(a)
    }
}, getProxy: function () {
    if (!this.proxy) {
        this.proxy = this.template.append(this.schedulerView.getSecondaryCanvasEl(), {}, true);
        this.proxy.hide = function () {
            this.setTop(-10000)
        }
    }
    return this.proxy
}, onMouseMove: function (c) {
    var a = this.hoverTip;
    if (a.disabled || this.dragging) {
        return
    }
    if (c.getTarget("." + this.schedulerView.timeCellCls, 5) && !c.getTarget(this.schedulerView.eventSelector)) {
        var b = this.schedulerView.getDateFromDomEvent(c, "floor");
        if (b) {
            if (b - this.lastTime !== 0) {
                this.updateHoverTip(b);
                if (a.hidden) {
                    a[Sch.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Sch.util.Date.DAY) >= 0 ? "addCls" : "removeCls"]("sch-day-resolution");
                    a.show()
                }
            }
        } else {
            a.hide();
            this.lastTime = null
        }
    } else {
        a.hide();
        this.lastTime = null
    }
}, updateHoverTip: function (a) {
    if (a) {
        var b = this.schedulerView.getFormattedDate(a);
        this.hoverTip.update(this.hoverTipTemplate.apply({date: a, text: b}));
        this.lastTime = a
    }
}, onBeforeDragStart: function (d, g) {
    var b = this.schedulerView, a = g.getTarget("." + b.timeCellCls, 5);
    if (a && !g.getTarget(b.eventSelector)) {
        var c = b.resolveResource(a);
        var f = b.getDateFromDomEvent(g);
        if (!this.disabled && a && b.fireEvent("beforedragcreate", b, c, f, g) !== false) {
            this.resourceRecord = c;
            this.originalStart = f;
            this.resourceRegion = b.getScheduleRegion(this.resourceRecord, this.originalStart);
            this.dateConstraints = b.getDateConstraints(this.resourceRecord, this.originalStart);
            return true
        }
    }
    return false
}, onDragStart: function () {
    var c = this, a = c.schedulerView, b = c.getProxy();
    this.dragging = true;
    if (this.hoverTip) {
        this.hoverTip.disable()
    }
    c.start = c.originalStart;
    c.end = c.start;
    c.originalScroll = a.getScroll();
    if (a.getMode() === "horizontal") {
        c.rowBoundaries = {top: c.resourceRegion.top, bottom: c.resourceRegion.bottom};
        b.setRegion({top: c.rowBoundaries.top, right: c.tracker.startXY[0], bottom: c.rowBoundaries.bottom, left: c.tracker.startXY[0]})
    } else {
        c.rowBoundaries = {left: c.resourceRegion.left, right: c.resourceRegion.right};
        b.setRegion({top: c.tracker.startXY[1], right: c.resourceRegion.right, bottom: c.tracker.startXY[1], left: c.resourceRegion.left})
    }
    b.show();
    a.fireEvent("dragcreatestart", a);
    if (c.showDragTip) {
        c.dragTip.enable();
        c.dragTip.update(c.start, c.end, true);
        c.dragTip.show(b);
        c.dragTip.el.setStyle("visibility", "visible")
    }
    Sch.util.ScrollManager.activate(a.el, a.getMode() === "horizontal" ? "horizontal" : "vertical")
}, onDrag: function (h, b) {
    var d = this, f = d.schedulerView, i = d.tracker.getRegion(), a = f.getStartEndDatesFromRegion(i, "round");
    if (!a) {
        return
    }
    d.start = a.start || d.start;
    d.end = a.end || d.end;
    var j = d.dateConstraints;
    if (j) {
        d.end = Sch.util.Date.constrain(d.end, j.start, j.end);
        d.start = Sch.util.Date.constrain(d.start, j.start, j.end)
    }
    d.valid = this.validatorFn.call(d.validatorFnScope || d, d.resourceRecord, d.start, d.end) !== false;
    if (d.showDragTip) {
        d.dragTip.update(d.start, d.end, d.valid)
    }
    Ext.apply(i, d.rowBoundaries);
    var g = f.getScroll();
    var c = this.getProxy();
    c.setRegion(i);
    if (f.isHorizontal()) {
        c.setY(d.resourceRegion.top + d.originalScroll.top - g.top)
    }
}, eventSwallower: function (a) {
    a.stopPropagation();
    a.preventDefault()
}, onDragEnd: function (g, h) {
    var f = this, c = f.schedulerView, d = true, a = h.getTarget(), b = Ext.get(a);
    b.on("click", this.eventSwallower);
    setTimeout(function () {
        b.un("click", this.eventSwallower)
    }, 100);
    f.dragging = false;
    if (f.showDragTip) {
        f.dragTip.disable()
    }
    if (!f.start || !f.end || (f.end - f.start <= 0)) {
        f.valid = false
    }
    f.createContext = {start: f.start, end: f.end, resourceRecord: f.resourceRecord, e: h, finalize: function () {
        f.finalize.apply(f, arguments)
    }};
    if (f.valid) {
        d = c.fireEvent("beforedragcreatefinalize", f, f.createContext, h) !== false
    }
    if (d) {
        f.finalize(f.valid)
    }
    Sch.util.ScrollManager.deactivate()
}, finalize: function (a) {
    var b = this.createContext;
    var d = this.schedulerView;
    if (a) {
        var c = Ext.create(d.eventStore.model);
        if (Ext.data.TreeStore && d.eventStore instanceof Ext.data.TreeStore) {
            c.set("leaf", true);
            d.eventStore.append(c)
        }
        c.assign(b.resourceRecord);
        c.setStartEndDate(b.start, b.end);
        d.fireEvent("dragcreateend", d, c, b.resourceRecord, b.e)
    } else {
        this.proxy.hide()
    }
    this.schedulerView.fireEvent("afterdragcreate", d);
    if (this.hoverTip) {
        this.hoverTip.enable()
    }
}, tipCfg: {trackMouse: true, bodyCssClass: "sch-hovertip", autoHide: false, dismissDelay: 1000, showDelay: 300}, dragging: false, setupTooltips: function () {
    var c = this, a = c.schedulerView, d = a.up("[lockable=true]").el;
    c.tracker = new Sch.util.DragTracker({el: a.el, tolerance: c.dragTolerance, listeners: {mousedown: c.verifyLeftButtonPressed, beforedragstart: c.onBeforeDragStart, dragstart: c.onDragStart, drag: c.onDrag, dragend: c.onDragEnd, scope: c}});
    if (this.showDragTip) {
        var b = this.dragTip;
        if (b instanceof Ext.tip.ToolTip) {
            Ext.applyIf(b, {schedulerView: a});
            b.on("beforeshow", function () {
                return c.dragging
            })
        } else {
            this.dragTip = new Sch.tooltip.Tooltip(Ext.apply({cls: "sch-dragcreate-tip", constrainTo: d, schedulerView: a, listeners: {beforeshow: function () {
                return c.dragging
            }}}, b))
        }
    }
    if (c.showHoverTip) {
        var e = a.el;
        c.hoverTipTemplate = c.hoverTipTemplate || new Sch.tooltip.ClockTemplate();
        c.hoverTip = new Ext.ToolTip(Ext.applyIf({renderTo: document.body, target: e, disabled: c.disabled}, c.tipCfg));
        c.hoverTip.on("beforeshow", c.tipOnBeforeShow, c);
        a.mon(e, {mouseleave: function () {
            c.hoverTip.hide()
        }, mousemove: c.onMouseMove, scope: c})
    }
}, verifyLeftButtonPressed: function (a, b) {
    return b.button === 0
}, onSchedulerDestroy: function () {
    if (this.hoverTip) {
        this.hoverTip.destroy()
    }
    if (this.dragTip) {
        this.dragTip.destroy()
    }
    if (this.tracker) {
        this.tracker.destroy()
    }
    if (this.proxy) {
        Ext.destroy(this.proxy);
        this.proxy = null
    }
}, tipOnBeforeShow: function (a) {
    return!this.disabled && !this.dragging && this.lastTime !== null
}});
Ext.define("Sch.feature.SchedulerDragZone", {extend: "Ext.dd.DragZone", requires: ["Sch.tooltip.Tooltip", "Ext.dd.StatusProxy", "Ext.util.Point"], repairHighlight: false, repairHighlightColor: "transparent", containerScroll: false, dropAllowed: "sch-dragproxy", dropNotAllowed: "sch-dragproxy", showTooltip: true, tip: null, tipIsProcessed: false, schedulerView: null, lastXY: null, showExactDropPosition: false, enableCopy: false, enableCopyKey: "SHIFT", validatorFn: function (b, a, c, f, d) {
    return true
}, validatorFnScope: null, copyKeyPressed: false, constructor: function (c, a) {
    if (Ext.isIE8m && window.top !== window) {
        Ext.dd.DragDropManager.notifyOccluded = true
    }
    var b = this.proxy = this.proxy || new Ext.dd.StatusProxy({shadow: false, dropAllowed: this.dropAllowed, dropNotAllowed: this.dropNotAllowed, ensureAttachedToBody: Ext.emptyFn});
    this.callParent(arguments);
    this.isTarget = true;
    this.scroll = false;
    this.ignoreSelf = false;
    var d = this.schedulerView;
    d.el.appendChild(b.el);
    if (d.rtl) {
        b.addCls("sch-rtl")
    }
    d.on({eventdragstart: function () {
        Sch.util.ScrollManager.activate(d.el, d.constrainDragToResource && d.getMode())
    }, aftereventdrop: function () {
        Sch.util.ScrollManager.deactivate()
    }, scope: this})
}, destroy: function () {
    this.callParent(arguments);
    if (this.tip) {
        this.tip.destroy()
    }
}, autoOffset: function (a, b) {
    this.setDelta(0, 0)
}, setupConstraints: function (k, d, g, e, i, f, c) {
    this.clearTicks();
    var a = i && !this.showExactDropPosition && f > 1 ? f : 0;
    var h = !i && !this.showExactDropPosition && f > 1 ? f : 0;
    this.resetConstraints();
    this.initPageX = k.left + g;
    this.initPageY = k.top + e;
    var b = d.right - d.left;
    var j = d.bottom - d.top;
    if (i) {
        if (c) {
            this.setXConstraint(k.left + g, k.right - b + g, a)
        } else {
            this.setXConstraint(k.left, k.right, a)
        }
        this.setYConstraint(k.top + e, k.bottom - j + e, h)
    } else {
        this.setXConstraint(k.left + g, k.right - b + g, a);
        if (c) {
            this.setYConstraint(k.top + e, k.bottom - j + e, h)
        } else {
            this.setYConstraint(k.top, k.bottom, h)
        }
    }
}, setXConstraint: function (c, b, a) {
    this.leftConstraint = c;
    this.rightConstraint = b;
    this.minX = c;
    this.maxX = b;
    if (a) {
        this.setXTicks(this.initPageX, a)
    }
    this.constrainX = true
}, setYConstraint: function (a, c, b) {
    this.topConstraint = a;
    this.bottomConstraint = c;
    this.minY = a;
    this.maxY = c;
    if (b) {
        this.setYTicks(this.initPageY, b)
    }
    this.constrainY = true
}, onDragEnter: Ext.emptyFn, onDragOut: Ext.emptyFn, setVisibilityForSourceEvents: function (a) {
    Ext.each(this.dragData.eventEls, function (b) {
        b[a ? "show" : "hide"]()
    })
}, onDragOver: function (g) {
    var l = g.type === "scroll" ? this.lastXY : g.getXY();
    this.checkShiftChange();
    var k = this.dragData;
    if (!k.originalHidden) {
        this.setVisibilityForSourceEvents(false);
        k.originalHidden = true
    }
    var b = k.startDate;
    var d = k.newResource;
    var h = this.schedulerView;
    this.updateDragContext(g);
    if (this.showExactDropPosition) {
        var i = h.isHorizontal();
        var a = h.getDateFromCoordinate(i ? l[0] : l[1]) - k.sourceDate;
        var j = new Date(k.origStart - 0 + a);
        var f = h.timeAxisViewModel.getDistanceBetweenDates(j, k.startDate);
        if (k.startDate > h.timeAxis.getStart()) {
            var c = this.proxy.el;
            if (f) {
                if (h.isHorizontal()) {
                    c.setX(l[0] + (this.schedulerView.rtl ? -f : f))
                } else {
                    c.setY(l[1] + f)
                }
            }
        }
    }
    if (k.startDate - b !== 0 || d !== k.newResource) {
        this.schedulerView.fireEvent("eventdrag", this.schedulerView, k.eventRecords, k.startDate, k.newResource, k)
    }
    if (this.showTooltip) {
        this.tip.update(k.startDate, k.endDate, k.valid)
    }
    if (g.type !== "scroll") {
        this.lastXY = g.getXY()
    }
}, getCoordinate: function (a) {
    switch (this.schedulerView.getMode()) {
        case"horizontal":
            return a[0];
        case"vertical":
            return a[1];
        case"calendar":
            return a
    }
}, getDragData: function (q) {
    var o = this.schedulerView, n = q.getTarget(o.eventSelector);
    if (!n) {
        return
    }
    var j = o.resolveEventRecord(n);
    if (!j || j.isDraggable() === false || o.fireEvent("beforeeventdrag", o, j, q) === false) {
        return null
    }
    var h = q.getXY(), a = Ext.get(n), u = a.getXY(), i = [h[0] - u[0], h[1] - u[1]], l = a.getRegion();
    var k = o.getMode() == "horizontal";
    var b = o.resolveResource(n);
    if (o.constrainDragToResource && !b) {
        throw"Resource could not be resolved for event: " + j.getId()
    }
    var r = o.getDateConstraints(o.constrainDragToResource ? b : null, j);
    this.setupConstraints(o.getScheduleRegion(o.constrainDragToResource ? b : null, j), l, i[0], i[1], k, o.getSnapPixelAmount(), Boolean(r));
    var c = j.getStartDate(), m = j.getEndDate(), d = o.timeAxis, g = this.getRelatedRecords(j), p = [a];
    Ext.Array.each(g, function (s) {
        var e = o.getElementFromEventRecord(s);
        if (e) {
            p.push(e)
        }
    });
    var f = {offsets: i, repairXY: u, prevScroll: o.getScroll(), dateConstraints: r, eventEls: p, eventRecords: [j].concat(g), relatedEventRecords: g, resourceRecord: b, sourceDate: o.getDateFromCoordinate(this.getCoordinate(h)), origStart: c, origEnd: m, startDate: c, endDate: m, timeDiff: 0, startsOutsideView: c < d.getStart(), endsOutsideView: m > d.getEnd(), duration: m - c, bodyScroll: Ext.getBody().getScroll(), eventObj: q};
    f.ddel = this.getDragElement(a, f);
    return f
}, onStartDrag: function (b, d) {
    var c = this.schedulerView, a = this.dragData;
    a.eventEls[0].removeCls("sch-event-hover");
    c.fireEvent("eventdragstart", c, a.eventRecords);
    c.el.on("scroll", this.onViewElScroll, this)
}, alignElWithMouse: function (b, e, d) {
    this.callParent(arguments);
    var c = this.getTargetCoord(e, d), a = b.dom ? b : Ext.fly(b, "_dd");
    this.setLocalXY(a, c.x + this.deltaSetXY[0], c.y + this.deltaSetXY[1])
}, onViewElScroll: function (a, d) {
    var e = this.proxy, i = this.schedulerView, g = this.dragData;
    this.setVisibilityForSourceEvents(false);
    var h = e.getXY();
    var f = i.getScroll();
    var c = [h[0] + f.left - g.prevScroll.left, h[1] + f.top - g.prevScroll.top];
    var b = this.deltaSetXY;
    this.deltaSetXY = [b[0] + f.left - g.prevScroll.left, b[1] + f.top - g.prevScroll.top];
    g.prevScroll = f;
    e.setXY(c);
    this.onDragOver(a)
}, getCopyKeyPressed: function () {
    return Boolean(this.enableCopy && this.dragData.eventObj[this.enableCopyKey.toLowerCase() + "Key"])
}, checkShiftChange: function () {
    var b = this.getCopyKeyPressed(), a = this.dragData;
    if (b !== this.copyKeyPressed) {
        this.copyKeyPressed = b;
        if (b) {
            a.refElements.addCls("sch-event-copy");
            this.setVisibilityForSourceEvents(true)
        } else {
            a.refElements.removeCls("sch-event-copy");
            this.setVisibilityForSourceEvents(false)
        }
    }
}, onKey: function (a) {
    if (a.getKey() === a[this.enableCopyKey]) {
        this.checkShiftChange()
    }
}, startDrag: function () {
    if (this.enableCopy) {
        Ext.EventManager.on(document, "keydown", this.onKey, this);
        Ext.EventManager.on(document, "keyup", this.onKey, this)
    }
    var e = this.callParent(arguments);
    var d = this.dragData;
    d.refElement = this.proxy.el.down(".sch-dd-ref");
    d.refElements = this.proxy.el.select(".sch-event");
    d.refElement.removeCls("sch-event-hover");
    if (this.showTooltip) {
        var a = this.schedulerView, c = a.up("[lockable=true]").el;
        if (!this.tipIsProcessed) {
            this.tipIsProcessed = true;
            var b = this.tip;
            if (b instanceof Ext.tip.ToolTip) {
                Ext.applyIf(b, {schedulerView: a, onMyMouseUp: function (f) {
                }})
            } else {
                this.tip = new Sch.tooltip.Tooltip(Ext.apply({schedulerView: a, cls: "sch-dragdrop-tip", constrainTo: c}, b))
            }
        }
        this.tip.update(d.origStart, d.origEnd, true);
        this.tip.el.setStyle("visibility");
        this.tip.show(d.refElement, d.offsets[0])
    }
    this.copyKeyPressed = this.getCopyKeyPressed();
    if (this.copyKeyPressed) {
        d.refElements.addCls("sch-event-copy");
        d.originalHidden = true
    }
    return e
}, endDrag: function () {
    this.schedulerView.el.un("scroll", this.onViewElScroll, this);
    if (this.enableCopy) {
        Ext.EventManager.un(document, "keydown", this.onKey, this);
        Ext.EventManager.un(document, "keyup", this.onKey, this)
    }
    this.callParent(arguments);
    this.proxy.el.setStyle({left: 0, top: 0})
}, updateRecords: function (b) {
    var g = this, i = g.schedulerView, k = i.resourceStore, d = b.newResource, l = b.eventRecords[0], m = [], j = this.getCopyKeyPressed(), c = i.eventStore;
    var f = b.resourceRecord;
    if (j) {
        l = l.fullCopy();
        m.push(l)
    }
    l.beginEdit();
    if (d !== f && f instanceof Sch.model.Resource && d instanceof Sch.model.Resource) {
        if (!j) {
            l.unassign(f)
        }
        l.assign(d)
    }
    l.setStartDate(b.startDate, true, c.skipWeekendsDuringDragDrop);
    l.endEdit();
    var a = b.timeDiff, n = Ext.data.TreeStore && k instanceof Ext.data.TreeStore;
    var h = n ? i.store : k;
    var e = h.indexOf(f) - h.indexOf(d);
    Ext.each(b.relatedEventRecords, function (p) {
        var q = p.getResource(null, c);
        if (j) {
            p = p.fullCopy();
            m.push(p)
        }
        p.beginEdit();
        p.setStartDate(g.adjustStartDate(p.getStartDate(), a), true, c.skipWeekendsDuringDragDrop);
        var o = h.indexOf(q) - e;
        if (o < 0) {
            o = 0
        }
        if (o >= h.getCount()) {
            o = h.getCount() - 1
        }
        p.setResource(h.getAt(o));
        p.endEdit()
    });
    if (m.length) {
        c.append(m)
    }
    i.fireEvent("eventdrop", i, b.eventRecords, j)
}, isValidDrop: function (a, b, c) {
    if (a !== b && c.isAssignedTo(b)) {
        return false
    }
    return true
}, resolveResource: function (g, f) {
    var c = this.proxy.el.dom;
    var h = this.dragData.bodyScroll;
    c.style.display = "none";
    var d = document.elementFromPoint(g[0] - h.left, g[1] - h.top);
    if (Ext.isIE8 && f && f.browserEvent.synthetic) {
        d = document.elementFromPoint(g[0] - h.left, g[1] - h.top)
    }
    c.style.display = "block";
    if (!d) {
        return null
    }
    var a = this.schedulerView;
    if (!d.className.match(a.timeCellCls)) {
        var b = Ext.fly(d).up("." + a.timeCellCls);
        if (b) {
            d = b.dom
        } else {
            return null
        }
    }
    return a.resolveResource(d)
}, adjustStartDate: function (a, c) {
    var b = this.schedulerView;
    return b.timeAxis.roundDate(new Date(a - 0 + c), b.snapRelativeToEventStartDate ? a : false)
}, updateDragContext: function (g) {
    var a = this.dragData, f = g.type === "scroll" ? this.lastXY : g.getXY();
    if (!a.refElement) {
        return
    }
    var d = this.schedulerView, h = a.refElement.getRegion();
    if (d.timeAxis.isContinuous()) {
        if ((d.isHorizontal() && this.minX < f[0] && f[0] < this.maxX) || (d.isVertical() && this.minY < f[1] && f[1] < this.maxY)) {
            var b = d.getDateFromCoordinate(this.getCoordinate(f));
            a.timeDiff = b - a.sourceDate;
            a.startDate = this.adjustStartDate(a.origStart, a.timeDiff);
            a.endDate = new Date(a.startDate - 0 + a.duration)
        }
    } else {
        var c = this.resolveStartEndDates(h);
        a.startDate = c.startDate;
        a.endDate = c.endDate;
        a.timeDiff = a.startDate - a.origStart
    }
    a.newResource = d.constrainDragToResource ? a.resourceRecord : this.resolveResource([h.left + a.offsets[0], h.top + a.offsets[1]], g);
    if (a.newResource) {
        a.valid = this.validatorFn.call(this.validatorFnScope || this, a.eventRecords, a.newResource, a.startDate, a.duration, g)
    } else {
        a.valid = false
    }
}, getRelatedRecords: function (c) {
    var b = this.schedulerView;
    var d = b.selModel;
    var a = [];
    if (d.selected.getCount() > 1) {
        d.selected.each(function (e) {
            if (e !== c && e.isDraggable() !== false) {
                a.push(e)
            }
        })
    }
    return a
}, getDragElement: function (b, e) {
    var c = e.eventEls;
    var g;
    var a = e.offsets[0];
    var f = e.offsets[1];
    if (c.length > 1) {
        var d = Ext.core.DomHelper.createDom({tag: "div", cls: "sch-dd-wrap", style: {overflow: "visible"}});
        Ext.Array.each(c, function (i) {
            g = i.dom.cloneNode(true);
            g.id = Ext.id();
            if (i.dom === b.dom) {
                Ext.fly(g).addCls("sch-dd-ref")
            }
            d.appendChild(g);
            var h = i.getOffsetsTo(b);
            Ext.fly(g).setStyle({left: h[0] - a + "px", top: h[1] - f + "px"})
        });
        return d
    } else {
        g = b.dom.cloneNode(true);
        g.id = Ext.id();
        g.style.left = -a + "px";
        g.style.top = -f + "px";
        Ext.fly(g).addCls("sch-dd-ref");
        return g
    }
}, onDragDrop: function (h, i) {
    this.updateDragContext(h);
    var d = this, b = d.schedulerView, g = d.cachedTarget || Ext.dd.DragDropMgr.getDDById(i), f = d.dragData, a = false, c = true;
    f.ddCallbackArgs = [g, h, i];
    if (this.tip) {
        this.tip.onMyMouseUp()
    }
    if (f.valid && f.startDate && f.endDate) {
        f.finalize = function () {
            d.finalize.apply(d, arguments)
        };
        c = b.fireEvent("beforeeventdropfinalize", d, f, h) !== false;
        if (c && d.isValidDrop(f.resourceRecord, f.newResource, f.eventRecords[0])) {
            a = (f.startDate - f.origStart) !== 0 || f.newResource !== f.resourceRecord
        }
    }
    if (c) {
        d.finalize(f.valid && a)
    }
}, finalize: function (c) {
    var f = this, b = f.schedulerView, d = b.eventStore, g = f.dragData;
    if (f.tip) {
        f.tip.hide()
    }
    if (c) {
        var a, e = function () {
            a = true
        };
        d.on("update", e, null, {single: true});
        f.updateRecords(g);
        d.un("update", e, null, {single: true});
        if (!a) {
            f.onInvalidDrop.apply(f, g.ddCallbackArgs)
        } else {
            if (Ext.isIE9) {
                f.proxy.el.setStyle("visibility", "hidden");
                Ext.Function.defer(f.onValidDrop, 10, f, g.ddCallbackArgs)
            } else {
                f.onValidDrop.apply(f, g.ddCallbackArgs)
            }
            b.fireEvent("aftereventdrop", b, g.eventRecords)
        }
    } else {
        f.onInvalidDrop.apply(f, g.ddCallbackArgs)
    }
}, onInvalidDrop: function (d, c, f) {
    if (Ext.isIE && !c) {
        c = d;
        d = d.getTarget() || document.body
    }
    if (this.tip) {
        this.tip.hide()
    }
    this.setVisibilityForSourceEvents(true);
    var a = this.schedulerView, b = this.callParent([d, c, f]);
    a.fireEvent("aftereventdrop", a, this.dragData.eventRecords);
    return b
}, resolveStartEndDates: function (f) {
    var a = this.dragData, c, e = a.origStart, b = a.origEnd;
    var d = Sch.util.Date;
    if (!a.startsOutsideView) {
        c = this.schedulerView.getStartEndDatesFromRegion(f, "round");
        if (c) {
            e = c.start || a.startDate;
            b = d.add(e, d.MILLI, a.duration)
        }
    } else {
        if (!a.endsOutsideView) {
            c = this.schedulerView.getStartEndDatesFromRegion(f, "round");
            if (c) {
                b = c.end || a.endDate;
                e = d.add(b, d.MILLI, -a.duration)
            }
        }
    }
    return{startDate: e, endDate: b}
}});
Ext.define("Sch.feature.DragDrop", {requires: ["Ext.XTemplate", "Sch.feature.SchedulerDragZone"], validatorFn: function (b, a, c, f, d) {
    return true
}, validatorFnScope: null, dragConfig: null, constructor: function (d, a) {
    Ext.apply(this, a);
    this.schedulerView = d;
    var b = !!document.elementFromPoint;
    if (b) {
        d.eventDragZone = new Sch.feature.SchedulerDragZone(d.ownerCt.el, Ext.apply({ddGroup: d.id, schedulerView: d, validatorFn: this.validatorFn, validatorFnScope: this.validatorFnScope}, this.dragConfig))
    } else {
        if (typeof console !== "undefined") {
            var e = console;
            e.log("WARNING: Your browser does not support document.elementFromPoint required for the Drag drop feature")
        }
    }
    this.schedulerView.on("destroy", this.cleanUp, this);
    this.callParent([a])
}, cleanUp: function () {
    var a = this.schedulerView;
    if (a.eventDragZone) {
        a.eventDragZone.destroy()
    }
}});
Ext.define("Sch.feature.ResizeZone", {extend: "Ext.util.Observable", requires: ["Ext.resizer.Resizer", "Sch.tooltip.Tooltip", "Sch.util.ScrollManager"], showTooltip: true, showExactResizePosition: false, validatorFn: Ext.emptyFn, validatorFnScope: null, schedulerView: null, origEl: null, handlePos: null, eventRec: null, tip: null, tipInstance: null, startScroll: null, constructor: function (a) {
    Ext.apply(this, a);
    var b = this.schedulerView;
    b.on({destroy: this.cleanUp, scope: this});
    b.mon(b.el, {mousedown: this.onMouseDown, mouseup: this.onMouseUp, scope: this, delegate: ".sch-resizable-handle"});
    this.callParent(arguments)
}, onMouseDown: function (f, a) {
    var b = this.schedulerView;
    var d = this.eventRec = b.resolveEventRecord(a);
    var c = d.isResizable();
    if (f.button !== 0 || (c === false || typeof c === "string" && !a.className.match(c))) {
        return
    }
    this.eventRec = d;
    this.handlePos = this.getHandlePosition(a);
    this.origEl = Ext.get(f.getTarget(".sch-event"));
    b.el.on({mousemove: this.onMouseMove, scope: this, single: true})
}, onMouseUp: function (c, a) {
    var b = this.schedulerView;
    b.el.un({mousemove: this.onMouseMove, scope: this, single: true})
}, getTipInstance: function () {
    if (this.tipInstance) {
        return this.tipInstance
    }
    var a = this.schedulerView;
    var c = this.tip;
    var b = a.up("[lockable=true]").el;
    if (c instanceof Ext.tip.ToolTip) {
        Ext.applyIf(c, {schedulerView: a})
    } else {
        c = new Sch.tooltip.Tooltip(Ext.apply({rtl: this.rtl, schedulerView: a, constrainTo: b, cls: "sch-resize-tip", onMyMouseMove: function (d) {
            this.el.alignTo(this.target, "bl-tl", [d.getX() - this.target.getX(), -5])
        }}, c))
    }
    return this.tipInstance = c
}, onMouseMove: function (h, a) {
    var b = this.schedulerView, g = this.eventRec, d = this.handlePos;
    if (!g || b.fireEvent("beforeeventresize", b, g, h) === false) {
        return
    }
    delete this.eventRec;
    h.stopEvent();
    this.resizer = this.createResizer(this.origEl, g, d);
    var c = this.resizer.resizeTracker;
    if (this.showTooltip) {
        var f = this.getTipInstance();
        f.update(g.getStartDate(), g.getEndDate(), true);
        f.show(this.origEl)
    }
    c.onMouseDown(h, this.resizer[d].dom);
    c.onMouseMove(h, this.resizer[d].dom);
    b.fireEvent("eventresizestart", b, g);
    b.el.on("scroll", this.onViewElScroll, this)
}, getHandlePosition: function (b) {
    var a = b.className.match("start");
    if (this.schedulerView.getMode() === "horizontal") {
        if (this.schedulerView.rtl) {
            return a ? "east" : "west"
        }
        return a ? "west" : "east"
    } else {
        return a ? "north" : "south"
    }
}, createResizer: function (b, e, o) {
    var l = this.schedulerView, r = this, f = l.resolveResource(b), q = l.getSnapPixelAmount(), n = l.getScheduleRegion(f, e), p = l.getDateConstraints(f, e), m = b.getHeight(), g = (l.rtl && o[0] === "e") || (!l.rtl && o[0] === "w") || o[0] === "n", h = l.getMode() !== "horizontal", d = {otherEdgeX: g ? b.getRight() : b.getLeft(), otherEdgeY: g ? b.getBottom() : b.getTop(), target: b, isStart: g, startYOffset: b.getY() - b.parent().getY(), startXOffset: b.getX() - b.parent().getX(), dateConstraints: p, resourceRecord: f, eventRecord: e, handles: o[0], minHeight: m, constrainTo: n, listeners: {resizedrag: this.partialResize, resize: this.afterResize, scope: this}};
    var c = b.id;
    var j = "_" + c;
    b.id = b.dom.id = j;
    Ext.cache[j] = Ext.cache[c];
    if (h) {
        if (q > 0) {
            var i = b.getWidth();
            Ext.apply(d, {minHeight: q, minWidth: i, maxWidth: i, heightIncrement: q})
        }
    } else {
        if (q > 0) {
            Ext.apply(d, {minWidth: q, maxHeight: m, widthIncrement: q})
        }
    }
    var k = new Ext.resizer.Resizer(d);
    if (Ext.versions.extjs.match("4.2.3.1477")) {
        k.resizeTracker.un("drag", k.onResize, k);
        k.resizeTracker.on("drag", function (t, u) {
            this.forceHandlesHeight();
            if (this.hasListeners.resizedrag) {
                var s = t.target.getBox();
                return this.fireEvent("resizedrag", this, s.width, s.height, u)
            }
        }, k)
    }
    k.prevId = c;
    if (k.resizeTracker) {
        k.resizeTracker.tolerance = -1;
        var a = k.resizeTracker.updateDimensions;
        k.resizeTracker.updateDimensions = function (t) {
            if (!Ext.isWebKit || t.getTarget(".sch-timelineview")) {
                var s;
                if (h) {
                    s = l.el.getScroll().top - r.startScroll.top;
                    k.resizeTracker.minHeight = d.minHeight - Math.abs(s)
                } else {
                    s = l.el.getScroll().left - r.startScroll.left;
                    k.resizeTracker.minWidth = d.minWidth - Math.abs(s)
                }
                a.apply(this, arguments)
            }
        };
        k.resizeTracker.resize = function (s) {
            var t;
            if (h) {
                t = l.el.getScroll().top - r.startScroll.top;
                if (o[0] === "s") {
                    s.y -= t
                }
                s.height += Math.abs(t)
            } else {
                t = l.el.getScroll().left - r.startScroll.left;
                if (o[0] === "e") {
                    s.x -= t
                }
                s.width += Math.abs(t)
            }
            Ext.resizer.ResizeTracker.prototype.resize.apply(this, arguments)
        }
    }
    b.setStyle("z-index", parseInt(b.getStyle("z-index"), 10) + 1);
    Sch.util.ScrollManager.activate(l.el, l.getMode() === "horizontal" ? "horizontal" : "vertical");
    this.startScroll = l.el.getScroll();
    return k
}, getStartEndDates: function () {
    var e = this.resizer, c = e.el, d = this.schedulerView, b = e.isStart, g, a, f;
    if (b) {
        if (d.getMode() === "horizontal") {
            f = [d.rtl ? c.getRight() : c.getLeft() + 1, c.getTop()]
        } else {
            f = [(c.getRight() + c.getLeft()) / 2, c.getTop()]
        }
        a = e.eventRecord.getEndDate();
        if (d.snapRelativeToEventStartDate) {
            g = d.getDateFromXY(f);
            g = d.timeAxis.roundDate(g, e.eventRecord.getStartDate())
        } else {
            g = d.getDateFromXY(f, "round")
        }
    } else {
        if (d.getMode() === "horizontal") {
            f = [d.rtl ? c.getLeft() : c.getRight(), c.getBottom()]
        } else {
            f = [(c.getRight() + c.getLeft()) / 2, c.getBottom()]
        }
        g = e.eventRecord.getStartDate();
        if (d.snapRelativeToEventStartDate) {
            a = d.getDateFromXY(f);
            a = d.timeAxis.roundDate(a, e.eventRecord.getEndDate())
        } else {
            a = d.getDateFromXY(f, "round")
        }
    }
    g = g || e.start;
    a = a || e.end;
    if (e.dateConstraints) {
        g = Sch.util.Date.constrain(g, e.dateConstraints.start, e.dateConstraints.end);
        a = Sch.util.Date.constrain(a, e.dateConstraints.start, e.dateConstraints.end)
    }
    return{start: g, end: a}
}, partialResize: function (n, q, o, t) {
    var l = this.schedulerView, f = t.type === "scroll" ? this.resizer.resizeTracker.lastXY : t.getXY(), m = this.getStartEndDates(f), d = m.start, c = m.end, b = n.eventRecord, k = l.getMode(), i = l.isHorizontal();
    if (i) {
        n.target.el.setY(n.target.parent().getY() + n.startYOffset)
    } else {
        n.target.el.setX(n.target.parent().getX() + n.startXOffset)
    }
    if (this.showTooltip) {
        var p = this.validatorFn.call(this.validatorFnScope || this, n.resourceRecord, b, d, c) !== false;
        this.getTipInstance().update(d, c, p)
    }
    if (this.showExactResizePosition) {
        var u = n.target.el, h, j, g;
        if (n.isStart) {
            if (l.getMode() === "calendar") {
                var a = l.calendar.getEventColumns(b)[0];
                h = l.timeAxisViewModel.getDistanceBetweenDates(d, a.end)
            } else {
                h = l.timeAxisViewModel.getDistanceBetweenDates(d, b.getEndDate())
            }
            if (i) {
                j = l.getDateFromCoordinate(n.otherEdgeX - Math.min(q, n.maxWidth)) || d;
                g = l.timeAxisViewModel.getDistanceBetweenDates(j, d);
                u.setWidth(h);
                u.setX(u.getX() + g)
            } else {
                j = l.getDateFromCoordinate(n.otherEdgeY - Math.min(q, n.maxHeight)) || d;
                g = l.timeAxisViewModel.getDistanceBetweenDates(j, d);
                u.setHeight(h);
                u.setY(u.getY() + g)
            }
        } else {
            h = l.timeAxisViewModel.getDistanceBetweenDates(b.getStartDate(), c);
            if (i) {
                u.setWidth(h)
            } else {
                u.setHeight(h)
            }
        }
    } else {
        if (!d || !c || ((n.start - d === 0) && (n.end - c === 0))) {
            return
        }
    }
    n.end = c;
    n.start = d;
    l.fireEvent("eventpartialresize", l, b, d, c, n.el)
}, onViewElScroll: function (b, a) {
    this.resizer.resizeTracker.onDrag.apply(this.resizer.resizeTracker, arguments);
    this.partialResize(this.resizer, 0, 0, b)
}, afterResize: function (a, m, f, g) {
    var j = this, i = a.resourceRecord, k = a.eventRecord, d = k.getStartDate(), p = k.getEndDate(), b = a.start || d, c = a.end || p, o = j.schedulerView, n = false, l = true;
    Sch.util.ScrollManager.deactivate();
    o.el.un("scroll", this.onViewElScroll, this);
    if (this.showTooltip) {
        this.getTipInstance().hide()
    }
    o.el.select("[id^=calendar-resizer-placeholder]").remove();
    delete Ext.cache[a.el.id];
    a.el.id = a.el.dom.id = a.el.id.substr(1);
    j.resizeContext = {resourceRecord: a.resourceRecord, eventRecord: k, start: b, end: c, finalize: function () {
        j.finalize.apply(j, arguments)
    }};
    if (b && c && (c - b > 0) && ((b - d !== 0) || (c - p !== 0)) && j.validatorFn.call(j.validatorFnScope || j, i, k, b, c, g) !== false) {
        l = o.fireEvent("beforeeventresizefinalize", j, j.resizeContext, g) !== false;
        n = true
    } else {
        o.repaintEventsForResource(i)
    }
    if (l) {
        j.finalize(n)
    }
}, finalize: function (a) {
    var b = this.schedulerView;
    var d = this.resizeContext;
    var c = false;
    d.eventRecord.store.on("update", function () {
        c = true
    }, null, {single: true});
    if (a) {
        if (this.resizer.isStart) {
            d.eventRecord.setStartDate(d.start, false, b.eventStore.skipWeekendsDuringDragDrop)
        } else {
            d.eventRecord.setEndDate(d.end, false, b.eventStore.skipWeekendsDuringDragDrop)
        }
        if (!c) {
            b.repaintEventsForResource(d.resourceRecord)
        }
    } else {
        b.repaintEventsForResource(d.resourceRecord)
    }
    this.resizer.destroy();
    b.fireEvent("eventresizeend", b, d.eventRecord);
    this.resizeContext = null
}, cleanUp: function () {
    if (this.tipInstance) {
        this.tipInstance.destroy()
    }
}});
Ext.define("Sch.feature.Grouping", {extend: "Ext.grid.feature.Grouping", alias: "feature.scheduler_grouping", headerRenderer: Ext.emptyFn, timeAxisViewModel: null, headerCellTpl: '<tpl for="."><div class="sch-grid-group-hd-cell {cellCls}" style="{cellStyle}; width: {width}px;"><span>{value}</span></div></tpl>', renderCells: function (e) {
    var a = [];
    var c = this.timeAxisViewModel.columnConfig[this.timeAxisViewModel.columnLinesFor];
    for (var b = 0; b < c.length; b++) {
        var f = {};
        var d = this.headerRenderer(c[b].start, c[b].end, e.groupInfo.children, f);
        f.value = d;
        f.width = c[b].width;
        a.push(f)
    }
    return this.headerCellTpl.apply(a)
}, constructor: function (b) {
    var a = Ext.getVersion().isLessThan("4.2.2.1144") ? this.get421TplCfg() : this.get422TplCfg();
    Ext.apply(b, {groupTpl: a.concat({priority: 200, shouldRenderCustomCells: function (c) {
        return c.view.ownerCt !== c.view.ownerCt.ownerLockable.lockedGrid && this.groupingFeature.headerRenderer !== Ext.emptyFn
    }, syncRowHeights: function (f, k) {
        f = Ext.fly(f, "syncDest");
        k = Ext.fly(k, "sycSrc");
        var d = this.owner, g = f.down(d.eventSelector, true), h, i = f.down(d.summaryRowSelector, true), e, c, j;
        if (g && (h = k.down(d.eventSelector, true))) {
            g.style.height = h.style.height = "";
            if ((c = g.offsetHeight) > (j = h.offsetHeight)) {
                Ext.fly(h).setHeight(c)
            } else {
                if (j > c) {
                    Ext.fly(g).setHeight(j)
                }
            }
        }
        if (i && (e = k.down(d.summaryRowSelector, true))) {
            i.style.height = e.style.height = "";
            if ((c = i.offsetHeight) > (j = e.offsetHeight)) {
                Ext.fly(e).setHeight(c)
            } else {
                if (j > c) {
                    Ext.fly(i).setHeight(j)
                }
            }
        }
    }, syncContent: function (d, i) {
        d = Ext.fly(d, "syncDest");
        i = Ext.fly(i, "sycSrc");
        var c = this.owner, f = d.down(c.eventSelector, true), e = i.down(c.eventSelector, true), h = d.down(c.summaryRowSelector, true), g = i.down(c.summaryRowSelector, true);
        if (f && e) {
            Ext.fly(f).syncContent(e)
        }
        if (h && g) {
            Ext.fly(h).syncContent(g)
        }
    }})});
    this.callParent(arguments)
}, get422TplCfg: function () {
    return["{%", "var me = this.groupingFeature;", "if (me.disabled) {", "values.needsWrap = false;", "} else {", "me.setupRowData(values.record, values.rowIndex, values);", "}", "%}", '<tpl if="needsWrap">', '<tr {[values.isCollapsedGroup ? ("id=\\"" + values.rowId + "\\"") : ""]} data-boundView="{view.id}" data-recordId="{record.internalId:htmlEncode}" data-recordIndex="{[values.isCollapsedGroup ? -1 : values.recordIndex]}" ', 'class="{[values.itemClasses.join(" ")]} ', Ext.baseCSSPrefix, 'grid-wrap-row<tpl if="!summaryRecord"> ', Ext.baseCSSPrefix, 'grid-group-row</tpl>" {ariaRowAttr}>', '<td class="', Ext.baseCSSPrefix, "group-hd-container", '<tpl if="this.shouldRenderCustomCells(values)">', " sch-grid-group-custom-header", "</tpl>", '" colspan="{columns.length}" {ariaCellAttr}>', '<tpl if="isFirstRow">', "{%", 'var groupTitleStyle = (!values.view.lockingPartner || (values.view.ownerCt === values.view.ownerCt.ownerLockable.lockedGrid) || (values.view.lockingPartner.headerCt.getVisibleGridColumns().length === 0)) ? "" : "visibility:hidden";', "%}", '<tpl if="!this.shouldRenderCustomCells(values)">', '<div id="{groupId}" class="', Ext.baseCSSPrefix, 'grid-group-hd {collapsibleCls}" tabIndex="0" hidefocus="on" {ariaCellInnerAttr}>', '<div class="', Ext.baseCSSPrefix, 'grid-group-title" style="{[groupTitleStyle]}" {ariaGroupTitleAttr}>', '{[values.groupHeaderTpl.apply(values.groupInfo, parent) || "&#160;"]}', "</div>", "</div>", "<tpl else>", '<div id="{groupId}" class="', Ext.baseCSSPrefix, 'grid-group-hd {collapsibleCls}" tabIndex="0" hidefocus="on" {ariaCellInnerAttr}>', '{[this.groupingFeature.renderCells(values) || "&#160;"]}', "</div>", "</tpl>", "</tpl>", '<tpl if="summaryRecord || !isCollapsedGroup">', '<table class="', Ext.baseCSSPrefix, "{view.id}-table ", Ext.baseCSSPrefix, "grid-table", '<tpl if="summaryRecord"> ', Ext.baseCSSPrefix, 'grid-table-summary</tpl>"', 'border="0" cellspacing="0" cellpadding="0" style="width:100%" {ariaSummaryTableAttr}>', "{[values.view.renderColumnSizer(out)]}", '<tpl if="!isCollapsedGroup">', "{%", "values.itemClasses.length = 0;", "this.nextTpl.applyOut(values, out, parent);", "%}", "</tpl>", '<tpl if="summaryRecord">', "{%me.outputSummaryRecord(values.summaryRecord, values, out);%}", "</tpl>", "</table>", "</tpl>", "</td>", "</tr>", "<tpl else>", "{%this.nextTpl.applyOut(values, out, parent);%}", "</tpl>"]
}, get421TplCfg: function () {
    return["{%", "var me = this.groupingFeature;", "if (me.disabled) {", "values.needsWrap = false;", "} else {", "me.setupRowData(values.record, values.recordIndex, values);", "values.needsWrap = !me.disabled && (values.isFirstRow || values.summaryRecord);", "}", "%}", '<tpl if="needsWrap">', '<tr data-boundView="{view.id}" data-recordId="{record.internalId}" data-recordIndex="{[values.isCollapsedGroup ? -1 : values.recordIndex]}"', 'class="{[values.itemClasses.join(" ")]} ' + Ext.baseCSSPrefix + 'grid-wrap-row<tpl if="!summaryRecord"> ' + Ext.baseCSSPrefix + 'grid-group-row</tpl>">', '<td class="' + Ext.baseCSSPrefix + 'group-hd-container" colspan="{columns.length}">', '<tpl if="isFirstRow">', "{%", 'var groupTitleStyle = (!values.view.lockingPartner || (values.view.ownerCt === values.view.ownerCt.ownerLockable.lockedGrid) || (values.view.lockingPartner.headerCt.getVisibleGridColumns().length === 0)) ? "" : "visibility:hidden";', "%}", '<tpl if="(values.view.ownerCt === values.view.ownerCt.ownerLockable.lockedGrid) || !this.groupingFeature.headerRenderer || this.groupingFeature.headerRenderer == Ext.emptyFn">', '<div id="{groupId}" class="', Ext.baseCSSPrefix, 'grid-group-hd {collapsibleCls}" tabIndex="0" hidefocus="on" {ariaCellInnerAttr}>', '<div class="', Ext.baseCSSPrefix, 'grid-group-title" style="{[groupTitleStyle]}" {ariaGroupTitleAttr}>', '{[values.groupHeaderTpl.apply(values.groupInfo, parent) || "&#160;"]}', "</div>", "</div>", "<tpl else>", '<div id="{groupId}" class="', Ext.baseCSSPrefix, 'grid-group-hd sch-grid-group-hd {collapsibleCls}" tabIndex="0" hidefocus="on" {ariaCellInnerAttr}>', "{[this.groupingFeature.renderCells(values)]}", "</div>", "</tpl>", "</tpl>", '<tpl if="summaryRecord || !isCollapsedGroup">', '<table class="', Ext.baseCSSPrefix, "{view.id}-table ", Ext.baseCSSPrefix, "grid-table", '<tpl if="summaryRecord"> ', Ext.baseCSSPrefix, 'grid-table-summary</tpl>"', 'border="0" cellspacing="0" cellpadding="0" style="width:100%">', "{[values.view.renderColumnSizer(out)]}", '<tpl if="!isCollapsedGroup">', "{%", "values.itemClasses.length = 0;", "this.nextTpl.applyOut(values, out, parent);", "%}", "</tpl>", '<tpl if="summaryRecord">', "{%me.outputSummaryRecord(values.summaryRecord, values, out);%}", "</tpl>", "</table>", "</tpl>", "</td>", "</tr>", "<tpl else>", "{%this.nextTpl.applyOut(values, out, parent);%}", "</tpl>"]
}, init: function () {
    this.callParent(arguments);
    if (typeof this.headerCellTpl === "string") {
        this.headerCellTpl = new Ext.XTemplate(this.headerCellTpl)
    }
    if (this.view.eventStore) {
        this.timeAxisViewModel = this.view.timeAxisViewModel;
        this.view.mon(this.view.eventStore, {add: this.refreshGroupHeader, remove: this.refreshGroupHeader, update: this.refreshGroupHeader, scope: this})
    }
}, destroy: function () {
    this.callParent(arguments)
}, getNodeIndex: function (b, a) {
    var c = b.resourceStore;
    var d = c.getGroups(c.getGroupString(a.getResource(null, b.eventStore)));
    return b.indexOf(d.children[0])
}, refreshGroupHeader: function (c, b) {
    var d = this, a = d.view;
    b = Ext.isArray(b) ? b : [b];
    Ext.Array.each(b, function (e) {
        a.refreshNode(d.getNodeIndex(a, e))
    })
}});
Ext.define("Sch.eventlayout.Horizontal", {timeAxisViewModel: null, view: null, nbrOfBandsByResource: null, constructor: function (a) {
    Ext.apply(this, a);
    this.nbrOfBandsByResource = {}
}, clearCache: function (a) {
    if (a) {
        delete this.nbrOfBandsByResource[a.internalId]
    } else {
        this.nbrOfBandsByResource = {}
    }
}, getNumberOfBands: function (b, c) {
    if (!this.view.dynamicRowHeight) {
        return 1
    }
    var a = this.nbrOfBandsByResource;
    if (a.hasOwnProperty(b.internalId)) {
        return a[b.internalId]
    }
    return this.calculateNumberOfBands(b, c)
}, getRowHeight: function (b, c) {
    var a = this.view;
    var d = this.getNumberOfBands(b, c);
    return(d * this.timeAxisViewModel.rowHeightHorizontal) - ((d - 1) * a.barMargin)
}, calculateNumberOfBands: function (e, g) {
    var f = [];
    g = g || this.view.eventStore.getEventsForResource(e);
    var d = this.view.timeAxis;
    for (var b = 0; b < g.length; b++) {
        var c = g[b];
        var h = c.getStartDate();
        var a = c.getEndDate();
        if (h && a && d.timeSpanInAxis(h, a)) {
            f[f.length] = {start: h, end: a, event: c}
        }
    }
    return this.applyLayout(f, e)
}, applyLayout: function (a, c) {
    var d = a.slice();
    var b = this;
    d.sort(function (f, e) {
        return b.sortEvents(f.event, e.event)
    });
    return this.nbrOfBandsByResource[c.internalId] = this.layoutEventsInBands(0, d)
}, sortEvents: function (f, d) {
    var g = f.getStartDate(), i = f.getEndDate();
    var e = d.getStartDate(), h = d.getEndDate();
    var c = (g - e === 0);
    if (c) {
        return i > h ? -1 : 1
    } else {
        return(g < e) ? -1 : 1
    }
}, layoutEventsInBands: function (e, b) {
    var a = this.view;
    do {
        var d = b[0], c = e === 0 ? a.barMargin : (e * this.timeAxisViewModel.rowHeightHorizontal - (e - 1) * a.barMargin);
        if (c >= a.cellBottomBorderWidth) {
            c -= a.cellBottomBorderWidth
        }
        while (d) {
            d.top = c;
            Ext.Array.remove(b, d);
            d = this.findClosestSuccessor(d, b)
        }
        e++
    } while (b.length > 0);
    return e
}, findClosestSuccessor: function (a, j) {
    var f = Infinity, b, g = a.end, h, c = a.end - a.start === 0;
    for (var e = 0, d = j.length; e < d; e++) {
        h = j[e].start - g;
        if (h >= 0 && h < f && (h > 0 || j[e].end - j[e].start > 0 || !c)) {
            b = j[e];
            f = h
        }
    }
    return b
}});
Ext.define("Sch.eventlayout.Vertical", {requires: ["Sch.util.Date"], constructor: function (a) {
    Ext.apply(this, a)
}, applyLayout: function (a, f) {
    if (a.length === 0) {
        return
    }
    var v = this;
    a.sort(function (j, i) {
        return v.sortEvents(j.event, i.event)
    });
    var d, c, k = this.view, m = Sch.util.Date, o = 1, s, b, h = f - (2 * k.barMargin), e, r;
    for (var t = 0, q = a.length; t < q; t++) {
        e = a[t];
        d = e.start;
        c = e.end;
        b = this.findStartSlot(a, e);
        var u = this.getCluster(a, t);
        if (u.length > 1) {
            e.left = b.start;
            e.width = b.end - b.start;
            r = 1;
            while (r < (u.length - 1) && u[r + 1].start - e.start === 0) {
                r++
            }
            var p = this.findStartSlot(a, u[r]);
            if (p && p.start < 0.8) {
                u = u.slice(0, r)
            }
        }
        var g = u.length, n = (b.end - b.start) / g;
        for (r = 0; r < g; r++) {
            u[r].width = n;
            u[r].left = b.start + (r * n)
        }
        t += g - 1
    }
    for (t = 0, q = a.length; t < q; t++) {
        a[t].width = a[t].width * h;
        a[t].left = k.barMargin + (a[t].left * h)
    }
}, findStartSlot: function (c, d) {
    var a = this.getPriorOverlappingEvents(c, d), b;
    if (a.length === 0) {
        return{start: 0, end: 1}
    }
    for (b = 0; b < a.length; b++) {
        if (b === 0 && a[0].left > 0) {
            return{start: 0, end: a[0].left}
        } else {
            if (a[b].left + a[b].width < (b < a.length - 1 ? a[b + 1].left : 1)) {
                return{start: a[b].left + a[b].width, end: b < a.length - 1 ? a[b + 1].left : 1}
            }
        }
    }
    return false
}, getPriorOverlappingEvents: function (e, f) {
    var g = Sch.util.Date, h = f.start, b = f.end, c = [];
    for (var d = 0, a = Ext.Array.indexOf(e, f); d < a; d++) {
        if (g.intersectSpans(h, b, e[d].start, e[d].end)) {
            c.push(e[d])
        }
    }
    c.sort(this.sortOverlappers);
    return c
}, sortOverlappers: function (b, a) {
    return b.left < a.left ? -1 : 1
}, getCluster: function (e, g) {
    if (g >= e.length - 1) {
        return[e[g]]
    }
    var c = [e[g]], h = e[g].start, b = e[g].end, a = e.length, f = Sch.util.Date, d = g + 1;
    while (d < a && f.intersectSpans(h, b, e[d].start, e[d].end)) {
        c.push(e[d]);
        h = f.max(h, e[d].start);
        b = f.min(e[d].end, b);
        d++
    }
    return c
}, sortEvents: function (f, d) {
    var g = f.getStartDate(), i = f.getEndDate();
    var e = d.getStartDate(), h = d.getEndDate();
    var c = (g - e === 0);
    if (c) {
        return i > h ? -1 : 1
    } else {
        return(g < e) ? -1 : 1
    }
}});
Ext.define("Sch.column.Summary", {extend: "Ext.grid.column.Column", alias: ["widget.summarycolumn", "plugin.scheduler_summarycolumn"], mixins: ["Ext.AbstractPlugin"], alternateClassName: "Sch.plugin.SummaryColumn", init: Ext.emptyFn, lockableScope: "top", showPercent: false, nbrDecimals: 1, sortable: false, fixed: true, menuDisabled: true, width: 80, dataIndex: "_sch_not_used", timeAxis: null, eventStore: null, constructor: function (a) {
    this.scope = this;
    this.callParent(arguments)
}, beforeRender: function () {
    this.callParent(arguments);
    var a = this.up("tablepanel[lockable=true]");
    this.timeAxis = a.getTimeAxis();
    a.lockedGridDependsOnSchedule = true;
    this.eventStore = a.getEventStore()
}, renderer: function (j, a, g) {
    var h = this.timeAxis, e = this.eventStore, f = h.getStart(), i = h.getEnd(), c = 0, b = this.calculate(e.getEventsForResource(g), f, i);
    if (b <= 0) {
        return""
    }
    if (this.showPercent) {
        var d = Sch.util.Date.getDurationInMinutes(f, i);
        return(Math.round((b * 100) / d)) + " %"
    } else {
        if (b > 1440) {
            return(b / 1440).toFixed(this.nbrDecimals) + " " + Sch.util.Date.getShortNameOfUnit("DAY")
        }
        if (b >= 30) {
            return(b / 60).toFixed(this.nbrDecimals) + " " + Sch.util.Date.getShortNameOfUnit("HOUR")
        }
        return b + " " + Sch.util.Date.getShortNameOfUnit("MINUTE")
    }
}, calculate: function (c, g, d) {
    var e = 0, b, a, f = Sch.util.Date;
    Ext.each(c, function (h) {
        b = h.getStartDate();
        a = h.getEndDate();
        if (f.intersectSpans(g, d, b, a)) {
            e += f.getDurationInMinutes(f.max(b, g), f.min(a, d))
        }
    });
    return e
}});
Ext.define("Sch.column.Resource", {extend: "Ext.grid.Column", alias: "widget.resourcecolumn", align: "center", menuDisabled: true, hideable: false, sortable: false, locked: false, lockable: false, draggable: false, enableLocking: false, model: null, initComponent: function () {
    this.tdCls = (this.tdCls || "") + " sch-timetd";
    this.cls = (this.cls || "") + " sch-resourcecolumn-header";
    this.callParent(arguments)
}});
Ext.define("Sch.column.Day", {extend: "Ext.grid.column.Column", alias: "widget.weekview-day", align: "center", start: null, end: null, draggable: false, groupable: false, hideable: false, sortable: false, menuDisabled: true, enableLocking: false, flex: 1, resizable: false, tdCls: "sch-timetd", initComponent: function () {
    var a = new Date();
    this.addCls("sch-daycolumn-header");
    if (this.isWeekend()) {
        this.addCls("sch-daycolumn-header-weekend");
        this.tdCls = (this.tdCls || "") + " sch-daycolumn-weekend"
    }
    if (this.start.getDate() === a.getDate() && this.start.getMonth() === a.getMonth() && this.start.getYear() === a.getYear()) {
        this.addCls("sch-daycolumn-header-today");
        this.tdCls = (this.tdCls || "") + " sch-daycolumn-today"
    }
    this.callParent(arguments)
}, isWeekend: function () {
    var a = this.start.getDay();
    return a === 6 || a === 0
}});
if (!Ext.ClassManager.get("Sch.view.model.TimeAxis")) {
    Ext.define("Sch.view.model.TimeAxis", {extend: "Ext.util.Observable", requires: ["Ext.Date", "Sch.util.Date", "Sch.preset.Manager"], timeAxis: null, availableWidth: 0, tickWidth: 100, snapToIncrement: false, forceFit: false, headerConfig: null, headers: null, mainHeader: 0, timeAxisColumnWidth: null, resourceColumnWidth: null, calendarColumnWidth: null, timeColumnWidth: null, rowHeightHorizontal: null, rowHeightVertical: null, mode: "horizontal", suppressFit: false, refCount: 0, columnConfig: {}, viewPreset: null, columnLinesFor: "middle", eventStore: null, originalTickWidth: null, constructor: function (a) {
        var c = this;
        Ext.apply(this, a);
        if (this.viewPreset) {
            if (this.viewPreset instanceof Sch.preset.ViewPreset) {
                this.consumeViewPreset(this.viewPreset)
            } else {
                var b = Sch.preset.Manager.getPreset(this.viewPreset);
                b && this.consumeViewPreset(b)
            }
        }
        c.timeAxis.on("reconfigure", c.onTimeAxisReconfigure, c);
        this.callParent(arguments)
    }, destroy: function () {
        this.timeAxis.un("reconfigure", this.onTimeAxisReconfigure, this)
    }, onTimeAxisReconfigure: function (b, a, c) {
        if (!c) {
            this.update()
        }
    }, reconfigure: function (a) {
        this.headers = null;
        Ext.apply(this, a);
        switch (this.mode) {
            case"horizontal":
                this.setTickWidth(this.timeColumnWidth);
                break;
            case"vertical":
                this.setTickWidth(this.rowHeightVertical);
                break;
            case"calendar":
                this.setTickWidth(this.rowHeightVertical);
                break
        }
        this.fireEvent("reconfigure", this)
    }, getColumnConfig: function () {
        return this.columnConfig
    }, update: function (d, b) {
        var e = this.timeAxis, c = this.headerConfig;
        this.availableWidth = Math.max(d || this.availableWidth, 0);
        if (!Ext.isNumber(this.availableWidth)) {
            throw"Invalid available width provided to Sch.view.model.TimeAxis"
        }
        if (this.forceFit && this.availableWidth <= 0) {
            return
        }
        this.columnConfig = {};
        for (var f in c) {
            if (c[f].cellGenerator) {
                this.columnConfig[f] = c[f].cellGenerator.call(this, e.getStart(), e.getEnd())
            } else {
                this.columnConfig[f] = this.createHeaderRow(f, c[f])
            }
        }
        var a = this.calculateTickWidth(this.originalTickWidth);
        if (!Ext.isNumber(a) || a <= 0) {
            throw"Invalid column width calculated in Sch.view.model.TimeAxis"
        }
        this.updateTickWidth(a);
        if (!b) {
            this.fireEvent("update", this)
        }
    }, createHeaderRow: function (a, d) {
        var c = [], e = this, f = d.align, b = Ext.Date.clearTime(new Date());
        e.forEachInterval(a, function (k, g, h) {
            var j = {align: f, start: k, end: g, headerCls: ""};
            if (d.renderer) {
                j.header = d.renderer.call(d.scope || e, k, g, j, h, e.eventStore)
            } else {
                j.header = Ext.Date.format(k, d.dateFormat)
            }
            if (d.unit === Sch.util.Date.DAY && (!d.increment || d.increment === 1)) {
                j.headerCls += " sch-dayheadercell-" + k.getDay();
                if (Ext.Date.clearTime(k, true) - b === 0) {
                    j.headerCls += " sch-dayheadercell-today"
                }
            }
            c.push(j)
        });
        return c
    }, getDistanceBetweenDates: function (b, a) {
        return Math.round(this.getPositionFromDate(a, true) - this.getPositionFromDate(b))
    }, getPositionFromDate: function (e, d) {
        if (this.mode === "calendar") {
            var a = this.rowHeightCalendar || this.rowHeightVertical;
            var c = this.getHeaders();
            var b = this.timeAxis.getStart();
            var g = Sch.util.Date;
            var i = g.mergeDates(b, e, c[1].unit);
            var j = g.getDurationInUnit(b, i, c[1].unit, true) * a;
            var k = Math.round(j);
            if (k === 0 && d) {
                return this.calendarRowsAmount * a
            }
            return k
        } else {
            var h = -1, f = this.timeAxis.getTickFromDate(e);
            if (f >= 0) {
                h = Math.round(this.tickWidth * (f - this.timeAxis.visibleTickStart))
            }
            return h
        }
    }, getDateFromPosition: function (i, l) {
        if (this.mode === "calendar") {
            var b = this.rowHeightCalendar || this.rowHeightVertical;
            var h = Sch.util.Date;
            var c = this.timeAxis.getStart();
            var d = this.getHeaders();
            var j = h.add(c, d[0].splitUnit, Math.floor(i[0] / this.calendarColumnWidth));
            var g = this.timeAxis.first();
            var e = (g.get("end") - g.get("start")) / b;
            var k = h.add(j, h.MILLI, Math.round(i[1] * e));
            if (l) {
                k = this.timeAxis[l + "Date"](k)
            }
            return k
        } else {
            var f = i / this.getTickWidth() + this.timeAxis.visibleTickStart, a = this.timeAxis.getCount();
            if (f < 0 || f > a) {
                return null
            }
            return this.timeAxis.getDateFromTick(f, l)
        }
    }, getSingleUnitInPixels: function (a) {
        return Sch.util.Date.getUnitToBaseUnitRatio(this.timeAxis.getUnit(), a) * this.tickWidth / this.timeAxis.increment
    }, getSnapPixelAmount: function () {
        if (this.snapToIncrement) {
            var a = this.timeAxis.getResolution();
            return(a.increment || 1) * this.getSingleUnitInPixels(a.unit)
        } else {
            return 1
        }
    }, getTickWidth: function () {
        return this.tickWidth
    }, setTickWidth: function (b, a) {
        this.originalTickWidth = b;
        this.updateTickWidth(b);
        this.update(null, a)
    }, updateTickWidth: function (a) {
        this.tickWidth = a;
        switch (this.mode) {
            case"horizontal":
                this.timeColumnWidth = a;
                break;
            case"vertical":
                this.rowHeightVertical = a;
                break;
            case"calendar":
                this.rowHeightVertical = a;
                break
        }
    }, getTotalWidth: function () {
        return Math.round(this.tickWidth * this.timeAxis.getVisibleTickTimeSpan())
    }, calculateTickWidth: function (e) {
        var k = this.forceFit;
        var h = this.timeAxis;
        var c = 0, g = h.getUnit(), j = Number.MAX_VALUE, d = Sch.util.Date;
        if (this.snapToIncrement) {
            var f = h.getResolution();
            j = d.getUnitToBaseUnitRatio(g, f.unit) * f.increment
        } else {
            var i = d.getMeasuringUnit(g);
            j = Math.min(j, d.getUnitToBaseUnitRatio(g, i))
        }
        var b = Math[k ? "floor" : "round"](this.getAvailableWidth() / h.getVisibleTickTimeSpan());
        if (!this.suppressFit) {
            c = (k || e < b) ? b : e;
            if (j > 0 && (!k || j < 1)) {
                var a = Ext.versions.touch && k ? "ceil" : (k ? "floor" : "round");
                c = Math.round(Math.max(1, Math[a](j * c)) / j)
            }
        } else {
            c = e
        }
        return c
    }, getAvailableWidth: function () {
        return this.availableWidth
    }, setAvailableWidth: function (a) {
        this.availableWidth = Math.max(0, a);
        var b = this.calculateTickWidth(this.originalTickWidth);
        if (b !== this.tickWidth) {
            this.update()
        }
    }, fitToAvailableWidth: function (a) {
        var b = Math.floor(this.availableWidth / this.timeAxis.getVisibleTickTimeSpan());
        this.setTickWidth(b, a)
    }, setForceFit: function (a) {
        if (a !== this.forceFit) {
            this.forceFit = a;
            this.update()
        }
    }, setSnapToIncrement: function (a) {
        if (a !== this.snapToIncrement) {
            this.snapToIncrement = a;
            this.update()
        }
    }, getViewRowHeight: function () {
        var a = this.mode == "horizontal" ? this.rowHeightHorizontal : this.rowHeightVertical;
        if (!a) {
            throw"rowHeight info not available"
        }
        return a
    }, setViewRowHeight: function (c, a) {
        var d = this.mode === "horizontal";
        var b = "rowHeight" + Ext.String.capitalize(this.mode);
        if (this[b] != c) {
            this[b] = c;
            if (d) {
                if (!a) {
                    this.fireEvent("update", this)
                }
            } else {
                this.setTickWidth(c, a)
            }
        }
    }, setViewColumnWidth: function (b, a) {
        switch (this.mode) {
            case"horizontal":
                this.setTickWidth(b, a);
                break;
            case"vertical":
                this.resourceColumnWidth = b;
                break;
            case"calendar":
                this.calendarColumnWidth = b;
                break
        }
        if (!a) {
            this.fireEvent("columnwidthchange", this, b)
        }
    }, getHeaders: function () {
        if (this.headers) {
            return this.headers
        }
        var a = this.headerConfig;
        this.mainHeader = a.top ? 1 : 0;
        return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || [])
    }, getMainHeader: function () {
        return this.getHeaders()[this.mainHeader]
    }, getBottomHeader: function () {
        var a = this.getHeaders();
        return a[a.length - 1]
    }, forEachInterval: function (b, a, d) {
        d = d || this;
        var c = this.headerConfig;
        if (!c) {
            return
        }
        if (b === "top" || (b === "middle" && c.bottom)) {
            var e = c[b];
            this.timeAxis.forEachAuxInterval(e.unit, e.increment, a, d)
        } else {
            this.timeAxis.each(function (g, f) {
                return a.call(d, g.data.start, g.data.end, f)
            })
        }
    }, forEachMainInterval: function (a, b) {
        this.forEachInterval("middle", a, b)
    }, consumeViewPreset: function (a) {
        this.headers = null;
        var b = this.mode == "horizontal";
        Ext.apply(this, {headerConfig: a.headerConfig, columnLinesFor: a.columnLinesFor || "middle", rowHeightHorizontal: a.rowHeight, tickWidth: b ? a.timeColumnWidth : a.timeRowHeight || a.timeColumnWidth || 60, timeColumnWidth: a.timeColumnWidth, rowHeightVertical: a.timeRowHeight || a.timeColumnWidth || 60, timeAxisColumnWidth: a.timeAxisColumnWidth, resourceColumnWidth: a.resourceColumnWidth || 100, calendarColumnWidth: a.calendarColumnWidth || 100});
        this.originalTickWidth = this.tickWidth
    }})
}
Ext.define("Sch.view.HorizontalTimeAxis", {extend: "Ext.util.Observable", requires: ["Ext.XTemplate"], trackHeaderOver: true, compactCellWidthThreshold: 15, baseCls: "sch-column-header", tableCls: "sch-header-row", headerHtmlRowTpl: '<table border="0" cellspacing="0" cellpadding="0" style="width: {totalWidth}px; {tstyle}" class="{{tableCls}} sch-header-row-{position} {cls}"><thead><tr><tpl for="cells"><td class="{{baseCls}} {headerCls}" style="position : static; text-align: {align}; width: {width}px; {style}" tabIndex="0"headerPosition="{parent.position}" headerIndex="{[xindex-1]}"><div class="sch-simple-timeheader">{header}</div></td></tpl></tr></thead></table>', model: null, hoverCls: "", containerEl: null, height: null, constructor: function (d) {
    var e = this;
    var b = !!Ext.versions.touch;
    var a = b ? "tap" : "click";
    Ext.apply(this, d);
    e.callParent(arguments);
    e.model.on("update", e.onModelUpdate, this, {priority: 5});
    e.containerEl = Ext.get(e.containerEl);
    if (!(e.headerHtmlRowTpl instanceof Ext.Template)) {
        e.headerHtmlRowTpl = e.headerHtmlRowTpl.replace("{{baseCls}}", this.baseCls).replace("{{tableCls}}", this.tableCls);
        e.headerHtmlRowTpl = new Ext.XTemplate(e.headerHtmlRowTpl)
    }
    if (e.trackHeaderOver && e.hoverCls) {
        e.containerEl.on({mousemove: e.highlightCell, delegate: ".sch-column-header", scope: e});
        e.containerEl.on({mouseleave: e.clearHighlight, scope: e})
    }
    var c = {scope: this, delegate: ".sch-column-header"};
    if (b) {
        c.tap = this.onElClick("tap");
        c.doubletap = this.onElClick("doubletap")
    } else {
        c.click = this.onElClick("click");
        c.dblclick = this.onElClick("dblclick");
        c.contextmenu = this.onElClick("contextmenu")
    }
    e._listenerCfg = c;
    if (e.containerEl) {
        e.containerEl.on(c)
    }
}, destroy: function () {
    var a = this;
    if (a.containerEl) {
        a.containerEl.un(a._listenerCfg);
        a.containerEl.un({mousemove: a.highlightCell, delegate: ".sch-simple-timeheader", scope: a});
        a.containerEl.un({mouseleave: a.clearHighlight, scope: a})
    }
    a.model.un({update: a.onModelUpdate, scope: a})
}, onModelUpdate: function () {
    this.render()
}, getHTML: function (e, h, d) {
    var i = this.model.getColumnConfig();
    var g = this.model.getTotalWidth();
    var c = Ext.Object.getKeys(i).length;
    var b = this.height ? this.height / c : 0;
    var f = "";
    var a;
    if (i.top) {
        this.embedCellWidths(i.top);
        f += this.headerHtmlRowTpl.apply({totalWidth: g, cells: i.top, position: "top", tstyle: "border-top : 0;" + (b ? "height:" + b + "px" : "")})
    }
    if (i.middle) {
        this.embedCellWidths(i.middle);
        f += this.headerHtmlRowTpl.apply({totalWidth: g, cells: i.middle, position: "middle", tstyle: (i.top ? "" : "border-top : 0;") + (b ? "height:" + b + "px" : ""), cls: !i.bottom && this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch-header-row-compact" : ""})
    }
    if (i.bottom) {
        this.embedCellWidths(i.bottom);
        f += this.headerHtmlRowTpl.apply({totalWidth: g, cells: i.bottom, position: "bottom", tstyle: (b ? "height:" + b + "px" : ""), cls: this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch-header-row-compact" : ""})
    }
    return f + '<div class="sch-header-secondary-canvas"></div>'
}, render: function () {
    if (!this.containerEl) {
        return
    }
    var e = this.containerEl, f = e.dom, d = f.style.display, a = this.model.getColumnConfig(), b = f.parentNode;
    f.style.display = "none";
    b.removeChild(f);
    var c = this.getHTML();
    f.innerHTML = c;
    if (!a.top && !a.middle) {
        this.containerEl.addCls("sch-header-single-row")
    } else {
        this.containerEl.removeCls("sch-header-single-row")
    }
    b && b.appendChild(f);
    f.style.display = d;
    this.fireEvent("refresh", this)
}, embedCellWidths: function (b) {
    var e = (Ext.isIE7 || Ext.isSafari) ? 1 : 0;
    for (var c = 0; c < b.length; c++) {
        var a = b[c];
        var d = this.model.getDistanceBetweenDates(a.start, a.end);
        if (d) {
            a.width = d - (c ? e : 0)
        } else {
            a.width = 0;
            a.style = "display: none"
        }
    }
}, onElClick: function (a) {
    return function (e, f) {
        f = e.delegatedTarget || f;
        var b = Ext.fly(f).getAttribute("headerPosition"), c = Ext.fly(f).getAttribute("headerIndex"), d = this.model.getColumnConfig()[b][c];
        this.fireEvent("timeheader" + a, this, d.start, d.end, e)
    }
}, highlightCell: function (c, a) {
    var b = this;
    if (a !== b.highlightedCell) {
        b.clearHighlight();
        b.highlightedCell = a;
        Ext.fly(a).addCls(b.hoverCls)
    }
}, clearHighlight: function () {
    var b = this, a = b.highlightedCell;
    if (a) {
        Ext.fly(a).removeCls(b.hoverCls);
        delete b.highlightedCell
    }
}});
Ext.define("Sch.column.timeAxis.Horizontal", {extend: "Ext.grid.column.Column", alias: "widget.timeaxiscolumn", draggable: false, groupable: false, hideable: false, sortable: false, fixed: true, menuDisabled: true, cls: "sch-simple-timeaxis", tdCls: "sch-timetd", enableLocking: false, requires: ["Sch.view.HorizontalTimeAxis"], timeAxisViewModel: null, headerView: null, hoverCls: "", ownHoverCls: "sch-column-header-over", trackHeaderOver: true, compactCellWidthThreshold: 20, initComponent: function () {
    this.callParent(arguments)
}, afterRender: function () {
    var a = this;
    a.headerView = new Sch.view.HorizontalTimeAxis({model: a.timeAxisViewModel, containerEl: a.titleEl, hoverCls: a.ownHoverCls, trackHeaderOver: a.trackHeaderOver, compactCellWidthThreshold: a.compactCellWidthThreshold});
    a.headerView.on("refresh", a.onTimeAxisViewRefresh, a);
    a.ownerCt.on("afterlayout", function () {
        a.mon(a.ownerCt, "resize", a.onHeaderContainerResize, a);
        if (this.getWidth() > 0) {
            if (a.getAvailableWidthForSchedule() === a.timeAxisViewModel.getAvailableWidth()) {
                a.headerView.render()
            } else {
                a.timeAxisViewModel.update(a.getAvailableWidthForSchedule())
            }
            a.setWidth(a.timeAxisViewModel.getTotalWidth())
        }
    }, null, {single: true});
    this.enableBubble("timeheaderclick", "timeheaderdblclick", "timeheadercontextmenu");
    a.relayEvents(a.headerView, ["timeheaderclick", "timeheaderdblclick", "timeheadercontextmenu"]);
    a.callParent(arguments)
}, initRenderData: function () {
    var a = this;
    a.renderData.headerCls = a.renderData.headerCls || a.headerCls;
    return a.callParent(arguments)
}, destroy: function () {
    if (this.headerView) {
        this.headerView.destroy()
    }
    this.callParent(arguments)
}, onTimeAxisViewRefresh: function () {
    this.headerView.un("refresh", this.onTimeAxisViewRefresh, this);
    this.setWidth(this.timeAxisViewModel.getTotalWidth());
    this.headerView.on("refresh", this.onTimeAxisViewRefresh, this)
}, getAvailableWidthForSchedule: function () {
    var c = this.ownerCt.getWidth();
    var a = this.ownerCt.items;
    for (var b = 1; b < a.length; b++) {
        c -= a.get(b).getWidth()
    }
    return c - Ext.getScrollbarSize().width - 1
}, onResize: function () {
    this.callParent(arguments);
    this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule())
}, onHeaderContainerResize: function () {
    this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule());
    this.headerView.render()
}, refresh: function () {
    this.timeAxisViewModel.update(null, true);
    this.headerView.render()
}});
Ext.define("Sch.column.timeAxis.Vertical", {extend: "Ext.grid.column.Column", alias: "widget.verticaltimeaxis", align: "right", draggable: false, groupable: false, hideable: false, sortable: false, menuDisabled: true, timeAxis: null, timeAxisViewModel: null, cellTopBorderWidth: null, cellBottomBorderWidth: null, totalBorderWidth: null, enableLocking: false, locked: true, initComponent: function () {
    this.callParent(arguments);
    this.tdCls = (this.tdCls || "") + " sch-verticaltimeaxis-cell";
    this.scope = this;
    this.totalBorderWidth = this.cellTopBorderWidth + this.cellBottomBorderWidth
}, afterRender: function () {
    this.callParent(arguments);
    var a = this.up("panel");
    a.getView().on("resize", this.onContainerResize, this)
}, onContainerResize: function (c, b, a) {
    this.timeAxisViewModel.update(a - 21)
}, renderer: function (d, b, a, e) {
    var c = this.timeAxisViewModel.getBottomHeader();
    b.style = "height:" + (this.timeAxisViewModel.getTickWidth() - this.totalBorderWidth) + "px";
    if (c.renderer) {
        return c.renderer.call(c.scope || this, a.data.start, a.data.end, b, e)
    } else {
        return Ext.Date.format(a.data.start, c.dateFormat)
    }
}});
Ext.define("Sch.mixin.Lockable", {extend: "Ext.grid.locking.Lockable", useSpacer: true, syncRowHeight: false, horizontalScrollForced: false, injectLockable: function () {
    var j = this;
    var h = Ext.data.TreeStore && j.store instanceof Ext.data.TreeStore;
    var c = j.getEventSelectionModel ? j.getEventSelectionModel() : j.getSelectionModel();
    j.lockedGridConfig = Ext.apply({}, j.lockedGridConfig || {});
    j.normalGridConfig = Ext.apply({}, j.schedulerConfig || j.normalGridConfig || {});
    if (j.lockedXType) {
        j.lockedGridConfig.xtype = j.lockedXType
    }
    if (j.normalXType) {
        j.normalGridConfig.xtype = j.normalXType
    }
    var a = j.lockedGridConfig, i = j.normalGridConfig;
    Ext.applyIf(j.lockedGridConfig, {useArrows: true, split: true, animCollapse: false, collapseDirection: "left", trackMouseOver: false, region: "west"});
    Ext.applyIf(j.normalGridConfig, {viewType: j.viewType, layout: "fit", sortableColumns: false, enableColumnMove: false, enableColumnResize: false, enableColumnHide: false, trackMouseOver: false, getSchedulingView: function () {
        var m = typeof console !== "undefined" ? console : false;
        if (m && m.log) {
            m.log('getSchedulingView is deprecated on the inner grid panel. Instead use getView on the "normal" subgrid.')
        }
        return this.getView()
    }, selModel: c, collapseDirection: "right", animCollapse: false, region: "center"});
    if (j.mode === "vertical") {
        a.store = i.store = j.timeAxis
    }
    if (a.width) {
        j.syncLockedWidth = Ext.emptyFn;
        a.scroll = "horizontal";
        a.scrollerOwner = true
    }
    var e = j.lockedViewConfig = j.lockedViewConfig || {};
    var k = j.normalViewConfig = j.normalViewConfig || {};
    if (h) {
        var g = Ext.tree.View.prototype.onUpdate;
        e.onUpdate = function () {
            this.refreshSize = function () {
                var n = this, m = n.getBodySelector();
                if (m) {
                    n.body.attach(n.el.child(m, true))
                }
            };
            Ext.suspendLayouts();
            g.apply(this, arguments);
            Ext.resumeLayouts();
            this.refreshSize = Ext.tree.View.prototype.refreshSize
        };
        if (Ext.versions.extjs.isLessThan("5.0")) {
            e.store = k.store = j.store.nodeStore
        }
    }
    var f = j.layout;
    var d = a.width;
    this.callParent(arguments);
    this.on("afterrender", function () {
        var m = this.lockedGrid.headerCt.showMenuBy;
        this.lockedGrid.headerCt.showMenuBy = function () {
            m.apply(this, arguments);
            j.showMenuBy.apply(this, arguments)
        }
    });
    var l = j.lockedGrid.getView();
    var b = j.normalGrid.getView();
    this.patchViews();
    if (d || f === "border") {
        if (d) {
            j.lockedGrid.setWidth(d)
        }
        b.addCls("sch-timeline-horizontal-scroll");
        l.addCls("sch-locked-horizontal-scroll");
        j.horizontalScrollForced = true
    }
    if (j.normalGrid.collapsed) {
        j.normalGrid.collapsed = false;
        b.on("boxready", function () {
            j.normalGrid.collapse()
        }, j, {delay: 10})
    }
    if (j.lockedGrid.collapsed) {
        if (l.bufferedRenderer) {
            l.bufferedRenderer.disabled = true
        }
    }
    if (Ext.getScrollbarSize().width === 0) {
        l.addCls("sch-ganttpanel-force-locked-scroll")
    }
    if (h) {
        this.setupLockableTree()
    }
    if (j.useSpacer) {
        b.on("refresh", j.updateSpacer, j);
        l.on("refresh", j.updateSpacer, j)
    }
    if (f !== "fit") {
        j.layout = f
    }
    if (b.bufferedRenderer) {
        this.lockedGrid.on("expand", function () {
            l.el.dom.scrollTop = b.el.dom.scrollTop
        });
        this.patchSubGrid(this.lockedGrid, true);
        this.patchSubGrid(this.normalGrid, false);
        this.patchBufferedRenderingPlugin(b.bufferedRenderer);
        this.patchBufferedRenderingPlugin(l.bufferedRenderer)
    }
    this.patchSyncHorizontalScroll(this.lockedGrid);
    this.patchSyncHorizontalScroll(this.normalGrid);
    this.delayReordererPlugin(this.lockedGrid);
    this.delayReordererPlugin(this.normalGrid);
    this.fixHeaderResizer(this.lockedGrid);
    this.fixHeaderResizer(this.normalGrid)
}, setupLockableTree: function () {
    var c = this;
    var b = c.lockedGrid.getView();
    var a = Sch.mixin.FilterableTreeView.prototype;
    b.initTreeFiltering = a.initTreeFiltering;
    b.onFilterChangeStart = a.onFilterChangeStart;
    b.onFilterChangeEnd = a.onFilterChangeEnd;
    b.onFilterCleared = a.onFilterCleared;
    b.onFilterSet = a.onFilterSet;
    b.initTreeFiltering()
}, patchSyncHorizontalScroll: function (a) {
    a.scrollTask = new Ext.util.DelayedTask(function (d, b) {
        var c = this.getScrollTarget().el;
        if (c) {
            this.syncHorizontalScroll(c.dom.scrollLeft, b)
        }
    }, a)
}, delayReordererPlugin: function (b) {
    var c = b.headerCt;
    var a = c.reorderer;
    if (a) {
        c.un("render", a.onHeaderCtRender, a);
        c.on("render", function () {
            if (!c.isDestroyed) {
                a.onHeaderCtRender()
            }
        }, a, {single: true, delay: 10})
    }
}, fixHeaderResizer: function (a) {
    var c = a.headerCt;
    var d = c.resizer;
    if (d) {
        var b = d.onBeforeStart;
        d.onBeforeStart = function () {
            if (this.activeHd && this.activeHd.isDestroyed) {
                return false
            }
            return b.apply(this, arguments)
        }
    }
}, updateSpacer: function () {
    var g = this.lockedGrid.getView();
    var e = this.normalGrid.getView();
    if (g.rendered && e.rendered && g.el.child("table")) {
        var f = this, c = g.el, d = e.el.dom, b = c.dom.id + "-spacer", h = (d.offsetHeight - d.clientHeight) + "px";
        f.spacerEl = Ext.getDom(b);
        if (Ext.isIE6 || Ext.isIE7 || (Ext.isIEQuirks && Ext.isIE8) && f.spacerEl) {
            Ext.removeNode(f.spacerEl);
            f.spacerEl = null
        }
        if (f.spacerEl) {
            f.spacerEl.style.height = h
        } else {
            var a = c;
            Ext.core.DomHelper.append(a, {id: b, style: "height: " + h})
        }
    }
}, onLockedViewScroll: function () {
    this.callParent(arguments);
    var a = this.lockedGrid.getView().bufferedRenderer;
    if (a) {
        a.onViewScroll()
    }
}, onNormalViewScroll: function () {
    this.callParent(arguments);
    var a = this.normalGrid.getView().bufferedRenderer;
    if (a) {
        a.onViewScroll()
    }
}, patchSubGrid: function (b, a) {
    var f = b.getView();
    var h = f.bufferedRenderer;
    b.on({collapse: function () {
        h.disabled = true
    }, expand: function () {
        h.disabled = false
    }});
    var d = f.collectData;
    f.collectData = function () {
        var k = d.apply(this, arguments);
        var j = k.tableStyle;
        if (j && j[j.length - 1] != "x") {
            k.tableStyle += "px"
        }
        return k
    };
    var e = Ext.data.TreeStore && this.store instanceof Ext.data.TreeStore;
    var g = f.getStore();
    if (!a && e) {
        var i = f.onRemove;
        g.un("bulkremove", f.onRemove, f);
        f.onRemove = function () {
            var j = this;
            if (j.rendered && j.bufferedRenderer) {
                j.refreshView()
            } else {
                i.apply(this, arguments)
            }
        };
        g.on("bulkremove", f.onRemove, f)
    }
    var c = f.onAdd;
    g.un("add", f.onAdd, f);
    f.onAdd = function () {
        var j = this;
        if (j.rendered && j.bufferedRenderer) {
            j.refreshView()
        } else {
            c.apply(this, arguments)
        }
    };
    g.on("add", f.onAdd, f)
}, afterLockedViewLayout: function () {
    if (!this.horizontalScrollForced) {
        return this.callParent(arguments)
    }
}, patchBufferedRenderingPlugin: function (c) {
    c.variableRowHeight = true;
    if (Ext.getVersion("extjs").isLessThan("4.2.1.883")) {
        c.view.on("afterrender", function () {
            c.view.el.un("scroll", c.onViewScroll, c)
        }, this, {single: true, delay: 1});
        var b = c.stretchView;
        c.stretchView = function (e, d) {
            var g = this, f = (g.store.buffered ? g.store.getTotalCount() : g.store.getCount());
            if (f && (g.view.all.endIndex === f - 1)) {
                d = g.bodyTop + e.body.dom.offsetHeight
            }
            b.apply(this, [e, d])
        }
    } else {
        var a = c.enable;
        c.enable = function () {
            if (c.grid.collapsed) {
                return
            }
            return a.apply(this, arguments)
        }
    }
}, showMenuBy: function (b, f) {
    var e = this.getMenu(), c = e.down("#unlockItem"), d = e.down("#lockItem"), a = c.prev();
    a.hide();
    c.hide();
    d.hide()
}, patchViews: function () {
    if (Ext.isIE) {
        var e = this.getSelectionModel();
        var h = this;
        var g = h.lockedGrid.view;
        var f = h.normalGrid.view;
        var a = e.processSelection;
        var d = Ext.getVersion("extjs").isLessThan("4.2.2.1144") ? "mousedown" : "click";
        var c = g.doFocus ? "doFocus" : "focus";
        e.processSelection = function (k, j, m, l, o) {
            var i, n;
            if (o.type == d) {
                i = g.scrollRowIntoView;
                n = g[c];
                g.scrollRowIntoView = f.scrollRowIntoView = Ext.emptyFn;
                g[c] = f[c] = Ext.emptyFn
            }
            a.apply(this, arguments);
            if (o.type == d) {
                g.scrollRowIntoView = f.scrollRowIntoView = i;
                g[c] = f[c] = n;
                g.el.focus()
            }
        };
        var b = f.onRowFocus;
        f.onRowFocus = function (j, i, k) {
            b.call(this, j, i, true)
        };
        if (Ext.tree && Ext.tree.plugin && Ext.tree.plugin.TreeViewDragDrop) {
            g.on("afterrender", function () {
                Ext.each(g.plugins, function (i) {
                    if (i instanceof Ext.tree.plugin.TreeViewDragDrop && i.dragZone) {
                        var j = g[c];
                        i.dragZone.view.un("itemmousedown", i.dragZone.onItemMouseDown, i.dragZone);
                        i.dragZone.view.on("itemmousedown", function () {
                            g[c] = Ext.emptyFn;
                            if (g.editingPlugin) {
                                g.editingPlugin.completeEdit()
                            }
                            i.dragZone.onItemMouseDown.apply(i.dragZone, arguments);
                            g[c] = j
                        });
                        return false
                    }
                })
            }, null, {delay: 100})
        }
    }
}});
if (!Ext.ClassManager.get("Sch.model.Customizable")) {
    Ext.define("Sch.model.Customizable", {extend: "Ext.data.Model", idProperty: null, customizableFields: null, previous: null, __editing: null, __editCounter: 0, constructor: function () {
        var a = this.callParent(arguments);
        return a
    }, onClassExtended: function (b, d, a) {
        var c = a.onBeforeCreated;
        a.onBeforeCreated = function (f, k) {
            c.apply(this, arguments);
            var j = f.prototype;
            if (!j.customizableFields) {
                return
            }
            j.customizableFields = (f.superclass.customizableFields || []).concat(j.customizableFields);
            var g = j.customizableFields;
            var i = {};
            Ext.Array.each(g, function (l) {
                if (typeof l == "string") {
                    l = {name: l}
                }
                i[l.name] = l
            });
            var e = j.fields;
            var h = [];
            e.each(function (l) {
                if (l.isCustomizableField) {
                    h.push(l)
                }
            });
            e.removeAll(h);
            Ext.Object.each(i, function (l, o) {
                o.isCustomizableField = true;
                var p = o.name || o.getName();
                var u = p === "Id" ? "idProperty" : p.charAt(0).toLowerCase() + p.substr(1) + "Field";
                var q = j[u];
                var t = q || p;
                var s;
                if (e.containsKey(t)) {
                    s = Ext.applyIf({name: p, isCustomizableField: true}, e.getByKey(t));
                    e.getByKey(t).isCustomizableField = true;
                    s = new Ext.data.Field(s);
                    g.push(s)
                } else {
                    s = Ext.applyIf({name: t, isCustomizableField: true}, o);
                    s = new Ext.data.Field(s);
                    e.add(t, s)
                }
                var n = Ext.String.capitalize(p);
                if (n != "Id") {
                    var r = "get" + n;
                    var m = "set" + n;
                    if (!j[r] || j[r].__getterFor__ && j[r].__getterFor__ != t) {
                        j[r] = function () {
                            return this.get(t)
                        };
                        j[r].__getterFor__ = t
                    }
                    if (!j[m] || j[m].__setterFor__ && j[m].__setterFor__ != t) {
                        j[m] = function (v) {
                            return this.set(t, v)
                        };
                        j[m].__setterFor__ = t
                    }
                }
            })
        }
    }, set: function (g, b) {
        var a;
        var e;
        var d;
        this.previous = this.previous || {};
        if (arguments.length > 1) {
            a = this.get(g);
            if (a instanceof Date && !(b instanceof Date)) {
                e = this.fields.get(g);
                b = (e.convert || e.getConvert()).call(e, b, this)
            }
            if ((a instanceof Date && (a - b)) || !(a instanceof Date) && a !== b) {
                this.previous[g] = a
            }
        } else {
            for (var f in g) {
                a = this.get(f);
                var c = g[f];
                if (a instanceof Date && !(c instanceof Date)) {
                    e = this.fields.get(f);
                    c = (e.convert || e.getConvert()).call(e, c, this)
                }
                if ((a instanceof Date && (a - c)) || !(a instanceof Date) && a !== c) {
                    this.previous[f] = a
                }
            }
        }
        d = this.callParent(arguments);
        if (!this.__editing) {
            delete this.previous
        }
        return d
    }, reject: function () {
        var b = this, a = b.modified, c;
        b.__editing = true;
        b.previous = b.previous || {};
        for (c in a) {
            if (a.hasOwnProperty(c)) {
                if (typeof a[c] != "function") {
                    b.previous[c] = b.get(c)
                }
            }
        }
        b.callParent(arguments);
        delete b.previous;
        b.__editing = false
    }, beginEdit: function () {
        this.__editCounter++;
        this.__editing = true;
        this.callParent(arguments)
    }, cancelEdit: function () {
        this.__editCounter = 0;
        this.__editing = false;
        this.callParent(arguments);
        delete this.previous
    }, endEdit: function (a, b) {
        if (--this.__editCounter === 0) {
            if (!a && this.getModifiedFieldNames) {
                if (!b) {
                    b = this.getModifiedFieldNames()
                }
                if (b && b.length === 0) {
                    a = true
                }
            }
            this.callParent([a].concat(Array.prototype.slice.call(arguments, 1)));
            this.__editing = false;
            delete this.previous
        }
    }})
}
Ext.define("Sch.model.Range", {extend: "Sch.model.Customizable", requires: ["Sch.util.Date"], idProperty: "Id", config: Ext.versions.touch ? {idProperty: "Id"} : null, startDateField: "StartDate", endDateField: "EndDate", nameField: "Name", clsField: "Cls", customizableFields: [
    {name: "StartDate", type: "date", dateFormat: "c"},
    {name: "EndDate", type: "date", dateFormat: "c"},
    {name: "Cls", type: "string"},
    {name: "Name", type: "string"}
], setStartDate: function (a, d) {
    var c = this.getEndDate();
    var b = this.getStartDate();
    this.set(this.startDateField, a);
    if (d === true && c && b) {
        this.setEndDate(Sch.util.Date.add(a, Sch.util.Date.MILLI, c - b))
    }
}, setEndDate: function (b, d) {
    var a = this.getStartDate();
    var c = this.getEndDate();
    this.set(this.endDateField, b);
    if (d === true && a && c) {
        this.setStartDate(Sch.util.Date.add(b, Sch.util.Date.MILLI, -(c - a)))
    }
}, setStartEndDate: function (c, a) {
    var b = !this.editing;
    b && this.beginEdit();
    this.set(this.startDateField, c);
    this.set(this.endDateField, a);
    b && this.endEdit()
}, getDates: function () {
    var c = [], b = this.getEndDate();
    for (var a = Ext.Date.clearTime(this.getStartDate(), true); a < b; a = Sch.util.Date.add(a, Sch.util.Date.DAY, 1)) {
        c.push(a)
    }
    return c
}, forEachDate: function (b, a) {
    return Ext.each(this.getDates(), b, a)
}, isValid: function () {
    var b = this.callParent(arguments);
    if (b) {
        var c = this.getStartDate(), a = this.getEndDate();
        b = !c || !a || (a - c >= 0)
    }
    return b
}, shift: function (b, a) {
    this.setStartEndDate(Sch.util.Date.add(this.getStartDate(), b, a), Sch.util.Date.add(this.getEndDate(), b, a))
}, fullCopy: function () {
    return this.copy.apply(this, arguments)
}});
Ext.define("Sch.model.TimeAxisTick", {extend: "Sch.model.Range", startDateField: "start", endDateField: "end"});
Ext.define("Sch.model.Event", {extend: "Sch.model.Range", customizableFields: [
    {name: "Id"},
    {name: "ResourceId"},
    {name: "Draggable", type: "boolean", persist: false, defaultValue: true},
    {name: "Resizable", persist: false, defaultValue: true}
], resourceIdField: "ResourceId", draggableField: "Draggable", resizableField: "Resizable", getResource: function (c, b) {
    if (this.stores && this.stores.length > 0 || b) {
        var a = (b || this.stores[0]).getResourceStore();
        c = c || this.get(this.resourceIdField);
        if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
            return a.getNodeById(c) || a.getRootNode().findChildBy(function (d) {
                return d.internalId === c
            })
        } else {
            return a.getById(c) || a.data.map[c]
        }
    }
    return null
}, setResource: function (a) {
    this.set(this.resourceIdField, (a instanceof Ext.data.Model) ? a.getId() || a.internalId : a)
}, assign: function (a) {
    this.setResource.apply(this, arguments)
}, unassign: function (a) {
}, isDraggable: function () {
    return this.getDraggable()
}, isAssignedTo: function (a) {
    return this.getResource() === a
}, isResizable: function () {
    return this.getResizable()
}, isPersistable: function () {
    var b = this.getResources();
    var a = true;
    Ext.each(b, function (c) {
        if (c.phantom) {
            a = false;
            return false
        }
    });
    return a
}, forEachResource: function (d, c) {
    var a = this.getResources();
    for (var b = 0; b < a.length; b++) {
        if (d.call(c || this, a[b]) === false) {
            return
        }
    }
}, getResources: function (a) {
    var b = this.getResource(null, a);
    return b ? [b] : []
}});
if (!Ext.ClassManager.get("Sch.model.Resource")) {
    Ext.define("Sch.model.Resource", {extend: "Sch.model.Customizable", idProperty: "Id", config: Ext.versions.touch ? {idProperty: "Id"} : null, nameField: "Name", customizableFields: ["Id", {name: "Name", type: "string"}], getEventStore: function () {
        return this.stores[0] && this.stores[0].eventStore || this.parentNode && this.parentNode.getEventStore()
    }, getEvents: function (d) {
        var f = this.getId() || this.internalId;
        d = d || this.getEventStore();
        if (d.indexByResource) {
            return d.indexByResource[f] || []
        } else {
            var c = [];
            for (var b = 0, a = d.getCount(); b < a; b++) {
                var e = d.getAt(b);
                if (e.data[e.resourceIdField] === f) {
                    c.push(e)
                }
            }
            return c
        }
    }})
}
Ext.define("Sch.data.mixin.EventStore", {model: "Sch.model.Event", config: {model: "Sch.model.Event"}, requires: ["Sch.util.Date"], isEventStore: true, getResourceStore: function () {
    return this.resourceStore
}, setResourceStore: function (a) {
    if (this.resourceStore) {
        this.resourceStore.un({beforesync: this.onResourceStoreBeforeSync, write: this.onResourceStoreWrite, scope: this})
    }
    this.resourceStore = a;
    if (a) {
        a.on({beforesync: this.onResourceStoreBeforeSync, write: this.onResourceStoreWrite, scope: this})
    }
}, onResourceStoreBeforeSync: function (b, c) {
    var a = b.create;
    if (a) {
        for (var e, d = a.length - 1; d >= 0; d--) {
            e = a[d];
            e._phantomId = e.internalId
        }
    }
}, onResourceStoreWrite: function (c, b) {
    if (b.wasSuccessful()) {
        var d = this, a = b.getRecords();
        Ext.each(a, function (e) {
            if (e._phantomId && !e.phantom) {
                d.each(function (f) {
                    if (f.getResourceId() === e._phantomId) {
                        f.assign(e)
                    }
                })
            }
        })
    }
}, isDateRangeAvailable: function (f, a, b, d) {
    var c = true, e = Sch.util.Date;
    this.forEachScheduledEvent(function (h, g, i) {
        if (e.intersectSpans(f, a, g, i) && d === h.getResource() && (!b || b !== h)) {
            c = false;
            return false
        }
    });
    return c
}, getEventsInTimeSpan: function (d, b, a) {
    if (a !== false) {
        var c = Sch.util.Date;
        return this.queryBy(function (g) {
            var f = g.getStartDate(), e = g.getEndDate();
            return f && e && c.intersectSpans(f, e, d, b)
        })
    } else {
        return this.queryBy(function (g) {
            var f = g.getStartDate(), e = g.getEndDate();
            return f && e && (f - d >= 0) && (b - e >= 0)
        })
    }
}, forEachScheduledEvent: function (b, a) {
    this.each(function (e) {
        var d = e.getStartDate(), c = e.getEndDate();
        if (d && c) {
            return b.call(a || this, e, d, c)
        }
    }, this)
}, getTotalTimeSpan: function () {
    var a = new Date(9999, 0, 1), b = new Date(0), c = Sch.util.Date;
    this.each(function (d) {
        if (d.getStartDate()) {
            a = c.min(d.getStartDate(), a)
        }
        if (d.getEndDate()) {
            b = c.max(d.getEndDate(), b)
        }
    });
    a = a < new Date(9999, 0, 1) ? a : null;
    b = b > new Date(0) ? b : null;
    return{start: a || null, end: b || a || null}
}, getEventsForResource: function (a) {
    return a.getEvents(this)
}, append: function (a) {
    throw"Must be implemented by consuming class"
}, getModel: function () {
    return this.model
}, setAssignmentStore: null, getAssignmentStore: null});
Ext.define("Sch.data.EventStore", {extend: "Ext.data.Store", mixins: ["Sch.data.mixin.EventStore"], storeId: "events", model: "Sch.model.Event", config: {model: "Sch.model.Event"}, isLoadingRecords: false, indexByResource: null, constructor: function (a) {
    if (Ext.versions.extjs) {
        this.mixins.observable.constructor.apply(this, arguments)
    }
    this.indexByResource = {};
    this.on({add: this.onEventAdd, update: this.onEventUpdate, refresh: this.onRefresh, remove: this.onEventRemove, clear: this.onEventStoreClear, addrecords: this.onEventAdd, updaterecord: this.onEventUpdate, removerecords: this.onEventRemove, priority: 100, scope: this});
    this.callParent(arguments);
    if (this.getModel() !== Sch.model.Event && !(this.getModel().prototype instanceof Sch.model.Event)) {
        throw"The model for the EventStore must subclass Sch.model.Event"
    }
}, fillIndexByResource: function () {
    var c = this.indexByResource = {};
    for (var b = 0, a = this.getCount(); b < a; b++) {
        var d = this.getAt(b);
        var e = d.data[d.resourceIdField];
        if (!c[e]) {
            c[e] = []
        }
        c[e].push(d)
    }
}, onEventLoad: function () {
    this.fillIndexByResource()
}, onEventStoreClear: function () {
    this.fillIndexByResource()
}, onRefresh: function () {
    this.fillIndexByResource()
}, loadRecords: function () {
    this.isLoadingRecords = true;
    this.callParent(arguments);
    this.isLoadingRecords = false
}, setRecords: function () {
    this.isLoadingRecords = true;
    this.callParent(arguments);
    this.isLoadingRecords = false
}, onEventAdd: function (e, c) {
    var b = this.indexByResource;
    for (var a = 0; a < c.length; a++) {
        var d = c[a];
        var f = d.data[d.resourceIdField];
        if (!b[f]) {
            b[f] = []
        }
        b[f].push(d)
    }
}, onEventRemove: function (e, c) {
    c = Ext.isArray(c) ? c : [c];
    var b = this.indexByResource;
    for (var a = 0; a < c.length; a++) {
        var d = c[a];
        var f = d.data[d.resourceIdField];
        if (b[f]) {
            Ext.Array.remove(b[f], d)
        }
    }
}, onEventUpdate: function (g, f, b) {
    var e = f.previous || {};
    var h = f.resourceIdField;
    if (b != Ext.data.Model.COMMIT && h in e) {
        var c = this.indexByResource;
        var d = f.data[h];
        var a = e[h];
        if (c[a]) {
            Ext.Array.remove(c[a], f)
        }
        if (!c[d]) {
            c[d] = []
        }
        c[d].push(f)
    }
}, getByInternalId: function (a) {
    if (Ext.versions.extjs && Ext.versions.extjs.isLessThan("5.0")) {
        return this.data.getByKey(a)
    }
    return this.queryBy(function (b) {
        return b.internalId == a
    }).first()
}, append: function (a) {
    this.add(a)
}});
Ext.define("Sch.data.mixin.ResourceStore", {getModel: function () {
    return this.model
}});
Ext.define("Sch.data.FilterableNodeStore", {extend: "Ext.data.NodeStore", onNodeExpand: function (d, c, b) {
    var e = this.treeStore;
    var a = e.isTreeFiltered(true);
    if (a && d == this.node) {
        e.reApplyFilter()
    } else {
        return this.callParent(arguments)
    }
}, handleNodeExpand: function (h, b, j) {
    var f = [];
    var a = this.treeStore;
    var c = a.isTreeFiltered();
    var g = a.currentFilterGeneration;
    for (var d = 0; d < b.length; d++) {
        var e = b[d];
        if (!(c && e.__filterGen != g || e.hidden)) {
            f[f.length] = e
        }
    }
    return this.callParent([h, f, j])
}, onNodeCollapse: function (g, b, i, h, j) {
    var f = this;
    var d = this.data;
    var k = d.contains;
    var a = this.treeStore;
    var c = a.isTreeFiltered();
    var e = a.currentFilterGeneration;
    d.contains = function () {
        var o, n, q;
        var m = f.indexOf(g) + 1;
        var p = false;
        for (var l = 0; l < b.length; l++) {
            if (!(b[l].hidden || c && b[l].__filterGen != e) && k.call(this, b[l])) {
                o = g;
                while (o.parentNode) {
                    n = o;
                    do {
                        n = n.nextSibling
                    } while (n && (n.hidden || c && n.__filterGen != e));
                    if (n) {
                        p = true;
                        q = f.indexOf(n);
                        break
                    } else {
                        o = o.parentNode
                    }
                }
                if (!p) {
                    q = f.getCount()
                }
                f.removeAt(m, q - m);
                break
            }
        }
        return false
    };
    this.callParent(arguments);
    d.contains = k
}, onNodeAppend: function (h, b, d) {
    var g = this, e, i;
    var a = this.treeStore;
    var c = a.isTreeFiltered();
    var f = a.currentFilterGeneration;
    if (c) {
        b.__filterGen = f
    }
    if (g.isVisible(b)) {
        if (d === 0) {
            e = h
        } else {
            i = b;
            do {
                i = i.previousSibling
            } while (i && (i.hidden || c && i.__filterGen != f));
            if (!i) {
                e = h
            } else {
                while (i.isExpanded() && i.lastChild) {
                    i = i.lastChild
                }
                e = i
            }
        }
        g.insert(g.indexOf(e) + 1, b);
        if (!b.isLeaf() && b.isExpanded()) {
            if (b.isLoaded()) {
                g.onNodeExpand(b, b.childNodes, true)
            } else {
                if (!g.treeStore.fillCount) {
                    b.set("expanded", false);
                    b.expand()
                }
            }
        }
    }
}});
Ext.define("Sch.data.mixin.FilterableTreeStore", {requires: ["Sch.data.FilterableNodeStore"], nodeStoreClassName: "Sch.data.FilterableNodeStore", nodeStore: null, isFilteredFlag: false, isHiddenFlag: false, lastTreeFilter: null, lastTreeHiding: null, allowExpandCollapseWhileFiltered: true, reApplyFilterOnDataChange: true, suspendIncrementalFilterRefresh: 0, filterGeneration: 0, currentFilterGeneration: null, dataChangeListeners: null, monitoringDataChange: false, initTreeFiltering: function () {
    if (!this.nodeStore) {
        this.nodeStore = this.createNodeStore(this)
    }
    this.dataChangeListeners = {append: this.onNeedToUpdateFilter, insert: this.onNeedToUpdateFilter, scope: this}
}, startDataChangeMonitoring: function () {
    if (this.monitoringDataChange) {
        return
    }
    this.monitoringDataChange = true;
    this.on(this.dataChangeListeners)
}, stopDataChangeMonitoring: function () {
    if (!this.monitoringDataChange) {
        return
    }
    this.monitoringDataChange = false;
    this.un(this.dataChangeListeners)
}, onNeedToUpdateFilter: function () {
    if (this.reApplyFilterOnDataChange && !this.suspendIncrementalFilterRefresh) {
        this.reApplyFilter()
    }
}, createNodeStore: function (a) {
    return Ext.create(this.nodeStoreClassName, {treeStore: a, recursive: true, rootVisible: this.rootVisible})
}, clearTreeFilter: function () {
    if (!this.isTreeFiltered()) {
        return
    }
    this.currentFilterGeneration = null;
    this.isFilteredFlag = false;
    this.lastTreeFilter = null;
    if (!this.isTreeFiltered(true)) {
        this.stopDataChangeMonitoring()
    }
    this.refreshNodeStoreContent();
    this.fireEvent("filter-clear", this)
}, reApplyFilter: function () {
    if (this.isHiddenFlag) {
        this.hideNodesBy.apply(this, this.lastTreeHiding.concat(this.isFilteredFlag))
    }
    if (this.isFilteredFlag) {
        this.filterTreeBy(this.lastTreeFilter)
    }
}, refreshNodeStoreContent: function (a) {
    var g = this.getRootNode(), i = [];
    var h = this.rootVisible;
    var b = this.isTreeFiltered();
    var e = this;
    var f = this.currentFilterGeneration;
    var d = function (m) {
        if (b && m.__filterGen != f || m.hidden) {
            return
        }
        if (h || m != g) {
            i[i.length] = m
        }
        if (!m.data.leaf && m.isExpanded()) {
            var n = m.childNodes, l = n.length;
            for (var j = 0; j < l; j++) {
                d(n[j])
            }
        }
    };
    d(g);
    this.fireEvent("nodestore-datachange-start", this);
    var c = this.nodeStore;
    if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(i)) {
        c.loadRecords(i)
    }
    if (!a) {
        c.fireEvent("clear", c)
    }
    this.fireEvent("nodestore-datachange-end", this)
}, getIndexInTotalDataset: function (d) {
    var c = this.getRootNode(), f = -1;
    var g = this.rootVisible;
    if (!g && d == c) {
        return-1
    }
    var b = this.isTreeFiltered();
    var h = this;
    var a = this.currentFilterGeneration;
    var e = function (l) {
        if (b && l.__filterGen != a || l.hidden) {
            if (l == d) {
                return false
            }
        }
        if (g || l != c) {
            f++
        }
        if (l == d) {
            return false
        }
        if (!l.data.leaf && l.isExpanded()) {
            var m = l.childNodes, j = m.length;
            for (var i = 0; i < j; i++) {
                if (e(m[i]) === false) {
                    return false
                }
            }
        }
    };
    e(c);
    return f
}, isTreeFiltered: function (a) {
    return this.isFilteredFlag || a && this.isHiddenFlag
}, collectFilteredNodes: function (k, t) {
    var s = this.currentFilterGeneration;
    var o = {};
    var n = this.getRootNode(), e = this.rootVisible, d = [];
    var a = function (u) {
        var i = u.parentNode;
        while (i && !o[i.internalId]) {
            o[i.internalId] = true;
            i = i.parentNode
        }
    };
    var g = t.filter;
    var b = t.scope || this;
    var j = t.shallow;
    var r = t.checkParents || j;
    var h = t.fullMathchingParents;
    var c = t.onlyParents || h;
    if (c && r) {
        throw new Error("Can't combine `onlyParents` and `checkParents` options")
    }
    var m = function (w) {
        if (w.hidden) {
            return
        }
        var u, x, v, i;
        if (w.data.leaf) {
            if (g.call(b, w, o)) {
                d[d.length] = w;
                a(w)
            }
        } else {
            if (e || w != n) {
                d[d.length] = w
            }
            if (c) {
                u = g.call(b, w);
                x = w.childNodes;
                v = x.length;
                if (u) {
                    o[w.internalId] = true;
                    a(w);
                    if (h) {
                        w.cascadeBy(function (y) {
                            if (y != w) {
                                d[d.length] = y;
                                if (!y.data.leaf) {
                                    o[y.internalId] = true
                                }
                            }
                        });
                        return
                    }
                }
                for (i = 0; i < v; i++) {
                    if (u && x[i].data.leaf) {
                        d[d.length] = x[i]
                    } else {
                        if (!x[i].data.leaf) {
                            m(x[i])
                        }
                    }
                }
            } else {
                if (r) {
                    u = g.call(b, w, o);
                    if (u) {
                        o[w.internalId] = true;
                        a(w)
                    }
                }
                if (!r || !j || j && (u || w == n && !e)) {
                    x = w.childNodes;
                    v = x.length;
                    for (i = 0; i < v; i++) {
                        m(x[i])
                    }
                }
            }
        }
    };
    m(k);
    var f = [];
    for (var p = 0, q = d.length; p < q; p++) {
        var l = d[p];
        if (l.data.leaf || o[l.internalId]) {
            f[f.length] = l;
            l.__filterGen = s;
            if (this.allowExpandCollapseWhileFiltered && !l.data.leaf) {
                l.data.expanded = true
            }
        }
    }
    return f
}, filterTreeBy: function (e, c) {
    this.currentFilterGeneration = this.filterGeneration++;
    var b;
    if (arguments.length == 1 && Ext.isObject(arguments[0])) {
        c = e.scope;
        b = e.filter
    } else {
        b = e;
        e = {filter: b, scope: c}
    }
    this.fireEvent("nodestore-datachange-start", this);
    e = e || {};
    var a = this.collectFilteredNodes(this.getRootNode(), e);
    var d = this.nodeStore;
    if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(a)) {
        d.loadRecords(a, false);
        d.fireEvent("clear", d)
    }
    this.startDataChangeMonitoring();
    this.isFilteredFlag = true;
    this.lastTreeFilter = e;
    this.fireEvent("nodestore-datachange-end", this);
    this.fireEvent("filter-set", this)
}, hideNodesBy: function (b, a, d) {
    if (this.isFiltered()) {
        throw new Error("Can't hide nodes of the filtered tree store")
    }
    var c = this;
    a = a || this;
    this.getRootNode().cascadeBy(function (e) {
        e.hidden = b.call(a, e, c)
    });
    this.startDataChangeMonitoring();
    this.isHiddenFlag = true;
    this.lastTreeHiding = [b, a];
    if (!d) {
        this.refreshNodeStoreContent()
    }
}, showAllNodes: function (a) {
    this.getRootNode().cascadeBy(function (b) {
        b.hidden = false
    });
    this.isHiddenFlag = false;
    this.lastTreeHiding = null;
    if (!this.isTreeFiltered(true)) {
        this.stopDataChangeMonitoring()
    }
    if (!a) {
        this.refreshNodeStoreContent()
    }
}, inheritables: function () {
    return{load: function (l) {
        var i = this.getRootNode();
        if (i) {
            var e = this.nodeStore;
            var b = i.removeAll;
            i.removeAll = function () {
                b.apply(this, arguments);
                e && e.fireEvent("clear", e);
                delete i.removeAll
            }
        }
        var a = Ext.getVersion("extjs").isLessThan("4.2.2.1144");
        if (a) {
            l = l || {};
            var f = false;
            var c;
            this.on("beforeload", function (n, m) {
                c = m.node;
                f = c.data.expanded;
                c.data.expanded = false
            }, this, {single: true});
            var j = l.callback;
            var k = l.scope;
            l.callback = function () {
                if (f) {
                    c.expand()
                }
                Ext.callback(j, k, arguments)
            }
        }
        var g = this;
        l = l || {};
        var d = l.callback;
        var h = l.scope;
        l.callback = function () {
            g.suspendIncrementalFilterRefresh--;
            Ext.callback(d, h, arguments)
        };
        this.suspendIncrementalFilterRefresh++;
        this.callParent([l]);
        if (i) {
            delete i.removeAll
        }
    }}
}});
Ext.define("Sch.data.ResourceStore", {extend: "Ext.data.Store", model: "Sch.model.Resource", config: {model: "Sch.model.Resource"}, storeId: "resources", mixins: ["Sch.data.mixin.ResourceStore"], constructor: function () {
    this.callParent(arguments);
    if (this.getModel() !== Sch.model.Resource && !(this.getModel().prototype instanceof Sch.model.Resource)) {
        throw"The model for the ResourceStore must subclass Sch.model.Resource"
    }
}});
Ext.define("Sch.data.ResourceTreeStore", {extend: "Ext.data.TreeStore", model: "Sch.model.Resource", mixins: ["Sch.data.mixin.ResourceStore", "Sch.data.mixin.FilterableTreeStore"], constructor: function () {
    this.callParent(arguments);
    this.initTreeFiltering();
    if (this.getModel() !== Sch.model.Resource && !(this.getModel().prototype instanceof Sch.model.Resource)) {
        throw"The model for the ResourceTreeStore must subclass Sch.model.Resource"
    }
}, setRootNode: function () {
    this.isSettingRoot = true;
    var a = this.callParent(arguments);
    this.isSettingRoot = false;
    return a
}}, function () {
    this.override(Sch.data.mixin.FilterableTreeStore.prototype.inheritables() || {})
});
Ext.define("Sch.data.TimeAxis", {extend: "Ext.data.JsonStore", requires: ["Sch.util.Date", "Sch.model.TimeAxisTick"], model: "Sch.model.TimeAxisTick", continuous: true, originalContinuous: null, autoAdjust: true, unit: null, increment: null, resolutionUnit: null, resolutionIncrement: null, weekStartDay: null, mainUnit: null, shiftUnit: null, shiftIncrement: 1, defaultSpan: 1, isConfigured: false, adjustedStart: null, adjustedEnd: null, visibleTickStart: null, visibleTickEnd: null, presetName: null, mode: "plain", constructor: function (a) {
    var c = this;
    if (c.setModel) {
        c.setModel(c.model)
    }
    c.originalContinuous = c.continuous;
    c.callParent(arguments);
    c.on(Ext.versions.touch ? "refresh" : "datachanged", function (d, e, f) {
        c.fireEvent("reconfigure", c, e, f)
    });
    if (a && a.viewPreset) {
        var b = Sch.preset.Manager.getPreset(a.viewPreset);
        b && c.consumeViewPreset(b)
    }
    if (a && (a.start || c.start)) {
        c.reconfigure(a)
    }
}, reconfigure: function (e, a) {
    this.isConfigured = true;
    Ext.apply(this, e);
    var m = this.getAdjustedDates(e.start, e.end, true);
    var l = this.getAdjustedDates(e.start, e.end);
    var b = l.start;
    var f = l.end;
    if (this.fireEvent("beforereconfigure", this, b, f) !== false) {
        this.fireEvent("beginreconfigure", this);
        var j = this.unit;
        var k = this.increment || 1;
        var i = this.generateTicks(b, f, j, k, this.mainUnit);
        var d = Ext.Object.getKeys(e).length;
        var g = (d === 1 && "start"in e) || (d === 2 && "start"in e && "end"in e);
        this.removeAll(true);
        this.suspendEvents();
        this.add(i);
        if (this.getCount() === 0) {
            Ext.Error.raise("Invalid time axis configuration or filter, please check your input data.")
        }
        this.resumeEvents();
        var c = Sch.util.Date;
        var h = i.length;
        if (this.isContinuous()) {
            this.adjustedStart = m.start;
            this.adjustedEnd = this.getNext(h > 1 ? i[h - 1].start : m.start, j, k)
        } else {
            this.adjustedStart = this.getStart();
            this.adjustedEnd = this.getEnd()
        }
        do {
            this.visibleTickStart = (this.getStart() - this.adjustedStart) / (c.getUnitDurationInMs(j) * k);
            if (this.visibleTickStart >= 1) {
                this.adjustedStart = c.getNext(this.adjustedStart, j, 1)
            }
        } while (this.visibleTickStart >= 1);
        do {
            this.visibleTickEnd = h - (this.adjustedEnd - this.getEnd()) / (c.getUnitDurationInMs(j) * k);
            if (h - this.visibleTickEnd >= 1) {
                this.adjustedEnd = c.getNext(this.adjustedEnd, j, -1)
            }
        } while (h - this.visibleTickEnd >= 1);
        this.fireEvent("datachanged", this, !g, a);
        this.fireEvent("refresh", this, !g, a);
        this.fireEvent("endreconfigure", this)
    }
}, setTimeSpan: function (c, a) {
    var b = this.getAdjustedDates(c, a);
    c = b.start;
    a = b.end;
    if (this.getStart() - c !== 0 || this.getEnd() - a !== 0) {
        this.reconfigure({start: c, end: a})
    }
}, filterBy: function (b, a) {
    this.continuous = false;
    a = a || this;
    this.clearFilter(true);
    this.suspendEvents(true);
    this.filter([
        {filterFn: function (d, c) {
            return b.call(a, d.data, c)
        }}
    ]);
    if (this.getCount() === 0) {
        this.clearFilter();
        this.resumeEvents();
        Ext.Error.raise("Invalid time axis filter - no ticks passed through the filter. Please check your filter method.")
    }
    this.resumeEvents()
}, isContinuous: function () {
    return this.continuous && !this.isFiltered()
}, clearFilter: function () {
    this.continuous = this.originalContinuous;
    this.callParent(arguments)
}, generateTicks: function (a, d, g, i) {
    var h = [], f, b = Sch.util.Date, e = 0;
    g = g || this.unit;
    i = i || this.increment;
    var j = this.getAdjustedDates(a, d);
    a = j.start;
    d = j.end;
    while (a < d) {
        f = this.getNext(a, g, i);
        if (!this.autoAdjust && f > d) {
            f = d
        }
        if (g === b.HOUR && i > 1 && h.length > 0 && e === 0) {
            var c = h[h.length - 1];
            e = ((c.start.getHours() + i) % 24) - c.end.getHours();
            if (e !== 0) {
                f = b.add(f, b.HOUR, e)
            }
        }
        h.push({start: a, end: f});
        a = f
    }
    return h
}, getVisibleTickTimeSpan: function () {
    return this.isContinuous() ? this.visibleTickEnd - this.visibleTickStart : this.getCount()
}, getAdjustedDates: function (b, e, d) {
    var c = Sch.util.Date;
    b = b || this.getStart();
    e = e || c.add(b, this.mainUnit, this.defaultSpan);
    if (this.mode === "calendar") {
        if (this.shiftUnit === c.MONTH) {
            var g = c.add(b, c.WEEK, 1);
            var f = c.add(e, c.WEEK, -1);
            if (!e) {
                e = this.getNext(b, this.shiftUnit, 1);
                e = this.ceilDate(e, false, this.shiftUnit, 1);
                e = this.ceilDate(e, false, this.mainUnit, 1)
            }
            if (g.getMonth() !== b.getMonth() && f.getMonth() !== e.getMonth()) {
                return{start: b, end: e}
            }
        }
        var i = this.floorDate(b, false, this.shiftUnit, 1);
        i = this.floorDate(i, false, this.mainUnit, 1);
        var h = this.getNext(b, this.shiftUnit, 1);
        var a = this.ceilDate(h, false, this.shiftUnit, 1);
        a = this.ceilDate(a, false, this.mainUnit, 1);
        return{start: i, end: a}
    } else {
        return this.autoAdjust || d ? {start: this.floorDate(b, false, this.mainUnit, 1), end: this.ceilDate(e, false, this.mainUnit, 1)} : {start: b, end: e}
    }
}, getTickFromDate: function (d) {
    var j = this.data.items;
    var h = j.length - 1;
    if (d < j[0].data.start || d > j[h].data.end) {
        return-1
    }
    var f, g, b;
    if (this.isContinuous()) {
        if (d - j[0].data.start === 0) {
            return this.visibleTickStart
        }
        if (d - j[h].data.end === 0) {
            return this.visibleTickEnd
        }
        var k = this.adjustedStart;
        var a = this.adjustedEnd;
        var c = Math.floor(j.length * (d - k) / (a - k));
        if (c > h) {
            c = h
        }
        g = c === 0 ? k : j[c].data.start;
        b = c == h ? a : j[c].data.end;
        f = c + (d - g) / (b - g);
        if (f < this.visibleTickStart || f > this.visibleTickEnd) {
            return-1
        }
        return f
    } else {
        for (var e = 0; e <= h; e++) {
            b = j[e].data.end;
            if (d <= b) {
                g = j[e].data.start;
                f = e + (d > g ? (d - g) / (b - g) : 0);
                return f
            }
        }
    }
    return-1
}, getDateFromTick: function (e, i) {
    if (e === this.visibleTickEnd) {
        return this.getEnd()
    }
    var b = Math.floor(e), g = e - b, h = this.getAt(b);
    if (!h) {
        return null
    }
    var f = h.data;
    var a = b === 0 ? this.adjustedStart : f.start;
    var d = (b == this.getCount() - 1) && this.isContinuous() ? this.adjustedEnd : f.end;
    var c = Sch.util.Date.add(a, Sch.util.Date.MILLI, g * (d - a));
    if (i) {
        c = this[i + "Date"](c)
    }
    return c
}, getTicks: function () {
    var a = [];
    this.each(function (b) {
        a.push(b.data)
    });
    return a
}, getStart: function () {
    var a = this.first();
    if (a) {
        return new Date(a.data.start)
    }
    return null
}, getEnd: function () {
    var a = this.last();
    if (a) {
        return new Date(a.data.end)
    }
    return null
}, floorDate: function (e, g, h, a) {
    g = g !== false;
    var c = Ext.Date.clone(e), d = g ? this.getStart() : null, l = a || this.resolutionIncrement, k;
    if (h) {
        k = h
    } else {
        k = g ? this.resolutionUnit : this.mainUnit
    }
    var b = Sch.util.Date;
    var f = function (n, m) {
        return Math.floor(n / m) * m
    };
    switch (k) {
        case b.MILLI:
            if (g) {
                c = b.add(d, b.MILLI, f(b.getDurationInMilliseconds(d, c), l))
            }else{
                /*add ms hander by tianjsh*/
                c.setMilliseconds(f(c.getMilliseconds(), l));
            }
            break;
        case b.SECOND:
            if (g) {
                c = b.add(d, b.MILLI, f(b.getDurationInSeconds(d, c), l) * 1000)
            } else {
                c.setMilliseconds(0);
                c.setSeconds(f(c.getSeconds(), l))
            }
            break;
        case b.MINUTE:
            if (g) {
                c = b.add(d, b.SECOND, f(b.getDurationInMinutes(d, c), l) * 60)
            } else {
                c.setMinutes(f(c.getMinutes(), l));
                c.setSeconds(0);
                c.setMilliseconds(0)
            }
            break;
        case b.HOUR:
            if (g) {
                c = b.add(d, b.MINUTE, f(b.getDurationInHours(this.getStart(), c), l) * 60)
            } else {
                c.setMinutes(0);
                c.setSeconds(0);
                c.setMilliseconds(0);
                c.setHours(f(c.getHours(), l))
            }
            break;
        case b.DAY:
            if (g) {
                c = b.add(d, b.DAY, f(b.getDurationInDays(d, c), l))
            } else {
                Ext.Date.clearTime(c);
                c.setDate(f(c.getDate() - 1, l) + 1)
            }
            break;
        case b.WEEK:
            var j = c.getDay() || 7;
            var i = this.weekStartDay || 7;
            Ext.Date.clearTime(c);
            c = b.add(c, b.DAY, j >= i ? i - j : -(7 - i + j));
            if (c.getDay() !== i && c.getHours() === 23) {
                c = b.add(c, b.HOUR, 1)
            }
            break;
        case b.MONTH:
            if (g) {
                c = b.add(d, b.MONTH, f(b.getDurationInMonths(d, c), l))
            } else {
                Ext.Date.clearTime(c);
                c.setDate(1);
                c.setMonth(f(c.getMonth(), l))
            }
            break;
        case b.QUARTER:
            Ext.Date.clearTime(c);
            c.setDate(1);
            c = b.add(c, b.MONTH, -(c.getMonth() % 3));
            break;
        case b.YEAR:
            if (g) {
                c = b.add(d, b.YEAR, f(b.getDurationInYears(d, c), l))
            } else {
                c = new Date(f(e.getFullYear() - 1, l) + 1, 0, 1)
            }
            break
    }
    return c
}, roundDate: function (r, b) {
    var l = Ext.Date.clone(r), s = this.resolutionIncrement;
    b = b || this.getStart();
    switch (this.resolutionUnit) {
        case Sch.util.Date.MILLI:
            var e = Sch.util.Date.getDurationInMilliseconds(b, l), d = Math.round(e / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MILLI, d);
            break;
        case Sch.util.Date.SECOND:
            var i = Sch.util.Date.getDurationInSeconds(b, l), q = Math.round(i / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MILLI, q * 1000);
            break;
        case Sch.util.Date.MINUTE:
            var n = Sch.util.Date.getDurationInMinutes(b, l), a = Math.round(n / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60);
            break;
        case Sch.util.Date.HOUR:
            var m = Sch.util.Date.getDurationInHours(b, l), j = Math.round(m / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MINUTE, j * 60);
            break;
        case Sch.util.Date.DAY:
            var c = Sch.util.Date.getDurationInDays(b, l), f = Math.round(c / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.DAY, f);
            break;
        case Sch.util.Date.WEEK:
            Ext.Date.clearTime(l);
            var o = l.getDay() - this.weekStartDay, t;
            if (o < 0) {
                o = 7 + o
            }
            if (Math.round(o / 7) === 1) {
                t = 7 - o
            } else {
                t = -o
            }
            l = Sch.util.Date.add(l, Sch.util.Date.DAY, t);
            break;
        case Sch.util.Date.MONTH:
            var p = Sch.util.Date.getDurationInMonths(b, l) + (l.getDate() / Ext.Date.getDaysInMonth(l)), h = Math.round(p / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.MONTH, h);
            break;
        case Sch.util.Date.QUARTER:
            Ext.Date.clearTime(l);
            l.setDate(1);
            l = Sch.util.Date.add(l, Sch.util.Date.MONTH, 3 - (l.getMonth() % 3));
            break;
        case Sch.util.Date.YEAR:
            var k = Sch.util.Date.getDurationInYears(b, l), g = Math.round(k / s) * s;
            l = Sch.util.Date.add(b, Sch.util.Date.YEAR, g);
            break
    }
    return l
}, ceilDate: function (c, b, f) {
    var e = Ext.Date.clone(c);
    b = b !== false;
    var a = b ? this.resolutionIncrement : 1, g = false, d;
    if (f) {
        d = f
    } else {
        d = b ? this.resolutionUnit : this.mainUnit
    }
    switch (d) {
        case Sch.util.Date.HOUR:
            if (e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
                g = true
            }
            break;
        case Sch.util.Date.DAY:
            if (e.getHours() > 0 || e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
                g = true
            }
            break;
        case Sch.util.Date.WEEK:
            Ext.Date.clearTime(e);
            if (e.getDay() !== this.weekStartDay) {
                g = true
            }
            break;
        case Sch.util.Date.MONTH:
            Ext.Date.clearTime(e);
            if (e.getDate() !== 1) {
                g = true
            }
            break;
        case Sch.util.Date.QUARTER:
            Ext.Date.clearTime(e);
            if (e.getMonth() % 3 !== 0 || (e.getMonth() % 3 === 0 && e.getDate() !== 1)) {
                g = true
            }
            break;
        case Sch.util.Date.YEAR:
            Ext.Date.clearTime(e);
            if (e.getMonth() !== 0 || e.getDate() !== 1) {
                g = true
            }
            break;
        default:
            break
    }
    if (g) {
        return this.getNext(e, d, a)
    } else {
        return e
    }
}, getNext: function (b, c, a) {
    return Sch.util.Date.getNext(b, c, a, this.weekStartDay)
}, getResolution: function () {
    return{unit: this.resolutionUnit, increment: this.resolutionIncrement}
}, setResolution: function (b, a) {
    this.resolutionUnit = b;
    this.resolutionIncrement = a || 1
}, shift: function (a, b) {
    this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
}, shiftNext: function (a) {
    a = a || this.getShiftIncrement();
    var b = this.getShiftUnit();
    this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
}, shiftPrevious: function (a) {
    a = -(a || this.getShiftIncrement());
    var b = this.getShiftUnit();
    this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
}, getShiftUnit: function () {
    return this.shiftUnit || this.mainUnit
}, getShiftIncrement: function () {
    return this.shiftIncrement || 1
}, getUnit: function () {
    return this.unit
}, getIncrement: function () {
    return this.increment
}, dateInAxis: function (a) {
    return Sch.util.Date.betweenLesser(a, this.getStart(), this.getEnd())
}, timeSpanInAxis: function (b, a) {
    if (this.isContinuous()) {
        return Sch.util.Date.intersectSpans(b, a, this.getStart(), this.getEnd())
    } else {
        return(b < this.getStart() && a > this.getEnd()) || this.getTickFromDate(b) !== this.getTickFromDate(a)
    }
}, forEachAuxInterval: function (h, b, a, f) {
    f = f || this;
    var c = this.getEnd(), g = this.getStart(), e = 0, d;
    if (g > c) {
        throw"Invalid time axis configuration"
    }
    while (g < c) {
        d = Sch.util.Date.min(this.getNext(g, h, b || 1), c);
        a.call(f, g, d, e);
        g = d;
        e++
    }
}, consumeViewPreset: function (a) {
    Ext.apply(this, {unit: a.getBottomHeader().unit, increment: a.getBottomHeader().increment || 1, resolutionUnit: a.timeResolution.unit, resolutionIncrement: a.timeResolution.increment, mainUnit: a.getMainHeader().unit, shiftUnit: a.shiftUnit, shiftIncrement: a.shiftIncrement || 1, defaultSpan: a.defaultSpan || 1, presetName: a.name, headerConfig: a.headerConfig})
}});
Ext.define("Sch.view.Horizontal", {requires: ["Ext.util.Region", "Ext.Element", "Sch.util.Date"], view: null, constructor: function (a) {
    Ext.apply(this, a)
}, translateToScheduleCoordinate: function (a) {
    var b = this.view;
    if (b.rtl) {
        return b.getTimeAxisColumn().getEl().getRight() - a
    }
    return a - b.getEl().getX() + b.getScroll().left
}, translateToPageCoordinate: function (a) {
    var b = this.view;
    return a + b.getEl().getX() - b.getScroll().left
}, getDateFromXY: function (c, b, a) {
    var d = c[0];
    if (!a) {
        d = this.translateToScheduleCoordinate(d)
    }
    return this.view.timeAxisViewModel.getDateFromPosition(d, b)
}, getEventRenderData: function (a) {
    var f = a.getStartDate(), e = a.getEndDate() || f, h = this.view, c = h.timeAxis.getStart(), i = h.timeAxis.getEnd(), g = Math, d = h.getXFromDate(Sch.util.Date.max(f, c)), j = h.getXFromDate(Sch.util.Date.min(e, i)), b = {};
    if (this.view.rtl) {
        b.right = g.min(d, j)
    } else {
        b.left = g.min(d, j)
    }
    b.width = g.max(1, g.abs(j - d)) - h.eventBorderWidth;
    if (h.managedEventSizing) {
        b.top = g.max(0, (h.barMargin - ((Ext.isIE && !Ext.isStrict) ? 0 : h.eventBorderWidth - h.cellTopBorderWidth)));
        b.height = h.timeAxisViewModel.rowHeightHorizontal - (2 * h.barMargin) - h.eventBorderWidth
    }
    b.start = f;
    b.end = e;
    b.startsOutsideView = f < c;
    b.endsOutsideView = e > i;
    return b
}, getScheduleRegion: function (e, g) {
    var c = Ext.Element.prototype.getRegion ? "getRegion" : "getPageBox", j = this.view, i = e ? Ext.fly(j.getRowNode(e))[c]() : j.getTableRegion(), f = j.timeAxis.getStart(), l = j.timeAxis.getEnd(), b = j.getDateConstraints(e, g) || {start: f, end: l}, d = this.translateToPageCoordinate(j.getXFromDate(Sch.util.Date.max(f, b.start))), k = this.translateToPageCoordinate(j.getXFromDate(Sch.util.Date.min(l, b.end))), h = i.top + j.barMargin, a = i.bottom - j.barMargin - j.eventBorderWidth;
    return new Ext.util.Region(h, Math.max(d, k), a, Math.min(d, k))
}, getResourceRegion: function (j, e, i) {
    var m = this.view, d = m.getRowNode(j), f = Ext.fly(d).getOffsetsTo(m.getEl()), k = m.timeAxis.getStart(), o = m.timeAxis.getEnd(), c = e ? Sch.util.Date.max(k, e) : k, g = i ? Sch.util.Date.min(o, i) : o, h = m.getXFromDate(c), n = m.getXFromDate(g), l = f[1] + m.cellTopBorderWidth, a = f[1] + Ext.fly(d).getHeight() - m.cellBottomBorderWidth;
    if (!Ext.versions.touch) {
        var b = m.getScroll();
        l += b.top;
        a += b.top
    }
    return new Ext.util.Region(l, Math.max(h, n), a, Math.min(h, n))
}, columnRenderer: function (d, q, k, n, p) {
    var o = this.view;
    var b = o.eventStore.getEventsForResource(k);
    if (b.length === 0) {
        return
    }
    var h = o.timeAxis, m = [], g, e;
    for (g = 0, e = b.length; g < e; g++) {
        var a = b[g], c = a.getStartDate(), f = a.getEndDate();
        if (c && f && h.timeSpanInAxis(c, f)) {
            m[m.length] = o.generateTplData(a, k, n)
        }
    }
    if (o.dynamicRowHeight) {
        var j = o.eventLayout.horizontal;
        j.applyLayout(m, k);
        q.rowHeight = j.getRowHeight(k, b)
    }
    return o.eventTpl.apply(m)
}, resolveResource: function (b) {
    var a = this.view;
    var c = a.findRowByChild(b);
    if (c) {
        return a.getRecordForRowNode(c)
    }
    return null
}, getTimeSpanRegion: function (b, h, g) {
    var d = this.view, c = d.getXFromDate(b), e = h ? d.getXFromDate(h) : c, a, f;
    f = d.getTableRegion();
    if (g) {
        a = Math.max(f ? f.bottom - f.top : 0, d.getEl().dom.clientHeight)
    } else {
        a = f ? f.bottom - f.top : 0
    }
    return new Ext.util.Region(0, Math.max(c, e), a, Math.min(c, e))
}, getStartEndDatesFromRegion: function (g, d, c) {
    var b = this.view;
    var f = b.rtl;
    var a = b.getDateFromCoordinate(f ? g.right : g.left, d), e = b.getDateFromCoordinate(f ? g.left : g.right, d);
    if (a && e || c && (a || e)) {
        return{start: a, end: e}
    }
    return null
}, onEventAdd: function (q, p) {
    var o = this.view;
    var h = {};
    for (var m = 0, e = p.length; m < e; m++) {
        var a = p[m], b = a.getStartDate(), n = a.getEndDate();
        if (b && n && o.timeAxis.timeSpanInAxis(b, n)) {
            var c = p[m].getResources(o.eventStore);
            for (var g = 0, f = c.length; g < f; g++) {
                var d = c[g];
                h[d.getId()] = d
            }
        }
    }
    Ext.Object.each(h, function (j, i) {
        o.repaintEventsForResource(i)
    })
}, onEventRemove: function (k, e) {
    var h = this.view;
    var j = this.resourceStore;
    var f = Ext.tree && Ext.tree.View && h instanceof Ext.tree.View;
    if (!Ext.isArray(e)) {
        e = [e]
    }
    var g = function (i) {
        if (h.store.indexOf(i) >= 0) {
            h.repaintEventsForResource(i)
        }
    };
    for (var d = 0; d < e.length; d++) {
        var a = e[d].getResources(h.eventStore);
        if (a.length > 1) {
            Ext.each(a, g, this)
        } else {
            var b = h.getEventNodeByRecord(e[d]);
            if (b) {
                var c = h.resolveResource(b);
                if (Ext.Element.prototype.fadeOut) {
                    Ext.get(b).fadeOut({callback: function () {
                        g(c)
                    }})
                } else {
                    Ext.Anim.run(Ext.get(b), "fade", {out: true, duration: 500, after: function () {
                        g(c)
                    }, autoClear: false})
                }
            }
        }
    }
}, onEventUpdate: function (e, f) {
    var i = f.previous || {};
    var k = this.view;
    var h = k.timeAxis;
    var a = f.getStartDate();
    var j = f.getEndDate();
    var b = i.StartDate || a;
    var g = i.EndDate || j;
    var l = b && g && h.timeSpanInAxis(b, g);
    if (f.resourceIdField in i && l) {
        var d = e.getResourceStore().getById(i[f.resourceIdField]);
        if (d) {
            k.repaintEventsForResource(d, true)
        }
    }
    if ((a && j && h.timeSpanInAxis(a, j)) || l) {
        var c = f.getResources(k.eventStore);
        Ext.each(c, function (m) {
            k.repaintEventsForResource(m, true)
        })
    }
}, setColumnWidth: function (c, b) {
    var a = this.view;
    a.getTimeAxisViewModel().setViewColumnWidth(c, b)
}, getVisibleDateRange: function () {
    var d = this.view;
    if (!d.getEl()) {
        return null
    }
    var c = d.getTableRegion(), b = d.timeAxis.getStart(), f = d.timeAxis.getEnd(), e = d.getWidth();
    if ((c.right - c.left) < e) {
        return{startDate: b, endDate: f}
    }
    var a = d.getScroll();
    return{startDate: d.getDateFromCoordinate(a.left, null, true), endDate: d.getDateFromCoordinate(a.left + e, null, true)}
}});
Ext.define("Sch.view.Vertical", {view: null, constructor: function (a) {
    Ext.apply(this, a)
}, translateToScheduleCoordinate: function (b) {
    var a = this.view;
    return b - a.getEl().getY() + a.getScroll().top
}, translateToPageCoordinate: function (d) {
    var b = this.view;
    var c = b.getEl(), a = c.getScroll();
    return d + c.getY() - a.top
}, getDateFromXY: function (c, b, a) {
    var d = c[1];
    if (!a) {
        d = this.translateToScheduleCoordinate(d)
    }
    return this.view.timeAxisViewModel.getDateFromPosition(d, b)
}, getEventRenderData: function (a) {
    var g = a.getStartDate(), f = a.getEndDate(), i = this.view, e = i.timeAxis.getStart(), j = i.timeAxis.getEnd(), h = Math, d = h.floor(i.getCoordinateFromDate(Sch.util.Date.max(g, e))), k = h.floor(i.getCoordinateFromDate(Sch.util.Date.min(f, j))), c = this.getResourceColumnWidth(a.getResource(), i.eventStore), b;
    b = {top: h.max(0, h.min(d, k) - i.eventBorderWidth), height: h.max(1, h.abs(d - k))};
    if (i.managedEventSizing) {
        b.left = i.barMargin;
        b.width = c - (2 * i.barMargin) - i.eventBorderWidth
    }
    b.start = g;
    b.end = f;
    b.startsOutsideView = g < e;
    b.endsOutsideView = f > j;
    return b
}, getScheduleRegion: function (d, f) {
    var h = this.view, g = d ? Ext.fly(h.getScheduleCell(0, h.resourceStore.indexOf(d))).getRegion() : h.getTableRegion(), e = h.timeAxis.getStart(), k = h.timeAxis.getEnd(), a = h.getDateConstraints(d, f) || {start: e, end: k}, c = this.translateToPageCoordinate(h.getCoordinateFromDate(Sch.util.Date.max(e, a.start))), j = this.translateToPageCoordinate(h.getCoordinateFromDate(Sch.util.Date.min(k, a.end))), b = g.left + h.barMargin, i = (d ? (g.left + this.getResourceColumnWidth(d)) : g.right) - h.barMargin;
    return new Ext.util.Region(Math.min(c, j), i, Math.max(c, j), b)
}, getResourceColumnWidth: function (a) {
    return this.view.timeAxisViewModel.resourceColumnWidth
}, getResourceRegion: function (h, b, g) {
    var j = this.view, e = j.resourceStore.indexOf(h) * this.getResourceColumnWidth(h), i = j.timeAxis.getStart(), m = j.timeAxis.getEnd(), a = b ? Sch.util.Date.max(i, b) : i, d = g ? Sch.util.Date.min(m, g) : m, f = Math.max(0, j.getCoordinateFromDate(a) - j.cellTopBorderWidth), l = j.getCoordinateFromDate(d) - j.cellTopBorderWidth, c = e + j.cellBorderWidth, k = e + this.getResourceColumnWidth(h) - j.cellBorderWidth;
    return new Ext.util.Region(Math.min(f, l), k, Math.max(f, l), c)
}, columnRenderer: function (f, r, m, o, q) {
    var p = this.view;
    var e = "";
    if (o === 0) {
        var a = Sch.util.Date, k = p.timeAxis, n, c, j, g;
        n = [];
        c = p.eventStore.getEventsForResource(m);
        for (j = 0, g = c.length; j < g; j++) {
            var b = c[j], d = b.getStartDate(), h = b.getEndDate();
            if (d && h && k.timeSpanInAxis(d, h)) {
                n.push(p.generateTplData(b, m, q))
            }
        }
        p.eventLayout.vertical.applyLayout(n, this.getResourceColumnWidth(m));
        e = "&#160;" + p.eventTpl.apply(n);
        if (Ext.isIE) {
            r.tdAttr = 'style="z-index:1000"'
        }
    }
    if (q % 2 === 1) {
        r.tdCls = (r.tdCls || "") + " " + p.altColCls;
        r.cellCls = (r.cellCls || "") + " " + p.altColCls
    }
    return e
}, resolveResource: function (c) {
    var a = this.view;
    c = Ext.fly(c).is(a.timeCellSelector) ? c : Ext.fly(c).up(a.timeCellSelector);
    if (c) {
        var d = c.dom ? c.dom : c;
        var b = 0;
        if (Ext.isIE8m) {
            d = d.previousSibling;
            while (d) {
                if (d.nodeType === 1) {
                    b++
                }
                d = d.previousSibling
            }
        } else {
            b = Ext.Array.indexOf(Array.prototype.slice.call(d.parentNode.children), d)
        }
        if (b >= 0) {
            return a.resourceStore.getAt(b)
        }
    }
    return null
}, onEventUpdate: function (l, e) {
    var h = e.previous || {};
    var j = this.view;
    var g = j.timeAxis;
    var b = e.getStartDate();
    var i = e.getEndDate();
    var c = h.StartDate || b;
    var f = h.EndDate || i;
    var k = c && f && g.timeSpanInAxis(c, f);
    if (e.resourceIdField in h && k) {
        var d = e.getResource(h[e.resourceIdField], j.eventStore);
        if (d) {
            this.relayoutRenderedEvents(d)
        }
    }
    if (b && i && g.timeSpanInAxis(b, i) || k) {
        this.renderSingle.call(this, e);
        var a = e.getResource(null, j.eventStore);
        if (a) {
            this.relayoutRenderedEvents(a);
            if (j.getSelectionModel().isSelected(e)) {
                j.onEventSelect(e, true)
            }
        }
    }
}, onEventAdd: function (d, e) {
    var c = this.view;
    if (e.length === 1) {
        var b = e[0], a = b.getStartDate(), f = b.getEndDate();
        if (a && f && c.timeAxis.timeSpanInAxis(a, f)) {
            this.renderSingle(b);
            this.relayoutRenderedEvents(b.getResource(null, c.eventStore))
        }
    } else {
        c.repaintAllEvents()
    }
}, onEventRemove: function (c, d) {
    var b = this.view, a = d.getStartDate(), e = d.getEndDate();
    if (a && e && b.timeAxis.timeSpanInAxis(a, e)) {
        b.repaintAllEvents()
    }
}, relayoutRenderedEvents: function (h) {
    var g = [], b = this.view, d, a, f, e, c = b.eventStore.getEventsForResource(h);
    if (c.length > 0) {
        for (d = 0, a = c.length; d < a; d++) {
            f = c[d];
            e = b.getEventNodeByRecord(f);
            if (e) {
                g.push({start: f.getStartDate(), end: f.getEndDate(), event: f, node: e})
            }
        }
        b.eventLayout.vertical.applyLayout(g, this.getResourceColumnWidth(h));
        for (d = 0; d < g.length; d++) {
            f = g[d];
            Ext.fly(f.node).setStyle({left: f.left + "px", width: f.width + "px"});
            b.fireEvent("eventrepaint", b, f.event, f.node)
        }
    }
}, renderSingle: function (a) {
    var h = this.view;
    var d = a.getResource(null, h.eventStore);
    var b = h.getEventNodeByRecord(a);
    if (b) {
        Ext.fly(b).destroy()
    }
    var c = a.getStartDate();
    var g = a.getEndDate();
    if (c && g && h.timeAxis.timeSpanInAxis(c, g)) {
        var e = h.resourceStore.indexOf(d);
        var i = Ext.fly(h.getScheduleCell(0, e));
        if (!i) {
            return
        }
        var f = h.generateTplData(a, d, e);
        if (!Ext.versions.touch) {
            i = i.first()
        }
        h.eventTpl.append(i, [f])
    }
}, getTimeSpanRegion: function (b, g) {
    var d = this.view, a = d.getCoordinateFromDate(b), f = g ? d.getCoordinateFromDate(g) : a, c = d.getTableRegion(), e = c ? c.right - c.left : d.getEl().dom.clientWidth;
    return new Ext.util.Region(Math.min(a, f), e, Math.max(a, f), 0)
}, getStartEndDatesFromRegion: function (d, c, b) {
    var a = this.view.getDateFromCoordinate(d.top, c), e = this.view.getDateFromCoordinate(d.bottom, c);
    if (a && e) {
        return{start: Sch.util.Date.min(a, e), end: Sch.util.Date.max(a, e)}
    } else {
        return null
    }
}, setColumnWidth: function (c, b) {
    var a = this.view;
    a.resourceColumnWidth = c;
    a.getTimeAxisViewModel().setViewColumnWidth(c, b)
}, getVisibleDateRange: function () {
    var e = this.view;
    if (!e.rendered) {
        return null
    }
    var c = e.getScroll(), b = e.getHeight(), d = e.getTableRegion(), f = e.timeAxis.getEnd();
    if (d.bottom - d.top < b) {
        var a = e.timeAxis.getStart();
        return{startDate: a, endDate: f}
    }
    return{startDate: e.getDateFromCoordinate(c.top, null, true), endDate: e.getDateFromCoordinate(c.top + b, null, true) || f}
}});
Ext.define("Sch.view.Calendar", {requires: ["Ext.util.Region"], view: null, constructor: function (a) {
    Ext.apply(this, a)
}, getColumnBy: function (b, e) {
    var d = this.view.panel.headerCt.getGridColumns();
    var a = [];
    for (var c = 0; c < d.length; c++) {
        if (b.call(this, d[c])) {
            if (e !== true) {
                a.push(d[c])
            } else {
                a.push({column: d[c], index: c})
            }
        }
    }
    return a
}, getEventColumns: function (a, b) {
    return this.getColumnBy(function (c) {
        return!(a.getEndDate() <= c.start || a.getStartDate() >= c.end)
    }, b)
}, getColumnEvents: function (b) {
    var a = [];
    this.view.eventStore.each(function (c) {
        if (!(c.getEndDate() <= b.start || c.getStartDate() >= b.end)) {
            a.push(c)
        }
    });
    return a
}, getColumnByResource: function (b, a) {
    return this.getColumnBy(function (c) {
        return c.start == b.start
    }, a)[0]
}, translateToScheduleCoordinate: function (b) {
    var a = this.view;
    if (Ext.isArray(b)) {
        return[b[0] - a.getEl().getX() + a.getScroll().left, b[1] - a.getEl().getY() + a.getScroll().top]
    } else {
        return b - a.getEl().getY() + a.getScroll().top
    }
}, translateToPageCoordinate: function (d) {
    var b = this.view;
    var c = b.getEl(), a = c.getScroll();
    if (Ext.isArray(d)) {
        return[d[0] + c.getX() - a.left, d[1] + c.getY() - a.top]
    } else {
        return d + c.getY() - a.top
    }
}, getDateFromXY: function (c, b, a) {
    var d = c;
    if (!a) {
        d = this.translateToScheduleCoordinate(d)
    }
    return this.view.timeAxisViewModel.getDateFromPosition(d, b)
}, getEventRenderData: function (a, b, i) {
    var j = a.getStartDate(), h = a.getEndDate(), l = this.view, c = l.panel.headerCt.getGridColumns(), g = c[i].start, m = c[i].end, k = Math;
    var f = Math.floor(l.getCoordinateFromDate(Sch.util.Date.max(j, g)));
    var n = Math.floor(l.timeAxisViewModel.getPositionFromDate(Sch.util.Date.min(h, m), true));
    var e = this.getCalendarColumnWidth();
    var d;
    if (n === 0) {
        n = l.getStore().getCount() * l.getRowHeight()
    }
    d = {top: k.max(0, k.min(f, n) - l.eventBorderWidth), height: k.max(1, k.abs(f - n))};
    if (l.managedEventSizing) {
        d.left = l.barMargin;
        d.width = e - (2 * l.barMargin) - l.eventBorderWidth
    }
    d.start = j;
    d.end = h;
    d.startsOutsideView = j < g;
    d.endsOutsideView = h > m;
    return d
}, getScheduleRegion: function (d, f) {
    var h = this.view, g = d ? this.getColumnByResource(d).getRegion() : h.getTableRegion(), e = h.timeAxis.getStart(), k = h.timeAxis.getEnd(), a = h.getDateConstraints(d, f) || {start: e, end: k}, c = this.translateToPageCoordinate(0), j = this.translateToPageCoordinate(h.getStore().getCount() * h.getRowHeight()), b = g.left + h.barMargin, i = g.right - h.barMargin;
    return new Ext.util.Region(Math.min(c, j), i, Math.max(c, j), b)
}, getCalendarColumnWidth: function (a) {
    return this.view.timeAxisViewModel.calendarColumnWidth
}, getResourceRegion: function (h, b, g) {
    var j = this.view, e = j.resourceStore.indexOf(h) * this.getCalendarColumnWidth(), i = j.timeAxis.getStart(), m = j.timeAxis.getEnd(), a = b ? Sch.util.Date.max(i, b) : i, d = g ? Sch.util.Date.min(m, g) : m, f = Math.max(0, j.getCoordinateFromDate(a) - j.cellTopBorderWidth), l = j.getCoordinateFromDate(d) - j.cellTopBorderWidth, c = e + j.cellBorderWidth, k = e + this.getCalendarColumnWidth() - j.cellBorderWidth;
    return new Ext.util.Region(Math.min(f, l), k, Math.max(f, l), c)
}, columnRenderer: function (e, p, j, m, o) {
    var n = this.view;
    var d = "";
    if (m === 0) {
        var a = Sch.util.Date, h = n.timeAxis, k, c, g, f;
        k = [];
        c = this.getColumnEvents(p.column);
        for (g = 0, f = c.length; g < f; g++) {
            var b = c[g];
            k.push(n.generateTplData(b, j, o))
        }
        n.eventLayout.vertical.applyLayout(k, this.getCalendarColumnWidth());
        d = "&#160;" + n.eventTpl.apply(k);
        if (Ext.isIE) {
            p.tdAttr = 'style="z-index:1000"'
        }
    }
    if (o % 2 === 1) {
        p.tdCls = (p.tdCls || "") + " " + n.altColCls;
        p.cellCls = (p.cellCls || "") + " " + n.altColCls
    }
    return d
}, resolveResource: function (d) {
    var a = this.view;
    d = Ext.fly(d).is(a.timeCellSelector) ? d : Ext.fly(d).up(a.timeCellSelector);
    if (d) {
        var e = d.dom ? d.dom : d;
        var b = 0;
        if (Ext.isIE8m) {
            e = e.previousSibling;
            while (e) {
                if (e.nodeType === 1) {
                    b++
                }
                e = e.previousSibling
            }
        } else {
            b = Ext.Array.indexOf(Array.prototype.slice.call(e.parentNode.children), e)
        }
        if (b >= 0) {
            var c = a.panel.headerCt.getGridColumns()[b];
            return{start: c.start, end: c.end}
        }
    }
}, onEventUpdate: function (b, c) {
    this.renderSingle.call(this, c);
    var d = c.previous || {};
    var a = new Sch.model.Event({StartDate: d.StartDate || c.getStartDate(), EndDate: d.EndDate || c.getEndDate()});
    this.relayoutRenderedEvents(a);
    this.relayoutRenderedEvents(c)
}, onEventAdd: function (b, c) {
    var a = this.view;
    if (c.length === 1) {
        this.renderSingle(c[0]);
        this.relayoutRenderedEvents(c[0])
    } else {
        a.repaintAllEvents()
    }
}, onEventRemove: function (b, c) {
    var a = this.view;
    if (c.length === 1) {
        this.relayoutRenderedEvents(c[0])
    } else {
        a.repaintAllEvents()
    }
}, relayoutRenderedEvents: function (c) {
    var d = this, e = [], a = d.view, b = d.getEventColumns(c, true);
    Ext.each(b, function (f) {
        d.repaintEventsForColumn(f.column, f.index)
    })
}, renderSingle: function (d) {
    var a = this.view;
    var e = this.view.resourceStore.first();
    var b = this.getEventColumns(d, true);
    var c = a.getEventNodesByRecord(d).elements;
    Ext.each(c, function (f) {
        Ext.fly(f).destroy()
    });
    Ext.each(b, function (g) {
        var f = Ext.fly(a.getScheduleCell(0, g.index));
        if (!f) {
            return
        }
        var h = a.generateTplData(d, e, g.index);
        if (!Ext.versions.touch) {
            f = f.first()
        }
        a.eventTpl.append(f, [h])
    })
}, repaintEventsForColumn: function (d, m) {
    var n = this;
    var q = n.getColumnEvents(d);
    var o = n.view;
    var h = [], j, e, a, c, b, g;
    if (q.length > 0) {
        for (j = 0, e = q.length; j < e; j++) {
            a = q[j];
            c = o.getEventNodesByRecord(a).elements[0];
            if (!c) {
                return
            }
            var k = c.id.split("-");
            k.pop();
            b = a.getStartDate();
            g = a.getEndDate();
            h.push({start: b < d.start ? d.start : b, end: g > d.end ? d.end : g, event: a, id: k.join("-")})
        }
    }
    o.eventLayout.vertical.applyLayout(h, d.getWidth());
    var p = o.el.down("tr:nth-child(1)");
    for (j = 0; j < h.length; j++) {
        a = h[j];
        var f = p.down("td:nth-child(" + (m + 1) + ")").select("[id^=" + a.id + "-]");
        f && f.setStyle({left: a.left + "px", width: a.width + "px"})
    }
}, getTimeSpanRegion: function (a, d) {
    var f = this.view, c = f.getCoordinateFromDate(a), g = d ? f.getCoordinateFromDate(d, true, true) : c;
    var b = this.getColumnBy(function (j) {
        return j.start <= a && j.end > a
    })[0];
    var e = this.getColumnBy(function (j) {
        return j.start < d && j.end >= d
    })[0];
    var i = this.translateToScheduleCoordinate([b.getX(), 0]);
    var h = this.translateToScheduleCoordinate([e.getRegion().right, 0]);
    return new Ext.util.Region(Math.min(c, g), h[0], Math.max(c, g), i[0])
}, getStartEndDatesFromRegion: function (d, c, b) {
    var a = this.view.getDateFromCoordinate([d.left, d.top], c), e = this.view.getDateFromCoordinate([d.left, d.bottom], c);
    if (a && e) {
        return{start: Sch.util.Date.min(a, e), end: Sch.util.Date.max(a, e)}
    } else {
        return null
    }
}, setColumnWidth: function (c, b) {
    var a = this.view;
    a.calendarColumnWidth = c;
    a.getTimeAxisViewModel().setViewColumnWidth(c, b)
}, getVisibleDateRange: function () {
    var e = this.view;
    if (!e.rendered) {
        return null
    }
    var c = e.getScroll(), b = e.getHeight(), d = e.getTableRegion(), f = e.timeAxis.getEnd();
    if (d.bottom - d.top < b) {
        var a = e.timeAxis.getStart();
        return{startDate: a, endDate: f}
    }
    return{startDate: e.getDateFromCoordinate(c.top, null, true), endDate: e.getDateFromCoordinate(c.top + b, null, true) || f}
}});
Ext.define("Sch.selection.EventModel", {extend: "Ext.selection.Model", alias: "selection.eventmodel", requires: ["Ext.util.KeyNav"], deselectOnContainerClick: true, selectedOnMouseDown: false, onVetoUIEvent: Ext.emptyFn, bindComponent: function (a) {
    var d = this, e = {refresh: d.refresh, scope: d};
    d.view = a;
    var b = a.eventStore;
    var c = a.resourceStore;
    d.bindStore(b);
    c.on("beforeload", d.clearSelectionOnRefresh, d);
    b.on("beforeload", d.clearSelectionOnRefresh, d);
    a.on({eventclick: d.onEventClick, eventmousedown: d.onEventMouseDown, itemmousedown: d.onItemMouseDown, scope: this});
    a.on(e)
}, destroy: function () {
    var a = this;
    a.view.resourceStore.un("beforeload", a.clearSelectionOnRefresh, a);
    a.view.eventStore.un("beforeload", a.clearSelectionOnRefresh, a);
    a.callParent(arguments)
}, clearSelectionOnRefresh: function () {
    this.clearSelections()
}, bindStore: function (a) {
    if (a && !a.isEventStore) {
        return
    }
    this.callParent(arguments)
}, onEventMouseDown: function (b, a, c) {
    this.selectedOnMouseDown = null;
    if (!this.isSelected(a)) {
        this.selectedOnMouseDown = a;
        this.selectWithEvent(a, c)
    }
}, onEventClick: function (b, a, c) {
    if (!this.selectedOnMouseDown) {
        this.selectWithEvent(a, c)
    }
}, onItemMouseDown: function () {
    if (this.deselectOnContainerClick) {
        this.deselectAll()
    }
}, onSelectChange: function (d, b, j, a) {
    var f = this, g = f.view, h = f.store, e = b ? "select" : "deselect", c = 0;
    if ((j || f.fireEvent("before" + e, f, d)) !== false && a() !== false) {
        if (b) {
            g.onEventSelect(d, j)
        } else {
            g.onEventDeselect(d, j)
        }
        if (!j) {
            f.fireEvent(e, f, d)
        }
    }
}, selectRange: Ext.emptyFn, selectNode: function (c, d, a) {
    var b = this.view.resolveEventRecord(c);
    if (b) {
        this.select(b, d, a)
    }
}, deselectNode: function (c, d, a) {
    var b = this.view.resolveEventRecord(c);
    if (b) {
        this.deselect(b, a)
    }
}, storeHasSelected: function (a) {
    var b = this.store;
    if (a.hasId() && b.getByInternalId(a.internalId)) {
        return true
    }
    return this.callParent(arguments)
}});
Ext.define("Sch.plugin.Printable", {extend: "Ext.AbstractPlugin", alias: "plugin.scheduler_printable", requires: ["Ext.XTemplate"], lockableScope: "top", docType: "<!DOCTYPE HTML>", beforePrint: Ext.emptyFn, afterPrint: Ext.emptyFn, autoPrintAndClose: true, fakeBackgroundColor: true, scheduler: null, constructor: function (a) {
    Ext.apply(this, a)
}, init: function (a) {
    this.scheduler = a;
    a.print = Ext.Function.bind(this.print, this)
}, mainTpl: new Ext.XTemplate('{docType}<html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="sch-print-body {bodyClasses}"><div class="sch-print-ct {componentClasses}" style="width:{totalWidth}px"><div class="sch-print-headerbg" style="border-left-width:{totalWidth}px;height:{headerHeight}px;"></div><div class="sch-print-header-wrap">{[this.printLockedHeader(values)]}{[this.printNormalHeader(values)]}</div>{[this.printLockedGrid(values)]}{[this.printNormalGrid(values)]}</div><script type="text/javascript">{setupScript}<\/script></body></html>', {printLockedHeader: function (a) {
    var b = "";
    if (a.lockedGrid) {
        b += '<div style="left:-' + a.lockedScroll + "px;margin-right:-" + a.lockedScroll + "px;width:" + (a.lockedWidth + a.lockedScroll) + 'px"';
        b += 'class="sch-print-lockedheader ' + a.lockedGrid.headerCt.el.dom.className + '">';
        b += a.lockedHeader;
        b += "</div>"
    }
    return b
}, printNormalHeader: function (a) {
    var b = "";
    if (a.normalGrid) {
        b += '<div style="left:' + (a.lockedGrid ? a.lockedWidth : "0") + "px;width:" + a.normalWidth + 'px;" class="sch-print-normalheader ' + a.normalGrid.headerCt.el.dom.className + '">';
        b += '<div style="margin-left:-' + a.normalScroll + 'px">' + a.normalHeader + "</div>";
        b += "</div>"
    }
    return b
}, printLockedGrid: function (a) {
    var b = "";
    if (a.lockedGrid) {
        b += '<div id="lockedRowsCt" style="left:-' + a.lockedScroll + "px;margin-right:-" + a.lockedScroll + "px;width:" + (a.lockedWidth + a.lockedScroll) + "px;top:" + a.headerHeight + 'px;" class="sch-print-locked-rows-ct ' + a.innerLockedClasses + " " + Ext.baseCSSPrefix + 'grid-inner-locked">';
        b += a.lockedRows;
        b += "</div>"
    }
    return b
}, printNormalGrid: function (a) {
    var b = "";
    if (a.normalGrid) {
        b += '<div id="normalRowsCt" style="left:' + (a.lockedGrid ? a.lockedWidth : "0") + "px;top:" + a.headerHeight + "px;width:" + a.normalWidth + 'px" class="sch-print-normal-rows-ct ' + a.innerNormalClasses + '">';
        b += '<div style="position:relative;overflow:visible;margin-left:-' + a.normalScroll + 'px">' + a.normalRows + "</div>";
        b += "</div>"
    }
    return b
}}), getGridContent: function (n) {
    var m = n.normalGrid, e = n.lockedGrid, o = e.getView(), g = m.getView(), j, d, l, i, k, b, h;
    this.beforePrint(n);
    if (e.collapsed && !m.collapsed) {
        b = e.getWidth() + m.getWidth()
    } else {
        b = m.getWidth();
        h = e.getWidth()
    }
    var c = o.store.getRange();
    d = o.tpl.apply(o.collectData(c, 0));
    l = g.tpl.apply(g.collectData(c, 0));
    i = o.el.getScroll().left;
    k = g.el.getScroll().left;
    var a = document.createElement("div");
    a.innerHTML = d;
    a.firstChild.style.width = o.el.dom.style.width;
    if (Ext.versions.extjs.isLessThan("4.2.1")) {
        e.headerCt.items.each(function (q, p) {
            if (q.isHidden()) {
                Ext.fly(a).down("colgroup:nth-child(" + (p + 1) + ") col").setWidth(0)
            }
        })
    }
    d = a.innerHTML;
    if (Sch.feature && Sch.feature.AbstractTimeSpan) {
        var f = (n.plugins || []).concat(n.normalGrid.plugins || []).concat(n.columnLinesFeature || []);
        Ext.each(f, function (p) {
            if (p instanceof Sch.feature.AbstractTimeSpan && p.generateMarkup) {
                l = p.generateMarkup(true) + l
            }
        })
    }
    this.afterPrint(n);
    return{normalHeader: m.headerCt.el.dom.innerHTML, lockedHeader: e.headerCt.el.dom.innerHTML, lockedGrid: e.collapsed ? false : e, normalGrid: m.collapsed ? false : m, lockedRows: d, normalRows: l, lockedScroll: i, normalScroll: k, lockedWidth: h - (Ext.isWebKit ? 1 : 0), normalWidth: b, headerHeight: m.headerCt.getHeight(), innerLockedClasses: e.view.el.dom.className, innerNormalClasses: m.view.el.dom.className + (this.fakeBackgroundColor ? " sch-print-fake-background" : ""), width: n.getWidth()}
}, getStylesheets: function () {
    return Ext.getDoc().select('link[rel="stylesheet"]')
}, print: function () {
    var g = this.scheduler;
    if (!(this.mainTpl instanceof Ext.Template)) {
        var a = 22;
        this.mainTpl = new Ext.XTemplate(this.mainTpl, {compiled: true, disableFormats: true})
    }
    var h = g.getView(), i = this.getStylesheets(), e = Ext.get(Ext.core.DomHelper.createDom({tag: "div"})), b;
    i.each(function (j) {
        e.appendChild(j.dom.cloneNode(true))
    });
    b = e.dom.innerHTML + "";
    var f = this.getGridContent(g), c = this.mainTpl.apply(Ext.apply({waitText: this.waitText, docType: this.docType, htmlClasses: Ext.getBody().parent().dom.className, bodyClasses: Ext.getBody().dom.className, componentClasses: g.el.dom.className, title: (g.title || ""), styles: b, totalWidth: g.getWidth(), setupScript: ("window.onload = function(){ (" + this.setupScript.toString() + ")(" + g.syncRowHeight + ", " + this.autoPrintAndClose + ", " + Ext.isChrome + ", " + Ext.isIE + "); };")}, f));
    var d = window.open("", "printgrid");
    if (!d || !d.document) {
        return false
    }
    this.printWindow = d;
    d.document.write(c);
    d.document.close()
}, setupScript: function (e, a, d, b) {
    var c = function () {
        if (e) {
            var f = document.getElementById("lockedRowsCt"), o = document.getElementById("normalRowsCt"), g = f && f.getElementsByTagName("tr"), m = o && o.getElementsByTagName("tr"), k = m && g ? m.length : 0;
            for (var j = 0; j < k; j++) {
                var h = m[j].clientHeight;
                var l = g[j].clientHeight;
                var n = Math.max(h, l) + "px";
                g[j].style.height = m[j].style.height = n
            }
        }
        document._loaded = true;
        if (a) {
            window.print();
            if (!d) {
                window.close()
            }
        }
    };
    if (b) {
        setTimeout(c, 0)
    } else {
        c()
    }
}});
Ext.define("Sch.plugin.Export", {extend: "Ext.util.Observable", alternateClassName: "Sch.plugin.PdfExport", alias: "plugin.scheduler_export", mixins: ["Ext.AbstractPlugin"], requires: ["Ext.XTemplate"], lockableScope: "top", printServer: undefined, tpl: null, exportDialogClassName: "Sch.widget.ExportDialog", exportDialogConfig: {}, defaultConfig: {format: "A4", orientation: "portrait", range: "complete", showHeader: true, singlePageExport: false}, expandAllBeforeExport: false, translateURLsToAbsolute: true, pageSizes: {A5: {width: 5.8, height: 8.3}, A4: {width: 8.3, height: 11.7}, A3: {width: 11.7, height: 16.5}, Letter: {width: 8.5, height: 11}, Legal: {width: 8.5, height: 14}}, openAfterExport: true, beforeExport: Ext.emptyFn, afterExport: Ext.emptyFn, fileFormat: "pdf", DPI: 72, constructor: function (a) {
    a = a || {};
    if (a.exportDialogConfig) {
        Ext.Object.each(this.defaultConfig, function (c, b, e) {
            var d = a.exportDialogConfig[c];
            if (d) {
                e[c] = d
            }
        })
    }
    this.callParent([a]);
    if (!this.tpl) {
        this.tpl = new Ext.XTemplate('<!DOCTYPE html><html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{column}/{row}</title>{styles}</head><body class="' + Ext.baseCSSPrefix + 'webkit sch-export {bodyClasses}"><tpl if="showHeader"><div class="sch-export-header" style="width:{totalWidth}px"><h2>{column}/{row}</h2></div></tpl><div class="{componentClasses}" style="height:{bodyHeight}px; width:{totalWidth}px; position: relative !important">{HTML}</div></body></html>', {disableFormats: true})
    }
    this.setFileFormat(this.fileFormat)
}, init: function (a) {
    this.scheduler = a;
    a.showExportDialog = Ext.Function.bind(this.showExportDialog, this);
    a.doExport = Ext.Function.bind(this.doExport, this)
}, setFileFormat: function (a) {
    if (typeof a !== "string") {
        this.fileFormat = "pdf"
    } else {
        a = a.toLowerCase();
        if (a === "png") {
            this.fileFormat = a
        } else {
            this.fileFormat = "pdf"
        }
    }
}, showExportDialog: function () {
    var b = this, a = b.scheduler.getSchedulingView();
    if (b.win) {
        b.win.destroy();
        b.win = null
    }
    b.win = Ext.create(b.exportDialogClassName, {plugin: b, exportDialogConfig: Ext.apply({startDate: b.scheduler.getStart(), endDate: b.scheduler.getEnd(), rowHeight: a.timeAxisViewModel.getViewRowHeight(), columnWidth: a.timeAxisViewModel.getTickWidth(), defaultConfig: b.defaultConfig}, b.exportDialogConfig)});
    b.saveRestoreData();
    b.win.show()
}, saveRestoreData: function () {
    var b = this.scheduler, a = b.getSchedulingView(), d = b.normalGrid, e = b.lockedGrid;
    var c = {};
    e.headerCt.items.each(function (f) {
        if (f.hidden) {
            c[f.id] = f
        }
    });
    this.restoreSettings = {width: b.getWidth(), height: b.getHeight(), rowHeight: a.timeAxisViewModel.getViewRowHeight(), columnWidth: a.timeAxisViewModel.getTickWidth(), startDate: b.getStart(), endDate: b.getEnd(), normalWidth: d.getWidth(), normalLeft: d.getEl().getStyle("left"), lockedWidth: e.getWidth(), lockedCollapse: e.collapsed, normalCollapse: d.collapsed, hiddenColumns: c}
}, getStylesheets: function () {
    var d = this.translateURLsToAbsolute, c = Ext.getDoc().select('link[rel="stylesheet"]'), a = Ext.get(Ext.core.DomHelper.createDom({tag: "div"})), b;
    c.each(function (e) {
        var f = e.dom.cloneNode(true);
        d && f.setAttribute("href", e.dom.href);
        a.appendChild(f)
    });
    b = a.dom.innerHTML + "";
    return b
}, doExport: function (m, h, p) {
    this.mask();
    var L = this, o = L.scheduler, q = o.getSchedulingView(), k = L.getStylesheets(), J = m || L.defaultConfig, r = o.normalGrid, G = o.lockedGrid, B = r.headerCt.getHeight();
    L.saveRestoreData();
    r.expand();
    G.expand();
    L.fireEvent("updateprogressbar", 0.1);
    this.forEachTimeSpanPlugin(o, function (a) {
        a._renderDelay = a.renderDelay;
        a.renderDelay = 0
    });
    if (this.expandAllBeforeExport && o.expandAll) {
        o.expandAll()
    }
    var K = o.timeAxis.getTicks(), s = q.timeAxisViewModel.getTickWidth(), E, e, f;
    if (!J.singlePageExport) {
        if (J.orientation === "landscape") {
            E = L.pageSizes[J.format].height * L.DPI;
            f = L.pageSizes[J.format].width * L.DPI
        } else {
            E = L.pageSizes[J.format].width * L.DPI;
            f = L.pageSizes[J.format].height * L.DPI
        }
        var I = 41;
        e = Math.floor(f) - B - (J.showHeader ? I : 0)
    }
    q.timeAxisViewModel.suppressFit = true;
    var F = 0;
    var j = 0;
    if (J.range !== "complete") {
        var d, b;
        switch (J.range) {
            case"date":
                d = new Date(J.dateFrom);
                b = new Date(J.dateTo);
                if (Sch.util.Date.getDurationInDays(d, b) < 1) {
                    b = Sch.util.Date.add(b, Sch.util.Date.DAY, 1)
                }
                d = Sch.util.Date.constrain(d, o.getStart(), o.getEnd());
                b = Sch.util.Date.constrain(b, o.getStart(), o.getEnd());
                break;
            case"current":
                var M = q.getVisibleDateRange();
                d = M.startDate;
                b = M.endDate || q.timeAxis.getEnd();
                if (J.cellSize) {
                    s = J.cellSize[0];
                    if (J.cellSize.length > 1) {
                        q.setRowHeight(J.cellSize[1])
                    }
                }
                break
        }
        o.setTimeSpan(d, b);
        var c = Math.floor(q.timeAxis.getTickFromDate(d));
        var v = Math.floor(q.timeAxis.getTickFromDate(b));
        K = o.timeAxis.getTicks();
        K = Ext.Array.filter(K, function (i, a) {
            if (a < c) {
                F++;
                return false
            } else {
                if (a > v) {
                    j++;
                    return false
                }
            }
            return true
        })
    }
    this.beforeExport(o, K);
    var D, A, g;
    if (!J.singlePageExport) {
        o.setWidth(E);
        o.setTimeColumnWidth(s);
        q.timeAxisViewModel.setTickWidth(s);
        g = L.calculatePages(J, K, s, E, e);
        A = L.getExportJsonHtml(g, {styles: k, config: J, ticks: K, skippedColsBefore: F, skippedColsAfter: j, printHeight: e, paperWidth: E, headerHeight: B});
        D = J.format
    } else {
        A = L.getExportJsonHtml(null, {styles: k, config: J, ticks: K, skippedColsBefore: F, skippedColsAfter: j, timeColumnWidth: s});
        var z = L.getRealSize(), u = Ext.Number.toFixed(z.width / L.DPI, 1), t = Ext.Number.toFixed(z.height / L.DPI, 1);
        D = u + "in*" + t + "in"
    }
    L.fireEvent("updateprogressbar", 0.4);
    if (L.printServer) {
        if (!L.debug && !L.test) {
            var y = {type: "POST", url: L.printServer, timeout: 60000, params: Ext.apply({html: {array: A}, startDate: o.getStartDate(), endDate: o.getEndDate(), format: D, orientation: J.orientation, range: J.range, fileFormat: L.fileFormat}, this.getParameters()), success: function (a) {
                L.onSuccess(a, h, p)
            }, failure: function (a) {
                L.onFailure(a, p)
            }, scope: L};
            Ext.apply(y, this.getAjaxConfig(y));
            Ext.Ajax.request(y)
        } else {
            if (L.debug) {
                var n, H = Ext.JSON.decode(A);
                for (var C = 0, x = H.length; C < x; C++) {
                    n = window.open();
                    n.document.write(H[C].html);
                    n.document.close()
                }
            }
        }
    } else {
        throw"Print server URL is not defined, please specify printServer config"
    }
    q.timeAxisViewModel.suppressFit = false;
    this.forEachTimeSpanPlugin(o, function (a) {
        a.renderDelay = a._renderDelay;
        delete a._renderDelay
    });
    L.restorePanel();
    this.afterExport(o);
    if (L.test) {
        return{htmlArray: Ext.JSON.decode(A), calculatedPages: g}
    }
}, getParameters: function () {
    return{}
}, getAjaxConfig: function (a) {
    return{}
}, getRealSize: function () {
    var c = this.scheduler, b = c.normalGrid.headerCt.getHeight(), e = "." + Ext.baseCSSPrefix + (Ext.versions.extjs.isLessThan("5.0") ? "grid-table" : "grid-item-container"), a = (b + c.lockedGrid.getView().getEl().down(e).getHeight()), d = (c.lockedGrid.headerCt.getEl().first().getWidth() + c.normalGrid.body.down(e).getWidth());
    return{width: d, height: a}
}, getRowHeight: function () {
    return this.scheduler.getSchedulingView().timeAxisViewModel.getViewRowHeight()
}, getRowHeights: function () {
    var f = this.scheduler, d = f.lockedGrid.getView(), e = d.getNodes(), h = this.getRowHeight(), b = {};
    for (var g = 0, c = e.length; g < c; g++) {
        var a = Ext.fly(e[g]).getHeight();
        if (a != h) {
            b[g] = a
        }
    }
    return b
}, getRowPagesBounds: function (c, j) {
    var k = this.scheduler, m = k.lockedGrid.getView(), b = m.getNodes();
    var o = [], g = this.getRowHeight(), e = 0, n = 0, h = 0;
    for (var f = 0, d = b.length; f < d; f++) {
        var a = j.hasOwnProperty(f) ? j[f] : g;
        e += a;
        if (e > c) {
            o.push([n, h]);
            e = a;
            n = f
        }
        h = f
    }
    o.push([n, h]);
    return o
}, calculatePages: function (s, t, k, p, b) {
    var u = this, j = u.scheduler, r = j.lockedGrid, c = this.getRowHeight(), v = r.headerCt, o = v.getEl().first().getWidth(), i = null, l = 0;
    if (o > p) {
        var h = 0, e = 0, n = 0, g;
        i = [];
        var f = function (y, x, w) {
            i.push({firstColumnIdx: y, lastColumnIdx: x, totalColumnsWidth: w});
            h = x + 1;
            n = 0
        };
        var q = r.headerCt.items.filter("hidden", false);
        q.each(function (y, x, w) {
            g = y.width;
            if (n + g > p) {
                f(h, x > 0 ? x - 1 : 0, p)
            }
            n += g;
            e = x
        });
        l = Math.floor((p - n) / k);
        f(h, e, (l > 0) ? n : p)
    } else {
        l = Math.floor((p - o) / k)
    }
    var m = Math.floor(p / k), a = Math.ceil((t.length - l) / m);
    if (i) {
        a += i.length
    } else {
        a += 1
    }
    var d = u.getRowHeights();
    return{columnsAmountLocked: l, columnsAmountNormal: m, lockedColumnPages: i, rowHeights: d, rowPagesBounds: u.getRowPagesBounds(b, d), rowPages: Math.ceil((u.getRealSize().height - j.normalGrid.headerCt.getHeight()) / b), columnPages: a, timeColumnWidth: k, lockedGridWidth: o, rowHeight: c, panelHTML: {}}
}, getExportJsonHtml: function (f, E) {
    var H = this, m = H.scheduler, x = [], u = new RegExp(Ext.baseCSSPrefix + "ie\\d?|" + Ext.baseCSSPrefix + "gecko", "g"), A = Ext.getBody().dom.className.replace(u, ""), p = m.el.dom.className, l = E.styles, F = E.config, G = E.ticks, n, d, e, o, q;
    if (Ext.isIE) {
        A += " sch-ie-export"
    }
    m.timeAxis.autoAdjust = false;
    if (!F.singlePageExport) {
        var r = f.columnsAmountLocked, t = f.columnsAmountNormal, j = f.lockedColumnPages, D = f.rowPagesBounds, s = f.rowPages, a = f.columnPages, B = E.paperWidth, c = E.printHeight, y = E.headerHeight, g = 0, h = null, b;
        q = f.timeColumnWidth;
        n = f.panelHTML;
        n.skippedColsBefore = E.skippedColsBefore;
        n.skippedColsAfter = E.skippedColsAfter;
        if (j) {
            g = j.length
        }
        for (var z = 0; z < a; z++) {
            if (z < g) {
                if (z === g - 1 && r) {
                    m.normalGrid.show();
                    h = Ext.Number.constrain(r - 1, 0, G.length - 1);
                    m.setTimeSpan(G[0].start, G[h].end)
                } else {
                    m.normalGrid.hide()
                }
                var C = j[z];
                this.showLockedColumns();
                this.hideLockedColumns(C.firstColumnIdx, C.lastColumnIdx);
                m.lockedGrid.setWidth(C.totalColumnsWidth + 1)
            } else {
                if (z === 0) {
                    this.showLockedColumns();
                    if (r) {
                        m.normalGrid.show();
                        h = Ext.Number.constrain(r - 1, 0, G.length - 1);
                        m.setTimeSpan(G[0].start, G[h].end)
                    }
                } else {
                    m.lockedGrid.hide();
                    m.normalGrid.show();
                    if (h === null) {
                        h = -1
                    }
                    if (G[h + t]) {
                        m.setTimeSpan(G[h + 1].start, G[h + t].end);
                        h += t
                    } else {
                        h = Ext.Number.constrain(h, 0, G.length - 2);
                        m.setTimeSpan(G[h + 1].start, G[G.length - 1].end)
                    }
                }
            }
            m.setTimeColumnWidth(q, true);
            m.getSchedulingView().timeAxisViewModel.setTickWidth(q);
            for (var w = 0; w < s; w++) {
                H.hideRows(D[w][0], D[w][1]);
                n.dom = m.body.dom.innerHTML;
                n.k = w;
                n.i = z;
                n.rowPagesBounds = D;
                n.rowHeights = f.rowHeights;
                n.rowHeight = f.rowHeight;
                d = H.resizePanelHTML(n);
                o = H.tpl.apply(Ext.apply({bodyClasses: A, bodyHeight: c + y, componentClasses: p, styles: l, showHeader: F.showHeader, HTML: d.dom.innerHTML, totalWidth: B, headerHeight: y, column: z + 1, row: w + 1}));
                e = {html: o};
                x.push(e);
                H.showRows()
            }
        }
        H.showLockedColumns()
    } else {
        q = E.timeColumnWidth;
        n = f ? f.panelHTML : {};
        m.setTimeSpan(G[0].start, G[G.length - 1].end);
        m.lockedGrid.setWidth(m.lockedGrid.headerCt.getEl().first().getWidth());
        m.setTimeColumnWidth(q);
        m.getSchedulingView().timeAxisViewModel.setTickWidth(q);
        var v = H.getRealSize();
        Ext.apply(n, {dom: m.body.dom.innerHTML, column: 1, row: 1, timeColumnWidth: E.timeColumnWidth, skippedColsBefore: E.skippedColsBefore, skippedColsAfter: E.skippedColsAfter});
        d = H.resizePanelHTML(n);
        o = H.tpl.apply(Ext.apply({bodyClasses: A, bodyHeight: v.height, componentClasses: p, styles: l, showHeader: false, HTML: d.dom.innerHTML, totalWidth: v.width}));
        e = {html: o};
        x.push(e)
    }
    m.timeAxis.autoAdjust = true;
    return Ext.JSON.encode(x)
}, forEachTimeSpanPlugin: function (b, d, c) {
    var e = this;
    if (Sch.feature && Sch.feature.AbstractTimeSpan) {
        var a = (b.plugins || []).concat(b.normalGrid.plugins || []).concat(b.columnLinesFeature || []);
        Ext.each(a, function (f) {
            if (f instanceof Sch.feature.AbstractTimeSpan) {
                d.call(c || e, f)
            }
        })
    }
}, resizePanelHTML: function (d) {
    var k = Ext.get(Ext.core.DomHelper.createDom({tag: "div", html: d.dom})), j = this.scheduler, b = j.lockedGrid, h = j.normalGrid;
    var a = function (n) {
        var m = k.select("#" + n, true).first();
        return m && m.dom
    }, l = function (m) {
        if (m) {
            m.style.width = "100%"
        }
    }, g = function (m) {
        if (m) {
            m.style.height = "100%"
        }
    }, f;
    if (Ext.isIE6 || Ext.isIE7 || Ext.isIEQuirks) {
        f = document.createDocumentFragment();
        var e = f.getElementById ? "" : "#";
        var i = (f.getElementById || f.querySelector);
        a = function (m) {
            return i(e + m)
        };
        f.appendChild(k.dom)
    }
    var c = [a(j.id + "-targetEl"), a(j.id + "-innerCt"), a(b.id), a(b.body.id), a(b.view.el.id)];
    Ext.Array.each(c, g);
    l(c[0]);
    l(c[1]);
    l(a(h.headerCt.id));
    Ext.Array.each([a(h.id), a(h.body.id), a(h.getView().id)], function (m) {
        if (m) {
            m.style.height = "100%";
            m.style.width = "100%"
        }
    });
    if (f) {
        k.dom.innerHTML = f.firstChild.innerHTML
    }
    return k
}, getWin: function () {
    return this.win || null
}, hideDialogWindow: function (a) {
    var b = this;
    b.fireEvent("hidedialogwindow", a);
    b.unmask();
    if (b.openAfterExport) {
        window.open(a.url, "ExportedPanel")
    }
}, onSuccess: function (c, h, b) {
    var d = this, g = d.getWin(), a;
    try {
        a = Ext.JSON.decode(c.responseText)
    } catch (f) {
        this.onFailure(c, b);
        return
    }
    d.fireEvent("updateprogressbar", 1, a);
    if (a.success) {
        setTimeout(function () {
            d.hideDialogWindow(a)
        }, g ? g.hideTime : 3000)
    } else {
        d.fireEvent("showdialogerror", g, a.msg, a)
    }
    d.unmask();
    if (h) {
        h.call(this, c)
    }
}, onFailure: function (b, a) {
    var c = this.getWin(), d = b.status === 200 ? b.responseText : b.statusText;
    this.fireEvent("showdialogerror", c, d);
    this.unmask();
    if (a) {
        a.call(this, b)
    }
}, hideRows: function (d, g) {
    var f = this.scheduler, c = f.lockedGrid.view.getNodes(), a = f.normalGrid.view.getNodes();
    for (var e = 0, b = a.length; e < b; e++) {
        if (e < d || e > g) {
            c[e].className += " sch-none";
            a[e].className += " sch-none"
        }
    }
}, showRows: function () {
    this.scheduler.getEl().select(this.scheduler.getSchedulingView().getItemSelector()).each(function (a) {
        a.removeCls("sch-none")
    })
}, hideLockedColumns: function (e, g) {
    var f = this.scheduler.lockedGrid.headerCt.items.items;
    var b = 0;
    for (var c = 0, a = f.length; c < a; c++) {
        var d = f[c];
        if (!this.restoreSettings.hiddenColumns[d.id]) {
            if ((b < e || b > g)) {
                d.hide()
            }
            b++
        }
    }
}, showLockedColumns: function () {
    this.scheduler.lockedGrid.headerCt.items.each(function (a) {
        if (!this.restoreSettings.hiddenColumns[a.id]) {
            a.show()
        }
    }, this)
}, mask: function () {
    var a = Ext.getBody().mask();
    a.addCls("sch-export-mask")
}, unmask: function () {
    Ext.getBody().unmask()
}, restorePanel: function () {
    var b = this.scheduler, a = this.restoreSettings;
    b.setWidth(a.width);
    b.setHeight(a.height);
    b.setTimeSpan(a.startDate, a.endDate);
    b.setTimeColumnWidth(a.columnWidth, true);
    b.getSchedulingView().setRowHeight(a.rowHeight);
    b.lockedGrid.show();
    b.normalGrid.setWidth(a.normalWidth);
    b.normalGrid.getEl().setStyle("left", a.normalLeft);
    b.lockedGrid.setWidth(a.lockedWidth);
    b.getSchedulingView().timeAxisViewModel.setTickWidth(a.columnWidth);
    if (a.lockedCollapse) {
        b.lockedGrid.collapse()
    }
    if (a.normalCollapse) {
        b.normalGrid.collapse()
    }
    b.getSchedulingView().timeAxisViewModel.update()
}, destroy: function () {
    if (this.win) {
        this.win.destroy()
    }
}});
Ext.define("Sch.plugin.Lines", {extend: "Sch.feature.AbstractTimeSpan", alias: "plugin.scheduler_lines", cls: "sch-timeline", showTip: true, innerTpl: null, prepareTemplateData: null, side: null, init: function (a) {
    if (Ext.isString(this.innerTpl)) {
        this.innerTpl = new Ext.XTemplate(this.innerTpl)
    }
    this.side = a.rtl ? "right" : "left";
    var b = this.innerTpl;
    if (!this.template) {
        this.template = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" ' + (this.showTip ? 'title="{[this.getTipText(values)]}" ' : "") + 'class="{$cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px">' + (b ? "{[this.renderInner(values)]}" : "") + "</div>", "</tpl>", {getTipText: function (c) {
            return a.getSchedulingView().getFormattedDate(c.Date) + " " + (c.Text || "")
        }, renderInner: function (c) {
            return b.apply(c)
        }})
    }
    this.callParent(arguments)
}, getElementData: function (m, q, c) {
    var t = this.store, j = this.schedulerView, p = j.isHorizontal(), f = c || t.getRange(), h = [], r, a, o = j.getTimeSpanRegion(m, null, this.expandToFitView), k, b, e;
    if (Ext.versions.touch) {
        r = "100%"
    } else {
        r = p ? o.bottom - o.top : 1
    }
    a = p ? 1 : o.right - o.left;
    for (var g = 0, d = f.length; g < d; g++) {
        k = f[g];
        b = k.get("Date");
        if (b && Sch.util.Date.betweenLesser(b, m, q)) {
            var n = j.getCoordinateFromDate(b);
            e = Ext.apply({}, this.getTemplateData(k));
            e.id = this.getElementId(k);
            e.$cls = this.getElementCls(k, e);
            e.width = a;
            e.height = r;
            if (p) {
                e.left = n
            } else {
                e.top = n
            }
            h.push(e)
        }
    }
    return h
}, getHeaderElementData: function (c) {
    var a = this.timeAxis.getStart(), k = this.timeAxis.getEnd(), m = this.schedulerView.isHorizontal(), g = [], h, b, j, e;
    c = c || this.store.getRange();
    for (var f = 0, d = c.length; f < d; f++) {
        h = c[f];
        b = h.get("Date");
        if (b && Sch.util.Date.betweenLesser(b, a, k)) {
            j = this.getHeaderElementPosition(b);
            e = this.getTemplateData(h);
            g.push(Ext.apply({id: this.getHeaderElementId(h), side: m ? this.side : "top", cls: this.getHeaderElementCls(h, e), position: j}, e))
        }
    }
    return g
}});
Ext.define("Sch.plugin.CurrentTimeLine", {extend: "Sch.plugin.Lines", alias: "plugin.scheduler_currenttimeline", mixins: ["Sch.mixin.Localizable"], requires: ["Ext.data.JsonStore"], updateInterval: 60000, showHeaderElements: true, autoUpdate: true, expandToFitView: true, timer: null, init: function (c) {
    if (Ext.getVersion("touch")) {
        this.showHeaderElements = false
    }
    var b = new Ext.data.JsonStore({fields: ["Date", "Cls", "Text"], data: [
        {Date: new Date(), Cls: "sch-todayLine", Text: this.L("tooltipText")}
    ]});
    var a = b.first();
    if (this.autoUpdate) {
        this.timer = setInterval(function () {
            a.set("Date", new Date())
        }, this.updateInterval)
    }
    c.on("destroy", this.onHostDestroy, this);
    this.store = b;
    this.callParent(arguments)
}, onHostDestroy: function () {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null
    }
    if (this.store.autoDestroy) {
        this.store.destroy()
    }
}});
Ext.define("Sch.plugin.DragSelector", {extend: "Sch.util.DragTracker", alias: "plugin.scheduler_dragselector", mixins: ["Ext.AbstractPlugin"], requires: ["Sch.util.ScrollManager"], lockableScope: "top", schedulerView: null, eventData: null, sm: null, proxy: null, bodyRegion: null, constructor: function (a) {
    a = a || {};
    Ext.applyIf(a, {onBeforeStart: this.onBeforeStart, onStart: this.onStart, onDrag: this.onDrag, onEnd: this.onEnd});
    this.callParent(arguments)
}, init: function (b) {
    var a = this.schedulerView = b.getSchedulingView();
    a.on({afterrender: this.onSchedulingViewRender, destroy: this.onSchedulingViewDestroy, scope: this})
}, onBeforeStart: function (a) {
    return!a.getTarget(".sch-event") && a.ctrlKey
}, onStart: function (b) {
    var c = this.schedulerView;
    this.proxy.show();
    this.bodyRegion = c.getScheduleRegion();
    var a = [];
    c.getEventNodes().each(function (d) {
        a[a.length] = {region: d.getRegion(), node: d.dom}
    });
    this.eventData = a;
    this.sm.deselectAll();
    Sch.util.ScrollManager.activate(c.el)
}, onDrag: function (h) {
    var j = this.sm, f = this.eventData, b = this.getRegion().constrainTo(this.bodyRegion), c, d, a, g;
    this.proxy.setRegion(b);
    for (c = 0, a = f.length; c < a; c++) {
        d = f[c];
        g = b.intersect(d.region);
        if (g && !d.selected) {
            d.selected = true;
            j.selectNode(d.node, true)
        } else {
            if (!g && d.selected) {
                d.selected = false;
                j.deselectNode(d.node)
            }
        }
    }
}, onEnd: function (a) {
    if (this.proxy) {
        this.proxy.setDisplayed(false)
    }
    Sch.util.ScrollManager.deactivate()
}, onSchedulingViewRender: function (a) {
    this.sm = a.getSelectionModel();
    this.initEl(this.schedulerView.el);
    this.proxy = a.el.createChild({cls: "sch-drag-selector"})
}, onSchedulingViewDestroy: function () {
    if (this.proxy) {
        Ext.destroy(this.proxy)
    }
    this.destroy()
}});
Ext.define("Sch.plugin.EventEditor", {extend: "Ext.form.Panel", mixins: ["Ext.AbstractPlugin", "Sch.mixin.Localizable"], alias: ["widget.eventeditor", "plugin.scheduler_eventeditor"], lockableScope: "normal", requires: ["Sch.util.Date", "Ext.util.Region", "Ext.form.Label", "Ext.form.field.Date", "Ext.form.field.Time"], hideOnBlur: true, startDateField: null, startTimeField: null, durationField: null, timeConfig: null, dateConfig: null, durationConfig: null, durationUnit: null, durationText: null, triggerEvent: "eventdblclick", fieldsPanelConfig: null, dateFormat: "Y-m-d", timeFormat: "H:i", cls: "sch-eventeditor", border: false, shadow: false, dynamicForm: true, eventRecord: null, hidden: true, collapsed: true, currentForm: null, schedulerView: null, resourceRecord: null, preventHeader: true, floating: true, hideMode: "offsets", ignoreCls: "sch-event-editor-ignore-click", readOnly: false, layout: {type: "vbox", align: "stretch"}, constrain: false, constructor: function (a) {
    a = a || {};
    Ext.apply(this, a);
    this.durationUnit = this.durationUnit || Sch.util.Date.HOUR;
    this.callParent(arguments)
}, initComponent: function () {
    if (!this.fieldsPanelConfig) {
        throw"Must define a fieldsPanelConfig property"
    }
    Ext.apply(this, {fbar: this.buttons || this.buildButtons(), items: [
        {xtype: "container", layout: "hbox", height: 35, border: false, cls: "sch-eventeditor-timefields", items: this.buildDurationFields()},
        Ext.applyIf(this.fieldsPanelConfig, {flex: 1, activeItem: 0})
    ]});
    this.callParent(arguments)
}, init: function (a) {
    this.ownerCt = a;
    this.schedulerView = a.getView();
    this.eventStore = this.schedulerView.getEventStore();
    this.schedulerView.on({afterrender: this.onSchedulerRender, destroy: this.onSchedulerDestroy, dragcreateend: this.onDragCreateEnd, eventrepaint: this.onEventRepaint, scope: this});
    if (this.triggerEvent) {
        this.schedulerView.on(this.triggerEvent, this.onActivateEditor, this)
    }
    this.schedulerView.registerEventEditor(this)
}, onSchedulerRender: function () {
    this.render(Ext.getBody());
    if (this.hideOnBlur) {
        this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this)
    }
}, show: function (g, i) {
    var h = this.schedulerView.isReadOnly();
    if (h !== this.readOnly) {
        Ext.Array.each(this.query("field"), function (j) {
            j.setReadOnly(h)
        });
        this.saveButton.setVisible(!h);
        this.deleteButton.setVisible(!h);
        this.readOnly = h
    }
    if (this.deleteButton) {
        this.deleteButton.setVisible(!h && this.eventStore.indexOf(g) >= 0)
    }
    this.eventRecord = g;
    this.durationField.setValue(Sch.util.Date.getDurationInUnit(g.getStartDate(), g.getEndDate(), this.durationUnit, true));
    var e = g.getStartDate();
    this.startDateField.setValue(e);
    this.startTimeField.setValue(e);
    var f = this.schedulerView.up("[floating=true]");
    if (f) {
        this.getEl().setZIndex(f.getEl().getZIndex() + 1);
        f.addCls(this.ignoreCls)
    }
    this.callParent();
    i = i || this.schedulerView.getElementFromEventRecord(g);
    this.alignTo(i, this.schedulerView.getMode() == "horizontal" ? "bl" : "tl-tr", this.getConstrainOffsets(i));
    this.expand(!this.constrain);
    if (this.constrain) {
        this.doConstrain(Ext.util.Region.getRegion(Ext.getBody()))
    }
    var c, d = g.get("EventType");
    if (d && this.dynamicForm) {
        var b = this.items.getAt(1), a = b.query("> component[EventType=" + d + "]");
        if (!a.length) {
            throw"Can't find form for EventType=" + d
        }
        if (!b.getLayout().setActiveItem) {
            throw"Can't switch active component in the 'fieldsPanel'"
        }
        c = a[0];
        if (!(c instanceof Ext.form.Panel)) {
            throw"Each child component of 'fieldsPanel' should be a 'form'"
        }
        b.getLayout().setActiveItem(c)
    } else {
        c = this
    }
    this.currentForm = c;
    c.getForm().loadRecord(g)
}, getConstrainOffsets: function (a) {
    return[0, 0]
}, onSaveClick: function () {
    var e = this, h = e.eventRecord, a = this.currentForm.getForm();
    if (a.isValid() && this.fireEvent("beforeeventsave", this, h) !== false) {
        var c = e.startDateField.getValue(), i, b = e.startTimeField.getValue(), g = e.durationField.getValue();
        if (c && g >= 0) {
            if (b) {
                Sch.util.Date.copyTimeValues(c, b)
            }
            i = Sch.util.Date.add(c, this.durationUnit, g)
        } else {
            return
        }
        var d = h.getResources(this.eventStore);
        var f = (d.length > 0 && d[0]) || this.resourceRecord;
        if (!this.schedulerView.allowOverlap && !this.schedulerView.isDateRangeAvailable(c, i, h, f)) {
            return
        }
        h.beginEdit();
        a.updateRecord(h);
        h.setStartEndDate(c, i);
        h.endEdit();
        if (this.eventStore.indexOf(this.eventRecord) < 0) {
            if (this.schedulerView.fireEvent("beforeeventadd", this.schedulerView, h) !== false) {
                this.eventStore.append(h)
            }
        }
        e.collapse(null, true)
    }
}, onDeleteClick: function () {
    if (this.fireEvent("beforeeventdelete", this, this.eventRecord) !== false) {
        this.eventStore.remove(this.eventRecord)
    }
    this.collapse(null, true)
}, onCancelClick: function () {
    this.collapse(null, true)
}, buildButtons: function () {
    this.saveButton = new Ext.Button({text: this.L("saveText"), scope: this, handler: this.onSaveClick});
    this.deleteButton = new Ext.Button({text: this.L("deleteText"), scope: this, handler: this.onDeleteClick});
    this.cancelButton = new Ext.Button({text: this.L("cancelText"), scope: this, handler: this.onCancelClick});
    return[this.saveButton, this.deleteButton, this.cancelButton]
}, buildDurationFields: function () {
    this.startDateField = new Ext.form.field.Date(Ext.apply({width: 90, allowBlank: false, format: this.dateFormat}, this.dateConfig || {}));
    this.startDateField.getPicker().addCls(this.ignoreCls);
    this.startTimeField = new Ext.form.field.Time(Ext.apply({width: 70, allowBlank: false, format: this.timeFormat}, this.timeConfig || {}));
    this.startTimeField.getPicker().addCls(this.ignoreCls);
    this.durationField = new Ext.form.field.Number(Ext.apply({width: 45, value: 0, minValue: 0, allowNegative: false}, this.durationConfig || {}));
    this.durationLabel = new Ext.form.Label({text: this.getDurationText()});
    return[this.startDateField, this.startTimeField, this.durationField, this.durationLabel]
}, onActivateEditor: function (b, a) {
    this.show(a)
}, onMouseDown: function (a) {
    if (this.collapsed || a.within(this.getEl()) || a.getTarget("." + this.ignoreCls, 9) || a.getTarget(this.schedulerView.eventSelector)) {
        return
    }
    this.collapse()
}, onSchedulerDestroy: function () {
    this.destroy()
}, onDragCreateEnd: function (b, a, c) {
    if (!this.dragProxyEl && this.schedulerView.dragCreator) {
        this.dragProxyEl = this.schedulerView.dragCreator.getProxy()
    }
    this.resourceRecord = c;
    this.schedulerView.onEventCreated(a);
    this.show(a, this.dragProxyEl)
}, hide: function () {
    this.callParent(arguments);
    var a = this.dragProxyEl;
    if (a) {
        a.hide()
    }
}, afterCollapse: function () {
    this.hide();
    this.callParent(arguments)
}, getDurationText: function () {
    if (this.durationText) {
        return this.durationText
    }
    return Sch.util.Date.getShortNameOfUnit(Sch.util.Date.getNameOfUnit(this.durationUnit))
}, onEventRepaint: function (b, a) {
    if (!this.getCollapsed() && a === this.eventRecord) {
        this.show(a)
    }
}});
Ext.define("Sch.plugin.EventTools", {extend: "Ext.Container", mixins: ["Ext.AbstractPlugin"], lockableScope: "top", alias: "plugin.scheduler_eventtools", hideDelay: 500, align: "right", defaults: {xtype: "tool", baseCls: "sch-tool", overCls: "sch-tool-over", width: 20, height: 20, visibleFn: Ext.emptyFn}, hideTimer: null, lastPosition: null, cachedSize: null, offset: {x: 0, y: 1}, autoRender: true, floating: true, hideMode: "offsets", hidden: true, getRecord: function () {
    return this.record
}, init: function (a) {
    if (!this.items) {
        throw"Must define an items property for this plugin to function correctly"
    }
    this.addCls("sch-event-tools");
    this.scheduler = a;
    a.on({eventresizestart: this.onOperationStart, eventresizeend: this.onOperationEnd, eventdragstart: this.onOperationStart, eventdrop: this.onOperationEnd, eventmouseenter: this.onEventMouseEnter, eventmouseleave: this.onContainerMouseLeave, scope: this})
}, onRender: function () {
    this.callParent(arguments);
    this.scheduler.mon(this.el, {mouseenter: this.onContainerMouseEnter, mouseleave: this.onContainerMouseLeave, scope: this})
}, onEventMouseEnter: function (g, a, f) {
    var c = false;
    var h;
    this.record = a;
    this.items.each(function (i) {
        h = i.visibleFn(a) !== false;
        i.setVisible(h);
        if (h) {
            c = true
        }
    }, this);
    if (!c) {
        return
    }
    if (!this.rendered) {
        this.doAutoRender()
    }
    var e = f.getTarget(g.eventSelector);
    var d = Ext.fly(e).getBox();
    this.doLayout();
    var b = this.getSize();
    this.lastPosition = [f.getXY()[0] - (b.width / 2), d.y - b.height - this.offset.y];
    this.onContainerMouseEnter()
}, onContainerMouseEnter: function () {
    window.clearTimeout(this.hideTimer);
    this.setPosition.apply(this, this.lastPosition);
    this.show()
}, onContainerMouseLeave: function () {
    window.clearTimeout(this.hideTimer);
    this.hideTimer = Ext.defer(this.hide, this.hideDelay, this)
}, onOperationStart: function () {
    this.scheduler.un("eventmouseenter", this.onEventMouseEnter, this);
    window.clearTimeout(this.hideTimer);
    this.hide()
}, onOperationEnd: function () {
    this.scheduler.on("eventmouseenter", this.onEventMouseEnter, this)
}});
Ext.define("Sch.plugin.Pan", {extend: "Ext.AbstractPlugin", alias: "plugin.scheduler_pan", lockableScope: "top", enableVerticalPan: true, statics: {KEY_SHIFT: 1, KEY_CTRL: 2, KEY_ALT: 4, KEY_ALL: 7}, disableOnKey: 0, panel: null, constructor: function (a) {
    Ext.apply(this, a)
}, init: function (a) {
    this.panel = a.normalGrid || a;
    this.view = a.getSchedulingView();
    this.view.on("afterrender", this.onRender, this)
}, onRender: function (a) {
    this.view.el.on("mousedown", this.onMouseDown, this)
}, onMouseDown: function (d, c) {
    var b = this.self, a = this.disableOnKey;
    if ((d.shiftKey && (a & b.KEY_SHIFT)) || (d.ctrlKey && (a & b.KEY_CTRL)) || (d.altKey && (a & b.KEY_ALT))) {
        return
    }
    if (d.getTarget("." + this.view.timeCellCls, 10) && !d.getTarget(this.view.eventSelector)) {
        this.mouseX = d.getPageX();
        this.mouseY = d.getPageY();
        Ext.getBody().on("mousemove", this.onMouseMove, this);
        Ext.getDoc().on("mouseup", this.onMouseUp, this);
        if (Ext.isIE || Ext.isGecko) {
            Ext.getBody().on("mouseenter", this.onMouseUp, this)
        }
        d.stopEvent()
    }
}, onMouseMove: function (d) {
    d.stopEvent();
    var a = d.getPageX(), f = d.getPageY(), c = a - this.mouseX, b = f - this.mouseY;
    this.panel.scrollByDeltaX(-c);
    this.mouseX = a;
    this.mouseY = f;
    if (this.enableVerticalPan) {
        this.panel.scrollByDeltaY(-b)
    }
}, onMouseUp: function (a) {
    Ext.getBody().un("mousemove", this.onMouseMove, this);
    Ext.getDoc().un("mouseup", this.onMouseUp, this);
    if (Ext.isIE || Ext.isGecko) {
        Ext.getBody().un("mouseenter", this.onMouseUp, this)
    }
}});
Ext.define("Sch.plugin.SimpleEditor", {extend: "Ext.Editor", alias: "plugin.scheduler_simpleeditor", requires: ["Ext.form.TextField"], mixins: ["Ext.AbstractPlugin", "Sch.mixin.Localizable"], lockableScope: "top", cls: "sch-simpleeditor", allowBlur: false, delegate: ".sch-event-inner", dataIndex: null, completeOnEnter: true, cancelOnEsc: true, ignoreNoChange: true, height: 19, autoSize: {width: "boundEl"}, initComponent: function () {
    this.field = this.field || {xtype: "textfield", selectOnFocus: true};
    this.callParent(arguments)
}, init: function (a) {
    this.scheduler = a.getSchedulingView();
    a.on("afterrender", this.onSchedulerRender, this);
    this.scheduler.registerEventEditor(this);
    this.dataIndex = this.dataIndex || this.scheduler.getEventStore().model.prototype.nameField
}, edit: function (a, b) {
    b = b || this.scheduler.getElementFromEventRecord(a);
    this.startEdit(b.child(this.delegate));
    this.record = a;
    this.setValue(this.record.get(this.dataIndex))
}, onSchedulerRender: function (a) {
    this.on({startedit: this.onStartEdit, complete: function (e, f, d) {
        var b = this.record;
        var c = this.scheduler.eventStore;
        b.set(this.dataIndex, f);
        if (c.indexOf(b) < 0) {
            if (this.scheduler.fireEvent("beforeeventadd", this.scheduler, b) !== false) {
                c.append(b)
            }
        }
        this.onAfterEdit()
    }, canceledit: this.onAfterEdit, hide: function () {
        if (this.dragProxyEl) {
            this.dragProxyEl.hide()
        }
    }, scope: this});
    a.on({eventdblclick: function (b, c, d) {
        if (!a.isReadOnly()) {
            this.edit(c)
        }
    }, dragcreateend: this.onDragCreateEnd, scope: this})
}, onStartEdit: function () {
    if (!this.allowBlur) {
        Ext.getBody().on("mousedown", this.onMouseDown, this);
        this.scheduler.on("eventmousedown", function () {
            this.cancelEdit()
        }, this)
    }
}, onAfterEdit: function () {
    if (!this.allowBlur) {
        Ext.getBody().un("mousedown", this.onMouseDown, this);
        this.scheduler.un("eventmousedown", function () {
            this.cancelEdit()
        }, this)
    }
}, onMouseDown: function (b, a) {
    if (this.editing && this.el && !b.within(this.el)) {
        this.cancelEdit()
    }
}, onDragCreateEnd: function (b, a) {
    if (!this.dragProxyEl && this.scheduler.dragCreator) {
        this.dragProxyEl = this.scheduler.dragCreator.getProxy()
    }
    this.scheduler.onEventCreated(a);
    if (a.get(this.dataIndex) === "") {
        a.set(this.dataIndex, this.L("newEventText"))
    }
    this.edit(a, this.dragProxyEl)
}});
Ext.define("Sch.plugin.Zones", {extend: "Sch.feature.AbstractTimeSpan", alias: "plugin.scheduler_zones", requires: ["Sch.model.Range"], innerTpl: null, cls: "sch-zone", side: null, init: function (a) {
    if (Ext.isString(this.innerTpl)) {
        this.innerTpl = new Ext.XTemplate(this.innerTpl)
    }
    this.side = a.rtl ? "right" : "left";
    var b = this.innerTpl;
    if (!this.template) {
        this.template = new Ext.XTemplate('<tpl for="."><div id="{id}" class="{$cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}" : "") + "</div></tpl>", {renderInner: function (c) {
            return b.apply(c)
        }})
    }
    if (Ext.isString(this.innerHeaderTpl)) {
        this.innerHeaderTpl = new Ext.XTemplate(this.innerHeaderTpl)
    }
    this.callParent(arguments)
}, getElementData: function (h, d, r, f) {
    var g = this.schedulerView, t = [];
    var c = g.getTimeSpanRegion(h, d, this.expandToFitView);
    var b, k, a, j, n, e;
    r = r || this.store.getRange();
    for (var q = 0, p = r.length; q < p; q++) {
        b = r[q];
        k = b.getStartDate();
        a = b.getEndDate();
        e = this.getTemplateData(b);
        if (k && a && Sch.util.Date.intersectSpans(k, a, h, d)) {
            j = Ext.apply({}, e);
            j.id = this.getElementId(b);
            j.$cls = this.getElementCls(b, e);
            var m = g.getMode();
            if (m === "calendar") {
                var s = g.getTimeSpanRegion(k, a);
                j.left = s.left;
                j.top = s.top;
                j.height = s.bottom - s.top;
                j.width = s.right - s.left
            } else {
                var u = g.getCoordinateFromDate(Sch.util.Date.max(k, h));
                var o = g.getCoordinateFromDate(Sch.util.Date.min(a, d));
                if (m === "horizontal") {
                    j.left = u;
                    j.top = c.top;
                    j.width = f ? 0 : o - u;
                    j.height = c.bottom - c.top;
                    j.style = f ? ("border-left-width:" + (o - u) + "px") : ""
                } else {
                    j.left = c.left;
                    j.top = u;
                    j.height = f ? 0 : o - u;
                    j.width = c.right - c.left;
                    j.style = f ? ("border-top-width:" + (o - u) + "px") : ""
                }
            }
            t.push(j)
        }
    }
    return t
}, getHeaderElementId: function (b, a) {
    return this.callParent([b]) + (a ? "-start" : "-end")
}, getHeaderElementCls: function (b, d, a) {
    var c = b.clsField || this.clsField;
    if (!d) {
        d = this.getTemplateData(b)
    }
    return"sch-header-indicator sch-header-indicator-" + (a ? "start " : "end ") + this.uniqueCls + " " + (d[c] || "")
}, getZoneHeaderElementData: function (b, h, f, a) {
    var c = a ? f.getStartDate() : f.getEndDate(), e = null, g, i, d;
    if (c && Sch.util.Date.betweenLesser(c, b, h)) {
        g = this.getHeaderElementPosition(c);
        i = this.schedulerView.isHorizontal();
        d = this.getTemplateData(f);
        e = Ext.apply({id: this.getHeaderElementId(f, a), cls: this.getHeaderElementCls(f, d, a), isStart: a, side: i ? this.side : "top", position: g}, d)
    }
    return e
}, getHeaderElementData: function (b) {
    var a = this.timeAxis.getStart(), h = this.timeAxis.getEnd(), e = [], g, d, j;
    b = b || this.store.getRange();
    for (var f = 0, c = b.length; f < c; f++) {
        g = b[f];
        d = this.getZoneHeaderElementData(a, h, g, true);
        if (d) {
            e.push(d)
        }
        j = this.getZoneHeaderElementData(a, h, g, false);
        if (j) {
            e.push(j)
        }
    }
    return e
}, updateZoneHeaderElement: function (a, b) {
    a.dom.className = b.cls;
    if (this.schedulerView.isHorizontal()) {
        this.setElementX(a, b.position)
    } else {
        a.setTop(b.position)
    }
}, updateHeaderElement: function (c) {
    var a = this.timeAxis.getStart(), g = this.timeAxis.getEnd(), f = Ext.get(this.getHeaderElementId(c, true)), e = Ext.get(this.getHeaderElementId(c, false)), d = this.getZoneHeaderElementData(a, g, c, true), b = this.getZoneHeaderElementData(a, g, c, false);
    if (!(f && b) || !(e && b)) {
        Ext.destroy(f, e);
        this.renderHeaderElementsInternal([c])
    } else {
        if (f) {
            if (!d) {
                Ext.destroy(f)
            } else {
                this.updateZoneHeaderElement(f, d)
            }
        }
        if (e) {
            if (!b) {
                Ext.destroy(e)
            } else {
                this.updateZoneHeaderElement(e, b)
            }
        }
    }
}});
Ext.define("Sch.plugin.TimeGap", {extend: "Sch.plugin.Zones", alias: "plugin.scheduler_timegap", requires: ["Ext.data.JsonStore"], getZoneCls: Ext.emptyFn, init: function (a) {
    this.store = new Ext.data.JsonStore({model: "Sch.model.Range"});
    this.scheduler = a;
    a.mon(a.eventStore, {load: this.populateStore, update: this.populateStore, remove: this.populateStore, add: this.populateStore, datachanged: this.populateStore, scope: this});
    a.on("viewchange", this.populateStore, this);
    this.schedulerView = a.getSchedulingView();
    this.callParent(arguments)
}, populateStore: function (c) {
    var b = this.schedulerView.getEventsInView(), f = [], e = this.scheduler.getStart(), i = this.scheduler.getEnd(), d = b.getCount(), j = e, h, g = 0, a;
    b.sortBy(function (l, k) {
        return l.getStartDate() - k.getStartDate()
    });
    a = b.getAt(0);
    while (j < i && g < d) {
        h = a.getStartDate();
        if (!Sch.util.Date.betweenLesser(j, h, a.getEndDate()) && j < h) {
            f.push(new this.store.model({StartDate: j, EndDate: h, Cls: this.getZoneCls(j, h) || ""}))
        }
        j = Sch.util.Date.max(a.getEndDate(), j);
        g++;
        a = b.getAt(g)
    }
    if (j < i) {
        f.push(new this.store.model({StartDate: j, EndDate: i, Cls: this.getZoneCls(j, i) || ""}))
    }
    this.store.removeAll(f.length > 0);
    this.store.add(f)
}});
Ext.define("Sch.plugin.TreeCellEditing", {extend: "Ext.grid.plugin.CellEditing", alias: "plugin.scheduler_treecellediting", lockableScope: "locked", editorsStarted: 0, init: function (a) {
    this._grid = a;
    this.on("beforeedit", this.checkReadOnly, this);
    this.callParent(arguments)
}, bindPositionFixer: function () {
    Ext.on({afterlayout: this.fixEditorPosition, scope: this})
}, unbindPositionFixer: function () {
    Ext.un({afterlayout: this.fixEditorPosition, scope: this})
}, fixEditorPosition: function () {
    var a = this.getActiveEditor();
    if (a && a.getEl()) {
        var c = this.getEditingContext(this.context.record, this.context.column);
        if (c) {
            this.context.row = c.row;
            this.context.rowIdx = c.rowIdx;
            a.boundEl = this.getCell(c.record, c.column);
            a.realign();
            this.scroll = this.view.el.getScroll();
            var b = this._grid.getView();
            b.focusedRow = b.getNode(c.rowIdx)
        }
    }
}, checkReadOnly: function () {
    var a = this._grid;
    if (!(a instanceof Sch.panel.TimelineTreePanel)) {
        a = a.up("tablepanel")
    }
    return!a.isReadOnly()
}, startEdit: function (a, c, b) {
    this._grid.suspendLayouts();
    var d = this.callParent(arguments);
    this._grid.resumeLayouts();
    return d
}, onEditComplete: function (b, d, a) {
    var c = this;
    if (b.field.applyChanges) {
        b.field.applyChanges(b.field.task || c.context.record);
        c.callParent([b, d, d])
    } else {
        c.callParent([b, d, a])
    }
    c.unbindPositionFixer()
}, showEditor: function (d, a, i) {
    var b = this.grid.getSelectionModel();
    var g;
    var f = this;
    this.editorsStarted++;
    if (!d.hideEditOverridden) {
        var c = d.hideEdit;
        d.hideEdit = function () {
            f.editorsStarted--;
            if (!f.editorsStarted) {
                c.apply(this, arguments)
            }
        };
        d.hideEditOverridden = true
    }
    if (Ext.isIE && Ext.getVersion("extjs").isLessThan("4.2.2.1144")) {
        g = b.selectByPosition;
        b.selectByPosition = Ext.emptyFn;
        this.view.focusedRow = this.view.getNode(a.record)
    }
    var h = d.field;
    if (h && h.setSuppressTaskUpdate) {
        h.setSuppressTaskUpdate(true);
        if (!d.startEditOverridden) {
            d.startEditOverridden = true;
            var e = d.startEdit;
            d.startEdit = function () {
                e.apply(this, arguments);
                h.setSuppressTaskUpdate(false)
            }
        }
    }
    if (h) {
        if (h.setTask) {
            h.setTask(a.record);
            i = a.value = a.originalValue = h.getValue()
        } else {
            if (!a.column.dataIndex && a.value === undefined) {
                i = a.value = h.getDisplayValue(a.record)
            }
        }
    }
    if (Ext.isIE8m && Ext.getVersion("extjs").toString() === "4.2.2.1144") {
        Ext.EventObject.type = "click"
    }
    this.callParent([d, a, i]);
    if (g) {
        b.selectByPosition = g
    }
    this.bindPositionFixer()
}, cancelEdit: function () {
    this.callParent(arguments);
    this.unbindPositionFixer()
}});
Ext.define("Sch.plugin.ResourceZones", {extend: "Sch.plugin.Zones", alias: "plugin.scheduler_resourcezones", innerTpl: null, store: null, cls: "sch-resourcezone", init: function (a) {
    this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
    this.scheduler = a;
    a.on("destroy", this.onSchedulerDestroy, this);
    a.registerRenderer(this.renderer, this);
    if (Ext.isString(this.innerTpl)) {
        this.innerTpl = new Ext.XTemplate(this.innerTpl)
    }
    var b = this.innerTpl;
    if (!this.template) {
        this.template = new Ext.XTemplate('<tpl for="."><div id="' + this.uniqueCls + '-{id}" class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="' + (a.rtl ? "right" : "left") + ':{start}px;width:{width}px;top:{start}px;height:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}" : "") + "</div></tpl>", {renderInner: function (c) {
            return b.apply(c)
        }})
    }
    this.storeListeners = {load: this.fullRefresh, datachanged: this.fullRefresh, clear: this.fullRefresh, add: this.fullRefresh, remove: this.fullRefresh, update: this.refreshSingle, addrecords: this.fullRefresh, removerecords: this.fullRefresh, updaterecord: this.refreshSingle, scope: this};
    this.store.on(this.storeListeners)
}, onSchedulerDestroy: function () {
    this.store.un(this.storeListeners)
}, fullRefresh: function () {
    this.scheduler.getSchedulingView().refresh()
}, renderer: function (c, b, a, d) {
    if (this.scheduler.getOrientation() === "horizontal" || d === 0) {
        return this.renderZones(a)
    }
    return""
}, renderZones: function (e) {
    var c = this.store, h = this.scheduler, k = h.timeAxis.getStart(), o = h.timeAxis.getEnd(), g = [], m = e.getEvents(c), p, d;
    for (var f = 0, l = m.length; f < l; f++) {
        var j = m[f];
        p = j.getStartDate();
        d = j.getEndDate();
        if (p && d && Sch.util.Date.intersectSpans(p, d, k, o)) {
            var n = h.getSchedulingView()[h.getOrientation()].getEventRenderData(j);
            var b, a;
            if (h.getMode() === "horizontal") {
                b = h.rtl ? n.right : n.left;
                a = n.width
            } else {
                b = n.top;
                a = n.height
            }
            g[g.length] = Ext.apply({id: j.internalId, start: b, width: a, Cls: j.getCls()}, j.data)
        }
    }
    return this.template.apply(g)
}, refreshSingle: function (i, g) {
    var c = Ext.get(this.uniqueCls + "-" + g.internalId);
    if (c) {
        var e = this.scheduler, f = e.timeAxis.getStart(), j = e.timeAxis.getEnd();
        var b = Sch.util.Date.max(f, g.getStartDate()), d = Sch.util.Date.min(j, g.getEndDate()), k = g.getCls();
        var h = e.getSchedulingView().getCoordinateFromDate(b);
        var a = e.getSchedulingView().getCoordinateFromDate(d) - h;
        c.dom.className = this.cls + " " + this.uniqueCls + " " + (k || "");
        c.setStyle({left: h + "px", top: h + "px", height: a + "px", width: a + "px"})
    }
}});
Ext.define("Sch.plugin.HeaderZoom", {extend: "Sch.util.DragTracker", mixins: ["Ext.AbstractPlugin"], alias: "plugin.scheduler_headerzoom", lockableScope: "top", scheduler: null, proxy: null, headerRegion: null, init: function (a) {
    a.on({destroy: this.onSchedulerDestroy, scope: this});
    this.scheduler = a;
    this.onModeChange();
    a.on("modechange", this.onModeChange, this)
}, onOrientationChange: function () {
    return this.onModeChange.apply(this, arguments)
}, onModeChange: function () {
    var a = this.scheduler.down("timeaxiscolumn");
    if (a) {
        if (a.rendered) {
            this.onTimeAxisColumnRender(a)
        } else {
            a.on({afterrender: this.onTimeAxisColumnRender, scope: this})
        }
    }
}, onTimeAxisColumnRender: function (a) {
    this.proxy = a.el.createChild({cls: "sch-drag-selector"});
    this.initEl(a.el)
}, onStart: function (a) {
    this.proxy.show();
    this.headerRegion = this.scheduler.normalGrid.headerCt.getRegion()
}, onDrag: function (b) {
    var c = this.headerRegion;
    var a = this.getRegion().constrainTo(c);
    a.top = c.top;
    a.bottom = c.bottom;
    this.proxy.setRegion(a)
}, onEnd: function (g) {
    if (this.proxy) {
        this.proxy.setDisplayed(false);
        var b = this.scheduler;
        var d = b.timeAxis;
        var f = this.getRegion();
        var c = b.getSchedulingView().timeAxisViewModel.getBottomHeader().unit;
        var a = b.getSchedulingView().getStartEndDatesFromRegion(f);
        b.zoomToSpan({start: d.floorDate(a.start, false, c, 1), end: d.ceilDate(a.end, false, c, 1)})
    }
}, onSchedulerDestroy: function () {
    if (this.proxy) {
        Ext.destroy(this.proxy);
        this.proxy = null
    }
    this.destroy()
}});
Ext.define("Sch.widget.ResizePicker", {extend: "Ext.Panel", alias: "widget.dualrangepicker", width: 200, height: 200, border: true, collapsible: false, bodyStyle: "position:absolute; margin:5px", verticalCfg: {height: 120, value: 24, increment: 2, minValue: 20, maxValue: 80, reverse: true, disabled: true}, horizontalCfg: {width: 120, value: 100, minValue: 25, increment: 5, maxValue: 200, disable: true}, initComponent: function () {
    var a = this;
    a.horizontalCfg.value = a.dialogConfig.columnWidth;
    a.verticalCfg.value = a.dialogConfig.rowHeight;
    a.verticalCfg.disabled = a.dialogConfig.scrollerDisabled || false;
    a.dockedItems = [a.vertical = new Ext.slider.Single(Ext.apply({dock: "left", style: "margin-top:10px", vertical: true, listeners: {change: a.onSliderChange, changecomplete: a.onSliderChangeComplete, scope: a}}, a.verticalCfg)), a.horizontal = new Ext.slider.Single(Ext.apply({dock: "top", style: "margin-left:28px", listeners: {change: a.onSliderChange, changecomplete: a.onSliderChangeComplete, scope: a}}, a.horizontalCfg))];
    a.callParent(arguments)
}, afterRender: function () {
    var b = this;
    b.addCls("sch-ux-range-picker");
    b.valueHandle = this.body.createChild({cls: "sch-ux-range-value", cn: {tag: "span"}});
    b.valueSpan = this.valueHandle.down("span");
    var a = new Ext.dd.DD(this.valueHandle);
    Ext.apply(a, {startDrag: function () {
        b.dragging = true;
        this.constrainTo(b.body)
    }, onDrag: function () {
        b.onHandleDrag.apply(b, arguments)
    }, endDrag: function () {
        b.onHandleEndDrag.apply(b, arguments);
        b.dragging = false
    }, scope: this});
    this.setValues(this.getValues());
    this.callParent(arguments);
    this.body.on("click", this.onBodyClick, this)
}, onBodyClick: function (c, a) {
    var b = [c.getXY()[0] - 8 - this.body.getX(), c.getXY()[1] - 8 - this.body.getY()];
    this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
    this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
    this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]));
    this.onSliderChangeComplete()
}, getAvailableWidth: function () {
    return this.body.getWidth() - 18
}, getAvailableHeight: function () {
    return this.body.getHeight() - 18
}, onHandleDrag: function () {
    this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
}, onHandleEndDrag: function () {
    this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
}, getValuesFromXY: function (d) {
    var c = d[0] / this.getAvailableWidth();
    var a = d[1] / this.getAvailableHeight();
    var e = Math.round((this.horizontalCfg.maxValue - this.horizontalCfg.minValue) * c);
    var b = Math.round((this.verticalCfg.maxValue - this.verticalCfg.minValue) * a) + this.verticalCfg.minValue;
    return[e + this.horizontalCfg.minValue, b]
}, getXYFromValues: function (d) {
    var b = this.horizontalCfg.maxValue - this.horizontalCfg.minValue;
    var f = this.verticalCfg.maxValue - this.verticalCfg.minValue;
    var a = Math.round((d[0] - this.horizontalCfg.minValue) * this.getAvailableWidth() / b);
    var c = d[1] - this.verticalCfg.minValue;
    var e = Math.round(c * this.getAvailableHeight() / f);
    return[a, e]
}, updatePosition: function () {
    var a = this.getValues();
    var b = this.getXYFromValues(a);
    this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
    if (this.verticalCfg.disabled) {
        this.valueHandle.setTop(this.dialogConfig.rowHeight)
    } else {
        this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()))
    }
    this.positionValueText();
    this.setValueText(a)
}, positionValueText: function () {
    var a = this.valueHandle.getTop(true);
    var b = this.valueHandle.getLeft(true);
    this.valueSpan.setLeft(b > 30 ? -30 : 10);
    this.valueSpan.setTop(a > 10 ? -20 : 20)
}, setValueText: function (a) {
    if (this.verticalCfg.disabled) {
        a[1] = this.dialogConfig.rowHeight
    }
    this.valueSpan.update("[" + a.toString() + "]")
}, setValues: function (a) {
    this.horizontal.setValue(a[0]);
    if (this.verticalCfg.reverse) {
        if (!this.verticalCfg.disabled) {
            this.vertical.setValue(this.verticalCfg.maxValue + this.verticalCfg.minValue - a[1])
        }
    } else {
        if (!this.verticalCfg.disabled) {
            this.vertical.setValue(a[1])
        }
    }
    if (!this.dragging) {
        this.updatePosition()
    }
    this.positionValueText();
    this.setValueText(a)
}, getValues: function () {
    if (!this.verticalCfg.disabled) {
        var a = this.vertical.getValue();
        if (this.verticalCfg.reverse) {
            a = this.verticalCfg.maxValue - a + this.verticalCfg.minValue
        }
        return[this.horizontal.getValue(), a]
    }
    return[this.horizontal.getValue()]
}, onSliderChange: function () {
    this.fireEvent("change", this, this.getValues());
    if (!this.dragging) {
        this.updatePosition()
    }
}, onSliderChangeComplete: function () {
    this.fireEvent("changecomplete", this, this.getValues())
}, afterLayout: function () {
    this.callParent(arguments);
    this.updatePosition()
}});
Ext.define("Sch.widget.ExportDialogForm", {extend: "Ext.form.Panel", requires: ["Ext.data.Store", "Ext.ProgressBar", "Ext.form.field.ComboBox", "Ext.form.field.Date", "Ext.form.FieldContainer", "Ext.form.field.Checkbox", "Sch.widget.ResizePicker"], border: false, bodyPadding: "10 10 0 10", autoHeight: true, initComponent: function () {
    var a = this;
    if (Ext.getVersion("extjs").isLessThan("4.2.1")) {
        if (typeof Ext.tip !== "undefined" && Ext.tip.Tip && Ext.tip.Tip.prototype.minWidth != "auto") {
            Ext.tip.Tip.prototype.minWidth = "auto"
        }
    }
    a.createFields();
    Ext.apply(this, {fieldDefaults: {labelAlign: "left", labelWidth: 120, anchor: "99%"}, items: [a.rangeField, a.resizerHolder, a.datesHolder, a.showHeaderField, a.exportToSingleField, a.formatField, a.orientationField, a.progressBar || a.createProgressBar()]});
    a.callParent(arguments);
    a.onRangeChange(null, a.dialogConfig.defaultConfig.range);
    a.on({hideprogressbar: a.hideProgressBar, showprogressbar: a.showProgressBar, updateprogressbar: a.updateProgressBar, scope: a})
}, isValid: function () {
    var a = this;
    if (a.rangeField.getValue() === "date") {
        return a.dateFromField.isValid() && a.dateToField.isValid()
    }
    return true
}, getValues: function (e, c, d, b) {
    var a = this.callParent(arguments);
    var f = this.resizePicker.getValues();
    if (!e) {
        a.cellSize = f
    } else {
        a += "&cellSize[0]=" + f[0] + "&cellSize[1]=" + f[1]
    }
    return a
}, createFields: function () {
    var d = this, a = d.dialogConfig, f = '<table class="sch-fieldcontainer-label-wrap"><td width="1" class="sch-fieldcontainer-label">', e = '<td><div class="sch-fieldcontainer-separator"></div></table>';
    d.rangeField = new Ext.form.field.ComboBox({value: a.defaultConfig.range, triggerAction: "all", cls: "sch-export-dialog-range", forceSelection: true, editable: false, fieldLabel: a.rangeFieldLabel, name: "range", queryMode: "local", displayField: "name", valueField: "value", store: new Ext.data.Store({fields: ["name", "value"], data: [
        {name: a.completeViewText, value: "complete"},
        {name: a.dateRangeText, value: "date"},
        {name: a.currentViewText, value: "current"}
    ]}), listeners: {change: d.onRangeChange, scope: d}});
    d.resizePicker = new Sch.widget.ResizePicker({dialogConfig: a, margin: "10 20"});
    d.resizerHolder = new Ext.form.FieldContainer({fieldLabel: a.scrollerDisabled ? a.adjustCols : a.adjustColsAndRows, labelAlign: "top", hidden: true, labelSeparator: "", beforeLabelTextTpl: f, afterLabelTextTpl: e, layout: "vbox", defaults: {flex: 1, allowBlank: false}, items: [d.resizePicker]});
    d.dateFromField = new Ext.form.field.Date({fieldLabel: a.dateRangeFromText, baseBodyCls: "sch-exportdialogform-date", name: "dateFrom", format: a.dateRangeFormat || Ext.Date.defaultFormat, allowBlank: false, maxValue: a.endDate, minValue: a.startDate, value: a.startDate});
    d.dateToField = new Ext.form.field.Date({fieldLabel: a.dateRangeToText, name: "dateTo", format: a.dateRangeFormat || Ext.Date.defaultFormat, baseBodyCls: "sch-exportdialogform-date", allowBlank: false, maxValue: a.endDate, minValue: a.startDate, value: a.endDate});
    d.datesHolder = new Ext.form.FieldContainer({fieldLabel: a.specifyDateRange, labelAlign: "top", hidden: true, labelSeparator: "", beforeLabelTextTpl: f, afterLabelTextTpl: e, layout: "vbox", defaults: {flex: 1, allowBlank: false}, items: [d.dateFromField, d.dateToField]});
    d.showHeaderField = new Ext.form.field.Checkbox({xtype: "checkboxfield", boxLabel: d.dialogConfig.showHeaderLabel, name: "showHeader", checked: !!a.defaultConfig.showHeaderLabel});
    d.exportToSingleField = new Ext.form.field.Checkbox({xtype: "checkboxfield", boxLabel: d.dialogConfig.exportToSingleLabel, name: "singlePageExport", checked: !!a.defaultConfig.singlePageExport, listeners: {change: function (h, g) {
        d.formatField.setDisabled(g);
        d.orientationField.setDisabled(g)
    }}});
    d.formatField = new Ext.form.field.ComboBox({value: a.defaultConfig.format, triggerAction: "all", forceSelection: true, editable: false, fieldLabel: a.formatFieldLabel, name: "format", queryMode: "local", store: ["A5", "A4", "A3", "Letter", "Legal"]});
    var c = a.defaultConfig.orientation === "portrait" ? 'class="sch-none"' : "", b = a.defaultConfig.orientation === "landscape" ? 'class="sch-none"' : "";
    d.orientationField = new Ext.form.field.ComboBox({value: a.defaultConfig.orientation, triggerAction: "all", baseBodyCls: "sch-exportdialogform-orientation", forceSelection: true, editable: false, fieldLabel: d.dialogConfig.orientationFieldLabel, afterSubTpl: new Ext.XTemplate('<span id="sch-exportdialog-imagePortrait" ' + b + '></span><span id="sch-exportdialog-imageLandscape" ' + c + "></span>"), name: "orientation", displayField: "name", valueField: "value", queryMode: "local", store: new Ext.data.Store({fields: ["name", "value"], data: [
        {name: a.orientationPortraitText, value: "portrait"},
        {name: a.orientationLandscapeText, value: "landscape"}
    ]}), listeners: {change: function (h, g) {
        switch (g) {
            case"landscape":
                Ext.fly("sch-exportdialog-imagePortrait").toggleCls("sch-none");
                Ext.fly("sch-exportdialog-imageLandscape").toggleCls("sch-none");
                break;
            case"portrait":
                Ext.fly("sch-exportdialog-imagePortrait").toggleCls("sch-none");
                Ext.fly("sch-exportdialog-imageLandscape").toggleCls("sch-none");
                break
        }
    }}})
}, createProgressBar: function () {
    return this.progressBar = new Ext.ProgressBar({text: this.config.progressBarText, animate: true, hidden: true, margin: "4px 0 10px 0"})
}, onRangeChange: function (b, a) {
    switch (a) {
        case"complete":
            this.datesHolder.hide();
            this.resizerHolder.hide();
            break;
        case"date":
            this.datesHolder.show();
            this.resizerHolder.hide();
            break;
        case"current":
            this.datesHolder.hide();
            this.resizerHolder.show();
            this.resizePicker.expand(true);
            break
    }
}, showProgressBar: function () {
    if (this.progressBar) {
        this.progressBar.show()
    }
}, hideProgressBar: function () {
    if (this.progressBar) {
        this.progressBar.hide()
    }
}, updateProgressBar: function (a) {
    if (this.progressBar) {
        this.progressBar.updateProgress(a)
    }
}});
Ext.define("Sch.widget.ExportDialog", {alternateClassName: "Sch.widget.PdfExportDialog", extend: "Ext.window.Window", requires: ["Sch.widget.ExportDialogForm"], mixins: ["Sch.mixin.Localizable"], alias: "widget.exportdialog", modal: false, width: 350, cls: "sch-exportdialog", frame: false, layout: "fit", draggable: true, padding: 0, plugin: null, buttonsPanel: null, buttonsPanelScope: null, progressBar: null, dateRangeFormat: "", constructor: function (a) {
    Ext.apply(this, a.exportDialogConfig);
    Ext.Array.forEach(["generalError", "title", "formatFieldLabel", "orientationFieldLabel", "rangeFieldLabel", "showHeaderLabel", "orientationPortraitText", "orientationLandscapeText", "completeViewText", "currentViewText", "dateRangeText", "dateRangeFromText", "pickerText", "dateRangeToText", "exportButtonText", "cancelButtonText", "progressBarText", "exportToSingleLabel"], function (b) {
        if (b in a) {
            this[b] = a[b]
        }
    }, this);
    this.title = this.L("title");
    this.config = Ext.apply({progressBarText: this.L("progressBarText"), dateRangeToText: this.L("dateRangeToText"), pickerText: this.L("pickerText"), dateRangeFromText: this.L("dateRangeFromText"), dateRangeText: this.L("dateRangeText"), currentViewText: this.L("currentViewText"), formatFieldLabel: this.L("formatFieldLabel"), orientationFieldLabel: this.L("orientationFieldLabel"), rangeFieldLabel: this.L("rangeFieldLabel"), showHeaderLabel: this.L("showHeaderLabel"), exportToSingleLabel: this.L("exportToSingleLabel"), orientationPortraitText: this.L("orientationPortraitText"), orientationLandscapeText: this.L("orientationLandscapeText"), completeViewText: this.L("completeViewText"), adjustCols: this.L("adjustCols"), adjustColsAndRows: this.L("adjustColsAndRows"), specifyDateRange: this.L("specifyDateRange"), dateRangeFormat: this.dateRangeFormat, defaultConfig: this.defaultConfig}, a.exportDialogConfig);
    this.callParent(arguments)
}, initComponent: function () {
    var b = this, a = {hidedialogwindow: b.destroy, showdialogerror: b.showError, updateprogressbar: function (c) {
        b.fireEvent("updateprogressbar", c)
    }, scope: this};
    b.form = b.buildForm(b.config);
    Ext.apply(this, {items: b.form, fbar: b.buildButtons(b.buttonsPanelScope || b)});
    b.callParent(arguments);
    b.plugin.on(a)
}, afterRender: function () {
    var a = this;
    a.relayEvents(a.form.resizePicker, ["change", "changecomplete", "select"]);
    a.form.relayEvents(a, ["updateprogressbar", "hideprogressbar", "showprogressbar"]);
    a.callParent(arguments)
}, buildButtons: function (a) {
    return[
        {xtype: "button", scale: "medium", text: this.L("exportButtonText"), handler: function () {
            if (this.form.isValid()) {
                this.fireEvent("showprogressbar");
                var b = this.form.getValues();
                if (b.dateFrom && !Ext.isDate(b.dateFrom)) {
                    b.dateFrom = Ext.Date.parse(b.dateFrom, this.dateRangeFormat)
                }
                if (b.dateTo && !Ext.isDate(b.dateTo)) {
                    b.dateTo = Ext.Date.parse(b.dateTo, this.dateRangeFormat)
                }
                this.plugin.doExport(b)
            }
        }, scope: a},
        {xtype: "button", scale: "medium", text: this.L("cancelButtonText"), handler: function () {
            this.destroy()
        }, scope: a}
    ]
}, buildForm: function (a) {
    return new Sch.widget.ExportDialogForm({progressBar: this.progressBar, dialogConfig: a})
}, showError: function (b, a) {
    var c = b, d = a || c.L("generalError");
    c.fireEvent("hideprogressbar");
    Ext.Msg.alert("", d)
}});
Ext.define("Sch.feature.ColumnLines", {extend: "Sch.plugin.Lines", requires: ["Ext.data.JsonStore"], cls: "sch-column-line", showTip: false, timeAxisViewModel: null, renderingDoneEvent: "columnlinessynced", init: function (a) {
    this.timeAxis = a.getTimeAxis();
    this.timeAxisViewModel = a.timeAxisViewModel;
    this.panel = a;
    this.store = new Ext.data.JsonStore({fields: ["Date"]});
    this.store.loadData = this.store.loadData || this.store.setData;
    this.callParent(arguments);
    a.on({modechange: this.populate, destroy: this.onHostDestroy, scope: this});
    this.timeAxisViewModel.on("update", this.populate, this);
    this.populate()
}, onHostDestroy: function () {
    this.timeAxisViewModel.un("update", this.populate, this)
}, populate: function () {
    this.store.loadData(this.getData())
}, getElementData: function () {
    var a = this.schedulerView;
    if (a.isHorizontal() && a.store.getCount() > 0) {
        return this.callParent(arguments)
    }
    return[]
}, getData: function () {
    var b = this.panel, g = [];
    if (b.isHorizontal()) {
        var h = this.timeAxisViewModel;
        var e = h.columnLinesFor;
        var f = !!(h.headerConfig && h.headerConfig[e].cellGenerator);
        if (f) {
            var c = h.getColumnConfig()[e];
            for (var d = 1, a = c.length; d < a; d++) {
                g.push({Date: c[d].start})
            }
        } else {
            h.forEachInterval(e, function (l, j, k) {
                if (k > 0) {
                    g.push({Date: l})
                }
            })
        }
    }
    return g
}});
Ext.define("Sch.mixin.AbstractTimelineView", {requires: ["Sch.data.TimeAxis", "Sch.view.Horizontal"], selectedEventCls: "sch-event-selected", readOnly: false, horizontalViewClass: "Sch.view.Horizontal", timeCellCls: "sch-timetd", timeCellSelector: ".sch-timetd", eventBorderWidth: 1, timeAxis: null, timeAxisViewModel: null, eventPrefix: null, rowHeight: null, orientation: "horizontal", mode: "horizontal", horizontal: null, vertical: null, secondaryCanvasEl: null, panel: null, displayDateFormat: null, el: null, constructor: function (a) {
    if (a && a.orientation) {
        a.mode = this.mode = a.orientation
    }
    this.callParent([a])
}, _initializeTimelineView: function () {
    if (this.horizontalViewClass) {
        this.horizontal = Ext.create(this.horizontalViewClass, {view: this})
    }
    if (this.verticalViewClass) {
        this.vertical = Ext.create(this.verticalViewClass, {view: this})
    }
    if (this.calendarViewClass) {
        this.calendar = Ext.create(this.calendarViewClass, {view: this})
    }
    this.eventPrefix = (this.eventPrefix || this.getId()) + "-"
}, getTimeAxisViewModel: function () {
    return this.timeAxisViewModel
}, getFormattedDate: function (a) {
    return Ext.Date.format(a, this.getDisplayDateFormat())
}, getFormattedEndDate: function (c, a) {
    var b = this.getDisplayDateFormat();
    if (c.getHours() === 0 && c.getMinutes() === 0 && !(c.getYear() === a.getYear() && c.getMonth() === a.getMonth() && c.getDate() === a.getDate()) && !Sch.util.Date.hourInfoRe.test(b.replace(Sch.util.Date.stripEscapeRe, ""))) {
        c = Sch.util.Date.add(c, Sch.util.Date.DAY, -1)
    }
    return Ext.Date.format(c, b)
}, getDisplayDateFormat: function () {
    return this.displayDateFormat
}, setDisplayDateFormat: function (a) {
    this.displayDateFormat = a
}, fitColumns: function (b) {
    if (this.mode === "horizontal") {
        this.getTimeAxisViewModel().fitToAvailableWidth(b)
    } else {
        var a = Math.floor((this.panel.getWidth() - Ext.getScrollbarSize().width - 1) / this.headerCt.getColumnCount());
        this.setColumnWidth(a, b)
    }
}, getElementFromEventRecord: function (a) {
    return Ext.get(this.eventPrefix + a.internalId)
}, getEventNodeByRecord: function (a) {
    return document.getElementById(this.eventPrefix + a.internalId)
}, getEventNodesByRecord: function (a) {
    if (this.getMode() === "calendar") {
        return this.getEl().select("[id^=" + this.eventPrefix + a.internalId + "-]")
    } else {
        return this.getEl().select("[id=" + this.eventPrefix + a.internalId + "]")
    }
}, getStartEndDatesFromRegion: function (c, b, a) {
    return this[this.mode].getStartEndDatesFromRegion(c, b, a)
}, getTimeResolution: function () {
    return this.timeAxis.getResolution()
}, setTimeResolution: function (b, a) {
    this.timeAxis.setResolution(b, a);
    if (this.getTimeAxisViewModel().snapToIncrement) {
        this.refreshKeepingScroll()
    }
}, getEventIdFromDomNodeId: function (a) {
    return a.substring(this.eventPrefix.length)
}, getDateFromDomEvent: function (b, a) {
    return this.getDateFromXY(b.getXY(), a)
}, getSnapPixelAmount: function () {
    return this.getTimeAxisViewModel().getSnapPixelAmount()
}, getTimeColumnWidth: function () {
    return this.getTimeAxisViewModel().getTickWidth()
}, setSnapEnabled: function (a) {
    this.getTimeAxisViewModel().setSnapToIncrement(a)
}, setReadOnly: function (a) {
    this.readOnly = a;
    this[a ? "addCls" : "removeCls"](this._cmpCls + "-readonly")
}, isReadOnly: function () {
    return this.readOnly
}, setOrientation: function () {
    this.setMode.apply(this, arguments)
}, setMode: function (a) {
    this.mode = a;
    this.timeAxisViewModel.mode = a
}, getOrientation: function () {
    return this.getMode.apply(this, arguments)
}, getMode: function () {
    return this.mode
}, isHorizontal: function () {
    return this.getMode() === "horizontal"
}, isVertical: function () {
    return!this.isHorizontal()
}, getDateFromXY: function (c, b, a) {
    return this[this.mode].getDateFromXY(c, b, a)
}, getDateFromCoordinate: function (c, b, a) {
    if (!a) {
        c = this[this.mode].translateToScheduleCoordinate(c)
    }
    return this.timeAxisViewModel.getDateFromPosition(c, b)
}, getDateFromX: function (a, b) {
    return this.getDateFromCoordinate(a, b)
}, getDateFromY: function (b, a) {
    return this.getDateFromCoordinate(b, a)
}, getCoordinateFromDate: function (a, b) {
    var c = this.timeAxisViewModel.getPositionFromDate(a);
    if (b === false) {
        c = this[this.mode].translateToPageCoordinate(c)
    }
    return Math.round(c)
}, getXFromDate: function (a, b) {
    return this.getCoordinateFromDate(a, b)
}, getYFromDate: function (a, b) {
    return this.getCoordinateFromDate(a, b)
}, getTimeSpanDistance: function (a, b) {
    return this.timeAxisViewModel.getDistanceBetweenDates(a, b)
}, getTimeSpanRegion: function (a, b) {
    return this[this.mode].getTimeSpanRegion(a, b)
}, getScheduleRegion: function (b, a) {
    return this[this.mode].getScheduleRegion(b, a)
}, getTableRegion: function () {
    throw"Abstract method call"
}, getRowNode: function (a) {
    throw"Abstract method call"
}, getRecordForRowNode: function (a) {
    throw"Abstract method call"
}, getVisibleDateRange: function () {
    return this[this.mode].getVisibleDateRange()
}, setColumnWidth: function (b, a) {
    this[this.mode].setColumnWidth(b, a)
}, findRowByChild: function (a) {
    throw"Abstract method call"
}, setBarMargin: function (b, a) {
    this.barMargin = b;
    if (!a) {
        this.refreshKeepingScroll()
    }
}, getRowHeight: function () {
    return this.timeAxisViewModel.getViewRowHeight()
}, setRowHeight: function (a, b) {
    this.timeAxisViewModel.setViewRowHeight(a, b)
}, refreshKeepingScroll: function () {
    throw"Abstract method call"
}, scrollVerticallyTo: function (b, a) {
    throw"Abstract method call"
}, scrollHorizontallyTo: function (a, b) {
    throw"Abstract method call"
}, getVerticalScroll: function () {
    throw"Abstract method call"
}, getHorizontalScroll: function () {
    throw"Abstract method call"
}, getEl: Ext.emptyFn, getSecondaryCanvasEl: function () {
    if (!this.rendered) {
        throw"Calling this method too early"
    }
    if (!this.secondaryCanvasEl) {
        this.secondaryCanvasEl = this.getEl().createChild({cls: "sch-secondary-canvas"})
    }
    return this.secondaryCanvasEl
}, getScroll: function () {
    throw"Abstract method call"
}, getOuterEl: function () {
    return this.getEl()
}, getRowContainerEl: function () {
    return this.getEl()
}, getScheduleCell: function (b, a) {
    return this.getCellByPosition({row: b, column: a})
}, getScrollEventSource: function () {
    return this.getEl()
}, getViewportHeight: function () {
    return this.getEl().getHeight()
}, getViewportWidth: function () {
    return this.getEl().getWidth()
}, getViewportCenterDate: function () {
    var a = this.getScroll(), b;
    if (this.getMode() === "vertical") {
        b = [0, a.top + this.getViewportHeight() / 2]
    } else {
        b = [a.left + this.getViewportWidth() / 2, 0]
    }
    return this.getDateFromXY(b, null, true)
}, getDateConstraints: Ext.emptyFn});
Ext.apply(Sch, {});
Ext.define("Sch.mixin.TimelineView", {extend: "Sch.mixin.AbstractTimelineView", requires: ["Ext.tip.ToolTip"], overScheduledEventClass: "sch-event-hover", ScheduleEventMap: {click: "Click", mousedown: "MouseDown", mouseup: "MouseUp", dblclick: "DblClick", contextmenu: "ContextMenu", keydown: "KeyDown", keyup: "KeyUp"}, preventOverCls: false, _initializeTimelineView: function () {
    this.callParent(arguments);
    this.on("destroy", this._onDestroy, this);
    this.on("afterrender", this._onAfterRender, this);
    this.setMode(this.mode);
    this.enableBubble("columnwidthchange");
    this.addCls("sch-timelineview");
    if (this.readOnly) {
        this.addCls(this._cmpCls + "-readonly")
    }
    this.addCls(this._cmpCls);
    if (this.eventAnimations) {
        this.addCls("sch-animations-enabled")
    }
}, inheritables: function () {
    return{processUIEvent: function (d) {
        var a = d.getTarget(this.eventSelector), c = this.ScheduleEventMap, b = d.type, f = false;
        if (a && b in c) {
            this.fireEvent(this.scheduledEventName + b, this, this.resolveEventRecord(a), d);
            f = !(this.getSelectionModel()instanceof Ext.selection.RowModel)
        }
        if (!f) {
            return this.callParent(arguments)
        }
    }}
}, _onDestroy: function () {
    if (this.tip) {
        this.tip.destroy()
    }
}, _onAfterRender: function () {
    if (this.overScheduledEventClass) {
        this.setMouseOverEnabled(true)
    }
    if (this.tooltipTpl) {
        this.el.on("mousemove", this.setupTooltip, this, {single: true})
    }
    var c = this.bufferedRenderer;
    if (c) {
        this.patchBufferedRenderingPlugin(c);
        this.patchBufferedRenderingPlugin(this.lockingPartner.bufferedRenderer)
    }
    this.on("bufferedrefresh", this.onBufferedRefresh, this, {buffer: 10});
    this.setupTimeCellEvents();
    var b = this.getSecondaryCanvasEl();
    if (b.getStyle("position").toLowerCase() !== "absolute") {
        var a = Ext.Msg || window;
        a.alert("ERROR: The CSS file for the Bryntum component has not been loaded.")
    }
}, patchBufferedRenderingPlugin: function (c) {
    var b = this;
    var a = c.setBodyTop;
    c.setBodyTop = function (d, e) {
        if (d < 0) {
            d = 0
        }
        var f = a.apply(this, arguments);
        b.fireEvent("bufferedrefresh", this);
        return f
    }
}, onBufferedRefresh: function () {
    this.getSecondaryCanvasEl().dom.style.top = this.body.dom.style.top
}, setMouseOverEnabled: function (a) {
    this[a ? "mon" : "mun"](this.el, {mouseover: this.onEventMouseOver, mouseout: this.onEventMouseOut, delegate: this.eventSelector, scope: this})
}, onEventMouseOver: function (c, a) {
    if (a !== this.lastItem && !this.preventOverCls) {
        this.lastItem = a;
        Ext.fly(a).addCls(this.overScheduledEventClass);
        var b = this.resolveEventRecord(a);
        if (b) {
            this.fireEvent("eventmouseenter", this, b, c)
        }
    }
}, onEventMouseOut: function (b, a) {
    if (this.lastItem) {
        if (!b.within(this.lastItem, true, true)) {
            Ext.fly(this.lastItem).removeCls(this.overScheduledEventClass);
            this.fireEvent("eventmouseleave", this, this.resolveEventRecord(this.lastItem), b);
            delete this.lastItem
        }
    }
}, highlightItem: function (b) {
    if (b) {
        var a = this;
        a.clearHighlight();
        a.highlightedItem = b;
        Ext.fly(b).addCls(a.overItemCls)
    }
}, setupTooltip: function () {
    var b = this, a = Ext.apply({delegate: b.eventSelector, target: b.el, anchor: "b", rtl: b.rtl, show: function () {
        Ext.ToolTip.prototype.show.apply(this, arguments);
        if (this.triggerElement && b.getMode() === "horizontal") {
            this.setX(this.targetXY[0] - 10);
            this.setY(Ext.fly(this.triggerElement).getY() - this.getHeight() - 10)
        }
    }}, b.tipCfg);
    b.tip = new Ext.ToolTip(a);
    b.tip.on({beforeshow: function (d) {
        if (!d.triggerElement || !d.triggerElement.id) {
            return false
        }
        var c = this.resolveEventRecord(d.triggerElement);
        if (!c || this.fireEvent("beforetooltipshow", this, c) === false) {
            return false
        }
        d.update(this.tooltipTpl.apply(this.getDataForTooltipTpl(c)))
    }, scope: this})
}, getTimeAxisColumn: function () {
    if (!this.timeAxisColumn) {
        this.timeAxisColumn = this.headerCt.down("timeaxiscolumn")
    }
    return this.timeAxisColumn
}, getDataForTooltipTpl: function (a) {
    return Ext.apply({_record: a}, a.data)
}, refreshKeepingScroll: function () {
    Ext.suspendLayouts();
    this.saveScrollState();
    this.refresh();
    if (this.up("tablepanel[lockable=true]").lockedGridDependsOnSchedule) {
        this.lockingPartner.refresh()
    }
    Ext.resumeLayouts(true);
    if (this.scrollState.left !== 0 || this.scrollState.top !== 0 || this.infiniteScroll) {
        this.restoreScrollState()
    }
}, setupTimeCellEvents: function () {
    this.mon(this.el, {click: this.handleScheduleEvent, dblclick: this.handleScheduleEvent, contextmenu: this.handleScheduleEvent, scope: this})
}, getTableRegion: function () {
    var a = this.el.down("." + Ext.baseCSSPrefix + (Ext.versions.extjs.isLessThan("5.0") ? "grid-table" : "grid-item-container"));
    return(a || this.el).getRegion()
}, getRowNode: function (a) {
    return this.getNodeByRecord(a)
}, findRowByChild: function (a) {
    return this.findItemByChild(a)
}, getRecordForRowNode: function (a) {
    return this.getRecord(a)
}, refreshKeepingResourceScroll: function () {
    var a = this.getScroll();
    this.refresh();
    if (this.getMode() === "horizontal") {
        this.scrollVerticallyTo(a.top)
    } else {
        this.scrollHorizontallyTo(a.left)
    }
}, scrollHorizontallyTo: function (a, b) {
    var c = this.getEl();
    if (c) {
        c.scrollTo("left", Math.max(0, a), b)
    }
}, scrollVerticallyTo: function (c, a) {
    var b = this.getEl();
    if (b) {
        b.scrollTo("top", Math.max(0, c), a)
    }
}, getVerticalScroll: function () {
    var a = this.getEl();
    return a.getScroll().top
}, getHorizontalScroll: function () {
    var a = this.getEl();
    return a.getScroll().left
}, getScroll: function () {
    var a = this.getEl().getScroll();
    return{top: a.top, left: a.left}
}, getXYFromDate: function () {
    var a = this.getCoordinateFromDate.apply(this, arguments);
    return this.mode === "horizontal" ? [a, 0] : [0, a]
}, handleScheduleEvent: function (a) {
}, scrollElementIntoView: function (b, k, p, f, e) {
    var a = 20, o = b.dom, h = b.getOffsetsTo(k = Ext.getDom(k) || Ext.getBody().dom), d = h[0] + k.scrollLeft, l = h[1] + k.scrollTop, i = l + o.offsetHeight, q = d + o.offsetWidth, m = k.clientHeight, g = parseInt(k.scrollTop, 10), r = parseInt(k.scrollLeft, 10), n = g + m, j = r + k.clientWidth, c;
    if (e) {
        if (f) {
            f = Ext.apply({listeners: {afteranimate: function () {
                Ext.fly(o).highlight()
            }}}, f)
        } else {
            Ext.fly(o).highlight()
        }
    }
    if (o.offsetHeight > m || l < g) {
        c = l - a
    } else {
        if (i > n) {
            c = i - m + a
        }
    }
    if (c != null) {
        Ext.fly(k).scrollTo("top", c, f)
    }
    if (p !== false) {
        c = null;
        if (o.offsetWidth > k.clientWidth || d < r) {
            c = d - a
        } else {
            if (q > j) {
                c = q - k.clientWidth + a
            }
        }
        if (c != null) {
            Ext.fly(k).scrollTo("left", c, f)
        }
    }
    return b
}});
Ext.define("Sch.view.TimelineGridView", {extend: "Ext.grid.View", mixins: ["Sch.mixin.TimelineView"], nodeContainerSelector: "table." + Ext.baseCSSPrefix + "grid-table tbody", infiniteScroll: false, bufferCoef: 5, bufferThreshold: 0.2, cachedScrollLeftDate: null, boxIsReady: false, ignoreNextHorizontalScroll: false, constructor: function (a) {
    this.callParent(arguments);
    if (this.infiniteScroll) {
        this.on("afterrender", this.setupInfiniteScroll, this, {single: true})
    }
    if (this.timeAxisViewModel) {
        this.relayEvents(this.timeAxisViewModel, ["columnwidthchange"])
    }
}, indexInStore: function (a) {
    if (a instanceof Ext.data.Model) {
        return this.indexOf(a)
    } else {
        return this.indexOf(this.getRecord(a))
    }
}, setupInfiniteScroll: function () {
    var b = this.panel.ownerCt;
    this.cachedScrollLeftDate = b.startDate || this.timeAxis.getStart();
    var a = this;
    b.calculateOptimalDateRange = function (d, c, g, e) {
        if (e) {
            return e
        }
        var f = Sch.preset.Manager.getPreset(g.preset);
        return a.calculateInfiniteScrollingDateRange(d, f.getBottomHeader().unit, g.increment, g.width)
    };
    this.el.on("scroll", this.onHorizontalScroll, this);
    this.on("resize", this.onSelfResize, this)
}, onHorizontalScroll: function () {
    if (this.ignoreNextHorizontalScroll || this.cachedScrollLeftDate) {
        this.ignoreNextHorizontalScroll = false;
        return
    }
    var c = this.el.dom, b = this.getWidth(), a = b * this.bufferThreshold * this.bufferCoef;
    if ((c.scrollWidth - c.scrollLeft - b < a) || c.scrollLeft < a) {
        this.shiftToDate(this.getDateFromCoordinate(c.scrollLeft, null, true));
        this.el.stopAnimation()
    }
}, refresh: function () {
    this.callParent(arguments);
    if (this.infiniteScroll && !this.scrollStateSaved && this.boxIsReady) {
        this.restoreScrollLeftDate()
    }
}, onSelfResize: function (c, d, a, b, e) {
    this.boxIsReady = true;
    if (d !== b) {
        this.shiftToDate(this.cachedScrollLeftDate || this.getVisibleDateRange().startDate, this.cachedScrollCentered)
    }
}, restoreScrollLeftDate: function () {
    if (this.cachedScrollLeftDate && this.boxIsReady) {
        this.ignoreNextHorizontalScroll = true;
        this.scrollToDate(this.cachedScrollLeftDate);
        this.cachedScrollLeftDate = null
    }
}, scrollToDate: function (a) {
    this.cachedScrollLeftDate = a;
    if (this.cachedScrollCentered) {
        this.panel.ownerCt.scrollToDateCentered(a)
    } else {
        this.panel.ownerCt.scrollToDate(a)
    }
    var b = this.el.dom.scrollLeft;
    this.panel.scrollLeftPos = b;
    this.headerCt.el.dom.scrollLeft = b
}, saveScrollState: function () {
    this.scrollStateSaved = this.boxIsReady;
    this.callParent(arguments)
}, restoreScrollState: function () {
    this.scrollStateSaved = false;
    if (this.infiniteScroll && this.cachedScrollLeftDate) {
        this.restoreScrollLeftDate();
        this.el.dom.scrollTop = this.scrollState.top;
        return
    }
    this.callParent(arguments)
}, calculateInfiniteScrollingDateRange: function (e, f, b, a) {
    var g = this.timeAxis;
    var d = this.getWidth();
    a = a || this.timeAxisViewModel.getTickWidth();
    b = b || g.increment || 1;
    f = f || g.unit;
    var h = Sch.util.Date;
    var c = Math.ceil(d * this.bufferCoef / a);
    return{start: g.floorDate(h.add(e, f, -c * b), false, f, b), end: g.ceilDate(h.add(e, f, Math.ceil((d / a + c) * b)), false, f, b)}
}, shiftToDate: function (c, b) {
    var a = this.calculateInfiniteScrollingDateRange(c);
    this.cachedScrollLeftDate = c;
    this.cachedScrollCentered = b;
    this.timeAxis.setTimeSpan(a.start, a.end)
}, destroy: function () {
    if (this.infiniteScroll && this.rendered) {
        this.el.un("scroll", this.onHorizontalScroll, this)
    }
    this.callParent(arguments)
}}, function () {
    this.override(Sch.mixin.TimelineView.prototype.inheritables() || {})
});
Ext.define("Sch.mixin.AbstractSchedulerView", {requires: ["Sch.eventlayout.Horizontal", "Sch.view.Vertical", "Sch.eventlayout.Vertical"], _cmpCls: "sch-schedulerview", scheduledEventName: "event", barMargin: 1, constrainDragToResource: false, allowOverlap: null, readOnly: null, altColCls: "sch-col-alt", dynamicRowHeight: true, managedEventSizing: true, eventAnimations: true, horizontalLayoutCls: "Sch.eventlayout.Horizontal", horizontalEventSorterFn: null, verticalLayoutCls: "Sch.eventlayout.Vertical", verticalEventSorterFn: null, eventCls: "sch-event", verticalViewClass: "Sch.view.Vertical", eventTpl: ['<tpl for=".">', '<div unselectable="on" id="{{evt-prefix}}{id}" style="right:{right}px;left:{left}px;top:{top}px;height:{height}px;width:{width}px;{style}" class="sch-event ' + Ext.baseCSSPrefix + 'unselectable {internalCls} {cls}">', '<div unselectable="on" class="sch-event-inner {iconCls}">', "{body}", "</div>", "</div>", "</tpl>"], eventStore: null, resourceStore: null, eventLayout: null, _initializeSchedulerView: function () {
    var a = Ext.ClassManager.get(this.horizontalLayoutCls);
    var c = Ext.ClassManager.get(this.verticalLayoutCls);
    this.eventSelector = "." + this.eventCls;
    this.eventLayout = {};
    var b = {view: this, timeAxisViewModel: this.timeAxisViewModel};
    if (a) {
        this.eventLayout.horizontal = new a(Ext.apply({}, b, this.horizontalEventSorterFn ? {sortEvents: this.horizontalEventSorterFn} : {}))
    }
    if (c) {
        this.eventLayout.vertical = new c(Ext.apply({}, b, this.verticalEventSorterFn ? {sortEvents: this.verticalEventSorterFn} : {}))
    }
    this.store = this.store || this.resourceStore;
    this.resourceStore = this.resourceStore || this.store
}, generateTplData: function (d, c, g) {
    var f = this[this.mode].getEventRenderData(d, c, g), h = d.getStartDate(), b = d.getEndDate(), a = d.getCls() || "";
    a += " sch-event-resizable-" + d.getResizable();
    if (d.dirty) {
        a += " sch-dirty "
    }
    if (f.endsOutsideView) {
        a += " sch-event-endsoutside "
    }
    if (f.startsOutsideView) {
        a += " sch-event-startsoutside "
    }
    if (this.eventBarIconClsField) {
        a += " sch-event-withicon "
    }
    if (d.isDraggable() === false) {
        a += " sch-event-fixed "
    }
    if (b - h === 0) {
        a += " sch-event-milestone "
    }
    f.id = d.internalId + (this.getMode() === "calendar" ? ("-" + g) : "");
    f.internalCls = a;
    f.start = h;
    f.end = b;
    f.iconCls = d.data[this.eventBarIconClsField] || "";
    f.event = d;
    if (this.eventRenderer) {
        var e = this.eventRenderer.call(this.eventRendererScope || this, d, c, f, g);
        if (Ext.isObject(e) && this.eventBodyTemplate) {
            f.body = this.eventBodyTemplate.apply(e)
        } else {
            f.body = e
        }
    } else {
        if (this.eventBodyTemplate) {
            f.body = this.eventBodyTemplate.apply(d.data)
        } else {
            if (this.eventBarTextField) {
                f.body = d.data[this.eventBarTextField] || ""
            }
        }
    }
    return f
}, resolveResource: function (a) {
    return this[this.mode].resolveResource(a)
}, getResourceRegion: function (b, a, c) {
    return this[this.mode].getResourceRegion(b, a, c)
}, resolveEventRecord: function (a) {
    a = a.dom ? a.dom : a;
    if (!(Ext.fly(a).hasCls(this.eventCls))) {
        a = Ext.fly(a).up(this.eventSelector)
    }
    if (this.getMode() === "calendar") {
        var b = a.id.split("-");
        b.pop();
        return this.getEventRecordFromDomId(b.join("-"))
    } else {
        return this.getEventRecordFromDomId(a.id)
    }
}, getResourceByEventRecord: function (a) {
    return a.getResource()
}, getEventRecordFromDomId: function (b) {
    var a = this.getEventIdFromDomNodeId(b);
    return this.eventStore.getByInternalId(a)
}, isDateRangeAvailable: function (d, a, b, c) {
    return this.eventStore.isDateRangeAvailable(d, a, b, c)
}, getEventsInView: function () {
    var b = this.timeAxis.getStart(), a = this.timeAxis.getEnd();
    return this.eventStore.getEventsInTimeSpan(b, a)
}, getEventNodes: function () {
    return this.getEl().select(this.eventSelector)
}, onEventCreated: function (a) {
}, getEventStore: function () {
    return this.eventStore
}, registerEventEditor: function (a) {
    this.eventEditor = a
}, getEventEditor: function () {
    return this.eventEditor
}, onEventUpdate: function (b, c, a) {
    this[this.mode].onEventUpdate(b, c, a)
}, onEventAdd: function (a, b) {
    if (!Ext.isArray(b)) {
        b = [b]
    }
    this[this.mode].onEventAdd(a, b)
}, onAssignmentAdd: function (b, a) {
    var c = {};
    Ext.Array.each(a, function (e) {
        c[e.getResourceId()] = e.getResource()
    });
    for (var d in c) {
        this.repaintEventsForResource(c[d])
    }
}, onAssignmentUpdate: function (d, f) {
    var a = f.previous && f.previous[f.resourceIdField];
    var e = f.getResourceId();
    if (a) {
        var b = this.resourceStore.getByInternalId(a);
        this.repaintEventsForResource(b)
    }
    if (e) {
        var c = this.resourceStore.getByInternalId(e);
        this.repaintEventsForResource(c)
    }
}, onAssignmentRemove: function (a, c) {
    var d = c.getResourceId();
    var b = d && this.resourceStore.getByInternalId(d);
    if (b) {
        this.repaintEventsForResource(b)
    }
}, onEventRemove: function (a, b) {
    this[this.mode].onEventRemove(a, b)
}, bindEventStore: function (d, b) {
    var f = this;
    var a = {scope: f, refresh: f.onEventDataRefresh, addrecords: f.onEventAdd, updaterecord: f.onEventUpdate, removerecords: f.onEventRemove, add: f.onEventAdd, update: f.onEventUpdate, remove: f.onEventRemove, insert: f.onEventAdd, append: f.onEventAdd};
    var c = {scope: f, refresh: f.onEventDataRefresh, load: f.onEventDataRefresh, update: f.onAssignmentUpdate, add: f.onAssignmentAdd, remove: f.onAssignmentRemove};
    if (!Ext.versions.touch) {
        a.clear = f.onEventDataRefresh
    }
    if (!b && f.eventStore) {
        f.eventStore.setResourceStore(null);
        if (d !== f.eventStore && f.eventStore.autoDestroy) {
            f.eventStore.destroy()
        } else {
            if (f.mun) {
                f.mun(f.eventStore, a);
                var e = f.eventStore.getAssignmentStore && f.eventStore.getAssignmentStore();
                if (e) {
                    f.mun(e, c)
                }
            } else {
                f.eventStore.un(a)
            }
        }
        if (!d) {
            if (f.loadMask && f.loadMask.bindStore) {
                f.loadMask.bindStore(null)
            }
            f.eventStore = null
        }
    }
    if (d) {
        d = Ext.data.StoreManager.lookup(d);
        if (f.mon) {
            f.mon(d, a)
        } else {
            d.on(a)
        }
        if (f.loadMask && f.loadMask.bindStore) {
            f.loadMask.bindStore(d)
        }
        f.eventStore = d;
        d.setResourceStore(f.resourceStore);
        var g = d.getAssignmentStore && d.getAssignmentStore();
        if (g) {
            f.mon(g, c)
        }
    }
    if (d && !b) {
        f.refresh()
    }
}, onEventDataRefresh: function () {
    this.refreshKeepingScroll()
}, onEventSelect: function (a) {
    var b = this.getEventNodesByRecord(a);
    if (b) {
        b.addCls(this.selectedEventCls)
    }
}, onEventDeselect: function (a) {
    var b = this.getEventNodesByRecord(a);
    if (b) {
        b.removeCls(this.selectedEventCls)
    }
}, refresh: function () {
    throw"Abstract method call"
}, repaintEventsForResource: function (a) {
    throw"Abstract method call"
}, repaintAllEvents: function () {
    this.refreshKeepingScroll()
}, scrollEventIntoView: function (j, e, a, n, o) {
    o = o || this;
    var k = this;
    var l = function (p) {
        if (Ext.versions.extjs) {
            k.up("panel").scrollTask.cancel();
            k.scrollElementIntoView(p, k.el, true, a)
        } else {
            p.scrollIntoView(k.el, true, a)
        }
        if (e) {
            if (typeof e === "boolean") {
                p.highlight()
            } else {
                p.highlight(null, e)
            }
        }
        n && n.call(o)
    };
    if (Ext.data.TreeStore && this.resourceStore instanceof Ext.data.TreeStore) {
        var d = j.getResources(k.eventStore);
        if (d.length > 0 && !d[0].isVisible()) {
            d[0].bubble(function (p) {
                p.expand()
            })
        }
    }
    var i = this.timeAxis;
    var c = j.getStartDate();
    var h = j.getEndDate();
    if (!i.dateInAxis(c) || !i.dateInAxis(h)) {
        var g = i.getEnd() - i.getStart();
        i.setTimeSpan(new Date(c.getTime() - g / 2), new Date(h.getTime() + g / 2))
    }
    var b = this.getElementFromEventRecord(j);
    if (b) {
        l(b)
    } else {
        if (this.bufferedRenderer) {
            var m = this.resourceStore;
            var f = j.getResource(null, k.eventStore);
            Ext.Function.defer(function () {
                var p = m.getIndexInTotalDataset ? m.getIndexInTotalDataset(f) : m.indexOf(f);
                this.bufferedRenderer.scrollTo(p, false, function () {
                    var q = k.getElementFromEventRecord(j);
                    if (q) {
                        l(q)
                    }
                })
            }, 10, this)
        }
    }
}});
Ext.define("Sch.mixin.SchedulerView", {extend: "Sch.mixin.AbstractSchedulerView", mixins: ["Sch.mixin.Localizable"], requires: ["Sch.tooltip.Tooltip", "Sch.feature.DragCreator", "Sch.feature.DragDrop", "Sch.feature.ResizeZone", "Sch.column.Resource", "Sch.view.Calendar", "Ext.XTemplate"], eventResizeHandles: "end", dndValidatorFn: Ext.emptyFn, resizeValidatorFn: Ext.emptyFn, createValidatorFn: Ext.emptyFn, calendarViewClass: "Sch.view.Calendar", _initializeSchedulerView: function () {
    this.callParent(arguments);
    this.on({destroy: this._destroy, afterrender: this._afterRender, itemupdate: this.onRowUpdated, scope: this});
    var c = this;
    if (!this.eventPrefix) {
        throw"eventPrefix missing"
    }
    if (Ext.isArray(c.eventTpl)) {
        var d = Ext.Array.clone(c.eventTpl), b = '<div class="sch-resizable-handle sch-resizable-handle-{0}"></div>';
        var a = this.eventResizeHandles;
        if (a === "start" || a === "both") {
            d.splice(2, 0, Ext.String.format(b, "start"))
        }
        if (a === "end" || a === "both") {
            d.splice(2, 0, Ext.String.format(b, "end"))
        }
        c.eventTpl = new Ext.XTemplate(d.join("").replace("{{evt-prefix}}", this.eventPrefix))
    }
}, inheritables: function () {
    return{loadingText: this.L("loadingText"), overItemCls: "", trackOver: false, setReadOnly: function (a) {
        if (this.dragCreator) {
            this.dragCreator.setDisabled(a)
        }
        this.callParent(arguments)
    }, repaintEventsForResource: function (e, d) {
        var b = this.mode === "horizontal" ? this.indexOf(e) : 0;
        if (this.mode === "horizontal") {
            this.eventLayout.horizontal.clearCache(e)
        }
        if (b >= 0) {
            this.refreshNode(b);
            this.lockingPartner.refreshNode(b);
            if (d) {
                var a = this.getSelectionModel();
                var c = e.getEvents();
                Ext.each(c, function (f) {
                    if (a.isSelected(f)) {
                        this.onEventSelect(f, true)
                    }
                }, this)
            }
        }
    }, repaintAllEvents: function () {
        if (this.mode === "horizontal") {
            this.refresh()
        } else {
            this.refreshNode(0)
        }
    }, handleScheduleEvent: function (g) {
        var a = g.getTarget("." + this.eventCls, 3), j = !a && g.getTarget("." + this.timeCellCls, 3);
        if (j) {
            var k = this.getDateFromDomEvent(g, "floor");
            var i = this.findRowByChild(j);
            var f = this.indexOf(i);
            var b;
            if (this.mode == "horizontal") {
                b = this.getRecordForRowNode(i)
            } else {
                var c = g.getTarget(this.timeCellSelector, 5);
                if (c) {
                    var h = typeof c.cellIndex == "number" ? c.cellIndex : c.getAttribute("data-cellIndex");
                    var d = this.headerCt.getGridColumns()[h];
                    b = d && d.model
                }
            }
            this.fireEvent("schedule" + g.type, this, k, f, b, g)
        }
    }, onEventDataRefresh: function () {
        this.clearRowHeightCache();
        this.callParent(arguments)
    }, onUnbindStore: function (a) {
        a.un({refresh: this.clearRowHeightCache, clear: this.clearRowHeightCache, load: this.clearRowHeightCache, scope: this});
        this.callParent(arguments)
    }, bindStore: function (a) {
        a && a.on({refresh: this.clearRowHeightCache, clear: this.clearRowHeightCache, load: this.clearRowHeightCache, scope: this});
        this.callParent(arguments)
    }}
}, _afterRender: function () {
    this.bindEventStore(this.eventStore, true);
    this.setupEventListeners();
    this.configureFunctionality();
    var a = this.headerCt.resizer;
    if (a) {
        a.doResize = Ext.Function.createSequence(a.doResize, this.afterHeaderResized, this)
    }
}, _destroy: function () {
    this.bindEventStore(null)
}, clearRowHeightCache: function () {
    if (this.mode === "horizontal") {
        this.eventLayout.horizontal.clearCache()
    }
}, configureFunctionality: function () {
    var a = this.validatorFnScope || this;
    if (this.eventResizeHandles !== "none" && Sch.feature.ResizeZone) {
        this.resizePlug = new Sch.feature.ResizeZone(Ext.applyIf({schedulerView: this, validatorFn: function (d, c, b, e) {
            return(this.allowOverlap || this.isDateRangeAvailable(b, e, c, d)) && this.resizeValidatorFn.apply(a, arguments) !== false
        }, validatorFnScope: this}, this.resizeConfig || {}))
    }
    if (this.enableEventDragDrop !== false && Sch.feature.DragDrop) {
        this.dragdropPlug = new Sch.feature.DragDrop(this, {validatorFn: function (c, b, d, e) {
            return(this.allowOverlap || this.isDateRangeAvailable(d, Sch.util.Date.add(d, Sch.util.Date.MILLI, e), c[0], b)) && this.dndValidatorFn.apply(a, arguments) !== false
        }, validatorFnScope: this, dragConfig: this.dragConfig || {}})
    }
    if (this.enableDragCreation !== false && Sch.feature.DragCreator) {
        this.dragCreator = new Sch.feature.DragCreator(Ext.applyIf({schedulerView: this, disabled: this.readOnly, validatorFn: function (c, b, d) {
            return(this.allowOverlap || this.isDateRangeAvailable(b, d, null, c)) && this.createValidatorFn.apply(a, arguments) !== false
        }, validatorFnScope: this}, this.createConfig || {}))
    }
}, onBeforeDragDrop: function (a, c, b) {
    return!this.readOnly && !b.getTarget().className.match("sch-resizable-handle")
}, onDragDropStart: function () {
    if (this.dragCreator) {
        this.dragCreator.setDisabled(true)
    }
    if (this.tip) {
        this.tip.hide();
        this.tip.disable()
    }
    if (this.overScheduledEventClass) {
        this.setMouseOverEnabled(false)
    }
}, onDragDropEnd: function () {
    if (this.dragCreator) {
        this.dragCreator.setDisabled(false)
    }
    if (this.tip) {
        this.tip.enable()
    }
    if (this.overScheduledEventClass) {
        this.setMouseOverEnabled(true)
    }
}, onBeforeDragCreate: function (b, c, a, d) {
    return!this.readOnly && !d.ctrlKey
}, onDragCreateStart: function () {
    if (this.overScheduledEventClass) {
        this.setMouseOverEnabled(false)
    }
    if (this.tip) {
        this.tip.hide();
        this.tip.disable()
    }
}, onDragCreateEnd: function (b, a) {
    if (!this.getEventEditor()) {
        if (this.fireEvent("beforeeventadd", this, a) !== false) {
            this.onEventCreated(a);
            this.eventStore.append(a)
        }
        this.dragCreator.getProxy().hide()
    }
    if (this.overScheduledEventClass) {
        this.setMouseOverEnabled(true)
    }
}, onEventCreated: function (a) {
}, onAfterDragCreate: function () {
    if (this.overScheduledEventClass) {
        this.setMouseOverEnabled(true)
    }
    if (this.tip) {
        this.tip.enable()
    }
}, onBeforeResize: function () {
    return!this.readOnly
}, onResizeStart: function () {
    if (this.tip) {
        this.tip.hide();
        this.tip.disable()
    }
    if (this.dragCreator) {
        this.dragCreator.setDisabled(true)
    }
}, onResizeEnd: function () {
    if (this.tip) {
        this.tip.enable()
    }
    if (this.dragCreator) {
        this.dragCreator.setDisabled(false)
    }
}, setupEventListeners: function () {
    this.on({beforeeventdrag: this.onBeforeDragDrop, eventdragstart: this.onDragDropStart, aftereventdrop: this.onDragDropEnd, beforedragcreate: this.onBeforeDragCreate, dragcreatestart: this.onDragCreateStart, dragcreateend: this.onDragCreateEnd, afterdragcreate: this.onAfterDragCreate, beforeeventresize: this.onBeforeResize, eventresizestart: this.onResizeStart, eventresizeend: this.onResizeEnd, scope: this})
}, afterHeaderResized: function () {
    var b = this.headerCt.resizer;
    if (b && this.getMode() !== "horizontal") {
        if (this.panel.forceFit) {
            this.setColumnWidth(b.origWidth)
        } else {
            var a = b.dragHd.getWidth();
            this.setColumnWidth(a)
        }
    }
}, columnRenderer: function (e, c, a, d, b) {
    return this[this.mode].columnRenderer(e, c, a, d, b)
}, onRowUpdated: function (a) {
    if (this.getMode() === "horizontal") {
        if (this.hasListener("eventrepaint")) {
            Ext.each(a.getEvents(), function (c) {
                var b = this.getEventNodeByRecord(c);
                if (b) {
                    this.fireEvent("eventrepaint", this, c, b)
                }
            }, this)
        }
    }
}});
Ext.define("Sch.view.SchedulerGridView", {extend: "Sch.view.TimelineGridView", mixins: ["Sch.mixin.SchedulerView", "Sch.mixin.Localizable"], alias: "widget.schedulergridview"}, function () {
    this.override(Sch.mixin.SchedulerView.prototype.inheritables() || {})
});
Ext.define("Sch.mixin.Zoomable", {zoomLevels: [
    {width: 40, increment: 1, resolution: 1, preset: "manyYears", resolutionUnit: "YEAR"},
    {width: 80, increment: 1, resolution: 1, preset: "manyYears", resolutionUnit: "YEAR"},
    {width: 30, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
    {width: 50, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
    {width: 100, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
    {width: 200, increment: 1, resolution: 1, preset: "year", resolutionUnit: "MONTH"},
    {width: 100, increment: 1, resolution: 7, preset: "monthAndYear", resolutionUnit: "DAY"},
    {width: 30, increment: 1, resolution: 1, preset: "weekDateAndMonth", resolutionUnit: "DAY"},
    {width: 35, increment: 1, resolution: 1, preset: "weekAndMonth", resolutionUnit: "DAY"},
    {width: 50, increment: 1, resolution: 1, preset: "weekAndMonth", resolutionUnit: "DAY"},
    {width: 20, increment: 1, resolution: 1, preset: "weekAndDayLetter"},
    {width: 50, increment: 1, resolution: 1, preset: "weekAndDay", resolutionUnit: "HOUR"},
    {width: 100, increment: 1, resolution: 1, preset: "weekAndDay", resolutionUnit: "HOUR"},
    {width: 50, increment: 6, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
    {width: 100, increment: 6, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
    {width: 60, increment: 2, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
    {width: 60, increment: 1, resolution: 30, preset: "hourAndDay", resolutionUnit: "MINUTE"},
    {width: 30, increment: 15, resolution: 5, preset: "minuteAndHour"},
    {width: 60, increment: 15, resolution: 5, preset: "minuteAndHour"},
    {width: 130, increment: 15, resolution: 5, preset: "minuteAndHour"},
    {width: 60, increment: 5, resolution: 5, preset: "minuteAndHour"},
    {width: 100, increment: 5, resolution: 5, preset: "minuteAndHour"},
    {width: 50, increment: 2, resolution: 1, preset: "minuteAndHour"},
    {width: 30, increment: 10, resolution: 5, preset: "secondAndMinute"},
    {width: 60, increment: 10, resolution: 5, preset: "secondAndMinute"},
    {width: 130, increment: 5, resolution: 5, preset: "secondAndMinute"}
], minZoomLevel: null, maxZoomLevel: null, visibleZoomFactor: 5, zoomKeepsOriginalTimespan: false, cachedCenterDate: null, isFirstZoom: true, isZooming: false, initializeZooming: function () {
    this.zoomLevels = this.zoomLevels.slice();
    this.setMinZoomLevel(this.minZoomLevel || 0);
    this.setMaxZoomLevel(this.maxZoomLevel !== null ? this.maxZoomLevel : this.zoomLevels.length - 1);
    this.on("viewchange", this.clearCenterDateCache, this)
}, getZoomLevelUnit: function (a) {
    return Sch.preset.Manager.getPreset(a.preset).getBottomHeader().unit
}, getMilliSecondsPerPixelForZoomLevel: function (c, a) {
    var b = Sch.util.Date;
    return Math.round((b.add(new Date(1, 0, 1), this.getZoomLevelUnit(c), c.increment) - new Date(1, 0, 1)) / (a ? c.width : c.actualWidth || c.width))
}, presetToZoomLevel: function (b) {
    var a = Sch.preset.Manager.getPreset(b);
    return{preset: b, increment: a.getBottomHeader().increment || 1, resolution: a.timeResolution.increment, resolutionUnit: a.timeResolution.unit, width: a.timeColumnWidth}
}, zoomLevelToPreset: function (c) {
    var b = Sch.preset.Manager.getPreset(c.preset).clone();
    var a = b.getBottomHeader();
    a.increment = c.increment;
    b.timeColumnWidth = c.width;
    if (c.resolutionUnit || c.resolution) {
        b.timeResolution = {unit: c.resolutionUnit || b.timeResolution.unit || a.unit, increment: c.resolution || b.timeResolution.increment || 1}
    }
    return b
}, calculateCurrentZoomLevel: function () {
    var a = this.presetToZoomLevel(this.viewPreset);
    a.width = this.timeAxisViewModel.timeColumnWidth;
    a.increment = this.timeAxisViewModel.getBottomHeader().increment || 1;
    return a
}, getCurrentZoomLevelIndex: function () {
    var f = this.calculateCurrentZoomLevel();
    var b = this.getMilliSecondsPerPixelForZoomLevel(f);
    var e = this.zoomLevels;
    for (var c = 0; c < e.length; c++) {
        var d = this.getMilliSecondsPerPixelForZoomLevel(e[c]);
        if (d == b) {
            return c
        }
        if (c === 0 && b > d) {
            return-0.5
        }
        if (c == e.length - 1 && b < d) {
            return e.length - 1 + 0.5
        }
        var a = this.getMilliSecondsPerPixelForZoomLevel(e[c + 1]);
        if (d > b && b > a) {
            return c + 0.5
        }
    }
    throw"Can't find current zoom level index"
}, setMaxZoomLevel: function (a) {
    if (a < 0 || a >= this.zoomLevels.length) {
        throw new Error("Invalid range for `setMinZoomLevel`")
    }
    this.maxZoomLevel = a
}, setMinZoomLevel: function (a) {
    if (a < 0 || a >= this.zoomLevels.length) {
        throw new Error("Invalid range for `setMinZoomLevel`")
    }
    this.minZoomLevel = a
}, getViewportCenterDateCached: function () {
    if (this.cachedCenterDate) {
        return this.cachedCenterDate
    }
    return this.cachedCenterDate = this.getViewportCenterDate()
}, clearCenterDateCache: function () {
    this.cachedCenterDate = null
}, zoomToLevel: function (b, r, e) {
    b = Ext.Number.constrain(b, this.minZoomLevel, this.maxZoomLevel);
    e = e || {};
    var q = this.calculateCurrentZoomLevel();
    var d = this.getMilliSecondsPerPixelForZoomLevel(q);
    var l = this.zoomLevels[b];
    var a = this.getMilliSecondsPerPixelForZoomLevel(l);
    if (d == a && !r) {
        return null
    }
    var t = this;
    var m = this.getSchedulingView();
    var h = m.getOuterEl();
    var s = m.getScrollEventSource();
    if (this.isFirstZoom) {
        this.isFirstZoom = false;
        s.on("scroll", this.clearCenterDateCache, this)
    }
    var i = this.mode == "vertical";
    var g = r ? new Date((r.start.getTime() + r.end.getTime()) / 2) : this.getViewportCenterDateCached();
    var n = i ? h.getHeight() : h.getWidth();
    var o = Sch.preset.Manager.getPreset(l.preset).clone();
    var p = o.getBottomHeader();
    var f = Boolean(r);
    r = this.calculateOptimalDateRange(g, n, l, r);
    o[i ? "timeRowHeight" : "timeColumnWidth"] = e.customWidth || l.width;
    p.increment = l.increment;
    this.isZooming = true;
    this.viewPreset = l.preset;
    var c = this.timeAxis;
    o.increment = l.increment;
    o.timeResolution.unit = Sch.util.Date.getUnitByName(l.resolutionUnit || p.unit);
    o.timeResolution.increment = l.resolution;
    this.switchViewPreset(o, r.start || this.getStart(), r.end || this.getEnd(), false, true);
    l.actualWidth = this.timeAxisViewModel.getTickWidth();
    if (f) {
        g = e.centerDate || new Date((c.getStart().getTime() + c.getEnd().getTime()) / 2)
    }
    s.on("scroll", function () {
        t.cachedCenterDate = g
    }, this, {single: true});
    if (i) {
        var j = m.getYFromDate(g, true);
        m.scrollVerticallyTo(j - n / 2)
    } else {
        var k = m.getXFromDate(g, true);
        m.scrollHorizontallyTo(k - n / 2)
    }
    t.isZooming = false;
    this.fireEvent("zoomchange", this, b);
    return b
}, setZoomLevel: function () {
    this.zoomToLevel.apply(this, arguments)
}, zoomToSpan: function (r, u) {
    if (r.start && r.end && r.start < r.end) {
        u = u || {};
        if (u.leftMargin || u.rightMargin) {
            u.adjustStart = 0;
            u.adjustEnd = 0
        }
        Ext.applyIf(u, {leftMargin: 0, rightMargin: 0});
        var g = r.start, d = r.end, e = u.adjustStart >= 0 && u.adjustEnd >= 0;
        if (e) {
            g = Sch.util.Date.add(g, this.timeAxis.mainUnit, -u.adjustStart);
            d = Sch.util.Date.add(d, this.timeAxis.mainUnit, u.adjustEnd)
        }
        var a = this.getSchedulingView().getTimeAxisViewModel().getAvailableWidth();
        var m = Math.floor(this.getCurrentZoomLevelIndex());
        if (m == -1) {
            m = 0
        }
        var v = this.zoomLevels;
        var o, b = d - g, j = this.getMilliSecondsPerPixelForZoomLevel(v[m], true), l = b / j + u.leftMargin + u.rightMargin > a ? -1 : 1, f = m + l;
        var p, q, h = null;
        while (f >= 0 && f <= v.length - 1) {
            p = v[f];
            j = this.getMilliSecondsPerPixelForZoomLevel(p, true);
            var s = b / j + u.leftMargin + u.rightMargin;
            if (l == -1) {
                if (s <= a) {
                    h = f;
                    break
                }
            } else {
                if (s <= a) {
                    if (m !== f - l) {
                        h = f
                    }
                } else {
                    break
                }
            }
            f += l
        }
        h = h !== null ? h : f - l;
        p = v[h];
        var c = Sch.preset.Manager.getPreset(p.preset).getBottomHeader().unit;
        if (u.leftMargin || u.rightMargin) {
            g = new Date(g.getTime() - j * u.leftMargin);
            d = new Date(d.getTime() + j * u.rightMargin)
        }
        var t = Sch.util.Date.getDurationInUnit(g, d, c, true) / p.increment;
        if (t === 0) {
            return
        }
        var i = Math.floor(a / t);
        var k = new Date((g.getTime() + d.getTime()) / 2);
        var n;
        if (e) {
            n = {start: g, end: d}
        } else {
            n = this.calculateOptimalDateRange(k, a, p)
        }
        return this.zoomToLevel(h, n, {customWidth: i, centerDate: k})
    }
    return null
}, zoomIn: function (a) {
    a = a || 1;
    var b = this.getCurrentZoomLevelIndex();
    if (b >= this.zoomLevels.length - 1) {
        return null
    }
    return this.zoomToLevel(Math.floor(b) + a)
}, zoomOut: function (a) {
    a = a || 1;
    var b = this.getCurrentZoomLevelIndex();
    if (b <= 0) {
        return null
    }
    return this.zoomToLevel(Math.ceil(b) - a)
}, zoomInFull: function () {
    return this.zoomToLevel(this.maxZoomLevel)
}, zoomOutFull: function () {
    return this.zoomToLevel(this.minZoomLevel)
}, calculateOptimalDateRange: function (c, i, e, l) {
    if (l) {
        return l
    }
    var h = this.timeAxis;
    if (this.zoomKeepsOriginalTimespan) {
        return{start: h.getStart(), end: h.getEnd()}
    }
    var b = Sch.util.Date;
    var j = Sch.preset.Manager.getPreset(e.preset).headerConfig;
    var f = j.top ? j.top.unit : j.middle.unit;
    var k = this.getZoomLevelUnit(e);
    var d = Math.ceil(i / e.width * e.increment * this.visibleZoomFactor / 2);
    var a = b.add(c, k, -d);
    var g = b.add(c, k, d);
    return{start: h.floorDate(a, false, k, e.increment), end: h.ceilDate(g, false, k, e.increment)}
}});
Ext.define("Sch.mixin.AbstractTimelinePanel", {requires: ["Sch.data.TimeAxis", "Sch.view.model.TimeAxis", "Sch.feature.ColumnLines", "Sch.preset.Manager"], mixins: ["Sch.mixin.Zoomable"], orientation: "horizontal", weekStartDay: 1, snapToIncrement: false, readOnly: false, forceFit: false, eventResizeHandles: "both", timeAxis: null, autoAdjustTimeAxis: true, timeAxisViewModel: null, crudManager: null, viewPreset: "weekAndDay", calendarViewPreset: "week", trackHeaderOver: true, startDate: null, endDate: null, columnLines: true, getDateConstraints: Ext.emptyFn, snapRelativeToEventStartDate: false, trackMouseOver: false, readRowHeightFromPreset: true, eventBorderWidth: 1, getOrientation: function () {
    return this.getMode.apply(this, arguments)
}, getMode: function () {
    return this.mode
}, isHorizontal: function () {
    return this.getMode() === "horizontal"
}, isVertical: function () {
    return!this.isHorizontal()
}, cellBorderWidth: 1, cellTopBorderWidth: 1, cellBottomBorderWidth: 1, renderers: null, _initializeTimelinePanel: function () {
    this.mode = this.mode || this.orientation || "horizontal";
    if (this.mode === "calendar") {
        this.oldViewPreset = this.viewPreset;
        this.viewPreset = this.calendarViewPreset
    }
    var c = this.viewPreset && Sch.preset.Manager.getPreset(this.viewPreset);
    if (!c) {
        throw"You must define a valid view preset object. See Sch.preset.Manager class for reference"
    }
    this.initializeZooming();
    this.renderers = [];
    if (this.readRowHeightFromPreset) {
        this.readRowHeightFromPreset = !this.rowHeight
    }
    if (!this.timeAxis) {
        this.timeAxis = new Sch.data.TimeAxis({autoAdjust: this.autoAdjustTimeAxis, mode: this.mode === "calendar" ? "calendar" : "plain"})
    }
    if (!this.timeAxisViewModel || !(this.timeAxisViewModel instanceof Sch.view.model.TimeAxis)) {
        var a = Ext.apply({mode: this.mode, snapToIncrement: this.snapToIncrement, forceFit: this.forceFit, timeAxis: this.timeAxis, eventStore: this.getEventStore(), viewPreset: this.viewPreset}, this.timeAxisViewModel || {});
        this.timeAxisViewModel = new Sch.view.model.TimeAxis(a)
    }
    this.timeAxisViewModel.on("update", this.onTimeAxisViewModelUpdate, this);
    this.timeAxisViewModel.refCount++;
    this.on("destroy", this.onPanelDestroyed, this);
    var b;
    switch (this.mode) {
        case"horizontal":
            b = ["sch-horizontal"];
            break;
        case"vertical":
            b = ["sch-vertical", "sch-vertical-resource"];
            break;
        case"calendar":
            b = ["sch-vertical", "sch-calendar"];
            break
    }
    this.addCls([].concat.apply(["sch-timelinepanel"], b))
}, onTimeAxisViewModelUpdate: function () {
    var a = this.getSchedulingView();
    if (a && a.viewReady) {
        a.refreshKeepingScroll();
        this.fireEvent("viewchange", this)
    }
}, onPanelDestroyed: function () {
    var a = this.timeAxisViewModel;
    a.un("update", this.onTimeAxisViewModelUpdate, this);
    a.refCount--;
    if (a.refCount <= 0) {
        a.destroy()
    }
}, getSchedulingView: function () {
    throw"Abstract method call"
}, setReadOnly: function (a) {
    this.getSchedulingView().setReadOnly(a)
}, isReadOnly: function () {
    return this.getSchedulingView().isReadOnly()
}, switchViewPreset: function () {
    this.setViewPreset.apply(this, arguments)
}, setViewPreset: function (i, a, d, f, b) {
    var e = this.timeAxis;
    if (this.fireEvent("beforeviewchange", this, i, a, d) !== false) {
        var h = this.getMode() === "horizontal";
        if (Ext.isString(i)) {
            this.viewPreset = i;
            i = Sch.preset.Manager.getPreset(i)
        }
        if (!i) {
            throw"View preset not found"
        }
        if (!(f && e.isConfigured)) {
            var c = {weekStartDay: this.weekStartDay};
            if (f) {
                if (e.getCount() === 0 || a) {
                    c.start = a || new Date()
                }
            } else {
                c.start = a || e.getStart()
            }
            c.end = d;
            e.consumeViewPreset(i);
            e.reconfigure(c, true);
            this.timeAxisViewModel.reconfigure({headerConfig: i.headerConfig, columnLinesFor: i.columnLinesFor || "middle", rowHeightHorizontal: this.readRowHeightFromPreset ? i.rowHeight : (this.rowHeight || this.timeAxisViewModel.getViewRowHeight()), tickWidth: h ? i.timeColumnWidth : i.timeRowHeight || i.timeColumnWidth || 60, timeColumnWidth: i.timeColumnWidth, rowHeightVertical: i.timeRowHeight || i.timeColumnWidth || 60, timeAxisColumnWidth: i.timeAxisColumnWidth, resourceColumnWidth: this.resourceColumnWidth || i.resourceColumnWidth || 100})
        }
        var g = this.getSchedulingView();
        g.setDisplayDateFormat(i.displayDateFormat);
        if (this.getMode() === "vertical") {
            g.setColumnWidth(this.resourceColumnWidth || i.resourceColumnWidth || 100, true)
        }
        if (!b) {
            if (h) {
                g.scrollHorizontallyTo(0)
            } else {
                g.scrollVerticallyTo(0)
            }
        }
    }
}, getViewPreset: function () {
    return this.viewPreset
}, getStart: function () {
    return this.getStartDate()
}, getStartDate: function () {
    return this.timeAxis.getStart()
}, getEnd: function () {
    return this.getEndDate()
}, getEndDate: function () {
    return this.timeAxis.getEnd()
}, setTimeColumnWidth: function (b, a) {
    this.timeAxisViewModel.setTickWidth(b, a)
}, getTimeColumnWidth: function () {
    return this.timeAxisViewModel.getTickWidth()
}, getRowHeight: function () {
    return this.timeAxisViewModel.getViewRowHeight()
}, shiftNext: function (a) {
    this.suspendLayouts && this.suspendLayouts();
    this.timeAxis.shiftNext(a);
    this.suspendLayouts && this.resumeLayouts(true)
}, shiftPrevious: function (a) {
    this.suspendLayouts && this.suspendLayouts();
    this.timeAxis.shiftPrevious(a);
    this.suspendLayouts && this.resumeLayouts(true)
}, goToNow: function () {
    this.setTimeSpan(new Date())
}, setTimeSpan: function (b, a) {
    if (this.timeAxis) {
        this.timeAxis.setTimeSpan(b, a)
    }
}, setStart: function (a) {
    this.setTimeSpan(a)
}, setEnd: function (a) {
    this.setTimeSpan(null, a)
}, getTimeAxis: function () {
    return this.timeAxis
}, scrollToDate: function (c, b) {
    var a = this.getSchedulingView();
    var d = a.getCoordinateFromDate(c, true);
    this.scrollToCoordinate(d, c, b, false)
}, scrollToDateCentered: function (c, b) {
    var a = this.getSchedulingView();
    var e = 0;
    if (this.mode === "horizontal") {
        e = a.getBox().width / 2
    } else {
        e = a.getBox().height / 2
    }
    var d = Math.round(a.getCoordinateFromDate(c, true) - e);
    this.scrollToCoordinate(d, c, b, true)
}, scrollToCoordinate: function (g, e, d, c) {
    var b = this.getSchedulingView();
    var f = this;
    if (g < 0) {
        if (this.infiniteScroll) {
            b.shiftToDate(e, c)
        } else {
            var a = (this.timeAxis.getEnd() - this.timeAxis.getStart()) / 2;
            this.setTimeSpan(new Date(e.getTime() - a), new Date(e.getTime() + a));
            if (c) {
                f.scrollToDateCentered(e, d)
            } else {
                f.scrollToDate(e, d)
            }
        }
        return
    }
    if (this.mode === "horizontal") {
        b.scrollHorizontallyTo(g, d)
    } else {
        b.scrollVerticallyTo(g, d)
    }
    b.fireEvent("scroll", this, g)
}, getViewportCenterDate: function () {
    return this.getSchedulingView().getViewportCenterDate()
}, addCls: function () {
    throw"Abstract method call"
}, removeCls: function () {
    throw"Abstract method call"
}, registerRenderer: function (b, a) {
    this.renderers.push({fn: b, scope: a})
}, deregisterRenderer: function (b, a) {
    Ext.each(this.renderers, function (c, d) {
        if (b === c) {
            Ext.Array.removeAt(this.renderers, d);
            return false
        }
    })
}});
if (!Ext.ClassManager.get("Sch.mixin.TimelinePanel")) {
    Ext.define("Sch.mixin.TimelinePanel", {extend: "Sch.mixin.AbstractTimelinePanel", requires: ["Sch.util.Patch", "Sch.patches.ElementScroll", "Sch.column.timeAxis.Horizontal", "Sch.preset.Manager"], mixins: ["Sch.mixin.Zoomable", "Sch.mixin.Lockable"], bufferCoef: 5, bufferThreshold: 0.2, infiniteScroll: false, showCrudManagerMask: true, waitingForAutoTimeSpan: false, columnLinesFeature: null, renderWaitListener: null, tipCfg: {cls: "sch-tip", showDelay: 1000, hideDelay: 0, autoHide: true, anchor: "b"}, inheritables: function () {
        return{columnLines: true, enableLocking: true, lockable: true, initComponent: function () {
            if (this.partnerTimelinePanel) {
                this.timeAxisViewModel = this.partnerTimelinePanel.timeAxisViewModel;
                this.timeAxis = this.partnerTimelinePanel.getTimeAxis();
                this.startDate = this.timeAxis.getStart();
                this.endDate = this.timeAxis.getEnd()
            }
            if (this.viewConfig && this.viewConfig.forceFit) {
                this.forceFit = true
            }
            if (Ext.versions.extjs.isGreaterThanOrEqual("4.2.1")) {
                this.cellTopBorderWidth = 0
            }
            this._initializeTimelinePanel();
            this.configureColumns();
            var c = this.normalViewConfig = this.normalViewConfig || {};
            var e = this.getId();
            Ext.apply(this.normalViewConfig, {id: e + "-timelineview", eventPrefix: this.autoGenId ? null : e, timeAxisViewModel: this.timeAxisViewModel, eventBorderWidth: this.eventBorderWidth, timeAxis: this.timeAxis, readOnly: this.readOnly, mode: this.mode, rtl: this.rtl, cellBorderWidth: this.cellBorderWidth, cellTopBorderWidth: this.cellTopBorderWidth, cellBottomBorderWidth: this.cellBottomBorderWidth, infiniteScroll: this.infiniteScroll, bufferCoef: this.bufferCoef, bufferThreshold: this.bufferThreshold});
            Ext.Array.forEach(["eventRendererScope", "eventRenderer", "dndValidatorFn", "resizeValidatorFn", "createValidatorFn", "tooltipTpl", "validatorFnScope", "eventResizeHandles", "enableEventDragDrop", "enableDragCreation", "resizeConfig", "createConfig", "tipCfg", "getDateConstraints"], function (f) {
                if (f in this) {
                    c[f] = this[f]
                }
            }, this);
            this.mon(this.timeAxis, "reconfigure", this.onMyTimeAxisReconfigure, this);
            this.callParent(arguments);
            var d = this;
            if (this.normalGrid.forceFit) {
                this.normalGrid.on("resize", function (g, h) {
                    if (d.getMode() === "calendar") {
                        var f = g.query("gridcolumn");
                        d.timeAxisViewModel.setViewColumnWidth((h - 17) / f.length, true)
                    }
                })
            }
            this.switchViewPreset(this.viewPreset, this.startDate || this.timeAxis.getStart(), this.endDate || this.timeAxis.getEnd(), true);
            if (!this.startDate) {
                var a = this.getTimeSpanDefiningStore();
                if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore ? a.getRootNode().childNodes.length : a.getCount()) {
                    this.applyStartEndDatesFromStore()
                } else {
                    this.bindAutoTimeSpanListeners()
                }
            }
            var b = this.columnLines;
            if (b) {
                this.columnLinesFeature = new Sch.feature.ColumnLines(Ext.isObject(b) ? b : undefined);
                this.columnLinesFeature.init(this);
                this.columnLines = true
            }
            this.relayEvents(this.getSchedulingView(), ["beforetooltipshow"]);
            this.on("afterrender", this.__onAfterRender, this);
            this.on("zoomchange", function () {
                this.normalGrid.scrollTask.cancel()
            });
            if (this.crudManager && !this.crudManager.autoSync && this.showCrudManagerMask) {
                this.mon(this.crudManager, {beforesend: this.beforeCrudOperationStart, synccanceled: this.onCrudOperationComplete, loadcanceled: this.onCrudOperationComplete, load: this.onCrudOperationComplete, sync: this.onCrudOperationComplete, loadfail: this.onCrudOperationComplete, syncfail: this.onCrudOperationComplete, scope: this});
                if (this.crudManager.isLoading()) {
                    this.beforeCrudOperationStart(this.crudManager, null, "load")
                }
            }
        }, getState: function () {
            var a = this, b = a.callParent(arguments);
            Ext.apply(b, {viewPreset: a.viewPreset, startDate: a.getStart(), endDate: a.getEnd(), zoomMinLevel: a.zoomMinLevel, zoomMaxLevel: a.zoomMaxLevel, currentZoomLevel: a.currentZoomLevel});
            return b
        }, applyState: function (b) {
            var a = this;
            a.callParent(arguments);
            if (b && b.viewPreset) {
                a.switchViewPreset(b.viewPreset, b.startDate, b.endDate)
            }
            if (b && b.currentZoomLevel) {
                a.zoomToLevel(b.currentZoomLevel)
            }
        }, setTimeSpan: function () {
            if (this.waitingForAutoTimeSpan) {
                this.unbindAutoTimeSpanListeners()
            }
            this.callParent(arguments);
            if (!this.normalGrid.getView().viewReady) {
                this.getView().refresh()
            }
        }}
    }, bindAutoTimeSpanListeners: function () {
        var a = this.getTimeSpanDefiningStore();
        this.waitingForAutoTimeSpan = true;
        this.normalGrid.getView().on("beforerefresh", this.refreshStopper, this);
        this.lockedGrid.getView().on("beforerefresh", this.refreshStopper, this);
        this.mon(a, "load", this.applyStartEndDatesFromStore, this);
        if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
            this.mon(a, "rootchange", this.applyStartEndDatesFromStore, this);
            this.mon(a.tree, "append", this.applyStartEndDatesAfterTreeAppend, this)
        } else {
            this.mon(a, "add", this.applyStartEndDatesFromStore, this)
        }
    }, refreshStopper: function (a) {
        return a.store.getCount() === 0
    }, getTimeSpanDefiningStore: function () {
        throw"Abstract method called"
    }, unbindAutoTimeSpanListeners: function () {
        this.waitingForAutoTimeSpan = false;
        var a = this.getTimeSpanDefiningStore();
        this.normalGrid.getView().un("beforerefresh", this.refreshStopper, this);
        this.lockedGrid.getView().un("beforerefresh", this.refreshStopper, this);
        a.un("load", this.applyStartEndDatesFromStore, this);
        if (Ext.data.TreeStore && a instanceof Ext.data.TreeStore) {
            a.un("rootchange", this.applyStartEndDatesFromStore, this);
            a.tree.un("append", this.applyStartEndDatesAfterTreeAppend, this)
        } else {
            a.un("add", this.applyStartEndDatesFromStore, this)
        }
    }, applyStartEndDatesAfterTreeAppend: function () {
        var a = this.getTimeSpanDefiningStore();
        if (!a.isSettingRoot && !a.__loading) {
            this.applyStartEndDatesFromStore()
        }
    }, applyStartEndDatesFromStore: function () {
        var a = this.getTimeSpanDefiningStore();
        var b = a.getTotalTimeSpan();
        var c = this.lockedGridDependsOnSchedule;
        if (b.end && b.start && b.end - b.start === 0) {
            b.start = Sch.util.Date.add(b.start, this.timeAxis.mainUnit, -1);
            b.end = Sch.util.Date.add(b.end, this.timeAxis.mainUnit, 1)
        }
        this.lockedGridDependsOnSchedule = true;
        this.setTimeSpan(b.start || new Date(), b.end);
        this.lockedGridDependsOnSchedule = c
    }, onMyTimeAxisReconfigure: function (a) {
        if (this.stateful && this.rendered) {
            this.saveState()
        }
    }, onLockedGridItemDblClick: function (b, a, c, e, d) {
        if (this.mode === "vertical" && a) {
            this.fireEvent("timeheaderdblclick", this, a.get("start"), a.get("end"), e, d)
        }
    }, getSchedulingView: function () {
        return this.normalGrid.getView()
    }, getTimeAxisColumn: function () {
        if (!this.timeAxisColumn) {
            this.timeAxisColumn = this.down("timeaxiscolumn")
        }
        return this.timeAxisColumn
    }, configureColumns: function () {
        var a = this.columns || [];
        if (a.items) {
            a = a.items
        } else {
            a = this.columns = a.slice()
        }
        var c = [];
        var b = [];
        Ext.Array.each(a, function (d) {
            if (d.position === "right") {
                if (!Ext.isNumber(d.width)) {
                    Ext.Error.raise('"Right" columns must have a fixed width')
                }
                d.locked = false;
                b.push(d)
            } else {
                d.locked = true;
                c.push(d)
            }
            d.lockable = false
        });
        Ext.Array.erase(a, 0, a.length);
        Ext.Array.insert(a, 0, c.concat({xtype: "timeaxiscolumn", timeAxisViewModel: this.timeAxisViewModel, trackHeaderOver: this.trackHeaderOver, renderer: this.mainRenderer, scope: this}).concat(b));
        this.horizontalColumns = Ext.Array.clone(a);
        this.verticalColumns = [Ext.apply({xtype: "verticaltimeaxis", width: 100, timeAxis: this.timeAxis, timeAxisViewModel: this.timeAxisViewModel, cellTopBorderWidth: this.cellTopBorderWidth, cellBottomBorderWidth: this.cellBottomBorderWidth}, this.timeAxisColumnCfg || {})];
        this.calendarColumns = [Ext.apply({xtype: "verticaltimeaxis", width: 60, timeAxis: this.timeAxis, timeAxisViewModel: this.timeAxisViewModel, cellTopBorderWidth: this.cellTopBorderWidth, cellBottomBorderWidth: this.cellBottomBorderWidth}, this.calendarTimeAxisCfg || {})];
        if (this.mode === "vertical") {
            this.columns = this.verticalColumns.concat(this.createResourceColumns(this.resourceColumnWidth || this.timeAxisViewModel.resourceColumnWidth));
            this.store = this.timeAxis
        } else {
            if (this.mode === "calendar") {
                this.columns = [];
                this.store = null;
                this.on("afterrender", this.refreshCalendarColumns, this)
            }
        }
    }, mainRenderer: function (b, m, g, j, l) {
        var c = this.renderers, k = this.mode === "horizontal", d = this.mode === "horizontal" || this.mode === "calendar" ? g : this.resourceStore.getAt(l), a = "&nbsp;";
        m.rowHeight = null;
        for (var e = 0; e < c.length; e++) {
            a += c[e].fn.call(c[e].scope || this, b, m, d, j, l) || ""
        }
        if (this.variableRowHeight) {
            var h = this.getSchedulingView();
            var f = this.timeAxisViewModel.getViewRowHeight();
            m.style = "height:" + ((m.rowHeight || f) - h.cellTopBorderWidth - h.cellBottomBorderWidth) + "px"
        }
        return a
    }, __onAfterRender: function () {
        var a = this;
        a.normalGrid.on({collapse: a.onNormalGridCollapse, expand: a.onNormalGridExpand, scope: a});
        a.lockedGrid.on({collapse: a.onLockedGridCollapse, itemdblclick: a.onLockedGridItemDblClick, scope: a});
        if (a.lockedGridDependsOnSchedule) {
            a.normalGrid.getView().on("itemupdate", a.onNormalViewItemUpdate, a)
        }
        if (this.partnerTimelinePanel) {
            if (this.partnerTimelinePanel.rendered) {
                this.setupPartnerTimelinePanel()
            } else {
                this.partnerTimelinePanel.on("afterrender", this.setupPartnerTimelinePanel, this)
            }
        }
    }, onLockedGridCollapse: function () {
        if (this.normalGrid.collapsed) {
            this.normalGrid.expand()
        }
    }, onNormalGridCollapse: function () {
        var a = this;
        if (!a.normalGrid.reExpander) {
            a.normalGrid.reExpander = a.normalGrid.placeholder
        }
        if (!a.lockedGrid.rendered) {
            a.lockedGrid.on("render", a.onNormalGridCollapse, a, {delay: 1})
        } else {
            a.lockedGrid.flex = 1;
            a.lockedGrid.doLayout();
            if (a.lockedGrid.collapsed) {
                a.lockedGrid.expand()
            }
            a.addCls("sch-normalgrid-collapsed")
        }
    }, onNormalGridExpand: function () {
        this.removeCls("sch-normalgrid-collapsed");
        delete this.lockedGrid.flex;
        this.lockedGrid.doLayout()
    }, onNormalViewItemUpdate: function (a, b, d) {
        if (this.lockedGridDependsOnSchedule) {
            var c = this.lockedGrid.getView();
            c.suspendEvents();
            c.refreshNode(c.indexOf(a));
            c.resumeEvents()
        }
    }, setupPartnerTimelinePanel: function () {
        var f = this.partnerTimelinePanel;
        var d = f.down("splitter");
        var c = this.down("splitter");
        if (d) {
            d.on("dragend", function () {
                this.lockedGrid.setWidth(f.lockedGrid.getWidth())
            }, this)
        }
        if (c) {
            c.on("dragend", function () {
                f.lockedGrid.setWidth(this.lockedGrid.getWidth())
            }, this)
        }
        var b = f.isVisible() ? f.lockedGrid.getWidth() : f.lockedGrid.width;
        this.lockedGrid.setWidth(b);
        var a = f.getSchedulingView().getEl(), e = this.getSchedulingView().getEl();
        f.mon(e, "scroll", function (h, g) {
            a.scrollTo("left", g.scrollLeft)
        });
        this.mon(a, "scroll", function (h, g) {
            e.scrollTo("left", g.scrollLeft)
        });
        this.on("viewchange", function () {
            f.viewPreset = this.viewPreset
        }, this);
        f.on("viewchange", function () {
            this.viewPreset = f.viewPreset
        }, this)
    }, beforeCrudOperationStart: function (a, c, b) {
        if (this.rendered) {
            this.setLoading({msg: b === "load" ? this.L("loadingText") : this.L("savingText")})
        } else {
            Ext.destroy(this.renderWaitListener);
            this.renderWaitListener = this.on("render", Ext.Function.bind(this.beforeCrudOperationStart, this, Array.prototype.slice.apply(arguments)), this, {delay: 1, destroyable: true})
        }
    }, onCrudOperationComplete: function () {
        Ext.destroy(this.renderWaitListener);
        this.setLoading(false)
    }}, function () {
        var a = "4.2.1";
        Ext.apply(Sch, {});
        if (Ext.versions.extjs.isLessThan(a)) {
            alert("The Ext JS version you are using needs to be updated to at least " + a)
        }
    })
}
Ext.define("Sch.mixin.AbstractSchedulerPanel", {requires: ["Sch.model.Event", "Sch.model.Resource", "Sch.data.EventStore", "Sch.data.ResourceStore", "Sch.util.Date", "Sch.plugin.ResourceZones"], eventBarIconClsField: "", enableEventDragDrop: true, resourceColumnClass: "Sch.column.Resource", resourceColumnWidth: null, calendarColumnWidth: null, allowOverlap: true, startParamName: "startDate", endParamName: "endDate", passStartEndParameters: false, variableRowHeight: true, eventRenderer: null, eventRendererScope: null, eventStore: null, resourceStore: null, onEventCreated: function (a) {
}, resourceZones: null, resourceZonesConfig: null, initStores: function () {
    var a = this.resourceStore || this.store;
    if (!a) {
        if (this.crudManager) {
            a = this.resourceStore = this.crudManager.getResourceStore()
        }
        if (!a) {
            Ext.Error.raise("You must specify a resourceStore config")
        }
    }
    if (!this.eventStore) {
        if (this.crudManager) {
            this.eventStore = this.crudManager.getEventStore()
        }
        if (!this.eventStore) {
            Ext.Error.raise("You must specify an eventStore config")
        }
    }
    this.store = Ext.StoreManager.lookup(a);
    this.resourceStore = this.store;
    this.eventStore = Ext.StoreManager.lookup(this.eventStore);
    if (!this.eventStore.isEventStore) {
        Ext.Error.raise("Your eventStore should be a subclass of Sch.data.EventStore (or consume the EventStore mixin)")
    }
    this.resourceStore.eventStore = this.eventStore;
    if (this.passStartEndParameters) {
        this.eventStore.on("beforeload", this.applyStartEndParameters, this)
    }
}, _initializeSchedulerPanel: function () {
    this.initStores();
    if (this.eventBodyTemplate && Ext.isString(this.eventBodyTemplate)) {
        this.eventBodyTemplate = new Ext.XTemplate(this.eventBodyTemplate)
    }
}, getResourceStore: function () {
    return this.resourceStore
}, getEventStore: function () {
    return this.eventStore
}, applyStartEndParameters: function (c, a) {
    var b = c.getProxy();
    b.setExtraParam(this.startParamName, this.getStart());
    b.setExtraParam(this.endParamName, this.getEnd())
}, createResourceColumns: function (b) {
    var a = [];
    var c = this;
    this.resourceStore.each(function (d) {
        a.push(Ext.create(c.resourceColumnClass, {renderer: c.mainRenderer, scope: c, width: b || 100, text: d.getName(), model: d}))
    });
    return a
}});
Ext.define("Sch.mixin.SchedulerPanel", {extend: "Sch.mixin.AbstractSchedulerPanel", requires: ["Sch.view.SchedulerGridView", "Sch.selection.EventModel", "Sch.column.timeAxis.Vertical"], eventSelModelType: "eventmodel", eventSelModel: null, enableEventDragDrop: true, enableDragCreation: true, dragConfig: null, componentCls: "sch-schedulerpanel", lockedGridDependsOnSchedule: true, verticalListeners: null, inheritables: function () {
    return{initComponent: function () {
        var b = this.normalViewConfig = this.normalViewConfig || {};
        this._initializeSchedulerPanel();
        this.verticalListeners = {clear: this.refreshResourceColumns, datachanged: this.refreshResourceColumns, update: this.refreshResourceColumns, load: this.refreshResourceColumns, scope: this};
        this.calendarListeners = {datachanged: this.refreshCalendarColumns, priority: 1, scope: this};
        this.calendarViewListeners = {columnresize: this.onCalendarColumnResize, scope: this};
        Ext.apply(b, {eventStore: this.eventStore, resourceStore: this.resourceStore, eventBarTextField: this.eventBarTextField || this.eventStore.model.prototype.nameField});
        Ext.Array.forEach(["barMargin", "eventBodyTemplate", "eventTpl", "allowOverlap", "dragConfig", "eventBarIconClsField", "onEventCreated", "constrainDragToResource", "snapRelativeToEventStartDate"], function (e) {
            if (e in this) {
                b[e] = this[e]
            }
        }, this);
        this.callParent(arguments);
        if (this.mode === "vertical") {
            this.mon(this.resourceStore, this.verticalListeners)
        }
        var d = this.lockedGrid.getView();
        var c = this.getSchedulingView();
        this.registerRenderer(c.columnRenderer, c);
        if (this.resourceZones) {
            var a = Ext.StoreManager.lookup(this.resourceZones);
            a.setResourceStore(this.resourceStore);
            this.resourceZonesPlug = new Sch.plugin.ResourceZones(Ext.apply({store: a}, this.resourceZonesConfig));
            this.resourceZonesPlug.init(this)
        }
        c.on("columnwidthchange", this.onColWidthChange, this);
        this.relayEvents(this.getSchedulingView(), ["eventclick", "eventmousedown", "eventmouseup", "eventdblclick", "eventcontextmenu", "eventmouseenter", "eventmouseleave", "beforeeventresize", "eventresizestart", "eventpartialresize", "beforeeventresizefinalize", "eventresizeend", "beforeeventdrag", "eventdragstart", "eventdrag", "beforeeventdropfinalize", "eventdrop", "aftereventdrop", "beforedragcreate", "dragcreatestart", "beforedragcreatefinalize", "dragcreateend", "afterdragcreate", "beforeeventadd", "scheduleclick", "scheduledblclick", "schedulecontextmenu"]);
        if (!this.syncRowHeight) {
            this.enableRowHeightInjection(d, c)
        }
    }, applyViewSettings: function (c, b) {
        this.callParent(arguments);
        var d = this.getSchedulingView(), a;
        b = b || !this.rendered;
        if (this.orientation === "vertical") {
            a = c.timeColumnWidth || 60;
            d.setColumnWidth(c.resourceColumnWidth || 100, true);
            d.setRowHeight(a, true)
        }
    }, afterRender: function () {
        this.callParent(arguments);
        if (this.mode === "calendar") {
            this.mon(this.timeAxis, this.calendarListeners);
            this.normalGrid.on(this.calendarViewListeners)
        }
        this.getSchedulingView().on({itemmousedown: this.onScheduleRowMouseDown, eventmousedown: this.onScheduleEventBarMouseDown, eventdragstart: this.doSuspendLayouts, aftereventdrop: this.doResumeLayouts, eventresizestart: this.doSuspendLayouts, eventresizeend: this.doResumeLayouts, scope: this})
    }, getTimeSpanDefiningStore: function () {
        return this.eventStore
    }}
}, doSuspendLayouts: function () {
    var a = this.getSchedulingView();
    a.infiniteScroll && a.timeAxis.on({beginreconfigure: this.onBeginReconfigure, endreconfigure: this.onEndReconfigure, scope: this});
    this.lockedGrid.suspendLayouts();
    this.normalGrid.suspendLayouts()
}, doResumeLayouts: function () {
    var a = this.getSchedulingView();
    a.infiniteScroll && a.timeAxis.un({beginreconfigure: this.onBeginReconfigure, endreconfigure: this.onEndReconfigure, scope: this});
    this.lockedGrid.resumeLayouts();
    this.normalGrid.resumeLayouts()
}, onBeginReconfigure: function () {
    this.normalGrid.resumeLayouts()
}, onEndReconfigure: function () {
    this.normalGrid.suspendLayouts()
}, onColWidthChange: function (b, a) {
    switch (this.getMode()) {
        case"vertical":
            this.resourceColumnWidth = a;
            this.refreshResourceColumns();
            break;
        case"calendar":
            this.calendarColumnWidth = a;
            this.refreshCalendarColumns();
            break
    }
}, enableRowHeightInjection: function (a, c) {
    var b = new Ext.XTemplate("{%", "this.processCellValues(values);", "this.nextTpl.applyOut(values, out, parent);", "%}", {priority: 1, processCellValues: function (e) {
        if (c.mode === "horizontal") {
            var f = c.eventLayout.horizontal;
            var g = e.record;
            var d = f.getRowHeight(g) - c.cellTopBorderWidth - c.cellBottomBorderWidth;
            e.style = (e.style || "") + ";height:" + d + "px;"
        }
    }});
    a.addCellTpl(b);
    a.store.un("refresh", a.onDataRefresh, a);
    a.store.on("refresh", a.onDataRefresh, a)
}, getEventSelectionModel: function () {
    if (this.eventSelModel && this.eventSelModel.events) {
        return this.eventSelModel
    }
    if (!this.eventSelModel) {
        this.eventSelModel = {}
    }
    var a = this.eventSelModel;
    var b = "SINGLE";
    if (this.simpleSelect) {
        b = "SIMPLE"
    } else {
        if (this.multiSelect) {
            b = "MULTI"
        }
    }
    Ext.applyIf(a, {allowDeselect: this.allowDeselect, mode: b});
    if (!a.events) {
        a = this.eventSelModel = Ext.create("selection." + this.eventSelModelType, a)
    }
    if (!a.hasRelaySetup) {
        this.relayEvents(a, ["selectionchange", "deselect", "select"]);
        a.hasRelaySetup = true
    }
    if (this.disableSelection) {
        a.locked = true
    }
    return a
}, refreshResourceColumns: function () {
    var a = this.resourceColumnWidth || this.timeAxisViewModel.resourceColumnWidth;
    this.normalGrid.reconfigure(null, this.createResourceColumns(a))
}, onCalendarColumnResize: function (d, c, b) {
    this.timeAxisViewModel.setViewColumnWidth(b, true);
    var a = this.getSchedulingView().calendar;
    a.repaintEventsForColumn(c, c.getIndex())
}, refreshCalendarColumns: function () {
    var b = this.createCalendarRows();
    var a = this.createCalendarColumns();
    this.reconfigure(b, this.calendarColumns.concat(a))
}, setOrientation: function () {
    this.setMode.apply(this, arguments)
}, setMode: function (d, b) {
    if (d === this.mode && !b) {
        return
    }
    switch (d) {
        case"horizontal":
            this.addCls("sch-horizontal");
            this.removeCls(["sch-vertical", "sch-calendar", "sch-vertical-resource"]);
            break;
        case"vertical":
            this.addCls(["sch-vertical-resource", "sch-vertical"]);
            this.removeCls(["sch-calendar", "sch-horizontal"]);
            break;
        case"calendar":
            this.addCls(["sch-calendar", "sch-vertical"]);
            this.removeCls(["sch-vertical-resource", "sch-horizontal"]);
            break
    }
    this.mode = d;
    var h = this, e = function () {
        return false
    }, g = h.normalGrid, i = h.lockedGrid.getView(), f = h.getSchedulingView(), c = g.headerCt;
    var a = i.deferInitialRefresh;
    f.deferInitialRefresh = i.deferInitialRefresh = false;
    i.on("beforerefresh", e);
    f.on("beforerefresh", e);
    f.setMode(d);
    Ext.suspendLayouts();
    c.removeAll(true);
    Ext.resumeLayouts();
    if (d !== "calendar") {
        h.timeAxis.mode = "plain";
        h.mun(h.timeAxis, h.calendarListeners);
        if (h._oldViewPreset) {
            h.switchViewPreset.apply(h, h._oldViewPreset);
            delete h._oldViewPreset
        }
    } else {
        h._oldViewPreset = [h.viewPreset, h.timeAxis.getStart(), h.timeAxis.getEnd()];
        h.timeAxis.mode = "calendar";
        h.switchViewPreset(h.calendarViewPreset);
        h.mon(h.timeAxis, h.calendarListeners)
    }
    if (d === "horizontal") {
        h.mun(h.resourceStore, h.verticalListeners);
        h.normalGrid.un(h.calendarViewListeners);
        f.setRowHeight(h.rowHeight || h.timeAxisViewModel.rowHeight, true);
        h.reconfigure(h.resourceStore, h.horizontalColumns)
    } else {
        if (d === "calendar") {
            h.mun(h.resourceStore, h.verticalListeners);
            h.normalGrid.on(h.calendarViewListeners);
            h.refreshCalendarColumns();
            f.setRowHeight(h.rowHeight || h.timeAxisViewModel.rowHeight, true);
            f.setColumnWidth(h.timeAxisViewModel.calendarColumnWidth || 100, true)
        } else {
            h.normalGrid.un(h.calendarViewListeners);
            h.mon(h.resourceStore, h.verticalListeners);
            h.reconfigure(h.timeAxis, h.verticalColumns.concat(h.createResourceColumns(h.resourceColumnWidth || h.timeAxisViewModel.resourceColumnWidth)));
            f.setColumnWidth(h.timeAxisViewModel.resourceColumnWidth || 100, true)
        }
    }
    f.deferInitialRefresh = i.deferInitialRefresh = a;
    i.un("beforerefresh", e);
    f.un("beforerefresh", e);
    h.getView().refresh();
    this.fireEvent("modechange", this, d);
    this.fireEvent("orientationchange", this, d)
}, onScheduleRowMouseDown: function (a, c) {
    var b = this.lockedGrid.getSelectionModel();
    if (this.getMode() === "horizontal" && Ext.selection.RowModel && b instanceof Ext.selection.RowModel) {
        b.select(c)
    }
}, onScheduleEventBarMouseDown: function (a, d, f) {
    var c = this.normalGrid.view;
    var b = c.getRecord(c.findRowByChild(f.getTarget()));
    this.onScheduleRowMouseDown(a, b)
}, createCalendarRows: function () {
    var e = this;
    var d = e.timeAxis.headerConfig;
    var b = Sch.util.Date.splitToSubUnits(e.timeAxis.start, d.middle.unit);
    var f = [];
    for (var c = 0; c < b.length - 1; c++) {
        f.push({start: b[c], end: b[c + 1]})
    }
    e.timeAxisViewModel.calendarRowsAmount = b.length - 1;
    var a = new Ext.data.Store({fields: ["start", "end"], data: f});
    return a
}, createCalendarColumns: function () {
    var b = this;
    var c = b.timeAxis.headerConfig.middle;
    var a = [];
    b.timeAxis.forEachAuxInterval(c.splitUnit, null, function (g, d, e) {
        var f = {xtype: "weekview-day", renderer: b.mainRenderer, scope: b, start: g, end: d};
        if (c.renderer) {
            f.text = c.renderer.call(c.scope || b, g, d, f, e, b.eventStore)
        } else {
            f.text = Ext.Date.format(g, c.dateFormat)
        }
        a.push(f)
    });
    return a
}, setRowHeight: function (a, b) {
    b = b || !this.lockedGrid;
    this.timeAxisViewModel.setViewRowHeight(a, b)
}});
Ext.define("Sch.mixin.FilterableTreeView", {prevBlockRefresh: null, initTreeFiltering: function () {
    var a = function () {
        var b = this.store.treeStore;
        this.mon(b, "nodestore-datachange-start", this.onFilterChangeStart, this);
        this.mon(b, "nodestore-datachange-end", this.onFilterChangeEnd, this);
        if (!b.allowExpandCollapseWhileFiltered) {
            this.mon(b, "filter-clear", this.onFilterCleared, this);
            this.mon(b, "filter-set", this.onFilterSet, this)
        }
    };
    if (this.rendered) {
        a.call(this)
    } else {
        this.on("beforerender", a, this, {single: true})
    }
}, onFilterChangeStart: function () {
    this.prevBlockRefresh = this.blockRefresh;
    this.blockRefresh = true;
    Ext.suspendLayouts()
}, onFilterChangeEnd: function () {
    Ext.resumeLayouts(true);
    this.blockRefresh = this.prevBlockRefresh
}, onFilterCleared: function () {
    delete this.toggle;
    var a = this.getEl();
    if (a) {
        a.removeCls("sch-tree-filtered")
    }
}, onFilterSet: function () {
    this.toggle = function () {
    };
    var a = this.getEl();
    if (a) {
        a.addCls("sch-tree-filtered")
    }
}});
Ext.define("Sch.panel.TimelineGridPanel", {extend: "Ext.grid.Panel", mixins: ["Sch.mixin.Localizable", "Sch.mixin.TimelinePanel"], subGridXType: "gridpanel", requires: ["Sch.patches.ColumnResize"], initComponent: function () {
    this.callParent(arguments);
    this.getSchedulingView()._initializeTimelineView()
}}, function () {
    this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {})
});
if (!Ext.ClassManager.get("Sch.panel.TimelineTreePanel")) {
    Ext.define("Sch.panel.TimelineTreePanel", {extend: "Ext.tree.Panel", requires: ["Ext.grid.Panel", "Ext.data.TreeStore", "Sch.mixin.FilterableTreeView", "Sch.patches.ColumnResizeTree"], mixins: ["Sch.mixin.Localizable", "Sch.mixin.TimelinePanel"], useArrows: true, rootVisible: false, lockedXType: "treepanel", initComponent: function () {
        this.callParent(arguments);
        this.getSchedulingView()._initializeTimelineView()
    }}, function () {
        this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {})
    })
}
Ext.define("Sch.panel.SchedulerGrid", {extend: "Sch.panel.TimelineGridPanel", mixins: ["Sch.mixin.SchedulerPanel"], alias: ["widget.schedulergrid", "widget.schedulerpanel"], alternateClassName: "Sch.SchedulerPanel", viewType: "schedulergridview", initComponent: function () {
    this.callParent(arguments);
    this.getSchedulingView()._initializeSchedulerView()
}}, function () {
    this.override(Sch.mixin.SchedulerPanel.prototype.inheritables() || {})
});
Ext.define("Sch.panel.SchedulerTree", {extend: "Sch.panel.TimelineTreePanel", mixins: ["Sch.mixin.SchedulerPanel"], alias: ["widget.schedulertree"], viewType: "schedulergridview", setOrientation: function () {
    return this.setMode.apply(this, arguments)
}, setMode: function (a) {
    if (a !== "horizontal") {
        Ext.Error.raise("Sch.panel.SchedulerTree only support horizontal mode")
    }
}, initComponent: function () {
    this.callParent(arguments);
    this.getSchedulingView()._initializeSchedulerView()
}}, function () {
    this.override(Sch.mixin.SchedulerPanel.prototype.inheritables() || {})
});
Ext.define("Sch.widget.PagingToolbar", {extend: "Ext.toolbar.Paging", alias: "widget.sch_pagingtoolbar", getStoreId: function () {
    if (this.storeId) {
        return this.storeId
    }
    var a = this.store.storeId;
    if (!a) {
        var c = this.store.crudManager;
        var b = c && c.getStore(this.store);
        a = b && b.storeId
    }
    this.storeId = a;
    return a
}, loadPage: function (c) {
    var b = this;
    if (b.store.crudManager) {
        var a = b.getStoreId();
        if (a) {
            var d = {};
            d[a] = {pageSize: b.store.pageSize, page: c};
            b.store.crudManager.load(d)
        }
    } else {
        b.store.loadPage(c)
    }
}, onPagingKeyDown: function (h, g) {
    var d = this, b = g.getKey(), c = d.getPageData(), a = g.shiftKey ? 10 : 1, f;
    if (b == g.RETURN) {
        g.stopEvent();
        f = d.readPageFromInput(c);
        if (f !== false) {
            f = Math.min(Math.max(1, f), c.pageCount);
            if (d.fireEvent("beforechange", d, f) !== false) {
                d.loadPage(f)
            }
        }
    } else {
        if (b == g.HOME || b == g.END) {
            g.stopEvent();
            f = b == g.HOME ? 1 : c.pageCount;
            h.setValue(f)
        } else {
            if (b == g.UP || b == g.PAGE_UP || b == g.DOWN || b == g.PAGE_DOWN) {
                g.stopEvent();
                f = d.readPageFromInput(c);
                if (f) {
                    if (b == g.DOWN || b == g.PAGE_DOWN) {
                        a *= -1
                    }
                    f += a;
                    if (f >= 1 && f <= c.pageCount) {
                        h.setValue(f)
                    }
                }
            }
        }
    }
}, moveFirst: function () {
    if (this.fireEvent("beforechange", this, 1) !== false) {
        this.loadPage(1)
    }
}, movePrevious: function () {
    var b = this, a = b.store.currentPage - 1;
    if (a > 0) {
        if (b.fireEvent("beforechange", b, a) !== false) {
            b.loadPage(a)
        }
    }
}, moveNext: function () {
    var c = this, b = c.getPageData().pageCount, a = c.store.currentPage + 1;
    if (a <= b) {
        if (c.fireEvent("beforechange", c, a) !== false) {
            c.loadPage(a)
        }
    }
}, moveLast: function () {
    var b = this, a = b.getPageData().pageCount;
    if (b.fireEvent("beforechange", b, a) !== false) {
        b.loadPage(a)
    }
}, doRefresh: function () {
    var a = this, b = a.store.currentPage;
    if (a.fireEvent("beforechange", a, b) !== false) {
        a.loadPage(b)
    }
}});
if (false && !window.location.href.match("bryntum.com|ext-scheduler.com")) {
    var log = function (a) {
        if (window.console) {
            console.log(a)
        }
    };
    log("BRYNTUM TRIAL LICENSE, for purchasing and licensing options please visit: www.bryntum.com/store (btw, we're hiring: www.bryntum.com/company/careers )");
    function newRefresh() {
        this.callOverridden(arguments);
        if (this.__injected || !this.rendered) {
            return
        }
        this.__injected = true;
        Ext.Function.defer(function () {
            this.el && this.el.select(this.eventSelector).setOpacity(0.15);
            log("TRIAL VERSION: PRODUCT DEACTIVATED")
        }, 10 * 60 * 1000, this);
        var a = this.el.parent().createChild({tag: "a", cls: "bryntum-trial", href: "http://www.bryntum.com/store", title: "Click here to purchase a license", style: "display:block;height:54px;width:230px;background: #fff url(http://www.bryntum.com/site-images/bryntum-trial.png) no-repeat;z-index:10000;border:1px solid #ddd;-webkit-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-box-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);-moz-border-radius:5px;-webkit-border-radius:5px;position:absolute;bottom:10px;right:15px;"});
        try {
            if (!Ext.util.Cookies.get("bmeval")) {
                Ext.util.Cookies.set("bmeval", new Date().getTime(), Ext.Date.add(new Date(), Ext.Date.YEAR, 2))
            } else {
                var d = Ext.util.Cookies.get("bmeval"), b = new Date(parseInt(d, 10));
                if (Ext.Date.add(b, Ext.Date.DAY, 45) < new Date()) {
                    this.el.select(this.eventSelector).hide();
                    this.el.mask("Trial Period Expired!").setStyle("z-index", 10000);
                    log("TRIAL PERIOD EXPIRED, PURCHASE A LICENSE HERE http://bryntum.com/");
                    this.refresh = Ext.emptyFn
                }
            }
        } catch (c) {
            console.log(c)
        }
    }

    if (Sch && Sch.view && Sch.view.TimelineGridView) {
        Sch.view.TimelineGridView.override({refresh: Ext.Function.clone(newRefresh)})
    }
    if (Sch && Sch.view && Sch.view.TimelineTreeView) {
        Sch.view.TimelineTreeView.override({refresh: Ext.Function.clone(newRefresh)})
    }
}
Ext.data.Connection.override({parseStatus: function (b) {
    var a = this.callOverridden(arguments);
    if (b === 0) {
        a.success = true
    }
    return a
}});