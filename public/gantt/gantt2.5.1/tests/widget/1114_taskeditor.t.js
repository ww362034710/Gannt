StartTest(function (t) {

    var assertions  = function (e, caption) {
        var task        = e.taskStore.getById(118),
            taskCopy;

        t.checkClonedArray = function (name) {
            this.it('Properly clones ' + name + ' array', function (t) {
                t.isnt(taskCopy[name], task[name], 'has another ' + name + ' array ref');

                t.is(taskCopy[name].length, task[name].length, name + ' array has the same length');

                for (var i = 0, l = taskCopy[name].length; i < l; i++)
                    t.ok(taskCopy[name][i].originalRecord, i + ' ' + name + ' element is a copy');
            });
        };

        var oldCount    = e.taskStore.getCount();

        e.loadTask(task);

        taskCopy        = e.taskForm.taskBuffer;

        t.is(e.taskStore.getCount(), oldCount, 'Original task store has not been changed');
        t.isnt(taskCopy, task, 'General tab form: has copy of task set as `taskBuffer`');
        t.is(taskCopy, e.advancedForm.taskBuffer, 'General tab form and advanced tab form share task buffer');
        t.isnt(taskCopy.taskStore, e.taskStore, 'General tab form: task copy refers to fake task store');

        t.isnt(taskCopy.taskStore.resourceStore, e.taskStore.resourceStore, 'fake task store refers to fake resource store');
        t.is(taskCopy.taskStore.resourceStore.count(), e.taskStore.resourceStore.count(), 'fake resource store has proper number of records');

        t.isnt(taskCopy.taskStore.assignmentStore, e.taskStore.assignmentStore, 'fake task store refers to fake assignment store');
        t.is(taskCopy.taskStore.assignmentStore.count(), 1, 'fake assignment store has one record');
        t.isnt(taskCopy.taskStore.assignmentStore.first(), task.assignments[0], 'the record itself is also a copy');
        t.is(taskCopy.taskStore.assignmentStore.first().originalRecord, task.assignments[0], 'a copy of proper assignment');

        t.isnt(taskCopy.taskStore.dependencyStore, e.taskStore.dependencyStore, 'fake task store refers to fake dependency store');
        t.is(taskCopy.taskStore.dependencyStore.count(), 1, 'fake dependency store has one record');

        t.isnt(taskCopy.taskStore.dependencyStore.first(), task.successors[0], 'the record itself is also a copy');
        t.is(taskCopy.taskStore.dependencyStore.first().originalRecord, task.successors[0], 'a copy of proper dependency');

        t.is(taskCopy.taskStore.dependencyStore.count(), 1, 'fake dependency store has proper number of records');

        t.checkClonedArray('assignments');
        t.checkClonedArray('predecessors');
        t.checkClonedArray('successors');

        t.is(taskCopy.assignments[0].originalRecord, task.assignments[0], 'assignment copy points to proper original record');
        t.isDeeply(taskCopy.assignments[0].data, task.assignments[0].data, 'assignment data copied properly');
        t.isDeeply(taskCopy.assignments[0].getResource().originalRecord, task.assignments[0].getResource(), 'assignment copy getResource() gives proper result');
        t.isDeeply(taskCopy.assignments[0].getResource().data, task.assignments[0].getResource().data, 'assignment copy getResource() gives proper data');
        t.is(taskCopy.assignments[0].isPersistable(), task.assignments[0].isPersistable(), 'assignment copy isPersistable() gives proper result')
        t.is(taskCopy.assignments[0].getInternalId(), task.assignments[0].getInternalId(), 'assignment copy getInternalId() gives proper result')
        t.is(taskCopy.assignments[0].getEffort(), task.assignments[0].getEffort(), 'assignment copy getEffort() gives proper result')
        t.is(taskCopy.assignments[0].getTask().getInternalId(), task.assignments[0].getTask().getInternalId(), 'assignment copy getTask() gives proper result')

        t.is(taskCopy.successors[0].originalRecord, task.successors[0], 'successor copy points to proper original record');
        t.isDeeply(taskCopy.successors[0].data, task.successors[0].data, 'successor data copied properly');
        t.isnt(taskCopy.successors[0].getSourceTask(), task.successors[0].getSourceTask(), 'successor copy getSourceTask() gives proper result');
        t.isDeeply(taskCopy.successors[0].getSourceTask().getInternalId(), task.successors[0].getSourceTask().getInternalId(), 'successor copy getSourceTask() gives proper data');
        t.isnt(taskCopy.successors[0].getTargetTask(), task.successors[0].getTargetTask(), 'successor copy getTargetTask() gives proper result');
        t.isDeeply(taskCopy.successors[0].getTargetTask().getInternalId(), task.successors[0].getTargetTask().getInternalId(), 'successor copy getTargetTask() gives proper data');
    };


    var taskStore   = t.getTaskStore({
        assignmentStore : t.getAssignmentStore(),
        resourceStore   : t.getResourceStore(),
        dependencyStore : t.getDependencyStore()
    });

    t.it('Correctly clones stores when we have all tabs enabled', function (t) {
        assertions(new Gnt.widget.TaskEditor({
            taskStore       : taskStore,
            assignmentStore : taskStore.getAssignmentStore(),
            resourceStore   : taskStore.getResourceStore(),
            margin          : 10,
            width           : 500,
            renderTo        : Ext.getBody()
        }));
    });

    t.it('Correctly clones stores when we don`t have assignments and dependencies grids', function (t) {
        assertions(new Gnt.widget.TaskEditor({
            taskStore       : t.getTaskStore({
                assignmentStore : t.getAssignmentStore(),
                resourceStore   : t.getResourceStore(),
                dependencyStore : t.getDependencyStore()
            }),
            margin          : 10,
            width           : 500,
            renderTo        : Ext.getBody()
        }));
    });

});
