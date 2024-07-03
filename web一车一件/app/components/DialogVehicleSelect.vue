<template>
  <el-dialog :modal-append-to-body="false" :append-to-body="false" :visible.sync="show" :before-close="onClose" width="900px" class="dialog-vehicle-select">
    <div slot="title" class="dialog-header">
      <span class="dialog_title">{{ showHeterogeneity ? '配置差异项' : '车辆信息' }}</span>
    </div>

    <div v-loading="loading" class="container">
      <main>
        <div :class="['wrapper', { 'show-heterogeneity': showHeterogeneity }]">
          <section class="section-main">
            <header v-if="!vinCode">
              <div :class="['alphabet__all', { 'is-selected': isAllSelected }]" @click="onClickAlphabet('')">
                <template>全部</template>
              </div>
              <template v-if="vehicleOptions.brand">
                <div v-for="item in alphabetList" :key="item" :class="['alphabet__item', { 'is-selected': alphabet === item }]" @click="onClickAlphabet(item)">
                  <template>{{ item }}</template>
                </div>
              </template>
            </header>
            <main>
              <div class="vehicle-select__fields">
                <vehicle-select-field
                  v-for="item in basicFieldList"
                  :key="item.key"
                  :label="item.label"
                  :data="vehicleOptions[item.key]"
                  :selected-item="vehicle[item.key]"
                  :disabled="disabled[item.key]"
                  @select="(value) => onSelect(item.key, value)"
                />

                <template v-if="isBasicInfoComplete">
                  <vehicle-select-field
                    v-for="item in otherFieldList"
                    :key="item.key"
                    :label="item.label"
                    :data="vehicleOptions[item.key]"
                    :selected-item="vehicle[item.key]"
                    :disabled="disabled[item.key]"
                    @select="(value) => onSelect(item.key, value)"
                  />
                </template>
              </div>
            </main>
          </section>
          <section class="section-heterogeneity">
            <div class="heterogeneity">
              <header>
                <span class="title">选择配置差异项</span>
              </header>
              <main>
                <div v-for="(item, index) in option" :key="index" class="heterogeneity__item">
                  <div v-if="item.label">
                    <div class="name">{{ item.label }}</div>
                    <div class="option">
                      <div v-for="value in item.values" :key="value" :class="['option__item', { 'is-selected': item.currentValue === value }]" @click="onSelectHeterogeneity(item, value)">
                        <span>{{ value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
            <div class="sales-name">
              <header>
                <span class="title">车款</span>
                <span class="tips">（可直接选择）</span>
              </header>
              <main>
                <div v-for="(item, index) in filteredHeterogeneity" :key="index" :class="['sales-name__item', { 'is-selected': selectedSid === item.mjsid }]" @click="chooseCar(item)">
                  <template>{{ item.salesName }}</template>
                </div>
              </main>
            </div>
          </section>
        </div>
      </main>
      <footer>
        <button v-if="showHeterogeneity" key="pre" :disabled="!isBasicInfoComplete || !isOtherComplete" class="btn-pre" @click="onPre">
          <template>上一步</template>
        </button>

        <button v-if="!showHeterogeneity" key="next" class="btn-ok" @click="onNext">
          <template>确定</template>
        </button>
        <button v-else key="complete" class="btn-ok" @click="onComplete">
          <template>确定</template>
        </button>
      </footer>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { mapMutations } from 'vuex';

import VehicleSelectField from './VehicleSelectField.vue';

import { getUserBrandsTree, getVehicle, getVehicleHeterogeneity } from '../api';
import { response_code, vehicle_keys } from '../config/constant';
import heterogeneity from '../config/heterogeneity';

const basicFieldList = [
  {
    key: vehicle_keys.BRAND,
    label: '品牌',
  },
  {
    key: vehicle_keys.SUB_BRAND,
    label: '厂牌',
  },
  {
    key: vehicle_keys.SERIES,
    label: '车系',
  },
  {
    key: vehicle_keys.GROUP,
    label: '车组',
  },
];

const otherFieldList = [
  {
    key: vehicle_keys.YEAR,
    label: '年款',
  },
  {
    key: vehicle_keys.ENGINE_DISPLACEMENT,
    label: '排量/发动机',
  },
  {
    key: vehicle_keys.TRANSMISSION,
    label: '变速箱',
  },
];

const staticKeys = ['mjsid', 'salesName', 'guidingPrice'];

export default {
  components: {
    VehicleSelectField,
  },
  props: {
    show: Boolean,
  },
  data: () => ({
    basicFieldList,
    otherFieldList,
    disabled: {},

    vinCode: '',

    alphabet: '',
    selectedAlphabet: '',

    loadingVehicleInfo: false,
    vehicle: {},
    vehicleOptions: {},

    showHeterogeneity: false,
    selectedSid: null,

    brandTreeData: [],

    localVehicle: null,
    option: [],
    priority: '',
    heterogeneity: [],
    partFlag: null,
  }),
  computed: {
    isAllSelected() {
      return !this.alphabet;
    },
    alphabetList() {
      if (this.vehicle.brand) {
        for (const { groupInfo, brands } of this.brandTreeData) {
          if (brands.map(item => item.name).includes(this.vehicle.brand)) {
            return [groupInfo];
          }
        }

        return [];
      }

      return this.brandTreeData.map(item => item.groupInfo);
    },
    isBasicInfoComplete() {
      const { brand, subBrand, mjVehicleSys, mjVehicleGroup } = this.vehicle;
      return Boolean(brand && subBrand && mjVehicleSys && mjVehicleGroup);
    },
    isOtherComplete() {
      const { year, engineDisplacement, transmission } = this.vehicle;
      return Boolean(year && engineDisplacement && transmission);
    },
    loading() {
      return this.loadingVehicleInfo;
    },
    filteredHeterogeneity() {
      const result = [];
      for (const item of this.heterogeneity) {
        let matched = true;

        for (const [key, value] of Object.entries(item)) {
          if (staticKeys.includes(key) || !value) {
            continue;
          }

          const currentOption = this.option.find(opt => opt.key === key);
          if (!currentOption) {
            continue;
          }

          const { currentValue } = currentOption;

          if (currentValue && currentValue !== value) {
            matched = false;
            break;
          }
        }

        if (matched) {
          result.push(item);
        }
      }
      return result;
    },
  },
  watch: {
    show(to) {
      if (to) {
        this.vehicle = {};
        this.vehicleOptions = {};
        this.disabled = {};

        this.showHeterogeneity = false;
        this.selectedSid = null;

        this.localVehicle = null;
        this.option = [];
        this.heterogeneity = [];

        if (this.vinCode) {
          this.getVehicle({
            isFirst: true,
          });
        } else {
          this.getUserBrandsTree();
        }
      }
    },
  },
  methods: {
    ...mapMutations('vinQuery', ['setCurrentVehicle']),
    setVinCode(vinCode) {
      this.vinCode = vinCode;
    },
    /**
     * 重置品牌
     */
    resetBrandOptions() {
      this.vehicleOptions = {
        brand: this.brandTreeData.flatMap(item => item.brands).map(item => item.name),
      };
    },
    /**
     * 获取品牌厂牌
     */
    getUserBrandsTree() {
      this.loadingVehicleInfo = true;

      getUserBrandsTree()
        .then(response => {
          const { code, data } = response.data;

          if (code === response_code.SUCCESS) {
            this.brandTreeData = data;
            this.resetBrandOptions();
          }
        })
        .finally(() => {
          this.loadingVehicleInfo = false;
        });
    },
    /**
     * 获取销售车型主属性信息
     * @param {Object} options
     * @param {Object} options.isFirst 是否第一次执行，用于锁定部分选项 [选填]
     * @param {Object} options.isUnSelect 本次操作是否是取消选择后触发 [选填]
     */
    getVehicle(options = {}) {
      // isFirst 表示第一次执行
      const { isUnSelect, isFirst } = options;

      this.loadingVehicleInfo = true;

      const currentVehicle = {
        brand: this.vehicle.brand,
        subBrand: this.vehicle.subBrand,
        mjVehicleSys: this.vehicle.mjVehicleSys,
        mjVehicleGroup: this.vehicle.mjVehicleGroup,
        year: this.vehicle.year,
        displacement: this.vehicle.engineDisplacement ? this.vehicle.engineDisplacement.split(' | ')[0] : undefined,
        engine: this.vehicle.engineDisplacement ? this.vehicle.engineDisplacement.split(' | ')[1] : undefined,
        transmission: this.vehicle.transmission,
      };

      getVehicle({
        vinCode: this.vinCode,
        quoteInfos: JSON.stringify(currentVehicle),
      })
        .then(response => {
          const { code, toastMessage, data } = response.data;

          if (code === response_code.SUCCESS) {
            // 更新选项
            this.vehicleOptions = {
              ...data,
              [vehicle_keys.ENGINE_DISPLACEMENT]: data[vehicle_keys.ENGINE_DISPLACEMENT].map(item => item.split(' | ').reverse().join(' | ')),
            };

            // 如果是第一次进入，需要设置初始化 disabled 变量，可选项唯一的字段将不能选择
            if (isFirst) {
              const disabled = {};
              Object.entries(this.vehicleOptions).forEach(([key, value]) => (disabled[key] = value.length === 1));
              this.disabled = disabled;
            }

            // 如果不是取消选择且获取的选项唯一时，自动选中该选项
            if (!isUnSelect) {
              const vehicle = { ...this.vehicle };
              Object.values(vehicle_keys).forEach(key => {
                if (data[key].length === 1) {
                  if (key === vehicle_keys.ENGINE_DISPLACEMENT) {
                    vehicle[key] = data[key][0].split(' | ').reverse().join(' | ');
                  } else {
                    vehicle[key] = data[key][0];
                  }
                } else {
                  vehicle[key] = undefined;
                }
              });
              this.vehicle = vehicle;
            }
          } else {
            this.$message.error(toastMessage);
          }
        })
        .finally(() => {
          this.loadingVehicleInfo = false;
        });
    },
    /**
     * 选择字母
     */
    onClickAlphabet(alphabet) {
      this.alphabet = alphabet;

      if (!alphabet) {
        this.vehicle = {};
        this.resetBrandOptions();
      } else {
        this.vehicle = {};
        this.vehicleOptions = {
          brand: this.brandTreeData.find(item => item.groupInfo === this.alphabet).brands.map(item => item.name),
        };
      }
    },
    /**
     * 主属性选择回调
     */
    onSelect(key, value) {
      return value !== this.vehicle[key] ? this.select(key, value) : this.unselect(key);
    },
    /**
     * 选择了一个主属性
     */
    select(key, value) {
      const vehicle = { ...this.vehicle };
      vehicle[key] = value;

      // 如果 VIN 存在，保存所选项后直接请求新的主属性
      if (this.vinCode) {
        this.vehicle = vehicle;

        return this.getVehicle();
      }

      switch (key) {
        // 如果选择的是品牌，保存所选项，清空品牌以外的其他主属性，并更新品牌、厂牌的可选项
        case vehicle_keys.BRAND:
          this.vehicle = { [vehicle_keys.BRAND]: value };
          this.vehicleOptions = {
            [vehicle_keys.BRAND]: [value],
            [vehicle_keys.SUB_BRAND]: this.brandTreeData
              .flatMap(item => item.brands)
              .find(item => item.name === value)
              .subBrands.map(item => item.name),
          };
          return;
        // 如果选择的是厂牌，保存所选项，清空品牌、厂牌以外的其他主属性，并更新厂牌的可选项
        case vehicle_keys.SUB_BRAND:
          this.vehicle = {
            [vehicle_keys.BRAND]: vehicle.brand,
            [vehicle_keys.SUB_BRAND]: value,
          };
          this.vehicleOptions = {
            [vehicle_keys.BRAND]: this.vehicleOptions.brand,
            [vehicle_keys.SUB_BRAND]: [value],
          };
          break;
        // 如果选择的是车系，保存所选项，清空品牌、厂牌、车系以外的其他主属性
        case vehicle_keys.SERIES:
          this.vehicle = {
            [vehicle_keys.BRAND]: vehicle.brand,
            [vehicle_keys.SUB_BRAND]: vehicle.subBrand,
            [vehicle_keys.SERIES]: value,
          };
          break;
        default:
          this.vehicle = vehicle;
          break;
      }

      // 请求新的主属性
      return this.getVehicle();
    },
    /**
     * 取消选择了一个主属性
     */
    unselect(key) {
      const vehicle = { ...this.vehicle };
      delete vehicle[key];

      // 如果主属性的前四项没有选择完毕，清空后四项
      const { brand, subBrand, mjVehicleSys, mjVehicleGroup } = vehicle;
      if (!brand || !subBrand || !mjVehicleSys || !mjVehicleGroup) {
        delete vehicle[vehicle_keys.YEAR];
        delete vehicle[vehicle_keys.ENGINE_DISPLACEMENT];
        delete vehicle[vehicle_keys.TRANSMISSION];
      }

      // 如果 VIN 存在，保存所选项后直接请求新的主属性
      if (this.vinCode) {
        this.vehicle = vehicle;
        return this.getVehicle({ isUnSelect: true });
      }

      switch (key) {
        // 如果选择的是品牌，清空所有主属性，并更新品牌的可选项
        case vehicle_keys.BRAND:
          this.vehicle = {};
          this.resetBrandOptions();
          return;
        // 如果选择的是厂牌，保存所选项，清空品牌以外的其他主属性，并更新厂牌的可选项
        case vehicle_keys.SUB_BRAND:
          this.vehicle = { [vehicle_keys.BRAND]: vehicle.brand };
          this.vehicleOptions = {
            [vehicle_keys.BRAND]: this.vehicleOptions.brand,
            [vehicle_keys.SUB_BRAND]: this.brandTreeData
              .flatMap(item => item.brands)
              .find(item => item.name === vehicle.brand)
              .subBrands.map(item => item.name),
          };
          return;
        // 如果选择的是车系，保存所选项，清空品牌、厂牌以外的其他主属性
        case vehicle_keys.SERIES:
          this.vehicle = {
            [vehicle_keys.BRAND]: vehicle.brand,
            [vehicle_keys.SUB_BRAND]: vehicle.subBrand,
          };
          break;
        default:
          this.vehicle = vehicle;
          break;
      }

      // 请求新的主属性
      return this.getVehicle({ isUnSelect: true });
    },
    /**
     * 主属性选择完毕，进入差异项配置选择
     */
    onNext() {
      if (!this.isBasicInfoComplete || !this.isOtherComplete) {
        return this.$message({
          message: '请完成所有信息的选择进入下一步',
          type: 'warning',
        });
      }

      this.showHeterogeneity = true;
      this.selectedSid = null;

      this.localVehicle = null;
      this.option = [];
      this.heterogeneity = [];

      this.getVehicleHeterogeneity();
    },
    /**
     * 获取销售车型差异项
     */
    getVehicleHeterogeneity() {
      this.loadingVehicleInfo = true;

      const currentVehicle = {
        brand: this.vehicle.brand,
        subBrand: this.vehicle.subBrand,
        mjVehicleSys: this.vehicle.mjVehicleSys,
        mjVehicleGroup: this.vehicle.mjVehicleGroup,
        year: this.vehicle.year,
        displacement: this.vehicle.engineDisplacement ? this.vehicle.engineDisplacement.split(' | ')[0] : undefined,
        engine: this.vehicle.engineDisplacement ? this.vehicle.engineDisplacement.split(' | ')[1] : undefined,
        transmission: this.vehicle.transmission,
      };

      getVehicleHeterogeneity({
        vinCode: this.vinCode,
        quoteInfos: JSON.stringify(currentVehicle),
      })
        .then(response => {
          const { code, toastMessage, data } = response.data;
          if (code === response_code.SUCCESS) {
            this.heterogeneity = data.heterogeneity;
            this.priority = data.heterogeneity[0].priority;
            this.localVehicle = { ...data };
            delete this.localVehicle.heterogeneity;

            this.updateOption();
          } else {
            this.$message.error(toastMessage);
          }
        })
        .finally(() => {
          this.loadingVehicleInfo = false;
        });
    },
    /**
     * 更新差异项
     */
    updateOption() {
      const option = new Map();

      for (const item of this.filteredHeterogeneity) {
        for (const [key, value] of Object.entries(item)) {
          if (staticKeys.includes(key) || !value || key === 'priority' || key === 'partFlag') {
            continue;
          }

          let obj = option.get(key);

          if (!obj) {
            obj = {
              key,
              label: heterogeneity[key],
              values: new Set(),
            };
          }

          obj.values.add(value);
          option.set(key, obj);
        }
      }

      if (this.filteredHeterogeneity.length === 1) {
        this.selectedSid = this.filteredHeterogeneity[0].mjsid;
        this.partFlag = this.filteredHeterogeneity[0].partFlag;
        // 当mjsid唯一的时候 自动做确定
        this.onComplete();
      }

      this.option = [...option.values()]
        .sort((a, b) => this.priority.indexOf(a.key) - this.priority.indexOf(b.key))
        .map(item => {
          const existOption = this.option.find(subItem => subItem.key === item.key);

          return {
            ...item,
            values: _.orderBy([...item.values], [], ['desc']),
            currentValue: existOption ? existOption.currentValue : '',
          };
        });
    },
    /**
     * 选择差异项
     */
    onSelectHeterogeneity(item, value) {
      item.currentValue = item.currentValue === value ? '' : value;
      this.selectedSid = null;

      this.updateOption();
    },
    /**
     * 返回主属性选择
     */
    onPre() {
      this.showHeterogeneity = false;
    },
    /**
     * 差异项选择完毕
     */
    onComplete() {
      if (!this.selectedSid) {
        return this.$message({
          message: '请完成所有信息的选择进入下一步',
          type: 'warning',
        });
      }
      if (this.partFlag === '0') {
        return this.$message({
          message: '抱歉，该车型的数据正在开发中',
          type: 'warning',
        });
      }
      this.setCurrentVehicle({
        optionCode: null,
        mjsid: this.selectedSid,
        motor: this.localVehicle.displacement,
        transmission: this.localVehicle.transmission,
        year: this.localVehicle.year,
        serial: this.localVehicle.mjVehicleSys,
        subBrand: this.localVehicle.subBrand,
        maker: this.localVehicle.subBrand,
        mjVehicleGroup: this.localVehicle.mjVehicleGroup,
        displacement: this.localVehicle.displacement,
        optionInfo: '',
        vinCode: this.vinCode,
        prefix: this.localVehicle.prefix,
      });

      this.$emit('complete', [this.vinCode, this.localVehicle.subBrand]);
    },
    /**
     * 关闭本弹窗
     */
    onClose() {
      this.$emit('update:show', false);
    },
    /**
     * 选择车款
     */
    chooseCar(item) {
      this.selectedSid = item.mjsid;
      this.partFlag = item.partFlag;
      this.onComplete();
    },
  },
};
</script>

<style lang="scss">
.dialog-vehicle-select {
  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 20px;
    background-color: #f5f6f7;

    .dialog_title {
      margin-right: 16px;
      font-size: 16px;
      line-height: 1;
      color: #303233;
    }

    .el-dialog__headerbtn {
      position: relative;
      top: 0;
      right: 0;
      height: 16px;
    }
  }

  .el-dialog__body {
    height: 366px;
    padding: 12px 20px 20px;

    .el-loading-mask {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;

  > main {
    height: calc(100% - 36px);
    overflow: hidden;
  }

  .wrapper {
    position: relative;
    display: flex;
    height: 100%;
    width: 200%;
    overflow: hidden;
    transition: transform 0.3s ease, background-color 0.2s ease;

    &.show-heterogeneity {
      transform: translateX(-860px);
    }
  }

  section {
    flex-shrink: 0;
    height: 100%;
    width: 860px;

    &.section-main {
      header {
        height: 30px;
        display: flex;
        align-items: center;

        .alphabet__all,
        .alphabet__item {
          padding: 5px 7px;
          border-radius: 4px;
          margin: 0 3px;
          color: #616366;
          font-size: 14px;
          line-height: 1;
          background-color: #fff;
          transition: color 0.2s ease, background-color 0.2s ease;
          cursor: pointer;

          &.is-selected {
            color: #fff;
            background-color: #ff6700;
          }
        }

        .alphabet__all {
          margin-right: 45px;
        }

        + main {
          height: calc(100% - 60px);
        }
      }

      main {
        height: 100%;
        padding-top: 20px;
        overflow-y: auto;
      }
    }

    &.section-heterogeneity {
      display: flex;

      header {
        height: 23px;
        border-bottom: 1px solid #e6ecf2;
        color: #616366;
        font-size: 12px;

        .tips {
          color: #b2b5ba;
        }
      }

      main {
        height: calc(100% - 23px);
        overflow-y: auto;
      }

      .heterogeneity {
        width: 588px;
        margin-right: 20px;

        .heterogeneity__item {
          overflow: hidden;

          &:last-child {
            margin-bottom: 10px;
          }

          .name {
            margin: 16px 0 6px 0;
            font-size: 14px;
            letter-spacing: 0.08px;
            color: #303233;
          }

          .option {
            display: flex;
            overflow-x: auto;

            .option__item {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              min-height: 28px;
              min-width: 100px;
              max-width: 100%;
              padding: 6px 10px;
              border-radius: 15px;
              margin-right: 20px;
              font-size: 14px;
              color: #616366;
              background-color: #f2f3f5;
              transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              cursor: pointer;

              &.is-selected {
                color: #ff6700;
                background-color: #ffefe5;
              }
            }
          }
        }
      }

      .sales-name {
        width: 252px;

        main {
          overflow-y: auto;
        }

        .sales-name__item {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          min-height: 32px;
          padding: 8px 10px;
          font-size: 12px;
          color: #303233;
          cursor: pointer;

          &:nth-child(2) {
            margin-top: 10px;
          }

          &:nth-child(odd) {
            background-color: #f7f9fa;
          }

          &.is-selected {
            color: #ff6700;
          }
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: flex-end;
    height: 36px;

    .btn-pre {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      width: 100px;
      border-radius: 4px;
      margin-right: 10px;
      font-size: 14px;
      color: #616366;
      background-color: #edeff0;
    }

    .btn-ok {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      width: 68px;
      padding: 0;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      background-color: #ff6700;
      box-shadow: 0 3px 6px 0 rgba(255, 72, 0, 0.5);

      &:disabled {
        background-color: #ffaa79;
        box-shadow: 0 3px 6px 0 rgba(255, 72, 0, 0.5);
      }
    }
  }
}
</style>
