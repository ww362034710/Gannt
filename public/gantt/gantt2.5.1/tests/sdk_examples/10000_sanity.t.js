StartTest({ defaultTimeout : 60000 }, function(t) {
    var scripts = Ext.select('script', Ext.getHead());
    var foundGantt = false;
    var foundExt = false;

    scripts.each(function(el) {
        if (el.dom.src && el.dom.src.match(/gnt-all-debug\.js/)){
            foundGantt = true;
        }

        if (el.dom.src && el.dom.src.match(/cdn\.sencha\.(io|com)/) && el.dom.src.match('ext-all.js')){
            foundExt = true;
        }
    });

    t.ok(foundGantt, 'Script tag with sch-all-debug.js found');

    t.ok(foundExt, 'ext-all.js script tag using cdn.sencha.io found');

    t.waitForSelector('.sch-gantt-item', function() {
        t.pass('Example rendered without exception');

        t.it('Search for suspicious header rendering artefacts', function(t) {
            Ext.select('.sch-column-header').each(function(el) {
                if (el.getWidth() <= 0) {
                    t.fail('Header cell has incorrect width: ' + el.getWidth());
                }
            })
        })

        t.it('Search for suspicious event rendering artefacts', function(t) {
            Ext.select('.sch-gantt-item').each(function(el) {

                if (el.isVisible(true) && el.getWidth() <= 0) {
                    t.fail('Task element has incorrect width: ' + el.getWidth());
                }
            })
        })

        t.monkeyTest('>>ganttpanel', 10);
    });
});
