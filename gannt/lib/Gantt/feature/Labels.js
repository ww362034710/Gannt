import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import SchedulerLabels from '../../Scheduler/feature/Labels.js';

/**
 * @module Gantt/feature/Labels
 */

/**
 * Specialized version of the Labels feature for Scheduler, that handles labels for tasks in Gantt. See
 * {@link Scheduler/feature/Labels Schedulers Labels feature} for more information.

 * This feature is **disabled** by default.
 *
 * @extends Scheduler/feature/Labels
 * @demo Gantt/labels
 * @typings Scheduler/feature/Labels -> Scheduler/feature/SchedulerLabels
 * @classtype labels
 */
export default class Labels extends SchedulerLabels {
    static get $name() {
        return 'Labels';
    }

    static get pluginConfig() {
        return {
            chain : ['onTaskDataGenerated']
        };
    }

    onTaskDataGenerated(data) {
        this.onEventDataGenerated(data);
    }
}

GridFeatureManager.registerFeature(Labels, false, 'Gantt');
