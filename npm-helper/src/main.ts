// @ts-nocheck
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { timeAgo } from './utils/util';
import cacheCtrlMixin from './mixin';
import {
  Cell,
  CellGroup,
  Col,
  Row,
  Empty,
  Button,
  Skeleton,
  Icon,
  Notify,
  Toast,
  Popup,
  Popover
} from 'vant';
import { Component } from 'vue-property-decorator';
import VueCodeMirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

Vue.use(VueCodeMirror);
Vue.use(Empty);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
Vue.use(Skeleton);
Vue.use(Icon);
Vue.use(Notify);
Vue.use(Toast);
Vue.use(Popup);
Vue.use(Popover);

// 将所有 loading Toast 设置为背景不可点击
Toast.setDefaultOptions('loading', {
  message: '加载中...',
  forbidClick: true
});

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
