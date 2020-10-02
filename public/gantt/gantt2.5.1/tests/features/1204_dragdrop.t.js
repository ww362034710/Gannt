StartTest(function (t) {
    var gantt, task1, task2, tickWidth;
    
    var getGantt    = function (config) {
        var dragFn = function (record, start, duration, e) {
	        var argsAreCorrect  = arguments[0] instanceof Gnt.model.Task &&
	            arguments[1] instanceof Date &&
	            typeof arguments[2] === 'number' &&
	            arguments[3] instanceof Ext.EventObjectImpl
	            
	        if (!argsAreCorrect) t.fail('Correct `dndValidatorFn` function arguments');
	
	        if (record == task1 && start > new Date(2010, 1, 5)) {
	            return false;
	        }
	        return true;
	    };
	
	    var g = t.getGantt2(Ext.apply({
	        startDate      : new Date(2010, 1, 1),
	        dndValidatorFn : dragFn,
            renderTo       : Ext.getBody(),
	        taskStore      : new Gnt.data.TaskStore({
	            proxy : 'memory',
	            root  : {
	                children : [
	                    {
	                        Id          : 1,
	                        Cls         : 'task1',
	                        StartDate   : new Date(2010, 1, 1),
	                        Duration    : 3,
	                        leaf        : true
	                    },
	                    {
	                        Id          : 2,
	                        Cls         : 'task2',
	                        StartDate   : new Date(2009, 11, 1),
	                        Duration    : 100,
	                        leaf        : true
	                    },
                        {
                            Id          : 3,
                            Cls         : 'task3',
                            StartDate   : new Date(2010, 1, 8),
                            Duration    : 3,
                            leaf        : true
                        }
	                ]
	            }
	        })
	    }, config));
        
        return g;
    }

    t.it('Should be possible to drag a regular task', function (t) {
        gantt && gantt.destroy();
        
        gantt = getGantt();
        
        task1       = gantt.taskStore.getById(1);
        
        tickWidth   = gantt.timeAxisViewModel.getTickWidth();
        
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
    
            { drag : '.task1', by : [ tickWidth, 0 ] },
    
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 2), 'Task dragged properly');
                next();
            }
        )
    })

    
    t.it('Should be possible to block the drag with `dndValidatorFn`', function (t) {
        t.chain(
            { drag : '.task1', by : [ tickWidth * 10, 0 ] },
    
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 2), 'Task drag blocked by dndValidatorFn');
                next();
            }
        )
    })
    
    
    t.it('Should be possible to drag a task that starts/ends outside of the view', function (t) {
        gantt && gantt.destroy();
        gantt = getGantt();
        
        task2       = gantt.taskStore.getById(2);
        
        t.chain(
            // dragging a task that starts and ends outside of the current view
            { drag : '.task2', offset : [ 10, 5 ], by : [ tickWidth, 0 ] },
    
            function (next) {
                t.is(task2.getStartDate(), new Date(2009, 11, 2), 'Task dragged properly');
                next();
            },
            
            { drag : '.task2', offset : [ 2 * tickWidth, 5 ], by : [ -tickWidth, 0 ] },
    
            function (next) {
                t.is(task2.getStartDate(), new Date(2009, 11, 1), 'Task dragged properly');
                next();
            }
        )
    });
    
    t.it('Should cancel drop using async hook', function (t) {
        gantt && gantt.destroy();
        gantt = getGantt();
        
        tickWidth   = gantt.timeAxisViewModel.getTickWidth();
        task1       = gantt.taskStore.getById(1);
        
        t.wontFire(gantt, 'taskdrop', 'Task wasn\'t dropped');
        
        gantt.on('beforetaskdropfinalize', function (dz, dd, e) {
            setTimeout(function () {
                dd.finalize(false);
            }, 500);
            return false;
        });
        
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            { drag : '.task1', by : [ tickWidth, 0 ] },
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 1), 'Task hasn\'t moved');
                next();
            },            
            { waitFor: 1000 },
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 1), 'Task hasn\'t moved');
                next();
            }
        );
    });
    
    t.it('Should apply drop using async hook', function (t) {
        gantt && gantt.destroy();
        gantt = getGantt();
        
        gantt.on('beforetaskdropfinalize', function (dz, dd, e) {
            setTimeout(function() { 
                dd.finalize(true); 
            }, 500);
            return false;
        });
        t.firesOnce(gantt, 'taskdrop', 'Correct number of drop events');
        
        tickWidth   = gantt.timeAxisViewModel.getTickWidth();
        task1       = gantt.taskStore.getById(1);
        var task3   = gantt.taskStore.getById(3);
        
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            { drag : '.task1', by : [ tickWidth, 0 ] },
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 1), 'Task hasn\'t moved');
                next();
            }, 
            { waitFor: 1000 },
            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 2), 'Task dragged');
                next();
            },
            { drag : '.task3', by : [ tickWidth * -1.5, 0 ] },
            function (next) {
                t.is(task3.getStartDate(), new Date(2010, 1, 8), 'Task hasn\'t moved');
                next();
            }, 
            { waitFor: 1000 },
            function (next) {
                t.is(task3.getStartDate(), new Date(2010, 1, 8), 'Task hasn\'t moved');
                next();
            }
        );
    });
    
    t.it('Should resize drag proxy', function (t) {
        gantt && gantt.destroy();
        gantt = getGantt({
            dndValidatorFn  : null,
            dragDropConfig  : {
                showExactDropPosition   : true
            }
        });
        
        tickWidth   = gantt.timeAxisViewModel.getTickWidth();
        task1       = gantt.taskStore.getById(1);
        task1.setDuration(5);
        task1.setStartDate(new Date(2010, 1, 8));
        
        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            { drag : '.task1', by : [ tickWidth, 0 ], dragOnly : true },
            function (next) {
                t.isApprox(t.$('.x-dd-drag-ghost > .task1').width(), tickWidth * 7, 2, 'Proxy resized');
                next();
            },
            { action : 'mouseUp' },
            { drag : '.task1', by : [ tickWidth * 5, 0 ], dragOnly : true },
            function (next) {
                t.isApprox(t.$('.x-dd-drag-ghost > .task1').width(), tickWidth * 5, 2, 'Proxy resized');
                next();
            },
            { action : 'mouseUp' },
            { drag : '.task1', by : [ -3 * tickWidth, 0 ], dragOnly : true },
            function (next) {
                t.isApprox(t.$('.x-dd-drag-ghost > .task1').width(), tickWidth * 7, 2, 'Proxy resized');
                next();
            },
            { action : 'mouseUp' }
        );
    });

    t.it('Mousedown + up should count as an invalid drop', function (t) {
        gantt && gantt.destroy();
        gantt = getGantt();

        task1       = gantt.taskStore.getById(1);
        task1.setStartDate(new Date(2010, 1, 1));

        t.wontFire(gantt, 'taskdrop')

        t.chain(
            { drag      : '.task1', by : [4, 0] },

            { mousedown : '.task1' },

            { waitFor   : 1000 },

            { action    : 'mouseup' },

            function (next) {
                t.is(task1.getStartDate(), new Date(2010, 1, 1), 'Task is untouched');
            }
        );
    });
    
    t.it('Should display correct drop position with snapToIncrement', function (t) {
        gantt && gantt.destroy();
        gantt = getGantt({
            snapToIncrement : true,
            dragDropConfig : {
                showExactDropPosition : true
            }
        });
        
        var testBox;
        
        t.chain(
            { waitForSelector : '.task3' },
            function (next) {
                testBox = gantt.el.down('.task3').getBox();
                next();
            },
            { drag : '.task3', by : [10, 0], dragOnly : true },
            function (next) {
                var proxyBox = gantt.el.down('.x-dd-drag-ghost .sch-gantt-item').getBox();
                t.isDeeply(proxyBox, testBox, 'Proxy positioned correctly');
                next();
            },
            { moveCursorBy : [[-20, 0]] },
            function (next) {
                var proxyBox = gantt.el.down('.x-dd-drag-ghost .sch-gantt-item').getBox();
                t.isDeeply(proxyBox, testBox, 'Proxy positioned correctly');
                next();
            },
            { action : 'mouseUp' }
        );
    });
});    
