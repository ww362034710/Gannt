Ext.define("Common.store.TaskStore", {
    extend      : 'Gnt.data.TaskStore',
    model: "Common.model.Task",
    calendarDataModel: "Common.store.Calendar",
    rootVisible : false
});
