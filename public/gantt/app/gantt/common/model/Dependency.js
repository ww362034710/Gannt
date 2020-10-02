Ext.define('Common.model.Dependency', {
    extend: 'Gnt.model.Dependency',
    idProperty: "id",
    fromField: "fromId",
    toField: "toId",
    typeField: "type",
    clsField: "cls",
    bidirectionalField: "bidirectional",
    highlightedField: "highlighted",
    lagField: "lag",
    lagUnitField: "lagUnit"
})