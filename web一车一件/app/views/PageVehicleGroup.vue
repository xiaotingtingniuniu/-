<template>
  <section class="page-vehicle-group">
    <header class="vehicle-group__header">
      <navigation />
    </header>
    <main ref="main" class="vehicle-group__main" @scroll="handleScroll">
      <div class="vehicle-group__main__wrap">
        <div class="nav">
          <span class="btn-home" @click="handleGoHome">首页</span>
          <span class="arrow">>></span>
          <span class="btn-pre" @click="handleGoAccurateQuery">查询结果 ({{ accuratePart.partNumber }})</span>
          <span class="arrow">>></span>
          <span>适用车型</span>
        </div>
        <oe-vehicle-group />
      </div>
      <top ref="top" @click="scrollToTop" />
    </main>
  </section>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

import Navigation from '../components/Navigation.vue';
import OeVehicleGroup from '../components/OeVehicleGroup.vue';
import Top from '../components/Top.vue';

import { router_names } from '../config/constant';

export default {
  components: {
    Navigation,
    OeVehicleGroup,
    Top,
  },
  computed: {
    ...mapState('oeQuery', ['accuratePart']),
  },
  mounted() {
    if (!this.accuratePart.partNumber) {
      this.$router.push({ name: router_names.HOME });
    }
  },
  methods: {
    handleScroll: _.debounce(function (ev) {
      const { scrollTop } = ev.target;

      // 控制回到顶部按钮的出现和隐藏
      if (scrollTop > 150) {
        this.$refs.top.show();
      } else {
        this.$refs.top.hide();
      }
    }, 150),
    scrollToTop() {
      this.$refs.main.scrollTop = 0;
    },
    handleGoHome() {
      this.$router.push({ name: router_names.HOME });
    },
    handleGoAccurateQuery() {
      this.$router.push({ name: router_names.OE });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-vehicle-group {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .vehicle-group__main {
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
}

.vehicle-group__main__wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 50px;

  @media (max-width: 1279px) {
    padding: 0 10px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
    height: 40px;
    background-color: $--color-background;
  }

  .nav {
    display: flex;
    align-items: center;
    height: 40px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #303233;

    span:last-child {
      color: #797c80;
    }

    .arrow {
      margin: 0 10px;
    }

    .btn-home, .btn-pre {
      cursor: pointer;

      &:hover {
        color: #ff6700;
      }
    }
  }
}
</style>
