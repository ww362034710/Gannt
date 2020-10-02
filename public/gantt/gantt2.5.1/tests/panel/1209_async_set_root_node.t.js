StartTest(function(t) {
    //

    var taskStore = Ext.create("Gnt.data.TaskStore", {
        proxy   : {
            type   : 'memory'
        },
        root    : {
            children    : [{
                Id          : 11,
                Name        : "xxx",
                PercentDone : 40,
                StartDate   : "2010-01-18",
                Duration    : 1,
                leaf        : true
            }],
            expanded    : true
        }
    });

    var gantt       = t.getGantt({
        startDate           : new Date(2010, 0, 17),
        endDate             : new Date(2011, 0, 17),
        width               : 400,
        taskStore           : taskStore,
        lockedGridConfig    : {
            collapsible : true,
            width       : 100
        },
        renderTo            : Ext.getBody()
    })

    t.it('Should update normal grid body width after asynchronous setRootNode call', function(t) {
        t.chain(
            { waitFor : 'rowsVisible' },

            function () {
                var async = t.beginAsync();

                setTimeout(function() {
                    taskStore.setRootNode({
                        children    : [{
                            Id          : 1,
                            Name        : 'Very long task',
                            PercentDone : 40,
                            StartDate   : '2010-01-18',
                            Duration    : 1000,
                            leaf        : true
                        }],
                        expanded    : true
                    });

                    var view    = gantt.normalGrid.getView();

                    // https://www.assembla.com/spaces/bryntum/tickets/1569
                    t.todo('See ticket 1569', function (t) {
                        t.ok(view.getEl().query(view.getBodySelector())[0].style.width, 'There is inline width definition');
                    });
                    
                    t.endAsync(async);
                }, 1000);

            }
        );
    });

});

