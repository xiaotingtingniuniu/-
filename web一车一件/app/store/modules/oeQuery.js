import axios from 'axios';

import { queryOE } from '../../api';
import { response_code, session_types, point_types } from '../../config/constant';
import session from '../../utils/session';

let cancelToken = null;

const state = {
  oe: sessionStorage.getItem(session_types.OE) || '',
  partList: JSON.parse(sessionStorage.getItem(session_types.OE_PART_LIST)) || [],
  accuratePart: JSON.parse(sessionStorage.getItem(session_types.OE_ACCURATE_PART)) || {},
  selectedSubBrand: sessionStorage.getItem(session_types.OE_SELECTED_SUB_BRAND) || '',
  toastMessage: sessionStorage.getItem(session_types.OE_PART_LIST_MSG) || '',
  loading: false,
};

const getters = {
  fuzzyQueryList: ({ oe, partList }) => {
    const result = [];
    partList.forEach(item => {
      const start = item.partNumber.indexOf(oe);

      const partNumberChars = (item.partNumber || '').split('').map((char, index) => ({
        char,
        isHighlight: start === -1 ? false : index >= start && index < start + oe.length,
      }));

      result.push({
        ...item,
        partNumberChars,
      });
    });

    return result;
  },
  isAccurate: ({ accuratePart }) => !!accuratePart.partNumber,
  accurateQueryList: ({ accuratePart }) => {
    const result = [];
    const existMakers = [];
    const { vehicleInfo } = accuratePart;
    (vehicleInfo || []).forEach(item => {
      if (existMakers.includes(item.subBrand)) {
        return;
      }
      existMakers.push(item.subBrand);
      result.push({
        comment: item.comment,
      });
    });
    return result;
  },
  noVehicle: ({ accuratePart }) => Array.isArray(accuratePart.vehicleInfo) && accuratePart.vehicleInfo.every(item => !item.mjVehicleGroup),
  vehicleGroupList: ({ accuratePart }) => {
    const { vehicleInfo } = accuratePart;
    const result = [];

    (vehicleInfo || []).forEach(item => {
      if (!item.mjVehicleGroup) {
        return;
      }
      item.mjVehicleGroup.split('|').forEach(group => {
        result.push({
          subBrand: accuratePart.subBrand,
          mjVehicleGroup: group,
          partImageSet: Array.isArray(item.images) ? item.images.map(item => item.image) : null,
          partRefOnImage: Array.isArray(item.images) ? item.images.map(item => item.imageIndex) : null,
          prefix: item.prefix,
        });
      });
    });
    return result;
  },
};

const actions = {
  queryPartsByOe({ state, rootState, commit, dispatch }, onSuccess) {
    if (!state.oe || state.loading) {
      return;
    }

    commit('setLoading', true);
    commit(
      'setOE',
      state.oe
        .toUpperCase()
        .replace(/\s*/g, '')
        .replace(/[^0-9a-z]/gi, ''),
    );

    if (state.oe.length < 5) {
      commit('setPartList', []);
      commit('setAccuratePart', {});
      commit('setToastMessage', '未查询到结果，请输入5位以上的 OE 号！');
      return commit('setLoading', false);
    }

    const source = axios.CancelToken.source();
    cancelToken = source;
    console.log('rootState', rootState);
    queryOE(
      {
        // businessId: rootState.user.businessId,
        partNumber: state.oe,
      },
      {
        cancelToken: source.token,
      },
    )
      .then(resp => {
        commit('setLoading', false);
        const { code, toastMessage, data } = resp.data;
        if (code !== response_code.SUCCESS) {
          commit('setToastMessage', toastMessage);
          commit('setAccuratePart', {});
          return commit('setPartList', []);
        }

        onSuccess();

        if (data && data.length) {
          dispatch(
            'user/addPointByType',
            {
              type: point_types.OE,
              partNumber: state.oe,
            },
            {
              root: true,
            },
          );
        }

        if (data.length > 1) {
          commit('setPartList', data);
          commit('setAccuratePart', {});
        } else {
          commit('setPartList', []);
          commit('setAccuratePart', data[0]);
        }
      })
      .catch(error => {
        console.error(error);
        commit('setLoading', false);
      });
  },
  updatePartDetails({ state, commit }, part) {
    const { partImageSet, subBrand, prefix, mjVehicleGroup, partRefOnImage } = part;
    commit('partDetails/setFromOE', null, { root: true });
    commit('partDetails/setNavTitle', `${state.accuratePart.partNumber} / ${subBrand} / ${mjVehicleGroup}`, { root: true });
    commit('partDetails/setPrefix', prefix, { root: true });
    commit(
      'partDetails/setVehicle',
      {
        brand: state.accuratePart.brand,
        subBrand: subBrand,
        mjVehicleGroup: mjVehicleGroup,
        prefix: prefix,
      },
      { root: true },
    );

    commit('partDetails/setImgNameList', partImageSet, { root: true });
    commit('partDetails/setOE', state.accuratePart.partNumber, { root: true });
    commit('partDetails/setRef', partRefOnImage, { root: true });
  },
  clearResult({ commit }) {
    commit('setToastMessage', '');
    commit('setPartList', []);
    commit('setAccuratePart', {});
  },
  cancelRequest() {
    if (cancelToken) {
      cancelToken.cancel('Request canceled');
      cancelToken = null;
    }
  },
};

const mutations = {
  clearState(state) {
    state.oe = '';
    state.partList = [];
    state.accuratePart = {};
    state.toastMessage = '';
    state.loading = false;

    session.clearByKeys([session_types.OE, session_types.OE_PART_LIST, session_types.OE_PART_LIST_MSG, session_types.OE_ACCURATE_PART, session_types.OE_SELECTED_SUB_BRAND]);
  },
  setOE(state, oe) {
    state.oe = oe;
    sessionStorage.setItem(session_types.OE, oe);
  },
  setPartList(state, partList) {
    partList.forEach(item => {
      if (!item.vehicleInfo || !item.vehicleInfo.length) {
        item.partList = [{}];
      }
    });
    state.partList = partList;
    sessionStorage.setItem(session_types.OE_PART_LIST, JSON.stringify(partList));
  },
  setAccuratePart(state, accuratePart) {
    console.log('accuratePart', accuratePart);
    if (!accuratePart.vehicleInfo || !accuratePart.vehicleInfo.length) {
      accuratePart.vehicleInfo = [{}];
    }
    state.accuratePart = accuratePart;
    sessionStorage.setItem(session_types.OE_ACCURATE_PART, JSON.stringify(accuratePart));
  },
  setSelectedSubBrand(state, selectedSubBrand) {
    state.selectedSubBrand = selectedSubBrand;
    sessionStorage.setItem(session_types.OE_SELECTED_SUB_BRAND, selectedSubBrand);
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setToastMessage(state, toastMessage) {
    state.toastMessage = toastMessage;
    sessionStorage.setItem(session_types.OE_PART_LIST_MSG, toastMessage);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
