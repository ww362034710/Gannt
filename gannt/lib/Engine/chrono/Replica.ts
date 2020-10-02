import { ProgressNotificationEffect, RejectEffect, RejectSymbol } from "../../ChronoGraph/chrono/Effect.js"
import { CommitArguments, CommitResult } from "../../ChronoGraph/chrono/Graph.js"
import { Identifier } from "../../ChronoGraph/chrono/Identifier.js"
import { Quark, TombStone } from "../../ChronoGraph/chrono/Quark.js"
import { Revision } from "../../ChronoGraph/chrono/Revision.js"
import { Transaction, TransactionCommitResult } from "../../ChronoGraph/chrono/Transaction.js"
import { AnyConstructor, Mixin } from "../../ChronoGraph/class/BetterMixin.js"
import { EntityIdentifier } from "../../ChronoGraph/replica/Identifier.js"
import { Replica } from "../../ChronoGraph/replica/Replica.js"
import Store from "../../Core/data/Store.js"
import { ChronoAbstractProjectMixin } from "../quark/model/scheduler_basic/ChronoAbstractProjectMixin.js"
import { ChronoModelMixin } from "./ChronoModelMixin.js"
import { ConflictEffect, ConflictSymbol } from "./Conflict.js"
import { ChronoModelFieldIdentifier, ModelBucketField, IsChronoModelSymbol } from "./ModelFieldAtom.js"

//---------------------------------------------------------------------------------------------------------------------
export class EngineRevision extends Revision {
    failedResolutionReferences      : Map<Identifier, any> = new Map()
}


//---------------------------------------------------------------------------------------------------------------------
export class EngineTransaction extends Transaction {
    graph                           : EngineReplica

    candidateClass                  : typeof Revision   = EngineRevision

    baseRevision                    : EngineRevision
    candidate                       : EngineRevision


    initialize (...args) {
        super.initialize(...args)

        this.candidate.failedResolutionReferences = new Map(this.baseRevision.failedResolutionReferences)
    }


    addIdentifier (identifier : Identifier, proposedValue? : any, ...args) : Quark {
        this.markFailedResolutionReferences()

        return super.addIdentifier(identifier, proposedValue, ...args)
    }


    markFailedResolutionReferences () {
        this.candidate.failedResolutionReferences.forEach((failedResolutionValue, identifier : Identifier) => {
            this.write(identifier, failedResolutionValue)
        })

        this.candidate.failedResolutionReferences.clear()
    }
}


//---------------------------------------------------------------------------------------------------------------------
/**
 * An extension of [[Replica]], specialized for interaction with [[AbstractProjectMixin|project]].
 */
export class EngineReplica extends Mixin(
    [ Replica ],
    (base : AnyConstructor<Replica, typeof Replica>) => {

    const superProto : InstanceType<typeof base> = base.prototype

    class EngineReplica extends base {
        baseRevision            : Revision      = EngineRevision.new()

        transactionClass        : typeof Transaction = EngineTransaction

        project                 : ChronoAbstractProjectMixin

        autoCommitMode          : 'sync' | 'async'  = 'async'

        onComputationCycle      : 'throw' | 'warn' | 'reject' = 'throw'

        // clear () {
        //     this.removeEntity(this.project)
        //
        //     super.clear()
        //
        //     this.addEntity(this.project)
        // }


        onPropagationProgressNotification (notification : ProgressNotificationEffect) {
            if (this.enableProgressNotifications && this.project) this.project.trigger('progress', notification)
        }


        async commitAsync (args? : CommitArguments) : Promise<CommitResult> {
            this.project.trigger('beforeCommit')

            return superProto.commitAsync.call(this, args)
        }


        async finalizeCommitAsync (transactionResult : TransactionCommitResult) {
            // the `this.project` may be empty for the branch, where we validate the dependency
            // because if asyncness project might be destroyed when we get here
            if (!this.project || this.project.isDestroyed) return

            const { entries }           = transactionResult
            const autoCommitStores      = new Set<Store>()

            // if (window.DEBUG) console.timeEnd('Time to visible')

            if (this.isInitialCommit) {
                this.project.isInitialCommitPerformed = true
            }

            // It is triggered earlier because on that stage engine is ready and UI can be drawn.
            // dataReady happens up to like a second later in big datasets. We do not want to wait that long
            this.project.trigger('refresh', { isInitialCommit : this.isInitialCommit })

            await new Promise(
                resolve => {
                    setTimeout(() => {
                        // TODO: Should use Delayable
                        if (!this.project.isDestroyed && !transactionResult.transaction.rejectedWith) {

                            // @ts-ignore
                            this.project.suspendChangesTracking?.()

                            const isInitialCommit = this.isInitialCommit

                            // if (window.DEBUG) console.time('Finalize propagation')

                            const records = new Set<ChronoModelMixin>()

                            for (const quark of entries.values()) {
                                const identifier = quark.identifier as ChronoModelFieldIdentifier & EntityIdentifier

                                if (quark.isShadow() || !identifier[IsChronoModelSymbol] || quark.getValue() === TombStone || identifier.field instanceof ModelBucketField) continue

                                const record : ChronoModelMixin   = identifier.self
                                const store : Store               = record.firstStore

                                if (!record.isBatchUpdating) record.beginBatch()

                                // Avoid committing changes during refresh, commit below instead
                                if (store && store.autoCommit) {
                                    autoCommitStores.add(store)
                                    store.autoCommit = false
                                }

                                record.set(identifier.field.name, quark.getValue())

                                records.add(record)
                            }

                            for (const record of records) {
                                record.endBatch(isInitialCommit, true)
                            }

                            // if (window.DEBUG) console.timeEnd('Finalize propagation')

                            // @ts-ignore
                            this.project.resumeChangesTracking?.(isInitialCommit)

                            this.project.trigger('dataReady', { records, isInitialCommit })

                            autoCommitStores.forEach(store => {
                                store.autoCommit = true
                            })

                            // clear all changes of the first graph commit
                            if (isInitialCommit) {
                                [
                                    this.project.eventStore,
                                    this.project.dependencyStore,
                                    this.project.resourceStore,
                                    this.project.assignmentStore,
                                    this.project.calendarManagerStore
                                ].forEach(store => store.acceptChanges())
                            }
                        }

                        resolve()
                    }, 0)
                }
            )
        }


        async [ConflictSymbol] (effect : ConflictEffect, transaction : Transaction) {
            // delegate to project
            return this.project.onSchedulingConflict(effect, transaction)
        }


        [RejectSymbol] (effect : RejectEffect<any>, transaction : Transaction) : any {
            // on transaction rejected
            return super[RejectSymbol](effect, transaction)
        }



        // commitAsync (args? : CommitArguments) : Promise<CommitResult> {
        //     if (this.project.bufferedCommitAsync.isPending) {
        //         debugger
        //         this.project.bufferedCommitAsync.cancel()
        //     }
        //
        //     return super.commitAsync(args)
        // }


        // async commitAsync () : Promise<CommitResult> {
        //     const project = this.project
        //
        //     let result
        //
        //     // In case we're already propagating the super class throws some exception, to not mangle it I do custom handling
        //     // with events only if we are not propagating. Otherwise just fallback to superclass.
        //     if (!this.isPropagating) {
        //
        //         project.trigger('propagationStart', { dryRun : !!dryRun})
        //
        //         result = await super.commit(onEffect, dryRun)
        //
        //         project.trigger('propagationComplete', { dryRun : !!dryRun, result })
        //     }
        //     else {
        //         result = await super.commit(onEffect, dryRun)
        //     }
        //
        //     return result
        // }


        // commit () {
        //     const project = this.project
        //     const changedAtoms = this.changedAtoms
        //     const records = new Set(changedAtoms.map((atom : FieldAtom | EntityAtom) => atom.self as Model))
        //
        //     records.forEach(r => r.beginBatch())
        //
        //     project.trigger('beforeCommit', { records, changedAtoms })
        //     super.commit()
        //     project.trigger('commit', { records, changedAtoms })
        //
        //     // When there are a lot of changes do not fire any events for individual records. Instead ignore all of them
        //     // and fire one big refresh which is supposed to trigger one view refresh
        //     const silent = records.size > this.projectRefreshThreshold
        //
        //     records.forEach(r => r.endBatch(silent))
        //
        //     if (silent) {
        //         project.trigger('refresh', { records })
        //     }
        // }
        //
        //
        // async onEffect (effect : Effect) : Promise<EffectResolutionResult> {
        //     const project   = this.project
        //
        //     if (effect instanceof Conflict) {
        //         // is there is a "schedulingconflict" event listener we expect resolution option will be picked there
        //         if (project.hasListener('schedulingconflict')) {
        //             return new Promise((resolve, reject) => {
        //                 project.trigger('schedulingconflict', {
        //                     conflict                        : effect,
        //                     continueWithResolutionResult    : resolve
        //                 })
        //             })
        //         // by default we resume the commitd changes
        //         } else {
        //             return Promise.resolve(EffectResolutionResult.Resume)
        //         }
        //     } else {
        //         return super.onEffect(effect)
        //     }
        // }
    }

    return EngineReplica

}){}
