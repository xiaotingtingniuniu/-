import 'core-js/stable';

import Vue from 'vue';
import { Dialog, Input, Checkbox, Select, Option, Cascader } from 'element-ui';
import 'amfe-flexible';
import './utils/flex';
import store from './store/login';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Dialog);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Vant);
Vue.prototype.$ELEMENT = { size: 'large' };

(async () => {
  const Share = (await import('./views/ShareHistoryList.vue')).default;

  new Vue({
    el: '#app',
    render: h => h(Share),
    store,
  });
})();
