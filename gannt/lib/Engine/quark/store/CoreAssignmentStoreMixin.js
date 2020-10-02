import { CoreAssignmentMixin } from "../model/scheduler_core/CoreAssignmentMixin.js";
import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { AbstractAssignmentStoreMixin } from "./AbstractAssignmentStoreMixin.js";
const emptySet = new Set();
export class CoreAssignmentStoreMixin extends Mixin([AbstractAssignmentStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreAssignmentStoreMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: CoreAssignmentMixin,
                storage: {
                    extraKeys: [
                        { property: 'event', unique: false },
                        { property: 'resource', unique: false }
                    ]
                }
            };
        }
        set data(value) {
            this.allAssignmentsForRemoval = true;
            super.data = value;
            this.allAssignmentsForRemoval = false;
        }
        getEventsAssignments(event) {
            return this.storage.findItem('event', event) || emptySet;
        }
        getResourcesAssignments(resource) {
            return this.storage.findItem('resource', resource) || emptySet;
        }
        updateIndices() {
            this.storage.rebuildIndices();
        }
        onCommitAsync() {
            this.updateIndices();
        }
    }
    return CoreAssignmentStoreMixin;
}) {
}
