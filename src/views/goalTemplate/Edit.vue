<template>
    <div class="page-main">
        <div class="page-main-container">
            <decompose-scheme-template :scheme-template-id="schemeTemplateId" :schemeTemplateType="schemeTemplateType" editMode="edit" />
        </div>
    </div>
</template>

<script>
import DecomposeSchemeTemplate from "../../components/common/DecomposeSchemeTemplate";
export default {
    name: 'goalTemplateEdit',
    components: { DecomposeSchemeTemplate },
    data() {
        return {
            schemeTemplateId: null, // 当前分解方案的id
            schemeTemplateType: "goal", // 当前分解方案的类型  goal/event,
            schemeTemplate: {},     // 当前分解方案 对象
            editMode: 'edit',       // 当前页面的编辑模式  'edit' 编辑     'view' 仅查看
            gojsStyle: {
                width: '100%',
            },
        };
    },
    computed: {},
    watch: {},
    methods: {},
    activated() {
        this.schemeTemplateId = this.$route.params.schemeTemplateId || "";
        this.schemeTemplateType = this.$route.params.schemeTemplateType || "goal";
        this.editMode = this.$route.params.editMode;
        if (this.schemeTemplateId) {
            this.$http.postForm("/bs/resolveSchemeTemplate/show", { id: this.schemeTemplateId }).then(rst => {
                this.schemeTemplate = rst.data;
            })
        }
    },
    created() { },
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
