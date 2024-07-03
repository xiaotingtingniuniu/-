<template>
  <div class="car-brand">
    <div class="img" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <img :src="image" @contextmenu="handleContextMenu">
      <transition :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <ul v-if="show">
          <li v-for="item in subBrandList.slice(0, 3)" :key="item">
            <template>{{ item }}</template>
          </li>
        </ul>
      </transition>
    </div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';

const getDir = e => {
  const element = e.target || e.srcElement,
    rect = element.getBoundingClientRect();

  if (!rect.width) {
    rect.width = rect.right - rect.left;
  }

  if (!rect.height) {
    rect.height = rect.bottom - rect.top;
  }

  const x1 = rect.left,
    y1 = -rect.top;

  const x4 = rect.left + rect.width,
    y4 = -(rect.top + rect.height);

  const x0 = rect.left + rect.width / 2,
    y0 = -(rect.top + rect.height / 2);

  if (Math.abs(x1 - x4) < 0.0001) {
    return 4;
  }

  const k = (y1 - y4) / (x1 - x4);

  const range = [k, -k],
    x = e.clientX,
    y = -e.clientY;

  const kk = (y - y0) / (x - x0);

  if (isFinite(kk) && range[0] < kk && kk < range[1]) {
    return { dir: 'right', size: x > x0 ? -1 : 1 };
  } else {
    return { dir: 'top', size: y > y0 ? -1 : 1 };
  }
};

export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subBrandList: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    show: false,
    enterDir: '',
    leaveDir: '',
  }),
  methods: {
    mouseenter(e) {
      this.show = true;
      this.enterDir = getDir(e);
    },
    mouseleave(e) {
      this.show = false;
      this.leaveDir = getDir(e);
    },
    beforeEnter(el) {
      el.style[this.enterDir.dir] = 100 * this.enterDir.size + 'px';
    },
    enter(el, done) {
      Velocity(el, { [this.enterDir.dir]: 0 }, { duration: 240, complete: done });
    },
    leave(el, done) {
      Velocity(el, { [this.leaveDir.dir]: 100 * this.leaveDir.size + 'px' }, { duration: 240, complete: done });
    },
    handleContextMenu(e) {
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.car-brand {
  text-align: center;
  contain: content;

  .img {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    width: 100px;
    height: 100px;
    border: 1px solid #dadfe6;
    @include border-one-px;
    border-radius: 4px;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      user-select: none;
    }

    ul {
      position: absolute;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: 100%;
      color: #fff;
      font-size: 14px;
      background: rgba($color: #be4107, $alpha: 0.8);
    }
  }

  .name {
    margin: 10px 0 30px 0;
    color: #616366;
    font-size: 12px;
    line-height: 1;
  }
}
</style>
