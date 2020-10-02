<!--事件库中事件的列表-->
<template>
  <div>
    <!-- form -->
    <a-form layout="inline">
      <a-form-item label="名称：">
        <a-input v-model="name" placeholder="请输入名称" allowClear/>
      </a-form-item>
      <a-form-item>
        <a-button icon="search" type="primary" @click="_getInit()">查询</a-button>
      </a-form-item>
    </a-form>
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
    >
      <div slot="action" slot-scope="scope" class="main-table-btns">
        <a-button type="primary" size="small" icon="edit" @click.stop="editItem(scope)">编辑</a-button>
      </div>
    </a-table>

  </div>
</template>

<script>
  export default {
    name: "baseEvent",
    data() {
      return {
        name: "",
        tableData: [],
        loading: false,
        rowSelection: {
          selectedRowKeys: [],
          onChange(item) {
            this.selectedRowKeys = item;
          },
        },
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
            scopedSlots: {customRender: "action"},
          },
        ],
      };
    },
    props: {
      tableY: {
        type: Number,
        default: 240,
      },
    },
    created() {
      this._getInit();
    },
    methods: {
      getSelectedRowKeys() {
        return this.rowSelection.selectedRowKeys;
      },
      async _getInit() {
        let data = {
          name: this.name,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.current,
        };
        let res = await this.$http.postBody("/bs/dict/activity/list", data);
        if (res.code) return false;
        this.tableData = res.data.rows;
        this.pagination.total = res.data.total;
      },
      tblPagination(pagination) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this._getInit();
      },
      // 编辑
      editItem() {
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>