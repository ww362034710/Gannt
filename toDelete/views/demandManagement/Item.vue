/* eslint-disable */
<template>
  <div class="page-main page-demand-item">
    <div class="container-left">
      <h2 class="title">需求节次</h2>
      <a-input-search placeholder="请输入关键字" style="width: 100%;margin-bottom: 12px;" @search="searchSection" />
      <div class="tool-bar">
        <span @click="toAddSection()">
          <a-icon type="plus"/>添加
        </span>
        <span @click="toEditSection()">
          <a-icon type="edit"/>编辑
        </span>
        <span @click="toRemoveSection()">
          <a-icon type="delete"/>删除
        </span>
      </div>
      <div class="left-tree">
        <a-tree :treeData="sectionTreeData" showLine @select="sectionSelectionChange"/>
      </div>
    </div>
    <div class="container-content">
      <div class="content-search-bar">
        <a-form :form="form" layout="inline">
          <a-form-item label="筛选：">
            <a-input v-model="form.name" placeholder="请输入筛选经常"/>
          </a-form-item>
          <a-form-item label="类型：">
            <a-select placeholder="请选择类型"
                      style="width: 120px" @change="handleChange">
              <a-select-option value="jack">Jack</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
              <a-select-option value="disabled" disabled>Disabled</a-select-option>
              <a-select-option value="Yiminghe">yiminghe</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-range-picker @change="onChange" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="content-search-result" v-auto>
        <div style="margin-bottom: 12px;">
          <a-button icon="plus" type="primary" style="margin-right:12px" @click="addItem()">添加条目</a-button>
        </div>
        <a-table
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          :dataSource="itemTblData"
          size="middle"
          :scroll="{y:true,x:500}"
          rowKey="uuid"
          @change="tblPagination"
        >
          <div slot="itemListAction" slot-scope="scope" class="main-table-btns" style="width: 500px">
            <a-button type="primary" size="small" @click="editItem(scope)" icon="edit">编辑</a-button>
            <a-button type="default" size="small" @click="gotoDetail(scope)" icon="exception">详情信息</a-button>
            <a-button type="default" size="small" @click="gotoItemParentDrawer(scope)" icon="exception">关联上级条目</a-button>
            <a-button type="default" size="small" @click="gotoItemChildrenDrawer(scope)" icon="exception">关联下级条目</a-button>
			<a-button type="default" size="small" @click="gotoEventModel(scope)" icon="exception">分解事件</a-button>
          </div>
        </a-table>
      </div>
    </div>

    <!-- 添加条目model -->
    <a-modal
      title="添加条目"
      v-model="addModelVisible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      okText="保存"
      cancelText="取消"
    >
      <a-form :form="itemForm">
        <a-form-item label="名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input allowClear
            v-decorator="['previewContent', itemFormRule.previewContent]"
            placeholder="请填写条目名称"
          />
        </a-form-item>
        <a-form-item label="内容：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-textarea allowClear
                   v-decorator="['content', itemFormRule.content]"
                   placeholder="请输入内容"
                   :autosize="{ minRows: 4, maxRows: 10}"
          />
        </a-form-item>
        <a-form-item label="状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['status', itemFormRule.status]" placeholder="请选择场景状态">
            <a-select-option allowClear v-for="item in status" :key="item.value" :value="item.value">{{item.str}}
            </a-select-option>
          </a-select>
        </a-form-item>
<!--        TODO 后台生成-->
        <!--<a-form-item label="条目标识：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input allowClear
                   :disabled="showDetail"
                   v-decorator="['tag', itemFormRule.tag]"
                   placeholder="条目标识"
          />
        </a-form-item>-->
        <a-form-item label="类型：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['itemTypeId', itemFormRule.itemTypeId]" placeholder="请选择子需求类型">
            <a-select-option allowClear v-for="item in itemType" :key="item.value" :value="item.value">{{item.str}}
            </a-select-option>
          </a-select>
        </a-form-item>
<!--        TODO 这里应该选择用户，最后传输的应该是数字-->
<!--        <a-form-item label="批准人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input allowClear
                   v-decorator="['approver', itemFormRule.approver]"
                   placeholder="请选择批准人"
          />
        </a-form-item>-->
        <a-form-item label="是否可测：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['isTest', itemFormRule.isTest]" placeholder="请选择是否可测">
            <a-select-option allowClear v-for="item in isData" :key="item.value" :value="item.value">{{item.str}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="优先级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input-number allowClear placeholder="请选择优先级" :min='1' v-decorator="['priority', itemFormRule.priority]" style="width:100%"> </a-input-number>
        </a-form-item>
        <a-form-item label="规模：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input-number placeholder="请填写规模" :min='1' v-decorator="['scale', itemFormRule.scale]" style="width:100%"> </a-input-number>
        </a-form-item>
        <a-form-item label="工作量：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input-number allowClear placeholder="请填写实际工作量" :min='1' v-decorator="['actualWorkload', itemFormRule.actualWorkload]" style="width:100%"> </a-input-number>
        </a-form-item>
        <a-form-item label="难度：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['difficultyId', itemFormRule.difficultyId]" placeholder="请选择难度">
            <a-select-option allowClear v-for="item in difficulty" :key="item.value" :value="item.value">{{item.str}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="稳定度：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['stabilityId', itemFormRule.stabilityId]" placeholder="请选择难度">
            <a-select-option allowClear v-for="item in stability" :key="item.value" :value="item.value">{{item.str}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="期望等级：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['expectedLevelId', itemFormRule.expectedLevelId]" placeholder="请选择期望等级">
            <a-select-option allowClear v-for="item in expectedLevel" :key="item.value" :value="item.value">{{item.str}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="条目来源：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input allowClear
                   v-decorator="['itemSource', itemFormRule.itemSource]"
                   placeholder="请填写条目来源"
          />
        </a-form-item>


<!--        <a-form-item label="文档类型：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-select v-decorator="['docType',addFormRule.docType]" placeholder="选择类型">
            <a-select-option
              allowClear
              v-for="item in docTypeData"
              :key="item.value"
              :value="item.value"
            >{{item.text}}
            </a-select-option>
          </a-select>
        </a-form-item>-->
      </a-form>
    </a-modal>

    <!-- 添加需求节次 -->
    <a-modal
      title="添加需求节次"
      v-model="sectionModelVisible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      @ok="saveSection"
      okText="保存"
      cancelText="取消"
    >
      <a-form :form="sectionForm">
        <a-form-item label="节次名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-input
            allowClear
            :disabled="showDetail"
            v-decorator="['previewContent', treeFormRule.name]"
            placeholder="请填写节次名称"
          />
        </a-form-item>

        <a-form-item label="父级节次" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-tree-select
            allowClear
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="sectionTreeData"
            treeDefaultExpandAll
            v-decorator="['parentNodeUid', treeFormRule.fatherFolderUid]"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!--   上级条目-->
    <a-drawer
      :title="itemParenDrawerTitle"
      :width="'90vw'"
      placement="right"
      @close="drawerClose"
      :visible="itemParenDrawer"
      v-if="itemParenDrawer"
    >
      <ItemParent :docEditionUid="docEditionUid" :item="item" :isRelateFather="isRelateFather" @saveSuccess="itemParenDrawer=false"></ItemParent>
    </a-drawer>
    <!--   下级条目-->
    <a-drawer
      title="关联下级条目"
      :width="'90vw'"
      placement="right"
      @close="drawerClose"
      :visible="itemChildrenDrawer"
    >

      <div style="margin-bottom: 12px;">
        <a-button icon="plus" type="primary"
                  style="margin-right:12px" @click="selectSection()" :disabled="false">新建条目</a-button>
        <a-button icon="plus" style="margin-right:12px" @click="showParentDrawer">关联下级条目</a-button>
        <a-button icon="plus" type="danger"
                  style="margin-right:12px" @click="add()" :disabled="true">报表</a-button>
      </div>
      <a-table
        :columns="childrenDialog.childrenTbl.columns"
        :pagination="childrenDialog.childrenTbl.pagination"
        :dataSource="childrenDialog.childrenTbl.data"
        rowKey="uuid"
        @change="childrenSelect"
      >
        <div slot="action" slot-scope="scope" class="main-table-btns">
          <a-button type="primary" size="small" @click="edit(scope)" icon="edit">编辑</a-button>
          <a-button type="default" size="small" icon="share-alt" @click="resetPwd(scope)">发布</a-button>
          <a-button type="default" size="small" @click="gotoDetail(scope)" icon="exception">详情信息</a-button>
          <a-button type="default" size="small" icon="codepen " @click="gotoResolve(scope)">条目分解</a-button>
		<!--   <a-button type="default" size="small" icon="codepen " @click="gotoEventModel(scope)">事件分解</a-button> -->
        </div>
      </a-table>
    </a-drawer>

<!--    添加下级条目 选择需求 节次    -->
    <a-modal
            title="选择文档节次"
            v-model="selectSectionDrawer"
            v-if="selectSectionDrawer"
            @ok="nextStep()"
            okText="下一步"
            cancelText="取消"
    >
      <a-row :gutter="24">
        <a-col :span="12" class="doc">
          <a-table
                  :columns="selectDsDialog.docTbl.columns"
                  :pagination="selectDsDialog.docTbl.docPagination"
                  :loading="selectDsDialog.docTbl.loading"
                  :dataSource="selectDsDialog.docTbl.data"
                  :rowSelection="{type: 'radio', hideDefaultSelections: true, onChange: selectDsDialog.docTbl.selectionChange}"
                  size="middle"
                  :scroll="{y:true,x:500}"
                  rowKey="uid"
          >
          </a-table>
        </a-col>
        <a-col :span="12">
          <a-tree :treeData="selectDsDialog.sectionTree.data" showLine @select="selectDsDialog.sectionTree.selectionChange"/>
        </a-col>
      </a-row>
    </a-modal>

  </div>
</template>

<script>
  import {status, itemType, is, difficulty, stability, expectedLevel} from "@/utils/Enum.js"
  import ItemParent from './ItemParent.vue'
  export default {
    name: "demandManagementItem",
    components: {
      ItemParent,
    },
    data() {
      return {
        docUid: null,             // 文档uid
        docEditionUid: null,         // 文档版本uid
        item: null,            //当前点击的item
        isRelateFather: true,   //关联条目模式，为true时是关联上级条目，false时为关联下级条目
        // 左侧节次树部分
        sectionTreeData: [],      // 左侧节次树数据
        selectedSectionNode: {},  // 左侧节次树当前选中的节点
        sectionModelVisible: false, //添加左侧树 model
        sectionForm: this.$form.createForm(this, {name: "sectionFormData"}),  // 新增/编辑节次的表单
        sectionFormData: {                                                 // 新增/编辑节点的表单数据
          uid: null,
          docUid: null,
          editionUid: null
        },
        // 条目列表部分
        itemTblData: [],          // 条目表格的数据


        visible: false,
        treeFormRule: {
          name: {
            initialValue: "",
            rules: [
              {
                required: true,
                message: "必填"
              },
              {
                min: 2,
                message: "最小长度2"
              }
            ]
          },
          fatherFolderUid: {
            initialValue: ""
          }
        },
        form: {
          name: ""
        },
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
        columns: [
          {
            title: "条目节次",
            dataIndex: "sectionPreviewContent",
            width: 300
          },
         /* {
            title: "条目标识",
            dataIndex: "tag"
          },
          {
            title: "变更状态",
            dataIndex: "alteredStatusId"
          },*/
          {
            title: "标题",
            dataIndex: "previewContent",
            width: 300
          },
         /* {
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
          },*/
          {
            title: "操作",
            width: 350,
            scopedSlots: {customRender: "itemListAction"}
          }
        ],
        tblData: [],
        status: status,
        itemType: itemType,
        isData: is,
        difficulty: difficulty,
        stability: stability,
        expectedLevel: expectedLevel,
        loading: false,
        isAddChildItem: false,      //添加下级条目的标志 提交itemForm的时候执行不同的逻辑
        itemForm: this.$form.createForm(this, {name: "itemFormData"}),
        itemFormData: {
          sectionUid: null,
          docEditionUid: null,
          itemUid: null,
          docUid: null
        },
        itemFormRule: {
          previewContent: {
          },
          content: {
          },
          status: {
          },
          tag: {
          },
          itemTypeId: {
          },
          approver: {
          },
          isTest: {
            rules:[
              {
                required: true,
                message: "必填"
              }
            ]
          },
          priority: {
          },
          scale: {
          },
          actualWorkload: {
          },
          difficultyId: {
          },
          stabilityId: {
          },
          expectedLevelId: {
          },
          itemSource: {
          }
        },
        addForm: null,
        addFormRule: {
          name: {
            initialValue: "",
            rules: [
              {
                required: true,
                message: "必填"
              },
              {
                min: 2,
                message: "最小长度2"
              },
              {
                max: 6,
                message: "最大长度6"
              }
            ]
          },
          tagPrefix: {
            initialValue: "",
            rules: [{required: true, message: "请填写标识前缀"}]
          },
          docType: {
            initialValue: 100,
            rules: [{required: true, message: "请选择文档类型"}]
          },
          deptId: {
            initialValue: "",
            rules: [{required: true, message: "请输入主管部门"}]
          },
          manager: {
            initialValue: "",
            rules: [
              {
                required: true,
                message: "请填写负责人"
              },
              {
                min: 6,
                message: "最小长度6"
              },
              {
                max: 10,
                message: "最大长度10"
              }
            ]
          },
          comm: {
            initialValue: ""
          }
        },
        addModelVisible: false,
        confirmLoading: false, //添加稳定保存 loading
        showDetail: false, //编辑  详情 标识
        itemParenDrawer:false,
        itemParenDrawerTitle: "",
        itemChildrenDrawer:false,
        //添加下级条目dialog
        selectSectionDrawer: false,
        childrenDocData: [],
        childrenDialog: {
          childrenTbl: {
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
            data: [],
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
            }
          }
        },
        selectDsDialog: {
          selectedDocUid: null,
          selectedDocEditionUid: null,
          selectedSectionUid: null,
          docTbl: {
            columns: [
              {
                title: "需求文档名称：",
                dataIndex: "docName"
              }
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
            loading: false,
            data: [],
            selectionChange: (selectedRowKeys, selectedRows) => {
              console.log("selectedRowKeys:" + selectedRowKeys);
              console.log("selectedRows:", selectedRows);
              this.selectDsDialog.selectedDocUid = selectedRows[0].docUid;
              this.selectDsDialog.selectedDocEditionUid = selectedRows[0].uid;
              this.selectDsDialog.selectedSectionUid = null;
              //重新加载节次树
              this.$http.postBody("/bs/demandSection/tree", Object.assign({}, {editionUid: selectedRowKeys[0]})).then(data => {
                this.selectDsDialog.sectionTree.data = data
              });
            }
          },
          sectionTree: {
            data: [],
            selectionChange:(selectedKeys, info) => {
              console.log('section tree selected', selectedKeys, info);
              this.selectDsDialog.selectedSectionUid = selectedKeys[0];
            }
          },
        }
      };
    },
    methods: {
      childrenSelect(){

      },
      showParentDrawer(){
        this.drawerClose();
        this.itemParenDrawer = true;
      },
      drawerClose() {
        this.itemParenDrawer = false;
        this.itemChildrenDrawer = false;
      },
      //添加下级条目
      //分解下级条目选择节次
      selectSection() {
        //加载下级需求文档 和 下级节次 点击下一步后 进入添加条目页面
        let params = Object.assign({},this.selectDsDialog.docTbl.docPagination, {fatherUid: this.docEditionUid});
        this.$http.postBody("/bs/demandEdition/list", params).then(res => {
          this.selectDsDialog.docTbl.data = res.rows;
          this.selectDsDialog.sectionTree.data = [];
        });
        this.selectSectionDrawer = true;

      },
      nextStep(){
        if (this.selectDsDialog.selectedSectionUid){
          this.selectSectionDrawer = false;
          //打开页面
          this.addModelVisible = true;
          this.confirmLoading = false;
          //初始化值
          this.isAddChildItem = true; //将添加标志置为 添加下级条目
          this.$nextTick(() => {
            //初始化form表单
            this.itemForm = this.$form.createForm(this, {name: "itemFormData"});
            //下面几个值使用 选择dialog上的值
            Object.assign(this.itemFormData, {docUid: this.selectDsDialog.selectedDocUid, docEditionUid: this.selectDsDialog.selectedDocEditionUid, sectionUid: this.selectDsDialog.selectedSectionUid, itemUid: null})
          });
        } else {
          this.$message.warning("未选择所属节次!");
        }

      },
      selectSectionDrawerClose(){
        //TODO
      },
      // 节次部分
      // 搜索/刷新节次树
      searchSection(){
        this.$http.postBody("/bs/demandSection/tree", {editionUid: this.docEditionUid}).then(data => {
          this.sectionTreeData = data;
        });
      },
      // 打开添加节次窗口
      toAddSection() {
        this.sectionModelVisible = true;
        this.confirmLoading = false;
        this.$nextTick(() => {
          // 清空表单
          this.sectionFormData = {
            uid: null,
            docUid: this.docUid,
            editionUid: this.docEditionUid
          };
          //初始化form表单
          this.sectionForm.setFieldsValue(this.sectionFormData);
        });
      },
      // 打开编辑节次窗口
      toEditSection() {
        if (!this.selectedSectionNode) {
          this.$message.warning("未选择节次!");
        } else {
          this.sectionModelVisible = true;
          this.confirmLoading = false;
          this.$nextTick(() => {
            // 准备表单数据
            Object.assign(this.sectionFormData,{
              uid: this.selectedSectionNode.key,
              docUid: this.docUid,
              editionUid: this.docEditionUid
            });
            this.sectionForm.setFieldsValue({
              previewContent: this.selectedSectionNode.title,
              parentNodeUid: this.selectedSectionNode.parentId
            });
          });
        }
      },
      // 准备删除节次
      toRemoveSection() {
        if (!this.selectedSectionNode.key) {
          this.$message.warning("未选择节次!", 2);
        } else {
          let that = this;
          this.$confirm({
            title: "系统提示",
            content: () => `确定删除当前节次吗？`,
            onOk(){
              that.$http.postBody('/bs/demandSection/remove', {uid: [that.selectedSectionNode.key]}).then((rst)=>{
                that.whenSuccess(rst, (data)=>{
                  that.$message.success('删除成功');
                  that.searchSection();
                });
              });
            },
            onCancel()
            {
              console.log("Cancel");
            }
          });
        }
      },
      //保存需求目录
      saveSection() {
        this.sectionForm.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            let params = Object.assign(this.sectionFormData,values);  //api不好用？这样处理吧
            this.$http
                    .postBody("/bs/demandSection/edit", params)
                    .then((rst) => {
                      this.confirmLoading = false;
                      this.whenSuccess(rst, ()=>{
                        this.sectionModelVisible = false;
                        //刷新左侧树
                        this.searchSection();
                      });
                    })
                    .catch(() => {
                      this.confirmLoading = false;
                    });
          }
        });
      },

      handleChange(){

      },
      onChange(){

      },
      // 事件 - 选中节次
      sectionSelectionChange(a, b) {
        this.selectedSectionNode = b.node.dataRef;
        console.log("选中的节次是：", this.selectedSectionNode);
        this.doSearch();
      },
      //查询
      doSearch() {
        //分页信息修改
        this.pagination.current = 1;
        this.getSectionItems();
      },
      //添加条目
      addItem() {
        if (!this.selectedSectionNode.key) {
          this.$message.warning("未选择节次!");
        } else {
          this.isAddChildItem = false;
          this.addModelVisible = true;
          this.confirmLoading = false;
          this.$nextTick(() => {
            //初始化form表单
            this.itemForm = this.$form.createForm(this, {name: "itemFormData"});
            Object.assign(this.itemFormData, {docUid: this.docUid, docEditionUid: this.docEditionUid, sectionUid: this.selectedSectionNode.key, itemUid: null})
          });
        }
      },
      editItem(data){
        console.log("编辑的数据是：", data);
        this.addModelVisible = true;
        this.isAddChildItem = false;
        this.confirmLoading = false;
        //弹窗标题 控制
        this.showDetail = true;
        this.itemFormData = Object.assign({}, data);
        this.$nextTick(() => {
          this.itemForm.setFieldsValue(this.itemFormData);
        });
      },
      add() { //TODO 这个没用删掉
        //TODO 不能直接添加，先选择在哪个节次底下
        this.addModelVisible = true;
        this.confirmLoading = false;
        this.$nextTick(() => {
          //初始化form表单
          this.addForm = this.$form.createForm(this, {name: "addForm"});
        });
      },
      /**
       * 表格分页、排序、筛选变化时触发
       */
      tblPagination(pagination) {
        //保存当前分页信息
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getSectionItems();
      },
      //条目分解
      gotoResolve() {
        this.visible = true;
      },
      //跳转到拆解事件
      gotoEventModel(data) {
        console.log(data);
        //打开一个标签页 params 加上tags 名称
        this.$router.push({
          name: "dismantlingEventIndex",
          params: {
            tags: "事件列表",
            docUid: data.docUid,
            itemUid: data.itemUid,
            itemEdition: data.itemEdition,
            docEditionUid: data.docEditionUid,
            sectionUid: data.sectionUid

          }
        });
      }, 
	  //条目详情信息
	  gotoDetail(data) {
	    console.log(data);
	    //打开一个标签页 params 加上tags 名称
	    this.$router.push({
	      name: "demandManagementItemDetail",
	      params: {
	        tags: "需求条目详情",
	        docUid: data.docUid,
	        itemUid: data.itemUid,
	        itemEdition: data.itemEdition,
	        docEditionUid: data.docEditionUid,
	        sectionUid: data.sectionUid
	      }
	    });
	  }, 
      gotoItemParentDrawer(data){
        this.item = data;
        this.itemParenDrawerTitle = "上级条目";
        this.itemParenDrawer = true;
        this.isRelateFather= true;
      },
      gotoItemChildrenDrawer(data) {
        this.item = data;
        this.isRelateFather= false;
        this.itemChildrenDrawer = true;
        this.itemParenDrawerTitle = "下级条目";
        //刷新下级条目列表
        this.childItemSearch(data);

      },
      childItemSearch(data){
        let param = {
          docUid: data.docUid,
          itemUid: data.itemUid,
          itemEdition: data.itemEdition,
          docEditionUid: data.docEditionUid,
          sectionUid: data.sectionUid
        };
        //TODO 没有携带分页信息
        this.$http.postBody("/bs/item/queryChildItems", param)
                .then(data => {
                  this.childrenDialog.childrenTbl.pagination.total = data.total;
                  this.childrenDialog.childrenTbl.data = data.rows;
                  this.loading = false;
                })
                .catch(() => {
                  this.loading = false;
                });
      },
      //获取节次下的条目列表
      getSectionItems() {
        let params = {
          sectionUid: this.selectedSectionNode.key,
          docEditionUid: this.docEditionUid,
          docUid: this.docUid
        };
        //发送ajax 请求
        console.log("params:" + JSON.stringify(params));
        this.$http
          .postBody("/bs/item/list", params)
          .then(rst => {
            this.whenSuccess(rst, data => {
              this.pagination.total = data.total;
              this.itemTblData = data.rows;
              this.loading = false;
            });
          })
          .catch(() => {
            this.loading = false;
          });
      },
      //添加条目保存
      handleSubmit(e) {
        e.preventDefault();
        this.itemForm.validateFields((err, values) => {
          if (!err) {
            let url = "/bs/item/edit";
            let param = Object.assign(this.itemFormData, values);
            if (this.isAddChildItem){
              url = "/bs/item/addChild";
              //TODO 在form中添加上级参数
              Object.assign(param, {item: this.item});
            }
            console.log("数据：" + JSON.stringify(values));
            this.confirmLoading = true;
            this.$http
              .postBody( url , param) //todo 携带附件
              .then(rst => {
                this.whenSuccess(rst, () => {
                  this.$message.success("添加成功！");
                  this.addModelVisible = false;
                  this.confirmLoading = false;
                });
              })
              .catch(() => {
                this.confirmLoading = false;
              });

            let that = this;
            if (this.isAddChildItem){
              //刷新下级列表
              //不延时 请求不到？？？？？
              setTimeout(function (){
                that.childItemSearch(that.item);
              }, 500);
            } else {
              //刷新列表
              //不延时 请求不到？？？？？
              setTimeout(function (){
                that.doSearch();
              }, 500);

            }
          }
        });
      },
    },
    created() {
      if(this.$route.params.docUid && this.$route.params.docEditionUid){
        this.docUid = this.$route.params.docUid;
        this.docEditionUid = this.$route.params.docEditionUid;
      } else { //从需求详情页进入的情况
        this.docUid = this.$attrs.docUid;
        this.docEditionUid = this.$attrs.docEditionUid;
      }
      console.log('-----------------');
      console.log(this.docUid);
      console.log(this.docEditionUid);
      // 获取节次树
      this.searchSection();
    }
  };
</script>
