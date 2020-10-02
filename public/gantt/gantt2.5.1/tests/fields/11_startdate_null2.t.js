StartTest(function(t) {

    // #1341: check if date selection works correctly when we have time mask in field format and initially task start date is null

    var task           = new Gnt.model.Task();

    var taskStore      = t.getTaskStore({
        DATA : [task]
    });

    var startDateField      = new Gnt.field.StartDate({
        task                : task,
        taskStore           : taskStore,
        adjustMilestones    : true,
        format              : 'Y-m-d H:i:s',
        renderTo            : Ext.getBody()
    });

    var pickerTrigger   = startDateField.el.down('.x-form-date-trigger');

    var pickerCell      = function (value) {
        var picker          = startDateField.picker;
        return picker.el.down('td[title="'+Ext.Date.format(value, picker.ariaTitleDateFormat)+'"]');
    };

    var now             = Ext.Date.clearTime(new Date());
    // get some other (not today) date at the beginning of the current month
    var anotherDate     = new Date(now.getFullYear(), now.getMonth(), now.getDate() > 1 ? 1 : 2);
    var resultDate      = anotherDate;

    // if anotherDate belongs to a weekend then resulted date have to be set to next Monday
    if (anotherDate.getDay() == 0) {
        resultDate  = Ext.Date.add(anotherDate, Ext.Date.DAY, 1);
    } else if (anotherDate.getDay() == 6) {
        resultDate  = Ext.Date.add(anotherDate, Ext.Date.DAY, 2);
    }

    t.chain(
        { action : 'click', target : pickerTrigger },

        {
            action      : 'click',
            target      : function () { return pickerCell(anotherDate); }
        },
        function (next) {
            t.diag('Picked some date');
            t.is(startDateField.getRawValue(), Ext.Date.format(resultDate, 'Y-m-d H:i:s'), 'Field contains proper date');

            next();
        },
        { action : 'click', target : pickerTrigger },
        function (next) {
            t.is(startDateField.picker.getValue(), resultDate, 'Correct date selected in picker when re-opening it')
        }
    );

});
