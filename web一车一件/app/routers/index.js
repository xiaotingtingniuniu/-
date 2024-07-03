import Vue from 'vue';
import VueRouter from 'vue-router';
import { router_names } from '../config/constant';

Vue.use(VueRouter);

const routes = [
  {
    name: router_names.HOME,
    path: '/',
    component: () => import('views/PageHome.vue'),
  },
  {
    name: router_names.USER,
    path: '/user',
    component: () => import('views/PageUserCenter.vue'),
  },
  {
    name: router_names.VIN,
    path: '/vin',
    component: () => import('views/PageVin.vue'),
  },
  {
    name: router_names.PART_TREE,
    path: '/part-tree',
    component: () => import('views/PagePartTree.vue'),
  },
  {
    name: router_names.PART_DETAILS,
    path: '/part-details',
    component: () => import('views/PagePartDetails.vue'),
  },
  {
    name: router_names.SUBSTITUTE,
    path: '/substitute/:oe',
    component: () => import('views/PageSubstitute.vue'),
  },
  {
    name: router_names.OE,
    path: '/oe',
    component: () => import('views/PageOe.vue'),
  },
  {
    name: router_names.VEHICLE_GROUP,
    path: '/vehicle-group',
    component: () => import('views/PageVehicleGroup.vue'),
  },
  {
    name: router_names.OE_PART_DETAILS,
    path: '/oe-part-details',
    component: () => import('views/PagePartDetails.vue'),
  },
  {
    name: router_names.PARTSLIST,
    path: '/parts-list',
    component: () => import('views/PartsList.vue'),
  },
  {
    name: router_names.HISTORYLIST,
    path: '/history-list',
    component: () => import('views/HistoryList.vue'),
  },
  // {
  //   name: router_names.HISTORYLIST,
  //   path: '/share-history-list',
  //   component: () => import('views/ShareHistoryList.vue'),
  // },
  {
    name: 'pay',
    path: '/pay',
    component: () => import('views/Pay.vue'),
  },
  {
    name: 'hometest',
    path: '/home-test',
    component: () => import('views/HomeTest.vue'),
  },
  {
    name: router_names.NOQUOTED,
    path: '/no_quoted',
    component: () => import('views/Noquoted.vue'),
  },
  {
    name: router_names.QUOTED,
    path: '/quoted',
    component: () => import('views/Quoted.vue'),
  },
  {
    path: '*',
    redirect: {
      path: '/',
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
