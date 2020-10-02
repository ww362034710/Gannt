<template>
  <div>
    <h3 class="con-title">活动对资源的影响</h3>
    <influence :item="item" ref="influence" :dictId="$route.query.id" :forceShow="showme">
      <a-button type="primary" html-type="submit" @click="save" :loading="loading">保存</a-button>
    </influence>
  </div>
</template>

<script>
import influence from "../../components/effect/effectForm";
export default {
  name: "addInfluence",
  data() {
    return {
      showme: true,
      loading: false,
    };
  },
  components: {
    influence,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  methods: {
    async save(e) {
      let data = await this.$refs.influence.submit(e);
      if (data) {
        this._submit(data);
      }
    },
    // 提交数据
    async _submit(data) {
      this.loading = true;
      let api = "add";
      if (this.item.name) {
        api = "edit";
        data.id = this.item.key;
      } else {
        data.dictActivityId = this.item.key;
      }
      let res = await this.$http.postBody("/bs/dict/effect/" + api, data);
      if (res.code) return false;
      this.loading = false;
      this.$message.success("操作成功");
      this.$emit("update");
    },
    // 处理字符串
    _handleString(data) {
      Object.keys(data).forEach((key) => {
        if (data[key] == void 0) {
          data[key] = "";
        }
      });
      return data;
    },
  },
};
</script>

<style scoped>
</style>