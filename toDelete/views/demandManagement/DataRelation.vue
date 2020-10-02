<template>
  <div class="page-main page-data-relation">
    <div class="page-main-container">
      <h2>关系示意图</h2>
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-radio-group @change="onChange" v-model="value">
            <a-radio :value="1">当前文档</a-radio>
            <a-radio :value="2">相关文档</a-radio>
          </a-radio-group>
        </a-form-item>
<!--        <a-form-item>-->
<!--          层级：<a-input-number id="inputNumber" size="small"-->
<!--                          :min="1" :max="10" v-model="level" @change="onChange" />-->
<!--        </a-form-item>-->
        <a-form-item>
          <a-button type="primary" html-type="submit">刷新</a-button>
        </a-form-item>
      </a-form>
      <div class="data-title" v-if="value==2">
        <div class="item">上级文档</div>
        <div class="item">当前文档</div>
        <div class="item">下级文档</div>
      </div>
      <div id="mountNode"></div>
    </div>
  </div>
</template>
<script>
  import G6 from '@antv/g6';
  // 模拟数据
  function mockData(idx=1){
    let data = [];
    for(let i = 0;i< Math.floor(Math.random()*8+4);i++){
      let randomType = i==0? true : Math.random()>0.5
      let item = {
        id:idx+''+i,
        label: (randomType?'节次':'条目')+idx+'.'+i,
        x:idx==1?100*idx:100*idx*2-100,
        y:30*(i+1),
        style:{},
      }
      if(!randomType){
        item.style.fill = '#f8f8f8'
      }
      data.push(item)
    }
    return data
  }
  // 上级文档数据模拟
  let parentData = mockData()
  let currentData = mockData(2)
  let childrenData = mockData(3)

  export default {
    data() {
      return {
        graph:{},
        form: this.$form.createForm(this, { name: 'dataType' }),
        value:2,
        level:1,
        g6Data: null,
        docUid: null,
        docEditionUid: null
      }
    },
    mounted() {
      this.$nextTick(()=>{
        const data = {
          // 点集
          nodes: [

          ],
          // 边集
          edges: [
            // 表示一条从 node1 节点连接到 node2 节点的边
            {
              source: '11',
              target: '21',
            },
            {
              source: '11',
              target: '23',
            },
            {
              source: '31',
              target: '22',
            },
            {
              source: '33',
              target: '22',
            },
            {
              source: '32',
              target: '33',
              type:'quadratic',     // 通列表的指向需要使用此类型
              style:{
                endArrow:true,
                lineWidth:2,
              },
            },
          ],
        };

        data.nodes = parentData.concat(currentData).concat(childrenData)

        console.log(data.nodes);

        // 创建 G6 图实例
        this.graph = new G6.Graph({
          container: 'mountNode', // 指定图画布的容器 id，与第 9 行的容器对应
          // 画布宽高
          width: 800,
          height: 700,
          defaultNode: {
            type: 'rect',
          },
          defaultEdge:{
            type:'line',
            style:{
              endArrow:true,
              lineWidth:2,
            },
          },
        });
      })
    },
    created() {
      this.docUid = this.$route.params.docUid;
      this.docEditionUid = this.$route.params.docEditionUid;
      //请求到展示的数据
      this.requestData();
    },
    methods: {
      handleSubmit(){

      },
      onChange(){
          this.requestData();
      },
      requestData(){
        this.$http.postBody("/bs/demandDoc/relationData", {docUid: this.docUid, editionUid: this.docEditionUid, dataType: this.value==1?"curDoc":"relateDoc"}).then(data => {
          console.log("接收到的数据是：", data);
          // 读取数据
          this.graph.data(data.data);
          // 渲染图
          this.graph.render();
        });
      },
    },
  }
</script>
