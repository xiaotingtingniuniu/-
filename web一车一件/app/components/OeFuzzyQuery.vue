<template>
  <section v-loading="loading" class="oe-fuzzy-query">
    <header class="oe-fuzzy-query__header">
      <span v-if="fuzzyQueryList.length">请确认想要的查询结果</span>
      <span class="count">共 {{ fuzzyQueryList.length }} 个结果</span>
    </header>
    <main class="oe-fuzzy-query__main">
      <header>
        <div class="cell oe">OE 号</div>
        <div class="cell brand">品牌</div>
        <div class="cell src-name">原厂名称</div>
        <div class="cell standard-name">标准名</div>
        <div class="cell btns" />
      </header>
      <main>
        <ul v-if="fuzzyQueryList.length">
          <li v-for="(item, index) in fuzzyQueryList" :key="index">
            <div class="cell oe">
              <span
                v-for="(c, subIndex) in item.partNumberChars"
                :key="subIndex"
                :class="{ 'is-highlight': c.isHighlight }"
              >
                <template>{{ c.char }}</template>
              </span>
            </div>
            <div class="cell brand">{{ item.brand }}</div>
            <div class="cell src-name">{{ item.srcPartName }}</div>
            <div class="cell standard-name is-gray">{{ item.stdPartName }}</div>
            <div class="cell btns">
              <button class="btn-select" @click="onSelect(item)">确认</button>
            </div>
          </li>
        </ul>
        <div v-else class="empty">
          <span>{{ toastMessage }}</span>
        </div>
      </main>
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import { session_types } from '../config/constant';

export default {
  computed: {
    ...mapState('oeQuery', ['toastMessage', 'loading']),
    ...mapGetters('oeQuery', ['fuzzyQueryList']),
  },
  methods: {
    onSelect(part) {
      const { partNumber, brand, brandClass, srcPartName, stdPartName, vehicleInfo, subBrand, partPrice } = part;
      const accuratePart = {
        partNumber,
        brand,
        brandClass,
        srcPartName,
        stdPartName,
        vehicleInfo,
        subBrand,
        partPrice,
      };

      sessionStorage.setItem(session_types.OE_ACCURATE_PART, JSON.stringify(accuratePart));
      open('#/oe');
      sessionStorage.removeItem(session_types.OE_ACCURATE_PART);
    },
  },
};
</script>

<style lang="scss" scoped>
.oe-fuzzy-query__header {
  display: flex;
  align-items: center;
  height: 20px;
  margin-bottom: 13px;

  span {
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    color: #e65c5c;

    &.count {
      margin: 0;
      font-size: 12px;
      line-height: 1;
      color: #616366;
    }
  }
}

.oe-fuzzy-query__main {
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

    &.src-name {
      width: 20%;
    }

    &.standard-name {
      flex: auto;
      width: 40%;
    }

    &.btns {
      flex: 0;
      width: 10%;
    }

    &.is-gray {
      color: #616366;
    }
  }

  .empty {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.btn-select {
  float: right;
  height: 28px;
  width: 80px;
  padding: 0;
  border: 1px solid #ff6700;
  color: #ff6700;
  background-color: rgba(255, 103, 0, 0.02);

  &:not(:disabled):hover {
    color: #fff;
    background-color: #ff6700;
  }
}
</style>
