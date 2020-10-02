Ext.define('MyApp.column.ResourceAssignment', {
    extend: 'Gnt.column.ResourceAssignment',
    alias: "widget.myappresourceassignmentcolumn",
    text:"已分配资源",
    constructor:function(b){
        b = b||{};
        b.editor=Ext.ComponentManager.create(Ext.applyIf({},{expandPickerOnFocus: false}), "myappassignmentfield");
        this.callParent([b])
    }
})