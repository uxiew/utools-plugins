const {ipcRenderer} = require("electron");
window.services = {
    getPlatform: ()=>process.platform,
    setPosition: (e,n,i,s)=>{
        ipcRenderer.send("detach.services", "setPosition", e, n, i, s)
    }
    ,
    openDevTool: ()=>{
        ipcRenderer.send("detach.services", "openDevTool")
    }
    ,
    setAlwaysOnTop: e=>{
        ipcRenderer.send("detach.services", "setAlwaysOnTop", e)
    }
    ,
    closeWindow: ()=>{
        ipcRenderer.send("detach.services", "closeWindow")
    }
    ,
    endFullScreen: ()=>{
        ipcRenderer.send("detach.services", "endFullScreen")
    }
    ,
    minimizeWindow: ()=>{
        ipcRenderer.send("detach.services", "minimizeWindow")
    }
    ,
    maximizeWindow: ()=>{
        ipcRenderer.send("detach.services", "maximizeWindow")
    }
    ,
    webContentsFocus: ()=>{
        ipcRenderer.send("detach.services", "webContentsFocus")
    }
    ,
    buildDetachPluginOptionMenu: ()=>{
        ipcRenderer.send("detach.services", "buildDetachPluginOptionMenu")
    }
    ,
    buildDetachPluginViewZoomMenu: ()=>{
        ipcRenderer.send("detach.services", "buildDetachPluginViewZoomMenu")
    }
    ,
    showPluginInfo: ()=>{
        ipcRenderer.send("detach.services", "showPluginInfo")
    }
    ,
    sendSubInputChangeEvent: e=>{
        ipcRenderer.send("detach.services", "sendSubInputChangeEvent", e)
    }
    ,
    sendPluginSomeKeyDownEvent: (e,n)=>{
        ipcRenderer.send("detach.services", "sendPluginSomeKeyDownEvent", e, n)
    }
};
