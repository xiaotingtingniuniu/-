<template>
  <div class="header-box">
    <van-nav-bar
      title="配件列表"
      left-text="返回"
      right-text="编辑"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goBackMethods"
      @click-right="editMethods"
      v-if="(header==='编辑')&&(list.length>0)"
    />
    <van-nav-bar
      title="配件列表"
      left-text="返回"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goBackMethods"
      @click-right="editMethods"
      v-if="(header==='编辑')&&(list.length===0)"
    />
    <van-nav-bar
      title="配件列表"
      left-text="返回"
      right-text="完成"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goBackMethods"
      @click-right="completeMethods"
      v-else-if="header==='完成'"
    />
    <van-nav-bar
      title="配件列表"
      left-text="返回"
      right-text="联系信息"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goBackMethods"
      @click-right="showContactInformation"
      v-else-if="header==='联系信息'&&headerDistributor==='配件列表'&&isApp==='App内部'"
    />
    <van-nav-bar
      title="配件列表"
      right-text="联系信息"
      class="title"
      :fixed="true"
      @click-left="goBackMethods"
      @click-right="showContactInformation"
      v-else-if="header==='联系信息'&&headerDistributor==='配件列表'&&isApp==='App外部'"
    />
    <van-nav-bar
      title="联系信息"
      left-text="返回"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goPreviousPage"
      @click-right="showContactInformation"
      v-else-if="headerDistributor==='联系信息'"
    />
    <van-nav-bar
      title="配件列表"
      left-text="返回"
      left-arrow
      class="title"
      :fixed="true"
      @click-left="goBackMethods"
      v-else-if="header===''"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { NavBar, Toast } from "vant";
import { mapMutations } from "vuex";
import getQuery from "../utils/getQuery";
Vue.use(NavBar);
export default {
  data() {
    return {
      isApp: "App内部" //是否在app内
    };
  },
  computed: {
    header: {
      set(value) {
        console.log("set", value);
        this.setHeader(value);
      },
      get() {
        console.log("this.$store.state.header", this.$store.state.header);
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
    ...mapMutations(["setHeader", "setList", "setHeaderDistributor"]),
    goBackMethods() {
      try {
        this.$bridge.callhandler("goBack", "", data => {
          //返回到原生app
        });
      } catch (error) {
        console.log("getting Erroring", error);
        Toast.fail(error);
      }
    },
    goPreviousPage() {
      //返回到上一页面
      location.href = document.referrer;
    },
    editMethods() {
      this.setHeader("完成");
    },
    completeMethods() {
      this.setHeader("编辑");
      if (/iphone|ipad/i.test(navigator.userAgent.toLowerCase())) {
      } else {
        document.getElementsByClassName(
          "scroll-content"
        )[0].firstChild.style.paddingBottom = "0";
      }
    },
    showContactInformation() {
      //联系信息
      this.setHeaderDistributor("联系信息");
    }
  },
  created() {
    const inApp = getQuery.GetQueryString("isApp");
    if (inApp === "false") {
      //页面不在App内部调用
      this.isApp = "App外部";
      console.log(this.isApp);
    } else {
      //页面在App内调用
      this.isApp = "App内部";
      console.log(this.isApp);
    }
  },
  mounted() {
    console.log("list", this.list.length);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
        background-color: $feier;
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
