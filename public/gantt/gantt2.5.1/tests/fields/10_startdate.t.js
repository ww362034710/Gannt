StartTest(function(t) {
    var startDateField;
    
    var setup   = function () {
        startDateField && startDateField.destroy();
        
        var taskStore           = t.getTaskStore();

        var milestone           = new Gnt.model.Task({
            StartDate       : new Date(2013, 1, 26),
            EndDate         : new Date(2013, 1, 26),
            Duration        : 0
        });
    
        var notMilestone        = new Gnt.model.Task({
            StartDate       : new Date(2013, 1, 26),
            EndDate         : new Date(2013, 1, 28),
            Duration        : 2
        });
    
        var weekendWork         = new Gnt.model.Task({
            StartDate       : new Date(2013, 1, 16),
            EndDate         : new Date(2013, 1, 20)
        });
    
        startDateField      = new Gnt.field.StartDate({
            task                : milestone,
            taskStore           : taskStore,
            adjustMilestones    : true,
            format              : 'Y-m-d',
            renderTo            : Ext.getBody()
        });
        
        var pickerTrigger   = startDateField.el.down('.x-form-date-trigger');
        
        return {
            milestore       : milestone,
            notMilestone    : notMilestone,
            weekendWork     : weekendWork,
            startDateField  : startDateField,
            pickerTrigger   : pickerTrigger
        }
    }
    
    var checkDates = function (visibleDate, internalDate, t) {
        var visibleDateStr  = Ext.Date.format(visibleDate, 'Y-m-d');
        var internalDateStr = Ext.Date.format(internalDate, 'Y-m-d');

        t.is(startDateField.getValue(), internalDate, 'Field contains '+internalDateStr);
        t.is(startDateField.getRawValue(), visibleDateStr, 'Field rawValue contains '+visibleDateStr);
        t.is(startDateField.task.getStartDate(), internalDate, 'Task instance StartDate contains '+internalDateStr);
    };
    
    var getDateCell      = function (title) {
        return function () { return startDateField.picker.el.down('td[title="' + title + '"]'); };
    }

    t.it('Milestone task tests', function(t) {
        with (setup()) {
            t.is(startDateField.rawValue, '2013-02-25', "Initial value read from task");
    
            t.is(startDateField.rawToValue(''), null, 'Empty string converts to null');
            t.is(startDateField.rawToValue('2013-02-25'), new Date(2013, 1, 26), 'Correctly adjusted to 2013-02-26');
            t.is(startDateField.rawToValue('2013-02-26'), new Date(2013, 1, 27), 'Correctly adjusted to 2013-02-27');
            t.is(startDateField.rawToValue('2013-02-28'), new Date(2013, 1, 29), 'Correctly adjusted to 2013-02-29');
    
            t.is(startDateField.valueToRaw(new Date(2013, 1, 26)), '2013-02-25', 'Correctly adjusted date to 2013-02-25');
            t.is(startDateField.valueToRaw(new Date(2013, 1, 23)), '2013-02-22', 'Correctly adjusted date to 2013-02-22');
        }
    });
    
    
    t.it('Picker should work correct for milestone', function (t) {
        with (setup()) {
            t.chain(
                { click : pickerTrigger },
                function (next) {
                    t.is(startDateField.picker.getValue(), new Date(2013, 1, 25), 'Picker shows correct date 2013-02-26');
                    next();
                },
                { click : getDateCell('February 07, 2013') },
                function (next) {
                    t.diag('Picked 2013-02-07');
                    checkDates(new Date(2013, 1, 7), new Date(2013, 1, 8), t);
                    next();
                },
                { click : pickerTrigger },
                function (next) {
                    t.is(startDateField.picker.getValue(), new Date(2013, 1, 7), 'Picker shows correct date 2013-02-07');
                    next();
                },
                { click : getDateCell('February 26, 2013') },
                function (next) {
                    t.diag('Picked 2013-02-26');
                    checkDates(new Date(2013, 1, 26), new Date(2013, 1, 27), t);
                    next();
                },
                function (next) {
                    startDateField.beforeBlur();
                    t.diag('Blur field');
                    checkDates(new Date(2013, 1, 26), new Date(2013, 1, 27), t);
                    next();
                }
            );
        }
    });
    
    t.it('Picker should work correct for regular task', function (t) {
        with (setup()) {
            t.chain(
                function(next) {
                    startDateField.setTask(notMilestone);
    
                    t.is(startDateField.rawToValue(''), null, 'Empty string converts to null');
                    t.is(startDateField.rawToValue('2013-02-25'), new Date(2013, 1, 25), 'Correctly kept as 2013-02-25');
                    t.is(startDateField.rawToValue('2013-02-26'), new Date(2013, 1, 26), 'Correctly kept as 2013-02-26');
                    t.is(startDateField.rawToValue('2013-02-28'), new Date(2013, 1, 28), 'Correctly kept as 2013-02-28');
    
                    t.is(startDateField.valueToRaw(new Date(2013, 1, 26)), '2013-02-26', 'Correctly kept as 2013-02-26');
                    t.is(startDateField.valueToRaw(new Date(2013, 1, 23)), '2013-02-23', 'Correctly kept as 2013-02-23');
    
                    next();
                },
                
                { click : pickerTrigger },
    
                function (next) {
                    t.is(startDateField.picker.getValue(), new Date(2013, 1, 26), 'Picker shows correct date 2013-02-26');
    
                    next();
                },
                { click : getDateCell('February 07, 2013') },
                function (next) {
                    t.diag('Picked 2013-02-07');
                    var date    = new Date(2013, 1, 7);
                    checkDates(date, date, t);
    
                    next();
                },
    
                { click : pickerTrigger },
    
                function (next) {
                    t.is(startDateField.picker.getValue(), new Date(2013, 1, 7), 'Picker shows correct date 2013-02-07');
    
                    next();
                },
                { click : getDateCell('February 26, 2013') },
                function (next) {
                    t.diag('Picked 2013-02-26');
                    var date    = new Date(2013, 1, 26);
                    checkDates(date, date, t);
    
                    next();
                },
                // test keyboard input
                function (next) {
                    startDateField.inputEl.dom.value = '2013-02-27';
                    t.diag('Blur field');
                    // imitate field on blur behavior
                    startDateField.beforeBlur();
    
                    next();
                },
                function (next) {
                    t.diag('Entered 2013-02-27 from keyboard');
                    var date    = new Date(2013, 1, 27);
                    checkDates(date, date, t);
    
                    next();
                }
            )
        }
    });
    
    t.it('Should process weekends', function (t) {
        with (setup()) {
            startDateField.setTask(notMilestone);
            
            t.chain(
                { click : pickerTrigger },
    
                { click : getDateCell('March 01, 2013') },
                function (next) {
                    t.diag('Picked 2013-03-01 (it`s Friday)');
                    checkDates(new Date(2013, 2, 1), new Date(2013, 2, 1), t);
                    next();
                },
    
                { click : pickerTrigger },
    
                { click : getDateCell('March 02, 2013') },
                function (next) {
                    t.diag('Picked 2013-03-02 (it`s Saturday)');
                    checkDates(new Date(2013, 2, 4), new Date(2013, 2, 4), t);
                    next();
                },
    
                { click : pickerTrigger },
    
                { click : getDateCell('March 03, 2013') },
                function (next) {
                    t.diag('Picked 2013-03-03 (it`s Sunday)');
                    checkDates(new Date(2013, 2, 4), new Date(2013, 2, 4), t);
                    next();
                },
    
                { click : pickerTrigger },
    
                { click : getDateCell('March 04, 2013') },
                function (next) {
                    t.diag('Picked 2013-03-04 (it`s Monday)');
                    checkDates(new Date(2013, 2, 4), new Date(2013, 2, 4), t);
                    next();
                },
                function(next) {
                    t.diag('Switch to task in which start date is set to Saturday (2013-02-16)');
    
                    startDateField.setTask(weekendWork);
                    checkDates(new Date(2013, 1, 16), new Date(2013, 1, 16), t);
                    next();
                },
    
                { click : pickerTrigger },
    
                function (next) {
                    t.is(startDateField.picker.getValue(), new Date(2013, 1, 16), 'Picker shows correct date 2013-02-16');
                    next();
                },
    
                { click : getDateCell('February 18, 2013') },
    
                function (next) {
                    t.diag('Picked 2013-02-18');
                    checkDates(new Date(2013, 1, 18), new Date(2013, 1, 18), t);
                    next();
                }
            );
        }
    });
});
