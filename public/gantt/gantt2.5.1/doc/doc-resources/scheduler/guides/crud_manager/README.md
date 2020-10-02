# CRUD manager general information

## Intro

The general idea of _CRUD manager_ development was _simplicity_.
We wanted to create a central class combining all the project stores into a single object.
So that object could simplify an interaction with a server-side providing following features:

- retrieving of all stores data by a single server request
- persisting all data changes by a single server request
- more clear and concise configuration setup (by avoiding to configure each individual store proxy)
- also we wanted to make new classes in parallel with classic proxies to be independent of _ExtJS_ upgrades

All above targets were achieved by implementing _CRUD manager_ classes.

## Architecture

Basically _CRUD manager_ is a collection of stores.
The core of any _CRUD manager_ implementation is {@link Sch.crud.AbstractManager} class.
But to turn the abstract class into a final implementation it should be mixed in with two more classes:

- encoding system mixin
- transport system mixin

For example the given {@link Sch.data.CrudManager} class uses _JSON_ as an encoding system (mixed by {@link Sch.crud.encoder.Json} class)
and _AJAX_ as a transport system (mixed by {@link Sch.crud.transport.Ajax} class).

    var crudManager = Ext.create('Sch.data.CrudManager', {
        autoLoad    : true,
        stores      : [
            store1, store2, store3
        ],
        transport   : {
            load    : {
                url     : 'php/read.php'
            },
            sync    : {
                url     : 'php/save.php'
            }
        }
    });

The above {@link Sch.data.CrudManager} instance will load all the registered stores data from the server by a single _AJAX_ request.
And further changes made to those stores will be sent to the server by one bulk request as well (more details {@link Sch.data.CrudManager#method-sync here}).

### Implementing custom CRUD manager

Let's say that we want to implement own _CRUD manager_.
For example to have another encoding system (like _XML_ or any other format) or another transport system.
Then we have to implement own mixins supporting corresponding systems.

There are some requirements for content of mixins.
An encoding system mixin must have two methods:

- `encode` - encodes packages before they are sent to a server (from `Object` to a `String`)
- `decode` - decodes server responses (from `String` to an `Object`)

And a transport system mixin must have following methods:

- `sendRequest` - send request to a server
- `cancelRequest` - cancels request

So we extend abstract {@link Sch.crud.AbstractManager} class and mixin it with a custom encoder:

    Ext.define('MyEncoder', {
        encode : function (request) {
            ...
        },
        decode : function (response) {
            ...
        }
    });

    Ext.define('MyCrudManager', {
        extend          : 'Sch.crud.AbstractManager',
        // we gonna use AJAX for requests transporting and our own encoding MyEncoder class
        mixins          : ['MyEncoder', 'Sch.crud.transport.Ajax']
    });

### Data revisions

Server interaction protocol supports _server revision stamp_ (basically it's a number incrementing after every data change on the server).
Based on this value server may decline request holding likely outdated data.
It might be useful in case of highly concurrent system implementation since it allows to have additional control on data integrity and consistency.

Yet this capability is optional and might be easily turned off depending on user requirements.

## Server communication steps

All server communications can be divided into two types:

- data loading (normally initial state of data provided by server)
- changes persisting (incremental update sent from client to server)

See the following sections for detailed description.

## Data loading

Data loading can be started by {@link Sch.crud.AbstractManager#method-load load} call or invoked automatically upon _CRUD manager_ creation
if {@link Sch.crud.AbstractManager#autoLoad autoLoad} config is set to `true`.
A load request is performed asynchronously so user can specify a callback to be started on completion or listen to {@link Sch.crud.AbstractManager#event-load load} event.

Loading of acquired data occurs in the same order corresponding stores are registered in a _CRUD manager_.
Please take a look at {@link Sch.crud.AbstractManager#addStore addStore} method for more details on how to register stores in a particular order.

### Load request structure

Let's take a closer look at _load request_ structure. Load request object have the following view:

    {
        requestId   : 123890,
        type        : "load",
        stores      : [
            {
                storeId     : "store1",
                page        : 1,
                pageSize    : 2,
                someParam   : "abc"
            },
            "store2",
            "store3"
        ]
    }

Here is:

- `requestId` - unique request identifier shipped with any request
- `type` - request type ('load' - for load requests)

The `stores` section holds list of stores that must be loaded. As a bare minimum each store can be described by its identifier (as its done for `store2` and `store3`)
but normally they are presented with an object holding store identifier plus several parameters.
These parameters can be provided in the {@link Sch.crud.AbstractManager#method-load load} method.

    crudManager.load({
        // specify request params for store1
        store1 : {
            page        : 2,
            someParam   : 'abc'
        }
    });

#### Pagination support

Pagination support is provided with `page` and `pageSize` parameters for store loading.
They are taken from a corresponding store and ignored in cases they do not make sense (like for `Ext.data.TreeStore`).

**Note:** There is a special {@link Sch.widget.PagingToolbar} widget implementing paging toolbar.
It should be used instead of standard `Ext.toolbar.Paging` when dealing with a CRUD manager.

### Load response structure

And response for such packet will look like this:

    {
        requestId   : 123890,
        revision    : 123,
        success     : true,

        store1      : {
            rows : [
                { Id : 9000, SomeField : 'xxxx', ... },
                { Id : 123, SomeField : 'yyyy', ... }
            ],
            metaData : {
                someProp : 789,
                anotherProp : "foo"
            },
            total : 5
        },

        store2      : {
            rows : [
                { Id : 1, Field1 : 'aaa', ... },
                { Id : 2, Field1 : 'bbb', ... }
            ],
            total : 2
        },

        store3      : {
            rows : [
                { Id : 1, Field2 : 'aaa', ... },
                { Id : 2, Field2 : 'bbb', ... }
            ],
            total : 2
        }
    }

Here is:

- `requestId` - responded request identifier
- `revision` - _server revision stamp_ from client
- `success` - `true` for successful response, `false` if some server error occurred

Each store data is transfered under corresponding identifier. Each store data section has:

- `rows` - array of records
- `total` - total number of records (may not be equal to the number of records in `rows` array in case of pagination)
- `metaData` - an optional object containing meta data for the store. This object will be assigned to the store's `metaData` property after loading.

## Changes persisting

Changes persisting can be started by {@link Sch.crud.AbstractManager#method-sync sync} call or invoked automatically after any change
if {@link Sch.crud.AbstractManager#autoSync autoSync} config is set to `true`.
A sync request is performed asynchronously but user can specify a callback to be started on its completion or listen to {@link Sch.crud.AbstractManager#event-sync sync} event.

After request completion CRUD manager applies server-side changes returned in response to each individual store.

**Note: It's highly recommended to prevent stores data changing while sync request is processing.
The _CRUD manager_ tries to queue sync requests if user calls sync before prior request completion.
Though data changing in parallel with ongoing request still may lead to unwanted data overriding.
So please use GUI masking technique (like `loadMask` for grids) to prevent such cases.**

### Sync request structure

Here is an example of _sync request_ object:

    {
        requestId   : 123890,
        type        : 'sync',
        revision    : 123,

        store1      : {
            added : [
                { $PhantomId : 'q1w2e3r4t5', SomeField : 'smth', ... },
                ...
            ],
            updated : [
                { Id : 123, SomeField : 'new value' },
                ...
            ],
            removed : [
                { Id : 345 },
                ...
            ]
        },

        store2      : {
            added : [...],
            updated :  [...],
            removed :  [...]
        }
    }

Here is:

- `requestId` - unique request identifier shipped with any request
- `type` - request type ('sync' - for sync requests)
- `revision` - _server revision stamp_ from client

For each store request has three sections `added`, `updated` and `removed` under which we transfer corresponding records.
The presence of each section is optional depending on having corresponding type of changes.

Each added record comes with its phantom identifier ({@link Sch.crud.AbstractManager#phantomIdField by default} `$PhantomId` field name is used for it).
And each updated record includes its identifier plus updated field values only.
And finally for removed records only their identifiers are transfered.

### Sync response structure

Example of _sync response_ object:

    {
        requestId   : 123890,
        success     : true,
        revision    : 124,
        store1      : {
            rows : [
                // processed phantom record initially sent from client
                { $PhantomId : 'q1w2e3r4t5', Id : 9000 },
                // processed updated record initially sent from client
                { Id : 123, SomeField2 : '2013-08-01' },
                // record added/updated by server logic (not sent from client)
                { Id : 124, SomeField : 'server generated', SomeField2 : '2013-08-01' }
                ...
            ],
            removed : [
                // processed removed record initially sent from client
                { Id : 345 },
                // record removed by server logic (not sent from client)
                { Id : 145 },
                ...
            ]
        },

        store2      : {
            rows : [...],
            removed : [...]
        }
    }

Here is:

- `requestId` - responded request identifier
- `success` - `true` for successful response, `false` if some server error occurred
- `revision` - new _server revision stamp_ from server

For each store we have two sections `rows` and `removed` where:

- `rows` holds all records added or updated _by server_.
As a bare minimum, for phantom records sent from client, server returns a combination of phantom Id and real Id (Id assigned by server).
If server decides to update some record (either phantom or persisted one) or create a new one
it should return an object holding a combination of real Id and those field values.
The field values will be applied to the corresponding store record on the client (or new record will be created).
- `removed` holds Ids of records removed _by server_ whether initially sent from client or removed due to some server logic.

## Error handling

In case of server-side error response object will have a following look:

    {
        requestId : 123890,
        success   : false,
        message   : 'Error description goes here',
        code      : 13
    }

Here is:

- `requestId` - responded request identifier
- `success` - `false` says that server error occurred
- `message` - error text message
- `code` - optionally may contain the occurred error code

The {@link Sch.crud.AbstractManager#method-load load} and {@link Sch.crud.AbstractManager#method-sync sync} methods has `errback` argument where
user can specify a function to be called if error faced.

    var crudManager = Ext.create('Sch.data.CrudManager', {
        resourceStore   : resourceStore,
        eventStore      : eventStore,
        transport       : {
            load : {
                url : 'php/read.php'
            },
            sync : {
                url : 'php/save.php'
            }
        }
    });

    crudManager.load(null, function (response, rawResponse) {
        // let's show message box with error text
        Ext.Msg.show({
            title    : 'Error',
            msg      : response && response.message || 'Unknown error occurred',
            icon     : Ext.Msg.ERROR,
            buttons  : Ext.Msg.OK,
            minWidth : Ext.Msg.minWidth
        });
    });

Another option allowing to centralize handling of errors is {@link Sch.crud.AbstractManager#loadfail loadfail} and {@link Sch.crud.AbstractManager#syncfail syncfail} events
listening:

    // some central method to handle CRUD errors
    var processError = function (crud, response) {
        // error code
        var code = response && response.code;

        // here we can define some specific reaction on a particular error
        if (code == 13) {
            // for example re-load crudManager
            crudManager.load();

        // and for all other case we just display an error message box
        } else {
            Ext.Msg.show({
                title    : 'Error',
                msg      : response && response.message || 'Unknown error occurred',
                icon     : Ext.Msg.ERROR,
                buttons  : Ext.Msg.OK,
                minWidth : Ext.Msg.minWidth
            });
        }
    };

    var crudManager     = Ext.create('Sch.data.CrudManager', {
        autoLoad        : true,
        resourceStore   : resourceStore,
        eventStore      : eventStore,
        transport       : {
            load : {
                url : 'php/read.php'
            },
            sync : {
                url : 'php/save.php'
            }
        },
        listeners       : {
            // listen to load request errors
            loadfail : processError,
            // listen to sync request errors
            syncfail : processError
        }
    });

