<!--主页面的页签组件-->
<template>
    <div class='tags-main'>
        <a-tabs tabPosition="top" type="editable-card" hideAdd :activeKey='activeKeys' @change="changeTabs" @edit="tabClose">
            <a-tab-pane v-for="item in data" :tab="item.title" :key="item.id" :closable="item.closable">
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>

export default {
    components: {},
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        activeKey: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        };
    },
    computed: {
        activeKeys() {
            return this.activeKey
        }
    },
    watch: {},
    methods: {
        /** 
         * tags 切换事件
        */
        changeTabs(key) {
            console.log('change', key, this.activeKeys)
            this.$emit('change', this.getTagsData(key))
        },
        //关闭
        tabClose(key) {
            console.log('close', key, this.activeKeys)
            this.$emit('tabClose', this.getTagsData(key))
        },
        getTagsData(key) {
            return this.data.find(v => {
                return v.id === key
            })
        }
    },
    created() {

    },
    mounted() {
        console.log(this.activeKey)
    },

}
</script>
<style lang='scss' scoped>
.tags-main {
    width: 100%;
    height: 100%;
}
</style>