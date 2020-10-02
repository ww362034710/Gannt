# CRUD manager for the Ext Scheduler

## Intro

This guide describes the CRUD manager implementation for Ext Scheduler.
It contains only Scheduler specific details. For general information on CRUD manager implementation and architecture
see [this guide](#!/guide/crud_manager).

The class implementing _CRUD manager_ for Ext Scheduler is called {@link Sch.data.CrudManager}.
It uses {@link Sch.crud.transport.Ajax AJAX} as transport system and {@link Sch.crud.encoder.Json JSON} as encoding format.

## Stores

There are two stores used in Scheduler: resources and events store.
And to register them in a {@link Sch.data.CrudManager} instance {@link Sch.data.CrudManager#resourceStore resourceStore} and
{@link Sch.data.CrudManager#eventStore eventStore} configs should be used respectively.

    var crudManager = Ext.create('Sch.data.CrudManager', {
        autoLoad        : true,
        resourceStore   : resourceStore,
        eventStore      : eventStore,
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

User can provide any number of extra stores using {@link Sch.data.CrudManager#stores stores} config:

    var crudManager = Ext.create('Sch.data.CrudManager', {
        autoLoad        : true,
        resourceStore   : resourceStore,
        eventStore      : eventStore,
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

Or add them with {@link Sch.data.CrudManager#addStore addStore} method:

    crudManager.addStore([ store2, store3 ]);

## Implementation

Here is how CRUD manager can be created:

    var crudManager = Ext.create('Sch.data.CrudManager', {
        autoLoad        : true,
        resourceStore   : resourceStore,
        eventStore      : eventStore,
        transport       : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

In above example data loading will start automatically due to {@link Sch.data.CrudManager#autoLoad autoLoad} config set to `true`.
There is also a {@link Sch.data.CrudManager#method-load load} method to invoke data loading manually:

    crudManager.load(function (response) {
        alert('Data loaded...');
    })

And to persist changes there are also {@link Sch.data.CrudManager#autoSync autoSync} for automatic invoking
and {@link Sch.data.CrudManager#method-sync sync} method for manual usage:

    crudManager.sync(function (response) {
        alert('Changes saved...');
    });

Any {@link Sch.panel.SchedulerGrid} or {@link Sch.panel.SchedulerTree} instances can be pointed
to use _CRUD manager_ using {@link Sch.panel.SchedulerGrid#crudManager crudManager} config.
In this case you don't need to specify {@link Sch.panel.SchedulerGrid#resourceStore resourceStore} and {@link Sch.panel.SchedulerGrid#eventStore eventStore}
on a panel. They will be taken from provided {@link Sch.panel.SchedulerGrid#crudManager crudManager}.

    Ext.create('Sch.panel.SchedulerGrid', {
        eventBarTextField   : 'Name',
        viewPreset          : 'dayAndWeek',
        startDate           : new Date(2014, 0, 1),
        endDate             : new Date(2014, 1, 1),
        width               : 800,
        height              : 350,
        // point grid to use CRUD manager
        crudManager         : crudManager
    });


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
