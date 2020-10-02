<template>
    <div id="app">
        <a-config-provider :locale="zh_CN">
            <router-view></router-view>
        </a-config-provider>
    </div>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
    data() {
        return {
            zh_CN
        };
    }
};
</script>
<style lang="scss">
#app {
    height: 100vh;
    width: 100vw;
    min-height: 400px;
    min-width: 1000px;
    background: #f3f3f4;
    overflow: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font: 14px/1.5 "Avenir", Helvetica, Arial, sans-serif;
}
</style>
