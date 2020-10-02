StartTest(function(t) {
    // hint: to understand what's going on in the tests you need to actually draw the tasks with dates on paper

    // Various methods of the dependency store and `successors/predecessors` (incoming/outgoing deps) 
    // properties of the task model are cached
    // in this test we'll verify that cache is correctly reset/refreshed after CRUD operations with dependencies 
    
    with (t.getAllStoresDataSet(
        [
            {
                Id          : 1,
                children    : [
                    {
                        Id          : 11,
                        leaf        : true
                    },
                    {
                        Id          : 12,
                        leaf        : true
                    }
                ]
            },
            {
                Id          : 20,
                children    : [
                    {
                        Id          : 21,
                        leaf        : true
                    },
                    {
                        Id          : 22,
                        leaf        : true
                    }
                ]
            },
            {
                Id          : 30,
                leaf        : true
            }
        ],
        [],
        [
            {
                Id          : 1,
                TaskId      : 1,
                ResourceId  : 1
            },
            {
                Id          : 2,
                TaskId      : 1,
                ResourceId  : 2
            },
            {
                Id          : 3,
                TaskId      : 1,
                ResourceId  : 3
            },
            {
                Id          : 4,
                TaskId      : 20,
                ResourceId  : 4
            },
            {
                Id          : 5,
                TaskId      : 21,
                ResourceId  : 4
            },
            {
                Id          : 6,
                TaskId      : 22,
                ResourceId  : 4
            }
        ],
        [
            {
                Id          : 1,
                Name        : 'Resource1'
            },
            {
                Id          : 2,
                Name        : 'Resource2'
            },
            {
                Id          : 3,
                Name        : 'Resource3'
            },
            {
                Id          : 4,
                Name        : 'Resource4'
            }
        ]
    )) {
        t.verifyCachedAssignmentsState(taskStore, assignmentStore)
        var ass;
        
        t.it('Updating cache on new assignment', function (t) {
	        
	        assignmentStore.add({ Id : 7, TaskId : 20, ResourceId : 1 })
            t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
        
        t.it('Updating cache on editing assignment', function (t) {
            ass = assId(7); 
            ass.set({
                TaskId      : 21,
                ResourceId  : 2
            });
            
            t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
	    
	    t.it('Updating cache on rejecting assignment\'s changes', function (t) {    
	        ass.reject();
	        t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
	        
        t.it('Updating cache on setting assignment\'s taskId', function (t) {
            ass.setTaskId(30);
	        t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
	    
        t.it('Updating cache on removing assignment', function (t) {
	        assignmentStore.remove(ass);
	        t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
	       
        t.it('Updating cache on remocing all assignments', function (t) {
	        assignmentStore.removeAll();
	        t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
	       
        t.it('Updating cache on changing root node', function (t) {
	        taskStore.setRootNode({
	            Id          : 1,
	            children    : [
	                {
	                    Id  : '22',
	                    leaf : true
	                }
	            ]
	        });
	        
	        t.verifyCachedAssignmentsState(taskStore, assignmentStore);
        });
    }

});
