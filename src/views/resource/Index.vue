<template>
  <div class="page-main page-demand-list">
    <div class="container-content">
      <div class="content-search-bar">
        <a-form :form="searchForm" layout="inline">
          <a-form-item label="名称：">
            <a-input v-model="searchForm.name" placeholder="请输入名称" allowClear/>
          </a-form-item>
          <a-form-item label="所属系统：">
            <a-input v-model="searchForm.subSystem" placeholder="请输入所属系统" allowClear/>
<!--            <a-select placeholder="请选择所属系统" v-model="searchForm.ownerSystem" :options="OwnerSystem" allowClear-->
<!--                      style="width: 180px">-->
<!--            </a-select>-->
          </a-form-item>
<!--          <a-form-item label="状态：">-->
<!--            <a-select placeholder="请选择状态" v-model="searchForm.state" :options="DemandState" allowClear-->
<!--                      style="width: 150px"></a-select>-->
<!--          </a-form-item>-->
          <a-form-item>
            <a-button icon="search" type="primary" @click="getTableData()">查询</a-button>
            <a-button icon="plus" style="margin-left:10px" @click="add()">添加</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="content-search-result" v-auto>
        <m-table ref="table" url="/bs/dict/resource/list" :params="searchForm" :columns="columns" rowKey="id">
          <div slot="state" slot-scope="{row: state}" v-html="DemandState.getStateHTML(state)"></div>
          <div slot="action" slot-scope="{row: scope}" class="main-table-btns">
            <a-button class="edit-btn" type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>
<!--            <a-button class="detial-btn" v-if="scope.state === 'approving' || scope.state === 'approved'" type="default"-->
<!--                      size="small" icon="exception" @click="detail(scope)">查看-->
<!--            </a-button>-->
            <a-button class="del-btn" type="danger" ghost size="small" icon="delete" @click="del(scope)">删除</a-button>
          </div>
        </m-table>
      </div>
    </div>
    <resourceForm ref="addResDialog" :rid="selectedId" @updateTable="getTableData"></resourceForm>
  </div>
</template>

<script>
import MTable from "@/components/common/MTable";
import resourceForm from "@/components/resource/resourceForm";
export default {
  name: "resourceIndex",
  components: {MTable,resourceForm},
  data() {
    return {
      selectedId: '',
      //枚举类
      searchForm: {
        type: "resource",
        name: undefined,
        subSystem: undefined,
      },
      columns: [
        {
          title: "编码",
          dataIndex: "id",
          width: "15%"
        },
        {
          title: "名称",
          dataIndex: "name",
          width: "10%"
        },
        {
          title: "资源类型",
          dataIndex: "typeName",
          width: "10%"
        },
        {
          title: "所属系统",
          dataIndex: "subSystem",
          width: "10%"
        },
        {
          title: "操作",
          width: 250,
          scopedSlots: {customRender: "action"}
        }
      ]
    };
  },
  methods: {
    //刷新表格
    getTableData() {
      this.$refs.table.getTableData();
    },
    //添加页面
    add() {
      this.$refs.addResDialog.showme = true;
    },
    detail(data) {

    },
    //编辑
    edit(data) {
      this.selectedId = data.id;
      this.$refs.addResDialog.show(data.id,data.name);
    },
    //删除
    del(scope) {
      let that = this;
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http
              .postBody('/bs/dict/resource/remove', [scope.id])
              .then((rst) => {
                that.whenSuccess(rst, (data) => {
                  that.$message.success('删除成功');
                  that.getTableData();
                });
              });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main-table-btns {
  .approve-btn {
    background-color: #00aa00;
    border-color: #00aa00;
  }

  .commit-btn {
    background-color: #50d4fd;
    border-color: #50d4fd;
  }
}
</style>
