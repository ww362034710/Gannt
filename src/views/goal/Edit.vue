<!--目标(方案)的分解/编辑页面-->
<template>
    <div class="page-main">
        <div class="page-main-container">
            <decompose-scheme  :scheme-id="schemeId"  :schemeType="schemeType" editMode="edit"/>
        </div>
    </div>
</template>

<script>
    import DecomposeScheme from "../../components/common/DecomposeScheme";
    export default {
        name: 'goalEdit',
        components: { DecomposeScheme },
        data() {
            return {
                schemeId: null, // 当前分解方案的id
                schemeType: 'goal', // 当前分解方案的类型  goal/event,
                scheme: {},     // 当前分解方案 对象
                editMode: 'edit',       // 当前页面的编辑模式  'edit' 编辑     'view' 仅查看

                addForm: this.$form.createForm(this, { name: "addForm" }),
                addFormRule: {
                    name: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }, {
                            min: 2,
                            message: "最小长度2"
                        }]
                    },
                    id: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    ownerSysteme: {
                        rules: [{
                            required: true,
                            message: "必填"
                        }]
                    },
                    taskCabin: {},
                    runPhase: {},
                    responseOrgs: { initialValue: [] },
                    priority: {},
                    description: {},
                },
                ownerSystemeData: [{
                    name: "a",
                    value: 1
                }, {
                    name: "b",
                    value: 2
                }],
                taskCabinData: [{
                    name: "d",
                    value: 1
                }],
                runPhaseData: [{
                    name: "d",
                    value: 1
                }],
                responseOrgsData: [{
                    name: "d",
                    value: 1
                }, {
                    name: "d",
                    value: 2
                }],
                priorityData: [{
                    name: "d",
                    value: 1
                }],
                gojsStyle: {
                    width: '100%',
                },
                nodeAttrVisible: false,//节点属性抽屉
                targetNodeAttr: {//目标节点默认属性
                    color: "#ffffff",
                    border: "#000000",
                    tcolor: "#000000",
                    data: {
                        "name": "阶段目标",
                        "type": "1",
                        "info": "单独的",
                        "color": "#F7B84B",
                        "figure": "Ellipse"
                    }
                },
                eventNodeAttr: {//事件节点默认属性
                    color: "#f59a23",
                    border: "transparent",
                    tcolor: "#ffffff",
                    category: "Event",
                    data: {
                        "name": "阶段目标",
                        "type": "1",
                        "info": "单独的",
                        "color": "#F7B84B",
                        "figure": "Ellipse"
                    }
                }
            };
        },
        computed: {},
        watch: {
            nodeAttrVisible(value) {
                this.gojsStyle = {
                    width: value ? 'calc(100% - 600px)' : "100%"
                }
                this.$nextTick(() => {
                    this.$refs.gojs.zoomFit()
                })
            }
        },
        methods: {

        },
        activated(){
            this.schemeId = this.$route.params.schemeId;
            this.schemeType = this.$route.params.schemeType;
            this.editMode = this.$route.params.editMode;
            if(this.schemeId) {
                this.$http.postForm("/bs/resolveScheme/show", {id: this.schemeId}).then(rst=>{
                    this.scheme = rst.data;
                })
            }
        },
        created() {
        },
        mounted() {
        },
    }
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
