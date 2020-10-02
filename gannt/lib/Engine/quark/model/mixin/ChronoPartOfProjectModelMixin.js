import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { ChronoModelMixin } from "../../../chrono/ChronoModelMixin.js";
import { ChronoPartOfProjectGenericMixin } from "../../ChronoPartOfProjectGenericMixin.js";
import { ChronoPartOfProjectStoreMixin } from "../../store/mixin/ChronoPartOfProjectStoreMixin.js";
import { AbstractPartOfProjectModelMixin } from "./AbstractPartOfProjectModelMixin.js";
export class ChronoPartOfProjectModelMixin extends Mixin([
    AbstractPartOfProjectModelMixin,
    ChronoPartOfProjectGenericMixin,
    ChronoModelMixin
], (base) => {
    const superProto = base.prototype;
    class ChronoPartOfProjectModelMixin extends base {
        joinProject() {
            this.getGraph().addEntity(this);
        }
        leaveProject(isReplacing = false) {
            superProto.leaveProject.call(this, isReplacing);
            const replica = this.getGraph();
            replica.removeEntity(this);
        }
        getProject() {
            return superProto.getProject.call(this);
        }
        calculateProject() {
            const store = this.stores.find(s => (s instanceof ChronoPartOfProjectStoreMixin) && !!s.getProject());
            return store === null || store === void 0 ? void 0 : store.getProject();
        }
    }
    return ChronoPartOfProjectModelMixin;
}) {
}
