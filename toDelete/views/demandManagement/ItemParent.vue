<template>
  <div class="doc-item-parent">
    <div class="doc-item">
      <a-row :gutter="16">
        <a-col :span="6" class="doc">
          <a-table
            size="middle"
            :columns="docColumns"
            :pagination="docPagination"
            :dataSource="docData"
            rowKey="uuid"
            :customRow="docTblCustomRow"
          >
          </a-table>
        </a-col>
        <a-col :span="4">
          <a-tree :treeData="sectionTreeData" showLine @select="sectionSelectionChange"/>
        </a-col>
        <a-col :span="14">
          <a-table
            size="middle"
            :columns="itemColumns"
            :pagination="pagination"
            :dataSource="itemData"
            rowKey="uuid"
            :customRow="itemTblCustomRow"
          >
          </a-table>
        </a-col>
      </a-row>

    </div>
    <div class="children-list">
      <h4>已选条目列表</h4>
      <div style="margin-bottom: 12px;">
        <a-button icon="delete" type="danger" :disabled="!hasSelected"
                  style="margin-right:12px" @click="removeSelectedRow()">移除</a-button>
      </div>
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: docSelect}"
        :columns="childrenColumns"
        :pagination="pagination"
        :dataSource="childrenData"
        :rowKey="record => {return record.itemUid}"
      >
      </a-table>
    </div>
    <div>
      <div style="margin-bottom: 12px;">
        <a-button icon="plus" type="primary"
                  style="margin-right:12px" @click="save()">保存</a-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "demandManagementRelateItem",
    components: {
    },
    data() {
      return {
        isRelateFather: true,
        docEditionUid: null,
        item: null,
        docData: [],
        docColumns: [
          {
            title: "文档名称",
            dataIndex: "docName"
          },
          {
            title: "文档类型",
            dataIndex: "docType"
          },
          {
            title: "版本",
            dataIndex: "edition"
          },
          {
            title: "备注",
            dataIndex: "comm"
          },
        ],
        docPagination: {
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
        docTblCustomRow: record => ({
          on: { // 事件
            click: () => {
              //加载树信息
              this.$http.postBody("/bs/demandSection/tree", Object.assign({}, {editionUid: record.uid})).then(data => {
                this.sectionTreeData = data
              });
            },
          },
        }),
        sectionTreeData: [],
        itemData: [],
        itemColumns: [
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
          },
          {
            title: "是否可测",
            dataIndex: "isTest"
          }
        ],
        itemTblCustomRow: record => ({
          on: {
            click: () => {
              console.log("item table click row:", record);
              //判断记录是否已经添加到已选子需求中
              let flag = true;
              this.childrenData.forEach( item => {
                if(item.itemUid === record.itemUid) flag = false;
              });
              if (flag) this.childrenData.push(record);
              else this.$message.warn("已经存在！");
            },
          },
        }),
        childrenColumns: [
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
          },
          {
            title: "是否可测",
            dataIndex: "isTest"
          }
        ],
        childrenData: [],
        pagination: {
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
        selectedRowKeys: [],
      }
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0;
      }
    },
    created() {
      this.docEditionUid = this.$attrs.docEditionUid;
      this.item = this.$attrs.item;
      this.isRelateFather = this.$attrs.isRelateFather;
      this.getDocList();
      this.getRelateItems();
      console.log("接收的docEditionUid是：" + this.docEditionUid);
    },
    methods: {
      docSelect(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
      },
      sectionSelectionChange(selectedKeys, info) {
        console.log('section tree selected', selectedKeys, info);
        this.$http.postBody("/bs/item/list", Object.assign({},this.pagination, {sectionUid: info.node.dataRef.key})).then(rst => {
          this.whenSuccess(rst, data => {
            this.itemData = data.rows
          })
        });
      },
      getDocList() {
        let params;
        if (this.isRelateFather){
          params = Object.assign({},this.docPagination, {childUid: this.docEditionUid})
        } else {
          params = Object.assign({},this.docPagination, {fatherUid: this.docEditionUid})
        }
        this.$http.postBody("/bs/demandEdition/list", params).then(res => {
          this.docData = res.rows
        });
      },
      getRelateItems() {
        let param = {
          docUid: this.item.docUid,
          itemUid: this.item.itemUid,
          itemEdition: this.item.itemEdition,
          docEditionUid: this.item.docEditionUid,
          sectionUid: this.item.sectionUid
        };
        let url;
        if (this.isRelateFather){
          url = "/bs/item/queryFatherItems";
        } else {
          url = "/bs/item/queryChildItems";
        }
        this.$http.postBody( url, param)
                .then(data => {
                  this.pagination.total = data.total;
                  this.childrenData = data.rows;
                })
                .catch(() => {
                });
      },
      removeSelectedRow() {
        let data = this.childrenData;
        this.selectedRowKeys.forEach(function (itemUid, i) {
          data.forEach(function (item, index) {
            if (item.itemUid == itemUid){
              data.splice(index, 1);
            }
          })
        })
        this.selectedRowKeys = [];
      },
      save() {
        let params;
        if (this.isRelateFather){
          params = Object.assign({}, {
            item: this.item,
            fatherItems: this.childrenData
          });
        } else {
          params = Object.assign({}, {
            item: this.item,
            childItems: this.childrenData
          });
        }
        this.$http.postBody("/bs/item/relateItem", params).then(res => {
          //保存成功后关闭当前页面
          this.$message.success("保存完毕");
          this.$emit("saveSuccess");
        });
      }
    },
  }
</script>
