(function(window, $) {
    var MDatagrid = new Class({
        Extends: Component,
        Implements: DataFeature,
        initialize: function ($dom, opts) {
            this.parent("datagrid", $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
        },
        extendOptions: function() {
            var opts = this.opts,
                opColumn = opts.opColumn || showOpColumns;              // 默认显示"看删改"操作列
            delete opts.opColumn;

            // 找到当前作用域的domain
            var domain = this.class;

            // 整理初始化时的自定义字段  List集合  元素可以为 field 对象或者field的名字(可混用)
            var displayFieldsList = this.buildDomainFields();

            var datagridColumns = [];
            if (displayFieldsList && displayFieldsList.length > 0) {
                // 当前的 defineColumns 是domain中定义的 或者由初始化时配置来的  需要转为组件使用的column
                displayFieldsList[0] = [{name: 'ck', checkbox: true, rowspan: displayFieldsList.length}, {name: 'id', title: 'id', type: 'long', hidden: true, rowspan:displayFieldsList.length}].concat(displayFieldsList[0]);
                displayFieldsList.forEach(function (columnList, i) {
                    columnList.forEach(function(column, j){
                        var columnObj = $.extend({width: 100, align: 'center'},
                            {field: column.name, checkbox: column.checkbox, hidden: column.hidden, width: column.width, title: column.title || L.get(column.name), align: column.align, formatter: column.formatter, rowspan: column.rowspan, colspan: column.colspan});
                        if (!columnObj.formatter && column.type === "enum") { // 当该列是个enum 而且没有明确定义formatter的时候  才去查找enum中有无该枚举
                            // 看枚举中有无该对象
                            var enumObjKey = column.data + "Obj";
                            if (enums.hasOwnProperty(enumObjKey)) {
                                columnObj.formatter = function (value, row, i) {
                                    return enums[enumObjKey][value];
                                }
                            }
                        }
                        if (datagridColumns.length - 1 < i) datagridColumns[i] = [];
                        datagridColumns[i].push(columnObj);
                    })
                });
            } else {
                console.error("没有可展示的字段, 请确保DomainDisplayConfig.groovy类中有该类的类名的字段, 并且初始化该组件时设置的columns正确!");
                return $.messager.alert("错误", "没有可展示的字段, 请确保DomainDisplayConfig.groovy类中有该类的类名的字段, 并且初始化该组件时设置的columns正确!", "error");
            }
            if (opColumn) {
                datagridColumns[0].push({
                    field: '_do', width: 200, title: '操作', align: 'center', rowspan: displayFieldsList.length,
                    formatter: function (value, row, index) {
                        var str = '<button type="button" class="btn btn-success btn-xs m-r-xs" m-event="view" data-id="' + row.id + '">查看</button>';
                        str += '<button type="button" class="btn btn-info btn-xs m-r-xs" m-event="edit" data-id="' + row.id + '">修改</button>';
                        str += '<button type="button" class="btn btn-danger btn-xs" m-event="delete" data-id="' + row.id + '" for="datagrid">删除</button>';
                        return str;
                    }
                });
            }
            this.opts = $.extend({
                url: domain.pageDataUrl,
                pagination: true,
                fitColumns: true,
                border: false,
                columns: datagridColumns
            }, this.opts);
        }
    });

    $.fn.mdatagrid = function(opts, args) {
        if (typeof opts === "string") {
            this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MDatagrid($(this), opts));
        }
        return this;
    };
})(window, jQuery);