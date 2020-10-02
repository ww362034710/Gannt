Ext.define("Common.model.User", {
    extend: "Ext.data.Model",
    idProperty: "Id",
    nameField: "Name",
    fields: [{name: "Id"}, {name: "Name"}]
});