<template>
  <div class="inner">
    <div v-if="toBeQuotedData.detail&&toBeQuotedData.detail.length>0">
      <div v-for="(item,index) in toBeQuotedData.detail" :key="index" class="card">
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
          <span class="details-contant word">4S店价：{{ item1.part.partPrice?'￥'+Number(item1.part.partPrice).toFixed(2):'暂无' }}</span>
          <span class="details-contant standard">标准名：{{ item1.part.stdPartName|| '暂无' }}</span>
          <span class="details-contant">原厂名：{{ item1.part.srcPartName|| '暂无' }}</span>
          <div v-if="quoted_status===1" :id="`price${index}_${index1}`" class="quoted-price">
            <span class="word">单价：￥</span>
            <!-- <van-field v-model="item1.bidPrice" type="number" label="数字" /> -->
            <van-field
              :id="`${index}_${index1}`"
              readonly
              clickable
              :autofocus="true"
              type="number"
              :value="item1.bidPrice"
              placeholder="请输入您的报价"
              @touchstart.native.stop="onInputClick(index,index1, item1)"
            />
            <van-number-keyboard
              v-model="item1.bidPrice"
              :autofocus="true"
              type="number"
              :show="item1.isShow"
              :maxlength="10"
              extra-key="."
              @blur="blur(item1)"
              @input="keyBoardInput(item1.bidPrice)"
            />
          </div>
          <div v-if="quoted_status===4">
            <span class="price">单价：￥</span>
            <span class="number">{{ item1.bidPrice|| '暂无' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="toBeQuotedData.detail===null">
      错误提示
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      a: '未报价',
      show1: false,
      show2: false,
      value1: '123',
      value2: '456',
      inputNumber: '',
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
  methods: {
    ...mapMutations(['setQuoted_status', 'setToBeQuotedData']),
    keyBoardInput(value) {
      this.$nextTick(function () {
        let inputValue = document.getElementById(`${this.inputNumber}`).value;
        if (inputValue==='00.') {
          inputValue = '0';
        } else if (inputValue==='00') {
          inputValue = '0';
        } else if (inputValue==='.') {
          inputValue = '';
        } else if (Number(inputValue)>9999999.99) {
          inputValue = value;
        } else {
          inputValue = inputValue.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null;
        }
        const index = this.inputNumber.trim().split('_')[0];
        const index1 = this.inputNumber.trim().split('_')[1];
        this.toBeQuotedData.detail[index].items[index1].bidPrice = inputValue;
      });
    },
    blur(item1) {
      item1.isShow = false;
    },
    onInputClick(index, index1, item) {
      this.inputNumber = `${index}_${index1}`;
      this.toBeQuotedData.detail.forEach(item => {
        item.items.forEach(item1 => {
          item1.isShow = false;
        });
      });
      const div = document.getElementById('h5');
      item.isShow = true;
      const top = document.getElementById(`price${index}_${index1}`).offsetTop-216-100;
      div.scrollTo({
        top,
        behavior:'smooth',
      });
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
.card {
  margin-top: px2rem(20);
  width: 100%;
  background-color: #fff;
  padding: px2rem(24) px2rem(30);
  box-sizing: border-box;
  @include font-dpr(14px);
  color: #919599;
  .details {
    margin-top: px2rem(12);
    .details-contant {
      @include font-dpr(14px);
      color: #303233;
      display: block;
    }
    .details-contant.oe {
      width: 100%;
      word-break: break-all;
      width: inherit;
      display: block;
      white-space: normal;
    }
    .quoted-price {
      display: flex;
      justify-content: flex-end;
      margin-top:px2rem(20);
      .word {
        height: px2rem(40);
        max-height: 20px;
        display: inline-block;
        vertical-align: middle;
        @include font-dpr(14px);
        color: #303233;
      }
      .van-cell.van-cell--clickable.van-field {
        vertical-align: baseline;
        display: inline-block;
        width: px2rem(220);
        max-width: 110px;
        padding: 0;
        @include font-dpr(14px);
        height: px2rem(40);
        max-height: 20px;
        vertical-align: middle;
      }
      /deep/.van-field__control {
        color: #ff2020;
        height: px2rem(40);
        max-height: 20px;
        line-height: 20px;
        vertical-align: middle;
      }
      .van-cell:not(:last-child)::after {
        left: -14px;
      }
    }
    .price {
      @include font-dpr(14px);
      color: #303233;
    }
    .number {
      @include font-dpr(14px);
      color: #ff2020;
    }
  }
}
</style>