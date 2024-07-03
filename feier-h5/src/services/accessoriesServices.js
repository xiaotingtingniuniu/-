import httpUtils from "../utils/http";
import config from "../config/config.json";
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);
const { http } = httpUtils;
const { accessoriesModule } = config;
const getAccessoriesList = async params => {
  const url = accessoriesModule.accessoriesList;
  return await http.post(url, params);
};
const delettCartList = async params => {
  const url = accessoriesModule.cartDeleteList;
  return await http.post(url, params);
};
const updateCount = async params => {
  const url = accessoriesModule.cartUpdateCount;
  return await http.post(url, params);
};
const getDistributorList = async params => {
  const url = accessoriesModule.distributorList;
  return await http.post(url, params);
};
const setCreateOrder = async params => {
  const url = accessoriesModule.createOrder;
  return await http.post(url, params);
};
const distributorQuotation = async params => {
  const url = accessoriesModule.quotation;
  return await http.post(url, params);
};
const sendEmailTo = async params => {
  const url = accessoriesModule.sendEmail;
  return await http.post(url, params);
};
const createImg = async params => {
  const url = accessoriesModule.createImg;
  return await http.post(url, params);
};
const getBanner = async params => {
  const url = accessoriesModule.getBanner;
  return await http.post(url, params);
};
export default {
  getAccessoriesList,
  delettCartList,
  updateCount,
  getDistributorList,
  setCreateOrder,
  distributorQuotation,
  sendEmailTo,
  createImg,
  getBanner
};
