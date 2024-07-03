<template>
  <section class="page-part-tree">
    <header class="part-tree__header">
      <navigation-part-tree />
    </header>
    <section class="part-tree__main">
      <aside>
        <skeleton v-if="!partList.length && searching" type="text" class="skeleton-title" />
        <p v-else-if="partList.length">主组</p>
        <div v-if="!partList.length && searching">
          <div v-for="n in 7" :key="n">
            <skeleton type="text" />
          </div>
        </div>
        <el-menu
          v-else
          :default-active="activeMenu"
          class="part-tree__menu"
          @select="handleSelectPart"
        >
          <el-menu-item
            v-for="item in partList"
            :key="item.id"
            :index="item.id"
            :disabled="searching"
          >
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <main>
        <div v-if="showSkeletonTabs">
          <skeleton />
        </div>
        <el-tabs
          v-else-if="showTabs"
          v-model="selectedSubPart"
          type="card"
          class="part-tree__tabs"
          @tab-click="handleSelectSubPart"
        >
          <el-tab-pane
            v-for="item in subPartList"
            :key="item.id"
            :label="item.name"
            :name="item.id"
            :disabled="searching"
          >
            <div :ref="'wrapper-' + item.id" class="wrapper" @scroll="handleScroll">
              <div v-if="selectedSubPart && selectedSubPart.length" class="part-tree__img__wrap">
                <skeleton v-if="showSkeletonImage" class="skeleton-count" />
                <div v-else-if="showImageList" class="count">共 {{ imageList.length }} 张</div>
                <skeleton v-if="showSkeletonImage" class="skeleton-img" />
                <div v-else-if="showImageList" class="img-list">
                  <lazy-image
                    v-for="(image, index) in imageList"
                    :key="index"
                    :src="image.src"
                    :name="image.name"
                    @click="toPartDetails(image)"
                  />
                </div>
                <div v-if="showTabToastMessage" class="part-tree__msg">
                  <span>{{ toastMessage }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <dev-background v-else-if="showDev" />
        <div v-else-if="showToastMessage" class="part-tree__msg">
          <span>{{ toastMessage }}</span>
        </div>
        <top ref="top" @click="scrollToTop" />
      </main>
    </section>
  </section>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import DevBackground from '../components/DevBackground.vue';
import LazyImage from '../components/LazyImage.vue';
import NavigationPartTree from '../components/NavigationPartTree.vue';
import Skeleton from '../components/Skeleton.vue';
import Top from '../components/Top.vue';

import growingIO from '../thirdparty/gio';
import { router_names } from '../config/constant';

export default {
  components: {
    DevBackground,
    LazyImage,
    NavigationPartTree,
    Skeleton,
    Top,
  },
  computed: {
    ...mapState('partTree', ['selectedPart', 'toastMessage']),
    ...mapGetters('partTree', ['currentVehicle', 'partList', 'subPartList', 'searching', 'imageList']),
    activeMenu() {
      if (this.selectedPart) {
        return this.selectedPart.id;
      }
      return '';
    },
    selectedSubPart: {
      set(index) {
        this.updateSelectedSubPart(index);
      },
      get() {
        const selectedSubPart = this.$store.state.partTree.selectedSubPart;
        if (selectedSubPart) {
          return selectedSubPart.id || '';
        }
        return '';
      },
    },
    showSkeletonTabs() {
      return this.selectedPart && !this.selectedPart.subParts.size && this.searching;
    },
    showTabs() {
      return this.selectedPart && this.subPartList.length;
    },
    showDev() {
      return !this.partList.length && !this.searching && !this.toastMessage;
    },
    showToastMessage() {
      return !this.selectedSubPart && this.toastMessage;
    },
    showSkeletonImage() {
      return !this.imageList.length && this.searching;
    },
    showImageList() {
      return this.imageList.length;
    },
    showTabToastMessage() {
      return this.toastMessage;
    },
  },
  created() {
    this.getParts();
  },
  mounted() {
    growingIO.partTreePage();
  },
  beforeDestroy() {
    this.cancelRequest();
  },
  methods: {
    ...mapActions('partTree', ['getParts', 'cancelRequest', 'updatePartDetails']),
    ...mapMutations('partTree', ['updateSelectedPart', 'updateSelectedSubPart']),
    handleSelectPart(index) {
      if (this.searching) {
        return;
      }

      this.updateSelectedPart(index);
      this.getParts({ index });
    },
    handleSelectSubPart({ name }) {
      if (this.searching) {
        return;
      }

      this.getParts({ index: this.selectedPart.id, subIndex: name });
    },
    toPartDetails(item) {
      this.updatePartDetails(item);
      this.$router.push({ name: router_names.PART_DETAILS });
    },
    handleScroll: _.debounce(function (ev) {
      const { scrollTop } = ev.target;

      if (scrollTop > 150) {
        this.$refs.top.show();
      } else {
        this.$refs.top.hide();
      }
    }, 150),
    scrollToTop() {
      const vs = 'wrapper-' + this.selectedSubPart;
      if (this.$refs[vs].length && this.$refs[vs][0]) {
        this.$refs[vs][0].scrollTop = 0;
        this.$refs[vs][0].scrollLeft = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-part-tree {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .part-tree__main {
    display: flex;
    overflow: hidden;
    height: calc(100vh - 60px);

    aside {
      flex-shrink: 0;
      box-sizing: border-box;
      width: 160px;
      border-right: 1px solid #dadfe6;
      @include border-one-px;
      background: #f5f6f7;
      overflow: visible;

      .skeleton-title {
        padding: 0 28px 0 16px;
      }

      p {
        height: 40px;
        padding-left: 16px;
        color: #aaaeb3;
        font-size: 14px;
        line-height: 40px;
      }
    }

    main {
      flex: 1;
      flex-basis: auto;
      overflow: auto;

      .skeleton-text_inner,
      .skeleton-block {
        background-color: $--color-skeleton;
      }
    }
  }
}

.part-tree__menu {
  border: 0;
  background: transparent;

  /deep/.el-menu-item {
    height: 40px;
    padding-left: 24px !important;
    border-left-color: $--color-main;
    border-right-color: white;
    color: #616366;
    font-size: 14px;
    line-height: 40px;

    &.is-active {
      padding-left: 20px !important;
      margin-right: -1px;
      @include margin-right-one-px(-1px);
      border-right: 1px solid white;
      border-left: 4px solid $--color-main;
      @include border-one-px(4px);
      color: $--color-main;
      background-color: white !important;

      &:hover {
        background-color: white;
      }
    }

    &.is-disabled {
      border-right-color: transparent !important;
      opacity: 1;
    }

    &:hover {
      margin-right: -1px;
      @include margin-right-one-px(-1px);
      border-right: 1px solid white;
      background-color: white;
    }

    span {
      vertical-align: initial;
    }
  }
}

.part-tree__tabs {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  /deep/.el-tabs__header {
    height: 39px;
    margin: 0;
    background-color: #fafbfc;
  }

  /deep/.el-tabs__content {
    background: white;
    flex: 1;
  }

  /deep/.el-tabs__nav {
    border-left: none !important;
    border-top: none !important;
    border-radius: none !important;

    .el-tabs__item {
      color: #303233;
      font-size: 12px;

      &.is-disabled {
        background: transparent;
        cursor: not-allowed;

        &:hover {
          color: #303233;
        }
      }

      &.is-active {
        color: $--color-main;
        background: white !important;
      }

      &:hover {
        color: $--color-main;
      }
    }
  }
}

.wrapper {
  height: 100%;
  overflow-y: auto;
}

.part-tree__img__wrap {
  height: calc(100vh - 100px);
  padding: 15px 10px;
  box-sizing: border-box;

  .skeleton-count {
    height: 12px;
    width: 100px;
    margin: 0 0 10px 10px;
  }

  .count {
    margin: 0 0 10px 10px;
    color: #616366;
    font-size: 12px;
    line-height: 12px;
  }

  .skeleton-img {
    height: 175px;
    width: calc((100% - 132px) / 6);
    margin: 0 10px 20px 10px;
  }

  .img-list {
    display: flex;
    flex-wrap: wrap;

    .lazyload-image {
      width: calc((100% - 132px) / 6);
      margin: 0 10px 20px 10px;
      cursor: pointer;
    }
  }
}

.part-tree__msg {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: #616366;
    font-size: 14px;
  }
}
</style>
