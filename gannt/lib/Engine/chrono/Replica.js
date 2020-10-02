import { RejectSymbol } from "../../ChronoGraph/chrono/Effect.js";
import { TombStone } from "../../ChronoGraph/chrono/Quark.js";
import { Revision } from "../../ChronoGraph/chrono/Revision.js";
import { Transaction } from "../../ChronoGraph/chrono/Transaction.js";
import { Mixin } from "../../ChronoGraph/class/BetterMixin.js";
import { Replica } from "../../ChronoGraph/replica/Replica.js";
import { ConflictSymbol } from "./Conflict.js";
import { ModelBucketField, IsChronoModelSymbol } from "./ModelFieldAtom.js";
export class EngineRevision extends Revision {
    constructor() {
        super(...arguments);
        this.failedResolutionReferences = new Map();
    }
}
export class EngineTransaction extends Transaction {
    constructor() {
        super(...arguments);
        this.candidateClass = EngineRevision;
    }
    initialize(...args) {
        super.initialize(...args);
        this.candidate.failedResolutionReferences = new Map(this.baseRevision.failedResolutionReferences);
    }
    addIdentifier(identifier, proposedValue, ...args) {
        this.markFailedResolutionReferences();
        return super.addIdentifier(identifier, proposedValue, ...args);
    }
    markFailedResolutionReferences() {
        this.candidate.failedResolutionReferences.forEach((failedResolutionValue, identifier) => {
            this.write(identifier, failedResolutionValue);
        });
        this.candidate.failedResolutionReferences.clear();
    }
}
export class EngineReplica extends Mixin([Replica], (base) => {
    const superProto = base.prototype;
    class EngineReplica extends base {
        constructor() {
            super(...arguments);
            this.baseRevision = EngineRevision.new();
            this.transactionClass = EngineTransaction;
            this.autoCommitMode = 'async';
            this.onComputationCycle = 'throw';
        }
        onPropagationProgressNotification(notification) {
            if (this.enableProgressNotifications && this.project)
                this.project.trigger('progress', notification);
        }
        async commitAsync(args) {
            this.project.trigger('beforeCommit');
            return superProto.commitAsync.call(this, args);
        }
        async finalizeCommitAsync(transactionResult) {
            if (!this.project || this.project.isDestroyed)
                return;
            const { entries } = transactionResult;
            const autoCommitStores = new Set();
            if (this.isInitialCommit) {
                this.project.isInitialCommitPerformed = true;
            }
            this.project.trigger('refresh', { isInitialCommit: this.isInitialCommit });
            await new Promise(resolve => {
                setTimeout(() => {
                    var _a, _b, _c, _d;
                    if (!this.project.isDestroyed && !transactionResult.transaction.rejectedWith) {
                        (_b = (_a = this.project).suspendChangesTracking) === null || _b === void 0 ? void 0 : _b.call(_a);
                        const isInitialCommit = this.isInitialCommit;
                        const records = new Set();
                        for (const quark of entries.values()) {
                            const identifier = quark.identifier;
                            if (quark.isShadow() || !identifier[IsChronoModelSymbol] || quark.getValue() === TombStone || identifier.field instanceof ModelBucketField)
                                continue;
                            const record = identifier.self;
                            const store = record.firstStore;
                            if (!record.isBatchUpdating)
                                record.beginBatch();
                            if (store && store.autoCommit) {
                                autoCommitStores.add(store);
                                store.autoCommit = false;
                            }
                            record.set(identifier.field.name, quark.getValue());
                            records.add(record);
                        }
                        for (const record of records) {
                            record.endBatch(isInitialCommit, true);
                        }
                        (_d = (_c = this.project).resumeChangesTracking) === null || _d === void 0 ? void 0 : _d.call(_c, isInitialCommit);
                        this.project.trigger('dataReady', { records, isInitialCommit });
                        autoCommitStores.forEach(store => {
                            store.autoCommit = true;
                        });
                        if (isInitialCommit) {
                            [
                                this.project.eventStore,
                                this.project.dependencyStore,
                                this.project.resourceStore,
                                this.project.assignmentStore,
                                this.project.calendarManagerStore
                            ].forEach(store => store.acceptChanges());
                        }
                    }
                    resolve();
                }, 0);
            });
        }
        async [ConflictSymbol](effect, transaction) {
            return this.project.onSchedulingConflict(effect, transaction);
        }
        [RejectSymbol](effect, transaction) {
            return super[RejectSymbol](effect, transaction);
        }
    }
    return EngineReplica;
}) {
}
