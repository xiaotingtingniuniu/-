<template>
  <section class="page-oe">
    <header class="oe__header">
      <navigation ref="nav" show-oe-search-input />
    </header>
    <main ref="main" class="oe__main" @scroll="handleScroll">
      <div class="oe__main__wrap">
        <search-input ref="input" v-model="oe" placeholder="请输入5位以上OE号" example-type="oe" history-name="home-oe" @search="handleSearch" @select="handleSelect" />
        <oe-accurate-query v-if="isAccurate" />
        <oe-fuzzy-query v-else />
      </div>
      <top ref="top" @click="scrollToTop" />
    </main>
  </section>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions } from 'vuex';

import Navigation from '../components/Navigation.vue';
import OeAccurateQuery from '../components/OeAccurateQuery.vue';
import OeFuzzyQuery from '../components/OeFuzzyQuery.vue';
import SearchInput from '../components/SearchInput.vue';
import Top from '../components/Top.vue';

import { router_names } from '../config/constant';

export default {
  components: {
    Navigation,
    OeAccurateQuery,
    OeFuzzyQuery,
    SearchInput,
    Top,
  },
  computed: {
    ...mapGetters('oeQuery', ['isAccurate']),
    oe: {
      set(value = '') {
        this.$store.commit('oeQuery/setOE', value);
      },
      get() {
        return this.$store.state.oeQuery.oe;
      },
    },
  },
  mounted() {
    if (!this.oe) {
      this.$router.push({ name: router_names.HOME });
    }
  },
  beforeDestroy() {
    this.cancelRequest();
  },
  methods: {
    ...mapActions('oeQuery', ['queryPartsByOe', 'clearResult', 'cancelRequest']),
    handleScroll: _.debounce(function (ev) {
      const { scrollTop } = ev.target;

      // 控制回到顶部按钮的出现和隐藏
      if (scrollTop > 150) {
        this.$refs.top.show();
      } else {
        this.$refs.top.hide();
      }

      // 控制 Navigation 的内容切换
      if (scrollTop > 100) {
        this.$refs.nav.handleDown();
      } else {
        this.$refs.nav.handleUp();
      }
    }, 150),
    scrollToTop() {
      this.$refs.main.scrollTop = 0;
    },
    handleSearch() {
      if (this.oe) {
        this.queryPartsByOe(() => this.$refs.input.updateHistory());
      } else {
        this.clearResult();
      }
    },
    handleSelect() {
      this.queryPartsByOe(() => this.$refs.input.updateHistory());
    },
  },
};
</script>

<style lang="scss" scoped>
.page-oe {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .oe__main {
    height: calc(100vh - 60px);
    overflow-y: auto;

    .search-input {
      margin: 20px 0;
    }
  }
}

.oe__main__wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: calc(100vh - 60px + 1px); // 使页面一直处于可滚动状态，避免 vuescroll 突然出现带来的页面抖动
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
    height: 70px;
    background-color: $--color-background;
  }
}
</style>
