Ext.define("Major.column.Assigned", {
    extend: "Ext.grid.column.Column",
    alias: "widget.assignedcolumn",
    draggable: false,
    fieldProperty: "assignedField",
    align: 'center',
    initComponent: function () {
        this.callParent(arguments)
    },
    renderer : function(value) {
        return '<div style="width:10px;height:10px;background:#77AC3A;display:inline-block"></div>';
        // if(value == 1){
        //     return '<img src="'+ctx+'/static/images/assigned_t.png" title="已下发"/>';
        // }else{
        //     return '<img src="'+ctx+'/static/images/assigned_f.png" title="未下发"/>';
        // }
    }
});

