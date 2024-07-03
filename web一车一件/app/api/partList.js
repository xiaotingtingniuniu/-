import http from './http';
import httpShare from './http/share';
import httpApp from './http/app';
export default {
  /**
   * 添加配件
   * 接口地址:https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233125
   */
  addPart: async params => {
    console.log('params', params);
    return await http.post('/ycyj/shortlist/addItem', params);
  },
  /**
   * 获取当前清单内配件个数
   * 接口地址:https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233370
   */
  countPart: async params => {
    console.log('params', params);
    return await http.post('/ycyj/shortlist/countPart', params);
  },
  /**
   * 查看当前配件清单
   * 接口地址:https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233128
   */
  getPartsList: async params => {
    console.log('params', params);
    return await http.post('/ycyj/shortlist/view', params);
  },
  /**
   * 删除清单中配件
   * 接口地址:https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233180
   */
  deletePartsList: async params => {
    console.log('params', params);
    return await http.post('/ycyj/shortlist/remove', params);
  },

  /**
   * 提交配件清单
   * 接口地址：https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233139
   */
  submitPartsList: async params => {
    console.log('params', params);
    return await http.post('/ycyj/order/submit', params);
  },

  /**
   * 按照时间分组查看历史清单列表
   * 接口地址：https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233291
   */
  getHistoryByDate: async params => {
    console.log('params', params);
    return await http.post('/ycyj/order/listByDate', params);
  },

  /**
   * 树型查询报价清单列表（我创建）
   * https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=29787004
   */
  getMyCreate: async params => {
    console.log('params', params);
    return await http.post('/ycyj/bid/asCreator/tree', params);
  },

  /**
   * 树型查询报价清单列表（他人创建）
   * https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=29787016
   */
  getOthersCreate: async params => {
    console.log('params', params);
    return await http.post('/ycyj/bid/asBidder/tree', params);
  },

  /**
   * 查看历史清单详情 web使用
   * 接口地址：https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233144
   */
  getHistoryOrderDetails: async params => {
    console.log('params', params);
    return await http.post('ycyj/order/view/v2', params);
  },
  /**
   * 修改历史清单基础信息
   */
  getOrderUpdate: async params => {
    console.log('params', params);
    return await http.post('ycyj/order/update', params);
  },
  /**
   * 获取分享历史清单详情
   * 接口地址：https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233146
   */
  getShareHistoryList: async params => {
    console.log('params', params);
    return await httpShare.post('/ycyj/order/viewReceipt', params);
  },

  /** 查看历史清单详情 V2 (token 从url传入) h5使用
   * 接口地址： https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=27003005
  */
  getHistoryOrderDetailsV2: async params => {
    console.log('params', params);
    return httpApp.post('ycyj/order/view/v2', params);
  },

  /** 查看历史清单详情 V2 (token 从web登录 cookie中拿到)
   * 接口地址： https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=27003005
   */
  getHistoryOrderDetailsV2WEB: async params => {
    console.log('params', params);
    return http.post('ycyj/order/view/v2', params);
  },

  /** 创建报价并提交 (token 从url传入)
   * 接口地址：https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=30933173
   */
  createAndSubmit: async params => {
    console.log('params', params);
    return httpApp.post('/ycyj/bid/createAndSubmit', params);
  },
  /** 创建报价并提交 (token 从web登录 cookie中拿到)
   * 接口地址：https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=30933173
   */

  createAndSubmitWeb: async params => {
    console.log('params', params);
    return http.post('/ycyj/bid/createAndSubmit', params);
  },

  /** 查看报价清单详情 (token 从url传入)
   * 接口地址：https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=29786650
   */

  getHistoryQuotedDetails: async params => {
    console.log('params', params);
    return httpApp.post('/ycyj/bid/view', params);
  },
  /** 查看报价清单详情 (token 从web登录 cookie中拿到)
   * 接口地址：https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=29786650
   */

  getHistoryQuotedDetailsWeb: async params => {
    console.log('params', params);
    return http.post('/ycyj/bid/view', params);
  },
  /**
   * 查询报价清单列表（收到报价）
   * 接口地址：https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=29787026
   */
  getOthersQuoted: async params => {
    console.log('params', params);
    return http.post('/ycyj/bid/asCreator/list', params);
  },
  /**
   * 查询报价清单列表（我的报价）
   * 接口地址：https://de-wiki.dataenlighten.com/pages/viewpage.action?pageId=29786640
   */
  getMyQuoted: async params => {
    console.log('params', params);
    return http.post('/ycyj/bid/asBidder/list', params);
  },
  getCountReadyToView: async params => {
    console.log('params', params);
    return http.post('/ycyj/bid/countReadyToView', params);
  },
};
