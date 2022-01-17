/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue-monaco-cdn';

interface Window {
  monaco: any;
  toRequire: any;
  readFileSync: any;
  writeFileSync: any;
  rmSync: any;
  rmdirSync: any;
  Asar: any;
  pathBasename: any;
  UPluginFiles: any[];
  execSync: any;
  ipcRenderer: any;
  renderRemote: any;
  showAboutDialog: any;
}
