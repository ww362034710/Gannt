StartTest(function(t) {
    
    // https://www.assembla.com/spaces/bryntum/tickets/1181#/activity/ticket:
    
    var editing = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit: 2 });

    var g = t.getGantt({
        renderTo    : Ext.getBody(),
        plugins     : editing,
        lockedGridConfig : {
            width : 200
        },
        columns     : [
            { xtype : 'treecolumn', dataIndex : 'Name', field : {} },
            { xtype : 'startdatecolumn' },
            { xtype : 'enddatecolumn' },
            { xtype : 'durationcolumn' },

            // The addRowOnTab feature should work also when tabbing out of the last visible column if there are hidden columns after it
            { xtype : 'enddatecolumn', hidden : true }
        ]
    });
    
    var taskStore       = g.taskStore,
        firstTask       = taskStore.getRootNode().childNodes[0],
        lockedGrid      = g.lockedGrid,
        pos             = { row : 1, column : 1 };
    
    var storeCount      = lockedGrid.view.store.getCount();

    function getCell() {
        return lockedGrid.getView().getCellByPosition(pos);
    }

    function editCheck(t, column, next) {

        // when running in automation, in IE10m editor is sometimes closed after tabbing on previous step
        // this happens sporadically and in IE10m only(!), very hard to debug (seems to only manifest itself in automation)
        // so just resuming the editing
        if (Ext.isIE10m && !editing.editing) {
            pos = { row : storeCount, column : column };
            t.doubleClick(getCell(), function () {
                t.waitForSelectorAtCursor('.x-form-field', next)
            })
        } else
            next()
    }
    
    t.chain(
        { waitFor : 'waitForEventsToRender', args : g },
        
        { doubleclick : getCell },
    
        { waitFor : 'selectorAtCursor', args : 'input' },
        
        function (next) {
            pos.column++;
            next();
        },

        { doubleclick : getCell },

        { waitFor : 'selectorAtCursor', args : 'input' },

        function (next) {
            pos = { row : storeCount-1, column : 3 };
            next();
        },

        { doubleclick : getCell },
        
        { waitFor : 'SelectorAtCursor', args : '.x-form-field' },

        { type : '[TAB]', target : '.x-editor input' },

        { waitFor : 100 },

        function (next) {
            t.is(lockedGrid.view.store.getCount(), storeCount + 1, '1 new model was added after tabbing out of last cell');
            t.is(lockedGrid.view.getNodes().length, storeCount + 1, '1 new row was rendered after tabbing out of last cell');

            t.is(lockedGrid.view.el.dom.scrollLeft, 0, 'Scroll should be reset to 0 to show the editor');

            t.waitFor(100, next)
        },
        
        function (next) {
            editCheck(t, 0, next);
        },

        { type : '[TAB]', target : '.x-editor input' },

        function (next) {
            t.is(g.getTaskStore().getNewRecords().length, 1, 'Should find only 1 new model');

            next()
        },

        function (next) {
            editCheck(t, 1, next);
        },

        // Trigger another new row, which should after adding should cause scroll to reset
        { type : '[TAB]', target : '.x-editor input' },
        { type : '[TAB]', target : '.x-editor input' },
        { type : '[TAB]', target : '.x-editor input' },

        function (next) {
            t.is(g.getTaskStore().getNewRecords().length, 2, 'Should find 2 new models');
            t.is(lockedGrid.view.el.dom.scrollLeft, 0, 'Scroll should be reset to 0 to show the editor');
        }
    );
});
