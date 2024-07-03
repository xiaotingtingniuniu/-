import 'core-js/stable';

import Vue from 'vue';
import 'amfe-flexible';
import './utils/flex';
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './routers/h5.js';
import store from './store/h5';
import '@vant/touch-emulator';
import VueClipboard from 'vue-clipboard2';
Vue.use(Vant);
Vue.use(VueClipboard);
(async () => {
  const Quoted = (await import('./views/PageH5Index.vue')).default;

  new Vue({
    el: '#app',
    render: h => h(Quoted),
    router,
    store,
  });
})();
