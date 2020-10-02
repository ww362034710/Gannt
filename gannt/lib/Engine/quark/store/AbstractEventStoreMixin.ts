import { AnyConstructor, Mixin } from "../../../ChronoGraph/class/Mixin.js"
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js"
import { AbstractProjectMixin } from '../model/AbstractProjectMixin.js'
import { AbstractDependencyStoreMixin } from './AbstractDependencyStoreMixin.js'
import { AbstractAssignmentStoreMixin } from './AbstractAssignmentStoreMixin.js'

// Shared functionality for CoreEventStore & ChronoEventStore
export class AbstractEventStoreMixin extends Mixin(
    [ AbstractPartOfProjectStoreMixin ],
    (base : AnyConstructor<AbstractPartOfProjectStoreMixin, typeof AbstractPartOfProjectStoreMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class AbstractEventStoreMixin extends base {
                project             : AbstractProjectMixin

                modelClass          : this[ 'project' ][ 'eventModelClass' ]

                assignmentsForRemoval   : Set<InstanceType<this[ 'project' ][ 'assignmentModelClass' ]>>    = new Set()

                dependenciesForRemoval  : Set<InstanceType<this[ 'project' ][ 'dependencyModelClass' ]>>    = new Set()


                remove (
                    records : InstanceType<this[ 'modelClass' ]> | InstanceType<this[ 'modelClass' ]>[] | Set<InstanceType<this[ 'modelClass' ]>>, silent? : boolean
                ) : InstanceType<this[ 'modelClass' ]>[]
                {
                        const res   = superProto.remove.call(this, records)

                        this.afterEventRemoval()

                        return res
                }


                afterEventRemoval () {
                        // can be called from `set data` during construction
                        if (!this.assignmentsForRemoval) return

                        const assignmentStore   = this.getAssignmentStore() as AbstractAssignmentStoreMixin

                        if (assignmentStore && !assignmentStore.allAssignmentsForRemoval) {
                                const assignmentsForRemoval = [...this.assignmentsForRemoval].filter(assignment => !assignmentStore.assignmentsForRemoval.has(assignment))

                                assignmentsForRemoval.length > 0 && assignmentStore.remove(assignmentsForRemoval)
                        }

                        this.assignmentsForRemoval.clear()

                        //---------------------------
                        const dependencyStore   = this.getDependencyStore() as AbstractDependencyStoreMixin

                        if (dependencyStore && !dependencyStore.allDependenciesForRemoval) {
                                const dependenciesForRemoval = [...this.dependenciesForRemoval].filter(dependency => !dependencyStore.dependenciesForRemoval.has(dependency))

                                dependenciesForRemoval.length > 0 && dependencyStore.remove(dependenciesForRemoval)
                        }

                        this.dependenciesForRemoval.clear()
                }


                removeAll (silent? : boolean) : boolean {
                        const res   = superProto.removeAll.call(this, silent)

                        this.afterEventRemoval()

                        return res
                }


                processRecord (eventRecord : InstanceType<this[ 'modelClass' ]>, isDataset : boolean = false) {
                        const existingRecord        = this.getById(eventRecord.id)
                        const isReplacing           = existingRecord && existingRecord !== eventRecord

                        if (isReplacing) {
                                // TODO: Type
                                //@ts-ignore
                                for (const assignment of existingRecord.assigned) {
                                        assignment.event    = eventRecord
                                }
                        }

                        return eventRecord
                }

        }

        return AbstractEventStoreMixin
}){}
