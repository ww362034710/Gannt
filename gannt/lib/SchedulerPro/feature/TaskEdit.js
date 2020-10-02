import Delayable from '../../Core/mixin/Delayable.js';
import ProTaskEditStm from './mixin/ProTaskEditStm.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import Field from '../../Core/widget/Field.js';
import MessageDialog from '../../Core/widget/MessageDialog.js';
import Widget from '../../Core/widget/Widget.js';
import '../widget/GanttTaskEditor.js';
import '../widget/SchedulerTaskEditor.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import { ProjectType } from '../../Engine/scheduling/Types.js';

/**
 * @module SchedulerPro/feature/TaskEdit
 */

/**
 * The Scheduler Pro task editor feature enables a popup window activated when double clicking a task bar, or through
 * the {@link Scheduler.feature.EventMenu}
 *
 * {@inlineexample schedulerpro/feature/TaskEdit.js}
 *
 * <h2>Customizing tabs</h2>
 * For information on how to customize the contents of the editor, please see {@link #config-items} and
 * {@link #config-editorConfig}
 *
 * {@inlineexample schedulerpro/feature/TaskEditExtraItems.js}
 *
 * To turn off the Task Editor, disable the feature:
 *
 * ```javascript
 * new SchedulerPro ({
 *     features : {
 *         taskEdit : false
 *     }
 *     ...
 * })
 * ```
 *
 * @extends Core/mixin/InstancePlugin
 * @mixes SchedulerPro/feature/mixin/ProTaskEditStm
 * @mixes Core/mixin/Delayable
 * @demo taskeditor
 * @classtype taskEdit
 */
export default class TaskEdit extends InstancePlugin.mixin(
    Delayable,
    ProTaskEditStm
) {

    //region Config

    static get $name() {
        return 'TaskEdit';
    }

    static get pluginConfig() {
        return {
            chain  : ['getEventMenuItems', 'onEventEnterKey'],
            assign : ['editEvent']
        };
    }

    static get defaultConfig() {
        return {
            /**
             * The event that shall trigger showing the editor. Defaults to `eventdblclick`, set to `` or null to disable editing of existing events.
             * @config {String}
             * @default
             * @category Editor
             */
            triggerEvent : 'eventdblclick',

            /**
             * Project type to editor class map.
             *
             * @config {Object}
             * @default
             * @category Editor
             */
            editorClassMap : {
                [ProjectType.SchedulerBasic] : 'schedulertaskeditor',
                [ProjectType.SchedulerPro]   : 'schedulertaskeditor',
                [ProjectType.Gantt]          : 'gantttaskeditor'
            },

            /**
             * Editor class to use, if given will override anything defined in {@link #config-editorClassMap} option.
             *
             * @config {Function}
             * @default
             * @category Editor
             */
            editorClass : null,

            /**
             * A configuration object applied to the internal {@link SchedulerPro.widget.TaskEditorBase TaskEditor}.
             * Useful to for example change the title of the editor or to set its dimensions in code:
             *
             * ```javascript
             * features : {
             *     taskEdit : {
             *         editorConfig : {
             *             title : 'My title',
             *             height : 300
             *         }
             *     }
             * }
             * ```
             *
             * NOTE: The easiest approach to affect editor contents is to use the {@link #config-items items config}.
             *
             *  @config {Object}
             */
            editorConfig : null,

            /**
             * True to show a delete button in the editor.
             * @config {Boolean}
             * @default
             * @category Editor widgets
             */
            showDeleteButton : true,

            /**
             * True to show a confirmation dialog before deleting the event
             * @config {Boolean}
             * @default
             * @category Editor widgets
             */
            confirmDelete : true,

            /**
             * True to save and close this panel if ENTER is pressed in one of the input fields inside the panel.
             * @config {Boolean}
             * @default
             * @category Editor
             */
            saveAndCloseOnEnter : true
        };
    }

    static get configurable() {
        return {
            /**
             * A configuration object used to customize the contents of the task editor. Supply a config object or
             * boolean per tab (listed below) to either affects its contents or toggle it on/off.
             *
             * Supplied config objects will be merged with the tabs predefined configs.
             *
             * Built-in tab names are:
             *  * generalTab
             *  * predecessorsTab
             *  * successorsTab
             *  * advancedTab
             *  * notesTab
             *
             *  ```
             *  features : {
             *      taskEdit : {
             *          items : {
             *              // Custom settings and additional items for the general tab
             *              generalTab : {
             *                  title : 'Common',
             *                  items : {
             *                      durationField : false,
             *                      myCustomField : {
             *                          type : 'text',
             *                          name : 'color'
             *                      }
             *                  }
             *              },
             *              // Hide the advanced tab
             *              advancedTab : false
             *          }
             *      }
             *  }
             *  ```
             *
             *  Please see the `taskeditor` demo for a customized editor in action.
             *  @config {Object}
             */
            items : null
        };
    }

    //endregion

    //region Constructor/Destructor

    construct(scheduler, config) {
        const me = this;

        scheduler.taskEdit = me;

        super.construct(scheduler, config);

        scheduler.on({
            [me.triggerEvent] : 'onActivateEditor',
            readOnly          : 'onClientReadOnlyToggle',
            thisObj           : me
        });
    }

    doDestroy() {
        const me = this;

        me.detachFromProject();

        me.editor && me.editor.destroy();

        super.doDestroy();
    }

    //endregion

    //region Internal

    onClientReadOnlyToggle({ readOnly }) {
        if (this.editor) {
            this.editor.readOnly = readOnly;
        }
    }

    get scheduler() {
        return this.client;
    }

    getElementFromTaskRecord(taskRecord, resourceRecord) {
        return this.client.getElementFromEventRecord(taskRecord, resourceRecord);
    }

    scrollEventIntoView(eventRecord, resourceRecord) {
        this.client.scrollResourceEventIntoView(resourceRecord, eventRecord);
    }

    get isValid() {
        const me = this;

        return me.editor.eachWidget(widget => {
            if (widget.isValid === true || widget.hidden || widget.disabled || (widget instanceof Field && !widget.name)) {
                return true;
            }

            return widget.isValid !== false;
        }, true);
    }

    //endregion

    //region Project

    get project() {
        return this.scheduler.project;
    }

    attachToProject() {
        this.detachFromProject();

        this.project.on({
            name      : 'project',
            loadstart : () => this.save(),
            dataReady : 'onDataReady',
            thisObj   : this
        });
    }

    detachFromProject() {
        this.detachListeners('project');
    }

    //endregion

    onDataReady() {
        const { record } = this;

        // Record could've been removed from project
        if (record?.project) {
            this.load(record);
        }
        else {
            this.save();
        }
    }

    //region Editor

    get isEditing() {
        return !!this._editing;
    }

    onActivateEditor({ eventRecord, resourceRecord }) {
        this.editEvent(eventRecord, resourceRecord);
    }

    /**
     * Shows a {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor}
     * to edit the passed task. This function is exposed on the Scheduler Pro instance and can be called as `scheduler.editTask()`.
     * @param {SchedulerPro.model.EventModel|Function} taskRecord Task to edit or a function returning a task to edit,
     * the function will be executed within an STM transaction which will be canceled in case user presses Cancel button
     * or closes editor w/o hitting Save.
     * @param {SchedulerPro.model.ResourceModel} [resourceRecord] The Resource record for the event. This parameter is
     * required if the event is newly created for a resource and has not been assigned, or when using multi assignment.
     * @param {HTMLElement} [element] Element to anchor editor to (defaults to events element)
     * @return {Promise} Promise which resolves after the editor is shown
     * @async
     */
    async editEvent(taskRecord, resourceRecord = null, element = null) {
        const
            me            = this,
            { scheduler } = me;

        if (!resourceRecord) {
            resourceRecord = taskRecord.resource;
        }

        if (!me.disabled) {

            const { partner } = scheduler;

            if (partner && (partner.editEvent || partner.editTask)) {
                (partner.editEvent || partner.editTask)(taskRecord, resourceRecord, element);
            }
            else {
                const doScrollIntoView = !element;
                me._editing = true;

                me.captureStm();
                me.startStmTransaction();

                // Suspend AjaxStore auto committing for the duration of the edit.
                me.schedulerAutoCommit = scheduler.taskStore.autoCommit;
                scheduler.taskStore.autoCommit = false;

                // Suspend Project auto syncing for the duration of the edit.
                me.schedulerAutoSync = scheduler.project.autoSync;
                scheduler.project.autoSync = false;

                if (typeof taskRecord === 'function') {
                    taskRecord = taskRecord();
                }

                // For programmatic edit calls for an event not currently in view, scroll it into view first
                if (doScrollIntoView && scheduler.taskStore.includes(taskRecord)) {
                    await me.scrollEventIntoView(taskRecord, resourceRecord);
                }

                const
                    taskElement = element || DomHelper.down(
                        me.getElementFromTaskRecord(taskRecord, resourceRecord),
                        scheduler.eventInnerSelector
                    ),
                    editor      = me.getEditor(taskRecord);

                /**
                 * Fires on the owning Scheduler instance before a task is displayed in the editor.
                 * This may be listened to in order to take over the task editing flow. Returning `false`
                 * stops the default editing UI from being shown.
                 * @event beforeTaskEdit
                 * @param {SchedulerPro.view.SchedulerPro} source The Scheduler Pro instance
                 * @param {SchedulerPro.feature.TaskEdit} taskEdit The taskEdit feature
                 * @param {SchedulerPro.model.EventModel} taskRecord The task about to be shown in the editor.
                 * @param {HTMLElement} taskElement The element which represents the task
                 * @preventable
                 */
                if (false !== scheduler.trigger('beforeTaskEdit', {
                    taskEdit : me,
                    taskRecord,
                    taskElement
                })) {

                    // The Promise being async allows a mouseover to trigger the event tip
                    // unless we add the editing class immediately.
                    scheduler.element.classList.add('b-taskeditor-editing');

                    /**
                     * Fires on the owning Scheduler when the editor for an event is available but before it is shown. Allows
                     * manipulating fields etc.
                     * @event beforeTaskEditShow
                     * @param {SchedulerPro.view.SchedulerPro} source The SchedulerPro instance
                     * @param {SchedulerPro.feature.TaskEdit} taskEdit The taskEdit feature
                     * @param {SchedulerPro.model.EventModel} taskRecord The task about to be shown in the editor.
                     * @param {HTMLElement} eventElement The element which represents the task
                     * @param {SchedulerPro.widget.TaskEditorBase} editor The editor
                     */
                    scheduler.trigger('beforeTaskEditShow', {
                        taskEdit : me,
                        taskRecord,
                        taskElement,
                        editor
                    });

                    me.load(taskRecord);
                    me.attachToProject();

                    if (taskElement) {
                        await editor.showBy({
                            target : taskElement,
                            anchor : true,
                            offset : -5
                        });
                    }
                    else {
                        // Display the editor centered in the Scheduler
                        await editor.showBy({
                            target : scheduler.element,
                            anchor : false,
                            // For records not part of the store (new ones, or filtered out ones) - center the editor
                            align  : 'c-c'
                        });
                    }
                }
                else {
                    await me.rejectStmTransaction();
                    me.disableStm();
                    me.freeStm();
                    me._editing = false;
                }
            }
        }
    }

    getEditor(taskRecord = this.record) {
        const
            me          = this,
            project     = taskRecord && taskRecord.project || me.project,
            projectType = project.getType(),
            editorType  = me.editorClass?.type || me.editorClassMap[projectType] || me.editorClassMap[ProjectType.Unknown] || 'schedulertaskeditor';

        if (!me.editor || me.editor.type !== editorType) {

            me.editor && me.editor.destroy();

            me.editor = Widget.create(ObjectHelper.merge({
                type                     : editorType,
                eventEditFeature         : me,
                showDeleteButton         : me.showDeleteButton,
                owner                    : me.client,
                project                  : me.project,
                durationDisplayPrecision : me.client.durationDisplayPrecision,
                //tabsConfig               : me.tabsConfig,
                tabPanelItems            : me.items,
                listeners                : {
                    cancel             : 'onCancel',
                    delete             : 'onDelete',
                    save               : 'onSave',
                    requestPropagation : 'onRequestPropagation',
                    thisObj            : me
                }
            }, me.editorConfig));
        }

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to
        me.editor.readOnly = me.client.readOnly;
        return me.editor;
    }

    //endregion

    //region Actions

    load(taskRecord) {
        const
            me     = this,
            editor = me.getEditor(taskRecord);

        me._loading = true;

        me.record = taskRecord;
        editor.loadEvent(taskRecord);

        me._loading = false;
    }

    async save() {
        const
            me            = this,
            { scheduler } = me;

        if (me._editing) {
            const editor = me.getEditor();

            /**
             * Fires on the owning Scheduler Pro instance before a task is saved
             * @event beforeTaskSave
             * @param {SchedulerPro.view.SchedulerPro} source The Scheduler Pro instance
             * @param {SchedulerPro.model.EventModel} taskRecord The task about to be saved
             * @param {SchedulerPro.widget.TaskEditorBase} editor The editor widget
             * @preventable
             */
            if (!me.isValid || scheduler.trigger('beforeTaskSave', {
                taskRecord : me.record,
                editor     : editor
            }) === false) {
                return;
            }

            me.detachFromProject();

            editor.beforeSave();

            me.commitStmTransaction();

            me.freeStm();

            // afterSave to happen only after the editor is fully invisible.
            editor.hide().then(() => editor.afterSave());

            me.resumeAutoSync(true);

            scheduler.element.classList.remove('b-taskeditor-editing');

            me._editing = false;

            scheduler.trigger('afterTaskEdit', { taskRecord : me.record, editor });
        }
    }

    async cancel() {
        const
            me            = this,
            { scheduler } = me;

        if (me._editing) {
            me._canceling = true;

            me.detachFromProject();

            const
                taskRecord = me.record,
                project    = me.project,
                editor     = me.getEditor();

            editor.beforeCancel();

            await editor.hide();

            // the feature could get destroyed asynchronously
            if (me.isDestroyed) {
                return;
            }

            await me.rejectStmTransaction();

            // the feature could get destroyed asynchronously
            if (me.isDestroyed) {
                return;
            }

            me.disableStm();

            await project.propagateAsync();

            // the feature could get destroyed asynchronously
            if (me.isDestroyed) {
                return;
            }

            me.freeStm();

            editor.afterCancel();

            me.resumeAutoSync(false);

            me.scheduler.element.classList.remove('b-taskeditor-editing');

            me._canceling = false;

            me._editing = false;

            scheduler.trigger('taskEditCanceled', { taskRecord, editor });

            scheduler.trigger('afterTaskEdit', { taskRecord, editor });
        }
    }

    async delete() {
        const
            me     = this,
            editor = me.getEditor();

        /**
         * Fires on the owning Scheduler Pro before a task is deleted, return `false` to prevent it.
         * @event beforeTaskDelete
         * @param {SchedulerPro.view.SchedulerPro} source The Scheduler Pro instance.
         * @param {SchedulerPro.model.EventModel} taskRecord The record about to be deleted
         * @param {SchedulerPro.widget.TaskEditorBase} editor The editor widget
         * @preventable
         */
        if (me.scheduler.trigger('beforeTaskDelete', { taskRecord : me.record, editor }) === false) {
            return;
        }

        // if (project.isPropagating()) {
        //     await project.waitForPropagateCompleted();
        // }

        me.detachFromProject();

        editor.beforeDelete();

        me.record.remove();

        me.freeStm();

        await me.project.commitAsync();

        // the feature could get destroyed asynchronously
        if (me.isDestroyed) {
            return;
        }

        me.resumeAutoSync(true);

        editor.hide();

        editor.afterDelete();

        me.scheduler.element.classList.remove('b-taskeditor-editing');

        me._editing = false;

        me.scheduler.trigger('afterTaskEdit', { editor });
    }

    resumeAutoSync(commit) {
        const
            me            = this,
            { scheduler } = me;

        scheduler.taskStore.autoCommit = me.schedulerAutoCommit;
        if (scheduler.taskStore.autoCommit && commit) {
            scheduler.taskStore.doAutoCommit();
        }

        scheduler.project.autoSync = me.schedulerAutoSync;
        if (scheduler.project.autoSync && commit) {
            scheduler.project.sync();
        }
    }

    //endregion

    //region Events
    onSave() {
        // There's might be propagation requested, so we giving the chance to start propagating
        // before we're doing save commit procedure.
        this.requestAnimationFrame(() => this.save());
    }

    onCancel() {
        // There's might be propagation requested, so we giving the chance to start propagating
        // before we're doing cancel rejection procedure.
        this.requestAnimationFrame(() => this.cancel());
    }

    async onDelete() {
        const me = this;

        if (me.confirmDelete) {
            // TODO: Ask nige about a better solution to prevent popup from closing when showing dialog
            const
                { editor } = me,
                autoClose  = editor.autoClose;

            editor.autoClose = false;

            // TODO : Localize
            const result = await MessageDialog.confirm({
                title   : 'Confirm deletion',
                message : 'Are you sure you want to delete the event?'
            });

            editor.autoClose = autoClose;

            if (result === MessageDialog.yesButton) {
                me.delete();
            }
        }
        else {
            // There's might be propagation requested, so we giving the chance to start propagating
            // before we're doing cancel rejection procedure.
            me.requestAnimationFrame(() => me.delete());
        }
    }

    onRequestPropagation() {
        // TODO: Needed? Scheduled anyway
        this.project.commitAsync();
        // // The propagation start is made asynchronous because it should have the lowest priority,
        // // the propagation might be started by the engine as the result of record property setter call
        // // (like setLag() for example). And then requested manually as the result of one of the tabs
        // // grid cell editing feature editing complete. So we delay, and if the propagation will be run
        // // at the next frame then we just skip.
        // this.requestAnimationFrame(() => {
        //     //if (!project.isPropagating()) {
        //     project.propagateAsync();
        //     //}
        // });
    }

    //endregion

    //region Context menu

    getEventMenuItems({ eventRecord, resourceRecord, items }) {
        if (!this.scheduler.readOnly) {
            items.editEvent = {
                text        : 'L{Edit task}',
                localeClass : this,
                icon        : 'b-icon b-icon-edit',
                weight      : -200,
                disabled    : this.disabled,
                onItem      : () => this.editEvent(eventRecord, resourceRecord)
            };
        }
    }

    // chained from EventNavigation
    onEventEnterKey({ assignmentRecord, eventRecord }) {
        if (assignmentRecord) {
            this.editEvent(eventRecord, assignmentRecord.resource);
        }
        else if (eventRecord) {
            this.editEvent(eventRecord, eventRecord.resource);
        }
    }

    //endregion
}

GridFeatureManager.registerFeature(TaskEdit, true, 'SchedulerPro');//, 'EventEdit');
