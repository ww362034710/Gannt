import AjaxStore from '../../Core/data/AjaxStore.js';
import ResourceStoreMixin from '../../Scheduler/data/mixin/ResourceStoreMixin.js';
import ResourceModel from '../model/ResourceModel.js';
import { ChronoResourceStoreMixin } from '../../Engine/quark/store/ChronoResourceStoreMixin.js';
import PartOfProject from './mixin/PartOfProject.js';

/**
 * @module SchedulerPro/data/ResourceStore
 */

/**
 * A class representing the collection of the resources - {@link SchedulerPro/model/ResourceModel} records.
 *
 * @extends Core/data/AjaxStore
 * @mixes Scheduler/data/mixin/ResourceStoreMixin
 *
 * @typings Scheduler/data/ResourceStore -> Scheduler/data/SchedulerResourceStore
 */
export default class ResourceStore extends PartOfProject(ResourceStoreMixin(ChronoResourceStoreMixin.derive(AjaxStore))) {

    //region Config

    static get defaultConfig() {
        return {
            modelClass : ResourceModel
        };
    }

    //endregion

}
