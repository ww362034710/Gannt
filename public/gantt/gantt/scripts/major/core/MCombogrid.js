(function(window, $) {
    var MCombogrid = new Class({
        Extends: Component,
        Implements: [DataFeature, ValueFeature],
        initialize: function ($dom, opts) {
            this.parent("combogrid", $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
        },
        extendOptions: function () {
            // 整理初始化时的自定义字段  List集合  元素可以为 field 对象或者field的名字(可混用)
            var displayFieldsList = this.buildDomainFields();

            var combogridColumns = [];
            if (displayFieldsList && displayFieldsList.length > 0) {
                // 当前的 defineColumns 是domain中定义的 或者由初始化时配置来的  需要转为组件使用的column
                displayFieldsList[0] = [{name: 'ck', checkbox: true, rowspan: displayFieldsList.length}, {name: 'id', title: 'id', type: 'long', hidden: true, rowspan:displayFieldsList.length}].concat(displayFieldsList[0]);
                displayFieldsList.forEach(function (columnList, i) {
                    columnList.forEach(function(column, j){
                        var columnObj = $.extend({width: 100, align: 'center'},
                            {field: column.name, checkbox: column.checkbox, hidden: column.hidden, width: column.width, title: column.title, align: column.align, formatter: column.formatter, rowspan: column.rowspan, colspan: column.colspan});
                        if (!columnObj.formatter && column.type === "enum") { // 当该列是个enum 而且没有明确定义formatter的时候  才去查找enum中有无该枚举
                            // 看枚举中有无该对象
                            var enumObjKey = column.data + "Obj";
                            if (enums.hasOwnProperty(enumObjKey)) {
                                columnObj.formatter = function (value, row, i) {
                                    return enums[enumObjKey][value];
                                }
                            }
                        }
                        if (combogridColumns.length - 1 < i) combogridColumns[i] = [];
                        combogridColumns[i].push(columnObj);
                    })
                });
            } else {
                console.error("没有可展示的字段, 请确保DomainDisplayConfig.groovy类中有该类的类名的字段, 并且初始化该组件时设置的columns正确!");
                return $.messager.alert("错误", "没有可展示的字段, 请确保DomainDisplayConfig.groovy类中有该类的类名的字段, 并且初始化该组件时设置的columns正确!", "error");
            }
            this.opts = $.extend({
                url: this.class.pageDataUrl,
                valueField: 'id',
                idField: 'id',
                textField: this.class.displayField,
                panelWidth: 450,
                pagination: true,
                fitColumns: true,
                border: false,
                columns: combogridColumns
            }, this.opts);
        }
    });

    $.fn.mcombogrid = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MCombogrid($(this), opts));
        }
    };
})(window, jQuery);