<template>
  <div class="custom-event" v-show="showme">
    <div class="custom-event-overlay" @click="close()" v-if="showme"></div>
    <transition name="smallTolarge">
      <div class="custom-event-dialog" v-if="showme">
        <div class="dialog-title">
          <div class="txt">{{curTitle}}</div>
          <a-icon type="close" @click="close()"/>
        </div>
        <div class="dialog-content">
          <addResources :formClass="'custom-form-class'" 
          :showtitle="showtitle" @update="_update1"
          :item="selectedItem"
          ref="resForm"></addResources>
        </div>
        <div class="dialog-footer">
          <a-button type="default" @click="close()">取消</a-button>
          <a-button type="primary" @click="save($event)">提交</a-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import addResources from "../../views/modelDetail/addResources";
export default {
  name: "resourceForm",
  components: {
    addResources
  },
  props:['rid'],
  data() {
    return {
      showme:false,
      showtitle: false, 
      curTitle: '新增资源',
      selectedItem: {}
    }
  },
  mounted(){

  },
  methods: {
    show(rid,name){
      this.showme = true;
      if(rid){
        this.curTitle = '编辑资源';
        this.selectedItem.key = rid;
        this.selectedItem.name = name;
      }
    },
    _update1(){
      this.$emit("updateTable");
      this.close();
    },
    save(e){
      this.$refs.resForm.handleSubmit(e);
    },
    close(){
      this.showme = false;
    }
  }
}
</script>

<style scoped>
 @import '../../scss/animate.css';
  .smallTolarge-enter-active {
    animation: smallTolarge 0.4s ease;
    -webkit-animation: smallTolarge 0.4s ease;
  }
  .smallTolarge-leave-active {
    animation: largeToSmall 0.4s ease;
    -webkit-animation: largeToSmall 0.4s ease;
  }
  @keyframes smallTolarge {
    0% {
      opacity: 0;
      transform:scale(0);
    }
    100% {
      opacity: 1;
      transform:scale(1);
    }
  }
  @keyframes largeToSmall {
    0% {
      opacity: 1;
      transform:scale(1);
    }
    100% {
      opacity: 0;
      transform:scale(0);
    }
  }
  .custom-event-overlay {z-index: 9999;position: fixed;left: 0;top: 0;width: 100vw;height: 100vh;background: rgba(0, 0, 0, .6);}
  .custom-event{position: fixed;left: 0;top: 0;width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;}
  .custom-event .custom-event-dialog{background: #fff;width: 70em;height: 40em;border-radius: 6px;z-index: 10000;}
  .custom-event .custom-event-dialog .dialog-title{border-bottom: 1px solid #e8e8e8;height: 3.7em;width: 100%;display: flex;align-items: center;justify-content: space-around;font-size: 16px;color: rgba(0,0,0,.85);}
  .custom-event .custom-event-dialog .dialog-title .txt{margin-left: 20px;margin-right:auto;}
  .custom-event .custom-event-dialog .dialog-title i{margin-right: 20px;cursor: pointer;}
  .custom-event .custom-event-dialog .dialog-content{flex-direction: column;justify-content: unset;height: 31.5em;overflow-x:hidden;overflow-y: auto;display: flex;align-items: center;}
  .custom-event .custom-event-dialog .dialog-footer{height: 4.3em;width: 100%;display: flex;align-items: center;justify-content: flex-end;border-top: 1px solid #e8e8e8;}
  .custom-event .custom-event-dialog .dialog-footer button{margin-right:10px}
  .custom-event .custom-event-dialog .dialog-footer button:first-child{margin-left: auto;}
  .custom-event .custom-event-dialog .dialog-footer button:last-child{margin-right: 20px;}
  .custom-form-class{width: 100%;height: 100%;}
  >>> .custom-form-class .ant-form-item:first-child{margin-top: 24px;}
  >>> .custom-form-class .flex .ant-form-item:first-child{margin-top: 0;}
  >>> .custom-form-class .flex{display: flex;}
  >>> .custom-form-class .flex .ant-form-item{width: 50%;}
</style>