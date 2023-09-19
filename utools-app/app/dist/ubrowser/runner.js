const { EventEmitter } = require('events'),
  emitter = new EventEmitter();
function callRemoteFunction(e, t) {
  return new Promise((n, r) => {
    const i = Date.now().toString();
    emitter.once(i, (e) => {
      if (e.error) return r(new Error(e.message));
      n(e.data);
    }),
      process.send({ method: e, methodEndKey: i, args: t });
  });
}
function waitTime(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function waitCall(e, t) {
  return new Promise((n, r) => {
    t < 250 && (t = 300);
    const i = [e];
    let o,
      a = null;
    const s = () => {
      callRemoteFunction('javascript', i)
        .then((e) => {
          if (!0 === e) return clearTimeout(a), void n();
          o = setTimeout(s, 250);
        })
        .catch((e) => {
          clearTimeout(a), r(new Error('wait: ' + e.message));
        });
    };
    (o = setTimeout(s, 250)),
      (a = setTimeout(() => {
        clearTimeout(o), r(new Error('wait: ' + t + ' ms timeout'));
      }, t));
  });
}
async function runWait(...e) {
  if ('number' != typeof e[0]) {
    if ('string' != typeof e[0]) throw new Error('wait: parameter error');
    await waitCall(e[0], e[1]);
  } else await waitTime(e[0]);
}
function findWhenEnd(e) {
  let t = 0;
  for (const n of e)
    if ('when' !== n.method) {
      if ('end' === n.method) {
        if (0 === t) return n;
        t--;
      }
    } else t++;
}
async function run(e) {
  const t = [];
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (r && 'end' !== r.method)
      try {
        if ('wait' === r.method) {
          await runWait(...r.args);
          continue;
        }
        if ('when' === r.method) {
          const t = findWhenEnd(e.slice(n + 1));
          if (!0 === (await callRemoteFunction('javascript', r.args))) {
            t && (e[e.indexOf(t)] = null);
            continue;
          }
          if (t) {
            const r = e.indexOf(t);
            for (let t = n; t <= r; t++) e[t] = null;
            continue;
          }
          const i = e.slice(n + 1).find((e) => !e);
          if (i) {
            const t = e.indexOf(i);
            for (let r = n; r <= t; r++) e[r] = null;
            continue;
          }
          break;
        }
        const i = await callRemoteFunction(r.method, r.args);
        void 0 !== i && t.push(i);
      } catch (e) {
        return process.send({
          method: 'runEnd',
          args: [{ data: t, error: !0, message: e.message }]
        });
      }
  }
  process.send({ method: 'runEnd', args: [{ data: t }] });
}
process.on('message', ({ action: e, payload: t }) => {
  if ('run' === e) return run(t);
  emitter.emit(e, t);
});
