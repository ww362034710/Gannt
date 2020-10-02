<template>
  <div class="page-main page-demand-list">
    <div class="container-content">
      <div class="content-search-bar">
        <!-- form -->
        <a-form layout="inline">
          <a-form-item label="需求名称：">
            <a-input v-model="name" placeholder="请输入需求名称" allowClear />
          </a-form-item>
          <a-form-item>
            <a-button icon="search" type="primary" @click="_getInit">查询</a-button>
          </a-form-item>

          <a-form-item style="margin-left: 30px" label="规划计划：">
            <a-select @change="handleChange" style="width: 200px;" v-model="sPlanId"  placeholder="请选择">
              <a-select-option v-for="item in planList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
            </a-select>
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
<!--
            <a-button type="primary" size="small" icon="import" @click="handleItem(scope)">管理</a-button>
-->
            <a-button type="danger" size="small" icon="delete" @click="deleteItem(scope)">删除</a-button>
          </div>
        </a-table>
      </div>
    </div>
    <!--  -->
    <handleGoal
      :show="isModelDialog"
      :item="selectItem"
      @close="isModelDialog=false"
      @update="_getInit"
      :s-plan-id="sPlanId"
    ></handleGoal>
    <!--  -->
  </div>
</template>

<script>
  import handleGoal from "./handleGoal";
import addTabs from "../../utils/addTabs";
export default {
  name: "dGoalIndex",
  data() {
    return {
      // 查询表单
      name: "",
      sPlanId:"",
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
      loading: false,
      columns: [
        // {
        //   title: "ID",
        //   dataIndex: "id",
        // },
        {
          title: "标题",
          dataIndex: "title",
        },
        {
          title: "版本",
          dataIndex: "edition",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
        },
        {
          title: "状态",
          dataIndex: "state",
        },
        {
          title: "操作",
          width: 300,
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [],
      planList:[],
    };
  },
  components: {
    handleGoal,
  },
  created() {
    this._getPlanList();
  },
  watch: {
    planList: {
      immediate: true,
      handler: function (v) {
        this.sPlanId = v[0].id;
        this._getInit();
      },
    },
  },
  methods: {
    addTabs,
    // 初始化数据
    async _getInit() {
      this.loading = true;
      let data = {
        pageSize: this.pagination.pageSize,
        current: this.pagination.current,
        name: this.name,
        sPlanId: this.sPlanId,
      };
      let res = await this.$http.postBody("/bs/goal/list", data);
      if (res.code) return false;
      this.pagination.total = res.total;
      this.tableData = res.rows;
      this.loading = false;
    },
    // 新增数据
    addData() {
      this.selectItem = {};
      this.isModelDialog = true;
    },
    // 编辑数据
    editItem(item) {
      this.selectItem = item;
      this.isModelDialog = true;
    },
    // 删除数据
    deleteItem(scope) {
      let that = this;
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http
            .postBody("/bs/goal/remove", { ids: [scope.id] })
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

    //改变规划计划
    handleChange(){
      this._getInit();
    },
    // 获取规划计划列表
    async _getPlanList() {
      let res = await this.$http.postBody("/bs/plan/queryList");
      if (res.code) return false;
      this.planList = res.data;
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
