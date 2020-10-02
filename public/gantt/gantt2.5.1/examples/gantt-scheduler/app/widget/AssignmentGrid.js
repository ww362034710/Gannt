Ext.define('MyApp.widget.AssignmentGrid', {
    extend: 'Gnt.widget.AssignmentGrid',
    requires:[ 'MyApp.column.AssignmentUnits'],
    constructor: function (a) {
        this.callParent(arguments)
    },
    buildColumns: function () {
        return[
            {xtype: "resourcenamecolumn"},
            {xtype: "myappassignmentunitscolumn", assignmentStore: this.assignmentStore, editor: {xtype: "textfield"}}
        ]
    },
    setEditableFields: function (c) {
        if (!this.assignmentUnitsEditor) {
            this.assignmentUnitsEditor = this.down("myappassignmentunitscolumn").getEditor()
        }
        return this.callParent(arguments)
    }
})