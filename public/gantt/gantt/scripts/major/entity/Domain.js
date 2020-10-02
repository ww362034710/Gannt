//
(function(window, $) {
    window.Domain = new Class({
        className: '',
        classNameLower: '',
        isTree: false,      // 是否树状结构
        displayFieldName: '',   // 主显示字段名称
        displayField: {},   // 主显示字段

        pageDataUrl: '',    // 分页数据地址
        listDataUrl: '',    // 列表数据地址
        viewUrl: '',        // 查看页面地址
        showUrl: '',        // 查看数据地址
        addUrl: '',         // 新增操作地址
        editUrl: '',        // 编辑操作地址
        deleteUrl: '',      // 删除操作地址
        initialize: function (className, opts) {
            this.className = className;
            this.classNameLower = String(className).unCapitalize();
            this.isTree = opts.isTree;
            this.displayFieldName = opts.displayFieldName;
            this.fields = opts.fields;
            this.displayField = opts.displayField;

            this.pageDataUrl = adminPath + '/' + this.className + '/datagrid';
            this.listDataUrl = adminPath + '/' + this.className + '/list';
            this.viewUrl = adminPath + '/' + this.className + '/view';
            this.showUrl = adminPath + '/' + this.className + '/show';
            this.addUrl = adminPath + '/' + this.className + '/add';
            this.editUrl = adminPath + '/' + this.className + '/edit';
            this.deleteUrl = adminPath + '/' + this.className + '/delete';
        }
    });
})(window, jQuery);