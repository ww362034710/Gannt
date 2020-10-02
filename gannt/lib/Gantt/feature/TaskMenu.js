import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import EventMenu from '../../Scheduler/feature/EventMenu.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';

/**
 * @module Gantt/feature/TaskMenu
 */

/**
 * Displays a context menu for tasks. Items are populated by other features and/or application code.
 * Configure it with `false` to disable it completely. If enabled, {@link Grid.feature.CellMenu} feature
 * is not available. Cell context menu items are handled by this feature.
 *
 * To add extra items for all events:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskMenu : {
 *             // Extra items for all events
 *             items : {
 *                 flagTask : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem({taskRecord}) {
 *                         taskRecord.flagged = true;
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items for all tasks or specific tasks:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskMenu : {
 *             // We would like to remove some of the provided options in the add menu
 *             items : {
 *                 add : {
 *                     menu : {
 *                         items : {
 *                             addTaskAbove : false,
 *                             addTaskBelow : false,
 *                             milestone    : false
 *                         }
 *                     }
 *                 }
 *             },
 *             // Process items before menu is shown
 *             processItems({taskRecord, items}) {
 *                  // Push an extra item for conferences
 *                  if (taskRecord.type === 'conference') {
 *                      items.showSessions = {
 *                          text : 'Show sessions',
 *                          ontItem({taskRecord}) {
 *                              // ...
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for secret events
 *                  if (taskRecord.type === 'secret') {
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
 * @extends Scheduler/feature/EventMenu
 * @demo Gantt/taskmenu
 * @classtype taskMenu
 * @externalexample gantt/taskmenu.js
 */
export default class TaskMenu extends EventMenu {
    //region Config

    static get $name() {
        return 'TaskMenu';
    }

    static get defaultConfig() {
        return {
            type : 'task',

            /**
             * This is a preconfigured set of {@link Core.widget.Container#config-namedItems} used to create the default
             * context menu.
             *
             * The provided defaultItems setting is
             *
             *```javascript
             *    {
             *        add        : true,
             *        indent     : true,
             *        outdent    : true,
             *        deleteTask : true
             *    }
             *```
             *
             * The `namedItems` provided by this feature are listed below. These are the property
             * names which you may configure in the feature's {@link Grid.feature.base.ContextMenuBase#config-items} config:
             *
             * - `add` A submenu option containing a `menu` config which contains the following `namedItems`
             *     * `addTaskAbove` Inserts a sibling task above the context task.
             *     * `addTaskBelow` Inserts a sibling task below the context task.
             *     * `milestone` Inserts a sibling milestone below the context task.
             *     * `subtask` Appends a child task to the context task.
             *     * `successor` Adds a sibling task linked by a dependence below the context task.
             *     * `predecessor` Adds a sibling task linked by a dependence above the context task.
             *  - `deleteTask` Deletes the context task.
             *  - `indent` Indents the context task by adding it as a child of its previous sibling.
             *  - `outdent` Outdents the context task by adding it as the final sibling of its parent.
             *  - `convertToMilestone` Converts the context task to a zero duration milestone.
             *
             * See the feature config in the above example for details.
             * @config {Object}
             */
            defaultItems : {
                add        : true,
                indent     : true,
                outdent    : true,
                deleteTask : true
            }
        };
    }

    //endregion

    construct(gantt, config) {
        super.construct(...arguments);

        this.gantt = gantt;

        if (gantt.features.cellMenu) {
            console.warn('`CellMenu` feature is ignored, when `TaskMenu` feature is enabled. If you need cell specific menu items, please configure `TaskMenu` feature items instead.');
            gantt.features.cellMenu.disabled = true;
        }
    }

    //region Events

    /**
     * Fired from gantt before the context menu is shown for a task. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning false from a listener prevents the menu from
     * being shown.
     * @event taskMenuBeforeShow
     * @preventable
     * @param {Gantt.view.Gantt} source
     * @param {Object[]} items Menu item configs
     * @param {Gantt.model.TaskModel} taskRecord Event record for which the menu was triggered
     * @param {HTMLElement} taskElement
     */

    /**
     * Fired from gantt when an item is selected in the context menu.
     * @event taskMenuItem
     * @param {Gantt.view.Gantt} source
     * @param {Core.widget.MenuItem} item
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {HTMLElement} taskElement
     */

    /**
     * Fired from gantt after showing the context menu for an event
     * @event taskMenuShow
     * @param {Gantt.view.Gantt} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Gantt.model.TaskModel} taskRecord Event record for which the menu was triggered
     * @param {HTMLElement} taskElement
     */

    //endregion

    getDataFromEvent(event) {
        const
            me            = this,
            targetElement = me.getTargetElementFromEvent(event),
            // to resolve record from a task element or from a grid cell
            taskRecord    = me.client.resolveTaskRecord(targetElement) || me.client.getRecordFromElement(targetElement),
            taskElement   = taskRecord && me.client.getElementFromTaskRecord(taskRecord, false), // get wrapper
            cellData      = me.client.getCellDataFromEvent(event);

        return ObjectHelper.assign({
            event,
            targetElement,
            taskElement,
            taskRecord
        }, cellData);
    }

    getSpecifiedItems(eventParams) {
        const
            items      = super.getSpecifiedItems(eventParams),
            { column } = eventParams;

        // TaskMenu feature is responsible for cell items
        if (column && column.cellMenuItems) {
            ObjectHelper.merge(items, column.cellMenuItems);
        }

        return items;
    }

    callChainablePopulateMenuMethod(eventParams) {
        // When context menu is called for a task cell, need to collect items from features
        // which usually add items to CellMenu in Grid and Scheduler,
        // since CellMenu feature is disabled when TaskMenu feature is enabled.
        if (eventParams.cellData && this.client.populateCellMenu) {
            this.client.populateCellMenu(eventParams);
        }

        super.callChainablePopulateMenuMethod(...arguments);
    }

    shouldShowMenu(eventParams) {
        const { column } = eventParams;

        return eventParams.taskRecord && (!column || column.enableCellContextMenu !== false);
    }

    getElementFromRecord(record) {
        return this.client.getElementFromTaskRecord(record);
    }

    beforeContextMenuShow(eventParams) {
        const
            { taskRecord, items, selection } = eventParams,
            // Context menu on the selection offers multi actions on the selection.
            // Context menu on a non-selected record offers single actions on the context record.
            multiSelected                    = (eventParams.selectionIncludesContextTask = selection.includes(taskRecord)) && selection.length > 1;

        // Modify visibility/accessibility of the menu items depending on the environment.
        // Note, items might have been modified and some of menu items might have been removed.
        // So, adjust only those menu items which are present in the params.
        if (items.editTask) {
            items.editTask.hidden = multiSelected;
        }
        if (items.add) {
            items.add.hidden = multiSelected;

            const addItems = items.add.menu?.items;

            if (addItems) {
                if (addItems.addTaskAbove) {
                    addItems.addTaskAbove.hidden = multiSelected;
                }
                if (addItems.addTaskBelow) {
                    addItems.addTaskBelow.hidden = multiSelected;
                }
                if (addItems.milestone) {
                    addItems.milestone.hidden = multiSelected;
                }
                if (addItems.subtask) {
                    addItems.subtask.hidden = multiSelected;
                }
                if (addItems.successor) {
                    addItems.successor.hidden = multiSelected;
                }
                if (addItems.predecessor) {
                    addItems.predecessor.hidden = multiSelected;
                }
                if (addItems.convertToMilestone) {
                    addItems.convertToMilestone.hidden = multiSelected;
                }
            }
        }
        if (items.indent) {
            items.indent.disabled = !taskRecord.previousSibling;
        }
        if (items.outdent) {
            items.outdent.disabled = taskRecord.parent === this.client.taskStore.rootNode;
        }
    }

    get namedItems() {
        const
            me         = this,
            { client } = me;

        if (!me._namedItems) {
            const namedItems = me._namedItems = {
                addTaskAbove : {
                    text        : 'L{Gantt.Task above}',
                    localeClass : client,
                    icon        : 'b-icon-up',
                    onItem({ taskRecord }) {
                        client.addTaskAbove(taskRecord);
                    }
                },
                addTaskBelow : {
                    text        : 'L{Gantt.Task below}',
                    localeClass : client,
                    icon        : 'b-icon-down',
                    onItem({ taskRecord }) {
                        client.addTaskBelow(taskRecord);
                    }
                },
                milestone : {
                    text        : 'L{Gantt.Milestone}',
                    localeClass : client,
                    icon        : 'b-fa-flag',
                    name        : 'milestone',
                    onItem({ taskRecord }) {
                        client.addMilestonBelow(taskRecord);
                    }
                },
                subtask : {
                    text        : 'L{Gantt.Sub-task}',
                    localeClass : client,
                    name        : 'subtask',
                    onItem({ taskRecord }) {
                        client.addSubtask(taskRecord);
                    }
                },
                successor : {
                    text        : 'L{Gantt.Successor}',
                    localeClass : client,
                    onItem({ taskRecord }) {
                        client.addSuccessor(taskRecord);
                    }
                },
                predecessor : {
                    text        : 'L{Gantt.Predecessor}',
                    localeClass : client,
                    name        : 'predecessor',
                    onItem({ taskRecord }) {
                        client.addPredecessor(taskRecord);
                    }
                },
                deleteTask : {
                    text        : 'L{Gantt.Delete task}',
                    localeClass : client,
                    icon        : 'b-icon-trash',
                    name        : 'deleteTask',
                    onItem({ selectionIncludesContextTask, selection, taskRecord }) {
                        // Context menu on the selection offers multi actions on the selection.
                        // Context menu on a non-selected record offers single actions on the context record.
                        client.taskStore.remove(selectionIncludesContextTask ? selection : taskRecord);
                    }
                },
                convertToMilestone : {
                    text        : 'L{Gantt.Convert to milestone}',
                    localeClass : client,
                    onItem({ taskRecord }) {
                        taskRecord.convertToMilestone();
                    }
                },
                indent : {
                    text        : 'L{Gantt.Indent}',
                    localeClass : client,
                    icon        : 'b-fa-indent',
                    onItem({ selectionIncludesContextTask, selection, taskRecord }) {
                        // Context menu on the selection offers multi actions on the selection.
                        // Context menu on a non-selected record offers single actions on the context record.
                        client.indent(selectionIncludesContextTask ? selection : taskRecord);
                    }
                },
                outdent : {
                    text        : 'L{Gantt.Outdent}',
                    localeClass : client,
                    icon        : 'b-fa-outdent',
                    onItem({ selectionIncludesContextTask, selection, taskRecord }) {
                        // Context menu on the selection offers multi actions on the selection.
                        client.outdent(selectionIncludesContextTask ? selection : taskRecord);
                    }
                }
            };

            namedItems.add = {
                text        : 'L{Gantt.Add}',
                localeClass : client,
                icon        : 'b-icon-add',
                menu        : {
                    items : {
                        addTaskAbove : true,
                        addTaskBelow : true,
                        milestone    : true,
                        subtask      : true,
                        successor    : true,
                        predecessor  : true
                    }
                }
            };
        }

        return me._namedItems;
    }
}

TaskMenu.featureClass = '';

GridFeatureManager.registerFeature(TaskMenu, true, 'Gantt');
