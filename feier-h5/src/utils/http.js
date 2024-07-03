import Vue from "vue";
import axios from "axios";
import { Toast } from "vant";
import { response_code, baseUrl } from "../config/constant.js";
Vue.use(Toast);
const http = axios.create();
console.log("http", http.defaults.headers);
// alert(JSON.stringify(http.defaults.headers.common.Authorization));
// const AccessToken = localStorage.getItem("mjToolsToken")
//   ? localStorage.getItem("mjToolsToken")
//   : localStorage.getItem("token");
// http.defaults.headers.common.Authorization =
//   "bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbnVzZXIiOiJTTVM6MTMxMDIxMDM3MzM6MTU2MzQyMDg4OTc5Njo2MDQ4MDAifQ.1ntUYvoOvBZOz4g368dnkolM4sfTNE61MJABZ95Y6IDuGYLEpl025pV8GxO5od_Cr70A6sVdV96NWWscKvBeFw";
// http.defaults.headers.common["Product-Code"] = "MFI01";
http.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
http.interceptors.request.use(
  cfg => {
    // Do something before request is sent
    const httpCfg = cfg;
    httpCfg.baseURL = baseUrl;
    console.log("httpCfg.baseURL", httpCfg.baseURL);
    return httpCfg;
  },
  error => {
    // Do something with request error
    // 将遇到的问题抛出方便解决
    console.log("something error here, please process");
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  response => {
    // Do something with response data
    // 将响应拦截器设置
    if (
      response.data.code !== response_code.SUCCESS &&
      response.data.code !== "20004"
    ) {
      if (response.data.ResponseCode === "8000001") {
        Toast.success(response.data.toastMessage);
      } else {
        // message.error(response.data.toastMessage);
        Toast.fail(response.data.toastMessage);
      }
    }
    console.log("response.data.code", response.data.code);
    return response;
  },
  error => {
    console.log("something error here, please process");
    // Do something with response error
    return Promise.reject(error);
  }
);

// 无任何配置的http，方便一些三方接口的定义;
const httpNoIntercept = axios.create();

export default { http, httpNoIntercept };
