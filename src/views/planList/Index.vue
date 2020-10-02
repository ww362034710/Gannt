<template>
  <div class="page-main page-demand-list">
    <div class="container-content">
      <div class="content-search-bar">
        <!-- form -->
        <a-form layout="inline">
          <a-form-item label="场景名称：">
            <a-input v-model="params.name" placeholder="请输入场景名称" allowClear />
          </a-form-item>
          <a-form-item>
            <a-button icon="search" type="primary" @click="refreshTable">查询</a-button>
          </a-form-item>
          <a-form-item style="float:right">
            <a-button type="primary" icon="plus" @click="addData">新增</a-button>
          </a-form-item>
        </a-form>
        <!-- table -->
        <m-table
          ref="table"
          url="/bs/ns/plan/list"
          :columns="columns"
          row-key="id"
          :params="params"
        >
          <div
            slot="description"
            slot-scope="{row: scope}"
            class="description-content"
          >{{scope.description}}</div>
          <div slot="action" slot-scope="{row: scope}" class="main-table-btns">
            <a-button type="primary" size="small" icon="edit" @click.stop="editItem(scope)">编辑</a-button>
            <a-button type="primary" size="small" icon="import" @click="handleItem(scope)">规划</a-button>
            <a-button type="primary" size="small" icon="import" @click="handlEincident(scope)">采集事件</a-button>
            <a-button type="danger" size="small" icon="delete" @click="deleteItem(scope)">删除</a-button>
          </div>
        </m-table>
      </div>
    </div>
    <!--  -->
    <handlePlan
      :show="isModelDialog"
      :item="selectItem"
      @close="isModelDialog=false"
      @update="refreshTable"
    ></handlePlan>
    <!--  -->
  </div>
</template>

<script>
import handlePlan from "./handlePlan";
import addTabs from "../../utils/addTabs";
import MTable from "../../components/common/MTable";
export default {
  name: "planListIndex",
  data() {
    return {
      // 查询表单
      params: {
        name: "",
      },
      isModelDialog: false,
      selectItem: {},
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
          title: "模型",
          dataIndex: "dictName",
        },

        {
          title: "创建人",
          dataIndex: "updateBy",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
        },
        {
          title: "操作",
          width: 350,
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [],
    };
  },
  components: {
    MTable,
    handlePlan,
  },
  created() {
  },
  methods: {
    addTabs,
    refreshTable() {
      this.$refs.table.getTableData();
    },
    // 新增数据
    addData() {
      this.selectItem = {};
      this.isModelDialog = true;
    },
    // 打开事件
    handlEincident(item) {
      let name = `事件：${item.name}`;
      let data = {
        id: item.id,
        dictId: item.dictId,
        name,
        pid: item.pid,
      };
      this.addTabs(name, "planEincidentIndex", true, data);
    },
    // 编辑数据
    editItem(item) {
      this.selectItem = item;
      this.isModelDialog = true;
    },
    // 管理数据
    handleItem(item) {
      // 打开新标签

      // this.$router.push({
      //   name: "planDetailIndex",
      //   query: {
      //     id: item.id,
      //     dictId: item.dictId
      //   },
      // });
      // console.log(item);
      let name = `规划：${item.name}`;
      let data = {
        id: item.id,
        dictId: item.dictId,
        name,
      };
      this.addTabs(name, "planDetailIndex", true, data);
    },
    // 删除数据
    deleteItem(scope) {
      let that = this;
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http
            .postBody("/bs/ns/plan/remove", [scope.id])
            .then((res) => {
              if (res.code) return false;
              that.whenSuccess(() => {
                that.$message.success("删除成功");
              });
              that.refreshTable();
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