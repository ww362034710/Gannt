<template>
  <div>
    <a-table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="tblPagination"
      :scroll="{ y: tableY }"
      bordered
    >
      <div slot="action" slot-scope="scope" class="main-table-btns">
        <a-button type="primary" size="small" icon="edit" @click.stop="editItem(scope)">编辑</a-button>
      </div>
    </a-table>
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
        pageSizeOptions: ["10", "20", "30", "40"],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total) => {
          return "共：" + total + "条记录 ";
        },
        total: 0,
      },

      columns: [
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "优先级",
          dataIndex: "dictNa1me",
        },
        {
          title: "所属系统",
          dataIndex: "dictName",
        },
        {
          title: "操作",
          width: 100,
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  created() {
      this._getInit() 
  },
  props: {
    tableY: {
      type: Number,
      default: 240,
    },
    planId: {
      type: String,
      required: true
    }
  },
  mounted() {},
  methods: {
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
    refreshTbl() {
      this._getInit();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>