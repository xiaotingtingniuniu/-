import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routePath = [
  {
    path: "/",
    name: "home",
    meta: { requiresAuth: true },
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/accessoriesList",
    name: "配件列表",
    meta: { requiresAuth: true },
    component: () => import("@/views/AccessoriesList.vue")
  },
  {
    path: "/distributor",
    name: "distributor",
    meta: { requiresAuth: true },
    component: () => import("@/views/Distributor.vue")
  },
  {
    path: "/details",
    name: "details",
    meta: { requiresAuth: true },
    component: () => import("@/views/Details.vue")
  },
  {
    path: "/contactInformation",
    name: "contactInformation",
    meta: { requiresAuth: true },
    component: () => import("@/views/contactInformation.vue")
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
  },
  {
    path: "/test",
    name: "test",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "./views/Test.vue")
  }
];
export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routePath
});
