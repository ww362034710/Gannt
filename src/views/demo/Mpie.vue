<template>
    <div class='charts-main'>
        <div>
            <m-pie title="各系统事件统计" :data="chartData"></m-pie>
        </div>
        <div>
            <m-pie></m-pie>
        </div>
    </div>
</template>

<script>
import MPie from '@/components/echarts/MPie'
export default {
    components: { MPie },
    data() {
        return {
            chartData: [{
                name: "中期规划事件",
                value: 100
            }, {
                name: "月规划事件",
                value: 100
            }, {
                name: "飞行规划事件",
                value: 100
            }]
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
.charts-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    > div {
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
    }
}
</style>