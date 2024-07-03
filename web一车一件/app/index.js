import 'core-js/es/object/entries';
import Vue from 'vue';

import { CollapseItem, Collapse, Button, Cascader, Carousel, CarouselItem, DatePicker, Dialog, Dropdown, DropdownItem, DropdownMenu, Form, FormItem, Input, Loading, Menu, MenuItem, Message, Option, Radio, Select, Table, TableColumn, TabPane, Tabs, Tooltip, Divider, Badge } from 'element-ui';
import VueClipboard from 'vue-clipboard2';

import store from './store';
import router from './routers';
import 'default-passive-events';
Vue.use(Cascader);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Loading.directive);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Option);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(TabPane);
Vue.use(Tabs);
Vue.use(Tooltip);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Divider);
Vue.use(Badge);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

Vue.use(VueClipboard);

Vue.prototype.$vuescrollConfig = {
  scrollPanel: {
    scrollingX: false,
  },
  bar: {
    background: '#dadfe6',
    opacity: 0.4,
    hoverStyle: {
      background: '#dadfe6',
      opacity: 0.4,
    },
  },
};

Vue.prototype.$ELEMENT = { size: 'large' };

(async () => {
  const Index = (await import('./views/PageIndex.vue')).default;

  new Vue({
    el: '#app',
    render: h => h(Index),
    router,
    store,
  });
})();
