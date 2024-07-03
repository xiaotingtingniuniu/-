<template>
  <div :class="{ 'is-show': isShow }" class="btn-top" @click="handleClick">
    <div class="icon-top" />
  </div>
</template>

<script>
export default {
  data: () => ({
    isShow: false,
  }),
  methods: {
    handleClick() {
      this.$emit('click');
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-top {
  height: 46px;
  width: 46px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: absolute;
  bottom: 214px;
  right: -46px;
  z-index: 5;
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &.is-show {
    right: 0;
  }

  .icon-top {
    height: 24px;
    width: 24px;
    background-image: url('~@/images/icon_top.png');
    background-size: contain;
  }
}
</style>
