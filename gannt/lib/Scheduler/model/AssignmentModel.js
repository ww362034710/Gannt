import Model from '../../Core/data/Model.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import AssignmentModelMixin from './mixin/AssignmentModelMixin.js';
import { BaseAssignmentMixin } from '../../Engine/quark/model/scheduler_basic/BaseAssignmentMixin.js';
import { CoreAssignmentMixin } from '../../Engine/quark/model/scheduler_core/CoreAssignmentMixin.js';

const EngineMixin = window.bryntum?.useBasicEngine ? BaseAssignmentMixin : CoreAssignmentMixin;

/**
 * @module Scheduler/model/AssignmentModel
 */

/**
 * This class represent a single assignment of a resource to an event in scheduler.
 * It is a subclass of {@link Core.data.Model} class.
 * Please refer to the documentation for that class to become familiar with the base interface of this class.
 *
 * An Assignment has the following fields:
 * - `id` - The id of the assignment
 * - `resourceId` - The id of the resource assigned
 * - `eventId` - The id of the event to which the resource is assigned
 *
 * The data source for these fields can be customized by subclassing this class.
 *
 * @extends Core/data/Model
 */
export default class AssignmentModel extends AssignmentModelMixin(PartOfProject(EngineMixin.derive(Model))) {

}

AssignmentModel.exposeProperties();
