(function(window, $) {
    // TODO 支持多文件上传
    var MFilebox = new Class({
        Extends: Component,
        Implements: ValueFeature,
        initialize: function ($dom, opts) {
            this.parent('filebox', $dom, opts);
        },
        init: function ($dom, opts) {
            this.parent($dom, opts);
        },
        extendOptions: function () {
            // 为name自动增加$file后缀
            let name = this.$dom.attr('name');

            if (name.indexOf('$file')===-1) {
                // 如果这个name是domain类的UploadFile对象  则在name上追加Id
                if (this.class.fieldsMap[name] && this.class.fieldsMap[name].type === 'file') {
                    name += "Id";
                }
                // 追加$file
                this.$dom.attr('name', name + '$file');
            }

            this.opts = $.extend({}, this.opts);

            // 如果有file了  则把上级form  enctype="multipart/form-data"
            this.$dom.parents('form:eq(0)').attr('enctype', 'multipart/form-data');
        },
    });

    $.fn.mfilebox = function(opts, args) {
        if (typeof opts === 'string') {
            return this.data('m')[opts](this, args);
        } else if (!this.data('m')) {
            this.data('m', new MFilebox($(this), opts));
        }
    };
})(window, jQuery);