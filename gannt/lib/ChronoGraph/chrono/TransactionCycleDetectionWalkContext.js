import { Base } from "../class/Base.js";
import { NOT_VISITED, OnCycleAction, WalkContext } from "../graph/WalkDepth.js";
export class ComputationCycle extends Base {
    toString() {
        return this.cycle.map(identifier => {
            return identifier.name;
        }).join('\n');
    }
}
export class TransactionCycleDetectionWalkContext extends WalkContext {
    constructor() {
        super(...arguments);
        this.transaction = undefined;
    }
    onCycle(node, stack) {
        return OnCycleAction.Cancel;
    }
    doCollectNext(from, to, toVisit) {
        let visit = this.visited.get(to);
        if (!visit) {
            visit = { visitedAt: NOT_VISITED, visitEpoch: this.currentEpoch };
            this.visited.set(to, visit);
        }
        toVisit.push({ node: to, from, label: undefined });
    }
    collectNext(from, toVisit) {
        const latestEntry = this.transaction.getLatestEntryFor(from);
        if (latestEntry) {
            latestEntry.outgoingInTheFutureTransactionCb(this.transaction, outgoingEntry => {
                this.doCollectNext(from, outgoingEntry.identifier, toVisit);
            });
        }
    }
}
