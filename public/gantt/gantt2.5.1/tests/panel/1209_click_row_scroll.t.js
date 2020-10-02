StartTest(function (t) {

    // Clicking rows in IE has caused scroll resets a few times:
    // https://www.assembla.com/spaces/bryntum/tickets/661#/activity/ticket:
    // https://www.assembla.com/spaces/bryntum/tickets/1095?comment=413136983#comment:413136983


    t.it('Click locked row or normal row should not trigger scroll change', function (t) {
        t.autoScrollElementsIntoView = false;

        var gantt = t.getGantt({
            width            : 500,
            height           : 200,
            cls              : 'first',
            lockedGridConfig : {
                width : 300
            },
            plugins          : new Sch.plugin.TreeCellEditing({ clicksToEdit : 2 }),
            renderTo         : Ext.getBody(),

            lockedViewConfig : {
                plugins     : {
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }
            }
        })

        var lockedViewEl = gantt.lockedGrid.view.el;
        var normalViewEl = gantt.normalGrid.view.el;

        t.chain(
            { waitFor : 'rowsVisible', args : gantt },
            
            function (next) {
                // only need to set the scroll top in one view and another will reflect
                t.scrollVerticallyTo(lockedViewEl.dom, 100, next)
            },
            function (next) {
                t.scrollHorizontallyTo(normalViewEl.dom, 100, next)
            },
            function (next) {
                t.scrollHorizontallyTo(lockedViewEl.dom, 100, next)
            },

            { waitFor : 1000 },

            function (next) {
                // in IE, locked view fires the "scroll" event, but the actual scroll position does not change,
                // wo we allow 1 "scroll" event, w/o position change (see below)
//                t.firesOk(lockedViewEl.dom, 'scroll', '<=1', 'Locked')
                t.wontFire(lockedViewEl.dom, 'scroll', 'Locked view');
                t.wontFire(normalViewEl.dom, 'scroll', 'Normal view');
                
//                Object.defineProperty(lockedViewEl.dom, "scrollLeft", {
//                    set : function() { debugger; }
//                });

//                Object.defineProperty(lockedViewEl.dom, "scrollTop", {
//                    set : function() { debugger; }
//                });                

                var beforeScrollTop     = lockedViewEl.dom.scrollTop
                var beforeScrollLeft    = lockedViewEl.dom.scrollLeft

//                lockedViewEl.on('scroll', function() {
//                    if (lockedViewEl.dom.scrollLeft != beforeScrollLeft || lockedViewEl.dom.scrollTop != beforeScrollTop) {
//                        t.fail("Locked view has changed the scroll position")
//                    }
//                })

                next();
            },

            { click : '.first .x-tree-view' }
//            ,
//            { click : '.first .sch-timelineview' }
        )
    })

    t.it('Starting/stopping edit should not trigger scroll change', function (t) {
        t.autoScrollElementsIntoView    = false;
        t.enableUnreachableClickWarning = false;

        var gantt = t.getGantt({
            width  : 500,
            height : 200,
            cls    : 'second',

            lockedGridConfig : {
                width : 340
            },
            renderTo         : Ext.getBody(),

            lockedViewConfig : {
                plugins     : {
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }
            },

            // Add some extra functionality
            plugins          : [
                Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit : 2 })
            ]
        })

        var lockedViewEl = gantt.lockedGrid.view.el;
        var normalViewEl = gantt.normalGrid.view.el;
        var scrollLeft;

        t.chain(
            { waitFor : 'rowsVisible', args : gantt },

            function (next) {

                lockedViewEl.dom.scrollLeft = lockedViewEl.dom.scrollTop = 300;
                normalViewEl.dom.scrollLeft = normalViewEl.dom.scrollTop = 100;

                next()
            },

            { dblclick : gantt.down('enddatecolumn'), offset : [5, '100%+20'] },

            { waitFor : 'selectorAtCursor', args : '.x-form-field'},

            function (next) {
                // From this point, no view should not scroll
                t.wontFire(lockedViewEl, 'scroll', 'Locked view')
                t.wontFire(normalViewEl, 'scroll', 'Normal view')

                scrollLeft = lockedViewEl.dom.scrollLeft;

                next();
            },

            { click : '.second .x-tree-view', offset : [120, 20] },

            function (next) {
                t.is(lockedViewEl.dom.scrollLeft, scrollLeft, 'Scroll left position should not be reset');
                next()
            },

            { dblclick : '.second .x-tree-view', offset : ["100%-70", 80] },
            { click : '.second .x-tree-view', offset : [100, 100] },
            { click : '.second .x-tree-view', offset : [40, 120] },
            { click : '.second .x-tree-view', offset : [100, 20] },

            function (next) {
                t.is(lockedViewEl.dom.scrollLeft, scrollLeft, 'Scroll left position should not be reset');
            }
        )
    })
})