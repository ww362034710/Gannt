import SchedulerProBase from './SchedulerProBase.js';

// Since SchedulerPro is based on thin XXBase classes, default features needs to be pulled in here
import '../../Scheduler/feature/ColumnLines.js';
import '../../Scheduler/feature/Dependencies.js';
import '../../Scheduler/feature/DependencyEdit.js';
import '../../Scheduler/feature/EventMenu.js';
import '../../Scheduler/feature/EventFilter.js';
import '../../Scheduler/feature/EventDrag.js';
import '../../Scheduler/feature/EventDragCreate.js';
//import '../../Scheduler/feature/EventEdit.js';
import '../../Scheduler/feature/EventResize.js';
import '../../Scheduler/feature/EventTooltip.js';
import '../../Scheduler/feature/NonWorkingTime.js';
import '../../Scheduler/feature/TimeAxisHeaderMenu.js';
import '../../Scheduler/feature/ScheduleMenu.js';
import '../../Scheduler/feature/ScheduleTooltip.js';

import '../../Grid/feature/CellEdit.js';
import '../../Grid/feature/ColumnDragToolbar.js';
import '../../Grid/feature/ColumnPicker.js';
import '../../Grid/feature/ColumnReorder.js';
import '../../Grid/feature/ColumnResize.js';
import '../../Grid/feature/CellMenu.js';
import '../../Grid/feature/HeaderMenu.js';
import '../../Grid/feature/Filter.js';
import '../../Grid/feature/FilterBar.js';
import '../../Grid/feature/Group.js';
import '../../Grid/feature/Sort.js';
import '../../Grid/feature/Stripe.js';
// For checkbox selection mode
import '../../Grid/column/CheckColumn.js';

import '../feature/TaskEdit.js';

/**
 * @module SchedulerPro/view/SchedulerPro
 */

/**
 * ## Intro
 *
 * The Scheduler Pro is an extension of the [Bryntum Scheduler](#Scheduler/view/Scheduler), and combines the visualisation capabilities
 * of the Scheduler with the powerful scheduling engine from the Gantt. This means it can manage {@link SchedulerPro/model/ProjectModel project} data composed by
 * tasks, dependencies, resources, assignments and calendars (for working / non-working time). If you have inter-task dependencies,
 * task updates will be propagated to any successors after a task is moved. The engine will reschedule tasks
 * according to the constraints, dependencies and calendars defined in the project. To familiarize yourself with the various APIs and data structures
 * of the Scheduler Pro, we recommend starting with these resources:
 *
 * * [Getting started guide](#guides/schedulerpro/getting_started.md)
 * * [Project data model guide](#guides/schedulerpro/project_data.md)
 * * [Bryntum Scheduler API docs](#Scheduler/view/Scheduler)
 * * [Bryntum Grid API docs](#Grid/view/Grid)
 * * [Localisation](#guides/customization/localization.md)
 *
 * ## Basic setup
 *
 * To create an instance of this class, simply configure it with:
 *
 * * The {@link Grid/column/Column columns} you want
 * * The {@link Grid/view/Grid#config-features features} you want, quite a lot to choose from, and you can build your own too
 * * A {@link SchedulerPro/model/ProjectModel Project} instance:
 * * A {@link Scheduler/preset/ViewPreset viewPreset} identifier, specifying the granularity of the time axis.
 * ```
 * const scheduler = new SchedulerPro({
 *    // A Project holds the data and the calculation engine for Scheduler Pro. It also acts as a CrudManager, allowing
 *    // loading data into all stores at onceq
 *    project : {
 *        autoLoad  : true,
 *        transport : {
 *            load : {
 *                url : './data/data.json'
 *            }
 *       }
 *    },
 *
 *    adopt             : 'container',
 *    startDate         : '2020-05-01',
 *    endDate           : '2020-09-30',
 *    resourceImagePath : '../_shared/images/users/',
 *    viewPreset        : 'dayAndWeek'
 *    features : {
 *       columnLines  : false,
 *       dependencies : true
 *   },
 *
 *   columns : [
 *       {
 *           type           : 'resourceInfo',
 *           text           : 'Worker',
 *           showEventCount : true
 *       }
 *   ]
 * });
 * ```
 * {@inlineexample schedulerpro/view/SchedulerPro.js}
 *
 * ## Customisation
 *
 * You can style any aspect of the Scheduler using plain CSS or modify our themes using our built-in SASS variables.
 * Using the {@link Scheduler/view/mixin/SchedulerEventRendering#config-eventRenderer} you can customize the HTML output for
 * each event bar. The Scheduler comes with a few different {@link #config-eventStyle event styles} which you can
 * define globally on the Scheduler, in the resource data, or on individual events.
 *
 * {@inlineexample schedulerpro/view/EventStyles.js}
 *
 * For more information about styling, please refer to the [styling guide](#guides/customization/styling.md).
 *
 * ## Partnering with other timeline widgets
 *
 * You can also pair the Scheduler Pro with other timeline based widgets such as the {@link SchedulerPro/view/ResourceHistogram histogram widget}
 * to view resource allocation levels, using the {@link #config-partner} config.
 *
 * {@inlineexample schedulerpro/view/ResourceHistogram.js}
 *
 * @extends SchedulerPro/view/SchedulerProBase
 */
export default class SchedulerPro extends SchedulerProBase {

    //region Config

    static get $name() {
        return 'SchedulerPro';
    }

    static get type() {
        return 'schedulerpro';
    }

    //endregion

}

SchedulerPro.initClass();
