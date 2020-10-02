Ext.define('Common.column.Scale', {
    extend: 'Gnt.column.Scale',
    alias: "widget.commonscalecolumn",
    defaultRenderer: function (c, d, a) {
        var scaleConfig = a.buildScaleConfig();
        var scalePoints = this.scalePoints;
        if(scaleConfig){
            scalePoints = this.buildScalePointsByScaleMax(scaleConfig);
        }
        var b = {record: Ext.apply({}, a.data, a.getAssociatedData()), scaleHeight: this.availableHeight, scalePoints: scalePoints};
        return this.tpl.apply(b)
    },
    buildScalePointsByScaleMax :function (scaleConfig){
        if(!scaleConfig.scaleMax){
            return this.scalePoints;
        }
        var scaleStepHeight = this.availableHeight / (scaleConfig.scaleMax - scaleConfig.scaleMin + scaleConfig.scaleStep);
        var g = scaleConfig.scaleMin, h = g, c = scaleConfig.scaleStep, f = scaleConfig.scaleLabelStep, d = scaleStepHeight, b = this.availableHeight, a = this.scaleCellCls, i = a + "-min", j = [];
        var e = function (m, l, k) {
            if(Ext.typeOf(scaleConfig.unitsValues)=='array'){
                if(scaleConfig.unitsLabels && scaleConfig.unitsLabels.length>0){
                    l = (l && scaleConfig.unitsLabels.length>0 && l<=(scaleConfig.unitsLabels.length+1))?scaleConfig.unitsLabels[l-1]:l;
                }else{
                    l = (l && scaleConfig.unitsValues.length>0 && l<=(scaleConfig.unitsValues.length+1))?scaleConfig.unitsValues[l-1]:l;
                }

            }
            return{top: Math.round(b - (m - g) * d), value: m, label: l != "undefined" ? l+(l&&scaleConfig.unitsName||"") : "", cls: k || ""}
        };
        while (h < scaleConfig.scaleMax) {
            j.push(e(h, h % f || h === g ? "" : h, i));
            i = "";
            h += c
        }
        j.push(e(scaleConfig.scaleMax, scaleConfig.scaleMax, a + "-max"));
        return j
    }

})