const { ipcRenderer } = require('electron');

const ipcSendSync = (e, ...n) => {
  const t = ipcRenderer.sendSync("ffffffff.services", e, ...n);
  if (t instanceof Error) throw t;
  return t
}

const ipcInvoke = async (e, ...n) => {
  let service = 'ffffffff.services'
  try {
    if (['wsSendMessage'].includes(e)) {
      service = 'plugin.api'
    }
    return await ipcRenderer.invoke(service, e, ...n)
  } catch (e) {
    throw new Error(e.message.replace(/^.*?Error:/, "").trim())
  }
}

module.exports = {
  onExtensionMessage: (e) => {
    'function' == typeof e && (window.utools.__event__.onExtensionMessage = e);
  },
  sendExtensionMessage: (e) => {
    ipcInvoke('wsSendMessage', e)
  },
  utoolsAllDb: () => ipcInvoke("getDbStatistics"),
  getAllPlugins: () => ipcSendSync("getPluginContainer"),
  getDbDoc: (e, n) => ipcInvoke("getDbDoc", e, n),
}
