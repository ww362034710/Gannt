import FormTab from './FormTab.js';
import '../../../Core/widget/TextAreaField.js';

/**
 * @module SchedulerPro/widget/taskeditor/NotesTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the notes for an event or task.
 *
 * @extends SchedulerPro/widget/taskeditor/FormTab
 * @classtype notestab
 * @internal
 */
export default class NotesTab extends FormTab {

    static get $name() {
        return 'NotesTab';
    }

    // Factoryable type name
    static get type() {
        return 'notestab';
    }

    static get defaultConfig() {
        return {
            title : '<i class="b-icon b-icon-note" data-btip="L{Notes}"></i>',
            cls   : 'b-notes-tab',

            layoutConfig : {
                alignItems   : 'flex-start',
                alignContent : 'stretch'
            },

            namedItems : {
                noteField : {
                    type : 'textareafield',
                    cls  : 'b-taskeditor-notes-field',
                    name : 'note'
                }
            },

            items : {
                noteField : true
            }
        };
    }
}

// Register this widget type with its Factory
NotesTab.initClass();
