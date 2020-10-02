Ext.define('Common.view.MyResourceHistogram', {
    extend          : 'Common.panel.ResourceHistogram',
    title           : '资源占用',
    requires            : [
        'Common.column.Scale',
        'Common.column.ResourceType'
    ],

    viewPreset      : 'weekAndDayLetter',
    hideHeaders     : false,
    hidden          : true,
    flex            : 1,
    rowHeight       : 60,
    labelMode:"units",
    highlightWeekends: false,

    /*scaleStep       : 8,
    scaleLabelStep  : 24,
    scaleMin        : 0,
    scaleMax        : 96,*/
    initComponent : function () {
        Ext.apply(this, {
            columns : [
                // {
                //     tdCls     : 'histogram-icon',
                //     width     : 50,
                //     header:"类型",
                //     renderer  : function (val, meta, rec) {
                //         meta.tdCls = 'icon-' + rec.data.Type;
                //     }
                // },
                {
                    xtype:"resourcetypecolumn",
                    dataIndex: 'Type',
                    width:50
                },
                {

                    width     : 150,
                    tdCls     : 'histogram-name',
                    dataIndex : 'name',
                    header:"资源名称"
                },
                {
                    xtype:"commonscalecolumn"
                }
            ]
        });

        this.tipCfg = { cls : 'bartip' };

        var me = this;

        this.tooltipTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<table>',
                    '<tr><th class="caption" colspan="2">资源名: <strong>{resource.data.Name}</strong></th></tr>',
                    '<tr>',
                        '<th>开始时间:</th><td>{[Ext.Date.format(values.startDate, "y-m-d G:i:s")]}</td>',
                    '</tr>',
                    '<tr>',
                        '<th>结束时间:</th><td>{[Ext.Date.format(Ext.Date.add(values.endDate, Ext.Date.MILLI, -1), "y-m-d G:i:s")]}</td>',
                    '</tr>',

                    '<tr>',
	                    '<th>使用 {resource.data.unitsName}:</th><td>{totalAllocationLabel}{resource.data.unitsName}</td>',
                    '</tr>',
                    '<tr>',
	                    '<th>提供:</th><td>{allocationMSLabel}</td>',
	                '</tr>',



                    /*
                    '<tr>',
                        '<th>使用 (hrs):</th><td>{[Math.round(this.getHours(values.allocationMS))]}</td>',
                    '</tr>',*/
                '</table>',
            '</tpl>',
            {
                getHours : function (ms) {
                    return me.calendar.convertMSDurationToUnit(ms, 'HOUR');
                }
            }
        );

        this.callParent(arguments);
    }

});
