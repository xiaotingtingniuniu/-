/** 中台响应码 */
const response_code = Object.freeze({
  /** 请求成功 */
  SUCCESS: "0000",
  /** 过期 */
  EXPIRED: "9002",
  /** 验证码不正确 */
  VERIFY_CODE_INCORRECT: "9006",
  /** 在其他设备登陆 */
  LOGIN_ON_OTHER_DEVICES: "9014",
  /** 访问频繁 */
  FREQUENT_VISITS: "9000007",
  TIMEOUT: "9000003"
});
let baseUrl = ""; //默认的url
switch (process.env.NODE_ENV) {
  case "development":
    baseUrl = "https://paictest.dataenlighten.com:8012"; //dev环境地址
    // baseUrl = "https://api.dataenlighten.com:7045"; //uat环境地址
    // baseUrl = "https://api.dataenlighten.com:8045"; //生产环境地址
    break;
  // case "development":
  //   baseUrl = "https://api.dataenlighten.com:7045"; //dev环境地址
  //   break;
  case "test":
    baseUrl = "https://api.dataenlighten.com:7045"; //uat环境地址
    break;
  case "ppt":
    baseUrl = "https://ppt-server.dataenlighten.com:8045"; //ppt环境地址
    break;
  case "production":
    baseUrl = "https://api.dataenlighten.com:8045"; //生产环境地址
    break;
}
export { response_code, baseUrl };
