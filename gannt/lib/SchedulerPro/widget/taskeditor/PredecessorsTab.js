import DependencyTab from './DependencyTab.js';

/**
 * @module SchedulerPro/widget/taskeditor/PredecessorsTab
 */

/**
 * A tab inside the {@link SchedulerPro.widget.SchedulerTaskEditor scheduler task editor} or
 * {@link SchedulerPro.widget.GanttTaskEditor gantt task editor} showing the predecessors of an event or task.
 *
 * @extends SchedulerPro/widget/taskeditor/DependencyTab
 * @classtype predecessorstab
 * @internal
 */
export default class PredecessorsTab extends DependencyTab {
    static get $name() {
        return 'PredecessorsTab';
    }

    // Factoryable type name
    static get type() {
        return 'predecessorstab';
    }

    static get defaultConfig() {
        return Object.assign(
            this.makeDefaultConfig('fromEvent'),
            {
                cls : 'b-predecessors-tab'
            }
        );
    }
}

// Register this widget type with its Factory
PredecessorsTab.initClass();
