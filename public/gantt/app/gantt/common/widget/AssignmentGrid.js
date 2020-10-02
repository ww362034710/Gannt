Ext.define('Common.widget.AssignmentGrid', {
    extend: 'Gnt.widget.AssignmentGrid',
    requires:[ 'Common.column.AssignmentUnits'],
    constructor: function (a) {
        this.callParent(arguments)
    },
    buildColumns: function () {
        return[
            {xtype: "resourcenamecolumn"},
            {xtype: "commonassignmentunitscolumn", assignmentStore: this.assignmentStore, editor: {xtype: "textfield"}}
        ]
    },
    setEditableFields: function (c) {
        if (!this.assignmentUnitsEditor) {
            this.assignmentUnitsEditor = this.down("commonassignmentunitscolumn").getEditor()
        }
        return this.callParent(arguments)
    }
})