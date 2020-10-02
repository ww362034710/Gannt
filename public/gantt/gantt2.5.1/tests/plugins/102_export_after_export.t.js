StartTest(function (t) {
    var gantt;
    
    var setup = function () {
        gantt = t.getGantt({
            renderTo : Ext.getBody(),
            plugins  : Ext.create('Gnt.plugin.Export', {
                printServer: '../examples/export/server.php',
                openAfterExport: false            
            }),
            columns       : [
                // Any regular Ext JS columns are ok
                {
                    xtype     : 'sequencecolumn',
                    width     : 40,
    
                    // This CSS class is added to each cell of this column
                    tdCls     : 'id'
                },
                {
                    xtype     : 'namecolumn',
                    width     : 200
                },
                {
                    xtype : 'startdatecolumn'
                },
                {
                    xtype : 'enddatecolumn'
                },
                {
                    xtype : 'durationcolumn'
                },
                {
                    xtype : 'percentdonecolumn',
                    width : 60
                },
                {
                    xtype               : 'predecessorcolumn',
                    useSequenceNumber   : true
                },
                {
                    xtype : 'addnewcolumn'
                }
            ]
        });
    };
        
    t.it('Should restore columns after export', function (t) {
        setup();
        
        t.chain(
            { waitForRowsVisible : gantt },
            function (next) {
                gantt.lockedGrid.setWidth(200);
                
                gantt.doExport({
                    format              : "Letter",
                    orientation         : "portrait",
                    range               : "complete",
                    showHeader          : true,
                    singlePageExport    : false
                }, next);
            },
            function () {
                t.is(gantt.el.query('.x-splitter').length, 1, 'Splitter is ok');
                
                var result = Ext.Array.every(gantt.lockedGrid.headerCt.items.items, function (column) {
                        return column.isVisible();
                }); 
                t.ok(result, 'All columns are visible');
            }
        );
    });
});