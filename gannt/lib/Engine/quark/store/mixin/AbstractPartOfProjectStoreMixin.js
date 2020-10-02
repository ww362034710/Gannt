import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { AbstractPartOfProjectGenericMixin } from "../../AbstractPartOfProjectGenericMixin.js";
import Store from "../../../../Core/data/Store.js";
export class AbstractPartOfProjectStoreMixin extends Mixin([AbstractPartOfProjectGenericMixin, Store], (base) => {
    const superProto = base.prototype;
    class PartOfProjectStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.isLoadingData = false;
        }
        calculateProject() {
            return this.project;
        }
        loadData(data) {
            var _a;
            this.isLoadingData = true;
            superProto.loadData.call(this, data);
            this.isLoadingData = false;
            (_a = this.project) === null || _a === void 0 ? void 0 : _a.trigger('storeRefresh', { store: this });
        }
        async doAutoCommit() {
            await this.project.commitAsync();
            superProto.doAutoCommit.call(this);
        }
    }
    return PartOfProjectStoreMixin;
}) {
}
