<template>
  <div class="login">
    <!-- bg -->
    <video class="first-video" src="../assets/img/Rallye.mp4" muted loop="loop" autoplay="autoplay"></video>
    <div class="login-bg">
      <div class="tp-left"></div>
      <div class="tp-right"></div>
      <div class="bt-left"></div>
      <div class="bt-right"></div>
    </div>
    <div class="radar-main"></div>
    <div class="time-bd"></div>
    <!-- /bg -->
    <!-- content -->
    <section class="sign-in">
      <div class="apply">系统登录</div>
      <div class="sign-in-main">
        <h3>作战方案兵棋推演</h3>
        <a-form :form="form" class="login-form" layout="vertical" @submit="login">
          <a-form-item>
            <a-input
              v-decorator="[
          'username',
          { rules: [{ required: true, message: '请输入用户名' }],initialValue: 'admin' },
        ]"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              type="password"
              v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码' }],initialValue: 'admin' },
        ]"
            ></a-input>
          </a-form-item>
          <a-button block class="btn" html-type="submit">登录</a-button>
        </a-form>
      </div>
    </section>
  </div>
</template>

<script>
import "../scss/logon.scss";
export default {
  name: "login",
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },

  created() {},
  methods: {
    // 登录
    login(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this._login(values);
        }
      });
      return false;
    },
    async _login(data) {
      console.log(data);
      this.$http.post("/mpts-manage/login", data).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
