<template>
  <section class="oe-vehicle-group">
    <header class="oe-vehicle-group__header">
      <div class="title">
        <span>适用车型</span>
      </div>
      <div class="btns">
        <button
          class="btn-all"
          :class="{ 'is-selected': !selectedSubBrand }"
          @click="selectedSubBrand = ''"
        >
          <template>全部</template>
        </button>
        <button
          v-for="item in subBrandList"
          :key="item"
          class="btn-sub-brand"
          :class="{ 'is-selected': selectedSubBrand === item }"
          @click="selectedSubBrand = item"
        >
          <template>{{ item }}</template>
        </button>
      </div>
    </header>
    <main class="oe-vehicle-group__main">
      <header>
        <div class="cell brand">适用品牌</div>
        <div class="cell sub-brand">适用厂牌</div>
        <div class="cell group">适用车组</div>
        <div class="cell btns" />
      </header>
      <main>
        <ul>
          <li v-for="(item, index) in selectedVehicleGroupList" :key="index">
            <div class="cell brand">{{ accuratePart.brand }}</div>
            <div class="cell sub-brand">{{ item.subBrand }}</div>
            <div class="cell group">{{ item.mjVehicleGroup }}</div>
            <div class="cell btns">
              <button
                :disabled="!item.partImageSet.length"
                class="btn-img"
                @click="toPartDetails(item)"
              >
                <template>查看图片</template>
              </button>
            </div>
          </li>
        </ul>
      </main>
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { router_names } from '../config/constant';

export default {
  computed: {
    ...mapState('oeQuery', ['accuratePart']),
    ...mapGetters('oeQuery', ['vehicleGroupList']),
    selectedSubBrand: {
      set(value = '') {
        this.$store.commit('oeQuery/setSelectedSubBrand', value);
      },
      get() {
        return this.$store.state.oeQuery.selectedSubBrand;
      },
    },
    subBrandList() {
      const subBrandList = [];

      this.vehicleGroupList.forEach(item => {
        if (subBrandList.includes(item.subBrand)) {
          return;
        }

        subBrandList.push(item.subBrand);
      });

      return subBrandList;
    },
    selectedVehicleGroupList() {
      return this.selectedSubBrand ? this.vehicleGroupList.filter(item => item.subBrand === this.selectedSubBrand) : this.vehicleGroupList;
    },
  },
  methods: {
    ...mapActions('oeQuery', ['updatePartDetails']),
    toPartDetails(item) {
      this.updatePartDetails(item);
      this.$router.push({ name: router_names.OE_PART_DETAILS });
    },
  },
};
</script>

<style lang="scss" scoped>
.oe-vehicle-group__header {
  margin-bottom: 13px;

  .title {
    margin-bottom: 12px;

    span {
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
      color: #303233;
    }
  }

  .btns {
    display: flex;
    flex-wrap: wrap;

    button {
      padding: 7px 17px;
      border: 1px solid #e6ecf2;
      @include border-one-px;
      margin-right: 6px;
      font-size: 12px;
      color: #797c80;
      background-color: #fff;

      &.btn-sub-brand {
        padding: 7px 6px;
      }

      &:not(.is-selected):hover {
        border-color: #ff6700;
        color: #ff6700;
      }

      &.is-selected {
        border-color: #ff6700;
        color: #fff;
        background-color: #ff6700;
        box-shadow: 0 1px 2px 0 rgba(225, 64, 0, 0.4);
      }
    }
  }
}

.oe-vehicle-group__main {
  border: $--border-main;
  @include border-one-px;
  margin-bottom: 30px;

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
      padding-top: 18px;
      padding-bottom: 18px;

      &:last-child {
        padding-right: 20px;
      }
    }
  }

  .cell {
    padding: 0 0 0 20px;
    box-sizing: border-box;

    &.oe {
      width: 15%;

      span.is-highlight {
        color: #e65c5c;
      }
    }

    &.brand {
      width: 15%;
    }

    &.sub-brand {
      width: 15%;
    }

    &.group {
      flex: auto;
    }

    &.btns {
      flex: 0;

      button {
        float: right;
        height: 28px;
        width: 80px;
        padding: 0;
        border: 1px solid #ff6700;
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
  }
}
</style>
