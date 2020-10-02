<template>
    <div class='gantt-main page-main'>
        <iframe src="taskPlan.html" frameborder="0"></iframe>
    </div>
</template>

<script>

export default {
    name: "ganttIframe",
    components: {},
    data() {
        return {
            sceneId: null,
            url: "http://localhost/html/%E5%9C%BA%E6%99%AF%E8%A7%84%E5%88%92-%E6%9C%88%E4%BA%8B%E4%BB%B6%E4%BB%BB%E5%8A%A1%E8%A7%84%E5%88%92.html"
        };
    },
    computed: {},
    watch: {},
    methods: {

    },
    created() {
        this.sceneId = this.$route.params.sceneId;
        if (this.sceneId) {
            this.url += '?sceneId=' + this.sceneId;
        }
        console.log("url是：", this.url);
    },
    mounted() {

    }
}
</script>
<style lang='scss' scoped>
.gantt-main {
    overflow: auto;
    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
}
</style>