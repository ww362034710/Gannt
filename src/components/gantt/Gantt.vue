
<template>
    <bryntum-gantt ref="gantt" :project="ganttConfig.project" :columns="ganttConfig.columns" :subGridConfigs="ganttConfig.subGridConfigs" :viewPreset="ganttConfig.viewPreset" :rowHeight="ganttConfig.rowHeight" :barMargin="ganttConfig.barMargin" :columnLines="ganttConfig.columnLines" :rollupsFeature="ganttConfig.features.rollups" />
</template>

<script>

// gantt and its config
import BryntumGantt from 'bryntum-vue-shared/src/BryntumGantt.vue';
import ganttConfig from './ganttConfig.js';

// we need to import it here because it comes from the package
import 'major-gantt/gantt.stockholm.css';

export default {
    name: 'appGantt',

    // local components
    components: {
        BryntumGantt
    },

    created() {
        //显示汇总
        // eventBus.$on('onShowRollups', this.handleShowRollups)
    },

    methods: {
        handleShowRollups({ checked }) {
            this.$refs.gantt.ganttEngine.features.rollups.disabled = !checked;
        }
    },

    // function that returns data
    data() {
        return {
            ganttConfig
        }
    } // eo function data
}
</script>

<!-- eof -->
