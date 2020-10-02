import ContextMenuBase from '../../Grid/feature/base/ContextMenuBase.js';
import GridFeatureManager from '../feature/GridFeatureManager.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';

/**
 * @module Grid/feature/HeaderMenu
 */

/**
 * Right click to display context menu for headers. Focus a column header and press SPACE or ARROW DOWN keys to show the menu.
 *
 * It is also possible to add items via the features config and via column configs. See examples below.
 *
 * Add extra items for all columns:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     headerMenu : {
 *       items : {
 *         extraItem : { text: 'My header item', icon: 'fa fa-car', weight: 200, onItem : () => ... }
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
 *     { field: 'name', text: 'Name', headerMenuItems: {
 *       columnItem : { text: 'My unique header item', icon: 'fa fa-flask', onItem : () => ... }
 *     }}
 *   ]
 * });
 * ```
 *
 * It is also possible to manipulate the default items and add new items in the processing function:
 *
 * ```javascript
 * const grid = new Grid({
 *   features : {
 *     headerMenu : {
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
 * @classtype headerMenu
 * @externalexample feature/HeaderMenu.js
 */
export default class HeaderMenu extends ContextMenuBase {
    //region Config

    static get $name() {
        return 'HeaderMenu';
    }

    static get defaultConfig() {
        return {
            type : 'header',

            // private "hack" to provide backward compatibility for deprecated HeaderContextMenu feature in Scheduler
            _showForTimeAxis : false
        };
    }

    //endregion

    //region Events

    /**
     * Fired from grid before the context menu is shown for a header.
     * Allows manipulation of the items to show in the same way as in the {@link Grid.feature.base.ContextMenuBase#config-processItems}.
     *
     * Returning `false` from a listener prevents the menu from being shown.
     *
     * @event headerMenuBeforeShow
     * @preventable
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid after the context menu is shown for a header
     * @event headerMenuShow
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} items Menu item configs
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid when an item is selected in the header context menu.
     * @event headerMenuItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Column
     */

    /**
     * Fired from grid when a check item is toggled in the header context menu.
     * @event headerMenuToggleItem
     * @param {Grid.view.Grid} source The grid
     * @param {Core.widget.Menu} menu The menu
     * @param {Object} item Selected menu item
     * @param {Grid.column.Column} column Column
     * @param {Boolean} checked Checked or not
     */

    //endregion

    onElementKeyDown(event) {
        const me = this;

        if (!event.handled && event.target.matches('.b-grid-header.b-depth-0')) {
            switch (event.key) {
                case ' ':
                case 'ArrowDown':
                    this.internalShowContextMenu(me.createContextMenuEventForElement(event.target));
                    break;
            }
        }
    }

    //region Menu handlers

    shouldShowMenu(eventParams) {
        const { column } = eventParams;

        // TODO: remove "this._showForTimeAxis || " when support for HeaderContextMenu feature in Scheduler is dropped.
        return column && column.enableHeaderContextMenu !== false && (this._showForTimeAxis || column !== this.client.timeAxisColumn);
    }

    // TODO: remove "showContextMenu" override completely when support for HeaderContextMenu feature in Scheduler is dropped.
    showContextMenu(eventParams) {
        const
            me = this,
            { column } = eventParams;

        // super.showContextMenu(...arguments);

        // if (column === me.client.timeAxisColumn && me.menu) {
        //     // the TimeAxis's context menu probably will cause scrolls because it manipulates the dates.
        //     // The menu should not hide on scroll when for a TimeAxisColumn
        //     me.menu.scrollAction = 'realign';
        // }
    }

    getDataFromEvent(event) {
        return ObjectHelper.assign(super.getDataFromEvent(event), this.client.getHeaderDataFromEvent(event));
    }

    getSpecifiedItems(eventParams) {
        const
            items = super.getSpecifiedItems(eventParams),
            { column }  = eventParams;

        if (column && column.headerMenuItems) {
            if (Array.isArray(column.headerMenuItems)) {
                VersionHelper.deprecate('Grid', '5.0.0', '`headerMenuItems` column config specified as an array is deprecated, need to specify the config as a named object. Please see https://bryntum.com/docs/grid/#guides/upgrades/3.1.0.md for more information.');
            }

            // Array works smoothly since number index turns into a key for named object
            ObjectHelper.merge(items, column.headerMenuItems);
        }

        return items;
    }

}

HeaderMenu.featureClass = '';

GridFeatureManager.registerFeature(HeaderMenu, true);
