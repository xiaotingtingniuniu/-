<template>
  <div v-if="skeleton || loading" class="lazyload-image is-skeleton" />
  <div v-else class="lazyload-image" @click="handleClick">
    <div :class="['inner', { 'is-default': !src }]">
      <img v-if="src" :src="src" :alt="name || src" @contextmenu="handleContextMenu">
    </div>
    <div class="label">
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: false,
      default: '',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    skeleton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    img: null,
    loading: true,
  }),
  created() {
    if (this.skeleton) {
      return;
    }
    this.loadImage();
  },
  methods: {
    loadImage() {
      this.img = new Image();
      this.img.src = this.src;
      this.img.onload = () => {
        this.loading = false;
      };
      this.img.onerror = () => {
        this.loading = false;
      };
    },
    handleClick() {
      this.$emit('click');
    },
    handleContextMenu(e) {
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.lazyload-image {
  border: 1px solid #e6ecf2;
  @include border-one-px;
  transition: box-shadow 0.5s;

  &:hover {
    box-shadow: 0 4px 8px rgba($color: #000, $alpha: 0.1);
  }

  &.is-skeleton {
    height: 173px;
    border-color: $--color-skeleton;
    background-color: $--color-skeleton;
    animation: w-opacity 2s infinite linear;

    &:hover {
      box-shadow: none;
    }
  }

  .inner {
    height: 140px;
    border-bottom: 1px solid #e6ecf2;
    @include border-one-px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-default {
      background-image: url('~@/images/no-pictures.png');
      background-size: 40%;
      background-repeat: no-repeat;
      background-position: center;
    }

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .label {
    height: 32px;
    padding: 0 10px;
    background: #fafbfc;
    display: flex;
    align-items: center;
    justify-content: left;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.is-ie .inner img {
  width: 100%;
}
</style>
