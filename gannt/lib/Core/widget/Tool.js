import Widget from './Widget.js';
import EventHelper from '../helper/EventHelper.js';

/**
 * @module Core/widget/Tool
 */

/**
 * Base class for tools.
 *
 * May be configured with a `cls` and a `handler` which is a function (or name of a function)
 * in the owning Panel.
 * @extends Core/widget/Widget
 *
 * @classType tool
 */
export default class Tool extends Widget {

    static get $name() {
        return 'Tool';
    }

    // Factoryable type name
    static get type() {
        return 'tool';
    }

    // Align is a simple string at this level
    static get configurable() {
        return {
            align : {
                value   : null,
                $config : {
                    merge : 'replace'
                }
            }
        };
    }

    changeAlign(align) {
        return align;
    }

    template() {
        return `<div class="b-icon b-align-${this.align || 'end'}"></div>`;
    }

    construct(config) {
        super.construct(config);

        EventHelper.on({
            element   : this.element,
            click     : 'onClick',
            mousedown : 'onMousedown',
            thisObj   : this
        });
    }

    onClick(e) {
        const { handler, panel } = this;

        if (panel.trigger('toolclick', {
            domEvent : e,
            tool     : this
        }) !== false) {
            handler && this.callback(handler, panel, [e]);
        }
    }

    onMousedown(e) {
        const panel = this.panel,
            focusEl = panel.focusElement;

        e.preventDefault();
        if (focusEl && document.activeElement !== focusEl) {
            panel.focus();
        }
    }

    get panel() {
        return this.parent;
    }
}

// Register this widget type with its Factory
Tool.initClass();
