import Vue from 'vue';
import VueRouter from 'vue-router';
import { router_names } from '../config/constant';

Vue.use(VueRouter);

const routes = [
  {
    name: router_names.QUOTED,
    path: '/quoted',
    component: () => import('views/Quoted.vue'),
  },
  {
    name: router_names.NOQUOTED,
    path: '/',
    component: () => import('views/Noquoted.vue'),
  },
  {
    name: router_names.PERSONALINFOR,
    path: '/perosnal',
    component: () => import('views/H5PersonalInfor.vue'),
  },
  {
    name: router_names.GOQUOTED,
    path: '/goquoted',
    component: () => import('views/GoQuoted.vue'),
  },
  {
    name: router_names.WECHAT,
    path: '/gowechat',
    component: () => import('views/GoWechat.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
