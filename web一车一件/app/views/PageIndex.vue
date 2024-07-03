<template>
  <div :class="{ 'is-ie': isIE }">
    <router-view />
    <el-dialog :modal-append-to-body="false" :visible.sync="error" width="850" class="dialog-error">
      <ul>
        <li>查询失败，请检查网络后重试</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ok" @click="error = false">确定</button>
      </span>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="ssoError"
      :before-close="logout"
      width="850"
      class="dialog-error"
    >
      <ul>
        <li>您的账号在另一台设备上登录了一车一件。</li>
        <li>如需在本设备上使用，请重新登录。</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ok" @click="logout">确定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { mapMutations, mapActions, mapState } from 'vuex';

import { logout } from '../api';
import { point_types } from '../config/constant';
import { getIEVersion } from '../utils/browser';
import growingIO from '../thirdparty/gio';
import sobot from '../thirdparty/sobot';

export default {
  computed: {
    ...mapState('partsList', ['countReadyToView', 'isFirstHistoryList', 'isFirstShareList']),
    error: {
      get() {
        return this.$store.state.error;
      },
      set(value) {
        this.setError(value);
      },
    },
    ssoError: {
      get() {
        return this.$store.state.ssoError;
      },
      set(value) {
        this.setSsoError(value);
      },
    },
    isIE() {
      const ieVersion = getIEVersion();
      return ieVersion !== -1 && ieVersion < 12;
    },
  },
  watch: {
    '$route.path'() {
      this.addPointByType({
        type: point_types.LOGIN,
      });
    },
  },
  created() {
    const auth = Cookies.getJSON('auth');
    if (auth) {
      growingIO.login();
      sobot.init();
      this.setAccount(auth.phoneNumber);
      this.setUserName(auth.userName);
      this.setUID(auth.uid);
      this.setBusinessId(auth.businessId);
      this.setUserAuthStatus(auth.userAuthStatus);
      this.setCompanyType(auth.companyType);
      this.setInviteCode(auth.inviteCode);
      this.setRegisterType(auth.registerType);
      console.log('auth.registerType', auth.registerType);
      console.log('auth.companyType', auth.companyType);
    } else {
      return this.logout();
    }
    this.addPointByType({
      type: point_types.LOGIN,
    });
    this.countPart({});
    // 设置历史清单是否是第一次进入
    console.log('this.isFirstHistoryList', this.isFirstHistoryList);
    if (this.isFirstHistoryList === null) {
      localStorage.setItem('isFirstHistoryList', true);
      this.setIsFirstHistoryList(true);
    }
    // 设置 '分享给他人' 按钮 是否第一次点击过着关闭
    console.log('this.isFirstShareList', this.isFirstShareList);
    if (this.isFirstShareList === null) {
      localStorage.setItem('isFirstShareList', true);
      this.setIsFirstShareList(true);
    }
    // 获取待查看的报价单个数（小红点）
    this.getCountReadyToView({
      params:{},
      success: value => {
        console.log('value', value);
      },
    });
  },
  methods: {
    ...mapMutations(['setError', 'setSsoError']),
    ...mapMutations('partsList', ['setIsFirstHistoryList', 'setIsFirstShareList']),
    ...mapMutations('user', ['setAccount', 'setUserName', 'setUID', 'setBusinessId', 'setUserAuthStatus', 'setCompanyType', 'setInviteCode', 'setRegisterType']),
    ...mapActions('partsList', ['countPart', 'getCountReadyToView']),
    ...mapActions('user', ['addPointByType']),
    logout,
  },
};
</script>

<style lang="scss">
@import 'public.scss';
</style>

<style lang="scss" scoped>
.btn-ok {
  height: 48px;
  width: 120px;
  color: #fff;
  background-color: #ff6700;
  box-shadow: 0 3px 6px rgba(255, 72, 0, 0.5);

  &:not([disabled]):hover {
    background-color: #f25d00;
  }
}
</style>
