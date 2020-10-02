import { Mixin } from "../../../ChronoGraph/class/BetterMixin.js";
import { SchedulerCoreEvent } from "../model/scheduler_core/SchedulerCoreEvent.js";
import { CorePartOfProjectStoreMixin } from "./mixin/CorePartOfProjectStoreMixin.js";
import { AbstractEventStoreMixin } from "./AbstractEventStoreMixin.js";
export class CoreEventStoreMixin extends Mixin([AbstractEventStoreMixin, CorePartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class CoreEventStoreMixin extends base {
        static get defaultConfig() {
            return {
                modelClass: SchedulerCoreEvent
            };
        }
        joinProject(project) {
            const { assignmentStore } = this;
            const unresolved = assignmentStore === null || assignmentStore === void 0 ? void 0 : assignmentStore.storage.findItem('event', null);
            if (unresolved) {
                assignmentStore.isBatchAssigning = true;
                for (const assignment of unresolved) {
                    const event = this.getById(assignment.getCurrentOrProposed('event'));
                    if (event)
                        assignment.setChanged('event', event);
                }
                assignmentStore.isBatchAssigning = false;
                project.assignmentStore.updateIndices();
            }
        }
        set data(value) {
            super.data = value;
            this.afterEventRemoval();
        }
    }
    return CoreEventStoreMixin;
}) {
}
