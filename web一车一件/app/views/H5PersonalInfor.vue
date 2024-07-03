<template>
  <div class="personal">
    <van-field v-model="quotedUserInfor.name" label="联系人" readonly class="name" :border="false" />
    <van-cell-group>
      <van-field v-model="quotedUserInfor.phoneNumber" type="tel" label="手机号" placeholder="请输入手机号" maxlength="11" :border="false" readonly clickable autofocus @touchstart.native.stop="show = true" />
      <van-number-keyboard v-model="quotedUserInfor.phoneNumber" :show="show" :maxlength="11" @blur="show = false" />
    </van-cell-group>
    <van-field v-model="quotedUserInfor.wechat" label="微信" placeholder="请输入微信号（选填）" maxlength="20" :border="false" />
    <van-cell-group>
      <van-field v-model="quotedUserInfor.qq" label="QQ" placeholder="请输入QQ号（选填）" maxlength="20" />
    </van-cell-group>
    <van-popup v-if="quoted_status === 3" v-model="popup" position="bottom" class="popup" @close="closePop">
      <img :src="imgSendBack" alt class="send-img" @click="commit">
      <div class="word">发回给询价人</div>
      <div class="cancel" @click="cancel">取消</div>
    </van-popup>
    <van-popup v-if="quoted_status === 5" v-model="popup1" position="bottom" :close-on-click-overlay="false" class="popup">
      <img v-clipboard:copy="shareUrl" v-clipboard:success="onCopySuccess" v-clipboard:error="onError" :src="imgLink" alt class="send-img">
      <div class="word">复制链接</div>
      <div class="cancel" @click="complete">完成</div>
    </van-popup>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { Toast, Dialog } from 'vant';
import { mapMutations, mapActions } from 'vuex';

import { getUserInfoH5, getUserInfo } from '../api/user';
import { response_code } from '../config/constant';
import getParams from '../utils/get-params';

import imgSendBack from '../images/icon_sent back@2x.png';
import imgLink from '../images/icon_link@2x.png';

export default {
  data: () => ({
    popup: false,
    popup1: false,
    show: false,
    shareUrl: '',
    imgSendBack,
    imgLink,
  }),
  computed: {
    quoted_status: {
      get() {
        return this.$store.state.quoted_status;
      },
      set(value) {
        this.setQuoted_status(value);
      },
    },
    toBeQuotedData: {
      get() {
        return this.$store.state.toBeQuotedData;
      },
      set(value) {
        this.setToBeQuotedData(value);
      },
    },
    quotedUserInfor: {
      get() {
        return this.$store.state.quotedUserInfor;
      },
      set(value) {
        this.setQuotedUserInfor(value);
      },
    },
  },
  watch: {
    quoted_status(value) {
      console.log('value', value);
      if (value === 3) {
        this.popup = true;
        this.popup1 = false;
      } else if (value === 5) {
        this.popup = false;
        this.popup1 = true;
      }
    },
  },
  created() {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ sucessCallback: false, title: '个人信息' }));
    }
    this.setQuoted_status(2);
    this.getUserInfoH5();
  },
  methods: {
    ...mapMutations(['setQuoted_status', 'setToBeQuotedData', 'setQuotedUserInfor']),
    ...mapActions(['createAndSubmit', 'createAndSubmitWeb']),
    closePop() {
      this.setQuoted_status(2);
    },
    cancel() {
      this.popup = false;
      this.setQuoted_status(2);
    },
    getUserInfoH5() {
      const auth = Cookies.getJSON('auth');
      const token = getParams('token');
      if (token) {
        //  H5页面通过Url上获取 token 可调用getUserInfoH5 (app内部)
        getUserInfoH5({})
          .then(response => {
            console.log('response', response);
            const { code, toastMessage, data } = response.data;
            if (code === response_code.SUCCESS) {
              const { nickname, phoneNumber } = data;
              const quotedUserInfor = {
                name: nickname,
                phoneNumber: phoneNumber,
                wechat: this.quotedUserInfor.wechat || '',
                qq: this.quotedUserInfor.qq || '',
              };
              this.setQuotedUserInfor(quotedUserInfor);
            } else {
              Toast.fail(toastMessage);
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        // web页面登录后拿到token 可调用getUserInfo (app外部)
        if (auth) {
          getUserInfo({})
            .then(response => {
              if (!response) {
                // sso 报过期或者第三方登录
                Dialog.alert({
                  message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
                }).then(() => {
                  // 确认按钮
                  // 先删除旧的登录信息
                  Cookies.remove('auth');
                  // 跳转web登录页面
                  const receipt = getParams('receipt');
                  const type = getParams('type');
                  const { origin, pathname } = document.location;
                  window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
                });
                return;
              }
              console.log('response', response);
              const { code, toastMessage, data } = response.data;
              if (code === response_code.SUCCESS) {
                const { nickname, phoneNumber } = data;
                const quotedUserInfor = {
                  name: nickname,
                  phoneNumber: phoneNumber,
                  wechat: this.quotedUserInfor.wechat || '',
                  qq: this.quotedUserInfor.qq || '',
                };
                this.setQuotedUserInfor(quotedUserInfor);
              } else if (code === response_code.EXPIRED) {
                Dialog.alert({
                  message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
                }).then(() => {
                  // 确认按钮
                  // 先删除旧的登录信息
                  Cookies.remove('auth');
                  // 跳转web登录页面
                  const receipt = getParams('receipt');
                  const type = getParams('type');
                  const { origin, pathname } = document.location;
                  window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
                });
              } else {
                Toast.fail(toastMessage);
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          const receipt = getParams('receipt');
          const type = getParams('type');
          const { origin, pathname } = document.location;
          window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
        }
      }
    },
    commit() {
      // 发回给询价人并复制链接
      const items = [];
      this.toBeQuotedData.detail.forEach(item => {
        item.items.forEach(item1 => {
          items.push(item1);
        });
      });
      const params = {
        baseOrderNumber: this.toBeQuotedData.orderNumber,
        contact: this.quotedUserInfor,
        remark: this.toBeQuotedData.quotedRemark,
        items: items,
      };
      const auth = Cookies.getJSON('auth');
      if (auth) {
        // web端 获取token (app外部)
        this.createAndSubmitWeb({
          params,
          onSuccess: data => {
            // 复制链接
            const shareUrl = data + '&type=2#/quoted';
            this.shareUrl = shareUrl;
            this.setQuoted_status(5);
          },
        });
      } else {
        // url上获取token (app内部)
        this.createAndSubmit({
          params,
          onSuccess: data => {
            // 复制链接
            const shareUrl = data + '&type=2#/quoted';
            this.shareUrl = shareUrl;
            this.setQuoted_status(5);
          },
        });
      }
    },
    onCopySuccess() {
      Toast('复制成功');
    },
    onError() {
      Toast('复制失败');
    },
    complete() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ sucessCallback: true, title: '个人信息' }));
      }
    },
  },
};
</script>

<style lang="scss">
@import 'public.scss';
</style>

<style lang="scss" scoped>
@function px2rem($px, $base-font-size: 75px) {
  /*设计稿宽度为750，因此此处为75*/
  @if (unitless($px)) {
    @return px2rem($px + 0px);
  } @else if (unit($px) == rem) {
    @return $px;
  }
  @return ($px / $base-font-size) * 1rem;
}
@mixin font-dpr($font-size) {
  font-size: $font-size;
  [data-dpr='2'] & {
    font-size: $font-size * 2;
  }
  [data-dpr='3'] & {
    font-size: $font-size * 3;
  }
}
.personal {
  padding: 0 30/750 * 100%;
  .van-cell {
    padding: px2rem(29) 0;
  }
  .van-cell:not(:last-child)::after {
    left: 0;
  }
  /deep/.van-field__label {
    width: 130/ (750-30 * 2) * 100%;
    // font-size: px2rem(30);
    @include font-dpr(15px);
    color: #000000;
  }
  /deep/.van-field__control {
    // font-size: px2rem(30);
    @include font-dpr(15px);
    color: #303233;
  }
  .name {
    /deep/.van-field__control {
      // font-size: px2rem(30);
      @include font-dpr(15px);
      color: #919599;
    }
  }
  .popup {
    background: #f7f9fa;
    height: px2rem(345);
    max-height: 172.5px;
    .send-img {
      width: px2rem(120);
      max-width: 60px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      // top: px2rem(50);
      top: 25px;
    }
    .word {
      position: absolute;
      // top: px2rem(180);
      top: 90px;
      left: 50%;
      color: #fff;
      transform: translateX(-50%);
      // font-size: px2rem(24);
      @include font-dpr(12px);
      color: #303233;
      .send {
        // font-size: px2rem(24);
        @include font-dpr(12px);
        color: #ff6700;
      }
    }
    .cancel {
      position: fixed;
      bottom: 0;
      height: px2rem(72);
      max-height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      // line-height: px2rem(72);
      // font-size: px2rem(28);
      @include font-dpr(14px);
      color: #797c80;
      background: #ffffff;
      width: 100%;
      text-align: center;
    }
  }
}
</style>
