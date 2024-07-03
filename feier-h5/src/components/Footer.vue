<template>
  <div class="foot_button_box">
    <van-submit-bar
      button-text="删除"
      @submit="onSubmit"
      class="foot_submit_bar"
      v-if="header==='完成'"
    >
      <van-checkbox
        v-model="selectAll"
        class="foot_checkboox"
        checked-color="#B51A1A"
        @click="toggle()"
      >全选</van-checkbox>
    </van-submit-bar>
    <van-button
      type="primary"
      size="large"
      class="foot_button"
      @click="submit"
      v-else-if="(header==='编辑')&&(list.length>0)"
    >提交</van-button>
    <van-button
      type="primary"
      size="large"
      class="foot_button next"
      @click="submit"
      v-else-if="(header==='编辑')&&(list.length==0)"
    >提交</van-button>
    <div v-else-if="header===''" class="send_box">
      <span class="share_box" @click.stop="shareClick">
        <img src="../assets/imgs/share.png" alt />
        <div>分享</div>
      </span>
      <span class="screenshot_box" @click.stop="downloadPicture">
        <img src="../assets/imgs/screenshot.png" alt />
        <div>截图</div>
      </span>
      <van-button type="primary" size="normal" class="send" @click.stop="send">发送</van-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { SubmitBar, Checkbox, Button, Toast } from "vant";
import { mapMutations, mapActions } from "vuex";
Vue.use(SubmitBar)
  .use(Checkbox)
  .use(Button);
export default {
  data() {
    return {
      checked: false
    };
  },
  computed: {
    header: {
      set(value) {
        console.log("set", value);
        this.setHeader(value);
      },
      get() {
        return this.$store.state.header;
      }
    },
    selectAll: {
      set(value) {
        // console.log("set", value);
        this.setSelectAll(value);
      },
      get() {
        return this.$store.state.selectAll;
      }
    },
    list: {
      set(value) {
        console.log("set", value);
        this.setList(value);
      },
      get() {
        return this.$store.state.list;
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
  methods: {
    ...mapMutations(["setHeader", "setSelectAll", "setList"]),
    ...mapActions([
      "cartDeleteList",
      "createOrder",
      "sendEmail",
      "getImageUrl"
    ]),
    submit() {
      if (this.list.length > 0) {
        this.setHeader("");
        //调用生成订单接口
        this.createOrder({});
      } else {
        return
      }
    },
    toggle() {
      this.selectAll = !this.selectAll;
      console.log("selectAll", this.selectAll);
      if (this.selectAll === true) {
        //全选
        this.list.map((item, index) => {
          console.log("item", item);
          console.log("index", index);
          item.isChecked = true;
        });
      } else {
        //反选
        this.list.map((item, index) => {
          item.isChecked = false;
        });
      }
    },
    onSubmit() {
      console.log("this.list", this.list);
      const deleteArr = [];
      for (let i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i].isChecked === true) {
          deleteArr.push(this.list[i].seqId);
          this.list.splice(i, 1);
          console.log("this.list", this.list);
          this.setList(this.list);
          console.log("this.list", this.list);
        }
      }
      console.log("deleteArr", deleteArr);
      if (deleteArr.length > 0) {
        //调用接口  删除接口中的数据
        const params = { cartIdList: deleteArr };
        this.cartDeleteList(params, () => {
          console.log("删除成功");
        });
      } else {
        //展示请先选择一个要删除的
        Toast.fail("请先选择一个要删除的");
      }
    },
    send() {
      const _this = this;
      try {
        this.$bridge.callhandler("LatitudeAndlongitude", "", data => {
          //返回到原生app
          const { strlongitude, strlatitude } = data;
          const params = {
            orderNo: this.orderNo,
            longitude: strlongitude,
            latitude: strlatitude
          };
          _this.sendEmail(params);
        });
      } catch (error) {
        console.log("getting Erroring", error);
        Toast.fail(error);
      }
    },
    shareClick() {
      let shareUrl;
      switch (process.env.NODE_ENV) {
        case "development":
          // shareUrl = `http://10.16.18.229:8080/distributor?orderNo=${this.orderNo}`; //dev环境分享地址
          shareUrl = `https://freyh5-dev.dataenlighten.com/distributor?orderNo=${this.orderNo}`; //dev环境分享地址
          break;
        case "test":
          shareUrl = `https://freyh5-uat.dataenlighten.com/distributor?orderNo=${this.orderNo}`; //uat环境分享地址
          break;
        case "ppt":
          shareUrl = `https://freyh5.dataenlighten.com/distributor?orderNo=${this.orderNo}`; //ppt环境分享地址
          break;
        case "production":
          shareUrl = `https://freyh5.dataenlighten.com/distributor?orderNo=${this.orderNo}`; //生产环境分享地址
          break;
      }
      try {
        this.$bridge.callhandler(
          "share",
          {
            shareUrl: shareUrl,
            title: "菲尔奔宝app配件清单",
            titleContent: "由菲尔奔宝app分享出来的配件清单",
            img:
              "https://mj-km-admin-portal.oss-cn-shenzhen.aliyuncs.com/h5/feier-h5/ic_launcher.png"
          },
          data => {}
        );
      } catch (error) {
        console.log("getting Erroring", error);
        Toast.fail("分享失败");
      }
    },
    downloadPicture() {
      this.getImageUrl(url => {
        //调用接口成功的回调
        try {
          this.$bridge.callhandler(
            "downloadPictures",
            {
              img: url
            },
            data => {}
          );
        } catch (error) {
          console.log("getting Erroring", error);
          Toast.fail("下载图片失败");
        }
      });
    }
  }
};
</script>
<style lang="scss">
.foot_submit_bar {
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    & {
      bottom: px2rem(20) !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    & {
      bottom: px2rem(20) !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    & {
      bottom: px2rem(20) !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  .van-submit-bar__bar {
    justify-content: space-between;
    height: px2rem(120);
  }
  .foot_checkboox {
    padding-left: px2rem(48);
    font-size: px2rem(32);
    .van-checkbox__icon {
      font-size: px2rem(35) !important;
      .van-icon-success:before {
        width: px2rem(35);
        height: px2rem(35);
      }
    }
    .van-checkbox__label {
      color: rgba(103, 103, 103, 1);
      font-size: px2rem(32);
    }
  }
  .van-submit-bar__button {
    background-color: #fff;
    color: $feier;
    width: px2rem(220);
    height: px2rem(72);
    line-height: px2rem(72);
    border-radius: px2rem(4);
    border: px2rem(2) solid rgba(181, 26, 26, 1);
    margin-right: px2rem(48);
    font-size: px2rem(32);
  }
}
.foot_button_box {
  // display:none !important;
  // padding-bottom: constant(safe-area-inset-bottom);
  position: fixed;
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    & {
      bottom: px2rem(20) !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    & {
      bottom: px2rem(20) !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    & {
      bottom: px2rem(20) !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
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
    &.next {
      background: rgba(181, 26, 26, 0.5);
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .send_box {
    width: 100%;
    padding-left: px2rem(27);
    font-size: 0;
  }
  .share_box,
  .screenshot_box {
    display: inline-block;
    vertical-align: top;
    div {
      font-size: px2rem(24);
      width: px2rem(120);
      text-align: center;
    }
  }
  .share_box {
    margin-top: px2rem(22);
    text-align: center;
    img {
      width: px2rem(37);
      margin-bottom: px2rem(13);
    }
  }
  .screenshot_box {
    margin-top: px2rem(20);
    text-align: center;
    img {
      width: px2rem(43);
      margin-bottom: px2rem(10);
    }
  }
  .send {
    vertical-align: top;
    width: px2rem(400);
    height: px2rem(88);
    background-color: $feier;
    border: $feier;
    border-radius: px2rem(4);
    margin-left: px2rem(39);
    margin-top: px2rem(16);
    font-size: px2rem(36);
  }
}
</style>

