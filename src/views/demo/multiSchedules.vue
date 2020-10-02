
<template>
    <div id="container">
       
    </div>
</template>

<script>
    import 'bryntum-schedulerpro/schedulerpro.stockholm.css';
    import { LocaleManager } from 'bryntum-schedulerpro';
    import Splitter from 'gantt-schedule/Core/widget/Splitter.js';
    import 'gantt-schedule/Grid/feature/Stripe.js';

    import Scheduler from 'gantt-schedule/Scheduler/view/Scheduler.js';
    import 'gantt-schedule/Scheduler/column/ResourceInfoColumn.js';
    import 'gantt-schedule/Scheduler/feature/EventDragSelect.js';

    import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
    export default {
        name: 'multiSchedules',

        components: {
            
        }, 

        data() {
            return {
                schedulerInstance: null
            } 
        },
        computed : {
            schedulerEngine() {
                console.warn('schedulerEngine is deprecated. Use schedulerInstance instead.')
                return this.schedulerInstance;
            }
        },
        mounted() {
           //load scheduler instance
           const resources = [
                    { id : 1, name : 'Arcady', role : 'Core developer', eventColor : 'purple' },
                    { id : 2, name : 'Dave', role : 'Tech Sales', eventColor : 'indigo' },
                    { id : 3, name : 'Henrik', role : 'Sales', eventColor : 'blue' },
                    { id : 4, name : 'Linda', role : 'Core developer', eventColor : 'cyan' },
                    { id : 5, name : 'Maxim', role : 'Developer & UX', eventColor : 'green' },
                    { id : 6, name : 'Mike', role : 'CEO', eventColor : 'lime' },
                    { id : 7, name : 'Lee', role : 'CTO', eventColor : 'orange' }
                ],
                events    = [
                    {
                        id         : 1,
                        resourceId : 1,
                        name       : 'First Task',
                        startDate  : new Date(2018, 0, 1, 10),
                        endDate    : new Date(2018, 0, 1, 12)
                    },
                    {
                        id         : 2,
                        resourceId : 2,
                        name       : 'Second Task',
                        startDate  : new Date(2018, 0, 1, 12),
                        endDate    : new Date(2018, 0, 1, 13)
                    },
                    {
                        id         : 3,
                        resourceId : 3,
                        name       : 'Third Task',
                        startDate  : new Date(2018, 0, 1, 14),
                        endDate    : new Date(2018, 0, 1, 16)
                    },
                    {
                        id         : 4,
                        resourceId : 4,
                        name       : 'Fourth Task',
                        startDate  : new Date(2018, 0, 1, 8),
                        endDate    : new Date(2018, 0, 1, 11)
                    },
                    {
                        id         : 5,
                        resourceId : 5,
                        name       : 'Fifth Task',
                        startDate  : new Date(2018, 0, 1, 15),
                        endDate    : new Date(2018, 0, 1, 17)
                    },
                    {
                        id         : 6,
                        resourceId : 6,
                        name       : 'Sixth Task',
                        startDate  : new Date(2018, 0, 1, 16),
                        endDate    : new Date(2018, 0, 1, 18)
                    }
                ];

            //endregion

            const scheduler1 = new Scheduler({
                ref       : 'top-scheduler',
                appendTo  : 'container',
                minHeight : '20em',
                flex      : '1 1 50%',

                features : {
                    stripe : true,
                    sort   : 'name'
                },

                columns : [
                    {
                        type      : 'resourceInfo',
                        imagePath : 'images/users/',
                        text      : 'Staff',
                        width     : '10em'
                    }
                ],

                resources : resources,

                events : events,

                startDate  : new Date(2018, 0, 1, 6),
                endDate    : new Date(2018, 0, 1, 20),
                viewPreset : 'minuteAndHour'
            });

            new Scheduler({
                ref         : 'bottom-scheduler',
                cls         : 'bottom-scheduler',
                appendTo    : 'container',
                minHeight   : '20em',
                flex        : '1 1 50%',
                partner     : scheduler1,
                hideHeaders : true,
                features    : {
                    stripe : true,
                    sort   : 'name'
                },

                columns : [
                    {
                        type      : 'resourceInfo',
                        imagePath : 'images/users/',
                        text      : 'Staff',
                        width     : '10em'
                    }
                ],

                resourceStore : scheduler1.resourceStore,
                eventStore    : scheduler1.eventStore
            });
        },
        beforeDestroy() {
            if(this.schedulerInstance) this.schedulerInstance.destroy();
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