StartTest(function (t) {

    function doTest (t, threshold) {

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            proxy : 'memory',

            root  : {
                loaded   : true,
                expanded : true,
                children : [
                    {
                        StartDate : new Date(2013, 0, 1),
                        Duration  : 2,
                        Id        : 1,
                        expanded  : true,
                        children  : [
                            {
                                StartDate : new Date(2013, 0, 1),
                                Duration  : 1,
                                Id        : 2,
                                leaf      : true
                            },
                            {
                                StartDate : new Date(2013, 0, 2),
                                Duration  : 1,
                                Id        : 3,
                                leaf      : true
                            }
                        ]
                    },
                    {
                        StartDate : new Date(2013, 0, 3),
                        Duration  : 1,
                        Id        : 4,
                        expanded  : true,
                        children  : [
                            {
                                StartDate : new Date(2013, 0, 3),
                                Duration  : 1,
                                Id        : 5,
                                leaf      : true
                            }
                        ]
                    }
                ]
            }
        });

        var gantt = t.getGantt2({
            renderTo               : Ext.getBody(),
            height                 : 200,
            startDate              : new Date(2013, 0, 3),
            endDate                : new Date(2013, 0, 14),
            cascadeChanges         : true,
//            simpleCascadeThreshold : threshold,
            taskStore              : taskStore,
            dependencyStore        : new Gnt.data.DependencyStore({
                data : [
                    { From : 2, To : 3 },
                    { From : 3, To : 5 }
                ]
            }),
            columns                : [
                { xtype : 'namecolumn', dataIndex : 'Id' },
                { xtype : 'startdatecolumn' },
                { xtype : 'enddatecolumn' }
            ]
        });

        t.wontFire(gantt.lockedGrid.view, 'refresh');
        t.wontFire(gantt.normalGrid.view, 'refresh');
        t.willFireNTimes(gantt.lockedGrid.view, 'itemupdate', 5);
        t.willFireNTimes(gantt.normalGrid.view, 'itemupdate', 5);

        t.chain(
            { waitFor : 'rowsVisible', args : gantt },

            function(next) {
                t.waitForEvent(taskStore, 'cascade', next)

                taskStore.getById(2).setDuration(2);
            },

            { waitFor : 100 },

            function(next) {

                // At this point, create a new gantt with same dataset and compare cells to be sure all is ok
                t.referenceGantt = t.getGantt2({
                    renderTo               : Ext.getBody(),
                    height                 : 200,
                    startDate              : new Date(2013, 0, 3),
                    endDate                : new Date(2013, 0, 14),
                    taskStore              : new Gnt.data.TaskStore({
                        proxy : 'memory',

                        root : {
                            loaded   : true,
                            expanded : true,
                            children : [
                                {
                                    StartDate : new Date(2013, 0, 1),
                                    Duration  : 3,
                                    Id        : 1,
                                    expanded  : true,
                                    children  : [
                                        {
                                            StartDate : new Date(2013, 0, 1),
                                            Duration  : 2,
                                            Id        : 2,
                                            leaf      : true
                                        },
                                        {
                                            StartDate : new Date(2013, 0, 3),
                                            Duration  : 1,
                                            Id        : 3,
                                            leaf      : true
                                        }
                                    ]
                                },
                                {
                                    StartDate : new Date(2013, 0, 4),
                                    Duration  : 1,
                                    Id        : 4,
                                    expanded  : true,
                                    children  : [
                                        {
                                            StartDate : new Date(2013, 0, 4),
                                            Duration  : 1,
                                            Id        : 5,
                                            leaf      : true
                                        }
                                    ]
                                }
                            ]
                        }
                    }),
                    dependencyStore        : gantt.dependencyStore,
                    columns                : [
                        { xtype : 'namecolumn', dataIndex : 'Id' },
                        { xtype : 'startdatecolumn' },
                        { xtype : 'enddatecolumn' }
                    ]
                });

                t.waitForTasksAndDependenciesToRender(t.referenceGantt, next);
            },

            function() {
                for (var i = 0; i < gantt.lockedGrid.view.store.getCount(); i++) {
                    for (var j = 0; j < 3; j++) {

                        t.is(
                            gantt.lockedGrid.view.getCellByPosition({ row : i, column : j}).dom.innerHTML,
                            t.referenceGantt.lockedGrid.view.getCellByPosition({ row : i, column : j}).dom.innerHTML,
                            'Locked cell match: ' + i + ':' + j
                        );

                        t.is(
                            gantt.lockedGrid.view.getCellByPosition({ row : i, column : j}).dom.innerHTML,
                            t.referenceGantt.lockedGrid.view.getCellByPosition({ row : i, column : j}).dom.innerHTML,
                            'Schedule cell match: ' + i + ':' + j
                        );
                    }
                }
            }
        )
    }

    t.it('Should redraw tasks correctly when manually refreshing updated rows', function(t) {
        doTest(t, 5)
    });

    t.it('Should redraw tasks correctly when doing full refresh after cascade', function(t) {
        doTest(t, 0)
    });

});
