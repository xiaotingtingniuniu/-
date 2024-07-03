<template>
  <div class="quoted">
    <h5title />
    <h5card />
    <div class="remark">
      <div class="title">备注信息</div>
      <div v-if="toBeQuotedData.originalRemark" class="content">
        <div v-if="toBeQuotedData.creator" class="detail-top">{{ toBeQuotedData.creator.name }}的备注</div>
        <van-field
          v-if="toBeQuotedData.originalRemark"
          v-model="toBeQuotedData.originalRemark"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="请输入您的备注信息"
          :readonly="true"
          :border="false"
          class="detail-bottom"
        />
      </div>
      <div v-if="toBeQuotedData.remark" class="bidder">
        <div v-if="toBeQuotedData.bidder" class="detail-top">{{ toBeQuotedData.bidder.name }}的备注</div>
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
    </div>
    <div class="contact-info">
      <div class="title">联系方式</div>
      <div class="contact">
        <span class="contact-word">联系人</span>
        <span v-if="toBeQuotedData.contact" class="name">{{ toBeQuotedData.contact.name }}</span>
      </div>
      <div class="contact">
        <span class="contact-word">手机号</span>
        <a
          v-if="toBeQuotedData.contact"
          class="phone"
          :href="'tel:'+toBeQuotedData.contact.phoneNumber"
        >{{ toBeQuotedData.contact.phoneNumber }}</a>
      </div>
      <div class="contact">
        <span class="contact-word">微信</span>
        <span v-if="toBeQuotedData.contact" class="wechat-box">
          <span v-if="toBeQuotedData.contact.wechat" class="wechat">
            <span class="wechat-number">{{ toBeQuotedData.contact.wechat }}</span>
            <span
              v-clipboard:copy="toBeQuotedData.contact.wechat"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onError"
              class="copy-button"
            >复制</span>
          </span>
          <span v-else class="wechat">
            <span class="wechat-number null">-</span>
          </span>
        </span>
      </div>
      <div class="contact">
        <span class="contact-word">QQ</span>
        <span v-if="toBeQuotedData.contact" class="wechat-box">
          <span v-if="toBeQuotedData.contact.qq" class="wechat">
            <span class="wechat-number">{{ toBeQuotedData.contact.qq }}</span>
            <span
              v-clipboard:copy="toBeQuotedData.contact.qq"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onError"
              class="copy-button"
            >复制</span>
          </span>
          <span v-else class="wechat">
            <span class="wechat-number null">-</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { router_names } from '../config/constant';
import H5title from '../components/H5title.vue';
import H5card from '../components/H5card.vue';
import { mapMutations, mapActions } from 'vuex';
import getParams from '../utils/get-params';
import { Toast } from 'vant';
export default {
  components: {
    H5title,
    H5card,
  },
  data() {
    return {
      type: '2', // 0:下载页 '1'下载的中间页 '2':收到的报价 '3':我的报价
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
      window.ReactNativeWebView.postMessage(JSON.stringify({ sucessCallback: false, title: '历史清单详情' }));
    }
    this.setQuoted_status(4);
    // 获取已报价历史清单详情
    const receipt = getParams('receipt');
    if (this.toBeQuotedData.length === 0) {
      if (receipt) {
        const params = {
          receipt: receipt,
        };
        console.log('receipt', receipt);
        console.log('params', params);
        this.getHistoryQuotedDetails({
          params: params,
          onSuccess: value => {
            console.log('toBeQuotedData', this.toBeQuotedData);
            console.log('value', value);
          },
        });
      }
    }
    const type = getParams('type');
    this.type = type;
  },
  methods: {
    ...mapMutations(['setQuoted_status', 'setToBeQuotedData']),
    ...mapActions(['getHistoryQuotedDetails']),
    go() {
      this.$router.push({ name: router_names.NOQUOTED });
    },
    onCopySuccess() {
      Toast('复制成功');
    },
    onError() {
      Toast('复制失败');
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
.quoted {
  height: auto;
  background-color: #f5f6f7;
  min-height: 100%;
  padding: px2rem(20);
  box-sizing: border-box;
  .remark {
    background-color: #fff;
    padding: 0 px2rem(28) px2rem(24);
    margin-top: px2rem(20);
    margin-bottom: px2rem(20);
    .title {
      @include font-dpr(14px);
      color: #303233;
      padding: px2rem(20) 0;
    }
    .content{
      margin-bottom: px2rem(24);
    }
    .detail-top {
      @include font-dpr(14px);
      color: #aaaeb3;
    }
    .detail-bottom {
      @include font-dpr(14px);
      color: #797c80;
      margin-top: px2rem(20);
      padding: 0;
      line-height: 20px !important;
      /deep/.van-field__control:read-only {
        color: #797c80;
      }
    }
  }
  .contact-info {
    padding: px2rem(20) px2rem(28);
    background-color: #fff;
    .title {
      @include font-dpr(14px);
      color: #303233;
    }
    .contact {
      display: flex;
      justify-content: space-between;
      margin-top: px2rem(20);
      .contact-word {
        @include font-dpr(14px);
        color: #aaaeb3;
        vertical-align: top;
        width: px2rem(116);
        min-width: 58px;
        display: inline-block;
      }
      .name {
        @include font-dpr(14px);
        color: #797c80;
        vertical-align: top;
      }
      .phone {
        @include font-dpr(14px);
        color: #1890ff;
      }
      .wechat-box {
        display: inline-block;
        .wechat {
          display: flex;
          .wechat-number {
            @include font-dpr(14px);
            color: #797c80;
          }
          .wechat-number.null {
            color: #aaaeb3;
          }
          .copy-button {
            display: inline-block;
            width: px2rem(80);
            max-width: 40px;
            height: px2rem(36);
            max-height: 18px;
            line-height: 18px;
            border: px2rem(1) solid #919599;
            border-radius: 10px;
            @include font-dpr(12px);
            color: #616366;
            text-align: center;
            margin-left: px2rem(10);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>