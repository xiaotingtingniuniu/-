<template>
  <div :class="['vehicle-select-field', { 'is-expand': isExpand }]">
    <div class="label">{{ label }}</div>
    <div ref="content" class="content">
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="{ 'is-selected': item === selectedItem, 'is-disabled': disabled }"
        @click="onSelect(item)"
      >
        <template>{{ item }}</template>
      </div>
    </div>
    <div v-show="showExpand && data.length > 0" class="btn-expand" @click="onExpand">
      <i class="el-icon-arrow-down" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
    selectedItem: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    disabled: Boolean,
  },
  data: () => ({
    isExpand: false,
    showExpand: true,
  }),
  watch: {
    data() {
      this.$nextTick(() => {
        const content = this.$refs.content;
        this.showExpand = content.scrollHeight > content.clientHeight && !this.disabled;
      });
    },
  },
  mounted() {
    const content = this.$refs.content;
    this.showExpand = content.scrollHeight > content.clientHeight && !this.disabled;
  },
  methods: {
    onSelect(item) {
      if (this.disabled) {
        return;
      }

      this.$emit('select', item);
    },
    onExpand() {
      this.isExpand = !this.isExpand;
    },
  },
};
</script>

<style lang="scss">
.vehicle-select-field {
  height: 24px;
  margin-bottom: 10px;
  overflow: hidden;
  display: flex;
  position: relative;

  &.is-expand {
    height: auto;

    .btn-expand i {
      transform: rotate(180deg);
    }
  }

  .label {
    box-sizing: border-box;
    width: 90px;
    padding: 5px 7px;
    color: #616366;
    line-height: 1;
  }

  .btn-expand {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;

    i {
      transition: transform 0.2s ease;
    }
  }

  .content {
    width: calc(100% - 100px);
    display: flex;
    flex-wrap: wrap;

    div {
      padding: 5px 20px 5px 7px;
      color: #303233;
      line-height: 1;
      transition: color 0.2s ease;
      cursor: pointer;

      &:not(.is-disabled):hover {
        color: #ff6700;
      }

      &.is-selected {
        color: #ff6700;
        font-weight: 700;
      }

      &.is-disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
