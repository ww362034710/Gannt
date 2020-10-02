Ext.define("MyApp.DemoGanttPanel", {
    extend                  : "Gnt.panel.Gantt",
    alias                   : 'widget.demogantt',

    requires                : [
        'Gnt.plugin.TaskEditor',
        'Gnt.column.StartDate',
        'Gnt.column.EndDate',
        'Gnt.column.Duration',
        'Gnt.column.PercentDone',
        'Gnt.column.ResourceAssignment',
        'Gnt.column.ConstraintType',
        'Gnt.column.ConstraintDate',
        'Sch.plugin.TreeCellEditing',
        'Sch.plugin.Pan',
        'MyApp.TaskContextMenu',
        'MyApp.FilterField',
        'MyApp.SecondaryToolbar',
        'MyApp.Toolbar',
        'MyApp.TaskArea'
    ],

    highlightWeekends       : true,
    showTodayLine           : true,
    loadMask                : true,
    enableProgressBarResize : true,
    showRollupTasks         : true,
    eventBorderWidth        : 0,
    rowHeight               : 28,

    initComponent           : function () {

        Ext.apply(this, {
            // Define a custom HTML template for regular tasks
            taskBodyTemplate : '<div class="sch-gantt-progress-bar" style="width:{progressBarWidth}px;{progressBarStyle}" unselectable="on"><span class="sch-gantt-progress-bar-label">{[Math.round(values.percentDone)]}%<span></span></div>',

            // Define properties for the left 'locked' and scrollable tree grid
            lockedGridConfig : {
                width       : 400//,
//                collapsible : true
            },

            // Define properties for the left 'locked' and scrollable tree view
            lockedViewConfig : {
                // Adds a CSS class to each row element
                getRowClass : function (rec) {
                    return rec.isRoot() ? 'root-row' : '';
                },

                // Enable node reordering in the locked grid
                plugins     : {
                    ptype           : 'treeviewdragdrop',
                    containerScroll : true
                }
            },

            // Define properties for the schedule section
            schedulerConfig  : {
                // collapsible : true
            },

            // Define what should be shown in the left label field, along with the type of editor
            leftLabelField : {
                dataIndex : 'Name',
                editor    : { xtype : 'textfield' }
            },

            // Add some extra functionality
            plugins        : [
                this.editingInterface = Ext.create('Sch.plugin.TreeCellEditing', { clicksToEdit : 2 }),
                Ext.create("MyApp.TaskArea"),
                Ext.create("MyApp.TaskContextMenu"),
                Ext.create("Sch.plugin.Pan"),
                Ext.create('Gnt.plugin.TaskEditor'),

                // Lazy style definition using 'ptype'
                {
                    ptype               : 'scheduler_lines',
                    innerTpl            : '<span class="line-text">{Text}</span>',
                    showHeaderElements  : true,
                    store               : new Ext.data.JsonStore({
                        fields: [ 'Date', 'Text', 'Cls' ],
                        data : [
                            {
                                Date : new Date(2010, 0, 13),
                                Text : 'Project kickoff',
                                Cls  : 'kickoff' // A CSS class
                            }
                        ]
                    })
                }
            ],

            // Define an HTML template for the tooltip
            tooltipTpl     : new Ext.XTemplate(
                '<strong class="tipHeader">{Name}</strong>',
                '<table class="taskTip">',
                    '<tr><td>Start:</td> <td align="right">{[values._record.getDisplayStartDate("y-m-d")]}</td></tr>',
                    '<tr><td>End:</td> <td align="right">{[values._record.getDisplayEndDate("y-m-d")]}</td></tr>',
                    '<tr><td>Progress:</td><td align="right">{[ Math.round(values.PercentDone)]}%</td></tr>',
                '</table>'
            ),

            eventRenderer : function (task) {
                if (task.get('Color')) {
                    var style = Ext.String.format('background-color: #{0};border-color:#{0}', task.get('Color'));

                    return {
                        // Here you can add custom per-task styles
                        style : style
                    };
                }
            },

            // Define the static columns
            columns       : this.columns || [
                // Any regular Ext JS columns are ok
                {
                    xtype     : 'sequencecolumn',
                    width     : 40,

                    // This CSS class is added to each cell of this column
                    tdCls     : 'id'
                },
                {
                    xtype     : 'namecolumn',
                    width     : 200,
                    renderer  : function (v, meta, r) {
                        if (!r.data.leaf) meta.tdCls = 'sch-gantt-parent-cell';

                        return Ext.util.Format.htmlEncode(v);
                    },
                    items : new MyApp.FilterField({
                        store : this.taskStore
                    })
                },
                {
                    xtype : 'startdatecolumn'
                },
                {
                    //hidden : true,
                    xtype : 'enddatecolumn'
                },
                {
                    xtype : 'durationcolumn'
                },
                {
                    xtype : 'constrainttypecolumn'
                },
                {
                    xtype : 'constraintdatecolumn'
                },
                {
                    xtype : 'percentdonecolumn',
                    width : 60
                },
                {
                    xtype               : 'predecessorcolumn',
                    useSequenceNumber   : true
                },
                {
                    xtype : 'addnewcolumn'
                }
            ],

            // Define the buttons that are available for user interaction
            dockedItems          : [
                { xtype : 'primarytoolbar', gantt : this, listeners : {
                        togglesecondary : function(tbar) {
                            var secondary = this.down('secondarytoolbar');

                            secondary.animate({
                                to : { height : secondary.getHeight() < 10 ? tbar.getHeight() : 0 }
                            });
                        },
                        scope : this
                    }
                },
                { xtype : 'secondarytoolbar', gantt : this }
            ]
        });

        this.callParent(arguments);

    }
});
