const {ipcRenderer} = require("electron");
window.services = {
    captureComplete: e=>{
        ipcRenderer.send("screencapture.services", "captureComplete", e)
    }
};
