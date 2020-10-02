Ext.define('MyApp.field.Assignment', {
    extend: 'Gnt.field.Assignment',
    alias:"widget.myappassignmentfield",
    requires:[ 'MyApp.widget.AssignmentGrid'],
    formatString3:"{0} [{1}]",
    getDisplayValue:function(c){
        c = c || this.task;
        var g = [], f = this.assignmentStore, h, e = c.getInternalId(), b = c.getAssignments();
        for (var d = 0, a = b.length; d < a; d++) {
            h = b[d];
            if(h.getResource().get("unitsType")=="3" || h.getResource().get("unitsType")=="4"){
                g.push(Ext.String.format(this.formatString3, h.getResourceName(), h.getResource().getLabelByValue(h.getUnits())));
            }else if(h.getUnits()>0){
                g.push(Ext.String.format(this.formatString, h.getResourceName(), h.getUnits()));
            }
        }
        return g.join(", ")
    },
    createPicker: function () {
        var a = new MyApp.widget.AssignmentGrid(Ext.apply({ownerCt: this.ownerCt, renderTo: document.body, frame: true, floating: true, hidden: true, height: 200, width: 300, resourceStore: this.task.getResourceStore(), assignmentStore: this.task.getAssignmentStore(), fbar: this.buildButtons()}, this.gridConfig || {}));
        return a
    }
})