<template>
  <div class="page-main page-demand-list">
    <div class="container-left">
      <h2 class="title">目标目录</h2>
      <a-button-group>
        <a-button size="small" type="primary">
          <a-icon type="plus"/>
          添加
        </a-button>
        <a-button size="small">
          <a-icon type="edit"/>
          编辑
        </a-button>
        <a-button size="small" type="danger">
          <a-icon type="delete"/>
          删除
        </a-button>
      </a-button-group>
      <a-directory-tree multiple defaultExpandAll @select="onSelect" @expand="onExpand">
        <a-tree-node title="parent 0" key="0-0">
          <a-tree-node title="leaf 0-0" key="0-0-0" isLeaf/>
          <a-tree-node title="leaf 0-1" key="0-0-1" isLeaf/>
        </a-tree-node>
        <a-tree-node title="parent 1" key="0-1">
          <a-tree-node title="leaf 1-0" key="0-1-0" isLeaf/>
          <a-tree-node title="leaf 1-1" key="0-1-1" isLeaf/>
        </a-tree-node>
      </a-directory-tree>
    </div>
    <div class="container-content">
      <div class="content-search-bar">
        <a-form layout="inline" :form="form">
          <a-form-item label="筛选">
            <a-input
              v-decorator="[
          'price',
          {
          },
        ]"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary">
              查询
            </a-button>
            <a-button type="success" style="margin-left: 16px;">
              <a-icon type="plus"/>
              添加文档
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="content-search-result">
        <a-table
          :columns="columns"
          :rowKey="record => record.login.uuid"
          :dataSource="data"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template slot="name" slot-scope="name">
            {{name.first}} {{name.last}}
          </template>
          <template slot="action" slot-scope="text, record,index">
            <a href="javascript:;">编辑 一 {{record.gender}}</a>
            <a-divider type="vertical"/>
            <a href="javascript:;">发布</a>
            <a-divider type="vertical"/>
            <router-link :to="'/demand/detail/'+index">详细信息</router-link>
            <a-divider type="vertical"/>
            <a href="javascript:;">条目分解</a>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      sorter: true,
      width: '20%',
      scopedSlots: {customRender: 'name'},
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];

  export default {
    data() {
      return {
        form: this.$form.createForm(this, {name: 'advanced_search'}),
        data: [],
        pagination: {},
        loading: false,
        columns,
        folderTreeData:[],
      }
    },
    created() {
      this.fetch();
    },
    methods: {
      onSelect(keys) {
        console.log('Trigger Select', keys);
      },
      onExpand() {
        console.log('Trigger Expand');
      },

      handleTableChange(pagination, filters, sorter) {
        console.log(pagination);
        const pager = {...this.pagination};
        pager.current = pagination.current;
        this.pagination = pager;
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
      },
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        this.$http('https://randomuser.me/api', {
          results: 10,
          ...params,
        }).then(data => {
          const pagination = {...this.pagination};
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = 200;
          this.loading = false;
          this.data = data.results;
          this.pagination = pagination;
        });
      },
    },
  }
</script>
