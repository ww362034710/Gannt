import Model from '../../Core/data/Model.js';
import AssignmentModelMixin from '../../Scheduler/model/mixin/AssignmentModelMixin.js';
import { SchedulerProAssignmentMixin } from '../../Engine/quark/model/scheduler_pro/SchedulerProAssignmentMixin.js';
import PartOfProject from '../data/mixin/PartOfProject.js';

/**
 * @module SchedulerPro/model/AssignmentModel
 */

/**
 * Scheduler Pro Assignment model class.
 *
 * @extends Scheduler/model/AssignmentModel
 *
 * @typings Scheduler/model/AssignmentModel -> Scheduler/model/SchedulerAssignmentModel
 */
export default class AssignmentModel extends PartOfProject(AssignmentModelMixin(SchedulerProAssignmentMixin.derive(Model))) {

    //region Config

    static get $name() {
        return 'AssignmentModel';
    }

    static get isProAssignmentModel() {
        return true;
    }

    //endregion
}
