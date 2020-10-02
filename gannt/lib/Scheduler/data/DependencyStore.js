import AjaxStore from '../../Core/data/AjaxStore.js';
import DependencyModel from '../model/DependencyModel.js';
import PartOfProject from './mixin/PartOfProject.js';
import DependencyStoreMixin from './mixin/DependencyStoreMixin.js';
import { ChronoDependencyStoreMixin } from '../../Engine/quark/store/ChronoDependencyStoreMixin.js';
import { CoreDependencyStoreMixin } from '../../Engine/quark/store/CoreDependencyStoreMixin.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';

const EngineMixin = window.bryntum?.useBasicEngine
    ? PartOfBaseProject(ChronoDependencyStoreMixin.derive(AjaxStore))
    : PartOfProject(CoreDependencyStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/DependencyStore
 */

/**
 * A class representing a collection of dependencies between events in the {@link Scheduler.data.EventStore}.
 * Contains a collection of {@link Scheduler.model.DependencyModel} records.
 *
 * @extends Core/data/AjaxStore
 */
export default class DependencyStore extends DependencyStoreMixin(EngineMixin.derive(AjaxStore)) {

    static get defaultConfig() {
        return {
            modelClass : DependencyModel
        };
    }

}
