<template>
    <div class="schedule-main">
        <scheduler ref="tasks" :config="tasksConfig" />
    </div>
</template>

<script>
// our stuff
import tasksConfig from '@/components/resourcesHistogram/schedulerConfig.js';
// libraries
import Scheduler from "@/components/resourcesHistogram/Scheduler.vue";
import { SchedulerResourceModel } from 'major-schedulerpro';

// This CSS must be imported here because it is in package
import 'major-schedulerpro/schedulerpro.stockholm.css';

// The data for this demo (data/data.json) uses the 'clients' property to hold children of resources
SchedulerResourceModel.childrenField = 'clients';
export default {
    components: { Scheduler },
    data() {
        return {
            tasksConfig
        };
    },
    computed: {},
    watch: {},
    methods: {

    },
    created() {

    },
    mounted() {

    },
}
</script>
<style lang='scss' scoped>
.schedule-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
}
</style>