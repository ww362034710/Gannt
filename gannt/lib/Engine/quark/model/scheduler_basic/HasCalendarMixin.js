var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Mixin } from "../../../../ChronoGraph/class/BetterMixin.js";
import { calculate, write } from "../../../../ChronoGraph/replica/Entity.js";
import { reference } from "../../../../ChronoGraph/replica/Reference.js";
import { CalendarCacheMultiple } from "../../../calendar/CalendarCacheMultiple.js";
import { model_field } from '../../../chrono/ModelFieldAtom.js';
import { stripDuplicates } from "../../../util/StripDuplicates.js";
import { ChronoPartOfProjectModelMixin } from "../mixin/ChronoPartOfProjectModelMixin.js";
export class HasCalendarMixin extends Mixin([ChronoPartOfProjectModelMixin], (base) => {
    const superProto = base.prototype;
    class HasCalendarMixin extends base {
        writeCalendar(me, transaction, quark, calendar) {
            this.$.proposedCalendar.write.call(this, this.$.proposedCalendar, transaction, null, calendar);
        }
        *calculateCalendar() {
            let calendar = yield this.$.proposedCalendar;
            if (!calendar) {
                const project = this.getProject();
                calendar = yield project.$.calendar;
            }
            yield calendar.$.version;
            return calendar;
        }
    }
    __decorate([
        model_field({
            serialize: calendar => calendar && (calendar === calendar.getProject().defaultCalendar ? undefined : calendar.id)
        }, {
            equality: () => false,
            sync: true
        })
    ], HasCalendarMixin.prototype, "calendar", void 0);
    __decorate([
        reference({ persistent: false, resolver: function (locator) { return this.getCalendarManagerStore().getById(locator); } })
    ], HasCalendarMixin.prototype, "proposedCalendar", void 0);
    __decorate([
        write('calendar')
    ], HasCalendarMixin.prototype, "writeCalendar", null);
    __decorate([
        calculate('calendar')
    ], HasCalendarMixin.prototype, "calculateCalendar", null);
    return HasCalendarMixin;
}) {
}
export class CanCombineCalendars extends Mixin([], (base) => {
    const superProto = base.prototype;
    class CanCombineCalendars extends base {
        constructor() {
            super(...arguments);
            this.combinedcalendarscache = new Map();
        }
        combineCalendars(calendars) {
            const uniqueOnly = stripDuplicates(calendars);
            if (uniqueOnly.length === 0)
                throw new Error("No calendars to combine");
            uniqueOnly.sort((calendar1, calendar2) => {
                if (calendar1.internalId < calendar2.internalId)
                    return -1;
                else
                    return 1;
            });
            const hash = uniqueOnly.map(calendar => calendar.internalId + '/').join('');
            const versionsHash = uniqueOnly.map(calendar => calendar.version + '/').join('');
            const cached = this.combinedcalendarscache.get(hash);
            let res;
            if (cached && cached.versionsHash === versionsHash)
                res = cached.cache;
            else {
                res = new CalendarCacheMultiple({ calendarCaches: uniqueOnly.map(calendar => calendar.calendarCache) });
                this.combinedcalendarscache.set(hash, {
                    versionsHash: versionsHash,
                    cache: res
                });
            }
            return res;
        }
    }
    return CanCombineCalendars;
}) {
}
