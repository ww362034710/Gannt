StartTest(function (t) {

    // #1411 Assert unitfield is readOnly when task scheduling mode is DynamicAssignment

    t.describe('Assert unitfield is readOnly when task is DynamicAssignment', function (t) {

        var resourceStore   = t.getResourceStore();

        var assignmentStore = t.getAssignmentStore({
            resourceStore   : resourceStore
        });

        var taskStore       = t.getTaskStore({
            assignmentStore     : assignmentStore,
            resourceStore       : resourceStore,
            DATA    : [
                {
                    leaf            : true,
                    Id              : 117,
                    StartDate       : "2010-02-03T00:00:00",
                    Duration        : 2,
                    SchedulingMode  : 'DynamicAssignment'
                },
                {
                    leaf            : true,
                    Id              : 118,
                    StartDate       : "2010-02-03T00:00:00",
                    Duration        : 2
                }
            ]
        });


        t.it('Assert assignmentfield', function (t) {

            var field = new Gnt.widget.AssignmentField({
                renderTo    : Ext.getBody()
            });

            field.setTask( taskStore.getById(117) );

            var unitsField;

            t.chain(
                { click : field },

                { waitForCQVisible : 'assignmentgrid' },

                { click : function() { return t.getCell(field.picker, 0, 2); } },

                { waitForCQVisible : 'numberfield' },

                function(next, args) {
                    unitsField  = args[0];

                    t.expect(unitsField.readOnly).toBeTruthy();

                    field.collapse();

                    t.diag('Now change field task having normal scheduling mode');

                    field.setTask( taskStore.getById(118) );

                    next();
                },

                { click : field },

                { waitForCQVisible : 'assignmentgrid' },

                { click : function() { return t.getCell(field.picker, 0, 2); } },

                { waitForCQVisible : 'numberfield' },

                function(next, args) {
                    t.expect(unitsField.readOnly).toBeFalsy();

                    field.destroy();
                }
            );
        });


        t.it('Assert assignmenteditgrid (using taskId config)', function (t) {

            var grid = new Gnt.widget.AssignmentEditGrid({
                renderTo            : Ext.getBody(),
                resourceStore       : resourceStore,
                assignmentStore     : assignmentStore,
                taskId              : 117
            });

            t.chain(
                { waitForRowsVisible : grid },

                function(next) {
                    grid.cellEditing.startEditByPosition({ row : 0, column : 1 });
                    t.waitForCQVisible('numberfield', next);
                },

                function (next, args) {
                    t.expect(args[0].readOnly).toBeTruthy();

                    grid.destroy();
                }
            );
        });


        t.it('Assert assignmenteditgrid (using dynamic loading)', function (t) {

            var grid = new Gnt.widget.AssignmentEditGrid({
                renderTo            : Ext.getBody(),
                resourceStore       : resourceStore,
                assignmentStore     : assignmentStore
            });

            grid.loadTaskAssignments(117);

            t.chain(
                { waitForRowsVisible : grid },

                function(next) {
                    grid.cellEditing.startEditByPosition({ row : 0, column : 1 });
                    t.waitForCQVisible('numberfield', next);
                },

                function (next, args) {
                    t.expect(args[0].readOnly).toBeTruthy();

                    t.diag('Now change field task having normal scheduling mode');

                    grid.loadTaskAssignments(118);

                    next();
                },

                { waitForRowsVisible : grid },

                function(next) {
                    grid.cellEditing.startEditByPosition({ row : 0, column : 1 });
                    t.waitForCQVisible('numberfield', next);
                },

                function (next, args) {
                    t.expect(args[0].readOnly).toBeFalsy();

                    grid.destroy();
                }
            );
        });

    });
});
