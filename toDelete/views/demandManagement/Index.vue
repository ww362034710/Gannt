<template>
    <div class="page-main page-demand-list">
        <div class="container-left">
            <h2 class="block-title">目标目录</h2>
            <div class="tool-bar">
                <span @click="toAddDocFolder()">
                    <a-icon type="plus" />添加
                </span>
                <span @click="toEditDocFolder()">
                    <a-icon type="edit" />编辑
                </span>
                <span @click="removeFolder()">
                    <a-icon type="delete" />删除
                </span>
            </div>
            <div class="left-tree">
                <a-tree :treeData="folderTreeData" showLine @select="treeSelectionChange" />
            </div>
        </div>
        <div class="container-content">
            <h2 class="block-title">目标列表</h2>
            <div class="content-search-bar">
                <a-form :form="searchForm" layout="inline">
                    <a-form-item label="名称：">
                        <a-input v-model="searchForm.name" placeholder="请输入名称" allowClear />
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" icon="search" @click="doSearch()">查询</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="add()">添加文档</a-button>
                        <a-button icon="plus" style="margin-left:10px" @click="addDemand()">添加目标</a-button>
                        <a-button type="primary" icon="remove" style="margin-left:10px">管理变更</a-button>
                        <a-dropdown>
                            <a-menu slot="overlay" @click="handleMoreMenuClick">
                                <a-menu-item key="1">
                                    <a-icon type="edit" />修改文档</a-menu-item>
                                <a-menu-item key="2">
                                    <a-icon type="copy" />复制文档</a-menu-item>
                                <a-menu-item key="3">
                                    <a-icon type="retweet" />移动文档</a-menu-item>
                                <a-menu-item key="4">
                                    <a-icon type="snippets" />管理附件</a-menu-item>
                                <a-menu-divider />
                                <a-menu-item key="5" type="danger">
                                    <a-icon type="delete" />删除文档</a-menu-item>
                            </a-menu>
                            <a-button style="margin-left: 8px"> 更多操作
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                        <a-upload style="margin-left:10px" name="file^fileId" :multiple="true" action="system/file/uploadDoc" accept=".docx" :data="{'docFolderUid': selectedDemandDocFolderUid}" :showUploadList="false" @change="handleUploadChange">
                            <a-button :disabled="selectedDemandDocFolderUid==''">
                                <a-icon type="upload" /> 导入目标文档 </a-button>
                        </a-upload>
                    </a-form-item>
                </a-form>
            </div>
            <div class="content-search-result" v-auto>
                <a-table :columns="columns" :pagination="pagination" :loading="loading" :dataSource="tblData" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="tblPagination">
                    <div slot="action" slot-scope="scope" class="main-table-btns">
                        <a-button type="primary" size="small" @click="edit(scope)" icon="edit">编辑</a-button>
                        <a-button type="default" size="small" icon="share-alt" @click="toPublish(scope)">发布</a-button>
                        <a-button type="default" size="small" @click="gotoDetail(scope)" icon="exception">详情信息</a-button>
                        <a-button type="default" size="small" icon="codepen " @click="gotoResolve(scope)">目标分解</a-button>
                        <a-button type="default" size="small" icon="codepen " @click="relation(scope)">跟踪图</a-button>
                        <!-- <a-button type="default" size="small" icon="codepen " @click="gotoEventModel(scope)">事件分解</a-button> -->
                    </div>
                </a-table>
            </div>
        </div>

        <!-- 添加文档model -->
        <a-modal title="添加文档" v-model="addModelVisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" okText="保存" cancelText="取消" style="width:1000px">
            <demand-add ref="demandAdd" type :showDetail="showDetail"></demand-add>
        </a-modal>
        <!-- 添加树节点 -->
        <a-modal title="添加目标目录" v-model="treeModelVisible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleTreeNode" okText="保存" cancelText="取消">
            <a-form allowClear :form="treeForm" :model="treeFormData">
                <a-form-item v-show="false">
                    <a-input v-decorator="['folderUid', {}]" />
                </a-form-item>
                <a-form-item label="目录名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear :disabled="showDetail" v-decorator="['name', treeFormRule.name]" placeholder="请填写目录名称" />
                </a-form-item>
                <a-form-item label="父级目录" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-tree-select allowClear :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="folderTreeData" treeDefaultExpandAll v-decorator="['fatherFolderUid', {}]"></a-tree-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 发布文档 -->
        <a-modal title="发布新版本" v-model="postNewVersion" :maskClosable="false" @ok="doPublish" okText="发布" cancelText="取消">
            <a-form :form="newVersionForm" :model="newVersionFormData">
                <a-form-item label="版本号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear :disabled="showDetail" v-decorator="['edition', treeFormRule.name]" placeholder="请输入版本号" />
                </a-form-item>
                <a-form-item label="版本简介" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea v-decorator="['comm', {}]" placeholder="请输入版本简介" :autosize="{ minRows: 2, maxRows: 6 }" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 条目分解 -->
        <a-drawer placement="right" @close="visible=false" :visible="visible" width="80%">
            <demo-index />
        </a-drawer>
    </div>
</template>

<script>
import DemoIndex from "@/views/demo/Index";
//添加文档
import DemandAdd from '@/components/demand/Add'

export default {
    name: "demandManagementIndex",
    components: {
        DemoIndex,
        DemandAdd
    },
    data() {
        return {
            visible: false,
            treeModelVisible: false, //添加左侧树 model
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
                        },
                        {
                            max: 30,
                            message: "最大长度6"
                        }
                    ]
                },
                fatherFolderUid: {
                    initialValue: ""
                }
            },
            searchForm: {
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
                    title: "名称",
                    dataIndex: "name"
                },
                {
                    title: "操作",
                    width: 400,
                    scopedSlots: { customRender: "action" }
                }
            ],
            tblData: [],
            loading: false,
            addForm: null,    // 编辑文档的表单组件
            addFormData: {},  // 编辑文档的表单数据
            treeForm: null,              // 目录表单控件
            treeFormData: {},                                                           // 目录表单数据
            newVersionForm: null,

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
                            max: 30,
                            message: "最大长度30"
                        }
                    ]
                },
                tagPrefix: {
                    initialValue: "",
                    rules: [{ required: true, message: "请填写标识前缀" }]
                },
                docType: {
                    initialValue: 100,
                    rules: [{ required: true, message: "请选择文档类型" }]
                },
                deptId: {
                    initialValue: "",
                    rules: [{ required: true, message: "请输入主管部门" }]
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
            confirmLoading: false,            //添加稳定保存 loading
            showDetail: false,                //编辑  详情 标识
            folderTreeData: [],               //左侧目录树的数据
            selectedDemandDocFolder: {},      // 表单使用的对象模型
            selectedDemandDocFolderUid: "",   //左侧树当前选中节点id
            postNewVersion: false,
            newVersionFormData: {             // 发布新版的数据对象
                edition: null,
                common: null
            },
        };
    },
    methods: {
        doPublish() {
            this.newVersionForm.validateFields((err, values) => {
                if (!err) {
                    console.log('demandManagement/index doPublish(): ', this.newVersionFormData);
                    this.$http.postBody('/bs/demandDoc/publish', this.newVersionFormData).then((rst) => {
                        this.whenSuccess(rst, (data) => {
                            this.$message.success("发布成功");
                            this.postNewVersion = false;
                            this.getTableData();
                        });
                    })
                }
            });
        },
        // 打开添加目录窗口
        toAddDocFolder() {
            this.treeModelVisible = true;
            this.confirmLoading = false;
            this.$nextTick(() => {
                // 准备表单数据
                this.treeFormData = {
                    fatherFolderUid: this.selectedDemandDocFolder && this.selectedDemandDocFolder.uid
                };
                //初始化form表单
                this.treeForm.setFieldsValue(this.treeFormData);
            });
        },
        // 打开编辑目录窗口
        toEditDocFolder() {
            // console.log('this.selectedDemandDocFolder', this.selectedDemandDocFolder);
            if (!this.selectedDemandDocFolderUid) {
                this.$message.warning("未选择目录!");
            } else {
                this.treeModelVisible = true;
                this.confirmLoading = false;
                // 准备表单数据
                this.treeFormData = {
                    folderUid: this.selectedDemandDocFolder.uid,   //数据库中对应的字段为folderUid
                    name: this.selectedDemandDocFolder.name || 555,
                    fatherFolderUid: this.selectedDemandDocFolder.parentId
                };
                this.$nextTick(() => {
                    //初始化form表单
                    console.log(this.treeFormData);
                    this.treeForm.setFieldsValue(this.treeFormData);
                });
            }

        },
        //删除树节点
        removeFolder() {
            let that = this;
            if (this.selectedDemandDocFolderUid === "") {
                this.$message.warning("未选择目录!", 2);
            } else {
                this.$confirm({
                    title: "系统提示",
                    content: () => `确定删除当前目录吗？`,
                    onOk() {
                        that.$http.postBody("/bs/demandDocFolder/remove", { folderUids: [that.selectedDemandDocFolderUid] }).then(rst => {
                            that.whenSuccess(rst, () => {
                                that.getFolderTreeData();
                                that.selectedDemandDocFolder = that.$options.data().selectedDemandDocFolder;
                                that.$message.success(rst.msg);
                            });
                        });
                    },
                    onCancel() {
                        console.log("Cancel");
                    }
                });
            }
        },
        //新增需求目录
        handleTreeNode() {
            this.treeForm.validateFields((err, values) => {
                if (!err) {
                    console.log("数据：" + JSON.stringify(values));
                    this.confirmLoading = true;
                    this.$http
                        .postForm("/bs/demandDocFolder/add", values)
                        .then((data) => {
                            this.$message.success(data.msg, 2);
                            if (data.code === 0) {
                                this.treeModelVisible = false;
                                this.confirmLoading = false;
                                //刷新左侧树
                                this.getFolderTreeData();
                            }
                        })
                        .catch(() => {
                            this.confirmLoading = false;
                        });
                }
            });
        },
        //左侧树节点点击事件
        treeSelectionChange(a, b) {
            console.log('选中目录: ', b.node.dataRef);
            this.selectedDemandDocFolder = {
                uid: b.node.dataRef.key,
                name: b.node.dataRef.title,
                parentId: b.node.dataRef.parentId
            };
            this.selectedDemandDocFolderUid = b.node.dataRef.key;
            //查询表格数据
            this.getTableData();
        },
        //查询
        doSearch() {
            //分页信息修改
            this.pagination.current = 1;
            this.getTableData();
        },
        //添加需求
        addDemand() {
            this.$router.push({
                name: "demandManagementAddDemand",
                params: {
                    tags: "添加需求" + (+ new Date())
                }
            })
        },
        //添加需求文档
        add() {
            this.addModelVisible = true;
            this.showDetail = false;
            this.confirmLoading = false;
            this.$nextTick(() => {
                this.$refs.demandAdd.addForm.resetFields();
            });
            this.addFormData = {}; //将添加的formData置为空
        },
        //编辑
        edit(data) {
            this.addModelVisible = true;
            //弹窗标题 控制
            this.showDetail = true;
            this.addFormData = Object.assign({}, data);
            this.$nextTick(() => {
                this.$refs.demandAdd.addForm.setFieldsValue(this.addFormData);
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
        //条目分解
        gotoResolve(doc) {
            this.$router.push({
                name: "demandManagementItem",
                params: {
                    tags: "需求条目",
                    docUid: doc.uid,                    // 文档uid
                    docEditionUid: doc.newestEditionUid    // 文档当前版本uid
                }
            });
        },
        relation(doc) {
            console.log("当前文档是：", doc);
            this.$router.push({
                name: "demandManagementDataRelation",
                params: {
                    tags: "需求跟踪图",
                    docUid: doc.uid,                    // 文档uid
                    docEditionUid: doc.newestEditionUid    // 文档当前版本uid
                }
            });
        },
        //表格详情信息
        gotoDetail(data) {
            console.log(data);
            //打开一个标签页 params 加上tags 名称
            this.$router.push({
                name: "demandManagementDetail",
                params: {
                    tags: "需求详情-" + data.name,
                    uid: data.newestEditionUid
                }
            });
        },
        //获取表格数据
        getTableData() {
            let params = Object.assign(
                { docFolderUid: this.selectedDemandDocFolderUid || 0, isCurrent: 1 },
                this.searchForm,
                {
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.current
                }
            );
            this.loading = true;
            //发送ajax 请求
            console.log("params:" + JSON.stringify(params));
            this.$http
                .postBody("/bs/deprecated/goal/list", params)
                .then(data => {
                    this.pagination.total = data.total;
                    this.tblData = data.rows;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //添加文档保存
        handleSubmit(e) {
            e.preventDefault();
            this.$refs.demandAdd.addForm.validateFields((err, values) => {
                if (!err) {
                    //将目录信息添加到
                    if (!this.addFormData.uid) { //如果没有uid的情况说明是添加，需要赋值 docFolderUid
                        Object.assign(values, { docFolderUid: this.selectedDemandDocFolderUid });  //添加的时候设置父级目录ID
                    }
                    console.log("数据：" + JSON.stringify(values));
                    this.confirmLoading = true;
                    this.$http
                        .postForm("/bs/deprecated/goal/add", values)
                        .then(() => {
                            this.$message.success("新增成功", 2);
                            this.addModelVisible = false;
                            this.confirmLoading = false;
                            this.getTableData();
                        })
                        .catch(() => {
                            this.confirmLoading = false;
                        });
                }
            });
        },
        //获取目录树数据
        getFolderTreeData() {
            this.$http.postBody("/bs/demandDocFolder/tree").then(data => {
                //清空之前选中状态值
                // this.selectedDemandDocFolderUid = "";
                this.folderTreeData = data;
            });
        },
        // 准备弹出发布新版本界面
        toPublish(doc) {
            this.$http.postBody("/bs/demandDoc/checkBeforePublish", { docUid: doc.uid }).then((data) => {
                this.postNewVersion = true;
                this.newVersionFormData = {
                    docUid: doc.uid,
                    edition: genNextEditionNo(doc.latestPublishEdition),
                    comm: ""
                };
                this.$nextTick(() => {
                    this.newVersionForm.setFieldsValue(this.newVersionFormData);
                });
            })
        },
        // 处理点击更多 菜单中的按钮
        handleMoreMenuClick: () => { },
        handleUploadChange(info) {
            console.log(info.file.status, "--------------------------", info);
            console.log(info.file.response)
            if (info.file.status === "done" && info.file.response) {
                this.getTableData();
                this.$message.success("导入成功！", 2);
            }
        }
    },
    created() {
        this.$nextTick(() => {
            // //初始化form表单
            // this.addForm = this.$form.createForm(this, { name: "addFormData" });
            this.treeForm = this.$form.createForm(this, { name: 'treeFormData' });
            this.newVersionForm = this.$form.createForm(this, { name: 'newVersionFormData' });
        });
        this.getFolderTreeData();
    }
};
// 计算新版本号
function genNextEditionNo(edition) {
    let newCode = '1.0.0.0';
    if (edition) {
        let codeFormat = /(\d+)(\D*)$/;         // 最后的数字
        let firstCodeNo = edition.match(codeFormat)[1],       //  0001
            suffix = edition.match(codeFormat)[2],
            index = parseInt(firstCodeNo);
        newCode = edition.replace(codeFormat, index + 1) + suffix;
    }
    return newCode;
}
</script>
