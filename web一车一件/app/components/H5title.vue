<template>
  <div>
    <div class="title">{{ toBeQuotedData.title }}</div>
    <div v-if="type==='2'||type==='3'" class="list-number">
      <span>清单号:{{ toBeQuotedData.quoteNumber }}</span>
      <span>{{ submitTime }}</span>
    </div>
    <div v-else class="list-number">
      <span>清单号:{{ toBeQuotedData.orderNumber }}</span>
      <span>{{ displayTime }}</span>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getFormattedTimes } from '../utils/date';
import getParams from '../utils/get-params';
export default {
  data() {
    return {
      type: '1', // '2':收到的报价 '3':我的报价
    };
  },
  computed: {
    toBeQuotedData: {
      get() {
        return this.$store.state.toBeQuotedData;
      },
      set(value) {
        this.setToBeQuotedData(value);
      },
    },
    displayTime: function () {
      return getFormattedTimes(this.toBeQuotedData.displayTime);
    },
    submitTime: function () {
      return getFormattedTimes(this.toBeQuotedData.submitTime);
    },
  },
  created() {
    const type = getParams('type');
    this.type = type;
  },
  methods: {
    ...mapMutations(['setQuoted_status', 'setToBeQuotedData']),
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
.title {
  @include font-dpr(14px);
  color: #aaaeb3;
}
.list-number {
  @include font-dpr(12px);
  display: flex;
  justify-content: space-between;
  color: #aaaeb3;
}
</style>