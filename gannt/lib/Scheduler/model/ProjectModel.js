import VersionHelper from '../../Core/helper/VersionHelper.js';
import ProjectModelMixin from './mixin/ProjectModelMixin.js';
import ModelPersistencyManager from '../data/util/ModelPersistencyManager.js';
import { SchedulerBasicProjectMixin } from '../../Engine/quark/model/scheduler_basic/SchedulerBasicProjectMixin.js';
import { SchedulerCoreProjectMixin } from '../../Engine/quark/model/scheduler_core/SchedulerCoreProjectMixin.js';

const EngineMixin = window.bryntum?.useBasicEngine ? SchedulerBasicProjectMixin : SchedulerCoreProjectMixin;

/**
 * @module Scheduler/model/ProjectModel
 */

/**
 * This class represents a global project of your Scheduler - a central place for all data.
 *
 * @extends Core/data/Model
 */
export default class ProjectModel extends ProjectModelMixin(EngineMixin) {
    construct(...args) {
        super.construct(...args);

        if (VersionHelper.isTestEnv) {
            window.bryntum.testProject = this;
        }

        // Moved here from EventStore, since project is now the container instead of it
        this.modelPersistencyManager = this.createModelPersistencyManager();
    }

    /**
     * Creates and returns model persistency manager
     *
     * @return {Scheduler.data.util.ModelPersistencyManager}
     * @internal
     */
    createModelPersistencyManager() {
        return new ModelPersistencyManager({
            eventStore      : this,
            resourceStore   : this.resourceStore,
            assignmentStore : this.assignmentStore,
            dependencyStore : this.dependencyStore
        });
    }
}

ProjectModel.applyConfigs = true;
