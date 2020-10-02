Ext.define("Major.column.ResourceType", {
    extend: "Ext.grid.column.Column",
    alias: "widget.resourcetypecolumn",
    draggable: false,
    fieldProperty: "typeField",
    align: 'center',
    initComponent: function () {
        this.callParent(arguments)
    },
    renderer : function(value) {
        var color;
        if (value != null) {
            if ($.isNumeric(value)) {
                var colors = ['#51D6F7', '#77AC3A', '#F2602C'];
                color = colors[value];
            } else {
                var colors = {'platform': '#51D6F7', 'application': '#77AC3A', 'user': '#F2602C'};
                color = colors[value];
            }
        }
        if (!color) {
            color = '#51D6F7';
        }
        return '<div style="width:10px;height:10px;background:'+color+';display:inline-block"></div>';
    }
});

