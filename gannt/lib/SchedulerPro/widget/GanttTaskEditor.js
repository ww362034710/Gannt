/**
 * @module SchedulerPro/widget/GanttTaskEditor
 */
import TaskEditorBase from './TaskEditorBase.js';
import './taskeditor/GeneralTab.js';
import './taskeditor/SuccessorsTab.js';
import './taskeditor/PredecessorsTab.js';
import './taskeditor/ResourcesTab.js';
import './taskeditor/AdvancedTab.js';
import './taskeditor/NotesTab.js';
import '../../Core/widget/TabPanel.js';

/**
 * {@link SchedulerPro/widget/TaskEditorBase} subclass for Gantt projects which SchedulerPro can handle as well.
 *
 * @extends SchedulerPro/widget/TaskEditorBase
 */
export default class GanttTaskEditor extends TaskEditorBase {
    // Factoryable type name
    static get type() {
        return 'gantttaskeditor';
    }

    //region Config

    static get $name() {
        return 'GanttTaskEditor';
    }

    static get defaultConfig() {
        return {
            items : [
                {
                    type : 'tabpanel',
                    ref  : 'tabs',
                    flex : '1 0 100%',

                    layoutConfig : {
                        alignItems   : 'stretch',
                        alignContent : 'stretch'
                    },

                    namedItems : {
                        generalTab      : { type : 'generaltab' },
                        predecessorsTab : { type : 'predecessorstab' },
                        successorsTab   : { type : 'successorstab' },
                        resourcesTab    : { type : 'resourcestab' },
                        advancedTab     : { type : 'advancedtab' },
                        notesTab        : { type : 'notestab' }
                    },

                    items : {
                        generalTab      : true,
                        predecessorsTab : true,
                        successorsTab   : true,
                        resourcesTab    : true,
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
GanttTaskEditor.initClass();
