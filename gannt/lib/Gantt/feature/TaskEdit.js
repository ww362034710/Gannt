import SchedulerProTaskEdit from '../../SchedulerPro/feature/TaskEdit.js';
import TaskEditor from '../widget/TaskEditor.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module Gantt/feature/TaskEdit
 */

/**
 * Gantt adopted task editor feature
 *
 * {@inlineexample gantt/feature/TaskEdit.js}
 *
 * <h2>Customizing tab widgets</h2>
 * You can append any widgets to the built-in tabs using the {@link Gantt.widget.TaskEditor#config-extraItems} config.
 *
 * {@inlineexample gantt/feature/TaskEditExtraItems.js}
 *
 * <h2>Customizing tabs</h2>
 * The built-in tabs can be turned hidden and custom tabs can be added to the Task Editor using the
 * {@link #config-tabsConfig} config.
 *
 * {@inlineexample gantt/feature/TaskEditCustom.js}
 *
 * To turn off the Task Editor just simple disable the feature.
 *
 * ```javascript
 * new Gantt ({
 *     features : {
 *         taskEdit : false
 *     }
 *     ...
 * })
 * ```
 *
 * @extends SchedulerPro/feature/TaskEdit
 * @demo Gantt/taskeditor
 * @classtype taskEdit
 *
 * @typings SchedulerPro/feature/TaskEdit -> SchedulerPro/feature/SchedulerProTaskEdit
 */
export default class TaskEdit extends SchedulerProTaskEdit {

    static get $name() {
        return 'TaskEdit';
    }

    static get defaultConfig() {
        return {
            /**
             * The event that shall trigger showing the editor. Defaults to `eventdblclick`, set to `` or null to disable editing of existing events.
             * @config {String}
             * @default
             * @category Editor
             */
            triggerEvent : 'taskdblclick',

            saveAndCloseOnEnter : true,

            // TODO : Deprecate
            /**
             * A configuration object used to configure tabs of the task editor which can be used to
             * customize the built-in tabs without changing the whole {@link #config-editorConfig editorConfig}.
             * It is especially useful when only a few tabs should be changed.
             * The individual configuration objects of the tabs contained in {@link #config-tabsConfig tabsConfig}
             * are keyed by tab names and are merged with the default built-in configurations.
             *
             * Built-in tab names are:
             *  * generaltab
             *  * predecessorstab
             *  * successorstab
             *  * resourcestab
             *  * advancedtab
             *  * notestab
             *
             * The built-in tabs can be individually switched on or off, customized,
             * or new custom tab(s) can be added. See {@link Gantt.widget.TaskEditor#config-tabsConfig TaskEditor}
             * for details and also <b>Customizing tabs</b> example above.
             *
             * {@link #config-tabsConfig tabsConfig}
             * object is passed to {@link Gantt.widget.TaskEditor#config-tabsConfig TaskEditor} where it is applied to the built-in and custom tabs.
             *
             * @config {Object}
             */
            tabsConfig : null,

            editorClass : TaskEditor
        };
    }

    static get pluginConfig() {
        return {
            chain  : ['populateTaskMenu', 'onTaskEnterKey'],
            assign : ['editTask']
        };
    }

    /**
     * Shows a {@link Gantt.widget.TaskEditor TaskEditor} to edit the passed task. This function is exposed on
     * the Gantt instance and can be called as `gantt.editTask()`.
     * @param {Gantt.model.TaskModel} taskRecord Task to edit
     * @param {HTMLElement} [element] The task element
     * @return {Promise} Promise which resolves after the editor is shown
     * @async
     */
    editTask(taskRecord, element) {
        return this.editEvent(taskRecord, null, element);
    }

    onActivateEditor({ taskRecord, taskElement }) {
        this.editTask(taskRecord, taskElement);
    }

    getElementFromTaskRecord(taskRecord) {
        return this.client.getElementFromTaskRecord(taskRecord);
    }

    onTaskEnterKey({ taskRecord }) {
        this.editTask(taskRecord);
    }

    //region Context menu

    populateTaskMenu({ taskRecord, resourceRecord, items }) {
        if (!this.client.readOnly) {
            items.editTask = {
                text        : 'L{Gantt.Edit}',
                localeClass : this.client,
                icon        : 'b-icon b-icon-edit',
                weight      : -200,
                disabled    : this.disabled,
                onItem      : () => this.editTask(taskRecord)
            };
        }
    }

    //endregion

    onEventEnterKey({ taskRecord, target }) {
        this.editTask(taskRecord);
    }

    scrollTaskIntoView(taskRecord) {
        this.scrollEventIntoView(taskRecord);
    }

    scrollEventIntoView(eventRecord) {
        this.client.scrollTaskIntoView(eventRecord);
    }
}

GridFeatureManager.registerFeature(TaskEdit, true, 'Gantt');
