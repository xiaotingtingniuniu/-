<template>
  <section class="page-substitute">
    <header class="substitute__header">
      <navigation :show-user-center="false" />
    </header>
    <main class="substitute__main">
      <div class="substitute__main__wrap">
        <vehicle-info :custom-vehicle="currentVehicle" :show-research="false" />
        <section>
          <header>
            <span>OE 信息</span>
          </header>
          <substitute-table
            :data="currentPartList"
            :searching="searching"
            :mouse-enter="handleMouseEnter"
            :mouse-leave="handleMouseLeave"
            :css-hover="false"
          />
        </section>
        <section>
          <header>
            <span>替换信息</span>
            <span class="sum">共 {{ substituteCount }} 条</span>
          </header>
          <substitute-table
            :data="subStituteList"
            :toast-message="toastMessage"
            :searching="searching"
            :mouse-enter="handleMouseEnter"
            :mouse-leave="handleMouseLeave"
            :css-hover="false"
          />
        </section>
      </div>
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import Navigation from '../components/Navigation.vue';
import SubstituteTable from '../components/SubstituteTable.vue';
import VehicleInfo from '../components/VehicleInfo.vue';

import { router_names } from '../config/constant';

export default {
  components: {
    Navigation,
    SubstituteTable,
    VehicleInfo,
  },
  computed: {
    ...mapGetters('substitute', ['currentPartList']),
    ...mapState('substitute', ['currentVehicle', 'subStituteList', 'substituteCount', 'toastMessage', 'searching']),
  },
  created() {
    this.loadState({
      oe: this.$route.params.oe,
      onError: this.handleGoHome,
    });
  },
  methods: {
    ...mapActions('substitute', ['loadState', 'updateHover']),
    handleGoHome() {
      this.$router.push({ name: router_names.HOME });
    },
    handleMouseEnter(currentItem) {
      this.updateHover({ index: currentItem.index, isHover: true });
    },
    handleMouseLeave(currentItem) {
      this.updateHover({ index: currentItem.index, isHover: false });
    },
  },
};
</script>

<style lang="scss">
 .vehicle-info .part_list {
    display: none;
  }
</style>

<style lang="scss" scoped>
.page-substitute {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .substitute__main {
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
}

.substitute__main__wrap {
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
    height: 82px;
    background-color: $--color-background;
  }

  section:last-child {
    margin-bottom: 30px;
  }

  header {
    display: flex;
    align-items: center;
    margin: 30px 0 13px 0;
    color: #303233;
    font-size: 16px;
    line-height: 1;

    .sum {
      margin-left: 10px;
      color: #616366;
      font-size: 12px;
    }
  }
}
</style>
