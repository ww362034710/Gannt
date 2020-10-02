var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MixinAny } from "../../../../ChronoGraph/class/BetterMixin.js";
import { ReadMode, Replica } from "../../../../ChronoGraph/replica/Replica.js";
import { Schema } from "../../../../ChronoGraph/schema/Schema.js";
import { delay } from "../../../../ChronoGraph/util/Helpers.js";
import StateTrackingManager from "../../../../Core/data/stm/StateTrackingManager.js";
import Store from "../../../../Core/data/Store.js";
import { model_field } from "../../../chrono/ModelFieldAtom.js";
import { EngineReplica } from "../../../chrono/Replica.js";
import { DurationConverterMixin } from "../../../scheduling/DurationConverterMixin.js";
import { ProjectType } from "../../../scheduling/Types.js";
import { ChronoAssignmentStoreMixin } from "../../store/ChronoAssignmentStoreMixin.js";
import { ChronoCalendarManagerStoreMixin } from "../../store/ChronoCalendarManagerStoreMixin.js";
import { ChronoDependencyStoreMixin } from "../../store/ChronoDependencyStoreMixin.js";
import { ChronoEventStoreMixin } from "../../store/ChronoEventStoreMixin.js";
import { ChronoResourceStoreMixin } from "../../store/ChronoResourceStoreMixin.js";
import { ChronoAbstractProjectMixin } from "./ChronoAbstractProjectMixin.js";
import { BaseAssignmentMixin } from "./BaseAssignmentMixin.js";
import { BaseCalendarMixin } from "./BaseCalendarMixin.js";
import { BaseDependencyMixin } from "./BaseDependencyMixin.js";
import { BaseEventMixin } from "./BaseEventMixin.js";
import { BaseResourceMixin } from "./BaseResourceMixin.js";
import { CanCombineCalendars, HasCalendarMixin } from "./HasCalendarMixin.js";
import { HasSubEventsMixin } from "./HasSubEventsMixin.js";
import { SchedulerBasicEvent } from "./SchedulerBasicEvent.js";
import BrowserHelper from "../../../../Core/helper/BrowserHelper.js";
export class SchedulerBasicProjectMixin extends MixinAny([
    ChronoAbstractProjectMixin,
    BaseEventMixin,
    HasSubEventsMixin,
    HasCalendarMixin,
    DurationConverterMixin,
    CanCombineCalendars
], (base) => {
    const superProto = base.prototype;
    class SchedulerBasicProjectMixin extends base {
        construct(config = {}) {
            this.replica = EngineReplica.mix(Replica).new({
                project: this,
                schema: Schema.new(),
                enableProgressNotifications: config.enableProgressNotifications,
                onWriteDuringCommit: 'ignore',
                readMode: ReadMode.CurrentOrProposedOrPrevious
            });
            this.enableProgressNotifications = config.enableProgressNotifications;
            if (!('expanded' in config)) {
                config.expanded = true;
            }
            superProto.construct.call(this, config);
            if (!this.eventModelClass)
                this.eventModelClass = this.getDefaultEventModelClass();
            if (!this.eventStoreClass)
                this.eventStoreClass = this.getDefaultEventStoreClass();
            if (!this.dependencyModelClass)
                this.dependencyModelClass = this.getDefaultDependencyModelClass();
            if (!this.dependencyStoreClass)
                this.dependencyStoreClass = this.getDefaultDependencyStoreClass();
            if (!this.resourceModelClass)
                this.resourceModelClass = this.getDefaultResourceModelClass();
            if (!this.resourceStoreClass)
                this.resourceStoreClass = this.getDefaultResourceStoreClass();
            if (!this.assignmentModelClass)
                this.assignmentModelClass = this.getDefaultAssignmentModelClass();
            if (!this.assignmentStoreClass)
                this.assignmentStoreClass = this.getDefaultAssignmentStoreClass();
            if (!this.calendarModelClass)
                this.calendarModelClass = this.getDefaultCalendarModelClass();
            if (!this.calendarManagerStoreClass)
                this.calendarManagerStoreClass = this.getDefaultCalendarManagerStoreClass();
            this.replica.addEntity(this);
            this.stm = new StateTrackingManager(Object.assign({
                disabled: true
            }, this.stm));
            this.stm.on({
                restoringStop: async () => {
                    this.stm.disable();
                    await this.commitAsync();
                    if (!this.isDestroyed) {
                        this.stm.enable();
                        this.trigger('stateRestoringDone');
                    }
                }
            });
            this.setCalendarManagerStore(this.calendarManagerStore);
            this.defaultCalendar = new this.calendarManagerStore.modelClass({
                unspecifiedTimeIsWorking: this.unspecifiedTimeIsWorking
            });
            this.defaultCalendar.project = this;
            this.replica.addEntity(this.defaultCalendar);
            this.setEventStore(this.eventStore);
            this.setDependencyStore(this.dependencyStore);
            this.setResourceStore(this.resourceStore);
            this.setAssignmentStore(this.assignmentStore);
            const hasInlineData = Boolean(this.calendarsData || this.eventsData || this.dependenciesData || this.resourcesData || this.assignmentsData);
            if (hasInlineData) {
                this.loadInlineData({
                    calendarsData: this.calendarsData,
                    eventsData: this.eventsData,
                    dependenciesData: this.dependenciesData,
                    resourcesData: this.resourcesData,
                    assignmentsData: this.assignmentsData
                });
                delete this.calendarsData;
                delete this.eventsData;
                delete this.dependenciesData;
                delete this.resourcesData;
                delete this.assignmentsData;
            }
        }
        doDestroy() {
            var _a, _b, _c, _d, _e, _f;
            const me = this;
            (_a = me.eventStore) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = me.dependencyStore) === null || _b === void 0 ? void 0 : _b.destroy();
            (_c = me.assignmentStore) === null || _c === void 0 ? void 0 : _c.destroy();
            (_d = me.resourceStore) === null || _d === void 0 ? void 0 : _d.destroy();
            (_e = me.calendarManagerStore) === null || _e === void 0 ? void 0 : _e.destroy();
            me.replica.clear();
            (_f = me.stm) === null || _f === void 0 ? void 0 : _f.destroy();
            superProto.doDestroy.call(this);
        }
        *hasSubEvents() {
            return this.getEventStore().count > 0;
        }
        *subEventsIterable() {
            return this.getEventStore().getRange();
        }
        getType() {
            return ProjectType.SchedulerBasic;
        }
        get enableProgressNotifications() {
            return this._enableProgressNotifications;
        }
        set enableProgressNotifications(value) {
            this._enableProgressNotifications = value;
            if (this.replica)
                this.replica.enableProgressNotifications = value;
        }
        getDefaultEventModelClass() {
            return SchedulerBasicEvent;
        }
        getDefaultEventStoreClass() {
            return ChronoEventStoreMixin;
        }
        getDefaultDependencyModelClass() {
            return BaseDependencyMixin;
        }
        getDefaultDependencyStoreClass() {
            return ChronoDependencyStoreMixin;
        }
        getDefaultResourceModelClass() {
            return BaseResourceMixin;
        }
        getDefaultResourceStoreClass() {
            return ChronoResourceStoreMixin;
        }
        getDefaultAssignmentModelClass() {
            return BaseAssignmentMixin;
        }
        getDefaultAssignmentStoreClass() {
            return ChronoAssignmentStoreMixin;
        }
        getDefaultCalendarModelClass() {
            return BaseCalendarMixin;
        }
        getDefaultCalendarManagerStoreClass() {
            return ChronoCalendarManagerStoreMixin;
        }
        async loadInlineData(data) {
            if (this.replica.enableProgressNotifications) {
                await delay(0);
                this.replica.onPropagationProgressNotification({ total: 0, remaining: 0, phase: 'storePopulation' });
                await delay(50);
            }
            this.isLoadingInlineData = true;
            if (BrowserHelper.global.DEBUG)
                console.log(`%cInitializing project`, 'font-weight:bold;color:darkgreen;text-transform:uppercase;margin-top: 2em');
            if (BrowserHelper.global.DEBUG)
                console.time('Time to visible');
            if (BrowserHelper.global.DEBUG)
                console.time('Populating project');
            if (data.calendarsData) {
                this.calendarManagerStore.data = data.calendarsData;
            }
            if (data.eventsData) {
                this.eventStore.data = data.eventsData;
            }
            if (data.dependenciesData) {
                this.dependencyStore.data = data.dependenciesData;
            }
            if (data.resourcesData) {
                this.resourceStore.data = data.resourcesData;
            }
            if (data.assignmentsData) {
                this.assignmentStore.data = data.assignmentsData;
            }
            if (BrowserHelper.global.DEBUG)
                console.timeEnd('Populating project');
            this.isLoadingInlineData = false;
            await this.commitLoad();
            return;
        }
        async commitLoad() {
            if (BrowserHelper.global.DEBUG)
                console.time('Initial propagation');
            await this.commitAsync();
            if (!this.isDestroyed)
                this.trigger('load');
        }
        getGraph() {
            return this.replica;
        }
        async addEvents(events) {
            this.eventStore.add(events);
            return this.graph.commitAsync();
        }
        async addEvent(event) {
            this.eventStore.add(event);
            return this.graph.commitAsync();
        }
        includeEvent(event) {
            this.eventStore.add(event);
        }
        async removeEvents(events) {
            this.eventStore.remove(events);
            return this.graph.commitAsync();
        }
        excludeEvent(event) {
            this.eventStore.remove(event);
        }
        async removeEvent(event) {
            this.eventStore.remove(event);
            return this.graph.commitAsync();
        }
        getStm() {
            return this.stm;
        }
        calculateProject() {
            return this;
        }
        *calculateCalendar() {
            let calendar = yield this.$.proposedCalendar;
            if (!calendar) {
                calendar = this.defaultCalendar;
            }
            yield calendar.$.version;
            return calendar;
        }
        joinStoreRecords(store) {
            const fn = (record) => {
                record.setProject(this);
                record.joinProject();
            };
            if (store.rootNode) {
                store.rootNode.traverse(fn);
            }
            else {
                store.forEach(fn);
            }
        }
        unJoinStoreRecords(store) {
            const fn = (record) => {
                record.leaveProject();
                record.setProject(this);
            };
            if (store.rootNode) {
                store.rootNode.traverse(node => {
                    if (node !== store.rootNode)
                        fn(node);
                });
            }
            else {
                store.forEach(fn);
            }
        }
        setEventStore(store) {
            if (this.eventStore && this.stm.hasStore(this.eventStore)) {
                this.stm.removeStore(this.eventStore);
                this.unJoinStoreRecords(this.eventStore);
                const assignmentsForRemoval = this.eventStore.assignmentsForRemoval;
                assignmentsForRemoval.forEach(assignment => {
                    const oldEvent = assignment.event;
                    if (oldEvent) {
                        const newEvent = store.getById(oldEvent.id);
                        if (newEvent) {
                            assignment.event = newEvent;
                            assignmentsForRemoval.delete(assignment);
                        }
                    }
                });
                this.eventStore.afterEventRemoval();
            }
            if (!store || !(store instanceof Store)) {
                const storeClass = (store === null || store === void 0 ? void 0 : store.storeClass) || this.eventStoreClass;
                this.eventStore = new storeClass(Object.assign({
                    modelClass: this.eventModelClass,
                    idField: 'id',
                    project: this,
                    stm: this.stm
                }, store || {}));
            }
            else {
                this.eventStore = store;
                store.setProject(this);
                this.stm.addStore(store);
                if (store.tree && store.rootNode !== this) {
                    this.appendChild(store.rootNode.children || []);
                    store.rootNode = this;
                }
                else {
                    this.joinStoreRecords(store);
                }
            }
            this.trigger('eventStoreChange', { store: this.eventStore });
        }
        setDependencyStore(store) {
            if (this.dependencyStore && this.stm.hasStore(this.dependencyStore)) {
                this.stm.removeStore(this.dependencyStore);
            }
            if (!store || !(store instanceof Store)) {
                const storeClass = (store === null || store === void 0 ? void 0 : store.storeClass) || this.dependencyStoreClass;
                this.dependencyStore = new storeClass(Object.assign({
                    modelClass: this.dependencyModelClass,
                    idField: 'id',
                    project: this,
                    stm: this.stm
                }, store || {}));
            }
            else {
                this.dependencyStore = store;
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
            this.trigger('dependencyStoreChange', { store: this.dependencyStore });
        }
        setResourceStore(store) {
            if (this.resourceStore && this.stm.hasStore(this.resourceStore)) {
                this.stm.removeStore(this.resourceStore);
                this.unJoinStoreRecords(this.resourceStore);
                const assignmentsForRemoval = this.resourceStore.assignmentsForRemoval;
                assignmentsForRemoval.forEach(assignment => {
                    const oldResource = assignment.resource;
                    if (oldResource) {
                        const newResource = store.getById(oldResource.id);
                        if (newResource) {
                            assignment.resource = newResource;
                            assignmentsForRemoval.delete(assignment);
                        }
                    }
                });
                this.resourceStore.afterResourceRemoval();
            }
            if (!store || !(store instanceof Store)) {
                const storeClass = (store === null || store === void 0 ? void 0 : store.storeClass) || this.resourceStoreClass;
                this.resourceStore = new storeClass(Object.assign({
                    modelClass: this.resourceModelClass,
                    idField: 'id',
                    project: this,
                    stm: this.stm
                }, store || {}));
            }
            else {
                this.resourceStore = store;
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
            this.trigger('resourceStoreChange', { store: this.resourceStore });
        }
        setAssignmentStore(store) {
            if (this.assignmentStore && this.stm.hasStore(this.assignmentStore)) {
                this.stm.removeStore(this.assignmentStore);
                this.unJoinStoreRecords(this.assignmentStore);
            }
            if (!store || !(store instanceof Store)) {
                const storeClass = (store === null || store === void 0 ? void 0 : store.storeClass) || this.assignmentStoreClass;
                this.assignmentStore = new storeClass(Object.assign({
                    modelClass: this.assignmentModelClass,
                    idField: 'id',
                    project: this,
                    stm: this.stm
                }, store || {}));
            }
            else {
                this.assignmentStore = store;
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
            this.trigger('assignmentStoreChange', { store: this.assignmentStore });
        }
        setCalendarManagerStore(store) {
            if (this.calendarManagerStore && this.stm.hasStore(this.calendarManagerStore)) {
                this.stm.removeStore(this.calendarManagerStore);
            }
            if (!store || !(store instanceof Store)) {
                const storeClass = (store === null || store === void 0 ? void 0 : store.storeClass) || this.calendarManagerStoreClass;
                this.calendarManagerStore = new storeClass(Object.assign({
                    modelClass: this.calendarModelClass,
                    idField: 'id',
                    project: this,
                    stm: this.stm
                }, store || {}));
            }
            else {
                this.calendarManagerStore = store;
                if (store) {
                    store.setProject(this);
                    this.stm.addStore(store);
                    this.joinStoreRecords(store);
                }
            }
            this.trigger('calendarManagerStoreChange', { store: this.calendarManagerStore });
        }
        async isValidDependency(...args) {
            return true;
        }
        async tryPropagateWithChanges(changerFn) {
            const stm = this.stm;
            let stmInitiallyDisabled, stmInitiallyAutoRecord;
            const captureStm = () => {
                stmInitiallyDisabled = stm.disabled;
                stmInitiallyAutoRecord = stm.autoRecord;
                if (stmInitiallyDisabled) {
                    stm.enable();
                }
                else {
                    if (stmInitiallyAutoRecord) {
                        stm.autoRecord = false;
                    }
                    if (stm.isRecording) {
                        stm.stopTransaction();
                    }
                }
            };
            const commitStmTransaction = () => {
                stm.stopTransaction();
                if (stmInitiallyDisabled) {
                    stm.resetQueue();
                }
            };
            const rejectStmTransaction = () => {
                if (stm.transaction.length) {
                    stm.forEachStore(s => s.beginBatch());
                    stm.rejectTransaction();
                    stm.forEachStore(s => s.endBatch());
                }
                else {
                    stm.stopTransaction();
                }
            };
            const freeStm = () => {
                stm.disabled = stmInitiallyDisabled;
                stm.autoRecord = stmInitiallyAutoRecord;
            };
            captureStm();
            stm.startTransaction();
            changerFn();
            let result = true;
            try {
                await this.commitAsync();
            }
            catch (e) {
                if (!/cycle/i.test(e))
                    throw e;
                result = false;
            }
            if (result) {
                commitStmTransaction();
            }
            else {
                this.replica.reject();
                rejectStmTransaction();
            }
            freeStm();
            return result;
        }
        static get defaultConfig() {
            return {
                assignmentsData: null,
                calendarsData: null,
                dependenciesData: null,
                eventsData: null,
                resourcesData: null,
                eventStore: null,
                resourceStore: null,
                assignmentStore: null,
                dependencyStore: null,
                calendarManagerStore: null
            };
        }
    }
    SchedulerBasicProjectMixin.applyConfigs = true;
    __decorate([
        model_field({ type: 'boolean', defaultValue: true })
    ], SchedulerBasicProjectMixin.prototype, "unspecifiedTimeIsWorking", void 0);
    return SchedulerBasicProjectMixin;
}) {
}
