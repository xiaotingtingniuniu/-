import axios from './default';
import Cookies from 'js-cookie';
const http = axios.create();
const auth = Cookies.getJSON('auth');
if (auth) {
  http.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
}
// http.interceptors.request.use(
//   config => {
//     config.data.append('productCode', common_params.PRODUCT_CODE);
//     config.data.append('version', appVersion);
//     return config;
//   },
//   error => Promise.reject(error)
// );

export default http;