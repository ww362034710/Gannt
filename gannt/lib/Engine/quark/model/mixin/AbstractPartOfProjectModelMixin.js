import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { AbstractPartOfProjectStoreMixin } from "../../store/mixin/AbstractPartOfProjectStoreMixin.js";
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js";
import Model from "../../../../Core/data/Model.js";
export class AbstractPartOfProjectModelMixin extends Mixin([AbstractPartOfProjectGenericMixin, Model], (base) => {
    const superProto = base.prototype;
    class PartOfProjectModelMixin extends base {
        joinStore(store) {
            let joinedProject = false;
            if (store instanceof AbstractPartOfProjectStoreMixin) {
                const project = store.getProject();
                if (project && !this.getProject()) {
                    this.setProject(project);
                    joinedProject = true;
                }
            }
            superProto.joinStore.call(this, store);
            if (joinedProject)
                this.joinProject();
        }
        unJoinStore(store, isReplacing = false) {
            superProto.unJoinStore.call(this, store, isReplacing);
            const project = this.getProject();
            if (project && !project.isDestroying && (store instanceof AbstractPartOfProjectStoreMixin) && project === store.getProject()) {
                this.leaveProject(isReplacing);
                this.setProject(null);
            }
        }
        joinProject() { }
        leaveProject(isReplacing = false) { }
        calculateProject() {
            const store = this.stores.find(s => (s instanceof AbstractPartOfProjectStoreMixin) && !!s.getProject());
            return store === null || store === void 0 ? void 0 : store.getProject();
        }
    }
    return PartOfProjectModelMixin;
}) {
}
