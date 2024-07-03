import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import Cookies from 'js-cookie';
import API from '../api/login';
import { response_code, point_types } from '../config/constant';
import { addPointByType } from '../api/user';
import getParams from '../utils/get-params';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

/** 手机号错误 */
const ERROR_TYPE_PHONENUMBER = 'phoneNumber';

/** 验证码错误 */
const ERROR_TYPE_CODE = 'code';

/** 昵称填写错误 */
const ERROR_TYPE_NICKNAME = 'nickName';

/** 未勾选 */
const ERROR_TYPE_NOTAGREEMENT = 'agreement';

/** 未选择行业及岗位 */
const ERROR_TYPE_ROLEID = 'roleId';

/** 未选择工作所在地*/
const ERROR_TYPE_ADDRESS = 'address';

/** 网络错误 */
const ERROR_TYPE_NETWORK = 'network';

/** 弱网 */
const ERROR_TYPE_SLOW = 'slow';

/** 其他错误 */
const ERROR_TYPE_OTHER = 'other';

const store = new Vuex.Store({
  state: {
    phoneNumber: '', // 登录手机号
    code: '', // 登录验证码
    registerPhoneNumber: '', // 注册手机号
    registerCode: '', // 注册验证码
    registerNickName: '', // 昵称 (昵称为4-16个字符，仅支持中英文或数字)
    errorMsg: '',
    errorType: '',
    messageId: '',
    isCheckedAgreement: false, // 是否选中已阅读协议 默认为不选中
    isPerfect: false, // 是否展示完善信息页面
    invitationCode: '', //  邀请码
    areaInfor: {}, // 省市区信息
    registerCount: 0, // 记录注册按钮点击次数
  },
  actions: {
    getVerificationCode({ commit, state }, { isVoice, onSuccess, onError }) {
      commit('validate');

      if (state.errorType) {
        return;
      }

      commit('setSlowNetworkMessage');

      if (_.isFunction(onSuccess)) {
        onSuccess();
      }

      const getCodeAPI = isVoice ? API.getVoiceCode : API.getMessageCode;

      getCodeAPI({
        phoneNum: state.phoneNumber,
      })
        .then(res => {
          commit('clearSlowNetworkMessage');
          switch (res.data.code) {
            case response_code.SUCCESS:
              break;
            case '8000004':
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_PHONENUMBER,
                errorMsg: '此账号无权限登录',
              });
              onError();
              break;
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: res.data.toastMessage,
              });
          }
        })
        .catch(() => {
          commit('clearSlowNetworkMessage');
          commit('updateErrorInfo', {
            errorType: ERROR_TYPE_SLOW,
            errorMsg: '网络错误，请检查网络后重试',
          });
        });
    },
    getRegisterCodeMessage({ commit, state }, { onSuccess }) {
      commit('validateRegister');

      if (state.errorType) {
        return;
      }
      commit('setSlowNetworkMessage');
      if (_.isFunction(onSuccess)) {
        onSuccess();
      }
      API.getRegisterMessageCode({ phoneNum: state.registerPhoneNumber })
        .then(res => {
          commit('clearSlowNetworkMessage');
          console.log('res', res);
          switch (res.data.code) {
            case response_code.SUCCESS:
              break;
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: res.data.toastMessage,
              });
          }
        })
        .catch(() => {
          commit('clearSlowNetworkMessage');
          commit('updateErrorInfo', {
            errorType: ERROR_TYPE_SLOW,
            errorMsg: '网络错误，请检查网络后重试',
          });
        });
    },
    login({ commit, state }) {
      commit('validate', true);

      if (state.errorType) {
        return;
      }

      commit('setSlowNetworkMessage');
      const receipt = getParams('receipt');
      const type = getParams('type');
      console.log('receipt', receipt);
      API.login({
        phoneNumber: state.phoneNumber,
        verificationCode: state.code,
      })
        .then(res => {
          commit('clearSlowNetworkMessage');

          const { data } = res;

          switch (data.code) {
            case response_code.SUCCESS: {
              const content = res.data.data.content;
              const auth = {
                token: content.accessToken, // 票据
                uid: data.data.mjUserId, // 用户id
                businessId: data.data.businessId, // 用户所在企业ID
                userName: data.data.nickname, // 用户名
                phoneNumber: data.data.phoneNumber, // 登录手机号
                company: data.data.company, // 所在分组（传给GroingIO使用）
                registerType: data.data.registerType, // 注册类型，1是B2B，2是自注册
                roleName: data.data.roleName, // 职位
                userAuthStatus: data.data.userAuthStatus, // 用户审核状态（1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
                companyType: data.data.companyType, // 账户所在企业类型，1保险公司，2修理厂，3配件制造或经销
                inviteCode: data.data.inviteCode, // 邀请码
                sex: data.data.sex, // 1为男，0为女
                birthday: data.data.birthday, // 生日
                province: data.data.province, // 省
                city: data.data.city, // 市
                district: data.data.district, // 区
                expiresIn: content.expiresIn, // cookie 存储时间
              };
              console.log('auth', auth);
              Cookies.set('auth', JSON.stringify(auth), { expires: content.expiresIn ? content.expiresIn / 60 / 60 / 24 : 7 });
              console.log('auth', Cookies.getJSON('auth'));

              const { origin, pathname } = document.location;
              if (receipt) {
                if (type === '2' || type === '3') {
                  window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${receipt}&type=${type}#/quoted`;
                } else {
                  window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${receipt}`;
                }
              } else {
                window.location.replace('index.html');
              }
              break;
            }
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: data.toastMessage,
              });
          }
        })
        .catch(() => {
          commit('clearSlowNetworkMessage');
          commit('updateErrorInfo', {
            errorType: ERROR_TYPE_NETWORK,
            errorMsg: '网络错误，请检查网络后重试',
          });
        });
    },
    goRegister({ commit, state }) {
      commit('validateRegister', true);
      if (state.errorType) {
        return;
      }
      commit('setSlowNetworkMessage');
      const receipt = getParams('receipt');
      if (state.registerCount === 0) {
        commit('setRegisterCount', 1);
        API.register({
          phoneNumber: state.registerPhoneNumber,
          verificationCode: state.registerCode,
          nickname: state.registerNickName,
        }).then(res => {
          commit('clearSlowNetworkMessage');
          const { data } = res;
          switch (data.code) {
            case response_code.SUCCESS:
              {
                const content = res.data.data.content;
                const auth = {
                  token: content.accessToken, // 票据
                  uid: data.data.mjUserId, // 用户id
                  businessId: data.data.businessId, // 用户所在企业ID
                  userName: data.data.nickname, // 用户名
                  phoneNumber: data.data.phoneNumber, // 登录手机号
                  company: data.data.company, // 所在分组（传给GroingIO使用）
                  registerType: data.data.registerType, // 注册类型，1是B2B，2是自注册
                  roleName: data.data.roleName, // 职位
                  userAuthStatus: data.data.userAuthStatus, // 用户审核状态（1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
                  companyType: data.data.companyType, // 账户所在企业类型，1保险公司，2修理厂，3配件制造或经销
                  inviteCode: data.data.inviteCode, // 邀请码
                  sex: data.data.sex, // 1为男，0为女
                  birthday: data.data.birthday, // 生日
                  province: data.data.province, // 省
                  city: data.data.city, // 市
                  district: data.data.district, // 区
                };
                console.log('auth', auth);
                Cookies.set('auth', JSON.stringify(auth), { expires: content.expiresIn ? content.expiresIn / 60 / 60 / 24 : 7 });
                if (data.data.registerType === '2' && data.data.roleName.length < 1) {
                  // 进入到完善信息页面
                  // console.log('进入到完善信息页面');
                  commit('setIsPerfect', true);
                  if (receipt) {
                    window.location.replace('login.html?receipt=' + receipt);
                  } else {
                    window.location.replace('login.html');
                  }
                }
              }
              break;
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: data.toastMessage,
              });
          }
        });
        setTimeout(() => {
          commit('setRegisterCount', 0);
        }, 3000);
      }
    },
    /**
     * 获取角色信息
     */
    getRole({ commit, state }, success) {
      if (state.errorType) {
        return;
      }
      commit('setSlowNetworkMessage');
      API.getUserRole()
        .then(res => {
          commit('clearSlowNetworkMessage');
          console.log('res', res);
          const { data } = res;
          switch (data.code) {
            case response_code.SUCCESS: {
              success(data.data);
              break;
            }
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: data.toastMessage,
              });
          }
        })
        .catch(() => {
          commit('clearSlowNetworkMessage');
          commit('updateErrorInfo', {
            errorType: ERROR_TYPE_NETWORK,
            errorMsg: '网络错误，请检查网络后重试',
          });
        });
    },
    /**
     * 获取省市区信息
     * @param {*}
     * @param {*}
     */
    getAllAreaInfo({ commit, state }, success) {
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
      API.getAllAreaInfo({ dataVersion: localDataVersion })
        .then(res => {
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
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: data.toastMessage,
              });
          }
        })
        .catch(err => {
          console.log('err', err);
          commit('clearSlowNetworkMessage');
          commit('updateErrorInfo', {
            errorType: ERROR_TYPE_NETWORK,
            errorMsg: '网络错误，请检查网络后重试',
          });
        });
    },
    /**
     * 完善个人信息
     */
    toPerfectUserInfo({ commit, state }, params) {
      commit('validatePerfect', params);
      if (state.errorType) {
        return;
      }
      commit('setSlowNetworkMessage');
      const receipt = getParams('receipt');
      API.perfectUserInfo({
        address: params.address,
        inviteCode: params.invitationCode,
        roleId: params.roleId,
      })
        .then(res => {
          commit('clearSlowNetworkMessage');
          console.log('res', res);
          const { data } = res;
          switch (data.code) {
            case response_code.SUCCESS: {
              const content = res.data.data.content;
              const auth = {
                token: content.accessToken, // 票据
                uid: data.data.mjUserId, // 用户id
                businessId: data.data.businessId, // 用户所在企业ID
                userName: data.data.nickname, // 用户名
                phoneNumber: data.data.phoneNumber, // 登录手机号
                company: data.data.company, // 所在分组（传给GroingIO使用）
                registerType: data.data.registerType, // 注册类型，1是B2B，2是自注册
                roleName: data.data.roleName, // 职位
                userAuthStatus: data.data.userAuthStatus, // 用户审核状态（1- 未认证，2 - 认证中，3 - 认证失败，4 - 认证成功）
                companyType: data.data.companyType, // 账户所在企业类型，1保险公司，2修理厂，3配件制造或经销
                inviteCode: data.data.inviteCode, // 邀请码
                sex: data.data.sex, // 1为男，0为女
                birthday: data.data.birthday, // 生日
                province: data.data.province, // 省
                city: data.data.city, // 市
                district: data.data.district, // 区
              };
              console.log('auth', auth);
              Cookies.set('auth', JSON.stringify(auth), { expires: content.expiresIn ? content.expiresIn / 60 / 60 / 24 : 7 });
              console.log('auth', Cookies.get('auth'));
              addPointByType({ type: point_types.USER_INFO });
              console.log('跳转');
              if (receipt) {
                const { origin, pathname } = document.location;
                window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${receipt}`;
              } else {
                window.location.replace('index.html');
              }
              break;
            }
            default:
              commit('updateErrorInfo', {
                errorType: ERROR_TYPE_OTHER,
                errorMsg: data.toastMessage,
              });
          }
        })
        .catch(() => {
          commit('clearSlowNetworkMessage');
          commit('updateErrorInfo', {
            errorType: ERROR_TYPE_NETWORK,
            errorMsg: '网络错误，请检查网络后重试',
          });
        });
    },
    /**
     * 根据code类型查询增加积分
     */
    addPointByType({ commit, state }, type) {
      if (state.errorType) {
        return;
      }
      commit('setSlowNetworkMessage');
      addPointByType({ type }).then(res => {
        commit('clearSlowNetworkMessage');
        console.log('res', res);
        const { data } = res;
        switch (data.code) {
          case response_code.SUCCESS: {
            break;
          }
        }
      });
    },
  },
  mutations: {
    setErrorMsg(state, errorMsg) {
      state.errorMsg = errorMsg;
    },
    setErrorType(state, errorMsg) {
      state.errorMsg = errorMsg;
    },
    setPhoneNumber(state, phoneNumber) {
      state.phoneNumber = phoneNumber;
    },
    setCode(state, code) {
      state.code = code;
    },
    setRegisterPhoneNumber(state, registerPhoneNumber) {
      state.registerPhoneNumber = registerPhoneNumber;
    },
    setRegisterCode(state, registerCode) {
      state.registerCode = registerCode;
    },
    setRegisterNickName(state, registerNickName) {
      state.registerNickName = registerNickName;
    },
    /**
     * 设置注册按钮点击次数
     */
    setRegisterCount(state, registerCount) {
      state.registerCount = registerCount;
    },
    /**
     * 设置邀请码
     * @param {*} state 状态
     * @param {*} invitationCode 邀请码
     */
    setInvitationCode(state, invitationCode) {
      state.invitationCode = invitationCode;
    },
    /**
     * 设置省市区域信息
     * @param {*} state 状态
     * @param {*} areaInfor 省市区信息
     */
    setAreaInfor(state, areaInfor) {
      state.areaInfor = areaInfor;
    },
    updateErrorInfo(state, { errorType, errorMsg }) {
      state.errorType = errorType;
      state.errorMsg = errorMsg;
    },
    /**
     * 检测登录页面的手机号以及验证码
     * @param {*} state 状态
     */
    validate(state, validateCode = false) {
      console.log('state', state);
      console.log('validateCode', validateCode);
      state.errorMsg = '';
      state.errorType = '';

      // 未输入手机号
      if (!state.phoneNumber) {
        state.errorMsg = '请输入手机号';
        state.errorType = ERROR_TYPE_PHONENUMBER;
        return;
      }

      // 手机号位数不足
      if (!/^\d{11}$/.test(state.phoneNumber)) {
        state.errorMsg = '请输入正确的手机号';
        state.errorType = ERROR_TYPE_PHONENUMBER;
        return;
      }

      // 未输入验证码
      if (validateCode && !state.code) {
        state.errorMsg = '请输入验证码';
        state.errorType = ERROR_TYPE_CODE;
        return;
      }
    },
    /**
     * 检测注册页面的手机号以及验证码
     * @param {*} state 状态
     */
    validateRegister(state, validateCode = false) {
      console.log('state', state);
      console.log('validateCode', validateCode);
      state.errorMsg = '';
      state.errorType = '';

      // 未输入手机号
      if (!state.registerPhoneNumber) {
        state.errorMsg = '请输入手机号';
        state.errorType = ERROR_TYPE_PHONENUMBER;
        return;
      }

      // 手机号位数不足
      if (!/^\d{11}$/.test(state.registerPhoneNumber)) {
        state.errorMsg = '请输入正确的手机号';
        state.errorType = ERROR_TYPE_PHONENUMBER;
        return;
      }

      // 未输入验证码
      if (validateCode && !state.registerCode) {
        state.errorMsg = '请输入验证码';
        state.errorType = ERROR_TYPE_CODE;
        return;
      }
      // 姓名校验
      if (!state.registerNickName && validateCode) {
        state.errorMsg = '请填写真实姓名';
        state.errorType = ERROR_TYPE_NICKNAME;
        return;
      } else if (!/^[\u4e00-\u9fa5]+$/.test(state.registerNickName) && validateCode) {
        state.errorMsg = '姓名仅支持中文，请修改';
        state.errorType = ERROR_TYPE_NICKNAME;
        return;
      }
      // 验证是否勾选我已阅读
      // console.log('state.isCheckedAgreement', state.isCheckedAgreement);
      if (!state.isCheckedAgreement && validateCode) {
        state.errorMsg = '请勾选注册服务协议';
        state.errorType = ERROR_TYPE_NOTAGREEMENT;
        return;
      }
    },

    /**
     * 检测完善信息页面的 行业/岗位与工作所在地是否填写
     */
    validatePerfect(state, params) {
      console.log('params', params);
      console.log('state', state);
      state.errorMsg = '';
      state.errorType = '';
      if (!params.roleId) {
        state.errorMsg = '请选择行业及岗位';
        state.errorType = ERROR_TYPE_ROLEID;
        return;
      }
      if (!params.address.province) {
        state.errorMsg = '请选择工作所在地';
        state.errorType = ERROR_TYPE_ADDRESS;
        return;
      }
    },
    /**
     * 设置勾选状态
     * @param {*} state 状态
     */
    setIsCheckedAgreement(state, isCheckedAgreement) {
      state.isCheckedAgreement = isCheckedAgreement;
    },

    /**
     * 设置完善信息页面状态
     * @param {*} state 状态
     */
    setIsPerfect(state, isPerfect) {
      state.isPerfect = isPerfect;
    },
    setSlowNetworkMessage(state) {
      state.messageId = setTimeout(() => {
        state.errorType = ERROR_TYPE_NETWORK;
        state.errorMsg = '网速不太给力，请检查网络';
      }, 10e3);
    },
    clearSlowNetworkMessage(state) {
      clearTimeout(state.messageId);
      state.messageId = '';
    },
    clearError(state, type) {
      switch (state.errorType) {
        case type:
        case ERROR_TYPE_OTHER:
        case ERROR_TYPE_NETWORK:
        case ERROR_TYPE_SLOW:
          state.errorType = '';
          state.errorMsg = '';
          break;
        default:
          break;
      }
    },
  },
  strict: debug,
});

export default store;
