// extend standard TaskForm class
Ext.define('Common.widget.taskeditor.TaskForm', {
    extend : 'Gnt.widget.taskeditor.TaskForm',
    showManuallyScheduled:true,
    constructor : function(config) {
        this.callParent(arguments);
        this.userStore = config.userStore;
        var person = new Ext.form.field.ComboBox({
            fieldLabel: '负责人',
            queryMode: "local",
            store:this.userStore,
            allowBlank: true,
            editing: false,
            forceSelection: false,
            valueField: this.userStore.model.prototype.idProperty,
            displayField: this.userStore.model.prototype.nameField,
            queryCaching: false,
            name:"Person",
            labelStyle :"width:110px;margin-right:5px;",
            listConfig: {
                getInnerTpl: function () {
                    return "{" + this.displayField + ":htmlEncode}"
                }
            },
            applyChanges: function (task) {
                if(task.get(this.name)!=this.getValue()){
                    var me = this;
                    function loop(task){
                        task.set(me.name,me.getValue());
                        if(task.childNodes.length>0){
                            for(var i = 0,l=task.childNodes.length;i<l;i++){
                                loop(task.childNodes[i]);
                            }
                        }
                    }
                    loop(task);
                }
            }
        });
        this.add([person]);
    },
    l10n:{
        taskNameText            : '名称',
        durationText            : '工期',
        datesText               : '日期',
        baselineText            : '基线',
        startText               : '开始',
        finishText              : '结束',
        percentDoneText         : '完成百分比',
        baselineStartText       : '开始',
        baselineFinishText      : '结束',
        baselinePercentDoneText : '完成百分比',
        effortText              : '工时',
        invalidEffortText       : '错误的投入值',
        calendarText            : '日历',
        schedulingModeText      : '排程模式',
        rollupText              : 'Rollup',
        wbsCodeText             : 'WBS编码',
        "Constraint Type"       : "约束类型",
        "Constraint Date"       : "约束日期"
    },
    getErrors:function( value ){
        return this.callParent(arguments)
    }
});