StartTest(function (t) {

    // Here we check that Gnt.widget.DependencyGrid repects Gnt.data.DependencyStore.allowedDependencyTypes setting

    var dependencyStore = new Gnt.data.DependencyStore({
        data : [
            {
                From : 3,
                To   : 4,
                Type : 3
            },
            {
                From : 4,
                To   : 2,
                Type : 3
            },
            {
                From : 1,
                To   : 2,
                Type : 3
            },
            {
                From : 5,
                To   : 3,
                Type : 3
            }
        ],
        allowedDependencyTypes : ['StartToStart', 'EndToEnd']
    });

    var taskStore = new Gnt.data.TaskStore({
        dependencyStore : dependencyStore,
        root            : {
            expanded : true,
            children : [
                {
                    Id        : 1,
                    Name      : 'Task 1',
                    StartDate : new Date(2011, 6, 1),
                    EndDate   : new Date(2011, 6, 5),
                    leaf      : true
                },
                {
                    Id        : 3,
                    Name      : 'Task 3',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 1),
                    EndDate   : new Date(2011, 6, 5)
                },
                {
                    Id        : 4,
                    Name      : 'Task 4',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 1),
                    EndDate   : new Date(2011, 6, 5)
                },
                {
                    Id        : 2,
                    Name      : 'Task 2',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 5),
                    EndDate   : new Date(2011, 6, 20)
                },
                {
                    Id        : 5,
                    Name      : 'Task 5',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 5),
                    EndDate   : new Date(2011, 6, 20)
                },
                {
                    Id        : 6,
                    Name      : 'Task 6',
                    leaf      : true,
                    StartDate : new Date(2011, 6, 5),
                    EndDate   : new Date(2011, 6, 20)
                }
            ]
        }
    });

    taskStore.refreshNodeStoreContent(true);

    var editor, record, grid1, grid2;

    grid1    = new Gnt.widget.DependencyGrid({
        renderTo        : Ext.getBody(),
        task            : taskStore.getById(2),
        width           : 400
    });

    t.chain(
        {
            waitFor : 'RowsVisible', args : grid1
        },

        // start editing of type column
        function (next) {
            grid1.cellEditing.startEditByPosition({ row : 0, column : 2 });

            t.waitForComponentVisible(grid1.typesCombo, next);
        },
        // let`s open picker
        {
            action : 'click',
            target : function () {
                editor = grid1.cellEditing.getActiveEditor();
                return editor.field.el.down('.x-form-trigger');
            }
        },
        function (next) {
            var selected = editor.field.getPicker().el.down('.x-boundlist-item.x-boundlist-selected').dom;
            selected = selected.innerText || selected.textContent;

            t.is(editor.field.store.count(), 2, '2 records in types combo');
            t.is(selected, 'Finish-To-Finish', 'Picker highlighted proper item "Finish-To-Finish"');

            next();
        },

        // test dependency adding
        function (next) {
            t.diag('Test dependency adding');
            record = grid1.insertDependency()[0];
            t.waitForComponentVisible(grid1.tasksCombo, next);
        },

        // new record should be first at store
        function (next) {
            t.is(record.get(record.typeField), 0, 'Type=2 (End-to-Start)');
            grid1.cellEditing.cancelEdit();

            // test new grid without task or dependencyStore config provided
            grid2 = new Gnt.widget.DependencyGrid({
                renderTo        : Ext.getBody(),
                width           : 400
            });

            t.diag('Load task 3 dependencies');

            grid2.loadDependencies(taskStore.getById(3));

            t.is(grid2.task.get('Id'), 3, 'Grid: task Id = 3');

            t.is(grid2.store.count(), 1, 'Grid: 1 dependency displayed');
            t.is(grid2.store.count(), grid2.getView().getNodes().length, 'Rendered all data in store ok');

            t.is(grid2.typesCombo.store.count(), 2, 'types combo store has 2 records');
        }

    );
});
