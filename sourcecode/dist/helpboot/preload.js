const {shell, ipcRenderer} = require("electron");
window.services = {
    openExternal: e=>{
        shell.openExternal(e)
    }
    ,
    bootDone: e=>{
        ipcRenderer.send("helpboot.services.done", e)
    }
    ,
    getPlatform: ()=>process.platform
};
