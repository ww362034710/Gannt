<template>
  <div class="page-main page-demand-detail">
    <a-tabs defaultActiveKey="1" tabPosition="left" type="card">
      <a-tab-pane tab="基本信息" key="1">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic
              title="名称"
              :value="item.previewContent"
              style="margin-right: 50px"
            />
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic
                    title="内容"
                    :value="item.content"
                    style="margin-right: 50px"
            />
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane tab="属性" key="2">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic
                    title="状态"
                    :value="getEnumStr('status', item.status)"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="类型"
                    :value="getEnumStr('itemType', item.type)"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="批准人"
                    :value="item.approver"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="是否可测"
                    :value="getEnumStr('is', item.isTest)"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="优先级"
                    :value="item.priority"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="规模"
                    :value="item.scale"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="工作量"
                    :value="item.workload"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="难度"
                    :value="getEnumStr('difficulty', item.difficultyId)"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="稳定度"
                    :value="getEnumStr('stability',item.stabilityId)"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="期望等级"
                    :value="getEnumStr('expectedLevel',item.expectedLevelId)"
                    style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
                    title="条目来源"
                    :value="item.itemSource"
                    style="margin-right: 50px"
            />
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane tab="上级条目" key="3">
        <a-table
                :columns="columns"
                :pagination="fatherPagination"
                :loading="loading"
                :dataSource="fatherItemTblData"
                size="middle"
                :scroll="{y:true,x:500}"
                rowKey="uuid"
                @change="fatherTblPagination"
        >
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="下级条目" key="4">
        <a-table
                :columns="columns"
                :pagination="childPagination"
                :loading="loading"
                :dataSource="childItemTblData"
                size="middle"
                :scroll="{y:true,x:500}"
                rowKey="uuid"
                @change="childTblPagination"
        >
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="事件管理" >
        <a-table
                :columns="eventColumns"
                :pagination="eventPagination"
                :dataSource="eventTblData"
                :loading="loading"
                size="middle"
                :scroll="{y:true,x:500}"
                rowKey="uuid"
                @change="eventList">
          <div slot="action" slot-scope="scope" class="main-table-btns" style="width: 310px">
            <a-button type="danger" size="small" @click="dismantlingEvent(scope)" icon="edit">事件拆解</a-button>
            <a-button type="danger" size="small" @click="delEvent(scope)" icon="delete">删除</a-button>
          </div>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="相关附件" key="5">
        数据表格
      </a-tab-pane>
      <a-tab-pane tab="变更依据" key="6">
        数据表格
      </a-tab-pane>
      <a-tab-pane tab="变化历史" key="7">
        <li v-for="changeHistory in changeHistoryList">
          {{ changeHistory.no }}
          {{ changeHistory.operateTime }}
          {{changeHistory.infoList[0]}}
        </li>
      </a-tab-pane>
      <a-tab-pane tab="相关资源" key="8">
        数据表格
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import {getStr} from "@/utils/Enum.js";
export default {
  name: "demandManagementItemDetail",
  components: {
  },
  data() {
    return {
      itemParams: {},
      changeHistoryList: [],
      infoType:1,       // 默认显示第一个
      item: {},
      eventTblData:[],
      columns: [
        {
          title: "条目节次",
          dataIndex: "sectionPreviewContent"
        },
         {
           title: "条目标识",
           dataIndex: "tag"
         },
         {
           title: "变更状态",
           dataIndex: "alteredStatusId"
         },
        {
          title: "标题",
          dataIndex: "previewContent"
        },
         {
           title: "条目状态",
           dataIndex: "status"
         },
         {
           title: "优先级",
           dataIndex: "priority"
         },
         {
           title: "所属文档",
           dataIndex: "docName"
         },
         {
           title: "所属文档版本",
           dataIndex: "docEdition"
         },
         {
           title: "条目类型",
           dataIndex: "itemTypeId"
         }
      ],
      eventColumns: [
        {
          title: "事件名称",
          dataIndex: "name",
        },
        {
          title: "最早开始时间",
          dataIndex: "earliestStartTime",
          width: "20%"
        },
        {
          title: "最晚开始时间",
          dataIndex: "latestStartTime",
          width: "20%"
        },
        {
          title: "预计工期（天）",
          dataIndex: "predictDay",
          width: 150
        },
        {
          title: "操作",
          width: 100,
          scopedSlots: { customRender: "action" }
        }
      ],
      fatherPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => {
          return "共：" + total + "条记录 ";
        },
        total: 0
      },
      loading: false,
      fatherItemTblData: [],
      fatherTblPagination(pagination) {
        //保存当前分页信息
        this.fatherPagination.current = pagination.current;
        this.fatherPagination.pageSize = pagination.pageSize;
        this.getFatherItems();
      },
      childPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => {
          return "共：" + total + "条记录 ";
        },
        total: 0
      },
      eventPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => {
          return "共：" + total + "条记录 ";
        },
        total: 0
      },
      childItemTblData: [],
      childTblPagination(pagination) {
        //保存当前分页信息
        this.childPagination.current = pagination.current;
        this.childPagination.pageSize = pagination.pageSize;
        this.queryChildItems();
      },
      eventList(pagination){
        //保存当前分页信息
        this.eventPagination.current = pagination.current;
        this.eventPagination.pageSize = pagination.pageSize;
        this.queryEventList();
      }
    };
  },
  computed:{

  },
  created() {
    this.itemParams = Object.assign({}, this.$route.params);
    this.$http.postBody("/bs/item/queryViewItem", this.itemParams)
            .then(data => {
              this.item = data;
            })
            .catch(() => {
              this.loading = false;
            });
    this.getFatherItems();
    this.queryChildItems();
    this.queryHistoryList();
    this.queryEventList();
  },
  mounted() {},
  methods: {
    getFatherItems() {
      //TODO 没有携带分页信息
      this.$http.postBody("/bs/item/queryFatherItems", this.itemParams)
              .then(data => {
                this.fatherPagination.total = data.total;
                this.fatherItemTblData = data.rows;
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
    },
    queryChildItems() {
      //TODO 没有携带分页信息
      this.$http.postBody("/bs/item/queryChildItems", this.itemParams)
              .then(data => {
                this.childPagination.total = data.total;
                this.childItemTblData = data.rows;
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
    },
    queryEventList() {
      //查询已经管理已经拆分出的事件
      this.$http.postBody("/bs/event/list", this.itemParams)
              .then(data => {
                this.eventPagination.total = data.total;
                this.eventTblData = data.rows;
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
    },
    //从该条目中删除此事件
    delEvent(){
      console.log("从该条目中删除此事件")
    },
    //再次拆分事件
    dismantlingEvent(){
      console.log("事件的再次拆分");
    },
    queryHistoryList() {
      let params = {
        docEditionUid: this.itemParams.docEditionUid,
        itemUid: this.itemParams.itemUid
      };
      this.$http.postBody("/bs/itemDisposeHistory/changeHistory", params)
              .then(data => {
                this.changeHistoryList = data;
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
    },
    getEnumStr: getStr
  }
};
</script>

<style lang='scss' scoped>
.demand-detail {
  .detail-card {
    position: relative;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>
