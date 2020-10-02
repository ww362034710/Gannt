import { HasProposedValue } from "../../../../../ChronoGraph/chrono/Effect.js";
import { Mixin } from "../../../../../ChronoGraph/class/BetterMixin.js";
import { Direction, SchedulingMode } from "../../../../scheduling/Types.js";
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js";
import { HasSchedulingMode } from "../HasSchedulingMode.js";
import { fixedEffortSEDWUBackward, fixedEffortSEDWUForward } from "./FixedEffortDispatcher.js";
export class FixedEffortMixin extends Mixin([HasSchedulingMode], (base) => {
    const superProto = base.prototype;
    class FixedEffortMixin extends base {
        *prepareDispatcher(YIELD) {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedEffort) {
                const cycleDispatcher = yield* superProto.prepareDispatcher.call(this, YIELD);
                if (yield HasProposedValue(this.$.assigned))
                    cycleDispatcher.addProposedValueFlag(UnitsVar);
                cycleDispatcher.addKeepIfPossibleFlag(EffortVar);
                return cycleDispatcher;
            }
            else {
                return yield* superProto.prepareDispatcher.call(this, YIELD);
            }
        }
        cycleResolutionContext(Y) {
            const schedulingMode = Y(this.$.schedulingMode);
            if (schedulingMode === SchedulingMode.FixedEffort) {
                const direction = Y(this.$.direction);
                return direction === Direction.Forward || direction === Direction.None ? fixedEffortSEDWUForward : fixedEffortSEDWUBackward;
            }
            else {
                return superProto.cycleResolutionContext.call(this, Y);
            }
        }
    }
    return FixedEffortMixin;
}) {
}
