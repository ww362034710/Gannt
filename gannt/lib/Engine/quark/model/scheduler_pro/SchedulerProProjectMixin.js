var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ProposedOrPrevious } from "../../../../ChronoGraph/chrono/Effect.js";
import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { CI } from "../../../../ChronoGraph/collection/Iterator.js";
import { model_field } from "../../../chrono/ModelFieldAtom.js";
import { DependenciesCalendar, ProjectType } from "../../../scheduling/Types.js";
import { SchedulerBasicProjectMixin } from "../scheduler_basic/SchedulerBasicProjectMixin.js";
import { ConstrainedEarlyEventMixin } from "./ConstrainedEarlyEventMixin.js";
import { SchedulerProDependencyMixin } from "./SchedulerProDependencyMixin.js";
import { SchedulerProEvent } from "./SchedulerProEvent.js";
import { SchedulerProAssignmentMixin } from "./SchedulerProAssignmentMixin.js";
import { SchedulerProResourceMixin } from "./SchedulerProResourceMixin.js";
export class SchedulerProProjectMixin extends Mixin([SchedulerBasicProjectMixin, ConstrainedEarlyEventMixin], (base) => {
    const superProto = base.prototype;
    class SchedulerProProjectMixin extends base {
        *calculateDirection() {
            return yield ProposedOrPrevious;
        }
        getType() {
            return ProjectType.SchedulerPro;
        }
        getDefaultEventModelClass() {
            return SchedulerProEvent;
        }
        getDefaultDependencyModelClass() {
            return SchedulerProDependencyMixin;
        }
        getDefaultAssignmentModelClass() {
            return SchedulerProAssignmentMixin;
        }
        getDefaultResourceModelClass() {
            return SchedulerProResourceMixin;
        }
        async isValidDependency(fromEvent, toEvent, type) {
            const alreadyLinked = CI(fromEvent.outgoingDeps).some(dependency => dependency.toEvent === toEvent);
            if (alreadyLinked)
                return false;
            return this.isDependencyCyclic(fromEvent, toEvent, type);
        }
        async isDependencyCyclic(fromEvent, toEvent, type) {
            const dependencyClass = this.getDependencyStore().modelClass;
            const dependency = new dependencyClass({ fromEvent, toEvent, type });
            const branch = this.replica.branch({ autoCommit: false });
            branch.addEntity(dependency);
            try {
                await branch.readAsync(fromEvent.$.startDate);
                return true;
            }
            catch (e) {
                if (/cycle/i.test(e))
                    return false;
                throw e;
            }
        }
        async isValidExistingDependency(existingDependency) {
            const dependencyClass = this.getDependencyStore().modelClass;
            const dependency = new dependencyClass({
                fromEvent: existingDependency.fromEvent,
                toEvent: existingDependency.toEvent,
                type: existingDependency.type
            });
            await this.replica.commitAsync();
            const branch = this.replica.branch({ autoCommit: false });
            branch.removeEntity(existingDependency);
            branch.addEntity(dependency);
            try {
                await branch.readAsync(dependency.fromEvent.$.startDate);
                return true;
            }
            catch (e) {
                if (/cycle/i.test(e))
                    return false;
                throw e;
            }
        }
    }
    __decorate([
        model_field({ type: 'string', defaultValue: DependenciesCalendar.ToEvent })
    ], SchedulerProProjectMixin.prototype, "dependenciesCalendar", void 0);
    __decorate([
        model_field({ type: 'boolean', defaultValue: true })
    ], SchedulerProProjectMixin.prototype, "autoCalculatePercentDoneForParentTasks", void 0);
    return SchedulerProProjectMixin;
}) {
}
