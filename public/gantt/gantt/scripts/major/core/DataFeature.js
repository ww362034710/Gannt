(function(window, $) {
    // 数据组件  tree treegrid  datagrid
    window.DataFeature = new Class({
        /**
         * 获得选中的记录  datagrid  treegrid tree
         */
        getSelections: function () {
            return [];  // 在子类中实现
        },
        /**
         * 获得选中的记录的id  datagrid  treegrid tree
         */
        getSelectionIds: function () {
            return this.getSelections().map(function (a) {
                return a.id
            });
        },
        /**
         * 查询
         */
        load: function (params) {
            return; // 在子类中实现
            var me = $(this),
                compType = me.getCompType(); // 组件类型
            switch (compType) {
                case "datagrid":
                    return me.datagrid("load", params);
                case "treegrid":
                    return me.treegrid('load', params);
                case "combogrid":
                    return me.combogrid('grid').datagrid("load", params);
                case "combotreegrid":
                    return me.combotreegrid('grid').treegrid("load", params);
                default:
                    console.error("暂不支持的组件类型:", compType);
            }
        },
        /**
         * 刷新datagrid/treegrid
         */
        reload: function () {
            var me = $(this),
                compType = me.getCompType();
            return me[compType]('reload');
        },
        // 通过domain构建出要展示的field
        buildDomainFields: function() {
            var domain = this.class,
                declaredList = this.opts.columns || instanceOf(this, ValueFeature) && domain.simpleFields || domain.displayFields;
            delete this.opts.columns;    //防止对datagrid的columns干扰
            var list = [];
            $.each(declaredList, function(i, column){       // 如果初始化传的Opts里没有columns 则采用domain中定义的
                if ($.isArray(column)) {    // 可以使用类easyui的column定义(双层list)
                    $.each(column, function(j, c){
                        addDomainField(c, i);
                    });
                } else {
                    addDomainField(column, 0);
                }
            });
            return list;

            function addDomainField(column, index) {
                var tmpColumn;
                if ($.isPlainObject(column)) {  // column对象  直接加入
                    var foundColumn = major.find(domain.fields, "name", column.field);    // 如果是个对象   而且其name已经在domain中定义过了  则是extend domain中的field
                    if (foundColumn) {
                        $.extend(foundColumn, column);
                    } else {
                        foundColumn = column;
                    }
                    tmpColumn = foundColumn;
                } else {                        // field字符串  从domain类中取
                    var foundColumn = major.find(domain.fields, "name", column);
                    if (!foundColumn) {
                        console.error('未在类', domain, '中找到字段[', column, ']!');
                        tmpColumn = {name: column, title: L.get(column)};
                    } else {
                        tmpColumn = foundColumn;
                    }
                }
                if (list.length - 1 < index) list[index] = [];
                list[index].push(tmpColumn);
            }
        }
    });
})(window, jQuery);