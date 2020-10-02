(function(window, $) {
    window.MQueryform = new Class({
        Extends: MForm,
        initialize: function ($dom, opts) {
            this.parent($dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
        }
    });

    $.fn.mqueryform = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MQueryform($(this), opts));
        }
    };
})(window, jQuery);