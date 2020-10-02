StartTest(function(t) {
    t.describe('Constraint date field', function(t) {
        t.it("Should behave as normal date field if unbound to a task", function(t) {
            var constraintField, dateField,
                date, dateAsString;

            dateField = new Ext.form.field.Date({
                id       : 'date-field',
                renderTo : Ext.getBody()
            });

            constraintField = new Gnt.field.ConstraintDate({
                id       : 'constraint-field',
                renderTo : Ext.getBody(),
                style    : 'top: 40px'
            });

            // Default values must match
            t.is(dateField.getValue(), constraintField.getValue());

            // Empty values must match
            date = '';
            dateField.setValue(date);
            constraintField.setValue(date);
            t.is(dateField.getValue(), constraintField.getValue());

            date = null;
            dateField.setValue(date);
            constraintField.setValue(date);
            t.is(dateField.getValue(), constraintField.getValue());

            // Value might be set as a date
            date = new Date();
            dateField.setValue(date);
            constraintField.setValue(date);
            t.is(dateField.getValue(), constraintField.getValue());
        
            dateAsString = Ext.Date.format(date, "m/d/Y");
            dateField.setValue(null);
            constraintField.setValue(null);

            t.chain(
                // Value might be typed in
                { type : dateAsString, target : dateField },
                { type : dateAsString, target : constraintField },
                { click : Ext.getBody(), offset : [0, 80] },
                function (next) {
                    t.is(dateField.getValue(), constraintField.getValue());
                    next();
                },
                // Value might be picked
                function (next) {
                    date = new Date(2014, 6, 18);
                    dateField.setValue(date);
                    constraintField.setValue(date);
                    next();
                },
                { click : "#date-field .x-form-trigger" },
                { waitFor : "componentVisible", args : [ dateField.getPicker() ] },
                { click : "#" + dateField.getPicker().getId() + " td[title*=17]" },
                { click : "#constraint-field .x-form-trigger" },
                { waitFor : "componentVisible", args : [ constraintField.getPicker() ] },
                { click : "#" + constraintField.getPicker().getId() + " td[title*=17]" },
                function (next) {
                    t.is(dateField.getValue(), constraintField.getValue());
                    next();
                },
                // Clean up
                function (next) {
                    Ext.destroy(dateField);
                    Ext.destroy(constraintField);
                }
            );    
        });

        t.it("Should obtain the value from a task it's bound to", function(t) {
            var constraintField,
                date;

            date = new Date();

            with(t.getAllStoresDataSet(
                [
                    { Id : 1, leaf : true, ConstraintDate :  date}
                ]
            )) {        
                constraintField = new Gnt.field.ConstraintDate({
                    id       : 'constraint-field',
                    renderTo : Ext.getBody(),
                    task     : id(1)
                });

                t.is(constraintField.getValue(), Ext.Date.clearTime(date));

                Ext.destroy(constraintField);
                Ext.destroy(taskStore);
            }
        });

        t.it("Should update the task with the value set", function(t) {
            var constraintField,
                date;

            date = new Date(2014, 6, 18);

            with(t.getAllStoresDataSet(
                [
                    { Id : 1, leaf : true, ConstraintDate : null }
                ]
            )) {
                constraintField = new Gnt.field.ConstraintDate({
                    id       : 'constraint-field',
                    renderTo : Ext.getBody(),
                    task     : id(1)
                });

                t.chain(
                    // Update by typing
                    { type : Ext.Date.format(date, "m/d/Y"), target : constraintField },
                    { click : Ext.getBody(), offset : [0, 80] }, // Forcing blur
                    function(next) {
                        t.is(id(1).getConstraintDate(), Ext.Date.clearTime(date));
                        next();
                    },
                    // Update value by picking
                    { click : "#constraint-field .x-form-trigger" },
                    { waitFor : "componentVisible", args : [ constraintField.getPicker() ] },
                    { click : "#" + constraintField.getPicker().getId() + " td[title*=17]" },
                    function (next) {
                        t.is(id(1).getConstraintDate(), Ext.Date.clearTime(new Date(2014, 6, 17)));
                        next();
                    },
                    // Clean up
                    function (next) {
                        Ext.destroy(constraintField);
                        Ext.destroy(taskStore);
                    }
                );
            }
        });
    });
});
