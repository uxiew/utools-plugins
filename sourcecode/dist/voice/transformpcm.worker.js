function to16kHz(t) {
    const e = Math.round(t.length * (16e3 / 44100))
      , n = new Float32Array(e)
      , o = (t.length - 1) / (e - 1);
    n[0] = t[0];
    for (let r = 1; r < e - 1; r++) {
        let e = r * o
          , a = Math.floor(e).toFixed()
          , l = Math.ceil(e).toFixed()
          , h = e - a;
        n[r] = t[a] + (t[l] - t[a]) * h
    }
    return n[e - 1] = t[t.length - 1],
    n
}
function to16BitPCM(t) {
    const e = 2 * t.length
      , n = new ArrayBuffer(e)
      , o = new DataView(n);
    let r = 0;
    for (let e = 0; e < t.length; e++,
    r += 2) {
        let n = Math.max(-1, Math.min(1, t[e]));
        o.setInt16(r, n < 0 ? 32768 * n : 32767 * n, !0)
    }
    return Array.from(new Int8Array(o.buffer))
}
this.onmessage = t=>{
    const e = to16BitPCM(to16kHz(t.data));
    this.postMessage(e)
}
;
