Ext.define('Common.model.Task', {
    extend: 'Gnt.model.Task',
    fields : [
        { name : 'color', type : 'string'},
        { name : 'person', type : 'number',useNull: true}
    ],
    constructor: function (a, id, data, convertedData) {
        // if (a) {
        if (data && data.id) arguments[1] = data.id;
            this.callParent(arguments)
        // } else {
        //     this.callParent(a, data.id, data, convertedData);
        // }
    },
    isEditable: function (a) {
        return this.callParent(arguments) && !this.isReadOnly();
    },
    isReadOnly:function(){
        //判断当前用户是否为管理员 TODO
        return this.callParent(arguments);
    },
    idProperty: 'id',
    idField: 'id',
    taskInfoTypeField: 'taskInfoType',
    codeField: 'code',
    stateField: 'state',
    assignedField: 'assigned',
    baselineEndDateField:"baselineEndDate",
    baselinePercentDoneField:"baselinePercentDone",
    baselineStartDateField:"baselineStartDate",
    calendarIdField:"calendarId",
    clsField:"cls",
    constraintDateField:"constraintDate",
    constraintTypeField:"constraintType",
    draggableField:"draggable",
    durationField:"duration",
    durationUnitField:"durationUnit",
    effortField:"effort",
    effortUnitField:"effortUnit",
    endDateField:"endDate",
    manuallyScheduledField:"manuallyScheduled",
    nameField:"name",
    noteField:"note",
    percentDoneField:"percentDone",
    phantomIdField:"phantomId",
    resizableField:"resizable",
    rollupField:"rollup",
    schedulingModeField:"schedulingMode",
    startDateField:"startDate",
    readOnlyField:"readOnly",
    segmentsField: "segments",
    phantomParentIdField: "phantomParentId",
    showInTimelineField: "showInTimeline",
    deadlineDateField: "deadlineDate",
    deviceIdField: "deviceId",
    deviceTestTypeIdField: "deviceTestTypeId",
    productCodeField: "productCode",
    // 之前两个segment靠在一起回合并
    // 改后 两个segment可以紧靠在一起 无需最小隔一个单位的时间
    mergeOverlappedSegments: function (_0x5220x6) {
        var segments = this.getSegments();
        if (segments) {
            var overlappedSegments = [], preSegment = segments[0], segment;
            for (var i = 1, l = segments.length; i < l; i++) {
                segment = segments[i];
                if (segment.getStartOffset() < preSegment.getEndOffset()) {
                    overlappedSegments.push(segment);
                    if (segment.getEndOffset() > preSegment.getEndOffset()) {
                        preSegment.setEndDateWithoutPropagation(segment.getEndDate(), false)
                    }
                } else {
                    preSegment = segment
                }
            }
            ;
            this.removeSegments(overlappedSegments);
            if (segments.length < 2 && !_0x5220x6) {
                this.setSegmentsWithoutPropagation(null)
            }
        }
    },
    // 支持每个任务的状态选项集都不同
    getFieldStore: function(fieldProperty) { // 通过任务和配置的fieldProperty 调用 get{fieldProperty}Store 方法获得 store
        fieldProperty = this[fieldProperty]    // 例如: state
        var upperFieldProperty = fieldProperty.substring(0,1).toUpperCase()+fieldProperty.substring(1);
        var store = this["get" + upperFieldProperty + "Store"]();
        return store;
    },
    // 实现不同选项集
    stateStore: null,
    // 内嵌了store的生成逻辑  或者改写为远程调用方式
    getStateStore: function() {
        if (!this.stateStore) {
            if (this.getIndex() % 2 === 0) {
                this.stateStore = new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [['10', '单状态1'], ['20', '单状态2']]
                });
            } else {
                this.stateStore = new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: [['30', '双状态1'], ['40', '双状态2']]
                });
            }
        }
        return this.stateStore;
    },
    // 除了声明在task中的getStateStore内内嵌了store的生成逻辑  还可以通过外部代码直接设置task的stateStore 则开启下方代码
    // 程序会返回设置好的stateStore
    // ,getStateStore: function() {
    //     return this.stateStore
    // }
    deptField: 'deptId'
});