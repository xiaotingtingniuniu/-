import 'core-js/stable';

import Vue from 'vue';

Vue.prototype.$ELEMENT = { size: 'large' };

(async () => {
  const Agreement = (await import('./views/Agreement.vue')).default;

  new Vue({
    el: '#app',
    render: h => h(Agreement),
  });
})();
