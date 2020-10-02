import { ProposedOrPrevious } from "../../../../ChronoGraph/chrono/Effect.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CI } from "../../../../ChronoGraph/collection/Iterator.js"
import { CalculationIterator } from "../../../../ChronoGraph/primitives/Calculation.js"
import { model_field } from "../../../chrono/ModelFieldAtom.js"
import { DependenciesCalendar, DependencyType, Direction, ProjectType } from "../../../scheduling/Types.js"
import { ChronoDependencyStoreMixin } from "../../store/ChronoDependencyStoreMixin.js"
import { ChronoEventStoreMixin } from "../../store/ChronoEventStoreMixin.js"
import { HasDependenciesMixin } from "../scheduler_basic/HasDependenciesMixin.js"
import { SchedulerBasicProjectMixin } from "../scheduler_basic/SchedulerBasicProjectMixin.js"
import { ConstrainedEarlyEventMixin } from "./ConstrainedEarlyEventMixin.js"
import { SchedulerProDependencyMixin } from "./SchedulerProDependencyMixin.js"
import { SchedulerProEvent } from "./SchedulerProEvent.js"
import { SchedulerProAssignmentMixin } from "./SchedulerProAssignmentMixin.js"
import { SchedulerProResourceMixin } from "./SchedulerProResourceMixin.js"


//---------------------------------------------------------------------------------------------------------------------
/**
 * Scheduler Pro project mixin type. At this level, events are scheduled according to the incoming dependencies
 * and calendars of the assigned resources.
 *
 * The base event class for this level is [[SchedulerProEvent]]. The base dependency class is [[SchedulerProDependencyMixin]]
 */
export class SchedulerProProjectMixin extends Mixin(
    [ SchedulerBasicProjectMixin, ConstrainedEarlyEventMixin ],
    (base : AnyConstructor<SchedulerBasicProjectMixin & ConstrainedEarlyEventMixin, typeof SchedulerBasicProjectMixin & typeof ConstrainedEarlyEventMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class SchedulerProProjectMixin extends base {

        eventModelClass             : typeof SchedulerProEvent
        dependencyModelClass        : typeof SchedulerProDependencyMixin
        assignmentModelClass        : typeof SchedulerProAssignmentMixin
        resourceModelClass          : typeof SchedulerProResourceMixin

        eventStore                  : ChronoEventStoreMixin & { project : { eventModelClass : typeof SchedulerProEvent } }
        dependencyStore             : ChronoDependencyStoreMixin & { project : { dependencyModelClass : typeof SchedulerProDependencyMixin } }

        /**
         * The source of the calendar for dependencies.
         */
        @model_field({ type : 'string', defaultValue : DependenciesCalendar.ToEvent })
        dependenciesCalendar      : DependenciesCalendar


        /**
         * Whether the auto percent done calculation for parent events should be enabled.
         */
        @model_field({ type : 'boolean', defaultValue : true })
        autoCalculatePercentDoneForParentTasks      : boolean


        * calculateDirection () : CalculationIterator<Direction> {
            return yield ProposedOrPrevious
        }


        getType () : ProjectType {
            return ProjectType.SchedulerPro
        }


        getDefaultEventModelClass () : this[ 'eventModelClass' ] {
            return SchedulerProEvent
        }


        getDefaultDependencyModelClass () : this[ 'dependencyModelClass' ] {
            return SchedulerProDependencyMixin
        }


        getDefaultAssignmentModelClass () : this[ 'assignmentModelClass' ] {
            return SchedulerProAssignmentMixin
        }


        getDefaultResourceModelClass () : this[ 'resourceModelClass' ] {
            return SchedulerProResourceMixin
        }


        // this does not account for possible scheduling conflicts
        async isValidDependency (fromEvent : HasDependenciesMixin, toEvent : HasDependenciesMixin, type : DependencyType) : Promise<boolean> {
            const alreadyLinked = CI(fromEvent.outgoingDeps).some(dependency => dependency.toEvent === toEvent)

            if (alreadyLinked) return false

            return this.isDependencyCyclic(fromEvent, toEvent, type)
        }


        async isDependencyCyclic (fromEvent : HasDependenciesMixin, toEvent : HasDependenciesMixin, type : DependencyType) : Promise<boolean> {
            const dependencyClass   = this.getDependencyStore().modelClass

            const dependency        = new dependencyClass({ fromEvent, toEvent, type })

            const branch            = this.replica.branch({ autoCommit : false })

            branch.addEntity(dependency)

            try {
                await branch.readAsync(fromEvent.$.startDate)

                return true
            } catch (e) {
                // return false for the cycle exception and re-throw all others
                if (/cycle/i.test(e)) return false

                throw e
            }
        }

        // work in progress
        // This method validates changes (e.g. type) for existing dependencies (which are already in the store)
        async isValidExistingDependency (existingDependency : SchedulerProDependencyMixin) {
            const dependencyClass   = this.getDependencyStore().modelClass

            const dependency        = new dependencyClass({
                fromEvent : existingDependency.fromEvent,
                toEvent   : existingDependency.toEvent,
                type      : existingDependency.type
            })

            await this.replica.commitAsync()

            const branch            = this.replica.branch({ autoCommit : false })

            branch.removeEntity(existingDependency)

            branch.addEntity(dependency)

            try {
                // we don't do a full commit, but instead calculate a single identifier - that
                // saves a lot of unnecessary computations
                // we can do that since we only need to know if there's a cycle or not
                // and if there's a cycle it will go through the `startDate` of predecessor
                await branch.readAsync(dependency.fromEvent.$.startDate)

                return true
            } catch (e) {
                // return false for the cycle exception and re-throw all others
                if (/cycle/i.test(e)) return false

                throw e
            }
        }

    }

    return SchedulerProProjectMixin
}){}
