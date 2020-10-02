StartTest(function(t) {
    t.expectGlobals('MyExportPlugin');

    t.wait('export', 30000);

    Ext.define('MyExportPlugin', {
        extend: 'Gnt.plugin.Export',

        onSuccess: function (response){
            var text = Ext.JSON.decode(response.responseText);

            t.pass('Request successfull.');
            t.endWait('export');

            if (text.success) {
                this.callParent(arguments);
                ajaxTestFiles(text.url);
            } else {
                t.fail('Export failed: ' + text.msg);
            }
        },

        onFailure: function (response) {
            this.callParent(arguments);

            t.fail("Request failed");
            t.endWait('export');
        }
    });

    var gantt = t.getGantt({
            renderTo : Ext.getBody(),
            plugins  : Ext.create('MyExportPlugin', {
                printServer: '../examples/export/server.php',
                openAfterExport: false
            })
        }),
        ajaxTestFiles = function(url) {
            t.wait('xhrResponse');

            Ext.Ajax.request({
                method  : 'HEAD',
                url     : url,
                success : function (response, opts) {
                    t.pass('File created');
                    t.ok(response.getResponseHeader('Content-Length'), 'File has some size');

                    t.endWait('xhrResponse');
                },

                failure : function (response, opts) {
                    t.fail("Request failed");

                    t.endWait('xhrResponse');
                }
            });
        };

    t.waitForRowsVisible(gantt, function(result){
        gantt.doExport();
    });
});
