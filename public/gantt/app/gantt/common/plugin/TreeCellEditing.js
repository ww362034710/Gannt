Ext.define("Common.plugin.TreeCellEditing", {
    extend: "Sch.plugin.TreeCellEditing",
    alias: "plugin.commonschedulertreecellediting",
    onMyBeforeEdit: function (_0x5220x2, cellContext) {
        var column = cellContext.column,
                editor = cellContext.column.getEditor(),
                task = cellContext.record,
                field = cellContext.field;

        // 如果是动态combobox 则加载store
        if (column instanceof Major.column.DynamicComboBox) {
            var store = task.getFieldStore(cellContext.column.config.fieldProperty)
            editor.setStore(store);
        }

        // if(field === "state"){//判断
        //     //第一种硬编码
        //     editor.setStore(task.getStateStore());
            //第二种数据后台获取
            //editor.getStore().load({ params: {taskId: task.id}})
        // }
        return this.callParent(arguments);
    }
});