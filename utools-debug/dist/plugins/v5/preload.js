const {nativeImage, ipcRenderer} = require("electron")
  , fs = require("fs")
  , originalFs = require("original-fs")
  , zlib = require("zlib")
  , path = require("path")
  , ipcSendSync = (e,...n)=>{
    const t = ipcRenderer.sendSync("ffffffff.services", e, ...n);
    if (t instanceof Error)
        throw t;
    return t
}
  , ipcInvoke = async(e,...n)=>{
    try {
        return await ipcRenderer.invoke("ffffffff.services", e, ...n)
    } catch (e) {
        throw new Error(e.message.replace(/^.*?Error:/, "").trim())
    }
}
  , ipcSend = (e,...n)=>{
    ipcRenderer.send("ffffffff.services", e, ...n)
}
;
let accountInfoCached;
window.services = {
    setOpenAtLogin: e=>ipcSendSync("setOpenAtLogin", e),
    setSpaceAsEnter: e=>ipcSendSync("setSpaceAsEnter", e),
    setShowHotKey: e=>ipcSendSync("setShowHotKey", e),
    setPluginDetachHotKey: e=>ipcSendSync("setPluginDetachHotKey", e),
    setAutoPasteLife: e=>ipcSendSync("setAutoPasteLife", e),
    setPluginOutTimer: e=>ipcSendSync("setPluginOutTimer", e),
    getAllSettings: ()=>ipcSendSync("getAllSettings"),
    setTheme: e=>ipcSendSync("setTheme", e),
    setMainWindowOpacity: e=>ipcSendSync("setMainWindowOpacity", e),
    setEnableNativeApp: e=>ipcSendSync("setEnableNativeApp", e),
    setMainPlaceholder: e=>ipcSendSync("setMainPlaceholder", e),
    getVoicePanelMenu: (e,n)=>ipcSendSync("getVoicePanelMenu", e, n),
    createVoicePanelMenu: (e,n,t)=>ipcInvoke("createVoicePanelMenu", e, n, t),
    removeVoicePanelMenu: e=>ipcInvoke("removeVoicePanelMenu", e),
    getVoicePanelSetting: ()=>ipcSendSync("getVoicePanelSetting"),
    setEnableVoicePanel: e=>ipcSendSync("setEnableVoicePanel", e),
    setVoicePanelEnableVoice: e=>ipcSendSync("setVoicePanelEnableVoice", e),
    setVoicePanelEnableTranslate: e=>ipcSendSync("setVoicePanelEnableTranslate", e),
    setVoicePanelTriggerWay: e=>ipcSendSync("setVoicePanelTriggerWay", e),
    setVoicePanelLongDownTriggerMS: e=>ipcSendSync("setVoicePanelLongDownTriggerMS", e),
    setVoicePanelProcessBlacklist: e=>ipcSendSync("setVoicePanelProcessBlacklist", e),
    getAllFeatureHotKey: ()=>ipcSendSync("getAllFeatureHotKey"),
    createFeatureHotKey: ()=>ipcSendSync("createFeatureHotKey"),
    deleteFeatureHotKey: e=>ipcSendSync("deleteFeatureHotKey", e),
    updateFeatureHotKeyHotKey: (e,n)=>ipcSendSync("updateFeatureHotKeyHotKey", e, n),
    updateFeatureHotKeyCmd: (e,n)=>ipcSendSync("updateFeatureHotKeyCmd", e, n),
    updateFeatureHotKeyAutocopy: (e,n)=>ipcSendSync("updateFeatureHotKeyAutocopy", e, n),
    getAccountToken: ()=>ipcSendSync("getAccountToken"),
    getLocalAccount: e=>(accountInfoCached && e || (accountInfoCached = ipcSendSync("getLocalAccount")),
    accountInfoCached),
    renewLocalAccount: ()=>ipcInvoke("renewLocalAccount"),
    setOpenDbSync: e=>ipcInvoke("setOpenDbSync", e),
    loginAccount: e=>ipcInvoke("loginAccount", e),
    logout: ()=>{
        ipcSendSync("logout")
    }
    ,
    goEmailVerify: ()=>{
        ipcSend("goEmailVerify")
    }
    ,
    goHomePage: ()=>{
        ipcSend("goHomePage")
    }
    ,
    createPluginId: e=>ipcInvoke("createPluginId", e),
    deployPlugin: e=>ipcInvoke("deployPlugin", e),
    getRemoteDbDocCount: ()=>ipcInvoke("getRemoteDbDocCount"),
    getDbStatistics: ()=>ipcInvoke("getDbStatistics"),
    clearDbPluginData: (e,n)=>ipcInvoke("clearDbPluginData", e, n),
    getDbDoc: (e,n)=>ipcInvoke("getDbDoc", e, n),
    getDbInfoDocCount: ()=>ipcInvoke("getDbInfoDocCount"),
    getCopyFiles: ()=>ipcSendSync("getCopyFiles"),
    getNativeWorkWindowInfo: ()=>ipcSendSync("getNativeWorkWindowInfo"),
    isDev: ()=>ipcSendSync("isDev"),
    getPlatform: ()=>process.platform,
    getAppVersion: ()=>ipcSendSync("getAppVersion"),
    getMachineNativeId: ()=>ipcSendSync("getMachineNativeId"),
    getMachineIdAndSign: ()=>ipcSendSync("getMachineIdAndSign"),
    getResIconAbsolutePath: e=>ipcSendSync("getResIconAbsolutePath", e),
    addLocalOpen: e=>ipcSendSync("addLocalOpen", e),
    removeLocalOpen: e=>ipcSendSync("removeLocalOpen", e),
    getLocalOpenFeatures: ()=>ipcSendSync("getLocalOpenFeatures"),
    getPluginContainer: ()=>ipcSendSync("getPluginContainer"),
    getPluginConfig: e=>ipcSendSync("getPluginConfig", e),
    getPluginUpdateSet: ()=>ipcSendSync("getPluginUpdateSet"),
    getDisabledCmdContainer: ()=>ipcSendSync("getDisabledCmdContainer"),
    getDisableCmds: e=>ipcSendSync("getDisableCmds", e),
    addDisableCmd: (e,n,t,i)=>ipcSendSync("addDisableCmd", e, n, t, i),
    removeDisableCmd: e=>ipcSendSync("removeDisableCmd", e),
    getPluginMenuSetting: e=>ipcSendSync("getPluginMenuSetting", e),
    addOutKillPlugin: e=>ipcSendSync("addOutKillPlugin", e),
    removeOutKillPlugin: e=>ipcSendSync("removeOutKillPlugin", e),
    addEnterDetachPlugin: e=>ipcSendSync("addEnterDetachPlugin", e),
    removeEnterDetachPlugin: e=>ipcSendSync("removeEnterDetachPlugin", e),
    addPluginRunAtAppOpen: e=>ipcSendSync("addPluginRunAtAppOpen", e),
    removePluginRunAtAppOpen: e=>ipcSendSync("removePluginRunAtAppOpen", e),
    disableDbSyncRemind: e=>ipcSendSync("disableDbSyncRemind"),
    isDisabledDbSyncRemind: e=>ipcSendSync("isDisabledDbSyncRemind"),
    refreshAccountAvatar: ()=>{
        ipcSend("refreshAccountAvatar")
    }
    ,
    pluginIsRuning: e=>ipcSendSync("pluginIsRuning", e),
    getPluginRuningOsPids: e=>ipcSendSync("getPluginRuningOsPids", e),
    killPlugin: e=>ipcSendSync("killPlugin", e),
    removePlugin: e=>!!ipcSendSync("pluginUnMount", e) && (ipcSend("destroyPlugin", e),
    ipcSend("refreshCmdSource"),
    !0),
    installPlugin: async(e,n)=>{
        const t = await n.arrayBuffer()
          , i = path.join(window.utools.getPath("temp"), "utools-" + e + "-" + Date.now() + ".upx");
        fs.writeFileSync(i, Buffer.from(t));
        try {
            await ipcInvoke("pluginInstall", e, i)
        } catch (e) {
            try {
                fs.unlinkSync(i)
            } catch (e) {}
            throw e
        }
        try {
            fs.unlinkSync(i)
        } catch (e) {}
        ipcSend("destroyPlugin", e),
        ipcSend("refreshCmdSource");
        const c = ipcSendSync("getPluginConfig", e);
        if (!c)
            return;
        let o = window.utools.db.get("installed/" + e);
        const a = Date.now();
        o || (o = {
            _id: "installed/" + e,
            createTime: a
        }),
        o.name = c.name,
        o.pluginName = c.pluginName,
        o.description = c.description || "",
        o.author = c.author,
        o.updateTime = a,
        window.utools.db.put(o)
    }
    ,
    unsafePluginInstall: async e=>{
        const n = await ipcInvoke("pluginInstall", "", e);
        ipcSend("destroyPlugin", n),
        ipcSend("refreshCmdSource")
    }
    ,
    autoLoadPlugin: (e,n,t)=>{
        ipcSend("autoLoadPlugin", e, n, t)
    }
    ,
    getUpxPluginConf: e=>new Promise(((n,t)=>{
        const i = fs.createReadStream(e)
          , c = path.join(window.utools.getPath("temp"), "utools-" + Date.now() + ".asar")
          , o = originalFs.createWriteStream(c)
          , a = zlib.createGunzip();
        i.pipe(a).on("error", (()=>t(new Error("无效安装包")))).pipe(o).on("error", (()=>t(new Error("内容提取出错")))).on("finish", (()=>{
            const e = path.join(c, "plugin.json");
            let i = null;
            try {
                try {
                    i = JSON.parse(fs.readFileSync(e, "utf8"))
                    console.log("getUpxPluginConf: ", c, e, i)
                } catch (e) {
                    throw new Error("配置文件解析失败")
                }
                if (!i.name)
                    throw new Error("无效的插件应用 ID");
                if (!i.pluginName)
                    throw new Error("pluginName 未配置");
                if (i.pluginName.length > 20)
                    throw new Error("pluginName 长度超过 20 位");
                if (!i.logo)
                    throw new Error("logo 未配置");
                const n = path.join(c, i.logo);
                if (!fs.existsSync(n))
                    throw new Error("logo 文件不存在");
                const t = nativeImage.createFromPath(n);
                if (t.isEmpty())
                    throw new Error("logo 图片文件已损坏");
                i.logo = t.toDataURL()
            } catch (e) {
                try {
                    originalFs.unlinkSync(c)
                } catch (e) {}
                return t(e)
            }
            try {
                originalFs.unlinkSync(c)
            } catch (e) {}
            return n(i)
        }
        ))
    }
    )),
    getFileBlob: e=>{
        let n;
        try {
            n = fs.readFileSync(e)
        } catch (e) {
            return null
        }
        return new window.Blob([Uint8Array.from(n).buffer])
    }
};