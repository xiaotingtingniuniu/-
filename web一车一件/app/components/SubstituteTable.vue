<template>
  <div class="substitute-table">
    <header>
      <div class="cell src-name">名称</div>
      <div class="cell price">4S 店价格</div>
      <div class="cell oe">OE 号</div>
      <div class="cell qty">单车用量</div>
      <div class="cell comment">备注</div>
    </header>
    <main v-loading="searching">
      <template v-if="data.length">
        <div
          v-for="(item, index) in data"
          :key="index"
          :class="[{ 'is-last': index === data.length - 1, 'is-stripe': item.isStripe, 'hide-border': item.hideBorder }]"
          class="item"
        >
          <!-- {{ item }} -->
          <div
            class="row"
            :class="{ 'is-hover': item.isHover, 'is-css-hover': cssHover }"
            @mouseenter="mouseEnter(item)"
            @mouseleave="mouseLeave(item)"
          >
            <div class="cell src-name is-gray">{{ item.srcPartName }}</div>
            <div class="cell price">{{ item.partPrice }}</div>
            <div class="cell oe">
              <template>{{ item.partNumber }}</template>
              <span
                v-if="showCopy(item.partNumber)"
                v-clipboard:copy="item.partNumber"
                v-clipboard:success="onCopy"
                class="btn-copy"
              >
                <template>复制</template>
              </span>
            </div>
            <div class="cell qty">{{ item.qty }}</div>
            <div class="cell comment">
              <tooltip :content="item.comment" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty">
          <span>{{ toastMessage }}</span>
        </div>
      </template>
    </main>
  </div>
</template>

<script>
import Tooltip from '../components/Tooltip.vue';

import TextHelper from '../mixins/text-helper';

export default {
  components: {
    Tooltip,
  },
  mixins: [TextHelper],
  props: {
    data: {
      type: Array,
      required: true,
    },
    toastMessage: {
      type: String,
      required: false,
      default: '',
    },
    searching: Boolean,
    mouseEnter: {
      type: Function,
      required: false,
      default: () => {},
    },
    mouseLeave: {
      type: Function,
      required: false,
      default: () => {},
    },
    cssHover: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.substitute-table {
  border: $--border-main;
  @include border-one-px;
  border-top: none;

  header {
    display: flex;
    align-items: center;
    height: 32px;
    border-top: $--border-main;
    @include border-one-px;
    color: #616366;
    font-size: 12px;
    background-color: $--color-background;
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
  }

  .item {
    border-bottom: $--border-main;
    @include border-one-px;

    &.is-last {
      border-bottom: 0;

      .row {
        border-color: $--color-gray-light;
        border-bottom-width: 0;
      }
    }

    &.is-stripe .row {
      background-color: #fafbfc;
    }

    &.hide-border {
      border-width: 0;
    }
  }

  .row {
    position: sticky;
    top: 66px;
    z-index: 4;
    display: flex;
    align-items: center;
    border-color: $--color-gray-light;
    color: #000;
    font-size: 14px;
    background-color: #fff;
    transition: 0.1s;

    &.is-hover,
    &.is-css-hover:hover {
      background-color: #f0f2f5;
    }

    .cell {
      padding: 18px 0 18px 20px;

      &.price-number {
        padding: 0;
        margin: 10px;
      }
    }

    .is-gray {
      color: #616366;
    }
  }

  .cell {
    padding: 0 0 0 20px;
    box-sizing: border-box;

    &:last-child {
      padding-right: 20px;
    }
  }

  .src-name {
    width: 25%;
  }

  .price {
    width: 15%;
  }

  .oe {
    width: 17%;

    &:hover .btn-copy {
      opacity: 1;
    }
  }

  .qty {
    width: 13%;
  }

  .comment {
    width: 30%;
  }

  .btn-copy {
    color: $--color-main;
    float: right;
    cursor: pointer;
    opacity: 0;
  }
}
</style>
