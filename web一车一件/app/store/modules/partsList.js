import API from '../../api/partList';
import { response_code } from '../../config/constant';
import { Message } from 'element-ui';
import axios1 from '../../api/http/default';

const state = {
  partsListTotal: 0,
  partsList: [],
  loading: false,
  shareUrl: '', // 分享出去的url
  isVisibleShareDialog: false, // 是否展示分享链接的弹框
  isVisibleCopyButton: false, // 是否展示复制链接按钮
  historyList: [], // 历史清单
  listDetails: [], // 历史清单详情
  historyOrderDetails: [],
  checkedList:[], // 当前选择的checkbox
  editableTabsValue: 'my-create', // 历史清单tabs的切换状态
  isShareAgain: false, // 是否是再次分享
  orderNumber: '', // 历史清单号
  quotedDialogTitle: '收到的报价', // 报价弹框title
  isVisibleQuotedDialo: false, // 是否展示 报价弹框
  quotedOrderList: [], // 报价清单列表
  countReadyToView:0, // 待查看报价单个数
  isFirstHistoryList: JSON.parse(localStorage.getItem('isFirstHistoryList')), // 是否是第一次进入'历史清单页面'
  isFirstShareList: JSON.parse(localStorage.getItem('isFirstShareList')), // 是否是第一次点击'分享给他人'按钮
  shareTextarea: '', // 分享的备注
};

const mutations = {
  /**
   * 设置配件清单总数
   * @param {*} state
   * @param {*} partsListTotal 配件清单总数
   */
  setPartsListTotal(state, partsListTotal) {
    state.partsListTotal = partsListTotal;
    localStorage.setItem('partsList', partsListTotal);
  },
  /**
   * 设置配件列表
   */
  setPartsList(state, partsList) {
    state.partsList = partsList;
  },
  /**
   * 设置loading
   */
  setLoading(state, loading) {
    state.loading = loading;
  },
  /**
   * 设置shareUrl(分享出去的url)
   */
  setShareUrl(state, shareUrl) {
    state.shareUrl = shareUrl;
  },
  /**
   * 设置是否展示分享链接弹框
   */
  setIsVisibleShareDialog(state, isVisibleShareDialog) {
    state.isVisibleShareDialog = isVisibleShareDialog;
  },
  /**
   * 设置 历史清单tabs的切换状态
   */
  setEditableTabsValue(state, editableTabsValue) {
    state.editableTabsValue = editableTabsValue;
  },
  /**
   * 设置是否是再次分享
   */
  setIsShareAgain(state, isShareAgain) {
    state.isShareAgain = isShareAgain;
  },
  /**
   * 设置历史清单号
   */
  setOrderNumber(state, orderNumber) {
    state.orderNumber = orderNumber;
  },
  /**
   * 设置是否展示复制按钮弹框
   */
  setIsVisibleCopyButton(state, isVisibleCopyButton) {
    state.isVisibleCopyButton = isVisibleCopyButton;
  },
  /**
   * 设置历史清单
   */
  setHistoryList(state, historyList) {
    state.historyList = historyList;
  },
  /**
   * 设置历史清单详情
   */
  setHistoryOrderDetails(state, historyOrderDetails) {
    state.historyOrderDetails = historyOrderDetails;
  },
  /**
   * 设置 当前选择的checkbox
  */
  setCheckedList(state, checkedList) {
    state.checkedList = checkedList;
  },
  /**
   * 设置 报价弹框 title
   */
  setQuotedDialogTitle(state, quotedDialogTitle) {
    state.quotedDialogTitle = quotedDialogTitle;
  },
  /**
   * 设置 是否展示报价弹框
   */
  setIsVisibleQuotedDialo(state, isVisibleQuotedDialo) {
    state.isVisibleQuotedDialo = isVisibleQuotedDialo;
  },
  /**
   * 设置 报价清单列表
   */
  setQuotedOrderList(state, quotedOrderList) {
    state.quotedOrderList = quotedOrderList;
  },
  /**
   * 设置 待查看报价单个数
   */
  setCountReadyToView(state, countReadyToView) {
    state.countReadyToView = countReadyToView;
  },
  /**
   * 设置 是否是第一次进入'历史清单页面'
   */
  setIsFirstHistoryList(state, isFirstHistoryList) {
    state.isFirstHistoryList = isFirstHistoryList;
  },
  /**
   * 设置 是否是第一次点击'分享给他人'按钮
   */
  setIsFirstShareList(state, isFirstShareList) {
    state.isFirstShareList = isFirstShareList;
  },
  /**
   * 设置 分享备注
   */
  setShareTextarea(state, shareTextarea) {
    state.shareTextarea = shareTextarea;
  },
};
const actions = {
  /**
   * 添加配件
   */
  addPart({ commit }, params) {
    API.addPart(params)
      .then(res => {
        console.log(res);
        const { code, toastMessage } = res.data;
        if (code === response_code.SUCCESS) {
          // 如果添加成功 则将"+" 样式变为actived 并且将当前清单数+1
          document.getElementById(params.index).classList.add('table_add_active');
          let listNumber = localStorage.getItem('partsList');
          if (listNumber) {
            listNumber = parseInt(listNumber) + 1;
          }
          commit('setPartsListTotal', listNumber);
          Message({
            message: '添加成功',
            type: 'success',
          });
        } else if (code === '2712') {
          Message({
            message: toastMessage,
            type: 'error',
          });
        } else {
          if (!axios1.isCancel(res.data.toastMessage)) {
            commit('setError', true, { root: true });
          }
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },
  /**
   * 获取当前清单内配件个数
   */
  countPart({ commit }, params) {
    API.countPart(params)
      .then(res => {
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          const total = data;
          if (data===0) {
            commit('setCheckedList', []);
          }
          commit('setPartsListTotal', total);
        } else {
          console.log('toastMessage', toastMessage);
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },
  /**
   * 查看当前配件清单
   */
  getPartsList({ commit, state }) {
    console.log('commit', commit);
    console.log('state', state);
    commit('setLoading', true);
    API.getPartsList({})
      .then(res => {
        commit('setLoading', false);
        console.log('res', res);
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          commit('setPartsList', data);
          console.log('partsList', state.partsList);
        } else {
          console.log('toastMessage', toastMessage);
          if (!axios1.isCancel(res.data.toastMessage)) {
            commit('setError', true, { root: true });
          }
        }
      })
      .catch(err => {
        commit('setLoading', false);
        console.error('err', err);
      });
  },
  /**
   * 删除清单中配件
   */
  deletePartsList({ commit, state }, params) {
    console.log('commit', commit);
    console.log('state', state);
    API.deletePartsList(params)
      .then(res => {
        console.log('res', res);
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          console.log('data', data);
          const partsListTotal = state.partsListTotal -1;
          const checkedList = state.checkedList.concat();
          checkedList.map((item, index) => {
            if (item.code === params.itemToRemove[0]) {
              // 从checkedList中删除该项
              checkedList.splice(index, 1);
            }
            commit('setCheckedList', checkedList);
            return item;
          });
          const partsList = state.partsList.concat();
          partsList.map((item, index) => {
            item.items.map((item1, index1) => {
              if (item1.code === params.itemToRemove[0]) {
                if (partsList[index].items.length===1) {
                  partsList[index].items.splice(index1, 1);
                  document.getElementById(index).style.display='none';
                } else {
                  partsList[index].items.splice(index1, 1);
                }
              }
              commit('setPartsList', partsList);
              return item1;
            });
            return item;
          });
          commit('setPartsListTotal', partsListTotal);
          Message({
            message: '删除' + toastMessage,
            type: 'success',
          });
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },
  /**
   * 提交配件清单
   */
  submitPartsList({ commit }, { params, success }) {
    API.submitPartsList(params)
      .then(res => {
        console.log('res', res);
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          const { origin, pathname } = document.location;
          const shareUrl = `${origin}${pathname.replace(/\/[a-z0-9]+\.html/ig, '/h5.html')}?receipt=${encodeURIComponent(data.receipt)}&type=1`;
          commit('setShareUrl', shareUrl);
          commit('setIsVisibleCopyButton', true);
          success(true);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },
  /**
   * 按照时间分组查看历史清单列表
   */
  getHistoryByDate({ commit }, params) {
    API.getHistoryByDate(params)
      .then(res => {
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          console.log('data', data);
          commit('setHistoryList', data);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },

  /**
   * 树型查询报价清单列表（我创建）
   */
  getMyCreate({ commit }, params) {
    commit('setLoading', true);
    API.getMyCreate(params).then(res => {
      commit('setLoading', false);
      const { code, toastMessage, data } = res.data;
      if (code === response_code.SUCCESS) {
        commit('setHistoryList', data);
      } else {
        Message({
          message: toastMessage,
          type: 'error',
        });
      }
    }).catch(err => {
      commit('setLoading', false);
      console.error('err', err);
    });
  },

  /**
   * 树型查询报价清单列表（我创建）
   */
  getOthersCreate({ commit }, params) {
    commit('setLoading', true);
    API.getOthersCreate(params).then(res => {
      commit('setLoading', false);
      const { code, toastMessage, data } = res.data;
      if (code === response_code.SUCCESS) {
        commit('setHistoryList', data);
      } else {
        Message({
          message: toastMessage,
          type: 'error',
        });
      }
    }).catch(err => {
      commit('setLoading', false);
      console.error('err', err);
    });
  },
  /**
   * 查看历史清单详情
   */
  getHistoryOrderDetails({ commit }, paramsObject) {
    commit('setLoading', true);
    const params = {
      orderNumber: paramsObject.orderNumber,
    };
    API.getHistoryOrderDetails(params)
      .then(res => {
        commit('setLoading', false);
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          commit('setHistoryOrderDetails', data);
          const currrentList = state.historyList[paramsObject.index].order;
          currrentList.details = data.detail;
          currrentList.creator = data.creator;
          commit('setHistoryList', state.historyList);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
      })
      .catch(err => {
        commit('setLoading', false);
        console.error('err', err);
      });
  },
  /**
   * 修改历史清单基础信息
   */
  getOrderUpdate({ commit }, { params, success }) {
    API.getOrderUpdate(params).then(res => {
      const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          const shareUrl = `${data.shareUrl}&type=1`;
          commit('setShareUrl', shareUrl);
          commit('setIsVisibleCopyButton', true);
          success(true);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
    }).catch(err => {
      console.error('err', err);
    });
  },
  /**
   * 查询报价清单列表（收到报价）
   */
  getOthersQuoted({ commit }, { params, success }) {
    API.getOthersQuoted(params).then(res => {
      console.log('commit', commit);
      const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          success(data);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
    }).catch(err => {
      console.error('err', err);
    });
  },
  /**
   * 查询报价清单列表（收到报价）
   */
  getMyQuoted({ commit }, { params, success }) {
    API.getMyQuoted(params).then(res => {
      console.log('commit', commit);
      const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          success(data);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
    }).catch(err => {
      console.error('err', err);
    });
  },
  /**
   * 查询待查看报价单个数
   */
  getCountReadyToView({ commit }, { params, success }) {
    API.getCountReadyToView(params).then(res => {
      const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          commit('setCountReadyToView', data);
          success(data);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
    }).catch(err => {
      console.error('err', err);
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
