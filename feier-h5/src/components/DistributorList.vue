<template>
  <div class="position-box">
    <!-- 需要一个创建一个父容器 组件高度默认等于父容器的高度 -->
    <vue-better-scroll
      v-if="distributor.length>0"
      class="wrapper"
      ref="scroll"
      :scrollbar="scrollbarObj"
      :pullDownRefresh="pullDownRefreshObj"
      :pullUpLoad="pullUpLoadObj"
      :startY="parseInt(startY)"
      @pullingDown="onPullingDown"
      @pullingUp="onPullingUp"
    >
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in bannerImageList" :key="index">
          <img
            class="swipe_img"
            :src="item.slideImageUrl"
            alt
            @click="goto(item.linkUrl)"
          />
        </van-swipe-item>
       
      </van-swipe>
      <van-collapse
        v-model="activeNames"
        class="list_collapse list-content"
        v-for="(item,index) in distributor"
        :key="index"
        :title="index"
        :id="index"
      >
        <van-collapse-item
          v-if="item.oemPartName!=null"
          :title="item.oemPartName"
          :name="index"
          class="list_collapse_item list-item"
        >
          <van-cell title="菲尔号" v-if="item.mfrPartNo!=null" :value="item.mfrPartNo" />
          <van-cell title="菲尔号" v-else value="暂无" />
          <van-cell title="OE号" v-if="item.oemPartNo!=null" :value="item.oemPartNo" />
          <van-cell title="OE号" v-else value="暂无" />
          <van-cell title="4S建议零售价" v-if="item.partPrice4s!=null" :value="`${item.partPrice4s}元`" />
          <van-cell title="4S建议零售价" v-else value="暂无" />
          <van-cell
            title="菲尔建议零售价"
            v-if="item.mfrPartPrice!=null"
            :value="`${item.mfrPartPrice}元`"
          />
          <van-cell title="菲尔建议零售价" v-else value="暂无" />
          <van-cell title="需求数量" :value="item.count" />
          <van-cell title="经销商报价">
            <van-field
              v-model="item.quotedPrice"
              type="number"
              placeholder="请输入您的报价"
              @blur="getQuotedPrice"
              @focus="focus"
              @input="onChange"
            />
            <span class="yuan">元</span>
          </van-cell>
        </van-collapse-item>
        <van-collapse-item
          v-else-if="item.mfrPartName!=null"
          :title="item.mfrPartName"
          :name="index"
          class="list_collapse_item"
        >
          <van-cell title="菲尔号" v-if="item.mfrPartNo!=null" :value="item.mfrPartNo" />
          <van-cell title="菲尔号" v-else value="暂无" />
          <van-cell title="OE号" v-if="item.oemPartNo!=null" :value="item.oemPartNo" />
          <van-cell title="OE号" v-else value="暂无" />
          <van-cell title="4S建议零售价" v-if="item.partPrice4s!=null" :value="`${item.partPrice4s}元`" />
          <van-cell title="4S建议零售价" v-else value="暂无" />
          <van-cell
            title="菲尔建议零售价"
            v-if="item.mfrPartPrice!=null"
            :value="`${item.mfrPartPrice}元`"
          />
          <van-cell title="菲尔建议零售价" v-else value="暂无" />
          <van-cell title="需求数量" :value="item.count" />
          <van-cell title="经销商报价">
            <van-field
              v-model="item.quotedPrice"
              type="number"
              placeholder="请输入您的报价"
              @blur="getQuotedPrice"
              @focus="focus"
              @input="onChange"
            />
            <span class="yuan">元</span>
          </van-cell>
        </van-collapse-item>
        <van-collapse-item v-else title="暂无" :name="index" class="list_collapse_item">
          <van-cell title="菲尔号" v-if="item.mfrPartNo!=null" :value="item.mfrPartNo" />
          <van-cell title="菲尔号" v-else value="暂无" />
          <van-cell title="OE号" v-if="item.oemPartNo!=null" :value="item.oemPartNo" />
          <van-cell title="OE号" v-else value="暂无" />
          <van-cell title="4S建议零售价" v-if="item.partPrice4s!=null" :value="`${item.partPrice4s}元`" />
          <van-cell title="4S建议零售价" v-else value="暂无" />
          <van-cell
            title="菲尔建议零售价"
            v-if="item.mfrPartPrice!=null"
            :value="`${item.mfrPartPrice}元`"
          />
          <van-cell title="菲尔建议零售价" v-else value="暂无" />
          <van-cell title="需求数量" :value="item.count" />
          <van-cell title="经销商报价">
            <van-field
              v-model="item.quotedPrice"
              type="number"
              placeholder="请输入您的报价"
              @blur="getQuotedPrice"
              @focus="focus"
              @input="onChange"
            />
            <span class="yuan">元</span>
          </van-cell>
        </van-collapse-item>
      </van-collapse>
    </vue-better-scroll>
    <div v-else class="no-data">您还未添加列表</div>
  </div>
</template>
<script>
import {
  List,
  Collapse,
  CollapseItem,
  Cell,
  Icon,
  Stepper,
  Field,
  Toast,
  Swipe,
  SwipeItem
} from "vant";
import Vue from "vue";
import VueBetterScroll from "vue2-better-scroll";
import { mapMutations, mapActions } from "vuex";
import http from "../utils/http";
import getQuery from "../utils/getQuery";
let count = 1;
Vue.use(Cell)
  .use(Collapse)
  .use(CollapseItem)
  .use(Icon)
  .use(Stepper)
  .use(Field)
  .use(Toast)
  .use(Swipe)
  .use(SwipeItem);
export default {
  name: "LoadingList",
  components: { VueBetterScroll },
  data() {
    return {
      testList: [],
      finished: false,
      activeNames: [0],
      title1: "前翼子板（左）",
      title2: "前翼子板（右）",

      page: 1,
      scrollbarObj: {
        fade: true
      },
      // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
      pullDownRefreshObj: {
        threshold: 90,
        stop: 30
      },
      // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
      pullUpLoadObj: {
        threshold: 0,
        txt: {
          more: "加载更多",
          noMore: "没有更多数据了"
        }
      },
      startY: 0, // 纵轴方向初始化位置
      scrollToX: 0,
      scrollToY: 0,
      scrollToTime: 700,
      items: []
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
    distributor: {
      set(value) {
        console.log("set", value);
        this.setDistributor(value);
      },
      get() {
        return this.$store.state.distributor;
      }
    },
    isLoading: {
      set(value) {
        console.log("set", value);
        this.setLoading(value);
      },
      get() {
        return this.$store.state.isLoading;
      }
    },
    distributorListTotalPage: {
      set(value) {
        console.log("set", value);
        this.setDistributorListTotalPage(value);
      },
      get() {
        return this.$store.state.distributorListTotalPage;
      }
    },
    bannerImageList: {
      set(value) {
        console.log("set", value);
        this.setBannerImageList(value);
      },
      get() {
        return this.$store.state.bannerImageList;
      }
    },
  },
  methods: {
    ...mapMutations([
      "setHeader",
      "setLoading",
      "setOrderNo",
      "setAccessoriesTotalPage",
      "setDistributor",
      "setCanGoToInformation",
      "setBannerImageList"
    ]),
    ...mapActions([
      "accessoriesList",
      "cartUpdateCount",
      "distributorList",
      "getBannerImageList"
    ]),
    // 滚动到页面顶部
    scrollTo() {
      this.$refs.scroll.scrollTo(
        this.scrollToX,
        this.scrollToY,
        this.scrollToTime
      );
    },
    onPullingDown() {
      // 模拟下拉刷新
      console.log("下拉刷新");
      this.setDistributor([]);
      this.page = 1;
      const orderNo = getQuery.GetQueryString("orderNo");
      const params = {
        orderNo: orderNo,
        page: this.page.toString(),
        limit: "5"
      };
      console.log("params", params);
      this.distributorList(params);
      this.$refs.scroll.forceUpdate(true);
      this.setCanGoToInformation(false);
    },
    onPullingUp() {
      // 模拟上拉 加载更多数据
      if (this.distributorListTotalPage > this.page) {
        console.log("上拉加载");
        this.page = this.page + 1;
        const orderNo = getQuery.GetQueryString("orderNo");
        const params = {
          orderNo: orderNo,
          page: this.page.toString(),
          limit: "5"
        };
        this.distributorList(params);
        this.$refs.scroll.forceUpdate(true);
      } else {
        this.$refs.scroll.forceUpdate(false);
      }
    },
    onChange(e) {
      //input框内容改变了
      if (e != null) {
        this.setCanGoToInformation(true);
      }
    },
    getQuotedPrice() {
      //blur
      this.scrollTo();
      document.getElementsByClassName("header-box")[0].style.cssText =
        "position:fixed;width:100%;z-index:1;";
    },
    focus(value) {
      console.log("value", value);
      //focus
      this.iosKeyboard();
    },
    iosKeyboard() {
      if (/iphone|ipad/i.test(navigator.userAgent.toLowerCase())) {
        document.getElementsByClassName("header-box")[0].style.cssText =
          "position:absolute;width:100%;";
      } else {
        // document.getElementsByClassName(
        //   "scroll-content"
        // )[0].firstChild.style.paddingBottom = "400px";
      }
    },
    goto(url) {
      //跳转banner页面
      window.location.href = url;
    }
  },
  created() {
    //没次进入页面的时候先清空展示数组
    this.setDistributor([]);
    const orderNo = getQuery.GetQueryString("orderNo");
    this.setOrderNo(orderNo);
    const params = {
      orderNo: orderNo,
      page: "1",
      limit: "5"
    };
    console.log("params", params);
    this.distributorList(params);
    const params1 = {
      pageType: "0"
    };
    this.getBannerImageList(params1);
  },
  mounted() {}
};
</script>
<style lang="scss" >
.swipe_img {
  vertical-align: top;
  width: 100%;
  height: px2rem(176);
}
.list_collapse {
  .list_collapse_item {
    margin-bottom: px2rem(24);
    .van-cell__title {
      font-size: px2rem(34);
      color: #333333;
    }
    .van-cell__value {
      font-size: px2rem(32);
      color: rgba(153, 153, 153, 1);
      .van-field {
        padding: 0;
        width: px2rem(300);
        background-color: rgba(242, 243, 245, 1);
        display: inline-block;
        vertical-align: top;
      }
      .yuan {
        display: inline-block;
        vertical-align: top;
        // margin-left:px2rem(16);
      }
      .van-cell:not(:last-child)::after {
        border: none;
      }
      .van-field__body input {
        margin-left: px2rem(39);
        margin-right: px2rem(45);
        font-size: px2rem(32);
        width: px2rem(223);
      }
    }
    .van-collapse-item__content {
      padding: 0px !important;
    }
  }
  .check_box {
    margin-right: px2rem(17);
    .van-checkbox__icon {
      font-size: px2rem(35) !important;
      .van-icon-success:before {
        width: px2rem(35);
        height: px2rem(35);
      }
    }
  }
}
.position-box {
  position: fixed;
  top: px2rem(88);
  left: 0;
  right: 0;
  bottom: 0;
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    //苹果x

    .scroll-content:first-child {
      padding-bottom: px2rem(100);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    .scroll-content:first-child {
      padding-bottom: px2rem(100);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    .scroll-content:first-child {
      padding-bottom: px2rem(100);
    }
  }
  .scroll-content:first-child {
    padding-bottom: px2rem(200);
  }
  .pulldown-wrapper {
    //   z-index: -1;
    height: px2rem(100);
    .after-trigger {
      font-size: 0px;
    }
  }
  .pullup-wrapper {
    .before-trigger {
      font-size: 0;
    }
  }
  .scroll-wrapper.wrapper {
    // height:px2rem(1334-64*2-88-120);
  }
}
.no-data {
  font-size: px2rem(32);
  height: px2rem(1334-88-120);
  display: flex;
  /*主轴居中对齐*/
  justify-content: center;
  /*侧轴居中对齐*/
  align-items: center;
}
</style>

