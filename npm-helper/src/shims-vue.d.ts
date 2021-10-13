/* eslint-disable prettier/prettier */
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare const utools: any;

declare module '*.png';
declare module '*.jpg';

declare module 'prismjs/components/index';
declare module 'audio-player';
declare module 'js-downloadfiles';

declare interface Window {
  utoolsState: any;
  requireMoudle: any;
  collection: any;
}

/*
declare module "vue/types/vue" {
  interface Vue {
    // ...// 以下是在main.ts中挂载到Vue.prototype上的变量
    $router: any;
    $api: any;
    $mock: any;
    $configs: any;
    $bus: any;
  }
} */
