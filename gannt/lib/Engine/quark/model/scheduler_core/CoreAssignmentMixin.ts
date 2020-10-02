import { Mixin, AnyConstructor } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js"
import { SchedulerCoreProjectMixin } from "./SchedulerCoreProjectMixin.js"
import { CoreEventMixin } from "./CoreEventMixin.js"
import { CoreResourceMixin } from "./CoreResourceMixin.js"


/**
 * Core assignment model class. It just contains references to the [[CoreEventMixin|event]] and [[CoreResourceMixin|resource]] being assigned.
 */
export class CoreAssignmentMixin extends Mixin(
    [ CorePartOfProjectModelMixin ],
    (base : AnyConstructor<CorePartOfProjectModelMixin, typeof CorePartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class CoreAssignmentMixin extends base {

            project             : SchedulerCoreProjectMixin


            // Fields declared in the Model way, existing decorators all assume ChronoGraph is used
            static get fields () {
                return [
                    // isEqual required to properly detect changed resource / event
                    { name : 'resource', isEqual: (a, b) => a === b, persist : false },
                    { name : 'event', isEqual : (a, b) => a === b, persist : false }
                ]
            }


            // Resolve early + update indices to have buckets ready before commit
            setChanged (field : string, value : any, invalidate? : boolean) {
                const { assignmentStore, eventStore, resourceStore, project } = this

                let update = false

                if (field === 'event') {
                    const event = value instanceof CoreEventMixin ? value : eventStore?.getById(value)

                    if (event) update = true

                    value = event || value
                }

                if (field === 'resource') {
                    const resource = value instanceof CoreResourceMixin ? value : resourceStore?.getById(value)

                    if (resource) update = true

                    value = resource || value
                }

                // Passing true as last arg, bucket expected to work before commit
                superProto.setChanged.call(this, field, value, invalidate, true)

                // Update on resolve, if this is a single operation and record is part of project (might be standalone record)
                if (assignmentStore && update && !project.isPerformingCommit && !assignmentStore.isLoadingData && !assignmentStore.isBatchAssigning) {
                    assignmentStore.updateIndices()
                }
            }


            // Resolve event and resource when joining project
            joinProject () {
                superProto.joinProject.call(this)

                this.setChanged('event', this.get('event'))
                this.setChanged('resource', this.get('resource'))
            }


            // Resolved resource & event as part of commit
            // Normally done earlier in setChanged, but stores might not have been available yet at that point
            calculateInvalidated () {
                // Changed values, should be used instead of current where available
                let { event = this.event, resource = this.resource } = this.$changed

                if (event !== null && !(event instanceof CoreEventMixin)) {
                    const resolved = this.eventStore?.getById(event)
                    if (resolved) this.setChanged('event', resolved, false)
                }

                if (resource !== null && !(resource instanceof CoreResourceMixin)) {
                    const resolved = this.resourceStore?.getById(resource)
                    if (resolved) this.setChanged('resource', resolved, false)
                }
            }


            //region Event


            set event (event : string | number | CoreEventMixin) {
                this.setChanged('event', event)
            }


            get event () {
                const event = this.get('event')
                // Engine returns null instead of id when unresolved
                return event instanceof CoreEventMixin ? event : null
            }


            //endregion


            //region Resource


            set resource (resource : string | number | CoreResourceMixin) {
                this.setChanged('resource', resource)
            }


            get resource () {
                const resource = this.get('resource')
                // Engine returns null instead of id when unresolved
                return resource instanceof CoreResourceMixin ? resource : null
            }


            //endregion
        }

        return CoreAssignmentMixin
    }){}
