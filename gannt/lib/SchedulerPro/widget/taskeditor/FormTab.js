import Container from '../../../Core/widget/Container.js';
import EventLoader from './mixin/EventLoader.js';
import LocaleManager from '../../../Core/localization/LocaleManager.js';
import TaskEditorTab from './mixin/TaskEditorTab.js';

/**
 * @module Gantt/widget/taskeditor/FormTab
 */

/**
 * Base class for form-like {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or
 * {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} tabs.
 *
 * @internal
 * @extends Core/widget/Container
 * @mixes SchedulerPro/widget/taskeditor/mixin/TaskEditorTab
 * @mixes SchedulerPro/widget/taskeditor/mixin/EventLoader
 */
export default class FormTab extends TaskEditorTab(EventLoader(Container)) {

    static get $name() {
        return 'FormTab';
    }

    static get type() {
        return 'formtab';
    }

    static get defaultConfig() {
        return {
            layoutStyle : {
                flexFlow     : 'row wrap',
                alignItems   : 'flex-start',
                alignContent : 'flex-start'
            },

            defaults : {
                labelWidth : '7em'
            },

            autoUpdateRecord : true
        };
    }

    afterConfigure() {
        super.afterConfigure();

        LocaleManager.on({
            locale  : this.onLocaleChange,
            thisObj : this
        });
    }

    // onWidgetValueChange({ source, value, valid, userAction }) {
    //     const
    //         me                  = this,
    //         { project, record } = me,
    //         { name }            = source;
    //
    //     valid = valid !== undefined ? valid : (typeof source.isValid === 'function') ? source.isValid() : source.isValid;
    //
    //     if (!me._loading && valid && project/* && !project.isPropagating()*/ && userAction) {
    //         if (name in record) {
    //             record[name] = value;
    //         }
    //         else if (record.$[name]) {
    //             debugger;
    //             record.$[name].put(value);
    //         }
    //     }
    // }

    onFieldChange({ source, valid, userAction }) {
        if (userAction) {
            valid = valid !== undefined ? valid : (typeof source.isValid === 'function') ? source.isValid() : source.isValid;

            if (valid) {
                super.onFieldChange(...arguments);
            }
        }
    }

    onLocaleChange() {
        this.defaults = {
            labelWidth : this.L('labelWidth')
        };
    }
}

FormTab.initClass();
