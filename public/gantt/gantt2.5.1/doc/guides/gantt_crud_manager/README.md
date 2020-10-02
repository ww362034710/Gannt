# CRUD manager for Ext Gantt

## Intro

This guide describes the CRUD manager implementation for Ext Gantt.
It contains only Gantt specific details. For general information on CRUD manager implementation and architecture
see [this guide](#!/guide/crud_manager).

The class implementing _CRUD manager_ for Ext Gantt is called {@link Gnt.data.CrudManager}.
It uses {@link Sch.crud.transport.Ajax AJAX} as transport system and {@link Sch.crud.encoder.Json JSON} as encoding format.

## Stores

There are a number of stores used in Gantt: calendars, resources, assignments, dependencies and tasks store.
And to register them in a {@link Gnt.data.CrudManager} instance following configs should be used respectively:
{@link Gnt.data.CrudManager#calendarManager calendarManager}, {@link Gnt.data.CrudManager#resourceStore resourceStore},
{@link Gnt.data.CrudManager#assignmentStore assignmentStore}, {@link Gnt.data.CrudManager#dependencyStore dependencyStore},
{@link Gnt.data.CrudManager#taskStore taskStore}.

    var crudManager = Ext.create('Gnt.data.CrudManager', {
        autoLoad        : true,
        calendarManager : calendarManager,
        resourceStore   : resourceStore,
        dependencyStore : dependencyStore,
        assignmentStore : assignmentStore
        taskStore       : taskStore,
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

Normally user doesn't have to specify {@link Gnt.data.CrudManager#calendarManager calendarManager}, {@link Gnt.data.CrudManager#resourceStore resourceStore},
{@link Gnt.data.CrudManager#dependencyStore dependencyStore} and {@link Gnt.data.CrudManager#assignmentStore assignmentStore}
configs if they were already specified for the task store instance.
The CRUD manager will just take them from the provided task store instance:

    var taskStore = Ext.create('Gnt.data.TaskStore', {
        calendarManager : calendarManager,
        resourceStore   : resourceStore,
        dependencyStore : dependencyStore,
        assignmentStore : assignmentStore
    });

    var crudManager = Ext.create('Gnt.data.CrudManager', {
        autoLoad        : true,
        // We specify TaskStore only. The rest stores will be taken from it.
        taskStore       : taskStore,
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

User can provide any number of extra stores using {@link Gnt.data.CrudManager#stores stores} config:

    var crudManager = Ext.create('Gnt.data.CrudManager', {
        taskStore       : taskStore,
        stores          : [ store1, store2, store3 ],
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

Or add them with {@link Gnt.data.CrudManager#addStore addStore} method:

    crudManager.addStore([ store2, store3 ]);


## Implementation

Here is how CRUD manager can be created:

    var crudManager = Ext.create('Gnt.data.CrudManager', {
        autoLoad        : true,
        taskStore       : taskStore,
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

In above example data loading will start automatically due to {@link Gnt.data.CrudManager#autoLoad autoLoad} config set to `true`.
There is also a {@link Gnt.data.CrudManager#method-load load} method to invoke data loading manually:

    crudManager.load(function (response) {
        alert('Data loaded...');
    })

And to persist changes there are also {@link Gnt.data.CrudManager#autoSync autoSync} for automatic invoking
and {@link Gnt.data.CrudManager#method-sync sync} method for manual usage:

    crudManager.sync(function (response) {
        alert('Changes saved...');
    });

Any {@link Gnt.panel.Gantt} instances can be pointed to use _CRUD manager_ using {@link Gnt.panel.Gantt#crudManager crudManager} config.
In this case you don't need to specify {@link Gnt.panel.Gantt#taskStore taskStore}, {@link Gnt.panel.Gantt#dependencyStore dependencyStore},
{@link Gnt.panel.Gantt#resourceStore resourceStore}, {@link Gnt.panel.Gantt#assignmentStore assignmentStore}
on a panel. They will be taken from provided {@link Gnt.panel.Gantt#crudManager crudManager} instance.

    Ext.create('Gnt.panel.Gantt', {
        viewPreset          : 'dayAndWeek',
        startDate           : new Date(2014, 0, 1),
        endDate             : new Date(2014, 1, 1),
        width               : 800,
        height              : 350,
        // point grid to use CRUD manager
        crudManager         : crudManager
        columns             : [
            {
                xtype   : 'namecolumn'
            },
            {
                xtype   : 'startdatecolumn'
            }
        ]
    });


## Calendars

{@link Gnt.data.CrudManager} supports a bulk loading of all the project calendars.
To do it the {@link Gnt.data.CrudManager#calendarManager} config has to be specified or it can be specified on a {@link Gnt.data.TaskStore#calendarManager task store}.

    var calendarManager   = Ext.create('Gnt.data.CalendarManager', {
        calendarClass   : 'Gnt.data.calendar.BusinessTime'
    });

    ...

    var taskStore     = Ext.create('Gnt.data.TakStore', {
        // taskStore calendar will automatically be set when calendarManager gets loaded
        calendarManager : calendarManager,
        resourceStore   : resourceStore,
        dependencyStore : dependencyStore,
        assignmentStore : assignmentStore
    });

    var crudManager   = Ext.create('Gnt.data.CrudManager', {
        autoLoad        : true,
        taskStore       : taskStore,
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

### Load response structure

Calendar manager load response have a more complex structure than [described general one](#!/guide/crud_manager-section-4).

The first difference from standard response is for each calendar we include its data under the `Days` field.
The object under `Days` field has exactly the same structure as any other object holding a store data.
It has `rows` containing array of calendar records (each of represents {@link Gnt.model.CalendarDay} instances) and `total` having total number of them.

And another thing to take a note is how `metaData` is used for calendar manager loading.
It has the `projectCalendar` property which **must** contain the identifier of the calendar that has to be used as a **project calendar**.

    {
        requestId   : 123890,
        revision    : 123,
        success     : true,

        calendars   : {
            // each record represents Gnt.model.Calendar instance
            rows        : [
                {
                    Id                  : "1",
                    parentId            : null,
                    Name                : "General",
                    DaysPerMonth        : 20,
                    DefaultAvailability : ["08:00-12:00","13:00-17:00"],
                    ...
                    // here we include calendar data
                    Days                : {
                        // each record represents Gnt.model.CalendarDay instance
                        rows    : [{
                            Id                  : 2,
                            calendarId          : "1",
                            Name                : "Some big holiday",
                            Type                : "DAY",
                            Date                : "2010-01-14",
                            Availability        : [],
                            Weekday             : 0,
                            OverrideStartDate   : null,
                            OverrideEndDate     : null,
                            IsWorkingDay        : false,
                            Cls                 : "gnt-national-holiday"
                        }],
                        total   : 1
                    },
                    // child calendars go here
                    // each record represents Gnt.model.Calendar instance
                    children    : [{
                        Id          : "2",
                        parentId    : "1",
                        Name        : "Holidays",
                        ...
                        // "Holidays" calendar data
                        Days        : {
                            // each record represents Gnt.model.CalendarDay instance
                            rows    : [
                                {
                                    Id          : 3,
                                    calendarId  : "2",
                                    Name        : "Mats's birthday",
                                    Date        : "2010-01-13",
                                    ...
                                },
                                {
                                    Id          : 4
                                    calendarId  : "2",
                                    Name        : "Bryntum company holiday",
                                    Date        : "2010-02-01",
                                    ...
                                },
                                {
                                    Id          : 5,
                                    calendarId  : "2",
                                    Name        : "Bryntum 1st birthday",
                                    Date        : "2010-12-01",
                                    ...
                                }
                            ],
                            total   : 3
                        },
                        leaf    : true
                    }]
                }
            ],
            total       : 2,
            metaData    : {
                // this specifies identifier of the project calendar
                projectCalendar : "1"
            }

        },

        store2      : {
            ...
        },

        store3      : {
            ...
        }
    }


## Error handling

See [details on error handling in general guide](#!/guide/crud_manager-section-5).

## Writing own server-side implementation.

User can make own server-side implementation for any platform. The only requirement is to follow [requests and responses structure convention](#!/guide/crud_manager-section-3).

### Testing server-side implementation

There is a test suite located in `tests/crud_manager/11_backend.t.js` file.
The suite is made for the [Bryntum Siesta](http://www.bryntum.com/products/siesta/) testing tool.
It allows to test server-side implementation by sending a group of `load` and `sync` requests for a number of test scenarios
and verifying their results.
This suite can be used to test any server-side implementation.

All that should be done to apply it to a custom implementation is just to specify another URL-s for backend end-points. Like this for example:


    {
        url         : 'crud_manager/11_backend.t.js',
        load        : {
            url     : '../some/path/read.jsp',
            method  : 'POST'
        },
        sync        : {
            url     : '../some/path/save.jsp',
            method  : 'POST'
        },
        resetUrl    : '../some/path/reset.jsp'
    }

The `load` and `sync` section also accept `method` config specifying HTTP method that should be used to requesting corresponding URL.

**Note:** The end-point specified by `resetUrl` config must clear the testing database.
