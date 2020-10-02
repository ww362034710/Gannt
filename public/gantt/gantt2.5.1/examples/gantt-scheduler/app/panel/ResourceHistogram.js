Ext.define('MyApp.panel.ResourceHistogram', {
    extend: 'Gnt.panel.ResourceHistogram',
    viewType: "subresourcehistogramview",
    loadAllocationData: function (d, b) {
        if (this.resourceStore) {
            if (!d) {
                this.allocationData = {};
                var c = this;
                var e = this.getStartDate();
                var a = this.getEndDate();
                this.store.each(function (f) {
                    //把资源f 传入processAllocationData
                    c.allocationData[f.getInternalId()] = c.processAllocationData(f.getAllocationInfo({startDate: e, endDate: a, includeAllIntervals:true, includeResCalIntervals: false}),f)
		    //c.allocationData[f.getInternalId()] = c.processAllocationData(f.getAllocationInfo({startDate: e, endDate: a, includeAllIntervals:true, includeResCalIntervals: true}),f)
                });
                if (!b && this.rendered) {
                    this.getView().refresh()
                }
            } else {
                this.allocationData = this.allocationData || {};
                this.allocationData[d.getInternalId()] = this.processAllocationData(d.getAllocationInfo({startDate: this.getStartDate(), endDate: this.getEndDate(), includeResCalIntervals: true}),d);
                if (!b && this.rendered) {
                    this.getView().refreshNode(this.store.indexOf(d))
                }
            }
        }
    },
    processAllocationData: function (B,resource) {
        if(resource.data.unitsType=="0"){
            return this.callParent(arguments);
        }else if(resource.data.unitsType=="3" || resource.data.unitsType=="4"){

            var cpoyB = [];
            var calendar = resource.getCalendar();
            Ext.each(B, function (b) {
                var copyb={startDate:b.startDate,endDate:b.endDate,totalAllocation:b.totalAllocation};
                var availability = calendar.getAvailabilityIntervalsFor(b.startDate);
                var availableAllocation = calendar.getCalendarDay(b.startDate).get("availableAllocation");
                if(availableAllocation && availableAllocation.length == availability.length) {
                    for (var i = 0, l = availability.length; i < l; i++) {
                        if (b.startDate >= availability[i].startDate && b.endDate <= availability[i].endDate) {
                            if(Ext.typeOf(availableAllocation[i])=="array"){
                                copyb.allocationMS = availableAllocation[i];
                            }else if(!availableAllocation[i]){
                                copyb.allocationMS = [];
                            }else{
                                throw "availableAllocation must be a array"
                            }
                            break;
                        }
                    }
                }
                copyb.allocationMS =copyb.allocationMS || [];
                //copyb.totalOverAllocationMS = copyb.totalAllocation>copyb.allocationMS?copyb.totalAllocation-copyb.allocationMS:0
                cpoyB.push(copyb);
            });
            if(cpoyB.length>0){
                /*var finalB = [];
                var start = cpoyB[0];
                for(var i= 1,l=cpoyB.length;i<l;i++){
                    var next = cpoyB[i];
                    if(start.totalAllocation == next.totalAllocation && start.allocationMS == next.allocationMS && start.endDate - next.startDate==0){
                        start.endDate = next.endDate;
                    }else{
                        finalB.push(start);
                        start = next;
                    }
                }
                finalB.push(start);*/
                var bars=[];
                var maxBars=[];
                Ext.each(cpoyB, function (b) {
                    if(Ext.typeOf(b.totalAllocation) =='array' && b.totalAllocation.length>0){
                        bars.push({
                            allocationMS: b.allocationMS,
                            endDate: b.endDate,
                            startDate: b.startDate,
                            totalAllocation: b.totalAllocation,
                            totalOverAllocationMS: b.totalOverAllocationMS
                        })
                    }
                    maxBars.push(b);
                })
            }
            return {maxBars:maxBars,bars:bars}
        }else{
            var cpoyB = [];
            var calendar = resource.getCalendar();
            Ext.each(B, function (b) {
                var copyb={startDate:b.startDate,endDate:b.endDate,totalAllocation:b.totalAllocation};
                var availability = calendar.getAvailabilityIntervalsFor(b.startDate);
                var availableAllocation = calendar.getCalendarDay(b.startDate).get("availableAllocation");
                if(availableAllocation && availableAllocation.length == availability.length) {
                    for (var i = 0, l = availability.length; i < l; i++) {
                        if (b.startDate >= availability[i].startDate && b.endDate <= availability[i].endDate) {
                            copyb.allocationMS = availableAllocation[i];
                            break;
                        }
                    }
                }
                copyb.allocationMS =copyb.allocationMS || 0;
                copyb.totalOverAllocationMS = copyb.totalAllocation>copyb.allocationMS?copyb.totalAllocation-copyb.allocationMS:0
                cpoyB.push(copyb);
            });
            if(cpoyB.length>0){
                var finalB = [];
                var start = cpoyB[0];
                finalB.push(start);
                for(var i= 1,l=cpoyB.length;i<l;i++){
                    var next = cpoyB[i];
                    if(start.totalAllocation == next.totalAllocation && start.allocationMS == next.allocationMS && start.endDate - next.startDate<2*1000){
                        start.endDate = next.endDate;
                    }else{
                        start = next;
                        finalB.push(start);
                    }
                }
                var bars=[];
                var maxBars=[];
                Ext.each(finalB, function (b) {
                    if(b.totalAllocation){
                        bars.push({
                            allocationMS: b.allocationMS,
                            endDate: b.endDate,
                            startDate: b.startDate,
                            totalAllocation: b.totalAllocation,
                            totalOverAllocationMS: b.totalOverAllocationMS
                        })
                    }
                    maxBars.push(b);
                })
            }
            return {maxBars:maxBars,bars:bars}
        }
    }
})