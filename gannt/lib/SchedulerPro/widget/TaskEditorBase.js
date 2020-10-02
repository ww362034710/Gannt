import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import Popup from '../../Core/widget/Popup.js';
import Toast from '../../Core/widget/Toast.js';
import Widget from '../../Core/widget/Widget.js';
import ReadyStatePropagator from '../widget/taskeditor/mixin/ReadyStatePropagator.js';
import '../localization/En.js';

/**
 * @module SchedulerPro/widget/TaskEditorBase
 */

/**
 * Abstract base class for Scheduler and Gantt task editors
 *
 * @extends Core/widget/Popup
 */
export default class TaskEditorBase extends ReadyStatePropagator(Popup) {

    //region Config

    static get $name() {
        return 'TaskEditorBase';
    }

    static get defaultConfig() {
        return {
            title     : 'L{Information}',
            width     : this.localize('L{editorWidth}'),
            cls       : 'b-schedulerpro-taskeditor',
            closable  : true,
            draggable : {
                handleSelector : ':not(button,.b-field-inner)' // blacklist butons and field inners
            },
            axisLock  : 'flexible',
            autoClose : true,
            onChange  : null,
            onCancel  : null,
            onSave    : null,
            autoShow  : false,
            // Required to save editor widget height when switching between tabs, some of which may want to stretch it
            //height    : '30em',

            closeAction  : 'cancelAndHide',
            scrollAction : 'realign',

            items : null, // overriden in subclasses

            bbar : {
                defaults : {
                    localeClass : this
                },

                items : {
                    saveButton : {
                        text   : 'L{Save}',
                        color  : 'b-green',
                        weight : 100
                    },
                    deleteButton : {
                        text   : 'L{Delete}',
                        color  : 'b-gray',
                        weight : 200
                    },
                    cancelButton : {
                        text   : 'L{Object.Cancel}',
                        color  : 'b-gray',
                        weight : 300
                    }
                }
            },

            /**
             * The decimal precision to use for Duration field / columns, normally provided by the owning Scheduler´s {@link SchedulerPro.view.SchedulerPro#config-durationDisplayPrecision}
             */
            durationDisplayPrecision : 1,

            // TODO: Deprecate
            /**
             * Config object specifying widgets for tabs in task editor. Every tab accepts array of widgets/widget configs.
             * Tab names are:
             *  * schedulergeneraltab
             *  * generaltab
             *  * predecessorstab
             *  * successorstab
             *  * resourcestab
             *  * scheduleradvancedtab
             *  * advancedtab
             *  * notestab
             *
             *  Example:
             * ```
             * new SchedulerPro({
             *   features : {
             *     taskEdit : {
             *       editorConfig : {
             *         extraItems : {
             *           generaltab : [
             *             { type : 'button', text : 'My Button' },
             *             ...
             *           ]
             *         }
             *       }
             *     }
             *   }
             * });
             * ```
             * @config {Object}
             */
            extraItems : null,

            // TODO: Deprecate
            /**
             * A configuration object used to configure the built-in tabs or to add custom tab(s).
             * The individual configuration objects of the tabs contained in {@link #config-tabsConfig tabsConfig}
             * are keyed by tab names and are merged with the default built-in configurations.
             *
             *
             * Built-in tab names are:
             *  * schedulergeneraltab
             *  * generaltab
             *  * predecessorstab
             *  * successorstab
             *  * resourcestab
             *  * scheduleradvancedtab
             *  * advancedtab
             *  * notestab
             *
             * The built-in tabs can be individually switched on or off, customized,
             * or new custom tab(s) can be added.
             *
             * Example:
             * ```
             * new SchedulerPro({
             *   features : {
             *     taskEdit : {
             *       tabsConfig : {
             *         // change title of General tab
             *         generaltab : {
             *           title : 'Common'
             *         },
             *
             *         // remove Notes tab
             *         notestab : false,
             *
             *         // add custom Files tab
             *         filestab : { type : 'filestab' },
             *         ...
             *       }
             *     }
             *   }
             * });
             * ```
             *
             * @config {Object}
             */
            tabsConfig : null,

            tabPanelItems : null,

            /**
             * This config has been deprecated in favour of {@link #config-extraItems}.
             * @deprecated 1.0.1
             * @config {String|Object[]}
             * @category Editor widgets
             */
            extraWidgets : null,

            defaultTabs : null,

            project : null
        };
    }

    //endregion

    //region Internal

    get extraWidgets() {
        console.warn('`extraWidgets` was deprecated in 1.0.1, please change your code to use `extraItems`');
        return this.extraItems;
    }

    set extraWidgets(widgets) {
        console.warn('`extraWidgets` was deprecated in 1.0.1, please change your code to use `extraItems`');
        this.extraItems = widgets;
    }

    // This method is called for every child widget in the task editor
    processWidgetConfig(widgetConfig) {
        if (widgetConfig.ref === 'deleteButton' && !this.showDeleteButton) return false;

        return widgetConfig;
    }

    // Called before instances of items are created. Implements support of tabsConfig.
    startConfigure(config) {
        const
            { tabPanelItems } = config,
            tabPanel          = config.items.find(w => w.ref === 'tabs');

        ObjectHelper.merge(tabPanel.items, tabPanelItems);

        // const
        //     tabsConfig = config.tabsConfig || {},
        //     tabs       = ObjectHelper.clone(config.defaultTabs);
        //
        // Object.keys(tabsConfig).forEach(tabType => {
        //     let index;
        //     const
        //         config = tabsConfig[tabType],
        //         tab    = tabs.find((t, i) => {
        //             index = i;
        //             return (tabType || '').toLowerCase() === t.type;
        //         });
        //
        //     if (tab) {
        //         // remove unwanted tab
        //         if (config === false) {
        //             tabs.splice(index, 1);
        //         }
        //         // apply custom config to the default tab
        //         else if (typeof (config) === 'object') {
        //             Object.assign(tab, config);
        //         }
        //     }
        //     // add the custom tab
        //     else {
        //         tabs.push(config);
        //     }
        // });
        //
        // // mutate tabpanel config
        // config.items[0].items = tabs;
        //
        // super.startConfigure(config);
    }

    afterConfigure() {
        const
            me                                         = this,
            widgetMap                                  = me.widgetMap,
            bbarWidgets                                = (me.bbar && me.bbar.widgetMap) || {},
            { cancelButton, deleteButton, saveButton } = bbarWidgets;

        saveButton?.on('click', me.onSaveClick, me);
        cancelButton?.on('click', me.onCancelClick, me);
        deleteButton?.on('click', me.onDeleteClick, me);

        Object.values(widgetMap).forEach(widget => {
            // if (w.isEventChangePropagator) {
            //     w.on('requestPropagation', me.onPropagationRequested, me);
            // }

            if (widget.isDurationField) {
                widget.decimalPrecision = this.durationDisplayPrecision;
            }
            else if (widget.ref === 'startDate' || widget.ref === 'endDate') {
                widget.project = this.project;
            }
            else if (widget.ref === 'predecessorsTab' || widget.ref === 'successorsTab') {
                widget.grid.durationDisplayPrecision = this.durationDisplayPrecision;
            }

            if (widget.isReadyStatePropagator) {
                widget.on('readystatechange', me.onReadyStateChange, me);
            }
        });

        widgetMap.tabs.on({
            beforeActiveItemChange : 'onBeforeTabChange',
            thisObj                : me
        });
    }

    get canSave() {
        let canSave = true;

        // If widget report it can't both save and cancel then there's no reason to walk through others
        Object.values(this.widgetMap).forEach(w => {
            if (w.isReadyStatePropagator) {
                canSave = canSave && w.canSave;
            }
        });

        return canSave;
    }

    get canCancel() {
        let canCancel = true;

        // If widget report it can't both save and cancel then there's no reason to walk through others
        Object.values(this.widgetMap).forEach(w => {
            if (w.isReadyStatePropagator) {
                canCancel = canCancel && w.canCancel;
            }
        });

        return canCancel;
    }

    cancelAndHide() {
        // this handler will trigger 'cancel' event, which is caught by taskedit feature, which will cancel changes
        // and that cancel also hides editor
        this.onCancelClick();
    }

    /**
     * Loads a task model into the editor
     *
     * @param {SchedulerPro.model.EventModel} record
     */
    loadEvent(record) {
        // Not using .record to not trigger containers record behaviour
        // TODO: Why not rely on that?
        this.loadedRecord = record;

        this.callWidgetHook('loadEvent', record);

        this.detachListeners('project');

        record.project.on({
            name         : 'project',
            beforeCommit : 'onProjectBeforeCommit',
            dataReady    : 'onProjectDataReady',
            thisObj      : this
        });
    }

    callWidgetHook(name, ...args) {
        this.eachWidget(w => {
            if (typeof w[name] === 'function') {
                w[name](...args);
            }
        });
    }

    //endregion

    //region Events

    // General tab determines the height of the other tabs
    onBeforeTabChange({ source : tabs, prevActiveItem }) {
        const { generalTab } = this.widgetMap;

        if (prevActiveItem === generalTab) {
            tabs.eachWidget(tab => {
                if (tab !== generalTab) {
                    tab.height = generalTab.height;
                }
            }, false);
        }
    }

    onSaveClick() {

        if (this.canSave) {
            this.trigger('save');
        }
        else {
            Toast.show({
                html : this.L('L{saveError}')
            });
        }
    }

    onCancelClick() {
        // Close, Cancel and clicking outside all leads here
        this.detachListeners('project');

        this.trigger('cancel');
    }

    onDeleteClick() {
        this.trigger('delete');
    }

    onPropagationRequested() {
        this.trigger('requestPropagation');
    }

    onReadyStateChange({ source, canSave }) {
        this.requestReadyStateChange();

        if (!source.couldSaveTitle) {
            source.couldSaveTitle = source.title;
        }

        if (source.parent === this.widgetMap.tabs) {
            if (canSave) {
                source.titleElement.classList.remove('b-invalid');
                source.title = source.couldSaveTitle;
                source.couldSaveTitle = null;
            }
            else {
                source.titleElement.classList.add('b-invalid');
                source.title = `<span class='b-icon b-icon-warning'></span>${source.couldSaveTitle}`;
            }
        }
    }

    onProjectBeforeCommit() {
        this.mask({
            text      : 'Calculating…',
            showDelay : 100
        });
    }

    onProjectDataReady({ records }) {
        this.unmask();

        if (records.has(this.loadedRecord)) {
            this.callWidgetHook('afterProjectChange');
        }
    }

    beforeSave() {
        this.callWidgetHook('beforeSave');
    }

    afterSave() {
        this.callWidgetHook('afterSave');
    }

    beforeCancel() {
        this.callWidgetHook('beforeCancel');
    }

    afterCancel() {
        this.callWidgetHook('afterCancel');
    }

    beforeDelete() {
        this.callWidgetHook('beforeDelete');
    }

    afterDelete() {
        this.callWidgetHook('afterDelete');
    }

    onInternalKeyDown(event) {
        if (event.key === 'Enter' && this.eventEditFeature.saveAndCloseOnEnter && event.target.tagName.toLowerCase() === 'input') {
            if (event.target.matches('input')) {

                // Enter might have been pressed right after field editing so we need to process the changes (Fix for #166)
                const field = Widget.fromElement(event.target);
                if (field?.internalOnChange) {
                    field.internalOnChange();
                }
            }

            // this prevents field events so the new value would not be processed without above call to internalOnChange
            // Need to prevent this key events from being fired on whatever receives focus after the editor is hidden
            event.preventDefault();

            this.onSaveClick();
        }

        super.onInternalKeyDown(event);
    }
    //endregion

    //region Localization

    updateLocalization() {
        this.width = this.L('L{editorWidth}');
        super.updateLocalization(...arguments);
    }

    //endregion

    updateReadOnly(readOnly) {
        const
            {
                deleteButton,
                saveButton,
                cancelButton
            } = this.widgetMap;

        super.updateReadOnly(readOnly);

        if (deleteButton) {
            deleteButton.hidden = readOnly;
        }

        if (saveButton) {
            saveButton.hidden = readOnly;
        }

        if (cancelButton) {
            cancelButton.hidden = readOnly;
        }
    }
}

// Register this widget type with its Factory
TaskEditorBase.initClass();
