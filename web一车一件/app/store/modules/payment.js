import API from '../../api/payment';
import { response_code } from '../../config/constant';
import { Message } from 'element-ui';
// import axios1 from '../../api/http/default';
const state = {
  productInfo: [],
  productArr: [],
};
const mutations = {
  /**
   * 设置配件清单总数
   * @param {*} state
   * @param {*} partsListTotal 配件清单总数
   */
  setProductInfo(state, productInfo) {
    state.productInfo = productInfo;
  },
};
const actions = {
  /** 查询用户可选产品 */
  getProducts({ commit }, params) {
    API.getProducts(params)
      .then(res => {
        console.log(res);
        console.log('commit', commit);
        const { code, toastMessage, data } = res.data;
        const productArr = [];
        if (code === response_code.SUCCESS) {
          console.log('data', data);
          console.log('toastMessage', toastMessage);
          data.map((item, index) => {
            console.log('item', item);
            console.log('index', index);
            productArr.push(item.productNumber);
            return item;
          });
          console.log('productArr', productArr);
          console.log(productArr.indexOf('individual'));
          console.log(productArr.indexOf('professional'));
          console.log(productArr.indexOf('standard'));
          commit('setProductInfo', productArr);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },
  /** pay */
  pay({ commit }, params) {
    API.pay(params)
      .then(res => {
        console.log('res', res);
        const { code, toastMessage, data } = res.data;
        if (code === response_code.SUCCESS) {
          // const routerData = this.$router.resolve({ path:'/ finance / applyText', query:{ htmls:res.data.result } });
          // window.open(routerData.href, '_ blank');
          const div = document.createElement('div');
          div.innerHTML = data;
          document.body.appendChild(div);
          document.forms[0].submit();
          console.log('commit', commit);
        } else {
          Message({
            message: toastMessage,
            type: 'error',
          });
        }
      })
      .catch(err => {
        console.error('err', err);
      });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
