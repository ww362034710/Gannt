<!--规划事件管理页面  -->
<template>
  <div class="page-main page-demand-list">
    <div class="container-content">
      <div class="content-search-bar">
        <a-form :form="searchForm" layout="inline">
          <a-form-item label="事件名称：">
            <a-input v-model="searchForm.name" placeholder="请输入事件名称" allowClear/>
          </a-form-item>
<!--          <a-form-item label="优先级：">
            <a-select placeholder="请选择优先级" v-model="searchForm.priority" allowClear style="width: 120px">
              <a-select-option v-for="item in priorityData" :key="item.value" :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>-->
<!--          <a-form-item label="层级：">
            <a-select placeholder="请选择层级" v-model="searchForm.tier" allowClear style="width: 120px">
              <a-select-option v-for="item in tierData" :key="item.value" :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>-->
          <a-form-item>
            <a-button icon="search" type="primary" @click="getTableData()">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <m-table ref="table" :params="searchForm" url="/bs/dict/activity/list" :columns="columns">
        <div slot="action" slot-scope="{row: scope}" class="main-table-btns">
          <a-button size="small" icon="edit" @click="edit(scope)"> 编辑</a-button>
          <a-button type="danger" size="small" icon="delete" @click="del(scope)">删除</a-button>
        </div>
      </m-table>
    </div>
  </div>
</template>

<script>
import MTable from "@/components/common/MTable";
export default {
  name: "event",
  components: {MTable},

  data() {
    return {
      //枚举类
      searchForm: {
        name: null,
        testKind: null,
        importantGrade: null,
        planGrade: null,
        createPerson: null,
        updatePerson: null,
        mark: null,
        priority: undefined,
        tier: undefined,
      },
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          width: "15%"
        },
        {
          title: "所属系统",
          dataIndex: "subSystem",
          width: "15%"
        },
        {
          title: "活动间隔",
          dataIndex: "duration",
          width: "15%"
        },
        {
          title: "描述",
          dataIndex: "description",
          width: "15%"
        },
        {
          title: "操作",
          width: 250,
          scopedSlots: {customRender: "action"}
        }
      ],
      priorityData: [
        {value: "1", text: "一级"},
        {value: "2", text: "二级"},
        {value: "3", text: "三级"},
        {value: "4", text: "四级"}
      ],
      tierData: [
        {value: "1", text: "一层"},
        {value: "2", text: "二层"},
        {value: "3", text: "三层"},
        {value: "4", text: "四层"}
      ],
    };
  },
  methods: {
    edit(data) {
    },
    //删除
    del(scope) {
      let that = this;
      // let data = {uid:scope.uid,schemeId:scope.resolveSchemeId,nodeId:scope.nodeId};
      // data.idsList = [scope.uid,scope.resolveSchemeId,scope.nodeId];
      console.log(scope);
      this.$confirm({
        title: "系统提示",
        content: () => `确定删除此条记录吗？`,
        onOk() {
          that.$http
              .postBody('/bs/dict/activity/remove', [scope.id])
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
    //查询表格数据
    getTableData() {
      this.$refs.table.getTableData();
    }
  }
};
</script>
