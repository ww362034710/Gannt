// easyui的tree组件
(function(window, $){
    var MTree = new Class({
        Extends: Component,
        Implements: DataFeature,
        initialize: function ($dom, opts) {
            this.parent("tree", $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);

            // 是否为form提供查询字段
            var $for = this.$for;
            if ($for && instanceOf($for.m, MForm) && this.field) {
                $for.m.addExtraComponent(this);
            }
        },
        extendOptions: function() {
            var me = this,
                opts = this.opts;
            // 注入 onSelect 事件
            // 如果没配置onSelect事件 则在tree onSelect之后调用内部的onSelect事件
            var treeOnSelect;
            var optOnSelect = opts.onSelect;
            if (optOnSelect) {
                treeOnSelect = function(node) {
                    if (optOnSelect(node)!==false) {
                        // 执行后置
                        var submitForForm = me.$for;
                        if (submitForForm) {
                            submitForForm.submit();
                        }
                    }
                }
            } else {
                treeOnSelect = function(node) {
                    // 执行后置
                    var submitForForm = me.$for;
                    if (submitForForm) {
                        submitForForm.submit();
                    }
                }
            }
            opts.onSelect = treeOnSelect;

            this.opts = $.extend({
                url: this.class.listDataUrl,
                fit:  true,
                valueField: 'id',
                treeField: this.class.displayField,
                textField: this.class.displayField,
            }, opts);
        },
        getSelections: function() {
            return [this.$dom.tree('getSelected')];
        },
        DEFAULT_OPTIONS: {
            valueField: 'id'
        }
    });

    $.fn.mtree = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MTree($(this), opts));
        }
    };
})(window, jQuery);