import SchedulerProDependencyStore from '../../SchedulerPro/data/DependencyStore.js';
import DependencyModel from '../model/DependencyModel.js';

/**
 * @module Gantt/data/DependencyStore
 */

/**
 * A class representing a collection of dependencies between the tasks in the {@link Gantt/data/TaskStore}.
 * Contains a collection of {@link Gantt/model/DependencyModel} records.
 *
 * @extends SchedulerPro/data/DependencyStore
 * @typings SchedulerPro/data/DependencyStore -> SchedulerPro/data/SchedulerProDependencyStore
 */
export default class DependencyStore extends SchedulerProDependencyStore {
    static get defaultConfig() {
        return {
            modelClass : DependencyModel,

            /**
             * CrudManager must load stores in the correct order. Lowest first.
             * @private
             */
            loadPriority : 300,

            /**
             * CrudManager must sync stores in the correct order. Lowest first.
             * @private
             */
            syncPriority : 500
        };
    }
}
