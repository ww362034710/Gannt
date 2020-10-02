import { CommitResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, MixinAny } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CalculationIterator } from "../../../../ChronoGraph/primitives/Calculation.js"
import { ReadMode, Replica } from "../../../../ChronoGraph/replica/Replica.js"
import { Schema } from "../../../../ChronoGraph/schema/Schema.js"
import { delay } from "../../../../ChronoGraph/util/Helpers.js"
import StateTrackingManager from "../../../../Core/data/stm/StateTrackingManager.js"
import Store from "../../../../Core/data/Store.js"
import { model_field } from "../../../chrono/ModelFieldAtom.js"
import { EngineReplica } from "../../../chrono/Replica.js"
import { DurationConverterMixin } from "../../../scheduling/DurationConverterMixin.js"
import { ProjectType } from "../../../scheduling/Types.js"
import { ChronoAssignmentStoreMixin } from "../../store/ChronoAssignmentStoreMixin.js"
import { ChronoCalendarManagerStoreMixin } from "../../store/ChronoCalendarManagerStoreMixin.js"
import { ChronoDependencyStoreMixin } from "../../store/ChronoDependencyStoreMixin.js"
import { ChronoEventStoreMixin } from "../../store/ChronoEventStoreMixin.js"
import { ChronoPartOfProjectStoreMixin } from "../../store/mixin/ChronoPartOfProjectStoreMixin.js"
import { ChronoResourceStoreMixin } from "../../store/ChronoResourceStoreMixin.js"
import { ChronoPartOfProjectModelMixin } from "../mixin/ChronoPartOfProjectModelMixin.js"
import { ChronoAbstractProjectMixin } from "./ChronoAbstractProjectMixin.js"
import { BaseAssignmentMixin } from "./BaseAssignmentMixin.js"
import { BaseCalendarMixin } from "./BaseCalendarMixin.js"
import { BaseDependencyMixin } from "./BaseDependencyMixin.js"
import { BaseEventMixin } from "./BaseEventMixin.js"
import { BaseResourceMixin } from "./BaseResourceMixin.js"
import { CanCombineCalendars, HasCalendarMixin } from "./HasCalendarMixin.js"
import { HasSubEventsMixin } from "./HasSubEventsMixin.js"
import { SchedulerBasicEvent } from "./SchedulerBasicEvent.js"
import BrowserHelper from "../../../../Core/helper/BrowserHelper.js";

/**
 * The data package format describing project data
 */
export type ProjectDataPackage = {
    eventsData?             : any[]
    dependenciesData?       : any[]
    resourcesData?          : any[]
    assignmentsData?        : any[]
    calendarsData?          : any[]
}


declare const window : any

/**
 * Basic Scheduler project mixin type. At this level, events have assignments and dependencies, which both are, however,
 * only visual and do not affect the scheduling.
 */
export class SchedulerBasicProjectMixin extends MixinAny(
    [
        ChronoAbstractProjectMixin,
        BaseEventMixin,
        HasSubEventsMixin,
        HasCalendarMixin,
        DurationConverterMixin,
        CanCombineCalendars
    ],
    (base : AnyConstructor<
        ChronoAbstractProjectMixin &
        BaseEventMixin &
        HasSubEventsMixin &
        HasCalendarMixin &
        DurationConverterMixin &
        CanCombineCalendars
        ,
        typeof ChronoAbstractProjectMixin &
        typeof BaseEventMixin &
        typeof HasSubEventsMixin &
        typeof HasCalendarMixin &
        typeof DurationConverterMixin &
        typeof CanCombineCalendars
    >) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class SchedulerBasicProjectMixin extends base {

        /**
         * The [[Replica]] instance containing all data for this project.
         */
        replica                     : EngineReplica

        project                     : this

        /**
         * The constructor for the "Event" entity of the project.
         */
        eventModelClass             : typeof SchedulerBasicEvent

        /**
         * The constructor for the "Dependency" entity of the project
         */
        dependencyModelClass        : typeof BaseDependencyMixin

        /**
         * The constructor for the "Resource" entity of the project
         */
        resourceModelClass          : typeof BaseResourceMixin

        /**
         * The constructor for the "Assignment" entity of the project
         */
        assignmentModelClass        : typeof BaseAssignmentMixin

        /**
         * The constructor for the "Calendar" entity of the project
         */
        calendarModelClass          : typeof BaseCalendarMixin

        /**
         * The constructor for the "Events" collection of the project
         */
        eventStoreClass             : typeof ChronoEventStoreMixin

        /**
         * The constructor for the "Dependencies" collection of the project
         */
        dependencyStoreClass        : typeof ChronoDependencyStoreMixin

        /**
         * The constructor for the "Resources" collection of the project
         */
        resourceStoreClass          : typeof ChronoResourceStoreMixin

        /**
         * The constructor for the "Assignments" collection of the project
         */
        assignmentStoreClass        : typeof ChronoAssignmentStoreMixin

        /**
         * The constructor for the "Calendars" collection of the project
         */
        calendarManagerStoreClass   : typeof ChronoCalendarManagerStoreMixin

        /**
         * State tracking manager instance the project relies on
         */
        stm                         : StateTrackingManager

        /**
         * The instance of the "Events" collection of the project
         */
        eventStore                  : ChronoEventStoreMixin

        /**
         * The instance of the "Dependencies" collection of the project
         */
        dependencyStore             : ChronoDependencyStoreMixin

        /**
         * The instance of the "Resources" collection of the project
         */
        resourceStore               : ChronoResourceStoreMixin

        /**
         * The instance of the "Assignments" collection of the project
         */
        assignmentStore             : ChronoAssignmentStoreMixin

        /**
         * The instance of the "Calendars" collection of the project
         */
        calendarManagerStore        : ChronoCalendarManagerStoreMixin

        /**
         * The events data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         *
         * ```ts
         * const project    = new SchedulerBasicProjectMixin({
         *     eventsData   : [ { name : 'Task 1' } ]
         * })
         * ```
         */
        eventsData                  : any[]
        /**
         * The dependencies data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        dependenciesData            : any[]
        /**
         * The resources data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        resourcesData               : any[]
        /**
         * The assignments data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        assignmentsData             : any[]
        /**
         * The calendars data - can be provided during project instantiation and will be loaded with [[loadInlineData]].
         */
        calendarsData               : any[]

        defaultCalendar             : BaseCalendarMixin

        /**
         * This property is used when instantiating the default calendar of the project. This calendar will have no availability intervals,
         * so this setting will either turn the whole timespan into working time or non-working.
         *
         * Default value is `true`
         */
        @model_field({ type : 'boolean', defaultValue : true })
        unspecifiedTimeIsWorking  : boolean

        _enableProgressNotifications        : boolean

        isLoadingInlineData       : boolean


        construct (config : Partial<this> = {}) {
            this.replica        = EngineReplica.mix(Replica).new({
                project                         : this,
                schema                          : Schema.new(),
                enableProgressNotifications     : config.enableProgressNotifications,
                onWriteDuringCommit             : 'ignore',
                readMode                        : ReadMode.CurrentOrProposedOrPrevious
            })

            this.enableProgressNotifications    = config.enableProgressNotifications

            // Expand project by default to make getRange to work
            if (!('expanded' in config)) {
                // @ts-ignore
                config.expanded = true
            }

            // const hasInlineStore = Boolean(
            //     config.calendarManagerStore || config.eventStore || config.dependencyStore || config.resourceStore || config.assignmentStore
            // )

            superProto.construct.call(this, config)

            if (!this.eventModelClass) this.eventModelClass = this.getDefaultEventModelClass()
            if (!this.eventStoreClass) this.eventStoreClass = this.getDefaultEventStoreClass()

            if (!this.dependencyModelClass) this.dependencyModelClass = this.getDefaultDependencyModelClass()
            if (!this.dependencyStoreClass) this.dependencyStoreClass = this.getDefaultDependencyStoreClass()

            if (!this.resourceModelClass) this.resourceModelClass = this.getDefaultResourceModelClass()
            if (!this.resourceStoreClass) this.resourceStoreClass = this.getDefaultResourceStoreClass()

            if (!this.assignmentModelClass) this.assignmentModelClass = this.getDefaultAssignmentModelClass()
            if (!this.assignmentStoreClass) this.assignmentStoreClass = this.getDefaultAssignmentStoreClass()

            if (!this.calendarModelClass) this.calendarModelClass = this.getDefaultCalendarModelClass()
            if (!this.calendarManagerStoreClass) this.calendarManagerStoreClass = this.getDefaultCalendarManagerStoreClass()

            this.replica.addEntity(this)

            this.stm = new StateTrackingManager(Object.assign({
                disabled : true
            }, this.stm))

            this.stm.on({
                // Propagate on undo/redo
                restoringStop: async () => {
                    // Disable STM meanwhile to not pick it up as a new STM transaction
                    this.stm.disable()
                    await this.commitAsync()
                    if (!this.isDestroyed) {
                        this.stm.enable()
                        this.trigger('stateRestoringDone')
                    }
                }
            })

            this.setCalendarManagerStore(this.calendarManagerStore)

            // not part of the CalendarManagerStore intentionally, not persisted
            this.defaultCalendar = new this.calendarManagerStore.modelClass({
                unspecifiedTimeIsWorking: this.unspecifiedTimeIsWorking
            })

            this.defaultCalendar.project = this

            this.replica.addEntity(this.defaultCalendar)

            this.setEventStore(this.eventStore)

            this.setDependencyStore(this.dependencyStore)

            this.setResourceStore(this.resourceStore)

            this.setAssignmentStore(this.assignmentStore)


            const hasInlineData = Boolean(this.calendarsData || this.eventsData  || this.dependenciesData || this.resourcesData || this.assignmentsData)

            if (hasInlineData) {
                this.loadInlineData({
                    calendarsData       : this.calendarsData,
                    eventsData          : this.eventsData,
                    dependenciesData    : this.dependenciesData,
                    resourcesData       : this.resourcesData,
                    assignmentsData     : this.assignmentsData
                })

                delete this.calendarsData
                delete this.eventsData
                delete this.dependenciesData
                delete this.resourcesData
                delete this.assignmentsData
            }
        }


        doDestroy () {
            const me = this

            me.eventStore?.destroy()
            me.dependencyStore?.destroy()
            me.assignmentStore?.destroy()
            me.resourceStore?.destroy()
            me.calendarManagerStore?.destroy()

            me.replica.clear()

            me.stm?.destroy()

            superProto.doDestroy.call(this)
        }


        * hasSubEvents () : CalculationIterator<boolean> {
            return this.getEventStore().count > 0
        }


        * subEventsIterable () : CalculationIterator<Iterable<BaseEventMixin>> {
            return this.getEventStore().getRange()
        }


        getType () : ProjectType {
            return ProjectType.SchedulerBasic
        }

        get enableProgressNotifications () : boolean {
            return this._enableProgressNotifications
        }

        /**
         * Enables/disables the calculation progress notifications.
         */
        set enableProgressNotifications (value : boolean) {
            this._enableProgressNotifications   = value

            if (this.replica) this.replica.enableProgressNotifications  = value
        }

        /**
         * Returns the default event model class to use
         */
        getDefaultEventModelClass () : this[ 'eventModelClass' ] {
            return SchedulerBasicEvent
        }


        /**
         * Returns the default event store class to use
         */
        getDefaultEventStoreClass () : this[ 'eventStoreClass' ] {
            return ChronoEventStoreMixin
        }


        /**
         * Returns the default dependency model class to use
         */
        getDefaultDependencyModelClass () : this[ 'dependencyModelClass' ] {
            return BaseDependencyMixin
        }


        /**
         * Returns the default dependency store class to use
         */
        getDefaultDependencyStoreClass () : this[ 'dependencyStoreClass' ] {
            return ChronoDependencyStoreMixin
        }


        /**
         * Returns the default resource model class to use
         */
        getDefaultResourceModelClass () : this[ 'resourceModelClass' ] {
            return BaseResourceMixin
        }


        /**
         * Returns the default resource store class to use
         */
        getDefaultResourceStoreClass () : this[ 'resourceStoreClass' ] {
            return ChronoResourceStoreMixin
        }


        /**
         * Returns the default assignment model class to use
         */
        getDefaultAssignmentModelClass () : this[ 'assignmentModelClass' ] {
            return BaseAssignmentMixin
        }


        /**
         * Returns the default assignment store class to use
         */
        getDefaultAssignmentStoreClass () : this[ 'assignmentStoreClass' ] {
            return ChronoAssignmentStoreMixin
        }


        /**
         * Returns the default calendar model class to use
         */
        getDefaultCalendarModelClass () : this[ 'calendarModelClass' ] {
            return BaseCalendarMixin
        }


        /**
         * Returns the default calendar manager store class to use
         */
        getDefaultCalendarManagerStoreClass () : this[ 'calendarManagerStoreClass' ] {
            return ChronoCalendarManagerStoreMixin
        }


        /**
         * This method loads the "raw" data into the project. The loading is basically happening by
         * assigning the individual data entries to the `data` property of the corresponding store.
         *
         * @param data
         */
        async loadInlineData (data : ProjectDataPackage) : Promise<CommitResult> {
            if (this.replica.enableProgressNotifications) {
                // First delay needed to allow assignment of Project -> Gantt to happen before carrying on,
                // to make sure progress listener is in place
                await delay(0)
                this.replica.onPropagationProgressNotification({ total : 0, remaining : 0, phase : 'storePopulation' })
                // Second delay needed to allow mask to appear, not clear why delay(0) is not enough, it works in other
                // places
                await delay(50)
            }

            this.isLoadingInlineData = true

            if (BrowserHelper.global.DEBUG) console.log(`%cInitializing project`, 'font-weight:bold;color:darkgreen;text-transform:uppercase;margin-top: 2em')

            if (BrowserHelper.global.DEBUG) console.time('Time to visible')

            if (BrowserHelper.global.DEBUG) console.time('Populating project')
            if (data.calendarsData) {
                this.calendarManagerStore.data = data.calendarsData
            }
            if (data.eventsData) {
                this.eventStore.data   = data.eventsData
            }
            if (data.dependenciesData) {
                this.dependencyStore.data   = data.dependenciesData
            }
            if (data.resourcesData) {
                this.resourceStore.data     = data.resourcesData
            }
            if (data.assignmentsData) {
                this.assignmentStore.data   = data.assignmentsData
            }
            if (BrowserHelper.global.DEBUG) console.timeEnd('Populating project')

            this.isLoadingInlineData = false

            await this.commitLoad()

            return
        }

        async commitLoad () {
            if (BrowserHelper.global.DEBUG) console.time('Initial propagation')
            await this.commitAsync()
            // if (window.DEBUG) console.timeEnd('Initial propagation')

            // Might have been destroyed during the async operation above
            if (!this.isDestroyed) this.trigger('load')
        }


        getGraph () : EngineReplica {
            return this.replica
        }


        // keep this private
        async addEvents (events : InstanceType<this[ 'eventModelClass' ]>[]) : Promise<CommitResult> {
            this.eventStore.add(events)

            return this.graph.commitAsync()
        }


        // keep this private
        async addEvent (event : InstanceType<this[ 'eventModelClass' ]>) : Promise<CommitResult> {
            this.eventStore.add(event)

            return this.graph.commitAsync()
        }


        // keep this private
        includeEvent (event : InstanceType<this[ 'eventModelClass' ]>) {
            this.eventStore.add(event)
        }


        // keep this private
        async removeEvents (events : InstanceType<this[ 'eventModelClass' ]>[]) : Promise<CommitResult> {
            this.eventStore.remove(events)

            return this.graph.commitAsync()
        }


        // keep this private
        excludeEvent (event : InstanceType<this[ 'eventModelClass' ]>) {
            this.eventStore.remove(event)
        }


        // keep this private
        async removeEvent (event : InstanceType<this[ 'eventModelClass' ]>) : Promise<CommitResult> {
            this.eventStore.remove(event)

            return this.graph.commitAsync()
        }


        getStm () : StateTrackingManager {
            return this.stm
        }


        calculateProject () : this {
            return this
        }


        * calculateCalendar () : CalculationIterator<BaseCalendarMixin> {
            let calendar : BaseCalendarMixin  = yield this.$.proposedCalendar

            if (!calendar) {
                calendar        = this.defaultCalendar
            }

            // this will create an incoming edge from the calendar's version atom, which changes on calendar's data update
            yield calendar.$.version

            return calendar
        }


        joinStoreRecords (store : ChronoPartOfProjectStoreMixin) {
            const fn = (record : ChronoPartOfProjectModelMixin) => {
                record.setProject(this)
                record.joinProject()
            }

            if (store.rootNode) {
                store.rootNode.traverse(fn)
            } else {
                store.forEach(fn)
            }
        }


        unJoinStoreRecords (store : ChronoPartOfProjectStoreMixin) {
            const fn = (record : ChronoPartOfProjectModelMixin) => {
                record.leaveProject()
                record.setProject(this)
            }

            if (store.rootNode) {
                (store.rootNode as ChronoPartOfProjectModelMixin).traverse(node => {
                    // do not unjoin/leave project for the root node, which is the project itself
                    if (node !== store.rootNode) fn(node)
                })
            } else {
                store.forEach(fn)
            }
        }


        /**
         * This method sets the event store instance for the project.
         * @param store
         */
        setEventStore (store : ChronoEventStoreMixin) {
            //if (this.eventStore !== store) {
                if (this.eventStore && this.stm.hasStore(this.eventStore)) {
                    this.stm.removeStore(this.eventStore)
                    this.unJoinStoreRecords(this.eventStore)

                    const assignmentsForRemoval = this.eventStore.assignmentsForRemoval

                    // remap the assignment
                    assignmentsForRemoval.forEach(assignment => {
                        const oldEvent  = assignment.event

                        if (oldEvent) {
                            const newEvent  = store.getById(oldEvent.id)

                            if (newEvent) {
                                assignment.event    = newEvent
                                // keep the assignment
                                assignmentsForRemoval.delete(assignment)
                            }
                        }
                    })

                    this.eventStore.afterEventRemoval()
                }

                if (!store || !(store instanceof Store)) {
                    const storeClass = store?.storeClass || this.eventStoreClass

                    this.eventStore = new storeClass(Object.assign({
                        modelClass  : this.eventModelClass,

                        idField     : 'id',

                        project     : this,

                        stm         : this.stm
                    }, store || {}))
                }
                else {
                    this.eventStore = store

                    store.setProject(this)
                    this.stm.addStore(store)

                    // we've been given an event store from the outside
                    // need to change its root node to be the project
                    if (store.tree && store.rootNode !== this) {
                        this.appendChild(store.rootNode.children || [])
                        // Assigning a new root will make all children join store
                        store.rootNode = this
                    }
                    // TODO: Not sure about this, was always performed previously
                    else {
                        this.joinStoreRecords(store)
                    }
                }

                this.trigger('eventStoreChange', { store : this.eventStore })
            //}
        }


        /**
         * This method sets the dependency store instance for the project.
         * @param store
         */
        setDependencyStore (store : ChronoDependencyStoreMixin) {
            //if (this.dependencyStore !== store) {

                if (this.dependencyStore && this.stm.hasStore(this.dependencyStore)) {
                    this.stm.removeStore(this.dependencyStore)
                }

                if (!store || !(store instanceof Store)) {
                    const storeClass = store?.storeClass || this.dependencyStoreClass

                    this.dependencyStore = new storeClass(Object.assign({
                        modelClass  : this.dependencyModelClass,

                        idField     : 'id',

                        project     : this,

                        stm         : this.stm
                    }, store || {}))
                }
                else {
                    this.dependencyStore = store

                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }

                this.trigger('dependencyStoreChange', { store : this.dependencyStore })

            //}
        }


        /**
         * This method sets the resource store instance for the project.
         * @param store
         */
        setResourceStore (store : ChronoResourceStoreMixin) {
            //if (this.resourceStore !== store) {

                if (this.resourceStore && this.stm.hasStore(this.resourceStore)) {
                    this.stm.removeStore(this.resourceStore)
                    this.unJoinStoreRecords(this.resourceStore)

                    const assignmentsForRemoval = this.resourceStore.assignmentsForRemoval

                    // remap the assignment
                    assignmentsForRemoval.forEach(assignment => {
                        const oldResource  = assignment.resource

                        if (oldResource) {
                            const newResource  = store.getById(oldResource.id)

                            if (newResource) {
                                assignment.resource    = newResource
                                // keep the assignment
                                assignmentsForRemoval.delete(assignment)
                            }
                        }
                    })

                    this.resourceStore.afterResourceRemoval()
                }

                if (!store || !(store instanceof Store)) {
                    const storeClass = store?.storeClass || this.resourceStoreClass

                    this.resourceStore = new storeClass(Object.assign({
                        modelClass  : this.resourceModelClass,

                        idField     : 'id',

                        project     : this,

                        stm     : this.stm
                    }, store || {}))
                }
                else {
                    this.resourceStore = store

                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }

                this.trigger('resourceStoreChange', { store : this.resourceStore })
            //}
        }


        /**
         * This method sets the assignment store instance for the project.
         * @param store
         */
        setAssignmentStore (store : ChronoAssignmentStoreMixin) {
            //if (this.assignmentStore !== store) {

                if (this.assignmentStore && this.stm.hasStore(this.assignmentStore)) {
                    this.stm.removeStore(this.assignmentStore)
                    this.unJoinStoreRecords(this.assignmentStore)
                }

                if (!store || !(store instanceof Store)) {
                    const storeClass = store?.storeClass || this.assignmentStoreClass

                    this.assignmentStore = new storeClass(Object.assign({

                        modelClass  : this.assignmentModelClass,

                        idField     : 'id',

                        project     : this,

                        stm         : this.stm
                    }, store || {}))
                }
                else {
                    this.assignmentStore = store

                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }

                this.trigger('assignmentStoreChange', { store : this.assignmentStore })
            //}
        }


        /**
         * This method sets the calendar manager store instance for the project.
         * @param store
         */
        setCalendarManagerStore (store : ChronoCalendarManagerStoreMixin) {
            //if (this.calendarManagerStore !== store) {

                if (this.calendarManagerStore && this.stm.hasStore(this.calendarManagerStore)) {
                    this.stm.removeStore(this.calendarManagerStore)
                }

                if (!store || !(store instanceof Store)) {
                    const storeClass = store?.storeClass || this.calendarManagerStoreClass

                    this.calendarManagerStore = new storeClass(Object.assign({

                        modelClass  : this.calendarModelClass,

                        idField     : 'id',

                        project     : this,

                        stm         : this.stm
                    }, store || {}))
                }
                else {
                    this.calendarManagerStore = store

                    if (store) {
                        store.setProject(this)
                        this.stm.addStore(store)
                        this.joinStoreRecords(store)
                    }
                }

                this.trigger('calendarManagerStoreChange', { store : this.calendarManagerStore })
            //}
        }

        // this does not account for possible scheduling conflicts
        async isValidDependency (...args) : Promise<boolean> {
            return true
        }

        async tryPropagateWithChanges (changerFn : Function) : Promise<boolean> {
            const
                stm = this.stm

            let stmInitiallyDisabled : boolean,
                stmInitiallyAutoRecord : boolean

            const captureStm = () => {
                stmInitiallyDisabled = stm.disabled
                stmInitiallyAutoRecord = stm.autoRecord

                if (stmInitiallyDisabled) {
                    stm.enable()
                }
                else {
                    if (stmInitiallyAutoRecord) {
                        stm.autoRecord = false
                    }
                    if (stm.isRecording) {
                        stm.stopTransaction()
                    }
                }
            }

            const commitStmTransaction = () => {
                stm.stopTransaction()

                if (stmInitiallyDisabled) {
                    stm.resetQueue()
                }
            }

            const rejectStmTransaction = () => {
                if (stm.transaction.length) {

                    stm.forEachStore(s => s.beginBatch())

                    stm.rejectTransaction()

                    stm.forEachStore(s => s.endBatch())
                }
                else {
                    stm.stopTransaction()
                }
            }

            const freeStm = () => {
                stm.disabled = stmInitiallyDisabled
                stm.autoRecord = stmInitiallyAutoRecord
            }

            captureStm()

            stm.startTransaction()

            // In case anything in, or called by the changerFn attempts to propagate.
            // We must only propagate after the changes have been made.
            // this.suspendPropagate()

            changerFn()

            // Resume propagation, but do *not* propagate if any propagate calls were attempted during suspension.
            // this.resumePropagate(false)

            let result      = true

            try {
                await this.commitAsync()
            } catch (e) {
                // rethrow non-cycle exception
                if (!/cycle/i.test(e)) throw e

                result      = false
            }

            if (result) {
                commitStmTransaction()
            }
            else {
                this.replica.reject()
                rejectStmTransaction()
            }

            freeStm()

            return result
        }

        // Needed to separate configs from data, for tests to pass. Normally handled in ProjectModel outside of engine
        static get defaultConfig () : object {
            return {
                assignmentsData  : null,
                calendarsData    : null,
                dependenciesData : null,
                eventsData       : null,
                resourcesData    : null,

                // need to distinguish the stores from fields
                // https://www.bryntum.com/examples/gantt/advanced/index.umd.html
                // bryntum.gantt.ObjectHelper.isEqual({}, new bryntum.gantt.Store()) // true
                eventStore      : null,
                resourceStore   : null,
                assignmentStore : null,
                dependencyStore : null,
                calendarManagerStore : null
            }
        }

        static applyConfigs : boolean = true
    }

    return SchedulerBasicProjectMixin
}){}
