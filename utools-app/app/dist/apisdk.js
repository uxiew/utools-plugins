"use strict";
const apiVer5 = require('./ver5/api.js');
const {ipcRenderer} = require("electron")
  , ipcSendSync = (e,n)=>{
    const t = ipcRenderer.sendSync("plugin.api", e, n);
    if (t instanceof Error)
        throw t;
    return t
}
  , ipcSend = (e,n)=>{
    ipcRenderer.send("plugin.api", e, n)
}
  , ipcInvoke = async(e,n)=>{
    try {
        return await ipcRenderer.invoke("plugin.api", e, n)
    } catch (e) {
        throw new Error(e.message.replace(/^.*?Error:/, "").trim())
    }
}
  , mainPushAsyncExecFunc = async(e,n,t)=>{
    let o;
    try {
        o = await Promise.resolve(e(t))
    } catch {}
    if (o && "object" == typeof o)
        if (Array.isArray(o))
            o = {
                type: "list",
                data: o
            };
        else if (Array.isArray(o.data)) {
            let {type: e, data: n} = o;
            switch (e) {
            case "list":
                n.length > 6 && (n = n.slice(0, 6));
                break;
            case "cards":
                n.length > 4 && (n = n.slice(0, 4));
                break;
            case "cells":
                n.length > 9 && (n = n.slice(0, 9));
                break;
            default:
                e = "list",
                n.length > 6 && (n = n.slice(0, 6))
            }
            o = {
                type: e,
                data: n
            }
        } else
            o = void 0;
    else
        o = void 0;
    const i = window.utools.__event__.onMainPushHub;
    if (i[t.code])
        return i[t.code][0] === n ? (i[t.code] = null,
        void ipcSend("pushMain", [n, o])) : void await mainPushAsyncExecFunc(e, ...i[t.code])
};

window.utools = Object.freeze({
    ...apiVer5,
    __event__: {},
    onPluginReady: e=>{
        "function" == typeof e && (window.utools.__event__.onPluginReady = e)
    }
    ,
    onPluginEnter: e=>{
        "function" == typeof e && (window.utools.__event__.onPluginEnter = e)
    }
    ,
    onPluginOut: e=>{
        "function" == typeof e && (window.utools.__event__.onPluginOut = e)
    }
    ,
    onPluginDetach: e=>{
        "function" == typeof e && (window.utools.__event__.onPluginDetach = e)
    }
    ,
    onDbPull: e=>{
        "function" == typeof e && (window.utools.__event__.onDbPull = e)
    }
    ,
    onMainPush: (e,n)=>{
        if (ipcRenderer.removeAllListeners("main-push"),
        "function" != typeof e)
            return delete window.utools.__event__.onMainPushHub,
            void delete window.utools.__event__.onMainPushSelectCallback;
        window.utools.__event__.onMainPushHub = {},
        "function" == typeof n ? window.utools.__event__.onMainPushSelectCallback = n : delete window.utools.__event__.onMainPushSelectCallback,
        ipcRenderer.on("main-push", ((n,t,o)=>{
            if (0 !== n.senderId)
                return;
            const i = window.utools.__event__.onMainPushHub;
            i[o.code] ? i[o.code] = [t, o] : (i[o.code] = [t, o],
            mainPushAsyncExecFunc(e, t, o))
        }
        ))
    }
    ,
    hideMainWindow: e=>!1 === e ? (ipcSend("hideMainWindow", !1),
    !0) : ipcSendSync("hideMainWindow", !0),
    showMainWindow: ()=>ipcSendSync("showMainWindow"),
    setExpendHeight: e=>ipcSendSync("setExpendHeight", e),
    setSubInput: (e,n="",t=!0)=>"function" == typeof e && (window.utools.__event__.onSubInputChange = e,
    ipcSendSync("setSubInput", {
        placeholder: n,
        isFocus: t
    })),
    removeSubInput: ()=>(delete window.utools.__event__.onSubInputChange,
    ipcSendSync("removeSubInput")),
    setSubInputValue: e=>ipcSendSync("setSubInputValue", e),
    subInputFocus: ()=>ipcSendSync("subInputFocus"),
    subInputSelect: ()=>ipcSendSync("subInputSelect"),
    subInputBlur: ()=>ipcSendSync("subInputBlur"),
    createBrowserWindow: (e,n,t)=>{
        "function" == typeof t && (window.utools.__event__.createBrowserWindowCallback = t);
        const o = ipcSendSync("createBrowserWindow", {
            url: e,
            options: n
        })
          , i = o.id;
        return o.methods.forEach((e=>{
            o[e] = (...n)=>ipcSendSync("pluginBrowserWindowMethod", {
                id: i,
                method: e,
                args: n
            })
        }
        )),
        delete o.methods,
        o.invokes.forEach((e=>{
            o[e] = (...n)=>ipcInvoke("pluginBrowserWindowInvoke", {
                id: i,
                method: e,
                args: n
            })
        }
        )),
        delete o.invokes,
        o.webContents.methods.forEach((e=>{
            o.webContents[e] = (...n)=>ipcSendSync("pluginBrowserWindowMethod", {
                id: i,
                target: "webContents",
                method: e,
                args: n
            })
        }
        )),
        delete o.webContents.methods,
        o.webContents.invokes.forEach((e=>{
            o.webContents[e] = (...n)=>ipcInvoke("pluginBrowserWindowInvoke", {
                id: i,
                target: "webContents",
                method: e,
                args: n
            })
        }
        )),
        delete o.webContents.invokes,
        o
    }
    ,
    outPlugin: ()=>{
        ipcSend("outPlugin")
    }
    ,
    isDarkColors: ()=>ipcSendSync("isDarkColors"),
    getUser: ()=>ipcSendSync("getUser"),
    fetchUserServerTemporaryToken: ()=>ipcInvoke("fetchUserServerTemporaryToken"),
    openPayment: (e,n)=>{
        "function" == typeof n ? window.utools.__event__.openPaymentCallback = n : delete window.utools.__event__.openPaymentCallback,
        ipcSendSync("openPayment", e)
    }
    ,
    fetchUserPayments: ()=>ipcInvoke("fetchUserPayments"),
    isPermanentUser: ()=>ipcSendSync("isPurchasedUser"),
    openPurchase: (e,n)=>{
        "function" == typeof n ? window.utools.__event__.openPaymentCallback = n : delete window.utools.__event__.openPaymentCallback,
        ipcSendSync("openPayment", {
            ...e,
            purchase: !0
        })
    }
    ,
    isPurchasedUser: ()=>ipcSendSync("isPurchasedUser"),
    setFeature: e=>ipcSendSync("setFeature", e),
    removeFeature: e=>ipcSendSync("removeFeature", e),
    getFeatures: e=>ipcSendSync("getFeatures", e),
    redirect: (e,n)=>ipcSendSync("redirect", {
        label: e,
        payload: n
    }),
    getIdleUBrowsers: ()=>ipcSendSync("getIdleUBrowsers"),
    setUBrowserProxy: e=>ipcSendSync("setUBrowserProxy", e),
    clearUBrowserCache: ()=>ipcSendSync("clearUBrowserCache"),
    ubrowserLogin: ()=>ipcInvoke("ubrowserLogin"),
    reportInfo: e=>ipcSendSync("reportInfo", e),
    showNotification: (e,n)=>{
        ipcSend("showNotification", {
            body: e,
            clickFeatureCode: n
        })
    }
    ,
    showOpenDialog: e=>ipcSendSync("showOpenDialog", e),
    showSaveDialog: e=>ipcSendSync("showSaveDialog", e),
    findInPage: (e,n)=>{
        ipcSend("findInPage", {
            text: e,
            options: n
        })
    }
    ,
    stopFindInPage: e=>{
        ipcSend("stopFindInPage", e)
    }
    ,
    startDrag: e=>{
        ipcSend("startDrag", e)
    }
    ,
    screenColorPick: e=>{
        "function" == typeof e ? window.utools.__event__.screenColorPickCallback = e : delete window.utools.__event__.screenColorPickCallback,
        ipcSend("screenColorPick")
    }
    ,
    screenCapture: e=>{
        "function" == typeof e ? window.utools.__event__.screenCaptureCallback = e : delete window.utools.__event__.screenCaptureCallback,
        ipcSend("screenCapture")
    }
    ,
    getLocalId: ()=>ipcSendSync("getLocalId"),
    getNativeId: ()=>ipcSendSync("getNativeId"),
    getAppName: ()=>ipcSendSync("getAppName"),
    getAppVersion: ()=>ipcSendSync("getAppVersion"),
    getPath: e=>ipcSendSync("getPath", e),
    getFileIcon: e=>ipcSendSync("getFileIcon", e),
    copyFile: (e,n=!0)=>ipcSendSync("copyFile", {
        file: e,
        isRecord: n
    }),
    copyImage: (e,n=!0)=>ipcSendSync("copyImage", {
        img: e,
        isRecord: n
    }),
    copyText: (e,n=!0)=>ipcSendSync("copyText", {
        text: e,
        isRecord: n
    }),
    hideMainWindowPasteFile: e=>ipcSendSync("hideMainWindowPasteFile", e),
    hideMainWindowPasteImage: e=>ipcSendSync("hideMainWindowPasteImage", e),
    hideMainWindowPasteText: e=>ipcSendSync("hideMainWindowPasteText", e),
    hideMainWindowTypeString: e=>ipcSendSync("hideMainWindowTypeString", e),
    getCopyedFiles: ()=>ipcSendSync("getCopyedFiles"),
    readCurrentFolderPath: ()=>ipcInvoke("readCurrentFolderPath"),
    readCurrentBrowserUrl: ()=>ipcInvoke("readCurrentBrowserUrl"),
    getCurrentFolderPath: ()=>ipcSendSync("getCurrentFolderPath"),
    getCurrentBrowserUrl: ()=>ipcSendSync("getCurrentBrowserUrl"),
    shellOpenItem: e=>{
        ipcSend("shellOpenPath", e)
    }
    ,
    shellOpenPath: e=>{
        ipcSend("shellOpenPath", e)
    }
    ,
    shellTrashItem: e=>ipcInvoke("shellTrashItem", e),
    shellShowItemInFolder: e=>{
        ipcSend("shellShowItemInFolder", e)
    }
    ,
    shellOpenExternal: e=>{
        ipcSend("shellOpenExternal", e)
    }
    ,
    shellBeep: ()=>{
        ipcSend("shellBeep")
    }
    ,
    simulateKeyboardTap: (e,...n)=>{
        ipcSend("simulateKeyboardTap", {
            key: e,
            modifier: n
        })
    }
    ,
    simulateMouseClick: (e,n)=>{
        ipcSend("simulateMouseClick", "number" == typeof e && "number" == typeof n ? {
            x: e,
            y: n
        } : void 0)
    }
    ,
    simulateMouseRightClick: (e,n)=>{
        ipcSend("simulateMouseRightClick", "number" == typeof e && "number" == typeof n ? {
            x: e,
            y: n
        } : void 0)
    }
    ,
    simulateMouseDoubleClick: (e,n)=>{
        ipcSend("simulateMouseDoubleClick", "number" == typeof e && "number" == typeof n ? {
            x: e,
            y: n
        } : void 0)
    }
    ,
    simulateMouseMove: (e,n)=>{
        ipcSend("simulateMouseMove", {
            x: e,
            y: n
        })
    }
    ,
    getCursorScreenPoint: ()=>ipcSendSync("getCursorScreenPoint"),
    getPrimaryDisplay: ()=>ipcSendSync("getPrimaryDisplay"),
    getAllDisplays: ()=>ipcSendSync("getAllDisplays"),
    getDisplayNearestPoint: e=>ipcSendSync("getDisplayNearestPoint", e),
    getDisplayMatching: e=>ipcSendSync("getDisplayMatching", e),
    desktopCaptureSources: e=>ipcInvoke("desktopCaptureSources", e),
    isDev: ()=>ipcSendSync("isDev"),
    isMacOs: ()=>"darwin" === process.platform,
    isMacOS: ()=>"darwin" === process.platform,
    isWindows: ()=>"win32" === process.platform,
    isLinux: ()=>"linux" === process.platform,
    db: Object.freeze({
        put: e=>ipcSendSync("dbPut", e),
        get: e=>ipcSendSync("dbGet", e),
        remove: e=>ipcSendSync("dbRemove", e),
        bulkDocs: e=>ipcSendSync("dbBulkDocs", e),
        allDocs: e=>ipcSendSync("dbAllDocs", e),
        postAttachment: (e,n,t)=>ipcSendSync("dbPostAttachment", {
            docId: e,
            attachment: n,
            type: t
        }),
        getAttachment: e=>ipcSendSync("dbGetAttachment", e),
        getAttachmentType: e=>ipcSendSync("dbGetAttachmentType", e),
        replicateStateFromCloud: ()=>ipcSendSync("dbReplicateStateFromCloud"),
        promises: Object.freeze({
            put: e=>ipcInvoke("dbPromisePut", e),
            get: e=>ipcInvoke("dbPromiseGet", e),
            remove: e=>ipcInvoke("dbPromiseRemove", e),
            bulkDocs: e=>ipcInvoke("dbPromiseBulkDocs", e),
            allDocs: e=>ipcInvoke("dbPromiseAllDocs", e),
            postAttachment: (e,n,t)=>ipcInvoke("dbPromisePostAttachment", {
                docId: e,
                attachment: n,
                type: t
            }),
            getAttachment: e=>ipcInvoke("dbPromiseGetAttachment", e),
            getAttachmentType: e=>ipcInvoke("dbPromiseGetAttachmentType", e),
            replicateStateFromCloud: ()=>ipcInvoke("dbPromiseReplicateStateFromCloud")
        })
    }),
    dbStorage: Object.freeze({
        setItem: (e,n)=>{
            const t = {
                _id: String(e)
            }
              , o = ipcSendSync("dbGet", t._id);
            o && (t._rev = o._rev),
            t.value = n;
            const i = ipcSendSync("dbPut", t);
            if (i.error)
                throw new Error(i.message)
        }
        ,
        getItem: e=>{
            const n = ipcSendSync("dbGet", String(e));
            return n && "value"in n ? n.value : null
        }
        ,
        removeItem: e=>{
            const n = ipcSendSync("dbGet", String(e));
            n && ipcSendSync("dbRemove", n)
        }
    }),
    get ubrowser() {
        const e = require("./ubrowser/client");
        return e.run = async function(e) {
            if (0 === this._queue.length)
                throw new Error("no actions run");
            const n = [...this._queue];
            this._queue = [];
            const t = await ipcInvoke("runUBrowser", {
                options: e,
                queue: n
            });
            if (t.error) {
                const e = new Error(t.message);
                throw e.data = t.data,
                e
            }
            return t.data
        }
        ,
        e
    }
}),
window.addEventListener("error", (function(e) {
    ipcSend("reportExceptionError", e.error.stack)
}
));
