<template>
  <div class="accessoriesList van-clearfix">
    <!-- {{authorization}}
    {{productCode}} -->
    <LoadingList />
  </div>
</template>
<script>
import Vue from "vue";
import { mapMutations, mapActions } from "vuex";
import http from "../utils/http";
import { Cell, CellGroup, Toast, Button, Field } from "vant";
Vue.use(Cell).use(CellGroup);
import { response_code } from "../config/constant";
import LoadingList from "../components/LoadingList";
export default {
  name: "home",
  components: {
    VanButton: Button,
    VanField: Field,
    LoadingList
  },
  computed: {
    authorization: {
      set(value) {
        console.log("set", value);
        this.setAuthorization(value);
      },
      get() {
        return this.$store.state.authorization;
      }
    },
    productCode: {
      set(value) {
        console.log("set", value);
        this.setProductCode(value);
      },
      get() {
        return this.$store.state.productCode;
      }
    }
  },
  data() {
    return {
      phoneNum: "186021512031",
      codeNum: "000000",
      responseCode: ""
    };
  },
  created() {
    let _this = this;
    // 调用原生app的"getAccessToken"方法 获取票据和产品码
    http.http.defaults.headers.common["Authorization"] =
      "bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbnVzZXIiOiJTTVM6MTMxMDIxMDM3MzM6MTU3MTYyOTI1NjE1OTo2MDQ4MDAifQ.ZPKYYl4HgypVueVm5MqDPh8qJuyWoagY1yv3Cc6M9Io1oXd0SPlavX93E-kry5Q4REYf3gFKUwdy3Hb0g21tLw";
    http.http.defaults.headers.common["Product-Code"] = "MFI01";
    const params = { page: "1", limit: "5" };
    console.log("params", params);
    _this.accessoriesList(params);
    try {
      this.$bridge.callhandler("getAccessToken", "", data => {
        const { mjToken, productCode } = data;
        this.setAuthorization(mjToken);
        this.setProductCode(productCode);
        http.http.defaults.headers.common["Authorization"] = mjToken;
        http.http.defaults.headers.common["Product-Code"] = productCode;
        //调用接口获取配件列表
        const params = { page: "1", limit: "5" };
        console.log("params", params);
        _this.accessoriesList(params);
      });
    } catch (error) {
      Toast.fail(err);
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations(["setAuthorization", "setProductCode"]),
    ...mapActions(["accessoriesList"])
  }
};
</script>
<style lang="scss" scoped>
.accessoriesList {
  height: px2rem(1334-120-88);
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    //苹果x
    & {
      height: px2rem(812 * 2-120-88-34-30) !important;
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    & {
      height: px2rem(896 * 2-120-88-34-30) !important;
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    & {
      height: px2rem(896 * 2-120-88-34-30) !important;
    }
  }
  // margin-top: px2rem(88);
  // padding-bottom: px2rem(120);
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

