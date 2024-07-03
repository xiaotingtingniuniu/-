<template>
  <section v-if="isLogin" class="page_login">
    <main>
      <div class="login__title">
        <logo class="logo" />
        <div>一车一件</div>
      </div>
      <div class="login__form">
        <el-input
          v-model.trim="phoneNumber"
          :class="{ 'is-error': errorType === 'phoneNumber', 'font-bold': !!phoneNumber }"
          maxlength="11"
          placeholder="请输入手机号"
          @keydown.native.enter="login"
        >
          <i slot="prefix" class="el-input__icon icon-phone" />
        </el-input>
        <div class="form__code">
          <el-input
            v-model.trim="code"
            :class="{ 'is-error': errorType === 'code', 'font-bold': !!code }"
            :placeholder="placeholder"
            maxlength="6"
            class="input__code"
            @keydown.native.enter="login"
          >
            <i slot="prefix" class="el-input__icon icon-code" />
          </el-input>
          <button :disabled="isDisabled" class="btn-code" @click="getCode">
            <template v-if="btnCodeStatus === 'SEND'">获取短信验证码</template>
            <template v-else>{{ cooldown }}秒后重新获取</template>
          </button>
        </div>
        <div class="login__extra">
          <div class="login__msg">
            <transition name="fade">
              <div v-if="!!errorMsg">
                <i class="el-icon-warning" />
                <span>{{ errorMsg }}</span>
              </div>
            </transition>
          </div>
          <div :class="{ 'is-disabled': isDisabled }" class="btn-voice" @click="getVoiceCode">
            <template v-if="btnVoiceStatus === 'SEND'">接收语音验证码</template>
            <template v-else>{{ cooldown }}秒后重新获取</template>
          </div>
        </div>
      </div>
      <button class="btn-login" @click="loginFunction">登录</button>
    </main>
    <div class="register-btn" @click="goRegister">新用户注册</div>
    <footer class="copyright">© 明觉科技有限公司</footer>
  </section>
  <register v-else-if="isRegister" />
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Cookies from 'js-cookie';
import Logo from '../components/Logo.vue';
import { appVersion } from '../config/version';
import { local_types } from '../config/constant';
import Register from '../components/Register.vue';
import getParams from '../utils/get-params';

const COOLDOWN_TIME = 60;
const STATUS_SEND = 'SEND';
const BTN_CODE = 'btnCodeStatus';
const BTN_VOICE = 'btnVoiceStatus';
const PLACEHOLDER_CODE = '请输入 6 位短信验证码';
const PLACEHOLDER_VOICE = '请输入 4 位验证码';

export default {
  components: {
    Logo,
    Register,
  },
  data: () => ({
    isLogin: true, // 是否展示登录页面
    isRegister: false, // 是否展示注册页面
    placeholder: PLACEHOLDER_CODE,
    [BTN_CODE]: STATUS_SEND,
    [BTN_VOICE]: STATUS_SEND,
    cooldown: COOLDOWN_TIME,
    loginCount: 0, // 记录短时间内点击登录按钮次数
  }),
  computed: {
    phoneNumber: {
      get() {
        return this.$store.state.phoneNumber;
      },
      set(value) {
        this.setPhoneNumber(value);
        this.clearError('phoneNumber');
      },
    },
    code: {
      get() {
        return this.$store.state.code;
      },
      set(value) {
        this.setCode(value);
        this.clearError('code');
      },
    },
    isPerfect: {
      get() {
        return this.$store.state.isPerfect;
      },
      set(value) {
        this.setIsPerfect(value);
      },
    },
    isDisabled() {
      return this[BTN_CODE] !== STATUS_SEND || this[BTN_VOICE] !== STATUS_SEND;
    },
    errorMsg() {
      return this.$store.state.errorMsg;
    },
    errorType() {
      return this.$store.state.errorType;
    },
  },
  created() {
    localStorage.setItem(local_types.APP_VERSION, appVersion);
    const auth = Cookies.getJSON('auth');
    const receipt = getParams('receipt');
    const type = getParams('type');
    if (auth) {
      console.log('auth', auth);
      if (auth.registerType === '2' && auth.roleName.length < 1) {
        // console.log('跳转到完善信息页面');
        this.$store.commit('setIsPerfect', true);
        this.isRegister = true;
        this.isLogin = false;
      } else {
        if (receipt) {
          const { origin, pathname } = document.location;

          if (type === '2' || type === '3') {
            window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${receipt}&type=${type}#/quoted`;
          } else {
            window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${receipt}`;
          }
        } else {
          window.location.replace('index.html');
        }
      }
    }
  },
  methods: {
    ...mapActions(['getVerificationCode', 'login']),
    ...mapMutations(['clearError', 'setPhoneNumber', 'setCode', 'setIsPerfect']),
    initCooldown() {
      clearInterval(this[this.cdType]);
      this[this.cdType] = STATUS_SEND;
      this.cooldown = COOLDOWN_TIME;
    },
    startCooldown() {
      this.initCooldown();
      const cd = this.cooldown;
      const start = Date.now();
      this[this.cdType] = setInterval(() => {
        const now = Date.now();
        const timePassed = Math.floor((now - start) / 1000);
        if (timePassed < cd) {
          this.cooldown = cd - timePassed;
        } else {
          this.initCooldown();
        }
      }, 1000);
    },
    goRegister() {
      this.isLogin = false; // 隐藏登录页面
      this.isRegister = true; // 展示注册页面
      this.clearError('code');
      this.clearError('phoneNumber');
    },
    getCode() {
      if (this.isDisabled) {
        return;
      }

      this.cdType = BTN_CODE;
      this.placeholder = PLACEHOLDER_CODE;
      this.getVerificationCode({
        isVoice: false,
        onSuccess: () => {
          this.startCooldown();
        },
        onError: () => {
          this.initCooldown();
        },
      });
    },
    getVoiceCode() {
      if (this.isDisabled) {
        return;
      }

      this.cdType = BTN_VOICE;
      this.placeholder = PLACEHOLDER_VOICE;
      this.getVerificationCode({
        isVoice: true,
        onSuccess: () => {
          this.startCooldown();
        },
        onError: () => {
          this.initCooldown();
        },
      });
    },
    loginFunction() {
      if (this.loginCount === 0) {
        this.loginCount = 1;
        this.login();
        setTimeout(() => {
          this.loginCount = 0;
        }, 3000);
      }
    },
  },
};
</script>

<style lang="scss">
@import 'public.scss';
/**修改checkbox 默认样式*/
.register-checkbox {
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #ff6700;
    color: #ff6700;
    border-color: #ff6700;
  }
  .el-checkbox__inner:hover {
    border-color: #ff6700;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #ff6700;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #919599;
  }
  .el-checkbox {
    margin-right: 0;
  }
  .el-checkbox__label {
    color: #919599;
    font-size: 12px;
    line-height: 12px;
  }
  .register-check {
    vertical-align: top;
  }
}
</style>

<style lang="scss" scoped>
section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: $--color-background;
  overflow: hidden;
  flex-direction: column;
  min-width: 440px;
  .register-btn {
    margin-top: 20px;
    font-size: 14px;
    color: #ff6700;
    text-align: center;
    cursor: pointer;
    width: 120px;
    height: 32px;
    line-height: 32px;
    border: 1px solid #ff6700;
    border-radius: 4px;
    background-color: #ffffff;
  }
  .register-btn:hover {
    color: #ffffff;
    background: #ff6700;
  }
}
.register {
  .register__title {
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .logoRegister {
      height: 40px;
      width: 40px;
      border-radius: 8px;
    }
  }
  .word {
    font-size: 16px;
    color: #616366;
    text-align: center;
    line-height: 20px;
    margin-top: 8px;
  }
  .register_login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    height: 402px;
    width: 440px;
    padding: 28px 40px 40px 50px;
    // padding: 50px 44px;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .register-new {
      font-size: 16px;
      color: #303233;
      text-align: center;
      margin-bottom: 26px;
    }
    .register-checkbox {
      width: 100%;
      margin-top: 32px;
      display: flex;
      justify-content: flex-start;
      .agreement {
        color: #ff6700;
        vertical-align: top;
        font-size: 12px;
        line-height: 21px;
      }
      .agreement:hover {
        cursor: pointer;
      }
    }
    .el-input--prefix /deep/.el-input__inner {
      padding-left: 10px;
    }
    /deep/.el-input__inner {
      height: 48px;
      font-size: 14px;
    }
    .register__code {
      display: flex;
      width: 100%;
      margin-top: 14px;
      margin-bottom: 7px;
      /deep/.el-input__inner {
        width: 220px;
      }
      /deep/.btn-code {
        width: 126px;
        padding: 13px;
        background: rgba(255, 103, 0, 0.02);
        border: 1px solid #ff6700;
        border-radius: 4px;
        border-radius: 4px;
        font-size: 14px;
        color: #ff6700;
      }
    }
    .login__extra {
      width: 100%;
      margin-bottom: 0;
    }
    .register-button {
      width: 100%;
      height: 48px;
      line-height: 48px;
      color: #fff;
      box-sizing: content-box;
      padding: 0;
      background: rgba(255, 103, 0, 0.5);
      box-shadow: 0 3px 6px 0 rgba(255, 72, 0, 0.44);
      border-radius: 4px;
      border-radius: 4px;
      margin-top: 9px;
    }
    .nickname {
      margin-top: 7px;
    }
  }
  .has-account {
    margin-top: 24px;
    .word {
      font-size: 12px;
      color: #919599;
      text-align: center;
    }
    .login {
      font-size: 12px;
      color: rgba(255, 103, 0, 0.7);
      text-align: center;
      line-height: 17px;
    }
  }
}
main {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  height: 422px;
  width: 440px;
  padding: 50px 40px;
  border-radius: 2px;
  box-shadow: rgba($color: #000, $alpha: 0.1) 0 2px 4px;
  background-color: #fff;
}

.login__title {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    height: 60px;
    width: 60px;
    border-radius: 8px;
  }
  div {
    color: #616366;
    font-size: 20px;
    line-height: 1;
    margin-top: 14px;
  }
}
.login__form {
  position: relative;

  /deep/.el-input__prefix {
    left: 10px;

    .el-input__icon {
      display: block;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      transition: none;
    }

    .icon-phone {
      height: 16px;
      width: 16px;
      background-image: url('~@/images/icon_phone.png');
      background-size: contain;
    }

    .icon-code {
      height: 16px;
      width: 16px;
      background-image: url('~@/images/icon_code.png');
      background-size: contain;
    }
  }

  /deep/.el-input__inner {
    height: 48px;
    font-size: 14px;
    border: 1px solid #ced3d9;
    @include border-one-px;

    &:hover {
      border-color: $--color-placeholder;
    }

    &:focus {
      border-color: #449aff;
    }
  }

  .is-error /deep/.el-input__inner {
    border-color: $--color-error;
  }

  .form__code {
    display: flex;
    justify-content: space-between;
    margin: 14px 0 0 0;

    .input__code {
      width: 220px;
    }

    .btn-code {
      height: 48px;
      width: 126px;
      padding: 12px 0;
      border: 1px solid #ff6700;
      color: #ff6700;
      background-color: rgba(255, 103, 0, 0.02);

      &[disabled] {
        border-color: #dadfe6;
        color: #919599;
        background-color: #f0f2f5;
      }

      &:not([disabled]):hover {
        border-color: #ff6700;
        color: #fff;
        background-color: #ff6700;
      }
    }
  }
}

.login__extra {
  height: 32px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .login__msg {
    div {
      color: $--color-error;
      display: flex;
      align-items: center;
    }

    i {
      font-size: 16px;
    }

    span {
      margin-left: 4px;
      font-size: 12px;
      line-height: 1;
    }
  }

  .btn-voice {
    color: #616366;
    font-size: 12px;
    line-height: 1;
    transition: 0.1s;
    cursor: pointer;

    &:not(.is-disabled):hover {
      color: $--color-main;
    }

    &.is-disabled {
      color: #aaaeb3;
      cursor: not-allowed;
    }
  }
}

.btn-login {
  height: 48px;
  width: 360px;
  border-radius: 4px;
  box-shadow: rgba(255, 72, 0, 0.5) 0px 3px 6px;
  color: #fff;
  background-color: #ff6700;

  &:hover {
    background-color: #f25d00;
  }
}

footer {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  text-align: center;
  color: $--color-placeholder;
  font-size: 12px;
  line-height: 1;
}

.font-bold .el-input__inner {
  color: #000;
}
</style>
