import AbstractCrudManagerMixin from '../../../Scheduler/crud/AbstractCrudManagerMixin.js';
import JsonEncoder from '../../../Scheduler/crud/encoder/JsonEncoder.js';
import AjaxTransport from '../../../Scheduler/crud/transport/AjaxTransport.js';
import StringHelper from '../../../Core/helper/StringHelper.js';

/**
 * @module SchedulerPro/data/mixin/ProjectCrudManager
 */

// the order of the @mixes tags is important below, as the "AbstractCrudManagerMixin"
// contains the abstract methods, which are then overwritten by the concrete
// implementation in the AjaxTransport and JsonEncoder

/**
 * This is a mixin, providing Crud manager functionality, specialized for the Scheduler Pro project.
 *
 * @mixin
 * @mixes Scheduler/crud/AbstractCrudManagerMixin
 * @mixes Scheduler/crud/transport/AjaxTransport
 * @mixes Scheduler/crud/encoder/JsonEncoder
 */
export default Base => class ProjectCrudManager extends JsonEncoder(AjaxTransport(AbstractCrudManagerMixin(Base))) {

    static get properties() {
        return {
            // TODO: remove this in Gantt 4.2.0
            deprecatedProjectCalendarProperties : ['hoursPerDay', 'daysPerWeek', 'daysPerMonth']
        };
    }

    construct(...args) {
        const me = this;

        super.construct(...args);

        // add the Engine specific stores to the crud manager
        me.addPrioritizedStore(me.calendarManagerStore);
        me.addPrioritizedStore(me.assignmentStore);
        me.addPrioritizedStore(me.dependencyStore);
        me.addPrioritizedStore(me.resourceStore);
        me.addPrioritizedStore(me.eventStore);
        if (me.timeRangeStore) {
            me.addPrioritizedStore(me.timeRangeStore);
        }
        if (me.resourceTimeRangeStore) {
            me.addPrioritizedStore(me.resourceTimeRangeStore);
        }
    }

    // TODO: remove this in Gantt 4.2.0
    adjustDeprecatedResponse(response) {
        const
            projectResponse                         = response?.project,
            projectResponseCalendar                 = projectResponse?.calendar,
            { deprecatedProjectCalendarProperties } = this;

        // Some properties were move from the CalendarModel to the ProjectModel class
        // we are going to support old properties location for a while
        // to not force customers to update their backends in rush
        if (deprecatedProjectCalendarProperties && projectResponseCalendar && response.calendars) {
            // array of responded calendars to iterate
            const toProcess = response.calendars.rows?.slice() || [];

            let calendarEntry;

            while ((calendarEntry = toProcess.shift())) {
                // if that's the project calendar
                if (calendarEntry.id == projectResponseCalendar) {
                    // copy its deprecated properties to the "project"
                    deprecatedProjectCalendarProperties.forEach(property => {
                        if (!projectResponse[property] && calendarEntry[property]) {
                            // <debug>
                            console.warn(`"${property}" property was moved to the ProjectModel class. Please adjust your backend accordingly.`);
                            // </debug>
                            projectResponse[property] = calendarEntry[property];
                        }
                    });
                    break;
                }

                // add children to the list to be iterated
                calendarEntry.children && toProcess.push(...calendarEntry.children);
            }
        }

        return response;
    }

    async applyResponse(requestType, response, options) {
        if (this.isDestroyed) return;

        this.trigger('startApplyResponse');

        // adjust response to support some outdated properties location
        response = this.adjustDeprecatedResponse(response);

        await super.applyResponse(requestType, response, options);

        this.applyingProjectResponse = true;
        // if there is the project data provided
        response && response.project && Object.assign(this, response.project);
        this.applyingProjectResponse = false;

        const propagationFlag = `propagating${StringHelper.capitalizeFirstLetter(requestType)}Changes`;

        this[propagationFlag] = true;
        // the initial propagation should always use "Resume" for conflicts
        await this.commitAsync(/*() => EffectResolutionResult.Resume*/);
        this[propagationFlag] = false;

        // TODO:
        this.clearCrudStoresChanges();
    }

    clearCrudStoresChanges() {
        // TODO: Change when https://app.assembla.com/spaces/bryntum/tickets/8975 is fixed
        // this.crudStores.forEach(store => store.store.clearChanges());
        this.crudStores.forEach(store => {
            const me = store.store;

            me.remove(me.added.values, true);
            me.modified.forEach(r => r.clearChanges(false));

            me.added.clear();
            me.modified.clear();
            me.removed.clear();
        });
    }

    applyProjectResponse(projectResponse) {
        this.loadProjectFields(projectResponse);
    }

    onDataReady() {
        // Gantt project will bail out all onCrudStoreChange calls to optmize performance.
        // But that also means that if project is autoSync'ed, it wouldn't happen. Unless we force it
        if (this.autoSync) {
            this.scheduleAutoSync();
        }
    }
};
