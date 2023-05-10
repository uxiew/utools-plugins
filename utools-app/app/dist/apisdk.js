'use strict';
const { ipcRenderer } = require('electron');
const ws = require('./ws.js');

const ipcSendSync = (e, n) => {
  const t = ipcRenderer.sendSync('plugin.api', e, n);
  if (t instanceof Error) throw t;
  return t;
};
const ipcSend = (e, n) => {
  ipcRenderer.send('plugin.api', e, n);
};
const ipcInvoke = async (e, n) => {
  try {
    return await ipcRenderer.invoke('plugin.api', e, n);
  } catch (e) {
    throw new Error(e.message.replace(/^.*?Error:/, '').trim());
  }
};

window.utools = Object.freeze({
  __event__: {},
  onExtensionMessage: (e) => {
    'function' == typeof e && (window.utools.__event__.onExtensionMessage = e);
  },
  sendExtensionMessage: (e) => {
    ipcInvoke('wsSendMessage', e)
  },
  onPluginReady: (e) => {
    'function' == typeof e && (window.utools.__event__.onPluginReady = e);
  },
  onPluginEnter: (e) => {
    'function' == typeof e && (window.utools.__event__.onPluginEnter = e);
  },
  onPluginOut: (e) => {
    'function' == typeof e && (window.utools.__event__.onPluginOut = e);
  },
  onPluginDetach: (e) => {
    'function' == typeof e && (window.utools.__event__.onPluginDetach = e);
  },
  onDbPull: (e) => {
    'function' == typeof e && (window.utools.__event__.onDbPull = e);
  },
  hideMainWindow: (e) =>
    !1 === e
      ? (ipcSend('hideMainWindow', !1), !0)
      : ipcSendSync('hideMainWindow', !0),
  showMainWindow: () => ipcSendSync('showMainWindow'),
  setExpendHeight: (e) => ipcSendSync('setExpendHeight', e),
  setSubInput: (e, n = '', t = !0) =>
    'function' == typeof e &&
    ((window.utools.__event__.onSubInputChange = e),
    ipcSendSync('setSubInput', {
      placeholder: n,
      isFocus: t
    })),
  removeSubInput: () => (
    delete window.utools.__event__.onSubInputChange,
    ipcSendSync('removeSubInput')
  ),
  setSubInputValue: (e) => ipcSendSync('setSubInputValue', e),
  subInputFocus: () => ipcSendSync('subInputFocus'),
  subInputSelect: () => ipcSendSync('subInputSelect'),
  subInputBlur: () => ipcSendSync('subInputBlur'),
  createBrowserWindow: (e, n, t) => {
    'function' == typeof t &&
      (window.utools.__event__.createBrowserWindowCallback = t);
    const o = ipcSendSync('createBrowserWindow', {
        url: e,
        options: n
      }),
      i = o.id;
    return (
      o.methods.forEach((e) => {
        o[e] = (...n) =>
          ipcSendSync('pluginBrowserWindowMethod', {
            id: i,
            method: e,
            args: n
          });
      }),
      delete o.methods,
      o.invokes.forEach((e) => {
        o[e] = (...n) =>
          ipcInvoke('pluginBrowserWindowInvoke', {
            id: i,
            method: e,
            args: n
          });
      }),
      delete o.invokes,
      o.webContents.methods.forEach((e) => {
        o.webContents[e] = (...n) =>
          ipcSendSync('pluginBrowserWindowMethod', {
            id: i,
            target: 'webContents',
            method: e,
            args: n
          });
      }),
      delete o.webContents.methods,
      o.webContents.invokes.forEach((e) => {
        o.webContents[e] = (...n) =>
          ipcInvoke('pluginBrowserWindowInvoke', {
            id: i,
            target: 'webContents',
            method: e,
            args: n
          });
      }),
      delete o.webContents.invokes,
      o
    );
  },
  outPlugin: () => {
    ipcSend('outPlugin');
  },
  isDarkColors: () => ipcSendSync('isDarkColors'),
  getUser: () => ipcSendSync('getUser'),
  fetchUserServerTemporaryToken: () =>
    ipcInvoke('fetchUserServerTemporaryToken'),
  getUserServerTemporaryToken: () => ipcSendSync('getUserServerTemporaryToken'),
  openPayment: (e, n) => {
    'function' == typeof n
      ? (window.utools.__event__.openPaymentCallback = n)
      : delete window.utools.__event__.openPaymentCallback,
      ipcSendSync('openPayment', e);
  },
  fetchUserPayments: () => ipcInvoke('fetchUserPayments'),
  openPaymentPermanent: (e, n) => {
    'function' == typeof n
      ? (window.utools.__event__.openPaymentCallback = n)
      : delete window.utools.__event__.openPaymentCallback,
      ipcSendSync('openPayment', {
        ...e,
        permanent: 1
      });
  },
  isPermanentUser: () => ipcSendSync('isPermanentUser'),
  setFeature: (e) => ipcSendSync('setFeature', e),
  removeFeature: (e) => ipcSendSync('removeFeature', e),
  getFeatures: (e) => ipcSendSync('getFeatures', e),
  redirect: (e, n) =>
    ipcSendSync('redirect', {
      label: e,
      payload: n
    }),
  getIdleUBrowsers: () => ipcSendSync('getIdleUBrowsers'),
  setUBrowserProxy: (e) => ipcSendSync('setUBrowserProxy', e),
  clearUBrowserCache: () => ipcSendSync('clearUBrowserCache'),
  showNotification: (e, n) => {
    ipcSend('showNotification', {
      body: e,
      clickFeatureCode: n
    });
  },
  showOpenDialog: (e) => ipcSendSync('showOpenDialog', e),
  showSaveDialog: (e) => ipcSendSync('showSaveDialog', e),
  findInPage: (e, n) => {
    ipcSend('findInPage', {
      text: e,
      options: n
    });
  },
  stopFindInPage: (e) => {
    ipcSend('stopFindInPage', e);
  },
  startDrag: (e) => {
    ipcSend('startDrag', e);
  },
  screenColorPick: (e) => {
    'function' == typeof e
      ? (window.utools.__event__.screenColorPickCallback = e)
      : delete window.utools.__event__.screenColorPickCallback,
      ipcSend('screenColorPick');
  },
  screenCapture: (e) => {
    'function' == typeof e
      ? (window.utools.__event__.screenCaptureCallback = e)
      : delete window.utools.__event__.screenCaptureCallback,
      ipcSend('screenCapture');
  },
  getLocalId: () => ipcSendSync('getLocalId'),
  getNativeId: () => ipcSendSync('getNativeId'),
  getAppVersion: () => ipcSendSync('getAppVersion'),
  getPath: (e) => ipcSendSync('getPath', e),
  getFileIcon: (e) => ipcSendSync('getFileIcon', e),
  copyFile: (e, n = !0) =>
    ipcSendSync('copyFile', {
      file: e,
      isRecord: n
    }),
  copyImage: (e, n = !0) =>
    ipcSendSync('copyImage', {
      img: e,
      isRecord: n
    }),
  copyText: (e, n = !0) =>
    ipcSendSync('copyText', {
      text: e,
      isRecord: n
    }),
  getCopyedFiles: () => ipcSendSync('getCopyedFiles'),
  readCurrentFolderPath: () => ipcInvoke('readCurrentFolderPath'),
  readCurrentBrowserUrl: () => ipcInvoke('readCurrentBrowserUrl'),
  getCurrentFolderPath: () => ipcSendSync('getCurrentFolderPath'),
  getCurrentBrowserUrl: () => ipcSendSync('getCurrentBrowserUrl'),
  shellOpenItem: (e) => {
    ipcSend('shellOpenPath', e);
  },
  shellOpenPath: (e) => {
    ipcSend('shellOpenPath', e);
  },
  shellShowItemInFolder: (e) => {
    ipcSend('shellShowItemInFolder', e);
  },
  shellOpenExternal: (e) => {
    ipcSend('shellOpenExternal', e);
  },
  shellBeep: () => {
    ipcSend('shellBeep');
  },
  hideMainWindowTypeString: (e) => ipcSendSync('hideMainWindowTypeString', e),
  simulateKeyboardTap: (e, ...n) => {
    ipcSend('simulateKeyboardTap', {
      key: e,
      modifier: n
    });
  },
  simulateMouseClick: (e, n) => {
    ipcSend(
      'simulateMouseClick',
      'number' == typeof e && 'number' == typeof n
        ? {
            x: e,
            y: n
          }
        : void 0
    );
  },
  simulateMouseRightClick: (e, n) => {
    ipcSend(
      'simulateMouseRightClick',
      'number' == typeof e && 'number' == typeof n
        ? {
            x: e,
            y: n
          }
        : void 0
    );
  },
  simulateMouseDoubleClick: (e, n) => {
    ipcSend(
      'simulateMouseDoubleClick',
      'number' == typeof e && 'number' == typeof n
        ? {
            x: e,
            y: n
          }
        : void 0
    );
  },
  simulateMouseMove: (e, n) => {
    ipcSend('simulateMouseMove', {
      x: e,
      y: n
    });
  },
  getCursorScreenPoint: () => ipcSendSync('getCursorScreenPoint'),
  getPrimaryDisplay: () => ipcSendSync('getPrimaryDisplay'),
  getAllDisplays: () => ipcSendSync('getAllDisplays'),
  getDisplayNearestPoint: (e) => ipcSendSync('getDisplayNearestPoint', e),
  getDisplayMatching: (e) => ipcSendSync('getDisplayMatching', e),
  desktopCaptureSources: (e) => ipcInvoke('desktopCaptureSources', e),
  isDev: () => ipcSendSync('isDev'),
  isMacOs: () => 'darwin' === process.platform,
  isMacOS: () => 'darwin' === process.platform,
  isWindows: () => 'win32' === process.platform,
  isLinux: () => 'linux' === process.platform,
  db: Object.freeze({
    put: (e) => ipcSendSync('dbPut', e),
    get: (e) => ipcSendSync('dbGet', e),
    remove: (e) => ipcSendSync('dbRemove', e),
    bulkDocs: (e) => ipcSendSync('dbBulkDocs', e),
    allDocs: (e) => ipcSendSync('dbAllDocs', e),
    postAttachment: (e, n, t) =>
      ipcSendSync('dbPostAttachment', {
        docId: e,
        attachment: n,
        type: t
      }),
    getAttachment: (e) => ipcSendSync('dbGetAttachment', e),
    getAttachmentType: (e) => ipcSendSync('dbGetAttachmentType', e),
    replicateStateFromCloud: () => ipcSendSync('dbReplicateStateFromCloud'),
    promises: Object.freeze({
      put: (e) => ipcInvoke('dbPromisePut', e),
      get: (e) => ipcInvoke('dbPromiseGet', e),
      remove: (e) => ipcInvoke('dbPromiseRemove', e),
      bulkDocs: (e) => ipcInvoke('dbPromiseBulkDocs', e),
      allDocs: (e) => ipcInvoke('dbPromiseAllDocs', e),
      postAttachment: (e, n, t) =>
        ipcInvoke('dbPromisePostAttachment', {
          docId: e,
          attachment: n,
          type: t
        }),
      getAttachment: (e) => ipcInvoke('dbPromiseGetAttachment', e),
      getAttachmentType: (e) => ipcInvoke('dbPromiseGetAttachmentType', e),
      replicateStateFromCloud: () =>
        ipcInvoke('dbPromiseReplicateStateFromCloud')
    })
  }),
  dbStorage: Object.freeze({
    setItem: (e, n) => {
      const t = {
          _id: String(e)
        },
        o = ipcSendSync('dbGet', t._id);
      o && (t._rev = o._rev), (t.value = n);
      const i = ipcSendSync('dbPut', t);
      if (i.error) throw new Error(i.message);
    },
    getItem: (e) => {
      const n = ipcSendSync('dbGet', String(e));
      return n && 'value' in n ? n.value : null;
    },
    removeItem: (e) => {
      const n = ipcSendSync('dbGet', String(e));
      n && ipcSendSync('dbRemove', n);
    }
  }),
  get ubrowser() {
    const e = require('./ubrowser/client');
    return (e._queue = []), e;
  }
});

window.addEventListener('error', function (e) {
  ipcSend('reportExceptionError', e.error.stack);
});
