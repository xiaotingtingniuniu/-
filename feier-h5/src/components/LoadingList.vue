<template>
  <div class="position-box">
    <!-- 需要一个创建一个父容器 组件高度默认等于父容器的高度 -->
    <vue-better-scroll
      v-if="list.length>0"
      class="wrapper"
      ref="scroll"
      :scrollbar="scrollbarObj"
      :pullDownRefresh="pullDownRefreshObj"
      :pullUpLoad="pullUpLoadObj"
      :startY="parseInt(startY)"
      @pullingDown="onPullingDown"
      @pullingUp="onPullingUp"
    >
      <van-collapse
        v-model="activeNames"
        class="list_collapse list-content"
        v-for="(item,index) in list"
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
          <van-checkbox
            v-model="item.isChecked"
            ref="checkboxes"
            name="item"
            slot="icon"
            checked-color="#B51A1A"
            class="check_box"
            @click.stop="toggle(item.seqId)"
            v-if="header==='完成'"
          ></van-checkbox>
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
          <van-cell title="需求数量" :value="item.count" v-if="header==='编辑'||header===''" />
          <van-cell title="需求数量" v-else-if="header==='完成'">
            <van-stepper
              v-model="item.count"
              @plus="plus(index,item.count)"
              @minus="minus(index,item.count)"
              @blur="blur(index,item.count)"
              @focus="focus()"
            />
          </van-cell>
        </van-collapse-item>
        <van-collapse-item
          v-else-if="item.mfrPartName!=null"
          :title="item.mfrPartName"
          :name="index"
          class="list_collapse_item"
        >
          <van-checkbox
            v-model="item.isChecked"
            ref="checkboxes"
            name="item"
            slot="icon"
            checked-color="#B51A1A"
            class="check_box"
            @click.stop="toggle(item.seqId)"
            v-if="header==='完成'"
          ></van-checkbox>
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
          <van-cell title="需求数量" :value="item.count" v-if="header==='编辑'||header===''" />
          <van-cell title="需求数量" v-else-if="header==='完成'">
            <van-stepper
              v-model="item.count"
              @plus="plus(index,item.count)"
              @minus="minus(index,item.count)"
              @blur="blur(index,item.count)"
            />
          </van-cell>
        </van-collapse-item>
        <van-collapse-item v-else title="暂无" :name="index" class="list_collapse_item">
          <van-checkbox
            v-model="item.isChecked"
            ref="checkboxes"
            name="item"
            slot="icon"
            checked-color="#B51A1A"
            class="check_box"
            @click.stop="toggle(item.seqId)"
            v-if="header==='完成'"
          ></van-checkbox>
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
          <van-cell title="需求数量" :value="item.count" v-if="header==='编辑'||header===''" />
          <van-cell title="需求数量" v-else-if="header==='完成'">
            <van-stepper
              v-model="item.count"
              @plus="plus(index,item.count)"
              @minus="minus(index,item.count)"
              @blur="blur(index,item.count)"
            />
          </van-cell>
        </van-collapse-item>
      </van-collapse>
    </vue-better-scroll>
    <div v-else class="no-data">您还未添加列表</div>
  </div>
</template>
<script>
import { List, Collapse, CollapseItem, Cell, Icon, Stepper, Toast } from "vant";
import Vue from "vue";
import VueBetterScroll from "vue2-better-scroll";
import { mapMutations, mapActions } from "vuex";
import http from "../utils/http";
let count = 1;
Vue.use(Cell)
  .use(Collapse)
  .use(CollapseItem)
  .use(Icon)
  .use(Stepper);
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
        stop: 40
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
    list: {
      set(value) {
        console.log("set", value);
        this.setList(value);
      },
      get() {
        return this.$store.state.list;
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
    accessoriesListTotalPage: {
      set(value) {
        console.log("set", value);
        this.setAccessoriesTotalPage(value);
      },
      get() {
        return this.$store.state.accessoriesListTotalPage;
      }
    }
  },
  methods: {
    ...mapMutations([
      "setHeader",
      "setLoading",
      "setList",
      "setAccessoriesTotalPage"
    ]),
    ...mapActions(["accessoriesList", "cartUpdateCount"]),
    toggle(seqId) {
      console.log("seqId", seqId);
      console.log("list", this.list);
      // console.log(this.list[index].isChecked);
      this.list.map((item, index) => {
        if (item.seqId === seqId) {
          item.isChecked = !item.isChecked;
          console.log(item.seqId);
          console.log(item.isChecked);
        }
      });
      // this.list[index].isChecked = !this.list[index].isChecked;
      // console.log(this.list[index].isChecked);
    },

    // 滚动到页面顶部
    scrollTo() {
      this.$refs.scroll.scrollTo(
        this.scrollToX,
        this.scrollToY,
        this.scrollToTime
      );
    },
    // 模拟数据请求
    getData() {
      return new Promise(resolve => {
        setTimeout(() => {
          const arr = [];
          for (let i = 0; i < 10; i++) {
            arr.push(count++);
          }
          resolve(arr);
        }, 1000);
      });
    },
    onPullingDown() {
      if (this.header === "完成" || this.header === "") {
        this.$refs.scroll.forceUpdate(false);
      } else {
        // 模拟下拉刷新
        console.log("下拉刷新");
        this.setList([]);
        this.page = 1;
        const params = { page: this.page.toString(), limit: "5" };
        console.log("params", params);
        this.accessoriesList(params);
        this.$refs.scroll.forceUpdate(true);
      }
    },
    onPullingUp() {
      // 模拟上拉 加载更多数据
      console.log("上拉");
      if (this.header === "完成" || this.header === "") {
        this.$refs.scroll.forceUpdate(false);
      } else {
        if (this.accessoriesListTotalPage > this.page) {
          console.log("上拉加载");
          this.page = this.page + 1;
          const params = { page: this.page.toString(), limit: "5" };
          this.accessoriesList(params);
          this.$refs.scroll.forceUpdate(true);
        } else {
          this.$refs.scroll.forceUpdate(false);
        }
      }
    },
    plus(index, value) {
      //调用后台接口
      const params = {
        shoppingCartList: [
          {
            seqId: this.list[index].seqId,
            count: value + 1
          }
        ]
      };
      this.cartUpdateCount(params);
    },
    minus(index, value) {
      //调用后台接口
      const params = {
        shoppingCartList: [
          {
            seqId: this.list[index].seqId,
            count: value - 1
          }
        ]
      };
      this.cartUpdateCount(params);
    },
    blur(index, value) {
      console.log(index);
      console.log(value);
      document.getElementsByClassName("header-box")[0].style.cssText =
        "position:fixed;width:100%;z-index:1;";
      //调用后台接口
      const params = {
        shoppingCartList: [
          {
            seqId: this.list[index].seqId,
            count: value
          }
        ]
      };
      this.cartUpdateCount(params);
    },
    focus() {
      console.log("focus");
      this.iosKeyboard();
    },
    iosKeyboard() {
      if (/iphone|ipad/i.test(navigator.userAgent.toLowerCase())) {
        document.getElementsByClassName("header-box")[0].style.cssText =
          "position:absolute;width:100%;";
      } else {
        document.getElementsByClassName(
          "scroll-content"
        )[0].firstChild.style.paddingBottom = "400px";
      }
    }
  },
  created() {}
};
</script>
<style lang="scss" >
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
  // margin-top:px2rem(88);
  height: px2rem(1334-120-88);
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    //苹果x
    & {
      height: px2rem(812 * 2-120-88-34-30) !important;
    }
    .scroll-content:first-child {
      padding-bottom: px2rem(200);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    & {
      height: px2rem(896 * 2-120-88-34-30) !important;
    }
    .scroll-content:first-child {
      padding-bottom: px2rem(200);
    }
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    & {
      height: px2rem(896 * 2-120-88-34-30) !important;
    }
    .scroll-content:first-child {
      padding-bottom: px2rem(200);
    }
  }
  .scroll-content:first-child {
    padding-bottom: px2rem(200);
  }
  position: fixed;
  top: px2rem(88);
  left: 0;
  right: 0;
  bottom: 0;

  .pulldown-wrapper {
    z-index: -1;
    // height: px2rem(100);
    .after-trigger {
      font-size: 0px;
    }
  }
  .pullup-wrapper {
    display: none;
    .before-trigger {
      font-size: 0;
    }
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

