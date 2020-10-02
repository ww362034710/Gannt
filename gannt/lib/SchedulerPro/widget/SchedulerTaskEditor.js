/**
 * @module SchedulerPro/widget/SchedulerTaskEditor
 */
import TaskEditorBase from './TaskEditorBase.js';
import './taskeditor/SchedulerGeneralTab.js';
import './taskeditor/SuccessorsTab.js';
import './taskeditor/PredecessorsTab.js';
import './taskeditor/ResourcesTab.js';
import './taskeditor/SchedulerAdvancedTab.js';
import './taskeditor/NotesTab.js';

/**
 * {@link SchedulerPro/widget/TaskEditorBase} subclass for simplified SchedulerPro projects.
 *
 * Provides a UI to edit tasks in a dialog. To append Widgets to any of the built-in tabs, use the `extraItems` config.
 *
 * Built-in tab names are:
 *  * schedulergeneraltab
 *  * predecessorstab
 *  * successorstab
 *  * scheduleradvancedtab
 *  * notestab
 *
 * Example:
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
 *       },
 *       tabsConfig : {
 *         // change title of General tab
 *         schedulergeneraltab : {
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
 * @externalexample schedulerpro/widget/SchedulerTaskEditor.js
 *
 * @extends SchedulerPro/widget/TaskEditorBase
 */
export default class SchedulerTaskEditor extends TaskEditorBase {
    // Factoryable type name
    static get type() {
        return 'schedulertaskeditor';
    }

    //region Config

    static get $name() {
        return 'SchedulerTaskEditor';
    }

    static get defaultConfig() {
        return {
            width : this.L('editorWidth'),

            items : [
                {
                    type        : 'tabpanel',
                    ref         : 'tabs',
                    flex        : '1 0 100%',
                    defaultType : 'formtab',

                    layoutConfig : {
                        alignItems   : 'stretch',
                        alignContent : 'stretch'
                    },

                    namedItems : {
                        generalTab      : { type : 'schedulergeneraltab' },
                        predecessorsTab : { type : 'predecessorstab' },
                        successorsTab   : { type : 'successorstab' },
                        // Replaced with combo on general tab
                        //{ type : 'resourcestab' },
                        advancedTab     : { type : 'scheduleradvancedtab' },
                        notesTab        : { type : 'notestab' }
                    },

                    items : {
                        generalTab      : true,
                        predecessorsTab : true,
                        successorsTab   : true,
                        advancedTab     : true,
                        notesTab        : true
                    }
                }
            ]
        };
    }

    //endregion

}

// Register this widget type with its Factory
SchedulerTaskEditor.initClass();
