import AjaxStore from '../../Core/data/AjaxStore.js';
import EventStoreMixin from '../../Scheduler/data/mixin/EventStoreMixin.js';
import SharedEventStoreMixin from '../../Scheduler/data/mixin/SharedEventStoreMixin.js';
import EventModel from '../model/EventModel.js';
import { ChronoEventStoreMixin } from '../../Engine/quark/store/ChronoEventStoreMixin.js';
import PartOfProject from './mixin/PartOfProject.js';

/**
 * @module SchedulerPro/data/EventStore
 */

/**
 * A class representing the collection of the events - {@link SchedulerPro/model/EventModel} records.
 *
 * @extends Core/data/AjaxStore
 * @mixes Scheduler/data/mixin/EventStoreMixin
 *
 * @typings Scheduler/data/EventStore -> Scheduler/data/SchedulerEventStore
 */
export default class EventStore extends PartOfProject(SharedEventStoreMixin(EventStoreMixin(ChronoEventStoreMixin.derive(AjaxStore)))) {

    //region Config

    static get defaultConfig() {
        return {
            modelClass : EventModel
        };
    }

    //endregion

}
