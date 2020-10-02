import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js"
import { SchedulerCoreProjectMixin } from "../../model/scheduler_core/SchedulerCoreProjectMixin.js"
import Store from "../../../../Core/data/Store.js"
import { AbstractPartOfProjectStoreMixin } from "./AbstractPartOfProjectStoreMixin.js"


/**
 * This a mixin for every Store, that belongs to a scheduler_core project.
 */
export class CorePartOfProjectStoreMixin extends Mixin(
    [
        AbstractPartOfProjectStoreMixin,
        CorePartOfProjectGenericMixin,
        Store
    ],
    (base : AnyConstructor<
        AbstractPartOfProjectStoreMixin &
        CorePartOfProjectGenericMixin &
        Store
        ,
        typeof AbstractPartOfProjectStoreMixin &
        typeof CorePartOfProjectGenericMixin &
        typeof Store
>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CorePartOfProjectStoreMixin extends base {


        isLoadingData : boolean = false


        calculateProject () : SchedulerCoreProjectMixin {
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
            await this.project.commitAsync()

            superProto.doAutoCommit.call(this)
        }


        setProject (project : this["project"]) : this["project"] {
            const result = superProto.setProject.call(this, project)

            if (project) this.joinProject(project)

            return result
        }


        joinProject (project : this["project"]) {}


        onCommitAsync () {}
    }

    return CorePartOfProjectStoreMixin

}){}

