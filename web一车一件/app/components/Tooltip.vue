<template>
  <div class="tooltip" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div ref="content" class="text">{{ content }}</div>
    <div v-if="content" v-show="show" class="tooltip">{{ content }}</div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    show: false,
  }),
  methods: {
    handleMouseEnter() {
      if (this.$refs.content.offsetWidth < this.$refs.content.scrollWidth) {
        this.show = true;
      }
    },
    handleMouseLeave() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;

  &:hover .tooltip {
    opacity: 1;
  }

  .text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 144px;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.2;
    word-wrap: break-word;
    color: #fff;
    background: #303133;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
  }
}
</style>
