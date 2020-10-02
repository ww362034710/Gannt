import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js"
import { AbstractProjectMixin } from "../../model/AbstractProjectMixin.js"
import Store from "../../../../Core/data/Store.js"


/**
 * This an abstract mixin for every Store, that belongs to a project.
 *
 * The store with this mixin, supposes, that it will be "joining" the project, a reference to which is saved
 * and made available for all models.
 */
export class AbstractPartOfProjectStoreMixin extends Mixin(
    [AbstractPartOfProjectGenericMixin, Store],
    (base : AnyConstructor<AbstractPartOfProjectGenericMixin & Store, typeof AbstractPartOfProjectGenericMixin & typeof Store>) => {

    const superProto : InstanceType<typeof base> = base.prototype


        class PartOfProjectStoreMixin extends base {


            isLoadingData : boolean = false


            calculateProject () : AbstractProjectMixin {
                // project is supposed to be provided for stores from outside
                return this.project
            }


            loadData (data : any) {
                this.isLoadingData = true

                superProto.loadData.call(this, data)

                this.isLoadingData = false

                this.project?.trigger('storeRefresh', { store : this })
            }

            // Override to postpone auto commits to after project commit, makes sure records are unmodified after commit
            async doAutoCommit () {
                // TODO: Ask nick about this, I could not get mixin order correct for this to work
                // @ts-ignore
                await this.project.commitAsync()

                superProto.doAutoCommit.call(this)
            }


        }

        return PartOfProjectStoreMixin

    }){}

