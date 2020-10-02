import { Mixin } from "../../../ChronoGraph/class/Mixin.js";
import { AbstractPartOfProjectStoreMixin } from "./mixin/AbstractPartOfProjectStoreMixin.js";
export class AbstractEventStoreMixin extends Mixin([AbstractPartOfProjectStoreMixin], (base) => {
    const superProto = base.prototype;
    class AbstractEventStoreMixin extends base {
        constructor() {
            super(...arguments);
            this.assignmentsForRemoval = new Set();
            this.dependenciesForRemoval = new Set();
        }
        remove(records, silent) {
            const res = superProto.remove.call(this, records);
            this.afterEventRemoval();
            return res;
        }
        afterEventRemoval() {
            if (!this.assignmentsForRemoval)
                return;
            const assignmentStore = this.getAssignmentStore();
            if (assignmentStore && !assignmentStore.allAssignmentsForRemoval) {
                const assignmentsForRemoval = [...this.assignmentsForRemoval].filter(assignment => !assignmentStore.assignmentsForRemoval.has(assignment));
                assignmentsForRemoval.length > 0 && assignmentStore.remove(assignmentsForRemoval);
            }
            this.assignmentsForRemoval.clear();
            const dependencyStore = this.getDependencyStore();
            if (dependencyStore && !dependencyStore.allDependenciesForRemoval) {
                const dependenciesForRemoval = [...this.dependenciesForRemoval].filter(dependency => !dependencyStore.dependenciesForRemoval.has(dependency));
                dependenciesForRemoval.length > 0 && dependencyStore.remove(dependenciesForRemoval);
            }
            this.dependenciesForRemoval.clear();
        }
        removeAll(silent) {
            const res = superProto.removeAll.call(this, silent);
            this.afterEventRemoval();
            return res;
        }
        processRecord(eventRecord, isDataset = false) {
            const existingRecord = this.getById(eventRecord.id);
            const isReplacing = existingRecord && existingRecord !== eventRecord;
            if (isReplacing) {
                for (const assignment of existingRecord.assigned) {
                    assignment.event = eventRecord;
                }
            }
            return eventRecord;
        }
    }
    return AbstractEventStoreMixin;
}) {
}
