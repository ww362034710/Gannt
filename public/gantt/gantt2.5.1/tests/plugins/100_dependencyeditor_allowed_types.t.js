StartTest(function (t) {

    // Here we check that DependencyEditor supports allowedDependencyTypes setting

    t.it('Combobox shows only allowed dependency types',  function(t) {
        var editor  = new Gnt.plugin.DependencyEditor();

        var g = t.getGantt({
            dependencyStore     : t.getDependencyStore({
                allowedDependencyTypes : ['StartToStart', 'EndToStart']
            }),
            lockedGridConfig    : { width : 150 },
            viewPreset          : 'weekAndDayLetter',
            renderTo            : Ext.getBody(),
            forceFit            : true,
            plugins             : editor
        });

        t.chain(
            { waitFor       : 'tasksAndDependenciesToRender' },

            function (next) {
                editor.show(g.dependencyStore.getAt(0));

                t.is(editor.typeField.store.count(), 2, 'proper number of records in dropdown list');

                g.destroy();
            }
        );
    });

    t.it('If only 1 dependency type is allowed combobox gets readOnly',  function(t) {
        var editor  = new Gnt.plugin.DependencyEditor();

        var g = t.getGantt({
            dependencyStore     : t.getDependencyStore({
                allowedDependencyTypes : ['EndToStart']
            }),
            lockedGridConfig    : { width : 150 },
            viewPreset          : 'weekAndDayLetter',
            renderTo            : Ext.getBody(),
            forceFit            : true,
            plugins             : editor
        });

        t.chain(
            { waitFor       : 'tasksAndDependenciesToRender' },

            function (next) {
                editor.show(g.dependencyStore.getAt(0));

                t.is(editor.typeField.store.count(), 1, 'proper number of records in dropdown list');
                t.ok(editor.typeField.readOnly, 'field is readOnly');
            }
        );
    });
});
