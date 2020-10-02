<template>
  <div class="page-main page-demand-list">
    <div class="container-content">
      <div class="content-search-bar">
        <!-- form -->
        <a-form layout="inline">
          <a-form-item label="目标名称：">
            <a-input v-model="name" placeholder="请输入目标名称" allowClear />
          </a-form-item>
          <a-form-item>
            <a-button icon="search" type="primary" @click="_getInit">查询</a-button>
          </a-form-item>
          <a-form-item style="float:right">
            <a-button type="primary" icon="plus" @click="addData">新增</a-button>
          </a-form-item>
        </a-form>
        <!-- table -->
        <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="tableData"
          :pagination="pagination"
          :loading="loading"
          bordered
        >
          <div
            slot="description"
            slot-scope="scope"
            class="description-content"
          >{{scope.description}}</div>
          <div slot="action" slot-scope="scope" class="main-table-btns">
            <a-button type="primary" size="small" icon="edit" @click.stop="editItem(scope)">编辑</a-button>
            <a-button type="primary" size="small" icon="import" @click="handleItem(scope)">管理</a-button>
            <a-button type="danger" size="small" icon="delete" @click="deleteItem(scope)">删除</a-button>
          </div>
        </a-table>
      </div>
    </div>
    <!--  -->
    <handleModel
      :show="isModelDialog"
      :item="selectItem"
      @close="isModelDialog=false"
      @update="_getInit"
    ></handleModel>
    <!--  -->
  </div>
</template>

<script>
import handleModel from "./handleModel";
import addTabs from "../../utils/addTabs";
export default {
  name: "modelListIndex",
  data() {
    return {
      // 查询表单
      name: "",
      loading:false,
      isModelDialog: false,
      selectItem: {},
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
        // {
        //   title: "ID",
        //   dataIndex: "id",
        // },
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "描述",
          scopedSlots: { customRender: "description" },
        },
        {
          title: "创建人",
          dataIndex: "createBy",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
        },
        {
          title: "操作",
          width: 300,
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [],
    };
  },
  components: {
    handleModel,
  },
  created() {
    console.log("初始化");
    this._getInit();
  },
  methods: {
    addTabs,
    // 初始化数据
    async _getInit() {
      this.loading = true
      let data = {
        pageSize: this.pagination.pageSize,
        current: this.pagination.current,
        name: this.name,
      };
      let res = await this.$http.postBody("/bs/dict/list", data);
      if (res.code) return false;
      this.pagination.total = res.total;
      this.tableData = res.rows;
      this.loading = false
    },
    // 新增数据
    addData() {
      this.selectItem = {};
      this.isModelDialog = true;
    },
    // 编辑数据
    editItem(item) {
      console.log(item);
      this.selectItem = item;
      this.isModelDialog = true;
    },
    // 管理数据
    handleItem(item) {
      // this.$router.push({
      //   name: "modelDetailIndex",
      //   query: {
      //     id: item.id,
      //   },
      // });
      let name = `模型：${item.name}`;
      let data = {
        id: item.id,
        name,
      };
      this.addTabs(name, "modelDetailIndex", true, data);
    },
    // 删除数据
    deleteItem(scope) {
      let that = this;
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http
            .postBody("/bs/dict/remove", { id: scope.id })
            .then((res) => {
              if (res.code) return false;
              that.whenSuccess(() => {
                that.$message.success("删除成功");
              });
              that._getInit();
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
  },
};
</script>

<style lang="scss" scope>
.description-content {
  width: 18em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
