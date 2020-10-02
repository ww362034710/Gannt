import ResourceStoreMixin from './mixin/ResourceStoreMixin.js';
import ResourceModel from '../model/ResourceModel.js';
import AjaxStore from '../../Core/data/AjaxStore.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import { ChronoResourceStoreMixin } from '../../Engine/quark/store/ChronoResourceStoreMixin.js';
import { CoreResourceStoreMixin } from '../../Engine/quark/store/CoreResourceStoreMixin.js';
import PartOfBaseProject from './mixin/PartOfBaseProject.js';

const EngineMixin = window.bryntum?.useBasicEngine
    ? PartOfBaseProject(ChronoResourceStoreMixin.derive(AjaxStore))
    : PartOfProject(CoreResourceStoreMixin.derive(AjaxStore));

/**
 * @module Scheduler/data/ResourceStore
 */

/**
 * This is a class holding the collection the {@link Scheduler.model.ResourceModel resources} to be rendered into a
 * {@link Scheduler.view.Scheduler scheduler}.
 *
 * @mixes Scheduler/data/mixin/ResourceStoreMixin
 * @extends Core/data/AjaxStore
 */
export default class ResourceStore extends ResourceStoreMixin(EngineMixin) {

    static get defaultConfig() {
        return {
            modelClass : ResourceModel
        };
    }

}
