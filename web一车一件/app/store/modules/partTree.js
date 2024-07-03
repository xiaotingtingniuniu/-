import axios from 'axios';
import API from '../../api/partTree';
import { session_types, response_code } from '../../config/constant';
import session from '../../utils/session';

/** 查询状态 - 正在查询 */
const STATE_LOADING = 'loading';

/** 查询状态 - 完成 */
const STATE_COMPLETE = 'complete';

const hasData = (parts, index, subIndex) => {
  if (!index) {
    return parts.size;
  }

  const part = parts.get(index);

  if (!subIndex) {
    return part.subParts.size;
  } else {
    const subPart = part.subParts.get(subIndex);
    return subPart.images.length;
  }
};

const saveParts = parts => {
  const partList = [...parts.values()].map(p => ({
    id: p.id,
    name: p.name,
    subParts: [...p.subParts.values()],
  }));

  sessionStorage.setItem(session_types.TREE_PART_LIST, JSON.stringify(partList));
};

const initParts = () => {
  const partListStr = sessionStorage.getItem(session_types.TREE_PART_LIST);
  const parts = new Map();

  if (partListStr) {
    const partList = JSON.parse(partListStr);

    for (const p of partList) {
      const subParts = new Map();

      for (const sp of p.subParts) {
        subParts.set(sp.id, sp);
      }

      parts.set(p.id, {
        id: p.id,
        name: p.name,
        subParts,
      });
    }
  }
  return parts;
};

const saveSelectedParts = index => {
  sessionStorage.setItem(session_types.TREE_SELECTED_PART, index);
};

const initSelectedParts = () => sessionStorage.getItem(session_types.TREE_SELECTED_PART);

const saveSelectedSubParts = index => {
  sessionStorage.setItem(session_types.TREE_SELECTED_SUB_PART, index);
};

const initSelectedSubParts = () => sessionStorage.getItem(session_types.TREE_SELECTED_SUB_PART);

const saveSelectedImage = selectedImage => {
  sessionStorage.setItem(session_types.TREE_SELECTED_IMG, JSON.stringify(selectedImage));
};

const initSelectedImage = () => {
  const selectedImageStr = sessionStorage.getItem(session_types.TREE_SELECTED_IMG);

  if (selectedImageStr) {
    return JSON.parse(selectedImageStr);
  }

  return null;
};

const parts = initParts();
const selectedPart = parts.get(initSelectedParts());
const selectedSubPart = selectedPart ? selectedPart.subParts.get(initSelectedSubParts()) : null;
const selectedImage = initSelectedImage();

const state = {
  parts,
  selectedPart,
  selectedSubPart,
  selectedImage,
  searchState: STATE_COMPLETE,
  cancelToken: null,
  toastMessage: '',
};

const getters = {
  partList: state => [...state.parts.values()],
  subPartList: state => {
    if (state.selectedPart) {
      return [...state.selectedPart.subParts.values()];
    }
    return [];
  },
  firstLevelId: state => (state.selectedPart ? state.selectedPart.id : ''),
  secondLevelId: state => (state.selectedSubPart ? state.selectedSubPart.id : ''),
  imageList: state => {
    if (state.selectedSubPart) {
      return state.selectedSubPart.images;
    }
    return [];
  },
  currentVehicle: (state, getters, rootState) => rootState.vinQuery.currentVehicle,
  navTitle: state => {
    const title = [];
    const { selectedPart, selectedSubPart, selectedImage } = state;

    if (selectedPart) {
      title.push(selectedPart.name);
    }
    if (selectedSubPart) {
      title.push(selectedSubPart.name);
    }
    if (selectedImage && selectedImage.name) {
      title.push(selectedImage.name);
    }

    return title.join(' / ');
  },
  searching: state => state.searchState === STATE_LOADING,
};

const actions = {
  getParts({ commit, dispatch, getters }, payloads = {}) {
    const { index, subIndex } = payloads;

    if (hasData(state.parts, index, subIndex)) {
      return;
    }

    commit('searching');

    const source = axios.CancelToken.source();
    commit('setCancelToken', source);
    API.getPartTreeByPage(
      {
        firstLevelId: index || '',
        secondLevelId: subIndex || '',
        vinCode: getters.currentVehicle.vinCode,
        mjsid: getters.currentVehicle.mjsid,
        optionCode: getters.currentVehicle.optionCode,
        prefix: getters.currentVehicle.prefix,
      },
      {
        cancelToken: source.token,
      },
    )
      .then(resp => {
        if (!resp) {
          return;
        }

        const { code, toastMessage, data } = resp.data;
        const partTreeList = data;
        if (code === response_code.SUCCESS) {
          if (!index) {
            dispatch('handleGetParts', partTreeList || []);
          } else if (!subIndex) {
            dispatch('handleGetSubParts', partTreeList || []);
          } else {
            dispatch('handleGetImages', partTreeList || []);
          }
        } else {
          commit('setToastMessage', toastMessage);
          commit('searchCompleted');
        }
      })
      .catch(error => {
        console.error(error);
        commit('searchCompleted');
      });
  },
  handleGetParts({ commit }, partTreeList) {
    const newParts = new Map();

    for (const p of partTreeList) {
      if (!p.firstLevelId) {
        continue;
      }

      const id = p.firstLevelId;
      const name = p.firstLevelName;

      newParts.set(id, {
        id,
        name,
        subParts: new Map(),
      });
    }

    commit('searchCompleted');
    commit('setParts', newParts);
  },
  handleGetSubParts({ commit }, partTreeList) {
    const newSubParts = new Map();

    for (const p of partTreeList) {
      if (!p.secondLevelId) {
        continue;
      }

      const id = p.secondLevelId;
      const name = p.secondLevelName;

      newSubParts.set(id, {
        id,
        name,
        images: [],
      });
    }

    commit('searchCompleted');
    commit('setSubParts', newSubParts);
  },
  handleGetImages({ commit, getters }, partTreeList) {
    const prefix = getters.currentVehicle.prefix;

    const newImages = partTreeList.map(p => ({
      src: p.imgUrl,
      name: p.imageName,
      prefix,
      image: p.image,
    }));

    commit('searchCompleted');
    commit('setImages', newImages);
  },
  cancelRequest({ state, commit }) {
    if (state.cancelToken) {
      state.cancelToken.cancel('Request canceled');
    }
    commit('setCancelToken', null);
  },
  updatePartDetails({ state, getters, commit }, item) {
    commit('updateSelectedImage', item);
    commit('partDetails/setFromPartTree', null, { root: true });
    commit('partDetails/setNavTitle', getters.navTitle, { root: true });
    commit('partDetails/setPrefix', state.selectedImage.prefix, { root: true });
    commit('partDetails/setImgNameList', [state.selectedImage.image], { root: true });
  },
};

const mutations = {
  clearState(state) {
    state.parts = new Map();
    state.selectedPart = null;
    state.selectedSubPart = null;
    state.searchState = STATE_COMPLETE;
    session.clearByKeys([session_types.TREE_PART_LIST, session_types.TREE_SELECTED_PART, session_types.TREE_SELECTED_SUB_PART, session_types.TREE_SELECTED_IMG]);
  },
  setParts(state, parts) {
    state.parts = parts;
    console.log('state.parts', parts);
    saveParts(state.parts);
  },
  setSubParts(state, subParts) {
    state.selectedPart.subParts = subParts;
    saveParts(state.parts);
  },
  setImages(state, images) {
    state.selectedSubPart.images = images;
    saveParts(state.parts);
  },
  updateSelectedPart(state, index) {
    state.selectedPart = state.parts.get(index);
    state.selectedSubPart = null;
    saveSelectedParts(index);
    saveSelectedSubParts('');
  },
  updateSelectedSubPart(state, index) {
    state.selectedSubPart = state.selectedPart.subParts.get(index);
    saveSelectedSubParts(index);
  },
  updateSelectedImage(state, selectedImage) {
    state.selectedImage = selectedImage;
    saveSelectedImage(selectedImage);
  },
  searching(state) {
    state.toastMessage = '';
    state.searchState = STATE_LOADING;
  },
  searchCompleted(state) {
    state.searchState = STATE_COMPLETE;
  },
  setCancelToken(state, cancelToken) {
    state.cancelToken = cancelToken;
  },
  setToastMessage(state, toastMessage) {
    state.toastMessage = toastMessage;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
