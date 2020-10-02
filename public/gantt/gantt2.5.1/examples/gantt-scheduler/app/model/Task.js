Ext.define('MyApp.model.Task', {
    extend: 'Gnt.model.Task',
    fields : [
        { name : 'Color', type : 'string'},
        { name : 'deptId', type : 'number' },
        { name : 'Person', type : 'number',useNull: true}
    ],
    isEditable: function (a) {
        return this.callParent(arguments) && !this.isReadOnly();
    },
    isReadOnly:function(){
        //判断当前用户是否为管理员 TODO
        return this.callParent(arguments);
    },
    deptField: 'deptId'
})