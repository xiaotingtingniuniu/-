<template>
  <section class="history-parts-list">
    <header class="list_heaser">
      <navigation />
    </header>
    <main class="list_main">
      <div class="list-content">
        <div class="title">
          <span class="text" @click="goPartsList">配件清单</span>
          <span class="list_number">{{ partsListTotal }}</span>
          <span class="list_his">
            >>
            <span class="list_his_word">
              <span>历史清单</span>
              <span v-if="countReadyToView > 0" class="dot" />
            </span>
          </span>
        </div>
        <div class="tabs">
          <el-tabs v-model="editableTabsValue" v-loading="loading" type="card" :editable="false" @tab-click="tabClick">
            <el-tab-pane key="my-create" label="我创建" name="my-create">
              <div v-if="historyList.length > 0 && editableTabsValue === 'my-create'" class="contant">
                <div v-for="(item, index) in historyList" :key="index">
                  <div class="list-by-date">{{ getFormattedDate(item.order.displayTime) }}</div>
                  <div class="list-order" :class="{ isChecked: historyList[index].order.isChecked }">
                    <span class="order-number">清单号：{{ item.order.orderNumber }}</span>
                    <span class="total">共{{ item.order.itemCount }}项配件</span>
                    <span class="time">{{ getHourMinute(item.order.displayTime) }}</span>
                    <span v-if="item.order.isOpen" class="switch" @click="setSwitch(item.order.orderNumber, index)">
                      <el-divider direction="vertical" />
                      <span>{{ item.order.isOpen }}</span>
                    </span>
                    <span v-else class="switch" @click="setSwitch(item.order.orderNumber, index)">
                      <el-divider direction="vertical" />
                      <span>展开</span>
                    </span>
                    <span v-if="item.bidCount > 0" class="bid" @click="othersQuoted(item)">
                      <span v-if="item.readyToViewCount > 0" class="dot" />
                      <span>收到报价{{ item.bidCount }}</span>
                    </span>
                    <span v-else class="bid notclick">收到报价{{ item.bidCount }}</span>
                  </div>
                  <div v-if="historyList[index].order.isChecked" class="order-details" :class="{ isChecked: historyList[index].order.isChecked }">
                    <div v-for="(item1, index1) in historyList[index].order.details" :key="index1">
                      <div class="list_group">
                        <div v-if="item1.groupingBy === 'VIN'">
                          <span>VIN码：{{ item1.vehicle.vinCode }}</span>
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;车辆信息：{{
                            item1.vehicle.subBrand || '' + ' ' + item1.vehicle.mjVehicleGroup || '' + ' ' + item1.vehicle.year || '' + ' ' + item1.vehicle.displacement || '' + ' ' + item1.vehicle.transmission || ''
                          }}</span>
                        </div>
                        <div v-else-if="item1.groupingBy === 'MJSID'">
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;车辆信息：{{
                            item1.vehicle.subBrand || '' + ' ' + item1.vehicle.mjVehicleGroup || '' + ' ' + item1.vehicle.year || '' + ' ' + item1.vehicle.displacement || '' + ' ' + item1.vehicle.transmission || ''
                          }}</span>
                        </div>
                        <div v-else-if="item1.groupingBy === 'PART_NUMBER'">
                          <span>OE号：{{ item1.partNumbers[0] || '' }}</span>
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;适用车型：</span>
                          <span>{{ item1.vehicle.subBrand || '' }}</span>
                          <span>{{ item1.vehicle.mjVehicleGroup || '' }}</span>
                        </div>
                      </div>
                      <div class="list_table">
                        <el-table :data="item1.items" style="width: 100%;" :header-cell-style="{ background: '#F5F6F7', fontSize: '12px', color: '#919599' }" :show-header="true">
                          <el-table-column prop="stdPartName" label="标准名" width="180">
                            <template slot-scope="scope">{{ scope.row.part.stdPartName || '暂无' }}</template>
                          </el-table-column>
                          <el-table-column prop="srcPartName" label="原厂名" width="180">
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
                        </el-table>
                      </div>
                    </div>
                    <div class="remark">
                      <div v-if="item.order.remark && item.order.creator" class="remark-word">{{ item.order.creator.name }}的备注:</div>
                      <span class="remark-span">{{ item.order.remark || '暂无备注内容' }}</span>
                    </div>
                    <div class="share-again" @click="shareAgain(item.order)">再次分享</div>
                  </div>
                </div>
              </div>
              <div v-else class="none">
                <div class="no-data">
                  暂无数据
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane key="others-create" label="他人创建" name="others-create" class="others-create">
              <div v-if="historyList.length > 0 && editableTabsValue === 'others-create'" class="contant">
                <div v-for="(item, index) in historyList" :key="index">
                  <div class="list-by-date">{{ getFormattedDate(item.order.displayTime) }}</div>
                  <div class="list-order">
                    <span class="order-title">{{ item.order.title }}</span>
                    <span class="order-number">清单号：{{ item.order.orderNumber }}</span>
                    <span class="total">共{{ item.order.itemCount }}项配件</span>
                    <span class="time">{{ getHourMinute(item.order.displayTime) }}</span>
                    <span class="switch">
                      <el-divider direction="vertical" />
                      <span @click="goQuoted(item.order.receipt)">查看</span>
                    </span>
                    <span v-if="item.bidCount > 0" class="bid" @click="myQuoted(item)">我的报价{{ item.bidCount }}</span>
                    <span v-else class="bid notclick">我的报价{{ item.bidCount }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="none">
                <div class="no-data">
                  暂无数据
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </main>
    <dialog-share-parts />
    <dialog-quoted />
    <toturial />
  </section>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import DialogQuoted from '../components/DialogQuoted.vue';
import DialogShareParts from '../components/DialogShareParts.vue';
import Navigation from '../components/Navigation.vue';
import Toturial from '../components/Toturial.vue';

import { router_names } from '../config/constant';
import { getFormattedDate, getHourMinute } from '../utils/date';

export default {
  components: {
    DialogQuoted,
    DialogShareParts,
    Navigation,
    Toturial,
  },
  data() {
    return {
      orderDetails: false,
    };
  },
  computed: {
    ...mapState('partsList', ['loading', 'historyList', 'historyOrderDetails', 'isVisibleShareDialog', 'isShareAgain', 'partsListTotal', 'countReadyToView', 'isFirstHistoryList', 'shareTextarea']),
    editableTabsValue: {
      get() {
        return this.$store.state.partsList.editableTabsValue;
      },
      set(value) {
        this.setEditableTabsValue(value);
      },
    },
  },
  watch: {
    historyOrderDetails() {
      this.$forceUpdate();
    },
    historyList() {
      this.$forceUpdate();
    },
  },
  created() {
    const params = {
      showBids: false,
      showOrderCreator: false,
      showQuoteCreator: false,
      showQuoteBidder: true,
    };
    this.getMyCreate(params);
    this.setIsFirstHistoryList(false);
    localStorage.setItem('isFirstHistoryList', false);
  },
  mounted() {},
  methods: {
    ...mapActions('partsList', ['getHistoryByDate', 'getMyCreate', 'getOthersCreate', 'getHistoryOrderDetails', 'submitPartsList', 'getOthersQuoted', 'getMyQuoted', 'getCountReadyToView']),
    ...mapMutations('partsList', [
      'setHistoryList',
      'setIsVisibleShareDialog',
      'setIsShareAgain',
      'setShareUrl',
      'setCheckedList',
      'setOrderNumber',
      'setQuotedDialogTitle',
      'setIsVisibleQuotedDialo',
      'setQuotedOrderList',
      'setEditableTabsValue',
      'setIsFirstHistoryList',
      'setShareTextarea',
    ]),
    setSwitch(orderNumber, index) {
      // 调用 查看查看历史清单详情接口
      const paramsObject = {
        orderNumber: orderNumber,
        index: index,
      };
      const currrentList = this.historyList[index].order;
      if (currrentList.isChecked && currrentList.isChecked === true) {
        currrentList.isOpen = '展开';
        currrentList.isChecked = false;
        const sourceData = this.historyList;
        this.orderDetails = false;
        this.setHistoryList([]);
        this.setHistoryList(sourceData);
      } else {
        currrentList.isOpen = '收起';
        currrentList.isChecked = true;
        this.orderDetails = true;
        this.getHistoryOrderDetails(paramsObject);
      }
    },
    shareAgain(val) {
      const shareUrl = `${val.shareUrl}&type=1`;
      const checkedList = [];
      this.setShareTextarea(val.remark);
      val.details.map(item => {
        item.items.map(item1 => {
          checkedList.push(item1);
          return item1;
        });
        return item;
      });
      this.setCheckedList(checkedList);
      this.setIsVisibleShareDialog(true);
      this.setIsShareAgain(true);
      this.setOrderNumber(val.orderNumber);
      this.setShareUrl(shareUrl);
    },
    goPartsList() {
      this.$router.push({ name: router_names.PARTSLIST });
    },
    tabClick(tab) {
      // 获取待查看的报价单个数（小红点）
      this.getCountReadyToView({
        params: {},
        success: value => {
          console.log('value', value);
        },
      });
      if (tab.name === 'my-create') {
        // 我创建
        this.orderDetails = false;
        const params = {
          showBids: false,
          showOrderCreator: false,
          showQuoteCreator: false,
          showQuoteBidder: true,
        };
        // 调用 树型查询报价清单列表（我创建）接口
        this.getMyCreate(params);
      } else if (tab.name === 'others-create') {
        // 他人创建
        this.orderDetails = false;
        const params = {
          showBids: false,
          showOrderCreator: true,
          showQuoteCreator: false,
          showQuoteBidder: false,
        };
        // 调用 树型查询报价清单列表（他人创建）接口
        this.getOthersCreate(params);
      }
    },
    getFormattedDate(timestamp) {
      return getFormattedDate(timestamp);
    },
    getHourMinute(timestamp) {
      return getHourMinute(timestamp);
    },
    goQuoted(receipt) {
      // 跳转H5 报价页面
      const { origin, pathname } = document.location;
      window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${receipt}&type=1`;
    },
    othersQuoted(item) {
      const orderNumber = item.order.orderNumber; // 历史清单号
      const bidCount = item.bidCount; // 收到报价个数
      this.setIsVisibleQuotedDialo(true);
      const params = {
        baseOrderNumber: orderNumber,
      };
      // 调用 查询报价清单列表（收到报价） 接口
      this.getOthersQuoted({
        params: params,
        success: value => {
          this.setQuotedOrderList(value);
          this.setQuotedDialogTitle(`收到报价 ${bidCount}`);
        },
      });
    },
    myQuoted(item) {
      const orderNumber = item.order.orderNumber; // 历史清单号
      const bidCount = item.bidCount; // 收到报价个数
      this.setIsVisibleQuotedDialo(true);
      const params = {
        baseOrderNumber: orderNumber,
      };
      // 调用 查询报价清单列表（我的报价） 接口
      this.getMyQuoted({
        params: params,
        success: value => {
          this.setQuotedOrderList(value);
          this.setQuotedDialogTitle(`我的报价 ${bidCount}`);
        },
      });
    },
  },
};
</script>

<style lang="scss">
.el-tabs__nav-scroll {
  background: #f5f6f7;
}

.el-tabs.el-tabs--card.el-tabs--top {
  margin: 0 50px;
}

.el-tabs__header.is-top {
  margin: 0;
}

.el-tabs__content {
  margin: 0 -50px;
  background-color: #fff;

  .el-tab-pane {
    margin: 0 50px;
  }
}

.el-tabs__nav.is-top {
  border: 0 !important;

  .el-tabs__item.is-top {
    border: 0 !important;
    width: 100px;
    padding: 0;
    text-align: center;
    height: 32px;
    line-height: 32px;
    border-radius: 4px 4px 0 0;
    font-size: 14px;
    color: #303233;
  }

  .el-tabs__item.is-top.is-active {
    background-color: #fff;
    border: 0 !important;
    color: #ff6700;
  }
}

.tabs .el-loading-mask {
  margin-top: 32px;
}
</style>

<style lang="scss" scoped>
.history-parts-list {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1024px;
  overflow: hidden;

  .list_main {
    height: calc(100vh - 60px);
    overflow-y: auto;

    .list-content {
      padding: 0px 0px 60px;
    }

    .title {
      height: 44px;
      line-height: 44px;
      background: #f5f6f7;
      padding: 0 50px;

      .text {
        font-size: 14px;
        color: #303233;
        font-weight: bold;
        cursor: pointer;
      }

      .list_number {
        color: #ff6700;
      }

      .list_his {
        font-size: 14px;
        color: #000032;
        line-height: 20px;

        .list_his_word {
          font-size: 14px;
          color: #797c80;
          line-height: 20px;

          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #ff2020;
            border-radius: 50%;
            vertical-align: middle;
            margin-bottom: 3px;
          }
        }
      }
    }

    .tabs {
      background: #f5f6f7;
    }

    .contant {
      width: 100%;

      .list-by-date {
        margin-top: 16px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #797c80;
      }

      .list-order {
        border-bottom: 1px solid #e6ecf2;
        height: 48px;
        line-height: 48px;
        padding: 0 10px 0 10px;

        &.isChecked {
          border-bottom: 0;
        }

        .order-number {
          font-size: 14px;
          color: #303233;
          width: 315px;
          display: inline-block;
        }

        .total {
          font-size: 12px;
          color: #616366;
          display: inline-block;
          width: 130px;
        }

        .time {
          font-size: 12px;
          color: #616366;
        }

        .bid {
          float: right;
          font-size: 12px;
          color: #ff6700;
          margin-right: 17px;
          cursor: pointer;

          &.notclick {
            opacity: 0.3;
            cursor: not-allowed;
          }

          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #ff2020;
            border-radius: 50%;
            vertical-align: middle;
            margin-bottom: 4px;
          }
        }

        .switch {
          float: right;
          font-size: 12px;
          color: #ff6700;
          text-align: right;
          cursor: pointer;
        }
      }

      .isChecked {
        display: block !important;
        border-bottom: 1px solid #e6ecf2;
      }

      .order-details {
        background: #fafbfc;
        padding: 0px 10px 61px 10px;
        display: none;
        position: relative;

        .list_group {
          margin-bottom: 12px;
          padding-top: 20px;
          font-size: 12px;
          color: #303233;
        }

        .list_table {
          border: 1px solid #e6ecf2;
          border-bottom: 0;
        }

        .remark {
          margin-top: 20px;
          font-size: 12px;

          .remark-word {
            color: #303233;
            vertical-align: top;
          }

          .remark-span {
            color: #616366;
            display: inline-block;
          }
        }

        .share-again {
          margin-top: 12px;
          margin-bottom: 19px;
          text-align: center;
          width: 102px;
          height: 30px;
          line-height: 30px;
          background: rgba(255, 103, 0, 0.02);
          border: 1px solid #ff6700;
          border-radius: 4px;
          border-radius: 4px;
          font-size: 12px;
          color: #ff6700;
          position: absolute;
          right: 10px;
          cursor: pointer;

          &:hover {
            color: #ffffff;
            background: #ff6700;
          }
        }
      }
    }

    .others-create .order-title {
      font-size: 14px;
      color: #303233;
      width: 270px;
      display: inline-block;
    }

    .none {
      min-height: 400px;
      font-size: 12px;
      color: #616366;

      .no-data {
        margin-top: 16px;
      }
    }
  }
}
</style>
