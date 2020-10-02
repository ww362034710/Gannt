StartTest(function(t) {
    t.expectGlobal('0'); // We love IE

    var iframe, calculatedPages;

    var getStyle = function (el, styleProp) {
        if (el.currentStyle) {
            return el.currentStyle[styleProp];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        }
    };

    var setIframe = function (html, cb) {
        // drop previously used iframe
        iframe && iframe.parentNode.removeChild(iframe);
        // build new one
        iframe  = document.body.appendChild(document.createElement('iframe'));
        // attach provided callback to iframe `load` event
        t.$(iframe).bind('load', cb);

        var doc = iframe.contentWindow.document;

        doc.open();
        doc.write(html);
        doc.close();
    };

    var getLeftShift = function (page) {
        return !page ? 0 : - (calculatedPages.columnsAmountLocked * calculatedPages.timeColumnWidth +
            (page - 1) * calculatedPages.columnsAmountNormal * calculatedPages.timeColumnWidth);
    };


    var plugin      = new Gnt.plugin.Export({
        printServer : 'none',
        test        : true
    });

    var gantt   = t.getGantt({
        renderTo : Ext.getBody(),
        plugins  : plugin
    });

    t.waitForRowsVisible(gantt, function() {

        var exported = plugin.doExport({
            format              : "Letter",
            orientation         : "portrait",
            range               : "complete",
            showHeader          : true,
            singlePageExport    : false
        });

        plugin.unmask();

        var htmls       = exported.htmlArray;

        calculatedPages = exported.calculatedPages;

        t.ok(!!htmls, "Export array is not empty");

        t.chain(
            function (next) {

                setIframe(htmls[0].html, function () {
                    var depView = t.$('.sch-dependencyview-ct', iframe.contentWindow.document)[0];

                    t.is(parseFloat(getStyle(depView, "left")), 0, "0th page: no `left` shift");
                    t.is(parseFloat(getStyle(depView, "top")), 0, "0th page: no `top` shift");

                    next();
                });

            },

            function (next) {

                setIframe(htmls[1].html, function () {
                    var depView = t.$('.sch-dependencyview-ct', iframe.contentWindow.document)[0];

                    t.is(parseFloat(getStyle(depView, "left")), getLeftShift(1), "1st page: left shift is correct");
                    t.is(parseFloat(getStyle(depView, "top")), 0, "1st page: no `top` shift");

                    next();
                });

            },

            function (next) {

                setIframe(htmls[2].html, function () {
                    var depView = t.$('.sch-dependencyview-ct', iframe.contentWindow.document)[0];

                    t.is(parseFloat(getStyle(depView, "left")), getLeftShift(2), "2nd page: left shift is correct");
                    t.is(parseFloat(getStyle(depView, "top")), 0, "2nd page: no `top` shift");

                    next();
                });

            },

            function (next) {

                setIframe(htmls[3].html, function () {
                    var depView = t.$('.sch-dependencyview-ct', iframe.contentWindow.document)[0];

                    t.is(parseFloat(getStyle(depView, "left")), getLeftShift(3), "3rd page: left shift is correct");
                    t.is(parseFloat(getStyle(depView, "top")), 0, "3rd page: no `top` shift");

                    next();
                });

                //First task should be visible #1334
                var firstTask = gantt.getSchedulingView().getEl().down('.sch-event-wrap');
                t.is(firstTask.getStyle('left'), '600px', "First task should have proper left position");
            },

            // fake last step forcing chain() to wait till previous step calls next()
            function (next) {}
        );

    });

});
