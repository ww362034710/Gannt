import AjaxStore from '../../Core/data/AjaxStore.js';
import DependencyStoreMixin from '../../Scheduler/data/mixin/DependencyStoreMixin.js';
import DependencyModel from '../model/DependencyModel.js';
import { ChronoDependencyStoreMixin } from '../../Engine/quark/store/ChronoDependencyStoreMixin.js';
import PartOfProject from './mixin/PartOfProject.js';

/**
 * @module SchedulerPro/data/DependencyStore
 */

/**
 * A class representing the collection of the dependencies - {@link SchedulerPro/model/DependencyModel} records.
 *
 * @extends Core/data/AjaxStore
 * @mixes Scheduler/data/mixin/DependencyStoreMixin
 *
 * @typings Scheduler/data/DependencyStore -> Scheduler/data/SchedulerDependencyStore
 */
export default class DependencyStore extends PartOfProject(DependencyStoreMixin(ChronoDependencyStoreMixin.derive(AjaxStore))) {

    //region Config

    static get defaultConfig() {
        return {
            modelClass : DependencyModel
        };
    }

    //endregion

}
