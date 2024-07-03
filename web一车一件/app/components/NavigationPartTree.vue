<template>
  <nav>
    <div class="nav__step" @click="handleGoHome">{{ vehicleBrand }}</div>
    <div class="arrow">>></div>
    <div class="nav__step" @click="handleGoVINPartInfo">返回上一页</div>
    <div class="arrow">>></div>
    <div class="title">结构树查询</div>
    <div
      ref="vi"
      :class="{ 'is-expanded': isExpanded, 'is-animation': isAnimation }"
      class="part-tree__vehicle-info"
    >
      <div class="vehicle-info__shadow" />
      <div class="vehicle-info__handler" @click="handleCollapse">
        <transition name="fade" mode="out-in">
          <span :key="vehicleInfoState">{{ buttonArrow }}</span>
        </transition>
        <template>车辆信息</template>
      </div>
      <vehicle-info :start-cut-off="true" :show-research="false" />
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import VehicleInfo from './VehicleInfo.vue';
import { router_names } from '../config/constant';

const STATE_COLLAPSED = 'collapsed';
const STATE_EXPANDED = 'expanded';

export default {
  components: {
    VehicleInfo,
  },
  data: () => ({
    vehicleInfoState: STATE_COLLAPSED,
    isCD: false,
    isAnimation: false,
  }),
  computed: {
    ...mapGetters('partTree', {
      currentVehicle: 'currentVehicle',
    }),
    vehicleBrand() {
      const { vinCode, maker, serial } = this.currentVehicle;
      return `返回首页 ${vinCode}［${maker} ${serial}］`;
    },
    buttonArrow() {
      switch (this.vehicleInfoState) {
        case STATE_COLLAPSED:
          return '<<';
        case STATE_EXPANDED:
        default:
          return '>>';
      }
    },
    isExpanded() {
      return this.vehicleInfoState === STATE_EXPANDED;
    },
  },
  mounted() {
    this.changeTranslateX();
  },
  methods: {
    handleGoHome() {
      this.$router.push({ name: router_names.HOME });
    },
    handleGoVINPartInfo() {
      this.$router.push({ name: router_names.VIN });
    },
    handleCollapse() {
      if (this.isCD) {
        return;
      }
      this.isCD = true;

      switch (this.vehicleInfoState) {
        case STATE_COLLAPSED:
          this.vehicleInfoState = STATE_EXPANDED;
          break;
        case STATE_EXPANDED:
          this.vehicleInfoState = STATE_COLLAPSED;
          break;
      }
      this.changeTranslateX();

      setTimeout(() => {
        this.isCD = false;
      }, 200);
    },
    changeTranslateX() {
      if (this.vehicleInfoState === STATE_EXPANDED) {
        const vi = this.$refs.vi;
        if (vi) {
          vi.style.transform = 'translateX(0)';
        }
      } else {
        const vi = this.$refs.vi;
        if (vi) {
          const viInner = vi.querySelector('.vehicle-info');
          const fixWidth = viInner ? viInner.clientWidth : 0;
          if (fixWidth) {
            vi.style.transform = `translateX(${fixWidth - 20}px)`;
          }

          setTimeout(() => {
            this.isAnimation = true;
          }, 500);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 60px;
  width: 100%;
  padding: 0 24px;
  border-bottom: 1px solid #dadfe6;
  font-size: 14px;
  overflow: hidden;

  .nav__step {
    color: #303233;
    cursor: pointer;

    &:hover {
      color: $--color-main;
    }
  }

  .arrow {
    margin: 0 10px;
    user-select: none;
  }

  .title {
    color: #797c80;
  }
}

.part-tree__vehicle-info {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  transform: translateX(calc(100% - 122px));
  /deep/.part_list{
    display: none;
  }
  &.is-animation {
    transition: 0.5s;
  }

  &.is-expanded {
    transform: translateX(0);
  }

  .vehicle-info__shadow {
    height: 100%;
    width: 8px;
    margin-right: 20px;
    background-image: linear-gradient(90deg, rgba(121, 124, 128, 0) 0%, rgba(121, 124, 128, 0.1) 96%);
  }

  .vehicle-info__handler {
    color: #303233;
    font-size: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: $--color-main;
    }

    span {
      margin-right: 10px;
    }
  }

  /deep/.vehicle-info {
    padding: 0 20px 0 0;

    .text {
      font-size: 12px;
    }

    span {
      margin: 0 20px;
    }
  }
}
</style>
