Ext.define("MyApp.model.Resource", {
    extend              : 'Gnt.model.Resource',
    fields : [
        { name : 'Type', defaultValue: 'Person' },
        { name : 'Name', defaultValue: '' },
        { name : 'unitsType', defaultValue: '0' },/*0:时间,1:百分比,2:使用量,3:枚举资源互斥,4枚举资源非互斥*/
        { name : 'unitsName', defaultValue:"" },
        { name : 'unitsValues'},/*可选值 id or number*/
        { name : 'unitsLabels'},/*可选值 name*/
        { name : 'scaleMax', defaultValue: null },
        { name : 'scaleMin', defaultValue: null },
        { name : 'scaleStep', defaultValue: null },
        { name : 'scaleLabelStep', defaultValue:null }/*刻度*/
    ],
    typeField: 'Type',
    scaleConfig:null,
    buildScaleConfig :function (){
        if(!this.scaleConfig){
            var scaleMax=this.get("scaleMax"),scaleMin=this.get("scaleMin"),
            scaleStep=this.get("scaleStep"),scaleLabelStep=this.get("scaleLabelStep"),
            unitsName=this.get("unitsName"),unitsType=this.get("unitsType"),
            unitsValues=this.get("unitsValues"),unitsLabels=this.get("unitsLabels");
            if(unitsType=='1' && !unitsName){
                unitsName="%";
            }
            /*如果是百分比*/
            if(unitsType=='1' && !scaleMax){
                scaleMax = 120;
                scaleLabelStep = 20;
                scaleStep =10;
            }

            if(Ext.typeOf(unitsValues)=="array" && unitsValues.length>0){
                scaleMax = unitsValues.length;
                scaleLabelStep = 1;
                scaleStep =1;
                if(!unitsLabels){
                    unitsLabels = []
                }
            }

            if(!scaleMax){
            	throw this.get("Name")+"unitsValues 无效"
            }else if(scaleMax>20 && unitsType!="3" && unitsType!="4"){
                scaleMax = Math.ceil(scaleMax/4/5)*5*4;
            }
            if(!scaleMin){scaleMin=0}
            if(!scaleStep){scaleStep=(scaleMax/4/5)}
            if(!scaleLabelStep){scaleLabelStep=(scaleMax/4)}
            this.scaleConfig = {scaleMax:scaleMax,scaleMin:scaleMin,scaleStep:scaleStep,scaleLabelStep:scaleLabelStep,unitsType:unitsType,unitsName:unitsName,unitsValues:unitsValues,unitsLabels:unitsLabels};
        }
        return this.scaleConfig;
    },
    getAllocationInfo: function (a) {/*资源片段化的资源占用量数组*/

        var unitsType=this.get("unitsType");
        /*互斥资源*/
        if(unitsType=='3' || unitsType=='4'){
            var b = [];
            this.forEachAvailabilityIntervalWithTasks(a, function (j, h, g, k) {/*j:边界点集合中的当前点，h:下一个点，g:任务占用资源信息,k:{inResourceCalendar: !!F, inTasksCalendar: !!a, inTask: z}*/
                var f = [], d = [], c = {};/*f:资源累计占用量,d:assignment数组,*/
                if (k.inResourceCalendar && k.inTasksCalendar && k.inTask) {
                    for (var e in g) {
                        if(f.indexOf(g[e].units)==-1){
                            f.push(g[e].units);
                        }
                        d.push(g[e].assignment);
                        c[e] = g[e].assignment;
                    }
                }
                b.push(Ext.apply({startDate: new Date(j), endDate: new Date(h), totalAllocation: f, assignments: d, assignmentsHash: c}, k))
            });
            return b
        }else{
            return this.callParent(arguments);
        }
    },
    getLabelByValue:function(value){
    	var unitsValues=this.get("unitsValues");
    	if(Ext.typeOf(unitsValues) =='array'){
    		var index = unitsValues.indexOf(value+"");
    		if(index>-1){
    			var unitsLabels=this.get("unitsLabels");
    			if(unitsLabels){
                    return unitsLabels[index];
                }else{
    			    return value;
                }
    		}
    	}
    	return value;
    }
});
