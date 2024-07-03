<template>
  <section v-loading="loading" class="oe-accurate-query">
    <header class="oe-accurate-query__header">
      <span>查询结果</span>
    </header>
    <main class="oe-accurate-query__main">
      <div class="current-oe">
        <span>OE号: {{ accuratePart.partNumber }}</span>
        <button :disabled="noVehicle" class="btn-vehicle" @click="handleClick">查看适用车型</button>
      </div>
      <div class="oe-accurate-query__table">
        <header>
          <div class="cell brand">适用品牌</div>
          <div class="cell sub-brand">适用厂牌</div>
          <div class="cell src-name">原厂名称</div>
          <div class="cell standard-name">标准名</div>
          <div class="cell price">4S店价格</div>
        </header>
        <main>
          <ul v-if="accurateQueryList.length">
            <li v-for="(item, index) in accurateQueryList" :key="index">
              <div class="cell brand">{{ accuratePart.brand }}</div>
              <div class="cell sub-brand">{{ accuratePart.subBrand }}</div>
              <div class="cell src-name">{{ accuratePart.srcPartName }}</div>
              <div class="cell standard-name is-gray">{{ accuratePart.stdPartName }}</div>
              <div class="cell price">{{ (accuratePart.partPrice!==''&&accuratePart.partPrice!==null)?`￥${accuratePart.partPrice}`:'暂无价格' }}</div>
            </li>
          </ul>
          <div v-else class="empty">
            <span>{{ toastMessage }}</span>
          </div>
        </main>
      </div>
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import { router_names } from '../config/constant';

export default {
  computed: {
    ...mapState('oeQuery', ['accuratePart', 'loading', 'toastMessage']),
    ...mapGetters('oeQuery', ['accurateQueryList', 'noVehicle']),
  },
  methods: {
    ...mapMutations('oeQuery', ['setSelectedSubBrand']),
    handleClick() {
      this.setSelectedSubBrand('');
      this.$router.push({ name: router_names.VEHICLE_GROUP });
    },
  },
};
</script>

<style lang="scss" scoped>
.oe-accurate-query__header {
  display: flex;
  align-items: center;
  height: 20px;
  margin-bottom: 13px;

  span {
    font-size: 14px;
    font-weight: bold;
    color: #303233;
  }
}

.oe-accurate-query__main {
  margin-bottom: 30px;
}

.current-oe {
  display: flex;
  align-items: center;
  margin: 13px 0;

  span {
    font-size: 14px;
    color: #000000;
  }

  .btn-vehicle {
    float: right;
    height: 28px;
    width: 100px;
    padding: 0;
    border: 1px solid #ff6700;
    margin-left: 10px;
    color: #ff6700;
    background-color: rgba(255, 103, 0, 0.02);

    &:disabled {
      border: 1px solid #dadfe6;
      border-radius: 4px;
      color: #aaaeb3;
      background: #f5f6f7;
    }

    &:not(:disabled):hover {
      color: #fff;
      background-color: #ff6700;
    }
  }
}

.oe-accurate-query__table {
  border: $--border-main;
  @include border-one-px;

  header {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 12px;
    color: #616366;
    background-color: $--color-background;
  }

  li {
    display: flex;
    align-items: center;
    font-size: 14px;
    transition: background-color 0.1s ease;

    &:hover {
      background-color: #f0f2f5;
    }

    &:not(:first-child) {
      border-top: $--border-main;
      @include border-one-px;
    }

    .cell {
      padding-top: 21px;
      padding-bottom: 21px;

      &:last-child {
        padding-right: 20px;
      }
    }
  }

  .cell {
    box-sizing: border-box;
    padding: 0 0 0 20px;
    line-height: 1;

    &.brand {
      width: 15%;
    }

    &.sub-brand {
      width: 15%;
    }

    &.src-name {
      width: 25%;
    }

    &.standard-name {
      width: 25%;
    }

    &.price {
      width: 20%;
    }

    &.is-gray {
      color: #616366;
    }
  }
}
</style>
