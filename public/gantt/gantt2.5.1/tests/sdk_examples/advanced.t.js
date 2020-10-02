StartTest(function(t) {

    t.it('Hit all buttons and try filter', function(t) {
        t.waitForRowsVisible(function() {
            t.chain(

                Ext.Array.map(t.cq('ganttpanel button'), function(cmp) {

                    return { click : cmp };
                }),

                { click : '>> namecolumn textfield' },

                { type : 'foo', target : '>> namecolumn textfield' },

                {
                    waitFor : function() {
                        return t.cq1('ganttpanel treeview').store.getCount() === 0;
                    }
                },

                { type : '[ESCAPE]' }
            )
        })
    })
});


