import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Empty, Skeleton, Popup } from 'vant';
import VueBus from 'vue-ts-bus';
import { Component } from 'vue-property-decorator';

Vue.use(Empty);
Vue.use(Skeleton);
Vue.use(Popup);

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
]);

Vue.use(VueBus);
// 在组件内使用
Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  render: h => h(App)
});
vm.$mount('#app');

/* 
在 `vue-ts-bus\index.d.ts` 中加入:
declare module "vue/types/vue" {
    interface Vue {
      $bus: any;
    }
} 

//  vm.$bus
*/
utools.onPluginEnter(({ code, type, payload }) => {
  utools.setExpendHeight(0); // 没有内容就不显示
  console.log('用户进入插件 beforeCreate：', code, type, payload);
  if (code === 'npm_search') {
    utools.setSubInput(({ text }) => {
      const txt = text.trim();
      if (!txt) {
        utools.setExpendHeight(0);
        return;
      }
      vm.$bus.emit('inputChange', text);
      // vm.$bus.emit("inputChange", text);
    }, '输入需要查询的包名');
    if (type === 'over') {
      utools.setSubInputValue(payload);
      // getSuggestionList(payload);
      vm.$bus.emit('inputChange', payload);
    }
  }
});
