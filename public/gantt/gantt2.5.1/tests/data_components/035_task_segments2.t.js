StartTest(function(t) {

    // Checks that task availability iterator enumerates proper set of intervals for a business time calendar #1628

    var taskStore   = new Gnt.data.TaskStore({
        calendar    : new Gnt.data.calendar.BusinessTime(),

        root        : {
            children    : [
                {
                    Id              : 1,
                    StartDate       : '2012-09-03 08:00:00',
                    EndDate         : '2012-09-17 17:00:00',
                    Duration        : 9,
                    DurationUnit    : 'd',
                    Segments        : [
                        {
                            Id              : 1,
                            StartDate       : '2012-09-03 08:00:00',
                            EndDate         : '2012-09-04 17:00:00',
                            Duration        : 2,
                            DurationUnit    : 'd'
                        }, {
                            Id              : 2,
                            StartDate       : '2012-09-06 08:00:00',
                            EndDate         : '2012-09-10 17:00:00',
                            Duration        : 3,
                            DurationUnit    : 'd'
                        }, {
                            Id              : 3,
                            StartDate       : '2012-09-12 08:00:00',
                            EndDate         : '2012-09-17 17:00:00',
                            Duration        : 4,
                            DurationUnit    : 'd'
                        }
                    ],
                    leaf : true
                }
            ]
        }
    });

    var task    = taskStore.getNodeById(1);
    var time    = function (day, hour) { return new Date(2012, 8, day, hour) - 0; };

    t.it('forEachAvailabilityInterval takes split into account', function (t) {

        var intervals   = [];

        task.forEachAvailabilityInterval({
            startDate   : task.getStartDate(),
            endDate     : task.getEndDate(),
            fn          : function (from, to) {
                intervals.push([ from, to ]);
            }
        });

        t.is(intervals.length, 18, 'correct number of intervals enumerated');
        t.isDeeply(intervals[0], [ time(3, 8),  time(3, 12) ], '0: correct interval');
        t.isDeeply(intervals[1], [ time(3, 13), time(3, 17) ], '1: correct interval');

        t.isDeeply(intervals[2], [ time(4, 8),  time(4, 12) ], '2: correct interval');
        t.isDeeply(intervals[3], [ time(4, 13), time(4, 17) ], '3: correct interval');

        t.isDeeply(intervals[4], [ time(6, 8),  time(6, 12) ], '4: correct interval');
        t.isDeeply(intervals[5], [ time(6, 13), time(6, 17) ], '5: correct interval');

        t.isDeeply(intervals[6], [ time(7, 8),  time(7, 12) ], '6: correct interval');
        t.isDeeply(intervals[7], [ time(7, 13), time(7, 17) ], '7: correct interval');

        t.isDeeply(intervals[8], [ time(10, 8),  time(10, 12) ], '8: correct interval');
        t.isDeeply(intervals[9], [ time(10, 13), time(10, 17) ], '9: correct interval');

        t.isDeeply(intervals[10], [ time(12, 8),  time(12, 12) ], '10: correct interval');
        t.isDeeply(intervals[11], [ time(12, 13), time(12, 17) ], '11: correct interval');
        t.isDeeply(intervals[12], [ time(13, 8),  time(13, 12) ], '12: correct interval');
        t.isDeeply(intervals[13], [ time(13, 13), time(13, 17) ], '13: correct interval');
        t.isDeeply(intervals[14], [ time(14, 8),  time(14, 12) ], '14: correct interval');
        t.isDeeply(intervals[15], [ time(14, 13), time(14, 17) ], '15: correct interval');
        t.isDeeply(intervals[16], [ time(17, 8),  time(17, 12) ], '16: correct interval');
        t.isDeeply(intervals[17], [ time(17, 13), time(17, 17) ], '17: correct interval');
    });

});
