import Container from '../../../Core/widget/Container.js';
import Toast from '../../../Core/widget/Toast.js';
import EventLoader from './mixin/EventLoader.js';
import ReadyStatePropagator from './mixin/ReadyStatePropagator.js';
import { TimeUnit, DependencyType } from '../../../Engine/scheduling/Types.js';
import '../DependencyTypePicker.js';
import '../../column/DurationColumn.js';
import '../ModelCombo.js';
import TaskEditorTab from './mixin/TaskEditorTab.js';
import '../../../Grid/view/Grid.js';

/**
 * @module SchedulerPro/widget/taskeditor/DependencyTab
 */

const
    markDependencyValid     = (dep, grid) => {
        dep.instanceMeta(grid).valid = true;
    },
    markDependencyInvalid   = (dep, grid) => {
        dep.instanceMeta(grid).valid = false;
    },
    isDependencyMarkedValid = (dep, grid) => dep.instanceMeta(grid).valid !== false;

/**
 * Abstract base class for SuccessorsTab and PredecessorsTab.
 *
 * @internal
 * @extends Core/widget/Container
 * @mixes SchedulerPro/widget/taskeditor/mixin/EventLoader
 * @mixes SchedulerPro/widget/taskeditor/mixin/TaskEditorTab
 * @mixes SchedulerPro/widget/taskeditor/mixin/EventLoader
 * @abstract
 */
export default class DependencyTab extends ReadyStatePropagator(TaskEditorTab(EventLoader(Container))) {

    static get $name() {
        return 'DependencyTab';
    }

    static makeDefaultConfig(direction) {
        const
            // ref          = direction === 'fromEvent' ? 'predecessorstab' : 'successorstab',
            negDirection = direction === 'fromEvent' ? 'toEvent' : 'fromEvent';

        return {
            direction,

            negDirection,

            title : direction === 'fromEvent' ? 'L{Predecessors}' : 'L{Successors}',

            layoutStyle : {
                flexFlow : 'column nowrap'
            },

            namedItems : {
                grid : {
                    type      : 'grid',
                    flex      : '1 1 auto',
                    //ref       : `${ref}-grid`,
                    emptyText : '',
                    columns   : [
                        {
                            localeClass : this,
                            text        : 'L{ID}',
                            flex        : 1,
                            editor      : false,
                            htmlEncode  : false,
                            hidden      : true,
                            renderer({ record : dependency, row, grid }) {
                                let html;

                                if (isDependencyMarkedValid(dependency, grid)) {
                                    const event = dependency[direction];
                                    html = !event || event.hasGeneratedId ? '*' : event.id;
                                }
                                else {
                                    row.addCls('b-invalid');
                                    html = '<div class="b-icon b-icon-warning"></div>';
                                }

                                return html;
                            }
                        },
                        {
                            localeClass : this,
                            text        : 'L{Name}',
                            field       : direction,
                            flex        : 5,
                            renderer({ value : event }) {
                                return event && event.name + (event.hasGeneratedId ? '' : ` (${event.id})`);
                            },
                            editor : {
                                type         : 'modelcombo',
                                listItemTpl  : item => `${item.name} (${item.id})`,
                                displayField : 'name',
                                valueField   : 'id',
                                editable     : false,
                                allowInvalid : true
                            }
                        },
                        {
                            localeClass : this,
                            text        : 'L{Type}',
                            field       : 'type',
                            flex        : 3,
                            editor      : 'dependencytypepicker',
                            renderer({ value }) {
                                return this.L('L{DependencyType.long}')[value];
                            }
                        },
                        {
                            localeClass : this,
                            text        : 'L{Lag}',
                            type        : 'duration',
                            field       : 'fullLag',
                            flex        : 2,
                            editor      : {
                                allowNegative : true
                            }
                        }
                    ],

                    disableGridRowModelWarning : true
                },
                toolbar : {
                    type       : 'toolbar',
                    flex       : '0 0 auto',
                    cls        : 'b-compact-bbar',
                    namedItems : {
                        add : {
                            type : 'button',
                            cls  : 'b-add-button b-green',
                            icon : 'b-icon b-icon-add'
                        },
                        remove : {
                            type     : 'button',
                            cls      : 'b-remove-button b-red',
                            icon     : 'b-icon b-icon-trash',
                            disabled : true
                        }
                    },
                    items : {
                        add    : true,
                        remove : true
                    }
                }
            },

            items : {
                grid    : true,
                toolbar : true
            }
        };
    }

    afterConstruct() {
        super.afterConstruct();

        const
            me           = this,
            addButton    = me.addButton = me.widgetMap.add,
            removeButton = me.removeButton = me.widgetMap.remove,
            grid         = me.grid = me.widgetMap.grid;

        addButton && addButton.on('click', me.onAddClick, me);
        removeButton && removeButton.on('click', me.onRemoveClick, me);

        grid.on({
            selectionChange : 'onGridSelectionChange',
            startCellEdit   : 'onGridStartCellEdit',
            finishCellEdit  : 'onGridFinishCellEdit',
            cancelCellEdit  : 'onGridCancelCellEdit',
            thisObj         : me
        });
    }

    get taskCombo() {
        const
            { grid } = this,
            from = grid && grid.columns.get(this.direction);

        return from && from.editor;
    }

    loadEvent(eventRecord) {
        const
            me           = this,
            { grid }     = me,
            firstLoad    = !grid.store.isChained,
            recordChange = !firstLoad && (eventRecord !== me.record);

        //<debug>
        console.assert(
            firstLoad || grid.store.masterStore.project === eventRecord.project,
            'Loading of a record from another project is not currently supported!'
        );
        //</debug>

        super.loadEvent(eventRecord);

        const
            taskCombo  = me.taskCombo,
            { dependencyStore, eventStore } = me.project;

        // On first load, populate the chained stores.
        // Our grid store will contain only the direction of dependencies
        // this tab is interested in.
        // Our taskCombo only contains all events other than our event.
        // An event can't depend upon itself.
        if (firstLoad) {
            // Cache the mutation generation of the underlying data collection
            // so that we know when we need to refill the chained stores.
            me.depStoreGeneration = dependencyStore.storage.generation;
            me.eventStoreGeneration = eventStore.storage.generation;

            grid.store = dependencyStore.makeChained(
                d => d[me.negDirection] === me.record,
                null
            );

            taskCombo.store = eventStore.makeChained(
                // Remove original record from chained store, but keep those records that are already selected in the dependency grid
                e => e !== me.record,
                null,
                {
                    doRelayToMaster         : [],
                    // Need to show all records in the combo
                    excludeCollapsedRecords : false
                }
            );

            // Post process chained store and exclude records that are already selected in the dependency grid.
            // It's needed to be a separate filtering because otherwise when cell editor opens combo and sets initial value,
            // it cannot find it in the storage and adds new record.
            taskCombo.store.filterBy(e => !grid.store.find(d => d[me.direction] === e));

            taskCombo.on({
                thisObj : me,
                change  : 'onGridCellEditChange'
            });
        }
        else {
            // Only repopulate the chained stores if the master stores have changed
            // or if this is being loaded with a different record.
            if (recordChange || dependencyStore.storage.generation !== me.depStoreGeneration) {
                grid.store.fillFromMaster();
                me.depStoreGeneration = dependencyStore.storage.generation;
            }
            if (recordChange || eventStore.storage.generation !== me.eventStoreGeneration) {
                taskCombo.store.fillFromMaster();
                me.eventStoreGeneration = eventStore.storage.generation;
            }
        }

        me.requestReadyStateChange();
    }

    async insertNewDependency() {
        const
            me              = this,
            { grid }        = me,
            depStore        = grid.store,
            projectDepStore = me.project.dependencyStore;

        // This call will be relayed to project dependency store.
        const [newDep] = depStore.insert(0, {
            type              : DependencyType.EndToStart,
            lag               : 0,
            lagUnit           : TimeUnit.Day,
            [me.negDirection] : me.record
        });

        // Reset the dependency store mutation monitor when we add a dependency
        me.depStoreGeneration = projectDepStore.storage.generation;

        grid.features.cellEdit.startEditing({ field : me.direction, id : newDep.id });

        markDependencyInvalid(newDep, grid);

        return newDep;
    }

    onAddClick() {
        this.insertNewDependency();
    }

    onRemoveClick() {
        const
            me       = this,
            toRemove = me.grid.selectedRecords;

        me.project.dependencyStore.remove(toRemove);
        me.grid.selectedRecords = null;
        me.taskCombo.store.fillFromMaster();
        me.removeButton.disable();
    }

    onGridSelectionChange({ selection }) {
        if (selection && selection.length && !this.up(w => w.readOnly)) {
            this.removeButton.enable();
        }
        else {
            this.removeButton.disable();
        }
    }

    clearActiveEditorErrors() {
        const
            me             = this,
            activeCellEdit = me._activeCellEdit;

        if (activeCellEdit && activeCellEdit.column.field === me.direction) {
            activeCellEdit.editor.inputField.clearError();  // clears all errors
        }
    }

    onGridCellEditChange() {
        // Since we deposit some errors on the editor during startEdit (see onGridStartCellEdit), we must also clear
        // them eventually or the editor will refuse to accept any value. Since validation will still take place, we
        // don't need to worry about preventing the editor from dismissing nor could we realistically since validation
        // is async (see onGridFinishCellEdit).
        this.clearActiveEditorErrors();
    }

    onGridStartCellEdit({ editorContext }) {
        const
            me       = this,
            dep      = me._editingDependency = editorContext.record,
            { grid } = me,
            dir      = me.direction;

        me._activeCellEdit = editorContext;

        if (editorContext.column.field === dir) {
            if (!isDependencyMarkedValid(dep, grid)) {
                if (!dep[dir]) {
                    editorContext.editor.inputField.setError(me.L('L{Invalid dependency}'));
                }
                else {
                    editorContext.editor.inputField.setError(me.L('L{Cyclic dependency has been detected}'));
                }
            }
            else {
                me.clearActiveEditorErrors();
            }

            //dep.shadow();
        }
    }

    async onGridFinishCellEdit({ editorContext }) {
        const
            me                              = this,
            { record : dependency, column } = editorContext,
            { grid, direction }             = me;

        // Other dependency end
        if (column.field === direction) {
            if (dependency[direction]) {
                const valid = await me.project.isValidExistingDependency(dependency);

                if (valid) {
                    markDependencyValid(dependency, me.grid);

                    //dependency.unshadow();

                    me.taskCombo.store.fillFromMaster();

                    //me.redrawDependencyRow(dependency); // Might not be needed

                    me.requestReadyStateChange();
                }
                else {
                    markDependencyInvalid(dependency, grid);
                    me.redrawDependencyRow(dependency);

                    Toast.show({
                            html : me.L('L{Cyclic dependency has been detected}')
                    });

                    me.requestReadyStateChange();
                }
            }
            else {
                markDependencyInvalid(dependency, grid);
                me.redrawDependencyRow(dependency);
                me.requestReadyStateChange();
            }
        }
        // Type and Lag
        else {
            me.redrawDependencyRow(dependency);

            me.requestReadyStateChange();
        }

        me._activeCellEdit = me._editingDependency = null;
    }

    onGridCancelCellEdit(data) {
        const me = this;

        if (me._editingDependency) {
            const
                dep      = me._editingDependency,
                { grid } = me;

            if (!dep[me.direction]) {
                markDependencyInvalid(dep, grid);
                me.redrawDependencyRow(dep);
            }
            // else if (isDependencyMarkedValid(dep, grid)) {
            //     //dep.unshadow();
            // }

            me._activeCellEdit = me._editingDependency = null;
        }

        me.requestReadyStateChange();
    }

    redrawDependencyRow(dep) {
        // TODO: Redraw dependency directly instead of row
        const
            { grid } = this,
            row      = grid.rowManager.getRowById(dep);
        // Might be out of view
        row && row.render(grid.store.indexOf(dep), dep);
    }

    get canSave() {
        const { grid } = this;

        return grid.store.reduce((r, d) => r && isDependencyMarkedValid(d, grid), true);
    }
}
