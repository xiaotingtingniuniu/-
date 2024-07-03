<template>
  <el-dialog :modal-append-to-body="false" :append-to-body="false" :visible.sync="show" :before-close="handleClose" width="640px" class="dialog-user-center">
    <div slot="title" class="dialog__header">
      <span class="dialog__title">积分明细</span>
    </div>
    <div class="wrapper" @scroll="handleScroll">
      <ul v-if="pointHistory && pointHistory.length" class="point-history_items">
        <li v-for="(item, index) in pointHistory" :key="index" class="point-history_item">
          <div class="date">{{ item.date }}</div>
          <div v-for="(detail, subIndex) in item.details" :key="subIndex" class="content">
            <div class="desc">
              <span class="remark">{{ detail.remarks }}</span>
              <span class="pt">{{ `${detail.type ? '-' : '+'}${detail.value}积分` }}</span>
            </div>
            <div class="time">{{ detail.time }}</div>
          </div>
        </li>
      </ul>
      <div v-else-if="!loadingNextPage" class="empty">
        <span>暂无积分明细</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import { mapState } from 'vuex';

import { getUserPointHistory } from '../api/user';
import { getFormattedDate, getHourMinute, formatDateStr } from '../utils/date';

const PAGE_COUNT = 20;

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    originalPointHistory: [],
    pointHistory: [],
    lastCreateTime: '',
    isLastPage: false,
    loadingNextPage: true,
    ctSource: null,
  }),
  computed: {
    ...mapState('user', ['uid']),
    couldLoadNextPage() {
      return !this.isLastPage && !this.loadingNextPage;
    },
  },
  watch: {
    show(to) {
      if (!to) {
        return;
      }

      this.getUserPointHistory();
    },
  },
  beforeDestroy() {
    this.cancelRequest();
  },
  methods: {
    cancelRequest() {
      if (this.ctSource) {
        this.ctSource.cancel('Request canceled');
        this.ctSource = null;
      }
    },
    handleClose() {
      this.$emit('update:show', false);

      this.originalPointHistory = [];
      this.pointHistory = [];
      this.lastCreateTime = '';
      this.isLastPage = false;
      this.loadingNextPage = true;
    },
    handleScroll: _.debounce(function (ev) {
      if (!this.couldLoadNextPage) {
        return;
      }

      const { target } = ev;
      if (target.scrollTop / (target.scrollHeight - target.offsetHeight) > 0.9) {
        this.getUserPointHistory();
      }
    }, 150),
    getUserPointHistory() {
      this.loadingNextPage = true;

      const ctSource = axios.CancelToken.source();
      this.ctSource = ctSource;

      getUserPointHistory(
        {
          userId: this.uid,
          pageCount: PAGE_COUNT,
          queryTime: this.lastCreateTime || new Date(),
        },
        {
          cancelToken: ctSource.token,
        },
      )
        .then(response => {
          const { data } = response.data;
          this.updatePointHistory(data || []);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loadingNextPage = false;
        });
    },
    updatePointHistory(pointHistory) {
      const newPointHistory = new Map();
      let lastCreateTime = '';

      this.isLastPage = !pointHistory || pointHistory.length < PAGE_COUNT;

      this.originalPointHistory = this.originalPointHistory.concat(pointHistory);

      for (const item of this.originalPointHistory) {
        lastCreateTime = new Date(formatDateStr(item.createTime));

        const date = getFormattedDate(lastCreateTime.getTime());
        const time = getHourMinute(lastCreateTime.getTime());

        if (!newPointHistory.has(date)) {
          newPointHistory.set(date, {
            date,
            details: [],
          });
        }

        const history = newPointHistory.get(date);
        const { remarks, updateInteg, updateType } = item;
        history.details.push({
          time,
          remarks,
          value: updateInteg,
          type: updateType,
        });
      }

      this.pointHistory = [...newPointHistory.values()];
      this.lastCreateTime = lastCreateTime;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-user-center /deep/.el-dialog__body {
  height: 366px;
  padding: 5px 5px 25px 5px;
}

.wrapper {
  height: 100%;
  overflow-y: auto;
}

ul {
  padding: 0 25px;
  overflow: hidden;

  li {
    margin: 5px 0;

    .date {
      margin-bottom: 4px;
      color: #303233;
      font-size: 14px;
      line-height: 2;
    }

    .content {
      display: flex;
      justify-content: space-between;
    }

    .desc {
      padding-left: 15px;
      border-left: 1px solid #fff6f0;
      margin-left: 15px;
      position: relative;

      &::before {
        content: '';
        height: 5px;
        width: 5px;
        border-radius: 5px;
        border: 1px solid #ffc59e;
        @include border-one-px;
        background: #ffe5d4;
        position: absolute;
        left: -4px;
        top: 17px;
      }
    }

    .remark {
      color: #303233;
      font-size: 14px;
      line-height: 40px;
    }

    .pt {
      color: #00002a;
      font-size: 14px;
      line-height: 40px;
    }

    .time {
      text-align: right;
      color: #aaaeb3;
      font-size: 14px;
      line-height: 40px;
    }
  }
}

.empty {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #616366;
  font-size: 14px;
}
</style>
