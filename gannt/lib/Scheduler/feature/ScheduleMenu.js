import TimeSpanMenuBase from '../../Scheduler/feature/base/TimeSpanMenuBase.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Scheduler/feature/ScheduleMenu
 */

/**
 * Displays a context menu for empty parts of the schedule. Items are populated in the first place
 * by configurations of this Feature, then by other features and/or application code.
 *
 * Add extra items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 extraItem : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem({date, resourceRecord, items}) {
 *                         // Custom date based action
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Remove existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             items : {
 *                 addEvent : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleMenu : {
 *             // Process items before menu is shown
 *             processItems({date, resourceRecord, items}) {
 *                  // Add an extra item for ancient times
 *                  if (date < new Date(2018, 11, 17)) {
 *                      items.modernize = {
 *                          text : 'Modernize',
 *                          ontItem({date}) {
 *                              // Custom date based action
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for Sundays
 *                  if (date.getDay() === 0) {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * This feature is **enabled** by default
 *
 * @demo Scheduler/basic
 * @extends Scheduler/feature/base/TimeSpanMenuBase
 * @classtype scheduleMenu
 */
export default class ScheduleMenu extends TimeSpanMenuBase {
    //region Config

    static get $name() {
        return 'ScheduleMenu';
    }

    static get defaultConfig() {
        return {
            type : 'schedule',

            /**
             * This is a preconfigured set of {@link Core.widget.Container#config-namedItems} used to create the default context menu.
             *
             * The provided defaultItems setting is
             *
             *```javascript
             *    {
             *        addEvent : true
             *    }
             *```
             *
             * The `namedItems` provided by this feature are listed below. These are the property
             * names which you may configure in the feature's {@link Grid.feature.base.ContextMenuBase#config-items} config:
             *
             * - `addEvent` Add an event for at the resource and time indicated by the `contextmenu` event.
             *
             * To remove existing items, set corresponding keys to `false`
             *
             * ```javascript
             * const scheduler = new Scheduler({
             *     features : {
             *         scheduleMenu : {
             *             items : {
             *                 addEvent : false
             *             }
             *         }
             *     }
             * });
             * ```
             *
             * @config {Object}
             */
            defaultItems : {
                addEvent : true
            }
        };
    }

    //endregion

    //region Events

    /**
     * Fired from scheduler before the context menu is shown for an event. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning `false` from a listener prevents the menu from
     * being shown.
     * @event scheduleMenuBeforeShow
     * @preventable
     * @param {Scheduler.view.Scheduler} source
     * @param {Object} items Menu item configs
     * @param {Scheduler.model.EventModel} eventRecord Event record for which the menu was triggered
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * Fired from scheduler when an item is selected in the context menu.
     * @event scheduleMenuItem
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.MenuItem} item
     * @param {Scheduler.model.EventModel} eventRecord
     * @param {Scheduler.model.ResourceModel} resourceRecord
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    /**
     * Fired from scheduler after showing the context menu for an event
     * @event scheduleMenuShow
     * @param {Scheduler.view.Scheduler} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Scheduler.model.EventModel} eventRecord Event record for which the menu was triggered
     * @param {Scheduler.model.ResourceModel} resourceRecord Resource record
     * @param {Scheduler.model.AssignmentModel} assignmentRecord Assignment record, if assignments are used
     * @param {HTMLElement} eventElement
     */

    //endregion

    shouldShowMenu(eventParams) {
        const
            { client } = this,
            {
                column,
                targetElement,
                resourceRecord
            } = eventParams,
            isTimeAxisColumn = column
                ? column === client.timeAxisColumn
                : client.timeAxisSubGrid.element === targetElement;

        return isTimeAxisColumn && !(resourceRecord && resourceRecord.meta.specialRow);
    }

    getDataFromEvent(event) {
        const
            me             = this,
            { client }     = me,
            cellData       = client.getCellDataFromEvent(event),
            date           = client.getDateFromDomEvent(event, 'floor'),
            // For vertical mode the resource must be resolved from the event
            resourceRecord = client.resolveResourceRecord(event) || client.resourceStore.last;

        return ObjectHelper.assign(super.getDataFromEvent(event), cellData, { date, resourceRecord });
    }

    get namedItems() {
        const { client } = this;

        if (!this._namedItems) {
            this._namedItems = {
                addEvent : {
                    text        : 'L{SchedulerBase.Add event}',
                    localeClass : client,
                    icon        : 'b-icon b-icon-add',
                    disabled    : client.resourceStore.count === 0,
                    weight      : -160,
                    onItem({ date, resourceRecord }) {
                        client.internalAddEvent(date, resourceRecord, client.getRowFor(resourceRecord));
                    }
                }
            };
        }

        return this._namedItems;
    }
}

ScheduleMenu.featureClass = '';

GridFeatureManager.registerFeature(ScheduleMenu, true, 'Scheduler');
