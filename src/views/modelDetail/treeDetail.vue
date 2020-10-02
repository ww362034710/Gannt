<template>
  <div>
    <h3 class="con-title">模型详情</h3>
    <ul class="model-detail-content" v-if="item.name">
      <li>
        <span>名称：</span>
        <p>{{item.name}}</p>
      </li>
      <li>
        <span>描述：</span>
        <p>{{item.description}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "treeDetail",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style scoped>
</style>