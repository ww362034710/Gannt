<template>
    <div class="page-main page-demand-detail">
        版本选择: <a-select v-model="version.defaultValue" @change="event=>init(event)">
            <a-select-option v-for="item in version.data" :value="item.value">{{item.text}} </a-select-option>
        </a-select>
        <a-tabs defaultActiveKey="1" tabPosition="left" type="card">
            <a-tab-pane tab="基本信息" key="1">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-statistic title="名称" :value="base.model.docName" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="前缀标识" :value="base.model.docTagPrefix || '- '" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="版本号" :value="base.model.edition" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="条目数" :value="base.model.itemNum" style="margin-right: 50px" />
                    </a-col>
                    <a-col :span="8">
                        <a-statistic title="备注" :value="base.model.remark || '- '" style="margin-right: 50px" />
                    </a-col>
                </a-row>
            </a-tab-pane>
            <a-tab-pane tab="关联文档" key="2">
                <div class="content-search-bar" style="padding-top: 6px;padding-left: 0;">
                    <a-button type="primary" class="right-space" @click="fatherDoc.dialog.show=true">关联上级文档</a-button>
                    <a-button type="danger" @click="fatherDoc.unlink">解除关联</a-button>
                </div>
                <div class="title">上级文档列表</div>
                <a-table :columns="fatherDoc.table.columns" :pagination="fatherDoc.table.pagination" :loading="fatherDoc.table.loading" :dataSource="fatherDoc.table.data" :rowSelection="{type: 'radio', hideDefaultSelections: true, onChange: fatherDoc.table.selectionChange}" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="row=>fatherDoc.table.selection=row">
                </a-table>
                <div class="title">下级文档列表</div>
                <a-table :columns="childDoc.table.columns" :pagination="childDoc.table.pagination" :loading="childDoc.table.loading" :dataSource="childDoc.table.data" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="row=>childDoc.table.selection=row">
                </a-table>
            </a-tab-pane>
            <a-tab-pane tab="需求拆解" key="5">
                <Item :docUid="docUid" :docEditionUid="uid"></Item>
            </a-tab-pane>
            <a-tab-pane tab="版本管理" key="10">
                <div class="bottom-space">
                    <a-button type="primary" class="right-space" @click="toPublish">发布新版</a-button>
                </div>
                <a-table :columns="edition.table.columns" :pagination="edition.table.pagination" :loading="edition.table.loading" :dataSource="edition.table.data" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="row=>edition.table.selection=row">
                    <div slot="isCurrent" slot-scope="scope" class="main-table-btns">
                        {{scope.isCurrent?'否':'是'}}
                    </div>
                </a-table>
            </a-tab-pane>
            <a-tab-pane tab="变更管理" key="13">
                <AlterationManagement :docEditionUid="doc.newestEditionUid"></AlterationManagement>
            </a-tab-pane>
            <a-tab-pane tab="变更依据" key="15">
                <div class="title">变更依据</div>
                <div class="bottom-space">
                    <a-button type="primary" icon="search" @click="changeRecord.table.addRecord">上传</a-button>
                    <a-button icon="plus" style="margin-left:10px" @click="changeRecord.table.editRecord">查看</a-button>
                </div>
                <a-table :columns="changeRecord.table.columns" :pagination="changeRecord.table.pagination" :loading="changeRecord.table.loading" :dataSource="changeRecord.table.data" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="row=>changeRecord.table.selection=row">
                </a-table>
            </a-tab-pane>
            <a-tab-pane tab="附    件" key="20">
                <div class="title">附件列表</div>
                <div class="bottom-space">
                    <a-button type="primary" icon="search">上传</a-button>
                </div>
                <a-table :columns="attach.table.columns" :pagination="attach.table.pagination" :loading="attach.table.loading" :dataSource="attach.table.data" size="middle" :scroll="{y:true,x:500}" rowKey="uuid" @change="row=>attach.table.selection=row">
                </a-table>
            </a-tab-pane>
        </a-tabs>

        <!-- 关联上级文档 -->
        <a-modal title="关联上级文档" v-model="fatherDoc.dialog.show" :maskClosable="false" :width="800" :confirmLoading="fatherDoc.dialog.submitDisabled" @ok="fatherDoc.dialog.submit" okText="保存" cancelText="取消">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-table :columns="fatherDoc.dialog.docTable.columns" :pagination="fatherDoc.dialog.docTable.pagination" :loading="fatherDoc.dialog.docTable.loading" :dataSource="fatherDoc.dialog.docTable.data" :rowSelection="{type: 'radio', hideDefaultSelections: true, onChange: fatherDoc.dialog.docTable.selectionChange}" size="middle" :scroll="{y:true,x:500}" rowKey="uid">
                    </a-table>
                </a-col>
                <a-col :span="12">
                    <a-table :columns="fatherDoc.dialog.editionTable.columns" :pagination="fatherDoc.dialog.editionTable.pagination" :loading="fatherDoc.dialog.editionTable.loading" :dataSource="fatherDoc.dialog.editionTable.data" :rowSelection="{type: 'radio', hideDefaultSelections: true, onChange: fatherDoc.dialog.editionTable.selectionChange}" size="middle" :scroll="{y:true,x:500}" rowKey="uuid">
                    </a-table>
                </a-col>
            </a-row>
        </a-modal>

        <!-- 发布文档 -->
        <a-modal title="发布新版本" v-model="postNewVersion" :maskClosable="false" @ok="doPublish" okText="发布" cancelText="取消">
            <a-form :form="newVersionForm" :model="newVersionFormData">
                <a-form-item label="版本号：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['edition', {initialValue: '',rules: [{required: true,message: '必填'}]}]" placeholder="请输入版本号" />
                </a-form-item>
                <a-form-item label="版本简介" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-textarea v-decorator="['comm', {}]" placeholder="请输入版本简介" :autosize="{ minRows: 2, maxRows: 6 }" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 添加变更依据 -->
        <a-modal title="添加变更依据" v-model="changeRecord.dialog.show" :maskClosable="false" :confirmLoading="changeRecord.dialog.submitDisabled" @ok="changeRecord.dialog.submit()" okText="保存" cancelText="取消"
                 :destroyOnClose="true"
        >
            <a-form :form="changeRecord.dialog.form">
                <a-form-item label="标题：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['title', [{required: true,message: '必填'}]]" />
                </a-form-item>
                <a-form-item label="提出人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['requestPerson']" />
                </a-form-item>
                <a-form-item label="提出时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['requestDatetime']" />
                </a-form-item>
                <a-form-item label="提出地址：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['requestAddress']" />
                </a-form-item>
                <a-form-item label="接受人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['acceptor']" />
                </a-form-item>
                <a-form-item label="批准人：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['approvePerson']" />
                </a-form-item>
                <a-form-item label="备注：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-input allowClear v-decorator="['comm']" placeholder="请填写备注" :rows="4" />
                </a-form-item>
                <h3>附件</h3>
                <div v-if="changeRecord.dialog.model.uid">
                    <a-upload name="file^fileId" :action="'/bs/demandItemChangedRecord/addAttach?changeUid=' + changeRecord.dialog.model.uid" @change="changeRecord.dialog.attachUploadChange">添加附件</a-upload>
                    <a-table :columns="changeRecord.dialog.table.columns" :pagination="changeRecord.dialog.table.pagination" :loading="changeRecord.dialog.table.loading" :dataSource="changeRecord.dialog.table.data" size="middle" :scroll="{y:true,x:500}" rowKey="uid">
                        <div slot="action" slot-scope="scope" class="main-table-btns">
                            <a-button type="primary" size="small" @click="changeRecord.dialog.table.download(scope.row)" icon="edit">下载</a-button>
                            <a-button type="primary" size="small" @click="changeRecord.dialog.table.removeRecord(scope.row)" icon="edit">删除</a-button>
                        </div>
                    </a-table>
                </div>
                <div v-else>
                    <a-upload name="file^fileId" action="system/file/upload" @change="changeRecord.dialog.uploadChange">添加附件</a-upload>
                    <a-table :columns="changeRecord.dialog.table.columns" :pagination="changeRecord.dialog.table.pagination" :loading="changeRecord.dialog.table.loading" :dataSource="changeRecord.dialog.table.data" size="middle" :scroll="{y:true,x:500}" rowKey="uid">
                        <div slot="action" slot-scope="scope" class="main-table-btns">
                            <a-button type="primary" size="small" @click="changeRecord.dialog.table.download(scope)" icon="edit">下载</a-button>
                            <a-button type="primary" size="small" @click="changeRecord.dialog.table.removeSysFile(scope)" icon="edit">删除</a-button>
                        </div>
                    </a-table>
                </div>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import DemoIndex from "@/views/demo/Index";
import moment from 'moment';
import Item from './Item.vue';
import AlterationManagement from "./AlterationManagement";
export default {
    name: "demandManagementDetail",
    components: {
        Item,
        AlterationManagement
    },
    data() {
        return {
            uid: null,          // 该需求版本的uid
            docUid: null,       // 需求文档uid
            isCurrent: false,    // 是否是最新版
            doc: {},
            base: {
                model: {}
            },
            version: {
                defaultValue: "",
                data: [
                    // { value: "slkdfjlasjdf", text: "当前版本"},
                    // { value: "asdfhasjdoifjosdjf", text: "1.0.0.0"}
                ]
            },
            fatherDoc: {
                unlink: () => {
                    let selectedDoc = this.fatherDoc.table.selection;
                    if (!selectedDoc) {
                        return this.$message.warn("请选择一个上级文档");
                    }
                    this.$http.postBody("/bs/demandEdition/removeRelation", {
                        sourceEditionUid: this.uid,
                        targetEditionUid: selectedDoc.uid
                    }).then((rst) => {
                        this.whenSuccess(rst, () => {
                            this.fatherDoc.table.refresh();
                            this.$message.success(rst.msg);
                        });
                    }).catch((e) => {
                        console.error(e);
                        this.$message.error('系统异常, 请稍后再试');
                    })
                },
                table: {
                    loading: false,
                    columns: [
                        {
                            title: "名称",
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
                        }
                    ],
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
                    selection: null,
                    data: [],
                    pageSize: 1000,
                    total: 0,
                    pageNumber: 1,
                    style: {},
                    selectionChange: (selectedRowKeys, selectedRows) => {
                        this.fatherDoc.table.selection = selectedRows && selectedRows[0];
                    },
                    refresh: () => {
                        let table = this.fatherDoc.table;
                        let params = Object.assign({ childUid: this.uid }, {
                            pageNumber: table.pageNumber,
                            pageSize: table.pageSize
                        });
                        table.loading = true;
                        //发送ajax 请求
                        console.log("请求版本数据  参数:" + JSON.stringify(params));

                        this.$http.postBody('/bs/demandEdition/list', params).then(data => {
                            table.pagination.total = data.total;
                            table.data = data.rows;
                            table.loading = false
                        }).catch(() => {
                            table.loading = false
                        })
                    }
                },
                dialog: {
                    show: false,
                    submitDisabled: false,
                    docTable: {
                        loading: false,
                        columns: [
                            {
                                title: "名称",
                                dataIndex: "name"
                            },
                            {
                                title: "操作",
                                width: 350,
                                scopedSlots: { customRender: "action" }
                            }
                        ],
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
                        total: 0,
                        data: [],
                        params: {
                            uid: this.uid
                        },
                        selection: null, // 当前选中的文档
                        selectionChange: (selectedRowKeys, selectedRows) => {
                            this.fatherDoc.dialog.docTable.selection = selectedRows && selectedRows[0];
                            this.fatherDoc.dialog.editionTable.reload();
                        },
                        reload: () => {
                            let table = this.fatherDoc.dialog.docTable;
                            table.selection = null;
                            table.pageNumber = 1;
                            let params = Object.assign({ excludeRelatedDocs: this.docUid }, {
                                pageNumber: table.pageNumber,
                                pageSize: table.pageSize
                            });
                            table.loading = true;
                            //发送ajax 请求
                            console.log("请求可关联的需求文档  参数:" + JSON.stringify(params));

                            this.$http.postBody('/bs/demandDoc/list', params).then(data => {
                                table.total = data.total;
                                table.data = data.rows;
                                table.loading = false
                            }).catch(() => {
                                table.loading = false
                            })
                        }
                    },
                    editionTable: {
                        selection: null,
                        loading: false,
                        columns: [
                            {
                                title: "版本号",
                                dataIndex: "edition"
                            },
                            {
                                title: "操作",
                                width: 350,
                                scopedSlots: { customRender: "action" }
                            }
                        ],
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
                        total: 0,
                        data: [],
                        params: {
                            uid: this.uid
                        },
                        selectionChange: (selectedRowKeys, selectedRows) => {
                            this.fatherDoc.dialog.editionTable.selection = selectedRows && selectedRows[0];
                        },
                        reload: () => {
                            let docSelected = this.fatherDoc.dialog.docTable.selection;
                            if (!docSelected) return;

                            let table = this.fatherDoc.dialog.editionTable;
                            table.pageNumber = 1;
                            let params = Object.assign({ docUid: docSelected.uid }, {
                                pageNumber: table.pageNumber,
                                pageSize: table.pageSize
                            });
                            table.loading = true;
                            //发送ajax 请求
                            console.log("请求可关联的需求文档  参数:" + JSON.stringify(params));

                            this.$http.postBody('/bs/demandEdition/list', params).then(data => {
                                table.total = data.total;
                                table.data = data.rows;
                                table.loading = false
                            }).catch(() => {
                                table.loading = false
                            })
                        }
                    },
                    submit: () => {
                        let selectedEdition = this.fatherDoc.dialog.editionTable.selection;
                        if (!selectedEdition) {
                            return this.$message.warn('请选择一个文档及其版本');
                        }
                        console.log('selectedEdition', selectedEdition);
                        this.fatherDoc.dialog.submitDisabled = true;
                        // 发送到后台  进行关联
                        this.$http.postBody("/bs/demandEdition/addRelation", {
                            sourceDocUid: this.docUid,
                            sourceEditionUid: this.uid,
                            targetDocUid: selectedEdition.docUid,
                            targetEditionUid: selectedEdition.uid
                        }).then((rst) => {
                            this.whenSuccess(rst, () => {
                                // 关闭弹窗
                                this.fatherDoc.dialog.show = false;
                                // 刷新上级文档表格
                                this.fatherDoc.table.refresh();
                            });
                            this.fatherDoc.dialog.submitDisabled = false;
                        }).catch(() => {
                            this.$message.error('系统异常, 请稍后再试');
                            this.fatherDoc.dialog.submitDisabled = false;
                        })
                    }
                }
            },
            edition: {
                table: {
                    loading: false,
                    columns: [
                        { title: "版本", dataIndex: "edition", width: 140 },
                        { title: "被影响", dataIndex: "beInfluenced", width: 60 },
                        { title: "条目总数", dataIndex: "itemNum", width: 60 },
                        { title: "只读", width: 60, scopedSlots: { customRender: "isCurrent" } },
                        { title: "创建日期", dataIndex: "createTime", width: 140 },
                        { title: "创建人", dataIndex: "userId", width: 140 },
                        { title: "备注", dataIndex: "comm", width: 200 }
                    ],
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
                    data: [],
                    pageSize: 10,
                    total: 0,
                    pageNumber: 1,
                    style: {},
                    selectionChange: () => {
                    },
                    refresh: () => {
                        let table = this.edition.table;
                        let params = Object.assign({ docUid: this.docUid }, {
                            pageNumber: table.pageNumber,
                            pageSize: table.pageSize
                        });
                        table.loading = true;
                        //发送ajax 请求
                        console.log("请求版本数据  参数:" + JSON.stringify(params));

                        this.$http.postBody('/bs/demandEdition/list', params).then(data => {
                            table.total = data.total;
                            table.data = data.rows;
                            table.loading = false
                        }).catch(() => {
                            table.loading = false
                        })
                    }
                }
            },
            // 下级文档列表
            childDoc: {
                table: {
                    loading: false,
                    columns: [
                        {
                            title: "名称",
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
                        {
                            title: "操作",
                            width: 350,
                            scopedSlots: { customRender: "action" }
                        }
                    ],
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
                    selection: null,
                    data: [],
                    pageSize: 1000,
                    total: 0,
                    pageNumber: 1,
                    style: {},
                    selectionChange: (selections) => {
                        this.childDoc.table.selection = selections;
                    },
                    refresh: () => {
                        let table = this.childDoc.table;
                        let params = Object.assign({ fatherUid: this.uid }, {
                            pageNumber: table.pageNumber,
                            pageSize: table.pageSize
                        });
                        table.loading = true;
                        //发送ajax 请求
                        console.log("请求下级文档数据  参数:" + JSON.stringify(params));

                        this.$http.postBody('/bs/demandEdition/list', params).then(data => {
                            table.total = data.total;
                            table.data = data.rows;
                            table.loading = false
                        }).catch(() => {
                            table.loading = false
                        })
                    }
                }
            },
            // 变更依据
            changeRecord: {
                table: {
                    loading: false,
                    columns: [
                        { title: "标题", dataIndex: "title" },
                        { title: "提出人", dataIndex: "requestPerson" },
                        { title: "提出时间", dataIndex: "requestDatetime" },
                        { title: "影响的版本", dataIndex: "edition" },
                        { title: "接受人", dataIndex: "acceptor" },
                        { title: "批准人", dataIndex: "approvePerson" }
                    ],
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
                    selection: null,
                    data: [],
                    pageSize: 1000,
                    total: 0,
                    pageNumber: 1,
                    style: {},
                    selectionChange: (selections) => {
                        this.changeRecord.table.selection = selections;
                    },
                    refresh: () => {
                        let table = this.changeRecord.table;
                        let params = Object.assign({ effectEdition: this.uid }, {
                            pageNumber: table.pageNumber,
                            pageSize: table.pageSize
                        });
                        table.loading = true;
                        //发送ajax 请求
                        console.log("请求变更依据数据  参数:" + JSON.stringify(params));

                        this.$http.postBody('/bs/demandItemChangedRecord/list', params).then(data => {
                            table.total = data.total;
                            table.data = data.rows;
                            table.loading = false
                        }).catch(() => {
                            table.loading = false
                        })
                    },
                    addRecord: () => {
                        this.changeRecord.dialog.show = true;
                        console.log('constModel', this.changeRecord.dialog.constModel);
                        this.changeRecord.dialog.model = Object.assign({}, this.$options.data().changeRecord.dialog.model, this.changeRecord.dialog.constModel);
                        this.changeRecord.dialog.table.data = [];
                    },
                    // 查看/编辑
                    editRecord: () => {
                        let record = this.changeRecord.table.selection;
                        if (record) {
                            this.$http.postBody('/bs/demandItemChangedRecord/show', { uid: record.uid }).then((data) => {
                                if (data.data.requestDatetime) {
                                    data.data.requestDatetime = moment(data.data.requestDatetime).toDate();
                                }
                                this.copyModel(data.data, this.changeRecord.dialog.model, this.$options.data().changeRecord.dialog.model);

                                this.changeRecord.dialog.addAttachUrl = '/bs/demandItemChangedRecord/addAttach?changeUid=' + record.uid;
                                this.changeRecord.dialog.show = true;
                                this.changeRecord.dialog.table.refresh();
                            });
                        } else {
                            this.$message.warn('请先选择一条变更依据');
                        }
                    }
                },
                dialog: {
                    show: false,
                    submitDisabled: false,
                    addAttachUrl: null,
                    constModel: {
                        docUid: null,
                        effectEdition: null,
                    },
                    form: null,   // 后续初始化
                    model: {
                        uid: null,
                        title: null,
                        requestPerson: null,
                        requestDatetime: null,
                        requestAddress: null,
                        acceptor: null,
                        approvePerson: null,
                        comm: null
                    },
                    table: {
                        loading: false,
                        columns: [
                            { title: "文件名", dataIndex: "name" },
                            { title: "操作", scopedSlots: { customRender: "action" } }
                        ],
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
                        selection: null,
                        data: [],
                        pageSize: 1000,
                        total: 0,
                        pageNumber: 1,
                        style: {},
                        refresh: () => {
                            let changeRecord = this.changeRecord.table.selection;
                            let table = this.changeRecord.dialog.table;
                            let params = Object.assign({ changeUid: changeRecord.uid }, {
                                pageNumber: table.pageNumber,
                                pageSize: table.pageSize
                            });
                            table.loading = true;
                            //发送ajax 请求
                            console.log("请求变更依据附件数据  参数:" + JSON.stringify(params));

                            this.$http.postBody('/bs/demandItemChangedRecord/listFile', params).then(data => {
                                table.pagination.total = data.total;
                                table.data = data.rows;
                                table.loading = false
                            }).catch(() => {
                                table.loading = false
                            })
                        },
                        // 下载附件
                        download: (row) => {
                            window.open('system/file/download?id=' + row.id);
                        },
                        // 删除附件
                        removeRecord: (row) => {
                            let me = this;
                            this.requireObj(row, (record) => {
                                this.$confirm({
                                    title: '提示',
                                    content: '确定要删除该附件吗?',
                                    onOk() {
                                        me.$http.postForm("/bs/demandItemChangedRecord/removeAttach", {
                                            fileId: record.id,
                                            changeUid: me.changeRecord.dialog.model.uid
                                        }).then((rst) => {
                                            me.whenSuccess(rst, () => {
                                                me.changeRecord.dialog.table.refresh();
                                                me.$message.success("删除成功");
                                            });
                                        });
                                    },
                                    onCancel() { },
                                });
                            });
                        },
                        removeSysFile: (row) => {
                            let data = [];
                            this.changeRecord.dialog.table.data.forEach(sysFile => {
                                if (sysFile.id != row.id){
                                    data.push(sysFile);
                                }
                            });
                            this.changeRecord.dialog.table.data = data;
                        }
                    },
                    uploadChange: (info) => {
                        console.log(info.file.status, "--------------------------", info);
                        console.log(info.file.response)
                        if (info.file.status === "done" && info.file.response) {
                            this.whenSuccess(info.file.response, data => {
                                let table = this.changeRecord.dialog.table;
                                table.data.push(data.sysFile);
                                table.total++;
                            });
                        }
                    },
                    // 附件的上传状态改变
                    attachUploadChange: (file, fileList, e) => {
                        console.log('file upload ', file, fileList, e);
                        this.changeRecord.dialog.table.refresh();
                    },
                    submit: () => {
                        this.changeRecord.dialog.form.validateFields((errors, values) => {
                            console.log('values', values);
                            if (!errors) {
                                //设置提交按钮不可用
                                this.changeRecord.dialog.submitDisabled = true;
                                let action = this.changeRecord.dialog.model.uid ? '/edit' : '/add';
                                console.log('debug', this.changeRecord.dialog.model, this.changeRecord.dialog.constModel);
                                let fileIds = [];
                                this.changeRecord.dialog.table.data.forEach(sysFile => {
                                    fileIds.push(sysFile.id)
                                });
                                let model = Object.assign({}, values, this.changeRecord.dialog.constModel, {sysFileIds: fileIds});
                                this.$http.postBody('/bs/demandItemChangedRecord' + action, model).then(rst => {
                                    this.whenSuccess(rst, (data) => {
                                        if (data.requestDatetime) {
                                            data.requestDatetime = moment(data.requestDatetime).toDate();
                                        }
                                        this.copyModel(data, this.changeRecord.dialog.model, this.$options.data().changeRecord.dialog.model);
                                        //this.changeRecord.dialog.addAttachUrl = '/bs/demandItemChangedRecord/addAttach?changeUid=' + data.uid;
                                        // 刷新表格数据
                                        this.changeRecord.table.refresh();
                                        // 关闭添加
                                        this.changeRecord.dialog.show = false;
                                    });
                                    //保存按钮可用
                                    this.changeRecord.dialog.submitDisabled = false;
                                }).catch((e) => {
                                    console.error(e);
                                    this.$message.error("系统异常, 请稍后再试");
                                    this.changeRecord.dialog.submitDisabled = false;
                                })
                            }
                        })
                    }
                }
            },
            // 附件
            attach: {
                table: {
                    loading: false,
                    columns: [
                        {
                            title: "名称",
                            dataIndex: "docName"
                        },
                        {
                            title: "文件类型",
                            dataIndex: "docType"
                        },
                        {
                            title: "备注",
                            dataIndex: "comm"
                        }
                    ],
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
                    selection: null,
                    data: [
                        { docName: '实验说明书.docx', docType: 'docx' },
                        { docName: '关于XX实验的延期通知.docx', docType: 'docx' },
                        { docName: '实验采集数据模板.xls', docType: 'xls' },
                        { docName: '最新数据格式.docx', docType: 'docx' },
                    ],
                    pageSize: 1000,
                    total: 4,
                    pageNumber: 1,
                    style: {},
                    selectionChange: (selectedRowKeys, selectedRows) => {
                        this.fatherDoc.table.selection = selectedRows && selectedRows[0];
                    },
                    refresh: () => {
                        let table = this.fatherDoc.table;
                        let params = Object.assign({ childUid: this.uid }, {
                            pageNumber: table.pageNumber,
                            pageSize: table.pageSize
                        });
                        table.loading = true;
                        //发送ajax 请求
                        console.log("请求版本数据  参数:" + JSON.stringify(params));

                        this.$http.postBody('/bs/demandEdition/list', params).then(data => {
                            table.pagination.total = data.total;
                            table.data = data.rows;
                            table.loading = false
                        }).catch(() => {
                            table.loading = false
                        })
                    }
                },
                dialog: {
                    show: false,
                    submitDisabled: false,
                    docTable: {
                        loading: false,
                        columns: [
                            {
                                title: "名称",
                                dataIndex: "name"
                            },
                            {
                                title: "操作",
                                width: 350,
                                scopedSlots: { customRender: "action" }
                            }
                        ],
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
                        total: 0,
                        data: [],
                        params: {
                            uid: this.uid
                        },
                        selection: null, // 当前选中的文档
                        selectionChange: (selectedRowKeys, selectedRows) => {
                            this.fatherDoc.dialog.docTable.selection = selectedRows && selectedRows[0];
                            this.fatherDoc.dialog.editionTable.reload();
                        },
                        reload: () => {
                            let table = this.fatherDoc.dialog.docTable;
                            table.selection = null;
                            table.pageNumber = 1;
                            let params = Object.assign({ excludeRelatedDocs: this.docUid }, {
                                pageNumber: table.pageNumber,
                                pageSize: table.pageSize
                            });
                            table.loading = true;
                            //发送ajax 请求
                            console.log("请求可关联的需求文档  参数:" + JSON.stringify(params));

                            this.$http.postBody('/bs/demandDoc/list', params).then(data => {
                                table.total = data.total;
                                table.data = data.rows;
                                table.loading = false
                            }).catch(() => {
                                table.loading = false
                            })
                        }
                    },
                    editionTable: {
                        selection: null,
                        loading: false,
                        columns: [
                            {
                                title: "版本号",
                                dataIndex: "edition"
                            },
                            {
                                title: "操作",
                                width: 350,
                                scopedSlots: { customRender: "action" }
                            }
                        ],
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
                        total: 0,
                        data: [],
                        params: {
                            uid: this.uid
                        },
                        selectionChange: (selectedRowKeys, selectedRows) => {
                            this.fatherDoc.dialog.editionTable.selection = selectedRows && selectedRows[0];
                        },
                        reload: () => {
                            let docSelected = this.fatherDoc.dialog.docTable.selection;
                            if (!docSelected) return;

                            let table = this.fatherDoc.dialog.editionTable;
                            table.pageNumber = 1;
                            let params = Object.assign({ docUid: docSelected.uid }, {
                                pageNumber: table.pageNumber,
                                pageSize: table.pageSize
                            });
                            table.loading = true;
                            //发送ajax 请求
                            console.log("请求可关联的需求文档  参数:" + JSON.stringify(params));

                            this.$http.postBody('/bs/demandEdition/list', params).then(data => {
                                table.total = data.total;
                                table.data = data.rows;
                                table.loading = false
                            }).catch(() => {
                                table.loading = false
                            })
                        }
                    },
                    submit: () => {
                        let selectedEdition = this.fatherDoc.dialog.editionTable.selection;
                        if (!selectedEdition) {
                            return this.$message.warn('请选择一个文档及其版本');
                        }
                        console.log('selectedEdition', selectedEdition);
                        this.fatherDoc.dialog.submitDisabled = true;
                        // 发送到后台  进行关联
                        this.$http.postBody("/bs/demandEdition/addRelation", {
                            sourceDocUid: this.docUid,
                            sourceEditionUid: this.uid,
                            targetDocUid: selectedEdition.docUid,
                            targetEditionUid: selectedEdition.uid
                        }).then((rst) => {
                            this.whenSuccess(rst, () => {
                                // 关闭弹窗
                                this.fatherDoc.dialog.show = false;
                                // 刷新上级文档表格
                                this.fatherDoc.table.refresh();
                            });
                            this.fatherDoc.dialog.submitDisabled = false;
                        }).catch(() => {
                            this.$message.error('系统异常, 请稍后再试');
                            this.fatherDoc.dialog.submitDisabled = false;
                        })
                    }
                }
            },
            // 发布新版本
            postNewVersion: false,
            // 发布新版本的表单组件
            newVersionForm: null,
            // 发布新版的数据对象
            newVersionFormData: {
                edition: null,
                common: null
            },

            change: {},
            transitionName: 'transitionLeft',
            activeIndex: 0,
            // 打开发布新版本窗口
            openPublish: () => {
                // 发布前检测
                this.$http.postBody("/bs/demandDoc/checkBeforePublish", { docUid: this.docUid }).then((data) => {
                    if (data.code === 0) {
                        this.publishForm.model.docUid = this.uid;

                        this.publishForm.model.edition = genNextEditionNo(row.latestPublishEdition);
                        // 弹出发布窗口
                        this.publishForm.show = true;

                    } else {
                        this.$message.alert({
                            title: "系统提示",
                            icon: "error",
                            msg: data.msg
                        });
                    }
                })
            },
        };
    },
    watch: {
        "fatherDoc.dialog.show"(n) {
            console.log('n2', n);
            // 当show变为true  意为打开窗口前  都清空弹窗数据
            if (n) {
                this.fatherDoc.dialog.docTable.selection = this.$options.data().fatherDoc.dialog.docTable.selection;
                this.fatherDoc.dialog.docTable.reload();
                this.fatherDoc.dialog.editionTable.data = [];
            }
        }
    },
    computed: {

    },
    created() {
        this.initDetail()
    },
    mounted() {
        console.log('---mounted');
    },
    activated() {
        /** 
         *已经将 传入的参数uid 保存在了 uid 中
         *如果两次uid 不一致则重新调用init
        */
        if (this.$route.params.uid !== this.uid) {
            console.log("激活刷新");
            this.initDetail();
        } else if (this.uid === "") {
            console.log('初次进入');
        }
    },
    methods: {
        initDetail() {
            this.newVersionForm = this.$form.createForm(this, { name: 'newVersionFormData' });
            this.changeRecord.dialog.form = this.$form.createForm(this, { name: 'changeRecord.dialog.model' });
            this.init(this.$route.params.uid);
        },
        // 加载某个需求   初始化页面
        init(editionUid) {
            console.log('init...', editionUid);
            if (!editionUid) return;
            console.log('Doc/BaseInfo.init(), editionUid: ', editionUid);
            this.uid = editionUid;
            // 根据docUid获取最新版本的uid
            this.$http.postBody("/bs/demandEdition/show", { uid: this.uid }).then((data) => {
                this.docUid = data.data.docUid;
                // 获取版本列表
                this.$http.postBody("/bs/demandEdition/list", { docUid: this.docUid })
                    .then((data) => {
                        this.version.data = data.rows.map((it) => {
                            return {
                                value: it.uid,
                                text: it.edition
                            }
                        });
                        this.version.defaultValue = this.uid;
                    });
                // 获取文档信息
                this.$http.postBody("/bs/demandDoc/show", { uid: this.docUid }).then((data) => {
                    this.doc = data.data;
                    console.log('this.doc', this.doc);
                });
                this.isCurrent = data.data.isCurrent === 1;
                this.base.model = data.data;

                let { docUid, uid: effectEdition } = data.data;
                this.changeRecord.dialog.constModel = { docUid, effectEdition };

                this.getDetailData();

                // 获取版本列表
                this.$http.postBody("/bs/demandEdition/list", { docUid: this.docUid })
                    .then((data) => {
                        this.version.data = data.rows.map((it) => {
                            return {
                                value: it.uid,
                                text: it.edition
                            }
                        });
                        this.version.defaultValue = this.uid;
                    });
            })
        },
        //设置切换
        slideTabs(index) {
            if (this.activeIndex === index) return;
            this.transitionName = this.activeIndex > index ? 'transitionRight' : 'transitionLeft'
            this.activeIndex = index;
        },
        //获取详情数据
        getDetailData() {
            this.fatherDoc.table.refresh();
            this.edition.table.refresh();
            this.childDoc.table.refresh();
            this.changeRecord.table.refresh();
        },
        // 准备弹出发布新版本界面
        toPublish() {
            this.$http.postBody("/bs/demandDoc/checkBeforePublish", { docUid: this.doc.uid }).then(() => {
                this.postNewVersion = true;
                this.newVersionFormData = {
                    docUid: this.doc.uid,
                    edition: genNextEditionNo(this.doc.latestPublishEdition),
                    comm: ""
                };
                this.$nextTick(() => {
                    this.newVersionForm.setFieldsValue(this.newVersionFormData);
                });
            })
        },
        // 发布新版
        doPublish() {
            this.newVersionForm.validateFields((err, values) => {
                if (!err) {
                    console.log('demandManagement/index doPublish(): ', this.newVersionFormData);
                    this.$http.postBody('/bs/demandDoc/publish', this.newVersionFormData).then((rst) => {
                        this.whenSuccess(rst, (data) => {
                            this.$message.success("发布成功");
                            this.postNewVersion = false;
                            this.init(data.uid);
                        });
                    })
                }
            });
        },
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
