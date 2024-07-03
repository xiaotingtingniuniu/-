import API from '../../api/vinQuery';
import { session_types, point_types, response_code } from '../../config/constant';
import session from '../../utils/session';

/** 查询状态 - 未查询 */
const STATE_BEFORE = 'before';

/** 查询状态 - 正在查询 */
const STATE_LOADING = 'loading';

/** 查询状态 - 完成 */
const STATE_COMPLETE = 'complete';

/** 查询状态 - 错误 */
const STATE_ERROR = 'error';

/**
 * 获取初始查询状态
 */
const initSearchState = () => {
  const searchState = JSON.parse(sessionStorage.getItem(session_types.SEARCH_STATE));

  if (searchState) {
    if (searchState === STATE_LOADING || searchState === STATE_ERROR) {
      return STATE_BEFORE;
    }
    return searchState;
  }

  return STATE_BEFORE;
};

/**
 * 获取选择的关键字
 */
const initSelectKeyword = () => {
  const selectKeyword = JSON.parse(sessionStorage.getItem(session_types.SELECT_KEYWORD));

  if (initSearchState() !== STATE_BEFORE) {
    return selectKeyword || '';
  }

  return '';
};

/**
 * 判断是否完全重复
 */
const isAllDuplicate = items => new Set(items).size === 1;

/**
 * 是否属于替换链
 */
const isSubstitute = item => {
  const { reqPartNumber, partNumber, substitute, containFlag, subChainFlag } = item;

  if (containFlag==='1' || !reqPartNumber || !partNumber || reqPartNumber === partNumber) {
    return false;
  }

  if (subChainFlag==='1' || reqPartNumber === substitute) {
    return true;
  }

  return false;
};

/**
 * 是否纠偏
 */
const isRectifyDeviations = item => item.containFlag === '1';

const state = {
  currentVehicle: JSON.parse(sessionStorage.getItem(session_types.CURRENT_VEHICLE)) || {},
  selectKeyword: initSelectKeyword(),
  inputKeyword: JSON.parse(sessionStorage.getItem(session_types.INPUT_KEYWORD)) || '',
  searchState: initSearchState(),
  parts: JSON.parse(sessionStorage.getItem(session_types.VIN_PART_LIST)) || [],
  loading: false,
  maxDerogationPart: null,
  toastMessage: sessionStorage.getItem(session_types.PART_LIST_TOAST_MESSAGE) || '',
};

const getters = {
  searching: state => state.searchState === STATE_LOADING || state.searchState === STATE_ERROR,
};

const actions = {
  queryPartsByKey({ commit, state, dispatch }, onSuccess) {
    if (state.searchState === STATE_LOADING) {
      return;
    }

    commit('setSearchState', STATE_LOADING);
    commit('setToastMessage', '');
    commit('setParts', []);
    commit('clearMaxDerogationPart');
    commit('setInputKeyword', state.inputKeyword.toUpperCase().replace(/\s*/g, ''));
    // commit('setInputKeyword', state.inputKeyword.toUpperCase().replace(/[^a-z0-9\u4e00-\u9fa5]*/gi, ''));

    const key = state.selectKeyword || state.inputKeyword;

    API.queryPartsByKey({
      vinCode: state.currentVehicle.vinCode,
      optionCode: state.currentVehicle.optionCode,
      key,
      mjsid: state.currentVehicle.mjsid,
    }).then(response => {
      console.log('response', response);
      const { code, toastMessage, data } = response.data;
      if (code === response_code.SUCCESS) {
        !/[a-zA-Z0-9]+/.test(key) && dispatch('user/addPointByType', { type: point_types.KEY }, { root: true });
        onSuccess && onSuccess(key);

        const allDuplicate = isAllDuplicate(data.map(p => p.partRefOnImage)) && isAllDuplicate(data.map(p => p.image)) && isAllDuplicate(data.map(p => p.partPrice));

        data.forEach((item, index) => {
          item.expand = index === 0 && allDuplicate;

          if (item.comment) {
            item.comment = item.comment.trim();
          }

          item.isRectifyDeviations = isRectifyDeviations(item);
          item.isSubstitute = isSubstitute(item);

          const start = item.partNumber.indexOf(item.reqPartNumber);
          item.partNumberChars = (item.partNumber || '').split('').map((char, index) => ({
            char,
            isHighlight: start === -1 ? false : index >= start && index < start + item.reqPartNumber.length,
          }));

          if (item.isRectifyDeviations && item.reqPartPrice && item.partPrice) {
            const derogation = (item.reqPartPrice - item.partPrice).toFixed(2);
            item.derogation = derogation > 0 ? derogation : 0;

            if (derogation) {
              commit('setMaxDerogationPart', item);
            }
          }
        });

        dispatch('addDerogation');

        if (!allDuplicate) {
          commit('setSearchState', STATE_COMPLETE);
        }
      } else {
        commit('setToastMessage', toastMessage);
        commit('setSearchState', STATE_COMPLETE);
      }
      console.log('data', data);
      commit('setParts', data || []);
    }).catch(error => {
      console.error(error);
      commit('setSearchState', STATE_ERROR);
    });
  },

  queryPartsBySelect({ commit, dispatch }, selectKeyword) {
    if (state.searchState === STATE_LOADING) {
      return;
    }
    commit('setInputKeyword', '');
    commit('setSelectKeyword', selectKeyword);
    dispatch('queryPartsByKey');
  },

  addDerogation({ state }) {
    if (!state.maxDerogationPart) {
      return;
    }

    API.addDerogation({
      vin: state.currentVehicle.vinCode,
      derogationAmount: state.maxDerogationPart.derogation,
      falseOe: state.maxDerogationPart.reqPartNumber,
      trueOe: state.maxDerogationPart.partNumber,
    });
  },

  toSubstituteDetails({ state }, part) {
    const substituteInfo = {
      currentVehicle: state.currentVehicle,
      currentPart: part,
    };
    sessionStorage.setItem(session_types.SUBSTITUTE, JSON.stringify(substituteInfo));
    open(`#/substitute/${part.partNumber}`);
  },

  clearResult({ commit }) {
    commit('setToastMessage', '');
    commit('setSelectKeyword', '');
    commit('setInputKeyword', '');
    commit('setSearchState', STATE_BEFORE);
    commit('setParts', []);
  },
};

const mutations = {
  clearState(state) {
    state.currentVehicle = {};
    state.selectKeyword = '';
    state.inputKeyword = '';
    state.searchState = STATE_BEFORE;
    state.parts = [];
    state.path = '';
    state.toastMessage = '';
    session.clearByKeys([
      session_types.CURRENT_VEHICLE,
      session_types.SELECT_KEYWORD,
      session_types.INPUT_KEYWORD,
      session_types.SEARCH_STATE,
      session_types.VIN_PART_LIST,
      session_types.PART_LIST_TOAST_MESSAGE,
    ]);
  },
  setCurrentVehicle(state, currentVehicle) {
    state.currentVehicle = currentVehicle;
    sessionStorage.setItem(session_types.CURRENT_VEHICLE, JSON.stringify(state.currentVehicle));
  },
  setSelectKeyword(state, selectKeyword) {
    state.selectKeyword = selectKeyword;
    sessionStorage.setItem(session_types.SELECT_KEYWORD, JSON.stringify(state.selectKeyword));
  },
  setInputKeyword(state, inputKeyword) {
    state.inputKeyword = inputKeyword;
    sessionStorage.setItem(session_types.INPUT_KEYWORD, JSON.stringify(state.inputKeyword));
  },
  setSearchState(state, searchState) {
    state.searchState = searchState;
    sessionStorage.setItem(session_types.SEARCH_STATE, JSON.stringify(state.searchState));
  },
  setParts(state, parts) {
    state.parts = parts;
    console.log('state.parts', parts);
    sessionStorage.setItem(session_types.VIN_PART_LIST, JSON.stringify(state.parts));
  },
  expand(state, currentPart) {
    state.parts.forEach(part => {
      if (part === currentPart) {
        part.expand = !part.expand;
      }
    });
  },
  setToastMessage(state, toastMessage) {
    state.toastMessage = toastMessage;
    sessionStorage.setItem(session_types.PART_LIST_TOAST_MESSAGE, toastMessage);
  },
  setMaxDerogationPart(state, part) {
    if (!state.maxDerogationPart || +part.derogation > +state.maxDerogationPart.derogation) {
      state.maxDerogationPart = part;
    }
  },
  clearMaxDerogationPart(state) {
    state.maxDerogationPart = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
