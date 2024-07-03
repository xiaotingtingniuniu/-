<template>
  <div class="foot-button">
    <div v-if="quoted_status===0" id="quoted" class="quote-button" @click="goQuoted">我要报价</div>
    <div v-else-if="quoted_status===1" class="edit-button">
      <span class="edit-return" @click="returnButton">返回</span>
      <span class="edit-next" @click="nextButton">下一步</span>
    </div>
    <div v-else-if="quoted_status===2" class="edit-button">
      <span class="edit-return" @click="goBack">返回</span>
      <span class="edit-next" @click="goOn">下一步</span>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { router_names } from '../config/constant';
import getParams from '../utils/get-params';
import { downloadURL } from 'config';
import Cookies from 'js-cookie';
import growingIO from '../thirdparty/gio';

export default {
  data() {
    return {
      status: 0, // 0 '待报价' ; 1 '点击了我要报价'; 2 '点击了下一步跳转到个人信息页面'; 3 弹出弹层; 4 已报价页面
    };
  },
  computed: {
    quoted_status: {
      get() {
        return this.$store.state.quoted_status;
      },
      set(value) {
        this.setQuoted_status(value);
      },
    },
  },
  created() {
  },
  methods: {
    ...mapMutations(['setQuoted_status']),
    goQuoted() {
      growingIO.goQuoted();
      /**
       * 点击报价的时候 先判断是不是在微信中 再判断是否有app
       * 1.有：跳转app 并跳转到app内部指定页面
       * 2.没有：跳转到下载页面 1)如果点击下载 则继续后面的操作 2)如果点击 继续查看 则先跳转到web的登录页面 拿到验证信息以后 继续做报价
       */
      if (this.isWeChat()) {
        // 跳转到微信展示页面
        const receipt = getParams('receipt');
        let openurl = `${window.location.origin}${window.location.pathname}?receipt=${encodeURIComponent(receipt)}`;
        openurl = encodeURIComponent(openurl);
        window.location.href = `${downloadURL}/index.html?type=1&receipt=${receipt}&openurl=${openurl}`;
      } else {
        // 先判断是否有token 没有的话走登录
        const token = getParams('token');
        const type = getParams('type');
        if (token) {
          // 有token app内部
          this.setQuoted_status(1);
          this.$router.push({ name: router_names.GOQUOTED });
        } else {
          // type: 0:下载页 '1'下载的中间页 '2':收到的报价 '3':我的报价
          if (type === '1'&&this.isMobile()) {
            // 从来没有在微信中打开过 先跳转中间页判断是否有 安装app
            const receipt = getParams('receipt');
            let openurl = `${window.location.origin}${window.location.pathname}?receipt=${encodeURIComponent(receipt)}`;
            openurl = encodeURIComponent(openurl);
            window.location.href = `${downloadURL}/index.html?type=1&receipt=${receipt}&openurl=${openurl}`;
          } else {
            // app外部(且) 且不是复制链接过来的 先走登录注册流程
            console.log('跳转web登录注册');
            const auth = Cookies.getJSON('auth');
            if (auth) {
              // web已经登录
              this.setQuoted_status(1);
              this.$router.push({ name: router_names.GOQUOTED });
            } else {
              // web 未登录
              const receipt = getParams('receipt');
              const { origin, pathname } = document.location;
              window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}`;
            }
          }
        }
      }
    },
    isWeChat() {
      const winHeight = typeof window.innerHeight !== 'undefined' ? window.innerHeight : document.documentElement.clientHeight;
      console.log('winHeight', winHeight);
      const is_weixin = (function () {
        const ua = window.navigator.userAgent.toLowerCase();
        if (/micromessenger/.test(ua)) {
          return true;
        } else {
          return false;
        }
      })();
      console.log('is_weixin', is_weixin);
      if (is_weixin) {
        return true;
      } else {
        return false;
      }
    },
    returnButton() {
      this.setQuoted_status(0);
      this.$router.push({ name: router_names.NOQUOTED });
    },
    nextButton() {
      this.setQuoted_status(2);
      this.$router.push({ name: router_names.PERSONALINFOR });
    },
    goBack() {
      this.$router.push({ name: router_names.GOQUOTED });
      this.setQuoted_status(1);
    },
    goOn() {
      console.log('quoted_status', this.quoted_status);
      this.setQuoted_status(3);
      console.log('quoted_status', this.quoted_status);
    },
    // 判断浏览器函数
    isMobile() {
      console.log('window.navigator.userAgent', window.navigator.userAgent);
      if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
      } else {
        return false; // PC端
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
  [data-dpr="2"] & {
    font-size: $font-size * 2;
  }
  [data-dpr="3"] & {
    font-size: $font-size * 3;
  }
}
.foot-button {
  max-width: 750px;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  padding: 7px 15px;
  box-sizing: border-box;
  border-top: px2rem(1) solid #dadfe6;
  .quote-button {
    height: px2rem(82);
    max-height: 41px;
    width: 100%;
    background: #ff6700;
    border-radius: px2rem(6);
    @include font-dpr(16px);
    color: #ffffff;
    margin: 0 auto;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor: pointer;
  }
  .edit-button {
    height: px2rem(82);
    max-height: 41px;
    // line-height: px2rem(82);
    width: 100%;
    display: flex;
    justify-content: space-between;
    .edit-return {
      display: inline-block;
      width: 330/ (330 * 2+30) * 100%;
      height: 100%;
      border: px2rem(1) #ff6700 solid;
      box-sizing: border-box;
      @include font-dpr(16px);
      color: #ff6700;
      border-radius: px2rem(6);
      display:flex;
      align-items:center;
      justify-content:center;
      cursor: pointer;
    }
    .edit-next {
      display: inline-block;
      width: 330/ (330 * 2+30) * 100%;
      height: 100%;
      box-sizing: border-box;
      background-color: #ff6700;
      border-radius: px2rem(6);
      @include font-dpr(16px);
      color: #ffffff;
      display:flex;
      align-items:center;
      justify-content:center;
      cursor: pointer;
    }
  }
}
</style>
