<template>
  <section :class="classes">
    <header>
      <span>查询结果</span>
      <span v-if="parts.length || toastMessage" class="result-count">共 {{ parts.length }} 个结果</span>
    </header>
    <main>
      <header>
        <div class="cell ref-no">图中编号</div>
        <div class="cell standard-name">标准名</div>
        <div class="cell src-name">名称</div>
        <div class="cell price-oe">
          <div class="price-oe__wrap">
            <div class="price-oe__bg">
              <div class="price">4S店价格</div>
              <div class="oe">现用 OE 号</div>
            </div>
            <div class="price-oe_pad" />
          </div>
        </div>
        <div class="cell substitute">曾用 OE 号</div>
        <div class="cell assembly">总成局部</div>
        <div class="cell comment">备注</div>
        <div class="cell expand" />
      </header>
      <main v-loading="searching">
        <ul v-if="parts.length">
          <li v-for="(item, index) in parts" :key="index" :class="{ 'is-expanded': item.expand }">
            <div class="content">
              <div class="cell ref-no">{{ item.partRefOnImage }}</div>
              <div class="cell standard-name">{{ item.stdPartName }}</div>
              <div class="cell src-name is-gray">
                <el-tooltip
                  :content="item.srcPartName"
                  effect="dark"
                  placement="top"
                  transition="tooltip-fade-in-linear"
                >
                  <div class="is-ellipsis">
                    <span>{{ item.srcPartName }}</span>
                  </div>
                </el-tooltip>
              </div>
              <div
                :class="{ 'hide-request': !item.isRectifyDeviations, 'is-substitute': item.isSubstitute }"
                class="cell price-oe"
              >
                <div class="price-oe__wrap">
                  <div :class="{'hide-derogation': !item.derogation}" class="price-oe__bg">
                    <div class="price-oe__inner is-requested">
                      <div class="price">{{ item.reqPartPrice || '' }}</div>
                      <div class="oe">
                        <p>{{ item.reqPartNumber }}</p>
                        <p class="oe_text">您查询的OE号不属于本车</p>
                      </div>
                    </div>
                    <div class="price-oe__inner is-right">
                      <div class="price">{{ item.partPrice || '' }}</div>
                      <div class="oe">
                        <p v-if="item.isSubstitute" class="oe_text">本车现用的 OE 号</p>
                        <p v-if="item.isRectifyDeviations" class="oe_text">属于本车的OE号</p>
                        <span
                          v-if="showCopy(item.partNumber)"
                          v-clipboard:copy="item.partNumber"
                          v-clipboard:success="onCopy"
                          class="btn-copy"
                        >
                          <template>复制</template>
                        </span>
                        <p v-if="!item.isSubstitute && !item.isRectifyDeviations && item.partNumber !== item.reqPartNumber">
                          <span
                            v-for="(c, subIndex) in item.partNumberChars"
                            :key="subIndex"
                            :class="{ 'is-highlight': c.isHighlight }"
                          >
                            <template>{{ c.char }}</template>
                          </span>
                        </p>
                        <p v-else>{{ item.partNumber }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="price-oe_pad" />
                </div>
                <div v-if="item.derogation" class="price-oe__wrap">
                  <div class="arrow-bottom arrow-box">
                    <b class="arrow-box-wrap">
                      <i class="arrow-inner-1" />
                      <i class="arrow-inner-2" />
                    </b>
                    <p class="price-oe_derogation">
                      <template>减损金额：{{ (item.reqPartPrice - item.partPrice).toFixed(2) }}</template>
                    </p>
                  </div>
                  <div class="price-oe_pad" />
                </div>
              </div>
              <div class="cell substitute is-gray">
                <template v-if="item.isSubstitute">
                  <p class="substitute_text">{{ item.reqPartNumber }}</p>
                  <p class="substitute_text">您查询的 OE 号为替换件</p>
                </template>
                <p>{{ item.substitute }}</p>
                <p
                  v-if="item.subChainFlag==='1'"
                  class="btn-substitute-detail"
                  @click="handleClickSubstitute(item)"
                >
                  <template>点击查看替换链详情</template>
                </p>
              </div>
              <div class="cell assembly">
                <div v-if="item.child && item.child.length">总成配件</div>
                <div v-if="item.parent && item.parent.length">局部配件</div>
              </div>
              <div class="cell comment">
                <template v-if="item.comment">
                  <el-tooltip
                    :content="item.comment"
                    effect="dark"
                    placement="top"
                    transition="tooltip-fade-in-linear"
                  >
                    <div>{{ item.comment }}</div>
                  </el-tooltip>
                </template>
              </div>
              <div class="cell expand">
                <button class="btn-expand" @click="handleClick(item)">
                  <template v-if="item.expand">收起</template>
                  <template v-else>展开查看</template>
                </button>
              </div>
            </div>
            <part-details
              v-if="item.expand"
              :sequence-number="index"
              :part="item"
              :is-rectify-deviations="item.isRectifyDeviations"
              @load="handlePartDetailsLoad"
            />
          </li>
        </ul>
        <div v-else class="empty">
          <span>{{ toastMessage }}</span>
        </div>
      </main>
    </main>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PartDetails from './PartDetails.vue';
import TextHelper from '../mixins/text-helper';
import { getChromeVersion } from '../utils/browser';

export default {
  components: {
    PartDetails,
  },
  mixins: [TextHelper],
  computed: {
    ...mapState('vinQuery', ['parts', 'toastMessage']),
    ...mapGetters('vinQuery', ['searching']),
    isOldVersionChrome() {
      return getChromeVersion() !== -1 && getChromeVersion() < 52;
    },
    classes() {
      return ['part-list', { 'is-old-chrome': this.isOldVersionChrome }];
    },
  },
  methods: {
    ...mapActions('vinQuery', ['toSubstituteDetails']),
    handleClick(item) {
      this.$store.commit('vinQuery/expand', item);
    },
    handlePartDetailsLoad(index) {
      if (index) {
        return;
      }
      this.$store.commit('vinQuery/setSearchState', 'complete');
    },
    handleClickSubstitute(item) {
      this.toSubstituteDetails(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.part-list {
  margin-bottom: 30px;

  &.is-old-chrome {
    margin-bottom: 90px;
  }

  > header {
    // position: sticky;
    // top: 0;
    // z-index: 5;
    padding: 10px 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    color: $--color-title;
    background: #fff;

    .result-count {
      margin-left: 10px;
      color: #616366;
      font-size: 12px;
      font-weight: normal;
    }
  }

  > main {
    border: $--border-main;
    @include border-one-px;
    border-top: none;

    header {
      height: 32px;
      border-top: $--border-main;
      @include border-one-px;
      background-color: $--color-background;
      color: #616366;
      font-size: 12px;
      display: flex;
      align-items: center;
      // position: sticky;
      // top: 34px;
      // z-index: 5;

      .price-oe .price-oe__wrap .price-oe__bg {
        display: flex;
        padding: 0 10px;
        background: transparent;
        border: 0;

        @media (max-width: 1279px) {
          padding: 0;
        }
      }
    }

    li {
      border-bottom: $--border-main;
      @include border-one-px;
      font-size: 14px;
      color: #000;
      transition: background-color 0.1s ease;

      &:last-child {
        border-bottom: 0;
      }

      &.is-expanded .content {
        border-bottom: $--border-main;
      }

      .content {
        // position: sticky;
        // top: 66px;
        // z-index: 4;
        display: flex;
        align-items: center;
        background-color: #fff;

        &:hover {
          background-color: #f0f2f5;

          .price-oe__bg {
            border-color: transparent !important;
            background: transparent !important;
          }

          .arrow-box-wrap {
            opacity: 0;
          }
        }

        .cell:not([class*=price-oe]) {
          padding-top: 18px;
          padding-bottom: 18px;

          @media (max-width: 1279px) {
            padding-left: 10px;
          }
        }

        .price-oe {
          margin: 10px;
        }
      }
    }

    .cell {
      padding: 0 0 0 20px;
      box-sizing: border-box;

      &:last-child {
        padding-right: 20px;
      }

      @media (max-width: 1279px) {
        padding: 0 0 0 10px;

        &:last-child {
          padding-right: 10px;
        }
      }
    }

    .is-gray {
      color: #616366;
    }

    .empty {
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        color: #616366;
        font-size: 14px;
      }
    }

    .ref-no {
      width: 9%;
      word-break: break-all;
    }

    .standard-name {
      width: 14%;
    }

    .src-name {
      width: 12%;
    }

    .price-oe {
      width: calc(24% - 20px);
      padding: 0;
      margin: 0 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &.hide-request {
        .is-requested {
          display: none !important;
        }

        .price-oe__bg {
          border: 0 !important;
          background: transparent !important;
        }

        .oe {
          color: #000 !important;
        }
      }

      &.is-substitute {
        .oe {
          color: #00bb27 !important;
        }
      }

      .price-oe__wrap {
        padding: 0 10px;
        display: flex;

        @media (max-width: 1279px) {
          padding: 0;
        }

        .price-oe__bg {
          padding: 10px;
          border-bottom: 1px solid #ffd2d1;
          @include border-one-px;
          background: #fffafa;
          display: block;
          flex: 1;

          &.hide-derogation {
            border-width: 0;
          }
        }

        .price-oe_pad {
          width: 40px;
          padding: 0 5px;
          text-align: center;
          box-sizing: border-box;
        }

        .price-oe__inner {
          line-height: 16px;
          display: flex;

          &.is-requested {
            margin-bottom: 10px;

            .price {
              color: #616366;
            }

            .oe {
              color: #616366;
              position: relative;
            }
          }

          &.is-right {
            .price {
              color: #000;
            }

            .oe {
              color: #008b27;
              position: relative;
            }
          }

          .oe_text {
            margin-top: 1px;
            line-height: 18px;
          }
        }
      }

      .price {
        flex: 4;
        padding: 0;
      }

      .oe {
        flex: 7;
        padding: 0;

        @media (max-width: 1279px) {
          flex: 6;
        }

        span.is-highlight {
          color: #e65c5c;
        }
      }

      .btn-copy {
        position: absolute;
        right: -45px;
        top: 0;

        @media (max-width: 1279px) {
          right: -40px;
        }
      }

      &:hover .btn-copy {
        opacity: 1;
      }
    }

    .substitute {
      width: 15%;

      .btn-substitute-detail {
        cursor: pointer;

        &:hover {
          color: $--color-main;
        }
      }

      .substitute_text {
        color: #ff2020;
      }
    }

    .assembly {
      width: 8%;
    }

    .comment {
      width: 8%;

      div {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .expand {
      width: 10%;
    }

    .btn-copy {
      float: right;
      color: $--color-main;
      opacity: 0;
      cursor: pointer;
    }
  }
}

.btn-expand {
  float: right;
  height: 28px;
  width: 80px;
  padding: 0;
  border: 1px solid #ff6700;
  color: #ff6700;
  background-color: rgba(255, 103, 0, 0.02);

  &:not([disabled]):hover {
    color: #fff;
    background-color: #ff6700;
  }
}

.arrow-box {
  text-align: center;
  position: relative;
  top: -1px;
  flex: 1;

  .arrow-box-wrap {
    width: 8px;
    height: 8px;
    position: relative;
    left: -4px;
  }

  .arrow-inner-2 {
    width: 0;
    height: 0;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    border-top: 4px solid #fffafa;
    border-bottom: 4px dashed transparent;
    border-left: 4px dashed transparent;
    border-right: 4px dashed transparent;
    @include border-one-px(4px);
    overflow: hidden;
  }

  .arrow-inner-1 {
    @extend .arrow-inner-2;
    top: 1px;
    border-top: 4px solid #ffd2d1;
  }

  .price-oe_derogation {
    margin-top: 8px;
    color: #e70400;
    line-height: 16px;
  }
}
</style>
