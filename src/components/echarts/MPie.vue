<template>
    <div class="charts" ref="myEchart"></div>
</template>

<script>
import echarts from "echarts";
export default {
    name: "pieCharts",
    props: {
        title: {
            type: String,
            default: "各系统事件统计"
        },
        data: {
            type: Array,
            default: () => {
                return [{
                    name: "工程信息中心",
                    value: 10
                }, {
                    name: "运行控制中心",
                    value: 10
                }, {
                    name: "AST支持中心",
                    value: 10
                }, {
                    name: "在轨HTQ支持中心",
                    value: 10
                }, {
                    name: "TSJSSY支持中心",
                    value: 10
                }]
            }
        },
    },
    data() {
        return {
            chart: null,
            scale: 1
        };
    },
    computed: {
        legend() {
            return this.data.map(v => v.name)
        }
    },
    mounted() {
        this.myChart = this.chart = echarts.init(this.$refs.myEchart);
        this.initChart();
        window.addEventListener('resize', () => {
            this.resetPeiResize()
        })
    },
    watch: {
        data: {
            handler() {
                this.initChart();
            },
            deep: true
        }
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        resetPeiResize() {
            this.chart.resize();
        },
        initChart() {
            // 把配置和数据放这里
            this.myChart.setOption({
                backgroundColor: "#ffffff",
                title: {
                    text: this.title,
                    textStyle: {
                        fontSize: 15,
                        color: '#000000',
                        lineHeight: 20
                    },
                    textAlign: 'auto',
                    top: 10,
                    left: 10
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    type: 'scroll',
                    right: 'center',
                    width: "100%",
                    bottom: 10,
                    itemGap: 10,
                    selectedMode: false,
                    icon: 'pin',
                    data: this.legend,
                    itemWidth: 15,
                    itemHeight: 8,
                    textStyle: {
                        color: '#77899c',
                    },
                    formatter(name) {
                        return `${name}`
                    }
                },
                color: ['#f2637b', '#3aa1ff', '#36cbcb', '#4ecb73', '#fbd437'],
                series: [{
                    type: 'pie',
                    radius: [0, "30%"],
                    center: ['45%', '50%'],
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{a|{b}：{d}%}\n{hr|}',
                        rich: {
                            hr: {
                                backgroundColor: 't',
                                borderRadius: 3,
                                width: 3,
                                height: 3,
                                padding: [3, 3, 0, -12]
                            },
                            a: {
                                padding: [10, -10, -22, 4]
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            length: 20,
                            length2: 20,
                            lineStyle: {
                                width: 1
                            }
                        }
                    },
                    itemStyle: {
                        borderWidth: 3,
                        borderColor: '#fff'
                    },
                    data: this.data
                }
                ]
            });
        }
    }
};
</script>

<style lang='scss' scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>
