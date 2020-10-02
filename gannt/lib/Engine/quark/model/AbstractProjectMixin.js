import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import Delayable from "../../../Core/mixin/Delayable.js";
import Events from "../../../Core/mixin/Events.js";
import Model from "../../../Core/data/Model.js";
export class EventsWrapper extends Mixin([], Events) {
}
export class DelayableWrapper extends Mixin([], Delayable) {
}
export class AbstractProjectMixin extends Mixin([
    EventsWrapper,
    DelayableWrapper,
    Model
], (base) => {
    const superProto = base.prototype;
    class AbstractProjectMixin extends base {
        constructor() {
            super(...arguments);
            this.isInitialCommitPerformed = false;
        }
        async commitAsync() {
            throw new Error("Abstract method called");
        }
    }
    return AbstractProjectMixin;
}) {
}
