Ext.define('Common.plugin.TaskContextMenu', {
    extend     : 'Gnt.plugin.TaskContextMenu',
    createMenuItems : function() {
        var items = this.callParent(arguments);
        return [
            {
                text: '修改任务颜色',
                requiresTask: true,
                isColorMenu: true,
                menu: {
                    showSeparator: false,
                    items: [
                        Ext.create('Ext.ColorPalette', {
                            listeners: {
                                select: function(cp, color){
                                    this.rec.set('Color', color);
                                    this.hide();
                                },
                                scope: this
                            }
                        })
                    ]
                }
            }
        ].concat(items);
    },
    activateMenu:function(){this.callParent(arguments);},
    configureMenuItems: function (a) {
        this.callParent(arguments);
        var task = this.rec;
        if (!task) return;
        var colorMenu = this.query('[isColorMenu]')[0].menu.items.first(),val = colorMenu.getValue(),recVal = task.get('Color'),selectedEl = null;
        if (colorMenu.el) {
            if (val && recVal && recVal !== val){
                colorMenu.el.down('a.color-' + val).removeCls(colorMenu.selectedCls);
                if (colorMenu.el.down('a.color-' + recVal)){
                    colorMenu.select(recVal.toUpperCase());
                }
            } else if (val && !recVal){
                colorMenu.el.down('a.color-' + val).removeCls(colorMenu.selectedCls);
            }
        }
        if(task.isReadOnly()){
            Ext.each(this.query("menuitem"), function (d) {
                if (d.itemId !="taskInformation") {
                    d.setDisabled(true);
                }
            });
        }else{
            Ext.each(this.query("menuitem"), function (d) {
                if (d.itemId =="addTaskMenu") {
                    d.setDisabled(false);
                }
            });
        }
    },
    onMyHandler : function () {
        var task = this.rec;
    }
});