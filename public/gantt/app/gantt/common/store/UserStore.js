Ext.define("Common.store.UserStore", {
    extend: "Ext.data.Store",
    model:"Common.model.User",
    storeId:"users",
    lastOptions:{}
})