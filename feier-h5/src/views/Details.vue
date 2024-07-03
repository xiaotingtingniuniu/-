<template>
  <div>
    <Header />
    <div class="detailList van-clearfix" v-if="headerDistributor==='配件列表'">
      <DetailList />
    </div>
    <div v-if="headerDistributor==='联系信息'">
      <ContactInformation />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Header from "../components/Header";
import DetailList from "../components/DetailList";
import ContactInformation from "../components/ContactInformation";
import Footer from "../components/Footer";
import { mapMutations, mapActions } from "vuex";
export default {
  name: "Detai",
  components: {
    Header,
    DetailList,
    Footer,
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
  },
  data() {
    return {};
  },
  mounted() {},
  created() {
    // this.setHeaderDistributor("联系信息");
  },
  methods: {
    ...mapMutations([
      "setHeaderDistributor",
    ])
  }
};
</script>
<style lang="scss" scoped>
.cell-group-box{
  margin-top:0;
}
.detailList {
  margin-top: px2rem(88);
  margin-bottom: px2rem(120);
}
</style>

