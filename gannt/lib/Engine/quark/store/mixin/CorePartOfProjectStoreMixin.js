import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectGenericMixin } from "../../CorePartOfProjectGenericMixin.js";
import Store from "../../../../Core/data/Store.js";
import { AbstractPartOfProjectStoreMixin } from "./AbstractPartOfProjectStoreMixin.js";
export class CorePartOfProjectStoreMixin extends Mixin([
    AbstractPartOfProjectStoreMixin,
    CorePartOfProjectGenericMixin,
    Store
], (base) => {
    const superProto = base.prototype;
    class CorePartOfProjectStoreMixin extends base {
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
        setProject(project) {
            const result = superProto.setProject.call(this, project);
            if (project)
                this.joinProject(project);
            return result;
        }
        joinProject(project) { }
        onCommitAsync() { }
    }
    return CorePartOfProjectStoreMixin;
}) {
}
