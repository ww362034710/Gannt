StartTest(function(t) {

    // Here we check that dependencies receive correct shift in case of particular time spane exporting (#867)

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


    var plugin  = new Gnt.plugin.Export({
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
            range               : "date",
            dateFrom            : new Date(2010, 1, 11),
            dateTo              : new Date(2010, 1, 20),
            showHeader          : true,
            singlePageExport    : false
        });

        var htmls       = exported.htmlArray;

        calculatedPages = exported.calculatedPages;

        t.is(htmls.length, 2, "2 pages exported");

        t.chain(
            function (next) {
                setIframe(htmls[0].html, function () {
                    var depView = t.$('.sch-dependencyview-ct', iframe.contentWindow.document)[0];

                    t.is(parseFloat(getStyle(depView, "left")), -60, "0th page: left shift is correct");
                    t.is(parseFloat(getStyle(depView, "top")), 0, "0th page: no `top` shift");

                    next();
                });
            },

            function (next) {

                setIframe(htmls[1].html, function () {
                    var depView = t.$('.sch-dependencyview-ct', iframe.contentWindow.document)[0];

                    t.is(parseFloat(getStyle(depView, "left")), -60 + getLeftShift(1), "1st page: left shift is correct");
                    t.is(parseFloat(getStyle(depView, "top")), 0, "1st page: no `top` shift");

                    next();
                });
            },

            // fake last step forcing chain() to wait till previous step calls next()
            function (next) {}
        );

    });

});
