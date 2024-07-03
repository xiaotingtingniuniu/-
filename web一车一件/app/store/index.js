import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import vinQuery from './modules/vinQuery';
import oeQuery from './modules/oeQuery';
import substitute from './modules/substitute';
import partTree from './modules/partTree';
import user from './modules/user';
import partDetails from './modules/partDetails';
import partsList from './modules/partsList';
import payment from './modules/payment';

import { queryVehicleByVIN, queryOE } from '../api';
import { response_code, point_types } from '../config/constant';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

let cancelToken = null;

const store = new Vuex.Store({
  modules: {
    vinQuery,
    oeQuery,
    substitute,
    partTree,
    user,
    partDetails,
    partsList,
    payment,
  },
  state: {
    vin: '',
    oe: '',
    errorMessage: '',
    showDialog: false,
    vehicles: [],
    loading: false,
    error: false,
    ssoError: false,
  },
  actions: {
    parseVIN({ commit, state, dispatch }, { onSuccess, onVinQueryFailed }) {
      if (!state.vin || state.loading) {
        return;
      }

      commit('setLoading', true);
      commit('setVIN', state.vin.toUpperCase().replace(/\s*/g, '').replace(/[^0-9a-z]/gi, ''));

      const source = axios.CancelToken.source();
      cancelToken = source;

      queryVehicleByVIN(state.vin, {
        cancelToken: source.token,
      }).then(resp => {
        if (!resp) {
          return;
        }
        commit('setLoading', false);
        const { code, data, toastMessage } = resp.data;

        if (code === response_code.VIN_QUERY_FAILED) {
          return onVinQueryFailed();
        }

        if (code !== response_code.SUCCESS) {
          return commit('setErrorMessage', toastMessage);
        }

        commit('setErrorMessage', '');

        if (data.length === 1) {
          const vehicle = data[0];
          commit('vinQuery/setCurrentVehicle', {
            body: vehicle.body|| '',
            vinCode: vehicle.vinCode || '',
            optionCode: vehicle.optionCode,
            displacement: vehicle.displacement || '',
            motor: vehicle.displacement || '',
            modelYear: vehicle.modelYear || '',
            year: vehicle.year || '',
            carCountry: vehicle.carCountry|| '',
            carCountryCode: vehicle.carCountryCode || '',
            optionInfo: vehicle.optionInfo || '',
            carGrade: vehicle.carGrade || '',
            mjVehicleGroup: vehicle.mjVehicleGroup || '',
            engine: vehicle.engine || '',
            brand: vehicle.brand || '',
            chassis: vehicle.chassis || '',
            vehicleEn: vehicle.vehicleEn || '',
            subBrand: vehicle.subBrand || '',
            maker: vehicle.subBrand || '',
            mjVehicleSys: vehicle.mjVehicleSys || '',
            serial: vehicle.mjVehicleSys || '',
            drive: vehicle.drive || '',
            prefix: vehicle.prefix,
            priceZone: vehicle.priceZone || '',
            minPrice: vehicle.minPrice || '',
            transmission: vehicle.transmission || '',
            maxPrice: vehicle.maxPrice || '',
            brandId: vehicle.brandId || '',
            partNameList : vehicle.partNameList,
          });
          onSuccess([vehicle.vinCode, vehicle.subBrand]);
        } else if (data.length > 1) {
          const newVehicles = [];
          for (const index in data) {
            const vehicle = data[index];

            newVehicles.push({
              body: vehicle.body|| '',
              vinCode: vehicle.vinCode || '',
              optionCode: vehicle.optionCode,
              displacement: vehicle.displacement || '',
              motor: vehicle.displacement || '',
              modelYear: vehicle.modelYear || '',
              year: vehicle.year || '',
              carCountry: vehicle.carCountry|| '',
              carCountryCode: vehicle.carCountryCode || '',
              optionInfo: vehicle.optionInfo || '',
              carGrade: vehicle.carGrade || '',
              mjVehicleGroup: vehicle.mjVehicleGroup || '',
              engine: vehicle.engine || '',
              brand: vehicle.brand || '',
              chassis: vehicle.chassis || '',
              vehicleEn: vehicle.vehicleEn || '',
              subBrand: vehicle.subBrand || '',
              maker: vehicle.subBrand || '',
              mjVehicleSys: vehicle.mjVehicleSys || '',
              serial: vehicle.mjVehicleSys || '',
              drive: vehicle.drive || '',
              prefix: vehicle.prefix,
              priceZone: vehicle.priceZone || '',
              minPrice: vehicle.minPrice || '',
              transmission: vehicle.transmission || '',
              maxPrice: vehicle.maxPrice || '',
              brandId: vehicle.brandId || '',
              partNameList : vehicle.partNameList,
            });
          }

          commit('setVehicles', newVehicles);
          commit('setShowDialog', true);
        }

        dispatch('user/addPointByType', {
          type: point_types.VIN,
          vinCode: state.vin,
        });
      }).catch(error => {
        console.error(error);
        commit('setLoading', false);
      });
    },
    parseOE({ commit, state, dispatch }, { onSuccess }) {
      if (!state.oe || state.loading) {
        return;
      }

      commit('setLoading', true);
      commit('setOE', state.oe.toUpperCase().replace(/\s*/g, '').replace(/[^0-9a-z]/gi, ''));

      if (state.oe.length < 5) {
        commit('setErrorMessage', '未查询到结果，请输入5位以上的 OE 号！');
        return commit('setLoading', false);
      }

      const source = axios.CancelToken.source();
      cancelToken = source;
      queryOE({
        // businessId: state.user.businessId,
        partNumber: state.oe,
      }, {
        cancelToken: source.token,
      }).then(resp => {
        if (!resp) {
          return;
        }

        commit('setLoading', false);
        const { code, toastMessage, data } = resp.data;

        if (code !== response_code.SUCCESS) {
          commit('setErrorMessage', toastMessage);
          return commit('oeQuery/setPartList', []);
        }

        if (data && data.length) {
          dispatch('user/addPointByType', {
            type: point_types.OE,
            partNumber: state.oe,
          });
        }

        commit('setErrorMessage', '');
        if (data.length > 1) {
          commit('oeQuery/setPartList', data);
        } else {
          commit('oeQuery/setAccuratePart', data[0]);
        }
        commit('oeQuery/setOE', state.oe);
        onSuccess(state.oe);
      }).catch(error => {
        console.error(error);
        commit('setLoading', false);
      });
    },
    cancelRequest() {
      if (cancelToken) {
        cancelToken.cancel('Request canceled');
      }
      cancelToken = null;
    },
  },
  mutations: {
    clearState(state) {
      state.vin = '';
      state.oe = '';
      state.errorMessage = '';
    },
    setVIN(state, vin) {
      state.vin = vin;
      state.errorMessage = '';
    },
    setOE(state, oe) {
      state.oe = oe;
      state.errorMessage = '';
    },
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    setShowDialog(state, showDialog) {
      state.showDialog = showDialog;
    },
    setVehicles(state, vehicles) {
      state.vehicles = vehicles;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    setSsoError(state, ssoError) {
      state.ssoError = ssoError;
    },
  },
  strict: debug,
});

export default store;
