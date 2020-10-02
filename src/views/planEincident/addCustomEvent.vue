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
          <planevents :formClass="'custom-form-class basic-form'" 
          :spanCol="pspanCol"
          ref="defaultBasicForm"
          ></planevents>

          <event-attribute :showOperate="haveMulti"
           @addAttributeForm="addAttributeForm"
           @deleteAttributeForm="deleteAttributeForm"
           :formClass="'custom-form-class attribute-form'" 
           :curStep="curStep"
           ref="defaultAttributeForm"
           :id="'defaultAttribute1'"
           :spanCol="pspanCol"></event-attribute>

          <influence :formClass="'custom-form-class effect-form'"
            :showOperate="haveMulti"
            :curStep="curStep"
            ref="defaultEffectForm"
            :id="'defaultEffect1'"
            @addEffectForm="addEffectForm"
            @deleteEffectForm="deleteEffectForm"
          ></influence>

          <event-contraint :formClass="'custom-form-class constraint-form'"
           :showOperate="haveMulti"
           :curStep="curStep"
           ref="defaultContraintForm"
           :resId="$route.query.dictId"
           :id="'defaultContraint1'"
           @addContraintForm="addContraintForm"
           @deleteContraintForm="deleteContraintForm"
          ></event-contraint>
        </div>
        <div class="dialog-footer">
          <a-button type="default" @click="close()">取消</a-button>
          <a-button type="primary" :disabled="curStep == 1" @click="prev()">上一步</a-button>
          <a-button type="primary" :disabled="curStep == 4" @click="next()">下一步</a-button>
          <a-button type="primary" :disabled="curStep != 4" @click="save()">完成</a-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import planevents from "../../components/planEvent/planEventForm";
  import influence from "../../components/effect/effectForm";
  import eventContraint from "../../components/eventContraint/eventContraintForm";
  import eventAttribute from "../../components/eventAttribute/eventAttributeForm";
  import $ from 'jquery';
  import Vue from "vue";
  import StringUtil from "../../utils/StringUtil";
  import moment from "moment";
  export default {
    name: "addCustomEvent",
    data() {
      return {
        curStep: 1, 
        curTitle: '基本信息',
        pspanCol:{ span: 15 },
        showme: false,
        haveMulti: true,
        attributeCount: 1,
        attributes:[],
        contraintCount: 1,
        contraints:[],
        effectCount: 1,
        effects:[],

        attributesData: [],
        contraintsData: [],
        effectsData: [],
        isInit: true,
        activityInfo:{},
        planId: this.$route.query.id
      };
    },
    updated(){
      this.$nextTick(()=>{
        if(this.isInit){
          if(!this.attributes.length) this.attributes.push({formins: this.$refs.defaultAttributeForm,id: 'defaultAttribute1'});
          if(!this.contraints.length) this.contraints.push({formins: this.$refs.defaultContraintForm,id: 'defaultContraint1'});
          if(!this.effects.length) this.effects.push({formins: this.$refs.defaultEffectForm,id: 'defaultEffect1'});

          this.isInit = false;
        }
      })
    },
    mounted() {
      this.$eventBus.$off('addAttributeForm').$on('addAttributeForm',this.addAttributeForm);
      this.$eventBus.$off('deleteAttributeForm').$on('deleteAttributeForm',this.deleteAttributeForm);
      this.$eventBus.$off('addContraintForm').$on('addContraintForm',this.addContraintForm)
      this.$eventBus.$off('deleteContraintForm').$on('deleteContraintForm',this.deleteContraintForm)
      this.$eventBus.$off('addEffectForm').$on('addEffectForm',this.addEffectForm)
      this.$eventBus.$off('deleteEffectForm').$on('deleteEffectForm',this.deleteEffectForm)
    },
    components: {
      planevents,
      influence,
      eventContraint,
      eventAttribute
    },
    methods: {
      save(){
        let haveErr = false;
        if(this.curStep == 4){
          haveErr = this.validateConstraintsForms();
        }

        if(haveErr){
          this.showme = false;
          this.curStep = 1;
          this.changeTitle();
          let commitData = {
            activity: this.activityInfo,
            attributes: this.attributesData,
            constraints: this.contraintsData,
            effects: this.effectsData
          }

          this.$http.postBody("/bs/ns/plan/activity/saveActivityAllData", commitData).then(rst => {
            if (rst.code === 0) {
                this.$message.success('操作成功');
            } else {
                this.$message.error(rst.msg);
            }
          });
        }
      },
      addAttributeForm(){
        let childVue = Vue.extend(eventAttribute);
        $('.dialog-content').append('<div class="tmpattribute"></div>');
        let uuid = StringUtil.uuid();
        let childCom = new childVue({propsData:{
            spanCol: this.pspanCol,
            showOperate: this.haveMulti,
            formClass: 'custom-form-class attribute-form',
            curStep: this.curStep,
            id: uuid
        }
        }).$mount('.tmpattribute');
        this.attributeCount ++;
        this.attributes.push({formins: childCom,id: uuid});
        this.$nextTick(()=>{
          $('.dialog-content').scrollTop($('.dialog-content')[0].scrollHeight);
        })
      },
      deleteAttributeForm($forminstance){
        let tmpobj = [];
        if(this.attributeCount == 1){
          this.$warning({
            title: '提醒',
            content: '至少保留一个属性',
          });

          return;
        }
        
        this.attributeCount--;
        this.attributes.forEach((aitem) =>{
          if(aitem.id != $forminstance.id){
            tmpobj.push(aitem);
          }
        })
        this.attributes = tmpobj;
        $forminstance.$destroy();
        $($forminstance.$el).remove();
      },
      addEffectForm(){
        let childVue = Vue.extend(influence);
        $('.dialog-content').append('<div class="tmpinfluence"></div>');
        let uuid = StringUtil.uuid();
        let childCom = new childVue({propsData:{
            showOperate: this.haveMulti,
            formClass: 'custom-form-class effect-form',
            curStep: this.curStep,
            id: uuid
        }
        }).$mount('.tmpinfluence');
        this.effectCount ++;
        this.effects.push({formins: childCom,id: uuid});
        this.$nextTick(()=>{
          $('.dialog-content').scrollTop($('.dialog-content')[0].scrollHeight);
        })
      },
      deleteEffectForm($forminstance){
        let tmpobj = [];
        if(this.effectCount == 1){
          this.$warning({
            title: '提醒',
            content: '至少保留一个影响',
          });

          return;
        }
        
        this.effectCount--;
        this.effects.forEach((aitem) =>{
          if(aitem.id != $forminstance.id){
            tmpobj.push(aitem);
          }
        })
        this.effects = tmpobj;
        $forminstance.$destroy();
        $($forminstance.$el).remove();
      },
      addContraintForm(){
        let childVue = Vue.extend(eventContraint);
        $('.dialog-content').append('<div class="tmpcontraint"></div>');
        let uuid = StringUtil.uuid();
        let childCom = new childVue({propsData:{
            showOperate: this.haveMulti,
            formClass: 'custom-form-class constraint-form',
            curStep: this.curStep,
            id: uuid,
            resId: this.$route.query.dictId
        }
        }).$mount('.tmpcontraint');
        this.contraintCount ++;
        this.contraints.push({formins: childCom,id: uuid});
        this.$nextTick(()=>{
          $('.dialog-content').scrollTop($('.dialog-content')[0].scrollHeight);
        })
      },
      deleteContraintForm($forminstance){
        let tmpobj = [];
        if(this.contraintCount == 1){
          this.$warning({
            title: '提醒',
            content: '至少保留一个约束',
          });

          return;
        }
        
        this.contraintCount--;
        this.contraints.forEach((aitem) =>{
          if(aitem.id != $forminstance.id){
            tmpobj.push(aitem);
          }
        })
        this.contraints = tmpobj;
        $forminstance.$destroy();
        $($forminstance.$el).remove();
      },
      prev(){
        this.curStep--;
        this.changeTitle();
        this.showHideForm();
        $('.dialog-content').scrollTop(0);
      },
      next(){
        let haveErr = false;
        if(this.curStep == 1){
          haveErr = this.validateBasicForms();
          return;
        }
        if(this.curStep == 2){
          haveErr = this.validateAttributeForms();
        }
        if(this.curStep == 3){
          haveErr = this.validateEffectForms();
        }

        if(haveErr){
          this.curStep++;
          this.changeTitle();
          this.showHideForm();
          $('.dialog-content').scrollTop(0);
        }
      },
      showHideForm(){
        if(this.curStep == 1){
          $('.attribute-form').hide();
          $('.effect-form').hide();
          $('.constraint-form').hide();
          $('.basic-form').show();
        }

        if(this.curStep == 2){
          $('.attribute-form').show();
          $('.effect-form').hide();
          $('.constraint-form').hide();
          $('.basic-form').hide();
        }

        if(this.curStep == 3){
          $('.attribute-form').hide();
          $('.effect-form').show();
          $('.constraint-form').hide();
          $('.basic-form').hide();
        }

        if(this.curStep == 4){
          $('.attribute-form').hide();
          $('.effect-form').hide();
          $('.constraint-form').show();
          $('.basic-form').hide();
        }
      },
      validateBasicForms(){
        let rtnFlag = false;
        this.$refs.defaultBasicForm.submit().then((rs)=>{
          this.activityInfo = JSON.parse(JSON.stringify(rs));
          this.activityInfo.startTime = moment(this.activityInfo.startTime).format('YYYY-MM-DD HH:mm:ss');
          this.activityInfo.endTime = moment(this.activityInfo.endTime).format('YYYY-MM-DD HH:mm:ss');
          this.activityInfo.planId = this.planId;
          this.curStep++;
          this.changeTitle();
          $('.dialog-content').scrollTop(0);
        }).catch((e)=>{
          console.log(e);
        })
        return rtnFlag;
      },
      validateAttributeForms(){
        let rtnFlag = false;
        let _self = this;
        this.attributesData = [];
        this.attributes.forEach((aitem)=>{
          aitem.formins.form.validateFields((err,values)=>{
            if (!err) {
              let data = _self._handleString(values);
              _self.attributesData.push(data);
              rtnFlag = true;
            }
          })
        })
        //console.log('attributes arr : ' , this.attributesData);

        
        return rtnFlag;
      },
      validateEffectForms(){
        let rtnFlag = false;
        let _self = this;
        this.effectsData = [];
        this.effects.forEach((aitem)=>{
          aitem.formins.form.validateFields((err,values)=>{
            if (!err) {
              let data = _self._handleString(values);
              data.planId = this.planId;
              _self.effectsData.push(data);
              rtnFlag = true;
            }
          })
        })
        //console.log('effect arr : ' , this.effectsData);
       
        return rtnFlag;
      },
      validateConstraintsForms(){
        let rtnFlag = false;
        let _self = this;
        this.contraintsData = [];
        this.contraints.forEach((aitem)=>{
          aitem.formins.form.validateFields((err,values)=>{
            if (!err) {
              let data = this._handleString(values);
              data.planId = this.planId;
              _self.contraintsData.push(data);
              rtnFlag = true;
            }
          })
        })
        //console.log('constraint arr : ' , this.contraintsData);
        return rtnFlag;
      },
      changeTitle(){
        if(this.curStep == 1) this.curTitle = '基本信息';
        if(this.curStep == 2) this.curTitle = '属性';
        if(this.curStep == 3) this.curTitle = '影响';
        if(this.curStep == 4) this.curTitle = '约束';
      },
      show(){
        this.showme = true;
      },
      close(){
        let _self = this;
        this.$confirm({
          title: '提示',
          content: '所有已填信息将会丢失，确定关闭吗?',
          okText: "关闭",
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _self.showme = false;
          },
          onCancel() {},
        });
      },
      _handleString(data) {
        Object.keys(data).forEach((key) => {
          if (data[key] == void 0) {
            data[key] = "";
          }
        });
        return data;
      }
    }
  };
</script>

<style lang="css" scoped>
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