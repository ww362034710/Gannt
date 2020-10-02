import DependencyTab from './DependencyTab.js';

/**
 * @module SchedulerPro/widget/taskeditor/SuccessorsTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or
 * {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the successors of an event or task.
 *
 * @extends SchedulerPro/widget/taskeditor/DependencyTab
 * @classtype successorstab
 * @internal
 */
export default class SuccessorsTab extends DependencyTab {
    static get $name() {
        return 'SuccessorsTab';
    }

    // Factoryable type name
    static get type() {
        return 'successorstab';
    }

    static get defaultConfig() {
        return Object.assign(
            this.makeDefaultConfig('toEvent'),
            {
                cls : 'b-successors-tab'
            }
        );
    }
}

// Register this widget type with its Factory
SuccessorsTab.initClass();
