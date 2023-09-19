const jsCodeTemplate = (e, t) =>
    `(() => {\n    const fn = ${String(e)}\n    const args = ${JSON.stringify(
      t
    )}\n    const callResult = (result) => {\n      if (!!result && (typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {\n        return new Promise(resolve => {\n          result.then(ret => { resolve(callResult(ret)) }).catch( err => { resolve({ error: true, message: err.message }) })\n        })\n      }\n      return { data: result }\n    }\n    try {\n      return callResult(fn.apply(null, args))\n    } catch (err) { \n      return { error: true, message: err.message }\n    }\n  })()`,
  METHODS = [
    'goto',
    'hide',
    'show',
    'useragent',
    'viewport',
    'css',
    'press',
    'paste',
    'screenshot',
    'pdf',
    'download',
    'device',
    'end',
    'cookies',
    'setCookies',
    'removeCookies',
    'clearCookies',
    'devTools'
  ];
class UBrowserClient {
  constructor() {
    (this._queue = []),
      METHODS.forEach((e) => {
        this[e] = (...t) => (this._queue.push({ method: e, args: t }), this);
      });
  }
  evaluate(e, ...t) {
    if ('function' != typeof e)
      throw new Error('evaluate: first argument should be a function');
    return (
      this._queue.push({ method: 'javascript', args: [jsCodeTemplate(e, t)] }),
      this
    );
  }
  wait(...e) {
    if ('number' == typeof e[0])
      return this._queue.push({ method: 'wait', args: [e[0]] }), this;
    if ('string' == typeof e[0]) {
      let t = e[1];
      return (
        ('number' != typeof t || t < 0) && (t = 6e4),
        this._queue.push({
          method: 'wait',
          args: [jsCodeTemplate((e) => !!document.querySelector(e), [e[0]]), t]
        }),
        this
      );
    }
    if ('function' == typeof e[0]) {
      const t = e.shift();
      let r = e.shift();
      return (
        ('number' != typeof r || r < 0) && (r = 6e4),
        this._queue.push({ method: 'wait', args: [jsCodeTemplate(t, e), r] }),
        this
      );
    }
    throw new Error('wait: parameter error');
  }
  when(...e) {
    if ('string' == typeof e[0])
      return (
        this._queue.push({
          method: 'when',
          args: [jsCodeTemplate((e) => !!document.querySelector(e), [e[0]])]
        }),
        this
      );
    if ('function' == typeof e[0]) {
      const t = e.shift();
      return (
        this._queue.push({ method: 'when', args: [jsCodeTemplate(t, e)] }), this
      );
    }
    throw new Error('when: parameter error');
  }
  mouse(e, t) {
    if (!['click', 'mousedown', 'mouseup'].includes(e))
      throw new Error('eventName error');
    return this.evaluate(
      (e, t) => {
        document.activeElement.blur();
        const r = document.querySelector(t);
        if (!r)
          throw new Error(
            e + ': unable to find element by selector "' + t + '"'
          );
        const o = r.getBoundingClientRect(),
          n = new window.MouseEvent(e, {
            view: document.window,
            bubbles: !0,
            cancelable: !0,
            clientX: o.left + o.width / 2,
            clientY: o.top + o.height / 2
          });
        r.dispatchEvent(n);
      },
      e,
      t
    );
  }
  click(e) {
    return this.mouse('click', e);
  }
  mousedown(e) {
    return this.mouse('mousedown', e);
  }
  mouseup(e) {
    return this.mouse('mouseup', e);
  }
  file(e, t) {
    let r;
    if ('string' == typeof t)
      if (/^(data:image\/([a-z]+?);base64,)/.test(t)) {
        const e = t.replace(RegExp.$1, ''),
          o = 'image_' + Date.now() + '.' + RegExp.$2,
          n = require('path'),
          s = require('fs'),
          i = n.join(require('os').tmpdir(), 'utools-ubrowser');
        s.existsSync(i) || s.mkdirSync(i),
          (r = [n.join(i, o)]),
          s.writeFileSync(r[0], e, 'base64');
      } else {
        if (!require('fs').existsSync(t))
          throw new Error('file: the second parameter file does not exist');
        r = [t];
      }
    else if (t instanceof Uint8Array) {
      const e = 'file_' + Date.now(),
        o = require('path'),
        n = require('fs'),
        s = o.join(require('os').tmpdir(), 'utools-ubrowser');
      n.existsSync(s) || n.mkdirSync(s),
        (r = [o.join(s, e)]),
        n.writeFileSync(r[0], Buffer.from(t), 'buffer');
    } else {
      if (!(Array.isArray(t) && t.length > 0 && 'string' == typeof t[0]))
        throw new Error('file: parameter error');
      {
        const e = require('fs');
        if (t.find((t) => !e.existsSync(t)))
          throw new Error('file: the second parameter file does not exist');
        r = t;
      }
    }
    return this._queue.push({ method: 'file', args: [e, r] }), this;
  }
  value(e, t) {
    return this.evaluate(
      (e, t) => {
        const r = document.querySelector(e);
        if (!r)
          throw new Error(
            'value: unable to find element by selector "' + e + '"'
          );
        (r.value = t),
          'TEXTAREA' === r.tagName ||
          ('INPUT' === r.tagName &&
            ['text', 'password', 'search'].includes(r.type))
            ? r.dispatchEvent(
                new window.Event('input', { bubbles: !0, cancelable: !0 })
              )
            : r.dispatchEvent(
                new window.Event('change', { bubbles: !0, cancelable: !0 })
              );
      },
      e,
      t
    );
  }
  check(e, t) {
    return this.evaluate(
      (e, t) => {
        const r = document.querySelector(e);
        if (!r)
          throw new Error(
            'check: unable to find element by selector "' + e + '"'
          );
        (r.checked = void 0 === t || !0 === t),
          r.dispatchEvent(
            new window.Event('change', { bubbles: !0, cancelable: !0 })
          );
      },
      e,
      t
    );
  }
  focus(e) {
    return this.evaluate((e) => {
      const t = document.querySelector(e);
      if (!t)
        throw new Error(
          'focus: unable to find element by selector "' + e + '"'
        );
      t.focus();
    }, e);
  }
  scroll(...e) {
    if ('number' == typeof e[0]) {
      if (1 === e.length)
        return this.evaluate((e) => {
          window.scrollTo(window.scrollX, e);
        }, e[0]);
      if (2 === e.length && 'number' == typeof e[1])
        return this.evaluate(
          (e, t) => {
            window.scrollTo(e, t);
          },
          e[0],
          e[1]
        );
      throw new Error('scroll: parameter error');
    }
    if ('string' == typeof e[0])
      return this.evaluate((e) => {
        const t = document.querySelector(e);
        if (!t)
          throw new Error(
            'scroll: unable to find element by selector "' + e + '"'
          );
        const r = t.getBoundingClientRect();
        window.scrollTo(r.left, r.top);
      }, e[0]);
    throw new Error('scroll: parameter error');
  }
}
module.exports = new UBrowserClient();
