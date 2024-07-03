<template>
  <div class="vehicle-info">
    <template v-for="(item, index) in items">
      <div v-if="vehicle[item.key]" :key="index" class="vehicle-info_wrap">
        <span />
        <div class="item">
          <p class="title">{{ item.label }}</p>
          <p class="text">{{ vehicle[item.key] }}</p>
        </div>
      </div>
    </template>
    <button v-if="showResearch" class="btn-research" @click="handleGoHome">重新查询</button>
    <div class="part_list" @click="goPartsList">
      <i class="icon_list" style="" />
      <span>配件清单</span>
      <span class="list_total">{{ partsListTotal }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { router_names } from '../config/constant';

export default {
  props: {
    startCutOff: {
      type: Boolean,
      required: false,
      default: false,
    },
    showResearch: {
      type: Boolean,
      required: false,
      default: true,
    },
    customVehicle: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data: () => ({
    items: [
      { label: 'VIN', key: 'vinCode' },
      { label: '车辆品牌', key: 'maker' },
      { label: '车系', key: 'serial' },
      { label: '年份', key: 'year' },
      { label: '排量', key: 'motor' },
      { label: '变速箱', key: 'transmission' },
    ],
  }),
  computed: {
    vehicle() {
      return this.customVehicle || this.$store.state.vinQuery.currentVehicle;
    },
    ...mapState('partsList', ['partsListTotal']),
  },
  methods: {
    handleGoHome() {
      this.$emit('research');
      this.$router.push({ name: router_names.HOME });
    },
    goPartsList() {
      open('#/parts-list');
    },
  },
};
</script>

<style lang="scss" scoped>
.vehicle-info {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 30px;

  .vehicle-info_wrap {
    display: flex;
    align-items: center;

    span {
      height: 40px;
      @include width-one-px;
      margin: 0 30px;
      background-color: #ced3d9;
    }

    &:first-child span {
      display: none;
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 12px;
      color: #797c80;
    }

    .text {
      font-size: 16px;
      color: #000;
    }
  }
}
.part-tree__vehicle-info{
  .vehicle-info{
    .vehicle-info_wrap{
      &:first-child span{
        display: block;
      }
    }
  }
}
.btn-research {
  height: 36px;
  padding: 9px 20px;
  border: 1px solid #ff6700;
  margin-left: 60px;
  color: #ff6700;
  background-color: #fff;

  &:not(:disabled):hover {
    color: #fff;
    background-color: #ff6700;
  }
}

.part_list {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  font-size: 0;

  span {
    display: inline-block;
    height: 100%;
    width: auto;
    margin: 0;
    vertical-align: middle;
    line-height: 60px;
    font-size: 14px;
    background-color: #fff;
  }

  .icon_list {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    font-size: 14px;
    background-image: url('../images/icon_list@2x.png');
    background-size: contain;
    vertical-align: middle;
  }

  .list_total {
    margin-left: 5px;
    color: #ff6700;
  }
}

.part_list:hover {
  color: #ff6700;
  cursor: pointer;

  .icon_list {
    background-image: url('../images/icon_list_hover@2x.png');
  }
}
</style>
