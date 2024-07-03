<template>
  <div class="home">
    <HeaderDistributor />
    <div class="distributorList van-clearfix" v-if="headerDistributor==='配件列表'">
      <DistributorList  />
    </div>
    <div v-else-if="headerDistributor==='联系方式'">
      <ContactInformation />
    </div>
    <FooterDistributor />
  </div>
</template>
<script>
import HeaderDistributor from "../components/HeaderDistributor";
import DistributorList from "../components/DistributorList";
import FooterDistributor from "../components/FooterDistributor";
import ContactInformation from "../components/ContactInformation";
export default {
  components: {
    HeaderDistributor,
    DistributorList,
    FooterDistributor,
    ContactInformation
  },
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
  }
};
</script>
<style lang="scss" scoped>
.home{
  position: absolute;
  width:100%;
  top:0;
  height:100%;
}
.distributorList {
  margin-top: px2rem(88);
  margin-bottom: px2rem(120);
}
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
    }
  }
}
</style>
