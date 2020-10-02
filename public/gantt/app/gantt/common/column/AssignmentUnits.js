Ext.define("Common.column.AssignmentUnits", {
    extend: "Ext.grid.column.Column",
    mixins: ["Gnt.mixin.Localizable"],
    alias: "widget.commonassignmentunitscolumn",
    dataIndex: "Units",
    //format: "0 %",
    format: "0",
    align: "left",
    _isGanttColumn: false,
    constructor: function (a) {
        a = a || {};
        this.text = a.text || "单位";
        this.callParent(arguments)
    },
    defaultRenderer: function (a) {
        if (a) {
            return a
        }
    }
});
