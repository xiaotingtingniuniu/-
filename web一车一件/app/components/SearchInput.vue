<template>
  <div class="search-input">
    <div class="inner">
      <div class="input">
        <input
          ref="input"
          v-bind="$attrs"
          class="input__inner"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @compositionstart="handleComposition"
          @compositionend="handleComposition"
          @keydown.enter="handleSearch"
        >
        <i v-if="nativeInputValue" slot="suffix" class="icon-clear" @click="handleClear" />
      </div>
      <search-history
        ref="history"
        :example-type="exampleType"
        :name="historyName"
        @item-select="handleSelect"
      />
    </div>
    <button class="btn-search" @click="handleSearch">查询</button>
  </div>
</template>

<script>
import SearchHistory from '../components/SearchHistory.vue';

export default {
  components: {
    SearchHistory,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    exampleType: {
      type: String,
      required: true,
    },
    historyName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isFocus: false,
    isOnComposition: false,
  }),
  computed: {
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : this.value;
    },
  },
  watch: {
    nativeInputValue() {
      this.setNativeInputValue();
    },
  },
  mounted() {
    this.setNativeInputValue();
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    handleInput(event) {
      if (this.isOnComposition) {
        return;
      }

      if (event.target.value === this.nativeInputValue) {
        return;
      }

      this.$emit('input', event.target.value);
      this.$nextTick(this.setNativeInputValue);
    },
    handleFocus(event) {
      this.isFocus = true;
      this.$refs.history.show();
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.isFocus = false;
      this.$refs.history.hide();
      this.$emit('blur', event);
    },
    handleComposition(event) {
      if (event.type === 'compositionstart') {
        this.isOnComposition = true;
      }
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.handleInput(event);
      }
    },
    handleClear() {
      this.$emit('input', '');
      this.$nextTick(() => {
        this.$refs.input.value = this.value;
      });
      this.focus();
    },
    handleSearch() {
      this.$emit('search', this.value);

      if (this.value) {
        this.$refs.input.blur();
      }
    },
    handleSelect(payload) {
      this.$emit('input', payload);
      this.$nextTick(() => {
        this.$refs.input.value = payload;
      });
      this.$emit('select', payload);
    },
    updateHistory() {
      this.$refs.history.add(this.value);
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) {
        return;
      }
      if (input.value === this.nativeInputValue) {
        return;
      }
      input.value = this.nativeInputValue;
    },
    getInput() {
      return this.$refs.input;
    },
  },
};
</script>

<style lang="scss" scoped>
// 固定输入框所在元素的高度，避免搜索历史出现/消失时带来的抖动
.is-ie .search-input .inner {
  height: 60px;
}

.search-input {
  position: relative;
  display: flex;
  box-sizing: border-box;
  padding: 20px 30px;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

  .inner {
    position: relative;
    width: 100%;
  }

  .input {
    height: 100%;

    input {
      display: inline-block;
      box-sizing: border-box;
      height: 60px;
      width: 100%;
      padding: 0 72px 0 12px;
      border: 2px solid #ced3d9;
      border-right: none;
      font-size: 18px;
      color: #000;
      caret-color: #000;
      text-transform: uppercase;

      &::-webkit-input-placeholder {
        color: #aaaeb3;
      }

      &::-moz-placeholder {
        color: #aaaeb3;
      }

      &:-ms-input-placeholder {
        color: #aaaeb3;
      }
    }

    .icon-clear {
      position: absolute;
      top: 50%;
      right: 30px;
      display: block;
      width: 24px;
      height: 24px;
      transform: translateY(-50%);
      transition: none;
      background-image: url('~@/images/icon_clear.png');
      background-size: contain;
    }
  }

  .btn-search {
    height: 60px;
    width: 160px;
    bottom: 0;
    right: 0;
    border-radius: 0;
    color: #fff;
    font-size: 18px;
    background-color: #ff6700;
    box-shadow: 0 3px 6px rgba(255, 72, 0, 0.5);

    &:not([disabled]):hover {
      background-color: #f25d00;
    }
  }
}
</style>
