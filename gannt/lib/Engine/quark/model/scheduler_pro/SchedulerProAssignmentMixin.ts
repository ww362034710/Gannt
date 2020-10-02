import { AnyConstructor, Mixin } from '../../../../ChronoGraph/class/BetterMixin.js'
import { model_field } from '../../../chrono/ModelFieldAtom.js'
import { BaseAssignmentMixin } from '../scheduler_basic/BaseAssignmentMixin.js'
import { CommitResult } from '../../../../ChronoGraph/chrono/Graph.js'


export class SchedulerProAssignmentMixin extends Mixin(
    [ BaseAssignmentMixin ],
    (base : AnyConstructor<BaseAssignmentMixin, typeof BaseAssignmentMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class SchedulerProAssignmentMixin extends base {

        /**
         * The numeric, percent-like value in the [ 0, 100 ] range, indicating what is the "contribution level"
         * of the resource to the event. Number 100, for example, means that for 8h event,
         * resource contributes 8h of working time. Number 50 means, for the same event, resource contributes
         * only 4h, etc.
         */
        @model_field({ type : 'number', defaultValue : 100 })
        units               : number

        /**
         * Generated getter for the [[units]] field
         */
        getUnits : () => Number

        /**
         * Generated setter for the [[units]] field
         */
        setUnits : (units : number) => Promise<CommitResult>
    }

    return SchedulerProAssignmentMixin
}){}
