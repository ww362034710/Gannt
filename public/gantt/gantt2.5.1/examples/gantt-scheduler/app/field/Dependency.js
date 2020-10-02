Ext.define('MyApp.field.Dependency', {
    extend: 'Gnt.field.Dependency',
    getErrors:function(n){

        var rt = this.callParent(arguments)
        if(rt && rt.length>0){
            return rt;
        }else{
            if(n){
                var task = this.task.getTaskStore().getByInternalId(n);
                rt = task.isReadOnly()?["没有权限关联此任务"]:rt;
            }
        }
        return rt;
    }
})