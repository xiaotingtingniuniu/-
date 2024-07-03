<template>
  <section class="common-parts">
    <header>
      <span>常用配件查询</span>
      <div class="btn-part-tree" @click="handleGoToPartTree">
        <span>结构树查询</span>
      </div>
    </header>
    <transition-group
      name="collapse"
      tag="main"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-for="(p, index) in visiblePartsShortcuts"
        :key="p.position"
        :data-index="index"
        class="row"
      >
        <span class="category">{{ p.position }}</span>
        <span
          v-for="part in p.parts"
          :key="part"
          :class="{'is-selected': selectKeyword === part}"
          class="item"
          @click="handleClick"
        >
          <template>{{ part }}</template>
        </span>
        <transition name="fade" mode="out-in">
          <div
            v-if="index === 0"
            :key="commonPartsState"
            class="btn-expand"
            @click="handleCollapse"
          >
            <span>{{ buttonMessage }}</span>
            <i :class="buttonIcon" />
          </div>
        </transition>
      </div>
    </transition-group>
  </section>
</template>

<script>
import Velocity from 'velocity-animate';
import { mapState, mapActions } from 'vuex';

import { local_types, router_names } from '../config/constant';
import * as LocalStorage from '../utils/local-storage';

const COMMON_PARTS_EXPANDED = 'expanded';
const COMMON_PARTS_COLLAPSED = 'collapsed';

const partsShortcuts = [
  {
    position: '前外',
    parts: ['中网', '前保险杠', '前杠骨架', '发动机盖', '前风挡玻璃', '前风挡雨刮臂', '前大灯', '前翼子板', '前钢圈'],
  },
  {
    position: '前内',
    parts: ['喇叭', '散热器', '冷凝器', '空气滤清器', '机油滤清器', '蓄电池', '发电机', '起动机', '前桥', '转向机', '前平衡杆', '前转向节', '前上摆臂', '前下摆臂', '前减震器'],
  },
  {
    position: '中外',
    parts: ['倒车镜', '前车门', '后车门', '侧围'],
  },
  {
    position: '中内',
    parts: ['仪表台', '气囊电脑', '气囊卷簧', '组合开关', '驾驶员安全气囊', '副驾驶安全气囊', '驾驶员安全带', '副驾驶安全带'],
  },
  {
    position: '后外',
    parts: ['后杠', '行李箱盖', '后徽标', '后挡风玻璃', '后翼子板', '后尾灯', '后钢圈'],
  },
  {
    position: '后内',
    parts: ['排气管后段', '后转向节', '后减震器', '后下摆臂'],
  },
];

export default {
  data: () => ({
    partsShortcuts,
    commonPartsState: COMMON_PARTS_COLLAPSED,
    isCD: false,
  }),
  computed: {
    ...mapState('user', ['account']),
    ...mapState('vinQuery', ['selectKeyword']),
    buttonMessage() {
      switch (this.commonPartsState) {
        case 'expanded':
          return '收起';
        case 'collapsed':
        default:
          return '展开';
      }
    },
    buttonIcon() {
      switch (this.commonPartsState) {
        case 'expanded':
          return 'el-icon-arrow-up';
        case 'collapsed':
        default:
          return 'el-icon-arrow-down';
      }
    },
    visiblePartsShortcuts() {
      switch (this.commonPartsState) {
        case 'expanded':
          return this.partsShortcuts;
        case 'collapsed':
        default:
          return this.partsShortcuts.slice(0, 2);
      }
    },
  },
  created() {
    const expanded = LocalStorage.get(local_types.EXPAND_COMMON_PARTS, 'account', this.account, 'expanded');
    this.commonPartsState = expanded ? COMMON_PARTS_EXPANDED : COMMON_PARTS_COLLAPSED;
  },
  methods: {
    ...mapActions('vinQuery', ['queryPartsBySelect']),
    handleGoToPartTree() {
      this.$router.push({ name: router_names.PART_TREE });
    },
    handleClick(e) {
      const target = e.target || e.srcElement;
      this.queryPartsBySelect(target.innerText);
    },
    handleCollapse() {
      if (this.isCD) {
        return;
      }

      this.isCD = true;

      switch (this.commonPartsState) {
        case 'collapsed':
          this.commonPartsState = 'expanded';
          LocalStorage.add(local_types.EXPAND_COMMON_PARTS, 'account', {
            account: this.account,
            expanded: true,
          });
          break;
        case 'expanded':
          this.commonPartsState = 'collapsed';
          LocalStorage.add(local_types.EXPAND_COMMON_PARTS, 'account', {
            account: this.account,
            expanded: false,
          });
          break;
      }

      setTimeout(() => {
        this.isCD = false;
      }, 200);
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },
    enter(el, done) {
      const delay = (el.dataset.index - 2) * 25;
      setTimeout(() => {
        Velocity(
          el,
          { opacity: 1, height: '17px', paddingTop: '8px', paddingBottom: '8px' },
          {
            complete: done,
          },
        );
      }, delay);
    },
    leave(el, done) {
      const delay = el.dataset.index * 25;
      setTimeout(() => {
        Velocity(
          el,
          { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 },
          {
            complete: done,
          },
        );
      }, delay);
    },
  },
};
</script>

<style lang="scss" scoped>
.common-parts {
  margin-bottom: 10px;

  header {
    display: flex;
    align-items: center;

    > span {
      color: #797c80;
      font-size: 12px;
    }

    .btn-part-tree {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 28px;
      width: 100px;
      margin: 8px 8px 8px 30px;
      border-radius: 4px;
      border: 1px solid #ced3d9;
      @include border-one-px;
      color: #494a4d;
      font-size: 12px;
      background-color: $--color-skeleton;
      cursor: pointer;

      &:hover {
        border-color: $--color-main;
        color: white;
        background-color: $--color-main;
      }
    }
  }

  main {
    display: block;
    padding: 8px 0;
    border: $--border-main;
    @include border-one-px;
  }

  .btn-expand {
    position: absolute;
    top: 8px;
    right: 30px;
    display: flex;
    align-items: center;
    height: 17px;
    color: $--color-title;
    font-size: 12px;
    line-height: 1;
    user-select: none;
    cursor: pointer;

    &:hover {
      color: $--color-main;
    }

    span {
      margin-right: 6px;
    }
  }

  .row {
    height: 17px;
    padding: 8px 12px;
    display: flex;
    position: relative;
    overflow: hidden;

    .category {
      color: #616366;
      font-size: 12px;
    }

    .item {
      margin-left: 24px;
      color: $--color-title;
      font-size: 12px;
      cursor: pointer;

      @media (max-width: 1279px) {
        margin-left: 10px;
      }

      &:hover,
      &.is-selected {
        color: $--color-main;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}
</style>
