(function(window, $) {
    var MCombotree = new Class({
        Extends: Component,
        Implements: [DataFeature, ValueFeature],
        initialize: function ($dom, opts) {
            this.parent("combotree", $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
        },
        extendOptions: function() {
            // 找到当前作用域的domain
            var domain = this.class;
            this.opts = $.extend({
                url: domain.listDataUrl,
                parentField: 'parentId',
                valueField: 'id',
                treeField: domain.displayField,
                textField: domain.displayField
            }, this.opts);
        }
    });
    $.fn.mcombotree = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MCombotree($(this), opts));
        }
    };
})(window, jQuery);