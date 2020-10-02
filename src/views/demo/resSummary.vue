<template>
    <div id="container">

    </div>
</template>

<script>
    import 'bryntum-schedulerpro/schedulerpro.stockholm.css';
    import 'bryntum-gantt/gantt.stockholm.css';
    import 'gantt-schedule/Grid/column/NumberColumn.js';
    import Scheduler from 'gantt-schedule/Scheduler/view/Scheduler.js';
    import 'gantt-schedule/Scheduler/feature/Summary.js';
    import 'gantt-schedule/Scheduler/column/ResourceInfoColumn.js';

    import Cn from '@/components/resourcesHistogram/schedulerpro.locale.Cn.js'
    export default {
        name: 'resSummary',

        components: {

        },

        data() {
            return {
                schedulerInstance: null
            }
        },
        computed: {
            schedulerEngine() {
                console.warn('schedulerEngine is deprecated. Use schedulerInstance instead.')
                return this.schedulerInstance;
            }
        },
        mounted() {
            const maxValue = 10;

            new Scheduler({
                adopt: 'container',
                minHeight: '20em',
                viewPreset: 'hourAndDay',
                eventColor: 'blue',
                features: {
                    summary: {
                        renderer({
                            element,
                            events
                        }) {
                            const value = events.length / maxValue;
                            element.style.height = `${100 * value}%`;

                            if (value > 0.5) {
                                element.classList.add('b-summarybar-label-inside');
                            } else {
                                element.classList.remove('b-summarybar-label-inside');
                            }

                            return `<label>${events.length || ''}</label>`;
                        }
                    }
                },
                barMargin: 15,
                startDate: new Date(2017, 11, 1, 6),
                endDate: new Date(2017, 11, 3),

                columns: [{
                    type: 'resourceInfo',
                    imagePath: 'images/users/',
                    text: 'Name',
                    width: 170,
                    sum: 'count',
                    summaryRenderer: ({
                        sum
                    }) => `Total: ${sum}`
                }],

                crudManager: {
                    autoLoad: true,
                    transport: {
                        load: {
                            url: 'data/data1.json'
                        }
                    }
                }
            });
        },
        beforeDestroy() {
            if (this.schedulerInstance) this.schedulerInstance.destroy();
        }
    }
</script>

<style lang="scss">
    #container {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        height: 100%;
    }

    ;

    .b-schedulerpro-container {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
    }

    .b-gridbase .b-grid-footer-container {
        height: 60px;
    }

    .b-gridbase .b-grid-footer.b-sch-timeaxiscolumn {
        align-items: flex-end;
    }

    .b-gridbase .b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick {
        position: relative;
        overflow: visible;
        background: #FBC02D;
        align-items: center;
        transition: height 0.3s;
        padding: 0;
    }

    .b-gridbase .b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick:not(:last-child) {
        border-right: none;
    }

    .b-gridbase .b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick label {
        position: absolute;
        top: -15px;
        overflow: hidden;
        font-weight: bold;
        font-size: 0.85em;
    }

    .b-gridbase .b-grid-footer.b-sch-timeaxiscolumn .b-timeaxis-tick.b-summarybar-label-inside label {
        top: 3px;
    }
</style>