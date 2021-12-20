/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  toRequire: any;
  Asar: any;
  pathBasename: any;
  UPluginFiles: string[];
  execSync: any;
  ipcRenderer: any;
  renderRemote: any;
  showAboutDialog: any;
}
