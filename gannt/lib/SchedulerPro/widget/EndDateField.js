import DateField from '../../Core/widget/DateField.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module SchedulerPro/widget/EndDateField
 */

/**
 * Date field widget (text field + date picker) to be used together with Scheduling Engine.
 * This field adjusts time to the latest possible time of the day based on active {@link SchedulerPro.model.ProjectModel#property-calendar calendar}.
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the `EndDateColumn`.
 *
 * @extends Core/widget/DateField
 * @classType enddatefield
 */
export default class EndDateField extends DateField {

    //region Config

    static get $name() {
        return 'EndDateField';
    }

    // Factoryable type name
    static get type() {
        return 'enddate';
    }

    // Factoryable alias name
    static get alias() {
        return 'enddatefield';
    }

    static get defaultConfig() {
        return {
            /**
             * Project model which is a central place for all data to schedule including
             * {@link SchedulerPro.model.ProjectModel#property-calendarManagerStore calendars}
             * which have info about working/non-working time.
             * @config {SchedulerPro.model.ProjectModel}
             * @default
             */
            project : null
        };
    }

    //endregion

    //region Internal

    transformTimeValue(value) {
        const calendar = this.project && this.project.calendar;

        if (calendar) {
            const
                startOfTheDay  = DateHelper.clearTime(value),
                startOfNextDay = DateHelper.add(startOfTheDay, 1, 'day'),
                // search for the latest available time for this day
                latestTime     = calendar.skipNonWorkingTime(startOfNextDay, false);

            // if it's the same day, the latest time is found, use it
            if (DateHelper.isValidDate(latestTime) && DateHelper.isEqual(latestTime, startOfTheDay, 'day')) {
                return DateHelper.copyTimeValues(startOfTheDay, latestTime);
            }
        }

        return super.transformTimeValue(value);
    }

    //endregion

}

// Register this widget type with its Factory
EndDateField.initClass();
