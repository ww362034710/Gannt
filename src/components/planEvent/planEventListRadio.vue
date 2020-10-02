<template>
  <div class="interim-event">
    <h3>中期事件</h3>

    <a-table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="tblPagination"
      :row-selection="rowSelection"
      :scroll="{ y: tableY }"
      bordered
    ></a-table>
  </div>
</template>

<script>
export default {
  name: "selectEvent",
  data() {
    return {
      tableData: [],
      loading: false,
      pagination: {
        // 分页
        current: 1,
        pageSize: 10,
      },
      rowSelection: {
        type: "radio",
        onChange(item) {
          this.selectedRowKeys = item;
        },
        selectedRowKeys: []
      },

      columns: [
        {
          title: "名称",
          dataIndex: "name",
        },
      ],
    };
  },
  created() {
    if (this.$route.query.pid) {
      this._getInit();
    }
  },
  props: {
    tableY: {
      type: Number,
      default: 500,
    },
    planId: {
      type: String,
      required: true
    }
  },
  mounted() {},
  methods: {
    getSelectedRowKey() {
      let key = this.rowSelection.selectedRowKeys.length > 0 ? this.rowSelection.selectedRowKeys[0] : null;
      return key;
    },
    async _getInit() {
      let data = {
        planId: this.planId,
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current,
      };
      let res = await this.$http.postBody("/bs/ns/plan/activity/page", data);
      if (res.code) return false;
      this.tableData = res.rows;
      this.pagination.total = res.total;
    },
    tblPagination(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this._getInit();
    },
  },
};
</script>

<style lang="scss">
.interim-event {
  .ant-table-pagination {
    margin-right: 10px;
  }
}
.interim-event h3{
  font-size: 20px;
  font-weight: bold;
}
</style>