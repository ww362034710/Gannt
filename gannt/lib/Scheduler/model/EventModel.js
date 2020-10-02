import TimeSpan from './TimeSpan.js';
import RecurringTimeSpan from './mixin/RecurringTimeSpan.js';
import EventModelMixin from './mixin/EventModelMixin.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { SchedulerBasicEvent } from '../../Engine/quark/model/scheduler_basic/SchedulerBasicEvent.js';
import { SchedulerCoreEvent } from '../../Engine/quark/model/scheduler_core/SchedulerCoreEvent.js';

const EngineMixin = window.bryntum?.useBasicEngine ? SchedulerBasicEvent : SchedulerCoreEvent;

/**
 * @module Scheduler/model/EventModel
 */

/**
 * This class represent a single event in your schedule. It is a subclass of the {@link Scheduler.model.TimeSpan}, which is in turn subclass of {@link Core.data.Model}.
 * Please refer to documentation of that class to become familiar with the base interface of the event.
 *
 * The Event model has a few predefined fields as seen below. If you want to add new fields or change the options for the existing fields,
 * you can do that by subclassing this class (see example below).
 *
 * Subclassing the Event model class
 * --------------------
 * ```
 * class MyEvent extends EventModel {
 *
 *     static get fields() {
 *         return [
 *            // Add new field
 *            { name: 'myField', type : 'number', defaultValue : 0 }
 *         ];
 *     },
 *
 *     myCheckMethod() {
 *         return this.myField > 0
 *     },
 *
 *     ...
 * });
 * ```
 * If you in your data want to use other names for the startDate, endDate, resourceId and name fields you can configure
 * them as seen below:
 * ```
 * class MyEvent extends EventModel {
 *
 *     static get fields() {
 *         return [
 *            { name: 'startDate', dataSource 'taskStart', type: 'date', format: 'YYYY-MM-DD' },
 *            { name: 'endDate', dataSource 'taskEnd', type: 'date', format: 'YYYY-MM-DD' },
 *            { name: 'resourceId', dataSource 'userId' },
 *            { name: 'name', dataSource 'taskTitle' },
 *         ];
 *     },
 *     ...
 * });
 * ```
 * Please refer to {@link Core.data.Model} for additional details.
 *
 * @extends Scheduler/model/TimeSpan
 * @mixes Scheduler/model/mixin/RecurringTimeSpan
 * @mixes Scheduler/model/mixin/EventModelMixin
 */
export default class EventModel extends EngineMixin.derive(TimeSpan).mixin(RecurringTimeSpan, PartOfProject, EventModelMixin) {

}

EventModel.exposeProperties();
