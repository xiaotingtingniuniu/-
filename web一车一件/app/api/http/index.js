import Cookies from 'js-cookie';

import axios from './default';
import { logout } from '..';
import * as Message from '../../utils/message';
import { appVersion, response_code, common_params } from '../../config/constant';
import store from '../../store';

const http = axios.create();

const auth = Cookies.getJSON('auth');
if (auth) {
  http.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
  http.defaults.headers.common['userinfo'] = auth.phoneNumber;
}

http.interceptors.request.use(
  config => {
    const auth = Cookies.getJSON('auth');
    if (auth) {
      if (auth.registerType === '2' && auth.roleName.length < 1) {
        // 需要完善信息
        // alert('跳转到完善信息页面');
        window.location.replace('login.html');
      } else {
        // alert('不需要完善信息直接可以访问');
      }
    } else {
      logout();
    }

    config.data.productCode = common_params.PRODUCT_CODE;
    config.data.version = appVersion;
    Message.show();
    return config;
  },
  error => {
    Message.hide();
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  response => {
    Message.hide();

    switch (response.data.code) {
      case response_code.EXPIRED:
        logout();
        break;
      case response_code.LOGIN_ON_OTHER_DEVICES:
        store.commit('setSsoError', true);
        break;
      default:
        return response;
    }
  },
  error => {
    Message.hide();
    if (!axios.isCancel(error)) {
      store.commit('setError', true);
    }

    return Promise.reject(error);
  },
);

export default http;
