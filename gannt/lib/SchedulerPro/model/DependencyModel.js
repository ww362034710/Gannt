import PartOfProject from '../data/mixin/PartOfProject.js';
import DependencyBaseModel from '../../Scheduler/model/DependencyBaseModel.js';
import { SchedulerProDependencyMixin } from '../../Engine/quark/model/scheduler_pro/SchedulerProDependencyMixin.js';

/**
 * @module SchedulerPro/model/DependencyModel
 */

/**
 * Scheduler Pro Dependency model class.
 *
 * @mixes SchedulerPro/data/mixin/PartOfProject
 *
 * @extends Scheduler/model/DependencyBaseModel
 *
 * @typings Scheduler/model/DependencyModel -> Scheduler/model/SchedulerDependencyModel
 */
export default class DependencyModel extends PartOfProject(SchedulerProDependencyMixin.derive(DependencyBaseModel)) {

    /**
     * The calendar of the dependency used to take `lag` duration into account.
     * @field {SchedulerPro.model.CalendarModel} calendar
     */

    //region Config

    static get $name() {
        return 'DependencyModel';
    }

    static get isProDependencyModel() {
        return true;
    }

    //endregion

}
