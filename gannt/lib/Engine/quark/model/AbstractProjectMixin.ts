import { CommitResult } from "../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import Delayable, { DelayableMixin } from "../../../Core/mixin/Delayable.js"
import Events, { EventsMixin } from "../../../Core/mixin/Events.js"
import Model from "../../../Core/data/Model.js"
import Store from "../../../Core/data/Store.js"
import { AbstractCalendarMixin } from "./AbstractCalendarMixin.js"

export class EventsWrapper extends Mixin(
    [],
    Events as ((base : AnyConstructor) => AnyConstructor<EventsMixin>)
){}

export class DelayableWrapper extends Mixin(
    [],
    Delayable as ((base : AnyConstructor) => AnyConstructor<DelayableMixin>)
){}


/**
 * This is an abstract project, which just lists the available stores.
 *
 * The actual project classes are [[SchedulerCoreProjectMixin]], [[SchedulerBasicProjectMixin]],
 * [[SchedulerProProjectMixin]], [[GanttProjectMixin]].
 */
export class AbstractProjectMixin extends Mixin(
    [
        EventsWrapper,
        DelayableWrapper,
        Model
    ],
    (base : AnyConstructor<
        EventsWrapper &
        DelayableWrapper &
        Model
        ,
        typeof EventsWrapper &
        typeof DelayableWrapper &
        typeof Model
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class AbstractProjectMixin extends base {

        eventModelClass           : typeof Model

        dependencyModelClass      : typeof Model

        resourceModelClass        : typeof Model

        assignmentModelClass      : typeof Model

        calendarModelClass        : typeof Model

        eventStoreClass           : typeof Store

        dependencyStoreClass      : typeof Store

        resourceStoreClass        : typeof Store

        assignmentStoreClass      : typeof Store

        calendarManagerStoreClass : typeof Store

        eventStore                : Store

        dependencyStore           : Store

        resourceStore             : Store

        assignmentStore           : Store

        calendarManagerStore      : Store

        defaultCalendar           : AbstractCalendarMixin

        isInitialCommitPerformed  : boolean = false


        async commitAsync () : Promise<CommitResult> {
            throw new Error("Abstract method called")
        }
    }

    return AbstractProjectMixin
}){}
