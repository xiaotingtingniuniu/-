import http from './http';
export default {
  /**
   * 添加配件
   * 接口地址:https://wiki.dataenlighten.com/pages/viewpage.action?pageId=24741581
   */
  getProducts: async params => {
    console.log('params', params);
    return await http.post('/ycyj/alipay/listAvailableProducts', params);
  },
  /**
   * 添加配件
   * 接口地址:https://wiki.dataenlighten.com/pages/viewpage.action?pageId=24741555
   */
  pay:async params => {
    console.log('params', params);
    return await http.post('/ycyj/alipay/newPurchase', params);
  },
};
