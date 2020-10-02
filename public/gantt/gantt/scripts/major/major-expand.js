$.extend(window, {
    // 当选中了某行时
    // msg 选填 未填时默认提示"请选择要操作的记录"   设置为0或者false '' 等可以取消
    ifRowSelected: function(jq, fn, msg ) {
        var row;
        if ($.data(jq[0], 'datagrid')) {
            row = $(jq).datagrid('getSelected');
        } else if ($.data(jq[0], 'treegrid')) {
            row = $(jq).treegrid('getSelected');
        } else {
            throw new Error("ifRowSelected不支持的对象,仅支持datagrid, treegrid")
        }
        if (row) {
            fn(row);
        } else if (msg === undefined || (typeof msg !=='string' && msg)) { // 未填  或者  1,true
            $.messager.alert("提示", "请选择要操作的记录", "info");
        } else if (typeof msg === 'string' ) {
            $.messager.alert("提示", msg, "info");
        }
    },
    /**
     *  如果ajax返回的结果正确时才进行操作 否则自动弹出错误信息
     *  省去了写错误信息的代码
     *  其中的obj是后台Json对象的obj属性
     *  示例:
     *  $.post("xxxxx/xxx", {id:1}, function(data){
     *      whenSuccess(data, function(obj){
     *          alert(obj);
     *      });
     *  }
     */
    whenSuccess: function(rst, scb, fcb){
        if (rst.success) {
            typeof scb === "function" && scb.call(window, rst.obj );
        } else if(typeof fcb === "function") {
            fcb.call(window, rst.msg || defaultErrorMsg );
        } else {
            $.messager.alert("错误", rst.msg || defaultErrorMsg,'error');
        }
    }
})




var icon = "<i class='fa fa-warning'></i> ";


function getSelectedIds(rows) {
    var ids=[];
    for(i in rows){
        ids.push(rows[i].id);
    }
    return ids
}