import AjaxStore from '../../Core/data/AjaxStore.js';
import AssignmentModel from '../model/AssignmentModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';
import AssignmentStoreMixin from './mixin/AssignmentStoreMixin.js';
import { ChronoAssignmentStoreMixin } from '../../Engine/quark/store/ChronoAssignmentStoreMixin.js';
import { CoreAssignmentStoreMixin } from '../../Engine/quark/store/CoreAssignmentStoreMixin.js';

const EngineMixin = window.bryntum?.useBasicEngine
    ? PartOfBaseProject(ChronoAssignmentStoreMixin.derive(AjaxStore))
    : PartOfProject(CoreAssignmentStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/AssignmentStore
 */

/**
 * A class representing a collection of assignments between events in the {@link Scheduler.data.EventStore} and resources
 * in the {@link Scheduler.data.ResourceStore}.
 *
 * Contains a collection of {@link Scheduler.model.AssignmentModel} records.
 *
 * @extends Core/data/AjaxStore
 */
export default class AssignmentStore extends AssignmentStoreMixin(EngineMixin) {

    static get defaultConfig() {
        return {
            modelClass : AssignmentModel
        };
    }

}
