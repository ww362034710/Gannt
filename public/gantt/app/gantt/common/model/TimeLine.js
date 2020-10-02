Ext.define('Common.model.TimeLine', {
    extend: 'Ext.data.Model',
    idProperty: "id",
    phantomIdField: "id",
    fields: [
        {name: 'id', type: 'string'},
        {name: 'text', type: 'string'},
        {name: 'date', type: 'date'}
    ],
    textField: "text",
    dateField: "date"
});