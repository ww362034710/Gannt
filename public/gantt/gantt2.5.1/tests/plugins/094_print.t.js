StartTest({
    overrideSetTimeout : false
}, function (t) {

    t.it('Locked section columns should be aligned', function (t) {

        var plug = new Gnt.plugin.Printable({ autoPrintAndClose : false });

        var g = t.getGantt({
            renderTo          : Ext.getBody(),
            plugins           : plug,
            dependencyStore   : t.getDependencyStore(),
            taskStore         : new Gnt.data.TaskStore({
                root : {
                    children : [
                        { Name : 'Resource1 Something verrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrry loooooooooooooooooong', leaf : true, Id : 1, StartDate : new Date(2010, 1, 3), EndDate : new Date(2010, 1, 5) }
                    ]
                }
            }),
            columns : [
                { xtype : 'namecolumn', cls : 'hd-name', tdCls : 'cell-name', width : 200 },
                { xtype : 'startdatecolumn', cls : 'hd-date', tdCls : 'cell-date', width : 100 },
                { xtype : 'durationcolumn', cls : 'hd-dur', tdCls : 'cell-dur', width : 300 }
            ],
            lockedGridConfig  : {
                width       : 300
            }
        });

        t.chain(
            { waitFor : 'rowsVisible', args : g },

            function (next) {
                g.print();
                var win = plug.printWindow;
                var doc = win.document;

                t.waitFor(function () { return doc._loaded; },
                    function () {
                        t.isApprox(doc.getElementsByClassName('hd-name')[0].clientWidth, 200);
                        t.isApprox(doc.getElementsByClassName('cell-name')[0].clientWidth, 200);

                        t.isApprox(doc.getElementsByClassName('hd-date')[0].clientWidth, 100);
                        t.isApprox(doc.getElementsByClassName('cell-date')[0].clientWidth, 100);

                        t.isApprox(doc.getElementsByClassName('hd-dur')[0].clientWidth, 300);
                        t.isApprox(doc.getElementsByClassName('cell-dur')[0].clientWidth, 300);
                        win.close();

                        g.destroy();
                    });
            }
        );
    })

    t.it('Should work with hidden columns and collapsed locked section', function (t) {

        var plug = new Gnt.plugin.Printable({ autoPrintAndClose : false });

        var g = t.getGantt({
            viewPreset        : 'weekAndDayLetter',
            highlightWeekends : true,
            showTodayLine     : true,
            renderTo          : Ext.getBody(),
            viewConfig        : { forceFit : true },
            plugins           : plug,
            columns           : [
                { xtype : 'treecolumn' },
                { xtype : 'startdatecolumn' },
                { xtype : 'durationcolumn', cls : 'should_not_be_found', tdCls : 'should_not_be_found', hidden : true }
            ],
            dependencyStore   : t.getDependencyStore({
                data : [
                    { From : 1, To : 2, Type : 2},
                    { From : 2, To : 3, Type : 2}
                ]
            }),
            taskStore         : new Gnt.data.TaskStore({
                root : {
                    children : [
                        { leaf : true, Id : 1, StartDate : new Date(2010, 1, 3), EndDate : new Date(2010, 1, 5) },
                        { leaf : true, Id : 2, StartDate : new Date(2010, 1, 5), EndDate : new Date(2010, 1, 7) },
                        { leaf : true, Id : 3, StartDate : new Date(2010, 1, 11), EndDate : new Date(2010, 1, 11) }
                    ]
                }
            }),
            lockedGridConfig  : {
                width       : 300,
                collapsible : true
            }
        });

        t.chain(
            { waitFor : 'rowsVisible', args : g },
            { waitFor : 100 },

            function (next) {
                g.getSchedulingView(0).highlightCriticalPaths();
                g.lockedGrid.collapse();
                
                if (g.print() !== false) {
                    var win = plug.printWindow;
                    var bodyHtml = win.document.body.innerHTML;
    
                    win.close();
    
                    t.like(bodyHtml, 'sch-timeline', 'Found rendered column line');
                    t.like(bodyHtml, 'sch-zone', 'Found rendered zone');
                    t.like(bodyHtml, 'sch-gantt-critical-chain', 'Found highlighted view class');
                    t.like(bodyHtml, 'sch-gantt-task-highlighted', 'Found highlighted task');
                    t.like(bodyHtml, 'sch-dependency-selected', 'Found highlighted task');
                    t.unlike(bodyHtml, 'sch-print-lockedheader', 'Locked grid not added to print');
                    t.unlike(bodyHtml, 'should_not_be_found', 'Hidden column not printed');
                }

                g.destroy();
            }
        );
    })
});
