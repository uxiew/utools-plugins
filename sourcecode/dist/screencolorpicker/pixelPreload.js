const {ipcRenderer} = require("electron");
let topDom = null
  , bottomDom = null
  , colorDomBoxs = null
  , prevIsReverse = !1;
const hexColor = o=>"#" + o.split(",").map((o=>{
    const e = parseInt(o).toString(16);
    return 1 === e.length ? "0" + e : e
}
)).join("").toUpperCase();
ipcRenderer.on("colors", ((o,e,r)=>{
    colorDomBoxs || (topDom = document.querySelector("body > .top > div"),
    bottomDom = document.querySelector("body > .bottom > div"),
    colorDomBoxs = [],
    document.querySelectorAll("body > .content > div").forEach((o=>{
        colorDomBoxs.push(o.querySelectorAll(":scope > div"))
    }
    )),
    bottomDom.hidden = !1);
    for (let o = 0; o < 9; o++)
        for (let r = 0; r < 9; r++)
            colorDomBoxs[o][r].style.backgroundColor = "rgb(" + e[o][r] + ")";
    r ? topDom.innerText = hexColor(e[4][4]) : bottomDom.innerText = hexColor(e[4][4]),
    prevIsReverse !== r && (r ? (bottomDom.hidden = !0,
    topDom.hidden = !1) : (bottomDom.hidden = !1,
    topDom.hidden = !0),
    prevIsReverse = r)
}
)),
window.onmousedown = o=>{
    o.preventDefault(),
    ipcRenderer.send("screencapture.services", "sendKeydown", o.button ? "Escape" : "Enter")
}
;
