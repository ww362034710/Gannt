import AjaxStore from '../../Core/data/AjaxStore.js';
import AssignmentStoreMixin from '../../Scheduler/data/mixin/AssignmentStoreMixin.js';
import AssignmentModel from '../model/AssignmentModel.js';
import { ChronoAssignmentStoreMixin } from '../../Engine/quark/store/ChronoAssignmentStoreMixin.js';
import PartOfProject from './mixin/PartOfProject.js';

/**
 * @module SchedulerPro/data/AssignmentStore
 */

/**
 * A class representing the collection of the dependencies - {@link SchedulerPro/model/AssignmentModel} records.
 *
 * @extends Core/data/AjaxStore
 * @mixes Scheduler/data/mixin/AssignmentStoreMixin
 *
 * @typings Scheduler/data/AssignmentStore -> Scheduler/data/SchedulerAssignmentStore
 */
export default class AssignmentStore extends PartOfProject(AssignmentStoreMixin(ChronoAssignmentStoreMixin.derive(AjaxStore))) {

    static get defaultConfig() {
        return {
            modelClass : AssignmentModel
        };
    }

}
