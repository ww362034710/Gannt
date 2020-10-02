import Base from '../../../Common/Base.js';
import DomDataStore from '../../../Common/data/DomDataStore.js';
import DomHelper from '../../../Common/helper/DomHelper.js';

export default Target => class GridReactiveRendering extends (Target || Base) {

    cellBecameVisible({ cell, record, row }) {
        const
            cellElementData = DomDataStore.get(cell),
            column          = this.columns.getById(cellElementData.columnId);

        if (this.replica && column.reactiveRenderer) {
            const identifier = this.replica.observeContext(
                column.reactiveRenderer,
                {
                    record,
                    cell,
                    row,
                    column,
                    client : this
                },
                domConfigOrValue => {
                    if (Object(domConfigOrValue) === domConfigOrValue && !(domConfigOrValue instanceof Date)) {
                        DomHelper.sync({
                            targetElement : cell,
                            elementConfig : {
                                // We are not touching the existing cell element, only its contents
                                onlyChildren : true,
                                children     : [domConfigOrValue]
                            }
                        });
                    }
                    else if (domConfigOrValue != null) {
                        const str = String(domConfigOrValue);
                        // TODO: Break this out of Row#renderCell -> Row#populateCell (?)
                        cell[str.includes('<') ? 'innerHTML' : 'innerText'] = str;
                    }
                });

            this.identifierAdded = true;
            cell.reactiveIndentifier = identifier;

            return true;
        }

        return false;
    }

    cellBecameInvisible({ cell }) {
        if (this.replica && cell.reactiveIndentifier) {
            this.replica.removeIdentifier(cell.reactiveIndentifier);
        }
    }

    onRowManagerRenderDone() {
        if (this.replica && this.identifierAdded) {
            this.identifierAdded = false;
            this.replica.propagate();
        }
    }
};
