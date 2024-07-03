<template>
  <div v-if="isText" class="skeleton--text">
    <span />
  </div>
  <div v-else-if="isBlock" class="skeleton--block" />
</template>

<script>
const TYPE_TEXT = 'text';
const TYPE_BLOCK = 'block';

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'block',
    },
  },
  computed: {
    isBlock() {
      return this.type === TYPE_BLOCK;
    },
    isText() {
      return this.type === TYPE_TEXT;
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin skeleton {
  background-color: $--color-skeleton-deep;
  animation: skeleton 2s infinite linear;
}

.skeleton--text {
  height: 40px;
  padding: 0 24px;
  display: flex;
  align-items: center;

  span {
    height: 20px;
    width: 100%;
    @include skeleton;
  }
}

.skeleton--block {
  height: 40px;
  @include skeleton;
}

@keyframes skeleton {
  0% {
    opacity: 1;
  }

  10%,
  90% {
    opacity: 0.9;
  }

  20%,
  80% {
    opacity: 0.8;
  }

  30%,
  70% {
    opacity: 0.7;
  }

  40%,
  60% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.5;
  }

  to {
    opacity: 0.95;
  }
}
</style>
