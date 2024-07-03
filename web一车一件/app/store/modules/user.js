import axios from 'axios';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { response_code } from '../../config/constant';
import axios1 from '../../api/http/default';
import { getUserCenterInfo, addPointByType, queryInviteCode } from '../../api/user';
import API from '../../api/login';
const state = {
  userName: '',
  uid: '',
  account: '',
  businessId: '',
  derogationList: [],
  totalDerogation: 0,
  sevenDayDerogation: 0,
  totalPoint: 0,
  medalList: [],
  ctSource: null,
  userAuthStatus: '', // 用户审核状态 （1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
  companyType: '', // 账户所在企业类型 1保险公司，2修理厂，3配件制造或经销
  inviteCode: '...', // 邀请码
  inviteTodo: '', // 没有邀请码的时候显示 "获取"  有邀请码的时候显示 "复制"
  registerType: '', // 注册类型，1是B2B，2是自注册
};

const getters = {
  pointAndDerogation: state => [
    {
      name: 'point',
      sum: state.totalPoint,
      label: '当前积分',
      extra: '积分明细',
    },
    {
      name: 'derogation',
      sum: state.totalDerogation,
      label: '当前减损总额(元)',
      extra: '',
    },
    {
      name: 'inviteCode',
      sum: state.inviteCode,
      label: '我的邀请码',
      extra: state.inviteTodo,
    },
  ],
  loadingUserCenterInfo: state => Boolean(state.ctSource),
};

const actions = {
  getUserCenterInfo({ state, commit }) {
    if (state.ctSource) {
      state.ctSource.cancel('Request canceled');
    }

    const ctSource = axios.CancelToken.source();
    commit('setCtSource', ctSource);

    getUserCenterInfo({
      cancelToken: ctSource.token,
    })
      .then(response => {
        const integral = response.data.integral?response.data.integral:'0';
        const { totalDerogationAmount, sevenDayDerogationAmount, derogationList, medalList } = response.data;

        commit('setUserCenterInfo', {
          totalPoint: integral,
          totalDerogation: totalDerogationAmount,
          sevenDayDerogation: sevenDayDerogationAmount,
          derogationList,
          medalList,
        });
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          return;
        }

        console.error(error);
      })
      .finally(() => {
        commit('setCtSource', null);
      });
  },
  addPointByType({ commit, dispatch }, { type, vinCode, partNumber }) {
    addPointByType({
      type,
      vinCode,
      partNumber,
    })
      .then(response => {
        const { toastMessage } = response.data;
        console.log('toastMessage', toastMessage);
        if (toastMessage === '完善个人信息') {
          commit('updateTotalPoint', 50);
        } else {
          dispatch('getUserCenterInfo');
        }
      })
      .catch(error => {
        console.error(error);
      });
  },
  getInviteCode({ commit, state }) {
    console.log('commit', commit);
    console.log('state', state);
    queryInviteCode()
      .then(res => {
        if (res.data.code === response_code.SUCCESS) {
          commit('setInviteCode', res.data.data);
          const auth = Cookies.getJSON('auth');
          auth.inviteCode = res.data.data;
          Cookies.set('auth', JSON.stringify(auth));
          commit('setInviteTodo', '复制');
          return;
        } else {
          commit('setInviteCode', '...');
          if (!axios1.isCancel(res.data.toastMessage)) {
            commit('setError', true, { root: true });
          }
        }
      })
      .catch(error => {
        console.error('error', error);
      });
  },
    /**
   * 获取省市区信息
   * @param {*}
   * @param {*}
   */
  getAllAreaInfo({ state }, success) {
    if (state.errorType) {
      return;
    }
    let localDataVersion;
    if (localStorage.getItem('areaInfor')) {
      localDataVersion = JSON.parse(localStorage.getItem('areaInfor')).dataVersion;
      console.log('localDataVersion', localDataVersion);
    } else {
      localDataVersion = 0;
    }
    API.getAllAreaInfo({ dataVersion: localDataVersion }).then(res => {
      console.log('res', res);
      const { data } = res;
      switch (data.code) {
        case response_code.SUCCESS: {
            const { areaList, upToDate, dataVersion } = data.data;
            const localAreaInfor = JSON.parse(localStorage.getItem('areaInfor'));
            if (localAreaInfor) {
              // 存在 省市区信息 缓存
              if (!upToDate) {
                console.log('更新');
                const areaInfor = {
                  areaList: areaList,
                  dataVersion: dataVersion,
                };
                localStorage.setItem('areaInfor', JSON.stringify(areaInfor));
              } else {
                console.log('不许要更新');
              }
            } else {
              // 不存在 省市区信息 缓存
              const areaInfor = {
                areaList: areaList,
                dataVersion: dataVersion,
              };
              localStorage.setItem('areaInfor', JSON.stringify(areaInfor));
            }
            success(JSON.parse(localStorage.getItem('areaInfor')));
            break;
        }
      }
    }).catch(err => {
      console.log('err', err);
    });
  },
};

const mutations = {
  setUserName(state, userName) {
    state.userName = userName;
  },
  setUID(state, uid) {
    state.uid = uid;
  },
  /**
   * 设置用户审核状态
   * @param {*} state 状态
   * @param {*} userAuthStatus 用户审核状态（1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
   */
  setUserAuthStatus(state, userAuthStatus) {
    state.userAuthStatus = userAuthStatus;
  },
  /**
   * 设置账户所在企业类型
   * @param {*} state 状态
   * @param {*} companyType 1保险公司，2修理厂，3配件制造或经销
   */
  setCompanyType(state, companyType) {
    state.companyType = companyType;
  },
  /**
   * 设置邀请码
   * @param {*} state 状态
   * @param {*} inviteCode 邀请码（自己的）
   */
  setInviteCode(state, inviteCode) {
    state.inviteCode = inviteCode;
  },
  /**
   * 设置邀请码 下面的操作
   * @param {*} state 状态
   * @param {*} inviteCodeWord 邀请码文字
   */
  setInviteTodo(state, inviteTodo) {
    state.inviteTodo = inviteTodo;
  },
  /**
   * 设置 注册类型
   * @param {*} state 状态
   * @param {*} registerType  注册类型，1是B2B，2是自注册
   */
  setRegisterType(state, registerType) {
    state.registerType = registerType;
  },
  setAccount(state, account) {
    state.account = account;
  },
  setBusinessId(state, businessId) {
    state.businessId = businessId;
  },
  setUserCenterInfo(state, { totalPoint, totalDerogation, sevenDayDerogation, derogationList, medalList }) {
    state.totalPoint = +totalPoint;
    state.totalDerogation = +totalDerogation;
    state.sevenDayDerogation = +sevenDayDerogation;

    state.derogationList = (derogationList || []).map(item => ({
      name: item.createTime,
      value: [item.createTime.replace(/-/g, '/'), +item.derogationAmount],
    }));

    state.medalList = _.orderBy(
      (medalList || []).map(item => ({
        id: item.id,
        name: item.medalName,
        url: item.isLightUp ? item.medalImageUrlOpen : item.medalImageUrlClose,
        awarded: !!item.isLightUp,
      })),
      ['id'],
      ['asc'],
    );
  },
  updateTotalPoint(state, value) {
    state.totalPoint += value;
  },
  setCtSource(state, value) {
    state.ctSource = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
