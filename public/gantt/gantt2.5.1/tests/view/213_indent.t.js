describe('Indent tests', function (t) {

    t.it('After indent, row selection/focus should be kept', function(t) {

        var g = t.getGantt({
            lockedGridConfig : {
                width : 100
            },
            height           : 200,
            renderTo         : Ext.getBody(),
            taskStore        : new Gnt.data.TaskStore({
                proxy : 'memory',
                root  : {
                    children : [
                        {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                        { Id : 1, leaf : true },
                        { Id : 2, leaf : true }
                    ]
                }
            })
        });

        var id = function (id) {
            return g.taskStore.getById(id)
        }

        var task2 = id(2)
        var vertScroll;
        var lockedView = g.lockedGrid.view;

        t.chain(
            { waitFor : 'RowsVisible' },

            function (next) {
                t.wontFire(lockedView, 'refresh');

                lockedView.focusRow(task2);

                vertScroll = lockedView.el.dom.scrollTop;
                t.is(document.activeElement, g.lockedGrid.view.getNode(task2))
                t.waitForEvent(g.taskStore, 'indentationchange', next);
                g.taskStore.indent(task2);
            },

            function (next) {
                var activeElement = t.activeElement()

                // The Ext JS table panel will focus one of the locked/normal row els
                if (!Ext.isIE) {
                    t.is(activeElement, g.lockedGrid.view.getNode(task2), "Correct row re-focused after indent")
                }
                t.is(lockedView.el.dom.scrollTop, vertScroll, 'Vertical scroll should not change');

                next()
            },

            function (next) {
                g.normalGrid.view.focusRow(task2);

                t.is(document.activeElement, g.normalGrid.view.getNode(task2))
                t.waitForEvent(g.taskStore, 'indentationchange', next);
                g.taskStore.outdent(task2);
            },

            function (next) {
                var activeElement = t.activeElement()

                // The Ext JS table panel will focus one of the locked/normal row els
                if (!Ext.isIE) {
                    t.is(activeElement, g.normalGrid.view.getNode(task2), "Correct row re-focused after outdent")
                }
                t.is(lockedView.el.dom.scrollTop, vertScroll, 'Vertical scroll should not change when removing last row');
            }
        )
    })

    t.it('No refreshes should be performed with buffered view when indenting', function(t) {

        var g = t.getGantt({
            lockedGridConfig : {
                width : 100
            },
            plugins          : 'bufferedrenderer',
            height           : 200,
            renderTo         : Ext.getBody(),
            taskStore        : new Gnt.data.TaskStore({
                proxy : 'memory',
                root  : {
                    children : [
                        {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                        { Id : 1, leaf : true },
                        { Id : 2, leaf : true },
                        { Id : 3, leaf : true },
                        { Id : 4, leaf : true }
                    ]
                }
            })
        });

        var id = function (id) {
            return g.taskStore.getById(id)
        }

        var task2 = id(2)
        var lockedView = g.lockedGrid.view;

        t.chain(
            { waitForRowsVisible : g },

            function (next) {
                var before = t.getTotalLayoutCounter();

                t.firesOnce(lockedView, 'refresh');

                g.taskStore.indent([id(1), id(2), id(3), id(4)]);

                // We use suspendLayouts to limit the amount of Ext layouts
                t.isLess(t.getTotalLayoutCounter(), before + 10, 'Should not cause excessive layouts for indent')
            }
        )
    })

})
