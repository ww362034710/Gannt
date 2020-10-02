//扩展easyui
(function(window, $) {
    // easyui的组件
    window.Component = new Class({
        initialize: function (compType, $dom, opts) {
            this.compType = compType;
            // 没初始化过才初始化
            if (!this.$dom) {
                // 构造函数
                this.init($dom, opts);
            }
        },
        init: function ($dom, opts) { // 初始化方法
            this.$dom = $dom;           // 组件对象
            this.events = []; // 绑定的事件字符串  一般用在button上  对某个表单进行提交 清空操作   或者  返回按钮
            /*
                opts里支持的参数:
                class
                field
                required
                bind        // 绑定到某个组件上  该组件的默认事件(比如click  select)时, 会反馈到绑定组件上
                以及其他easyui支持的参数
             */
            this.opts = this.initOptions(opts);           // 明确声明的参数 + data-options里的参数 + 属性上的参数
            this.class = this.findMClass();
            this.$for = this.getForComp();   // 关联的目标组件  是个jQuery对象
            this.$fored = $dom.mfored || [];          // 关联到该组件上的
            this.extendOptions();       // 子类切入点  扩展opts
            // 初始化easyui组件
            this.$dom[this.compType](this.opts);
        },
        initOptions: function (opts) {   // 公共方法  供子类调用  以传入的参数为主 覆盖dom元素上的参数
            return $.extend({}, this.getDomOptions(), opts || {});
        },
        updateOptions: function (opts) { // 更新opts
            this.opts = $.extend(this.opts, opts || {});
        },


        field: null,        // field
        getField: function() {
            if (!this.field) this.field = this.opts.field;
            return this.field;
        },
        getValue: function() {/*子类实现*/},

        DEFAULT_OPTIONS: {/* 默认设置*/},
        getForComp: function () {
            var forId = this.opts.for
            if (forId) {
                var $for = forId[0] === "#" ? $(forId) : $("#" + forId);
                return $for;
            } else {
                return null;
            }
        },
        getDomOptions: function () {  // 获得dom上配置的参数 包括 data-options里面的 还有直接写在dom元素属性上的
            var $dom = this.$dom,
                opts = $.parser.parseOptions(this.$dom[0]);
            // 追加写在属性上的参数
            opts.field = $dom.attr("m-field") || opts.field;
            opts.class = $dom.attr("m-class") || opts.class;
            opts.required = $dom.attr("required") || opts.required;
            opts.for = $dom.attr("for") || opts.for;

            if (typeof opts.events === "string") {
                this.events = events.split(",");
            } else {
                this.events = $dom.attr("m-event") && $dom.attr("m-event").split(",") || [];
            }
            delete opts.events;

            return opts;
        },
        // 找到组件的m-class  没有的话查找最近父节点的
        findMClass: function () {
            var domainName = this.opts.class;
            if (!domainName) {
                domainName = this.$dom.parents("[m-class]:eq(0)").attr('m-class');
            }
            return major.domainMap[domainName];
        },
        extendOptions: function () {/* 扩展/改写opts   由子类实现*/}
    });
})(window, jQuery);