Ext.define('Common.widget.AssignmentEditGrid', {
    extend: 'Gnt.widget.AssignmentEditGrid',
    requires: ['Common.column.AssignmentUnits'],
    constructor: function (a) {
        this.callParent(arguments)
    },
    buildColumns: function () {
        var columns = this.callParent(arguments);
        columns[1].xtype = "commonassignmentunitscolumn";
        columns[1].editor.xtype = "textfield";
        return columns;
    },
    setEditableFields: function (a) {
        if (!this.assignmentUnitsEditor) {
            this.assignmentUnitsEditor = this.down("commonassignmentunitscolumn").getEditor()
        }
        return this.callParent(arguments)
    }
})