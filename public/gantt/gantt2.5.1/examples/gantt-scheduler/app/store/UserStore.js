Ext.define("MyApp.store.UserStore", {
    extend: "Ext.data.Store",
    model:"MyApp.model.User",
    storeId:"users",
    lastOptions:{}
})