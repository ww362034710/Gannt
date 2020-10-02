Ext.define('MyApp.widget.AssignmentEditGrid', {
    extend: 'Gnt.widget.AssignmentEditGrid',
    requires: ['MyApp.column.AssignmentUnits'],
    constructor: function (a) {
        this.callParent(arguments)
    },
    buildColumns: function () {
        var columns = this.callParent(arguments);
        columns[1].xtype = "myappassignmentunitscolumn";
        columns[1].editor.xtype = "textfield";
        return columns;
    },
    setEditableFields: function (a) {
        if (!this.assignmentUnitsEditor) {
            this.assignmentUnitsEditor = this.down("myappassignmentunitscolumn").getEditor()
        }
        return this.callParent(arguments)
    }
})