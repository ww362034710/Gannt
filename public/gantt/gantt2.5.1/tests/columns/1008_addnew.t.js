StartTest(function(t) {

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        columns : [
            {
                xtype : 'treecolumn',
                dataIndex : 'Id'
            },
            {
                xtype : 'addnewcolumn'
            }
        ]
    });

    t.chain(
        { waitFor : 'rowsVisible', args : g },

        { click : '>> addnewcolumn' },

        // "startEdit" delays focus of the field on 10ms
        'waitFor(50)',
        
        { type : 'Dur' },

        function (next){
            t.is(t.cq1('#addNewEditorComboList').getNodes().length, 1, 'Should only find 1 item in list after filtering');
            t.notOk(t.cq1('durationcolumn'), 'Should not find duration column in gantt chart initially')

            t.willFireNTimes(g.lockedGrid.view, 'refresh', 1)

            next();
        },

        { click : '>> #addNewEditorComboList' },

        function (next){
            t.ok(t.cq1('ganttpanel durationcolumn'), 'Should find duration column in gantt chart after selecting it');
            t.is(g.lockedGrid.headerCt.items.last(), t.cq1('addnewcolumn'), 'Add new column should still be the last one');
            
            t.matchGridCellContent(g.lockedGrid, 1, 1, g.taskStore.getById(117).getDuration(), "Duration column should not be empty")
            
            next();
        },
        
        { click : '>> addnewcolumn' },

        function (next){
            var store = t.cq1('addnewcolumn').colEditor.field.store;

            t.diag('Assert rollupcolumn is in list');   
            t.expect(store.find('text', 'Rollup')).toBeGreaterThan(-1);

            t.diag('Assert Add New Column… itself is not in the list');
            t.expect(store.find('text', 'Add new column')).toBe(-1);
        }
    )
});
