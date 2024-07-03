import API from '../../api/substitute';
import { session_types } from '../../config/constant';

const convertCurrentPartSubList = list => {
  const newList = [];

  if (Array.isArray(list)) {
    newList.push(
      ...list.map((item, index) => ({
        isStripe: 0,
        standardPartName: item.partName,
        srcPartName: item.epcPartName,
        partPrice: item.price ? Number(item.price).toFixed(2) : '',
        partNumber: item.subOe,
        qty: item.qty,
        comment: item.comment,
        index: -1,
        isHover: false,
        hideBorder: index < list.length - 1,
      })),
    );
  }

  return newList;
};

const state = {
  currentVehicle: null,
  currentPart: null,
  currentPartSubList: [],
  subStituteList: [],
  substituteCount: 0,
  toastMessage: '',
  searching: false,
};

const getters = {
  currentPartList: state => (state.currentPartSubList.length ? state.currentPartSubList : [state.currentPart]),
};

const actions = {
  loadState({ commit, dispatch }, { oe, onError }) {
    const substituteInfoStr = sessionStorage.getItem(session_types.SUBSTITUTE);
    if (!substituteInfoStr) {
      return onError();
    }

    const { currentVehicle, currentPart } = JSON.parse(substituteInfoStr);
    if (!currentPart || currentPart.partNumber !== oe) {
      return onError();
    }

    commit('setCurrentVehicle', currentVehicle);
    commit('setCurrentPart', currentPart);

    if (!state.currentPart) {
      return;
    }

    const { subChainFlag } = state.currentPart;

    if (subChainFlag==='1') {
      dispatch('findSubstituteLink');
    }
  },
  findSubstituteLink({ state, commit }) {
    const vinCode = state.currentVehicle.vinCode;
    const optionCode = state.currentVehicle.optionCode;
    const mjsid = state.currentVehicle.mjsid;
    const partNumber = state.currentPart.partNumber;
    const brand = state.currentVehicle.brand;
    const subBrand = state.currentVehicle.maker;
    const mjVehicleSys = state.currentVehicle.mjVehicleSys;
    const mjVehicleGroup = state.currentVehicle.mjVehicleGroup;
    console.log('state', state);
    commit('setSearching', true);

    API.findSubstituteLink(vinCode, optionCode, mjsid, partNumber, brand, subBrand, mjVehicleSys, mjVehicleGroup)
      .then(resp => {
        if (!resp) {
          return;
        }

        const { toastMessage, data } = resp.data;

        commit('setSubstituteList', data || []);
        commit('setToastMessage', toastMessage);
        commit('setSearching', false);
      })
      .catch(error => {
        console.error(error);
        commit('setSearching', false);
      });
  },
  updateHover({ commit }, { index, isHover }) {
    commit('setHover', { index, isHover });
  },
};

const mutations = {
  clearState(state) {
    state.currentVehicle = null;
    state.currentPart = null;
    state.currentPartSubList = [];
    state.subStituteList = [];
    state.substituteCount = 0;
    state.toastMessage = '';
    state.searching = false;
  },
  setCurrentVehicle(state, currentVehicle) {
    state.currentVehicle = currentVehicle;
  },
  setCurrentPart(state, currentPart) {
    state.currentPart = {
      ...currentPart,
      index: -1,
      isStripe: 0,
      isHover: false,
      hideBorder: true,
    };
  },
  setSubstituteList(state, subStituteList) {
    const newList = [];

    const { currentPart, currentPartSubList } = state;
    console.log('subStituteList', subStituteList);
    currentPart.linkList = subStituteList.map(item => ({ partNumber: item.partNumber }));

    const currentPartFromList = subStituteList.find(item => item.partNumber === currentPart.partNumber) || {};
    state.currentPart = {
      srcPartName: currentPartFromList.srcPartName,
      partPrice: currentPartFromList.partPrice ? Number(currentPartFromList.partPrice).toFixed(2) : '',
      partNumber: currentPartFromList.partNumber,
      qty: currentPartFromList.qty,
      comment: currentPartFromList.comment,
    };
    currentPartSubList.push(...convertCurrentPartSubList(currentPartFromList.subSidiary));

    // 遍历替换链及其子件
    const filteredList = subStituteList.filter(item => item.partNumber !== currentPart.partNumber);
    state.substituteCount = filteredList.length;

    filteredList.forEach((item, index) => {
      const group = [];

      if (Array.isArray(item.subSidiary) && item.subSidiary.length) {
        group.push({
          srcPartName: item.srcPartName,
          partPrice: item.partPrice ? Number(item.partPrice).toFixed(2) : '',
          partNumber: item.partNumber,
          qty: item.qty,
          comment: item.comment,
        });

        group.push(
          ...item.subSidiary
            .map(subItem => ({
              srcPartName: subItem.epcPartName,
              partPrice: subItem.price ? Number(subItem.price).toFixed(2) : '',
              partNumber: subItem.subOe,
              qty: subItem.qty,
              comment: subItem.comment,
            }))
            .filter(subItem => subItem.partNumber !== item.main),
        );
      } else {
        group.push({
          srcPartName: item.srcPartName,
          partPrice: item.partPrice ? Number(item.partPrice).toFixed(2) : '',
          partNumber: item.partNumber,
          qty: item.qty,
          comment: item.comment,
        });
      }

      newList.push(
        ...group.map((groupItem, groupIndex) => ({
          ...groupItem,
          hideBorder: group.length > 1 && groupIndex < group.length - 1, // 隐藏 border
          index, // 分组下标
          isStripe: index % 2 === 1, // 以深色显示该行
          isHover: false, // hover 状态
        })),
      );
    });

    state.subStituteList = newList;
  },
  setSubstituteCount(state, substituteCount) {
    state.substituteCount = substituteCount;
  },
  setToastMessage(state, toastMessage) {
    state.toastMessage = toastMessage;
  },
  setSearching(state, searching) {
    state.searching = searching;
  },
  setHover(state, { index, isHover }) {
    [state.currentPart, ...state.currentPartSubList, ...state.subStituteList].forEach(item => {
      if (item.index === index) {
        item.isHover = isHover;
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
