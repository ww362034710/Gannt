import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js";
import { CoreEventMixin } from "./CoreEventMixin.js";
import { CoreResourceMixin } from "./CoreResourceMixin.js";
export class CoreAssignmentMixin extends Mixin([CorePartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class CoreAssignmentMixin extends base {
        static get fields() {
            return [
                { name: 'resource', isEqual: (a, b) => a === b, persist: false },
                { name: 'event', isEqual: (a, b) => a === b, persist: false }
            ];
        }
        setChanged(field, value, invalidate) {
            const { assignmentStore, eventStore, resourceStore, project } = this;
            let update = false;
            if (field === 'event') {
                const event = value instanceof CoreEventMixin ? value : eventStore === null || eventStore === void 0 ? void 0 : eventStore.getById(value);
                if (event)
                    update = true;
                value = event || value;
            }
            if (field === 'resource') {
                const resource = value instanceof CoreResourceMixin ? value : resourceStore === null || resourceStore === void 0 ? void 0 : resourceStore.getById(value);
                if (resource)
                    update = true;
                value = resource || value;
            }
            superProto.setChanged.call(this, field, value, invalidate, true);
            if (assignmentStore && update && !project.isPerformingCommit && !assignmentStore.isLoadingData && !assignmentStore.isBatchAssigning) {
                assignmentStore.updateIndices();
            }
        }
        joinProject() {
            superProto.joinProject.call(this);
            this.setChanged('event', this.get('event'));
            this.setChanged('resource', this.get('resource'));
        }
        calculateInvalidated() {
            var _a, _b;
            let { event = this.event, resource = this.resource } = this.$changed;
            if (event !== null && !(event instanceof CoreEventMixin)) {
                const resolved = (_a = this.eventStore) === null || _a === void 0 ? void 0 : _a.getById(event);
                if (resolved)
                    this.setChanged('event', resolved, false);
            }
            if (resource !== null && !(resource instanceof CoreResourceMixin)) {
                const resolved = (_b = this.resourceStore) === null || _b === void 0 ? void 0 : _b.getById(resource);
                if (resolved)
                    this.setChanged('resource', resolved, false);
            }
        }
        set event(event) {
            this.setChanged('event', event);
        }
        get event() {
            const event = this.get('event');
            return event instanceof CoreEventMixin ? event : null;
        }
        set resource(resource) {
            this.setChanged('resource', resource);
        }
        get resource() {
            const resource = this.get('resource');
            return resource instanceof CoreResourceMixin ? resource : null;
        }
    }
    return CoreAssignmentMixin;
}) {
}
