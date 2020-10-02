/**
 *- Configuration for the scheduler
 */
const resources = [
    { id : 'r1', name : 'Mike' },
    { id : 'r2', name : 'Linda' },
    { id : 'r3', name : 'Don' },
    { id : 'r4', name : 'Karen' },
    { id : 'r5', name : 'Doug' },
    { id : 'r6', name : 'Peter' },
    { id : 'r7', name : 'Sam' },
    { id : 'r8', name : 'Melissa' },
    { id : 'r9', name : 'John' },
    { id : 'r10', name : 'Ellen' }
],
events = [
    {
        resourceId : 'r1',
        startDate  : new Date(2017, 0, 1, 10),
        endDate    : new Date(2017, 0, 1, 12),
        name       : 'Click me'
    },
    {
        resourceId : 'r2',
        startDate  : new Date(2017, 0, 1, 12),
        endDate    : new Date(2017, 0, 1, 13, 30),
        name       : 'Drag me'
    },
    {
        resourceId : 'r3',
        startDate  : new Date(2017, 0, 1, 14),
        endDate    : new Date(2017, 0, 1, 16),
        name       : 'Double click me',
        eventColor : 'purple'
    },
    {
        resourceId : 'r4',
        startDate  : new Date(2017, 0, 1, 8),
        endDate    : new Date(2017, 0, 1, 11),
        name       : 'Right click me'
    },
    {
        resourceId : 'r5',
        startDate  : new Date(2017, 0, 1, 15),
        endDate    : new Date(2017, 0, 1, 17),
        name       : 'Resize me',
    },
    {
        resourceId : 'r6',
        startDate  : new Date(2017, 0, 1, 16),
        endDate    : new Date(2017, 0, 1, 19),
        name       : 'Important meeting',
        eventColor : 'red'
    },
    {
        resourceId : 'r6',
        startDate  : new Date(2017, 0, 1, 6),
        endDate    : new Date(2017, 0, 1, 8),
        name       : 'Sports event'
    },
    {
        resourceId : 'r7',
        startDate  : new Date(2017, 0, 1, 9),
        endDate    : new Date(2017, 0, 1, 11, 30),
        name       : 'Dad\'s birthday!',
        style      : 'background-color : teal; font-size: 18px'
    }
];

export default {
    minHeight        : '20em',
    resources        : resources,
    events           : events,
    startDate        : new Date(2017, 0, 1, 6),
    endDate          : new Date(2017, 0, 1, 20),
    viewPreset       : 'weekAndDay',
    rowHeight        : 50,
    barMargin        : 5,
    multiEventSelect : true,

    // mode : 'vertical',

    columns : [
        { field : 'name', width : 130,text:'属性',sortable:false ,enableCellContextMenu:false,enableHeaderContextMenu:false}
    ]

} // eo schedulerConfig

// eof
