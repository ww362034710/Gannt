<!--

  规划事件详情页面
-->
<template>
    <div class="page-main page-demand-detail">
        <decomposition :scheme-id="schemeId" scheme-type="event" edit-mode="view"/>
    </div>
</template>

<script>
    import Decomposition from "../../components/common/DecomposeScheme";

    export default {
        name: "eventDetail",
        components: {
            Decomposition
        },
        data() {
            return {
                schemeId: null,   // 当前方案的id
                scheme: {},       // 当前方案
                eventId: null,     // 当前目标的id
                event: {},         // 当前目标
            };
        },
        watch: {
            schemeId() {
                this.loadScheme();
            },
            eventId() {
                this.loadEvent();
            }
        },
        computed: {
            flowStyle() {
                return {
                    height: document.documentElement.clientHeight - 160 + "px"
                }
            }
        },
        created() {
            this.eventId = this.$route.params.eventId;
            if (this.schemeId) {
                // 当做分解方案的详情页面
                this.loadScheme();
            }
        },
        mounted() {
        },
        methods: {
            // 加载方案数据
            loadScheme() {
                this.$http.postForm("/bs/resolveScheme/show", {id: this.schemeId})
                        .then(data => {
                            this.scheme = data.data;
                        })
                        .catch((e) => {
                          console.error(e);
                        });
            },
            // 加载goal数据
            loadEvent() {
                if (this.eventId) {
                    this.$http.postForm("/bs/node/getByNodeId",{nodeId: this.eventId})
                            .then(data => {
                                console.log(data);
                              this.event = data.data;
                              this.schemeId = data.data.resolveSchemeId
                            })
                            .catch((e) => {
                              console.error(e);
                            });
                } else {
                    this.goal = null;
                }
            }
        }
    };
</script>

<style lang='scss' scoped>
    .gojs-main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
