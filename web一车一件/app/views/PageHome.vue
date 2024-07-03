<template>
  <section class="page-home">
    <header class="home__header">
      <navigation />
    </header>
    <main class="home__main">
      <div class="banner_activity" @click="goWeixin" />
      <search-panel />
      <section class="support-brands">
        <header>
          <div>支持品牌</div>
        </header>
        <main>
          <el-carousel ref="brandCarousel" :autoplay="false" :indicator-position="pageSize === 1 ? 'none' : ''" arrow="never" trigger="click" height="510px" class="brand-carousel" @change="handleChange">
            <el-carousel-item v-for="(brands, page) in brandCarousel" :key="page">
              <div class="page">
                <template v-for="(item, key) in brands">
                  <car-brand v-if="item !== 'more'" :key="key" :image="item.brandImageUrl" :name="item.brandName" :sub-brand-list="item.subBrandList" class="item" />
                  <div v-else :key="key" class="more">
                    <span>更多品牌</span>
                    <span>敬请期待</span>
                  </div>
                </template>
              </div>
            </el-carousel-item>
          </el-carousel>
          <button v-if="pageSize > 1" :disabled="currentPage === 0" class="btn-pre" @click="handleArrowLeft">
            <i class="icon-arrow el-icon-arrow-left" />
          </button>
          <button v-if="pageSize > 1" :disabled="currentPage === pageSize - 1" class="btn-next" @click="handleArrowRight">
            <i class="icon-arrow el-icon-arrow-right" />
          </button>
        </main>
      </section>
    </main>
  </section>
</template>

<script>
import { mapMutations } from 'vuex';

import CarBrand from '../components/CarBrand.vue';
import Navigation from '../components/Navigation.vue';
import SearchPanel from '../components/SearchPanel.vue';

import { getBrandList } from '../api';
import { response_code } from '../config/constant';
import growingIO from '../thirdparty/gio';
export default {
  components: {
    Navigation,
    SearchPanel,
    CarBrand,
  },
  data: () => ({
    brandCarousel: [],
    currentPage: 0,
    isCD: false,
  }),
  computed: {
    pageSize() {
      return this.brandCarousel.length;
    },
  },
  created() {
    this.clearVinQueryState();
    this.clearPartTreeState();
    this.clearOeState();
    this.clearPartDetailsState();
    this.clearState();
    this.getBrandList();
  },
  methods: {
    ...mapMutations(['clearState']),
    ...mapMutations('vinQuery', {
      clearVinQueryState: 'clearState',
    }),
    ...mapMutations('partTree', {
      clearPartTreeState: 'clearState',
    }),
    ...mapMutations('oeQuery', {
      clearOeState: 'clearState',
    }),
    ...mapMutations('partDetails', {
      clearPartDetailsState: 'clearState',
    }),
    getBrandList() {
      getBrandList()
        .then(response => {
          const { code, brandList } = response.data;

          if (code === response_code.SUCCESS) {
            const brandCarousel = [];
            let page = 0;

            brandList.forEach((item, index) => {
              if (item.brandName === '商用车') {
                return;
              }

              item.brandImageUrl = item.brandImageUrl.replace('http://', 'https://');
              item.subBrandList = item.subBrandList.map(({ brandName }) => brandName);

              page = Math.floor(index / 24);
              if (!brandCarousel[page]) {
                brandCarousel.push([]);
              }

              brandCarousel[page].push(item);
            });

            brandCarousel[page].push('more');
            this.brandCarousel = brandCarousel;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    startCD() {
      this.isCD = true;
      setTimeout(() => {
        this.isCD = false;
      }, 400);
    },
    handleArrowLeft() {
      if (this.isCD) {
        return;
      }

      this.currentPage--;
      this.$refs.brandCarousel.setActiveItem(this.currentPage);
      this.startCD();
    },
    handleArrowRight() {
      if (this.isCD) {
        return;
      }

      this.currentPage++;
      this.$refs.brandCarousel.setActiveItem(this.currentPage);
      this.startCD();
    },
    handleChange(to) {
      this.currentPage = to;
    },
    goWeixin() {
      growingIO.goWeixin();
      open('https://mp.weixin.qq.com/s/n0eHxfXSlcuQJkw9g6_RcA');
    },
  },
};
</script>

<style lang="scss" scoped>
.page-home {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .home__main {
    height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .banner_activity {
    background-color: #690018;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-image: url('~@/images/banner.gif');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}

.support-brands {
  display: flex;
  flex-direction: column;

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 110px;

    div {
      position: relative;
      padding: 0 20px;
      color: $--color-title;
      font-size: 20px;
      line-height: 1;

      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 3;
        height: 100%;
        width: 87px;
        background-image: url('~@/images/title_line.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }

      &::before {
        right: 100%;
      }

      &::after {
        left: 100%;
        transform: scaleX(-1);
      }
    }
  }

  main {
    width: 1240px;
    margin-bottom: 30px;
    position: relative;
    display: flex;
    align-self: center;
    justify-content: center;

    @media (max-width: 1279px) {
      width: 100%;
    }

    .brand-carousel {
      width: 1120px;

      @media (max-width: 1279px) {
        width: 100%;
      }

      /deep/.el-carousel__indicators {
        bottom: 38px;
      }

      /deep/.el-carousel__indicator {
        .el-carousel__button {
          height: 4px;
          width: 40px;
          border-radius: 2px;
          background-color: rgba($color: #ced2d9, $alpha: 0.4);
        }

        &.is-active .el-carousel__button {
          background-color: rgba($color: #ced2d9, $alpha: 1);
        }
      }

      .page {
        display: flex;
        flex-wrap: wrap;

        .item {
          margin: 0 calc((100% / 8 - 100px) / 2);
        }
      }
    }

    button {
      position: absolute;
      top: 228px;
      height: 50px;
      width: 50px;
      padding: 0;
      border: none;
      border-radius: 25px;
      background-color: #d5dae0;
      transform: translateY(-50%);
      transition: 0.2s;
      cursor: pointer;

      @media (max-width: 1279px) {
        display: none;
      }

      &:disabled {
        background-color: #f0f2f5;
        cursor: default;
      }

      &:hover:not(:disabled) {
        background-color: $--color-main;
      }

      &.btn-pre {
        left: 0;
      }

      &.btn-next {
        right: 0;
      }

      .icon-arrow {
        color: #fff;
        font-size: 30px;
      }
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      z-index: 3;
      height: 100%;
      width: 20px;

      @media (max-width: 1279px) {
        display: none;
      }
    }

    &::before {
      left: 60px;
      background: linear-gradient(to right, #fff, rgba($color: #fff, $alpha: 0));
    }

    &::after {
      right: 60px;
      background: linear-gradient(to left, #fff, rgba($color: #fff, $alpha: 0));
    }

    .more {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 100px;
      height: 100px;
      border: 1px solid #dadfe6;
      @include border-one-px;
      border-radius: 4px;
      margin: 0 26px;
      color: #616366;
      font-size: 12px;
    }
  }
}
</style>
