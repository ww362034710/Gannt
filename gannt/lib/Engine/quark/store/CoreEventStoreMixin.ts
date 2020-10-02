import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/BetterMixin.js"
import { SchedulerCoreProjectMixin } from "../model/scheduler_core/SchedulerCoreProjectMixin.js"
import { SchedulerCoreEvent } from "../model/scheduler_core/SchedulerCoreEvent.js"
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js"
import { AbstractEventStoreMixin } from "./AbstractEventStoreMixin.js"
import { CoreAssignmentMixin } from "../model/scheduler_core/CoreAssignmentMixin.js"


/**
 * A store mixin class, that represent collection of all events in the [[SchedulerCoreProjectMixin|project]].
 */
export class CoreEventStoreMixin extends Mixin(
    [ AbstractEventStoreMixin, CorePartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractEventStoreMixin & CorePartOfProjectStoreMixin, typeof AbstractEventStoreMixin & typeof CorePartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class CoreEventStoreMixin extends base {

            project             : SchedulerCoreProjectMixin

            modelClass          : this[ 'project' ][ 'eventModelClass' ]


            static get defaultConfig () : object {
                return {
                    modelClass  : SchedulerCoreEvent
                }
            }


            joinProject (project : this["project"]) {
                const { assignmentStore } = this

                // EventStore joining will likely resolve some assignments events, make sure indices are up to date
                const unresolved = assignmentStore?.storage.findItem('event', null) as Set<CoreAssignmentMixin>
                if (unresolved) {
                    assignmentStore.isBatchAssigning = true

                    for (const assignment of unresolved) {
                        const event = this.getById(assignment.getCurrentOrProposed('event'))
                        if (event) assignment.setChanged('event', event)
                    }

                    assignmentStore.isBatchAssigning = false

                    project.assignmentStore.updateIndices()
                }
            }


            set data (value) {
                super.data = value

                this.afterEventRemoval()
            }

        }

        return CoreEventStoreMixin
    }){}


// /**
//  * The tree store version of [[EventStoreMixin]].
//  */
// export class EventTreeStoreMixin extends Mixin(
//     [ EventStoreMixin ],
//     (base : AnyConstructor<EventStoreMixin, typeof EventStoreMixin>) => {
//
//     const superProto : InstanceType<typeof base> = base.prototype
//
//
//         class EventTreeStoreMixin extends base {
//             rootNode            : SchedulerBasicProjectMixin
//
//             buildRootNode () : object {
//                 return this.getProject() || {}
//             }
//
//
//             static get defaultConfig () : object {
//                 return {
//                     tree        : true
//                 }
//             }
//         }
//
//         return EventTreeStoreMixin
//     }){}
//
