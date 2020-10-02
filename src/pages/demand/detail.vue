<template>
  <div class="page-main page-demand-list">
    <div class="container-left">
      <h2 class="title">索引</h2>
      <div class="ant-list-split">
        <div @click="infoType=0"
             :class="{'active':infoType == 0}"
             class="ant-list-item flex-center pointer">基本信息</div>
        <div @click="infoType=1"
             :class="{'active':infoType == 1}"
             class="ant-list-item flex-center pointer">关联文档</div>
        <div @click="infoType=2"
             :class="{'active':infoType == 2}"
             class="ant-list-item flex-center pointer">版本管理</div>
        <div @click="infoType=3"
             :class="{'active':infoType == 3}"
             class="ant-list-item flex-center pointer">变更依据</div>
      </div>
    </div>
    <div class="container-content">
      <div class="content-search-result" v-if="!infoType">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-statistic
              title="名称"
              :value="demandDetail.name"
              style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="前缀标识"
              :value="demandDetail.date"
              style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="版本号"
              :value="demandDetail.date"
              style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="条目数"
              :value="demandDetail.date"
              style="margin-right: 50px"
            />
          </a-col>
          <a-col :span="8">
            <a-statistic
              title="备注数"
              :value="demandDetail.date"
              style="margin-right: 50px"
            />
          </a-col>
        </a-row>
      </div>
      <div class="content-search-result" v-if="infoType == 1">

      </div>
      <div class="content-search-result" v-if="infoType == 2">
        <a-button>关联上级文档</a-button>
        <a-button>解除关联</a-button>
      </div>
      <div class="content-search-result" v-if="infoType == 3">
        <a-button>关联上级文档</a-button>
        <a-button>解除关联</a-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        infoType:1,       // 默认显示第一个
        demandDetail:{},
      }
    },
    methods: {

    }
  }
</script>
