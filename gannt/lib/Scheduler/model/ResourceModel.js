import GridRowModel from '../../Grid/data/GridRowModel.js';
import PartOfProject from '../data/mixin/PartOfProject.js';
import ResourceModelMixin from './mixin/ResourceModelMixin.js';
import { BaseResourceMixin } from '../../Engine/quark/model/scheduler_basic/BaseResourceMixin.js';
import { CoreResourceMixin } from '../../Engine/quark/model/scheduler_core/CoreResourceMixin.js';

const EngineMixin = window.bryntum?.useBasicEngine ? BaseResourceMixin : CoreResourceMixin;

/**
 * @module Scheduler/model/ResourceModel
 */

/**
 * This class represent a single Resource in the scheduler chart. It's a subclass of  {@link Core.data.Model}.
 * Please refer to the documentation for that class to become familiar with the base interface of the resource.
 *
 * A Resource has only 2 mandatory fields - `id` and `name`. If you want to add more fields with meta data describing your resources then you should subclass this class:
 *
 * ```javascript
 * class MyResource extends ResourceModel {
 *
 *   static get fields() {
 *     [
 *       // `Id` and `Name` fields are already provided by the superclass
 *       { name: 'company', type : 'string' }
 *     ];
 *   }
 *
 *   getCompany() {
 *     return this.company;
 *   }
 *   ...
 * });
 * ```
 * If you want to use other names in your data for the id and name fields you can configure them as seen below:
 * ```javascript
 * class MyResource extends ResourceModel {
 *
 *   static get fields() {
 *     return [
 *        { name: 'name', dataSource: 'userName' }
 *     ];
 *   },
 *   ...
 * });
 * ```
 * Please refer to {@link Core.data.Model} for details.
 *
 * @extends Grid/data/GridRowModel
 */
export default class ResourceModel extends ResourceModelMixin(PartOfProject(EngineMixin.derive(GridRowModel))) {

}

ResourceModel.exposeProperties();
