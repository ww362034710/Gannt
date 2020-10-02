/**
 *- Configuration for the scheduler
 */
import { Popup, Tooltip } from 'major-schedulerpro';
const colors = [
    'Cyan',
    'Blue',
    'Green',
    'Light-green',
    'Lime',
    'Orange',
    'Purple',
    'Red',
    'Teal'
]

// Tooltip for add client buttons (plain divs)
new Tooltip({
    forSelector: '.add',
    html: 'Add client',
    hideDelay: 100
});

export default {
    timeRangesFeature: true,
    startDate: new Date(2018, 4, 7),
    endDate: new Date(2018, 4, 26),
    barMargin: 7,
    rowHeight: 45,
    eventColor: null,
    eventStyle: null,
    cellEditFeature: false,
    eventDragFeature: {
        constrainDragToResource: false,
        showExactDropPosition: true
    },
    eventEditFeature: {
        typeField: 'type',
        extraItems: [{
            type: 'text',
            name: 'location',
            label: 'Location',
            index: 1,
            dataset: { eventType: 'client' }
        }, {
            type: 'combo',
            name: 'color',
            label: 'Color',
            items: colors.map(color => [color.toLowerCase(), color]),
            listItemTpl: data => `<div class="color-item ${data.value}"></div>${data.text}`,
            index: 1,
            dataset: { eventType: 'employee' }
        }]
    },
    features: {
        eventResize: {
            showExactResizePosition: true
        },
        nonWorkingTime: true,
        tree: true
    },
    viewPreset: {
        base: 'weekAndDay', //dayAndWeek weekAndDay
        // displayDateFormat: 'll',
        displayDateFormat: 'HH:mm',
        // "millisecond", "second", "minute", "hour", "day", "week", "month", "quarter", "year".
        headers: [ // Override headers
            {
                unit: "year",
                dateFormat: 'YYYY年'
            }, {
                unit: "quarter",
                renderer: (start, end, headerConfig, index) => {
                    let quarterNames = ['第一季度', '第二季度', '第三季度', '第四季度']
                    return `${quarterNames[Math.floor((start.getMonth() + 1) / 3)]}季度`
                }
            }, {
                unit: "month",
                // dateFormat: 'YYYY年MM月'
                renderer: () => {
                    let color = Math.floor(Math.random() * 0xffffff).toString(16)
                    return `<div style='height:110%;width:110%;background-color:#${color}'></div>`
                }
            }
        ]
    },

    // Resource grid column configuration
    columns: [{
        type: 'tree',
        text: 'Employees 标题',
        field: 'name',
        width: '15em',
        htmlEncode: false,
        // Hide default tree icons
        expandedFolderIconCls: null,
        collapsedFolderIconCls: null,
        leafIconCls: null,
        // Custom renderer display employee info or client color + name
        renderer({ record, value, size }) {
            // Parent rows are employees
            if (record.isParent) {
                // Make employee row higher
                size.height = 60;
                // Employee template
                return `
                        <div class = "info">
                        <div class = "name">${value}</div>
                        <div class = "title">${record.title}</div>
                        </div>
                        <div class = "add"><i class    = "b-fa b-fa-plus"></i></div>
                        <img class = "profile-img" src = "users/${record.name.toLowerCase()}.jpg" />
                    `;
            }
            // Other rows are clients
            else {
                // Client template
                return `<div class="client-color ${record.color}"></div>${value}`;
            }
        }
    }],

    crudManager: {
        autoLoad: true,
        transport: {
            load: {
                url: 'data/tasks.json'
            }
        },
        resourceStore: {
            fields: ['color', 'title'],
            tree: true
        },

        eventStore: {
            fields: ['color', 'location']
        }
    },

    eventRenderer({ tplData, resourceRecord, eventRecord }) {
        if (resourceRecord.isParent) {
            tplData.wrapperCls += ' employee ';
        }
        if (eventRecord.color) {
            tplData.wrapperCls += eventRecord.color;
        } else if (resourceRecord.color) {
            tplData.wrapperCls += ' ' + resourceRecord.color;
        }
        return eventRecord.name + (eventRecord.location ? `<span>, ${eventRecord.location}</span>` : '');
    }, // eo eventRenderer

    listeners: {
        dragCreateEnd({ newEventRecord, resourceRecord }) {
            // Make new event have correct type, to show correct fields in event editor
            newEventRecord.type = resourceRecord.isLeaf ? 'client' : 'employee';
        },
        cellDblClick({ record, cellElement, column }) {
            // Show a custom editor when dbl clicking a client cell
            if (column.field === 'name' && record.isLeaf) {
                new Popup({
                    autoShow: true,
                    autoClose: true,
                    closeAction: 'destroy',
                    scrollAction: 'realign',
                    forElement: cellElement,
                    anchor: true,
                    width: '20em',
                    cls: 'client-editor',
                    items: [{
                        type: 'text',
                        name: 'name',
                        label: 'Client',
                        labelWidth: '4em',
                        value: record.name,
                        onChange: ({ value }) => {
                            record.name = value;
                        }
                    }, {
                        type: 'combo',
                        cls: 'b-last-row',
                        name: 'color',
                        label: 'Color',
                        labelWidth: '4em',
                        items: colors.map(color => [color.toLowerCase(), color]),
                        listItemTpl: data => `<div class="color-item ${data.value}"></div>${data.text}`,
                        value: record.color,
                        onChange: ({ value }) => {
                            record.color = value;
                        }
                    }]
                });
            }
        },

        prio: 1
    }
} // eo schedulerConfig

// eof