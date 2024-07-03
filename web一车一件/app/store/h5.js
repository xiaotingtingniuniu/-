import Vue from 'vue';
import Vuex from 'vuex';
import API from '../api/partList';
import { response_code } from '../config/constant';
// import { Message } from 'element-ui';
// import { getFormattedDate } from '../utils/date';
import getParams from '../utils/get-params';
import { Toast, Dialog } from 'vant';
import Cookies from 'js-cookie';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    quoted_status: 0, // 0 '待报价' ; 1 '点击了我要报价'; 2 '点击了下一步跳转到个人信息页面'; 3 发回弹出弹层; 4 已报价页面; 5 复制链接弹层
    toBeQuotedData: [], // 待报价数据
    quotedData: [], // 已报价数据
    quotedUserInfor: {}, // 报价人信息
  },
  mutations: {
    setQuoted_status(state, quoted_status) {
      state.quoted_status = quoted_status;
    },
    setToBeQuotedData(state, toBeQuotedData) {
      state.toBeQuotedData = toBeQuotedData;
    },
    setQuotedData(state, quotedData) {
      state.quotedData = quotedData;
    },
    setQuotedUserInfor(state, quotedUserInfor) {
      state.quotedUserInfor = quotedUserInfor;
    },
  },
  actions: {
    getHistoryOrderDetails({ commit, state }, { params, onSuccess }) {
      console.log('paramsObject', params);
      console.log('commit', commit);
      console.log('state', state);
      const token = getParams('token');
      const auth = Cookies.getJSON('auth');
      if (token) {
        // 调用'查看历史清单详情接口'(走鉴权);(有token即在app内部打开)
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '正在加载',
        });
        API.getHistoryOrderDetailsV2(params)
          .then(res => {
            console.log('res', res);
            const { code, toastMessage, data } = res.data;
            console.log('data', data);
            if (data) {
              data.quotedRemark = null;
            }
            if (code === response_code.SUCCESS) {
              Toast.clear();
              data.detail.forEach(item => {
                console.log('item', item);
                console.log('item.items', item.items);
                item.items.forEach(item1 => {
                  console.log('item1', item1);
                  item1.bidPrice = '';
                  item1.isShow = false;
                });
              });
              commit('setToBeQuotedData', data);
              onSuccess(data);
            } else {
              onSuccess([]);
              Toast.clear();
              Toast.fail(toastMessage);
              console.log('toastMessage', toastMessage);
            }
          })
          .catch(err => {
            console.error('err', err);
            Toast.clear();
          });
      } else {
        if (auth) {
          // web登录拿到 token
          // 调用'查看历史清单详情接口'(走鉴权);(有token即在app外部打开)
          Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '正在加载',
          });
          API.getHistoryOrderDetailsV2WEB(params)
            .then(res => {
              if (!res) {
                // sso 报超时或者第三方登录 所以再去调用没有鉴权的接口
                // 调用'查看历史清单详情接口'(未走鉴权);(没有token即在app外部打开)
                Toast.loading({
                  duration: 0, // 持续展示 toast
                  forbidClick: true,
                  message: '正在加载',
                });
                API.getShareHistoryList(params)
                  .then(res => {
                    console.log('res', res);
                    const { code, toastMessage, data } = res.data;
                    console.log('data', data);
                    if (data) {
                      data.quotedRemark = null;
                    }
                    if (code === response_code.SUCCESS) {
                      Toast.clear();
                      data.detail.forEach(item => {
                        console.log('item', item);
                        console.log('item.items', item.items);
                        item.items.forEach(item1 => {
                          console.log('item1', item1);
                          item1.bidPrice = '';
                          item1.isShow = false;
                        });
                      });
                      commit('setToBeQuotedData', data);
                      onSuccess(data);
                    } else if (code === response_code.EXPIRED) {
                      Dialog.alert({
                        message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
                      }).then(() => {
                        // 确认按钮
                        // 先删除旧的登录信息
                        Cookies.remove('auth');
                        // 跳转web登录页面
                        const receipt = getParams('receipt');
                        const type = getParams('type');

                        const { origin, pathname } = document.location;
                        window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
                      });
                    } else {
                      onSuccess([]);
                      Toast.clear();
                      Toast.fail(toastMessage);
                      console.log('toastMessage', toastMessage);
                    }
                  })
                  .catch(err => {
                    console.error('err', err);
                    Toast.clear();
                  });
                return;
              }
              console.log('res', res);
              const { code, toastMessage, data } = res.data;
              console.log('data', data);
              if (data) {
                data.quotedRemark = null;
              };
              if (code === response_code.SUCCESS) {
                Toast.clear();
                data.detail.forEach(item => {
                  console.log('item', item);
                  console.log('item.items', item.items);
                  item.items.forEach(item1 => {
                    console.log('item1', item1);
                    item1.bidPrice = '';
                    item1.isShow = false;
                  });
                });
                commit('setToBeQuotedData', data);
                onSuccess(data);
              } else {
                onSuccess([]);
                Toast.clear();
                Toast.fail(toastMessage);
                console.log('toastMessage', toastMessage);
              }
            })
            .catch(err => {
              console.error('err', err);
              Toast.clear();
            });
        } else {
          // 调用'查看历史清单详情接口'(未走鉴权);(没有token即在app外部打开)
          Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '正在加载',
          });
          API.getShareHistoryList(params)
            .then(res => {
              console.log('res', res);
              const { code, toastMessage, data } = res.data;
              console.log('data', data);
              if (data) {
                data.quotedRemark = null;
              }
              if (code === response_code.SUCCESS) {
                Toast.clear();
                data.detail.forEach(item => {
                  console.log('item', item);
                  console.log('item.items', item.items);
                  item.items.forEach(item1 => {
                    console.log('item1', item1);
                    item1.bidPrice = '';
                    item1.isShow = false;
                  });
                });
                commit('setToBeQuotedData', data);
                onSuccess(data);
              } else {
                onSuccess([]);
                Toast.clear();
                Toast.fail(toastMessage);
                console.log('toastMessage', toastMessage);
              }
            })
            .catch(err => {
              console.error('err', err);
              Toast.clear();
              // this.details = null;
            });
        }
      }
    },
    createAndSubmit({ commit, state }, { params, onSuccess }) {
      console.log('paramsObject', params);
      console.log('commit', commit);
      console.log('state', state);
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '正在加载',
      });
      let time = setTimeout(() => {
        Toast('网络异常，请稍后重试');
      }, 8000);
      console.log('time', time);
      API.createAndSubmit(params)
        .then(res => {
          console.log('res', res);
          const { code, toastMessage, data } = res.data;
          console.log('data', data);
          if (code === response_code.SUCCESS) {
            Toast.clear();
            Toast('发回成功');
            if (time) {
              clearTimeout(time);
              time = null;
            }
            onSuccess(data.shareUrl);
          } else {
            Toast.clear();
            if (time) {
              clearTimeout(time);
              time = null;
            }
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    },
    createAndSubmitWeb({ commit, state }, { params, onSuccess }) {
      console.log('paramsObject', params);
      console.log('commit', commit);
      console.log('state', state);
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '正在加载',
      });
      let time = setTimeout(() => {
        Toast('网络异常，请稍后重试');
      }, 8000);
      API.createAndSubmitWeb(params)
        .then(res => {
          // sso 报过期或者第三方登录
          if (!res) {
            Toast.clear();
            if (time) {
              clearTimeout(time);
              time = null;
            }
            Dialog.alert({
              message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
            }).then(() => {
              // 确认按钮
              // 先删除旧的登录信息
              Cookies.remove('auth');
              // 跳转web登录页面
              const receipt = getParams('receipt');
              const type = getParams('type');
              const { origin, pathname } = document.location;
              window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
            });
            return;
          }
          console.log('res', res);
          const { code, toastMessage, data } = res.data;
          console.log('data', data);
          if (code === response_code.SUCCESS) {
            Toast.clear();
            Toast('发回成功');
            if (time) {
              clearTimeout(time);
              time = null;
            }
            onSuccess(data.shareUrl);
          } else if (code === response_code.EXPIRED) {
            Toast.clear();
            if (time) {
              clearTimeout(time);
              time = null;
            }
            Dialog.alert({
              message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
            }).then(() => {
              // 确认按钮
              // 先删除旧的登录信息
              Cookies.remove('auth');
              // 跳转web登录页面
              const receipt = getParams('receipt');
              const type = getParams('type');
              const { origin, pathname } = document.location;
              window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
            });
          } else {
            Toast.clear();
            if (time) {
              clearTimeout(time);
              time = null;
            }
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log('err', err);
        });
    },
    getHistoryQuotedDetails({ commit, state }, { params, onSuccess }) {
      const token = getParams('token');
      const auth = Cookies.getJSON('auth');
      if (token) {
        // 调用'查看历史清单详情接口'(走鉴权);(有token url上获取  即在app内部打开)
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '正在加载',
        });
        API.getHistoryQuotedDetails(params)
          .then(res => {
            console.log('res', res);
            const { code, toastMessage, data } = res.data;
            console.log('data', data);
            if (data) {
              data.quotedRemark = null;
            }
            if (code === response_code.SUCCESS) {
              Toast.clear();
              commit('setToBeQuotedData', data);
              console.log('toBeQuotedData', state.toBeQuotedData);
              onSuccess(data);
            } else {
              onSuccess([]);
              Toast.clear();
              Toast.fail(toastMessage);
              console.log('toastMessage', toastMessage);
            }
          })
          .catch(err => {
            console.error('err', err);
            Toast.clear();
            // this.details = null;
          });
      } else {
        if (auth) {
          // web登录拿到 token
          // 调用'查看历史清单详情接口'(走鉴权);(有token web页面登录 即在app外部打开)
          Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '正在加载',
          });
          API.getHistoryQuotedDetailsWeb(params)
            .then(res => {
              if (!res) {
                // sso 报过期或者第三方登录
                Toast.clear();
                Dialog.alert({
                  message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
                }).then(() => {
                  // 确认按钮
                  // 先删除旧的登录信息
                  Cookies.remove('auth');
                  // 跳转web登录页面
                  const receipt = getParams('receipt');
                  const type = getParams('type');
                  const { origin, pathname } = document.location;
                  window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
                });
                return;
              }
              console.log('res', res);
              const { code, toastMessage, data } = res.data;
              console.log('data', data);
              if (data) {
                data.quotedRemark = null;
              }
              if (code === response_code.SUCCESS) {
                Toast.clear();
                commit('setToBeQuotedData', data);
                console.log('toBeQuotedData', state.toBeQuotedData);
                onSuccess(data);
              } else if (code === response_code.EXPIRED) {
                Dialog.alert({
                  message: '您的账号在另一台设备上登录了一车一件或者登录已过期请重新登录',
                }).then(() => {
                  // 确认按钮
                  // 先删除旧的登录信息
                  Cookies.remove('auth');
                  // 跳转web登录页面
                  const receipt = getParams('receipt');
                  const type = getParams('type');
                  const { origin, pathname } = document.location;
                  window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
                });
              } else {
                onSuccess([]);
                Toast.clear();
                Toast.fail(toastMessage);
                console.log('toastMessage', toastMessage);
              }
            })
            .catch(err => {
              console.error('err', err);
              Toast.clear();
              // this.details = null;
            });
        } else {
          // 未登录 跳转web登录页面
          console.log('跳转web登录页面');
          const receipt = getParams('receipt');
          const type = getParams('type');
          const { origin, pathname } = document.location;
          window.location.href = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/login.html')}?receipt=${receipt}&type=${type}`;
        }
      }
    },
  },
});

export default store;
