StartTest(function(t) {

    var taskStore   = new Gnt.data.TaskStore({
        root        : {
            children    : [
                {
                    Id          : 1,
                    leaf        : true
                },
                {
                    Id          : 2,
                    StartDate   : new Date(2014, 4, 1),
                    Segments    : [
                        {
                            Id          : 1,
                            StartDate   : new Date(2014, 4, 1),
                            Duration    : 1
                        },
                        {
                            Id          : 2,
                            StartDate   : new Date(2014, 4, 5),
                            Duration    : 2
                        },
                        {
                            Id          : 3,
                            StartDate   : new Date(2014, 4, 8),
                            Duration    : 2
                        }
                    ],
                    leaf        : true
                },
                {
                    Id          : 3,
                    expanded    : true,
                    StartDate   : new Date(2014, 4, 1),
                    Duration    : 2,
                    children    : [
                        {
                            Id          : 31,
                            leaf        : true,
                            StartDate   : new Date(2014, 4, 1),
                            Duration    : 3
                        },
                        {
                            Id          : 32,
                            leaf        : true,
                            StartDate   : new Date(2014, 4, 1),
                            Segments    : [
                                {
                                    Id          : 1,
                                    StartDate   : new Date(2014, 4, 1),
                                    Duration    : 1
                                },
                                {
                                    Id          : 2,
                                    StartDate   : new Date(2014, 4, 5),
                                    Duration    : 2
                                },
                                {
                                    Id          : 3,
                                    StartDate   : new Date(2014, 4, 5),
                                    Duration    : 1
                                },
                                {
                                    Id          : 4,
                                    StartDate   : new Date(2014, 4, 8),
                                    Duration    : 1
                                },
                                {
                                    Id          : 5,
                                    StartDate   : new Date(2014, 4, 9),
                                    Duration    : 1
                                },
                                {
                                    Id          : 6,
                                    StartDate   : new Date(2014, 4, 8),
                                    Duration    : 2
                                }
                            ]
                        },
                        {
                            Id          : 33,
                            leaf        : true,
                            StartDate   : new Date(2014, 4, 1),
                            Duration    : 0
                        },
                        {
                            Id          : 34,
                            StartDate   : new Date(2014, 4, 1),
                            Segments    : [
                                {
                                    Id          : 1,
                                    StartDate   : new Date(2014, 4, 1),
                                    Duration    : 1
                                },
                                {
                                    Id          : 2,
                                    StartDate   : new Date(2014, 4, 5),
                                    Duration    : 2
                                },
                                {
                                    Id          : 3,
                                    StartDate   : new Date(2014, 4, 8),
                                    Duration    : 2
                                }
                            ],
                            leaf        : true
                        },
                        {
                            Id          : 35,
                            StartDate   : new Date(2014, 4, 1),
                            Segments    : [
                                {
                                    Id          : 1,
                                    StartDate   : new Date(2014, 4, 1),
                                    Duration    : 1
                                },
                                {
                                    Id          : 2,
                                    StartDate   : new Date(2014, 4, 5),
                                    Duration    : 2
                                },
                                {
                                    Id          : 3,
                                    StartDate   : new Date(2014, 4, 8),
                                    Duration    : 2
                                }
                            ],
                            leaf        : true
                        }
                    ]
                }
            ]
        }
    });

    var task = function (id) { return taskStore.getNodeById(id); };

    var checkSegments   = function (t, task, dates, offsets, text) {

        var list    = task.getSegments();

        t.it(text || 'Task #'+ task.getId() +' has correct segments list', function (t) {

            t.is(list.length, dates.length, 'proper number of segments');

            for (var i = 0, l = list.length; i < l; i++) {
                var segment = list[i],
                    range   = dates[i],
                    offset  = offsets[i];

                t.is(segment.getStartDate(),    range[0],   '#'+ i +' proper start date');
                t.is(segment.getEndDate(),      range[1],   '#'+ i +' proper end date');

                t.is(segment.getStartOffset(),  offset[0]*24*3600000,  '#'+ i +' proper start offset');
                t.is(segment.getEndOffset(),    offset[1]*24*3600000,  '#'+ i +' proper end offset');

                t.is(segment.getNextSegment(),  list[i + 1], '#'+ i +' proper next segment');
                t.is(segment.getPrevSegment(),  list[i - 1], '#'+ i +' proper previous segment');
            }
        });

    };


    t.it('Loads content of Splits field correctly', function (t) {

        checkSegments(t, task(2), [
            [ task(2).getStartDate(),   new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8),     new Date(2014, 4, 10) ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    7 ]
        ]);

        checkSegments(t, task(32), [
            [ task(32).getStartDate(),  new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8),     new Date(2014, 4, 10) ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    7 ]
        ]);

    });

    t.it('Doesn`t split task in some cases', function (t) {

        task(1).split(new Date());

        t.notOk(task(1).getSegments(), 'no split was done for a not scheduled task');

        task(3).split(new Date());

        t.notOk(task(3).getSegments(), 'no split was done for a summary task');

        task(33).split(new Date(2014, 4, 2));

        t.notOk(task(33).getSegments(), 'no split was done for milestone');

        task(31).split();

        t.notOk(task(31).getSegments(), 'no split was done since no split date was provided');

        task(31).split(new Date(2014, 3, 30));

        t.notOk(task(31).getSegments(), 'no split was done since provided date was before task start');

        task(31).split(new Date(2014, 4, 6));

        t.notOk(task(31).getSegments(), 'no split was done since provided date was after task end');
    });

    t.it('Splits solid task properly', function (t) {

        var tsk        = task(31);
        var duration    = tsk.getDuration();

        t.notOk(tsk.getSegments(), 'no segments initially');
        t.notOk(tsk.isSegmented(), 'not segmented initially');

        tsk.split(new Date(2014, 4, 2));

        t.ok(tsk.isSegmented(), 'segmented now');
        t.is(tsk.getDuration(), duration, 'kept duration');
        t.ok(tsk.dirty, 'task got dirty');
        t.ok('Segments' in tsk.modified, 'Segments field got dirty');

        checkSegments(t, tsk, [
            [ new Date(2014, 4, 1), new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5), new Date(2014, 4, 7) ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ]
        ]);

        t.is(tsk.getStartDate(),   new Date(2014, 4, 1), 'correct task start date');
        t.is(tsk.getEndDate(),     new Date(2014, 4, 7), 'correct task end date');

    });

    t.it('Splits separated task properly', function (t) {

        var tsk        = task(31);
        var duration    = tsk.getDuration();

        tsk.split(new Date(2014, 4, 6));

        t.ok(tsk.isSegmented(), 'still segmented');
        t.is(tsk.getDuration(), duration, 'kept duration');
        t.ok(tsk.dirty, 'task got dirty');
        t.ok('Segments' in tsk.modified, 'Segments field got dirty');

        checkSegments(t, tsk, [
            [ new Date(2014, 4, 1), new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5), new Date(2014, 4, 6) ],
            [ new Date(2014, 4, 7), new Date(2014, 4, 8) ]
        ], [
            [ 0,    1 ],
            [ 2,    3 ],
            [ 4,    5 ]
        ]);

        t.is(tsk.getStartDate(),   new Date(2014, 4, 1), 'correct task start date');
        t.is(tsk.getEndDate(),     new Date(2014, 4, 8), 'correct task end date');

    });

    t.it('forEachAvailabilityInterval takes split into account', function (t) {

        var result  = [];

        task(31).forEachAvailabilityInterval({
            startDate   : task(31).getStartDate(),
            endDate     : task(31).getEndDate(),
            fn          : function (from, to) {
                result.push([ from, to ]);
            }
        });

        t.isDeeply(result, [
            [ new Date(2014, 4, 1) - 0, new Date(2014, 4, 2) - 0 ],
            [ new Date(2014, 4, 5) - 0, new Date(2014, 4, 6) - 0 ],
            [ new Date(2014, 4, 7) - 0, new Date(2014, 4, 8) - 0 ]
        ], 'correct set of intervals was enumerated');

    });

    t.it('Start date driven move works correctly', function (t) {

        task(32).setStartDate(new Date(2014, 4, 2), true, true);

        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(),  new Date(2014, 4, 3) ],
            [ new Date(2014, 4, 6),     new Date(2014, 4, 8) ],
            [ new Date(2014, 4, 9),     task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    7 ]
        ], 'reacted on start date move (keeping duration)');

    });

    t.it('End date driven move works correctly', function (t) {

        task(32).setEndDate(new Date(2014, 4, 10), true, true);

        t.is(task(32).getStartDate(), new Date(2014, 4, 1), 'correct start date');
        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(),  new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8),     task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    7 ]
        ], 'reacted on end date move (keeping duration)');

    });

    t.it('Start date driven resize works correctly', function (t) {

        task(32).setStartDate(new Date(2014, 4, 3), false, true);

        t.is(task(32).getDuration(), 4, 'kept correct duration');
        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(),  new Date(2014, 4, 6) ],
            [ new Date(2014, 4, 7),     task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    5 ]
        ], 'reacted on start date move (resizing)');

    });

    t.it('Both start and end date resize works correctly', function (t) {

        task(32).setStartEndDate(new Date(2014, 4, 1), new Date(2014, 4, 9), true);

        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(),  new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    6 ]
        ], 'reacted on start and end date change (resizing)');

    });

    t.it('setSegments() calculates task duration and aligns task based on segments', function (t) {

        task(32).setSegments([
            {
                StartDate   : new Date(2014, 4, 1),
                Duration    : 1
            },
            {
                StartDate   : new Date(2014, 4, 5),
                Duration    : 2
            },
            {
                StartDate   : new Date(2014, 4, 8),
                Duration    : 2
            }
        ]);

        t.is(task(32).getEndDate(), new Date(2014, 4, 10), 'task end date was aligned to the last segment end');
        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(), new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5), new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8), task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    7 ]
        ]);

    });

    t.it('getSegment() returns individual segment', function (t) {

        t.ok(task(32).getSegment(0), '#0 segment presented');
        t.ok(task(32).getSegment(1), '#1 segment presented');
        t.ok(task(32).getSegment(2), '#2 segment presented');

        t.isDeeply([ task(32).getSegment(0), task(32).getSegment(1), task(32).getSegment(2) ], task(32).getSegments(), 'correct results of getSegments() and getSegment() calls');
    });

    t.it('Last segment end date resize causes master task recalculation', function (t) {

        task(32).getSegment(2).setEndDate(new Date(2014, 4, 13), false);

        t.is(task(32).getEndDate(), new Date(2014, 4, 13), 'task end date was aligned to the last segment end');
        t.is(task(32).getDuration('d'), 6, 'duration correct');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(), new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5), new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8), task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    8 ]
        ]);
    });

    t.it('Segments ## 0,1,3. Segment #1 resize causes its merge with segment #2', function (t) {

        task(32).getSegment(1).setEndDate(new Date(2014, 4, 8), false);

        t.is(task(32).getEndDate(), new Date(2014, 4, 13), 'task end date was aligned to the last segment end');
        t.is(task(32).getDuration('d'), 7, 'duration correct');
        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        checkSegments(t, task(32), [
            [ task(32).getStartDate(), new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5), task(32).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    8 ]
        ]);

    });

    t.it('Segments ## 0,1. Segment #0 resize causes its merge with segment #1', function (t) {

        task(32).getSegment(0).setEndDate(new Date(2014, 4, 5), false);

        t.is(task(32).getEndDate(), new Date(2014, 4, 13), 'task end date was aligned to the last segment end');
        t.is(task(32).getDuration('d'), 8, 'duration correct');
        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

        t.notOk(task(32).getSegments(), 'no segments');

    });


    t.it('Enlarging of master task duration causes last segment duration grow', function (t) {

        task(34).setDuration(6);

        t.is(task(34).getEndDate(), new Date(2014, 4, 13), 'proper task end date');
        t.ok(task(34).dirty, 'task got dirty');
        t.ok('Segments' in task(34).modified, 'Segments field got dirty');

        checkSegments(t, task(34), [
            [ task(34).getStartDate(),  new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8),     task(34).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    8 ]
        ]);

    });

    t.it('Reducing of master task duration causes last segment duration reducing', function (t) {

        task(35).setDuration(4);

        t.is(task(35).getEndDate(), new Date(2014, 4, 9), 'proper task end date');
        t.ok(task(35).dirty, 'task got dirty');
        t.ok('Segments' in task(35).modified, 'Segments field got dirty');

        checkSegments(t, task(35), [
            [ task(35).getStartDate(),  new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     new Date(2014, 4, 7) ],
            [ new Date(2014, 4, 8),     task(35).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    4 ],
            [ 5,    6 ]
        ]);

    });

    t.it('#0,1,2: merge(1,2) works as expected', function (t) {
        task(35).merge( task(35).getSegment(1), task(35).getSegment(2) );

        t.is(task(35).getStartDate(), new Date(2014, 4, 1), 'proper task start date');
        t.is(task(35).getEndDate(), new Date(2014, 4, 9), 'proper task end date');
        t.ok(task(35).dirty, 'task got dirty');
        t.ok('Segments' in task(35).modified, 'Segments field got dirty');

        checkSegments(t, task(35), [
            [ task(35).getStartDate(),  new Date(2014, 4, 2) ],
            [ new Date(2014, 4, 5),     task(35).getEndDate() ]
        ], [
            [ 0,    1 ],
            [ 2,    6 ]
        ]);
    });

    t.it('#0,1: merge(0,1) works as expected', function (t) {
        task(35).merge( task(35).getSegment(1), task(35).getSegment(0) );

        t.is(task(35).getStartDate(), new Date(2014, 4, 1), 'proper task start date');
        t.is(task(35).getEndDate(), new Date(2014, 4, 9), 'proper task end date');
        t.notOk(task(35).isSegmented(), 'task is not segmented any more');
        t.ok(task(35).dirty, 'task got dirty');
        t.ok('Segments' in task(35).modified, 'Segments field got dirty');

    });

    t.it('setSegments(null) call works correctly', function (t) {

        task(32).setSegments(null);

        t.notOk(task(32).isSegmented(), 'is not segmented any more');
        t.ok(task(32).dirty, 'task got dirty');
        t.ok('Segments' in task(32).modified, 'Segments field got dirty');

    });

    t.it('segments should be reverted correctly after model.reject()', function (t) {

        var taskStore   = new Gnt.data.TaskStore({
            root        : {
                children    : [
                    {
                        Id          : 2,
                        StartDate   : new Date(2014, 4, 1),
                        leaf        : true,
                        Segments    : [
                            {
                                Id          : 1,
                                StartDate   : new Date(2014, 4, 1),
                                Duration    : 1
                            },
                            {
                                Id          : 2,
                                StartDate   : new Date(2014, 4, 5),
                                Duration    : 2
                            },
                            {
                                Id          : 3,
                                StartDate   : new Date(2014, 4, 8),
                                Duration    : 2
                            }
                        ]
                    }
                ]
            }
        });

        var task = taskStore.getNodeById(2);
        var originalSegments = task.getSegments().slice();

        t.is(originalSegments.length, 3, '3 segments');

        task.getSegment(1).setDuration(3);

        t.is(task.getSegment(1).getStartDate(), new Date(2014, 4, 5), 'Start date ok after merge');
        t.is(task.getSegment(1).getEndDate(), new Date(2014, 4, 10), 'End date ok after merge');

        t.is(task.getSegments().length, 2, '2 segments after merge');
        t.ok(task.dirty, 'Task dirty after segment changed');

        task.modified.Segments[0].data.PhantomId = originalSegments[0].data.PhantomId = null;
        task.modified.Segments[1].data.PhantomId = originalSegments[1].data.PhantomId = null;

        t.isDeeply(task.modified.Segments[0].data, originalSegments[0].data, 'A copy of segment #0 kept in "modified" hash');
        t.isDeeply(task.modified.Segments[1].data, originalSegments[1].data, 'A copy of segment #1 kept in "modified" hash');

        t.it('Should handle reject properly for Segments', function(t) {

            task.reject();

            t.is(task.getSegments().length, 3, '3 segments after reject');

            t.is(task.getSegment(0).getStartDate(), new Date(2014, 4, 1),   '#0 Start date ok after reject');
            t.is(task.getSegment(0).getEndDate(), new Date(2014, 4, 2),     '#0 End date ok after reject');

            t.is(task.getSegment(1).getStartDate(), new Date(2014, 4, 5),   '#1 Start date ok after reject');
            t.is(task.getSegment(1).getEndDate(), new Date(2014, 4, 7),     '#1 End date ok after reject');

            t.is(task.getSegment(2).getStartDate(), new Date(2014, 4, 8),   '#2 Start date ok after reject');
            t.is(task.getSegment(2).getEndDate(), new Date(2014, 4, 10),    '#2 End date ok after reject');
        });
    });

    t.it('Splits segment in the middle properly', function (t) {
        var task    = t.getAllStoresDataSet(
            [
                {
                    Id              : 1,
                    leaf            : true,
                    StartDate       : new Date(2014, 4, 1),
                    Segments        : [
                        {
                            Id          : 1,
                            StartDate   : new Date(2014, 4, 1),
                            Duration    : 1
                        },
                        {
                            Id          : 2,
                            StartDate   : new Date(2014, 4, 5),
                            Duration    : 2
                        },
                        {
                            Id          : 3,
                            StartDate   : new Date(2014, 4, 8),
                            Duration    : 2
                        }
                    ]
                }
            ]
        ).task(1);

        task.split(new Date(2014, 4, 6));

        checkSegments(t, task,
            [
                [ new Date(2014, 4, 1), new Date(2014, 4, 2) ],
                [ new Date(2014, 4, 5), new Date(2014, 4, 6) ],
                [ new Date(2014, 4, 7), new Date(2014, 4, 8) ],
                [ new Date(2014, 4, 9), new Date(2014, 4, 13) ]
            ],
            [
                [ 0, 1 ],
                [ 2, 3 ],
                [ 4, 5 ],
                [ 6, 8 ]
            ]
        );
    });

});
