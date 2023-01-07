const { ipcRenderer } = require('electron'),
  fs = require('fs'),
  path = require('path'),
  ipcSendSync = (e, ...n) => {
    const i = ipcRenderer.sendSync('developer.services', e, ...n);
    if (i instanceof Error) throw i;
    return i;
  },
  ipcInvoke = async (e, ...n) => {
    try {
      return await ipcRenderer.invoke('developer.services', e, ...n);
    } catch (e) {
      throw new Error(e.message.replace(/^.*?Error:/, '').trim());
    }
  };
const state = {
  accountInfo: {
    _id: 'string',
    // 数据库中的 id
    uid: 'string',
    // user id
    avatar: 'string',
    nickname: 'string',
    cellphone: 'xxxxxx6584',
    type: 'number',
    // 1 === t.type ? "member" : "user"
    avatar: 'string',
    token: 'boolean',
    // token
    expired_at: 'boolean',
    // 会员到期日
    db_sync: 'boolean',
    // 账户数据是否开启同步
    db_secrect_key: 'string'
    // 数据库密钥
  },
  getId: (num = 8) => {
    var returnStr = '',
      charStr =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < num; i++) {
      var index = Math.round(Math.random() * (charStr.length - 1));
      returnStr += charStr.substring(index, index + 1);
    }
    return returnStr;
  },
  accountToken: 'xpV6srcRWsIroyFL4WeMs9jHZRY5q0JHOcTsUJJ1',
  formProject: {
    // id: state.getId(),
    // plugin_id: state.formProject.id,
    plugin_name: '',
    description: 'ChandlerVer5 的upx插件😄',
    developer_type: 0,
    author: 'ChandlerVer5',
    homepage: 'https://www.kancloud.cn/@chandler'
  },
  // 模拟已经安装的插件
  // [{id:123}]
  pluginList: []
};

window.state = state;

window.api = (e, t) => {
  if (e.indexOf('/releases/') >= 0) {
    return Promise.resolve({
      previews: [
        'https://5b0988e595225.cdn.sohucs.com/images/20171221/22b1117f31ed4805b2087af994feb376.jpeg'
      ]
    });
  }

  if (e.indexOf('/payments') >= 0) {
    return Promise.resolve([
      {
        payments: {
          count: 110,
          payments: [
            {
              body: {
                sex: 'man'
              },
              paid_at: '1655004850685',
              order_id: '12313123',
              total_fee: 110
            }
          ]
        }
      }
    ]);
  }

  if (e.indexOf('/developers/plugins') >= 0) {
    return Promise.resolve(state.pluginList);
  }
  return ajax('GET', e, t);
};

window.services = {
  buildPluginUpxFile: (e, n) => ipcInvoke('buildPluginUpxFile', e, n),
  getAccountToken: () => ipcSendSync('getAccountToken'),
  getLocalAccount: () => state.accountInfo,
  //  getLocalAccount: ()=>ipcSendSync("getLocalAccount"),
  isDev: () => ipcSendSync('isDev'),
  runDevPlugin: (e, n) => ipcSendSync('runDevPlugin', e, n),
  isRuningDevPlugin: (e) => ipcSendSync('isRuningDevPlugin', e),
  stopDevPlugin: (e) => ipcSendSync('stopDevPlugin', e),
  isDevPluginOutKill: (e) => ipcSendSync('isDevPluginOutKill', e),
  toggleOutKillDevPlugin: (e, n) => ipcSendSync('toggleOutKillDevPlugin', e, n),
  readDevPluginLogo: (e) => {
    if (!fs.existsSync(e)) throw new Error('plugin.json 文件不存在');
    let n;
    try {
      n = JSON.parse(fs.readFileSync(e, 'utf8'));
    } catch (e) {
      throw new Error('plugin.json 文件内容解析失败，' + e.message);
    }
    if ('object' != typeof n) throw new Error('plugin.json 文件内容错误');
    if (!n.logo) throw new Error('logo 未配置');
    if (!/\.(?:png|jpg|jpeg)$/i.test(n.logo))
      throw new Error('插件 logo 必须是 png 或 jpg 图片');
    const i = path.join(path.dirname(e), n.logo);
    if (!fs.existsSync(i)) throw new Error('配置的 logo "' + i + '" 不存在');
    return i;
  },
  getFileBlob: (e) => {
    let n;
    try {
      n = fs.readFileSync(e);
    } catch (e) {
      return null;
    }
    return new window.Blob([Uint8Array.from(n).buffer]);
  },
  getPathBasename: (e) => path.basename(e),
  getPathDirname: (e) => path.dirname(e),
  dialogSaveUpxFile: (e, n) => {
    const i = path.basename(e).replace(/^\w+/, n),
      r = window.utools.getPath('downloads'),
      o = path.join(r, i),
      t = window.utools.showSaveDialog({
        defaultPath: o
      });
    if (t)
      try {
        fs.writeFileSync(t, fs.readFileSync(e, 'binary'), {
          encoding: 'binary'
        }),
          setTimeout(() => {
            window.utools.shellShowItemInFolder(t);
          }, 1e3);
      } catch (e) {}
  }
};
