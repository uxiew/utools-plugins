const { shell } = require('electron');
const fs = require('fs');

// declare global {
//   interface Window {
//     exportFuncs: any; // 外部到处的所有方法集合
//   }
// }

window.exportFuncs = {
  openExternal: function(url) {
    shell.openExternal(url);
  }
};

window.fs = fs;

// window.exports = {};
