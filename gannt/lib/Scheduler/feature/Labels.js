import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import EventHelper from '../../Core/helper/EventHelper.js';
import Editor from '../../Core/widget/Editor.js';

/**
 * @module Scheduler/feature/Labels
 */

const
    sides = [
        'top',
        'left',
        'right',
        'bottom'
    ],
    editorAlign = {
        top    : 'b-b',
        right  : 'l-l',
        bottom : 't-t',
        left   : 'r-r'
    },
    topBottom = {
        top    : 1,
        bottom : 1
    };

/**
 * Displays labels at positions {@link #config-top}, {@link #config-right}, {@link #config-bottom} and {@link #config-left}.
 *
 * Text in labels can be set from a field on the {@link Scheduler.model.EventModel EventModel}
 * or the {@link Scheduler.model.ResourceModel ResourceModel} or using a custom renderer.
 *
 * Since `top` and `bottom` labels occupy space that would otherwise be used by the event we recommend using bigger rowHeights
 * (>55px for both labels with default styling) and zero barMargins because `top`/`bottom` labels give space around events anyway.
 *
 * This feature is **disabled** by default. It is **not** supported in vertical mode.
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Scheduler/labels
 * @externalexample scheduler/Labels.js
 * @classtype labels
 */
export default class Labels extends InstancePlugin {
    //region Config

    static get $name() {
        return 'Labels';
    }

    static get defaultConfig() {
        return {
            /**
             * CSS class to apply to label elements
             * @config {String}
             * @default
             */
            labelCls : 'b-sch-label',

            /**
             * Top label configuration object. May contain the following properties:
             * @param {String} field The name of a field in one of the associated records,
             *   {@link Scheduler.model.EventModel EventModel} or {@link Scheduler.model.ResourceModel ResourceModel}.
             *   The record from which the field value is drawn will be ascertained by checking for field definitions by
             *   the specified name.
             * @param {Function} renderer A function, which when passed an object containing `eventRecord`,
             *   `resourceRecord`, `assignmentRecord` and `domConfig` properties, returns the HTML to display as the
             *   label
             * @param {Object} thisObj The `this` reference to use in the `renderer`.
             * @param {Object|Core.widget.Field} editor If the label is to be editable, a field configuration object
             *   with a `type` property, or an instantiated Field. **The `field` property is mandatory for editing to
             *   work**.
             * @config {Object}
             * @default
             */
            top : null,

            /**
             * Right label configuration object. May contain the following properties:
             * @param {String} field The name of a field in one of the associated records,
             *   {@link Scheduler.model.EventModel EventModel} or {@link Scheduler.model.ResourceModel ResourceModel}.
             *   The record from which the field value is drawn will be ascertained by checking for field definitions by
             *   the specified name.
             * @param {Function} renderer A function, which when passed an object containing `eventRecord`,
             *   `resourceRecord`, `assignmentRecord` and `domConfig` properties, returns the HTML to display as the
             *   label
             * @param {Object} thisObj The `this` reference to use in the `renderer`.
             * @param {Object|Core.widget.Field} editor If the label is to be editable, a field configuration object
             *   with a `type` property, or an instantiated Field. **The `field` property is mandatory for editing to
             *   work**.
             * @config {Object}
             * @default
             */
            right : null,

            /**
             * Bottom label configuration object. May contain the following properties:
             * @param {String} field The name of a field in one of the associated records,
             *   {@link Scheduler.model.EventModel EventModel} or {@link Scheduler.model.ResourceModel ResourceModel}.
             *   The record from which the field value is drawn will be ascertained by checking for field definitions by
             *   the specified name.
             * @param {Function} renderer A function, which when passed an object containing `eventRecord`,
             *   `resourceRecord`, `assignmentRecord` and `domConfig` properties, returns the HTML to display as the
             *   label
             * @param {Object} thisObj The `this` reference to use in the `renderer`.
             * @param {Object|Core.widget.Field} editor If the label is to be editable, a field configuration object
             *   with a `type` property, or an instantiated Field. **The `field` property is mandatory for editing to
             *   work**.
             * @config {Object}
             * @default
             */
            bottom : null,

            /**
             * Left label configuration object. May contain the following properties:
             * @param {String} field The name of a field in one of the associated records,
             *   {@link Scheduler.model.EventModel EventModel} or {@link Scheduler.model.ResourceModel ResourceModel}.
             *   The record from which the field value is drawn will be ascertained by checking for field definitions by
             *   the specified name.
             * @param {Function} renderer A function, which when passed an object containing `eventRecord`,
             *   `resourceRecord`, `assignmentRecord` and `domConfig` properties, returns the HTML to display as the
             *   label
             * @param {Object} thisObj The `this` reference to use in the `renderer`.
             * @param {Object|Core.widget.Field} editor If the label is to be editable, a field configuration object
             *   with a `type` property, or an instantiated Field. **The `field` property is mandatory for editing to
             *   work**.
             * @config {Object}
             * @default
             */
            left : null,

            thisObj : null,

            /**
             * What action should be taken when focus moves leaves the cell editor, for example when clicking outside.
             * May be `'complete'` or `'cancel`'.
             * @config {String}
             * @default
             */
            blurAction : 'cancel'
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['onEventDataGenerated']
        };
    }

    //endregion

    //region Init & destroy

    construct(scheduler, config) {
        const me = this;

        if (scheduler.isVertical) {
            throw new Error('Labels feature is not supported in vertical mode');
        }

        me.scheduler = scheduler;

        super.construct(scheduler, config);

        if (me.top || me.bottom || me.left || me.right) {
            me.updateHostClasslist();

            // rowHeight warning, not in use
            //const labelCount = !!me.topLabel + !!me.bottomLabel;
            //if (scheduler.rowHeight < 60 - labelCount * 12) console.log('')
        }
    }

    updateHostClasslist() {
        const
            { top, bottom } = this,
            { classList }   = this.scheduler.element;

        classList.remove('b-labels-topbottom');
        classList.remove('b-labels-top');
        classList.remove('b-labels-bottom');

        // OR is correct. This means that there are labels above OR below.
        if (top || bottom) {
            classList.add('b-labels-topbottom');
            if (top) {
                classList.add('b-labels-top');
            }
            if (bottom) {
                classList.add('b-labels-bottom');
            }
        }
    }

    onLabelDblClick(event) {
        const
            me        = this,
            target    = event.target;

        if (target && !me.scheduler.readOnly) {
            const
                { side }          = target.dataset,
                labelConfig       = me[side],
                { editor, field } = labelConfig;

            if (editor) {
                const eventRecord = this.scheduler.resolveEventRecord(event.target);

                if (!(editor instanceof Editor)) {
                    labelConfig.editor = new Editor({
                        appendTo     : me.scheduler.element,
                        blurAction   : me.blurAction,
                        inputField   : editor,
                        scrollAction : 'realign'
                    });
                }

                labelConfig.editor.startEdit({
                    target,
                    align     : editorAlign[side],
                    matchSize : false,
                    record    : eventRecord,
                    field
                });

                event.stopImmediatePropagation();
                return false;
            }
        }
    }

    set top(top) {
        this._top = this.processLabelSpec(top, 'top');
        this.updateHostClasslist();
    }

    get top() {
        return this._top;
    }

    set right(right) {
        this._right = this.processLabelSpec(right, 'right');
        this.updateHostClasslist();
    }

    get right() {
        return this._right;
    }

    set bottom(bottom) {
        this._bottom = this.processLabelSpec(bottom, 'bottom');
        this.updateHostClasslist();
    }

    get bottom() {
        return this._bottom;
    }

    set left(left) {
        this._left = this.processLabelSpec(left, 'left');
        this.updateHostClasslist();
    }

    get left() {
        return this._left;
    }

    processLabelSpec(labelSpec, side) {
        if (typeof labelSpec === 'function') {
            labelSpec = {
                renderer : labelSpec
            };
        }
        else if (typeof labelSpec === 'string') {
            labelSpec = {
                field : labelSpec
            };
        }
        // Allow us to mutate ownProperties in the labelSpec without mutating outside object
        else if (labelSpec) {
            labelSpec = Object.setPrototypeOf({}, labelSpec);
        }
        else {
            return;
        }

        const
            { scheduler }                                = this,
            { eventStore, resourceStore, taskStore, id } = scheduler,
            { field, editor }                            = labelSpec;

        // If there are milestones, and we are changing the available height
        // either by adding a top/bottom label, or adding a top/bottom label
        // then during the next dependency refresh, milestone width must be recalculated.
        if (topBottom[side]) {
            scheduler.milestoneWidth = null;
        }

        if (eventStore && !taskStore) {
            labelSpec.recordType = 'event';
        }
        else {
            labelSpec.recordType = 'task';
        }

        // Find the field definition or property from whichever store and cache the type.
        if (field) {
            let
                fieldDef,
                fieldFound = false;

            if (eventStore && !taskStore) {
                fieldDef = eventStore.modelClass.fieldMap[field];
                if (fieldDef) {
                    labelSpec.fieldDef = fieldDef;
                    labelSpec.recordType = 'event';
                    fieldFound = true;
                }
                // Check if it references a property
                else if (Reflect.has(eventStore.modelClass.prototype, field)) {
                    labelSpec.recordType = 'event';
                    fieldFound = true;
                }
            }

            if (!fieldDef && taskStore) {
                fieldDef = taskStore.modelClass.fieldMap[field];
                if (fieldDef) {
                    labelSpec.fieldDef = fieldDef;
                    labelSpec.recordType = 'task';
                    fieldFound = true;
                }
                // Check if it references a property
                else if (Reflect.has(resourceStore.modelClass.prototype, field)) {
                    labelSpec.recordType = 'task';
                    fieldFound = true;
                }
            }

            if (!fieldDef && resourceStore) {
                fieldDef = resourceStore.modelClass.fieldMap[field];
                if (fieldDef) {
                    labelSpec.fieldDef = fieldDef;
                    labelSpec.recordType = 'resource';
                    fieldFound = true;
                }
                // Check if it references a property
                else if (Reflect.has(resourceStore.modelClass.prototype, field)) {
                    labelSpec.recordType = 'resource';
                    fieldFound = true;
                }
            }
            //<debug>
            // We couldn't find the requested field in the modelClass
            // for either of the stores.
            if (!fieldFound) {
                throw new Error(`Scheduler ${id} labels ${side} field ${field} does not exist in either eventStore or resourceStore`);
            }
            //</debug>

            if (editor) {
                if (typeof editor === 'boolean') {
                    scheduler.editor = {
                        type : 'textfield'
                    };
                }
                else if (typeof editor === 'string') {
                    scheduler.editor = {
                        type : editor
                    };
                }
                EventHelper.on({
                    element  : scheduler.timeAxisSubGrid.element,
                    delegate : '.b-sch-label',
                    dblclick : 'onLabelDblClick',
                    thisObj  : this
                });
            }
        }

        //<debug>
        if (!labelSpec.field && !labelSpec.renderer) {
            throw new Error(`Scheduler ${scheduler.id} labels ${side} must either have a field or a renderer`);
        }
        //</debug>

        return labelSpec;
    }

    doDisable(disable) {
        super.doDisable(disable);

        if (this.client.isPainted) {
            this.client.refresh();
        }
    }

    //endregion

    onEventDataGenerated(data) {
        const me = this;

        if (!me.disabled) {
            // Insert all configured labels
            for (const side of sides) {
                if (me[side]) {
                    const
                        {
                            field,
                            fieldDef,
                            recordType,
                            renderer,
                            thisObj
                        }  = me[side],
                        domConfig = {
                            tag       : 'label',
                            className : {
                                [me.labelCls]              : 1,
                                [`${me.labelCls}-${side}`] : 1
                            },
                            dataset : {
                                side,
                                taskFeature : `label-${side}`
                            }
                        };

                    let value;

                    const
                        eventRecordProperty = `${recordType}Record`,
                        eventRecord         = data[eventRecordProperty];

                    // If there's a renderer, use that by preference
                    if (renderer) {
                        value = renderer.call(thisObj || me.thisObj || me, {
                            [eventRecordProperty] : eventRecord,
                            resourceRecord        : data.resourceRecord,
                            assignmentRecord      : data.assignmentRecord,
                            domConfig
                        });
                    }
                    else {
                        value = eventRecord[field];

                        // If it's a date, format it according to the Scheduler's defaults
                        if (fieldDef && fieldDef.type === 'date' && !renderer) {
                            value = DateHelper.format(value, me.client.displayDateFormat);
                        }
                    }

                    domConfig.html = value || '\xa0';

                    data.wrapperChildren.push(domConfig);
                }
            }
        }
    }
}

// TODO: Refactor the SASS, so that the auto-generated class name of ''b-' + cls.name.toLowerCase() can be used.
Labels.featureClass = 'b-sch-labels';

GridFeatureManager.registerFeature(Labels, false, 'Scheduler');
