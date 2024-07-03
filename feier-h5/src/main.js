import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Bridge from "./plugin/bridge";
import "amfe-flexible";
import "./utils/flex";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
Vue.config.productionTip = false;
Vue.prototype.$bridge = Bridge;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
