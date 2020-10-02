Ext.define("Common.view.ResourceHistogram", {
    extend: "Gnt.view.ResourceHistogram",
    alias: "widget.subresourcehistogramview",
    columnRenderer:function(a, j, resource, f, i){
        var d = resource.getInternalId(),
            g = this.normalGrid.getView(),
            c = this.allocationData[d],
            h = c && c.bars,
            e = c && c.maxBars;
        return (this.showScaleLines ? g.renderLines(this,resource) : "")
            + g.renderBars(this, h, d,resource)
            + (this.showLimitLines ? g.renderLimitLines(this, e,resource) : "")
    },
    renderBars: function (b, a, c,resource) {
        return this.barTpl.apply(this.prepareBars(b, a, c,resource))
    },
    renderLimitLines: function (b, a, resource) {
        return this.limitLineTpl.apply(this.prepareLimitLines(b, a, resource))
    },
    prepareLimitLines: function (m, g,resource) {
        if(resource.data.unitsType=="0"){
           return this.callParent(arguments);
        }else if(resource.data.unitsType=="3" || resource.data.unitsType=="4") {
            if (!g) {
                return
            }
            var scaleConfig = resource.buildScaleConfig();
            if(!scaleConfig){
                scaleConfig=m;
            }
            var k = [], a = this.getAvailableRowHeight(), n = this._limitLineCls, b;
            var unitHeight = a/(scaleConfig.scaleMax - scaleConfig.scaleMin + scaleConfig.scaleStep);
            for (var h = 0, f = g.length; h < f; h++) {
                var e = this.getXFromDate(g[h].startDate || m.getStart(), true);

                var j0 = g[h].allocationMS;
                if(Ext.typeOf(j0)=="array"){
                for(var ii=0;ii<j0.length;ii++){
                    var c = {left: e, width: this.getXFromDate(g[h].endDate || m.getEnd(), true) - e, top: "", height: 0, cls: "limitline-blue"};
                        var j = (scaleConfig.unitsValues && scaleConfig.unitsValues.indexOf(j0[ii])+1) || j0[ii];
                    var d = true;
                    if (j > scaleConfig.scaleMax) {
                        j = scaleConfig.scaleMax + scaleConfig.scaleStep;
                        d = false
                    } else {
                        if (j < scaleConfig.scaleMin) {
                            j = scaleConfig.scaleMin;
                            d = false
                        }
                    }
                    c.top = Math.round(a - (j - scaleConfig.scaleMin) * unitHeight);
                    if (d) {
                        c.cls += " " + n + "-top"
                    }
                    if (k[0]) {
                        //k.push({left: e, width: 1, top: Math.min(c.top, k[k.length - 1].top), height: Math.round(Math.abs(k[k.length - 1].top - c.top) + this.limitLineWidth), cls: n + "-top"})
                    }
                    b = j;
                    k.push(c)
                }
            }

            }
            return k
        }else{
            if (!g) {
                return
            }
            var scaleConfig = resource.buildScaleConfig();
            if(!scaleConfig){
                scaleConfig=m;
            }
            var k = [], a = this.getAvailableRowHeight(), n = this._limitLineCls, b;
            var unitHeight = a/(scaleConfig.scaleMax - scaleConfig.scaleMin + scaleConfig.scaleStep)
            for (var h = 0, f = g.length; h < f; h++) {
                var e = this.getXFromDate(g[h].startDate || m.getStart(), true);
                var c = {left: e, width: this.getXFromDate(g[h].endDate || m.getEnd(), true) - e, top: "", height: 0, cls: ""};
                var j = g[h].allocationMS;
                var d = true;
                if (j > scaleConfig.scaleMax) {
                    j = scaleConfig.scaleMax + scaleConfig.scaleStep;
                    d = false
                } else {
                    if (j < scaleConfig.scaleMin) {
                        j = scaleConfig.scaleMin;
                        d = false
                    }
                }
                c.top = Math.round(a - (j - scaleConfig.scaleMin) * unitHeight);
                if (d) {
                    c.cls += " " + n + "-top"
                }
                if (k[0]) {
                    k.push({left: e, width: 1, top: Math.min(c.top, k[k.length - 1].top), height: Math.round(Math.abs(k[k.length - 1].top - c.top) + this.limitLineWidth), cls: n + "-top"})
                }
                b = j;
                k.push(c)
            }
            return k
        }
    },
    prepareBars: function (j, e, f,resource) {
        if (resource.data.unitsType == "0") {
            return this.callParent(arguments);
        } else if(resource.data.unitsType == "3"||resource.data.unitsType == "4"){
            if (!e) {
                return
            }
            var scaleConfig = resource.buildScaleConfig();
            if(!scaleConfig){
                scaleConfig=j;
            }
            var h = [], a = this.getAvailableRowHeight(), k = this._barCls, b, g;
            var unitHeight = a/(scaleConfig.scaleMax - scaleConfig.scaleMin + scaleConfig.scaleStep)
            for (var d = 0, c = e.length; d < c; d++) {
                if (e[d].totalAllocation) {
                    var allocationMS = e[d].allocationMS || [];
                    var g0 = e[d].totalAllocation;
                    var units = false;
                    for(var ii= 0;ii<g0.length;ii++){
                        if(allocationMS.indexOf(g0[ii]+"")==-1){
                            units = g0[ii]+"";
                            break;
                        }
                    }
                    g = undefined;
                    if(Ext.typeOf(scaleConfig.unitsValues)=="array"){
                    	//g = (units && scaleConfig.unitsValues.indexOf(units)+1) || (g0.length>0?(scaleConfig.unitsValues.indexOf(g0[0]+"")+1):0);
                        if(g0.length>0){
                            for(var ii= 0;ii<g0.length;ii++){
                                if(scaleConfig.unitsValues.indexOf(g0[ii]+"")<0){
                                    throw new Error(g0[ii]+"不在取值范围内");
                                }
                                g = (g && (scaleConfig.unitsValues.indexOf(g0[ii]+"")+1)<g)?g:(scaleConfig.unitsValues.indexOf(g0[ii]+"")+1);
                            }
                        }else{
                            g = 0
                        }
                    }else{
                    	g = units || (g0.length>0?g0[0]:0);
                    }
                    b = Ext.apply({id: f + "-" + d, index: d, left: this.getXFromDate(e[d].startDate, true), width: this.getXFromDate(e[d].endDate, true) - this.getXFromDate(e[d].startDate, true), height: a, top: 0, text: "", cls: ""}, this.barRenderer(f, e[d]));
                    b.height = g >= scaleConfig.scaleMin ? Math.round((g - scaleConfig.scaleMin) * unitHeight) : 0;
                    b.top = a - b.height
                    if ((resource.data.unitsType == "3" && g0.length>1) || units) {
                        b.cls = k + "-overwork"
                    }
                    h.push(b)
                }
            }
            return h
        } else {
            if (!e) {
                return
            }
            var scaleConfig = resource.buildScaleConfig();
            if(!scaleConfig){
                scaleConfig=j;
            }
            var h = [], a = this.getAvailableRowHeight(), k = this._barCls, b, g;
            var unitHeight = a/(scaleConfig.scaleMax - scaleConfig.scaleMin + scaleConfig.scaleStep)
            for (var d = 0, c = e.length; d < c; d++) {
                if (e[d].totalAllocation) {
                    g = e[d].totalAllocation;
                    b = Ext.apply({id: f + "-" + d, index: d, left: this.getXFromDate(e[d].startDate, true), width: this.getXFromDate(e[d].endDate, true) - this.getXFromDate(e[d].startDate, true), height: a, top: 0, text: "", cls: ""}, this.barRenderer(f, e[d]));
                    if (g <= scaleConfig.scaleMax + scaleConfig.scaleStep) {
                        b.height = g >= scaleConfig.scaleMin ? Math.round((g - scaleConfig.scaleMin) * unitHeight) : 0;
                        b.top = a - b.height
                    } else {
                        b.cls = k + "-partofbar"
                    }
                    if (e[d].totalOverAllocationMS > 0) {
                        b.cls = k + "-overwork"
                    }
                    h.push(b)
                }
            }
            return h
        }
    },
    getDataForTooltipTpl:function(a){
    	var unitsValues = a.resource.get("unitsValues");
    	var unitsLabels = a.resource.get("unitsLabels");
    	if(Ext.typeOf(unitsValues)=='array' && Ext.typeOf(a.allocationMS)=='array'){
    		a.allocationMSLabel = [];
    		a.totalAllocationLabel = [];
    		for(var i=0,l=a.allocationMS.length;i<l;i++){
    			var index = unitsValues.indexOf(""+a.allocationMS[i]);
    			if(index>-1){
    				a.allocationMSLabel.push(unitsLabels[index]);
    			}
    		}
    		for(var i=0,l=a.totalAllocation.length;i<l;i++){
    			var index = unitsValues.indexOf(""+a.totalAllocation[i]);
    			if(index>-1){
    				a.totalAllocationLabel.push(unitsLabels[index]);
    			}
    		}
    	}else{
    		a.allocationMSLabel = a.allocationMS;
    		a.totalAllocationLabel = a.totalAllocation;
    	}
    	return this.callParent(arguments);
        //return this.callParent(a);
    }
});
//Ext.reg('subresourcehistogramview', MyApp.view.ResourceHistogram);
