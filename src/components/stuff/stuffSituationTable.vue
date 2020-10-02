 <template>
     <div class="page-main page-demand-list">
         <div class="container-content">
             <div class="content-search-bar">
                 <a-form :form="searchForm" layout="inline">
                     <div style="text-align:right">
                         <a-button @click="add()">添加态势</a-button>
                     </div>
                 </a-form>
             </div>
             <div class="content-search-result" v-auto>
                 <a-table
                         :columns="columns"
                         :pagination="pagination"
                         :loading="loading"
                         :dataSource="tblData"
                         size="middle"
                         :scroll="{y:true,x:500}"
                         rowKey="uuid"
                         @change="tblPagination"
                 >
                     <div slot="action" slot-scope="scope" class="main-table-btns">
                         <!--<a-button type="primary" size="small" icon="edit" @click="edit(scope)">编辑</a-button>-->
                         <a-button type="primary" size="small" icon="delete" @click="del(scope)">删除</a-button>
                     </div>
                 </a-table>
             </div>
         </div>

         <!-- 添加model -->
         <a-modal
                 title="添加可用物态势"
                 v-model="addModelVisible"
                 :maskClosable="false"
                 :confirmLoading="confirmLoading"
                 @ok="handleSubmit"
                 okText="保存"
                 cancelText="取消"
         >
             <a-form :form="addForm">
                 <a-form-item v-show="false">
                     <a-input allowClear v-decorator="['id', {}]"/>
                 </a-form-item>
                 <a-form-item v-show="false">
                     <a-input allowClear v-decorator="['stuffId', addFormRule.stuffId]"/>
                 </a-form-item>
                 <a-form-item label="可用量/状态：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                     <a-input
                             allowClear
                             v-decorator="['situation', addFormRule.situation]"
                             placeholder="请填写可用量/状态"
                     />
                 </a-form-item>
                 <a-form-item label="开始时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                     <a-date-picker
                             allowClear
                             v-decorator="['startTime', addFormRule.startTime]"
                     />
                 </a-form-item>
                 <a-form-item label="结束时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                     <a-date-picker
                             allowClear
                             v-decorator="['endTime', addFormRule.endTime]"
                     />
                 </a-form-item>
                 <a-form-item v-show="false">
                     <a-input allowClear v-decorator="['createBy', {}]"/>
                 </a-form-item>
                 <a-form-item v-show="false">
                     <a-input allowClear v-decorator="['createTime', {}]"/>
                 </a-form-item>
                 <a-form-item v-show="false">
                     <a-input allowClear v-decorator="['updateBy', {}]"/>
                 </a-form-item>
                 <a-form-item v-show="false">
                     <a-input allowClear v-decorator="['updateTime', {}]"/>
                 </a-form-item>
             </a-form>
         </a-modal>
     </div>
 </template>

 <script>
     export default {
         name: "stuff-situation-table",
         props: {
             stuffId: String
         },
         data() {
             return {
                 //枚举类
                 searchForm: {
                     stuffName: null,
                     startTime: null,
                     endTime: null,
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
                         title: "开始时间",
                         dataIndex: "startTime",
                         customRender: (type, row, index) => {
                             return new Date(row.startTime).Format('yyyy-MM-dd');
                         }
                     },
                     {
                         title: "结束时间",
                         dataIndex: "endTime",
                         customRender: (type, row, index) => {
                             return new Date(row.endTime).Format('yyyy-MM-dd');
                         }
                     }, {
                         title: "可用量/状态",
                         dataIndex: "situation"
                     },
                     {
                         title: "操作",
                         width: 350,
                         scopedSlots: {customRender: "action"}
                     }
                 ],
                 tblData: [],
                 loading: false,
                 addForm: null,    // 编辑文档的表单组件
                 addFormData: {},  // 编辑文档的表单数据         // 目录表单数据
                 addFormRule: {
                     stuffId: {
                         initialValue: this.stuffId,
                         rules: [
                             {
                                 required: true,
                                 message: "必填"
                             },
                         ]
                     },
                     situation: {
                         initialValue: "",
                         rules: [
                         ]
                     },
                     startTime: {
                         initialValue: "",
                         rules: [
                         ]
                     },
                     endTime: {
                         initialValue: "",
                         rules: [
                         ]
                     },

                 },
                 addModelVisible: false,
                 confirmLoading: false,            //添加稳定保存 loading
                 showDetail: false,                //编辑  详情 标识
                 stuffId:this.stuffId,
             };
         },
         methods: {
             //查询
             doSearch() {
                 //分页信息修改
                 this.pagination.current = 1;
                 this.getTableData();
             },
             //添加页面
             add() {
                 this.addModelVisible = true;
                 this.showDetail = false;
                 this.confirmLoading = false;
                 // this.$nextTick(() => {
                 this.addForm.resetFields();
                 // });
             },
             //编辑
             edit(data) {
                 this.addModelVisible = true;
                 //弹窗标题 控制
                 this.showDetail = true;
                 this.$nextTick(() => {
                     this.addForm.setFieldsValue(data);
                 });
             },
             //删除
             del(scope){
                 let that =this;
                 this.$confirm({
                     title: "系统提示",
                     content: () => `确定删除此条记录吗？`,
                     onOk(){
                         that.$http
                             .postBody('/bs/stuffSituation/remove', {ids: [scope.id]})
                             .then((rst) => {
                                 that.whenSuccess(rst, (data)=>{
                                     that.$message.success('删除成功');
                                     that.getTableData();
                                 });
                             });
                     },
                     onCancel(){
                         console.log("Cancel");
                     }
                 });
             },
             /**
              * 表格分页、排序、筛选变化时触发
              */
             tblPagination(pagination) {
                 //保存当前分页信息
                 this.pagination.current = pagination.current;
                 this.pagination.pageSize = pagination.pageSize;
                 this.getTableData();
             },
             //获取表格数据
             getTableData() {
                 let params = Object.assign(
                     this.searchForm,
                     {
                         pageSize: this.pagination.pageSize,
                         pageNum: this.pagination.current,
                         stuffId:this.stuffId
                     }
                 );
                 this.loading = true;
                 //发送ajax 请求
                 console.log("params:" + JSON.stringify(params));
                 this.$http
                     .postBody("/bs/stuffSituation/list", params)
                     .then(data => {
                         this.pagination.total = data.data.total;
                         this.tblData = data.data.rows;
                         this.loading = false;
                     }).catch(() => {
                     this.loading = false;
                 });
             },
             //添加保存
             handleSubmit(e) {
                 e.preventDefault();
                 this.addForm.validateFields((err, values) => {
                     if (!err) {
                         console.log("数据：" + JSON.stringify(values));
                         this.confirmLoading = true;
                         this.$http
                             .postBody("/bs/stuffSituation/add", values)
                             .then(() => {
                                 this.$message.success("新增成功", 2);
                                 this.addModelVisible = false;
                                 this.confirmLoading = false;
                                 this.getTableData();
                             }).catch(() => {
                             this.confirmLoading = false;
                         });
                     }
                 });
             }
         },
         created() {
             this.$nextTick(() => {
                 //初始化form表单
                 this.addForm = this.$form.createForm(this, {name: "addFormData"});
             });
             this.getTableData();
         }
     };
 </script>
