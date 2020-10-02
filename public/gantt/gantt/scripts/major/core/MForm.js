(function(window, $) {
    window.MForm = new Class({
        Extends: Component,
        initialize: function ($dom, opts) {
            this.parent("form", $dom, opts);
        },
        init: function ($dom, opts) {
            this.extraComponents = [];  // 额外的数据组件   这些组件会为form增加额外的数据
            this.extraParams = {};      // 额外的数据
            this.parent($dom, opts);

            if(this.$fored) {
                $.each(this.$fored, function(i, item){
                    this.addExtraComponent($(item));
                })
            }
        },
        extendOptions: function() {
            var me = this;
            // 当前form的额外查询字段
            this.opts.onSubmit = function(){
                var queryParams = me.$dom.serializeForm();
                var extraParams = me.collectExtraParams();
                $.extend(queryParams, extraParams);

                me.$for.mload(queryParams);
                return false;
            };
        },collectExtraParams: function() { // 收集附加查询参数
            var params = $.extend({}, this.extraParams, this.collectExtraComponentParams());
            return params;
        },
        collectExtraComponentParams: function() { // 收集附加组件的参数
            var comps = this.extraComponents;
            var params = {};
            if (comps) {
                $.each(comps, function(i, comp){
                    var $comp = $(comp);
                    var ids = $comp.getSelectionIds();
                    params[$comp.m.getField()] = ids.join(",");
                });
            }
            return params;
        },
        addExtraComponent: function(comps){   // 增加额外数据组件
            this.extraComponents.push(comps );
        }
    });

    $.fn.mform = function(opts, args) {
        if (typeof opts === "string") {
            return this.data("m")[opts](this, args);
        } else if (!this.data("m")) {
            this.data("m", new MForm($(this), opts));
        }
    };
})(window, jQuery);