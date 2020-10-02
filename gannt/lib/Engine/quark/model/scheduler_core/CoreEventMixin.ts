import { CommitResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { Mixin, AnyConstructor } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CorePartOfProjectModelMixin } from "../mixin/CorePartOfProjectModelMixin.js"
import DateHelper from "../../../../Core/helper/DateHelper.js"
import { Duration, TimeUnit } from "../../../scheduling/Types.js"
import { CoreAssignmentMixin } from "./CoreAssignmentMixin.js"


/**
 * Core event entity mixin type.
 *
 * At this level event is only aware about its dates
 * The functionality, related to the assignments etc is provided in other mixins.
 */
export class CoreEventMixin extends Mixin(
    [ CorePartOfProjectModelMixin ],
    (base : AnyConstructor<CorePartOfProjectModelMixin, typeof CorePartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CoreEventMixin extends base {

        durationUnit : string


        // Proper engine defines these fields since they enter graph, thus we need them
        static get fields () {
            return [
                { name : 'startDate', type : 'date' },
                { name : 'endDate', type : 'date' },
                { name : 'duration', type : 'number' },
                { name : 'durationUnit', type : 'string', defaultValue : 'day' }
            ]
        }


        // Getters return current or proposed value
        get startDate () { return this.getCurrentOrProposed('startDate') }
        get endDate () { return this.getCurrentOrProposed('endDate') }
        get duration () { return this.getCurrentOrProposed('duration') }


        // Route all setting through applyXX (setStartDate, startDate = , set('startDate'), batching)
        set startDate (value : Date) { this.proposeStartDate(value) }
        set endDate (value : Date) { this.proposeEndDate(value) }
        set duration (value : number) { this.proposeDuration(value) }


        //region StartDate


        getStartDate () : Date {
            return this.startDate
        }


        proposeStartDate (startDate : Date, keepDuration : boolean = true) {
            this.propose({ startDate, keepDuration })
        }


        async setStartDate (startDate : Date, keepDuration : boolean = true) : Promise<CommitResult> {
            this.proposeStartDate(startDate, keepDuration)

            return this.project?.commitAsync()
        }


        //endregion


        //region EndDate


        getEndDate () : Date {
            return this.endDate
        }


        proposeEndDate (endDate : Date, keepDuration : boolean = false) {
            this.propose({ endDate, keepDuration })
        }


        async setEndDate (endDate : Date, keepDuration : boolean = false) : Promise<CommitResult> {
            this.proposeEndDate(endDate, keepDuration)

            return this.project?.commitAsync()
        }


        //endregion


        //region Duration


        getDuration () : number {
            return this.duration
        }


        proposeDuration (duration : Duration, unit? : TimeUnit, keepStart : boolean = true) {
            this.propose({ duration, keepStart })
            if (unit) this.propose({ durationUnit : unit })
        }


        async setDuration (duration : Duration, unit? : TimeUnit, keepStart : boolean = true) : Promise<CommitResult> {
            this.proposeDuration(duration, unit, keepStart)

            return this.project?.commitAsync()
        }


        getDurationUnit () : string {
            return this.durationUnit
        }

        //endregion


        // When joining as part of inline data, store is available. If joining through load, it is passed
        joinProject () {
            const changed = this.$changed

            // Initial values should be considered changed, to be normalized
            if (this.hasCurrentOrProposed('startDate')) changed.startDate = this.getCurrentOrProposed('startDate')
            if (this.hasCurrentOrProposed('endDate'))   changed.endDate   = this.getCurrentOrProposed('endDate')
            if (this.hasCurrentOrProposed('duration'))  changed.duration  = this.getCurrentOrProposed('duration')

            // Resolve assignments when event joins project after load
            if (this.eventStore && !this.eventStore.isLoadingData) {
                const unresolved = this.assignmentStore?.storage.findItem('event', null) as Set<CoreAssignmentMixin>
                if (unresolved) {
                    for (const assignment of unresolved) {
                        if (assignment.getCurrentOrProposed('event') === this.id) {
                            assignment.setChanged('event', this)
                        }
                    }
                }
            }

            superProto.joinProject.call(this)
        }


        // Mimick how proper engine applies values
        applyValue (useProp : boolean, key : string, value : any, skipAccessors : boolean, field : any) {
            if (key === 'startDate' || key == 'duration' || key === 'endDate') {
                useProp = true
            }
            if (skipAccessors) {
                useProp = false
            }
            superProto.applyValue.call(this, useProp, key, value, skipAccessors, field)
        }

        // Catch changes from batches etc. In which case it is sometimes expected for data to be available directly
        afterChange (toSet : any, wasSet : any, silent : boolean, fromRelationUpdate : boolean, skipAccessors : boolean) {
            if (!this.$isCalculating && !skipAccessors) {
                // In certain scenarios data is expected to be available of the bat, messy!
                this.setData(this.$changed)
            }

            superProto.afterChange.call(this, toSet, wasSet, silent, fromRelationUpdate, skipAccessors)
        }


        // Normalizes dates & duration
        calculateInvalidated () {
            const changed            = this.$changed
            const changedStart       = 'startDate' in changed
            const changedEnd         = 'endDate' in changed
            const changedDuration    = 'duration' in changed

            const { startDate, endDate, duration, keepDuration, keepStart } = changed

            let calculate : string = null

            // Only start changed
            if (changedStart && !changedEnd && !changedDuration) {
                // Also null end when nulling start (keeping duration)
                if (startDate === null) {
                    changed.endDate = null
                }
                // Start after end without keeping duration -> move end to start
                else if (this.hasCurrentOrProposed('endDate') && startDate > this.getCurrentOrProposed('endDate') && !keepDuration) {
                    changed.endDate  = startDate
                    changed.duration = 0
                }
                // Start changed and we either have a duration that we want to keep or no end -> calculate end
                else if (this.hasCurrentOrProposed('duration') && (keepDuration || !this.hasCurrentOrProposed('endDate'))) {
                    calculate = 'endDate'
                }
                // Start change and we have an end already -> calculate duration
                else if (this.hasCurrentOrProposed('endDate')) {
                    calculate = 'duration'
                }
            }

            // Only end changed
            else if (!changedStart && changedEnd && !changedDuration) {
                // Also null start when nulling end (keeping duration)
                if (endDate === null) {
                    changed.startDate = null
                }
                // End before start without keeping duration -> move start to end
                else if (this.hasCurrentOrProposed('startDate') && endDate < this.getCurrentOrProposed('startDate') && !keepDuration) {
                    changed.startDate = endDate
                    changed.duration  = 0
                }
                // End changed and we either have a duration that we want to keep or no start -> calculate start
                else if (this.hasCurrentOrProposed('duration') && (keepDuration  || !this.hasCurrentOrProposed('startDate'))) {
                    calculate = 'startDate'
                }
                // End changed and we have a start already -> calculate duration
                else if (this.hasCurrentOrProposed('startDate')) {
                    calculate = 'duration'
                }
            }

            // Only duration changed
            else if (!changedStart && !changedEnd && changedDuration) {
                // Also null end when nuling duration (keeping start)
                if (duration === null) {
                    changed.endDate = null
                }
                // Duration changed and we either have a start that we want to keep or no end -> calculate end
                else if (this.hasCurrentOrProposed('startDate') && (keepStart || !this.hasCurrentOrProposed('endDate'))) {
                    if (keepStart && changed.duration < 0) {
                        changed.duration = 0
                    }

                    calculate = 'endDate'
                }
                // Duration changed and we have an end already -> calculate start
                else if (this.hasCurrentOrProposed('endDate')) {
                    calculate = 'startDate'
                }
            }

            // Start and end change, affect duration
            else if (changedStart && changedEnd && !changedDuration) {
                // Both nulled, null duration
                if (startDate === null && endDate === null) {
                    changed.duration = null
                }
                // Other cases -> calculate duration
                else {
                    calculate = 'duration'
                }
            }

            // Start and duration change -> calculate end
            else if (changedStart && !changedEnd && changedDuration) {
                calculate = 'endDate'
            }

            // End and duration changed -> calculate start
            else if (!changedStart && changedEnd && changedDuration) {
                calculate = 'startDate'
            }

            // All changed -> calculate whichever is null or by default end to be sure things add up
            else if (changedStart && changedEnd && changedDuration) {
                if (duration == null) {
                    calculate = 'duration'
                }
                else if (startDate == null) {
                    calculate = 'startDate'
                }
                else {
                    calculate = 'endDate'
                }
            }

            // Normalize if needed
            switch (calculate) {
                case 'startDate':
                    changed.startDate      = DateHelper.add(
                        this.getCurrentOrProposed('endDate'),
                        -this.getCurrentOrProposed('duration'),
                        this.getCurrentOrProposed('durationUnit')
                    )
                    break

                case 'endDate':
                    changed.endDate        = DateHelper.add(
                        this.getCurrentOrProposed('startDate'),
                        this.getCurrentOrProposed('duration'),
                        this.getCurrentOrProposed('durationUnit')
                    )
                    break

                case 'duration':
                    changed.duration       = DateHelper.diff(
                        this.getCurrentOrProposed('startDate'),
                        this.getCurrentOrProposed('endDate'),
                        this.getCurrentOrProposed('durationUnit')
                    )
                    break
            }

            delete changed.keepDuration
            delete changed.keepStart
        }


    }

    return CoreEventMixin
}){}
