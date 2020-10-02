StartTest(function (t) {

    var dependencyStore = Ext.create("Gnt.data.DependencyStore");

    var counter = 0;

    /* global TestModel */
    t.expectGlobal('TestModel');

    Ext.define('TestModel', {
        extend : 'Gnt.model.Task',

        refreshCalculatedParentNodeData : function () {
            counter++;
            return this.callParent(arguments);
        }
    });

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        dependencyStore : dependencyStore,

        model : 'TestModel',

        proxy : {
            type   : 'ajax',
            url    : 'data/crud/create-tasks.aspx',  // For incremental loading after expand
            reader : {
                type : 'json'
            }
        },

        root : {
            expanded : true,
            loaded   : true,
            children : [
                {
                    Id : 1,

                    children : [
                        {
                            Id : 2,

                            children : [
                                {
                                    Id   : 3,
                                    leaf : true
                                }
                            ]
                        },

                        {
                            Id : 10,

                            leaf     : false,
                            expanded : false
                        }
                    ]
                },

                {
                    Id        : 4,
                    StartDate : new Date(2010, 1, 1),
                    EndDate   : new Date(2010, 1, 11),
                    children  : [
                        {
                            Id        : 5,
                            StartDate : new Date(2010, 1, 1),
                            EndDate   : new Date(2010, 1, 11),
                            children  : [
                                {
                                    Id        : 6,
                                    StartDate : new Date(2010, 1, 1),
                                    EndDate   : new Date(2010, 1, 11),
                                    leaf      : true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    });

    t.it('Sanity', function (t) {

        var node1 = taskStore.getNodeById(1);
        var node2 = taskStore.getNodeById(2);
        var node3 = taskStore.getNodeById(3);
        var node4 = taskStore.getNodeById(4);
        var node5 = taskStore.getNodeById(5);
        var node6 = taskStore.getNodeById(6);

        var newStart = new Date(2010, 1, 1);
        node3.setStartDate(newStart);

        t.notOk(node3.getDuration(), 'No duration for task 3');
        t.notOk(node2.getDuration(), 'No duration for task 2');
        t.notOk(node2.getDuration(), 'No duration for task 1');

        // checking for the parent node data recalculation actions.
        t.diag("Task Store has `cascadeChanges` set to " + String(taskStore.cascadeChanges));
        t.diag("Task Store has `recalculateParents` set to " + String(taskStore.recalculateParents));
        // With task store's cascadeChanges == false and recalculateParents == true the new changes propagation
        // strategy should recalculateParent nodes data only twice, once for immediate parent of node3
        // and second time for grand parent node, the root node is not taken into account.
        t.is(counter, 3, '`refreshCalculatedParentNodeData` was called only 3 times across all models (including root)');

        t.isDateEqual(node2.getStartDate(), newStart, 'Start Date propagated to immediate parent');
        t.isDateEqual(node1.getStartDate(), newStart, 'Start Date propagated to parent of parent');

        var newEnd = new Date(2010, 11, 1);
        node3.setEndDate(newEnd);

        t.isDateEqual(node2.getEndDate(), newEnd, 'End Date propagated to immediate parent');
        t.isDateEqual(node1.getEndDate(), newEnd, 'End Date propagated to parent of parent');

        t.is(counter, 6, '`refreshCalculatedParentNodeData` was called only 6 times across all models (3 + 3, including root)');

        node6.setStartDate(new Date(2010, 1, 4));
        t.is(node4.getStartDate(), new Date(2010, 1, 4), 'Start date propagated');
        t.is(node5.getStartDate(), new Date(2010, 1, 4), 'Start date propagated');

        node6.setName('foo');
        node6.setStartDate(new Date(2010, 1, 1));
        t.is(node4.getStartDate(), new Date(2010, 1, 1), 'Start date propagated after reject');
        t.is(node5.getStartDate(), new Date(2010, 1, 1), 'Start date propagated after reject');

        t.isntCalled(TestModel.prototype.recalculateParents, TestModel.prototype);
        taskStore.getNodeById(10).expand();
    });

    t.it("VERIFY RECALC PARENT IS CALLED AFTER A CHILD IS REMOVED", function (t) {


        Ext.define('TestModel2', {
            extend : 'Gnt.model.Task'
        });

        /* global TestModel2 */
        t.expectGlobal('TestModel2');

        taskStore = new Gnt.data.TaskStore({
            model : 'TestModel2',
            proxy : 'memory',
            root  : {
                children : [
                    { Id : 1, children : [
                        { Id : 'leaf1' },
                        { Id : 'leaf2' }
                    ] }
                ]
            }
        });

        var parent = taskStore.getById(1);
        var leafOne = taskStore.getById("leaf1");

        t.isCalled(TestModel2.prototype.recalculateParents, TestModel2.prototype, 'Should see recalculateParents called after child node removed');

        leafOne.remove();
    })

    t.describe('Recalculate parents should bubble properly during cascade', function (t) {

        taskStore = new Gnt.data.TaskStore({
            cascadeChanges  : true,
            dependencyStore : new Gnt.data.DependencyStore({
                data : [
                    {
                        From : 1,
                        To   : 4
                    }
                ]
            }),
            proxy           : 'memory',
            root            : {
                children : [
                    {
                        Id        : 1,
                        StartDate : new Date(2010, 1, 2),
                        EndDate   : new Date(2010, 1, 3)
                    },
                    {
                        Id        : 2,
                        StartDate : new Date(2010, 1, 3),
                        EndDate   : new Date(2010, 1, 4),
                        children  : [
                            {
                                Id        : 3,
                                StartDate : new Date(2010, 1, 3),
                                EndDate   : new Date(2010, 1, 4),
                                children  : [
                                    {
                                        Id        : 4,
                                        StartDate : new Date(2010, 1, 3),
                                        EndDate   : new Date(2010, 1, 4),
                                        leaf      : true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });

        t.waitForEvent(taskStore, 'cascade', function () {

            t.it('Should find updated parent date', function (t) {
                t.is(taskStore.getById(2).getStartDate(), new Date(2010, 1, 4))
                t.is(taskStore.getById(3).getStartDate(), new Date(2010, 1, 4))
                t.is(taskStore.getById(4).getStartDate(), new Date(2010, 1, 4))
            })
        });

        taskStore.getById(1).shift(Sch.util.Date.DAY, 1);
    })

    t.it("Should handle case where child nodes have partial data only", function (t) {

        var taskStore = new Gnt.data.TaskStore({
            root  : {
                children : [
                    {
                        Id       : 1,
                        children : [
                            { Id : 'leaf1' },
                            { Id : 'leaf2' }
                        ]
                    }
                ]
            }
        });

        t.diag("Task Store skipWeekendsDuringDragDrop flag is " + Boolean(taskStore.skipWeekendsDuringDragDrop));

        var parent = taskStore.getById(1);
        var leafOne = taskStore.getById("leaf1");
        var leafTwo = taskStore.getById("leaf2");

        leafTwo.setEndDate(new Date(2010, 1, 2));
        leafOne.setStartDate(new Date(2010, 1, 5));

        t.is(parent.getStartDate(), new Date(2010, 1, 2), 'Correct parent start date')
        t.is(parent.getEndDate(), new Date(2010, 1, 5), 'Correct parent end date')
    })
})
