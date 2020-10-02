
<template>
    <div id="container">
        <app-header :title="title" />
        <div id="content">
            <app-gantt ref="gantt"></app-gantt>
            <!-- <app-splitter type="splitter" container="content" /> -->
            <!-- <app-panel ref="panel"></app-panel> -->
        </div>
    </div>
</template>

<script>
    import 'bryntum-gantt/gantt.stockholm.css';
    import AppHeader from './com/Header.vue';
    import AppGantt from './com/Gantt.vue';
    import AppSplitter from 'bryntum-vue-shared/src/BryntumWidget.vue';
    import AppPanel from './com/Panel.vue';

    export default {
        name: 'newGannt',

        components: {
            AppHeader,
            AppGantt,
            AppSplitter,
            AppPanel
        }, // eo components

        data() {
            return {
                title : document.title
            } // eo return from data
        }, // eo data

        mounted() {
            const
                gantt = this.$refs.gantt.ganttInstance;
                //grid = this.$refs.panel.widget.widgetMap.grid

            //grid.store = gantt.features.timeRanges.store;
        }

    } // eo export default App

</script>

<style lang="scss">
   #container {
    display        : flex;
    flex           : 1 1 auto;
    flex-direction : column;
    height         : 100%;
};

.app-header button.show-headers {
    margin-right : 0.5em;
}

#content {
    display : flex;
    flex : 1 1 auto;
    flex-direction : row;
}

.b-grid-header {
    height: 57px;
}
.b-gantt-task-isparent.b-gantt-task{
    background: #83b5fe !important;
    border-color: #83b5fe !important;
}
.b-gantt-task-isparent.b-gantt-task:hover{
    background: #015be2 !important;
}
</style>

<!-- eof -->
