<template>
  <section class="page-parts-list">
    <header class="list_heaser">
      <navigation />
    </header>
    <main class="list_main">
      <div class="list-content">
        <div class="title">
          <span class="text">配件清单</span>
          <span class="list_number">{{ partsListTotal }}</span>
          <div class="right">
            <span class="checked">
              <span>已选</span>
              <span class="number">{{ checkedList.length }} 项</span>
            </span>
            <button v-if="checkedList.length === 0" class="share isDisabled" disabled="disabled">
              分享给他人
            </button>
            <button v-else class="share" :class="{ isDisabled: isDisabled, isActive: isActive }" :disabled="isDisabled" @click="share()">
              分享给他人
            </button>
            <span v-if="isFirstShareList" class="share-dialog">
              <i class="share-title">选择配件后，点击这里进行分享</i>
              <i class="share-close" @click="closeDialog" />
              <i class="share-content">不同设备、账号之间同步信息，还可以询报价</i>
            </span>
            <span class="lookfor" @click="goHistoryList">
              <span>
                查看历史清单
              </span>
              <span v-if="countReadyToView > 0" class="dot" />
              <span v-if="isFirstHistoryList && countReadyToView === 0" class="new" />
            </span>
          </div>
        </div>
        <div v-if="partsList.length > 0" v-loading="loading" class="parts_list">
          <div v-for="(item, index) in partsList" :id="index" :key="index">
            <div class="list_group">
              <div v-if="item.groupingBy === 'VIN'">
                <span>VIN码：{{ item.vehicle.vinCode }}&nbsp;</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;车辆信息：</span>
                <span>{{ item.vehicle.subBrand || '' }}&nbsp;</span>
                <span>{{ item.vehicle.mjVehicleGroup || '' }}&nbsp;</span>
                <span>{{ item.vehicle.year || '' }}&nbsp;</span>
                <span>{{ item.vehicle.displacement || '' }}&nbsp;</span>
                <span>{{ item.vehicle.transmission || '' }}&nbsp;</span>
              </div>
              <div v-else-if="item.groupingBy === 'MJSID'">
                <span>&nbsp;&nbsp;&nbsp;&nbsp;车辆信息：</span>
                <span>{{ item.vehicle.subBrand || '' }}&nbsp;</span>
                <span>{{ item.vehicle.mjVehicleGroup || '' }}&nbsp;</span>
                <span>{{ item.vehicle.year || '' }}&nbsp;</span>
                <span>{{ item.vehicle.displacement || '' }}&nbsp;</span>
                <span>{{ item.vehicle.transmission || '' }}&nbsp;</span>
              </div>
              <div v-else-if="item.groupingBy === 'PART_NUMBER'">
                <span>OE号：{{ item.partNumbers[0] || '' }}&nbsp;</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;适用车型：</span>
                <span>{{ item.vehicle.subBrand || '' }}&nbsp;</span>
                <span>{{ item.vehicle.mjVehicleGroup || '' }}&nbsp;</span>
              </div>
            </div>
            <div class="list_table">
              <el-table
                ref="multipleTable"
                :show-header="true"
                :data="item.items"
                :header-cell-style="{ background: '#F5F6F7', fontSize: '12px', color: '#919599' }"
                :cell-style="{ color: '#000', fontSize: '12px' }"
                tooltip-effect="dark"
                style="width: 100%;"
                @select="select"
                @select-all="(selection) => selectAll(selection, index)"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column label="标准名">
                  <template slot-scope="scope">{{ scope.row.part.stdPartName || '暂无' }}</template>
                </el-table-column>
                <el-table-column prop="name" label="原厂名">
                  <template slot-scope="scope">{{ scope.row.part.srcPartName }}</template>
                </el-table-column>
                <el-table-column prop="number" label="OE号" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.part.partNumber }}</template>
                </el-table-column>
                <el-table-column prop="4s" label="4S店价" show-overflow-tooltip>
                  <template slot-scope="scope">{{ '￥' + Number(scope.row.price).toFixed(2) || '暂无' }}</template>
                </el-table-column>
                <el-table-column prop="comment" label="备注" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.part.comment || '暂无' }}</template>
                </el-table-column>
                <el-table-column prop="comment" label=" " show-overflow-tooltip>
                  <span slot-scope="scope" class="delete" @click="handleDelete(scope.$index, scope.row, item.items)">删除</span>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div v-else v-loading="loading" class="none">暂无数据</div>
      </div>
    </main>
    <dialog-share-parts />
  </section>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import DialogShareParts from '../components/DialogShareParts.vue';
import Navigation from '../components/Navigation.vue';

import { router_names } from '../config/constant';

export default {
  components: {
    DialogShareParts,
    Navigation,
  },
  data: () => ({
    isDisabled: true,
    isActive: false,
    dataArr: [],
    checkedPartsList: [], // 选中的配件
  }),
  computed: {
    ...mapState('partsList', ['partsList', 'loading', 'partsListTotal', 'checkedList', 'countReadyToView', 'isFirstHistoryList', 'isFirstShareList']),
  },
  watch: {},
  created() {
    this.getPartsList();
  },
  mounted() {},
  methods: {
    ...mapActions('partsList', ['getPartsList', 'deletePartsList', 'submitPartsList']),
    ...mapMutations('partsList', ['setCheckedList', 'setIsVisibleShareDialog', 'setIsFirstShareList', 'setShareTextarea']),
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val, index) {
      this.multipleSelection = val;
      this.checkedPartsList = [];
      if (val.length === 0) {
        // 取消全选
        console.log('取消全选');
        this.partsList[index].items.map(item => {
          item.isChecked = false;
          return item;
        });
      } else {
        // 选择了数据
        console.log('选择了数据');
        val.map(item => {
          if (item.isChecked) {
            item.isChecked = false;
          } else {
            item.isChecked = true;
          }
          return item;
        });
      }
      console.log('partsList', this.partsList);
      this.partsList.map(item => {
        item.items.map(item1 => {
          if (item1.isChecked && item1.isChecked === true) {
            this.checkedPartsList.push(item1);
          }
          return item1;
        });
        return item;
      });
      // this.checkedPartsList = val;
      console.log('this.checkedPartsList', this.checkedPartsList);
      this.setCheckedList(this.checkedPartsList);
      console.log('this.checkedPartsList', this.checkedPartsList);
      // 已选则的配件个数
      if (this.checkedPartsList.length > 0) {
        this.isDisabled = false;
        this.isActive = true;
      } else {
        this.isDisabled = true;
        this.isActive = false;
      }
    },
    select(selection, row) {
      this.checkedPartsList = [];
      console.log('手动选择一个');
      this.setShareTextarea('');
      console.log('selection', selection);
      console.log('row', row);
      if (row.isChecked) {
        row.isChecked = false;
      } else {
        row.isChecked = true;
      }
      console.log('this.partsList', this.partsList);
      this.partsList.map(item => {
        item.items.map(item1 => {
          if (item1.isChecked && item1.isChecked === true) {
            this.checkedPartsList.push(item1);
          }
          return item1;
        });
        return item;
      });
      // this.checkedPartsList = val;
      console.log('this.checkedPartsList', this.checkedPartsList);
      this.setCheckedList(this.checkedPartsList);
      console.log('partsList', this.partsList);
      // 已选则的配件个数
      if (this.checkedPartsList.length > 0) {
        this.isDisabled = false;
        this.isActive = true;
      } else {
        this.isDisabled = true;
        this.isActive = false;
      }
    },
    selectAll(val, index) {
      console.log('全选');
      console.log('val', val);
      console.log('index', index);
      this.checkedPartsList = [];
      this.setShareTextarea('');
      if (val.length === 0) {
        // 取消全选
        console.log('取消全选');
        this.partsList[index].items.map(item => {
          item.isChecked = false;
          return item;
        });
      } else {
        // 选择了数据
        console.log('选择了数据');
        val.map(item => {
          item.isChecked = true;
          return item;
        });
      }
      console.log('partsList', this.partsList);
      this.partsList.map(item => {
        item.items.map(item1 => {
          if (item1.isChecked && item1.isChecked === true) {
            this.checkedPartsList.push(item1);
          }
          return item1;
        });
        return item;
      });
      // this.checkedPartsList = val;
      console.log('this.checkedPartsList', this.checkedPartsList);
      this.setCheckedList(this.checkedPartsList);
      console.log('this.checkedPartsList', this.checkedPartsList);
      // 已选则的配件个数
      if (this.checkedPartsList.length > 0) {
        this.isDisabled = false;
        this.isActive = true;
      } else {
        this.isDisabled = true;
        this.isActive = false;
      }
    },
    onChange(e) {
      console.log('e', e);
    },
    handleDelete(index, row, data) {
      console.log(index, row, data);
      // 删除配件
      const params = {
        itemToRemove: [row.code],
        viewResult: true,
      };
      // data.splice(index, 1);
      this.deletePartsList(params);
    },
    share() {
      if (this.isFirstShareList) {
        this.setIsFirstShareList(false);
        localStorage.setItem('isFirstShareList', false);
      }
      this.setIsVisibleShareDialog(true);
    },
    goHistoryList() {
      this.$router.push({ name: router_names.HISTORYLIST });
    },
    closeDialog() {
      this.setIsFirstShareList(false);
      localStorage.setItem('isFirstShareList', false);
    },
  },
};
</script>

<style lang="scss">
/deep/.el-checkbox__input.is-focus .el-checkbox_inner {
  border-color: red;
}

/deep/.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
</style>

<style lang="scss" scoped>
.page-parts-list {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  /deep/.part_list {
    display: none;
  }

  .list_main {
    height: calc(100vh - 60px);
    overflow-y: auto;

    .list-content {
      padding: 0px 50px 60px;
    }

    .title {
      height: 30px;
      line-height: 30px;
      margin-top: 12px;

      .text {
        font-size: 14px;
        color: #303233;
        font-weight: bold;
      }

      .list_number {
        color: #ff6700;
      }

      .right {
        display: inline-block;
        float: right;
        position: relative;

        .checked {
          font-size: 12px;
          color: #797c80;
          text-align: right;
        }

        .share {
          width: 102px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          display: inline-block;
          text-align: center;
          border: 1px solid #ff6700;
          border-radius: 4px;
          background: rgba(255, 103, 0, 0.02);
          color: #ff6700;
          margin-left: 10px;
          margin-right: 19px;

          &:hover {
            color: #ffffff;
            background: #ff6700;
          }
        }

        .share.isActive {
          cursor: pointer;
        }

        .share.isDisabled {
          color: #ff6700;
          background: rgba(255, 103, 0, 0.02);
          opacity: 0.5;
        }

        .share-dialog {
          width: 380px;
          height: 149px;
          display: inline-block;
          background-image: url('../images/bg@2x.png');
          background-size: cover;
          position: absolute;
          top: 30px;
          left: -117px;
          z-index: 1;

          .share-title {
            display: block;
            margin-top: 56px;
            height: 25px;
            line-height: 25px;
            font-size: 18px;
            color: #ffffff;
            margin-left: 40px;
          }

          .share-close {
            width: 20px;
            height: 20px;
            background-image: url('../images/icon_close@2x.png');
            background-size: cover;
            position: absolute;
            top: 50px;
            font-size: 20px;
            left: 330px;
            color: #ffffff;
            cursor: pointer;
          }

          .share-content {
            display: block;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #ffffff;
            margin-left: 40px;
            margin-top: 6px;
          }
        }

        .lookfor {
          font-size: 12px;
          color: #616366;
          text-align: right;
          cursor: pointer;
          position: relative;

          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #ff2020;
            border-radius: 50%;
            vertical-align: middle;
            margin-bottom: 18px;
          }

          .new {
            display: inline-block;
            width: 28px;
            height: 14px;
            background-image: url('../images/icon_new@2x.png');
            background-size: cover;
            position: absolute;
            top: -10px;
            right: -26px;
          }
        }

        .lookfor:hover {
          color: #303233;
        }
      }
    }

    .parts_list {
      min-height: 400px;
    }

    .none {
      min-height: 400px;
      font-size: 12px;
      color: #616366;
    }

    .list_group {
      margin-top: 24px;
      margin-bottom: 12px;
      font-size: 12px;
      color: #303233;
    }

    .list_table {
      border: 1px solid #e6ecf2;
      border-bottom: 0;
    }

    .delete {
      cursor: pointer;
      color: #616366;
    }

    .delete:hover {
      color: #303233;
    }

    /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: red;
      border-color: red !important;
    }

    /deep/.el-checkbox__input.is-checked + .el-checkbox_label {
      color: #ff6700;
    }

    /deep/.el-checkbox__inner:hover {
      border-color: #ff6700;
    }

    /deep/.el-checkbox__inner:visited {
      background-color: #ff6700 !important;
    }

    /deep/.el-checkbox__input.is-focus .el-checkbox__inner:visited {
      background-color: #ff6700 !important;
    }

    /deep/.el-checkbox__input.is-focus .el-checkbox_inner {
      border-color: #ff6700;
    }

    /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #ff6700;
      border-color: #ff6700;
    }

    /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #ff6700 !important;
      border-color: #ff6700 !important;
    }
  }
}
</style>
