Ext.define('Common.data.CrudManager', {
    extend: 'Gnt.data.CrudManager',
    onLoad:function(data,other){
       return this.callParent(arguments);
    },
    onSync:function(data,other){

    },
    listeners: {
        loadfail: {
            fn: function( crudManager, response, responseOptions, eOpts ) {
                new Ext.window.MessageBox().alert("加载数据失败", "数据同步失败,请联系管理员");
            }
        },
        syncfail: {
            fn: function(crudManager, response, responseOptions, eOpts) {
                var msg = response && response.msg || "数据同步失败,请联系管理员";
                new Ext.window.MessageBox().alert("数据同步失败", msg);
            }
        }
    }
})