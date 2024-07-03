<template>
  <div class="share-history-list">
    <div class="share-banner">
      <div class="banner" />
    </div>
    <div v-if="details&&details.length>0" class="share-list">
      <div clas="title">
        <div class="time">{{ time }}</div>
        <div class="order-number">清单号：{{ orderNumber }}</div>
      </div>
      <div class="share-contant">
        <div v-for="(item,index) in details" :key="index" class="contant">
          <div class="title">
            <div v-if="item.groupingBy==='VIN'">
              <div class="title-top">{{ item.vehicle.vinCode||'' }}</div>
              <div class="title-bottom">
                <span>{{ item.vehicle.subBrand || '' }}</span>
                <span>{{ item.vehicle.mjVehicleGroup || '' }}</span>
                <span>{{ item.vehicle.year || '' }}</span>
                <span>{{ item.vehicle.displacement||'' }}</span>
                <span>{{ item.vehicle.transmission||'' }}</span>
              </div>
            </div>
            <div v-else-if="item.groupingBy==='MJSID'">
              <div class="title-bottom">
                <span>{{ item.vehicle.subBrand || '' }}</span>
                <span>{{ item.vehicle.mjVehicleGroup || '' }}</span>
                <span>{{ item.vehicle.year || '' }}</span>
                <span>{{ item.vehicle.displacement||'' }}</span>
                <span>{{ item.vehicle.transmission||'' }}</span>
              </div>
            </div>
            <div v-else-if="item.groupingBy==='PART_NUMBER'">
              <div class="title-bottom">
                <span>{{ item.vehicle.subBrand || '' }}</span>
                <span>{{ item.vehicle.mjVehicleGroup || '' }}</span>
              </div>
            </div>
          </div>
          <div v-for="(item1,index1) in item.items" :key="index1" class="details">
            <span class="details-contant oe">OE号：{{ item1.part.partNumber|| '暂无' }}</span>
            <span
              class="details-contant word"
            >4S店价：{{ item1.part.partPrice?'￥'+Number(item1.part.partPrice).toFixed(2):'暂无' }}</span>
            <span class="details-contant standard">标准名：{{ item1.part.stdPartName|| '暂无' }}</span>
            <span class="details-contant">原厂名：{{ item1.part.srcPartName|| '暂无' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="details===null" class="error-box">
      <!-- 暂无数据 -->
      <div class="error">
        <div class="error-img" />
        <div class="error-word">网络出错了!</div>
        <div class="retry" @click="retry">点击重试</div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '../api/partList';
import { getFormattedDate } from '../utils/date';
import { response_code } from '../config/constant';

export default {
  data() {
    return {
      time: '',
      orderNumber: '',
      details: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    const receipt = this.getParams('receipt');
    console.log('receipt', receipt);
    const params = {
      receipt: receipt,
    };
    console.log('params', params);
    this.getShareHistoryList(params);
  },
  methods: {
    getShareHistoryList(params) {
      console.log('params', params);
      API.getShareHistoryList(params)
        .then(res => {
          console.log('res', res);
          const { code, toastMessage, data } = res.data;
          if (code === response_code.SUCCESS) {
            this.time = getFormattedDate(data.createTime);
            this.orderNumber = data.orderNumber;
            this.details = data.detail;
          } else {
            this.details = null;
            console.log('toastMessage', toastMessage);
          }
        })
        .catch(err => {
          console.error('err', err);
          this.details = null;
        });
    },
    getParams(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      const r = window.location.search.substr(1).match(reg); // search,查询？后面的参数，并匹配正则
      if (r !== null) {
        return unescape(r[2]);
      }
      return null;
    },
    retry() {
      window.location.reload();
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
@media screen and (min-width: 500px) {
  .share-history-list {
    .share-banner {
      width: px2rem(750);
      height: 73.33px !important;
      background-color: #fdc100;
      text-align: center;
      .banner {
        background-image: url('../images/share.png');
        width: 500px !important;
        height: 73.33px !important;
        background-size: cover;
        vertical-align: top;
        // max-width: 500px;
        margin: 0 auto;
      }
    }
    .share-list {
      font-size: 14px !important;
      color: #aaaeb3;
      padding: 10px !important;
      margin-top: 73.33px !important;
      .share-contant {
        width: 100%;
        margin-top: 10px !important;
        .contant {
          width: 100%;
          padding-top: 10px !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
          box-sizing: border-box;
          padding-bottom: 12px !important;
          margin-bottom: 10px !important;
          background: #ffffff;
          border-radius: 4px !important;
          .title {
            width: 100%;
            font-size: 0;
            color: #797c80;
            box-sizing: border-box;
            .title-top {
              font-size: 14px !important;
              vertical-align: top;
            }
            .title-bottom {
              font-size: 14px !important;
              vertical-align: top;
            }
          }
          .details {
            margin-top: 8px !important;
            .details-contant {
              font-size: 14px !important;
              color: #303233;
              display: inline-block !important;
              vertical-align: top !important;
            }
            .details-contant.oe{
              width:420px !important;
              display: inline-block !important;
            }
            .details-contant.word {
              display: inline-block !important;
              width:160px !important;
            }
            .details-contant.standard{
              display: inline-block !important;
              margin-right:40px;
            }
          }
        }
      }
    }
    .error-box {
      width: 100%;
      height: 100%;
      position: relative;
      .error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        .error-img {
          width: 110px !important;
          height: 80px !important;
          background-image: url('../images/error.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          margin: 0 auto;
        }
        .error-word {
          font-size: 14px !important;
          color: #797c80;
          width: px2rem(152);
          margin: 0 auto;
          margin-top: px2rem(19);
        }
        .retry {
          width: 140px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 16px !important;
          color: #ff6700;
          text-align: center;
          box-sizing: border-box;
          border: 2px solid #ffba8c !important;
          border-radius: 20px !important;
          margin:0 auto;
          margin-top: 20px !important;
          cursor: pointer;
        }
      }
    }
  }
}
/deep/body {
  background-color: red !important;
}
.share-history-list {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: #f5f6f7;
  position: relative;
  .share-banner {
    width: px2rem(750);
    height: px2rem(110);
    background-color: #fdc100;
    text-align: center;
    position: fixed;
    .banner {
      background-image: url('../images/share.png');
      width: 100%;
      height: 100%;
      background-size: cover;
      vertical-align: top;
      max-width: 500px;
      margin: 0 auto;
    }
  }
  .share-list {
    font-size: px2rem(28);
    color: #aaaeb3;
    padding: px2rem(20);
    margin-top: px2rem(110);
    .share-contant {
      width: 100%;
      margin-top: px2rem(20);
      .contant {
        width: 100%;
        padding-top: px2rem(20);
        padding-left: px2rem(32);
        padding-right: px2rem(32);
        box-sizing: border-box;
        padding-bottom: px2rem(24);
        margin-bottom: px2rem(20);
        background: #ffffff;
        border-radius: px2rem(8);
        .title {
          width: 100%;
          font-size: 0;
          color: #797c80;
          box-sizing: border-box;
          .title-top {
            font-size: px2rem(28);
            vertical-align: top;
          }
          .title-bottom {
            font-size: px2rem(28);
            display: block;
          }
        }
        .details {
          margin-top: px2rem(16);
          .details-contant {
            font-size: px2rem(28);
            color: #303233;
            display: block;
          }
          .details-contant.oe{
            width:100%;
            word-break:break-all;
            width:inherit;
            display:block;
            white-space:normal;
          }
        }
      }
    }
  }
  .error-box {
    width: 100%;
    height: 100%;
    position: relative;
    .error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .error-img {
        width: px2rem(220);
        height: px2rem(160);
        background-image: url('../images/error.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin: 0 auto;
      }
      .error-word {
        font-size: px2rem(28);
        color: #797c80;
        width: px2rem(152);
        margin: 0 auto;
        margin-top: px2rem(19);
      }
      .retry {
        width: px2rem(280);
        height: px2rem(80);
        line-height: px2rem(80);
        font-size: px2rem(32);
        color: #ff6700;
        text-align: center;
        box-sizing: border-box;
        border: px2rem(2) solid #ffba8c;
        border-radius: px2rem(41);
        margin-top: px2rem(40);
        cursor: pointer;
      }
    }
  }
}
</style>
