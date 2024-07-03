<template>
  <section class="page-vin">
    <header class="vin__header">
      <navigation ref="nav" :show-vehicle-info="true" />
    </header>
    <main ref="main" class="vin__main" @scroll="handleScroll">
      <div class="vin__main__wrap">
        <vehicle-info class="from_pagevin" />
        <search-input
          ref="input"
          v-model="inputKeyword"
          placeholder="请输入配件名称／OE号"
          example-type="key"
          history-name="vin-key"
          @search="handleSearch"
          @select="handleSelect"
        />
        <common-parts />
        <part-list />
      </div>
      <top ref="top" @click="scrollToTop" />
    </main>
  </section>
</template>

<script>
import _ from 'lodash';
import { mapState, mapMutations, mapActions } from 'vuex';

import CommonParts from '../components/CommonParts.vue';
import Navigation from '../components/Navigation.vue';
import PartList from '../components/PartList.vue';
import SearchInput from '../components/SearchInput.vue';
import Top from '../components/Top.vue';
import VehicleInfo from '../components/VehicleInfo.vue';

import { router_names } from '../config/constant';

export default {
  components: {
    CommonParts,
    Navigation,
    PartList,
    SearchInput,
    Top,
    VehicleInfo,
  },
  computed: {
    inputKeyword: {
      set(value = '') {
        this.$store.commit('vinQuery/setInputKeyword', value);
      },
      get() {
        return this.$store.state.vinQuery.inputKeyword;
      },
    },
    ...mapState('vinQuery', ['currentVehicle']),
  },
  mounted() {
    if (!this.currentVehicle.vinCode && !this.currentVehicle.mjsid) {
      this.$router.push({ name: router_names.HOME });
    }
  },
  methods: {
    ...mapActions('vinQuery', ['queryPartsByKey', 'clearResult']),
    ...mapMutations('vinQuery', ['setSelectKeyword']),
    handleScroll: _.debounce(function (ev) {
      const { scrollTop } = ev.target;

      // 控制回到顶部按钮的出现和隐藏
      if (scrollTop > 150) {
        this.$refs.top.show();
      } else {
        this.$refs.top.hide();
      }

      // 控制 Navigation 的内容切换
      if (scrollTop > 82) {
        this.$refs.nav.handleDown();
      } else {
        this.$refs.nav.handleUp();
      }
    }, 150),
    handleClear() {
      this.inputKeyword = '';
      this.$refs.inputKeyword.focus();
    },
    handleSearch() {
      if (this.inputKeyword) {
        this.setSelectKeyword('');
        this.queryPartsByKey(() => this.$refs.input.updateHistory());
      } else {
        this.clearResult();
      }
    },
    handleSelect(payload) {
      this.inputKeyword = payload;
      this.setSelectKeyword('');
      this.queryPartsByKey(() => this.$refs.input.updateHistory());
    },
    scrollToTop() {
      this.$refs.main.scrollTop = 0;
    },
  },
};
</script>

<style lang="scss">
.from_pagevin .part_list {
  display: none;
}
</style>

<style lang="scss" scoped>
.page-vin {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .vin__main {
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
}

.vin__main__wrap {
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
    height: 130px;
    background-color: $--color-background;
  }
}
</style>
