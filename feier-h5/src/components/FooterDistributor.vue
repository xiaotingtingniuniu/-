<template>
  <div class="foot_button_box">
    <van-button
      type="primary"
      size="large"
      class="foot_button next cango"
      @click="information"
      v-if="headerDistributor==='配件列表'&&canGoToInformation===true"
    >下一步</van-button>
    <van-button
      type="primary"
      size="large"
      class="foot_button next"
      v-if="headerDistributor==='配件列表'&&canGoToInformation===false"
    >下一步</van-button>
    <van-button
      type="primary"
      size="large"
      class="foot_button send"
      v-else-if="headerDistributor==='联系方式'"
      @click="send"
    >提交</van-button>
  </div>
</template>
<script>
import Vue from "vue";
import { Button, Toast, Dialog } from "vant";
import { mapMutations, mapActions } from "vuex";
Vue.use(Button)
  .use(Toast)
  .use(Dialog);
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
    },
    canGoToInformation: {
      set(value) {
        console.log("set", value);
        this.setCanGoToInformation(value);
      },
      get() {
        return this.$store.state.canGoToInformation;
      }
    },
    contactInformation: {
      set(value) {
        console.log("set", value);
        this.setContactInformation(value);
      },
      get() {
        return this.$store.state.contactInformation;
      }
    },
    distributor: {
      set(value) {
        console.log("set", value);
        this.setDistributor(value);
      },
      get() {
        return this.$store.state.distributor;
      }
    },
    orderNo: {
      set(value) {
        console.log("set", value);
        this.setOrderNo(value);
      },
      get() {
        return this.$store.state.orderNo;
      }
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    ...mapMutations([
      "setHeaderDistributor",
      "setCanGoToInformation",
      "setDistributor",
      "setOrderNo"
    ]),
    ...mapActions(["quotation"]),
    information() {
      console.log("列表", this.distributor);
      const quotedPriceArr = [];
      this.distributor.map((item, index) => {
        console.log("item", item);
        if (item.quotedPrice != null) {
          quotedPriceArr.push(item);
        }
      });
      console.log("quotedPriceArr", quotedPriceArr);
      if (quotedPriceArr.length == 0) {
        Toast.fail("请填写您的报价");
      } else {
        this.setHeaderDistributor("联系方式");
        this.setCanGoToInformation(false);
      }
    },
    send() {
      console.log("contactInformation", this.contactInformation);
      if (!this.contactInformation.supplierName) {
        Toast.fail("请填写经销商名称");
      } else if (!this.contactInformation.address) {
        Toast.fail("请填写地址");
      } else if (!this.contactInformation.contact) {
        Toast.fail("请填写联系人");
      } else if (!this.contactInformation.mobile) {
        Toast.fail("请填写联系电话");
      } else {
        if (
          this.contactInformation.qqErrorMessage === null &&
          this.contactInformation.mailboxErrorMessage === null &&
          this.contactInformation.phoneErrorMessage === null
        ) {
          console.log("通过");
          //调用经销商报价接口
          let _this = this;
          this.quotation(value => {
            //访问成功回调函数
            console.log("value", value);
            const orderNo = value.orderNo;
            console.log("orderNo", orderNo);
            let copyUrl;
            switch (process.env.NODE_ENV) {
              case "development":
                // copyUrl = `http://10.16.18.229:8080/details?orderNo=${orderNo}&isApp=${false}`; //dev环境分享地址
                copyUrl = `https://freyh5-dev.dataenlighten.com/details?orderNo=${orderNo}&isApp=${false}`; //dev环境分享地址
                break;
              case "test":
                copyUrl = `https://freyh5-uat.dataenlighten.com/details?orderNo=${orderNo}&isApp=${false}`; //uat环境分享地址
                break;
              case "ppt":
                copyUrl = `https://freyh5.dataenlighten.com/details?orderNo=${orderNo}&isApp=${false}`; //ppt环境分享地址
                break;
              case "production":
                copyUrl = `https://freyh5.dataenlighten.com/details?orderNo=${orderNo}&isApp=${false}`; //生产环境分享地址
                break;
            }

            // const copyUrl = `http://10.16.18.229:8080/details?orderNo=${orderNo}&isApp=${false}`;
            this.$dialog.alert({
              message:
                "您已成功提交报价并发送给客户，您也可以点击下方复制链接，手动发送给客户。操作完成请关闭页面",
              showConfirmButton: true,
              confirmButtonText: "复制链接",
              closeOnClickOverlay: false,
              beforeClose: (action, done) => {
                done(false);
                this.$copyText(copyUrl).then(
                  e => {
                    Toast.success("复制成功");
                    console.log(e);
                  },
                  e => {
                    Toast.fail("复制失败");
                    console.log(e);
                  }
                );
              }
            });
          });
        } else {
          Toast.fail("请先完善信息");
        }
      }
    }
  }
};
</script>
<style lang="scss">
.foot_button_box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: px2rem(750);
  height: px2rem(120);
  display: flex;
  justify-content: center;
  background-color: #fff;
  .foot_button {
    width: px2rem(686);
    height: px2rem(88);
    line-height: px2rem(88);
    background-color: $feier;
    border: $feier;
    border-radius: px2rem(4);
    margin-top: px2rem(16);
    font-size: px2rem(36);
    background-color: #fff;
    color: $feier;
    &.next {
      background: rgba(181, 26, 26, 0.5);
      color: rgba(255, 255, 255, 0.5);
    }
    &.send {
      background: rgba(181, 26, 26, 1);
      color: rgba(255, 255, 255, 1);
    }
    &.next.cango {
      background: rgba(181, 26, 26, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
.van-dialog__message {
  // height: px2rem(200);
  // padding:(25 50);
  // padding: px2rem(80) px2rem(100);
  // font-size: px2rem(32);
  // line-height: 2.5;
}
</style>
