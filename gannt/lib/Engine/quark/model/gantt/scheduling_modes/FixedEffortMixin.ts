import { HasProposedValue } from "../../../../../ChronoGraph/chrono/Effect.js"
import { SyncEffectHandler } from "../../../../../ChronoGraph/chrono/Transaction.js"
import { AnyConstructor, Mixin } from "../../../../../ChronoGraph/class/BetterMixin.js"
import { CycleResolution } from "../../../../../ChronoGraph/cycle_resolver/CycleResolver.js"
import { CalculationIterator } from "../../../../../ChronoGraph/primitives/Calculation.js"
import { Direction, SchedulingMode } from "../../../../scheduling/Types.js"
import { SEDDispatcher } from "../../scheduler_basic/BaseEventDispatcher.js"
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js"
import { HasSchedulingMode } from "../HasSchedulingMode.js"
import { fixedEffortSEDWUBackward, fixedEffortSEDWUForward } from "./FixedEffortDispatcher.js"


//---------------------------------------------------------------------------------------------------------------------
/**
 * This mixin provides the fixed effort scheduling mode facility. The scheduling mode is controlled with the
 * [[HasSchedulingMode.schedulingMode]] field.
 *
 * See [[HasSchedulingMode]] for more details.
 *
 * In this mode, the effort of the task remains "fixed" as the name suggest. It is changed only if there's no other options,
 * for example if both "duration" and "units" has changed. In other cases, some other variable is updated.
 */
export class FixedEffortMixin extends Mixin(
    [ HasSchedulingMode ],
    (base : AnyConstructor<HasSchedulingMode, typeof HasSchedulingMode>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class FixedEffortMixin extends base {

        * prepareDispatcher (YIELD : SyncEffectHandler) : CalculationIterator<SEDDispatcher> {
            const schedulingMode    = yield this.$.schedulingMode

            if (schedulingMode === SchedulingMode.FixedEffort) {
                const cycleDispatcher               = yield* superProto.prepareDispatcher.call(this, YIELD)

                if (yield HasProposedValue(this.$.assigned)) cycleDispatcher.addProposedValueFlag(UnitsVar)

                cycleDispatcher.addKeepIfPossibleFlag(EffortVar)

                return cycleDispatcher
            }
            else {
                return yield* superProto.prepareDispatcher.call(this, YIELD)
            }
        }


        cycleResolutionContext (Y) : CycleResolution {
            const schedulingMode    = Y(this.$.schedulingMode)

            if (schedulingMode === SchedulingMode.FixedEffort) {
                const direction : Direction         = Y(this.$.direction)

                return direction === Direction.Forward || direction === Direction.None ? fixedEffortSEDWUForward : fixedEffortSEDWUBackward
            }
            else {
                return superProto.cycleResolutionContext.call(this, Y)
            }

        }
    }

    return FixedEffortMixin
}){}
