<template>
  <section class="search-panel">
    <div class="search-panel__card" :class="{ 'is-disabled': loading }">
      <div class="search__tabs">
        <header>
          <div class="tab-vin" :class="{ 'is-active': currentTab === 'vin' }" @click="handleChangeTabs('vin')">
            <template>VIN</template>
          </div>
          <div class="tab-oe" :class="{ 'is-active': currentTab === 'oe' }" @click="handleChangeTabs('oe')">
            <template>OE号</template>
          </div>
        </header>
        <main>
          <div v-show="currentTab === 'vin'" class="search__tabs__vin">
            <el-input
              ref="inputVIN"
              v-model.trim="vin"
              :disabled="loading"
              :class="{ 'is-bold': !!vin }"
              placeholder="请输入17位VIN"
              maxlength="17"
              class="search__input input-vin"
              @keydown.native.enter="search(null)"
              @focus="handleVINFocus"
              @blur="handleVINBlur"
            >
              <i v-if="vin && !loading" slot="suffix" class="el-input__icon icon-clear" @click="handleClear" />
              <loading v-if="loading" slot="suffix" />
              <div v-if="vin" slot="suffix" class="input__count">
                <span>{{ inputLength }}</span>
              </div>
            </el-input>
            <search-history ref="vinHistory" example-type="vin" name="home-vin" class="history-vin" @item-select="search" />
          </div>
          <div v-show="currentTab === 'oe'" class="search__tabs__oe">
            <el-input
              ref="inputOE"
              v-model.trim="oe"
              :disabled="loading"
              :class="{ 'is-bold': !!oe }"
              maxlength="20"
              placeholder="请输入5位以上OE号"
              class="search__input input-oe"
              @keydown.native.enter="search(null)"
              @focus="handleOEFocus"
              @blur="handleOEBlur"
            >
              <i v-if="oe && !loading" slot="suffix" class="el-input__icon icon-clear" @click="handleClear" />
              <loading v-if="loading" slot="suffix" />
            </el-input>
            <search-history ref="oeHistory" example-type="oe" name="home-oe" class="history-oe" @item-select="search" />
          </div>
        </main>
      </div>
      <button :disabled="loading" class="btn-search" @click="search(null)">查询</button>
      <transition name="fade">
        <div v-if="!!errorMessage" class="search__msg">
          <i class="el-icon-warning" />
          <span>{{ errorMessage }}</span>
        </div>
      </transition>
      <div class="btn-vehicle-select" @click="onVehicleSelectShow('')">按品牌选择</div>
    </div>
    <el-dialog :modal-append-to-body="false" :visible.sync="showDialog" title="请选择车辆" width="850" class="dialog-select-vehicle">
      <el-table :data="vehicles" style="width: 100%;" height="400" @row-click="handleSelect">
        <el-table-column prop="maker" label="车牌信息" />
        <el-table-column prop="serial" />
        <el-table-column prop="year" label="车款" />
        <el-table-column prop="motor" label="排量" />
        <el-table-column prop="transmission" label="变速箱" />
        <el-table-column prop="optionInfo" label="配置" />
      </el-table>
    </el-dialog>
    <dialog-vehicle-select ref="dialogVehicleSelect" :show.sync="showDialogVehicleSelect" @complete="onVehicleSelectComplete" />
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import DialogVehicleSelect from './DialogVehicleSelect.vue';
import Loading from './Loading.vue';
import SearchHistory from './SearchHistory.vue';

import { router_names } from '../config/constant';

const TAB_VIN = 'vin';
const TAB_OE = 'oe';

export default {
  components: {
    DialogVehicleSelect,
    Loading,
    SearchHistory,
  },
  data: () => ({
    currentTab: 'vin',
    showDialogVehicleSelect: false,
  }),
  computed: {
    vin: {
      set(value) {
        this.setVIN(value);
      },
      get() {
        return this.$store.state.vin;
      },
    },
    oe: {
      set(value) {
        this.setOE(value);
      },
      get() {
        return this.$store.state.oe;
      },
    },
    errorMessage: {
      set(value) {
        this.setErrorMessage(value);
      },
      get() {
        return this.$store.state.errorMessage;
      },
    },
    showDialog: {
      set(value) {
        this.setShowDialog(value);
      },
      get() {
        return this.$store.state.showDialog;
      },
    },
    inputLength() {
      return this.vin.replace(/\s*/g, '').length;
    },
    ...mapState(['vehicles', 'loading']),
  },
  watch: {
    currentTab() {
      this.errorMessage = '';
      this.autoFocus();
    },
  },
  mounted() {
    this.autoFocus();
  },
  beforeDestroy() {
    this.cancelRequest();
  },
  methods: {
    ...mapMutations(['setVIN', 'setOE', 'setErrorMessage', 'setShowDialog']),
    ...mapMutations('vinQuery', ['setCurrentVehicle']),
    ...mapActions(['cancelRequest', 'parseVIN', 'parseOE']),
    handleChangeTabs(label) {
      if (!this.loading) {
        this.currentTab = label;
      }
    },
    handleClear() {
      this[this.currentTab] = '';
      this.autoFocus();
      this.errorMessage = '';
    },
    handleSelect(vehicle) {
      this.setCurrentVehicle(vehicle);
      this.$refs.vinHistory.add([vehicle.vinCode, vehicle.maker]);
      this.toVIN();
      this.setShowDialog(false);
    },
    autoFocus() {
      switch (this.currentTab) {
        case TAB_VIN:
          if (this.$refs.inputVIN) {
            this.vin = '';
            this.$nextTick(() => {
              this.$refs.inputVIN.focus();
            });
          }
          break;
        case TAB_OE:
          if (this.$refs.inputOE) {
            this.oe = '';
            this.$nextTick(() => {
              this.$refs.inputOE.focus();
            });
          }
          break;
        default:
          break;
      }
    },
    handleVINFocus() {
      this.$refs.vinHistory.show();
    },
    handleVINBlur() {
      this.$refs.vinHistory.hide();
    },
    handleOEFocus() {
      this.$refs.oeHistory.show();
    },
    handleOEBlur() {
      this.$refs.oeHistory.hide();
    },
    toVIN() {
      this.$router.push({ name: router_names.VIN });
    },
    toOE() {
      this.$router.push({ name: router_names.OE });
    },
    search(item) {
      console.log('item', item);
      switch (this.currentTab) {
        case TAB_VIN:
          if (item) {
            this.vin = item;
          }
          this.$refs.inputVIN.blur();
          this.parseVIN({
            onSuccess: i => {
              this.$refs.vinHistory.add(i);
              this.toVIN();
            },
            onVinQueryFailed: () => {
              this.onVehicleSelectShow(this.vin);
            },
          });
          break;
        case TAB_OE:
          if (item) {
            this.oe = item;
          }
          this.$refs.inputOE.blur();
          this.parseOE({
            partNumber: this.oe,
            onSuccess: i => {
              this.$refs.oeHistory.add(i);
              this.toOE();
            },
          });
          break;
        default:
          break;
      }
    },
    onVehicleSelectShow(vinCode) {
      this.$refs.dialogVehicleSelect.setVinCode(vinCode);
      this.showDialogVehicleSelect = true;
    },
    onVehicleSelectComplete(data) {
      if (data[0]) {
        this.$refs.vinHistory.add(data);
      }

      this.$router.push({ name: router_names.VIN });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background-image: url('~@/images/backround@1x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .search-panel__card {
    position: relative;
    z-index: 1;
    display: flex;
    box-sizing: border-box;
    height: 184px;
    width: 960px;
    padding: 30px 30px 40px 30px;
    border: none;
    border-radius: 2px;
    box-shadow: rgba($color: #000, $alpha: 0.1) 0 4px 8px;
    background-color: #fff;
    overflow: visible;

    &.is-disabled {
      cursor: not-allowed;
    }
  }

  .search__tabs {
    width: calc(100% - 120px);

    header {
      display: flex;

      div {
        height: 34px;
        width: 80px;
        color: #616366;
        text-align: center;
        font-size: 16px;
        line-height: 34px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;

        &.is-active {
          color: #fff;
          background: #ff6700;
        }

        &.tab-oe {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            right: -4px;
            bottom: 24px;
            width: 32px;
            height: 20px;
            background-image: url('~@/images/new.png');
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
      }
    }

    main {
      position: relative;

      > div {
        position: relative;
      }
    }
  }

  .btn-search {
    height: 80px;
    width: 120px;
    margin-top: 34px;
    font-size: 20px;
    border-radius: 0;
    box-shadow: 0 3px 6px rgba(255, 72, 0, 0.5);
    color: #fff;
    font-size: 20px;
    background-color: #ff6700;

    &:not([disabled]):hover {
      background-color: #f25d00;
    }
  }

  .search__msg {
    position: absolute;
    bottom: 15px;
    left: 30px;
    height: 16px;
    color: $--color-error;
    line-height: 16px;

    i {
      font-size: 16px;
    }

    span {
      position: relative;
      bottom: 1px;
      left: 4px;
      display: inline-block;
      color: $--color-error;
      font-size: 14px;
      line-height: 1;
    }
  }

  .search__input {
    /deep/.el-input__inner {
      height: 80px;
      padding: 0 20px;
      border: 2px solid $--color-main;
      border-radius: 0;
      font-size: 20px;
      caret-color: #000;
      text-transform: uppercase;
    }

    &.is-bold /deep/.el-input__inner {
      color: #000;
      font-weight: bold;
      letter-spacing: 4px;
    }

    &.is-disabled /deep/.el-input__inner {
      background-color: transparent;
    }

    /deep/.el-input__icon {
      display: block;
      position: absolute;
      top: 50%;
      right: 30px;
      width: 24px;
      height: 24px;
      transform: translateY(-50%);
      transition: none;
      background-image: url('~@/images/icon_clear.png');
      background-size: contain;
    }

    &.input-vin {
      /deep/.el-input__icon {
        right: 50px;
      }

      .loading {
        right: 41px;
      }
    }

    .input__count {
      position: absolute;
      top: 50%;
      right: 5px;
      width: 40px;
      font-size: 20px;
      transform: translateY(-50%);
      user-select: none;
    }
  }

  .history-vin,
  .history-oe {
    top: 84px;
    width: calc(100% - 2px);
    // overflow-y: scroll;
    // height:136px;
  }

  .dialog-select-vehicle {
    /deep/.el-dialog {
      margin: 0 !important;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /deep/.el-dialog__header {
      padding-bottom: 20px;

      .el-dialog__title {
        color: #000;
      }
    }

    /deep/.el-dialog__body {
      padding-top: 0;
      padding-left: 0;
      padding-right: 0;

      th {
        padding: 8px 0 8px 0;
        color: #616366;
        font-size: 12px;
        line-height: 23px;
        background-color: $--color-background;
      }

      tr {
        .cell:first-child {
          padding-left: 20px;
        }

        .cell:last-child {
          padding-right: 20px;
        }
      }

      .el-table::before {
        display: none;
      }

      .el-table__body {
        color: #000;
        font-size: 14px;

        tr:hover > td {
          background-color: #f0f2f5;
        }
      }
    }
  }

  .btn-vehicle-select {
    position: absolute;
    right: 30px;
    width:100px;
    height:32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #FF6700;
    border-radius: 4px;
    border-radius: 4px;
    top:22px;
    font-size: 14px;
    color: #FF6700;
    cursor: pointer;
    &:hover {
      background: #FF6700;
      color: #FFFFFF;
    }
  }
}
</style>
