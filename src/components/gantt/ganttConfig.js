/**
 *- Gantt configuration
 */
import { ProjectModel } from 'major-gantt';

const project = new ProjectModel({
    autoLoad: true,
    transport: {
        load: {
            url: 'data/ganttTasks.json'
        }
    }
});

const ganttConfig = {

    project: project,

    columns: [
        { type: 'wbs' },
        { type: 'name' }
    ],

    subGridConfigs: {
        locked: {
            flex: 1
        },
        normal: {
            flex: 2
        }
    },

    viewPreset: 'dayAndWeek',

    // Allow extra space for rollups
    rowHeight: 50,
    barMargin: 7,

    columnLines: true,

    features: {
        rollups: true
    }
};


export default ganttConfig;

// eof