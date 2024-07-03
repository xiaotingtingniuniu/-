<template>
  <div class="header-box">
    <van-nav-bar title="配件列表" left-text class="title" v-if="headerDistributor==='配件列表'" />
    <van-nav-bar
      title="联系方式"
      left-text="返回"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goBack"
      v-else-if="headerDistributor==='联系方式'"
    />
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar } from "vant";
import { mapMutations } from "vuex";
Vue.use(NavBar);
export default {
  computed: {
    headerDistributor: {
      set(value) {
        console.log("set", value);
        this.setHeaderDistributor(value);
      },
      get() {
        return this.$store.state.headerDistributor;
      }
    }
  },
  methods: {
    ...mapMutations(["setHeaderDistributor"]),
    goBack() {
      this.setHeaderDistributor("配件列表");
    }
  }
};
</script>
<style scoped lang="scss">
.header-box {
  height: px2rem(88);
  .van-nav-bar {
    line-height: px2rem(88) !important;
    height: px2rem(88) !important;
  }
  .title {
    background-color: $feier;

    .van-nav-bar__title {
      font-size: px2rem(36);
      color: #ffffff;
    }
    .van-nav-bar__left,
    .van-nav-bar__right {
      color: #ffffff;
      font-size: 0;
      .van-nav-bar__text {
        color: #fff;
        font-size: px2rem(32);
        font-weight: 500;
      }
      .van-icon-arrow-left {
        color: #fff;
        font-size: px2rem(32);
        width: px2rem(18);
        &::before {
          width: px2rem(18);
          height: px2rem(35);
        }
      }
    }
    .van-nav-bar__left .van-nav-bar__text {
      margin: 0;
      margin-left: px2rem(5);
      padding: 0;
    }
  }
}
</style>
