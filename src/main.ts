// @ts-nocheck
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { timeAgo } from './utils/util';
import cacheCtrlMixin from './mixin';
import { Empty, Skeleton, Popup } from 'vant';
import { Component } from 'vue-property-decorator';

Vue.use(Empty);
Vue.use(Skeleton);
Vue.use(Popup);

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
]);

Vue.config.productionTip = false;

Vue.filter('timeAgo', (val: string) => {
  return timeAgo(val);
});

const vm = new Vue({
  router,
  store,
  render: h => h(App)
});
vm.$mount('#app');
Vue.mixin(cacheCtrlMixin);
