<template>
  <div class="no_quoted">
    <h5title />
    <h5card />
    <div class="remark">
      <div class="title">备注信息</div>
      <div v-if="toBeQuotedData.remark" class="content">
        <div v-if="toBeQuotedData.creator" class="detail-top">{{ toBeQuotedData.creator.name }}的备注</div>
        <van-field
          v-model="toBeQuotedData.remark"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="请输入您的备注信息"
          :readonly="true"
          class="detail-bottom"
        />
      </div>
      <van-field
        v-if="quoted_status===1"
        v-model="toBeQuotedData.quotedRemark"
        rows="3"
        autosize
        type="textarea"
        maxlength="300"
        placeholder="请输入您的备注信息"
        class="textarea"
        @input="inputMethod"
        @focus="onFocusAddr"
      />
    </div>
  </div>
</template>
<script>
import { router_names } from '../config/constant';
import H5title from '../components/H5title.vue';
import H5card from '../components/H5card.vue';
import { mapMutations, mapActions } from 'vuex';
import getParams from '../utils/get-params';
import growingIO from '../thirdparty/gio';

export default {
  components: {
    H5title,
    H5card,
  },
  data() {
    return {
      remark: '',
      test: '好\r\n我看',
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
    toBeQuotedData: {
      get() {
        return this.$store.state.toBeQuotedData;
      },
      set(value) {
        this.setToBeQuotedData(value);
      },
    },
  },
  created() {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ sucessCallback: false, title: '历史清单详情页' }));
    }
    this.setQuoted_status(1);
    const receipt = getParams('receipt');
    console.log('toBeQuotedData', this.toBeQuotedData);
    if (this.toBeQuotedData.length === 0) {
      if (receipt) {
        const params = {
          receipt: receipt,
        };
        console.log('receipt', receipt);
        console.log('params', params);
        this.getHistoryOrderDetails({
          params: params,
          onSuccess: value => {
            console.log('toBeQuotedData', this.toBeQuotedData);
            console.log('value', value);
          },
        });
      }
    }

    // 获取app(RN)传过来的数据
    window.document.addEventListener('message', function (e) {
      // 注册事件 接收数据
      let message = e.data; // 字符串类型
      message = JSON.parse(message);
      if (message.os === 'android') {
        if (message.state === 'keyboardDidShow') {
          const div = document.getElementById('h5');
          div.style.marginBottom = `${message.height}px`;
          setTimeout(() => {
            div.scrollTop = div.scrollHeight;
          }, 500);
        } else if (message.state === 'keyboardDidHide') {
          const div = document.getElementById('h5');
          div.style.marginBottom = `${message.height}px`;
        }
      }
    });
  },
  methods: {
    ...mapMutations(['setQuoted_status', 'setToBeQuotedData']),
    ...mapActions(['getHistoryOrderDetails']),
    go() {
      this.$router.push({ name: router_names.QUOTED });
    },
    inputMethod(value) {
      console.log('value', value);
      console.log('toBeQuotedData', this.toBeQuotedData);
    },
    isAndroid() {
      const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // android终端或者uc浏览器
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
      console.log('isiOS', isiOS);
      return isAndroid === true;
    },
    onFocusAddr() {
      growingIO.quotedRemark();
      if (!this.isAndroid()) {
        return;
      } // 判断是否是安卓机
      setTimeout(() => {
        const div = document.getElementById('h5'); // 获取根节点
        div.scrollTop = div.scrollHeight; // 滚动条至底（这里没有写的很严谨，需要减去输入框自身高offsetHeight，效果都一样）
      }, 500); // 键盘拉起的延迟时间
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
.no_quoted {
  height: auto;
  background-color: #f5f6f7;
  min-height: 100%;
  padding: px2rem(20);
  box-sizing: border-box;
  .remark {
    background-color: #fff;
    padding: 0 px2rem(16) px2rem(20);
    margin-top: px2rem(20);
    margin-bottom: px2rem(110);
    .title {
      @include font-dpr(14px);
      color: #303233;
      padding: px2rem(20) px2rem(12);
    }
    .content {
      margin-bottom: px2rem(24);
    }
    .detail-top {
      @include font-dpr(14px);
      color: #aaaeb3;
      padding: 0 px2rem(12);
    }
    .detail-bottom {
      @include font-dpr(14px);
      color: #797c80;
      margin-top: px2rem(12);
      padding: 0 px2rem(12);
      line-height: 20px !important;
      /deep/.van-field__control:read-only {
        color: #797c80;
      }
    }
    .textarea {
      padding: px2rem(24) px2rem(12);
      @include font-dpr(14px);
      color: #303233;
      box-sizing: border-box;
      background: #f7f9fa;
      line-height: 140%;
      // line-height: px2rem(40);
      // margin-top: px2rem(24);
    }
  }
}
</style>