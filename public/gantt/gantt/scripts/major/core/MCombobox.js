(function(window, $) {
    var MCombobox = new Class({
        Extends: Component,
        Implements: ValueFeature,
        initialize: function ($dom, opts) {
            this.parent("combobox", $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
        },
        extendOptions: function () {
            var textField, valueField;
            if (this.opts.enumKey) {
                // 字段模式
                this.opts.data = $.extend([], enums[this.opts.enumKey + "Array"]);
                textField = 'text';
                valueField = 'value';
            } else {
                // 对象模式
                textField = this.class.displayField;
                valueField = 'id'
            }

            this.opts = $.extend({
                valueField: valueField,
                pagination: true,
                fitColumns: true,
                border: false,
                textField: textField
            }, this.opts);
        },
    });

    $.fn.mcombobox = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MCombobox($(this), opts));
        }
    };
})(window, jQuery);