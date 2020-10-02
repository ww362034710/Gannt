import ContextMenuBase from '../../Grid/feature/base/ContextMenuBase.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Grid/feature/CellMenu
 */

/**
 * Right click to display context menu for cells.
 *
 * It is also possible to add items via the features config and via column configs. See examples below.
 *
 * Add extra items for all columns:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     cellMenu : {
 *       items : {
 *          extraItem : { text: 'My cell item', icon: 'fa fa-bus', weight: 200, onItem : () => ... }
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * Add extra items for a single column:
 *
 * ```javascript
 * const grid = new Grid({
 *   columns: [
 *     { field: 'city', text: 'City', cellMenuItems: {
 *       columnItem : { text: 'My unique cell item', icon: 'fa fa-beer', onItem : () => ... }
 *     }}
 *   ]
 * });
 * ```
 *
 * Remove existing items:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         cellMenu : {
 *             items : {
 *                 removeRow : false
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * It is also possible to manipulate the default items and add new items in the processing function:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     cellMenu : {
 *       processItems({items, record}) {
 *           if (record.cost > 5000) {
 *              items.myItem = { text : 'Split cost' };
 *           }
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * This feature is <strong>enabled</strong> by default.
 *
 * @extends Grid/feature/base/ContextMenuBase
 * @demo Grid/filtering
 * @classtype cellMenu
 * @externalexample feature/CellMenu.js
 */
export default class CellMenu extends ContextMenuBase {
    //region Config

    static get $name() {
        return 'CellMenu';
    }

    static get defaultConfig() {
        return {
            type : 'cell',

            defaultItems : {
                removeRow : true
            }
        };
    }

    //endregion

    //region Events

    /**
     * Fired from grid before the context menu is shown for a cell.
     * Allows manipulation of the items to show in the same way as in the {@link Grid.feature.base.ContextMenuBase#config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event cellMenuBeforeShow
     * @preventable
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid after the context menu is shown for a cell.
     * @event cellMenuShow
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid when an item is selected in the cell context menu.
     * @event cellMenuItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     */

    /**
     * Fired from grid when a check item is toggled in the cell context menu.
     * @event cellMenuToggleItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Core.data.Model} record Record
     * @param {Boolean} checked Checked or not
     */

    //endregion

    //region Menu handlers

    showContextMenu(eventParams) {
        const
            me = this,
            {
                cellSelector,
                id,
                event
            }  = eventParams;

        // Process the gesture as navigation so that the use may select/multiselect
        // the items to include in their context menu operation.
        // Also select if not already selected.
        me.client.focusCell(cellSelector, {
            doSelect : !me.client.isSelected(id),
            event
        });

        super.showContextMenu(...arguments);
    }

    shouldShowMenu({ column }) {
        return column && column.enableCellContextMenu !== false;
    }

    getDataFromEvent(event) {
        return ObjectHelper.assign(super.getDataFromEvent(event), this.client.getCellDataFromEvent(event));
    }

    getSpecifiedItems(eventParams) {
        const
            items      = super.getSpecifiedItems(eventParams),
            { column } = eventParams;

        if (column && column.cellMenuItems) {
            if (Array.isArray(column.cellMenuItems)) {
                VersionHelper.deprecate('Grid', '5.0.0', '`cellMenuItems` column config specified as an array is deprecated, need to specify the config as a named object. Please see https://bryntum.com/docs/grid/#guides/upgrades/3.1.0.md for more information.');
            }

            // Array works smoothly since number index turns into a key for named object
            ObjectHelper.merge(items, column.cellMenuItems);
        }

        return items;
    }

    contextMenuClose({ reason }) {
        // return focus to client when context menu is closed, if not caused by clicking outside of client
        if (reason !== 'outside') {
            this.client.element.focus();
        }
    }

    beforeContextMenuShow(eventParams) {
        if (!eventParams.record || eventParams.record.meta.specialRow) {
            eventParams.items.removeRow = false;
        }
    }

    //endregion

    //region Getters/Setters

    set defaultItems(defaultItems) {
        this._defaultItems = defaultItems;
    }

    get defaultItems() {
        const
            me         = this,
            { client } = me,
            result     = super.defaultItems;

        if (!client.showRemoveRowInContextMenu) {
            VersionHelper.deprecate('Grid', '5.0.0', '`showRemoveRowInContextMenu` config is deprecated, in favor of `CellMenu` feature configuration. Please see https://bryntum.com/docs/grid/#guides/upgrades/3.1.0.md for more information.');
            result.removeRow = false;
        }

        if (result.removeRow) {
            result.removeRow = {
                text : client.selectedRecords.length > 1 ? 'L{removeRows}' : 'L{removeRow}'
            };
        }

        return result;
    }

    get namedItems() {
        const
            me         = this,
            { client } = me;

        if (!me._namedItems) {
            me._namedItems = {
                removeRow : {
                    text        : 'L{removeRow}',
                    localeClass : this,
                    icon        : 'b-fw-icon b-icon-trash',
                    name        : 'removeRow',
                    onItem      : () => client.store.remove(client.selectedRecords)
                }
            };
        }

        return me._namedItems;
    }

    get showMenu() {
        return true;
    }

    //endregion

}

CellMenu.featureClass = '';

GridFeatureManager.registerFeature(CellMenu, true, ['Grid', 'Scheduler']);
GridFeatureManager.registerFeature(CellMenu, false, ['Gantt']);
