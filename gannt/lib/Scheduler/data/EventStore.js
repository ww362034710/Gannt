import AjaxStore from '../../Core/data/AjaxStore.js';
import EventStoreMixin from './mixin/EventStoreMixin.js';
import SharedEventStoreMixin from './mixin/SharedEventStoreMixin.js';
import RecurringEventsMixin from './mixin/RecurringEventsMixin.js';
import EventModel from '../model/EventModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import { ChronoEventStoreMixin } from '../../Engine/quark/store/ChronoEventStoreMixin.js';
import { CoreEventStoreMixin } from '../../Engine/quark/store/CoreEventStoreMixin.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';

const EngineMixin = window.bryntum?.useBasicEngine
    ? PartOfBaseProject(ChronoEventStoreMixin.derive(AjaxStore))
    : PartOfProject(CoreEventStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/EventStore
 */

/**
 * This is a class holding all the {@link Scheduler.model.EventModel events} to be rendered into a {@link Scheduler.view.Scheduler Scheduler}.
 * This class only accepts a model class inheriting from {@link Scheduler.model.EventModel}.
 *
 * @mixes Scheduler/data/mixin/EventStoreMixin
 * @extends Core/data/AjaxStore
 */
export default class EventStore extends EngineMixin.mixin(SharedEventStoreMixin, RecurringEventsMixin, EventStoreMixin) {
    static get defaultConfig() {
        return {
            /**
             * Class used to represent records
             * @config {Scheduler.model.EventModel}
             * @default
             * @category Common
             * @typings { new(data: object): Model }
             */
            modelClass : EventModel,

            /**
             * ***Only valid when this EventStore is being consumed by the Calendar product***
             *
             * This is the id of the default Calendar to assign to new events created using 
             * dblclick or drag.
             *
             * @category Calendar
             * @config {String|Number}
             */
            defaultCalendar : null
        };
    }
}
