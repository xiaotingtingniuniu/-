import { session_types } from '../../config/constant';
import session from '../../utils/session';

const initImgNameList = () => {
  const str = sessionStorage.getItem(session_types.PART_DETAILS_IMG_NAME_LIST);

  if (str) {
    return JSON.parse(str);
  }

  return [];
};

const initVehicle = () => {
  const str = sessionStorage.getItem(session_types.PART_DETAILS_VEHICLE);

  if (str) {
    return JSON.parse(str);
  }

  return null;
};

const state = {
  from: sessionStorage.getItem(session_types.PART_DETAILS_FROM) || '',
  oe: sessionStorage.getItem(session_types.PART_DETAILS_OE) || '',
  ref: sessionStorage.getItem(session_types.PART_DETAILS_REF) || '',
  navTitle: sessionStorage.getItem(session_types.PART_DETAILS_TITLE) || '',
  prefix: sessionStorage.getItem(session_types.PART_DETAILS_PREFIX) || '',
  imgNameList: initImgNameList(),
  vehicle: initVehicle(),
};

const getters = {
  fromPartTree: state => state.from === 'partTree',
  fromOE: state => state.from === 'oe',
};

const actions = {};

const mutations = {
  clearState(state) {
    state.from = 0;
    state.oe = '';
    state.ref = '';
    state.navTitle = '';
    state.markedRefNo = '';
    state.prefix = '';
    state.imgNameList = [];
    state.vehicle = null;

    session.clearByKeys([
      session_types.PART_DETAILS_FROM,
      session_types.PART_DETAILS_OE,
      session_types.PART_DETAILS_REF,
      session_types.PART_DETAILS_TITLE,
      session_types.PART_DETAILS_PREFIX,
      session_types.PART_DETAILS_IMG_NAME_LIST,
      session_types.PART_DETAILS_VEHICLE,
    ]);
  },
  setFromPartTree(state) {
    state.from = 'partTree';
    sessionStorage.setItem(session_types.PART_DETAILS_FROM, 'partTree');
  },
  setFromOE(state) {
    state.from = 'oe';
    sessionStorage.setItem(session_types.PART_DETAILS_FROM, 'oe');
  },
  setOE(state, oe) {
    state.oe = oe;
    sessionStorage.setItem(session_types.PART_DETAILS_OE, oe);
  },
  setRef(state, ref) {
    state.ref = ref;
    sessionStorage.setItem(session_types.PART_DETAILS_REF, ref);
  },
  setNavTitle(state, navTitle) {
    state.navTitle = navTitle;
    sessionStorage.setItem(session_types.PART_DETAILS_TITLE, navTitle);
  },
  setPrefix(state, prefix) {
    state.prefix = prefix;
    sessionStorage.setItem(session_types.PART_DETAILS_PREFIX, prefix);
  },
  setImgNameList(state, imgNameList) {
    state.imgNameList = imgNameList;
    sessionStorage.setItem(session_types.PART_DETAILS_IMG_NAME_LIST, JSON.stringify(imgNameList));
  },
  setVehicle(state, vehicle) {
    state.vehicle = vehicle;
    sessionStorage.setItem(session_types.PART_DETAILS_VEHICLE, JSON.stringify(vehicle));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
