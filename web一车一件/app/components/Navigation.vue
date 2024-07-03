<template>
  <nav :class="{ 'overflow-visible' : sdileComplete }">
    <ul :class="{ 'is-slide' : slide }">
      <li>
        <div class="info" @click="handleGoHome">
          <logo class="info_logo" />
          <span class="info_title">一车一件</span>
        </div>
        <user-dropdown v-if="showUserCenter" />
        <div class="part_list" @click="goPartsList">
          <span style="margin-right:10px;">
            <i class="icon_list" />
            <span v-if="countReadyToView>0" class="dot" />
            <span v-if="isFirstHistoryList&&countReadyToView===0" class="new" />
          </span>
          <span>配件清单</span>
          <span class="list_total">{{ partsListTotal }}</span>
        </div>
        <div class="pay-button" @click="goPay">付费升级</div>
      </li>
      <li v-if="showVehicleInfo">
        <vehicle-info @research="handleUp" />
      </li>
      <li v-else-if="showOeSearchInput">
        <search-input
          ref="input"
          v-model="oe"
          placeholder="请输入OE号"
          example-type="oe"
          history-name="home-oe"
          @search="handleSearch"
          @select="handleSelect"
        />
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import Logo from './Logo.vue';
import SearchInput from './SearchInput.vue';
import UserDropdown from './UserDropdown.vue';
import VehicleInfo from './VehicleInfo.vue';

import { router_names } from '../config/constant';

export default {
  components: {
    Logo,
    SearchInput,
    UserDropdown,
    VehicleInfo,
  },
  props: {
    showUserCenter: {
      type: Boolean,
      required: false,
      default: true,
    },
    showVehicleInfo: Boolean,
    showOeSearchInput: Boolean,
  },
  data: () => ({
    slide: false,
    sdileComplete: false,
    tid: null,
  }),
  computed: {
    oe: {
      set(value = '') {
        this.$store.commit('oeQuery/setOE', value);
      },
      get() {
        return this.$store.state.oeQuery.oe;
      },
    },
    ...mapState('partsList', ['partsListTotal', 'countReadyToView', 'isFirstHistoryList']),
  },
  beforeDestroy() {
    this.cancelRequest();
  },
  methods: {
    ...mapActions('oeQuery', ['queryPartsByOe', 'clearResult', 'cancelRequest']),
    ...mapMutations(['setShowDialog']),
    handleGoHome() {
      this.setShowDialog(false);
      if (this.$route.name === router_names.HOME) {
        return;
      }

      this.$router.push({ name: router_names.HOME });
    },
    handleDown() {
      if (this.tid) {
        clearTimeout(this.tid);
      }

      this.slide = true;

      if (!this.sdileComplete) {
        this.tid = setTimeout(() => {
          this.sdileComplete = true;
        }, 500);
      }
    },
    handleUp() {
      if (this.tid) {
        clearTimeout(this.tid);
      }

      this.sdileComplete = false;
      this.slide = false;

      if (this.$refs.input) {
        this.$refs.input.blur();
      }
    },
    handleSearch() {
      if (this.oe) {
        this.queryPartsByOe(() => this.$refs.input.updateHistory());
      } else {
        this.clearResult();
      }
    },
    handleSelect() {
      this.queryPartsByOe(() => this.$refs.input.updateHistory());
    },
    goPartsList() {
      open('#/parts-list');
      // this.$router.push({ name: router_names.PARTSLIST });
    },
    goPay() {
      this.$router.push({ name: router_names.PAY });
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: relative;
  z-index: 999;
  height: 60px;
  padding: 0 30px 0 50px;
  background: #fff;
  box-shadow: rgba($color: #000, $alpha: 0.1) 0 3px 6px;
  overflow: hidden;

  @media (max-width: 1279px) {
    padding: 0 0 0 20px;
  }

  &.overflow-visible {
    overflow: visible;
  }

  ul {
    height: 100%;
    transition: 0.5s;

    &.is-slide {
      transform: translateY(-100%);
    }
  }

  li {
    height: 100%;

    .vehicle-info {
      height: 100%;
      padding: 0;
    }
    .part_list{
      height: 100%;
      font-size: 0;
      float:right;
      position: relative;
      span{
        display: inline-block;
        height:100%;
        vertical-align: middle;
        line-height: 60px;
        font-size: 14px;
      }
      .dot {
        display: inline-block;
        width:6px;
        height:6px;
        background-color: #FF2020;
        border-radius: 50%;
        vertical-align: middle;
        margin-bottom: 25px;
      }
      .icon_list{
        font-size: 14px;
        width:24px;
        height: 24px;
        display: inline-block;
        background-image: url('../images/icon_list@2x.png');
        background-size: contain;
        vertical-align: middle;
      }
      .new {
        display: inline-block;
        width:28px;
        height:14px;
        background-image: url('../images/icon_new@2x.png');
        background-size: cover;
        position: absolute;
        top:11px;
        left:5px;
      }
      .list_total{
        color:#FF6700;
        margin-left:5px;
      }
    }
    .part_list:hover{
      cursor: pointer;
      color:#FF6700;
      .icon_list{
        background-image: url('../images/icon_list_hover@2x.png');
      }
    }
    .pay-button{
      height: 32px;
      cursor: pointer;
      line-height: 32px;
      width:100px;
      margin:0 auto;
      float:right;
      text-align: center;
      background-color: #FF6700;
      margin-top:14px;
      margin-right:30px;
      border-radius: 4px;
      color:#fff;
    }
    .pay:hover{
      cursor: pointer;
    }
  }
}

.info {
  float: left;
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;

  .info_logo {
    height: 40px;
    width: 40px;
    border-radius: 8px;
    margin-right: 10px;
  }

  .info_title {
    color: $--color-title;
    font-size: 18px;
    line-height: 1;
  }
}

.search-input {
  padding: 10px 20px 10px 0;
  margin: 0;
  box-shadow: none;

  /deep/.input .input__inner {
    border-width: 1px;
    height: 40px;
  }

  /deep/.btn-search {
    height: 40px;
  }
}

.user-dropdown {
  float: right;
}
</style>
