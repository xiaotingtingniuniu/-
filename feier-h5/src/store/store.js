import Vue from "vue";
import Vuex from "vuex";
import accessoriesServices from "../services/accessoriesServices";
import { response_code } from "../config/constant";
import { Toast } from "vant";
Vue.use(Vuex).use(Toast);
export default new Vuex.Store({
  state: {
    header: "编辑",
    headerDistributor: "配件列表", //分享的 经销商配件列表的头部
    authorization: "", //token票据
    productCode: "", //产品码
    list: [], //配件列表
    distributor: [], //经销商列表
    isLoading: false, //加载
    selectAll: false, //全选按钮是否选中
    accessoriesListTotalPage: 1, //配件列表的总页数
    orderNo: "", //订单号
    distributorListTotalPage: 1, //经销商配件列表的总页数
    canGoToInformation: false, //是否可以跳转到联系方式页面
    contactInformation: {
      supplierName: null, //经销商名称
      address: null, //地址
      contact: null, //联系人
      mobile: null, //电话号码
      wechat: null, //微信号
      phoneErrorMessage: null, //电话号码错误提示
      email: null, //邮箱
      mailboxErrorMessage: null, //邮箱错误提示
      qq: null, //qq号
      qqErrorMessage: null //qq号错误提示
    }, //分享出去的H5的联系信息
    contactInformationApp: {}, //app内的联系信息
    bannerImageList: [] //banner数组
  },
  mutations: {
    /**
     * 修改header状态
     * @param {*} state 状态 state
     * @param {*} header 展示header状态
     */
    setHeader(state, header) {
      state.header = header;
    },
    /**
     * 修改经销商列表的头部
     * @param {*} state 状态 state
     * @param {*} headerDistributor //列表页
     */
    setHeaderDistributor(state, headerDistributor) {
      state.headerDistributor = headerDistributor;
    },
    /**
     * 设置token票据
     * @param {*} state 状态 state
     * @param {*} authorization token票据
     */
    setAuthorization(state, authorization) {
      state.authorization = authorization;
    },
    /**
     *设置产品码
     * @param {*} state 状态 state
     * @param {*} productCode 产品码
     */
    setProductCode(state, productCode) {
      state.productCode = productCode;
    },
    /**
     * 设置列表
     * @param {*} state 状态 state
     * @param {*} list 产品码
     */
    setList(state, list) {
      state.list = list;
    },
    /**
     * 设置经销商列表
     * @param {*} state 状态 state
     * @param {*} list distributor
     */
    setDistributor(state, distributor) {
      state.distributor = distributor;
    },
    /**
     * 设置加载loading
     * @param {*} state 状态 state
     * @param {*} loading 加载状态
     */
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    /**
     * 设置全选是否选中
     * @param {*} state 状态 state
     * @param {*} selectAll 是否选中
     */
    setSelectAll(state, selectAll) {
      state.selectAll = selectAll;
    },
    /**
     * 设置配件列表的总页数
     * @param {*} state 状态 state
     * @param {*} totalPage  总页数
     */
    setAccessoriesTotalPage(state, totalPage) {
      state.accessoriesListTotalPage = totalPage;
    },
    /**
     * 设置经销商配件列表的总页数
     * @param {*} state 状态 state
     * @param {*} totalPage  总页数
     */
    setDistributorListTotalPage(state, totalPage) {
      state.distributorListTotalPage = totalPage;
    },
    /**
     * 设置订单号
     * @param {*} state 状态 state
     * @param {*} orderNo 订单号
     */
    setOrderNo(state, orderNo) {
      state.orderNo = orderNo;
    },
    /**
     * 设置跳转到联系方式页面标志
     * @param {*} state 状态 state
     * @param {*} canGoToInformation 标志
     */
    setCanGoToInformation(state, canGoToInformation) {
      state.canGoToInformation = canGoToInformation;
    },
    /**
     * 设置联系人信息(H5)
     * @param {*} state 状态 state
     * @param {*} contactInformation 联系人信息
     */
    setContactInformation(state, contactInformation) {
      state.contactInformation = contactInformation;
    },
    /**
     * 设置联系人信息(App)
     * @param {*} state 状态 state
     * @param {*} contactInformationApp 联系人信息
     */
    setContactInformationApp(state, contactInformationApp) {
      state.contactInformationApp = contactInformationApp;
    },
    /**
     * 设置banner图list
     * @param {*} state 状态 state
     * @param {*} bannerImageList banner 数组
     */
    setBannerImageList(state, bannerImageList) {
      state.bannerImageList = bannerImageList;
    }
  },
  actions: {
    accessoriesList({ commit, state }, params) {
      console.log("params", params);
      // commit("setLoading", true);
      accessoriesServices
        .getAccessoriesList(params)
        .then(res => {
          // commit("setLoading", false);
          console.log("res", res);
          console.log("isLoading", state.isLoading);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (data === null) {
            // Toast.fail("暂无列表");
            return;
          } else if (code === response_code.SUCCESS) {
            //访问成功
            console.log("list", state.list);
            const list = state.list.concat(data.cartList);
            console.log("data.totalPage", data.totalPage);
            commit("setAccessoriesTotalPage", data.totalPage);
            console.log(state.accessoriesListTotalPage);
            console.log("list", list);
            list.map((item, index) => {
              item.isChecked = false;
              item.index = index;
              console.log("index", index);
              console.log("item", item);
            });
            commit("setList", list);
          } else if (
            code === response_code.TIMEOUT ||
            code === response_code.EXPIRED
          ) {
            commit("setList", []);
            console.log("list", state.list.length);
            Toast.fail(toastMessage);
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    createOrder({ commit, state }, params) {
      accessoriesServices
        .setCreateOrder(params)
        .then(res => {
          // commit("setLoading", false);
          console.log("res", res);
          console.log("isLoading", state.isLoading);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            //访问成功
            console.log("orderNo", data.orderNo);
            commit("setOrderNo", data.orderNo);
            console.log("state.orderNo", state.orderNo);
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    distributorList({ commit, state }, params) {
      accessoriesServices
        .getDistributorList(params)
        .then(res => {
          console.log("res", res);
          console.log("state", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          console.log("data", data);
          if (data === null) {
            // Toast.fail("暂无列表");
            return;
          } else if (code === response_code.SUCCESS) {
            //访问成功
            const distributor = state.distributor.concat(data.partList);
            console.log("data.totalPage", data.totalPage);
            commit("setDistributorListTotalPage", data.totalPage);
            console.log(state.distributorListTotalPage);
            console.log("distributor", distributor);
            commit("setDistributor", distributor);
            console.log("state.distributor", state.distributor);
            console.log("supplierInfo", data.supplierInfo);
            if (data.supplierInfo) {
              console.log("该订单为子订单");
              commit("setContactInformation", data.supplierInfo);
              commit("setHeader", "联系信息");
              console.log("state.contactInformation", state.contactInformation);
              console.log("state.header", state.header);
            } else {
              console.log("该订单为父订单");
              commit("setHeader", "");
              console.log("state.header", state.header);
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    cartDeleteList({ commit, state }, params) {
      accessoriesServices
        .delettCartList(params)
        .then(res => {
          console.log("res", res);
          console.log("isLoading", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            if (toastMessage === "成功") {
              Toast.success(toastMessage);
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          // commit("setLoading", false);
          Toast.fail(err);
        });
    },
    cartUpdateCount({ commit, state }, params) {
      accessoriesServices
        .updateCount(params)
        .then(res => {
          console.log("res", res);
          console.log("state", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            if (toastMessage === "成功") {
              // Toast.success();
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    quotation({ commit, state }, success) {
      const orderNo = state.orderNo;
      console.log("orderNo", orderNo);
      let {
        supplierName,
        contact,
        mobile,
        address,
        wechat,
        qq,
        email
      } = state.contactInformation;
      if (wechat === null) {
        wechat = "";
      }
      if (qq === null) {
        qq = "";
      }
      if (email === null) {
        email = "";
      }
      const supplierInfo = {
        supplierName: supplierName,
        contact: contact,
        mobile: mobile,
        address: address,
        wechat: wechat,
        qq: qq,
        email: email
      };
      const partList = [];
      state.distributor.map((item, index) => {
        console.log("item", item);
        if (item.quotedPrice != null) {
          partList.push(item);
        }
      });
      const params = {
        orderNo: orderNo,
        supplierInfo: supplierInfo,
        partList: partList
      };
      accessoriesServices
        .distributorQuotation(params)
        .then(res => {
          console.log("res", res);
          console.log("isLoading", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            if (toastMessage === "成功") {
              success(data);
            } else {
              Toast.fail(toastMessage);
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    sendEmail({ commit, state }, params) {
      accessoriesServices
        .sendEmailTo(params)
        .then(res => {
          console.log("res", res);
          console.log("state", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            if (toastMessage === "成功") {
              Toast.success("发送邮件成功");
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    getImageUrl({ commit, state }, success) {
      const orderNo = state.orderNo;
      accessoriesServices
        .createImg({
          orderNo: orderNo
        })
        .then(res => {
          console.log("res", res);
          console.log("state", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            if (toastMessage === "成功") {
              success(data);
              Toast.success("截图成功，请在相册中查找");
            } else {
              Toast.fail(toastMessage);
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    },
    getBannerImageList({ commit, state }, params) {
      accessoriesServices
        .getBanner(params)
        .then(res => {
          console.log("res", res);
          console.log("state", state);
          if (!res) {
            return;
          }
          const { code, data, toastMessage } = res.data;
          if (code === response_code.SUCCESS) {
            if (toastMessage === "成功") {
              const bannerList = data;
              console.log("bannerList", bannerList);
              commit("setBannerImageList", bannerList);
              console.log("state.bannerImageList", state.bannerImageList);
            } else {
              Toast.fail(toastMessage);
            }
          } else {
            Toast.fail(toastMessage);
          }
        })
        .catch(err => {
          console.log("err", err);
          Toast.fail(err);
        });
    }
  }
});
