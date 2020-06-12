declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.png';
declare module '*.jpg';

declare module 'prismjs/components/index';

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
