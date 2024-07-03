import 'core-js/stable';

import Vue from 'vue';
import { Dialog, Input, Checkbox, Select, Option, Cascader } from 'element-ui';

import store from './store/login';

Vue.use(Dialog);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.prototype.$ELEMENT = { size: 'large' };

(async () => {
  const Login = (await import('./views/PageLogin.vue')).default;

  new Vue({
    el: '#app',
    render: h => h(Login),
    store,
  });
})();
