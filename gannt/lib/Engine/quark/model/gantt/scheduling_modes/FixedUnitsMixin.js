import { HasProposedValue } from "../../../../../ChronoGraph/chrono/Effect.js";
import { Mixin } from "../../../../../ChronoGraph/class/BetterMixin.js";
import { Direction, SchedulingMode } from "../../../../scheduling/Types.js";
import { EffortVar, UnitsVar } from "../HasEffortDispatcher.js";
import { HasSchedulingMode } from "../HasSchedulingMode.js";
import { fixedUnitsSEDWUBackwardEffortDriven, fixedUnitsSEDWUBackwardNonEffortDriven, fixedUnitsSEDWUForwardEffortDriven, fixedUnitsSEDWUForwardNonEffortDriven } from "./FixedUnitsDispatcher.js";
export class FixedUnitsMixin extends Mixin([HasSchedulingMode], (base) => {
    const superProto = base.prototype;
    class FixedUnitsMixin extends base {
        *prepareDispatcher(YIELD) {
            const schedulingMode = yield this.$.schedulingMode;
            if (schedulingMode === SchedulingMode.FixedUnits) {
                const cycleDispatcher = yield* superProto.prepareDispatcher.call(this, YIELD);
                if (yield HasProposedValue(this.$.assigned))
                    cycleDispatcher.addProposedValueFlag(UnitsVar);
                if (yield this.$.effortDriven)
                    cycleDispatcher.addKeepIfPossibleFlag(EffortVar);
                cycleDispatcher.addKeepIfPossibleFlag(UnitsVar);
                return cycleDispatcher;
            }
            else {
                return yield* superProto.prepareDispatcher.call(this, YIELD);
            }
        }
        cycleResolutionContext(Y) {
            const schedulingMode = Y(this.$.schedulingMode);
            if (schedulingMode === SchedulingMode.FixedUnits) {
                const direction = Y(this.$.direction);
                const effortDriven = Y(this.$.effortDriven);
                if (direction === Direction.Forward || direction === Direction.None) {
                    return effortDriven ? fixedUnitsSEDWUForwardEffortDriven : fixedUnitsSEDWUForwardNonEffortDriven;
                }
                else {
                    return effortDriven ? fixedUnitsSEDWUBackwardEffortDriven : fixedUnitsSEDWUBackwardNonEffortDriven;
                }
            }
            else {
                return superProto.cycleResolutionContext.call(this, Y);
            }
        }
    }
    return FixedUnitsMixin;
}) {
}
