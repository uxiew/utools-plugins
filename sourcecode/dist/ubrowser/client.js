const {ipcRenderer} = require("electron")
  , jsCodeTemplate = (e,r)=>`(() => {\n    const fn = ${String(e)}\n    const args = ${JSON.stringify(r)}\n    const callResult = (result) => {\n      if (!!result && (typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {\n        return new Promise(resolve => {\n          result.then(ret => { resolve(callResult(ret)) }).catch( err => { resolve({ error: true, message: err.message }) })\n        })\n      }\n      return { data: result } \n    }\n    try {\n      return callResult(fn.apply(null, args))\n    } catch (err) { \n      return { error: true, message: err.message }\n    }\n  })()`;
class UBrowserClient {
    constructor() {
        this._queue = [],
        ["goto", "hide", "show", "useragent", "viewport", "css", "press", "paste", "screenshot", "pdf", "device", "end", "cookies", "setCookies", "removeCookies", "clearCookies", "devTools"].forEach((e=>{
            this[e] = (...r)=>(this._queue.push({
                method: e,
                args: r
            }),
            this)
        }
        ))
    }
    evaluate(e, ...r) {
        if ("function" != typeof e)
            throw new Error("evaluate: first argument should be a function");
        return this._queue.push({
            method: "javascript",
            args: [jsCodeTemplate(e, r)]
        }),
        this
    }
    wait(...e) {
        if ("number" == typeof e[0])
            return this._queue.push({
                method: "wait",
                args: [e[0]]
            }),
            this;
        if ("string" == typeof e[0]) {
            let r = e[1];
            return ("number" != typeof r || r < 0) && (r = 6e4),
            this._queue.push({
                method: "wait",
                args: [jsCodeTemplate((e=>!!document.querySelector(e)), [e[0]]), r]
            }),
            this
        }
        if ("function" == typeof e[0]) {
            const r = e.shift();
            let t = e.shift();
            return ("number" != typeof t || t < 0) && (t = 6e4),
            this._queue.push({
                method: "wait",
                args: [jsCodeTemplate(r, e), t]
            }),
            this
        }
        throw new Error("wait: parameter error")
    }
    when(...e) {
        if ("string" == typeof e[0])
            return this._queue.push({
                method: "when",
                args: [jsCodeTemplate((e=>!!document.querySelector(e)), [e[0]])]
            }),
            this;
        if ("function" == typeof e[0]) {
            const r = e.shift();
            return this._queue.push({
                method: "when",
                args: [jsCodeTemplate(r, e)]
            }),
            this
        }
        throw new Error("when: parameter error")
    }
    mouse(e, r) {
        if (!["click", "mousedown", "mouseup"].includes(e))
            throw new Error("eventName error");
        return this.evaluate(((e,r)=>{
            document.activeElement.blur();
            const t = document.querySelector(r);
            if (!t)
                throw new Error(e + ': unable to find element by selector "' + r + '"');
            const o = t.getBoundingClientRect()
              , n = new window.MouseEvent(e,{
                view: document.window,
                bubbles: !0,
                cancelable: !0,
                clientX: o.left + o.width / 2,
                clientY: o.top + o.height / 2
            });
            t.dispatchEvent(n)
        }
        ), e, r)
    }
    click(e) {
        return this.mouse("click", e)
    }
    mousedown(e) {
        return this.mouse("mousedown", e)
    }
    mouseup(e) {
        return this.mouse("mouseup", e)
    }
    file(e, r) {
        let t;
        if ("string" == typeof r)
            if (/^(data:image\/([a-z]+?);base64,)/.test(r)) {
                const e = r.replace(RegExp.$1, "")
                  , o = "image_" + Date.now() + "." + RegExp.$2
                  , n = require("path")
                  , s = require("fs")
                  , i = n.join(require("os").tmpdir(), "utools-ubrowser");
                s.existsSync(i) || s.mkdirSync(i),
                t = [n.join(i, o)],
                s.writeFileSync(t[0], e, "base64")
            } else {
                if (!require("fs").existsSync(r))
                    throw new Error("file: the second parameter file does not exist");
                t = [r]
            }
        else if (r instanceof Uint8Array) {
            const e = "file_" + Date.now()
              , o = require("path")
              , n = require("fs")
              , s = o.join(require("os").tmpdir(), "utools-ubrowser");
            n.existsSync(s) || n.mkdirSync(s),
            t = [o.join(s, e)],
            n.writeFileSync(t[0], Buffer.from(r), "buffer")
        } else {
            if (!(Array.isArray(r) && r.length > 0 && "string" == typeof r[0]))
                throw new Error("file: parameter error");
            {
                const e = require("fs");
                if (r.find((r=>!e.existsSync(r))))
                    throw new Error("file: the second parameter file does not exist");
                t = r
            }
        }
        return this._queue.push({
            method: "file",
            args: [e, t]
        }),
        this
    }
    value(e, r) {
        return this.evaluate(((e,r)=>{
            const t = document.querySelector(e);
            if (!t)
                throw new Error('value: unable to find element by selector "' + e + '"');
            t.value = r,
            "TEXTAREA" === t.tagName || "INPUT" === t.tagName && ["text", "password", "search"].includes(t.type) ? t.dispatchEvent(new window.Event("input",{
                bubbles: !0,
                cancelable: !0
            })) : t.dispatchEvent(new window.Event("change",{
                bubbles: !0,
                cancelable: !0
            }))
        }
        ), e, r)
    }
    check(e, r) {
        return this.evaluate(((e,r)=>{
            const t = document.querySelector(e);
            if (!t)
                throw new Error('check: unable to find element by selector "' + e + '"');
            t.checked = void 0 === r || !0 === r,
            t.dispatchEvent(new window.Event("change",{
                bubbles: !0,
                cancelable: !0
            }))
        }
        ), e, r)
    }
    focus(e) {
        return this.evaluate((e=>{
            const r = document.querySelector(e);
            if (!r)
                throw new Error('focus: unable to find element by selector "' + e + '"');
            r.focus()
        }
        ), e)
    }
    scroll(...e) {
        if ("number" == typeof e[0]) {
            if (1 === e.length)
                return this.evaluate((e=>{
                    window.scrollTo(window.scrollX, e)
                }
                ), e[0]);
            if (2 === e.length && "number" == typeof e[1])
                return this.evaluate(((e,r)=>{
                    window.scrollTo(e, r)
                }
                ), e[0], e[1]);
            throw new Error("scroll: parameter error")
        }
        if ("string" == typeof e[0])
            return this.evaluate((e=>{
                const r = document.querySelector(e);
                if (!r)
                    throw new Error('scroll: unable to find element by selector "' + e + '"');
                const t = r.getBoundingClientRect();
                window.scrollTo(t.left, t.top)
            }
            ), e[0]);
        throw new Error("scroll: parameter error")
    }
    async run(e) {
        if (0 === this._queue.length)
            throw new Error("no actions run");
        const r = [...this._queue];
        this._queue = [];
        try {
            return await ipcRenderer.invoke("plugin.api", "runUBrowser", {
                options: e,
                queue: r
            })
        } catch (e) {
            throw new Error(e.message.replace(/^.*?Error:/, "").trim())
        }
    }
}
module.exports = new UBrowserClient;
