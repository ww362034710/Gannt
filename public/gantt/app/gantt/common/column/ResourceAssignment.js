Ext.define('Common.column.ResourceAssignment', {
    extend: 'Gnt.column.ResourceAssignment',
    alias: "widget.commonresourceassignmentcolumn",
    text:"已分配资源",
    constructor:function(opts){
        // 田版本
        // b = b||{};
        // b.editor=Ext.ComponentManager.create(Ext.applyIf({},{expandPickerOnFocus: false}), "myappassignmentfield");
        // this.callParent([b])
        // 赵版本
        var self = this, editor, showUnits;
        opts = opts || {};
        self.text = opts.text || self.L("text");
        editor = opts.editor;
        showUnits = opts.showUnits || self.showUnits;
        opts.editor = editor || {};
        if (!(opts.editor instanceof Ext.form.Field)) {
            opts.editor = Ext.ComponentManager.create(Ext.applyIf(opts.editor, {
                expandPickerOnFocus: true,
                returnFocusToField: true,
                formatString: "{0}" + (showUnits ? "" : "")
            }), "assignmentfield")
        };
        opts.editor.assignmentType = opts.assignmentType
        opts.field = opts.editor;
        self.callParent([opts]);
        self.scope = self
    }
})