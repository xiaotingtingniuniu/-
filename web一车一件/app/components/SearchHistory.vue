<template>
  <transition name="fade">
    <div v-show="showHistory && (history.length || showExample)" ref="searchHistory" class="search-history">
      <ul v-if="history.length">
        <li v-for="(item, index) in history" :key="index">
          <div class="content" @click="clickItem(item)">
            <template v-if="Array.isArray(item)">
              <span v-for="(i, childIndex) in item" :key="childIndex">{{ i }}</span>
            </template>
            <span v-else>{{ item }}</span>
          </div>
          <div class="btn-del" @click="deleteItem(item)">
            <i class="el-icon-close" />
          </div>
        </li>
      </ul>
      <ul v-else>
        <li>
          <div class="content" @click="clickItem(exampleItem)">
            <template v-if="isVIN">
              <span>示例VIN：{{ vinExample[0] }}</span>
              <span>{{ vinExample[1] }}</span>
            </template>
            <span v-else-if="isOE">示例原厂OE号：{{ oeExample }}</span>
            <span v-else>示例OE纠偏：{{ keyExample }}</span>
          </div>
          <div class="btn-del" />
        </li>
      </ul>
      <div v-if="history.length" class="btn-clear" @click="clear">清空历史记录</div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

import { local_types } from '../config/constant';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    exampleType: {
      type: String, // vin or oe or key
      required: false,
      default: '',
    },
  },
  data: () => ({
    showHistory: false,
    localHistory: [],
    accountHistory: {},
    history: [],
    vinExample: ['LJDGAA22490038620', '东风悦达起亚'],
    oeExample: '13717593250',
    keyExample: '863201X310',
  }),
  computed: {
    ...mapState('user', ['account']),
    ...mapState('vinQuery', ['currentVehicle']),
    isVIN() {
      return this.exampleType === 'vin';
    },
    isOE() {
      return this.exampleType === 'oe';
    },
    isKey() {
      return this.exampleType === 'key';
    },
    exampleItem() {
      switch (this.exampleType) {
        case 'vin':
          return this.vinExample;
        case 'oe':
          return this.oeExample;
        case 'key':
          return this.keyExample;
        default:
          return '';
      }
    },
    showExample() {
      if (this.isVIN || this.isOE) {
        return true;
      }

      if (this.isKey && this.currentVehicle && this.currentVehicle.vinCode === 'LJDGAA22490038620') {
        return true;
      }

      return false;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const localHistoryStr = localStorage.getItem(local_types.SEARCH_HISTORY);

      let newLocalHistory = JSON.parse(localHistoryStr);

      if (!Array.isArray(newLocalHistory)) {
        newLocalHistory = [];
      }

      this.localHistory = newLocalHistory;

      this.accountHistory.account = this.account;

      for (const item of this.localHistory) {
        if (item.account === this.account) {
          this.accountHistory = item;
        }
      }

      this.history = this.accountHistory[this.name] || [];
    },
    show() {
      this.init();
      this.showHistory = true;
    },
    hide() {
      this.showHistory = false;
    },
    clickItem(item) {
      this.hide();
      if (Array.isArray(item)) {
        this.$emit('item-select', item[0]);
      } else {
        this.$emit('item-select', item);
      }
    },
    deleteItem(item) {
      const newHistory = this.history.filter(i => JSON.stringify(i) !== JSON.stringify(item));
      this.history = newHistory;
      this.update();
    },
    clear() {
      this.history = [];
      this.update();
      this.hide();
    },
    add(item) {
      if (!item) {
        return;
      }
      const newHistory = this.history.filter(i => JSON.stringify(i) !== JSON.stringify(item));
      newHistory.unshift(item);
      this.history = newHistory.slice(0, 3);
      this.update();
    },
    update() {
      this.accountHistory[this.name] = this.history;

      const newLocalHistory = this.localHistory.filter(item => item.account !== this.account);

      newLocalHistory.push(this.accountHistory);

      while (newLocalHistory.length > 10) {
        newLocalHistory.shift();
      }

      this.localHistory = newLocalHistory;

      localStorage.setItem(local_types.SEARCH_HISTORY, JSON.stringify(this.localHistory));
    },
  },
};
</script>

<style lang="scss" scoped>
.search-history {
  height: auto;
  width: 100%;
  border: 1px solid #ced3d9;
  @include border-one-px;
  background-color: white;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 999;

  li {
    height: 36px;
    color: #303233;
    font-size: 16px;
    line-height: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    &:hover {
      background-color: rgba($color: #ff6700, $alpha: 0.12);

      .content {
        color: #ff6700;
      }
    }

    .content {
      flex: auto;
      height: 100%;
      padding: 0 0 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;

        &:not(:first-child) {
          color: #919599;
          font-size: 12px;
        }
      }
    }

    .btn-del {
      height: 100%;
      padding: 0 16px;
      font-size: 12px;
      color: #616366;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }

  .btn-clear {
    height: 28px;
    padding: 8px 16px;
    color: #616366;
    font-size: 12px;
    line-height: 1;
    text-align: right;
    background-color: #f5f6f7;
    box-sizing: border-box;
    // position: absolute;
    // bottom:0;
    cursor: pointer;
    // width:100%;

    &:hover {
      color: #ff6700;
    }
  }
}
</style>
