import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'List',
    component: () => import('@/views/List/List.vue')
  },
  {
    path: '/Detail',
    name: 'Detail',
    component: () => import('@/views/Detail/Detail.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
