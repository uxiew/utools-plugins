/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
const process = require('process');
const os = require('os');
const path = require('path');
const { remote } = require('electron');
const { execSync } = require('child_process');
const pkg = require('./plugin.json');
const Asar = require('../libs/asar/asar');
const { writeFileSync, readdirSync, readFileSync, rmdirSync, rmSync } = require('fs-extra');

window.toRequire = require;
window.readFileSync = readFileSync;
window.writeFileSync = writeFileSync;
window.rmdirSync = rmdirSync;
window.rmSync = rmSync;
window.Asar = Asar;

window.UPluginPath = path.join(utools.getPath('userData'), 'plugins');

/** 列出 utools 所有插件 */
window.getUtoolsPlugins = () => {
  //
  const tempArr = [];
  const list = readdirSync(UPluginPath).filter((filepath) => path.extname(filepath) === '.asar');
  list.forEach((file) => {
    const fullPath = path.join(UPluginPath, file);
    const arr = require(fullPath + '/plugin.json');
    arr.fileName = file;
    arr.fullPath = fullPath;
    tempArr.push(arr);
  });
  console.log(tempArr, utools.getPath('userData'));
  return tempArr;
};

window.UPluginFiles = getUtoolsPlugins();

window.showAboutDialog = () => {
  const isSnap = process.platform === 'linux' && process.env.SNAP && process.env.SNAP_REVISION;

  let detail = '';
  let commit = 'Unknown';
  let date = 'Unknown';

  if (process.env.NODE_ENV === 'production') {
    commit = pkg._commit || 'Unknown';
    date = pkg._commitDate || 'Unknown';
  } else {
    try {
      commit = execSync('git rev-parse HEAD')
        .toString()
        .replace(/[\r\n]/g, '');
      date = new Date(
        execSync('git log -1')
          .toString()
          .match(/Date:\s*(.*?)\n/)[1]
      ).toISOString();
    } catch (_err) {
      console.warn('Git not found in environment');
    }
  }

  detail =
    `Version: ${pkg.version}\n` +
    `Commit: ${commit}\n` +
    `Date: ${date}\n` +
    `Electron: ${process.versions.electron}\n` +
    `Chrome: ${process.versions.chrome}\n` +
    `Node.js: ${process.versions.node}\n` +
    `V8: ${process.versions.v8}\n` +
    `OS: ${os.type()} ${os.arch()} ${os.release()}${isSnap ? ' snap' : ''}`;

  const buttons = process.platform === 'linux' ? ['Copy', 'OK'] : ['OK', 'Copy'];

  console.log(detail);
  // remote.dialog
  //   .showMessageBox({
  //     title: pkg.name,
  //     type: 'info',
  //     message: pkg.name,
  //     detail: `\n${detail}`,
  //     buttons,
  //     noLink: true,
  //     defaultId: buttons.indexOf('OK'),
  //   })
  //   .then(({ response }) => {
  //     if (buttons[response] === 'Copy') {
  //       window.utools.copyText(detail);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
