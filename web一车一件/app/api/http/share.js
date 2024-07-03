import axios from './default';
import { appVersion, common_params } from '../../config/constant';

const http = axios.create();
http.interceptors.request.use(
  config => {
    config.data.productCode = common_params.PRODUCT_CODE;
    config.data.version = appVersion;
    return config;
  },
  error => {
    console.error('error', error);
    return Promise.reject(error);
  },
);
http.interceptors.response.use(
  response => {
    console.log('response', response);
    return response;
  },
  error => {
    console.error('error', error);
    return Promise.reject(error);
  },
);

export default http;
