import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { ChronoModelMixin } from "../../../chrono/ChronoModelMixin.js";
import { ConflictResolutionResult } from "../../../chrono/Conflict.js";
import { AbstractProjectMixin } from "../AbstractProjectMixin.js";
export class ChronoAbstractProjectMixin extends Mixin([ChronoModelMixin, AbstractProjectMixin], (base) => {
    const superProto = base.prototype;
    class ChronoAbstractProjectMixin extends base {
        getGraph() {
            return this.replica;
        }
        async commitAsync() {
            return this.replica.commitAsync();
        }
        async onSchedulingConflict(conflict, transaction) {
            return ConflictResolutionResult.Cancel;
        }
    }
    return ChronoAbstractProjectMixin;
}) {
}
