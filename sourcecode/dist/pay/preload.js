const {ipcRenderer} = require("electron");
window.services = {
    closeWindow: ()=>{
        ipcRenderer.send("pay.services", "closeWindow")
    }
    ,
    goBuyMember: ()=>{
        ipcRenderer.send("pay.services", "goBuyMember")
    }
    ,
    startLoopCheckOrderResult: e=>{
        ipcRenderer.send("pay.services", "startLoopCheckOrderResult", e)
    }
};
