<template>

    <div class="gantt-main">
        <bryntum-gantt ref="gantt" :project="ganttConfig.project" :columns="ganttConfig.columns" :subGridConfigs="ganttConfig.subGridConfigs" :viewPreset="ganttConfig.viewPreset" :rowHeight="ganttConfig.rowHeight" :barMargin="ganttConfig.barMargin" :columnLines="ganttConfig.columnLines" :rollupsFeature="ganttConfig.features.rollups" />
    </div>
</template>

<script>

// gantt and its config
import BryntumGantt from '@/components/gantt/BryntumGantt.vue';
import ganttConfig from '@/components/gantt/ganttConfig.js';

// we need to import it here because it comes from the package
import 'major-gantt/gantt.stockholm.css';

export default {
    name: 'demoBrynGantt',

    // local components
    components: {
        BryntumGantt
    },

    created() {
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

<style lang="scss" scoped>
.gantt-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    /deep/ .b-grid-header {
        background-color: #ffffff;
    }
}
</style>
