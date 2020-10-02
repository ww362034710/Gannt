StartTest(function (t) {
    t.expectGlobals('App', 'MyApp', 'ExampleDefaults');

    var gantt, scheduler;

    function assertPanelsSynced() {
        var headersSynced = gantt.normalGrid.headerCt.el.dom.scrollLeft === scheduler.normalGrid.headerCt.el.dom.scrollLeft;
        var bodiesSynced = gantt.normalGrid.getView().getHorizontalScroll() === scheduler.normalGrid.getView().getHorizontalScroll();

        if (headersSynced && bodiesSynced) {
            t.ok(headersSynced, 'Header scroll synced');
            t.ok(bodiesSynced, 'Body scroll synced');

            t.is(gantt.timeAxisViewModel, scheduler.timeAxisViewModel, 'View model should always be shared');
            t.is(gantt.viewPreset , scheduler.viewPreset, 'View preset should always be shared')
        }

        return headersSynced && bodiesSynced;
    }

    t.chain(

        { waitFor : 'selector', args : '.sch-gantt-item', timeout : 10000 },

        function(next) {
            gantt = t.cq1('ganttpanel');

            t.isGreater(gantt.assignmentStore.getCount(), 0, 'AssignmentStore has data');
            t.isGreater(gantt.resourceStore.getCount(), 0, 'ResourceStore has data');
            t.isGreater(gantt.calendar.getCount(), 0, 'Calendar has data');
            t.isGreater(gantt.dependencyStore.getCount(), 0, 'DependencyStore has data');

            next();

        },

        { action : 'click', target : '.icon-calendar' },

        { waitFor : 'selector', args : '.sch-event' },

        { waitFor : 1000 },

        function(next) {
            gantt = t.cq1('ganttpanel');
            scheduler = t.cq1('schedulergrid');

            t.firesOnce(gantt.taskStore, 'update');
            t.firesOnce(gantt.assignmentStore, 'add');
            t.firesOnce(gantt.assignmentStore,  'remove');

            t.ok(assertPanelsSynced(), 'In sync initially');

            gantt.zoomOut();
            next();
        },

        { waitFor : 200 },

        { drag : '.sch-event:contains(Evaluate)', by : [40, -40] },

        { waitFor : assertPanelsSynced },

        function(next) {
            gantt.zoomOut();
            next();
        },

        { waitFor : assertPanelsSynced },

        function(next) {
            gantt.zoomOut();
            next();
        },

        { waitFor : assertPanelsSynced },

        { drag : '>>ganttpanel splitter', by: [-10, 0] },

        function(next) {
            t.is(t.cq1('ganttpanel treepanel').getWidth(), t.cq1('schedulergrid gridpanel').getWidth(), 'Locked grid widths should be synced')

            t.livesOk(function() {
                scheduler.destroy();
            }, 'Should be able to destroy scheduler when paired with Gantt');

            t.livesOk(function() {
                gantt.destroy();
            }, 'Should be able to destroy gantt');
        }
    );
})
