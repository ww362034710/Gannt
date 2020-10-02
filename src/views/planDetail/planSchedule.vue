
<template>
    <div id="container">
        <scheduler
            ref               = "scheduler"
            :columns          = "schedulerConfig.columns"
            :resources        = "schedulerConfig.resources"
            :events           = "schedulerConfig.events"
            :minHeight        = "schedulerConfig.minHeight"
            :startDate        = "schedulerConfig.startDate"
            :endDate          = "schedulerConfig.endDate"
            :viewPreset       = "schedulerConfig.viewPreset"
            :rowHeight        = "schedulerConfig.rowHeight"
            :barMargin        = "schedulerConfig.barMargin"
            :multiEventSelect = "schedulerConfig.multiEventSelect"
            :mode             = "schedulerConfig.mode"
        ></scheduler>
    </div>
</template>

<script>
    import 'bryntum-schedulerpro/schedulerpro.stockholm.css';
    import Scheduler from 'schedule-vue-shared/src/Scheduler.vue';
    import schedulerConfig from './schedulerConfig.js';
    export default {
        name: 'planSchedule',

        components: {
            Scheduler
        }, 

        data() {
            return {
                schedulerConfig
            } 
        },

        mounted() {
           
        }

    } 

</script>

<style lang="scss">
#container {
    display        : flex;
    flex           : 1 1 auto;
    flex-direction : column;
    height         : 100%;
};
.b-schedulerpro-container {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
}
</style>