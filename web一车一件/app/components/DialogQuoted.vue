<template>
  <el-dialog :title="quotedDialogTitle" :modal-append-to-body="false" :visible.sync="isVisibleQuotedDialo" :before-close="handleClose" width="850" class="dialog_quoted">
    <div class="dialog-content">
      <el-table
        :data="quotedOrderList"
        style="width: 100%;"
        class="quoted-table"
        :header-cell-style="{ background: '#F5F6F7', fontSize: '12px', color: '#919599' }"
        :show-header="false"
        :border="false"
        :cell-class-name="changeCellStyle"
        :row-class-name="tableRowClassName"
        @cell-click="cellClick"
      >
        <el-table-column v-if="editableTabsValue === 'my-create'" prop="myquoted" label="他人报价" width="320">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column v-else-if="editableTabsValue === 'others-create'" prop="myquoted" label="我的报价" width="320">我的报价</el-table-column>
        <el-table-column prop="ordernumber" label="清单号" width="302">
          <template slot-scope="scope"> 清单号：{{ scope.row.quoteNumber }} </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="158">
          <template slot-scope="scope">{{ `${getFormattedDate(scope.row.submitTime)}  ${getHourMinute(scope.row.submitTime)}` }}</template>
        </el-table-column>
        <el-table-column prop="quoted" label="查看报价" width="80">
          <template slot-scope="scope">
            <div @click="lookforQuoted(scope.row.receipt)">
              <span v-if="scope.row.readyToView && editableTabsValue === 'my-create'" class="dot" />
              <span>查看报价</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import { getFormattedDate, getHourMinute } from '../utils/date';

export default {
  computed: {
    ...mapState('partsList', ['isVisibleQuotedDialo', 'quotedDialogTitle', 'quotedOrderList', 'editableTabsValue']),
  },
  methods: {
    ...mapActions('partsList', ['getCountReadyToView', 'getMyCreate']),
    ...mapMutations('partsList', ['setIsVisibleQuotedDialo', 'setQuotedOrderList']),
    handleClose() {
      this.setIsVisibleQuotedDialo(false);
      this.getCountReadyToView({
        params: {},
        success: value => {
          console.log('value', value);
          if (this.editableTabsValue === 'my-create') {
            const params = {
              showBids: false,
              showOrderCreator: false,
              showQuoteCreator: false,
              showQuoteBidder: true,
            };
            // 调用 树型查询报价清单列表（我创建）接口
            this.getMyCreate(params);
          }
        },
      });
    },
    changeCellStyle({ columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        return 'quoted-word';
      }
      if (columnIndex === 2) {
        return 'quoted-time';
      }
      if (columnIndex === 3) {
        return 'look-quoted';
      }
    },
    getFormattedDate(timestamp) {
      return getFormattedDate(timestamp);
    },
    getHourMinute(timestamp) {
      return getHourMinute(timestamp);
    },
    lookforQuoted(receipt) {
      const { origin, pathname } = document.location;
      window.open(`${origin}${pathname}?receipt=${receipt}&type=2#/quoted`);
    },
    cellClick(row) {
      const currentQuotedOrderList = [];
      for (const i in this.quotedOrderList) {
        const obj = { ...this.quotedOrderList[i] };
        currentQuotedOrderList.push(obj);
      }
      const currentQuotedOrder = currentQuotedOrderList[row.index];
      currentQuotedOrder.readyToView = false;
      this.setQuotedOrderList(currentQuotedOrderList);
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
  },
};
</script>

<style lang="scss">
.dialog_quoted {
  z-index: 5;

  .el-dialog {
    height: 462px;
    margin-top: 60px !important;

    .el-table::before {
      height: 0px;
    }

    .quoted-word {
      .cell {
        font-size: 14px;
        color: #303233;
      }
    }

    .quoted-time {
      .cell {
        font-size: 12px;
        color: #616366;
      }
    }

    .look-quoted {
      .cell {
        font-size: 12px;
        color: #ff6700;
        text-align: right;
        cursor: pointer;

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
    }
  }

  .el-dialog__body {
    height: calc(462px - 50px - 20px);
    overflow: hidden;
  }
}

/deep/.dialog_quoted .el-dialog__header .el-dialog__title {
  font-size: 16px;
  color: #303233;
  line-height: 16px;
}
</style>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 16px;
  color: #303233;
  line-height: 16px;
}

/deep/.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #919599;
}

.dialog_quoted .dialog-content {
  height: calc(462px - 50px);
  overflow-y: auto;

  .quoted-table {
    padding: 0 20px 20px;
  }
}
</style>
