StartTest(function(t) {
    var g;
    
    var setup = function (cfg) {
        g && g.destroy();
        
        g = t.getGantt2(Ext.apply({
            renderTo : Ext.getBody(),
            startDate : new Date(2010, 0, 25),
            leftLabelField : {
                dataIndex : 'Name',
                editor : { xtype : 'textfield' }
            },
            rightLabelField : {
                dataIndex : 'Name',
                editor : { xtype : 'textfield' }
            }
        }, cfg));
    }
    
    t.it('Should edit label', function (t) {
        setup();
        
        t.waitForEventsToRender(g, function() {
            var labelEl = g.el.down('.sch-gantt-label-left');
    
            t.ok(labelEl, "Label el found in DOM");
    
            var xy = t.findCenter(labelEl),
                firstTask = g.taskStore.getRootNode().firstChild,
                taskName = firstTask.get('Name'),
                beforeStartCount = 0,
                beforeCompleteCount = 0,
                completeCount = 0;
    
            g.on({
                /**
                * @event labeledit_beforestartedit
                * Fires before editing is started for a field
                * @param {Gnt.view.Gantt} gantt The gantt panel instance
                * @param {Gnt.model.Task} taskRecord The task record 
                * @param {Mixed} value The field value being set
                * @param {Gnt.feature.LabelEditor} editor The editor instance
                */
                labeledit_beforestartedit : function(view, record, value, editor) {
                    t.is(view, g.getSchedulingView(), 'Correct view found as first argument');
                    t.is(record, firstTask, 'Correct task found as second argument');
                    t.is(value, taskName, 'Correct string found as third argument');
                    t.ok(editor instanceof Gnt.feature.LabelEditor, 'Correct object found as fourth argument');
                    t.is(arguments.length, 4 + 1, 'Correct number of arguments');       // Observable always add 'options' as last argument
                    beforeStartCount++;
                },
    
                /**
                * @event labeledit_beforecomplete
                * Fires after a change has been made to a label field, but before the change is reflected in the underlying field.
                * @param {Gnt.view.Gantt} gantt The gantt panel instance
                * @param {Mixed} value The current field value
                * @param {Mixed} startValue The original field value
                * @param {Gnt.model.Task} taskRecord The affected record 
                * @param {Gnt.feature.LabelEditor} editor The editor instance
                */
                labeledit_beforecomplete: function(view, newValue, oldValue, record, editor) {
                    t.is(view, g.getSchedulingView(), 'Correct view found as first argument');
                    t.is(oldValue, taskName, 'Correct string found as second argument');
                    
                    t.is(newValue, 'A', 'Correct new value found as third argument');    
                    
                    t.is(record, firstTask, 'Correct task found as fourth argument');
                    t.ok(editor instanceof Gnt.feature.LabelEditor, 'Correct object found as fifth argument');
                    t.is(arguments.length, 5 + 1, 'Correct number of arguments'); // Observable always add 'options' as last argument
                    beforeCompleteCount++;
                },
    
                /**
                * @event labeledit_complete
                * Fires after editing is complete and any changed value has been written to the underlying field.
                * @param {Gnt.view.Gantt} gantt The gantt panel instance
                * @param {Mixed} value The current field value
                * @param {Mixed} startValue The original field value
                * @param {Gnt.model.Task} taskRecord The affected record 
                * @param {Gnt.feature.LabelEditor} editor The editor instance
                */
                labeledit_complete: function(view, newValue, oldValue, record, editor) {
                    t.is(view, g.getSchedulingView(), 'Correct view found as first argument');
                    t.is(oldValue, taskName, 'Correct string found as second argument');
                    
                    t.is(newValue, 'A', 'Correct new value found as third argument');    
                    
                    t.is(record, firstTask, 'Correct task found as fourth argument');
                    t.ok(editor instanceof Gnt.feature.LabelEditor, 'Correct object found as fifth argument');
                    t.is(arguments.length, 5 + 1, 'Correct number of arguments'); // Observable always add 'options' as last argument
                    completeCount++;
                }
            });
    
            t.doubleClick(labelEl, function() {
            
                t.waitForSelectorAt(xy, 'input[type="text"]', function(foundEl) {
    
                    t.is(beforeStartCount, 1, 'labeledit_beforestartedit was fired exactly once');
                
                    // Set some new value in the text field
                    foundEl.value = "A";
                    t.type(foundEl, '[ENTER]');
                
                    this.waitFor(
                        function() { return g.taskStore.getRootNode().firstChild.get('Name') === "A"; }, 
                        function() {
                            t.pass('Task record Name field updated correctly after pressing ENTER');    
                            t.is(beforeCompleteCount, 1, 'labeledit_beforecomplete was fired exactly once');    
                            t.is(completeCount, 1, 'labeledit_complete was fired exactly once');    
                            
                    });
                });
            });
        });
    });
    
    t.it('Editing should not break shiftNext/shiftPrevious', function (t) {
        setup({
            taskStore   : t.getTaskStore({
                DATA    : [{
                    "leaf": true,
                    "Id": 1,
                    "StartDate": "2010-02-03T00:00:00",
                    "Duration" : 1,
                    "Name"  : "test"
                }]
            })
        });
        
        t.chain(
            { dblclick : "tr[data-recordid=1] .sch-gantt-labelct-right" },
            { type : "[RETURN]" },
            
            function (next) {
                t.waitForEvent(g.timeAxis, 'refresh', next);
                g.shiftNext();
            },
            
            function (next) {
                var root = g.taskStore.getRootNode();
                root.appendChild({
                    Name        : 'test',
                    leaf        : true,
                    StartDate   : new Date(2010, 1, 3),
                    EndDate     : new Date(2010, 1, 4),
                    Cls         : 'task2'
                });
                
                t.notOk(g.el.down('.task2').up('.sch-secondary-canvas'), 'Rendered not in secondary canvas'); 
            }
        );
    });
});
