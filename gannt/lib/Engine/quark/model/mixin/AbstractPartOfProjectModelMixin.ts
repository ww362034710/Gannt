import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { AbstractPartOfProjectStoreMixin } from "../../store/mixin/AbstractPartOfProjectStoreMixin.js"
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js"
import Model from "../../../../Core/data/Model.js"


/**
 * This an abstract mixin for every Model that belongs to a project.
 *
 * The model with this mixin, supposes that it will be "joining" a store that is already part of a project,
 * so that such model can take a reference to the project from it.
 *
 * It provides 2 template methods [[joinProject]] and [[leaveProject]], which can be overridden in other mixins.
 */
export class AbstractPartOfProjectModelMixin extends Mixin(
    [AbstractPartOfProjectGenericMixin, Model ],
    (base : AnyConstructor<AbstractPartOfProjectGenericMixin & Model, typeof AbstractPartOfProjectGenericMixin & typeof Model>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class PartOfProjectModelMixin extends base {

            stores           : AbstractPartOfProjectStoreMixin[]


            joinStore (store : AbstractPartOfProjectStoreMixin) {
                let joinedProject   = false

                // Joining a store that is not part of project (for example a chained store) should not affect engine
                if (store instanceof AbstractPartOfProjectStoreMixin) {
                    const project = store.getProject()

                    if (project && !this.getProject()) {
                        this.setProject(project)
                        joinedProject   = true
                    }
                }

                superProto.joinStore.call(this, store)

                if (joinedProject) this.joinProject()
            }


            unJoinStore (store : AbstractPartOfProjectStoreMixin, isReplacing = false) {
                superProto.unJoinStore.call(this, store, isReplacing)

                const project = this.getProject()

                // Leave project when unjoining from store, but do not bother if the project is being destroyed
                if (project && !project.isDestroying && (store instanceof AbstractPartOfProjectStoreMixin) && project === store.getProject()) {
                    this.leaveProject(isReplacing)
                    this.setProject(null)
                }
            }


            /**
             * Template method, which is called when model is joining the project (through joining some store that
             * has already joined the project)
             */
            joinProject () {}


            /**
             * Template method, which is called when model is leaving the project (through leaving some store usually)
             */
            leaveProject (isReplacing : boolean = false) {}


            calculateProject () : this[ 'project' ] {
                const store = this.stores.find(s => (s instanceof AbstractPartOfProjectStoreMixin) && !!s.getProject())

                return store?.getProject()
            }

        }

        return PartOfProjectModelMixin
    }){}

