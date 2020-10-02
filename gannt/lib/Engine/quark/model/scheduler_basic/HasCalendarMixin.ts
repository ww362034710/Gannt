import { CommitResult } from "../../../../ChronoGraph/chrono/Graph.js"
import { Identifier } from '../../../../ChronoGraph/chrono/Identifier.js'
import { Quark } from "../../../../ChronoGraph/chrono/Quark.js"
import { Transaction } from "../../../../ChronoGraph/chrono/Transaction.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/BetterMixin.js"
import { CalculationIterator } from "../../../../ChronoGraph/primitives/Calculation.js"
import { calculate, write } from "../../../../ChronoGraph/replica/Entity.js"
import { reference } from "../../../../ChronoGraph/replica/Reference.js"
import { CalendarCacheMultiple } from "../../../calendar/CalendarCacheMultiple.js"
import { model_field } from '../../../chrono/ModelFieldAtom.js'
import { stripDuplicates } from "../../../util/StripDuplicates.js"
import { ModelId } from "../../Types.js"
import { ChronoPartOfProjectModelMixin } from "../mixin/ChronoPartOfProjectModelMixin.js"
import { ChronoAbstractProjectMixin } from "./ChronoAbstractProjectMixin.js"
import { BaseCalendarMixin } from "./BaseCalendarMixin.js"

/**
 * This mixin provides the calendar to any [[PartOfProjectModelMixin]] it is mixed in.
 *
 * If user provides no calendar, the calendar is taken from the project.
 */
export class HasCalendarMixin extends Mixin(
    [ ChronoPartOfProjectModelMixin ],
    (base : AnyConstructor<ChronoPartOfProjectModelMixin, typeof ChronoPartOfProjectModelMixin>) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class HasCalendarMixin extends base {
        project                 : ChronoAbstractProjectMixin & HasCalendarMixin

        /**
         * The calendar of this entity.
         */
        @model_field({
            serialize   : calendar => calendar && (calendar === calendar.getProject().defaultCalendar ? undefined : calendar.id)
        }, {
            equality    : () => false,
            sync        : true
        })
        calendar            : BaseCalendarMixin

        // user-provided calendar
        @reference({ persistent : false, resolver : function (locator) { return this.getCalendarManagerStore().getById(locator) } })
        proposedCalendar    : BaseCalendarMixin


        // all writes to `calendar` are actually translated to `proposedCalendar`, this is because we want to keep
        // the user input and if its `null` we use project calendar
        @write('calendar')
        // writeCalendar (identifier : Identifier, transaction : Transaction, calendar : CalendarMixin) {
        writeCalendar (me : Identifier, transaction : Transaction, quark : Quark, calendar : BaseCalendarMixin) {
            this.$.proposedCalendar.write.call(this, this.$.proposedCalendar, transaction, null, calendar)
        }

        /**
         * The generated setter for the calendar.
         */
        setCalendar : (calendar : BaseCalendarMixin | ModelId) => Promise<CommitResult>
        /**
         * The generated getter for the calendar.
         */
        getCalendar : () => BaseCalendarMixin


        /**
         * Calculation method of the calendar. Takes the calendar from the project, if not provided to the entity explicitly.
         */
        @calculate('calendar')
        * calculateCalendar () : CalculationIterator<BaseCalendarMixin> {
            let calendar : BaseCalendarMixin  = yield this.$.proposedCalendar

            if (!calendar) {
                const project   = this.getProject()

                calendar        = yield project.$.calendar
            }

            // this will create an incoming edge from the calendar's version atom, which changes on calendar's data update
            yield calendar.$.version

            return calendar
        }
    }

    return HasCalendarMixin
}){}



// TODO handle the calendars deletion
/**
 * This mixin provides the consuming class with the [[combineCalendars]] method, which can combine several calendars.
 */
export class CanCombineCalendars extends Mixin(
    [],
    (base : AnyConstructor) => {

    const superProto : InstanceType<typeof base> = base.prototype


    class CanCombineCalendars extends base {

        combinedcalendarscache  : Map<string, { versionsHash : string, cache : CalendarCacheMultiple }>     = new Map()

        /**
         * Combines an array of calendars into a single [[CalendarCacheMultiple]], which provides an API similar (but not exactly the same) to [[BaseCalendarMixin]]
         *
         * @param calendars
         */
        combineCalendars (calendars : BaseCalendarMixin[]) : CalendarCacheMultiple {
            const uniqueOnly    = stripDuplicates(calendars)

            if (uniqueOnly.length === 0) throw new Error("No calendars to combine")

            uniqueOnly.sort(( calendar1, calendar2 ) => {
                if (calendar1.internalId < calendar2.internalId)
                    return -1
                else
                    return 1
            })

            const hash          = uniqueOnly.map(calendar => calendar.internalId + '/').join('')
            const versionsHash  = uniqueOnly.map(calendar => calendar.version + '/').join('')

            const cached        = this.combinedcalendarscache.get(hash)

            let res : CalendarCacheMultiple

            if (cached && cached.versionsHash === versionsHash)
                res             = cached.cache
            else {
                res             = new CalendarCacheMultiple({ calendarCaches : uniqueOnly.map(calendar => calendar.calendarCache ) })

                this.combinedcalendarscache.set(hash, {
                    versionsHash    : versionsHash,
                    cache           : res
                })
            }

            return res
        }
    }

    return CanCombineCalendars
}){}
