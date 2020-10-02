StartTest(function(t) {
    var scenario = function () {
        var generateTaskData = function () {
            var arr = [],
                i, j, k,
                cn, cn2,
                dt = new Date(2010, 0, 5);
    
            for (var i = 1; i < 5; i++) {
                cn = [];
                for (j = 1; j < 5; j++) {
                    cn2 = [];
                    for (k = 1; k < 5; k++) {
                        cn2.push({
                            Id        : 100 * i + 10 * j + k,
                            Name      : 'Child task ' + String(i) + String(j) + String(k),
                            StartDate : dt,
                            Duration  : 2,
                            leaf      : true
                        });
                    }
                    cn.push({
                        Id        : 100 * i + 10 * j,
                        Name      : 'Child task ' + String(i) + String(j),
                        StartDate : dt,
                        Duration  : 2,
                        expanded  : true,
                        children  : cn2
                    });
                    dt = Ext.Date.add(dt, Ext.Date.DAY, 7)
                }
                arr.push({
                    Id        : 100 * i,
                    Name      : 'Root task #' + i,
                    StartDate : new Date(2010, 0, 5),
                    EndDate   : dt,
                    children  : cn,
                    expanded  : true
                });
            }
            
            return arr;
        }

        var taskStore = Ext.create("Gnt.data.TaskStore", {
            sortOnLoad : false,
            proxy : {
                type : 'memory',
                data : generateTaskData()
            }
        });

        var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
            proxy : 'memory',
            data  : [
                { From : 112, To : 115, Type : 2},
                { From : 111, To : 200, Type : 0}
            ]
        });

        var g = Ext.create('Gnt.panel.Gantt', {
            height            : 600,
            width             : 800,
            renderTo          : Ext.getBody(),
            rightLabelField   : 'Name',
            highlightWeekends : false,
            loadMask          : true,
            cascadeChanges    : false,
            viewPreset : 'weekAndDayLetter',
            startDate : new Date(2010, 0, 4),
            endDate   : Sch.util.Date.add(new Date(2010, 0, 4), Sch.util.Date.WEEK, 20),

            // Setup your static columns
            columns : [{
                xtype : 'namecolumn',
                width : 200
            }],

            taskStore       : taskStore,
            dependencyStore : dependencyStore,

            plugins : [ new Ext.grid.plugin.BufferedRenderer() ]
        });
        
        return {
            dependencyStore : dependencyStore,
            taskStore       : taskStore,
            gantt           : g
        }
    }
    
    t.it('Should refresh buffered tree panel after collapsing node', function (t) {
        with (scenario()) {
            t.chain(
                { waitForRowsVisible : gantt },
                function (next) {
                    gantt.normalGrid.plugins[0].scrollTo(70);
                    
                    taskStore.getById(400).collapse();
                    taskStore.getById(300).collapse();
                    taskStore.getById(240).collapse();
                    t.expect(gantt.normalGrid.view.getNodeByRecord(taskStore.getRootNode().firstChild)).toBeTruthy();
                    
                    next();
                }
            )
        }
    });
});    
