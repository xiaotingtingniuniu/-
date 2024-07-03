<template>
  <section v-if="!isAgreement" class="register">
    <div class="register__title">
      <logo class="logoRegister" />
      <div class="word">一车一件</div>
    </div>
    <div class="register_login">
      <div v-if="!isPerfect">
        <p class="register-new">新用户注册</p>
        <el-input
          v-model.trim="registerPhoneNumber"
          :class="{ 'is-error': errorType === 'phoneNumber', 'font-bold': !!registerPhoneNumber }"
          maxlength="11"
          placeholder="请输入手机号"
          @keydown.native.enter="goRegister"
        />
        <div class="register__code">
          <el-input
            v-model.trim="registerCode"
            :class="{ 'is-error': errorType === 'code', 'font-bold': !!registerCode }"
            :placeholder="placeholder"
            maxlength="6"
            class="input__code"
            @keydown.native.enter="goRegister"
          />
          <button :disabled="isDisabled" class="btn-code" @click="getRegisterCode">
            <template v-if="btnCodeStatus === 'SEND'">获取短信验证码</template>
            <template v-else>{{ cooldown }}秒后重新获取</template>
          </button>
        </div>
        <el-input
          v-model.trim="registerNickName"
          class="nickname"
          :class="{ 'is-error': errorType === 'nickName', 'font-bold': !!registerPhoneNumber, }"
          maxlength="8"
          placeholder="请输入真实姓名（最多8个汉字）"
          @keydown.native.enter="goRegister"
        />
        <div v-if="!!errorMsg" class="login__extra">
          <div class="login__msg">
            <transition name="fade">
              <div v-if="!!errorMsg">
                <i class="el-icon-warning" />
                <span>{{ errorMsg }}</span>
              </div>
            </transition>
          </div>
        </div>
        <div class="register-checkbox">
          <el-checkbox v-model="isCheckedAgreement" class="register-check">我已阅读并同意</el-checkbox>
          <a class="agreement" @click="goAgreement">《注册服务协议》</a>
        </div>
        <button class="register-button" @click="goRegister">注册</button>
      </div>
      <div v-else-if="isPerfect" class="perfect">
        <p class="register-new">完善资料，马上体验</p>
        <el-cascader
          v-model="selectedOptions1"
          class="job-select"
          expand-trigger="hover"
          placeholder="请选择行业及岗位"
          :options="options1"
          :props="optionProps"
          @change="handleChange1"
        />
        <el-cascader v-model="value" placeholder="请选择工作所在地" :options="optionsArea" class="address-select" :props="{value:'name', label:'name'}" @change="handleChangeArea" />
        <el-input
          v-model.trim="invitationCode"
          maxlength="4"
          placeholder="请输入四位邀请码（选填）"
          @keydown.native.enter="perfectUserInfo"
        />
        <div v-if="!!errorMsg" class="login__extra">
          <div class="login__msg">
            <transition name="fade">
              <div v-if="!!errorMsg">
                <i class="el-icon-warning" />
                <span>{{ errorMsg }}</span>
              </div>
            </transition>
          </div>
        </div>
        <button class="register-button complete" @click="perfectUserInfo">完成，去使用</button>
      </div>
    </div>
    <div class="has-account" @click="gotoLogin">
      已有帐号登录
    </div>
    <footer class="copyright">© 明觉科技有限公司</footer>
  </section>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Cookies from 'js-cookie';
import Logo from '../components/Logo.vue';
import getParams from '../utils/get-params';
const COOLDOWN_TIME = 60;
const STATUS_SEND = 'SEND';
const BTN_CODE = 'btnCodeStatus';
const BTN_VOICE = 'btnVoiceStatus';
const PLACEHOLDER_CODE = '请输入 6 位短信验证码';

export default {
  components: {
    Logo,
  },
  data() {
    return {
      value: [],
      optionsArea: [],
      placeholder: PLACEHOLDER_CODE,
      [BTN_CODE]: STATUS_SEND,
      [BTN_VOICE]: STATUS_SEND,
      cooldown: COOLDOWN_TIME,
      job: '',
      options1: [],
      selectedOptions1: [],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'childRole',
      }, // 设置 Cascader 的中option的 key
      roleId: '', // 角色
      address: {}, // 地址
      isAgreement: false, // 是否展示协议 默认false
      perfectUserInfoCount: 0, // 记录点击‘完成，去使用’按钮的次数
    };
  },
  computed: {
    registerPhoneNumber: {
      get() {
        return this.$store.state.registerPhoneNumber;
      },
      set(value) {
        this.setRegisterPhoneNumber(value);
        this.clearError('phoneNumber');
      },
    },
    registerCode: {
      get() {
        return this.$store.state.registerCode;
      },
      set(value) {
        this.setRegisterCode(value);
        this.clearError('code');
      },
    },
    registerNickName: {
      get() {
        return this.$store.state.registerNickName;
      },
      set(value) {
        this.setRegisterNickName(value);
        this.clearError('nickName');
      },
    },
    isCheckedAgreement: {
      get() {
        return this.$store.state.isCheckedAgreement;
      },
      set(value) {
        this.setIsCheckedAgreement(value);
        this.clearError('agreement');
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
    invitationCode: {
      get() {
        return this.$store.state.invitationCode;
      },
      set(value) {
        console.log('value', value);
        this.setInvitationCode(value);
      },
    },
    isDisabled() {
      console.log('code', this[BTN_CODE] !== STATUS_SEND || this[BTN_VOICE] !== STATUS_SEND);
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
    const _this = this;
    if (this.isPerfect) {
      // 调用获取用户角色信息接口
      this.getRole(function (data) {
        _this.options1 = data;
      });
      // 获取省市区信息
      this.getAllAreaInfo(function (areaInfor) {
        const { areaList } = areaInfor;
        _this.optionsArea = areaList;
      });
    }
  },
  methods: {
    ...mapActions(['getVerificationCode', 'goRegister', 'getRegisterCodeMessage', 'getRole', 'getAllAreaInfo', 'toPerfectUserInfo', 'addPointByType']),
    ...mapMutations(['clearError', 'setRegisterPhoneNumber', 'setRegisterCode', 'setRegisterNickName', 'setIsCheckedAgreement', 'setIsPerfect', 'setInvitationCode']),
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
    getRegisterCode() {
      if (this.isDisabled) {
        return;
      }

      this.cdType = BTN_CODE;
      this.placeholder = PLACEHOLDER_CODE;
      this.getRegisterCodeMessage({
        onSuccess: () => {
          this.startCooldown();
        },
      });
    },
    gotoLogin() {
      const receipt = getParams('receipt');
      const type = getParams('type');
      if (receipt&&type) {
        window.location.replace(`login.html?receipt=${receipt}&type=${type}`);
      } else {
        window.location.replace('login.html');
      }
      Cookies.remove('auth');
    },
    handleChange1(value) {
      this.roleId = value[1];
    },
    handleChangeArea(value) {
      this.address = {
        province: value[0],
        city: value[1],
        district: value[2],
      };
    },
    perfectUserInfo() {
      if (this.perfectUserInfoCount === 0) {
        this.perfectUserInfoCount = 1;
        this.toPerfectUserInfo({
          address: this.address,
          invitationCode: this.invitationCode,
          roleId: this.roleId,
        });
        setTimeout(() => {
          this.perfectUserInfoCount = 0;
        }, 3000);
      }
    },
    goAgreement() {
      window.open('agreement.html');
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
.el-cascader-panel {
  height: 50vh;
}
</style>
<style lang="scss" scoped>
.register {
  .register__title {
    margin-bottom: 16px;
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
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    // position: relative;
    z-index: 1;
    box-sizing: border-box;
    // height: 402px;
    width: 448px;
    height:360px;
    padding: 20px 44px 20px 44px;
    // padding-bottom:0px;
    // padding: 50px 44px;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .register-new {
      font-size: 16px;
      line-height: 16px;
      color: #303233;
      text-align: center;
      margin-bottom: 12px;
    }
    .register-checkbox {
      width: 100%;
      margin-top: 32px;
      display: flex;
      justify-content: flex-start;
      .register-check {
        vertical-align: top;
      }
      .agreement {
        color: #919599;
        vertical-align: top;
        font-size: 12px;
        line-height: 22px;
        height: 21px;
        display: inline-block;
      }
      .agreement:hover {
        cursor: pointer;
        color: #ff6700;
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
        margin-left: 14px;
        padding: 13px;
        background: rgba(255, 103, 0, 0.02);
        border: 1px solid #ff6700;
        border-radius: 4px;
        border-radius: 4px;
        font-size: 14px;
        color: #ff6700;
      }
      .btn-code {
        height: 48px;
        width: 126px;
        // padding: 12px 0;
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
    .login__extra {
      width: 100%;
      margin-top: 8px;
      margin-bottom:-26px;
      div {
        color: $--color-error;
        display: flex;
        align-items: center;
        font-size: 12px;
        span {
          margin-left: 4px;
        }
      }
    }
    .register-button {
      width: 100%;
      height: 48px;
      line-height: 48px;
      color: #fff;
      box-sizing: content-box;
      padding: 0;
      background: #ff6700;
      box-shadow: 0 3px 6px 0 rgba(255, 72, 0, 0.44);
      border-radius: 4px;
      border-radius: 4px;
      margin-top: 9px;
    }
    .register-button.complete{
      margin-top:50px;
    }
    .nickname {
      margin-top: 7px;
    }

    /** 完善信息页面  */
    .perfect {
      width: 100%;
      .job-select,
      .address-select,
      .invitation-select {
        width: 100%;
      }
      .address-select {
        margin: 14px 0;
        line-height: 48px;
      }
      .job-select {
        line-height: 48px;
      }
      .invitation-select {
        margin-bottom: 37px;
      }
    }
  }
  .has-account {
    margin-top: 16px;
    width:120px;
    height:32px;
    line-height:32px;
    background-color: #FFFFFF;
    border: 1px solid #FF6700;
    border-radius: 4px;
    border-radius: 4px;
    font-size: 14px;
    color: #FF6700;
    text-align: center;
    &:hover {
        color: #FFFFFF;
        cursor: pointer;
        background: #FF6700;
        border: 1px solid #FF6700;
        border-radius: 4px;
        border-radius: 4px;
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
}
</style>