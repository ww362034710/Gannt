<template>
  <div class="monitor-table">
    <div class="btns">
      <a-button type="primary" @click="_getInit">监视器</a-button>
      <a-button type="primary">修正冲突</a-button>
    </div>
    <!--  table -->
    <a-table
      :scroll="{ y: tableY }"
      bordered
      :loading="loading"
      :pagination="pagination"
      :data-source="tableData"
      :columns="columns"
    ></a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "观察者",
    dataIndex: "advisor",
  },
  {
    title: "违反项",
    dataIndex: "violations",
  },
  {
    title: "时间",
    dataIndex: "time",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "参与者",
    dataIndex: "participants",
  },
  {
    title: "组",
    dataIndex: "group",
  },
  {
    title: "可修正",
    dataIndex: "fixable",
  },
];
export default {
  name: "monitorTable",
  data() {
    return {
      columns,
      tableData: [],
      pagination: {
        // 分页
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total) => {
          return "共：" + total + "条记录 ";
        },
        total: 0,
      },
      loading: false,
    };
  },
  props: {
    tableY: {
      type: Number,
      default: 240,
    },
  },

  mounted() {
    this._getInit();
  },
  methods: {
    async _getInit() {
      this.loading = true;
      let res = await this.$http.postBody(
        "/bs/ns/plan/activity/constraintCheck/" + this.$route.query.id
      );
      if (res.code) return false;
      this.tableData = res.data;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.monitor-table {
  .btns {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
  }
}
</style>