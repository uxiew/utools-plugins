(()=>{
    "use strict";
    var e = {
        n: t=>{
            var i = t && t.__esModule ? ()=>t.default : ()=>t;
            return e.d(i, {
                a: i
            }),
            i
        }
        ,
        d: (t,i)=>{
            for (var n in i)
                e.o(i, n) && !e.o(t, n) && Object.defineProperty(t, n, {
                    enumerable: !0,
                    get: i[n]
                })
        }
        ,
        o: (e,t)=>Object.prototype.hasOwnProperty.call(e, t)
    };
    const t = require("electron")
      , i = require("electron-settings");
    var n = e.n(i);
    const o = class {
        constructor() {
            this.services = {}
        }
        get() {
            let e = null;
            const t = Array.from(arguments);
            return t.length < 1 || this.has(t[0]) && (e = this.services[t[0]].resolve(t.slice(1), this)),
            e
        }
        mget() {
            const e = Array.from(arguments)
              , t = {};
            for (const i in e)
                "string" == typeof e[i] ? t[e[i]] = this.get(e[i]) : t[e[i][0]] = this.get(...e[i]);
            return t
        }
        set(e, t, i) {
            return this.services[e] = new class {
                constructor(e, t, i) {
                    if ("string" != typeof e || "" === e)
                        throw new Error("Name is required");
                    this.name = e,
                    this.contrete = t,
                    this.shared = i,
                    this.instance = null
                }
                shareable(e) {
                    this.shared = e
                }
                resolve(e, t) {
                    return !0 === this.shared && null !== this.instance || ("function" == typeof this.contrete ? this.instance = this.contrete.apply(t, e) : (this.shared = !0,
                    this.instance = this.contrete)),
                    this.instance
                }
            }
            (e,t,i),
            this
        }
        singleton(e, t) {
            return this.set(e, t, !0),
            this
        }
        has(e) {
            return e in this.services
        }
        remove(e) {
            return delete this.services[e],
            this
        }
    }
      , s = require("electron-is");
    var r = e.n(s);
    const a = {}
      , c = require("path");
    var l = e.n(c);
    const d = require("url")
      , h = require("fs");
    var u = e.n(h);
    const p = require("crypto");
    var w = e.n(p);
    function m(e, i, n) {
        return new Promise(((o,s)=>{
            if ("GET" === e) {
                if (n && "object" == typeof n) {
                    let e = "";
                    for (const t in n)
                        void 0 !== n[t] && null !== n[t] && (e && (e += "&"),
                        e += t + "=" + encodeURIComponent(n[t]));
                    i += (i.includes("?") ? "&" : "?") + e
                }
                n = null
            }
            const r = t.net.request({
                method: e,
                url: i
            });
            r.on("response", (e=>{
                const t = [];
                e.on("data", (e=>{
                    t.push(e)
                }
                )),
                e.on("end", (()=>{
                    let i = null;
                    try {
                        i = JSON.parse(Buffer.concat(t).toString())
                    } catch (e) {
                        return s(new Error("服务端返回非 JSON 文本"))
                    }
                    if (e.statusCode >= 200 && e.statusCode < 300)
                        return o(i);
                    i.errors && (i.message = Object.values(i.errors).join("\n"));
                    const n = new Error(i.message || "返回 " + e.statusCode + " 错误");
                    return n.code = e.statusCode,
                    s(n)
                }
                ))
            }
            )),
            r.on("error", (e=>{
                s(new Error("网络错误 " + e.message))
            }
            )),
            r.setHeader("Content-Type", "application/json"),
            r.setHeader("Accept", "application/json"),
            n && "object" == typeof n ? r.end(JSON.stringify(n)) : r.end()
        }
        ))
    }
    function g(e, t) {
        return m("GET", e, t)
    }
    function f(e, t) {
        return m("POST", e, t)
    }
    const y = require("asar");
    var b = e.n(y);
    const C = require("zlib");
    var v = e.n(C);
    const W = require("os");
    var S = e.n(W);
    const P = require("original-fs");
    var x = e.n(P);
    const k = require("internal-ip");
    var D = e.n(k);
    const _ = require("addon");
    var I = e.n(_);
    const T = I().getLocalSecretKey();
    function F() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }
    function M(e) {
        return w().createHash("md5").update(e).digest("hex")
    }
    function A(e) {
        return new Promise(((t,i)=>{
            const n = w().createHash("md5");
            n.on("error", i).setEncoding("hex"),
            x().createReadStream(e, {
                highWaterMark: 1048576
            }).on("error", i).on("end", (()=>{
                n.end(),
                t(n.read())
            }
            )).pipe(n, {
                end: !1
            })
        }
        ))
    }
    function E() {
        return M(F() + F() + F() + F() + F() + F() + F() + F() + Date.now())
    }
    function B(e) {
        return e.startsWith("Double") ? "darwin" === process.platform ? e.replace("Meta", "Command").replace("Alt", "Option") : e.replace("Control", "Ctrl") : e.includes("Meta+") ? "darwin" === process.platform ? e.replace("Meta+", "Command+") : e.replace("Meta+", "Super+") : e
    }
    function V(e, t) {
        return e = Math.ceil(e),
        t = Math.floor(t),
        Math.floor(Math.random() * (t - e + 1)) + e
    }
    function O(e) {
        const t = w().createCipheriv("aes-256-cbc", T, "UTOOLS0123456789");
        return t.update(e, "utf8", "hex") + t.final("hex")
    }
    function L(e) {
        if (!e)
            return "";
        try {
            const t = w().createDecipheriv("aes-256-cbc", T, "UTOOLS0123456789");
            return t.update(e, "hex", "utf8") + t.final("utf8")
        } catch (e) {
            return ""
        }
    }
    function R(e) {
        return e || (e = process.platform),
        "win32" === e ? "Windows" : "darwin" === e ? "Mac" : "linux" === e ? "Linux" : e
    }
    async function N() {
        const e = await D().v4();
        if (e)
            return e;
        const t = [].concat.apply([], Object.values(S().networkInterfaces())).find((e=>"IPv4" === e.family && "127.0.0.1" !== e.address && !e.internal));
        return t ? t.address : null
    }
    const H = require("semver");
    var U = e.n(H)
      , K = {
        yi: "$$$h$i$p$q%)%*%+%V%y&=&`&d&i'1'4'j'l(0(T(^(t)M*H+I/2/6/I0^1%2>3v4<4i4x5A5V5v7h8X9=9W9d:<:U;J=g?^@gAfAzB:C_DDDFFfGCGKGSH5HSIbJ>L>M/M5M_MlMzOBONOYPOPPPcQHR/S$S5THUbUgUrVXV_W1W2WXX`YCYmYsYvYwZBZrZsZtZu[7[;]4]B]w^;^Y^y_X___la+c*cBcScvdhdie/e`fsg`hoiTkemamin;nAnVn[oWo]pEpfqWqerJrXt;t?tpuIuPvRvbvuw1y)yCykyw,$v&6'x(;(O)h)p*K+.+D+S+`+d/u0T0c0e1j1m282[2j4^5S6H8&8h9e;9<6>2>8>[?R?V?]?o@8@?@OC+C1CzDVEoF*H=I`K)K2KSK[KnL;LZM1M8MKMoO<P7Q4QaRYV8VuWhXEXzYPZ'[l]D_=_X`5a*fDg(g]g`haiak1k6k?kUkakcl5l>lwmsmyo6q%qernsMsZsqt%thu/u0vKxfxr,%L'9(/(3(p)K*/*v+6+;+@+X.:/F/J/R0Y1n1o1u2N2Y363=3b4G566a7D7E7`7e7v8A9$:Q;);1;2;K;^;q<?<@<Q<y=t=v>=>]>k?/?s@YB=BVEwFHG)GHH5HDHcHpHzIBIcJ+JPJhL(LAM'N1N9N=NZO$O&OJORPMQ/T>TcUzVnX/Y<Y[[f^Y_sbSbobpc@cMd2e+eBfJfogliYj'jXmUmVn=qDrDs8s9sCsxt*t8tItatfuluqutw9wEwYy*y6",
        ding: "$%&A8*<eHtOLU9Vk]8hryU,9yEHJPJRKVObRkTUToUslxmPpLssxv,'K)s.P6i;eLyN_QVRVU_VpWwXl`]bLc7cme1f_wuwx",
        zheng: "$%%['m1rD3D7E^InLJSGT)T0WS[C[P[s[w[x^.aVb`e[fjgIhlhri?ksmnnNqV,*Q/&<O=7A7CRD%L5N)P.P`Q$^7^j_cc3e8m5oF,$_7N97:`</<RCOKSL[PDRPU+WDX*`Gk^qi",
        kao: "$&QETyfrmfvm,1c=>BHlE,'QQ6Wc`Rk1mbn$pE",
        qiao: "$&%$)()Q+<.W/*3d4y=F=Y?*?`FCFMFdGEMPSFSOTyUZVMW;WfWz_J`sb_kDl.l?nLwK,%j&t'1'5'i)7+U+V+^8N>S?y@'BTM_PcQrSzT&U5UWUxV(V/Zd[G_Dg7gViqkol;vGvXx>,&L(D8X:p<]=IAvAwBnC/DHDIDVL'LOLSNlSMSNTaUBUkXx]E^Za0a6aGa[aqbhc]jdk0k2",
        yu: "$&$4%M%Z%a%c'+'E(/)C)a)f*(*y.:.q/W0H5g7q8?9&<%<t=C=U?fANASAvD+DWDrE$HdHfINITJrK*K1K3L*L.L]M1N/O9P1P7PhR5SLTAT]TjUHUwY%Y&['[d]Z_L`Ba$a%a8bHcOdMe(e)eCgMgzh7iBn.nonyoBofpdt%vjw?xnxoy'z(,$G$V$m)4)P)`)g)h)u*6*M*e+n/[2k40424=4c4l5[7<7S8M9D9H9P;m<%>:>c?Z@+@>A3AYCSCUDRECEQESG)G1GRGoHtK.L=LoLxM(MmO4OEQ8RTSCT0T@V+V<VBW6WyX7X8XUYLYaZ;ZQ[.[5])^e`/`xa<aPaub/c<e]h3jWkCkSkhmnmonLpgrHrKrPrQs;s>t+t.unv(y)y*y6,$T%5%K&K&v')'r(c(r)a)y+z.4.Y/k1r2c373x5a648G8]9E9W:9;?<[<o=/>1>VCRECF3FfG/H:H@HAI^IiIrJOJoK*KCL3M)N+NqOmPhQTR[S?UhWBZT[J]A]r]t^C^n_(_._/_xbZbsd$e9egfAffg$gShriFiljVjnl2l3l=lLl]lfmlnLn`oPp.q^r/r1r4r]tBtZtituuTv$vFy(y3yG",
        qi: "$'$2%0%f%p%r')'8)b*I.<.b0T1N3:8n919D9X:6;Z;p<><A<B<M=J>G?B?ZB1DJF(GtHEHOIfK:KOR0R8RFRISqTkWLYn]B]^^n`/a0aKbFbGbQbtcVd<e?hQhdilk*manAndneoHo^qSr+sUt@u)uavNvPwJwcx;xVx]x^y$y0,%Q&)(G(V)n*%*&*U.Z.^.j/F/p0+1+1^3j3u5@5A6q7X:3</=jClE<ERG8G<H@IsJWK&KjO2OhRlS.TOTdTjU0UVUbUdV>VhVnVoWLWxYBYh[R[T`b`da+bBcae3e4e6e<eHeNeli*iGj4lHnOoVqls`t3t@tLvZxSx^xhyy,&q'e'o(&(Z*?*B*H+N+x+y/9/Y0^0o2j3c3g6S7&909V;n=cAAAiB8CHEWHBHGJkKmLnNuRWTiUKXZZp][^)_QbXcwhahbi7j:j;kglAlNn/o3pbq)s.s6s>vLv[x]xc",
        shang: "$($0'N.=<4CID9F8PxPy_*a1b9dgq(,&G*v+>/V5j7E7t?hWfeci/,%b/]3U6D6Z:@?P@6@nR5TjVBa;l<",
        xia: "$)$1%6(w)c+_5^788Q9b;o?zB+ClGbGfSCS`Y2[icMhPnHqfuhxL,<N=4>LC0COC[FNGhK_KkM/Q;QXSyT2U$UGW=]H^DfPj/k_rhs0t2,&w)u**.m/M9?=TA8FkGiJ$S>SnTJU$Z)Z2]J]n_edNhum'npsnwF",
        han: "$*&_'o.B0M23246i6o8j;=;G<yAOCaJyMBP0R3T/TS]A_Sbsc4e*gtkml>mkowoxq5q6r?wyyv,*I/;/I/h2Q2b3&3W7u99:q=e=n?bA=BkCeFgJ3NZPd]@^Bj?l2n=wEx3,%])z*e+Y.2.3/D:V=W=^F@JnK1M=NsQ<QXQlYsZu[.^rarb3bQc+c:cod6gFgUhMm)qOsuxP",
        wan: "$+$_*52I3>6366;OD4E@G<GjGkIQKKKcO>OMREWGZEZe]V`=`>e^gdh&h7hgq8qCqGqZtFtNx*y>,&<+g/?3V5y8j9U;f=QEdFzG>K;N]O>PtQnTf]0_&c>d^dge7e>h:i<l+o[o_pGt$wDwRwgxiy(,%f'7*D.E/v=g>m?v@*CBF6F9QNQ_R0RtT9b[ct",
        mo: "$+$o0q4$>B?1@:@BB3EvFNIeMEMVN(N=P<PzVzW0XCcWcyf3k?kNkOlxmNp[sbuH,&`'/*m*n*p000?0I7s:e@dCDD^MVNRP:P[P^QZQdS@UcVYXbbmd(d6fsgmltoOq:uWw.wQ,%8(<(h+B/y022p:>:?=9>I>N>O>P>_PeTZY0]:`mf=fWg3i>j^jxlVllm%vwvxw>w?",
        zhang: "$.&G&U&f.C0+F+M6U<VwWEWnWxZ6Z7ZK[2b&e%h_r<t8,&^3J3S8081D_HIL]MFMNQ`V'[ca_bEnZp),%S0/?_@DJ=LQU)YbYj^6a;eui=oLvX",
        san: "$/&N'H)W+s6h7S7T7U7V7WG?WFYyn=,.;.<.E8tBObKbhbnbog<,TaU8Z$fDg9km",
        ji: "$2$T$h%;%r&:&;'5'8(L*w+H.f0T0]0_1k212?2E2y3@3F3t4r6?6Y6d7]7p8;8G:C:s;j;y=8=s>w@(B4BLC/DHE*EBECFcHEI(I=J4JBLxNjOuOwPoQZR$RBTTTUU.UjVWWLX<XsYWZgZh[8[^]:]Q^?`(`@aOc5cVcrdAdDeNgJhaick*kYkwl?lLlcmanAohoiojr2r3rKsTsUsqtdthx0xk,$<$Q$[%[%v&l'I'a()(3(K([)/+5+_/W/e1<1X2D3d4V5L7U7Z8U9k9s:5;3=jB:BhEKHbI&JvK:KAL*LdM:N$N0NFNSQSRmUjUwW?WpX$XnYBYSYbYhYoYuYxZ*Z=]2]6^+^p_E`<`@a)c1c6cHcPdHe%e6eOelfyg1gQgch9h<hlhzi%iGjhjljrjslglpn$oPq(r8s[tJtRu%u[usvZyi,$a%1%Y&>&y'4'e't(e)0)=)B)q.S/A0A3<4N4Y5C5D5g606?6S6o7(8I9/9>:f;$;d;h;s<F=U?^?j@lAVAiBWBrBtC3C8CsD+DYDsE2FUG*GdHxKHPgQ)RZS5U0UPV+V?]3^5^H^a^y_+_G`%`/a&a^b<e0fKf`idjOkQl@lWl`lelhm4n4nWo<oEoFotp0pLp^qLrUsEsqt$t3tgu/upv<x_xaxbxcxdym",
        bu: "$3's4^6B6E8d:.;<CwCzD.DpKFSNVjXnY7^0_Weyh%h'h>q?uw,*S*V*WIj^[_w`rvt,%R1p3>8fC$FwI5KkKyN3O:OpRrW*WJeceqmuqHrYtw",
        fou: "$38eID,+/<_cGiuixiz,_2q_",
        mian: "$5+G0)0t4W4c=/K)KDLBN;O2a.tEx[,(F(b/7024`5H9JA[OwP>PkR>R@REbPd^eMekf$i3iCpor;t'wRy@,.X`T`U`Xmgvevfvpvuwdwe",
        gai: "$6%4([5=5>C5J5S2]9dFk7mhq.t<,$i&%&&6/7dI*JxOHWFdBdQtGv>ya,$r80<S>)?7?>@dKDOUW)]B^)",
        chou: "$7$8&E)i+</F8Z@'KgN*WCX(^8`8`tcZf7i'j4t^t`vaxNyD,(D+:@[B$B_BbK$K6KIMMN^O[QOR7YJ^S__a(ccd4e0i6r7r:x','`3Q84;P;R<XBuC.DXJ0MAMFMoMwNA^o_$_*lYmF",
        zhuan: "$9'J.9.T.d3Z7R<[@_DnEwM?NoPaPg_4l2,7l;zGdH:IyS8UQUT[t_L`)`1`Za/fnlSpPq<,$'0B4V9Y:k?m?v@yE]FpG>LMcId=fFg:oJ",
        qie: "$:'h2=5b6y=vHOIiWK^I_U`_a:aig.s;vNyB,1z3dD>KNNES.YQZ)ZY[L]O_+_Qa?mitiuR,+DANBOCGKFSGXqn6",
        ju: "$:$e%>'K)9)h)t*V*e.q0U1p3I3j5&5D7x9k<hD5DLFpJ*K7KGKqP>QJQOQqQsRVR_SoV.VNVPYq]0]v^(^4`YaQc;cseSfLfRfZg?g]h@i(i^l]ljpMuFukw:x@yEyFyN,$p%('B'v):)G*Y./.70L0b102$3]3z4o5c9h<Z=?=r>'BABGC*C;F+G*L)P5R5R`SBXk[/[8^?`gasbAg>jGlbmHmSpDrSsCu1uBw8wq,$E$O%M(s)d*f+v/i2I3a517a94;x>*>^ANAgBJBOBSBsC:C@C`D9DTE3EDF&G8JSK/L%N;OxQqR.UvW.XRXnZF]`^ia>aIdXdvgvgyhHifixm6mBr)rds(sAsaxBxExryA",
        pi: "$;&r'='i/+3Q3k5t8`8e<R?o?p@&@KAyBfD2FgIDLaM+QKRfT3UIX>^P_Hc)eGezf1iHlYoMs=tjtk,$s+r+s4.8L9g:4<9>=C)C5CkGGJ'KJKMKuLLMqNuQ/S4UAV:V;WXXYX_YU]A`*cKhBjLj_jbjqkdl]nPp$p0pIq)t:tl,*;*l*m.7/G/j192b3J9(;.>B>D>ZGrK5KnO/OLOlP=PsQ*R9RCT*W`Zy[s]0]c^@`)a<gzkBlqm*m;pAqcrrtbtmx)",
        shi: "$<$=%:%?%]%^&>&S'g(U(d061'4M4q5S6%617$809H9S:L<Y=w>_?E?_D$DDELG=H/HlIvJRMpOPOQOVO[OeP2PDQBQWQXS7S;TITJU/ViVoW=YzZ%Z&[h]C]^^Z^^`rd]fhfyiQoCp&p)pbpcpuuLv3v9v?vv,$Z$h%A(7+0.U1G2?5V5_5z6G6T6c9N9R:)<j=*?&CICPCXDSGtK$L?OuP*P?PvRXRjSxTxVaVbVvXq[O]e^H_=```ucxlHrZr^wYyx,$8$:$t)t*..[.o/^4E4z535P6*6H7y8%8Q9I9K:0:o<4<C<E=?=p>w@QEyGNH9I*IGIsJ?JTKAMXN9NINNNPNQO&OcOuOvOzP.P[Q>SHWZe+e.eLehelf^fkg]h+iumDnNnso'o(pWpmqPq]sju2x=x?",
        qiu: "$>$F&E)G7K82;T@yBlEsLKTEVUVV^s_=drjGspwi,$_'D+'.2/4/E0d2M4m5f5g5h>qAvBgEFFjHDNzOLXIXJZ$_SbbcBdbevn%stsxw3y%,%D(i)o)r*^+Q.k/%051.3:696O6k6l?G@fApI8I;J&K3LzMoNaO+Q@aDaEbNm0msngnhoCpxsLuhxOyZy[y^",
        bing: "$?$L&J&P(K*0*z.%0S151:CLP*QYQfX4X5Xo^Leuhwk&pPpmtnuRvYv_xKxW,%r(I/'<bG%L3PHWRXGYIZ`[`dEu8,*r8?K6OhPZR&]1`B`ya<aVeSeofwmW",
        ye: "$@%1&&&/*j/'1@848R:S=7>i?@D(DwF^FkGoPcSMUeUff.fxgzh)hiiqiulXl^lklmlnq2qlrNrOrbs's)uJuKyo,$P$S*9+11L3T7o8p9]=B=a>g?t@vAAADGkHKIELfNjR%R.V5[+eslyp=yG,189l=*K*K<LcNTO0QnSSSdStUrWk`W`ZbKclerf;g2iZs0tk",
        cong: "$A&L5@7uA4A;KENu[U[V[X[a]W^K_k_wa?aqbKr:u*xY,$J&C&k&v)K4%7a7j8>8F8g;I>+?NA$G@H;H?QfTP`%gWmOmTmXm_tdu_yp,%A%x'm0(8s:;?Z?[RSSQTbTuhkiBjL",
        dong: "$B(n*a.S161E1W464d5%:0C.D:FKJ1K=MyRtS4T.T:[]_1c8d;g5iopktSvExr,.h.t1i3Y5d=.@/CLSs]E_CdIo.o:pHuAwkyb,&j.F96Ht__h9mEn9s=sbu9x%",
        si: "$C%i'e'g'k(x)b)o+L+]/[031c7@7H86:3>'?&?O@zJ&K2LRNgPXVYYG^7^qa@klo5tMu?v0x;,$8%K*j/N0_0v1.1W1k3:96:Y@)AxU=VgWjWsX%X?[e]Sc.c/dTeuh1iJj^l^l_mqmu,&k'$)T+M.(/6040R5Q>JNyOiOnPNPhQ9QaSXU;XudZdwe+e2eBeJfmh1hUhyivn=tGuDxHyp",
        cheng: "$D%'%()3*p.c1J1R92CqCxD7DgEGEPJdO_SZXp[P_c`[bPb`cid2eMeqgVhSigjak0kgkhksq=q^suu6v7xixyyG,'?'@'C't(//&1'1P2^2u466=9*9.:jA9AeF[F`G6K=OMPgQkR9TNXcXoY5Y[Z@Zq[B^Fdaf7j3otvz,+'0T308_<HA4A6IHKWMLQySzU9U^UuWiWn[z`Ic'fMhSi(j5n&",
        diu: "$E$H,,Q3WxdK",
        liang: "$G$J&*)O)l*4*L0G1S;6;d<P=BF@_ihmq]whyI,&O3_5sb8b;breWp.sfwN,.C3T9<<tC)F2FAFRGXG_NUS$`EhLlKlP",
        you: "$I&2'B(%(<(h+>/]0w6I7Z7^819P:a;B@6AII5JMNnOWQ*Q.SASUX:X;Xm]U^8^=^H_gbLcei@mgoEs?uivjwkwu,$H&/(c)@/o0'0W0p2U525p7L:VAaAbB$BpC8DDDEE0E9JGJJKfL=VwW[X]g+grk%k@lsm6nFtfwBwFwJw_,&S*_*c+j.j798V<`>GF5F]HuI6IZIuK0KxLmLxMGNOOqQ4WRWhgglzm9p1p;v:wCx>",
        yan: "$K%G)k*r+(.E/o04053C3H5x6j6s757?7E7F:S;C;N<`=@=G?P@$@C@R@oCrE(EdF;G+G9H3HBI7IIJHJNK+K0M=MeMkN4NENSOgR`T4TQTaTbUPV2V<V=V>V@YaYr[%[&_?a;cKc_dOdmeOhqi%iCiZn?pHq+qYr/r`rnryxFy&yzz$,$2&m'T($(U)))W*3+1+Q/z0^1h3m4G5(515i64717g87;P;V;j;l<<<==9=U=d=l=o>6>7>`?H?w@3@rAuCbCrCuF@FiGBJ+OBPZS6S<SrT=TKTmV`[6^O`&`jdyfjjRkBo3p>qxsjsmsntMw@xJxe,%W)g+m._1W3]3z5H6'6e6g6h7@8;9e;N;a;c=4=M=n=o>'@'@5A%E7E?InKVL*LPLoM+MWM^N<NBNKWWYqZOZQZR[+[K[P]p^*^[cEcJc`d>e[fVhchfi2iUi_j6l5lIlZnfqIqOqgr=sVsztRv7v^wGwJwQwRwSwVw]xFxKxqy2yO",
        sang: "$M=D=njKw7w8,%tUC,4:T+cOdC",
        gun: "$N`5x`,7*7PPsSpUSeRf1i0,%(%[1y2T3Y:JFKG]m:mopY",
        jiu: "$O$l$m%/%5*1.m3[565M5U5q7;9y<mHyQ;Y.Y9Y:b0gki@iiijjyn)onsrtHuxv8w;,&Y)O+A/1/U<$AiEPK]Y`ZLc0c4cZh2rFrOrTrYxn,A=M*Yd[Fb7b8kfl0n@qGtTu.uzvNy$",
        ge: "$P%Y&`(A(D*93T5F8B8F8c9.:E;%;A=x>6>KAuE`ZW`xd(d5dJe0g2j)jjltmzvw,%W(a*:6m6yAvBlD@DuK[OHSo]c^bc=h7n(o9q$qgr?s.ueyY,$r*(+*+>2s356G9h9wF[G%PYStT$TDX(Y3Z9Z:[C^.`[a$aUaoayd.fthgjgl4mSm^p6qyrIuK",
        ya: "$Q%m%o%q'L*%1>4(6q6r6x6z8T9(:h;X<LA_AkArCOD/D_FzJLJ[KpNyR>SxSyXJXVf6f;gBhji_tuwFyMyz,.p.s3Q7V8[AdBtD&D>E[FqIEKMKkLDLqPyS3TrUGY9[+]:m>t`,&d*J1d585:7/;yEEG9HQK*O0REUTWg^`qhr2s*u4u;xiy<",
        pan: "$R1B2Z7nBXLjW^fFfTjUm.uV,%U0:181J5o6f8V:a<;AIASJkK(K*OJOVOnOoOxPIUJUva1fIm/nBnqqNxs,$V0>2X557]BNCuD1QwT(VbZ]aTbarp",
        zhong: "$S&q'('A*t1*2Y=:E3ETGTI:I?L?Q:We[:]$]N]XnouX,*`/j0g<0>JC&LvO7P]VsXKYXZ2^1aDcyenhZnYp^rzv7,%s*I*Q+t/V/p1P2'2*2+9OCWD?NSOSQISaURW1Xyr.x:",
        jie: "$U&I&v*M*P*w+V+l/)2]2^2s494J6O6P8c:s;y<?<w=V=z@(DuE4HxI8J$KWL<LFLYLtNWOiPoQPQTR@RKT6T`TtUkUlUvV$X+XL[f_Nd4dLe0fihIhxi0i4iljSlSlqlvo@p7tDtRw$w:wCyB,$6$R$]$^%6(4+l1K1z5W6w8R>vBMCFEZGPGaJcJdKNKXKhL<N(NLQ5S0TrV3XwYW[p_FcHd2d>hfkElgp+sytGwSx:,%G't*U+=+P+k.Z0w1&1G1b2%2.2I2n2q354=6I6M6w8.8`8p:E;i<F<YAVBiC7I$PAS^ShYg[y^&`ua&bld)eEj[lmmHpDsQsW",
        feng: "$V&x*$+)/.191o1s1w1y;mCgE2E6GXHGIPPUP`SQSRTDk'u9wb,$9(&0A0F2i4q5Q6(8$;E<>=W>.>N?TBDD4FyKrLzOpS>U2_Ne$ffi[s8w7yO,)6+]175<9b<)=k?h@vILLfLuQ]TKToXI`+`<dJdodqgTqMqQqkvr",
        guan: "$W*:0Q1(6COJ`)`*`bb+i:k2o%y8,&J)b+g1>3M3l8C;NA'GAHlIBL^M7MjOWRJRRRSV]WN[$^@_%eFhHj0j:rcwD,$(5F5n6$6&>r@MDNFNJ<R^TTV[Z4Z8ZnZs^uewg*o)oep)q+qBu'v+",
        kuang: "$W/U1?4I5[5d6C:gB/G)H:Ri]h^bcccdePp'prrkw*,0`1x@kByC%P4PTRBRvSbSgVLZB^(^Td+d8gqh;,8D8O<A<b?*@TEPEZEaEhHIJtK>LiPOQfVArjw1",
        chuan: "$X'J.9.i3X=2AVE8VAVCrAynz%,*0.a/>D;ENGbZU_Kq<rfrlrts/vB,?ICUFXIoNnVvs_",
        chan: "$Y%z.d/5/f0`2c393Y3y6;<c=H?/@S@dG7KxMfNxT;U6U=U>V/WpX$YE]=ckcqi8j(jwkHkQmGo@p%xFxa,)E+u2F5t7M8x8y9a:d;<;^>_?sD`J8J9T+UUWWX&`7ePf8gEg[gvgyi_kRscte,$+&D.O/l0.0J0]3I4k5R6+8U9*:X;I;T<s=1DcH=LlLpN*QUQ^TnVWX0Y`ZIZx[RaacbdFfXg1jM",
        lin: "$Z%U.v111f1g7J8[<7G5SmUSYSYT_%_Q`AcCcJfHkro:q[rGtz,'3'l(?3n9&9I;8=v@.DkGEHVJ$KFLbMvMxR)TRUr^qb0bFe)g=l9qDr2xM,&8(P?5@`DFD^DhDyG$G7GmJJK=L_U5ZK]*^=_]iLo^q<vJvY",
        zhuo: "$[*Z3D3h697h<2<3?UB(F2IZK<[6fSgph$l1lHlenZo1o4o7o8o;qIw2xDxSy1y7yQ,%h(x/=2@2T3b3y9l:E;D<(<X=O>5@'BjG4GJP_THWmZ1ZGZx['_na5aOgYisjVm7uOyU,%$'v0v1I9)9;:L<kAkM$QgUjUmYYrvtAyy",
        zhu: "$]$b%N'U'r'z(f4&474=>A>x@pBuF_GFNTO3OFPkQiQwTNWPf:f>nKnZo>rzsesfsht_v)v1ve,%s&e'O(x)')+)Z+P121d4i8s97:$;&;b<P<f=5>W>u@;@KA/D8FFKsLrP;QtRPSMSfUdW/W;Y$Zb[]]%]&]/]J^)^I_>_O_r`$`Iclcod3hMjFk2l%s'tItqu5v)v9w+yU,%=&M(N*o+5.r0j131H2u4&7M7p8C9c<I<g>2>v@LBIB]DSEoHkI:IUK@P0PuR'V(VjWuX6]keAg[gwhAizmPnToGrBtcv@vBwk",
        ba: "$^&F'Y0I7c8)8f;3;7BSC^G;H=IWRRS'VZZ3dueEeXekfNgssjv%,)^;a<TABBeEJKgN?NKRi]4apjLjbk'l[nctOuUx/,*45A7l=xB7BAErNfO2WA`(`idRlElam/m8p5p7p>x7",
        dan: "$`&4'>'q.k/=2F5'5k6;6>9i;N<D<E<n=H?0?;@HI3L3VuZOZTZ_`F`aa4bec0eZf?i6kykzlVomuu,+4+E.u0&1C4/9d?sC<EgIWJ(KOL$LtMdMuO/P$RjRzX'Zu_0`PcTg[m(m)m1mgnap7qYq[xb,%0*z+l2(4)4Z6A6x8S<L?Y@%@tE%L$LaM0Mc_ub`esfIgehEk=r(w;wTw[",
        wei: "$a&7'I'T'x*[*x+&+W.e/c6Q6W6j7q9^;l;r<q=;=N@vA<A>AWAtFAG/J(JWJjL/LGLTPHPhQHQbS9S@T1TBTcU$UCUqV3VvWIWUY0[n[q`Q`w`zb:c6h6hNiIizktl3nqqosaw)xHyqyr,$X)J0G1R1r2N3B4w5%5E6.6L8K8W9':F:Q:y<J<i=+>X>f>o?`@NA<BPB`D&D3D:EiG1G^IAJfL=LnMkMnQPR6SmT%TwUBUKe;f%f'f?h>i2jfn^pes?t=tjuMvlwrxayeygyr,$3%H%m&='1'^(E)8.8.B.b.f/d1f1i4K5^5t82939m;H;Q<n=+C5DfDjEHFqH[IaJ)LZMZS1SCT^Z_[3]v]w^1^S_o`*ajapaxb)b0b4bkd[evf/fPjSjTjUlQm5mNmXn^n_pFpuq8",
        jing: "$c%h&(&.)U*L.?/80@1J1R2d3$424@4OBIBKBOF'I6K[K^KjOCVFWoZ@ZI[F[S`<bwc2lQnFoRoSqMqTrEr_wWxI,'c+$+)/^/_1H2:3'4695:uCgD[HBH^HdL7LGPzXRY3ZS[a[b[j[n[y]$^kafb=bHd.dve/hbmGnVo1obp:u]v@vDw<whyM,0Z8h;&BxHrI?QiTpYF[t`E`H`K`L`Nbec.d(iXnBpkrfs7s:vPvZxC",
        li: "$d(b)R)])m+c/a/j1^2K2`353]4%4'4?5/6m6p7(767A7D7f7h8M9@;);P;v=K@=@D@c@fBREUG4JcK5KrM:NQO'R(R]S=SDSTV%Y]_d_h_n`'acdadse&jXm)m8mTm[n_r0rPrisot0t?u3uPv=vHvQvUx:xJxUxl,&D(@(k(v)*)R)]*c*f0C0R0S2c2g386M7f9Q:U:t;W@c@nB7B8BQBWCZCdF;FmFtH*HAI/I2I;IOKcKoLPMsN+NqORO`PxQ%S%SNS]SaUzVPVQVVVcX*X0X9X[ZH[M[s]N^=_l_xaJaqb%b>bXc&e+fhglh*i`jdp's9tku%ugvNvmw)w/x0,$@$D%2&<(2(L)<*g+&+:+e.+/'0)0V0f1)1+15313C4C6b7Z:=;J=e>SA<BTDaG4G5GKHbIPJcJgKiLwN.N:NRNVP;PoQvR$R;T$TzV=X@Y3^P^Q^R_&_9`4`=iij4kWl4mxn'nFonoxp*pSpVq@qFqvs/t%u)uPvQvVw4wM",
        pie: "$fMMk]k^rF,.[8LQpu2,5OU?",
        fu: "$g%H&V'9'?(1)N)Z)^)r+C+`121v2R3Q5J959<9s:$;;?(BvC:C]G`H'I1I5IrJgKQKiL;MoNaO%OEP(PbRaS*VfW'WWWqXZZ+Z9[A[l^>^EcfdxeDeheif<fDgqh>l+nQo+oOsCtquGu]uzv%vzwZy2ygyp,$x.f171[2e3L6v9=<S=J>(A@EXEsFoHvJAJLJ`JgJnM[OKS&SKVzW$WbWvY'Y+YT[P]T]_^9^[^t`Rb:bZc_chcsdGdpduf&fUgghTh^iXjBjPk^n>npovpBpCplq8s6skt;tEtauIuNv'v<vowOx$y+yK,%D&f)[*S*V*h+1+`+d.c.g.u1x2P2S2h3j3w4T4t5>5@6j7T9R;f>+>g?X?n@=@j@xA>B0BMCaF:F`FbGWGcJuK[K^LJM6NcNhO9P6P:S3SD[_[`]2alb2bvdMdRgKh)iwkJl6m2m@manmp=pyqEqJqXqsrtsSvdvgvlvswbwc",
        nai: "$j(J*fHFHuI^N3O+Ygj[k>v(,.]59KUlQlRoCp;svxk,/L44HyNiRsww",
        wu: "$k$s%g%t&t'7)0)K*d.r/M/s3O4/4h596.6c8r8s9&939F;V<<=uAwBTDtE]FXHeISJiK*K.L&MOPBQUR2R?SbT[TwVQXOYKZ/]P]R]r_<_e_f_u`Sbyd*e(e)e2gijkmsoBogp1qBt%t't.v&x9,'0*;*T+f/K/L/S031a252f4m6O8S='=k>%?5?EAtB4EWF^F_GyHOJ&LTR(RpTcW8Zf[;_BadqRrit>tVurw%,&i(W+c/B0O8F8b8c:l<Z<^B*DZHSIFK.K]LBNrQRQcQdT0W:X9[e]H^0_@_D_a_n`chijEmrnyr8rZrls`tCuNuWukxAxQxR",
        tuo: "$n&Y(+(X)=9n:2<*<cB_E0IOLNMQReUXXx[7e$e/fMfOfPgOh/l3t6t?uOulyl,$;%i':'L.(.A/C0N0O0P3XC1SESFTq_.a:ctoroxw2xm,(V2?2[7'7d;oB;BDM;P$QaW][g].]/e3fagWgXgkh/h0i$iPi[imj$lcm.mdnqqtrXuCwpwtx9",
        zhe: "$n%O6n;4<N<u>A@<CtMF_PbCeFegjSkPq@qAt6ugxb,&Z*l2O4'P_RqS5UNaUallGm?yU,%j)w+J+b/^/w/x2`4D5/7r:A:P;C;M=DA7CYF8F?FtGVGlHWICJDQBS]XUgXmnt5uv",
        ma: "$o%Y+g8U;^=i>b>cI2LlMLN]XCf3k?tK,%<6JBNBoDOEUH&LaLbQ:RxU6VjWtj`xM,&2*0/P/y/zJ:TEYlgRh3ikj*klo&t.vvvx",
        me: "$o@0@:@NXC,:O,vwvx",
        yao: "$o$w&w)%*2+:+w.l5E8D:B=+=]C<E'H)I@J0L%L`O@Q1Q7R<SETLU]U_X8[p]&^H^gaLf%iyj@jrkUl?qyrgtUtyv6,$*%*%5&@*o+W6:79<s=)?@@^AEC7DHDnFMGwH4KbMANVP/R;URVlZTZ[Z_ZhZkZl[1[2]s_?c:g+glh8lBnNpcrJsTu;vjynz%,%$'V(;)(2D5;5X707b:6:7;S==EuGLJ/J;JVJePySsW7X'ZZ]r`rcZd^dyeTeihho/o`q.q`r*syt7umxNy%",
        zhi: "$r%Q(Z)j*/*R*k+E+]/Z1u2m3N3x456T7$8&8p9X:AB6B7B^BxDBDEF*F2GTIbJ@JxM]P6S;TIV[VrW)W.WrXaXcY6Zo[Q[`[w[x]E]]^dbCbNc[cbdBe5eHeIevfMg'g+g@h'i5jBj[k)k>kCkElulvm+m^o*o_ooq&qXtMu)uAurv:vCvuw4x$xOyKyd,$<%B&+&s(d(r*P*[+0.U/3/W/X080Y1$1_2+3w4K6t707A7c8J8i:Z<G?^B<CaD$HMI0IKK$KRKzL'LALBLQLwOgPNR[S+VOVnVpVxW'W>WUWgXEXQXTXhXqXvYCYDYeYtZi^EcOc`dYd]dxf5fqg:hJhYjXkgm.m:mJmfn<nlnxoHqAqOr=r>rArBt8t?tYuYx?,(8)7*B+G+s/e072/222U2V3`4v5Y6=6U6]7:8J<4=l=m>>>t?]?w@F@[B4BLBhCNCQD.D`DbE>EtF0GGGPHbKGKiMINePlQ>Q`V;WmXf[r]M^L^U^dg]gdh6i)i8iEjBnIqUqxr<s_t;uEw`wl",
        zha: "$t+A3U3g6v8P9v::;5<z=?=MHQOd^%dqf'f=g9iwjik9sdumusutv5v?,$&%:&[4r6F8r<%<g>gAZJJL2O&O+PFSA^uc[celnu@,*`*j6V7c98:^:n<6EEN%S:WtZ.[:_KeCmAmip<pOxVxY",
        hu: "$u%%%A%e*+1;5]5f9g9w;o<+=0=Z=^>W>d@9A5BwGHGIGLJGKbLWMGMHPARlVtWsZ*Z=]l^2^3^r`Ld1dQdSdTdXdYdZd`dkeUesjZk8nvp:pDs*ttvs,$A$B&0&2*?/n0)0H0w2H4@4B5P7>7J7K:?;+<o=Z>z?[C2D0G7GmIJIKI^V6W.]=_<`6aobTd9dwfHfZo%qRt2t6tVuFxRyj,%n&.)O)P)X)`/$/N1e6Y6^:R;9<$>6E_GILNMkRvS;SZ^T^k_CbJc*f$kdltnKnrovq>qVrksNs]sesrtouRudv)",
        fa: "$v':(G.$1C7dBqCCFHImS>ZXvk,'+0U0t2B;MF6GLL&N@NBQLS?]W^'jDjZjcv1,&^'pMrN7S%Z;[Bk@kD",
        le: "$w%X&@4a89>e]5ds,$d&@/+0oAiEISU]'`Gmzsr,[abAe]fto9ozq1",
        yue: "$w0&0(0/2L:l;@<F?XIFN9R:RjUx_7_K_md)e&eVhEm)s$s%s>tevH,$d&@'&(v11;;@yE`R<RhVfX2_?_^`yaCaNb.b?c:h8qq,)%*<*=8i8k<cATAzB6B9D[EIO7P<VVW7WLZGZH[GkPttu%wLy_yn",
        lao: "$w(B.^4A4B4m:T;2;c>$>uJ;MDSeUQ^`bpbqh0k_s[vn,&@'Y2m3?8e91=3AmCMFULVMaSvUlZX`[b3dCholClDlelqvPy;,+I0EE6E<FxMDN0Q(ULWdX7cUk3m`",
        yin: "$x'<(c0w1Z6V8^8q;n=)?H?q@8@xA(AKB1C6CBC`DhE1GwJQKfKoOxQCSaT+T=UyY?Y_Z)a2afb7babbcPo*s:vqwg,'n(C(R)?)p*3+?+Q.k1I1Q1`494L5T5i6[7+:;:<=&BuC]CoFHHJM0MXMeN4SpTaU_W^Xt[(]rakdLf2fjo(teuiv/vfvq,$7&%&)(v*A/q0I2w7$7*739&9];VADAfF7LLMMOAOOP_Q0WrX4Z`[h[w]_]j]q^(^:^K_X_g_q`j`zb=bHe<e@fihBj+mQtExjxyy@yF",
        ping: "$y)_191x2(9YBaE:J`QYQfRsW3WDWZX1XobIb[u>,(.0x2(3$4(>/EqIaIlJOSQSt[q_9`:j&mNnnsluGvMx`,%C(b*a+<7h<2EzFMKtPZbtgTm1p8",
        pang: "$z6w=tGXM&Q2X]Xk[9[ooG,/k056i<>PIU?_jlmnBnqo4q4s3,/55fB3I._7`&nzq/yLyN",
        guai: "%&7bH(^D_$fJuBv4,^djU,",
        sheng: "%'%(+13K3R4l6+99AnFSGBJdTXc(nsp9q=q>s1u/yG,%L'^*t+R134`555a9J>@B&C.F(G0J5J;JNOMOtP8[V]Gf>g/gOi1mDmanwuJ,&@:t?)?kP*SA[l]L]hs5x<",
        hao: "%*)6+k/^859e:w>)?'?C?y@*G%I%^j_Tp<pXqEr(r.r7rWyA,+w.12`3r6o7.9>:6;Q;`DTDYDcNQNYNcNeNhNlXM[U`zlYmCuo,$f'+'/'Q'n)b*K0s9?;;>0>OK`LET:Y:c[dDnx",
        mie: "%.8>:?;8NtX)chjM,(n6l:e;p=/P:VI`0`L,%d'80z1T5OV<p$qr",
        nie: "%.<]>1?M@7@`@o@rB2O.O/S*U*UhV;VngvhMhoiOjokFmKn6uM,&5)33%5wL4_ea'c%c)m0mer6r<uDwt,(m1/;ZByC9C;CtDpQBR+RRTAV.V^VgY4Y7Zh]U]xcjd@xz",
        xi: "%2)D)[+m.]0L1i5s626K6g8w9V:;:C;Q<)=6=T?+?A@O@lF3FwGhHXK/LbMaMdQMQ^QaQnQxToUGUmV&V+VsW?[H[[[r]H]S]m^F^R^_^n_5_O_[`3`Na]a_bcbdd1dQdSdTe0e?eFk7pFq<qNqQrIrqtMtsu@vPw_y]yy,%O%u&g'(']'o)m)r)z*D*G.l/B1]1b2V3h4b6P6q7Y7p8[8^9C=I=[=c=z>2>[?4?6?:?K?l?m?n@F@sB0B6BJBVB^CXDpEuFrI%I?M6N`OnPmQqRLRtSuT^UHUqV&W]WzY(YQZN[:b&bqc1cgdoeTfRfkgKgQh*hXhwk1kHkiklkmnRnSp<q;rMrNs4w'x7yFyw,$F$[$m%B&m'*)l.)/7/90'0@1?1U2d3_5*595[5_616`6d6f8P9Z:%:K:]<e=Y=Z>.>5>[A/A3AQAcCmD)DvJsKFKMKYKgL<LtN5NVNzO(OTPFPGPpRbTBU%UDVZVxWvX`Z@Zv[M^3^9^J^O^z_3_r`.dde^f6fHfdfvi/i;igl)n)nnoBoapvq9rbtew<xI",
        xiang: "%3&'&+(C.U/g4w51748O:d<;@LGWJ6UKV^X_Y*].`fq/rYvS,$f'K)B5R8PFLI@IROkW7YO_7dVefh%iAj'jujzkkqUt9y'yW,'6*1010`1a4R4_81<T>%BdKzL7L8LCPcPvUFVXYaZ=ZX];bIbOcpe6eWfQfYfrg?icjQmKn1oRocp&pPvR",
        shu: "%8):)a*=*>/h0H7g:FEyF)J3KNNwPkPvQiQwXuXz]Z^Q^R^p_Ld/eagogyhfjpm2nJnRqnqprds.sesfshtAtZu0vKxE,&]&x'i*y+M.?.@0K3t8/8B8z97:*;/=]?QG3H7HxKMKPKQMtXjY6[X[ma2bwcId)dcf(hPj]pYr]vQxO,$%$I&('O'Y(M)m+Z1>1^3+4p4x=i@4@mBuC(EQF_GfHoL1PCRgTr]<]r_ZmIoqowrssFw3x2x3yf",
        dou: "%9):0:0>8I8y;Y;aeenro'tvx<,'b.32X4]:]CWLFQb[&[I`.owvn,&6*X<j=aIAKXL)M2O6QJW?Z+Zo[j]Oeefyl%l&l*l.l/",
        nang: "%</q@@@i@sc/j;lEm]rt,)_3U;>;e,1:fYf]g;x[",
        jia: "%=&v'h(I*v.&/)4.7m;A;L>OB5ClH7H<L)LpO<OiRcWb[O[i]T^xd=d@eBf2f;figEgelXnunxuDuEx.yt,$u%4%m(5.$0f292pBBD>DAEyF.JHL0M/Yg]bbclanvolphvTwHyl,+K+T2>2n3.>3>W?:@]BEHeKQKbOsPIQYTCWPWjY=bwc$d)d*h%j&qor@rTvT",
        mao: "%@0b0f0o0q6UDtGkLPRxT[WOa5cAd_oJpgqrtiud,$?+v.=.H0u5/AqBQD9GSNIP&QJRQXM]feqjHlFt_uPuSuTy8,%;.V.l0&2Z5L>R>Y?1@VEXLHL]M/P8P]R_WXXXk<kIsR",
        mai: "%B'p405)6<>qCnGD,oNoOvg,&P'a1Q?'?UHFJW_h_i`0tXv`va",
        luan: "%C%Q%T6[AhAiHpJ_NRNqO1SHV8gAmQrvvy,)T78;U;gN:N;jtoZr(r),'7)L5qNgQ8VerSu*uLyz",
        ru: "%E(u/D0C8y=p?xHrI*LfN2O*UzW6dyg6llrcsxw+,(S/O2'4y6d:7E+^&fYgbiYn1v3,$>$w&_'b.h0t2t434uH/JqL=N?Q+X5ccdGosqNqprG",
        xue: "%F3*8v?dBpFmNmO(RZRzUcZg^NnCncw<,&o161@6o9S;%@@C:KiKyR&ZJqBsSub,$*'E1J2K6^:(=)AZC%FsGxH&_0`ga]oNq3t`uB",
        sha: "%I*l.A/?2p3078;i<(<?<S=<=_WKY2gWgXjvswt)wR,%/&f*1*_+T.4079s>eCcLURyT>^laecMgahCkskzw4x:xc,&/3AT7X%ZEZM_TkUlimymzpZ",
        na: "%J0d6=8u9:;*>7IJJse_fIfzg6hLjf,XC]H]KcChEnG,$>$Y2&2]9%>C>FEVJzKOO;TMW2Y8_1`lly",
        qian: "%K%P%S&^&p'M(;)V*W*q+o.O/K2)2A3/6'7C;L=vB%B&D`EtF>FtHvK_L8N7NKNvRCRHTZU(]c_Y_t`yaib=e4e@fKfegYhWhgi*itj_kRkWkdm>m?mAs7t$xZy_,%;%b%z'V(L(f)c)i*+*7*Z/J/Y2;4H8Y8Z:I;L<e>ZB)B3BCEeN_UI[Q^X^x_U_f`pa4aBa`e8fogeh6ipkBnQptr.t*tCukv8vcyd,$N&1&?)V*6*G.>4>9::/;6=@=N=RE[FJH?J9JMO*O8OBP5P9Q7RXSiU*V9VuW6WCWEWW[daec;hmhpi'jHkskto2q[ryu_w:w@",
        suo: "%L%n+y;H;e=h>*>/JhLt`TdcgWgXjxqzwQx?,676`DdFwFxGvHCPb`C`FcXfLfiihk=w4w5,$x.<46AaINSpSyTITOX?mj",
        gan: "%P&_'o*K1X2&9lB`Q<Q>Q@QAX0X7]Aa=lBmkn<owt&u`wf,%8'.'u/h0s447z939c;kEOEpJ.KvNvOcRoXDY2]+^R_i`farcqhRn7t)uE,1q7_@/@9A+A@A`H>M(jWlRokq?qOyj",
        gui: "%R(O+Z2t2v3m3o5a5h5i5l7>AxC?IUJSL^M<MZO6U[UmV&WBXIXiY0Zi^lkAkcm_m`p=qUspukw&wMy[ya,%v&4&9&:&z(2(Y)2)9*g/15:64<3D2FPH.H[I6MkN>NNPKQPQlR*ShSmW<X(Zg]o`4`=oEut,%%).+E/O0?2v4g5I6(6J8)<O?$@SB/BaEFEMG:K?KNU:V4Z>[<]@^zaZi%l8l;l>m[o]olpCq:qXyZy^",
        jue: "%W*B+p1=2J3e5r777h8v?<?J?d@ZCiFmIFNXNYQtQvT'T9U[U`Z7Zfbkc$d$eWg=h$hkk[l'mYnhw^,'E'F)/)q.X/m16;O>9?X@'@pA%A>A?DfE=EaEcF5H2HXKiM4RCRTRWS$ZGd7dXg>hpqctW,&[&g)v*E0F0G2]5J5T5u6/686<6T6c758r:e<.=L>cAGASB/DDDEDxO>UGUWVhYLgjjtq:qaqbtD",
        liao: "%X.a?)MWPCPLQ&Q/Q0QuU4UTUUY@YUbJbxjykXl)nSntrBrm,&Y';898e<A@*@m@qDoHWKYM]QxZc[9[D`Og*g@iiilm8q'qI,%N((0=0E=]?rD$DKH;JRLKN[UJVsYMYhdedljytQux",
        er: "%_(J(l/r0.002l:7;uPqPrPsS1YxZ$t4vhvix%,&q.*1Y2%AHFKb5lNlQlvm=o?vE,'i1R2r8>>u>z@NB$F$G.HhJ^PXWe]?^GeZfph>kKkLmLpGr9uF",
        chu: "%`)y+r../</e1q202C2S477:?.D?GVL_R6X*YD^Oahc+j:k8kJmyo<tWyV,$@$T$r&U'['f(0(`(m)%)m*J0n6g6h9v<XBIFfHsJsRMScV4WY[N[R_ocwh_l`ldqdt^wm,$H$S(N)W+h0S6L6_9>=q>$>`AXD>DUDdL>P+QoXBZ<]R^j^vslwBxvy)y:",
        kui: "%b+Z2i5i5l=9=S>zGgHLLnMbQ9RvV1V?_daDaEb]dEiDpyqk,$5$7(]+B6'8o>IBaOFQGQPR*UB[%[<_W`U`wmUmWm[mdoEqKyt,$/&a's)9)C)j.w9tBcD*DwI`L6SJSYZq^1bWbzcSf7fEg.g=hwjClC",
        yun: "%d'G+e/t555:9B:x=1A3H;HjIBN[_C`ea>aHale]erp2q3qgu+,$l'<+*+8.y.z/w343D6Y9:>M?$?0?7?;?ZBxEbJ^OvULXN^:^V_ZcRf1f6fOfVh?iHlZm&p]tZvuwgz(,$;$^&Q&o&s'((J(a/)4*>f?d?z@>A'HNIvKUKjL4LDM7MqMyOIQP[p]V^/_8_jaNavb&b5b?bEezgMgby'y1",
        sui: "%j*N;:>@D1G]JuMsQIR7Tfoe,(**a*b.>2t7&9f9t:x>r?U@EHqI7PKQ'Q*S7T]W1X)YmZ+Z5drfQg$g6g_hxi]qVt7vxvy,*)4i8u:y<v?WIkImJYU2U@Ud]z^'^A^B^qa4b*jok'",
        gen: "%k%l:finj.vt,seuj,BU",
        xie: "%n&3'^+/+8+J.G/i0x13445(656:6N6_84=f?Y@?CGEiGdHHHOJeLMNNPIQ[QjQrSMUkYR[e^eaTa_c>ftgEgeirjDjel9lWlzmJnwoqr6uIvbwrxB,$:$t%/%?&f*50c1E1t4z6q9O:`:z<&<U<V=L=i?3@L@P@tD@DuE$GaU9VkX:bYcid1d>dNdmesf+f:gXgohSikivkjn[oKoMoQq*,'L'N(1.T.i0W0l0n1J203l4I5%6E6I6M9Q:3;Y=(=<DmDoJXK*`qa'a@aSawb:d)m[pCxTxkxnxxyc",
        zhai: "%p)'*i+N.;6n6v:s@(GZO7PFevfdh*k.lIm+nfni,%J(7MOSHW?ZZaakv,>s@AP7x]x^xc",
        tou: "%s+Q+RD?H2I`L*L]a%ednBo&,cEf(,(zI9QJSPbxeAjZw.",
        wang: "%t&<'$0DI.Q+Q3Q4Q5[<[B[E[O]F]h`JePp*q_sPsQsXtlxu,/]:^EEOfe@j;j<j=j>j@wIxG,*M+A.J8vFDG^HIHklO",
        kang: "%u'35YA/M7U5Xv]kbAe'ef,&88*<CBqS*Ypafbk,E9JvOYU&W<Yw[8oM",
        da: "%v3U5L9i:%:i=m?RCQF]GzI]^5`abedvjWko,/A016@<M@SJnJzMCP2]H]X^.gNjxlzv?vS,'B0[4/7mBmH<HMHTHXIdJ(SlT)Ux`oa/abyTyV",
        jiao: "%w(R)%.l.s/>3b3n4u8'96=F>H>J>V>m???`@ZJ9J^MgMnNHSFSIUOUZU^]&](^o_TbWbmc5g3gHghj/jykMkvl;mXn&n3nEnWnYnho$q$r&r]v[yP,&R2=5f5g7(7i8N90;D;]<s>*>S@'@<CCDtF9HkM_NTNmNtRbRfV%Z0ZcZm]3]y`Wd@gYgwhqiso<oapfq>qPr5stv%v&,&G(6)c+90:0K5J5T5u6/686m:h;%?=AxBZC+F'FnFuGQGUKLMON4NHNlPVUHX.eQfuiSj.mYoTpMrKtHtPuyyb",
        hai: "%x9x:I=k>.@?EkI8NpOffs,.m2n=RD@dQo8,HVJZKDMVN&eNfTh?hFj1jc",
        heng: "&$;><6JD^a^m_`knw%,&i'U3G<uFOoAod,([1lV)r>rPuI",
        peng: "&$*E.63^5C>tDYEVEnZN[/^@_8bSewg^ggh9i;j<k'sAwoxmyTyi,&.&d0x3q4(8$8.98=S?TL[NUSRStTJU(UXYG](_j`'dEgknnqFszuGw7,%>(l08092mCMEjFIRAVCZ1bBbFgti+kRk[kkrwu^",
        mu: "&%&j1t4nBmF9IqJ;JiS6WhWlasatfAr8r9s_sn,$>&`&a+h.'.0.G0.<?AjAlArB'C'JXJ]JiJtJuK0OaQ0SLYqfsg*iinzsHu(wQwU,*LC'PEPJWN_4_HaH",
        ting: "&))3);+66l7+8kAmJnKzTWX?XKXlYZY^Yb]8gawUwj,$E%E/2314n9y<r=N=PFdJPJR^MdqlUmRmcmkmlohs=wAyu,+n.U8R9TJiQVWwZD_La1c&d+x@",
        qin: "&0)7014s8a8b;]>0?KB;CsL5LoP/P4P;P@PRTiU(UNUVXFY;]cb6c9c:e@eYh8j'j1l5lTo9pCx=,'y*)/t6W9j:pFGGFGKMWRRRSX;Xe]7dhm%n=tKt[x5x8xE,(S*G/E/o0c245=5e8YAHOKO^QjW8XQ^]`ec?hJj8mkqWrx",
        qing: "&0*m.D/_1T3B4[6f<VATD3GpP$XDY$Y8`7b@hWlPlQqRqqy<,&F(6(T)&+)+R.i.r.w4F4S537R:@J6T$TQUg^ke8e<j.u$y[,.A5e95:<<fExF;GMKoR<V1`C`D`JbMcnn0p`wK",
        bo: "&1&a'Y(1)>.g.w3?3G4Q6@6B;3<d?5@5FmO)UMW+[6a[cafcgRj9l%l/lYlZu^v%wX,$x(+(.)D+/0i1*2W4M4s60?1A_C=DJEvIGIIN<N=NqO=SWTTUvVGVZX`Z1^o`K`k`rbuckj%n)ndo]q&s*s@u7x2xtyf,%g'.(n*m2f2g2p4^5&8T9s:iB)BQCEDAKfOkP/P@QWT'VTWGWKWTY2e`f4fxg4gAgDghh@iIirjqjtm8oSp>r^uO",
        lian: "&5.L3i5m5n>??DDkH?HhLOMXMuW(Y3^6^fb3bZcwk/n5n]xQ,$C%b%w(L(z*I+++H3A5?697v8I9Z9m:';0;4<k>O?C@IFvGfHGUIY_`qa@aFf.fuh0hUkMl6mBmVmYm]m^p(q`qhwXw]y.,%@&7'?'I(t(u/<0i3D3E4A4l5W:FD3H]IMLjN<RcS*SoTVUiX<YZkhneo7pT",
        duo: "&6&Y1d2k2x3A3M9o:]:q=?@%@PC=C>DCDdFTFUGmGnH8HiHqLNQ8T(Xe`cbgg)g*hYn+n4n:nDslsmt7t?u2uOuPv&w=yn,.80N0PJjLSTLe*iKs),2j3RA^BXB[BqCSE)E*E=O_UsWa]8]=]z^+^MeMfngWgkkcs3",
        men: "&7&k*?]z_^`&`McGcYe8h=nqr4yX,/i=q@:EbHHQ]QiYsx+,)MS&W$YkYp[([9a2",
        ren: "&8&9&?&]&l&z292:G>I4J/R1R9]6];]<e6sit4vZv^x%y+,AnVtX@XxY>c?cSd/e'h=hFn/p?tDvIvpwt,232l6y8K;g;tE/ENG=NwO.OEPj```dakb1e8eOfel_rJ",
        shen: "&>'c(W)<)d0=7T7U7V7W8q9f:XDcIhJPJwKyLoN>OSOjPGR4SYWfZ4aZame+eZjbn*pLrUr[ujy+y;yx,$q.g0$2x4>4?4e4f7D:b@&F)J0J7J=JILuMHP0P6QvRZR^SYW0WEZRaTaVbKbLbhbncjhWjCjQnXn]okp@w>yXy_,%3%k'=+^+_335y727I839A;G<J<q<x=$DzK%PLQkbnh<lnn+nOo6o@plrmwT",
        ze: "&B)'+N2O3'9v;y<U<Y>]MAT?WMWkX@emfdgxlIp5pI,&K*d/60@0m1G6S7.9N;DNfQ4Q_RVV1Y.]]_*`2lns(,&40k4f98:D>s?q@AA$HmeCthxmy.",
        jin: "&C&H&N'<)/.K/(/J1e424@4O6a7<;n?V@)CsDUE5F6G'IAK_M>MkN+P4QGV`VeY;`?b6jLo(q%q'tf,%'&=*=+=1p2K2o637_9p:2=F>h@ZF8FuGMH$H<H`HuOSRRRSS=WDWS]']@]zcUc^eXfCiWrBvOvdx=xE,%E'y254n5m666::O=B?a@.@eHOHYI]NWNXO1R]VlXe`ffCg7g_v0w)y;",
        pu: "&D.[5G?IAMA[AoCwDpFIdteyh'l4lJmcmdqLr$r>rhskuw,&w'z.L2]6K9%:D:h<5=MDjH]LOQsY'Z/^[ggrarbw*wwx;y`,$W$X9S:s=K@(DJMTQuU1UZX8YNYR]Nmu",
        reng: "&Kdw,Vdtb,H6]m",
        zong: "&L*8*U+F.5DzOIT^TdU2[a^U`U`qhFiRj+k6pasWu*xhyu,&C8>8F8g>+?N?Y@HCwD1KpMLTPUfYYbGbSbxe(eQe^ezf/f<faflfxg2hGi:l*pKz$,%'.s>;CJCLD2S2V%h_hvj>kYk`l9nHnV",
        fo: "&M&w(1BixM,,",
        lun: "&O'P(m*YA?AQD6KkT$T%`2ephVxX,0D486ITeUiY:eFhHlfp2tTx%,.*9@<&C<FPG@R6]^nC",
        cang: "&Q&y'Q*7+q1_5cTq,)N0E6k:NDXElH0_sr1s%sOtp,$c'z/W?iV]scu5",
        zi: "&R*b0W3<8E8p9Z9]:><G=y>3ItIuJ)JUNVN]N^NcNzO&T>Tz_'t/v`wzyR,%1'_0;1^3g4[5x6r6z8(9VB.E@I&JTJwPCPDRnW_XBXlXuY`]Ya[b*cDcbeUedgji?lVnjnooDr4t5uVuXupv*v]wxyV,%M'5*$6B7P7Q9X=2>y?9@_@cAFA[AqFBFaGaL?NoO`ROSbT/XpY+c4c5kCn.o*pns;wyx`xcxoyE",
        zai: "&R.(/@0l:`AsOcTKdzePvx,1O576N<)<*=0JTJwQ?f[wx,?fF/GOMB",
        ta: "&T)$+x=m?v@XEFENF<HxO5SlfMgDjRl=,%)%M'h.D013a6@6b8+9i9wAkCIE%E4ViWuan,4+8z;8B5C1CnDGDPDqJ3J8P$RJSlStW]ZiZv[%['[>[Za$a:aQmGo.q*",
        xian: "&W&X'W(7.P.p.y/$0$1F7Q9l:4:N;1;N<Q=v>[CYDAEeFvI&IaJCJPJaK6K;KtM$MTMUMkNKO]Q'Q(R'RNSVSgUiX.YYZ<Zx]ibuc&c.cXgLhRi8jDjIkQkakfm5mCpqq9rCtVu<,%b'6'e)8)i...`1b2w305u699@:n;i=%@WC?CfD<DzE&E5E;EkEtF=FeItLYMbMiOjP(PlQzSpVKVmWeXFY_]t_8aZb9byczdFdhdye9eif^g0guh&h6hQiNk7k>kBnspmqsr.rGs+tnu<wMw],'I('(*(q*Z*n+7+a1_1c4J5+5E6%8a8w9_:z=j?T@0@BAEBYBpD<DiEJFWMJMiN<PpPzQ$QGQrRDRxS.U8VLWvWyXgZ%Z&[4]>]S]W]f]i^D_wadb9b;cKcfepg)gLm]p+pNshtUtVt_uUv3vSvmxJ",
        cha: "&Y(o+52p307[=M=j@1C@I$JOP=RJTeVTe.e?gfgoiPivjhk*t(utv5ws,$&%a(A/<DGKBU.XCc7rIsLt&uBv$v0,1t7z8'<UChQ'SFSkV:XwY]`^f1g+",
        hong: "&Z7I8=8o9%97:Z;`=e@;CNI/JXOAOHR.V*Z.ZbaGaoiFkkq*,/b050r1u2Z2i5)536(8@9<;w=2>&ELEVIRSwT/[S[g_Pb(c;cNcddnh4h@kTkYktm*u>vhyPyQ,&z'R*%6n6s;j=S=V=XE^F^G1GBONPUQHQZSIYyZ=ZVZX[5_V_f`vl(lbrEuMw/w2",
        tong: "&[(5(n*t.u5%8J:Y>;A<C.RyS4S?X[[$_>b'bOglq)rRsYw6w],&I'P.I2l9$<d=.@/BSCLDmL:LIPLR'S_T5XpZ2[h^*^Cb)dIdSdehrqEv6,%<*@1`85A2IDMHP4PSPdWoeUmTpH",
        dai: "&b(y.'7Y909>C(D;GzRhVyW8WAWHYA[G^:cQdVrMuYxv,*h*u+m;=DQEnGYJ/^d`Vcvf9hcsR,*].z2A507e<@>j?(@UBXD'EKETEdG<HgIXNx`$`8h(mFqnwAwW",
        ling: "&c'a1V2X7y9NACBtG_IsKJNGRdRqT&Uu[@hhpVsDuQxTy/,)<)a1(479T;x<W@MA1C3EmFsI_NPSSWPXaYF[^][cneLi'k$k0kem4s&tvxC,%6%X&u)&*x1[2@3N7WB?EcF>LrNCOgR8WUZ3]d_<_P_^_b_d`:bcd&h&m+nDpaqqu>v1v]xtxuyByU",
        chao: "&e&n3b3n4u8t>yV6VHVIZ>]yeRkMptsS,&/&R)l7W8m<@>'>5?.ATPE[4[>aeeKi.jelX,6>7>:UAOFoLIOFW0vcwiws",
        chang: "&f&h'O*.*F*O+Y._/Q0+6i7B;t>^@.B0E.EmK>M@Q%WJYJ[_]t`%`On8p>pir*yW,.K3o3s>ACyETG;GeH8IeJ4J[K>n:pkq1tox&xY,3P3U8nR/R`X_YbYcYjZLZr[Lasl1nAoopfprx*ye",
        sa: "&g6)jvkim1,(i111]8t;Sh*oTy$,&n'S7ADoODU8Vx^;`ka$dQduga",
        fan: "&m1l1m1n4z5`7`?5FLI'KQMiMjVmWt]IbndxfTo`obt+uWwYxGxx,&H'8/0/@0z7N;*;A=@>p@2BfBvH_J_K(K*OGRuVR]a]d_Ja1aSe_g%g?kIl=qNrorruQ,&A'J(?))1$4]6p>p@GD=EMEgFdFzHRNpUAU]Vydbe(e=e>fho[tO",
        miao: "&n4>7J=OICL:MSXWY'YIiMtL,4J54E?OzQNXP[Y_Teqf*g*iFiitz,($J_sIuY",
        yang: "&o(&(E+z0Y4E4k6R9tBhCAH*IyL$RUTCTF[K^'^ta1abc`e:f(iXm/nGp(pNqwtJu[vr,$0$M%k&b*r.c.n.x1;1U8<:W<.<c<y>sETFBGeKdL@M%N&P+PYVHWfXfcrjujzk)o*,+2.L7Y9d<TEiFVP>S(S<W&[i[v]l_;`'`xd]dre:eXh*nlr0rCtlu=",
        ang: "&o6RR=p4pntm,O@nH,N$jY",
        wo: "&s*[++6M9C:R;l=.KRKSL7WVd3gChBhPi`l@o%te,$'/v3C3V3[4t4u9o:9>)D5I)QMT8Zt[)f4n9pMqqr/wZy3,'a+r/(C4gMy5yJyM",
        jian: "&u(v)p)w*h+?+o.j.t/;0Z1I1Y333E3L3S3p3q3u3w@nA%BPDSD`E9F`HwJ<J=P'PuWFX3YeZUZ[[g`Vd+d6dKdNf^g_h3i>iAitjElAlymCoZqts7u5v$vfx(xRyZyvz&,$=%'%n&j'9(8(Q)>*k+K+L.C1T2;3I4_4j5N5O6)869A:P:g;5;:;?>T?P?kAUAyBCCrEeF:G]GcOCOUPpQAQzR+R2TETXU)UpV$V*VAV^Y_]C]i^A^Z^f_3_v`Sa$a9bUdZegfKgCgSiBibl&mjnCpdr@s$s]sgshuvvJwlxLyJ,$`&&&O&r'P'q)E/l0q2o3G4U4W545E5p5s6%7U9=9U9r:C:r;>;@='=E=w>'?@?V@OAhB2B>BlC2C]CjG0NwO.PRQNQ[R1SUSWT9TxUQUbUlV7V8VRVUVYXMXmZ&Z'[6^^`_aJaMa_ahemf(fjgHkbninonwo?pUq0q[r[s'ssurv2v5v6vC",
        fen: "'%+X.o2<8hB<BABUFYHIHmILRDVpX%Yp]naBbopBs<sBtox6y9y:,'R.b/q9q;7<1=u@(@1DeE]Q^S1XL[Wahb4bicQhIk&kKkXqWtN,$]&`*N*O1z7.>4><E&FyM4OHUw^E_6f.fSg@gOlxodpoqYw&wax&x4",
        bin: "'%.+/BOq[.jslrngxKyS,%r(I+;+I/57::&:G:K:lE]H6HwS1gdicq/qn,)k>/>9?E?FJwV2Y>_mc1ced3jwk)k?kXkjky",
        di: "'&'y)g+3.F6u9Q:b;[<5<a>F?tB$BJBNBrChCmD*DsF*F7FRHAJzL0M;RrU7UnW/XSYcZ5Z:[?^9bBe&f/fXh^iNidk)n$nOozt7ttu2uqwqwxxv,$Z&>.V2U3F4v6s7F=hB(C$EMF]IvKRNJPOPfSGU&U*UyWHWkXi]I]Z`$aRc(eoiRk3kvmJn)pUtstyvvwix9,$&%9%^%c%h(7.I.t/a2Q5z626C7X9I9P<9=5>:APCXD0EbHiI<I=IqJ4JFK:NxPHT`YG]&]s`aaLb_gVjak8nMts",
        fang: "''*Q5TB@ChD^IR[9dbmmo?oPp;pJtn,/k3vApIVOyPHVqcWhLnDrvtU,*27<<+B3JxO3RqW=[uk9lwp4qjsd",
        pei: "'*(?)X9cDGI+IDJKKFL>UIW$^$f1m6oDoLv%v2xd,.6092v4.BrFTG5nAnu,%.1M3V3W?R@sG3GgM%M`R=Xj[n]X_Ng^",
        diao: "'.1U272U8:8HH[QVZ(ZJ[+e&h[yD,/:GCMSO6QbTWZe[7[k`EdK,%9'v)p*p6r8@9'<r>HNjOQPyQ;R3RdV'VzWqX'^p_Eldm7n5pjqCqKs$x8",
        dun: "'/8g?kA.B?FOFPFQXG]b`9bik`l6n@,$U'>0(8`<D@%BRDsOlOqS:U1V),.9B.CTD@DLDWI1IlJEO?W/b^cviN",
        wen: "'02D8z9/9K<=EhI9Zz]L]MeTj&j`nbpjwd,$l%D*m+9/i4P4x6Q<4EYFYGxHyM*M9Y^YzZ?c@cAd^f6fOgMhKiHmLnMo^tBwR,*7*8/S/t>7FcFgGeTLZPZUZ[[&[0[=[N_5aNb5cFf<gcgnlsnvo4ptqZqlx6",
        xin: "'2'S)d*)?j?mA'IKMwNeYH]1]2]j`Pa4o6pGt]tw,)f*4<F>4OmVKoqrUtQw>,'T1O4`747=EJGnK$NGO<QOUNVQXJYK[ccLgNgQg_",
        ai: "'6/01]7X:V:e;K<.=g>9>P?bCfDwEbFyK/K@M*N%Tua9cIcSgNhCnKnMplr1ra,)o*$+k6V6e:C>)A;H5HeMgNWNaNnR/ReS[SnT[UKV?dBsu,&:'0(O9Z;*;<?lE1Q:SgV$Y'^)^2_t`6`;f*gJorr;",
        xiu: "';)e)q:Q=`@&OrRbRwXdst,&E6Z7=8A=$FAFnHQX>b_dlg3gGhvk4o`opr7rCu:,/C2L3q3r>KQ%QCScTSTtU7XFdpfBg6k:kOmcoIrLuHxW",
        xu: "';'`(g)H+@0s4e4f6`7l8?9_=(==>_?.?EAtCbFEGMIaIlL+L[M^XM[R^N^n_(`Bahd.hpi^n%n2otp$p^pzqis8sFvd,$.%e)k)s*'*B*F*w/r/s1v2H405I5K6*6g7J838H<t=V>m@VDlFCFRJsKaOTOZOdP5QKRTS)WdYZYcbRdPdje&eaeef(f=gsi&i)mAmMo)tI,$I$k%D%Q&e'r(0)Y)])^*k+;.W3'6v7C7K7t9G9j:Y<$<W=8?;K*LTM1MlPiV6_FbRbTcrcsiGkqlHlXou",
        tang: "'@*F+*+j.)/n3r;R<i>hBYDPERTrVxa1czjTk;rxxs,%H&V'@/V3o5j657r;[=E?+@7A+H)RNU>Wr_]bMbabfkFlhpxq9,$u'D.q/I/fA9AjC_D&E4L:N'SxT@TkUEViX2Y5YAZr^4aXf3f>smx0",
        huo: "'C(N)s3J3s8W9w:5=(?w@M@^GxHnJ7ZvZw`Cd8gnhplpm7okro,(J0*215l859u:?:m;n;o?'E*N.P1R<RFV0WJW`XmXrXsZAZy_nlclrqzs^w^,$L(U0u9v=[>o@EAYK)OWRzV0W>XiYVYo^s_S`5achq",
        hui: "'D(@.h/i5j6/:J:l=3>X?7?G?X@4@wA&A6AeDdFTKPL6MmNNPKR*R+WdY0YfYhZnZpZq]'])^u^v_&_;_Z`Rb1b^cjfvgKimktq4qDqhr=s9wMyq,$4%x'H'p('(2(o+B+Z+[+b/90j1M1N2C5I6'7)8Q8o9X9u:_;s;v=:===C>M@J@RDxFXGQHcHnL>M=Q*Q=R0WZY%Z8_ydWgHgPhkiIkpkql.l?t6v.vY,%z&W'2'3(G)5*&*F+.+/+q/O0H2<4$8+8:8g9[:j;/;A;v<G<a=r?6@^FCG[HsIOPiU2UgZw[U^+^M`Ybycad4f'm_o:vy",
        kuai: "'D))/:2+:p?eAqBMEDFJVBYO]YlUods9,)v2C9XCQDyHn^QbtoSq],$/$UKRLegjogpK",
        cui: "'F*3.21b<><IF:SuSwTn]_`$azk=yH,%C&+.94:8::8>$?UG'H>KlLpNgUe[CajbCcYeEfQi]k]kwoIoLp*qJqSqmxU,2$4XAlTh^Sc=",
        che: "'K)h+0509U;UBsHqQDQy[=]%e=hviHkFl$l&,92=<=L=iA)QyS9T6T7m3w=,+VEDG8H_bd",
        chen: "'Q*p+q/`=o@IEpF1GyOkPw]`a4f5hGn(nPqFrjvOwSx5y;,$n&B).0$0%>GA9G+KeM&MBQUTDTkU^XoY[Z@e)n6r+umw$w6,&+'g/g1w5'789+9a:';X=$=P?O?uAKALB1B>CZESH.HfKwN*O4S8]6]b_It2vHxfxgy>",
        xun: "'R(q+K4Y4j5*5+6&:F?2?L@/B9D%E_FuG8H]JFN`NrPYPjS+VGVaVdY`[I[m^]aYiUmbosrft*vLwP,&r*x+X.)/M2)2J2P8_8n:B;h=_>M?A?x@4@Y@j@rCGE'FIHSJYPRR:Y.[(c9ghqov:vc,&?&F'U'Z(d0I0Q6q6z7)7u;p;r<PHCI'I4J2KILWN@V&c_gZh:inoUo_pQst",
        chi: "'V'l(_(p*+.@4S4`5S6]8/888A98;'<j=E>(?6?`BrC3F$HQIELgQDZ1[([4[5[u^w_)avbBbYcNe/f0fsg%gnk1mOn/o)t:uSuq,&D*(*[*^+@/R0T5;7y<'<l=X?qC+IfLcLgLwM5N%P7PSQh]*]L]q^c^i_qayd]kZk[l$l(l^m'n.o'o;pQuZvHx?,*5*W*b/`2i2j3O497G8A8y:.=d?0A.AIAtBXCAH^H`IpJ5JAJHJcP1PWPoS)_:e;fggYiolSr'rNsHsMsOt:u?vqw6xexpy=",
        xuan: "'W/92o7Q8C:P=5=AEAGcIaLEM3MvOUZH^J_s`va'c7coiLnUoQp?pSpxqcqdr@wr,$K$L's155*8%<Y=6>PE>EtFhFkGVHEI'L1N'N2PGPRQERDU3Ww_4dDf^fwg5hml'l@y/y0,$y%l''(R(g+[.]0h1]2_9J9g:u;D=0@7ELG;I3JNP%QbS[TUW[YIa7dVh:hOnu",
        nu: "'X+d48HsNlVxZ?^*jC,SP]^o2,gxj%",
        bai: "'Y(F9A;FXKfVfWg$h?i.jqlZm&n1u^v],CkIcNCNDYA[db2bDd6,'W5$?t@Caz",
        gu: "'Z.*.x1O7w9[:);D;E<@=r>UADDZGUJ%MNNkQ=SvT<VRVS^2aPe0eUmtt<uvwvxp,%&%P'W(e+]/[0[0q3k:H:kAzB5LkO'O.O_R3U@WMY<Yk]M^h^v_Vb^fHjEjIk*n;p%qkuKwnxB,$n'M*s*y1;6@7S<0=Q?:@]ElEmFiGCGoIQM>OeOjReWFXa^bc^cuf0g/jRmCn7pgr+sru8ugwzx$",
        ni: "'['](6*X/I/P5z9LBdDMDRIXI^KYM9N@O$QFQ_R$^C`6aScSe_f+fYholooTphqPr;uSy=,(M/.1/416a:(C6CmKSPBQ2XZa]fFmQmjnmpnqGr)u6,'j*[+D.@6R9%>TBRF=I0KvOaW_^F_YgBn<phvKy+",
        ban: "'_4*60B8BXIpR;^)e<eAfFjUjVmlnlnmp6sBtbuV,5oARFSIMITM<MhXXacd&h]n@rsrw,.H/>47BNGyH(OCP?W5Z][m`pb]cxloqY",
        zhou: "'b(s//0p9R9T:&:D</=$?U@'IYKgOKVDW*[bi'poq;qKyD,2&3p<n=(F>InK^NxO*O[Q7RaTp^m`sa0a3axb/c8fJg+h5h[kyn2n_nprjvixIyc,'`7^9p;:<:<X<r?K@qEsF.F<GFGRI[KqM&Pa_RguhDhXi^jNn8rMuJ",
        qu: "'d't(82T4:5_5u6$7L7M7i9jB[K8QRRLRkUA]0bRdWf8nTo0s&sF,)M)V)m.S264;4o;J=g>FA(HTHhN5R5UmW+[Z[o]paEb6cmd'khl7l`neo$r&u1wjyI,&T)'*k*u+(/*/i0;1A1F1Z1m2a5k5r5v677f7k8r<<AUAWAnAsDrE'E:E`VaZJZY[T]%gmgoiCipkMm(o>oQr%sBu(u@vivjvovtwHwhx;y0yI",
        ci: "'e'w(S+B0W2q2u9Z9]<GC2N.VTXYagsvuZvc,)d*R0y:>EwF%IbIqKxNOU;VFW2b*bWd:fLuuuwwf,'5++/80_7q<;?N@oAJBFGpGqGwH)^geHeVj_jum4r$svswuiy7",
        beng: "'f=t>jCgD@DYEoH^T7U%j$,1?G5G=IzJCJDL[VqdEeAg'i5xH,*:BgD4HwIVU(YDYxa9",
        ga: "'h:*>T>g?iH7H<PtQ$Q6ousH,EG,EENYRnVmlB",
        dian: "'n((+i0V79@VBbCMF0FiHJH_K`KsU&V)V9V:XU`XdehTmUmpn9yb,%Y%l'*'G+Y3c6n9[<hErG$JKJNL/LeMBMwN1N8TgUt[6`Q,$M&E+oBKCPCqOrWQ])_A`McPcQdBiRwDy9",
        tian: "'n*<0P9;<&E[EfH%HtKXQQ]K_2`1i)jbqHvW,*s0X4+4I5CG2H/HrJ1J2JFJNJbJhLeOjPrU/UF[6cuePnfp8r_rexP,5`63?QM9PzQGRaWQWyZg[Y`F`OePr5t&t1w+",
        bi: "'u(*(1**+D5O8`9r:k<H><BHDjFhH4HoIMIgJtKeMqN<QNT3VhWvWwXEYPYuZQZRZY[>]3^G^Pa&a*f<n7n^oMs=ssuNv*ww,$)$s+o+p+q+t+y.:060k5]7'7?8v:4>U?LCVDgDhF2HfJVJWJgJyKWKmLhLiNFN[Q.Q/TvW%WXXSXVYU]A]B]u^4^`^a_m_zabaicKckeJfegZhBjgkdmInPnbpjqarxt:uLvVvsxXxq,%&%O&;'F+g/G2F3J4S4m4r6W7i<>=h>U>x?3@2@P@pBoCxDQDRGrIgJUK4LGLVLXP)T*T]UoW^YrYsYtZ5[.[/]Ia<aVb(eDf@gCh.iDjkkHlUm3njpqrasSt?tKwqxM",
        zhao: "'v/y8(</<3>yC9I[V]eLfUoVp`rVsSu'y7,(X0Z:E<R>n@QA4A5CEH3O/P_R4]8^gj(jSjompmvmwx>,7g<=A?AdN^O/P&SEVqgrmOqK",
        shao: "'v4;546X8(;(JbPpZFguoYt5uex4,8q=A>B@0EzPcY7^Lcpe2h`s:t/txwLy5,&p2GF4K7a6b@kTmh",
        zuo: "($(2)5+4:+;S>sBFRSRTVLXf^%hOl0pZumv&,G4W*XgY=Z3]]^Jc'g9ntu@w1yAyB,%)2E98M<Oo](eC",
        ti: "(')y*J+%2z367'<?<k=[@+@2HAL0LLQSQgQjTGZ5[h[u_R_V`G`H`rd^gThyiNidm+s5sGw1xAxv,*@+<374v8;F]GWI5PAQFU&U=WgX3Y4]ha&dkf3i$iEjNtsvK,&Y'C3_3h3i:)ArAzCDCgCrE(E@I@IbIqMhQES9XOcBd:hsj`k(kFkVkZmfnQpsrgsMsOt(t)tFuV",
        zhan: "((+;.d6F?SMRQ`RuT;TOU=U>URUa^1`;d:dHdRj6o/o2oIocu:vBvowExz,$w'9)E.%.N.P0]5UG&O/OAOPR1TX[[aweIi;x*,'G):)h)i*t5l7R87;';+;`=OARFeFvGjJ[MaZ0_WdFdOdse4fRiMiWl[ojqAq[tjv'w[yi",
        he: "()4L8F8Q9C9`9u9w:R;.<K=5=7=^>2?:?zC0FxIkP%S&`Df*mus+s;uUvs,$%)t.B0Q3Z5&9?=^>H?8?9@X@_CDD@MfNsO9O;O?ODOHTYV/X<_[aXb7c=h7l0l1u'vrwvxT,$r/M0y2J3s5B7H7J7x:4<1>N>O?2@XA5KENbP(V/Z7Z:Zk[D[X^T`?`@`AaFbgd.eRfsm&p6sWsesktyueusvbxhy?ya",
        she: "(.6t7)HQHaPcZSapb>cuegfyg;h:iqjmjomK,(>)I*G0n3)3^4W72;FD*K.K/K4UwVerVrWrX,%a)x*v+?0a7?<*?D?H@iA0F1Zd[IawhYvW",
        die: "(07s:;:b<?<zCFDmS.TJU7W[^<^i`hd>g;iqpfrlur,$P%u+6.T0eACAMA]IHK5KDKKKLPAPNTndRhilLlMn`rAsIuC,../&/e3n4H7V9F=%AMBBBKBeCcEwHlYfa@ncppr3",
        gou: "(3+f0r587x9_<0BoCDGrGsJ:LmRYZVfRj0kVtguF,%^0=6C?)C9ExL.]`_d`ob^f)iOlIlJlKtXu+,*k2^4.5j657O8(<M>E?o@KJ.O@PBW;^eaPb%",
        kou: "(3103a4D7v8%OoOzZZ^(e1eokImq,7CP)P5QSQcZr[Z^2`8tF,&0&9Nmt'",
        ning: "(4)+*n/N1h:1?sN'O3P)P3P5P:PEfblsuo,'M(N1&9G:.C@E(JER9m;mhu5,'_V5kxtn",
        yong: "(9)S.34U4V9z<p=c?cCjEHF/FlM8U)XwY[[0^T_E_F`Wa/aWaab?f`iVlCupvJ,%y/(1=3.5b7O9W;KAOAbJ>JBL6MpN6S`T5qbu&,$5+S7sC*CVJlL&LFMzQITmYE^h^xcHd;fNn*o1oKp_q7t=",
        wa: "(:2/4F9C:':R:^;u<F=r>&JYK4KcLUR&Vz[Og<j]mV,226A7xIPIcIiJmS;ZKZaZg[*m7pppv,+32R4yK9agamb.wj",
        ka: "(=6G:(:*:E<oCR,o/,2zPP",
        bao: "(>)`/V2_3?3G53575?@5DpDqE)LZNiOOOeP8PQPT]/]xetf)r>r^rhuG,:h<]>y@eB]BjFJZ^]Qetnyu*x4yD,&R'.(K)f*Y2B3H3u3v4Q>??eB)P'VJWYZW_?`>eGeKflgij]kGm?p?qSqfu6xlyC",
        huai: "(@:LBEFqG0[L]ocFcn,%c)24<;$lu,);)@404?C?yg",
        ming: "(H1/1`8K9hJILvani3p@r%sO,%2206EDKOsPQQ[uf,$i/Q5h88L;MCPwX)qRu1",
        hen: "(M:f?j[J_.ff,CBLC,8&a*",
        quan: "(P0F2o4)4v52<bARAYD0HKJTKZNOS3V5ZD_4_b`EfnhDjgszy(ye,$e&'&h)L0h1o5q;h<vB*B+B>BcBdBeC+GgJeL8RJSe^$^ydAe1fMi9v=yq,)I.=1B6F8*<NB^CCF+GSMvPrUCX$ZeanckdIh;htk_n[q$xw",
        tiao: "(Q</N)OZR^RpXb^gg7o&orpssIsntCx/,&cPXVyW9Zl[3]Rb$c*dKm<oGswtxxg,%*%9%:./5V8@9'<rA]BjHaPyQeT3X'a5kAmwo=pXxsyD",
        xing: "(V*D0R2G:oC+CXJ'JpKaN?VFX6Zy^A`+`mlgpQrZt1,1Z3N6u>QC.D7GXNoOtQ<Sq_;_HeVpWqurRvAv`w;yS,+O1V6P6X9nJyKKMmO5PTPqQiW(Wb]7]Ff+fbhTj7m=nS",
        kan: "(Y+20y2)2@4gBDDADyF.SdTOTZ`4dCeIvX,%n(Q*+*/P'R$ROS/U[[zwV,1XFGG'Zu[]cGl+ySyY",
        lai: "(])n*6<'JlKdSfSpXq[W[cm9tGxPy4,)63@4D:%;(;.CpG.KcMsMyN/PoQ&^3^]`ta=wWx],(T5(8y?L?g@h@uIRKuRoX:c2c8h^n:rns<vn",
        kua: "(`:KCPH6JG^rg4pz,$+d5o5s5,8EB*B_Pxjf",
        gong: "(a(r0J0O4+5K5N7I;`=eEcO^OaVKVOW]YiZ'_3aGaoflfmmjt=vl,/P9<?GF?U7_ic2c5c;h4kTnK,*Q6K6[>i@?E$E+F%QHa+kNyMyRyXyv",
        mi: "(e0u1&14:@>nEMNPOEOnOyS<WTWaWyZ;ZCZc^WcykKlbmNmxtk,$z&P(M(W/Z030S0k1n455+7G7q:(:+;2;X?BA*CxE6I?PMQQR(W%W4X.XV`LaQambgc.fvjnjvoXt(y],$e%p%w'w)*)>+w2e5M5N5U6)869y:$=6=AHvMuNDNENJQ.Yi`StpvDvEvUvzwv",
        an: "(i*&+=/C6i6o:O;x<lCWD=DbLCO;R)R3RoS8X=Xtg/i]qYqvw.w/,.o1hBkEpLfOXO^jYo@pVvFxFy9yH,%?3]8[9^=3>A>QQ2RBX3Z^^$_>a(a)bGgImMrusKuZwU",
        lu: "(j.M0K3[4]4o6H6J?N@3@EApBkC&EqErG*K?S/XNYBYVZkZldPi1k3l:lFm(m<rpu4vFy@,&N&X'd(j)(.M.R1B3x434Z7I7[8]9E:X:o<7?O@oE3EBG?HNHvI:J@OOOYQ3RGSlTCTZUZWQWVY;YvZ4^n`A`_`h`ia7a8b@e`gxi=j9o0q2qyrys1sYsasbtHwp,%N%P%`&U(])D)Q)_/c106b:8?4@aAmBfC=CzF)FmG6GEGTGkIYM[O[R:RiRkTNTdU.UeVKVPYO]4]g_ychd%gfhVi:k+lrlun?p(p3p:rFrqs%t]txu:v%v/v9vMw_",
        mou: "(k4H7H9M:uDt^cmsu_w?,AjPVg*ii,+)9k<zC0SLaHrHvk",
        cun: "(v2B8IGQN_PV]Dfpt3,94O$[wa^qC,K(",
        lv: "(z)8+U.H/T5.6A8S9*;9C1QlQmQpTP[Mb8bDg:grh+oKx2,$o(m(q.F.v76:T=m@gEAQgW5Y0ZC_Ad`e.e`frg&i=iSpuq.q=q@yL,(.)S4'4FKZQKVHWpZC[@iaist>",
        zhen: ")&)4+OB'EaEfJALrP&Q]W9W<WRZAf&g1gUiSjcnzpUsKtxu<vTwHwSyx,$N$w%+%l'$+72>5X6W8f9`DWF3F4GzH/IoJSJrL%P3P<P=PWSITyWAWaWnYd[j_:a$cLcud_fWf`hNiZm2nrrExlys,$<$h'h2M385S7L8j<8>e?C@<@gEfFjGJH2ItM3NdOtR(RhS_T;T<VoY1[x]Q_Mh'kip%qeu7wV",
        ce: ")'+N0i0k7%72H$Y)_A`nblfumvv?,2A5$Jv]U^0^8^N_'`@b+vWxjy2,%+",
        chai: ")*/G=%@eVTf@v.,BiM?W3n8t&ul,*+0e296t>@O%W'",
        nong: ")./41$:t?WYog0g[,'m)C2I9n@TMlX+Y&Z6g^oYq^,'%4j;(H0H1N8kuxZ",
        hou: ")1*G7*8L9$9%9_<xC7DoWQ[N,1SBsDBLyQDR]_RbQl/l7uxyR,=yI/KJL5PvSOf)jemJnRofp@pJxS",
        jiong: ")2.X0a0j0nA1BgD'dfdg,0a2r9+<3<^=K>a>b?e@9Zod%dzr0r3,(f(k45HdI2Pcc>d0gph=",
        tui: ")=)B.YFJK'Q?Z0Z5]@i$,'>?*Z>m7pr,%I(B(_+U+p/348;KCiD8I(^>c/c0c3d5hPjhlM",
        nan: ")?6=<rA%A)IJJqL'MBcxexiEqstrun,$F5n?%JMJop[wTy1,/+9`A1J*^X_'",
        xiao: ")@)Q)u+u3*4G9e:H:j;0<g=^>Q>V>o>v?%@A@Y@aJ9KMNdObOhPnT2XgZ^^obmipl(mwnCn`naq1q`rSu;uCv[x1,);*8*E+W+e1s3(3/3i8E:v;t;u<z=b?9?pCjDnDqLHLMNbNiPcT)T1Z.Zp]?^K^Y_1_D_g`J`^dfhtkrn0qLwLxz,&l'*'n)J)U+R/u0+0N12768$8^8t9zBzI7KlQAX>_JdWiKj)jdjrk$lJr&r?t/u<",
        bian: ")A5y6D7kG[S%Yl[j][`oddeQiWp],/f/g<L?(A[DCE)E^ImL&SOTtYRZ]]m_5a1aGbNewf0iMiTr;sGtgy7,'u.`3m5G5p9D;L?&@JGtGzH$H%H'H*H+H7H8IxJ`JaNLS`Z4a3aKnXnYq&qwsY",
        pian: ")A+'A2LSdd,$($OAQBEDCE)H6Hw_Mf0iMl)oBp3,5K9H=7?%?8BgCdRyh4hZhjhlj2jAjjm$sY",
        cu: ")E68?:LV[D^4c%,'f*qD)LsMIO+`9avfgoo,%r6;8LAUAbAnAsCICbD%DBDCMfcYv;v>v@v_wg",
        e: ")F+..r5H6e6k8i9+9G:8:O;&?3?[A8CKDXDwE&IcIjJLK%K@KAKBQdRAS)SJSKTMY/_<_q`Sa3d[eJj?jNjdl_mzu%,)0*L*i1h325<FZG9LfLmNXPjS(S2SJSiU:V>p`tmwPy:,&X*3+X.G5c7+8N9N:c;O<%=.=zEUEqG?HUIwIzJQL0O=O]QsS6VOXEXvZR[Q[k]$]+bUbibjcCcDd<d?ebexfzhRlgnko0p'pwrRrhrisPuSufxUy4",
        guang: ")I.`0%:9C;JEX=XAYMg(knw(,2.8a;q<E<H<I=;BnE1F<Sgo7r0r3uy,F(IEQ1w*",
        ku: ")J2j;/=X@QAZDNXQXjYNe)g4ghsEu=w3,$A=`C>M.RrT*XWZbZvd?hgnku4,2k3F4@BCKBMQjbmZyq",
        jun: ")L/30z8Y9)B=CkJFPMS^cEgjm6mMq7wexq,/a2P:B=g?zFaK1NyO(O)TS[f^:^s^zw?wsyo,*>.$265Z?BEGKdOPP`Q&S7W9]D^W^fc)edg&hQj9mep]r_r`rcvAvIvOyZy^",
        zu: ")P*36*68;+;kSuT8^4oUusyH,AFF+W&X^YK_(d$hVxKyC,$O7n<3B'CFSsTHTQYH]'`n",
        hun: ")T*`ALK]KnQ)]e`Ma`h`pAp_x`xg,+32G3`4E585^5r6^=_=xFXGQOvQ1Q9Q>v_yv,%e6N9L<VFrZS[Oejg(lDxD",
        su: ")Y+^.z=d@kB%D1EJEKGlLyOraIaJbjkKwgy2,%3&L&S'D)1+(1%1w336U6_8X8dEDFEHYJ<U9YKYMYwZz`>azb'cVf_fiihmrmtpytrwJ,%_(+(^(j6Q7F:*<7=;AeD(IIJ7JBM?QSefiJj?mqoVtMuc",
        lia: ")l*4,,",
        pai: ")v:cYd[ZfGhexd,0>244a5=AVBZCh^_`c`e,$4FQHjSf",
        biao: ")x.J/XF&KLM)Wi[*kSt5vA,&W(<4@7@:c;o?M@aCnMGUaZD`+p1q2q6qt,%Z(>1s3S4L9B::?yRmTqVIY@Y^dKdPdYdidjdkdmdte%e&ijj3jJk5q2v=",
        fei: ")z375e708_<OHZI+KUKVQhX^Y+YL_xdlnkpeqbrTsEtPv3xc,%9'+'R(w0V4)4R:MBrC4CiL+L`McSK]__aeYi+kxn?nTnbnjnkpEtaxDx[,&Z+u.60D3X8x<l?+@WUcY.]Y_U`7`P`Qe'e)e*etgGhdhnn;pdx5",
        bei: "*'*;+7+S+t.I4Q5Q679A;FGYNbXr_]_y`^`ubTixp3tPtQv2wTx&xdxfyO,=tAwBKC(C`FcGDO5T`TiWl^_b]ngqau),$z(9+W2b4%8T9(>d@;EkFOGZK8KhL/PQQQUyW3]0`ta<aRj^rzu]",
        dao: "*@26282g8$>J?hG$PZPmRQSXUEUFUtWCX(]7`.h5hAjAlfsnxNy`,%p(:(D._=s@]ICOIONWIWTX/Y]Yf^gdKh+kylArksJxQ,/[1g1j3QCkEAH8J'N]]T^7^Il^p/",
        tan: "*A+x.Q/587<c>E>L?/?0BCBQB]D<FVF[FnG.KTZOZTZ_]>^S`Fbfc'c1hujum%mRpKrDrQ,$j'G'k*<.55Z7;8k8l9d;Z<[?uHmL?L_MEN7U+ePg[j2j8r[r`xN,(A2H4q5=91:q:w<w=G>a>q@HKrMcMnN6PKRUWOXkc9",
        chui: "*C8xAVByCc`KhHjOw>y.yL,%_<8TL_$p6x),RNT&Xc]ac6y`",
        kong: "*SD8NZSi^k`0hzyJ,3URsTMZP^wkA,E5RIa8s2",
        juan: "*T4C4Z5$6^9IARAYCpHDHKJ8JvKZUmV&VbW5ZD_G`EbEgwhDsNw0wry(ye,353f=aCYDvIdPUPiQ(dOd[fnhujOjmonp5qfx6,&$1<32;DL2Q[QbR>TFUfXhY6ZX^W^fa7e:eYuQyx",
        luo: "*]/k3&:E<_@h@uP[S(grhBk4m)m8m<mLm[ruyc,)Q1D1f1g4Q8+:R=3BLD/E:FDMJN9NqSDSoT4Ul]n_/aLdCh)hojAjpp&pSr%vaxpy;,$v)A+*/m0b3Z5q5w89BTDaE0IfJfT[VcXbYC^mc%fZhCi<iVj0jKmSrOtd",
        song: "*^.71Q8CJVO=T5TxU1Xy]X]q_aa?aMb5c3gyiRk+tatcu7ufx7xY,$J(=4*7a9xTG[im$mbx(,718e<(<dI)TGbVcyf2hIk]",
        leng: "*_1A;hD]E>T&aAy/,$DPuT_YF,':C>",
        ben: "*c=IBABBH+H0HRHWhKl*scvYwY,$30l4N8.<1B=Jq]Vk`u=,0D?3@PISRQXY",
        cai: "*g+L<9D>KIOs[)dpdshtt2x_,+xD(Q6eCfdh$x.,%t2x>h@@BkCKNM",
        ying: "*o.R<V=P>k?Q@TEEGUKwLDLdLwN6N:NLO0TsV*V0XRYX[3]JaCc?kBkZm;mDoypRqMqmsVu[wBwUx>,$M$`&p)=)A2^506%616u748?8D:/:0:J:[:r:w;1;6;R;_>>>C>V?D@=@bFWGnH%HLI>IrJ*MYN3O3O:P+R_T:TsVUWoYya;aMebfBgzi(igj*j+j6m&q?qXu?ucv`vbw`waxwxxxyy<,%7'k(x+%.M.n/1/T0d1=4<5i9x:d;=?A@+A*EBHLKeT1UUV3Xr_`a3bDc(d/d7d8omr6sGs^sftLt[tqu&uuv(",
        ruan: "*sDvG&L4kbs@,(SG_I(TlVCejlPpO,EYFSGA[q",
        chun: "*u;IL9`jp0pWqxsFtXz',%X')(Z2h4A5v757kB?GUQ@_@cJhAnEojq<t<wcxWy4,$9%F//1*?cFZMbMpRT]Gn3nas?sTu`",
        ruo: "+$7eL(U0ZGgchN,$/4Q>1@f_2_bu3,$bL.nto5so",
        dang: "+*/70822?lB)CSFrL$OGTCTrZja1gGlMmWwI,(()U/)8P9L;[FVHUHjIhK8O]QTRwU%V7^6`N`lsWv[x<,&h)10U3&4o:x;_=:AoIjUuWnZz_BwN",
        huang: "+90B2$=>E%E=FZHYLAOmT@VEW_[k^M^h`iaNakiVpvpwrLsP,$b%7(e/n5Y6p8a<m>R?2?r@kDiGpHZMZNMNdNpUuZ(_G`Yfcn+sDvLy^,.^0C1K7w9f9u=&AuJ%SBT2U>Y%^%bCf%hondoWpztNw'w(",
        duan: "+M3NE?L=o3o=ys,+O+c>KGiRdTz[r`HaHemiLlSpiym,3pDeS=SVXz",
        ou: "+P5u6$8V9%9?>ZEs]sb4,(p)j*>+N+a0B7m?cIYIwX8lipTq0,&C()(H:I;wTPqmt9u3",
        zan: "+T/Y/l/u:G=*?8@jOtfqi[kdm3m@mPpOqar5w@,'`:S;TI3I<IDX4ZI`(`]`abV,52;E;]?M@&A&B%B&CwLkLqLvRuTwTxUOUYf[ro",
        za: "+T5W9m9v:G=*?:@b@j@oVgdqfqsyw@,0<0MSZc[cer$r*,4[HHP2^l^w_)b>lv",
        lou: "+U.H3%=W>SEzJZKCP>QeTlU;Y>bDj*k5,$c&Q6+7]7b?SIuM2MTMUQg_Y`?ljlosQ,$2%q/./n:G>^E;JGTsY*]9_yaYjpjzt>",
        sou: "+[1K7o7r=q>C>DY(Y5gyh.jFjtk+l(lam'y5,(y)y6XDNMPQWa2sN,$6$j'X(@/=L9MtT8TWY$d_dadxf9g0i&",
        yuan: "+a/v0e1.3(71737G9B:x=5?aA0A7APAXA]A^AgCECZEgGjIQI_LILcLsNCOMOvZH^B_G`>a^i<istNy%,$K%0%>'g(u/x3V4C4O4T4X4d5m6668;CA:D6DMGjOiP@Wc]<_&erf;iVkGn3tMttuaz&,$C$R'A'^*D+i.;.d.v/:1Y273M3Y3t42:2>f@>FlGhHZIeJ6JdK'M5OZR0T?]PcNgsi3lpqTqzs+sXsgu0uAubwfwrx(x/",
        rong: "+b+v0vB>LeLuN1O4OlSWTgTsUsd0j2j;rrv>,%%%@%G%y.+.J6]:s=Y?F@bCJGuYlYndJfShek8n6uhv2v^,$p/0/?/@0p41EpSwY?h7",
        jiang: "+f/%4t5X5ZE<FjGWHTHgHkJ2PePfU3Z2ZLZMZPZak@kTwN,&1'j)$+G/Q1e2<5'7B8=BUD]JlK<KGKHV9blbsdUgThniokullq7v+y?,$1%v';/2/r:1:S;u=bMKN(N2];a`cRoHq%",
        bang: "+hC[EWW@WYWmX'[/g^h2j<oGwmxexf,%.2RA^E_T3U?Y@ddfGhdpssK,$G*2*:+0.5:+=>K&K+SmY;aBjs",
        shan: "+n.V/52V2a3C3_6;<s=H>MB.CrFFFGIxJ+MrR%UaWfZxdjgbhqi6i8jQkQkzlGnXqOt)v/v?yj,'''q*H/G8k8w9B;Y<e>Z?/?>CHF0K`L/PqUkWWX&Yr]Ffzg;imkJkLogqQqYrmtAu9,0L0X1v5]7%9q;3;m@)A)ABBPEOJmL^NkPnU`VwYnYoYu[*]C]KfGi6jImtoYoZq;qA",
        que: "+p6Z6bCiESFMSh_raFb.j3n:nDxw,%I/=<B@GGIMRO%T*T<T^U4U5V6VSiyj$,$A*EAiZbZl[W[[^Zs&uX",
        nuo: ".//m='Jsa<c]c^gPi=jCjPjfx+,$y'J.3YVZ:b[bpbzlP,2i2j9i<iCfIhSKXV^X_'",
        can: ".0/A7T7U7V7W=J>M@jN$Nx`Z``awaxaybzi8kHkQs7,*z+25F9Y<+@D@wHgYr`(b<,'<*C.K1@1D:HTae/e_i@j@wPwX",
        lei: ".1/S/p4a7O>eC4E;G(G:M2lDm0,&M(%(g(h)[141l3;4&;GI+K@M=MrRAUDU`V2VMVNWCX5aYcfdMfmgngth/ifj7kNlTmz,%T&J'&(5)3)4)?)H1%8B;F<BG2MSPfRGUnV>V_YW_=`3bfbucTdEoptvxL",
        zao: ".425;W;f=Y?]b/opu1v@wtxj,9K;y>w@CHCHiNGNH[E[J`;bjs7,'f(Q*R:vAyD5DOIJJCN/Vf",
        cao: ".4>NQyU@aXadaqc<kxlOs/s0,&;7hbdn'sPsovC,%J/_4M4hLdTyi0x.",
        ao: ".82/7=>=>>BjC'FaFdH`HdHfLXLkMIRORgU?UoY<b(c@eEelfQkDl[n0uywu,0p7H9D9^?O?_@iDaDbHFP/UWl3l8l<m`spt],%o/b2:4e:M:NEeJ>KlTXTdTeYe^8^Ci?jFo8q(t6wn",
        cou: ".<1[,$W5DpR,FYGb",
        chuang: ".>2;2Q2h313;3W=:?9WuXH]uaRk$sY,'PAJAXA`KqM;U]ZjZn[=,Zm[1",
        piao: ".J3`4p>RM0[1[taroask,+%7TB[ILNrQjW:`+ftidl4wO,'c/hN)ZtcVdfdge$iAjJlToD",
        man: ".NCnF%IzK(M4QcWg_^b*b<kGs2,&<&_6$737Q8'9U9b?fDZQ]QiRKd^fpie,%V%f)2+H/Z0*1E4c:T=CLRTYTlYBa2cXdAf?g8knkooAq5",
        zun: ".Z?4FQPiUYfph(kpvf,'%;5gBj1,2o:gJKPkUIoXq=sDtY",
        deng: ".c2'?FFWM[UWb`dG,(_9.:j;r@$HPNAQuUo[v]x`XsV,5o=fD:JjLUUSYU^?",
        tie: ".j9UW&^1,m?xo,*w?.@RBKOwPtU[UpWSeIf&iT",
        seng: ".n,,kp",
        zhuang: ".uG@GAGGHVI0IGK$WuXBXPd%d&d'kuwOwp,&?5r82=fBmBwb1bevRw0,3%3?",
        min: "/&1D2W4R9KC*IoRnSr]L]M]z_v`pa)b$bvf9h<mrn'nIp+p.qj,.W194P5I5^8bEYF/G(G/G[LjO1OrS'TV]P]l`Te[epiUjJu.,1(?bOdR?STZ(Z?[7[?o;q6quwdwe",
        sai: "/1>4>l?nEX^7a@iJ,.&.>`mpa,?p@zcAnnpv",
        tai: "/E178.AFBeGzH&H1HcN5Nh]C]a]pajf$ldn_oyu?,(E/A/c/d1:6?<`<a@BF*^ca%nWnirDrqtwx?,'dB<K2M8OXW+dSh(j(m>pB",
        lan: "/H0N7C<7?u@qBJFoFvKmNDNJNURPT_X/`AcHcXcmfaj%lhmBmZnnnpqtvI,$k)F)X)Y2_777w9F:A;@;H;c;d<q@5@A@U@`@zA.A0I$I=_u`vaAc+gfh.iDj[yz,%/'x)+)/4B4d4s5.575b5x6.:b;W=JDlM]VSVkYQZc[Saici",
        meng: "/L1)4_GuGvNfQ2X&XkcRcTcli7l`res]x8,'A(B.Q.Y6;:1D'E.IxJUN*OQQmR=RHVDsAs_w:x_,$?&B*'.&.x000rLbLgQLRjXo_@_l`1`2cdfUkIn%nGtrv*wdwewm",
        qiong: "/O6SMvO8`kbVw5,'S>0>3>i??FhGNHXI4IAPwQYZMZO[0[H]j]vs2ud,(%(C+C+FACBbJrPm",
        lie: "/R1G2M41444K:=;9CuCvJJV%VJ]Hg8g>h;m$vpxl,+z1V2L<w=H>t@B@c@hBYCqD+DuE/e+mEofuq,+42yA_D_I&dTkrkzmRoyrA",
        teng: "/bWc,7%7n?WL(L9a.a6f]pqqM,(:)G/U8H9oJ]_vh8i.ibo+x1",
        long: "/d:/:y@FC$C%G1G2Q2R.UJV'V(Yo]+f]m=pprss^vDwn,%q)51A5k7/7^;'@uF7I9M^PJRIS^T4VWVX[A[K[_]k_i_ta>m9mmo+u^,(y14165)=`@8DgTvVN]5]u^N_z`9i`tzyKyPyQyW",
        rang: "/g51@UFsG6cpmF,;>@xE7INX1Z9ZFh%,(o;4;U;lDnl$",
        xiong: "/w/z2*5<5B:[Gc]f^znU,/l2*>>>C?<?=o=o>t0,7;7j8<<'<5?b^_",
        chong: "/x1<>ID9ORPSSjSk]$]ObMbriojz,042q3.82A&FQL9XKenjjkVrLsUv4,)n.p0P1h3kCyNSPbX1]o",
        dui: "0&0(0/<;C8DTEZPWP]Pl^VbhbicUn+n4n@tZ,:=:Q:y;)LlTbUMVrds,'[:_;7G+I%UMUVYP[b]]]ybrr7",
        rui: "0&0(0/7tG3`Te_u$w[,'N/`GqJ:QI];eZgFtPuJ,&H&I&c(X(Y*9.?Q=QxU2XN",
        ke: "0'2r3+4N4X5w8+9`:I=lBnDOGEJkOTPdRXS'T`ThUl_0_Na6a7iaj?n>v'y3,%N&T*/+U+V.q4U5.6>:C<QAKB%BFF&KwLmQVSDT*TuU@UOV0V@XOYHZw[>ehi@knsFu'y&,'@*d.R1S2J8q<mB+EvGDMsOfP^R7WHX&X]Z2bqc<d1d9h`j<jl",
        tu: "0*021M2.8N;M<HA=AHAaAbAjAlD[DfEQFfO<QkS[TmU:XhYF[T^<_MgohJikk)ws,(7/T2y3+5`8rH7LJM'X=XAY6ZW^;pbvww[x1yT,$JAMBvHJI>MNO'ObQJR)S0VtgEhNrVres)sUt+tWxG",
        nei: "0E0d;*Ju,.d.e2toup9,JzRMeag%mmn2",
        liu: "0K2N3l@>EjLhNBTvY1cgjyoEoNoXv+v;wDwa,%F'4'X272E6B899;:f?J?aF1FpGsH(HaJZJpK3KCM>M`T9TZU<UYZceGi8jajkkf,$K$l(F0%39CvJ1R*SrT4T_U<XKY9YJ_%_kdcdedhdzf8g5h2hGi*iOjGl:o%spt<uouwvG",
        shou: "0[7a7j;q?.CJGOGRO:P^dndohZmemy,3OCKDrE2LWM@e:i4pwsE,TWg<yt",
        ran: "0c0h9O>rIwLQub,'T><?b?vF'g4nJtu,$)*T*i212=2Wk;kE",
        gang: "0g182P3=DVE7RMRWSzd%d&d'e'hXjntBxt,%f5'>;>?AsB;BqKZRsTh^Ue?hDiwj)jKn5,NtR2T.W4",
        gua: "0m2e323P3c6L7z9C9[:R<WBcP?fgg&hnvWwV,*2>xIFd5f4jMjUnh,2v3e8=9M<DAYC^PzQGWydLdUhzr:uG",
        zui: "1+7.9k>@?$?rUDUpqJs6sNvg,%o&u'r'w)J:8HzQ'WOYKd*h'jT,&]036BGsM.MUMdR+R@",
        qia: "1H5w6G:CB*SBW4_6a6f*f_hcialX,+&23SkUGo&yZ,2nBHM:a.jm",
        mei: "1L@:B<E+EuIdL2L@LHLiMhP.TRTY]*f4gZmEoFpYu&v<wl,$I$Y%d(n+3+i+j000?0J2s565>5B>d>k@6DFEfFbGTLEP%P9PaQBW)WiYs_Ibgjyk/oJoipNuHw9z',.e28B@E8L+MPQLSeSjY)Y/_Oaml?lGs[ujwIwZ",
        zhun: "1P1a<;AvDIODQz]bp/,4A6<Y?ZVe5nE,1k7B9.<uHK",
        du: "1j3D5p7P>fE/I<IVJ:NAXen[qSqnt>y^,(t+F+J+m3>4]4p:]AWAcB@BXCNDwGOI.O0Q+QCXy]&]1_kn4t1vk,/K111C3^5d8l;B;b<j=_?`@3@kL)MjRLS/VEY(Zd[I`bafb+b/i1k%wOw^",
        kai: "1z2%2w3V4b>KCTEIHPR8TuYk]m_@a0aUa]b2ihr',$^)o)r:C<:=1,$.=cF*S'SqT5UaWsXLXsYvZj[Ad`",
        hua: "2H3f5P648i9D:n>pCyH9J7KuKvMYM`Snj^k<l8t[u.wLyY,&(&y6x9/DLJQK+K7S)TBU@bJgIrdtStTxA,$0&N)$/H6E8/8m9C9M:W;0<K=[NqNrQcRlU/WziHj/tJw0",
        bie: "2[2bZ][ybUv%v*,MDMzw&,)N*q0<4aD7oOq4woy]",
        pao: "2_5I9q@5C)HCXTejfE,1)<]<_=JA8C/IIKtNwSTVEVTZDosxu,(>2B2C4(B7BGEnP'WY`V`wv=v?vh",
        geng: "2f;?CeDxS]XXgSs(x'yh,2d>EJad;d<dieyf@hskDkOlWm+w(x@,?S@rKcd(jimppRs@ua",
        shua: "2n;s,lO,8Z",
        cuo: "3)347/GaU'U+XsgQi&j=l0,H1LRM?PhRcUEfLoewCwG,$Q$s%i)Z98ClITJILqMxQFRfSkXGXWv4v8",
        kei: "3+Pd,,",
        la: "3.<T<v@WBzfCieifjDm$m9ovuT,$1)66&@hI8M$SNUPkbp<qgqwwoy;,(4.%.Q.y1'GuGvJbVDY_a?kenU",
        pou: "389p:zC]JtKFecehgqh]xf,B9^[,34",
        tuan: "3ZA*A+A`AcEwFKZmb;enibkL,&'(H5G5e7l>YD=K?KE`1c$,3y>XTRt4t^",
        zuan: "3zi[mS,`)aIgJgigph(it,?mDkDuOyV@VdWM",
        keng: "438lB>BGI>gYi?kR,+RB2SdT(TI,8WQ?S@TfX=[o",
        gao: "4P9'94H.S_jHtT,%R%S%g&7'Z(P(sDYNQNVQ4QHW@WBWqY)YiYj^P_`b`fXi^k(k/q+r9wy,'l(I8d<_K_QzT:XDY:b'f5k.k/t0tSx+",
        lang: "4T;6<fCoElM'ScY4njsLsMsZw`,%$&A)w2a=TC_FlH+T.Y*^>s<wN,$=$o%4+f/48ME.KPKTKaQMT=XPZB[HhL",
        weng: "4k>%EOHbTpmHr),6jIXJ)QRj5kWmZ,$q&x/;SvsiunxX",
        tao: "5E8$:M<CH0H3HUM%W`Z8aef%hbjYw'xN,%V(D1y3=3O4$7$::H'WKd=e=fTfbhyi7xV,.03L6u7o:5;kBjFhHnI+M_R4]e`sa%aOb$b6eFf:fOh5h]x'",
        nao: "5R9aCVDeGeKhM(NsSSUdV4^+_B_p`dc/gFjykjwG,'23yD?E0E9GlSjThU'oWozpXqp,+L0M7[:aU=WlZ/[;l'",
        zang: "5cEYHVYt,ALk.oUqrr'r1yk,&3'z???J@1@:@bQDh$itk&",
        suan: "5o,C^LNW(]5^G^r`),$BMR",
        nian: "6(:m<$D)J?X2Yj]d_l`IfBhMkql7m4,$w3*4>69>DU8XHXd`BawsB,&'CpD6D]FLGYGjm<nJp9pirQw5",
        shuai: "6AVlW7k(,EAJ?fQi],/s2$",
        mang: "7&8@;$GPJfQ2Xk]G_DsPt9tI,.Y/D2S8)AoB1CWLKOeOfT3T;].t4uzv5wdwe,(`+0000mJpNvQtWfhK",
        rou: "7KL1O?iGuc,$a4g>jGZI1X6agbOmxocp_yE,.a;5CeFTS4aAauhxnbsJ",
        cen: "7T7U7V7WCdRGU8,/h36Yr]@`(,",
        shuang: "7_ExNFNMb),)H1A88;';BAGV[fNsd,U'^t_ci9iejPt@u$v.",
        po: "83;3>`@GBWHcKHP_R[RmYdjUmopTsk,(^0i1D1F1q5J628O:R=8DJF$NkSVSX]g_)atg%kd,$P%uHjL`M@MrN7N`P3U4VrWI]0bbd'gqkHlF",
        a: "8T9`<8=_,p>,RHXS]+",
        tun: "8]9;<;?=A.B?QzXG]bbip/rHsR,//34=yq_qjt<,+$48=s=uER_[e7fclkp2w=",
        hang: "8lCUH+I>V^]koAtOw%,/y]>^/d0hjrutc,*P1V3$>lHPJvbYczlj",
        shun: "8m,$U'=PRQeQoQwrg,&bbPcqka",
        ne: "8u9:9L;*e_,KTPP,77;z",
        chuo: "8v;@<J@[JlJmKhL(NT`KdUfulK,*N3R3yUh_?eKgAi.,AkBwC6FEG`H3H4I_MEQgTQVGeny&yH",
        wai: "9C:R=&GiTB,*X;$[x,cW",
        guo: "9C:R<^=(>Y@vA9A@AEAGAJAUD&DlF4T*WNWjZ`Zd`:aucLi2k%mzu(y?,$+&$(e3C3l4u7`9oCvM)RB`4bIeDm@mKp4pJq3wz,&*)e.D.N0$3[3dFFHEIyKpOMS+UtXCekg'g>",
        qiang: "9E;w<:=a>:F5F?FbMKMtUBYQZMZPZad7d9dIeqjak:k@o.u8yJ,%`&n(96R7e<K?IANAPCsDUElH0KHRs_sg.gLjwk+k5k;kAkQpFsX,%U&5'>(w.'4O:&B:CoD/SzTgU3XTXtYTsc",
        pen: "9J=I=Q?g,*C5M9qIUO8l:yN,",
        pin: ":W@JJ.K&M.N0fTfw,$g/HAhEhG%R?S1V=Z<mF,'](b0x>n@Icgd3dHgPi]",
        ha: ":_Hc,c],**+>.mP^X&",
        yo: ":v;z=L,,",
        o: ";&=.?T?w,^W,",
        n: ";V>5,,",
        huan: ";g=4=5@]AgCZDiH@HNMvNOOXP+PNS:TVX9_ja(c7cth4iYlRm:w9x),&3)e*A*O2/2Y3E4h849M9_<x=p>lBvCADPE8EjG`HoIELXM+PeQYbvd;dgexgUiQirk<n*v;xZxd,$C(=;[>&>8>L>bG(HVIWJZKILsSRUqY&YX[$[^^c^uihkvmvnPnZp[qdrWv&",
        ken: "<1CHFe_9c=i+,FHSpn&nInU,3)3f>(>MRpy@yF",
        chuai: "<Jibj5,*(q5qH,C[",
        pa: "<XI;VqW%^/dui/tY,/58TA6GHNK^<l[rpu7yh,2OB(WA",
        se: "<Z=bEXYQcDfukKlNvV,&)*]*_1^3K4Y9(9)9r9z:iG'GrHpMQZ%Z7ZEb+gRsi,'>:[G&Q5SpU6X+Z@Zv_3dn",
        re: "='`lhN,4Q=G?du3,",
        sun: "=JN`NreIh1j7j8jw,%=%TCTDI]9^%_6`Zve,$g&t'HT6^Ve5e?st",
        hei: ">.?1,8u,w7w8",
        dia: ">8,,",
        de: ">aB$XS[Y[v[z_:_z`]ozxb,3eNJ,*]RwX[",
        dei: ">a[Y,,",
        kuo: "?=Y=e7f[fgg(lw,85:LXmXr]wy=y>,+8PzQGWyZa[V_pa=aWatbmkPkw",
        ceng: "?>QLQoULs3s4,'Q[u,D;iQ",
        ca: "@1@bf@lim1,VJV_,J@",
        zeng: "@mF=FDbXs3s4,'Q?jHRJ%RgUn[ue(f[g8i:inji,:Z@$A(LYQpXAl7ob",
        nin: "A$^[_ofk,oR,",
        kun: "A:BZDQDaGJGNKnSsSt_Igmp8q:xC,2z8G=w?gCtG:H9PnT?WGY1YEdtwu,.13(3/3K3o>MMgRKX^ZAZN[Eh[k6k7k>n>pes4sZu[",
        qun: "AAG^O`SPW>,*=^sk9k:,3;3BC&IKvA",
        ri: "ABol,.c,2)NwO.OVg`iq",
        lve: "AdP[hs,K%K'YN,QhQmXH",
        zhui: "BVFBH]K9`gibyL,0;IkK9TLV.];eBfEi>iPpApz,92?x@wI%MeRFRYV*Xd]y^ShWj=s1",
        sao: "DKLqadc<e9hUi9j>x4,.O6DM3R8g)gVijiqqi,/Xdahei5jDk4o$oiq'",
        en: "H>S0_/jl,?0,$d",
        zou: "HML_i'iKj4y5y6,$W^^eSwm,99<hA:A;K;KsL@Lh]Zi4iyn(nEpcw$y/y8yo",
        nv: "Hr_+sH,0/aWm=,1L1NO)W%",
        nuan: "Hzqu,4k5e>]>^,ey",
        shuo: "I)aJjJnJnRsJ,%])y1w<p@lDpRUSxTx_D,$Z8i8k<cPnT%VFWV",
        niu: "IHNn]g^+e;elfQt^,/o0/<2AfAgBzcFhOwK,OGW@`h",
        rao: "J]Mce>m*wG,'2Z.gDhhvU,&V4bJL^<fLfq",
        niang: "JoN&NI,,MYN>NF",
        shui: "K9W:gOh/,/$/%/*393<Q)WCY/Y8p/,3@8i8k8o<c<pZ*",
        nve: "Kl,KbMATF,)R",
        nen: "L4MCMJ^[,,",
        niao: "LzMxN8QI,&a6aoyu`,%y2;3*4;qCu+",
        kuan: "OpP9PJx3,)x***.[?[@qv,VMjvk*",
        cuan: "V7l<m@mImP,(l)S+C/8:S;T?iA2ZIZs[?[@[F_h`D,DMDtQ[V`YS",
        te: "]?]@b%,B/B<om,06R%X;",
        zen: "^&kd,,:m=H",
        zei: "d?,,0g?<@Zn]ohpI",
        den: "e3eK,,",
        zhua: "ebgCl@,(1A4A5`nqZ,kS",
        shuan: "fovM,&'3PdApZ,Ym[)",
        zhuai: "fx,Ph,B`G>",
        nou: "jC,%Z(SE+kPlk,SuUX",
        shai: "jvmTq0rw,^5_p`3`MaK,9Z",
        sen: "y*ym,&*,4P",
        run: ",'73H8cQoqT,YzZ6[2",
        ei: ",*$,8P<e",
        chua: ",*',",
        gei: ",dHhl,",
        miu: ",g*ii,:B=F",
        neng: ",oC,/L",
        fiao: ",,5?",
        shei: ",,8o",
        zhei: ",,HW",
        nun: ",,w%"
    }
      , j = function() {
        for (var e = [], t = 36; t < 123; t++)
            44 !== t && 34 !== t && 92 !== t && 45 !== t && e.push(String.fromCharCode(t));
        return e.join("")
    }()
      , J = function(e) {
        for (var t = 0, i = 1, n = e.length - 1; n > -1; n--)
            t += i * j.indexOf(e.charAt(n)),
            i *= j.length;
        return t
    }
      , $ = {}
      , q = {};
    for (var Q in K)
        for (var G = K[Q].split(","), Z = 0; Z < G.length; Z++)
            for (var X = G[Z], Y = 0; Y < X.length; Y += 2) {
                var z = X.substring(Y, Y + 2)
                  , ee = String.fromCharCode(J(z) + 19968 + 6976 * Z);
                $[Q] ? $[Q] += ee : $[Q] = ee,
                q[ee] ? q[ee] += "," + Q : q[ee] = Q
            }
    K = null;
    const te = function(e, t, i) {
        var n = []
          , o = "function" == typeof t;
        e = String(e).split("");
        for (var s, r, a = 0; a < e.length; a++)
            s = e[a],
            q.hasOwnProperty(s) ? ~(r = q[s]).indexOf(",") ? (r = r.split(","),
            r = o ? t(s, r) : "[" + r + "]",
            n.push(r)) : n.push(r) : n.push(s);
        return n.join(i || ",")
    };
    function ie(e) {
        const t = te(e)
          , i = [t]
          , n = t.match(/\[[a-z,]+\]/g);
        if (n)
            for (const e of n) {
                const t = e.replace("[", "").replace("]", "").split(",")
                  , n = [];
                for (let o = 0; o < t.length; o++)
                    if (0 === o)
                        for (let s = 0; s < i.length; s++)
                            n.push(i[s]),
                            i[s] = i[s].replace(e, t[o]);
                    else
                        for (let s = 0; s < n.length; s++)
                            i.push(n[s].replace(e, t[o]))
            }
        const o = []
          , s = [];
        for (const e of i) {
            const t = e.split(",")
              , i = t.map((e=>e.charAt(0))).join("");
            o.includes(i) || o.push(i),
            s.push(t.map((e=>e.charAt(0).toUpperCase() + e.substr(1))).join(""))
        }
        return {
            pyfirst: o,
            py: s
        }
    }
    function ne(e, t) {
        const i = [];
        if (!e)
            return i;
        if (e.length > 60)
            return i;
        if (/^[\u4e00-\u9fa5]+$/.test(e)) {
            const n = ie(e);
            for (const o of n.py)
                i.push({
                    trueType: t,
                    type: "py",
                    match: o,
                    label: e
                });
            for (const o of n.pyfirst)
                i.push({
                    trueType: t,
                    type: "pyfirst",
                    match: o,
                    label: e
                });
            i.push({
                trueType: t,
                type: "base",
                match: e,
                label: e
            })
        } else {
            if (/(?<=(?:^|[\u4e00-\u9fa5 ]))([A-Z][a-z0-9]*(?: ?[A-Z][a-z0-9]*| \d+)+)/.test(e)) {
                const n = RegExp.$1
                  , o = n.match(/[A-Z]| \d+/g).join("").toLowerCase().replace(/ /g, "");
                i.push({
                    trueType: t,
                    type: "enfirst",
                    match: e.replace(n, o),
                    label: e
                })
            }
            if (/[\u4e00-\u9fa5]/.test(e)) {
                const n = e.match(/[\u4e00-\u9fa5]/g)
                  , o = ie(n.join(""));
                for (const s of o.py) {
                    const o = s.match(/[A-Z][a-z]*/g);
                    let r = e.toUpperCase();
                    n.forEach(((e,t)=>{
                        r = r.replace(e, o[t])
                    }
                    )),
                    i.push({
                        trueType: t,
                        type: "py+",
                        match: r,
                        label: e
                    })
                }
                for (const s of o.pyfirst) {
                    let o = e.toUpperCase();
                    n.forEach(((e,t)=>{
                        o = o.replace(e, s[t])
                    }
                    )),
                    i.push({
                        trueType: t,
                        type: "pyfirst+",
                        match: o,
                        label: e
                    })
                }
            }
            if (i.push({
                trueType: t,
                type: "base",
                match: e.toLowerCase(),
                label: e
            }),
            e.includes(" ")) {
                const n = e.replace(/ /g, "");
                i.push({
                    trueType: t,
                    type: "base",
                    match: n.toLowerCase(),
                    label: n,
                    weight: -10
                })
            }
        }
        return i
    }
    function oe(e) {
        return /^\/.+\/[gimuy]*$/.test(e)
    }
    function se(e) {
        if ("string" != typeof e.code || !e.code)
            return null;
        if (!Array.isArray(e.cmds))
            return null;
        if (e.platform)
            if ("string" == typeof e.platform) {
                if (e.platform !== process.platform)
                    return null
            } else if (Array.isArray(e.platform) && !e.platform.includes(process.platform))
                return null;
        const t = [];
        for (const i of e.cmds)
            if ("string" != typeof i) {
                if (i && i.type && i.label && "string" == typeof i.label && !(i.label.length > 60))
                    if ("regex" !== i.type)
                        if ("files" !== i.type)
                            if ("img" !== i.type)
                                if ("over" !== i.type)
                                    if ("window" !== i.type)
                                        ;
                                    else {
                                        if (!i.match || "object" != typeof i.match)
                                            continue;
                                        const e = {
                                            trueType: i.type,
                                            type: i.type,
                                            label: i.label,
                                            match: {}
                                        };
                                        if (i.match.app) {
                                            if ("string" == typeof i.match.app)
                                                e.match.app = [i.match.app];
                                            else {
                                                if (!Array.isArray(i.match.app))
                                                    continue;
                                                e.match.app = i.match.app
                                            }
                                            i.match.title && oe(i.match.title) && (e.match.title = i.match.title)
                                        }
                                        if (i.match.class && "win32" === process.platform && ("string" == typeof i.match.class ? e.match.class = [i.match.class] : Array.isArray(i.match.class) && (e.match.class = i.match.class)),
                                        0 === Object.keys(e.match).length)
                                            continue;
                                        e.labelCmds = ne(i.label, i.type),
                                        t.push(e)
                                    }
                                else {
                                    const e = {
                                        trueType: i.type,
                                        type: i.type,
                                        label: i.label
                                    };
                                    oe(i.exclude) && (e.exclude = i.exclude),
                                    "number" == typeof i.minLength && (e.minLength = i.minLength),
                                    "number" == typeof i.maxLength ? e.maxLength = i.maxLength : e.maxLength = 1e4,
                                    e.labelCmds = ne(i.label, i.type),
                                    t.push(e)
                                }
                            else {
                                const e = {
                                    trueType: i.type,
                                    type: i.type,
                                    label: i.label
                                };
                                e.labelCmds = ne(i.label, i.type),
                                t.push(e)
                            }
                        else {
                            const e = {
                                trueType: i.type,
                                type: i.type,
                                label: i.label
                            };
                            oe(i.match) && (e.match = i.match),
                            i.fileType && ["directory", "file"].includes(i.fileType) && (e.fileType = i.fileType),
                            i.minNum && (e.minLength = "number" == typeof i.minNum ? i.minNum : 1),
                            i.minLength && (e.minLength = "number" == typeof i.minLength ? i.minLength : 1),
                            i.maxNum && (e.maxLength = "number" == typeof i.maxNum ? i.maxNum : 1),
                            i.maxLength && (e.maxLength = "number" == typeof i.maxLength ? i.maxLength : 1),
                            e.labelCmds = ne(i.label, i.type),
                            t.push(e)
                        }
                    else {
                        if (!oe(i.match))
                            continue;
                        const e = {
                            trueType: i.type,
                            type: i.type,
                            label: i.label,
                            match: i.match
                        };
                        "number" == typeof i.minLength && (e.minLength = i.minLength),
                        "number" == typeof i.maxLength && (e.maxLength = i.maxLength),
                        e.labelCmds = ne(i.label, i.type),
                        t.push(e)
                    }
            } else {
                if (i.length > 60)
                    continue;
                const e = ne(i, "text");
                t.push(...e)
            }
        if (0 === t.length)
            return null;
        const i = {
            code: e.code,
            cmds: t
        };
        return "string" == typeof e.explain && e.explain.length < 1e3 && (i.explain = e.explain),
        "string" == typeof e.icon && (i.icon = e.icon),
        "string" == typeof e.backgroundColor && (i.backgroundColor = e.backgroundColor),
        i
    }
    function re(e, t) {
        if (!u().existsSync(e))
            throw new Error("plugin.json 文件不存在");
        let i = null;
        try {
            i = JSON.parse(u().readFileSync(e, "utf8"))
        } catch (e) {
            throw new Error("plugin.json 文件内容无法解析")
        }
        if (!i || "object" != typeof i)
            throw new Error("plugin.json 错误的文件内容");
        if (t && (i = Object.assign(i, t)),
        i.platform)
            if ("string" == typeof i.platform) {
                if (i.platform !== process.platform)
                    throw new Error("插件应用未适配 " + R())
            } else {
                if (!Array.isArray(i.platform))
                    throw new Error("插件应用未适配 " + R());
                if (!i.platform.includes(process.platform))
                    throw new Error("插件应用未适配 " + R())
            }
        const n = {};
        if (n.location = l().dirname(e),
        n.isDev = !!t || r().dev() && !/\.asar$/.test(n.location),
        n.isDev ? i.development && i.development.main && (i.main = i.development.main) : /unsafe-[0-9a-z]{32}\.asar$/.test(n.location) && (n.unsafe = !0),
        i.main) {
            if (!(n.isDev && /^https?:\/\//i.test(i.main) || /\.html$/i.test(i.main)))
                throw new Error('"main" 配置文件不是 html 文件');
            if (!n.isDev || !/^(?:https?|file):\/\//i.test(i.main)) {
                const e = l().join(n.location, i.main);
                if (!e.startsWith(n.location) || !u().existsSync(e))
                    throw new Error('"main" 配置文件不存在');
                i.main = (0,
                d.pathToFileURL)(e).href
            }
            n.main = i.main
        } else
            n.isTpl = !0;
        if (!/^[a-zA-Z0-9]{3,16}$/.test(i.name))
            throw new Error("插件应用 ID 只能是字母数字组合(3-16位)");
        if (n.name = t ? "dev_" + i.name : i.name,
        !i.pluginName || i.pluginName.length > 40)
            throw new Error('"pluginName" 为空或超过 40 位');
        if (n.pluginName = i.pluginName,
        "string" == typeof i.author && i.author && (n.author = i.author),
        "string" == typeof i.homepage && /^https?:\/\/./i.test(i.homepage) && (n.homepage = i.homepage),
        "string" == typeof i.description && i.description ? n.description = i.description : n.description = "",
        !n.isDev) {
            if (!U().valid(i.version))
                throw new Error("无效的版本号");
            n.version = i.version
        }
        if (n.isTpl && !i.preload)
            throw new Error("preload未配置");
        if (i.preload) {
            if (!/\.js$/i.test(i.preload))
                throw new Error('"preload" 配置文件不是 js 文件');
            const e = l().join(n.location, i.preload);
            if (!e.startsWith(n.location) || !u().existsSync(e))
                throw new Error('"preload" 配置文件不存在');
            n.preload = e
        }
        if (!i.logo)
            throw new Error('"logo" 未配置');
        if (!/\.(?:png|jpg|jpeg)$/i.test(i.logo))
            throw new Error('"logo" 配置文件不是 png、jpg 图片');
        const o = l().join(n.location, i.logo);
        if (!o.startsWith(n.location) || !u().existsSync(o))
            throw new Error('"logo" 配置文件不存在');
        if (i.logo = (0,
        d.pathToFileURL)(o).href,
        n.logo = i.logo,
        i.pluginSetting) {
            const e = {};
            "boolean" == typeof i.pluginSetting.single ? e.single = i.pluginSetting.single : e.single = !0,
            "number" == typeof i.pluginSetting.height && i.pluginSetting.height >= 1 && (e.height = i.pluginSetting.height),
            n.pluginSetting = e
        } else
            n.pluginSetting = {
                single: !0
            };
        if (n.isTpl && (n.pluginSetting.height = 1),
        !Array.isArray(i.features))
            throw new Error('未配置 "features"');
        if (n.featureDic = {},
        i.features.forEach((e=>{
            const t = se(e);
            if (t) {
                if (t.icon && !(t.icon.startsWith("dbicon://") || n.isDev && t.icon.startsWith("file://"))) {
                    const e = l().join(n.location, t.icon);
                    /\.(?:png|svg|jpg|jpeg)$/i.test(t.icon) && e.startsWith(n.location) && u().existsSync(e) ? t.icon = (0,
                    d.pathToFileURL)(e).href : delete t.icon
                }
                n.featureDic[e.code] = t
            }
        }
        )),
        0 === Object.keys(n.featureDic).length)
            throw new Error('"features" 未配置任何功能');
        return n
    }
    const ae = require("events");
    var ce = e.n(ae);
    const le = require("rimraf");
    var de = e.n(le);
    function he(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class ue extends (ce()) {
        constructor(e, i, n, o, s) {
            super(),
            he(this, "setPluginDirName", ((e,i,n,o,s)=>{
                let r;
                const a = l().join(this.userPluginsPath, "install");
                if (u().existsSync(a)) {
                    const e = L(u().readFileSync(a, "utf8"));
                    e && (r = JSON.parse(e))
                }
                r || (r = {}),
                i ? r[e] = {
                    dirName: i,
                    mtimeMs: n,
                    md5: o,
                    upxMd5: s
                } : delete r[e];
                try {
                    u().writeFileSync(a, O(JSON.stringify(r)), {
                        encoding: "utf8"
                    })
                } catch (e) {
                    new t.Notification({
                        body: "无法写入 " + a
                    }).show()
                }
                return !0
            }
            )),
            he(this, "setPluginDirNameIllegal", (e=>{
                let t;
                const i = l().join(this.userPluginsPath, "install");
                if (u().existsSync(i)) {
                    const e = L(u().readFileSync(i, "utf8"));
                    e && (t = JSON.parse(e))
                }
                if (!t)
                    return;
                const n = t[e];
                if (n) {
                    if ("object" == typeof n)
                        n.illegal = !0;
                    else
                        try {
                            const i = x().lstatSync(l().join(this.userPluginsPath, n + ".asar"));
                            t[e] = {
                                dirName: n,
                                mtimeMs: i.mtimeMs,
                                illegal: !0
                            }
                        } catch {}
                    try {
                        u().writeFileSync(i, O(JSON.stringify(t)), {
                            encoding: "utf8"
                        })
                    } catch {}
                }
            }
            )),
            he(this, "apiServiceCheckUpdate", (e=>{
                const t = this.accountCmp.getAccountToken();
                f(this.config.checkUpdateURL + (t ? "?access_token=" + t : ""), {
                    version: this.reportCmp.appVersion,
                    platform: process.platform,
                    plugins: JSON.stringify(e),
                    mid: this.accountCmp.machineId,
                    nid: this.accountCmp.nativeId
                }).then((e=>{
                    if (e.url ? (this._cdnCheckUpdateCache || (this._cdnCheckUpdateCache = {}),
                    e.day_url && (this._cdnCheckUpdateCache.dayUrl = e.day_url,
                    this._cdnCheckUpdateCache.apiDate = (new Date).toLocaleDateString()),
                    this._cdnCheckUpdateCache.url = e.url,
                    this._cdnCheckUpdateCache.content = String(e.last_timestamp)) : this._cdnCheckUpdateCache && (this._cdnCheckUpdateCache = null),
                    e.plugins.length > 0)
                        for (const t of e.plugins)
                            t.name in this.pluginContainer && !this.pluginUpdateSet.includes(t.name) && this.pluginUpdateSet.push(t.name);
                    /*  chandlerver5 if (e.illegal_plugins?.length > 0)
                        for (const t of e.illegal_plugins) {
                            const e = this.pluginContainer[t];
                            e && (e.illegal = !0,
                            this.setPluginDirNameIllegal(t))
                        }
                        */
                }
                )).catch((e=>{
                    402 === e.code && e.message.startsWith("https://") && this.emit("appupdate", e.message)
                }
                ))
            }
            )),
            he(this, "currentDayCDNCheckUpdate", (e=>{
                const i = t.net.request({
                    method: "GET",
                    url: this._cdnCheckUpdateCache.dayUrl + "?" + Date.now()
                });
                i.setHeader("Cache-Control", "no-store"),
                i.on("response", (t=>{
                    if (200 !== t.statusCode)
                        return this.apiServiceCheckUpdate(e);
                    t.on("data", (t=>{
                        let i;
                        try {
                            i = JSON.parse(t.toString().trim())
                        } catch {}
                        i ? e.forEach((e=>{
                            const t = i[e.name];
                            t && U().gt(t, e.version) && e.name in this.pluginContainer && !this.pluginUpdateSet.includes(e.name) && this.pluginUpdateSet.push(e.name)
                        }
                        )) : this.apiServiceCheckUpdate(e)
                    }
                    ))
                }
                )),
                i.end()
            }
            )),
            he(this, "checkUpdate", (()=>{
                const e = Object.values(this.pluginContainer).filter((e=>e.name && !this.pluginUpdateSet.includes(e.name) && -1 === e.location.indexOf(this.innerPluginsPath) && !e.isDev && !e.illegal)).map((e=>({
                    name: e.name,
                    version: e.version,
                    hash: e.upxMd5 || ""
                })));
                if (e.length > 0)
                    if (this._cdnCheckUpdateCache) {
                        const i = t.net.request({
                            method: "GET",
                            url: this._cdnCheckUpdateCache.url + "?" + Date.now()
                        });
                        i.setHeader("Cache-Control", "no-store"),
                        i.on("response", (t=>{
                            if (200 !== t.statusCode)
                                return this.apiServiceCheckUpdate(e);
                            t.on("data", (t=>{
                                t.toString().trim() !== this._cdnCheckUpdateCache.content && (this._cdnCheckUpdateCache.apiDate === (new Date).toLocaleDateString() ? this.currentDayCDNCheckUpdate(e) : this.apiServiceCheckUpdate(e))
                            }
                            ))
                        }
                        )),
                        i.end()
                    } else
                        this.apiServiceCheckUpdate(e);
                setTimeout(this.checkUpdate, V(6e5, 18e5))
            }
            )),
            he(this, "testPluginJsonFile", ((e,t)=>{
                re(e, t)
            }
            )),
            he(this, "ffffffffServices", {
                getPluginContainer: e=>{
                    e.returnValue = this.pluginContainer
                }
                ,
                getPluginConfig: (e,t)=>{
                    e.returnValue = this.pluginContainer[t]
                }
                ,
                getPluginUpdateSet: e=>{
                    e.returnValue = this.pluginUpdateSet
                }
                ,
                getDisabledCmdContainer: e=>{
                    e.returnValue = this.disabledCmdContainer
                }
                ,
                pluginInstall: async(e,t)=>{
                    const i = await new Promise(((i,n)=>{
                        this.install(e, t, ((t,o)=>{
                            if (t)
                                return n(t);
                            this.pluginUpdateSet.includes(e) && this.pluginUpdateSet.splice(this.pluginUpdateSet.indexOf(e), 1),
                            i(o)
                        }
                        ))
                    }
                    ));
                    return i
                }
                ,
                pluginUnMount: (e,t)=>{
                    e.returnValue = this.unmount(t)
                }
            }),
            this.innerPluginsPath = e,
            this.userPluginsPath = i,
            this.config = n,
            this.reportCmp = o,
            this.accountCmp = s,
            this.pluginContainer = {},
            this.pluginUpdateSet = [],
            this.legalInstall = [],
            this.disabledCmdContainer = {}
        }
        init() {
            const e = u().readdirSync(this.innerPluginsPath);
            for (const t of e) {
                const e = l().join(this.innerPluginsPath, t);
                try {
                    if (!u().lstatSync(e).isDirectory())
                        continue
                } catch (e) {
                    continue
                }
                this.mount({
                    pluginPath: e,
                    updateTime: 0
                })
            }
            u().existsSync(this.userPluginsPath) || u().mkdirSync(this.userPluginsPath);
            const i = l().join(this.userPluginsPath, "install");
            if (u().existsSync(i)) {
                let e;
                try {
                    e = u().readFileSync(i, "utf8")
                } catch (e) {}
                const n = L(e);
                if (n) {
                    const e = JSON.parse(n)
                      , i = [];
                    let o;
                    try {
                        o = u().readdirSync(this.userPluginsPath)
                    } catch (e) {
                        return void new t.Notification({
                            body: "无法读取安装的插件应用，" + e.message
                        }).show()
                    }
                    for (const e of o) {
                        const t = l().join(this.userPluginsPath, e);
                        try {
                            const n = x().lstatSync(t);
                            /^(?:unsafe-)?[0-9a-z]{32}\.asar$/.test(e) && n.isFile() && i.push({
                                dirName: e.replace(/\.asar$/, ""),
                                pluginPath: t,
                                updateTime: n.mtimeMs
                            })
                        } catch {}
                    }
                    const s = {};
                    Object.values(e).forEach((e=>{
                        "object" == typeof e ? s[e.dirName] = e : s[e] = null
                    }
                    )),
                    i.sort(((e,t)=>t.updateTime - e.updateTime)).forEach((e=>{
                        if (e.dirName in s) {
                            const t = s[e.dirName];
                            if (t) {
                                if (t.mtimeMs !== e.updateTime) {
                                    if (t.md5)
                                        return void A(e.pluginPath).then((i=>{
                                            t.md5 === i && (e.upxMd5 = t.upxMd5,
                                            t.illegal && (e.illegal = t.illegal),
                                            this.mount(e))
                                        }
                                        ));
                                    if (Math.floor(t.mtimeMs / 1e3) !== Math.floor(e.updateTime / 1e3))
                                        return
                                }
                                e.upxMd5 = t.upxMd5,
                                t.illegal && (e.illegal = t.illegal)
                            }
                            this.mount(e)
                        } else {
                            try {
                                x().unlinkSync(e.pluginPath)
                            } catch {}
                            if (u().existsSync(e.pluginPath + ".unpacked"))
                                try {
                                    de().sync(e.pluginPath + ".unpacked")
                                } catch {}
                        }
                    }
                    ))
                }
            }
            setTimeout(this.checkUpdate, 5e3)
        }
        mount(e, t) {
            const i = e.pluginPath;
            let n = null;
            try {
                if (n = re(l().join(i, "plugin.json"), t),
                "FFFFFFFF" === n.name && !n.location.startsWith(this.innerPluginsPath))
                    throw new Error("出错了");
                if (n.unsafe) {
                    if ("developer" === n.name)
                        throw new Error("「uTools 开发者工具」请到插件应用市场下载安装");
                    if ("clipboard" === n.name)
                        throw new Error("「剪贴板」请到插件应用市场下载安装")
                }
                if (n.updateTime = e.updateTime,
                e.upxMd5 && (n.upxMd5 = e.upxMd5),
                e.illegal && (n.illegal = e.illegal),
                n.name in this.pluginContainer && U().lt(n.version, this.pluginContainer[n.name].version))
                    throw new Error("已存在版本 " + this.pluginContainer[n.name].version);
                return n.isDev = true,this.pluginContainer[n.name] = n,
                this.emit("mount", n.name),
                n.name
            } catch (e) {
                const t = {
                    error: e.message
                };
                return n && n.name ? t.pluginId = n.name : t.pluginPath = i,
                this.reportCmp.info("plugin.mount.error", t),
                e
            }
        }
        unmount(e) {
            if (!(e in this.pluginContainer))
                return !1;
            // if (this.pluginContainer[e].isDev)
            //     return delete this.pluginContainer[e],
            //     !0;
            try {
                this.setPluginDirName(e)
            } catch (e) {
                return !1
            }
            return delete this.pluginContainer[e],
            this.pluginUpdateSet.includes(e) && this.pluginUpdateSet.splice(this.pluginUpdateSet.indexOf(e), 1),
            !0
        }
        _install(e, i, n, o) {
            const s = u().createReadStream(i)
              , r = l().join(t.app.getPath("temp"), E() + ".asar")
              , a = x().createWriteStream(r)
              , c = v().createGunzip();
            s.pipe(c).on("error", (()=>o(new Error("安装包解压错误")))).pipe(a).on("error", (()=>o(new Error("解压写入错误")))).on("finish", (()=>{
                const t = l().join(r, "plugin.json");
                if (!u().existsSync(t))
                    return o(new Error("plugin.json 不存在"));
                let i = null;
                try {
                    i = JSON.parse(u().readFileSync(t, "utf8"))
                } catch (e) {
                    return o(new Error("plugin.json 解析错误 " + e.message))
                }
                if (e && i.name !== e)
                    return o(new Error("pluginId 与 配置 name 不一致"));
                const s = (e ? "" : "unsafe-") + E();
                this.legalInstall.push(s);
                let a = b().listPackage(r).find((e=>e.endsWith(".node"))) ? "*.node" : "";
                if (i.unpack && (a = a ? `@(${i.unpack}|${a})` : i.unpack),
                u().existsSync(this.userPluginsPath) || u().mkdirSync(this.userPluginsPath),
                a) {
                    const e = l().join(this.userPluginsPath, s);
                    try {
                        b().extractAll(r, e + "/")
                    } catch (e) {
                        return o(new Error("解压提取错误"))
                    }
                    const t = e + ".asar";
                    b().createPackageWithOptions(e + "/", t, {
                        unpack: a
                    }).then((()=>{
                        try {
                            de().sync(e)
                        } catch {}
                        const i = this.mount({
                            pluginPath: t,
                            updateTime: Date.now(),
                            upxMd5: n
                        });
                        if (i instanceof Error) {
                            try {
                                x().unlinkSync(t),
                                u().existsSync(t + ".unpacked") && de().sync(t + ".unpacked")
                            } catch {}
                            o(i)
                        } else
                            A(t).then((e=>{
                                try {
                                    const r = x().lstatSync(t);
                                    this.setPluginDirName(i, s, r.mtimeMs, e, n) && o(null, i)
                                } catch (e) {
                                    o(new Error("写入错误，" + e.message))
                                }
                            }
                            )).catch((e=>{
                                o(new Error("文件 MD5 错误，" + e.message))
                            }
                            ))
                    }
                    )).catch((()=>{
                        o(new Error("打包失败!"))
                    }
                    ))
                } else {
                    const e = l().join(this.userPluginsPath, s + ".asar");
                    try {
                        x().renameSync(r, e)
                    } catch {
                        try {
                            x().copyFileSync(r, e)
                        } catch (e) {
                            return o(new Error("复制失败 " + e.message))
                        }
                    }
                    const t = this.mount({
                        pluginPath: e,
                        updateTime: Date.now(),
                        upxMd5: n
                    });
                    if (t instanceof Error) {
                        try {
                            x().unlinkSync(e)
                        } catch {}
                        o(t)
                    } else
                        A(e).then((i=>{
                            try {
                                const r = x().lstatSync(e);
                                this.setPluginDirName(t, s, r.mtimeMs, i, n) && o(null, t)
                            } catch (e) {
                                o(new Error("写入错误，" + e.message))
                            }
                        }
                        )).catch((e=>{
                            o(new Error("文件 MD5 错误，" + e.message))
                        }
                        ))
                }
            }
            ))
        }
        _hashFile(e, t) {
            return new Promise(((i,n)=>{
                const o = w().createHash(t);
                o.on("error", n).setEncoding("hex"),
                u().createReadStream(e, {
                    highWaterMark: 1048576
                }).on("error", n).on("end", (()=>{
                    o.end(),
                    i(o.read())
                }
                )).pipe(o, {
                    end: !1
                })
            }
            ))
        }
        install(e, t, i) {
            if (!u().existsSync(t))
                return i(new Error("upx文件不存在"));
            e ? g(this.config.hashURL.replace("{query}", e)).then((n=>{
                this._hashFile(t, "md5").then((o=>{
                    if (o !== n.message)
                        return i(new Error("HASH 验证失败"));
                    this._install(e, t, o, i)
                }
                )).catch((e=>i(e)))
            }
            )).catch((e=>{
                i(new Error("获取 HASH 失败，" + e.message + (e.message.includes("net::ERR_FAILED") ? " 尝试重启 uTools 解决" : "")))
            }
            )) : this._hashFile(t, "md5").then((n=>{
                this._install(e, t, n, i)
            }
            )).catch((e=>i(e)))
        }
        setFeature(e, t, i) {
            if (!(e in this.pluginContainer))
                return !1;
            const n = this.pluginContainer[e]
              , o = se(t);
            return !!o && (e && o.icon && (o.icon.startsWith("dbicon://") || n.isDev && o.icon.startsWith("file://") || (/\.(?:png|svg|jpg|jpeg)$/i.test(o.icon) && u().existsSync(l().join(n.location, o.icon)) ? o.icon = (0,
            d.pathToFileURL)(l().join(n.location, o.icon)).href : delete o.icon)),
            i && (o.dynamic = !0),
            n.featureDic[t.code] = o,
            !0)
        }
        removeFeature(e, t) {
            return e in this.pluginContainer && (delete this.pluginContainer[e].featureDic[t],
            !0)
        }
        getFeature(e, t) {
            if (e in this.pluginContainer)
                return this.pluginContainer[e].featureDic[t]
        }
        disableCmd(e, t, i, n) {
            const o = this.pluginContainer[e];
            if (!o)
                return;
            const s = o.featureDic[t];
            if (!s || s.dynamic)
                return;
            const r = w().createHash("md5").update((e || "/") + t + i + n).digest("hex")
              , a = s.cmds.filter((e=>e.trueType === i && (e.label === n || e.weight && e.label === n.replace(/ /g, ""))));
            return a.length > 0 ? (a.forEach((e=>{
                s.cmds.splice(s.cmds.indexOf(e), 1)
            }
            )),
            this.disabledCmdContainer[r] = {
                cmds: a,
                pluginId: e,
                featureCode: t
            },
            r) : void 0
        }
        restoreDisabledCmd(e) {
            const t = this.disabledCmdContainer[e];
            if (!t)
                return !1;
            delete this.disabledCmdContainer[e];
            const i = this.pluginContainer[t.pluginId];
            if (!i)
                return !1;
            const n = i.featureDic[t.featureCode];
            return !(!n || n.dynamic || (n.cmds.push(...t.cmds),
            0))
        }
    }
    const pe = ue
      , we = require("png2ico");
    class me {
        constructor(e, t, i, n) {
            this.mainWindow = e,
            this.mainWindowBounds = {
                x: 0,
                y: 0,
                width: i,
                height: n
            },
            this.isMacOs = r().macOS(),
            this.isWindow = r().windows(),
            this.nativeWorkWindowInfo = null,
            this.mainWindowNativeWindowHandle = t,
            this._refreshInit(),
            setImmediate((()=>{
                this.listenEvent()
            }
            ))
        }
        _resetInitPosition() {
            this.mainWindowBounds.x = this.currentDisplay.bounds.x + Math.round((this.currentDisplay.bounds.width - this.mainWindowBounds.width) / 2);
            let e = Math.round((this.currentDisplay.bounds.height - 600) / 2);
            e < 100 && (e = 100),
            this.mainWindowBounds.y = this.currentDisplay.bounds.y + e,
            this.mainWindow.setBounds(this.mainWindowBounds)
        }
        _refreshInit() {
            this.mainWindow.isVisible() && this.hide(),
            this.currentDisplay = t.screen.getPrimaryDisplay(),
            this.displayCount = t.screen.getAllDisplays().length,
            this._resetInitPosition()
        }
        listenEvent() {
            t.screen.on("display-metrics-changed", ((e,t,i)=>{
                this._refreshInit()
            }
            )),
            t.screen.on("display-added", ((e,t)=>{
                this._refreshInit()
            }
            )),
            t.screen.on("display-removed", ((e,t)=>{
                this._refreshInit()
            }
            ))
        }
        setNativeWorkWindowInfo() {
            if (this.isMacOs && !this.isHadPrivilege) {
                if (!I().isHadPrivilege())
                    return void I().requestPrivilege();
                this.isHadPrivilege = !0
            }
            this.nativeWorkWindowInfo = I().getNativeWorkWindow(),
            this.nativeWorkWindowInfo && (this.nativeWorkWindowInfo.appPath ? this.nativeWorkWindowInfo.app = l().basename(this.nativeWorkWindowInfo.appPath) : this.nativeWorkWindowInfo = null)
        }
        _showLogic(e) {
            this.mainWindow.isVisible() || (e || this.setNativeWorkWindowInfo(),
            this.isWindow ? !this.nativeWorkWindowInfo || 0 !== this.nativeWorkWindowInfo.width && 0 !== this.nativeWorkWindowInfo.height ? I().focusShowWindow(this.mainWindowNativeWindowHandle, (()=>{
                this.mainWindowShowTimestamp = Date.now(),
                this.mainWindow.show(),
                this.mainWindow.setBounds(this.mainWindowBounds)
            }
            )) : (this.mainWindowShowTimestamp = Date.now(),
            this.mainWindow.show(),
            this.mainWindow.setBounds(this.mainWindowBounds)) : this.isMacOs ? (this.mainWindowShowTimestamp = Date.now(),
            this.mainWindow.showInactive(),
            I().focusShowWindow(this.mainWindowNativeWindowHandle),
            this.mainWindow.isVisible() || this.mainWindow.show()) : (this.mainWindowShowTimestamp = Date.now(),
            this.mainWindow.show()))
        }
        trigger(e=!1, i) {
            if (this.alwaysShow = e,
            0 === this.displayCount)
                return;
            if (1 === this.displayCount)
                return !e && this.mainWindow.isVisible() ? void this.hide() : void this._showLogic(i);
            const n = {
                x: this.mainWindowBounds.x + Math.round(this.mainWindowBounds.width / 2),
                y: Math.round(this.mainWindowBounds.y + this.mainWindowBounds.height / 2)
            }
              , o = t.screen.getDisplayNearestPoint(n)
              , s = t.screen.getDisplayNearestPoint(t.screen.getCursorScreenPoint());
            if (o.id === s.id)
                return this.currentDisplay = o,
                !e && this.mainWindow.isVisible() ? void this.hide() : void this._showLogic(i);
            this.currentDisplay = s,
            this._resetInitPosition(),
            this.mainWindow.isVisible() && this.mainWindow.hide(),
            this._showLogic(i)
        }
        hide(e=!0) {
            if (this.mainWindow.isVisible())
                return this.isWindow && this.mainWindow.isFocused() ? (this.mainWindowBlurTimestamp = Date.now(),
                this.mainWindow.hide(),
                void (e && this.nativeWorkWindowInfo && I().restorePrevWindowFocus(this.nativeWorkWindowInfo.id))) : void this.mainWindow.hide()
        }
        setHeight(e) {
            this.mainWindowBounds.height = e,
            this.mainWindow.setBounds(this.mainWindowBounds)
        }
        setPosition(e, t) {
            this.mainWindowBounds.x = e,
            this.mainWindowBounds.y = t,
            this.mainWindow.setBounds(this.mainWindowBounds)
        }
    }
    const ge = {
        Backspace: "Backspace",
        Tab: "Tab",
        Enter: "Enter",
        MediaPlayPause: "MediaPlayPause",
        Escape: "Escape",
        Space: "Space",
        PageUp: "PageUp",
        PageDown: "PageDown",
        End: "End",
        Home: "Home",
        ArrowLeft: "Left",
        ArrowUp: "Up",
        ArrowRight: "Right",
        ArrowDown: "Down",
        PrintScreen: "PrintScreen",
        Insert: "Insert",
        Delete: "Delete",
        Digit0: "0",
        Digit1: "1",
        Digit2: "2",
        Digit3: "3",
        Digit4: "4",
        Digit5: "5",
        Digit6: "6",
        Digit7: "7",
        Digit8: "8",
        Digit9: "9",
        KeyA: "A",
        KeyB: "B",
        KeyC: "C",
        KeyD: "D",
        KeyE: "E",
        KeyF: "F",
        KeyG: "G",
        KeyH: "H",
        KeyI: "I",
        KeyJ: "J",
        KeyK: "K",
        KeyL: "L",
        KeyM: "M",
        KeyN: "N",
        KeyO: "O",
        KeyP: "P",
        KeyQ: "Q",
        KeyR: "R",
        KeyS: "S",
        KeyT: "T",
        KeyU: "U",
        KeyV: "V",
        KeyW: "W",
        KeyX: "X",
        KeyY: "Y",
        KeyZ: "Z",
        F1: "F1",
        F2: "F2",
        F3: "F3",
        F4: "F4",
        F5: "F5",
        F6: "F6",
        F7: "F7",
        F8: "F8",
        F9: "F9",
        F10: "F10",
        F11: "F11",
        F12: "F12",
        Semicolon: ";",
        Equal: "=",
        Comma: ",",
        Minus: "-",
        Period: ".",
        Slash: "/",
        Backquote: "`",
        BracketLeft: "[",
        Backslash: "\\",
        BracketRight: "]",
        Quote: "'"
    };
    function fe() {
        return {
            goSetting: ()=>{
                this.autoLoadPlugin("FFFFFFFF", "settings", "偏好设置")
            }
            ,
            goAccountDb: ()=>{
                this.autoLoadPlugin("FFFFFFFF", "accountdb", "帐号与数据")
            }
            ,
            goPluginManage: ()=>{
                this.autoLoadPlugin("FFFFFFFF", "installed", "我的插件应用")
            }
            ,
            goPluginStore: e=>{
                this.autoLoadPlugin("FFFFFFFF", "store", "插件应用市场", "&" + e)
            }
            ,
            goInstalledPluginInfo: e=>{
                this.autoLoadPlugin("FFFFFFFF", "installed", "我的插件应用", "/" + e)
            }
        }
    }
    const ye = {
        windowMethods: ["destroy", "close", "focus", "blur", "isFocused", "isDestroyed", "show", "showInactive", "hide", "isVisible", "maximize", "unmaximize", "isMaximized", "minimize", "restore", "isMinimized", "setFullScreen", "isFullScreen", "setSimpleFullScreen", "isSimpleFullScreen", "isNormal", "setAspectRatio", "setBackgroundColor", "previewFile", "closeFilePreview", "setBounds", "getBounds", "getBackgroundColor", "setContentBounds", "getContentBounds", "getNormalBounds", "setEnabled", "isEnabled", "setSize", "getSize", "setContentSize", "getContentSize", "setMinimumSize", "getMinimumSize", "setMaximumSize", "getMaximumSize", "setResizable", "isResizable", "setMovable", "isMovable", "setMinimizable", "isMinimizable", "setMaximizable", "isMaximizable", "setFullScreenable", "isFullScreenable", "setClosable", "isClosable", "setAlwaysOnTop", "isAlwaysOnTop", "moveAbove", "moveTop", "center", "setPosition", "getPosition", "setTitle", "getTitle", "setSheetOffset", "flashFrame", "setSkipTaskbar", "setKiosk", "isKiosk", "isTabletMode", "getMediaSourceId", "getNativeWindowHandle", "setRepresentedFilename", "getRepresentedFilename", "setDocumentEdited", "isDocumentEdited", "focusOnWebView", "blurWebView", "setProgressBar", "setHasShadow", "hasShadow", "setOpacity", "getOpacity", "setShape", "showDefinitionForSelection", "setIcon", "setWindowButtonVisibility", "setVisibleOnAllWorkspaces", "isVisibleOnAllWorkspaces", "setIgnoreMouseEvents", "setContentProtection", "setFocusable", "setAutoHideCursor", "setVibrancy", "setTrafficLightPosition", "getTrafficLightPosition"],
        windowInvokes: ["capturePage"],
        webContentsMethods: ["isDestroyed", "focus", "isFocused", "isLoading", "isLoadingMainFrame", "isWaitingForResponse", "isCrashed", "setUserAgent", "getUserAgent", "setIgnoreMenuShortcuts", "setAudioMuted", "isAudioMuted", "isCurrentlyAudible", "setZoomFactor", "getZoomFactor", "setZoomLevel", "getZoomLevel", "undo", "redo", "cut", "copy", "copyImageAt", "paste", "pasteAndMatchStyle", "delete", "selectAll", "unselect", "replace", "replaceMisspelling", "findInPage", "stopFindInPage", "isBeingCaptured", "incrementCapturerCount", "decrementCapturerCount", "getPrinters", "openDevTools", "closeDevTools", "isDevToolsOpened", "isDevToolsFocused", "toggleDevTools", "send", "sendToFrame", "enableDeviceEmulation", "disableDeviceEmulation", "sendInputEvent", "showDefinitionForSelection", "isOffscreen", "startPainting", "stopPainting", "isPainting", "setFrameRate", "getFrameRate", "invalidate", "getWebRTCIPHandlingPolicy", "setWebRTCIPHandlingPolicy", "getOSProcessId", "getProcessId", "getBackgroundThrottling", "setBackgroundThrottling"],
        webContentsInvokes: ["insertCSS", "removeInsertedCSS", "executeJavaScript", "executeJavaScriptInIsolatedWorld", "setVisualZoomLevelLimits", "insertText", "capturePage", "print", "printToPDF", "savePage", "takeHeapSnapshot"]
    };
    function be(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    const Ce = {}
      , ve = require("pouchdb");
    var We = e.n(ve);
    function Se(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class Pe extends (ce()) {
        constructor(e, t, i, n, o) {
            super(),
            Se(this, "ffffffffServices", {
                getRemoteDbDocCount: this.getRemoteDbDocCount.bind(this),
                getDbStatistics: this.dbStatistics.bind(this),
                clearDbPluginData: this.clearPluginData.bind(this),
                getDbDoc: this.get.bind(this),
                getDbInfoDocCount: this.dbInfoDocCount.bind(this)
            }),
            Se(this, "pluginApiServices", {
                dbPut: async(e,t,i)=>{
                    e.returnValue = await this.put(t, i, !0)
                }
                ,
                dbGet: async(e,t,i)=>{
                    e.returnValue = await this.get(t, i)
                }
                ,
                dbRemove: async(e,t,i)=>{
                    e.returnValue = await this.remove(t, i)
                }
                ,
                dbBulkDocs: async(e,t,i)=>{
                    e.returnValue = await this.bulkDocs(t, i)
                }
                ,
                dbAllDocs: async(e,t,i)=>{
                    e.returnValue = await this.allDocs(t, i)
                }
                ,
                dbPostAttachment: async(e,t,i)=>{
                    const {docId: n, attachment: o, type: s} = i;
                    e.returnValue = await this.postAttachment(t, n, o, s)
                }
                ,
                dbGetAttachment: async(e,t,i)=>{
                    e.returnValue = await this.getAttachment(t, i, "0")
                }
                ,
                dbGetAttachmentType: async(e,t,i)=>{
                    const n = await this.get(t, i);
                    if (!n || !n._attachments)
                        return void (e.returnValue = null);
                    const o = n._attachments[0];
                    e.returnValue = o ? o.content_type : null
                }
                ,
                dbReplicateStateFromCloud: e=>{
                    e.returnValue = this.dbReplicateStateFromCloud()
                }
                ,
                dbPromisePut: (e,t)=>this.put(e, t, !0),
                dbPromiseGet: (e,t)=>this.get(e, t),
                dbPromiseRemove: (e,t)=>this.remove(e, t),
                dbPromiseBulkDocs: (e,t)=>this.bulkDocs(e, t),
                dbPromiseAllDocs: (e,t)=>this.allDocs(e, t),
                dbPromisePostAttachment: (e,t)=>{
                    const {docId: i, attachment: n, type: o} = t;
                    return this.postAttachment(e, i, n, o)
                }
                ,
                dbPromiseGetAttachment: (e,t)=>this.getAttachment(e, t, "0"),
                dbPromiseGetAttachmentType: async(e,t)=>{
                    const i = await this.get(e, t);
                    if (!i || !i._attachments)
                        return null;
                    const n = i._attachments[0];
                    return n ? n.content_type : null
                }
                ,
                dbPromiseReplicateStateFromCloud: async()=>this.dbReplicateStateFromCloud()
            }),
            this.docMaxByteLength = 1048576,
            this.docAttachmentMaxByteLength = 10485760,
            this.dbpath = e,
            this.defaultDbName = l().join(e, "default"),
            this.config = t,
            this.windowCmp = i,
            this.accountCmp = n,
            this.reportCmp = o,
            this.windowCmp.getDbAttachment = this.getAttachment.bind(this)
        }
        init() {
            let e;
            u().existsSync(this.dbpath) || u().mkdirSync(this.dbpath);
            const t = this.accountCmp.getAccountInfo();
            e = t ? l().join(this.dbpath, t.uid) : this.defaultDbName,
            this.pouchDB = new (We())(e,{
                auto_compaction: !0
            }),
            this.listenAccountEvent(),
            this.listenPowerMonitorEvent()
        }
        getDocId(e, t) {
            return e + "/" + t
        }
        replaceDocId(e, t) {
            return t.replace(e + "/", "")
        }
        errorInfo(e, t) {
            return {
                error: !0,
                name: e,
                message: t
            }
        }
        checkDocSize(e) {
            return e._attachments ? this.errorInfo("exception", '"_attachments" is not supported') : Buffer.byteLength(JSON.stringify(e)) > this.docMaxByteLength ? this.errorInfo("exception", "doc max size " + this.docMaxByteLength / 1024 / 1024 + "M") : void 0
        }
        async put(e, t, i=!0) {
            if ("object" != typeof t)
                return this.errorInfo("exception", 'params "doc" not object type');
            if (!t._id || "string" != typeof t._id)
                return this.errorInfo("exception", '"_id" empty');
            if (/[\u{fff0}-\u{10ffff}]/u.test(t._id))
                return this.errorInfo("exception", '"_id" contain unicode chars max value is U+FFF0');
            if (t._id.length > 256)
                return this.errorInfo("exception", '"_id" max length 256');
            if (i) {
                const e = this.checkDocSize(t);
                if (e)
                    return e
            }
            t._id = this.getDocId(e, t._id);
            try {
                const i = await this.pouchDB.put(t);
                return t._id = i.id = this.replaceDocId(e, i.id),
                i
            } catch (i) {
                return t._id = this.replaceDocId(e, t._id),
                {
                    id: t._id,
                    name: i.name,
                    error: !0,
                    message: i.message
                }
            }
        }
        async get(e, t) {
            try {
                const i = await this.pouchDB.get(this.getDocId(e, t));
                return i._id = this.replaceDocId(e, i._id),
                i
            } catch (e) {
                return null
            }
        }
        async remove(e, t) {
            try {
                let i = null;
                if ("object" == typeof t) {
                    if (i = t,
                    !i._id || "string" != typeof i._id)
                        return this.errorInfo("exception", "doc _id error");
                    i._id = this.getDocId(e, i._id)
                } else {
                    if ("string" != typeof t)
                        return this.errorInfo("exception", "param error");
                    i = await this.pouchDB.get(this.getDocId(e, t))
                }
                const n = await this.pouchDB.remove(i);
                return i._id = n.id = this.replaceDocId(e, n.id),
                n
            } catch (i) {
                return "object" == typeof t && (t._id = this.replaceDocId(e, t._id)),
                this.errorInfo(i.name, i.message)
            }
        }
        async bulkDocs(e, t) {
            let i = null;
            try {
                if (!Array.isArray(t))
                    return this.errorInfo("exception", "not array");
                if (t.find((e=>!e._id)))
                    return this.errorInfo("exception", "doc not _id field");
                if (new Set(t.map((e=>e._id))).size !== t.length)
                    return this.errorInfo("exception", "_id value exists as");
                for (const i of t) {
                    const t = this.checkDocSize(i);
                    if (t)
                        return t;
                    i._id = this.getDocId(e, i._id)
                }
                i = await this.pouchDB.bulkDocs(t),
                i = i.map((t=>(t.id = this.replaceDocId(e, t.id),
                t.error ? {
                    id: t.id,
                    name: t.name,
                    error: !0,
                    message: t.message
                } : t))),
                t.forEach((t=>{
                    t._id = this.replaceDocId(e, t._id)
                }
                ))
            } catch (e) {}
            return i
        }
        async allDocs(e, t) {
            const i = {
                include_docs: !0
            };
            if (t)
                if ("string" == typeof t)
                    i.startkey = this.getDocId(e, t),
                    i.endkey = i.startkey + "￰";
                else {
                    if (!Array.isArray(t))
                        return this.errorInfo("exception", "param only key(string) or keys(Array[string])");
                    i.keys = t.map((t=>this.getDocId(e, t)))
                }
            else
                i.startkey = this.getDocId(e, ""),
                i.endkey = i.startkey + "￰";
            const n = [];
            try {
                (await this.pouchDB.allDocs(i)).rows.forEach((t=>{
                    !t.error && t.doc && (t.doc._id = this.replaceDocId(e, t.doc._id),
                    n.push(t.doc))
                }
                ))
            } catch (e) {}
            return n
        }
        async postAttachment(e, t, i, n) {
            if ("string" != typeof n)
                return this.errorInfo("exception", 'params "type" error');
            if (!(n = n.trim()) || n.length > 60)
                return this.errorInfo("exception", 'params "type" error');
            if (!(i instanceof Uint8Array))
                return this.errorInfo("exception", "attachment data only be buffer type (Uint8Array)");
            const o = Buffer.from(i);
            if (o.byteLength > this.docAttachmentMaxByteLength)
                return this.errorInfo("exception", "attachment data up to " + this.docAttachmentMaxByteLength / 1024 / 1024 + "M");
            try {
                const i = await this.pouchDB.put({
                    _id: this.getDocId(e, t),
                    _attachments: {
                        0: {
                            data: o,
                            content_type: n
                        }
                    }
                });
                return i.id = this.replaceDocId(e, i.id),
                i
            } catch (e) {
                return this.errorInfo(e.name, e.message)
            }
        }
        async getAttachment(e, t, i="0") {
            try {
                return await this.pouchDB.getAttachment(this.getDocId(e, t), i)
            } catch (e) {
                return null
            }
        }
        async removeAttachment(e, t, i, n) {
            if (!t || !i || !n || "string" != typeof t || "string" != typeof i || "string" != typeof n)
                return this.errorInfo("exception", "params error");
            t = this.getDocId(e, t);
            try {
                const o = await this.pouchDB.removeAttachment(t, i, n);
                return o.id = this.replaceDocId(e, o.id),
                o
            } catch (e) {
                return this.errorInfo(e.name, e.message)
            }
        }
        async dbStatistics() {
            const e = await this.pouchDB.allDocs()
              , t = {};
            return e.rows.forEach((e=>{
                let i, n;
                if (e.id.startsWith("//"))
                    if (e.id.startsWith("//feature/")) {
                        const t = e.id.substr(10)
                          , o = t.indexOf("/");
                        if (-1 === o)
                            return;
                        i = t.substr(0, o),
                        n = "￰" + e.id.substr(2)
                    } else
                        n = e.id.substr(2),
                        i = "/";
                else {
                    const t = e.id.indexOf("/");
                    if (-1 === t)
                        return;
                    i = e.id.substr(0, t),
                    n = e.id.substr(t + 1)
                }
                i in t ? t[i].push(n) : t[i] = [n]
            }
            )),
            t
        }
        async clearPluginData(e, t) {
            if (!e || "string" != typeof e || e.length < 3 || !Array.isArray(t))
                return;
            if ((t = t.filter((e=>!e.startsWith("￰")))).length > 0) {
                const i = {
                    keys: t.map((t=>this.getDocId(e, t)))
                }
                  , n = await this.pouchDB.allDocs(i);
                for (let e = 0; e < n.rows.length; e++) {
                    const t = n.rows[e];
                    try {
                        await this.pouchDB.remove(t.id, t.value.rev)
                    } catch (e) {}
                }
            }
            const i = await this.pouchDB.allDocs({
                startkey: e + "/",
                endkey: e + "/￰"
            });
            if (i.rows.length > 0)
                for (let e = 0; e < i.rows.length; e++) {
                    const t = i.rows[e];
                    try {
                        await this.pouchDB.remove(t.id, t.value.rev)
                    } catch (e) {}
                }
            const n = {
                include_docs: !0
            };
            n.startkey = "//feature/" + e + "/",
            n.endkey = n.startkey + "￰";
            const o = await this.pouchDB.allDocs(n);
            if (0 !== o.rows.length) {
                for (let t = 0; t < o.rows.length; t++) {
                    const i = o.rows[t];
                    try {
                        await this.pouchDB.remove(i.id, i.value.rev)
                    } catch (e) {
                        continue
                    }
                    this.windowCmp.pluginsCmp.removeFeature(e, i.doc.code)
                }
                this.windowCmp.destroyPlugin(e),
                this.windowCmp.refreshCmdSource()
            }
        }
        getRemoteDbDocCount() {
            return new Promise(((e,i)=>{
                const n = this.accountCmp.getAccountInfo();
                if (!n || 1 !== n.db_sync)
                    return e(null);
                const o = this.config.sync.protocol + "://" + this.config.sync.host + (this.config.sync.port ? ":" + this.config.sync.port : "") + "/db_" + n.uid
                  , s = t.net.request({
                    url: o
                });
                s.setHeader("Authorization", "Basic " + Buffer.from(n.uid + ":" + n.db_secrect_key).toString("base64")),
                s.on("response", (t=>{
                    const n = [];
                    t.on("data", (e=>{
                        n.push(e)
                    }
                    )),
                    t.on("end", (()=>{
                        let t = null;
                        try {
                            t = JSON.parse(Buffer.concat(n).toString())
                        } catch (e) {
                            return i(e)
                        }
                        if (t.error)
                            return i(new Error(t.error));
                        "number" == typeof t.doc_count ? e(t.doc_count) : i(new Error("no doc_count"))
                    }
                    )),
                    t.on("error", (e=>{
                        i(e)
                    }
                    ))
                }
                )),
                s.on("error", (e=>{
                    i(e)
                }
                )),
                s.end()
            }
            ))
        }
        async dbInfoDocCount() {
            return (await this.pouchDB.info()).doc_count
        }
        cancelDbSync() {
            this._replicateUnChangeTimeout && (clearTimeout(this._replicateUnChangeTimeout),
            this._replicateUnChangeTimeout = null),
            this._retryDbSyncTimeout && (clearTimeout(this._retryDbSyncTimeout),
            this._retryDbSyncTimeout = null),
            this.pouchDBSync && (this.pouchDBSync.cancel(),
            this.pouchDBSync = null),
            this.pouchDBReplicate && (this.pouchDBReplicate.cancel(),
            this.pouchDBReplicate = null),
            this.pouchDBReplicateCompleted && (this.pouchDBReplicateCompleted = null)
        }
        dbSync(e) {
            if (this.cancelDbSync(),
            this.pouchDB.name !== l().join(this.dbpath, e.uid))
                return void this.reportCmp.info("app.dbsync.error.0");
            if (!e.db_sync || !e.db_secrect_key)
                return;
            this.emit("replicate-start");
            const t = this.config.sync
              , i = t.protocol + "://" + e.uid + ":" + e.db_secrect_key + "@" + t.host + (t.port ? ":" + t.port : "") + "/db_" + e.uid;
            this._replicateUnChangeTimeout = setTimeout((()=>{
                this._replicateUnChangeTimeout = null,
                this.dbSync(e)
            }
            ), 12e4),
            this.pouchDBReplicate = this.pouchDB.replicate.from(i, {
                batch_size: 10
            }).on("change", (e=>{
                this._replicateUnChangeTimeout && (clearTimeout(this._replicateUnChangeTimeout),
                this._replicateUnChangeTimeout = null),
                e.ok && 0 !== e.docs.length && this.pullLogic(e.docs)
            }
            )).on("complete", (()=>{
                this._replicateUnChangeTimeout && (clearTimeout(this._replicateUnChangeTimeout),
                this._replicateUnChangeTimeout = null),
                this.pouchDBReplicateCompleted = !0,
                this.pouchDBSync = this.pouchDB.sync(i, {
                    live: !0,
                    retry: !0,
                    batch_size: 10
                }).on("change", (e=>{
                    "pull" === e.direction && e.change.ok && 0 !== e.change.docs.length && this.pullLogic(e.change.docs)
                }
                )).on("error", (e=>{
                    this.reportCmp.info("app.dbsync.error", {
                        error: e.message
                    })
                }
                )).on("denied", (e=>{
                    this.reportCmp.info("app.dbsync.denied", {
                        error: e.message
                    })
                }
                )),
                this.emit("replicate-complete")
            }
            )).on("error", (t=>{
                if (this._replicateUnChangeTimeout && (clearTimeout(this._replicateUnChangeTimeout),
                this._replicateUnChangeTimeout = null),
                403 !== t.status && (this._retryDbSyncTimeout && clearTimeout(this._retryDbSyncTimeout),
                this._retryDbSyncTimeout = setTimeout((()=>{
                    this._retryDbSyncTimeout = null,
                    this.dbSync(e)
                }
                ), 3e4),
                "FetchError" !== t.name && !t.message.includes("getaddrinfo ENOTFOUND"))) {
                    this._dbreplicateErrors || (this._dbreplicateErrors = []);
                    const e = t.message;
                    if (this._dbreplicateErrors.includes(e))
                        return;
                    this._dbreplicateErrors.push(e),
                    this.reportCmp.info("app.dbreplicate.error", {
                        error: e
                    })
                }
            }
            )).on("denied", (()=>{
                this._replicateUnChangeTimeout && (clearTimeout(this._replicateUnChangeTimeout),
                this._replicateUnChangeTimeout = null)
            }
            ))
        }
        dbReplicateStateFromCloud() {
            return this.pouchDBReplicateCompleted ? 0 : this.pouchDBReplicate ? 1 : null
        }
        pullLogic(e) {
            const t = []
              , i = {};
            e.forEach((e=>{
                if (e._revisions && delete e._revisions.ids,
                e._id.startsWith("//"))
                    e._id = this.replaceDocId("/", e._id),
                    t.push(e);
                else if (/^(\w{2,32})\//.test(e._id)) {
                    const t = RegExp.$1;
                    e._id = this.replaceDocId(t, e._id),
                    t in i ? i[t].push(e) : i[t] = [e]
                }
            }
            )),
            t.length > 0 && this.emit("pull", t),
            Object.keys(i).length > 0 && this.windowCmp.pluginDatabasePullEvent(i)
        }
        listenAccountEvent() {
            this.accountCmp.on("login", (e=>{
                const t = l().join(this.dbpath, e.uid)
                  , i = this.pouchDB.name;
                if (i === t)
                    return void (e.db_sync && this.dbSync(e));
                const n = this.pouchDB
                  , o = !u().existsSync(t) && i === this.defaultDbName;
                this.pouchDB = new (We())(t,{
                    auto_compaction: !0
                }),
                o ? n.replicate.to(this.pouchDB).then((()=>{
                    n.close(),
                    this.emit("switch"),
                    e.db_sync && this.dbSync(e)
                }
                )).catch((t=>{
                    this.reportCmp.info("app.defaultdb.replicate.error", {
                        error: t.message
                    }),
                    n.close(),
                    this.emit("switch"),
                    e.db_sync && this.dbSync(e)
                }
                )) : (n.close(),
                this.emit("switch"),
                e.db_sync && this.dbSync(e))
            }
            )),
            this.accountCmp.on("logout", (()=>{
                this.cancelDbSync();
                const e = this.pouchDB;
                this.pouchDB = new (We())(this.defaultDbName,{
                    auto_compaction: !0
                }),
                e.close(),
                this.emit("switch")
            }
            )),
            this.accountCmp.on("dbsync", (e=>{
                this.dbSync(e)
            }
            )),
            this.accountCmp.on("undbsync", (()=>{
                this.cancelDbSync()
            }
            ))
        }
        listenPowerMonitorEvent() {
            t.powerMonitor.on("resume", (()=>{
                this.pouchDBSync && (this.cancelDbSync(),
                setImmediate((()=>{
                    const e = this.accountCmp.getAccountInfo();
                    e && e.db_sync && this.dbSync(e)
                }
                )))
            }
            ))
        }
    }
    class xe {
        init() {
            const e = r().macOS()
              , i = [...e ? [{
                label: t.app.name,
                submenu: [{
                    role: "about",
                    label: "关于 " + t.app.name
                }, {
                    type: "separator"
                }, {
                    role: "services",
                    label: "服务"
                }, {
                    type: "separator"
                }, {
                    role: "hide",
                    label: "隐藏"
                }, {
                    role: "hideOthers",
                    label: "隐藏其他应用"
                }, {
                    role: "unhide",
                    label: "显示全部"
                }, {
                    type: "separator"
                }, {
                    role: "quit",
                    label: "退出 " + t.app.name
                }]
            }] : [], {
                label: "编辑",
                submenu: [{
                    role: "undo",
                    label: "撤销"
                }, {
                    role: "redo",
                    label: "重做"
                }, {
                    type: "separator"
                }, {
                    role: "cut",
                    label: "剪切"
                }, {
                    role: "copy",
                    label: "复制"
                }, {
                    role: "paste",
                    label: "粘贴"
                }, ...e ? [{
                    role: "pasteAndMatchStyle",
                    label: "粘贴并匹配样式"
                }, {
                    role: "delete",
                    label: "删除"
                }, {
                    role: "selectAll",
                    label: "全选"
                }] : [{
                    role: "delete"
                }, {
                    type: "separator"
                }, {
                    role: "selectAll"
                }]]
            }, {
                label: "窗口",
                submenu: [{
                    role: "minimize",
                    label: "最小化"
                }, {
                    role: "zoom",
                    label: "缩放"
                }, ...e ? [{
                    type: "separator"
                }, {
                    role: "front",
                    label: "前置全部窗口"
                }] : [{
                    role: "close"
                }]]
            }];
            t.Menu.setApplicationMenu(t.Menu.buildFromTemplate(i))
        }
    }
    const ke = require("electron-updater");
    class De {
        constructor(e, i, n, o) {
            var s, r;
            r = ()=>{
                new Promise(((e,i)=>{
                    const n = t.net.request(this.config.newestVersionURL);
                    n.on("response", (i=>{
                        if (200 !== i.statusCode)
                            return e(!1);
                        i.on("data", (i=>{
                            let n;
                            try {
                                n = JSON.parse(i.toString())
                            } catch (t) {
                                return e(!1)
                            }
                            const o = n[process.platform]?.[process.arch];
                            if (!o)
                                return e(!1);
                            U().gt(o, t.app.getVersion()) ? e({
                                downloadUrl: n.downloadUrl,
                                newestVersion: o
                            }) : e(!1)
                        }
                        ))
                    }
                    )),
                    n.on("error", i),
                    n.end()
                }
                )).then((e=>{
                    if (e)
                        return t.shell.openExternal(e.downloadUrl),
                        void new t.Notification({
                            title: "uTools 更新检测",
                            body: "发现最新版本 v" + e.newestVersion
                        }).show();
                    new t.Notification({
                        title: "uTools 更新检测",
                        body: "当前版本为最新版本！"
                    }).show()
                }
                )).catch((()=>{
                    new t.Notification({
                        title: "uTools 更新检测",
                        body: "网络错误，更新检测失败！"
                    }).show()
                }
                ))
            }
            ,
            (s = "checkNewestVersion")in this ? Object.defineProperty(this, s, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : this[s] = r,
            this.config = e,
            this.windowCmp = i,
            this.accountCmp = n,
            this.helpbootCmp = o
        }
        init() {
            let e = t.app.getVersion();
            const i = e.split("-");
            i.length > 2 && (e = i[0] + "-" + i[1]);
            let n = "";
            r().macOS() ? n = "res/iconTemplate@2x.png" : r().windows() ? n = parseInt(S().release()) < 10 ? "res/icon.png" : "res/icon.ico" : r().linux() && (n = "res/icon@2x.png"),
            this.tray = new t.Tray(l().join(__dirname, n));
            const o = [{
                label: "uTools 官网",
                click: ()=>{
                    process.nextTick((()=>{
                        t.shell.openExternal("https://u.tools")
                    }
                    ))
                }
            }, {
                label: "猿料社区",
                click: ()=>{
                    process.nextTick((()=>{
                        t.shell.openExternal(this.config.feedbackURL)
                    }
                    ))
                }
            }, {
                type: "separator"
            }, {
                label: "隐私政策",
                click: ()=>{
                    process.nextTick((()=>{
                        t.shell.openExternal(this.config.redirectURL + "terms_privacy")
                    }
                    ))
                }
            }, {
                label: "用户协议",
                click: ()=>{
                    process.nextTick((()=>{
                        t.shell.openExternal(this.config.redirectURL + "terms_user")
                    }
                    ))
                }
            }, {
                type: "separator"
            }, {
                label: "uTools 介绍/演示",
                click: ()=>{
                    process.nextTick((()=>{
                        this.helpbootCmp.help()
                    }
                    ))
                }
            }, {
                label: "版本 (V" + e + ")",
                click: ()=>{
                    process.nextTick((()=>{
                        this.helpbootCmp.help(e)
                    }
                    ))
                }
            }, {
                label: "检测更新",
                click: ()=>{
                    process.nextTick((()=>{
                        this.checkForUpdate()
                    }
                    ))
                }
            }, {
                type: "separator"
            }, {
                label: "偏好设置",
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.ffffffff.goSetting()
                    }
                    ))
                }
            }, {
                label: "显示/隐藏",
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.display.trigger()
                    }
                    ))
                }
            }, {
                type: "separator"
            }, {
                label: "重启",
                click: ()=>{
                    process.nextTick((()=>{
                        t.app.relaunch(),
                        t.app.emit("exit")
                    }
                    ))
                }
            }, {
                label: "退出",
                click: ()=>{
                    process.nextTick((()=>{
                        t.app.emit("exit")
                    }
                    ))
                }
            }];
            this.tray.setContextMenu(t.Menu.buildFromTemplate(o)),
            r().windows() && this.tray.on("click", (()=>{
                this.windowCmp.display.trigger()
            }
            ))
        }
        checkForUpdate() {
            if (r().dev())
                return void new t.Notification({
                    title: "uTools 更新检测",
                    body: "当前版本为开发版未开启检测"
                }).show();
            if (r().linux())
                return this.checkNewestVersion();
            if (ke.autoUpdater.listenerCount("update-available") > 0 || ke.autoUpdater.listenerCount("update-not-available") > 0)
                return;
            const e = ()=>{
                ke.autoUpdater.removeListener("update-available", e),
                new t.Notification({
                    title: "uTools 更新检测",
                    body: "已检测到新版本，已在后台自动下载"
                }).show()
            }
              , i = ()=>{
                ke.autoUpdater.removeListener("update-not-available", i),
                this.checkNewestVersion()
            }
            ;
            ke.autoUpdater.addListener("update-available", e),
            ke.autoUpdater.addListener("update-not-available", i),
            setTimeout((function() {
                ke.autoUpdater.removeListener("update-available", e),
                ke.autoUpdater.removeListener("update-not-available", i)
            }
            ), 1e4),
            ke.autoUpdater.checkForUpdates()
        }
    }
    function _e(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    const Ie = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300];
    class Te {
        constructor(e) {
            _e(this, "mainServices", {
                showPluginMenu: ()=>{
                    this.mainWindowShowPluginMenu()
                }
            }),
            _e(this, "detachServices", {
                buildDetachPluginOptionMenu: (e,t,i)=>{
                    this.buildDetachPluginOptionMenu(t, i)
                }
                ,
                buildDetachPluginViewZoomMenu: (e,t,i)=>{
                    this.buildDetachPluginViewZoomMenu(t, i)
                }
                ,
                showPluginInfo: (e,t,i)=>{
                    this.windowCmp.ffffffff.goInstalledPluginInfo(t)
                }
            }),
            this.windowCmp = e.windowCmp,
            this.appCmp = e
        }
        getDetachHotKey() {
            return this.windowCmp.isMacOs ? this.windowCmp.pluginDetachHotKey.replace("Alt+", "Option+") : this.windowCmp.pluginDetachHotKey.replace("Control+", "Ctrl+").replace("Super+", "Windows+")
        }
        init() {
            this.initPluginMenu()
        }
        initPluginMenu() {
            const e = this.getDetachHotKey()
              , i = [{
                id: "detach@" + e,
                label: "分离窗口",
                icon: l().join(__dirname, "res", "menu", "split@2x.png"),
                accelerator: e,
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.detachPlugin()
                    }
                    ))
                }
            }, {
                id: "openDevTools",
                label: "开发者工具",
                icon: l().join(__dirname, "res", "menu", "tool@2x.png"),
                visible: !!1,
                accelerator: this.windowCmp.isMacOs ? "Command+Alt+I" : "Ctrl+Shift+I",
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.openPluginDevTools()
                    }
                    ))
                }
            }, {
                type: "separator"
            }, {
                id: "plugininfo",
                label: "关于插件应用",
                icon: l().join(__dirname, "res", "menu", "info@2x.png"),
                click: ()=>{
                    process.nextTick((()=>{
                        const e = this.windowCmp.getCurrentPluginId();
                        e && this.windowCmp.ffffffff.goInstalledPluginInfo(e)
                    }
                    ))
                }
            }, {
                label: "插件应用设置",
                icon: l().join(__dirname, "res", "menu", "setting@2x.png"),
                submenu: [{
                    id: "enterdetach",
                    label: "开启自动分离窗口",
                    type: "checkbox",
                    click: e=>{
                        const t = this.windowCmp.mainWindow.getBrowserView();
                        if (!t)
                            return;
                        const i = this.windowCmp.getPluginIdByWebContents(t.webContents);
                        i && (e.checked ? this.appCmp.addEnterDetachPlugin(i) : this.appCmp.removeEnterDetachPlugin(i))
                    }
                }, {
                    id: "outkill",
                    label: "隐藏后台时完全退出",
                    type: "checkbox",
                    click: e=>{
                        const t = this.windowCmp.mainWindow.getBrowserView();
                        if (!t)
                            return;
                        const i = this.windowCmp.getPluginIdByWebContents(t.webContents);
                        i && (e.checked ? this.appCmp.addOutKillPlugin(i) : this.appCmp.removeOutKillPlugin(i))
                    }
                }, {
                    id: "runatappopen",
                    label: "跟随主程序同时启动",
                    type: "checkbox",
                    click: e=>{
                        const t = this.windowCmp.mainWindow.getBrowserView();
                        if (!t)
                            return;
                        const i = this.windowCmp.getPluginIdByWebContents(t.webContents);
                        i && (e.checked ? this.appCmp.addPluginRunAtAppOpen(i) : this.appCmp.removePluginRunAtAppOpen(i))
                    }
                }, {
                    id: "remove",
                    label: "删除插件",
                    icon: l().join(__dirname, "res", "menu", "close@2x.png"),
                    click: ()=>{
                        process.nextTick((()=>{
                            const t = this.windowCmp.getCurrentPluginId();
                            this.windowCmp.pluginsCmp.unmount(t);
                            this.windowCmp.destroyPlugin(t);
                            this.windowCmp.refreshCmdSource();
                        }))
                    }
                  }
                ]
            }, {
                type: "separator"
            }, {
                id: "out",
                label: "隐藏后台",
                icon: l().join(__dirname, "res", "menu", "leftup@2x.png"),
                accelerator: "Esc",
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.outPlugin()
                    }
                    ))
                }
            }, {
                id: "kill",
                label: "完全退出",
                icon: l().join(__dirname, "res", "menu", "close@2x.png"),
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.endPlugin()
                    }
                    ))
                }
             }
            ];
            this._mainPluginMenu = t.Menu.buildFromTemplate(i)
        }
        async mainWindowShowPluginMenu() {
            const e = this.windowCmp.mainWindow.getBrowserView();
            if (!e)
                return;
            const i = this.windowCmp.getPluginIdByWebContents(e.webContents);
            if (!i)
                return;
            const n = this.windowCmp.pluginsCmp.pluginContainer[i];
            if (!n)
                return;
            const o = this.appCmp.pluginIsOutKill(i);
            this._mainPluginMenu.getMenuItemById("remove").visible = "FFFFFFFF" !== i,
            this._mainPluginMenu.getMenuItemById("openDevTools").visible = !!n.isDev,
            this._mainPluginMenu.getMenuItemById("outkill").checked = o,
            this._mainPluginMenu.getMenuItemById("out").visible = !o,
            this._mainPluginMenu.getMenuItemById("enterdetach").checked = this.appCmp.pluginIsEnterDetach(i),
            this._mainPluginMenu.getMenuItemById("plugininfo").visible = true || !n.isDev && "FFFFFFFF" !== i;
            const s = this._mainPluginMenu.getMenuItemById("runatappopen");
            o ? s.enabled = !1 : (s.enabled = !0,
            s.checked = await this.appCmp.getIsPluginRunAtAppOpen(i));
            const r = this.getDetachHotKey()
              , a = this._mainPluginMenu.getMenuItemById("detach@" + r);
            a ? a.visible || (this._mainPluginMenu.items.filter((e=>e.id && e.id.startsWith("detach@") && e.id !== r)).forEach((e=>{
                e.visible = !1
            }
            )),
            a.visible = !0) : (this._mainPluginMenu.items.filter((e=>e.id && e.id.startsWith("detach@"))).forEach((e=>{
                e.visible = !1
            }
            )),
            this._mainPluginMenu.insert(0, new t.MenuItem({
                id: "detach@" + r,
                label: "分离窗口",
                icon: l().join(__dirname, "res", "menu", "windows@2x.png"),
                accelerator: r,
                click: ()=>{
                    process.nextTick((()=>{
                        this.windowCmp.detachPlugin()
                    }
                    ))
                }
            })));
            const c = this.windowCmp.mainWindow.getSize()[0] - this.windowCmp.config.initHeight
              , d = this.windowCmp.isMacOs ? this.windowCmp.config.initHeight + 5 : this.windowCmp.config.initHeight;
            this._mainPluginMenu.popup({
                window: this.windowCmp.mainWindow,
                x: c,
                y: d,
                callback: ()=>{
                    e.webContents && !e.webContents.isDestroyed() && e.webContents.focus()
                }
            })
        }
        async buildDetachPluginOptionMenu(e, i) {
            const n = this.appCmp.pluginIsOutKill(e);
            let o;
            o = !n && await this.appCmp.getIsPluginRunAtAppOpen(e);
            let s = t.Menu.buildFromTemplate([{
                label: "开启自动分离窗口",
                type: "checkbox",
                checked: this.appCmp.pluginIsEnterDetach(e),
                click: t=>{
                    t.checked ? this.appCmp.addEnterDetachPlugin(e) : this.appCmp.removeEnterDetachPlugin(e)
                }
            }, {
                label: "隐藏后台时完全退出",
                type: "checkbox",
                checked: n,
                click: t=>{
                    t.checked ? this.appCmp.addOutKillPlugin(e) : this.appCmp.removeOutKillPlugin(e)
                }
            }, {
                label: "跟随主程序同时启动",
                type: "checkbox",
                enabled: !n,
                checked: o,
                click: t=>{
                    t.checked ? this.appCmp.addPluginRunAtAppOpen(e) : this.appCmp.removePluginRunAtAppOpen(e)
                }
            }]);
            if (this.windowCmp.isMacOs)
                return s.popup({
                    window: i,
                    x: i.getSize()[0] - 84,
                    y: 56,
                    callback: ()=>{
                        s = null
                    }
                });
            s.popup({
                window: i,
                x: i.getSize()[0] - 220,
                y: 48,
                callback: ()=>{
                    s = null
                }
            })
        }
        buildDetachPluginViewZoomMenu(e, i) {
            const n = i.getBrowserView();
            if (!n)
                return;
            const o = e=>{
                const t = parseInt(e.label.replace("%", ""));
                n.webContents.setZoomFactor(t / 100),
                i.webContents.executeJavaScript("window.api.localStorageZoomFactor(" + t + ")")
            }
              , s = parseInt(100 * n.webContents.getZoomFactor());
            let r = t.Menu.buildFromTemplate(Ie.map((e=>({
                label: e + "%",
                type: "radio",
                checked: s === e,
                click: o
            }))));
            if (this.windowCmp.isMacOs)
                return r.popup({
                    window: i,
                    x: i.getSize()[0] - 126,
                    y: 56,
                    callback: ()=>{
                        r = null
                    }
                });
            r.popup({
                window: i,
                x: i.getSize()[0] - 262,
                y: 48,
                callback: ()=>{
                    r = null
                }
            })
        }
    }
    function Fe(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    const Me = new class {
        isFKey(e) {
            return e.startsWith("Double") || /^F([1-9]|1[0-2])$/.test(e)
        }
        _getKey(e) {
            if (e.startsWith("Double")) {
                const t = e.replace("Double", "").toLowerCase();
                if ("darwin" === process.platform)
                    return "ctrl" === t ? "control" : "alt" === t ? "option" : t;
                if ("control" === t)
                    return "ctrl";
                if ("option" === t)
                    return "alt";
                if ("command" === t)
                    return;
                return t
            }
            if (/^F([1-9]|1[0-2])$/.test(e))
                return e.toLowerCase()
        }
        register(e, t) {
            const i = this._getKey(e);
            i && (this.keyAction ? this.keyAction[i] = t : (this.keyAction = {
                [i]: t
            },
            I().fKeyTapEvent((e=>{
                this.keyAction && e in this.keyAction && this.keyAction[e]()
            }
            ))))
        }
        unregister(e) {
            if (!this.keyAction)
                return;
            const t = this._getKey(e);
            t && (delete this.keyAction[t],
            0 === Object.keys(this.keyAction).length && (delete this.keyAction,
            I().stopFKeyTapEvent()))
        }
        isRegistered(e) {
            if (!this.keyAction)
                return !1;
            const t = this._getKey(e);
            return !!t && t in this.keyAction
        }
    }
    ;
    class Ae {
        constructor(e) {
            var i, o;
            o = {
                setOpenAtLogin: (e,t)=>{
                    const i = n().get("openAtLogin")
                      , o = !0 === t;
                    n().set("openAtLogin", o),
                    i !== o && this.setOpenAtLogin(o),
                    e.returnValue = !0
                }
                ,
                setSpaceAsEnter: (e,t)=>{
                    n().set("spaceAsEnter", !0 === t),
                    this.setSpaceAsEnter(!0 === t),
                    e.returnValue = !0
                }
                ,
                setShowHotKey: (e,i)=>{
                    if (i = B(i),
                    Me.isFKey(i) && Me.isRegistered(i))
                        return void (e.returnValue = !1);
                    const o = n().get("showHotKey");
                    o && (Me.isFKey(o) ? Me.unregister(o) : t.globalShortcut.isRegistered(o) && t.globalShortcut.unregister(o)),
                    n().set("showHotKey", i),
                    this.setShowHotKey(i),
                    e.returnValue = !0
                }
                ,
                setPluginDetachHotKey: (e,t)=>{
                    t = B(t),
                    n().set("pluginDetachHotKey", t),
                    this.windowCmp.pluginDetachHotKey = this.getAppPluginHotKey(t),
                    e.returnValue = !0
                }
                ,
                setAutoPasteLife: (e,t)=>{
                    t = parseInt(t, 10),
                    n().set("autoPasteLife", t),
                    this.clipboardCmp.autoPasteLife = t,
                    e.returnValue = !0
                }
                ,
                setPluginOutTimer: (e,t)=>{
                    t = parseInt(t, 10),
                    n().set("pluginOutTimer", t),
                    this.windowCmp.pluginOutTimer = t,
                    e.returnValue = !0
                }
                ,
                getAllSettings: e=>{
                    e.returnValue = n().getAll()
                }
                ,
                setMainPlaceholder: (e,t)=>{
                    "string" == typeof t ? (this._setMainPlaceholderTimeout && clearTimeout(this._setMainPlaceholderTimeout),
                    this._setMainPlaceholderTimeout = setTimeout((()=>{
                        this._setMainPlaceholderTimeout = null,
                        t ? n().set("mainPlaceholder", t) : n().delete("mainPlaceholder"),
                        this.windowCmp.refreshAccountInfo(this.windowCmp.accountCmp.getAccountInfo())
                    }
                    ), 500),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                setTheme: (e,i)=>{
                    ["system", "dark", "light"].includes(i) && t.nativeTheme.themeSource !== i ? (n().set("theme", i),
                    t.nativeTheme.themeSource = i,
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                setMainWindowOpacity: (e,t)=>{
                    if (this.windowCmp.isMacOs || this.windowCmp.isWindow) {
                        if (t < .2 || t > 1)
                            return void (e.returnValue = !0);
                        this.windowCmp.mainWindow.setOpacity(t),
                        this.settingMainWindowOpacityDelayTimer && clearTimeout(this.settingMainWindowOpacityDelayTimer),
                        this.settingMainWindowOpacityDelayTimer = setTimeout((()=>{
                            delete this.settingMainWindowOpacityDelayTimer,
                            n().set("mainWindowOpacity", t)
                        }
                        ), 3e3)
                    }
                    e.returnValue = !0
                }
            },
            (i = "ffffffffServices")in this ? Object.defineProperty(this, i, {
                value: o,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : this[i] = o,
            this.windowCmp = e,
            this.clipboardCmp = e.clipboardCmp
        }
        init() {
            if (n().has("openAtLogin") || n().set("openAtLogin", !0),
            n().has("spaceAsEnter") || n().set("spaceAsEnter", !0),
            n().has("showHotKey") || n().set("showHotKey", "Alt+Space"),
            n().has("pluginDetachHotKey") || (this.windowCmp.isMacOs ? n().set("pluginDetachHotKey", "Command+D") : n().set("pluginDetachHotKey", "Control+D")),
            n().has("autoPasteLife") || n().set("autoPasteLife", 5),
            n().has("pluginOutTimer") || n().set("pluginOutTimer", 3),
            n().has("mainWindowOpacity") || n().set("mainWindowOpacity", 1),
            !this.windowCmp.isLinux) {
                const e = n().get("openAtLogin");
                e !== t.app.getLoginItemSettings().openAtLogin && this.setOpenAtLogin(e)
            }
            this.setSpaceAsEnter(n().get("spaceAsEnter")),
            this.setShowHotKey(n().get("showHotKey")),
            this.windowCmp.pluginDetachHotKey = this.getAppPluginHotKey(n().get("pluginDetachHotKey")),
            this.clipboardCmp.autoPasteLife = parseInt(n().get("autoPasteLife")),
            this.windowCmp.pluginOutTimer = parseInt(n().get("pluginOutTimer"));
            const e = n().get("mainWindowOpacity");
            e >= .2 && e < 1 && this.windowCmp.mainWindow.setOpacity(e)
        }
        setOpenAtLogin(e) {
            t.app.setLoginItemSettings({
                openAtLogin: !0 === e,
                openAsHidden: !0
            })
        }
        setSpaceAsEnter(e) {
            this.windowCmp.mainWindow.webContents.executeJavaScript(`window.spaceAsEnter=${!0 === e}`)
        }
        setShowHotKey(e) {
            if (Me.isFKey(e))
                Me.register(e, (()=>{
                    this.windowCmp.display.trigger()
                }
                ));
            else
                try {
                    t.globalShortcut.register(e, (()=>{
                        setImmediate((()=>{
                            this.windowCmp.display.trigger()
                        }
                        ))
                    }
                    ))
                } catch (e) {}
        }
        getShowHotKey() {
            return n().get("showHotKey")
        }
        getAppPluginHotKey(e) {
            const t = ["Alt", "Shift", "Control", this.windowCmp.isMacOs ? "Command" : "Super"];
            return e.split("+").sort(((e,i)=>t.indexOf(i) - t.indexOf(e))).join("+")
        }
    }
    function Ee(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class Be extends (ce()) {
        constructor(e) {
            super(),
            Ee(this, "pluginApiServices", {
                getUserServerTemporaryToken: (e,t)=>{
                    t.startsWith("dev_") && (t = t.replace("dev_", ""));
                    let i = setTimeout((()=>{
                        i = null,
                        e.returnValue = {
                            error: !0,
                            name: "exception",
                            message: "请求超时"
                        }
                    }
                    ), 2e3);
                    this.getUserServerTemporaryToken(t, ((t,n)=>{
                        i && (clearTimeout(i),
                        e.returnValue = t ? {
                            error: !0,
                            name: "exception",
                            message: t.message
                        } : n ? {
                            ok: !0,
                            ...n
                        } : {
                            error: !0,
                            name: "not login",
                            message: "未登录"
                        })
                    }
                    ))
                }
                ,
                fetchUserServerTemporaryToken: async e=>{
                    e.startsWith("dev_") && (e = e.replace("dev_", ""));
                    const t = this.getAccountToken();
                    if (!t)
                        throw new Error("未登录");
                    return await g(this.config.temporaryToken, {
                        access_token: t,
                        plugin_name: e
                    })
                }
            }),
            Ee(this, "ffffffffServices", {
                getMachineNativeId: e=>{
                    e.returnValue = [this.machineId, this.nativeId]
                }
                ,
                getMachineIdAndSign: e=>{
                    e.returnValue = [this.machineId, this.machineIdSign]
                }
                ,
                getAccountToken: e=>{
                    e.returnValue = this.getAccountToken()
                }
                ,
                getLocalAccount: e=>{
                    const t = this.getAccountInfo();
                    t && (delete t.db_secrect_key,
                    delete t.utools_last_login,
                    t.cellphone && (t.country_code && "86" !== String(t.country_code) ? t.cellphone = "+" + t.country_code + "-" + t.cellphone.replace(/(\d*)\d{4}(\d{3})/, "$1****$2") : t.cellphone = t.cellphone.replace(/(1\d{2})\d{4}(\d{4})/, "$1****$2")),
                    1 === t.type && (t.expiredAtStr = new Date(1e3 * t.expired_at).toLocaleDateString("zh-Hans-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    }).replace(/\//g, "-"),
                    t.isLessMonth = 1e3 * t.expired_at - Date.now() < 2592e6),
                    t.remotedAccountInfoTimestamp = this.remotedAccountInfoTimestamp),
                    e.returnValue = t
                }
                ,
                renewLocalAccount: async()=>{
                    const e = this.getAccountToken();
                    if (e)
                        return await new Promise(((t,i)=>{
                            this.remoteAccountInfo(e, (e=>{
                                if (e)
                                    return i(e);
                                t()
                            }
                            ))
                        }
                        ))
                }
                ,
                setOpenDbSync: async e=>{
                    const t = this.getAccountToken();
                    t && (await g(this.config.dbSyncURL, {
                        access_token: t,
                        sync: e ? "open" : "close"
                    }),
                    await new Promise(((e,i)=>{
                        this.remoteAccountInfo(t, (t=>{
                            if (t)
                                return i(t);
                            e()
                        }
                        ))
                    }
                    )))
                }
                ,
                loginAccount: e=>new Promise(((t,i)=>{
                    this.remoteAccountInfo(e, ((e,n)=>{
                        if (e)
                            return i(e);
                        this.emit("login", n),
                        this.loopRemoteAccountInfoTimer && clearTimeout(this.loopRemoteAccountInfoTimer),
                        this.loopRemoteAccountInfo(),
                        t()
                    }
                    ))
                }
                )),
                logout: (e,t)=>{
                    this.logout(t),
                    e.returnValue = !0
                }
            }),
            this.config = e,
            this.machineId = I().getMachineId(),
            this.machineIdSign = I().getMachineIdSignature().toString("hex"),
            this.nativeId = I().getNativeId(),
            this.nativeIdSign = I().getNativeIdSignature().toString("hex"),
            this.remotedAccountInfoTimestamp = 0,
            f(e.muserURL + this.getAccountToken(), {
                mid: this.machineId,
                mids: this.machineIdSign,
                nid: this.nativeId,
                nids: this.nativeIdSign
            }).catch((()=>{}
            ))
        }
        getAccountInfo() {
            /*const e = n().get("account");
            if (!e)
                return null;
            let t = "";
            if ("object" != typeof e)
                return n().delete("account"),
                null;
            if (t = L(Buffer.from(e.info || "", "hex")),
            !t)
                return n().delete("account"),
                null;
            let i = null;
            try {
                if (i = JSON.parse(t),
                "object" != typeof i)
                    return n().delete("account"),
                    null
            } catch (e) {
                return n().delete("account"),
                null
            }
            return i.uid ? i : (n().delete("account"),
            null)*/
            return {
                cellphone: '1895308808x',
                avatar: 'https://www.topthink.com/uploads/avatar/20221204/2b25dd261d384a33024b6dac9e327bf2.png',
                nickname: '💰😄',
                uid: 'chandlerver5',
                db_secrect_key: 'chandlerver5',
                // 数据库密钥
                db_sync: 0,
                // 账户数据是否开启同步
                type: 1,
                // 会员 1 === t.type ? "member" : "user"
                expired_at: "10000610064",
                // 会员到期日
                token: 'xeeasdgwwefzxcasdvwer',
                // token
                access_token: 'asdgwwefzxcasdvwer'
            }
        }
        getAccountToken() {
            let e, t = n().get("account");
            if (!t)
                return "";
            if ("string" == typeof t) {
                if (t = this.getAccountInfo(),
                !t)
                    return "";
                e = t.access_token
            } else
                e = t.token;
            return e ? L(Buffer.from(e, "hex")) : ""
        }
        init() {
            const e = this.getAccountInfo();
            e && (this.emit("login", e),
            setImmediate((()=>{
                this.remoteAccountInfo(this.getAccountToken())
            }
            )),
            this.loopRemoteAccountInfo())
        }
        remoteAccountInfo(e, t) {
            const i = I().getRandomKeyAndSignature();
            g(this.config.profileURL, {
                access_token: e,
                mid: this.machineId,
                mids: this.machineIdSign,
                nid: this.nativeId,
                nids: this.nativeIdSign,
                key: i[0],
                keys: i[1].toString("hex")
            }).then((i=>{
                this.remotedAccountInfoTimestamp = Date.now();
                const o = i.timestamp
                  , s = i.sign
                  , r = i.user_info;
                if (I().compareYuanliaoSignature(r + o, Buffer.from(s, "hex"))) {
                    const i = this.getAccountInfo();
                    n().set("account", {
                        token: O(e).toString("hex"),
                        info: O(r).toString("hex"),
                        sign: s,
                        timestamp: o
                    });
                    const a = JSON.parse(r);
                    i && i.db_sync !== a.db_sync && (a.db_sync ? this.emit("dbsync", a) : (this.emit("undbsync", a),
                    new Notification({
                        title: "uTools",
                        body: "帐号数据同步功能已关闭，请知悉"
                    }).show())),
                    "function" == typeof t && t(null, a)
                } else
                    setTimeout((()=>{
                        this.logout(),
                        this.emit("logout_message", "检测到 uTools 帐号信息非法签名，已退出帐号！")
                    }
                    )),
                    "function" == typeof t && t(new Error("非法签名，退出帐号"))
            }
            )).catch((e=>{
                401 === e.code && n().has("account") && setTimeout((()=>{
                    this.logout(),
                    this.emit("logout_message", "uTools 帐号密钥已失效，已退出帐号！")
                }
                )),
                "function" == typeof t && t(e)
            }
            ))
        }
        loopRemoteAccountInfo() {
            this.loopRemoteAccountInfoTimer = setTimeout((()=>{
                if (Date.now() - this.remotedAccountInfoTimestamp < 432e5)
                    return this.loopRemoteAccountInfo();
                const e = this.getAccountToken();
                e && this.remoteAccountInfo(e, (()=>{
                    this.loopRemoteAccountInfo()
                }
                ))
            }
            ), 36e5)
        }
        logout(e) {
            const t = this.getAccountToken();
            t ? (g(this.config.logoutURL, {
                access_token: t,
                logout_all_devices: e ? 1 : 0
            }),
            n().delete("account"),
            this.loopRemoteAccountInfoTimer && clearTimeout(this.loopRemoteAccountInfoTimer),
            this.emit("logout")) : n().has("account") && (n().delete("account"),
            this.loopRemoteAccountInfoTimer && clearTimeout(this.loopRemoteAccountInfoTimer),
            this.emit("logout"))
        }
        getUserServerTemporaryToken(e, t) {
            const i = this.getAccountToken();
            if (!i)
                return t(null, null);
            g(this.config.temporaryToken, {
                access_token: i,
                plugin_name: e
            }).then((e=>{
                t(null, {
                    token: e.token,
                    expiredAt: e.expired_at
                })
            }
            )).catch((e=>{
                t(e)
            }
            ))
        }
    }
    function Ve(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class Oe extends (ce()) {
        constructor(e, i) {
            super(),
            Ve(this, "clipboardPluginId", "clipboard"),
            Ve(this, "autoPasteLife", 5),
            Ve(this, "updateTimestamp", 0),
            Ve(this, "cancelWatchTimeout", null),
            Ve(this, "maxGroupFolderNum", 6),
            Ve(this, "maxGroupRecordNum", 100),
            Ve(this, "getRecordFolderNames", (()=>{
                if (!x().existsSync(this.clipboardDataDir))
                    return [];
                let e;
                try {
                    e = x().readdirSync(this.clipboardDataDir)
                } catch (e) {
                    return null
                }
                if (0 === e.length)
                    return [];
                const t = e.filter((e=>/^\d{13}$/.test(e))).sort().reverse().slice(0, this.maxGroupFolderNum);
                return e.length > t.length && e.filter((e=>!t.includes(e))).forEach((e=>{
                    de()(l().join(this.clipboardDataDir, e), (()=>{}
                    ))
                }
                )),
                t
            }
            )),
            Ve(this, "initCurrentRecordFileStat", (()=>{
                do {
                    try {
                        const e = this.getRecordFolderNames();
                        if (!e || 0 === e.length)
                            break;
                        const t = l().join(this.clipboardDataDir, e[0])
                          , i = l().join(t, "data");
                        if (!x().existsSync(i))
                            break;
                        let n = x().readFileSync(i, "utf-8").split("\n").length;
                        (0 === n || n > this.maxGroupRecordNum + 1) && (n = this.maxGroupRecordNum + 1),
                        this.currentRecordFileStat = {
                            folder: t,
                            number: n - 1
                        }
                    } catch (e) {}
                } while (0);
                this.currentRecordFileStat || (this.currentRecordFileStat = {
                    number: 0
                })
            }
            )),
            Ve(this, "appendRecordItem", (e=>{
                if (!e || !this.currentRecordFileStat)
                    return;
                if (this._prevRecordItemHash && this._prevRecordItemHash === e.hash)
                    return;
                if (this._prevRecordItemHash = e.hash,
                this.currentRecordFileStat.number % this.maxGroupRecordNum == 0) {
                    this.currentRecordFileStat.number === this.maxGroupRecordNum && this.getRecordFolderNames(),
                    this.currentRecordFileStat.folder = l().join(this.clipboardDataDir, Date.now().toString());
                    try {
                        x().mkdirSync(this.currentRecordFileStat.folder, {
                            recursive: !0
                        })
                    } catch (e) {
                        return
                    }
                    this.currentRecordFileStat.number = 0
                }
                if ("image" === e.type) {
                    this._currentClipboardImageRecordCache = {
                        key: I().getClipboardChangeCount(),
                        buffer: e.buffer
                    };
                    const t = l().join(this.currentRecordFileStat.folder, e.hash);
                    try {
                        x().existsSync(t) || x().writeFileSync(t, e.buffer)
                    } catch (e) {}
                    delete e.buffer
                }
                try {
                    const t = O(JSON.stringify(e));
                    x().appendFileSync(l().join(this.currentRecordFileStat.folder, "data"), t + "\n", "utf-8")
                } catch {
                    return
                }
                this.currentRecordFileStat.number++;
                const t = this.runningPluginPool[this.clipboardPluginId];
                if (!t)
                    return;
                let i = t.view;
                if (!i) {
                    const e = t.detachWindows[0];
                    e && (i = e.getBrowserView())
                }
                i && ("image" === e.type && (e.value = l().join(this.currentRecordFileStat.folder, e.hash)),
                i.webContents.send("append", e))
            }
            )),
            Ve(this, "getRecordItem", (()=>new Promise((e=>{
                const i = Date.now()
                  , n = this.getCopyFiles();
                if (n) {
                    const t = w().createHash("md5").update(JSON.stringify(n)).digest("hex");
                    return e({
                        type: "files",
                        value: n,
                        timestamp: i,
                        hash: t
                    })
                }
                const o = t.clipboard.availableFormats();
                if (0 === o.length)
                    return e(null);
                if ("text/plain" === o[0]) {
                    const n = t.clipboard.readText();
                    if (n.trim()) {
                        const t = w().createHash("md5").update(n).digest("hex");
                        return e({
                            type: "text",
                            value: n,
                            timestamp: i,
                            hash: t
                        })
                    }
                    return e(null)
                }
                if (!o[o.length - 1].startsWith("image/"))
                    return e(null);
                if (r().linux()) {
                    const n = t.clipboard.readImage("clipboard");
                    if (n.isEmpty())
                        return e(null);
                    const o = n.toPNG()
                      , s = w().createHash("md5").update(o).digest("hex");
                    return e({
                        type: "image",
                        size: o.byteLength,
                        timestamp: i,
                        buffer: o,
                        hash: s
                    })
                }
                I().readClipboardImage((n=>{
                    if (!n) {
                        if (!r().macOS())
                            return e(null);
                        {
                            const i = t.clipboard.readImage();
                            if (i.isEmpty())
                                return e(null);
                            n = i.toPNG()
                        }
                    }
                    const o = w().createHash("md5").update(n).digest("hex");
                    e({
                        type: "image",
                        size: n.byteLength,
                        timestamp: i,
                        buffer: n,
                        hash: o
                    })
                }
                ))
            }
            )))),
            Ve(this, "clipboardServices", {
                readAllRecords: ()=>new Promise(((e,t)=>{
                    const i = this.getRecordFolderNames();
                    if (!i)
                        return t(new Error('剪切板存储路径 "' + this.clipboardDataDir + '" 无法读取，可尝试手动删除它解决!'));
                    if (0 === i.length)
                        return e([]);
                    const n = {};
                    let o = 0;
                    for (const t of i) {
                        const i = l().join(this.clipboardDataDir, t, "data");
                        if (!x().existsSync(i)) {
                            de()(l().join(this.clipboardDataDir, t), (()=>{}
                            ));
                            continue
                        }
                        let s;
                        try {
                            s = x().readFileSync(i, "utf-8")
                        } catch (e) {
                            continue
                        }
                        const r = s.split("\n").reverse();
                        for (const i of r) {
                            if (!i)
                                continue;
                            const s = L(i);
                            if (!s || !s.startsWith("{"))
                                continue;
                            const r = JSON.parse(s);
                            if (!(r.hash in n) && ("image" === r.type && (r.value = l().join(this.clipboardDataDir, t, r.hash)),
                            n[r.hash] = r,
                            ++o >= 500))
                                return e(Object.values(n))
                        }
                    }
                    e(Object.values(n))
                }
                )),
                clearAllRecords: ()=>new Promise((e=>{
                    de()(this.clipboardDataDir, (t=>{
                        if (this.currentRecordFileStat = {
                            number: 0
                        },
                        t) {
                            if (!x().existsSync(this.clipboardDataDir))
                                return e();
                            const t = x().readdirSync(this.clipboardDataDir);
                            if (0 === t.length)
                                return e();
                            t.filter((e=>/^\d{13}$/.test(e))).forEach((e=>{
                                const t = l().join(this.clipboardDataDir, e, "data");
                                try {
                                    x().existsSync(t) && x().writeFileSync(t, "")
                                } catch (e) {}
                            }
                            ))
                        }
                        e()
                    }
                    ))
                }
                ))
            }),
            Ve(this, "mainServices", {
                getCopyFiles: e=>{
                    e.returnValue = this.getCopyFiles()
                }
                ,
                getClipboardImage: e=>{
                    if (this._currentClipboardImageRecordCache) {
                        let t;
                        if (this._currentClipboardImageRecordCache.key === I().getClipboardChangeCount() && (t = this._currentClipboardImageRecordCache.buffer),
                        this._currentClipboardImageRecordCache = null,
                        t)
                            return void (e.returnValue = t)
                    }
                    if (r().linux()) {
                        const i = t.clipboard.readImage();
                        e.returnValue = i.isEmpty() ? null : i.toPNG()
                    } else
                        I().readClipboardImage((i=>{
                            if (i || !r().macOS())
                                e.returnValue = i;
                            else {
                                const i = t.clipboard.readImage();
                                e.returnValue = i.isEmpty() ? null : i.toPNG()
                            }
                        }
                        ))
                }
            }),
            Ve(this, "ffffffffServices", {
                getCopyFiles: this.mainServices.getCopyFiles
            }),
            this.clipboardDataDir = e,
            this.pluginsCmp = i
        }
        init() {
            I().clipboardWatch((()=>{
                this.cancelWatchTimeout || (this.updateTimestamp = Date.now(),
                this.emit("change"),
                this.clipboardPluginId in this.pluginsCmp.pluginContainer && (this.currentRecordFileStat || this.initCurrentRecordFileStat(),
                this.getRecordItem().then(this.appendRecordItem)))
            }
            ))
        }
        isPreCopy() {
            if (0 === this.updateTimestamp)
                return !1;
            const e = Date.now() - this.updateTimestamp < 1e3 * this.autoPasteLife;
            return this.updateTimestamp = 0,
            e
        }
        temporaryCancelWatch() {
            this.cancelWatchTimeout && clearTimeout(this.cancelWatchTimeout),
            this.cancelWatchTimeout = setTimeout((()=>{
                this.cancelWatchTimeout = null
            }
            ), 300)
        }
        getPasteFormat() {
            if (r().windows()) {
                if (t.clipboard.has("FileNameW"))
                    return "files"
            } else if (r().macOS()) {
                if (t.clipboard.has("NSFilenamesPboardType"))
                    return "files"
            } else if (r().linux() && t.clipboard.has("text/uri-list")) {
                const e = I().getCopyFileNames();
                if (e && e.length > 0)
                    return "files"
            }
            const e = t.clipboard.availableFormats();
            return e.length > 0 && "text/plain" !== e[0] && e[e.length - 1].startsWith("image/") ? "img" : "text"
        }
        getCopyFiles() {
            const e = I().getCopyFileNames();
            if (!e || 0 === e.length)
                return null;
            const t = [];
            return e.forEach((e=>{
                if (!x().existsSync(e))
                    return;
                let i;
                try {
                    i = x().lstatSync(e)
                } catch (e) {
                    return
                }
                t.push({
                    isFile: i.isFile(),
                    isDirectory: i.isDirectory(),
                    name: l().basename(e) || e,
                    path: e
                })
            }
            )),
            0 === t.length ? null : t
        }
    }
    const Le = require("child_process");
    var Re = e.n(Le);
    const Ne = {
        "iPhone 11": {
            size: {
                width: 414,
                height: 896
            },
            useragent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
        },
        "iPhone X": {
            size: {
                width: 375,
                height: 812
            },
            useragent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
        },
        iPad: {
            size: {
                width: 768,
                height: 1024
            },
            useragent: "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1"
        },
        "iPhone 6/7/8 Plus": {
            size: {
                width: 414,
                height: 736
            },
            useragent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
        },
        "iPhone 6/7/8": {
            size: {
                width: 375,
                height: 667
            },
            useragent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
        },
        "iPhone 5/SE": {
            size: {
                width: 320,
                height: 568
            },
            useragent: "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"
        },
        "HUAWEI Mate10": {
            size: {
                width: 360,
                height: 640
            },
            useragent: "Mozilla/5.0 (Linux; U; Android 8.1.0; ALP-AL00 Build/HUAWEIALP-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.86 Mobile Safari/537.36"
        },
        "HUAWEI Mate20": {
            size: {
                width: 360,
                height: 748
            },
            useragent: "Mozilla/5.0 (Linux; U; Android 9; HMA-AL00 Build/HUAWEIHMA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.86 Mobile Safari/537.36"
        },
        "HUAWEI Mate30": {
            size: {
                width: 360,
                height: 780
            },
            useragent: "Mozilla/5.0 (Linux; U; Android 10; TAS-AL00 Build/HUAWEITAS-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.86 Mobile Safari/537.36"
        },
        "HUAWEI Mate30 Pro": {
            size: {
                width: 392,
                height: 800
            },
            useragent: "Mozilla/5.0 (Linux; U; Android 10; LIO-AL00 Build/HUAWEILIO-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.86 Mobile Safari/537.36"
        }
    };
    class He {
        async useragent(e) {
            this._browserWindow.webContents.userAgent = e
        }
        async viewport(e, t) {
            this._browserWindow.setContentSize(e, t)
        }
        async goto(...e) {
            if (!e[0] || "string" != typeof e[0] || !/^(?:https?|file):\/\//.test(e[0]))
                throw new Error("url error");
            let t;
            this._isShow && !this._isFirstGoto && (this._isFirstGoto = !0,
            this._browserWindow.setTitle(e[0]),
            this._browserWindow.show());
            let i = 6e4;
            if (e[1])
                if ("object" == typeof e[1]) {
                    const i = e[1];
                    t = {
                        extraHeaders: ""
                    };
                    for (const e in i)
                        "referer" !== e.toLowerCase() ? "useragent" !== e.toLowerCase() ? t.extraHeaders += e + ": " + i[e] + "\n" : t.userAgent = i[e] : t.httpReferrer = i[e]
                } else
                    "number" == typeof e[1] && e[1] > 0 && (i = e[1]);
            e[2] && "number" == typeof e[2] && e[2] > 0 && (i = e[2]),
            await new Promise(((n,o)=>{
                const s = setTimeout((()=>{
                    o(new Error("page load timeout"))
                }
                ), i);
                this._browserWindow.webContents.once("dom-ready", (()=>{
                    clearTimeout(s),
                    this._pageIsDomReadyed = !0,
                    n()
                }
                )),
                this._browserWindow.loadURL(e[0], t).catch((e=>{
                    clearTimeout(s),
                    o(e)
                }
                ))
            }
            ))
        }
        async hide() {
            this._isShow = !1,
            this._browserWindow.hide()
        }
        async show() {
            this._isShow = !0,
            this._browserWindow.show()
        }
        async devTools(e="detach") {
            if (!this._isShow)
                throw new Error("ubrowser is hided");
            this._browserWindow.webContents.openDevTools({
                mode: e,
                activate: !1
            })
        }
        async javascript(e) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            const t = await this._browserWindow.webContents.executeJavaScript(e, !0);
            if (t.error)
                throw new Error(t.message);
            return t.data
        }
        async css(e) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            await this._browserWindow.webContents.insertCSS(e)
        }
        async press(e, ...t) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            if (this._allKeyCodes || (this._allKeyCodes = Object.values(ge)),
            !this._allKeyCodes.includes(e))
                throw new Error("keyCode wrong");
            if (t.length > 0) {
                if (t.find((e=>!["shift", "alt", "ctrl", "contorl", "meta", "command", "cmd"].includes(e.toLowerCase()))))
                    throw new Error("modifier key error");
                t = Array.from(new Set(t)).map((e=>e.toLowerCase()))
            }
            this._browserWindow.webContents.sendInputEvent({
                type: "keyDown",
                keyCode: e,
                modifiers: t
            }),
            this._browserWindow.webContents.sendInputEvent({
                type: "char",
                keyCode: e,
                modifiers: t
            }),
            this._browserWindow.webContents.sendInputEvent({
                type: "keyUp",
                keyCode: e,
                modifiers: t
            })
        }
        async paste(e) {
            e && (/^data:image\/[a-z]+?;base64,/.test(e) ? t.clipboard.writeImage(t.nativeImage.createFromDataURL(e)) : t.clipboard.writeText(e)),
            await this._browserWindow.webContents.executeJavaScript("document.execCommand('paste')")
        }
        async file(e, t) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            const i = this._browserWindow.webContents.debugger;
            i.attach("1.1");
            try {
                const n = await i.sendCommand("DOM.getDocument")
                  , o = await i.sendCommand("DOM.querySelector", {
                    nodeId: n.root.nodeId,
                    selector: e
                });
                await i.sendCommand("DOM.setFileInputFiles", {
                    nodeId: o.nodeId,
                    files: t
                })
            } finally {
                i.detach()
            }
        }
        async capture(e, i) {
            let n, o;
            if (i) {
                if (/\.png$/i.test(i) ? (n = l().dirname(i),
                o = l().basename(i)) : n = i,
                !u().existsSync(n))
                    throw new Error("save directory not exist")
            } else
                n = l().join(t.app.getPath("temp"), "utools-ubrowser"),
                u().existsSync(n) || u().mkdirSync(n);
            const s = await this._browserWindow.webContents.capturePage(e);
            if (s.isEmpty())
                throw new Error("capture image destroyed");
            const r = l().join(n, o || Date.now() + ".png");
            return u().writeFileSync(r, s.toPNG()),
            r
        }
        async screenshot(e, t) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            if ("string" == typeof e) {
                const i = `(()=>{\n        const selector = ${JSON.stringify(e)}\n        const element = document.querySelector(selector)\n        if (!element) return\n        let rect = element.getBoundingClientRect()\n        window.scrollTo(rect.left, rect.top)\n        rect = element.getBoundingClientRect()\n        return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }\n      })()`
                  , n = await this._browserWindow.webContents.executeJavaScript(i);
                if (n)
                    return await this.capture(n, t);
                throw new Error('unable to find element by selector "' + e + '"')
            }
            if ("object" == typeof e)
                return await this.capture(e, t);
            if (void 0 === e)
                return await this.capture(null, t);
            throw new Error("parameter error")
        }
        async pdf(...e) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            let i, n, o = {}, s = null;
            if (1 === e.length ? "object" == typeof e[0] ? o = e[0] || {} : "string" == typeof e[0] && (s = e[0]) : e.length > 1 && ("object" == typeof e[0] && (o = e[0] || {}),
            "string" == typeof e[1] && (s = e[1])),
            s) {
                if (/\.pdf$/i.test(s) ? (i = l().dirname(s),
                n = l().basename(s)) : i = s,
                !u().existsSync(i))
                    throw new Error("save directory not exist")
            } else
                i = l().join(t.app.getPath("temp"), "utools-ubrowser"),
                u().existsSync(i) || u().mkdirSync(i);
            const r = await this._browserWindow.webContents.printToPDF(o)
              , a = l().join(i, n || Date.now() + ".pdf");
            return u().writeFileSync(a, r),
            a
        }
        async device(e) {
            if ("string" == typeof e) {
                if (!(e in Ne))
                    throw new Error("type not found");
                e = Ne[e]
            } else {
                if ("object" != typeof e)
                    throw new Error("parameter error");
                if ("object" != typeof e.size || "number" != typeof e.size.width || "number" != typeof e.size.height)
                    throw new Error('property "size" wrong');
                if ("string" != typeof e.useragent)
                    throw new Error('property "useragent" wrong')
            }
            this._browserWindow.setContentSize(e.size.width, e.size.height),
            this._browserWindow.resizable = !1,
            this._browserWindow.maximizable = !1,
            this._browserWindow.fullScreenable = !1,
            this._browserWindow.webContents.userAgent = e.useragent,
            0 === this._browserWindow.webContents.listenerCount("dom-ready") && this._browserWindow.webContents.on("dom-ready", (()=>{
                const e = this._browserWindow.getContentSize();
                this._browserWindow.webContents.enableDeviceEmulation({
                    screenPosition: "mobile",
                    screenSize: {
                        width: e[0],
                        height: e[1]
                    }
                })
            }
            ))
        }
        async cookies(e) {
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            const t = {
                url: this._browserWindow.webContents.getURL()
            };
            "string" == typeof e && e && (t.name = e);
            const i = await this._browserWindow.webContents.session.cookies.get(t);
            return i && i.length > 0 ? e ? i[0] : i : null
        }
        async removeCookies(e) {
            if (!e)
                throw new Error("parameter error");
            if (!this._pageIsDomReadyed)
                throw new Error('"goto" method dit not executed');
            const t = this._browserWindow.webContents.getURL();
            await this._browserWindow.webContents.session.cookies.remove(t, e)
        }
        async setCookies(...e) {
            let t;
            if (2 === e.length ? "string" == typeof e[0] && "string" == typeof e[1] && (t = [{
                name: e[0],
                value: e[1]
            }]) : 1 === e.length && Array.isArray(e[0]) && (t = e[0]),
            !t)
                throw new Error("parameter error");
            if (this._pageIsDomReadyed) {
                const e = this._browserWindow.webContents.getURL();
                for (const i of t)
                    i.url = e
            } else if (t.find((e=>!/^https?:\/\/.+/i.test(e.url))))
                throw new Error("url error");
            for (let e = 0; e < t.length; e++)
                await this._browserWindow.webContents.session.cookies.set(t[e])
        }
        async clearCookies(e) {
            if (this._pageIsDomReadyed)
                e = this._browserWindow.webContents.getURL();
            else if (!/^https?:\/\/.+/i.test(e))
                throw new Error('parameter "url" empty');
            const t = await this._browserWindow.webContents.session.cookies.get({
                url: e
            });
            if (t && t.length > 0)
                for (let i = 0; i < t.length; i++)
                    await this._browserWindow.webContents.session.cookies.remove(e, t[i].name)
        }
        run({pluginId: e, pluginLogo: i, options: n, queue: o, windowCmp: s, idleUBrowserWindowIds: a}) {
            return new Promise(((c,d)=>{
                if ("number" == typeof n) {
                    const i = t.BrowserWindow.fromId(n);
                    if (!i || i.isDestroyed() || !i.isVisible() || i.webContents.session !== s.pluginUBrowserSessionPool[e])
                        return d(new Error('no ubrowser with id "' + n + '" exists'));
                    const o = a.indexOf(n);
                    o >= 0 && a.splice(o, 1),
                    this._browserWindow = i
                } else if (!o.find((e=>"goto" === e.method)))
                    return d(new Error('not implemented "goto"'));
                if (this._browserWindow)
                    this._isShow = !0,
                    this._pageIsDomReadyed = !0;
                else {
                    if (n && "object" == typeof n) {
                        const e = {
                            show: "boolean",
                            width: "number",
                            height: "number",
                            x: "number",
                            y: "number",
                            center: "boolean",
                            minWidth: "number",
                            minHeight: "number",
                            maxWidth: "number",
                            maxHeight: "number",
                            resizable: "boolean",
                            movable: "boolean",
                            minimizable: "boolean",
                            maximizable: "boolean",
                            alwaysOnTop: "boolean",
                            fullscreen: "boolean",
                            fullscreenable: "boolean",
                            enableLargerThanScreen: "boolean",
                            opacity: "number"
                        };
                        for (const t in n)
                            t in e ? typeof n[t] !== e[t] && delete n[t] : delete n[t]
                    } else
                        n = {};
                    this._isShow = !(!1 === n.show),
                    this._pageIsDomReadyed = !1,
                    n.show = !1,
                    n.frame = !0,
                    n.parent = null,
                    n.modal = !1,
                    n.icon = i,
                    n.autoHideMenuBar = !0,
                    e in s.pluginUBrowserSessionPool || (s.pluginUBrowserSessionPool[e] = t.session.fromPartition("<" + e + ".ubrowser>")),
                    n.webPreferences = {
                        session: s.pluginUBrowserSessionPool[e],
                        nodeIntegration: !1,
                        sandbox: !1,
                        contextIsolation: !1,
                        backgroundThrottling: !1
                    },
                    this._browserWindow = new t.BrowserWindow(n),
                    this._browserWindow.removeMenu(),
                    this._browserWindow.once("closed", (()=>{
                        this._browserWindow = null
                    }
                    )),
                    this._browserWindow.once("close", (()=>{
                        this._browserWindow.destroy()
                    }
                    ));
                    const o = this._browserWindow.id;
                    this._browserWindow.webContents.once("destroyed", (()=>{
                        this._isEnd || (this._childProcess.kill("SIGKILL"),
                        d(new Error("ubrowser destroyed")));
                        const e = a.indexOf(o);
                        e >= 0 && a.splice(e, 1)
                    }
                    )),
                    this._browserWindow.webContents.once("render-process-gone", (()=>{
                        this._browserWindow.destroy()
                    }
                    )),
                    this._browserWindow.webContents.setWindowOpenHandler((({url: e})=>(/^https?:\/\//i.test(e) && this._browserWindow.webContents.executeJavaScript(`location.href=${JSON.stringify(e)}`),
                    {
                        action: "deny"
                    }))),
                    r().macOS() ? this._browserWindow.webContents.on("before-input-event", ((e,t)=>{
                        !t.meta || "keyDown" !== t.type || "KeyW" !== t.code && "KeyQ" !== t.code || (e.preventDefault(),
                        this._browserWindow.destroy())
                    }
                    )) : (this._browserWindow.webContents.on("before-input-event", ((e,t)=>{
                        "keyDown" === t.type && (t.control && "KeyW" === t.code || t.alt && "F4" === t.code) && (e.preventDefault(),
                        this._browserWindow.destroy())
                    }
                    )),
                    r().windows() && "FFFFFFFF" !== e && s.setPluginWindowAppDetails(this._browserWindow, e))
                }
                this._childProcess = Re().fork(l().join(__dirname, "ubrowser", "runner.js")),
                this._childProcess.on("message", (({method: e, methodEndKey: t, args: i})=>{
                    if ("run" !== e)
                        if ("runEnd" === e) {
                            this._isEnd = !0,
                            this._childProcess.kill("SIGKILL"),
                            this._isShow ? a.push(this._browserWindow.id) : this._browserWindow.destroy();
                            const e = i[0];
                            if (e.error)
                                return d(new Error(e.message));
                            c(e.data)
                        } else {
                            const n = this[e];
                            "function" == typeof n ? n.apply(this, i).then((e=>{
                                this._childProcess.send({
                                    action: t,
                                    payload: {
                                        data: e
                                    }
                                })
                            }
                            )).catch((i=>{
                                this._childProcess.send({
                                    action: t,
                                    payload: {
                                        error: !0,
                                        message: e + ": " + i.message
                                    }
                                })
                            }
                            )) : this._childProcess.send({
                                action: t,
                                payload: {
                                    error: !0,
                                    message: 'method "' + e + '" not exist'
                                }
                            })
                        }
                }
                )),
                this._childProcess.send({
                    action: "run",
                    payload: o
                })
            }
            ))
        }
    }
    function Ue(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    const Ke = "localopen:";
    class je {
        constructor(e, i, o, s, a, c, h, p) {
            Ue(this, "mainServices", {
                getNativeIconUrl: (e,t)=>{
                    e.returnValue = this.getNativeIconUrl(t)
                }
                ,
                getOriginImageBase64: (e,i)=>{
                    if (!t.net.online)
                        return void (e.returnValue = null);
                    const n = t.net.request(i);
                    n.on("response", (t=>{
                        if (!t.headers["content-type"])
                            return void (e.returnValue = null);
                        const i = t.headers["content-type"].toString();
                        if (-1 === i.toLowerCase().indexOf("image/"))
                            return void (e.returnValue = null);
                        const n = "data:" + i + ";base64,"
                          , o = [];
                        t.on("data", (e=>{
                            o.push(e)
                        }
                        )),
                        t.on("end", (()=>{
                            e.returnValue = n + Buffer.concat(o).toString("base64")
                        }
                        ))
                    }
                    )),
                    n.end()
                }
                ,
                log: (e,t)=>{
                    r().dev() ? (console.log(t),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                reportExceptionError: (e,t)=>{
                    !t || t.length > 1e4 || this.reportCmp.info("appweb.exception", {
                        error: t.replaceAll((0,
                        d.pathToFileURL)(__dirname), "")
                    })
                }
            }),
            Ue(this, "ffffffffServices", {
                isDev: e=>{
                    e.returnValue = r().dev()
                }
                ,
                getAppVersion: e=>{
                    e.returnValue = t.app.getVersion()
                }
                ,
                getResIconAbsolutePath: (e,t)=>{
                    e.returnValue = l().join(__dirname, t)
                }
                ,
                addLocalOpen: async(e,t)=>{
                    e.returnValue = await this.addLocalOpen(t)
                }
                ,
                removeLocalOpen: async(e,t)=>{
                    e.returnValue = await this.removeLocalOpen(t)
                }
                ,
                getLocalOpenFeatures: async e=>{
                    const t = await this.getLocalOpenDoc();
                    if (0 === t.files.length)
                        return void (e.returnValue = []);
                    const i = t.files.map((e=>x().existsSync(e) ? this.convertLocalOpenFeature(e) : {
                        code: Ke + e,
                        explain: e,
                        cmds: [l().parse(l().basename(e)).name]
                    }));
                    e.returnValue = i.sort(((e,t)=>e.cmds[0].localeCompare(t.cmds[0])))
                }
                ,
                getDisableCmds: async(e,t)=>{
                    void 0 !== t && (t += "/"),
                    e.returnValue = await this.getDisableCmds(t)
                }
                ,
                addDisableCmd: async(e,t,i,n,o)=>{
                    e.returnValue = await this.addDisableCmd(t, i, n, o)
                }
                ,
                removeDisableCmd: async(e,t)=>{
                    e.returnValue = await this.removeDisableCmd(t)
                }
                ,
                getPluginMenuSetting: async(e,t)=>{
                    const i = this.pluginIsOutKill(t);
                    let n;
                    n = !i && await this.getIsPluginRunAtAppOpen(t);
                    const o = this.pluginIsEnterDetach(t);
                    e.returnValue = {
                        enterDetach: o,
                        outKill: i,
                        runAtAppOpen: n
                    }
                }
                ,
                addOutKillPlugin: async(e,t)=>{
                    e.returnValue = await this.addOutKillPlugin(t)
                }
                ,
                removeOutKillPlugin: async(e,t)=>{
                    e.returnValue = await this.removeOutKillPlugin(t)
                }
                ,
                addEnterDetachPlugin: async(e,t)=>{
                    e.returnValue = await this.addEnterDetachPlugin(t)
                }
                ,
                removeEnterDetachPlugin: async(e,t)=>{
                    e.returnValue = await this.removeEnterDetachPlugin(t)
                }
                ,
                addPluginRunAtAppOpen: async(e,t)=>{
                    e.returnValue = await this.addPluginRunAtAppOpen(t)
                }
                ,
                removePluginRunAtAppOpen: async(e,t)=>{
                    e.returnValue = await this.removePluginRunAtAppOpen(t)
                }
                ,
                disableDbSyncRemind: e=>{
                    n().set("disableDbSyncRemind", 1),
                    e.returnValue = !0
                }
                ,
                isDisabledDbSyncRemind: e=>{
                    e.returnValue = n().has("disableDbSyncRemind")
                }
                ,
                reportCDNError: ()=>{
                    this.reportCmp.info("cdn.error")
                }
            }),
            Ue(this, "pluginApiServices", {
                setFeature: async(e,t,i)=>{
                    try {
                        await this.saveFeature(t, i)
                    } catch (t) {
                        return void (e.returnValue = t)
                    }
                    this.setPluginFeature(t, i) && this.windowCmp.refreshCmdSource(),
                    e.returnValue = !0
                }
                ,
                removeFeature: async(e,t,i)=>{
                    if (i && "string" == typeof i)
                        return await this.removeFeature(t, i) ? (this.pluginsCmp.removeFeature(t, i) && this.windowCmp.refreshCmdSource(),
                        void (e.returnValue = !0)) : void (e.returnValue = !1);
                    e.returnValue = !1
                }
                ,
                getFeatures: async(e,i,n)=>{
                    const o = await this.getFeatures(i + "/", n);
                    for (const e of o) {
                        if (delete e.pluginId,
                        delete e._rev,
                        e._attachments) {
                            const i = await this.dbCmp.getAttachment("/", e._id, "icon");
                            if (i) {
                                const n = t.nativeImage.createFromBuffer(i);
                                n.isEmpty() ? delete e.icon : e.icon = n.toDataURL()
                            } else
                                delete e.icon
                        }
                        delete e._attachments,
                        delete e._id
                    }
                    e.returnValue = o
                }
                ,
                showNotification: (e,t,i)=>{
                    this.showNotification(t, i)
                }
                ,
                getLocalId: (e,t)=>{
                    e.returnValue = w().createHash("md5").update(this.accountCmp.machineId + t).digest("hex")
                }
                ,
                getNativeId: (e,t)=>{
                    e.returnValue = w().createHash("md5").update(this.accountCmp.nativeId + t).digest("hex")
                }
                ,
                screenColorPick: e=>{
                    let i = !1;
                    const n = this.windowCmp.mainWindow.getBrowserView();
                    n && n.webContents === e.sender && this.windowCmp.mainWindow.isVisible() && (i = !0,
                    this.windowCmp.hideMainWindow()),
                    this.screencolorpickerCmp.action((n=>{
                        if (e.sender.isDestroyed())
                            new t.Notification({
                                body: "取色完成，当前调用的插件应用已完全退出，无法响应"
                            }).show();
                        else {
                            if (i) {
                                const t = this.windowCmp.mainWindow.getBrowserView();
                                t && t.webContents === e.sender && this.windowCmp.display.trigger(!0)
                            }
                            e.sender.executeJavaScript(`if (window.utools && window.utools.__event__ && typeof window.utools.__event__.screenColorPickCallback === 'function') {\n          try { window.utools.__event__.screenColorPickCallback(${JSON.stringify(n)}) } catch(e) {} \n          delete window.utools.__event__.screenColorPickCallback}`)
                        }
                    }
                    ))
                }
                ,
                screenCapture: e=>{
                    let i = !1;
                    const n = ()=>{
                        if (e.sender.isDestroyed())
                            return new t.Notification({
                                body: "截图完成，当前调用的插件应用已完全退出，无法响应"
                            }).show(),
                            !1;
                        if (i) {
                            const t = this.windowCmp.mainWindow.getBrowserView();
                            t && t.webContents === e.sender && this.windowCmp.display.trigger(!0)
                        }
                        return !0
                    }
                      , o = t=>{
                        e.sender.executeJavaScript(`if (window.utools && window.utools.__event__ && typeof window.utools.__event__.screenCaptureCallback === 'function') {\n          try { window.utools.__event__.screenCaptureCallback(${JSON.stringify(t)}) } catch(e) {} \n          delete window.utools.__event__.screenCaptureCallback}`)
                    }
                      , s = this.windowCmp.mainWindow.getBrowserView();
                    if (s && s.webContents === e.sender && this.windowCmp.mainWindow.isVisible() && (i = !0,
                    this.windowCmp.hideMainWindow()),
                    this.windowCmp.isWindow)
                        I().regionScreenshot((e=>{
                            n() && o(e ? t.nativeImage.createFromBuffer(e).toDataURL() : "")
                        }
                        ));
                    else if (this.windowCmp.isMacOs)
                        t.clipboard.writeText(""),
                        Re().spawn("/usr/sbin/screencapture", ["-c", "-i", "-r"], {
                            detached: !0
                        }).once("close", (()=>{
                            if (!n())
                                return;
                            const e = t.clipboard.readImage();
                            o(e.isEmpty() ? "" : e.toDataURL())
                        }
                        ));
                    else if (this.windowCmp.isLinux) {
                        const e = e=>{
                            n() && o(e.isEmpty() ? "" : e.toDataURL())
                        }
                        ;
                        if (i)
                            return void setTimeout((()=>{
                                this.screencaptureCmp.action(e)
                            }
                            ), 250);
                        this.screencaptureCmp.action(e)
                    }
                }
                ,
                getIdleUBrowsers: (e,i)=>{
                    i in this.windowCmp.pluginUBrowserSessionPool ? e.returnValue = t.webContents.getAllWebContents().filter((e=>e.session === this.windowCmp.pluginUBrowserSessionPool[i])).map((e=>t.BrowserWindow.fromWebContents(e))).filter((e=>!e.isDestroyed() && this.idleUBrowserWindowIds.includes(e.id))).map((e=>({
                        id: e.id,
                        title: e.getTitle(),
                        url: e.webContents.getURL()
                    }))) : e.returnValue = []
                }
                ,
                setUBrowserProxy: (e,i,n)=>{
                    t.session.fromPartition("<" + i + ".ubrowser>").setProxy(n).then((()=>{
                        e.returnValue = !0
                    }
                    )).catch((()=>{
                        e.returnValue = !1
                    }
                    ))
                }
                ,
                clearUBrowserCache: (e,i)=>{
                    t.session.fromPartition("<" + i + ".ubrowser>").clearCache().then((()=>{
                        e.returnValue = !0
                    }
                    )).catch((()=>{
                        e.returnValue = !1
                    }
                    ))
                }
                ,
                runUBrowser: async(e,{options: t, queue: i})=>{
                    const n = (0,
                    d.fileURLToPath)(this.pluginsCmp.pluginContainer[e]?.logo);
                    return await (new He).run({
                        pluginId: e,
                        pluginLogo: n,
                        options: t,
                        queue: i,
                        windowCmp: this.windowCmp,
                        idleUBrowserWindowIds: this.idleUBrowserWindowIds
                    })
                }
                ,
                reportExceptionError: (e,t,i)=>{
                    if (!i || i.length > 1e4)
                        return;
                    const n = this.pluginsCmp.pluginContainer[t];
                    !n || n.isDev || n.unsafe || this.reportCmp.info("plugin.exception", {
                        pluginId: t,
                        pluginVersion: n.version,
                        error: i.replaceAll((0,
                        d.pathToFileURL)(n.location), "").replaceAll(n.location, "")
                    })
                }
            }),
            Ue(this, "pluginUtilApiServices", {
                isDev: e=>{
                    const t = this.windowCmp.getPluginIdByWebContents(e.sender);
                    // <一步到位>插件名
                    if(t === 'automation') e.returnValue = false
                    else e.returnValue = !!t && !!this.pluginsCmp.pluginContainer[t]?.isDev
                }
                ,
                isDarkColors: e=>{
                    e.returnValue = t.nativeTheme.shouldUseDarkColors
                }
                ,
                getUser: e=>{
                    const t = this.accountCmp.getAccountInfo();
                    e.returnValue = t ? {
                        avatar: t.avatar,
                        nickname: t.nickname,
                        type: 1 === t.type ? "member" : "user"
                    } : null
                }
                ,
                getAppVersion: e=>{
                    e.returnValue = t.app.getVersion()
                }
                ,
                getPath: (e,i)=>{
                    if ("downloads" === i && this.windowCmp.isWindow)
                        e.returnValue = I().getDownloadsFolderPath();
                    else
                        try {
                            e.returnValue = t.app.getPath(i)
                        } catch (t) {
                            e.returnValue = null
                        }
                }
                ,
                getFileIcon: (e,t)=>{
                    const i = this.getNativeIconUrl(t);
                    i.startsWith("file://") ? e.returnValue = i : this.windowCmp.nativeIconHandler(i.substr(13), (t=>{
                        e.returnValue = "data:" + t.mimeType + ";base64," + t.data.toString("base64")
                    }
                    ))
                }
                ,
                redirect: (e,t)=>{
                    try {
                        this.redirect(t),
                        e.returnValue = !0
                    } catch (t) {
                        e.returnValue = t
                    }
                }
                ,
                copyFile: (e,{file: t, isRecord: i})=>{
                    t ? (Array.isArray(t) || (t = [t]),
                    0 !== (t = t.filter((e=>u().existsSync(e)))).length ? (i || this.clipboardCmp.temporaryCancelWatch(),
                    I().copyFile.apply(null, t),
                    e.returnValue = !0) : e.returnValue = !1) : e.returnValue = !1
                }
                ,
                copyImage: (e,{img: i, isRecord: n})=>{
                    if (!i)
                        return void (e.returnValue = !1);
                    let o;
                    "string" == typeof i ? /^data:image\/([a-z]+);base64,/.test(i) ? o = t.nativeImage.createFromDataURL(i) : l().basename(i) !== i && u().existsSync(i) && (o = t.nativeImage.createFromPath(i)) : "object" == typeof i && i instanceof Uint8Array && (o = t.nativeImage.createFromBuffer(Buffer.from(i))),
                    o && !o.isEmpty() ? (n || this.clipboardCmp.temporaryCancelWatch(),
                    t.clipboard.writeImage(o),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                copyText: (e,{text: i, isRecord: n})=>{
                    n || this.clipboardCmp.temporaryCancelWatch(),
                    t.clipboard.writeText(String(i)),
                    e.returnValue = !0
                }
                ,
                getCopyedFiles: e=>{
                    e.returnValue = this.clipboardCmp.getCopyFiles()
                }
                ,
                readCurrentFolderPath: ()=>this.readCurrentFolderPath(),
                readCurrentBrowserUrl: ()=>this.readCurrentBrowserUrl(),
                getCurrentFolderPath: e=>{
                    this.readCurrentFolderPath().then((t=>{
                        e.returnValue = t
                    }
                    )).catch((()=>{
                        e.returnValue = ""
                    }
                    ))
                }
                ,
                getCurrentBrowserUrl: e=>{
                    this.readCurrentBrowserUrl().then((t=>{
                        e.returnValue = t
                    }
                    )).catch((()=>{
                        e.returnValue = ""
                    }
                    ))
                }
                ,
                showOpenDialog: (e,i)=>{
                    const n = t.BrowserWindow.fromWebContents(e.sender)
                      , o = n === this.windowCmp.mainWindow;
                    o && (this.windowCmp.ignoreMainWindowBlurExpiryTime = Date.now() + 500,
                    this.windowCmp.isMacOs && this.windowCmp.mainWindow.setAlwaysOnTop(!0, "floating")),
                    t.dialog.showOpenDialog(n, i).then((t=>{
                        t.canceled || 0 === t.filePaths.length ? e.returnValue = null : e.returnValue = t.filePaths
                    }
                    )).catch((()=>{
                        e.returnValue = null
                    }
                    )).finally((()=>{
                        o && (this.windowCmp.ignoreMainWindowBlurExpiryTime = null,
                        this.windowCmp.isMacOs && this.windowCmp.mainWindow.setAlwaysOnTop(!0, "modal-panel", 1),
                        n.getBrowserView() && (n.isVisible() || n.show(),
                        e.sender.focus()))
                    }
                    ))
                }
                ,
                showSaveDialog: (e,i)=>{
                    const n = t.BrowserWindow.fromWebContents(e.sender)
                      , o = n === this.windowCmp.mainWindow;
                    o && (this.windowCmp.ignoreMainWindowBlurExpiryTime = Date.now() + 500,
                    this.windowCmp.isMacOs && this.windowCmp.mainWindow.setAlwaysOnTop(!0, "floating")),
                    t.dialog.showSaveDialog(n, i).then((t=>{
                        e.returnValue = t.filePath
                    }
                    )).catch((()=>{
                        e.returnValue = null
                    }
                    )).finally((()=>{
                        o && (this.windowCmp.ignoreMainWindowBlurExpiryTime = null,
                        this.windowCmp.isMacOs && this.windowCmp.mainWindow.setAlwaysOnTop(!0, "modal-panel", 1),
                        n.getBrowserView() && (n.isVisible() || n.show(),
                        e.sender.focus()))
                    }
                    ))
                }
                ,
                findInPage: (e,t)=>{
                    const {text: i, options: n} = t;
                    i && "string" == typeof i ? (e.sender.findInPage(i, n),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                stopFindInPage: (e,t)=>{
                    e.sender.stopFindInPage(t || "clearSelection"),
                    e.returnValue = !0
                }
                ,
                startDrag: (e,i)=>{
                    if (!i)
                        return;
                    const n = {};
                    if ("string" == typeof i) {
                        if (!x().existsSync(i))
                            return;
                        n.file = i
                    } else {
                        if (!(Array.isArray(i) && i.length > 0))
                            return;
                        {
                            const e = i.filter((e=>x().existsSync(e)));
                            if (0 === e.length)
                                return;
                            n.files = e
                        }
                    }
                    const o = n.file ? 1 : n.files.length
                      , s = l().join(__dirname, "res", "dragfile.png");
                    (0,
                    we.png2DragIcon)(s, o).then((i=>{
                        n.icon = t.nativeImage.createFromBuffer(i),
                        e.sender.startDrag(n)
                    }
                    ))
                }
                ,
                shellOpenExternal: (e,i)=>{
                    this.windowCmp.hideMainWindow(!1),
                    t.shell.openExternal(i),
                    e.returnValue = !0
                }
                ,
                shellShowItemInFolder: (e,i)=>{
                    i && "string" == typeof i ? (this.windowCmp.hideMainWindow(!1),
                    t.shell.showItemInFolder(l().normalize(i)),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                shellOpenItem: (e,i)=>{
                    i && "string" == typeof i ? (this.windowCmp.hideMainWindow(!1),
                    t.shell.openPath(l().normalize(i)),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                shellOpenPath: (e,i)=>{
                    i && "string" == typeof i ? (this.windowCmp.hideMainWindow(!1),
                    t.shell.openPath(l().normalize(i)),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                shellBeep: e=>{
                    t.shell.beep(),
                    e.returnValue = !0
                }
                ,
                hideMainWindowTypeString: (e,i)=>{
                    const n = t.BrowserWindow.fromWebContents(e.sender);
                    n && n !== this.windowCmp.mainWindow ? e.returnValue = !1 : (this.windowCmp.hideMainWindow(!0),
                    i && (this.windowCmp.isLinux ? (this.clipboardCmp.temporaryCancelWatch(),
                    t.clipboard.writeText(i),
                    I().simulateKeyboardTap("v", "ctrl")) : [...(new Intl.Segmenter).segment(i)].forEach((e=>{
                        I().unicodeType(e.segment)
                    }
                    ))),
                    e.returnValue = !0)
                }
                ,
                simulateKeyboardTap: (e,{key: t, modifier: i})=>{
                    const n = [t.toLowerCase()];
                    i && Array.isArray(i) && i.length > 0 && i.forEach((e=>{
                        n.push(e.toLowerCase())
                    }
                    )),
                    I().simulateKeyboardTap.apply(null, n),
                    e.returnValue = !0
                }
                ,
                simulateMouseClick: (e,t)=>{
                    t ? I().simulateMouseClick(t.x, t.y) : I().simulateMouseClick(),
                    e.returnValue = !0
                }
                ,
                simulateMouseRightClick: (e,t)=>{
                    t ? I().simulateMouseRightClick(t.x, t.y) : I().simulateMouseRightClick(),
                    e.returnValue = !0
                }
                ,
                simulateMouseDoubleClick: (e,t)=>{
                    t ? I().simulateMouseDoubleClick(t.x, t.y) : I().simulateMouseDoubleClick(),
                    e.returnValue = !0
                }
                ,
                simulateMouseMove: (e,t)=>{
                    t ? (I().simulateMouseMove(t.x, t.y),
                    e.returnValue = !0) : e.returnValue = !1
                }
                ,
                getCursorScreenPoint: e=>{
                    e.returnValue = t.screen.getCursorScreenPoint()
                }
                ,
                getPrimaryDisplay: e=>{
                    e.returnValue = t.screen.getPrimaryDisplay()
                }
                ,
                getAllDisplays: e=>{
                    e.returnValue = t.screen.getAllDisplays()
                }
                ,
                getDisplayNearestPoint: (e,i)=>{
                    e.returnValue = t.screen.getDisplayNearestPoint(i)
                }
                ,
                getDisplayMatching: (e,i)=>{
                    e.returnValue = t.screen.getDisplayMatching(i)
                }
                ,
                desktopCaptureSources: e=>t.desktopCapturer.getSources(e || {
                    types: ["screen", "window"]
                })
            }),
            this.config = e,
            this.idleUBrowserWindowIds = [],
            this.pluginsCmp = i,
            this.windowCmp = o,
            this.clipboardCmp = o.clipboardCmp,
            this.reportCmp = o.reportCmp,
            this.voiceCmp = s,
            this.accountCmp = a.accountCmp,
            this.dbCmp = a,
            this.screencaptureCmp = c,
            this.screencolorpickerCmp = h,
            this.helpbootCmp = p,
            this.windowCmp.pluginIsOutKill = this.pluginIsOutKill.bind(this),
            this.windowCmp.pluginIsEnterDetach = this.pluginIsEnterDetach.bind(this)
        }
        init(e) {
            this.initGlobalEvent(),
            this.appFirstRun(e),
            this.initFeatures(),
            this.initOutKillPluginDoc(),
            this.initEnterDetachPluginDoc(),
            this.pluginsCmp.on("mount", (e=>{
                this.initFeatures(e + "/")
            }
            )),
            this.dbCmp.on("switch", (()=>{
                for (const e in this.pluginsCmp.pluginContainer) {
                    if (!e)
                        continue;
                    if (e.startsWith("dev_")) {
                        delete this.pluginsCmp.pluginContainer[e];
                        continue
                    }
                    const t = this.pluginsCmp.pluginContainer[e].featureDic;
                    for (const e in t)
                        t[e].dynamic && delete t[e]
                }
                this.initFeatures().then((e=>{
                    e || this.windowCmp.refreshCmdSource()
                }
                )),
                this.initOutKillPluginDoc(),
                this.initEnterDetachPluginDoc(),
                this.windowCmp.killAllPlugins(!0)
            }
            )),
            this.dbCmp.on("pull", (e=>{
                const t = e.filter((e=>e._id.startsWith("feature/")));
                t.length > 0 && t.forEach((e=>{
                    if (!0 === e._deleted) {
                        const t = e._id.replace("feature/", "")
                          , i = t.indexOf("/");
                        this.pluginsCmp.removeFeature(t.substr(0, i), t.substr(i + 1))
                    } else
                        this.setPluginFeature(e.pluginId, e)
                }
                ));
                const i = e.filter((e=>e._id.startsWith("disablecmd/")));
                i.length > 0 && i.forEach((e=>{
                    !0 === e._deleted ? this.pluginsCmp.restoreDisabledCmd(e._id.substr(-32)) : this.pluginsCmp.disableCmd(e.pluginId, e.featureCode, e.cmdType, e.cmdLabel)
                }
                )),
                (t.length > 0 || i.length > 0) && this.windowCmp.refreshCmdSource(),
                e.find((e=>"outkillplugin" === e._id)) && this.initOutKillPluginDoc(),
                e.find((e=>"enterdetachplugin" === e._id)) && this.initEnterDetachPluginDoc()
            }
            )),
            this.initPluginRunAtAppOpen()
        }
        goHelp() {
            this.helpbootCmp.help()
        }
        appFirstRun(e) {
            if (e)
                return setImmediate((()=>{
                    this.helpbootCmp.boot()
                }
                ));
            setImmediate((async()=>{
                let e = await this.dbCmp.get("/", "appupdate");
                const i = t.app.getVersion();
                (!e || U().gt(i, e.version)) && (e || (e = {
                    _id: "appupdate"
                }),
                e.version = i,
                await this.dbCmp.put("/", e),
                this.helpbootCmp.help(i))
            }
            ))
        }
        initGlobalEvent() {
            t.app.on("exit", (()=>{
                this._exitApp || (this._exitApp = !0,
                t.app.removeAllListeners("before-quit"),
                this.windowCmp.isLinux || I().stopClipboardWatch(),
                I().stopVoicePanelTriggerEvent(),
                I().stopFKeyTapEvent(),
                t.globalShortcut.unregisterAll(),
                this.windowCmp.isMacOs && (I().panelRestoreToWindow(this.windowCmp.mainWindow.getNativeWindowHandle()),
                this.voiceCmp.voiceWindow && I().panelRestoreToWindow(this.voiceCmp.voiceWindow.getNativeWindowHandle()),
                t.app.dock.hide(),
                t.app.hide()),
                setTimeout((()=>{
                    t.webContents.getAllWebContents().forEach((e=>{
                        e.removeAllListeners("destroyed"),
                        e.removeAllListeners("render-process-gone")
                    }
                    )),
                    t.BrowserWindow.getAllWindows().forEach((e=>{
                        e.removeAllListeners("close"),
                        e.removeAllListeners("closed"),
                        e.setClosable(!0),
                        e.destroy()
                    }
                    )),
                    this.windowCmp.isWindow ? I().exit() : t.app.exit()
                }
                ), 300))
            }
            )),
            t.app.on("web-contents-created", ((e,i)=>{
                if (i.on("will-attach-webview", ((e,t,n)=>{
                    if (!this.windowCmp.getPluginIdByWebContents(i))
                        return e.preventDefault();
                    delete t.preload,
                    delete t.preloadURL,
                    delete t.affinity,
                    t.enableRemoteModule = !1,
                    t.webSecurity = !0,
                    t.nodeIntegration = !1
                }
                )),
                "webview" === i.getType()) {
                    if (i.session !== t.session.defaultSession)
                        return void i.destroy();
                    i.setWindowOpenHandler((({url: e})=>(/^https?:\/\//i.test(e) && i.executeJavaScript(`location.href=${JSON.stringify(e)}`),
                    {
                        action: "deny"
                    })))
                } else
                    i.setWindowOpenHandler((()=>({
                        action: "deny"
                    })))
            }
            )),
            t.nativeTheme.on("updated", (()=>{
                const e = this.windowCmp.getWindowBackgroundColor()
                  , t = this.windowCmp.mainWindow.getBackgroundColor();
                e !== t && (this.windowCmp.mainWindow.setBackgroundColor(e),
                this.voiceCmp.voiceWindow && this.voiceCmp.voiceWindow.setBackgroundColor(e),
                Object.values(this.windowCmp.runningPluginPool).forEach((t=>{
                    t.detachWindows && t.detachWindows.length > 0 && t.detachWindows.forEach((t=>{
                        t.isDestroyed() || t.setBackgroundColor(e)
                    }
                    ))
                }
                )))
            }
            )),
            t.session.defaultSession.setPermissionRequestHandler(((e,t,i)=>{
                i("openExternal" !== t)
            }
            ))
        }
        setPluginFeature(e, {code: t, cmds: i, explain: n, icon: o, platform: s}) {
            const r = this.pluginsCmp.setFeature(e, {
                code: t,
                cmds: i,
                explain: n,
                icon: o,
                platform: s
            }, !0);
            return r && o && o.startsWith("dbicon://") && this.windowCmp.removeDbIconCache("feature/" + e + "/" + t),
            r
        }
        async initFeatures(e) {
            const t = await this.getFeatures(e);
            t.length > 0 && t.forEach((e=>{
                this.setPluginFeature(e.pluginId, e)
            }
            ));
            const i = await this.initDisableCmds(e);
            return !!(t.length > 0 || i) && (this.windowCmp.refreshCmdSource(),
            !0)
        }
        async saveFeature(e, i) {
            if ("object" != typeof i)
                throw new Error('params "feature" not object type');
            if (!i.code || "string" != typeof i.code)
                throw new Error("feature code error");
            if (!Array.isArray(i.cmds) || 0 === i.cmds.length)
                throw new Error("feature cmds error");
            if (!i.explain || "string" != typeof i.explain)
                throw new Error("feature explain empty");
            if (!(e in this.pluginsCmp.pluginContainer))
                throw new Error("plugin id error");
            const n = {
                _id: "feature/" + e + "/" + i.code,
                pluginId: e
            };
            if (n.code = i.code,
            n.cmds = i.cmds,
            n.explain = i.explain,
            i.platform) {
                if ("string" == typeof i.platform) {
                    if (!["win32", "darwin", "linux"].includes(i.platform))
                        throw new Error("feature platform error")
                } else {
                    if (!Array.isArray(i.platform))
                        throw new Error("feature platform error");
                    for (const e of i.platform)
                        if (!["win32", "darwin", "linux"].includes(e))
                            throw new Error("feature platform error")
                }
                n.platform = i.platform
            }
            if (i.icon && "string" == typeof i.icon)
                if (i.icon.startsWith("data:image/")) {
                    let e = t.nativeImage.createFromDataURL(i.icon);
                    if (e.isEmpty())
                        delete i.icon;
                    else {
                        const t = e.getSize();
                        (t.width > 72 || t.height > 72) && (e = t.height > t.width ? e.resize({
                            height: 72
                        }) : e.resize({
                            width: 72
                        })),
                        n._attachments = {
                            icon: {
                                content_type: "image/png",
                                data: e.toPNG()
                            }
                        },
                        n.icon = i.icon = "dbicon://" + n._id
                    }
                } else
                    u().existsSync(l().join(this.pluginsCmp.pluginContainer[e].location, i.icon)) ? n.icon = i.icon : delete i.icon;
            else
                delete i.icon;
            const o = await this.dbCmp.get("/", n._id);
            o && (n._rev = o._rev);
            const s = await this.dbCmp.put("/", n, !1);
            if (s.error)
                throw new Error("doc save fail - " + s.message)
        }
        async removeFeature(e, t) {
            const i = "feature/" + e + "/" + t;
            return !(await this.dbCmp.remove("/", i)).error
        }
        async getFeatures(e="", t) {
            let i;
            return e && t ? (Array.isArray(t) || (t = [String(t)]),
            i = await this.dbCmp.allDocs("/", t.map((t=>"feature/" + e + t)))) : i = await this.dbCmp.allDocs("/", "feature/" + e),
            i
        }
        async getDisableCmds(e="") {
            return await this.dbCmp.allDocs("/", "disablecmd/" + e)
        }
        async initDisableCmds(e) {
            const t = await this.getDisableCmds(e);
            return 0 !== t.length && (t.forEach((e=>{
                this.pluginsCmp.disableCmd(e.pluginId, e.featureCode, e.cmdType, e.cmdLabel)
            }
            )),
            !0)
        }
        async addDisableCmd(e, t, i, n) {
            const o = this.pluginsCmp.disableCmd(e, t, i, n);
            if (!o)
                return null;
            this.windowCmp.refreshCmdSource();
            const s = {
                _id: "disablecmd/" + e + "/" + o,
                pluginId: e,
                featureCode: t,
                cmdType: i,
                cmdLabel: n
            }
              , r = await this.dbCmp.put("/", s);
            return r.error ? null : r.id
        }
        async removeDisableCmd(e) {
            if (!e.startsWith("disablecmd/"))
                return !1;
            const t = await this.dbCmp.get("/", e);
            return !!t && (!this.dbCmp.remove("/", t).error && (this.pluginsCmp.restoreDisabledCmd(t._id.substr(-32)) && this.windowCmp.refreshCmdSource(),
            !0))
        }
        async initOutKillPluginDoc() {
            const e = await this.dbCmp.get("/", "outkillplugin");
            this.outKillPluginDoc = e || {
                _id: "outkillplugin",
                data: []
            }
        }
        async addOutKillPlugin(e) {
            if (this.outKillPluginDoc.data.includes(e))
                return;
            this.outKillPluginDoc.data.push(e);
            const t = await this.dbCmp.put("/", this.outKillPluginDoc);
            t.ok ? (this.outKillPluginDoc._id = t.id,
            this.outKillPluginDoc._rev = t.rev) : this.initOutKillPluginDoc()
        }
        async removeOutKillPlugin(e) {
            if (!this.outKillPluginDoc.data.includes(e))
                return;
            this.outKillPluginDoc.data.splice(this.outKillPluginDoc.data.indexOf(e), 1);
            const t = await this.dbCmp.put("/", this.outKillPluginDoc);
            t.ok ? (this.outKillPluginDoc._id = t.id,
            this.outKillPluginDoc._rev = t.rev) : this.initOutKillPluginDoc()
        }
        pluginIsOutKill(e) {
            return this.outKillPluginDoc && this.outKillPluginDoc.data.includes(e)
        }
        async initEnterDetachPluginDoc() {
            const e = await this.dbCmp.get("/", "enterdetachplugin");
            this.enterDetachPluginDoc = e || {
                _id: "enterdetachplugin",
                data: []
            }
        }
        async addEnterDetachPlugin(e) {
            if (this.enterDetachPluginDoc.data.includes(e))
                return;
            this.enterDetachPluginDoc.data.push(e);
            const t = await this.dbCmp.put("/", this.enterDetachPluginDoc);
            t.ok ? (this.enterDetachPluginDoc._id = t.id,
            this.enterDetachPluginDoc._rev = t.rev) : this.initEnterDetachPluginDoc()
        }
        async removeEnterDetachPlugin(e) {
            if (!this.enterDetachPluginDoc.data.includes(e))
                return;
            this.enterDetachPluginDoc.data.splice(this.enterDetachPluginDoc.data.indexOf(e), 1);
            const t = await this.dbCmp.put("/", this.enterDetachPluginDoc);
            t.ok ? (this.enterDetachPluginDoc._id = t.id,
            this.enterDetachPluginDoc._rev = t.rev) : this.initEnterDetachPluginDoc()
        }
        pluginIsEnterDetach(e) {
            return this.enterDetachPluginDoc && this.enterDetachPluginDoc.data.includes(e)
        }
        async initPluginRunAtAppOpen() {
            const e = await this.dbCmp.get("/", "pluginrunatappopen");
            e && Array.isArray(e.data) && e.data.forEach((e=>{
                const t = this.pluginsCmp.pluginContainer[e];
                t && !t.illegal && (this.pluginIsOutKill(e) || this.windowCmp.assemblyPlugin(t))
            }
            ))
        }
        async addPluginRunAtAppOpen(e) {
            let t = await this.dbCmp.get("/", "pluginrunatappopen");
            return t || (t = {
                _id: "pluginrunatappopen",
                data: []
            }),
            !!t.data.includes(e) || (t.data.push(e),
            !!(await this.dbCmp.put("/", t)).ok)
        }
        async removePluginRunAtAppOpen(e) {
            const t = await this.dbCmp.get("/", "pluginrunatappopen");
            if (!t)
                return !1;
            const i = t.data.indexOf(e);
            return -1 !== i && (t.data.splice(i, 1),
            0 === t.data.length ? !!(await this.dbCmp.remove("/", t)).ok : !!(await this.dbCmp.put("/", t)).ok)
        }
        async getIsPluginRunAtAppOpen(e) {
            const t = await this.dbCmp.get("/", "pluginrunatappopen");
            return t && t.data.includes(e)
        }
        async initLocalOpenFeatures() {
            if (!n().get("enableNativeApp"))
                return;
            const e = await this.getLocalOpenDoc();
            0 !== e.files.length && this.setLocalOpenFeatures(e.files)
        }
        async getLocalOpenDoc() {
            return await this.dbCmp.get("/", "localopen/" + this.accountCmp.nativeId) || {
                _id: "localopen/" + this.accountCmp.nativeId,
                files: []
            }
        }
        getNativeIconUrl(e) {
            if (!e || "string" != typeof e)
                return "nativeicon://unknow";
            if ("folder" === e.toLowerCase())
                return this.windowCmp.isLinux ? this.folderIconPath ? (0,
                d.pathToFileURL)(this.folderIconPath).href : "nativeicon://unknow" : "nativeicon://folder";
            if (e.startsWith("."))
                return "nativeicon://" + e.toLowerCase();
            if (!u().existsSync(e))
                return "nativeicon://unknow";
            let t = !1;
            try {
                t = x().lstatSync(e).isDirectory()
            } catch (e) {}
            if (t)
                return this.windowCmp.isLinux ? this.folderIconPath ? (0,
                d.pathToFileURL)(this.folderIconPath).href : "nativeicon://unknow" : this.windowCmp.isMacOs && /\.app$/i.test(e) ? "nativeicon://" + e : "nativeicon://folder";
            const i = l().parse(l().basename(e)).ext.toLowerCase();
            return this.windowCmp.isWindow && [".exe", ".lnk", ".appref-ms", ".url"].includes(i) ? "nativeicon://" + e : "nativeicon://" + (i || "unknow")
        }
        convertLocalOpenFeature(e) {
            let t = !1;
            try {
                t = x().lstatSync(e).isDirectory()
            } catch (e) {}
            return {
                code: Ke + e,
                explain: e,
                icon: this.getNativeIconUrl(e),
                cmds: [t ? l().basename(e) : l().parse(l().basename(e)).name]
            }
        }
        setLocalOpenFeatures(e) {
            const t = this.pluginsCmp.pluginContainer[""];
            0 !== (e = e.filter((e=>!(e in t.featureDic)))).length && e.forEach((e=>{
                if (!x().existsSync(e))
                    return;
                const t = this.convertLocalOpenFeature(e);
                this.pluginsCmp.setFeature("", t)
            }
            ))
        }
        async addLocalOpen(e) {
            if (!Array.isArray(e) || 0 === e.length)
                return;
            const t = await this.getLocalOpenDoc();
            return 0 !== (e = e.filter((e=>!t.files.includes(e)))).length ? (t.files.push(...e),
            (await this.dbCmp.put("/", t)).error ? void 0 : (n().get("enableNativeApp") && (this.setLocalOpenFeatures(e),
            this.windowCmp.refreshCmdSource()),
            !0)) : void 0
        }
        async removeLocalOpen(e) {
            if (!Array.isArray(e) || 0 === e.length)
                return;
            const t = await this.getLocalOpenDoc();
            if (0 === t.files.length)
                return;
            let i;
            if (t.files = t.files.filter((t=>!e.includes(Ke + t))),
            i = 0 === t.files.length ? await this.dbCmp.remove("/", t) : await this.dbCmp.put("/", t),
            i.error)
                return;
            const n = this.pluginsCmp.pluginContainer[""].featureDic
              , o = e.filter((e=>e in n));
            return o.length > 0 && (o.forEach((e=>{
                delete n[e]
            }
            )),
            this.windowCmp.refreshCmdSource()),
            !0
        }
        showNotification(e, {body: i, clickFeatureCode: n}) {
            if (!t.Notification.isSupported())
                return;
            "string" != typeof i && (i = String(i));
            const o = this.pluginsCmp.pluginContainer[e];
            if (!o)
                return;
            const s = new t.Notification({
                title: o.pluginName,
                body: i,
                icon: (0,
                d.fileURLToPath)(o.logo)
            });
            if (n && n in o.featureDic) {
                const e = o.featureDic[n].cmds.find((e=>"base" === e.type));
                if (e) {
                    const t = o.name
                      , i = e.label;
                    s.on("click", (()=>{
                        setImmediate((()=>{
                            this.windowCmp.autoLoadPlugin(t, n, i)
                        }
                        ))
                    }
                    ))
                }
            }
            s.show()
        }
        showNativeWorkWindowInfo(e) {
            if (this.windowCmp.hideMainWindow(!1),
            !(e = e || this.windowCmp.display.nativeWorkWindowInfo))
                return void new t.Notification({
                    body: "未捕获到当前窗口信息"
                }).show();
            const i = new t.BrowserWindow({
                frame: !1,
                alwaysOnTop: !0,
                fullscreenable: !1,
                minimizable: !1,
                maximizable: !1,
                width: 600,
                height: 500,
                title: "当前工作窗口信息",
                skipTaskbar: !0,
                autoHideMenuBar: !0,
                backgroundColor: this.windowCmp.getWindowBackgroundColor(),
                opacity: .86,
                webPreferences: {
                    nodeIntegration: !1,
                    sandbox: !1,
                    enableRemoteModule: !1,
                    backgroundThrottling: !1,
                    navigateOnDragDrop: !1,
                    spellcheck: !1
                }
            });
            i.removeMenu(),
            i.on("blur", (()=>{
                i.destroy()
            }
            )),
            i.webContents.on("before-input-event", ((e,t)=>{
                "keyDown" === t.type && "Escape" === t.code && i.destroy()
            }
            )),
            i.loadFile(l().join(__dirname, "windowinfo", "index.html"), {
                search: "data=" + encodeURIComponent(JSON.stringify(e))
            })
        }
        getWindowsExplorerCurrentDirctoryPath(e) {
            const t = I().getExplorerWindowsForDirectoryPath(e.id);
            if (0 === t.length)
                return;
            let i;
            if (1 === t.length)
                i = t[0].locationUrl;
            else {
                const n = t.filter((t=>t.locationName === e.title));
                n.length > 0 && (1 === n.length || 1 === new Set(n.map((e=>e.locationUrl))).size) && (i = n[0].locationUrl)
            }
            return i ? l().resolve(decodeURI(i.replace(/^file:\/\/\//, ""))) : void 0
        }
        readCurrentFolderPath() {
            return new Promise(((e,i)=>{
                const n = this.windowCmp.display.nativeWorkWindowInfo;
                if (!n)
                    return i(new Error("未识别到当前活动窗口"));
                if (this.windowCmp.isWindow) {
                    if (!["explorer.exe", "SearchApp.exe", "SearchHost.exe", "FESearchHost.exe"].includes(n.app))
                        return i(new Error('当前活动窗口非 "文件资源管理器" 窗口'));
                    if ("CabinetWClass" === n.class || "ExploreWClass" === n.class) {
                        const t = this.getWindowsExplorerCurrentDirctoryPath(n);
                        return t ? e(t) : i(new Error('未读取到当前 "文件资源管理器" 窗口目录'))
                    }
                    return "Progman" === n.class || "WorkerW" === n.class ? e(t.app.getPath("desktop")) : i(new Error('当前活动窗口类 "' + n.class + '" 未识别'))
                }
                return this.windowCmp.isMacOs ? "com.apple.finder" !== n.bundleId ? i(new Error('当前活动窗口非 "访达" 窗口')) : void Re().exec("osascript -e 'tell application \"Finder\" to get the POSIX path of (target of front window as alias)'", {
                    encoding: "utf8"
                }, ((t,n,o)=>{
                    if (t) {
                        const e = o.replace(/^\d+:\d+: execution error:/, "").replace(/\(-?\d+\)\s*$/, "").trim();
                        return i(new Error(e))
                    }
                    return e(n.trim().replace(/\/$/, ""))
                }
                )) : i(new Error("该平台不支持"))
            }
            ))
        }
        readCurrentBrowserUrl() {
            return new Promise(((e,t)=>{
                const i = this.windowCmp.display.nativeWorkWindowInfo;
                if (!i)
                    return t(new Error("未识别到当前活动窗口"));
                if (this.windowCmp.isWindow) {
                    if (!/^(chrome|firefox|MicrosoftEdge|iexplore|opera|brave|msedge)\.exe$/.test(i.app))
                        return t(new Error("当前活动窗口非可识别浏览器"));
                    const n = RegExp.$1.toLowerCase();
                    I().readBrowserWindowUrl(n, i.id, (o=>{
                        if (!o)
                            return "chrome" === n ? void setTimeout((()=>{
                                I().readBrowserWindowUrl(n, i.id, (i=>{
                                    if (i)
                                        return e(i);
                                    t(new Error("未读取到 URL"))
                                }
                                ))
                            }
                            ), 50) : t(new Error("未读取到 URL"));
                        e(o)
                    }
                    ))
                } else {
                    if (!this.windowCmp.isMacOs)
                        return t(new Error("该平台不支持"));
                    {
                        if (!["com.apple.Safari", "com.google.Chrome", "com.microsoft.edgemac", "com.operasoftware.Opera", "com.vivaldi.Vivaldi", "com.brave.Browser"].includes(i.bundleId))
                            return t(new Error("当前活动窗口非可识别浏览器"));
                        let n;
                        n = "com.apple.Safari" === i.bundleId ? 'tell application "Safari" to return URL of front document' : `tell application "${i.app}" to return URL of active tab of front window`,
                        Re().exec(`osascript -e '${n}'`, {
                            encoding: "utf8"
                        }, ((i,n,o)=>{
                            if (i) {
                                const e = o.replace(/^\d+:\d+: execution error:/, "").replace(/\(-?\d+\)\s*$/, "").trim();
                                return t(new Error(e))
                            }
                            return e(n.trim())
                        }
                        ))
                    }
                }
            }
            ))
        }
        redirect({label: e, payload: i}) {
            if (!e)
                throw new Error("搜索关键字为空");
            do {
                if (!i) {
                    i = null;
                    break
                }
                if ("string" == typeof i) {
                    i = {
                        type: "text",
                        data: i
                    };
                    break
                }
                if ("object" != typeof i)
                    throw new Error("参数错误");
                if (i = {
                    type: i.type,
                    data: i.data
                },
                !["text", "files", "img"].includes(i.type) || !i.data)
                    throw new Error("参数错误");
                if ("text" === i.type && ("string" != typeof i.data || !i.data))
                    throw new Error("参数错误");
                if ("files" === i.type) {
                    if ("string" == typeof i.data) {
                        if (!x().existsSync(i.data))
                            throw new Error("文件不存在");
                        try {
                            const e = x().lstatSync(i.data);
                            i.data = [{
                                isFile: e.isFile(),
                                isDirectory: e.isDirectory(),
                                name: l().basename(i.data),
                                path: i.data
                            }]
                        } catch (e) {
                            throw new Error("文件不存在")
                        }
                        break
                    }
                    if (Array.isArray(i.data)) {
                        const e = [];
                        if (i.data.forEach((t=>{
                            if (x().existsSync(t))
                                try {
                                    const i = x().lstatSync(t);
                                    e.push({
                                        isFile: i.isFile(),
                                        isDirectory: i.isDirectory(),
                                        name: l().basename(t),
                                        path: t
                                    })
                                } catch (e) {}
                        }
                        )),
                        0 === e.length)
                            throw new Error("集合文件都不存在");
                        i.data = e;
                        break
                    }
                    throw new Error("参数错误")
                }
                if ("img" === i.type) {
                    if ("string" == typeof i.data) {
                        if (i.data.startsWith("data:image/"))
                            break;
                        if (/\.(jpg|jpeg|png|bmp)$/i.test(i.data) && x().existsSync(i.data)) {
                            const e = t.nativeImage.createFromPath(i.data);
                            if (e.isEmpty())
                                throw new Error("图片为空");
                            i.data = e.toDataURL();
                            break
                        }
                        throw new Error("图片格式错误")
                    }
                    if ("object" == typeof i.data && i.data instanceof Uint8Array) {
                        const e = t.nativeImage.createFromBuffer(Buffer.from(i.data));
                        if (e.isEmpty())
                            throw new Error("图片为空");
                        i.data = e.toDataURL();
                        break
                    }
                    throw new Error("参数错误")
                }
            } while (0);
            this.windowCmp.mainWindow.isVisible() || this.windowCmp.display.trigger(!0),
            this.windowCmp.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.redirectFeature(${JSON.stringify({
                label: e,
                payload: i
            })})`).then((i=>{
                i || (this.windowCmp.ffffffff.goPluginStore(e),
                new t.Notification({
                    title: "uTools",
                    body: '未匹配到 "' + e + '" 作为关键字的插件应用，已自动跳转到插件应用市场搜索'
                }).show())
            }
            ))
        }
    }
    class Je {
        constructor(e, t) {
            var i, n;
            n = {
                getAllFeatureHotKey: e=>{
                    e.returnValue = Object.values(this.featureHotKeyDic)
                }
                ,
                createFeatureHotKey: e=>{
                    this.createItem(),
                    e.returnValue = !0
                }
                ,
                deleteFeatureHotKey: async(e,t)=>{
                    e.returnValue = await this.deleteItem(t)
                }
                ,
                updateFeatureHotKeyHotKey: async(e,t,i)=>{
                    e.returnValue = await this.updateItemHotKey(t, i)
                }
                ,
                updateFeatureHotKeyCmd: async(e,t,i)=>{
                    e.returnValue = await this.updateItemCmd(t, i)
                }
                ,
                updateFeatureHotKeyAutocopy: async(e,t,i)=>{
                    e.returnValue = await this.updateItemAutocopy(t, i)
                }
            },
            (i = "ffffffffServices")in this ? Object.defineProperty(this, i, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : this[i] = n,
            this.windowCmp = e,
            this.clipboardCmp = e.clipboardCmp,
            this.dbCmp = t,
            this.featureHotKeyDic = {}
        }
        init() {
            this.initFeatureHotKey(),
            this.dbCmp.on("switch", (()=>{
                Object.values(this.featureHotKeyDic).forEach((e=>{
                    e.hotkey && this.unregisterHotKey(e.hotkey)
                }
                )),
                this.featureHotKeyDic = {},
                this.initFeatureHotKey()
            }
            )),
            this.dbCmp.on("pull", (e=>{
                const t = e.filter((e=>e._id.startsWith("featurehotkey/")));
                0 !== t.length && t.forEach((e=>{
                    const t = e._id;
                    if (!0 === e._deleted) {
                        if (!this.featureHotKeyDic[t])
                            return;
                        this.removeFeatureHotKey(t),
                        delete this.featureHotKeyDic[t]
                    } else {
                        if (t in this.featureHotKeyDic)
                            return void (this.featureHotKeyDic[t].hotkey === e.hotkey ? this.featureHotKeyDic[t] = {
                                ...e,
                                _id: t
                            } : (this.removeFeatureHotKey(t),
                            this.featureHotKeyDic[t] = {
                                ...e,
                                _id: t
                            },
                            this.setFeatureHotKey(t, e.hotkey)));
                        this.featureHotKeyDic[t] = {
                            ...e,
                            _id: t
                        },
                        this.setFeatureHotKey(t, e.hotkey)
                    }
                }
                ))
            }
            ))
        }
        async initFeatureHotKey() {
            const e = await this.dbCmp.allDocs("/", "featurehotkey/");
            0 !== e.length && e.forEach((e=>{
                !0 === e.hotkey && (e.hotkey = ""),
                this.featureHotKeyDic[e._id] = e,
                this.setFeatureHotKey(e._id, e.hotkey)
            }
            ))
        }
        registerHotKey(e, i) {
            const o = B(e);
            if (o !== n().get("showHotKey"))
                if (Me.isFKey(o))
                    Me.register(o, i);
                else
                    try {
                        t.globalShortcut.isRegistered(o) && t.globalShortcut.unregister(o),
                        t.globalShortcut.register(o, i)
                    } catch (e) {}
        }
        unregisterHotKey(e) {
            const i = B(e);
            Me.isFKey(i) ? Me.unregister(i) : t.globalShortcut.isRegistered(i) && t.globalShortcut.unregister(i)
        }
        rendererAutoTextCmd(e, t) {
            this.windowCmp.mainWindow.isVisible() || this.windowCmp.display.setNativeWorkWindowInfo();
            const i = this.windowCmp.display.nativeWorkWindowInfo;
            this.windowCmp.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.autoTextCmd(${JSON.stringify({
                cmd: e,
                wininfo: i,
                isPreCopy: t
            })})`).then((e=>{
                e && this.windowCmp.display.trigger(!0)
            }
            ))
        }
        setFeatureHotKey(e, t) {
            t && this.registerHotKey(t, (()=>{
                const t = this.featureHotKeyDic[e];
                t && (this.callHotkeyRuningTimeout || (t.autocopy ? this.callHotkeyRuningTimeout = setTimeout((()=>{
                    if (this.clipboardCmp.isPreCopy())
                        return this.rendererAutoTextCmd(t.cmd, !0),
                        void setTimeout((()=>{
                            this.callHotkeyRuningTimeout = null
                        }
                        ), 250);
                    const e = ()=>{
                        const e = I().getClipboardChangeCount();
                        this.windowCmp.isWindow ? I().simulateKeyboardTap("c", "ctrl") : this.windowCmp.isMacOs ? I().simulateKeyboardTap("c", "command") : this.windowCmp.isLinux && I().simulateKeyboardTap("c", "ctrl"),
                        setTimeout((()=>{
                            const i = I().getClipboardChangeCount() > e;
                            this.rendererAutoTextCmd(t.cmd, i),
                            setTimeout((()=>{
                                this.callHotkeyRuningTimeout = null
                            }
                            ), 250)
                        }
                        ), 50)
                    }
                    ;
                    /^F\d{1,2}$/.test(t.hotkey) ? e() : setTimeout(e, 250)
                }
                ), 50) : this.callHotkeyRuningTimeout = setTimeout((()=>{
                    this.rendererAutoTextCmd(t.cmd, this.clipboardCmp.isPreCopy()),
                    setTimeout((()=>{
                        this.callHotkeyRuningTimeout = null
                    }
                    ), 250)
                }
                ), 50)))
            }
            ))
        }
        removeFeatureHotKey(e) {
            const t = this.featureHotKeyDic[e];
            if (!t)
                return;
            const i = Object.values(this.featureHotKeyDic).find((e=>e !== t && e.hotkey === t.hotkey));
            i ? this.setFeatureHotKey(i._id, i.hotkey) : this.unregisterHotKey(t.hotkey)
        }
        createItem() {
            const e = "featurehotkey/" + Date.now();
            this.featureHotKeyDic[e] = {
                _id: e,
                hotkey: "",
                cmd: ""
            }
        }
        async deleteItem(e) {
            const t = this.featureHotKeyDic[e];
            return !!t && (t.hotkey ? (this.removeFeatureHotKey(e),
            !(await this.dbCmp.remove("/", e)).error && (delete this.featureHotKeyDic[e],
            !0)) : (delete this.featureHotKeyDic[e],
            !0))
        }
        async updateItemHotKey(e, t) {
            if ("string" != typeof t)
                return !1;
            const i = this.featureHotKeyDic[e];
            if (!i)
                return !1;
            if (Object.values(this.featureHotKeyDic).find((e=>e.hotkey === t)))
                return !1;
            i.hotkey && this.removeFeatureHotKey(e),
            i.hotkey = t;
            const n = await this.dbCmp.put("/", i);
            return i._id = n.id,
            !n.error && (i._rev = n.rev,
            this.setFeatureHotKey(e, i.hotkey),
            !0)
        }
        async updateItemCmd(e, t) {
            if ("string" != typeof t)
                return !1;
            const i = this.featureHotKeyDic[e];
            if (!i)
                return !1;
            if (!i.hotkey)
                return !1;
            i.cmd = t;
            const n = await this.dbCmp.put("/", i);
            return i._id = n.id,
            !n.error && (i._rev = n.rev,
            !0)
        }
        async updateItemAutocopy(e, t) {
            const i = this.featureHotKeyDic[e];
            if (!i)
                return !1;
            if (!i.hotkey)
                return !1;
            i.autocopy = !0 === t;
            const n = await this.dbCmp.put("/", i);
            return i._id = n.id,
            !n.error && (i._rev = n.rev,
            !0)
        }
    }
    function $e(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class qe {
        constructor(e, i, o) {
            $e(this, "initDefaultPanelMenus", (async()=>{
                const e = this.windowCmp.pluginsCmp.pluginContainer
                  , t = []
                  , i = "panelmenus/"
                  , n = Date.now().toString().substring(0, 11);
                let o = 0;
                ["uTools 介绍", "截图", "取色", "显示桌面", "锁屏", "窗口截图", {
                    label: "剪贴板",
                    pluginId: "clipboard"
                }, {
                    label: "计算稿纸",
                    pluginId: "calc"
                }, {
                    label: "截图文字识别",
                    pluginId: "ocr"
                }, {
                    label: "翻译",
                    pluginId: "translate"
                }, {
                    label: "搜索",
                    pluginId: "everythingfind"
                }, {
                    label: "快贴",
                    pluginId: "collection"
                }, {
                    label: "Markdown 笔记",
                    pluginId: "notes"
                }, {
                    label: "百度",
                    pluginId: "quickweb"
                }, {
                    label: "网页快开",
                    pluginId: "quickweb"
                }, {
                    label: "密码管理",
                    pluginId: "upassword"
                }].forEach((s=>{
                    o++;
                    const r = parseInt(n + (o < 10 ? "0" + o : o));
                    "string" != typeof s ? s.pluginId in e && (s._id = i + M(s.pluginId + "/" + s.label),
                    s.createAt = r,
                    t.push(s)) : t.push({
                        _id: i + M("/" + s),
                        pluginId: "",
                        label: s,
                        createAt: r
                    })
                }
                )),
                await this.dbCmp.bulkDocs("/", t)
            }
            )),
            $e(this, "getPanelMenusDocs", (async()=>{
                if (!this.panelMenusDocsCache) {
                    let e = await this.dbCmp.allDocs("/", "panelmenus/");
                    0 === e.length && (await this.initDefaultPanelMenus(),
                    e = await this.dbCmp.allDocs("/", "panelmenus/")),
                    e = e.sort(((e,t)=>e.createAt - t.createAt));
                    const t = await this.dbCmp.get("/", "panelmenusort");
                    t && Array.isArray(t.value) && (e = e.sort(((e,i)=>{
                        let n = t.value.indexOf(e._id);
                        -1 === n && (n = 999999);
                        let o = t.value.indexOf(i._id);
                        return -1 === o && (o = 999999),
                        n - o
                    }
                    ))),
                    this.panelMenusDocsCache = e
                }
                return this.panelMenusDocsCache
            }
            )),
            $e(this, "win32MouseButtonDownCall", ((e,i)=>{
                if (!this.voiceWindow.isVisible())
                    return void I().stopMouseButtonDownEvent();
                const n = t.screen.screenToDipPoint({
                    x: e,
                    y: i
                })
                  , o = this.voiceWindow.getBounds();
                (n.x < o.x || n.x > o.x + o.width || n.y < o.y || n.y > o.y + o.height) && this.triggerEmpty()
            }
            )),
            $e(this, "_savePanelMenuSort", (async e=>{
                let t = await this.dbCmp.get("/", "panelmenusort");
                t || (t = {
                    _id: "panelmenusort"
                }),
                t.value = e.map((e=>e._id)),
                await this.dbCmp.put("/", t)
            }
            )),
            $e(this, "voiceServices", {
                getXFAuthStr: (e,t)=>{
                    const i = `api_key="8b3ee022a0035a9d2edc93a67c606eca", algorithm="hmac-sha256", headers="host date request-line", signature="${I().xfSignature(`host: iat-api.xfyun.cn\ndate: ${t}\nGET /v2/iat HTTP/1.1`).toString("base64")}"`;
                    e.returnValue = Buffer.from(i).toString("base64")
                }
                ,
                setWindowBounds: (e,t,i)=>{
                    this.setWindowBounds(t, i),
                    e.returnValue = !0
                }
                ,
                windowFocus: e=>{
                    this.windowCmp.isWindow && (this.voiceWindow.isFocusable() || (this.voiceWindow.setFocusable(!0),
                    this.voiceWindow.show())),
                    e.returnValue = !0
                }
                ,
                triggerHide: (e,t)=>{
                    this.triggerHide(t),
                    e.returnValue = !0
                }
                ,
                isSimulateCopyForClipboardUpdate: e=>{
                    e.returnValue = I().getClipboardChangeCount() > this._simulateCopyClipboardChangeCount
                }
                ,
                enterPlugin: (e,t,i)=>{
                    this.windowCmp.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.setEnterFeatureCmd(${JSON.stringify(t)})`).then((()=>{
                        this.windowCmp.enterPlugin(t.pluginId, t.featureCode, i)
                    }
                    ))
                }
                ,
                voiceTextInput: (e,i)=>{
                    this.reportCmp.info("voice.input"),
                    this.windowCmp.isLinux ? (this.clipboardCmp.temporaryCancelWatch(),
                    t.clipboard.writeText(i),
                    I().simulateKeyboardTap("v", "ctrl")) : [...(new Intl.Segmenter).segment(i)].forEach((e=>{
                        I().unicodeType(e.segment)
                    }
                    ))
                }
                ,
                getCNPinyin: (e,t)=>{
                    e.returnValue = te(t)
                }
                ,
                showMainWindowToInput: ()=>{
                    this.voiceWindow.hide(),
                    this.windowCmp.restoreShowMainWindow(!0)
                }
                ,
                translate: async e=>{
                    const t = this.accountCmp.getAccountToken();
                    try {
                        const i = await f(this.config.translateURL + (t || ""), {
                            body: e,
                            mid: this.accountCmp.machineId,
                            nid: this.accountCmp.nativeId
                        });
                        return i.translated.toLowerCase() !== e.toLowerCase() && {
                            status: "ok",
                            translated: i.translated.replace(/^\s*[\r\n]/gm, this.windowCmp.isWindow ? "\n" : "")
                        }
                    } catch (e) {
                        return 403 === e.code && {
                            status: "member",
                            message: e.message
                        }
                    }
                }
                ,
                getPanelMenusDocs: this.getPanelMenusDocs,
                joinPanelMenusFolder: async(e,t)=>{
                    const i = await this.getPanelMenusDocs();
                    this.panelMenusDocsCache = null;
                    const n = i.find((t=>t.pluginId === e.pluginId && t.label === e.label));
                    if (!n)
                        throw new Error('"' + e.label + '" 不存在');
                    const o = i.find((e=>e.pluginId === t.pluginId && e.label === t.label));
                    if (!o)
                        throw new Error('"' + t.label + '" 不存在');
                    const s = n.parent;
                    let r, a;
                    if (o.parent && (r = i.find((e=>e._id === o.parent))),
                    r) {
                        if (n.parent = r._id,
                        a = await this.dbCmp.put("/", n),
                        a.error)
                            throw new Error("存储失败")
                    } else {
                        if (r = {
                            _id: "panelmenus/" + Date.now(),
                            label: "",
                            isFolder: !0,
                            createAt: Date.now()
                        },
                        a = await this.dbCmp.put("/", r),
                        a.error)
                            throw new Error("存储失败");
                        n.parent = r._id,
                        o.parent = r._id,
                        await this.dbCmp.bulkDocs("/", [n, o])
                    }
                    if (s) {
                        const e = i.filter((e=>e.parent === s));
                        if (e.length < 2) {
                            1 === e.length && (delete e[0].parent,
                            await this.dbCmp.put("/", e[0]));
                            const t = i.find((e=>e._id === s));
                            t && (await this.dbCmp.remove("/", t),
                            i.splice(i.indexOf(t), 1))
                        }
                    }
                    i.splice(i.indexOf(n), 1);
                    const c = i.filter((e=>e.parent === r._id))
                      , l = i.indexOf(c[0]);
                    if (c.length > 0) {
                        for (let e = 0; e < c.length; e++) {
                            const t = i.indexOf(c[e]);
                            t !== l + e && (i.splice(t, 1),
                            i.splice(l + e, 0, c[e]))
                        }
                        i.splice(l + c.length, 0, n)
                    }
                    return await this._savePanelMenuSort(i),
                    i.includes(r) || i.push(r),
                    i
                }
                ,
                sortPanelMenus: async(e,t)=>{
                    const i = await this.getPanelMenusDocs();
                    this.panelMenusDocsCache = null;
                    const n = i.find((t=>t.pluginId === e.pluginId && t.label === e.label));
                    if (!n)
                        throw new Error('"' + e.label + '" 不存在');
                    const o = i.find((e=>e.pluginId === t.pluginId && e.label === t.label));
                    if (!o)
                        throw new Error('"' + t.label + '" 不存在');
                    if (n.parent && o.parent && n.parent === o.parent) {
                        const e = i.indexOf(n)
                          , t = i.indexOf(o);
                        i.splice(e, 1),
                        i.splice(t, 0, n)
                    } else {
                        let e, t;
                        e = n.parent ? i.filter((e=>e.parent === n.parent)) : [n],
                        t = o.parent ? i.findIndex((e=>e.parent === o.parent)) : i.indexOf(o);
                        for (let n = 0; n < e.length; n++) {
                            const o = i.indexOf(e[n]);
                            o !== t + n && (i.splice(o, 1),
                            i.splice(t + n, 0, e[n]))
                        }
                    }
                    return await this._savePanelMenuSort(i),
                    i
                }
                ,
                outPanelMenusFolder: async e=>{
                    const t = await this.getPanelMenusDocs();
                    this.panelMenusDocsCache = null;
                    const i = t.find((t=>t.pluginId === e.pluginId && t.label === e.label));
                    if (!i)
                        throw new Error('"' + e.label + '" 不存在');
                    const n = i.parent;
                    if (!n)
                        throw new Error("parent 为空");
                    const o = t.filter((e=>e.parent === n));
                    if (delete i.parent,
                    (await this.dbCmp.put("/", i)).error)
                        throw new Error("存储失败");
                    const s = t.indexOf(o[0]);
                    if (o.splice(o.indexOf(i), 1),
                    o.length < 2) {
                        1 === o.length && (delete o[0].parent,
                        await this.dbCmp.put("/", o[0]));
                        const e = t.find((e=>e._id === n));
                        e && (await this.dbCmp.remove("/", e),
                        t.splice(t.indexOf(e), 1))
                    }
                    if (o.length > 0) {
                        for (let e = 0; e < o.length; e++) {
                            const i = t.indexOf(o[e]);
                            i !== s + e && (t.splice(i, 1),
                            t.splice(s + e, 0, o[e]))
                        }
                        const e = t.indexOf(i);
                        s + o.length !== e && (t.splice(e, 1),
                        t.splice(s + o.length, 0, i))
                    }
                    return await this._savePanelMenuSort(t),
                    t
                }
                ,
                removePanelMenus: async e=>{
                    const t = await this.getPanelMenusDocs();
                    this.panelMenusDocsCache = null;
                    const i = t.find((t=>t.pluginId === e.pluginId && t.label === e.label));
                    if (!i)
                        throw new Error('"' + e.label + '" 不存在');
                    if ((await this.dbCmp.remove("/", i)).error)
                        throw new Error("删除失败");
                    if (t.splice(t.indexOf(i), 1),
                    i.parent) {
                        const e = t.filter((e=>e.parent === i.parent));
                        if (e.length < 2) {
                            1 === e.length && (delete e[0].parent,
                            await this.dbCmp.put("/", e[0]));
                            const n = t.find((e=>e._id === i.parent));
                            n && (await this.dbCmp.remove("/", n),
                            t.splice(t.indexOf(n), 1))
                        }
                    }
                    return await this._savePanelMenuSort(t),
                    t
                }
                ,
                updatePanelMenusFolderLabel: async(e,t,i)=>{
                    const n = await this.dbCmp.get("/", t);
                    if (!n)
                        return void (e.returnValue = !1);
                    this.panelMenusDocsCache = null,
                    n.label = i;
                    const o = await this.dbCmp.put("/", n);
                    e.returnValue = !o.error
                }
            }),
            $e(this, "ffffffffServices", {
                getVoicePanelMenusDocs: this.getPanelMenusDocs,
                createVoicePanelMenu: async(e,t,i)=>{
                    this.panelMenusDocsCache = null;
                    const n = "panelmenus/" + M(e + "/" + i);
                    let o = await this.dbCmp.get("/", n);
                    o ? o.featureCode = t : o = {
                        _id: n,
                        pluginId: e,
                        featureCode: t,
                        label: i,
                        createAt: Date.now()
                    },
                    await this.dbCmp.put("/", o)
                }
                ,
                removeVoicePanelMenu: async e=>{
                    const t = await this.getPanelMenusDocs();
                    if (this.panelMenusDocsCache = null,
                    (await this.dbCmp.remove("/", e)).error)
                        throw new Error("删除失败");
                    const i = t.findIndex((t=>t._id === e._id));
                    if (t.splice(i, 1),
                    e.parent) {
                        const i = t.filter((t=>t.parent === e.parent));
                        if (i.length < 2) {
                            1 === i.length && (delete i[0].parent,
                            await this.dbCmp.put("/", i[0]));
                            const n = t.find((t=>t._id === e.parent));
                            n && await this.dbCmp.remove("/", n)
                        }
                    }
                    await this._savePanelMenuSort(t)
                }
                ,
                getVoicePanelMenu: async(e,t,i)=>{
                    const n = await this.dbCmp.get("/", "panelmenus/" + M(t + "/" + i));
                    e.returnValue = n
                }
                ,
                setEnableVoicePanel: (e,t)=>{
                    if (t) {
                        n().set("enableVoicePanel", !0),
                        this.enableVoicePanel();
                        const e = this.accountCmp.getAccountInfo();
                        e && this.windowCmp.voiceChangeAccount(e)
                    } else
                        n().set("enableVoicePanel", !1),
                        this.voiceWindow && !this.voiceWindow.isDestroyed() && (this.windowCmp.isMacOs && I().panelRestoreToWindow(this.voiceWindow.getNativeWindowHandle()),
                        this.voiceWindow.destroy());
                    e.returnValue = !0
                }
                ,
                getVoicePanelSetting: e=>{
                    const t = this.isEnableVoicePanel();
                    e.returnValue = {
                        isEnable: t,
                        useVoice: t && this._useVoice,
                        useTranslate: t && this._useTranslate,
                        triggerWay: t ? this._triggerWay : this.windowCmp.isMacOs ? 2 : 0,
                        longDownTriggerMS: t ? this._longDownTriggerMS : 200,
                        processBlacklist: n().get("voicePanelProcessBlacklist") || ""
                    }
                }
                ,
                setVoicePanelEnableVoice: (e,t)=>{
                    t ? (n().set("voicePanelUseVoice", !0),
                    this._useVoice = !0) : (n().delete("voicePanelUseVoice"),
                    this._useVoice = !1),
                    e.returnValue = !0
                }
                ,
                setVoicePanelEnableTranslate: (e,t)=>{
                    t ? (n().delete("voicePanelUseTranslate"),
                    this._useTranslate = !0) : (n().set("voicePanelUseTranslate", !1),
                    this._useTranslate = !1),
                    e.returnValue = !0
                }
                ,
                setVoicePanelTriggerWay: (e,t)=>{
                    if (!this.isTriggerWayNumberValue(t))
                        return void (e.returnValue = !1);
                    this._triggerWay = t,
                    n().set("voicePanelTriggerWay", this._triggerWay),
                    I().stopVoicePanelTriggerEvent();
                    let i = n().get("voicePanelProcessBlacklist") || "";
                    i && (i = ";" + i + ";"),
                    I().voicePanelTriggerEvent(this.nativeVoicePanelTrigger, this._triggerWay, i),
                    e.returnValue = !0
                }
                ,
                setVoicePanelLongDownTriggerMS: (e,t)=>{
                    !t || "number" != typeof t || t < 200 || t > 400 ? e.returnValue = !1 : (n().set("voicePanelLongDownTriggerMS", t),
                    this._longDownTriggerMS = t,
                    e.returnValue = !0)
                }
                ,
                setVoicePanelProcessBlacklist: (e,t)=>{
                    "string" == typeof t ? (this._setProcessBlacklistTimeout && clearTimeout(this._setProcessBlacklistTimeout),
                    this._setProcessBlacklistTimeout = setTimeout((()=>{
                        this._setProcessBlacklistTimeout = null,
                        t = t.trim(),
                        n().set("voicePanelProcessBlacklist", t),
                        I().setVoicePanelProcessBlacklist(t ? ";" + t + ";" : "")
                    }
                    ), 500),
                    e.returnValue = !0) : e.returnValue = !1
                }
            }),
            this.config = e,
            this.config.borderWidth = i.isMacOs ? 0 : 1,
            this.windowBounds = {
                x: 0,
                y: 0,
                width: this.config.contentWidth + 2 * this.config.borderWidth,
                height: this.config.initContentHeight + 2 * this.config.borderWidth
            },
            this.cursorPoint = {
                x: 0,
                y: 0
            },
            this.windowCmp = i,
            this.clipboardCmp = i.clipboardCmp,
            this.accountCmp = i.accountCmp,
            this.reportCmp = i.reportCmp,
            this.dbCmp = o,
            this.nativeVoicePanelTrigger = this.nativeVoicePanelTrigger.bind(this)
        }
        isEnableVoicePanel() {
            return !0 === n().get("enableVoicePanel")
        }
        isTriggerWayNumberValue(e) {
            return [0, 1, 2, 4, 5, 6, 7].includes(e)
        }
        init() {
            n().has("enableVoicePanel") || n().set("enableVoicePanel", !0),
            this.isEnableVoicePanel() && this.enableVoicePanel(),
            this.dbCmp.on("switch", (()=>{
                this.panelMenusDocsCache = null
            }
            )),
            this.dbCmp.on("pull", (e=>{
                this.panelMenusDocsCache && e.find((e=>e._id.startsWith("panelmenus"))) && (this.panelMenusDocsCache = null)
            }
            ))
        }
        enableVoicePanel() {
            this._useVoice = !0 === n().get("voicePanelUseVoice"),
            this._useTranslate = !(!1 === n().get("voicePanelUseTranslate")),
            this.windowCmp.isLinux ? this._triggerWay = 0 : (this._triggerWay = n().get("voicePanelTriggerWay"),
            this.isTriggerWayNumberValue(this._triggerWay) || (this.windowCmp.isWindow ? this._triggerWay = 0 : this.windowCmp.isMacOs && (this._triggerWay = 2)),
            this._longDownTriggerMS = n().get("voicePanelLongDownTriggerMS"),
            (!this._longDownTriggerMS || this._longDownTriggerMS < 200 || this._longDownTriggerMS > 400) && (this._longDownTriggerMS = 200)),
            this.initVoiceWindow(),
            this.windowCmp.voiceRefreshCmdSource = ()=>{
                this.voiceWindow && !this.voiceWindow.webContents.isDestroyed() && this.voiceWindow.webContents.executeJavaScript("window.bridge.refreshCmdSource()")
            }
            ,
            this.windowCmp.voiceChangeAccount = (e=null)=>{
                this.voiceWindow && !this.voiceWindow.webContents.isDestroyed() && this.voiceWindow.webContents.executeJavaScript(`window.bridge.changeAccount(${JSON.stringify(e)})`)
            }
            ,
            this.windowCmp.isLinux && Re().spawn("xmodmap", ["-e", '"pointer = 1 25 3 4 5 6 7 8 9 10"'], {
                shell: !0,
                detached: !0
            })
        }
        triggerShow(e, i) {
            if (this._triggerShowTimeStamp = Date.now(),
            this.windowCmp.isWindow) {
                const n = t.screen.screenToDipPoint({
                    x: e,
                    y: i
                });
                e = Math.round(n.x),
                i = Math.round(n.y)
            } else
                this.windowCmp.isMacOs ? this._useVoice && !this._isMicrophoneGranted && (void 0 === this._isMicrophoneGranted && (this._isMicrophoneGranted = "granted" === t.systemPreferences.getMediaAccessStatus("microphone")),
                this._isMicrophoneGranted || t.systemPreferences.askForMediaAccess("microphone")) : this.windowCmp.isLinux && (this._displayScaleFactor = t.screen.getPrimaryDisplay().scaleFactor,
                this._displayScaleFactor > 1 && (e = Math.round(e / this._displayScaleFactor),
                i = Math.round(i / this._displayScaleFactor)));
            if (this.cursorPoint.x = e,
            this.cursorPoint.y = i,
            this.voiceWindow.isVisible() && e >= this.windowBounds.x + this.config.borderWidth && e <= this.windowBounds.x + this.windowBounds.width - this.config.borderWidth && i >= this.windowBounds.y + this.config.borderWidth && i <= this.windowBounds.y + this.windowBounds.height - this.config.borderWidth)
                return this._isCursorInWindow = !0,
                this._isCursorInWindowWhenTriggerShow = !0,
                void this.voiceWindow.webContents.executeJavaScript(`window.bridge.showInit(${JSON.stringify({
                    payload: !1,
                    useVoice: !1,
                    useTranslate: !1
                })})`);
            this._isCursorInWindowWhenTriggerShow = !1,
            this.reportCmp.info("panel.show");
            let n = null;
            this.windowCmp.display.setNativeWorkWindowInfo();
            const o = this.windowCmp.display.nativeWorkWindowInfo;
            do {
                if (this.clipboardCmp.isPreCopy()) {
                    n = {
                        type: "clipboard",
                        wininfo: o || null
                    };
                    break
                }
                if (!o)
                    break;
                if (this.windowCmp.isMacOs) {
                    this.clipboardCmp.temporaryCancelWatch(),
                    this._simulateCopyClipboardChangeCount = I().getClipboardChangeCount(),
                    I().simulateKeyboardTap("c", "command"),
                    n = e > o.x && e < o.x + o.width && i > o.y && i < o.y + 23 ? {
                        type: "window|simulatecopy",
                        data: o,
                        wininfo: o
                    } : {
                        type: "simulatecopy",
                        wininfo: o
                    };
                    break
                }
                if (this.windowCmp.isWindow) {
                    if ("uTools.exe" === o.app || this.windowCmp.isDev && "electron.exe" === o.app) {
                        const e = t.BrowserWindow.getAllWindows().find((e=>e.getNativeWindowHandle().readInt32LE() === o.id));
                        if (!e)
                            break;
                        if (e.webContents?.isFocused()) {
                            this.clipboardCmp.temporaryCancelWatch(),
                            this._simulateCopyClipboardChangeCount = I().getClipboardChangeCount(),
                            e.webContents.copy(),
                            n = {
                                type: "simulatecopy",
                                wininfo: null
                            };
                            break
                        }
                        const i = e.getBrowserView();
                        i && i.webContents?.isFocused() && (this.clipboardCmp.temporaryCancelWatch(),
                        this._simulateCopyClipboardChangeCount = I().getClipboardChangeCount(),
                        i.webContents.copy(),
                        n = {
                            type: "simulatecopy",
                            wininfo: null
                        });
                        break
                    }
                    const s = t.screen.screenToDipRect(null, {
                        x: o.x,
                        y: o.y,
                        width: o.width,
                        height: o.height
                    });
                    if (["explorer.exe", "SearchApp.exe", "SearchHost.exe", "FESearchHost.exe"].includes(o.app)) {
                        if (e > s.x && e < s.x + s.width && i > s.y && i < s.y + 33) {
                            n = {
                                type: "window",
                                data: o,
                                wininfo: o
                            };
                            break
                        }
                        let t;
                        if ("CabinetWClass" === o.class || "ExploreWClass" === o.class) {
                            const e = I().getExplorerWindowsForSelectedFilePaths(o.id);
                            if (1 === e.length)
                                t = e[0].selectedFiles;
                            else if (e.length > 1) {
                                const i = e.filter((e=>e.locationName === o.title));
                                if (1 !== i.length) {
                                    this.clipboardCmp.temporaryCancelWatch(),
                                    this._simulateCopyClipboardChangeCount = I().getClipboardChangeCount(),
                                    I().simulateKeyboardTap("c", "ctrl"),
                                    n = {
                                        type: "simulatecopy",
                                        wininfo: o
                                    };
                                    break
                                }
                                t = I().getExplorerSelectedFilePathByItemIndex(i[0].itemIndex)
                            }
                        } else
                            "Progman" !== o.class && "WorkerW" !== o.class || (t = I().getDesktopSelectedFilePath());
                        if (t) {
                            const e = [];
                            if (t.forEach((t=>{
                                let i;
                                try {
                                    i = u().lstatSync(t)
                                } catch (e) {
                                    return
                                }
                                e.push({
                                    isFile: i.isFile(),
                                    isDirectory: i.isDirectory(),
                                    name: l().basename(t),
                                    path: t
                                })
                            }
                            )),
                            e.length > 0) {
                                n = {
                                    type: "files",
                                    data: e,
                                    wininfo: o
                                };
                                break
                            }
                        }
                        n = {
                            type: "window",
                            data: o,
                            wininfo: o
                        };
                        break
                    }
                    this.clipboardCmp.temporaryCancelWatch(),
                    this._simulateCopyClipboardChangeCount = I().getClipboardChangeCount(),
                    ["cmd.exe", "powershell.exe", "WindowsTerminal.exe"].includes(o.app) ? I().simulateKeyboardTap("insert", "ctrl") : I().simulateKeyboardTap("c", "ctrl"),
                    n = e > s.x && e < s.x + s.width && i > s.y && i < s.y + 33 ? {
                        type: "window|simulatecopy",
                        data: o,
                        wininfo: o
                    } : {
                        type: "simulatecopy",
                        wininfo: o
                    };
                    break
                }
                if (this.windowCmp.isLinux) {
                    if (("utools" === o.app || this.windowCmp.isDev && "electron" === o.app) && o.id === this.voiceWindow.getNativeWindowHandle().readInt32LE())
                        break;
                    if (/\/(?:dde-file-manager|nautilus)$/.test(o.appPath)) {
                        this.clipboardCmp.temporaryCancelWatch(),
                        this._simulateCopyClipboardChangeCount = I().getClipboardChangeCount(),
                        I().simulateKeyboardTap("c", "ctrl"),
                        n = {
                            type: "simulatecopy",
                            wininfo: o
                        };
                        break
                    }
                    if (I().wheelMouseDownIsSelection()) {
                        const e = t.clipboard.readText("selection").trim();
                        e && (n = {
                            type: "text",
                            data: e,
                            wininfo: o
                        })
                    }
                }
            } while (0);
            this.windowBounds.height = this.config.initContentHeight + 2 * this.config.borderWidth,
            this.windowBounds.x = e - (this.windowBounds.width / 2 | 0),
            this.windowBounds.y = i - (this.windowBounds.height / 2 | 0),
            this.workedDisplay = t.screen.getDisplayNearestPoint({
                x: e,
                y: i
            }),
            this.windowBounds.x < this.workedDisplay.bounds.x ? this.windowBounds.x = this.workedDisplay.bounds.x : this.windowBounds.x + this.windowBounds.width > this.workedDisplay.bounds.x + this.workedDisplay.bounds.width && (this.windowBounds.x = this.workedDisplay.bounds.x + this.workedDisplay.bounds.width - this.windowBounds.width),
            this.voiceWindow.setBounds(this.windowBounds),
            this._isCursorInWindow = !0,
            this.windowCmp.isWindow && this.voiceWindow.setAlwaysOnTop(!0, "pop-up-menu"),
            this.voiceWindow.showInactive(),
            this.windowCmp.isMacOs && !this.voiceWindow.isVisible() && this.voiceWindow.show(),
            this.voiceWindow.webContents.executeJavaScript(`window.bridge.showInit(${JSON.stringify({
                payload: n,
                useVoice: this._useVoice,
                useTranslate: this._useTranslate
            })})`)
        }
        triggerMove(e, i) {
            if (!(this._isCursorInWindowWhenTriggerShow || this.windowBounds.height <= this.config.initContentHeight + 2 * this.config.borderWidth)) {
                if (this.windowCmp.isWindow) {
                    const n = t.screen.screenToDipPoint({
                        x: e,
                        y: i
                    });
                    e = Math.round(n.x),
                    i = Math.round(n.y)
                } else
                    this.windowCmp.isLinux && this._displayScaleFactor > 1 && (e = Math.round(e / this._displayScaleFactor),
                    i = Math.round(i / this._displayScaleFactor));
                this.cursorPoint.x = e,
                this.cursorPoint.y = i,
                e >= this.windowBounds.x + this.config.borderWidth && e <= this.windowBounds.x + this.windowBounds.width - this.config.borderWidth && i >= this.windowBounds.y + this.config.borderWidth && i <= this.windowBounds.y + this.windowBounds.height - this.config.borderWidth ? (this._isCursorInWindow || (this._isCursorInWindow = !0),
                this.voiceWindow.webContents.send("mousemove", e - this.windowBounds.x, i - this.windowBounds.y)) : this._isCursorInWindow && (this._isCursorInWindow = !1,
                this.voiceWindow.webContents.send("mouseout"))
            }
        }
        handleNativeMouseUp() {
            if (!this.voiceWindow)
                return void I().stopVoicePanelTriggerEvent();
            if (!this.voiceWindow.isVisible())
                return;
            const e = Date.now() - this._triggerShowTimeStamp < 300;
            e || this._isCursorInWindow ? (this._isCursorInWindow = !1,
            this.voiceWindow.webContents.executeJavaScript(`window.bridge.holdUp(${e})`).then((e=>{
                e && (this.windowCmp.isWindow ? I().mouseButtonDownEvent(this.win32MouseButtonDownCall) : this.windowCmp.isMacOs ? I().focusShowWindow(this.voiceWindow.getNativeWindowHandle()) : this.voiceWindow.show())
            }
            ))) : this.triggerEmpty()
        }
        triggerHide(e) {
            this.windowCmp.isWindow,
            this.voiceWindow.hide(),
            e && !this.windowCmp.mainWindow.isVisible() && this.windowCmp.display.trigger(!0, !0)
        }
        triggerEmpty() {
            this._isCursorInWindow = !1,
            this.voiceWindow.isVisible() && this.voiceWindow.hide()
        }
        nativeVoicePanelTrigger(e, t, i) {
            switch (e) {
            case 1:
                this.triggerShow(t, i);
                break;
            case 2:
            case 8:
                this.triggerMove(t, i);
                break;
            case 3:
                setImmediate((()=>{
                    this.handleNativeMouseUp()
                }
                ));
                break;
            case 7:
                this._mouseLongDownTimeout && clearTimeout(this._mouseLongDownTimeout),
                this._mouseLongDownTimeout = setTimeout((()=>{
                    I().triggerMouseLongDown() && this.triggerShow(t, i),
                    this._mouseLongDownTimeout = null
                }
                ), this._longDownTriggerMS);
                break;
            case 9:
                if (this._mouseLongDownTimeout)
                    return clearTimeout(this._mouseLongDownTimeout),
                    void (this._mouseLongDownTimeout = null);
                setImmediate((()=>{
                    this.handleNativeMouseUp()
                }
                ));
                break;
            case 0:
                this._mouseLongDownTimeout && (clearTimeout(this._mouseLongDownTimeout),
                this._mouseLongDownTimeout = null),
                setImmediate((()=>{
                    this.triggerEmpty()
                }
                ))
            }
        }
        setWindowBounds(e, i) {
            if (!this.voiceWindow.isVisible())
                return;
            const n = this.config.initContentHeight + 2 * this.config.borderWidth + e
              , o = "number" == typeof i;
            if (o) {
                const e = this.cursorPoint.x - (this.windowBounds.width / 2 | 0)
                  , o = this.cursorPoint.y - i;
                if (n === this.windowBounds.height && e === this.windowBounds.x && o === this.windowBounds.y)
                    return;
                this.windowBounds.height = n,
                this.windowBounds.x = e,
                this.windowBounds.y = o,
                this.workedDisplay = t.screen.getDisplayNearestPoint({
                    x: this.cursorPoint.x,
                    y: this.cursorPoint.y
                }),
                e < this.workedDisplay.bounds.x ? this.windowBounds.x = this.workedDisplay.bounds.x : e + this.windowBounds.width > this.workedDisplay.bounds.x + this.workedDisplay.bounds.width && (this.windowBounds.x = this.workedDisplay.bounds.x + this.workedDisplay.bounds.width - this.windowBounds.width)
            } else {
                if (this.windowBounds.height === n)
                    return;
                !1 === i && (this.windowBounds.y = this.windowBounds.y + this.windowBounds.height - n),
                this.windowBounds.height = n
            }
            if (!1 !== i)
                if (this.windowBounds.y + this.windowBounds.height > this.workedDisplay.bounds.y + this.workedDisplay.bounds.height) {
                    let e;
                    e = o ? this.windowBounds.y - this.windowBounds.height + 2 * i : this.windowBounds.y - this.windowBounds.height + this.config.initContentHeight + 2 * this.config.borderWidth,
                    e < this.windowBounds.y ? (this.windowBounds.y = e,
                    this.voiceWindow.webContents.executeJavaScript("window.bridge.changeDirection(false)")) : this.voiceWindow.webContents.executeJavaScript("window.bridge.changeDirection(true)")
                } else
                    this.voiceWindow.webContents.executeJavaScript("window.bridge.changeDirection(true)");
            this.voiceWindow.setBounds(this.windowBounds),
            o && setTimeout((()=>{
                this.voiceWindow.webContents.send("mousemove", this.cursorPoint.x - this.windowBounds.x, this.cursorPoint.y - this.windowBounds.y, !0)
            }
            ), 50)
        }
        initVoiceWindow() {
            this.voiceWindow = new t.BrowserWindow({
                resizable: this.windowCmp.isWindow,
                focusable: !this.windowCmp.isWindow,
                fullscreenable: !1,
                minimizable: !1,
                maximizable: !1,
                alwaysOnTop: !0,
                closable: !1,
                show: !1,
                width: this.windowBounds.width,
                height: this.windowBounds.height,
                backgroundColor: this.windowCmp.getWindowBackgroundColor(),
                frame: !this.windowCmp.isLinux,
                titleBarStyle: "hidden",
                enableLargerThanScreen: !0,
                skipTaskbar: !0,
                autoHideMenuBar: !0,
                type: this.windowCmp.isMacOs ? "panel" : "toolbar",
                webPreferences: {
                    devTools: this.windowCmp.isDev,
                    nodeIntegration: !1,
                    sandbox: !1,
                    contextIsolation: !1,
                    enableRemoteModule: !1,
                    backgroundThrottling: !1,
                    partition: "persist:<utools>",
                    navigateOnDragDrop: !1,
                    spellcheck: !1,
                    webgl: !1,
                    enableWebSQL: !1,
                    preload: l().join(__dirname, "preload.js")
                }
            }),
            this.voiceWindow.removeMenu(),
            this.windowCmp.isMacOs ? (this.voiceWindow.setWindowButtonVisibility(!1),
            this.voiceWindow.setAlwaysOnTop(!0, "modal-panel", 1),
            I().windowConvertToPanel(this.voiceWindow.getNativeWindowHandle())) : this.voiceWindow.setAlwaysOnTop(!0, "pop-up-menu"),
            this.voiceWindow.on("will-resize", (e=>{
                e.preventDefault()
            }
            )),
            this.voiceWindow.loadFile(l().join(__dirname, "voice.html")),
            this.voiceWindow.webContents.setBackgroundThrottling(!1),
            this.voiceWindow.webContents.once("dom-ready", (()=>{
                this.config.borderWidth > 0 && this.voiceWindow.webContents.insertCSS(`.voice-panel{ border-style: solid; border-width: ${this.config.borderWidth}px; }`),
                this.voiceWindow.webContents.executeJavaScript(`window.borderWidth=${this.config.borderWidth};`);
                let e = n().get("voicePanelProcessBlacklist") || "";
                e && (e = ";" + e + ";"),
                I().voicePanelTriggerEvent(this.nativeVoicePanelTrigger, this._triggerWay, e)
            }
            )),
            this.voiceWindow.webContents.once("destroyed", (()=>{
                I().stopVoicePanelTriggerEvent(),
                delete this.windowCmp.voiceRefreshCmdSource,
                delete this.windowCmp.voiceChangeAccount,
                this.voiceWindow = null
            }
            )),
            this.voiceWindow.webContents.once("render-process-gone", (()=>{
                this.windowCmp.isMacOs && I().panelRestoreToWindow(this.voiceWindow.getNativeWindowHandle()),
                this.voiceWindow.destroy()
            }
            )),
            this.voiceWindow.on("blur", (()=>{
                this.triggerEmpty()
            }
            )),
            this.voiceWindow.on("hide", (()=>{
                this.windowCmp.isWindow && (I().stopMouseButtonDownEvent(),
                this.voiceWindow.isFocusable() && this.voiceWindow.setFocusable(!1)),
                this.voiceWindow.webContents.executeJavaScript("window.bridge.empty()")
            }
            ))
        }
    }
    const Qe = require("chokidar");
    var Ge = e.n(Qe);
    const Ze = {
        pluginstoresearch: {
            feature: {
                code: "pluginstoresearch",
                explain: "前往 uTools 插件应用市场",
                icon: "res/native/plugin-search.png",
                cmds: [{
                    type: "over",
                    maxLength: 20,
                    label: "搜索插件应用"
                }]
            },
            func: (e,t,i)=>{
                e.windowCmp.ffffffff.goPluginStore(i)
            }
        },
        saveimage: {
            feature: {
                code: "saveimage",
                explain: "保存为图片文件到下载目录",
                icon: "res/native/imgfile.png",
                cmds: [{
                    type: "img",
                    label: "保存为图片文件"
                }]
            },
            func: (e,i,n)=>{
                if (e.windowCmp.hideMainWindow(),
                !/^data:image\/([a-z]+);base64,/.test(n))
                    return;
                const o = RegExp.$1
                  , s = l().join(t.app.getPath("downloads"), "uTools_" + Date.now() + "." + o);
                x().writeFile(s, n.replace(/^data:image\/([a-z]+);base64,/, ""), "base64", (e=>{
                    e || t.shell.showItemInFolder(s)
                }
                ))
            }
        },
        showfolder: {
            feature: {
                code: "showfolder",
                explain: "前往文件夹",
                icon: "res/native/folderopen.svg",
                cmds: [{
                    type: "regex",
                    match: "/^(?:~?\\/[^/\\n\\r\\f\\v]+)+\\/?$/",
                    label: "前往文件夹"
                }]
            },
            func: (e,i,n)=>{
                (n = n.trim()).startsWith("~") && (n = n.replace("~", t.app.getPath("home"))),
                n = l().normalize(n),
                x().existsSync(n) || (n = l().dirname(n),
                x().existsSync(n)) ? (e.windowCmp.hideMainWindow(!1),
                x().lstat(n, ((e,i)=>{
                    e || i.isFile() ? t.shell.showItemInFolder(n) : t.shell.openPath(n)
                }
                ))) : new t.Notification({
                    body: "文件、文件夹都不存在"
                }).show()
            }
        },
        copyfile: {
            feature: {
                code: "copyfile",
                explain: "复制文件或文件夹到剪贴板",
                icon: "res/native/clip.svg",
                cmds: [{
                    type: "regex",
                    match: "/^(?:\\/[^/\\n\\r\\f\\v]+)+\\/?$/m",
                    maxLength: 5e3,
                    label: "复制文件"
                }]
            },
            func: (e,i,n)=>{
                const o = n.match(/^(?:\/[^/\n\r\f\v]+)+\/?$/gm).map((e=>e.trim())).filter((e=>x().existsSync(e)));
                0 !== o.length ? (e.windowCmp.hideMainWindow(),
                e.copyFile(o)) : new t.Notification({
                    body: "文件不存在"
                }).show()
            }
        },
        openitem: {
            feature: {
                code: "openitem",
                explain: "系统默认方式打开文件",
                icon: "res/native/openitem.png",
                cmds: [{
                    type: "regex",
                    match: "/^(?:~?\\/[^/\\n\\r\\f\\v]+)+\\.\\w{2,10}$/",
                    label: "打开文件"
                }]
            },
            func: (e,i,n)=>{
                (n = n.trim()).startsWith("~") && (n = n.replace("~", t.app.getPath("home"))),
                n = l().normalize(n),
                x().existsSync(n) ? (e.windowCmp.hideMainWindow(!1),
                t.shell.openPath(n)) : new t.Notification({
                    body: "文件不存在"
                }).show()
            }
        },
        openweburl: {
            feature: {
                code: "openweburl",
                explain: "默认浏览器打开网址",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "regex",
                    match: '/^(?:https?:\\/\\/)?(?:localhost|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3})|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#][^\\s"]*)?$/i',
                    label: "打开网址"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(!1),
                /^https?:\/\//.test(n) ? t.shell.openExternal(n) : t.shell.openExternal("https://" + n)
            }
        },
        copyfilepath: {
            feature: {
                code: "copyfilepath",
                explain: "复制路径",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "files",
                    label: "复制路径"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(n.map((e=>e.path)).join("\n"))
            }
        },
        copyfilename: {
            feature: {
                code: "copyfilename",
                explain: "提取文件名称",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "files",
                    label: "提取文件名称"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(n.map((e=>e.isFile ? l().parse(e.path).name : e.name)).join("\n"))
            }
        },
        finder_copy_current_path: {
            feature: {
                code: "finder_copy_current_path",
                explain: "复制当前目录路径",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "window",
                    match: {
                        app: "Finder.app"
                    },
                    label: "复制当前路径"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                e.appCmp.readCurrentFolderPath().then((e=>{
                    t.clipboard.writeText(e)
                }
                ))
            }
        },
        finder_new_file: {
            feature: {
                code: "finder_new_file",
                explain: "在当前目录新建文件",
                icon: "res/native/newfile.png",
                cmds: [{
                    type: "window",
                    match: {
                        app: "Finder.app"
                    },
                    label: "新建文件"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                e.runOSAScript(`tell application "Finder"\n        set dir_path to ${n.id ? "the folder of the front window as alias" : "(path to desktop)"}\n        display dialog "新建文件" default answer "未命名"\n        set file_name to the text returned of result\n        set full_file_name to make new file at dir_path with properties {name: file_name}\n        set extension hidden of full_file_name to false\n        end tell`, !1).catch((e=>{
                    128 !== e.code && new t.Notification({
                        body: e.message
                    }).show()
                }
                ))
            }
        }
    }
      , Xe = [{
        code: "call:systemAction lock",
        icon: "res/native/lock.png",
        explain: "电脑锁屏",
        cmds: ["锁屏", "Lock"]
    }, {
        code: "call:systemAction logout",
        icon: "res/native/logout.png",
        explain: "当前操作系统账号注销",
        cmds: ["注销", "Logout"]
    }, {
        code: "call:systemAction restart",
        icon: "res/native/reboot.png",
        explain: "电脑重启",
        cmds: ["重启", "Restart"]
    }, {
        code: "call:systemAction sleep",
        icon: "res/native/sleep.png",
        explain: "电脑睡眠",
        cmds: ["睡眠", "Sleep"]
    }, {
        code: "call:systemAction shutdown",
        icon: "res/native/shutdown.png",
        explain: "电脑关机",
        cmds: ["关机", "Shutdown"]
    }, {
        code: "call:showDesktop",
        icon: "res/native/desktop.png",
        explain: "显示桌面",
        cmds: ["显示桌面", "Show Desktop"]
    }, {
        code: "call:windowScreenshot",
        icon: "res/native/camera.png",
        explain: "截图完呼出 uTools",
        cmds: ["窗口截图"]
    }, {
        code: "call:screenColorPicker",
        icon: "res/native/picker.png",
        explain: "屏幕颜色拾取",
        cmds: ["取色", "Pick Color"]
    }, {
        code: "call:regionScreenshot",
        icon: "res/native/screenshot.png",
        explain: "截图完呼出 uTools",
        cmds: ["截图", "截图完呼出 uTools"]
    }, {
        code: "call:showNativeWorkWindowInfo",
        icon: "res/native/window.png",
        explain: "当前活动窗口的信息",
        cmds: ["窗口信息"]
    }, {
        code: "call:getLanIp",
        icon: "res/native/ip.png",
        explain: "获取我的电脑局域网IP地址",
        cmds: ["内部网络IP地址"]
    }];
    function Ye(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class ze {
        constructor(e, i, o, s, r) {
            Ye(this, "mainServices", {
                nativeOpen: (e,i,n)=>{
                    if (this.reportCmp.info("native.open", {
                        way: n
                    }),
                    i.startsWith("call:")) {
                        const e = i.replace("call:", "").split(/ +/g)
                          , t = e.shift();
                        "function" == typeof this[t] && this[t].apply(this, e)
                    } else {
                        if (i.startsWith("localopen:") && (i = i.replace("localopen:", ""),
                        !x().existsSync(i)))
                            return new t.Notification({
                                body: "文件不存在，打开失败"
                            }).show(),
                            delete this.pluginsCmp.pluginContainer[""].featureDic[i],
                            void this.windowCmp.refreshCmdSource();
                        if (this.windowCmp.hideMainWindow(!1),
                        /\.sh$/i.test(i))
                            try {
                                return x().accessSync(i, x().constants.X_OK),
                                void Re().spawn(i, {
                                    detached: !0
                                })
                            } catch (e) {}
                        else if (/.scpt$/i.test(i))
                            try {
                                if (x().lstatSync(i).isFile())
                                    return void Re().spawn("osascript", [i], {
                                        detached: !0
                                    })
                            } catch (e) {}
                        t.shell.openPath(i)
                    }
                }
                ,
                nativeMatchCall: (e,t,i,n,o)=>{
                    if (t.startsWith("socket/"))
                        return this.reportCmp.info("native.open", {
                            way: o,
                            featureCode: "socket"
                        }),
                        void this.connectionCmp.sendData(t, i, n);
                    if (this.reportCmp.info("native.open", {
                        way: o
                    }),
                    t in Ze)
                        try {
                            Ze[t].func(this, i, n)
                        } catch (e) {}
                }
            }),
            Ye(this, "ffffffffServices", {
                setEnableNativeApp: (e,t)=>{
                    n().set("enableNativeApp", !0 === t),
                    setImmediate((()=>{
                        this.initFeatures()
                    }
                    )),
                    e.returnValue = !0
                }
            }),
            this.pluginsCmp = e,
            this.windowCmp = i,
            this.clipboardCmp = i.clipboardCmp,
            this.reportCmp = o,
            this.appCmp = s,
            this.connectionCmp = r,
            this.screencaptureCmp = s.screencaptureCmp,
            this.screencolorpickerCmp = s.screencolorpickerCmp
        }
        init() {
            n().has("enableNativeApp") || n().set("enableNativeApp", !0),
            setImmediate((()=>{
                this.initFeatures()
            }
            ))
        }
        convertAppFeature(e) {
            const t = {}
              , i = I().getAppLocalName(e)
              , n = l().parse(e).name;
            if (i)
                if (i.includes("\n")) {
                    const e = i.split("\n");
                    e[1].includes(e[0]) ? t.cmds = [e[1]] : t.cmds = e.reverse()
                } else
                    n === i || i.startsWith("${") ? t.cmds = [n] : i.includes(n) ? t.cmds = [i] : t.cmds = [i, n];
            else
                t.cmds = [n];
            return t.code = e,
            t.explain = e,
            t.icon = "nativeicon://" + e,
            t
        }
        dirAppRead(e, t, i, n, o) {
            let s = null;
            try {
                if (!x().existsSync(t))
                    return;
                s = x().readdirSync(t)
            } catch (e) {
                return
            }
            if (0 !== s.length)
                for (const r of s) {
                    const s = l().join(t, r);
                    let a;
                    try {
                        a = x().lstatSync(s)
                    } catch (e) {
                        continue
                    }
                    a.isDirectory() ? l().extname(s) === e ? o.push(s) : n < i && this.dirAppRead(e, s, i, n + 1, o) : a.isSymbolicLink() && ".app" === l().extname(s) && o.push(s)
                }
        }
        dirAppWatch(e, t) {
            return Ge().watch(e, {
                persistent: !0,
                ignoreInitial: !0,
                ignorePermissionErrors: !0,
                followSymlinks: !1,
                disableGlobbing: !0,
                depth: t,
                ignored: /\.app\/.*|\/\../
            }).on("addDir", (e=>{
                /\.app$/.test(e) && setTimeout((()=>{
                    x().existsSync(e) && (this.pluginsCmp.setFeature("", this.convertAppFeature(e)),
                    this.windowCmp.refreshCmdSource())
                }
                ), 1e4)
            }
            )).on("unlinkDir", (e=>{
                /\.app$/.test(e) && setImmediate((()=>{
                    x().existsSync(e) || e in this.pluginsCmp.pluginContainer[""].featureDic && (delete this.pluginsCmp.pluginContainer[""].featureDic[e],
                    this.windowCmp.refreshCmdSource())
                }
                ))
            }
            ))
        }
        setBaseAppFeatures() {
            const e = [];
            this.dirAppRead(".app", "/Applications", 1, 0, e);
            const t = e.find((e=>e.endsWith("uTools.app")));
            t && e.splice(e.indexOf(t), 1),
            this.dirAppRead(".app", "/System/Applications", 1, 0, e),
            ["Terminal", "Visual Studio Code"].forEach((t=>{
                const i = e.find((e=>e.endsWith(t + ".app")));
                i && (Ze["path_open_to_" + t] = {
                    func: (e,i,n)=>{
                        e.windowCmp.hideMainWindow(!1),
                        "files" !== i ? this.appCmp.readCurrentFolderPath().then((e=>{
                            Re().spawn("open", ["-a", `"${t}"`, `"${e}"`], {
                                detached: !0,
                                shell: !0
                            })
                        }
                        )) : Re().spawn("open", ["-a", `"${t}"`, `"${n[0].path}"`], {
                            detached: !0,
                            shell: !0
                        })
                    }
                },
                this.pluginsCmp.setFeature("", {
                    code: "path_open_to_" + t,
                    explain: ("Terminal" === t ? "终端" : t) + " 中打开",
                    icon: "nativeicon://" + i,
                    cmds: [{
                        type: "files",
                        fileType: "directory",
                        minLength: 1,
                        maxLength: 1,
                        label: ("Terminal" === t ? "终端" : t) + " 中打开"
                    }, {
                        type: "window",
                        match: {
                            app: "Finder.app"
                        },
                        label: ("Terminal" === t ? "终端" : t) + " 中打开"
                    }]
                }))
            }
            )),
            this.dirAppRead(".prefPane", "/System/Library/PreferencePanes", 0, 0, e),
            this.dirAppRead(".app", process.env.HOME + "/Applications", 1, 0, e),
            this.dirAppRead(".app", "/System/Library/CoreServices/Applications", 0, 0, e),
            ["Finder.app", "Paired Devices.app", "Ticket Viewer.app"].forEach((t=>{
                const i = l().join("/System/Library/CoreServices", t);
                x().existsSync(i) && e.push(i)
            }
            )),
            e.map((e=>this.convertAppFeature(e))).forEach((e=>{
                this.pluginsCmp.setFeature("", e)
            }
            )),
            this.baseAppDirWatch = this.dirAppWatch(["/Applications", process.env.HOME + "/Applications"], 1)
        }
        setMatchAppFeatures() {
            Object.values(Ze).forEach((e=>{
                e.feature && this.pluginsCmp.setFeature("", e.feature)
            }
            ))
        }
        setActionAppFeatures() {
            Xe.forEach((e=>{
                e.icon || (e.icon = "res/native/symbolic.svg"),
                this.pluginsCmp.setFeature("", e)
            }
            ))
        }
        initFeatures() {
            this.baseAppDirWatch && (this.baseAppDirWatch.close(),
            delete this.baseAppDirWatch),
            this.pluginsCmp.pluginContainer[""] = {
                name: "",
                pluginName: "",
                logo: "res/logo.png",
                featureDic: {}
            },
            // this.pluginsCmp.setFeature("", {
            //     code: "call:goHelp",
            //     icon: "res/native/help.png",
            //     explain: "视频介绍 uTools",
            //     cmds: ["uTools 介绍", "帮助", "Help"]
            // }),
            this.pluginsCmp.setFeature("", {
                code: "call:killAllPlugin",
                icon: "res/native/clear.svg",
                explain: "uTools 后台插件应用全部退出",
                cmds: ["Clear"]
            }),
            this.setMatchAppFeatures(),
            this.setActionAppFeatures(),
            n().get("enableNativeApp") && this.setBaseAppFeatures(),
            this.appCmp.initLocalOpenFeatures().then((()=>{
                this.windowCmp.refreshCmdSource()
            }
            ))
        }
        runOSAScript(e, i=!0) {
            return new Promise(((n,o)=>{
                let s = ""
                  , r = "";
                const a = Re().spawn("osascript", ["-ss"], {
                    detached: !0
                });
                a.on("close", (e=>{
                    if (0 === e)
                        return n(r.trim().replace(/^"|"$/g, ""));
                    s = s.trim().replace(/^\d+:\d+: execution error:/, "").replace(/\(-?(\d+)\)\s*$/, ""),
                    i && new t.Notification({
                        body: s
                    }).show();
                    const a = new Error(s);
                    a.code = parseInt(RegExp.$1 || e),
                    o(a)
                }
                )),
                a.stderr.on("data", (e=>{
                    s += e
                }
                )),
                a.stdout.on("data", (e=>{
                    r += e
                }
                )),
                a.stdin.write(e),
                a.stdin.end()
            }
            ))
        }
        systemAction(e) {
            if (["shutdown", "restart", "logout"].includes(e)) {
                this.windowCmp.mainWindow.show(),
                this.windowCmp.hideMainWindow();
                const i = {
                    shutdown: "关机",
                    restart: "重启",
                    logout: "注销"
                }[e];
                t.dialog.showMessageBox({
                    buttons: ["取消", i],
                    message: "确定要执行「" + i + "」吗？",
                    defaultId: 1
                }).then((({response: t})=>{
                    1 === t && I().macAction(e)
                }
                ))
            } else
                this.windowCmp.hideMainWindow(),
                I().macAction(e)
        }
        copyFile(e) {
            Array.isArray(e) || (e = [e]),
            0 !== (e = e.filter((e=>x().existsSync(e)))).length && I().copyFile.apply(null, e)
        }
        goHelp() {
            this.windowCmp.hideMainWindow(!1),
            this.appCmp.goHelp()
        }
        killAllPlugin() {
            this.windowCmp.killAllPlugins()
        }
        windowScreenshot() {
            const e = this.windowCmp.display.nativeWorkWindowInfo;
            e && (this.windowCmp.hideMainWindow(),
            setTimeout((()=>{
                if (!I().isHadScreenCaptureAccess())
                    return new t.Notification({
                        body: "无屏幕录制权限，在「安全性与隐私」->「隐私」中允许屏幕录制权限"
                    }).show(),
                    void I().requestScreenCaptureAccess();
                const i = I().windowScreenshot(e.id);
                i ? t.clipboard.writeImage(t.nativeImage.createFromBuffer(i)) : new t.Notification({
                    body: "窗口截图失败，「安全性与隐私」中允许屏幕录制权限再尝试"
                }).show()
            }
            ), 100))
        }
        screenColorPicker() {
            this.windowCmp.hideMainWindow(),
            this.screencolorpickerCmp.action((({hex: e})=>{
                t.clipboard.writeText(e),
                new t.Notification({
                    body: "颜色 " + e + " 已复制到剪贴板"
                }).show()
            }
            ))
        }
        showDesktop() {
            this.windowCmp.hideMainWindow(!1);
            const e = "/System/Applications/Mission Control.app/Contents/MacOS/Mission Control";
            x().existsSync(e) ? Re().spawn(e, ["1"], {
                detached: !0
            }) : Re().spawn(e.replace("/System", ""), ["1"], {
                detached: !0
            })
        }
        getLanIp() {
            this.windowCmp.hideMainWindow(),
            setTimeout((async()=>{
                const e = await N();
                e ? (t.clipboard.writeText(e),
                new t.Notification({
                    body: '内部网络IP地址 "' + e + '" 已复制到剪贴板'
                }).show()) : new t.Notification({
                    body: "未获取到内部网络 IP 地址"
                }).show()
            }
            ), 50)
        }
        screenCapture() {
            this.windowCmp.hideMainWindow(),
            Re().spawn("/usr/sbin/screencapture", ["-c", "-i", "-r"], {
                detached: !0
            })
        }
        regionScreenshot() {
            this.windowCmp.hideMainWindow(),
            Re().spawn("/usr/sbin/screencapture", ["-c", "-i", "-r"], {
                detached: !0
            }).once("close", (()=>{
                setTimeout((()=>{
                    this.windowCmp.restoreShowMainWindow()
                }
                ), 250)
            }
            ))
        }
        showNativeWorkWindowInfo() {
            this.appCmp.showNativeWorkWindowInfo()
        }
    }
    const et = [{
        code: "ms-settings:about",
        cmds: ["电脑信息"]
    }, {
        code: "ms-settings:display",
        cmds: ["显示器设置"]
    }, {
        code: "ms-settings:storagesense",
        cmds: ["存储设置"]
    }, {
        code: "ms-settings:quietmomentshome",
        cmds: ["专注助手设置"]
    }, {
        code: "ms-settings:multitasking",
        cmds: ["多任务设置"]
    }, {
        code: "ms-settings:project",
        cmds: ["投影到此电脑设置"]
    }, {
        code: "ms-settings:crossdevice",
        cmds: ["共享体验设置"]
    }, {
        code: "ms-settings:tabletmode",
        cmds: ["平板模式设置"]
    }, {
        code: "ms-settings:taskbar",
        cmds: ["任务栏设置"]
    }, {
        code: "ms-settings:notifications",
        cmds: ["通知和操作设置"]
    }, {
        code: "ms-settings:remotedesktop",
        cmds: ["远程桌面设置"]
    }, {
        code: "ms-settings:powersleep",
        cmds: ["电源和睡眠设置"]
    }, {
        code: "ms-settings:sound",
        cmds: ["声音播放设置"]
    }, {
        code: "ms-settings:workplace",
        cmds: ["访问工作单位或学校"]
    }, {
        code: "ms-settings:emailandaccounts",
        cmds: ["你的电子邮件和应用账户设置"]
    }, {
        code: "ms-settings:otherusers",
        cmds: ["家庭成员使用此电脑设置"]
    }, {
        code: "ms-settings:signinoptions",
        cmds: ["登录选项设置"]
    }, {
        code: "ms-settings:sync",
        cmds: ["同步个性化设置"]
    }, {
        code: "ms-settings:yourinfo",
        cmds: ["账户设置"]
    }, {
        code: "ms-settings:appsfeatures",
        cmds: ["应用和功能", "程序和功能"]
    }, {
        code: "ms-settings:appsforwebsites",
        cmds: ["网站选择默认应用设置"]
    }, {
        code: "ms-settings:defaultapps",
        cmds: ["默认应用设置"]
    }, {
        code: "ms-settings:maps",
        cmds: ["离线地图设置"]
    }, {
        code: "ms-settings:startupapps",
        cmds: ["开机启动设置"]
    }, {
        code: "ms-settings:videoplayback",
        cmds: ["视频播放设置"]
    }, {
        code: "ms-settings:autoplay",
        cmds: ["自动播放设置"]
    }, {
        code: "ms-settings:bluetooth",
        cmds: ["蓝牙或其他设备设置"]
    }, {
        code: "ms-settings:mousetouchpad",
        cmds: ["鼠标设置"]
    }, {
        code: "ms-settings:devices-touchpad",
        cmds: ["触摸板设置"]
    }, {
        code: "ms-settings:pen",
        cmds: ["笔设置"]
    }, {
        code: "ms-settings:printers",
        cmds: ["打印机或扫描仪设置"]
    }, {
        code: "ms-settings:typing",
        cmds: ["输入设置"]
    }, {
        code: "ms-settings:usb",
        cmds: ["USB设置"]
    }, {
        code: "ms-settings:easeofaccess-audio",
        cmds: ["音频设置"]
    }, {
        code: "ms-settings:easeofaccess-closedcaptioning",
        cmds: ["隐藏式字幕设置"]
    }, {
        code: "ms-settings:easeofaccess-colorfilter",
        cmds: ["颜色滤镜设置"]
    }, {
        code: "ms-settings:easeofaccess-display",
        cmds: ["显示设置"]
    }, {
        code: "ms-settings:easeofaccess-highcontrast",
        cmds: ["高对比度设置"]
    }, {
        code: "ms-settings:easeofaccess-keyboard",
        cmds: ["键盘设置"]
    }, {
        code: "ms-settings:easeofaccess-magnifier",
        cmds: ["放大镜设置"]
    }, {
        code: "ms-settings:easeofaccess-mouse",
        cmds: ["键盘控制鼠标设置"]
    }, {
        code: "ms-settings:easeofaccess-narrator",
        cmds: ["讲述人设置"]
    }, {
        code: "ms-settings:easeofaccess-speechrecognition",
        cmds: ["语音交互设置"]
    }, {
        code: "ms-settings:fonts",
        cmds: ["字体设置"]
    }, {
        code: "ms-settings:datausage",
        cmds: ["网络流量使用情况"]
    }, {
        code: "ms-settings:network-dialup",
        cmds: ["网络拨号设置"]
    }, {
        code: "ms-settings:network-ethernet",
        cmds: ["以太网设置"]
    }, {
        code: "ms-settings:network-proxy",
        cmds: ["网络代理设置"]
    }, {
        code: "ms-settings:network-status",
        cmds: ["网络设置"]
    }, {
        code: "ms-settings:network-vpn",
        cmds: ["VPN设置"]
    }, {
        code: "ms-settings:personalization-background",
        cmds: ["桌面背景设置"]
    }, {
        code: "ms-settings:personalization-colors",
        cmds: ["系统颜色设置"]
    }, {
        code: "ms-settings:lockscreen",
        cmds: ["锁屏界面设置"]
    }, {
        code: "ms-settings:personalization-start",
        cmds: ["开始菜单设置"]
    }, {
        code: "ms-settings:themes",
        cmds: ["主题设置"]
    }, {
        code: "ms-settings:privacy",
        cmds: ["权限和隐私设置"]
    }, {
        code: "ms-settings:dateandtime",
        cmds: ["日期和时间设置"]
    }, {
        code: "ms-settings:regionlanguage",
        cmds: ["区域和语言设置"]
    }, {
        code: "ms-settings:speech",
        cmds: ["语音设置"]
    }, {
        code: "ms-settings:activation",
        cmds: ["系统激活设置"]
    }, {
        code: "ms-settings:backup",
        cmds: ["备份设置"]
    }, {
        code: "ms-settings:findmydevice",
        cmds: ["查找我的设备"]
    }, {
        code: "ms-settings:developers",
        cmds: ["开发者选项设置"]
    }, {
        code: "ms-settings:recovery",
        cmds: ["系统恢复设置"]
    }, {
        code: "ms-settings:troubleshoot",
        cmds: ["疑难解答"]
    }, {
        code: "ms-settings:windowsdefender",
        cmds: ["安全设置"]
    }, {
        code: "ms-settings:windowsupdate-action",
        cmds: ["检测系统更新"]
    }]
      , tt = {
        pluginstoresearch: {
            feature: {
                code: "pluginstoresearch",
                explain: "前往 uTools 插件应用市场",
                icon: "res/native/plugin-search.png",
                cmds: [{
                    type: "over",
                    maxLength: 20,
                    label: "搜索插件应用"
                }]
            },
            func: (e,t,i)=>{
                e.windowCmp.ffffffff.goPluginStore(i)
            }
        },
        saveimage: {
            feature: {
                code: "saveimage",
                explain: "保存为图片文件到下载目录",
                icon: "res/native/imgfile.png",
                cmds: [{
                    type: "img",
                    label: "保存为图片文件"
                }]
            },
            func: (e,i,n)=>{
                if (e.windowCmp.hideMainWindow(),
                !/^data:image\/([a-z]+);base64,/.test(n))
                    return;
                const o = RegExp.$1
                  , s = l().join(I().getDownloadsFolderPath() || t.app.getPath("desktop"), "uTools_" + Date.now() + "." + o);
                x().writeFile(s, n.replace(/^data:image\/([a-z]+);base64,/, ""), "base64", (e=>{
                    e || t.shell.showItemInFolder(s)
                }
                ))
            }
        },
        showfolder: {
            feature: {
                code: "showfolder",
                explain: "前往文件夹",
                icon: "res/native/folderopen.svg",
                cmds: [{
                    type: "regex",
                    match: '/^[A-Za-z]:(?:\\\\|\\/\\/?|\\\\{2})(?![\\/\\\\])[^:*?"<>|\\f\\n\\r\\t\\v]*$/',
                    label: "前往文件夹"
                }]
            },
            func: (e,i,n)=>{
                n = l().normalize(n.trim()),
                x().existsSync(n) || (n = l().dirname(n),
                x().existsSync(n)) ? (e.windowCmp.hideMainWindow(!1),
                x().lstat(n, ((e,i)=>{
                    e || i.isFile() ? t.shell.showItemInFolder(n) : t.shell.openPath(n)
                }
                ))) : new t.Notification({
                    body: "文件、文件夹都不存在"
                }).show()
            }
        },
        copyfile: {
            feature: {
                code: "copyfile",
                explain: "复制文件或文件夹到剪贴板",
                icon: "res/native/clip.svg",
                cmds: [{
                    type: "regex",
                    match: '/^\\s*[A-Za-z]:(?:\\\\|\\/\\/?|\\\\{2})(?![\\/\\\\])[^:*?"<>|\\f\\n\\r\\t\\v]*$/m',
                    maxLength: 5e3,
                    label: "复制文件"
                }]
            },
            func: (e,i,n)=>{
                const o = n.match(/^[A-Za-z]:(?:\\|\/\/?|\\{2})(?![/\\])[^:*?"<>|\f\n\r\t\v]*$/gm).map((e=>l().normalize(e.trim()))).filter((e=>x().existsSync(e)));
                0 !== o.length ? (e.windowCmp.hideMainWindow(),
                e.copyFile(o)) : new t.Notification({
                    body: "文件不存在"
                }).show()
            }
        },
        openitem: {
            feature: {
                code: "openitem",
                explain: "系统默认方式打开文件",
                icon: "res/native/openitem.png",
                cmds: [{
                    type: "regex",
                    match: '/^[A-Za-z]:(?:\\\\|\\/\\/?|\\\\{2})(?![\\/\\\\])[^:*?"<>|\\f\\n\\r\\t\\v]+\\.\\w{2,10}$/',
                    label: "打开文件"
                }]
            },
            func: (e,i,n)=>{
                n = l().normalize(n.trim()),
                x().existsSync(n) ? (e.windowCmp.hideMainWindow(!1),
                t.shell.openPath(n)) : new t.Notification({
                    body: "文件不存在"
                }).show()
            }
        },
        openweburl: {
            feature: {
                code: "openweburl",
                explain: "默认浏览器打开网址",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "regex",
                    match: '/^(?:https?:\\/\\/)?(?:localhost|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3})|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#][^\\s"]*)?$/i',
                    label: "打开网址"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(!1),
                /^https?:\/\//.test(n) ? t.shell.openExternal(n) : t.shell.openExternal("https://" + n)
            }
        },
        copyfilepath: {
            feature: {
                code: "copyfilepath",
                explain: "复制路径",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "files",
                    label: "复制路径"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(n.map((e=>e.path)).join("\n"))
            }
        },
        copyfilename: {
            feature: {
                code: "copyfilename",
                explain: "提取文件名称",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "files",
                    label: "提取文件名称"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(n.map((e=>e.isFile ? l().parse(e.path).name : e.name)).join("\n"))
            }
        },
        filedialog_select_path: {
            feature: {
                code: "filedialog_select_path",
                explain: '匹配任意「文件选择框」，切换到"文件资源管理器"已打开目录',
                icon: "res/native/fileexplorer.png",
                cmds: [{
                    type: "window",
                    match: {
                        class: "#32770"
                    },
                    label: '切换到"文件资源管理器"路径'
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow();
                let o = I().getAllExplorerWindowLocationUrls();
                if (0 === o.length)
                    return void new t.Notification({
                        body: '未检测到已打开的 "文件资源管理器" 窗口!'
                    }).show();
                if (o = o.filter((e=>!!e)),
                0 === o.length)
                    return void new t.Notification({
                        body: '"文件资源管理器" 窗口目录非有效路径!'
                    }).show();
                let s = [...new Set(o)].map((e=>l().resolve(decodeURI(e.replace(/^file:\/\/\//, "")))));
                s = s.filter((e=>x().existsSync(e))),
                1 !== s.length ? (s.push("取消"),
                t.dialog.showMessageBox({
                    buttons: s,
                    title: ' 检测到多个 "文件资源管理器" 窗口',
                    message: " 选择切换的目录",
                    defaultId: 0,
                    cancelId: s.length - 1
                }).then((({response: e})=>{
                    e !== s.length - 1 && (I().setFolderToFilePopUpDialog(n.id, s[e]) || (t.clipboard.writeText(s[e]),
                    I().simulateKeyboardTap("l", "ctrl"),
                    setTimeout((()=>{
                        I().simulateKeyboardTap("v", "ctrl"),
                        I().simulateKeyboardTap("enter")
                    }
                    ), 200)))
                }
                ))) : I().setFolderToFilePopUpDialog(n.id, s[0]) || (t.clipboard.writeText(s[0]),
                I().simulateKeyboardTap("l", "ctrl"),
                setTimeout((()=>{
                    I().simulateKeyboardTap("v", "ctrl"),
                    I().simulateKeyboardTap("enter")
                }
                ), 200))
            }
        }
    }
      , it = [{
        code: "call:actionSpawn rundll32.exe user32.dll,LockWorkStation",
        icon: "res/native/lock.png",
        explain: "电脑锁屏",
        cmds: ["锁屏", "Lock"]
    }, {
        code: "call:shutdown sleep",
        icon: "res/native/sleep.png",
        explain: "电脑睡眠",
        cmds: ["睡眠", "Sleep"]
    }, {
        code: "call:shutdown -l",
        icon: "res/native/logout.png",
        explain: "当前操作系统账号注销",
        cmds: ["注销", "Logout"]
    }, {
        code: "call:shutdown -r -t 00",
        icon: "res/native/reboot.png",
        explain: "电脑重启",
        cmds: ["重启", "Reboot"]
    }, {
        code: "call:shutdown -s -t 00",
        icon: "res/native/shutdown.png",
        explain: "电脑关机",
        cmds: ["关机", "Shutdown"]
    }, {
        code: "call:actionSpawn explorer.exe shell:::{3080F90D-D7AD-11D9-BD98-0000947B0257}",
        icon: "res/native/rundll32.png",
        explain: "桌面显示切换",
        cmds: ["显示桌面", "Show Desktop"]
    }, {
        code: "call:screenColorPicker",
        icon: "res/native/picker.png",
        explain: "屏幕颜色拾取",
        cmds: ["取色", "Pick Color"]
    }, {
        code: "call:emptyRecycleBin",
        icon: "res/native/recyclebin.png",
        explain: "清空回收站",
        cmds: ["清空回收站"]
    }, {
        code: "call:setNativeWindowAlwaysOnTop",
        icon: "res/native/ontop.png",
        explain: "置顶当前应用的活动窗口或取消置顶",
        cmds: ["置顶窗口/取消置顶"]
    }, {
        code: "call:regionScreenshot",
        icon: "res/native/screenshot.png",
        explain: "截图完呼出 uTools",
        cmds: ["截图"]
    }, {
        code: "call:windowScreenshot",
        icon: "res/native/camera.png",
        explain: "当前应用窗口截图",
        cmds: ["窗口截图"]
    }, {
        code: "call:showNativeWorkWindowInfo",
        icon: "res/native/window.png",
        explain: "查看当前活动窗口的信息",
        cmds: ["窗口信息"]
    }, {
        code: "call:getLanIp",
        icon: "res/native/ip.png",
        explain: "获取我的电脑局域网IP地址",
        cmds: ["内部网络IP地址"]
    }];
    function nt(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class ot {
        constructor(e, i, o, s, r) {
            nt(this, "mainServices", {
                nativeOpen: (e,i,n,o)=>{
                    if (this.reportCmp.info("native.open", {
                        way: n
                    }),
                    i.startsWith("localopen:") && (i = i.replace("localopen:", ""),
                    !x().existsSync(i)))
                        return new t.Notification({
                            body: "文件不存在，打开失败"
                        }).show(),
                        delete this.pluginsCmp.pluginContainer[""].featureDic[i],
                        void this.windowCmp.refreshCmdSource();
                    if (/^([A-Za-z]:\\|\\\\)/.test(i))
                        i = l().normalize(i),
                        this.windowCmp.hideMainWindow(!1),
                        o && I().adminShellExecute(i) || t.shell.openPath(i);
                    else {
                        if (i.startsWith("ms-settings:"))
                            return this.windowCmp.hideMainWindow(!1),
                            void t.shell.openExternal(i);
                        if (i.startsWith("call:")) {
                            const e = i.replace("call:", "").split(/ +/g)
                              , t = e.shift();
                            return void ("function" == typeof this[t] && this[t].apply(this, e))
                        }
                        this.windowCmp.hideMainWindow(!1),
                        I().activateApplication(i)
                    }
                }
                ,
                nativeMatchCall: (e,t,i,n,o)=>{
                    if (t.startsWith("socket/"))
                        return this.reportCmp.info("native.open", {
                            way: o,
                            featureCode: "socket"
                        }),
                        void this.connectionCmp.sendData(t, i, n);
                    if (this.reportCmp.info("native.open", {
                        way: o
                    }),
                    t in tt)
                        try {
                            tt[t].func(this, i, n)
                        } catch (e) {}
                }
            }),
            nt(this, "ffffffffServices", {
                setEnableNativeApp: (e,t)=>{
                    n().set("enableNativeApp", !0 === t),
                    setImmediate((()=>{
                        this.initFeatures()
                    }
                    )),
                    e.returnValue = !0
                }
            }),
            this.pluginsCmp = e,
            this.windowCmp = i,
            this.clipboardCmp = i.clipboardCmp,
            this.reportCmp = o,
            this.appCmp = s,
            this.connectionCmp = r,
            this.screencaptureCmp = s.screencaptureCmp,
            this.screencolorpickerCmp = s.screencolorpickerCmp,
            this.osVersion = parseFloat(S().release()),
            this.isWindows11 = this.osVersion >= 10 && parseInt(S().release().split(".").pop()) >= 22e3,
            this.systemAccentColor = "#" + t.systemPreferences.getAccentColor()
        }
        init() {
            n().has("enableNativeApp") || n().set("enableNativeApp", !0),
            setImmediate((()=>{
                this.initFeatures()
            }
            ))
        }
        dirRead(e, t, i, n, o) {
            if (!x().existsSync(e))
                return;
            let s = [];
            try {
                s = x().readdirSync(e)
            } catch (e) {}
            if (0 !== s.length)
                for (const r of s) {
                    const s = l().join(e, r);
                    let a = !1;
                    try {
                        a = x().lstatSync(s).isDirectory()
                    } catch (e) {}
                    a ? i < t && this.dirRead(s, t, i + 1, n, o) : /\.lnk$/i.test(r) && (!o && (r.toLowerCase().startsWith("uninstall") || r.startsWith("卸载") || r.toLowerCase().endsWith("卸载.lnk")) || n.push(s))
                }
        }
        setLnkMatchFeature(e, i, n) {
            tt["path_open_to" + e] = {
                func: (i,o,s)=>{
                    let r;
                    if (i.windowCmp.hideMainWindow(!1),
                    "files" === o)
                        r = s[0].path;
                    else if (r = this.appCmp.getWindowsExplorerCurrentDirctoryPath(s),
                    !r)
                        return void new t.Notification({
                            body: "「" + s.title + "」非有效路径"
                        }).show();
                    if ("Visual Studio Code" !== e) {
                        if ("PowerShell" === e)
                            return r.includes("'") ? void new t.Notification({
                                body: "路径包含特殊字符 '"
                            }).show() : void Re().spawn("start", ["powershell", "-noexit", "-command", `"Set-Location '${r}'"`], {
                                shell: "cmd.exe",
                                detached: !0
                            });
                        if ("CMD" === e) {
                            if (/&|'|\^/.test(r))
                                return void new t.Notification({
                                    body: "路径包含特殊字符 &'^"
                                }).show();
                            Re().spawn("start", ["cmd", "/k", `"cd /d ${r}"`], {
                                shell: "cmd.exe",
                                detached: !0
                            })
                        }
                    } else
                        Re().spawn(n, [r], {
                            detached: !0
                        })
                }
            },
            this.pluginsCmp.setFeature("", {
                code: "path_open_to" + e,
                explain: e + " 中打开",
                icon: i,
                cmds: [{
                    type: "files",
                    fileType: "directory",
                    minLength: 1,
                    maxLength: 1,
                    label: e + " 中打开"
                }, {
                    type: "window",
                    match: {
                        app: ["explorer.exe", "SearchApp.exe", "SearchHost.exe", "FESearchHost.exe"],
                        class: ["CabinetWClass", "ExploreWClass"]
                    },
                    label: e + " 中打开"
                }]
            })
        }
        setLnkFeatures() {
            const e = [];
            let i;
            try {
                i = t.app.getPath("desktop")
            } catch (e) {}
            i && this.dirRead(i, 0, 0, e),
            this.dirRead(process.env.ProgramData + "\\Microsoft\\Windows\\Start Menu", 3, 0, e),
            this.dirRead(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu", 3, 0, e);
            const n = I().getLnksInfo.apply(null, e);
            this.lnkNameTargetDic = {},
            n.forEach((e=>{
                void 0 !== e.target && (e.name = l().parse(e.path).name,
                ("" === e.target || "%comspec%" === e.target || [".exe", ".msc", ".bat", ".ico"].includes(l().extname(e.target).toLowerCase())) && (this.lnkNameTargetDic[(e.name + e.target).toLowerCase()] = e))
            }
            ));
            const o = [];
            Object.values(this.lnkNameTargetDic).forEach((e=>{
                const t = {
                    code: e.path,
                    explain: e.description || e.target || e.path,
                    cmds: [e.name],
                    icon: "nativeicon://" + e.path
                };
                if ("" === e.target || 0 === e.target.indexOf("%")) {
                    const i = I().getLnkLocalName(e.path);
                    i && e.name !== i && t.cmds.unshift(i)
                }
                if (0 === e.target.indexOf("%")) {
                    let i = l().basename(e.target);
                    ["cmd.exe", "WF.msc"].includes(i) && (i = l().parse(i).name,
                    t.cmds.push(i),
                    "cmd" === i && this.setLnkMatchFeature("CMD", t.icon, e.target))
                }
                o.push(t),
                ["Visual Studio Code", "Windows PowerShell"].includes(e.name) && ("Windows PowerShell" === e.name ? this.setLnkMatchFeature("PowerShell", t.icon, e.target) : this.setLnkMatchFeature(e.name, t.icon, e.target))
            }
            ));
            const s = process.env.SystemRoot;
            [{
                code: s + "\\System32\\gpedit.msc",
                explain: "本地组策略编辑器",
                cmds: ["本地组策略编辑器"],
                icon: "nativeicon://" + s + "\\System32\\gpedit.msc"
            }, {
                code: s + "\\System32\\DisplaySwitch.exe",
                explain: "投影到第二屏幕",
                cmds: ["投影"],
                icon: "nativeicon://" + s + "\\System32\\DisplaySwitch.exe",
                backgroundColor: this.systemAccentColor
            }, {
                code: s + "\\System32\\MRT.exe",
                explain: "恶意软件删除工具",
                cmds: ["恶意软件删除工具", "MRT"],
                icon: "nativeicon://" + s + "\\System32\\MRT.exe"
            }].forEach((e=>{
                x().existsSync(e.code) && o.push(e)
            }
            )),
            [{
                code: "call:processSpawn rundll32.exe sysdm.cpl,EditEnvironmentVariables",
                cmds: ["编辑用户环境变量"]
            }, {
                code: "call:processSpawn rundll32.exe shell32.dll,Control_RunDLL sysdm.cpl,,3",
                cmds: ["系统属性环境变量"]
            }, {
                code: "call:processSpawn rundll32.exe keymgr.dll,KRShowKeyMgr",
                cmds: ["存储的用户名和密码"]
            }, {
                code: "call:processSpawn rundll32.exe shell32.dll,Control_RunDLL appwiz.cpl,,0",
                cmds: ["卸载或更改程序"]
            }, {
                code: "call:processSpawn rundll32.exe devmgr.dll DeviceManager_Execute",
                cmds: ["设备管理器"]
            }].forEach((e=>{
                e.explain = e.cmds[0],
                e.icon = "res/native/rundll32.png",
                o.push(e)
            }
            )),
            o.push({
                code: "call:processSpawn explorer.exe shell:RecycleBinFolder",
                icon: "res/native/recyclebin.png",
                cmds: ["回收站"],
                explain: "打开回收站"
            }),
            o.forEach((e=>{
                this.pluginsCmp.setFeature("", e)
            }
            )),
            this.startMenuLnkWatcher = this.lnkDirWatch([process.env.ProgramData + "\\Microsoft\\Windows\\Start Menu", process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu"], 3)
        }
        lnkDirWatch(e, t) {
            return Ge().watch(e, {
                persistent: !0,
                ignoreInitial: !0,
                followSymlinks: !1,
                ignorePermissionErrors: !0,
                disableGlobbing: !0,
                depth: t
            }).on("unlink", (e=>{
                if (!/\.lnk$/i.test(e))
                    return;
                if (!(e in this.pluginsCmp.pluginContainer[""].featureDic))
                    return;
                const t = Object.values(this.lnkNameTargetDic).find((t=>t.path === e));
                t && delete this.lnkNameTargetDic[(t.name + t.target).toLowerCase()],
                delete this.pluginsCmp.pluginContainer[""].featureDic[e],
                this.windowCmp.refreshCmdSource()
            }
            )).on("add", (e=>{
                if (!/\.lnk$/i.test(e))
                    return;
                const i = l().basename(e);
                i.toLowerCase().startsWith("uninstall") || i.startsWith("卸载") || i.toLowerCase().endsWith("卸载.lnk") || setTimeout((()=>{
                    if (!x().existsSync(e))
                        return;
                    const t = I().getLnksInfo(e)[0];
                    if (!t)
                        return;
                    if (t.target) {
                        const e = l().extname(t.target).toLowerCase();
                        if (![".exe", ".msc", ".bat", ".ico"].includes(e))
                            return
                    }
                    t.name = l().parse(i).name;
                    const n = (t.name + t.target).toLowerCase();
                    if (n in this.lnkNameTargetDic)
                        return;
                    this.lnkNameTargetDic[n] = t;
                    const o = {
                        code: t.path,
                        explain: t.description || t.target || e,
                        cmds: [t.name],
                        icon: "nativeicon://" + t.path
                    };
                    this.pluginsCmp.setFeature("", o),
                    this.windowCmp.refreshCmdSource()
                }
                ), 0 === t ? 3e3 : 2e3)
            }
            )).on("error", (()=>{}
            ))
        }
        setActionAppFeatures() {
            it.forEach((e=>{
                e.icon || (e.icon = "res/native/symbolic.svg"),
                this.pluginsCmp.setFeature("", e)
            }
            ))
        }
        getUWPLocalString(e, t) {
            if (!t)
                return t;
            if (0 === t.indexOf("ms-resource:")) {
                const i = e.substr(0, e.indexOf("_"));
                if (t.includes(i))
                    return I().getIndirectString(`@{${e}?${t}}`);
                let n = t.replace("ms-resource:", "");
                return 0 === n.indexOf("/") ? (n = n.replace(/^\/+/, "/"),
                I().getIndirectString(`@{${e}?ms-resource://${i}${n}}`)) : n.toLowerCase().indexOf("/resources/") > 0 || 0 === n.toLowerCase().indexOf("resources/") ? I().getIndirectString(`@{${e}?ms-resource://${i}/${n}}`) : I().getIndirectString(`@{${e}?ms-resource://${i}/resources/${n}}`)
            }
            return /&#x[a-f0-9]{2,5};/i.test(t) ? t.replace(/&#x([a-f0-9]{2,5});/gi, ((e,t)=>String.fromCharCode(parseInt(t, 16)))) : t
        }
        setUWPFeatures() {
            (I().uwp.getAppxPackage() || []).forEach((e=>{
                const t = l().join(e.location, "AppxManifest.xml");
                if (!x().existsSync(t))
                    return;
                let i = null;
                try {
                    i = x().readFileSync(t, "utf8")
                } catch (e) {
                    return
                }
                const n = i.match(/<Application[^>]+Id="[^"]+"/g);
                if (!n)
                    return;
                const o = i.match(/:VisualElements[^>]+>/g);
                if (o)
                    for (let t = 0; t < n.length; t++) {
                        if (!o[t])
                            continue;
                        if (o[t].includes('AppListEntry="none"'))
                            continue;
                        const i = n[t].match(/Id="([^"]+)"/)[1]
                          , s = {};
                        o[t].match(/[\w]+="[^"]+"/g).forEach((e=>{
                            const t = e.split('="');
                            s[t[0]] = t[1].replace(/"$/, "")
                        }
                        ));
                        const r = this.getUWPLocalString(e.fullname, s.DisplayName);
                        if (!r)
                            continue;
                        let a = s.Square44x44Logo;
                        if (!a && s.Square150x150Logo && (a = s.Square150x150Logo),
                        !a)
                            continue;
                        a = a.replace(/\\/g, "/");
                        let c = I().getIndirectString(`@{${e.fullname}?ms-resource://${e.fullname.substr(0, e.fullname.indexOf("_"))}/Files/${a}}`);
                        if (!c && (c = l().join(e.location, a),
                        !x().existsSync(c))) {
                            const e = l().dirname(c)
                              , t = l().parse(c)
                              , i = [".targetsize-48_altform-unplated", ".targetsize-48_altform-lightunplated", ".targetsize-48"];
                            for (let n = 0; n < i.length && (c = l().join(e, t.name + i[n] + t.ext),
                            !x().existsSync(c)); n++)
                                ;
                        }
                        if (!x().existsSync(c))
                            continue;
                        const h = this.getUWPLocalString(e.fullname, s.Description) || r
                          , u = {
                            code: e.familyname + "!" + i,
                            explain: h,
                            cmds: [r],
                            icon: (0,
                            d.pathToFileURL)(c).href
                        };
                        "transparent" === s.BackgroundColor ? u.backgroundColor = this.systemAccentColor : u.backgroundColor = s.BackgroundColor,
                        this.pluginsCmp.setFeature("", u)
                    }
            }
            )),
            I().uwp.uwpChangeNotify((e=>{
                0 === e && setTimeout((()=>{
                    this.goRefreshUwpFeatures()
                }
                ), 3e3)
            }
            ))
        }
        goRefreshUwpFeatures() {
            const e = this.pluginsCmp.pluginContainer[""].featureDic
              , t = [];
            for (const i in e)
                e[i].icon && 0 === e[i].icon.indexOf("file://") && t.push(i);
            t.forEach((t=>{
                delete e[t]
            }
            )),
            this.setUWPFeatures(),
            this.windowCmp.refreshCmdSource()
        }
        setSettingsFeatures() {
            et.forEach((e=>{
                e.explain = "电脑系统设置",
                e.icon = "res/native/mssetting.png",
                e.backgroundColor = this.systemAccentColor,
                this.pluginsCmp.setFeature("", e)
            }
            ))
        }
        setMatchAppFeatures() {
            Object.values(tt).forEach((e=>{
                e.feature && this.pluginsCmp.setFeature("", e.feature)
            }
            ))
        }
        initFeatures() {
            this.startMenuLnkWatcher && (this.startMenuLnkWatcher.close(),
            delete this.startMenuLnkWatcher),
            this.pluginsCmp.pluginContainer[""] = {
                name: "",
                pluginName: "",
                logo: "res/logo.png",
                featureDic: {}
            },
            this.pluginsCmp.setFeature("", {
                code: "call:goHelp",
                icon: "res/native/help.png",
                explain: "视频介绍 uTools",
                cmds: ["uTools 介绍", "帮助", "Help"]
            }),
            this.pluginsCmp.setFeature("", {
                code: "call:killAllPlugin",
                icon: "res/native/clear.svg",
                explain: "uTools 后台插件应用全部退出",
                cmds: ["Clear"]
            }),
            this.setMatchAppFeatures(),
            this.setActionAppFeatures(),
            n().get("enableNativeApp") && (this.setLnkFeatures(),
            this.osVersion >= 6.2 && (this.setUWPFeatures(),
            this.osVersion >= 10 && this.setSettingsFeatures())),
            this.appCmp.initLocalOpenFeatures().then((()=>{
                this.windowCmp.refreshCmdSource()
            }
            ))
        }
        shutdown(...e) {
            this.windowCmp.hideMainWindow(!1);
            let i = "";
            if ("-s" === e[0])
                i = "关机";
            else if ("-r" === e[0])
                i = "重启";
            else if ("-l" === e[0])
                i = "注销";
            else {
                if ("sleep" !== e[0])
                    return;
                i = "睡眠"
            }
            t.dialog.showMessageBox({
                buttons: ["取消", i],
                title: " uTools",
                message: " 确定要执行「" + i + "」吗？",
                defaultId: 1
            }).then((({response: t})=>{
                1 === t && ("sleep" === e[0] ? Re().spawn("rundll32.exe", ["powrprof.dll,SetSuspendState", "0,1,0"], {
                    detached: !0
                }) : Re().spawn("Shutdown.exe", e, {
                    detached: !0
                }))
            }
            ))
        }
        processSpawn(...e) {
            this.windowCmp.hideMainWindow(!1);
            const t = e.shift();
            Re().spawn(t, e, {
                detached: !0
            })
        }
        actionSpawn(...e) {
            this.windowCmp.hideMainWindow(!1);
            const t = e.shift();
            Re().spawn(t, e, {
                detached: !0
            })
        }
        copyFile(e) {
            Array.isArray(e) || (e = [e]),
            0 !== (e = e.filter((e=>x().existsSync(e)))).length && I().copyFile.apply(null, e)
        }
        goHelp() {
            this.windowCmp.hideMainWindow(!1),
            this.appCmp.goHelp()
        }
        killAllPlugin() {
            this.windowCmp.killAllPlugins()
        }
        mousePosWindowInfo() {
            const e = I().getMousePosWindow();
            e ? (e.app = l().basename(e.appPath),
            this.appCmp.showNativeWorkWindowInfo(e)) : new t.Notification({
                body: "未捕获到窗口信息"
            }).show()
        }
        screenColorPicker() {
            this.windowCmp.hideMainWindow(),
            this.screencolorpickerCmp.action((({hex: e})=>{
                t.clipboard.writeText(e),
                new t.Notification({
                    body: "颜色 " + e + " 已复制到剪贴板"
                }).show()
            }
            ))
        }
        emptyRecycleBin() {
            this.windowCmp.hideMainWindow(),
            t.dialog.showMessageBox({
                buttons: ["取消", "清空回收站"],
                title: " uTools",
                message: " 确定要执行「清空回收站」吗？",
                detail: " 回收站内全部文件永久删除",
                defaultId: 1
            }).then((({response: e})=>{
                1 === e && I().emptyRecycleBin()
            }
            ))
        }
        getLanIp() {
            this.windowCmp.hideMainWindow(),
            N().then((e=>{
                e ? (t.clipboard.writeText(e),
                new t.Notification({
                    body: '内部网络IP地址 "' + e + '" 已复制到剪贴板'
                }).show()) : new t.Notification({
                    body: "未获取到内部网络 IP 地址"
                }).show()
            }
            ))
        }
        setNativeWindowAlwaysOnTop() {
            this.windowCmp.hideMainWindow();
            const e = this.windowCmp.display.nativeWorkWindowInfo;
            e && "#32770" !== e.class && ("explorer.exe" !== e.app || "Progman" !== e.class && "WorkerW" !== e.class) && (I().setWindowAlwaysOnTop(e.id) ? new t.Notification({
                body: e.app + " 窗口置顶"
            }).show() : new t.Notification({
                body: e.app + " 窗口取消置顶"
            }).show())
        }
        regionScreenshot() {
            this.windowCmp.hideMainWindow(),
            I().regionScreenshot((e=>{
                e && (this.clipboardCmp.once("change", (()=>{
                    this.windowCmp.restoreShowMainWindow()
                }
                )),
                t.clipboard.writeImage(t.nativeImage.createFromBuffer(e)))
            }
            ))
        }
        windowScreenshot() {
            this.windowCmp.hideMainWindow();
            const e = this.windowCmp.display.nativeWorkWindowInfo;
            if (!e || 0 === e.width || 0 === e.height)
                return void new t.Notification({
                    body: "未捕获到工作窗口"
                }).show();
            const i = t.screen.screenToDipRect(null, {
                x: e.x,
                y: e.y,
                width: e.width,
                height: e.height
            })
              , n = t.screen.getDisplayMatching(i);
            let o;
            if (i.width >= n.workAreaSize.width || i.height >= n.workAreaSize.height)
                if (I().windowIsZoomed(e.id)) {
                    const e = t.screen.dipToScreenRect(null, n.workArea);
                    o = I().screenCapture(e.x, e.y, e.width, e.height)
                } else
                    o = I().screenCapture(e.x, e.y, e.width, e.height);
            else
                o = I().windowScreenshot(e.id, n.scaleFactor, this.isWindows11);
            if (o) {
                const e = t.nativeImage.createFromBuffer(o);
                t.clipboard.writeImage(e)
            }
        }
        showNativeWorkWindowInfo() {
            this.appCmp.showNativeWorkWindowInfo()
        }
    }
    const st = {
        pluginstoresearch: {
            feature: {
                code: "pluginstoresearch",
                explain: "前往 uTools 插件应用市场",
                icon: "res/native/plugin-search.png",
                cmds: [{
                    type: "over",
                    maxLength: 20,
                    label: "搜索插件应用"
                }]
            },
            func: (e,t,i)=>{
                e.windowCmp.ffffffff.goPluginStore(i)
            }
        },
        saveimage: {
            feature: {
                code: "saveimage",
                explain: "保存为图片文件到下载目录",
                icon: "res/native/imgfile.png",
                cmds: [{
                    type: "img",
                    label: "保存为图片文件"
                }]
            },
            func: (e,i,n)=>{
                if (e.windowCmp.hideMainWindow(),
                !/^data:image\/([a-z]+);base64,/.test(n))
                    return;
                const o = RegExp.$1
                  , s = l().join(t.app.getPath("downloads"), "uTools_" + Date.now() + "." + o);
                x().writeFile(s, n.replace(/^data:image\/([a-z]+);base64,/, ""), "base64", (e=>{
                    e || t.shell.showItemInFolder(s)
                }
                ))
            }
        },
        showfolder: {
            feature: {
                code: "showfolder",
                explain: "前往文件夹",
                icon: "res/native/folderopen.svg",
                cmds: [{
                    type: "regex",
                    match: "/^(?:~?\\/[^/\\n\\r\\f\\v]+)+\\/?$/",
                    label: "前往文件夹"
                }]
            },
            func: (e,i,n)=>{
                (n = n.trim()).startsWith("~") && (n = n.replace("~", t.app.getPath("home"))),
                n = l().normalize(n),
                x().existsSync(n) || (n = l().dirname(n),
                x().existsSync(n)) ? (e.windowCmp.hideMainWindow(),
                x().lstat(n, ((e,i)=>{
                    e || i.isFile() ? t.shell.showItemInFolder(n) : t.shell.openPath(n)
                }
                ))) : new t.Notification({
                    title: "uTools",
                    body: "文件、文件夹都不存在"
                }).show()
            }
        },
        copyfile: {
            feature: {
                code: "copyfile",
                explain: "复制文件或文件夹到剪贴板",
                icon: "res/native/clip.svg",
                cmds: [{
                    type: "regex",
                    match: "/^(?:\\/[^/\\n\\r\\f\\v]+)+\\/?$/m",
                    maxLength: 5e3,
                    label: "复制文件"
                }]
            },
            func: (e,i,n)=>{
                const o = n.match(/^(?:\/[^/\n\r\f\v]+)+\/?$/gm).map((e=>e.trim())).filter((e=>x().existsSync(e)));
                0 !== o.length ? (e.windowCmp.hideMainWindow(),
                e.copyFile(o)) : new t.Notification({
                    title: "uTools",
                    body: "文件不存在",
                    silent: !1
                }).show()
            }
        },
        openitem: {
            feature: {
                code: "openitem",
                explain: "系统默认方式打开文件",
                icon: "res/native/openitem.png",
                cmds: [{
                    type: "regex",
                    match: "/^(?:~?\\/[^/\\n\\r\\f\\v]+)+\\.\\w{2,10}$/",
                    label: "打开文件"
                }]
            },
            func: (e,i,n)=>{
                (n = n.trim()).startsWith("~") && (n = n.replace("~", t.app.getPath("home"))),
                n = l().normalize(n),
                x().existsSync(n) ? (e.windowCmp.hideMainWindow(!1),
                t.shell.openPath(n)) : new t.Notification({
                    title: "uTools",
                    body: "文件不存在"
                }).show()
            }
        },
        openweburl: {
            feature: {
                code: "openweburl",
                explain: "默认浏览器打开网址",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "regex",
                    match: '/^(?:https?:\\/\\/)?(?:localhost|(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3})|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#][^\\s"]*)?$/i',
                    label: "打开网址"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                /^https?:\/\//.test(n) ? t.shell.openExternal(n) : t.shell.openExternal("https://" + n)
            }
        },
        copyfilepath: {
            feature: {
                code: "copyfilepath",
                explain: "复制路径",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "files",
                    label: "复制路径"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(n.map((e=>e.path)).join("\n"))
            }
        },
        copyfilename: {
            feature: {
                code: "copyfilename",
                explain: "提取文件名称",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "files",
                    label: "提取文件名称"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(n.map((e=>e.isFile ? l().parse(e.path).name : e.name)).join("\n"))
            }
        },
        copy_current_folder_path: {
            feature: {
                code: "copy_current_folder_path",
                explain: "复制当前目录路径",
                icon: "res/native/link.svg",
                cmds: [{
                    type: "window",
                    match: {
                        app: ["dde-file-manager", "nautilus"]
                    },
                    label: "复制当前目录路径"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(""),
                I().simulateKeyboardTap("l", "ctrl"),
                setTimeout((()=>{
                    I().simulateKeyboardTap("c", "ctrl"),
                    I().simulateKeyboardTap("escape")
                }
                ), 100)
            }
        },
        file_manager_new_file: {
            feature: {
                code: "file_manager_new_file",
                explain: "新建文件",
                icon: "res/native/newfile.png",
                cmds: [{
                    type: "window",
                    match: {
                        app: "nautilus"
                    },
                    label: "新建文件"
                }]
            },
            func: (e,i,n)=>{
                e.windowCmp.hideMainWindow(),
                t.clipboard.writeText(""),
                I().simulateKeyboardTap("l", "ctrl"),
                I().simulateKeyboardTap("c", "ctrl"),
                I().simulateKeyboardTap("escape"),
                setTimeout((()=>{
                    const e = t.clipboard.readText();
                    e && x().existsSync(e) && Re().exec('zenity --title "新建文件" --entry --text "文件名称"', ((i,n,o)=>{
                        if (i) {
                            if (!o)
                                return;
                            if (!(o = o.trim()))
                                return;
                            if (o.endsWith("GtkDialog mapped without a transient parent. This is discouraged."))
                                return;
                            return void new t.Notification({
                                title: "uTools",
                                body: o
                            }).show()
                        }
                        if (!n)
                            return;
                        const s = l().join(e, n.trim());
                        if (x().existsSync(s))
                            new t.Notification({
                                title: "uTools",
                                body: "文件已存在"
                            }).show();
                        else
                            try {
                                x().closeSync(x().openSync(s, "w"))
                            } catch (e) {
                                new t.Notification({
                                    title: "uTools",
                                    body: "新建文件出错了"
                                }).show()
                            }
                    }
                    ))
                }
                ), 100)
            }
        }
    }
      , rt = [{
        code: "call:shutdown reboot",
        explain: "电脑重启",
        icon: "res/native/reboot.png",
        cmds: ["重启", "Reboot"]
    }, {
        code: "call:shutdown",
        explain: "电脑关机",
        icon: "res/native/shutdown.png",
        cmds: ["关机", "Shutdown"]
    }, {
        code: "call:showDesktop",
        icon: "res/native/rundll32.png",
        explain: "显示桌面",
        cmds: ["显示桌面", "Show Desktop"]
    }, {
        code: "call:screenColorPicker",
        icon: "res/native/picker.png",
        explain: "屏幕颜色拾取",
        cmds: ["取色", "Pick Color"]
    }, {
        code: "call:regionScreenshot",
        icon: "res/native/screenshot.png",
        explain: "截图完呼出 uTools",
        cmds: ["截图", "截图完呼出 uTools"]
    }, {
        code: "call:windowScreenshot",
        icon: "res/native/camera.png",
        explain: "截图完呼出 uTools",
        cmds: ["窗口截图"]
    }, {
        code: "call:showNativeWorkWindowInfo",
        icon: "res/native/window.png",
        explain: "当前活动窗口的信息",
        cmds: ["窗口信息"]
    }, {
        code: "call:getLanIp",
        icon: "res/native/ip.png",
        explain: "获取我的电脑局域网IP地址",
        cmds: ["内部网络IP地址"]
    }]
      , at = [{
        code: "dbus-send --type=method_call --dest=org.gnome.ScreenSaver  /org/gnome/ScreenSaver org.gnome.ScreenSaver.Lock",
        explain: "电脑锁屏",
        icon: "res/native/lock.png",
        cmds: ["锁屏", "Lock"]
    }, {
        code: "gnome-session-quit",
        explain: "当前操作系统账号注销",
        icon: "res/native/logout.png",
        cmds: ["注销", "Logout"]
    }, {
        code: "call:shutdown reboot",
        explain: "电脑重启",
        icon: "res/native/reboot.png",
        cmds: ["重启", "Reboot"]
    }, {
        code: "call:shutdown",
        explain: "电脑关机",
        icon: "res/native/shutdown.png",
        cmds: ["关机", "Shutdown"]
    }, {
        code: "call:showDesktop",
        icon: "res/native/rundll32.png",
        explain: "桌面显示切换",
        cmds: ["显示桌面", "Show Desktop"]
    }, {
        code: "call:screenColorPicker",
        icon: "res/native/picker.png",
        explain: "屏幕颜色拾取",
        cmds: ["取色", "Pick Color"]
    }, {
        code: "call:regionScreenshot",
        icon: "res/native/screenshot.png",
        explain: "截图完呼出 uTools",
        cmds: ["截图", "截图完呼出 uTools"]
    }, {
        code: "call:windowScreenshot",
        icon: "res/native/camera.png",
        explain: "截图完呼出 uTools",
        cmds: ["窗口截图"]
    }, {
        code: "call:showNativeWorkWindowInfo",
        icon: "res/native/window.png",
        explain: "当前活动窗口的信息",
        cmds: ["窗口信息"]
    }, {
        code: "call:getLanIp",
        icon: "res/native/ip.png",
        explain: "获取我的电脑局域网IP地址",
        cmds: ["内部网络IP地址"]
    }];
    function ct(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class lt {
        constructor(e, i, o, s, r) {
            ct(this, "mainServices", {
                nativeOpen: (e,i,n)=>{
                    if (this.reportCmp.info("native.open", {
                        way: n
                    }),
                    i.startsWith("call:")) {
                        const e = i.replace("call:", "").split(/ +/g)
                          , t = e.shift();
                        "function" == typeof this[t] && this[t].apply(this, e)
                    } else {
                        if (i.startsWith("localopen:") && (i = i.replace("localopen:", ""),
                        !x().existsSync(i)))
                            return new t.Notification({
                                title: "uTools",
                                body: "文件不存在，打开失败"
                            }).show(),
                            delete this.pluginsCmp.pluginContainer[""].featureDic[i],
                            void this.windowCmp.refreshCmdSource();
                        if (this.windowCmp.hideMainWindow(),
                        i.startsWith("/"))
                            if (i in this.entryFileExec)
                                i = this.entryFileExec[i];
                            else
                                try {
                                    if (x().accessSync(i, x().constants.X_OK),
                                    x().lstatSync(i).isDirectory())
                                        return t.shell.openPath(i)
                                } catch (e) {
                                    return t.shell.openPath(i)
                                }
                        Re().exec(i)
                    }
                }
                ,
                nativeMatchCall: (e,t,i,n,o)=>{
                    if (t.startsWith("socket/"))
                        return this.reportCmp.info("native.open", {
                            way: o,
                            featureCode: "socket"
                        }),
                        void this.connectionCmp.sendData(t, i, n);
                    if (this.reportCmp.info("native.open", {
                        way: o
                    }),
                    t in st)
                        try {
                            st[t].func(this, i, n)
                        } catch (e) {}
                }
            }),
            ct(this, "ffffffffServices", {
                setEnableNativeApp: (e,t)=>{
                    n().set("enableNativeApp", !0 === t),
                    setImmediate((()=>{
                        this.initFeatures()
                    }
                    )),
                    e.returnValue = !0
                }
            }),
            this.pluginsCmp = e,
            this.windowCmp = i,
            this.clipboardCmp = i.clipboardCmp,
            this.reportCmp = o,
            this.appCmp = s,
            this.connectionCmp = r,
            this.screencaptureCmp = s.screencaptureCmp,
            this.screencolorpickerCmp = s.screencolorpickerCmp,
            this.entryFileExec = {},
            this.emptyIcon = l().join(__dirname, "res/native/linux.png");
            const a = Re().execSync("cat /etc/*release | grep -E ^NAME", {
                encoding: "utf8"
            }).toLowerCase();
            /name="(.+?)"/.test(a) ? (this.osName = RegExp.$1,
            "uos" === this.osName ? this.osName = "deepin" : ["deepin", "ubuntu"].includes(this.osName) || (this.osName = "ubuntu")) : this.osName = "ubuntu"
        }
        init() {
            n().has("enableNativeApp") || n().set("enableNativeApp", !0);
            let e = null;
            "deepin" === this.osName ? (e = I().getGSetting("com.deepin.dde.appearance", "icon-theme"),
            this.localIconThemes = [e],
            ["deepin", "hicolor"].forEach((e=>{
                this.localIconThemes.includes(e) || this.localIconThemes.push(e)
            }
            ))) : "ubuntu" === this.osName && (e = I().getGSetting("org.gnome.desktop.interface", "icon-theme"),
            ["ubuntu-mono-dark", "ubuntu-mono-light"].includes(e) && (e = "Yaru"),
            this.localIconThemes = [e],
            ["hicolor", "Adwaita", "Humanity"].forEach((e=>{
                this.localIconThemes.includes(e) || this.localIconThemes.push(e)
            }
            ))),
            this.emptyIcon = this.getIcon("empty"),
            this.appCmp.folderIconPath = this.getIcon("folder"),
            setImmediate((()=>{
                this.initFeatures()
            }
            ))
        }
        getIcon(e) {
            const t = ["48x48", "48", "scalable", "256x256", "512x512", "256", "512"]
              , i = ["apps", "categories", "devices", "mimetypes", "legacy", "actions", "places", "status", "mimes"]
              , n = [".png", ".svg"];
            for (const o of this.localIconThemes)
                for (const s of t)
                    for (const t of i)
                        for (const i of n) {
                            let n = l().join("/usr/share/icons", o, s, t, e + i);
                            if (x().existsSync(n))
                                return n;
                            if (n = l().join("/usr/share/icons", o, t, s, e + i),
                            x().existsSync(n))
                                return n
                        }
            return x().existsSync(l().join("/usr/share/pixmaps", e + ".png")) ? l().join("/usr/share/pixmaps", e + ".png") : this.emptyIcon
        }
        convertEntryFile2Feature(e) {
            let t = null;
            try {
                t = x().readFileSync(e, "utf8")
            } catch (e) {
                return null
            }
            if (!t.includes("[Desktop Entry]"))
                return null;
            t = t.substr(t.indexOf("[Desktop Entry]")).replace("[Desktop Entry]", "").trim();
            const i = t.indexOf("\n[");
            i > 0 && (t = t.substr(0, i).trim());
            const n = {};
            if (t.match(/^[\w\-[\]]+ ?=.*$/gm).forEach((e=>{
                const t = e.indexOf("=");
                n[e.substr(0, t).trim()] = e.substr(t + 1).trim()
            }
            )),
            "Application" !== n.Type)
                return null;
            if (!n.Name || !n.Exec)
                return null;
            if ("true" === n.NoDisplay && !n.Exec.startsWith("gnome-control-center"))
                return null;
            let o = String(process.env.DESKTOP_SESSION).toLowerCase();
            if ("ubuntu" === o && (o = "gnome"),
            n.OnlyShowIn && !n.OnlyShowIn.toLowerCase().includes(o))
                return null;
            if (n.NotShowIn && n.NotShowIn.toLowerCase().includes(o))
                return null;
            let s = n.Icon;
            if (!s)
                return null;
            if (s.startsWith("/")) {
                if (!x().existsSync(s))
                    return null
            } else if (e.startsWith("/usr/share/applications") || e.startsWith("/var/lib/snapd/desktop/applications"))
                s = this.getIcon(s);
            else {
                if (!e.startsWith(process.env.HOME + "/.local/share/applications"))
                    return null;
                s = l().join(process.env.HOME, ".local/share/icons", s + ".png"),
                x().existsSync(s) || (s = this.emptyIcon)
            }
            let r = "";
            const a = process.env.LANG.split(".")[0];
            r = "Comment[" + a + "]"in n ? n["Comment[" + a + "]"] : n.Comment ? "X-Ubuntu-Gettext-Domain"in n ? I().getLocaleName(n["X-Ubuntu-Gettext-Domain"], n.Comment) : n.Comment : e;
            let c = n.Exec.replace(/ %[A-Za-z]/g, "").replace(/"/g, "").trim();
            "true" === n.Terminal && (c = "gnome-terminal -x " + c),
            this.entryFileExec[e] = c,
            "deepin" === this.osName && (n.Name = n.Name.replace(/^(?:深度|deepin)/i, "").trim());
            const h = {
                code: e,
                explain: r,
                icon: (0,
                d.pathToFileURL)(s).href,
                cmds: [n.Name]
            };
            if ("Name[" + a + "]"in n) {
                let e = n["Name[" + a + "]"];
                e && e !== n.Name && ("deepin" === this.osName && (e = e.replace(/^(?:深度|deepin)/i, "").trim()),
                h.cmds.unshift(e))
            } else if ("X-Ubuntu-Gettext-Domain"in n) {
                const e = I().getLocaleName(n["X-Ubuntu-Gettext-Domain"], n.Name);
                e && e !== n.Name && h.cmds.unshift(e)
            }
            return h
        }
        dirAppRead(e, t, i, n, o) {
            let s = null;
            try {
                if (!x().existsSync(t))
                    return;
                s = x().readdirSync(t)
            } catch (e) {
                return
            }
            if (0 !== s.length)
                for (const r of s) {
                    const s = l().join(t, r);
                    try {
                        if (!x().lstatSync(s).isFile())
                            continue
                    } catch (e) {
                        continue
                    }
                    l().extname(s) === e ? o.push(s) : n < i && this.dirAppRead(e, s, i, n + 1, o)
                }
        }
        appDirWatch(e, t) {
            return Ge().watch(e, {
                persistent: !0,
                ignoreInitial: !0,
                followSymlinks: !1,
                ignorePermissionErrors: !0,
                disableGlobbing: !0,
                depth: t
            }).on("unlink", (e=>{
                /\.desktop$/i.test(e) && e in this.pluginsCmp.pluginContainer[""].featureDic && (".desktop" === l().extname(e).toLowerCase() && delete this.entryFileExec[e],
                delete this.pluginsCmp.pluginContainer[""].featureDic[e],
                this.windowCmp.refreshCmdSource())
            }
            )).on("add", (e=>{
                /\.desktop$/i.test(e) && setTimeout((()=>{
                    if (!x().existsSync(e))
                        return;
                    const t = this.convertEntryFile2Feature(e);
                    t && (this.pluginsCmp.setFeature("", t),
                    this.windowCmp.refreshCmdSource())
                }
                ), 3e3)
            }
            ))
        }
        setBaseAppFeatures() {
            const e = ["/usr/share/applications", "/var/lib/snapd/desktop/applications", process.env.HOME + "/.local/share/applications"]
              , i = [];
            e.forEach((e=>{
                this.dirAppRead(".desktop", e, 0, 0, i)
            }
            )),
            i.forEach((e=>{
                const i = this.convertEntryFile2Feature(e);
                if (i && (this.pluginsCmp.setFeature("", i),
                ["Visual Studio Code"].includes(i.cmds[0]))) {
                    const e = i.cmds[0]
                      , n = this.entryFileExec[i.code];
                    st["path_open_to_" + e] = {
                        func: (e,i,o)=>{
                            if (e.windowCmp.hideMainWindow(),
                            "files" === i) {
                                const e = n.split(/ +/)
                                  , t = e.shift();
                                return e.push(o[0].path),
                                void Re().spawn(t, e, {
                                    detached: !0
                                })
                            }
                            t.clipboard.writeText(""),
                            I().simulateKeyboardTap("l", "ctrl"),
                            I().simulateKeyboardTap("c", "ctrl"),
                            I().simulateKeyboardTap("escape"),
                            setTimeout((()=>{
                                const e = t.clipboard.readText();
                                if (!e || !x().existsSync(e))
                                    return;
                                const i = n.split(/ +/)
                                  , o = i.shift();
                                i.push(e),
                                Re().spawn(o, i, {
                                    detached: !0
                                })
                            }
                            ), 100)
                        }
                    },
                    this.pluginsCmp.setFeature("", {
                        code: "path_open_to_" + e,
                        explain: e + " 中打开",
                        icon: i.icon,
                        cmds: [{
                            type: "files",
                            fileType: "directory",
                            minLength: 1,
                            maxLength: 1,
                            label: e + " 中打开"
                        }, {
                            type: "window",
                            match: {
                                app: ["dde-file-manager", "nautilus"]
                            },
                            label: e + " 中打开"
                        }]
                    })
                }
            }
            )),
            this.baseAppDirWatch = this.appDirWatch(e, 0)
        }
        setMatchAppFeatures() {
            Object.values(st).forEach((e=>{
                e.feature && this.pluginsCmp.setFeature("", e.feature)
            }
            ))
        }
        setActionAppFeatures() {
            let e = null;
            if ("ubuntu" === this.osName)
                e = at;
            else {
                if ("deepin" !== this.osName)
                    return;
                e = rt
            }
            e.forEach((e=>{
                e.icon || (e.icon = "res/native/symbolic.svg"),
                this.pluginsCmp.setFeature("", e)
            }
            ))
        }
        initFeatures() {
            this.baseAppDirWatch && (this.baseAppDirWatch.close(),
            delete this.baseAppDirWatch),
            this.pluginsCmp.pluginContainer[""] = {
                name: "",
                pluginName: "",
                logo: "res/logo.png",
                featureDic: {}
            },
            this.pluginsCmp.setFeature("", {
                code: "call:goHelp",
                icon: "res/native/help.png",
                explain: "视频介绍 uTools",
                cmds: ["uTools 介绍", "帮助", "Help"]
            }),
            this.pluginsCmp.setFeature("", {
                code: "call:killAllPlugin",
                icon: "res/native/clear.svg",
                explain: "uTools 后台插件应用全部退出",
                cmds: ["Clear"]
            }),
            this.setMatchAppFeatures(),
            this.setActionAppFeatures(),
            n().get("enableNativeApp") && this.setBaseAppFeatures(),
            this.appCmp.initLocalOpenFeatures().then((()=>{
                this.windowCmp.refreshCmdSource()
            }
            ))
        }
        copyFile(e) {
            Array.isArray(e) || (e = [e]),
            0 !== (e = e.filter((e=>x().existsSync(e)))).length && I().copyFile.apply(null, e)
        }
        goHelp() {
            this.windowCmp.hideMainWindow(!1),
            this.appCmp.goHelp()
        }
        killAllPlugin() {
            this.windowCmp.killAllPlugins()
        }
        screenColorPicker() {
            this.screencolorpickerCmp.action((({hex: e})=>{
                t.clipboard.writeText(e),
                new t.Notification({
                    title: "uTools",
                    body: "颜色 " + e + " 已复制到剪贴板"
                }).show()
            }
            ))
        }
        getLanIp() {
            this.windowCmp.hideMainWindow(),
            N().then((e=>{
                e ? (t.clipboard.writeText(e),
                new t.Notification({
                    title: "uTools",
                    body: '内部网络IP地址 "' + e + '" 已复制到剪贴板'
                }).show()) : new t.Notification({
                    title: "uTools",
                    body: "未获取到内部网络 IP 地址"
                }).show()
            }
            ))
        }
        showDesktop() {
            this.windowCmp.hideMainWindow(),
            setTimeout((()=>{
                I().simulateKeyboardTap("d", "ctrl", "alt")
            }
            ), 50)
        }
        shutdown(...e) {
            this.windowCmp.hideMainWindow();
            const i = "reboot" === e[0] ? "重启" : "关机";
            t.dialog.showMessageBox({
                type: "question",
                buttons: ["取消", i],
                message: "确定要执行「" + i + "」吗？",
                detail: " ",
                defaultId: 1
            }).then((({response: t})=>{
                1 === t && Re().spawn("shutdown", ["reboot" === e[0] ? "-r" : "-h", "now"], {
                    detached: !0
                })
            }
            ))
        }
        regionScreenshot() {
            this.windowCmp.hideMainWindow(),
            setTimeout((()=>{
                this.screencaptureCmp.action((e=>{
                    this.clipboardCmp.once("change", (()=>{
                        this.windowCmp.restoreShowMainWindow()
                    }
                    )),
                    t.clipboard.writeImage(e)
                }
                ))
            }
            ), "deepin" === this.osName ? 250 : 100)
        }
        windowScreenshot() {
            this.windowCmp.hideMainWindow();
            const e = this.windowCmp.display.nativeWorkWindowInfo;
            e && 0 !== e.width && 0 !== e.height ? setTimeout((()=>{
                const i = l().join(t.app.getPath("temp"), "utools_screenshot_" + Date.now() + ".png");
                if (I().screenCaptureToFile(e.x, e.y, e.width, e.height, i)) {
                    t.clipboard.writeImage(t.nativeImage.createFromPath(i));
                    try {
                        x().unlinkSync(i)
                    } catch (e) {}
                } else
                    new t.Notification({
                        title: "uTools",
                        body: "截图失败"
                    }).show()
            }
            ), "deepin" === this.osName ? 250 : 100) : new t.Notification({
                title: "uTools",
                body: "未捕获到窗口"
            }).show()
        }
        showNativeWorkWindowInfo() {
            this.appCmp.showNativeWorkWindowInfo()
        }
    }
    class dt {
        constructor(e) {
            var i, n;
            n = {
                captureComplete: (e,i)=>{
                    if (this.captureWindow.destroy(),
                    0 === i.width || 0 === i.height || "function" != typeof this.captureCompleteCallback)
                        return this.free();
                    const n = this.windowCmp.isLinux ? t.nativeImage.createFromPath(this.captureImageFile) : t.nativeImage.createFromBuffer(this.captureImageBuffer);
                    if (this.free(),
                    n.isEmpty())
                        return;
                    const o = n.getSize().width / this.displayBounds.width;
                    let s = i.x;
                    s < 0 && (i.width += s,
                    s = 0);
                    let r, a = i.y;
                    a < 0 && (i.height += a,
                    a = 0),
                    i.width > this.displayBounds.width && (s = 0,
                    i.width = this.displayBounds.width),
                    i.height > this.displayBounds.height && (a = 0,
                    i.height = this.displayBounds.height);
                    try {
                        r = n.crop({
                            x: Math.round(s * o),
                            y: Math.round(a * o),
                            width: Math.round(i.width * o),
                            height: Math.round(i.height * o)
                        })
                    } catch (e) {
                        return
                    }
                    r && !r.isEmpty() && (this.captureCompleteCallback(r),
                    this.captureCompleteCallback = null)
                }
            },
            (i = "screenCaptureServices")in this ? Object.defineProperty(this, i, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : this[i] = n,
            this.windowCmp = e
        }
        free() {
            this.windowCmp.isWindow ? this.captureImageBuffer = null : this.windowCmp.isLinux && u().unlink(this.captureImageFile, (()=>{}
            ))
        }
        action(e) {
            this.captureWindow && (this.captureWindow.destroy(),
            this.free()),
            this.captureCompleteCallback = e;
            const i = t.screen.getCursorScreenPoint()
              , n = t.screen.getDisplayNearestPoint(i);
            this.displayBounds = n.bounds;
            const o = t.screen.getAllDisplays();
            let s = 0
              , r = 0;
            o.length > 1 && (s = Math.round(o.filter((e=>e.bounds.x < this.displayBounds.x)).reduce(((e,t)=>e + t.bounds.width * t.scaleFactor), 0)),
            r = Math.round(o.filter((e=>e.bounds.y < this.displayBounds.y)).reduce(((e,t)=>e + t.bounds.height * t.scaleFactor), 0)));
            const a = {
                x: s,
                y: r,
                width: Math.round(n.bounds.width * n.scaleFactor),
                height: Math.round(n.bounds.height * n.scaleFactor)
            };
            this.captureImageFile = l().join(t.app.getPath("temp"), "utools_screenshot_" + Date.now() + ".png"),
            I().screenCaptureToFile(a.x, a.y, a.width, a.height, this.captureImageFile) ? (this.isInitedSession || (t.session.fromPartition("utools.screencapture").protocol.registerFileProtocol("capture", ((e,t)=>{
                this.captureImageFile && t({
                    path: this.captureImageFile
                })
            }
            )),
            this.isInitedSession = !0),
            this.captureWindow = new t.BrowserWindow({
                show: !0,
                x: this.displayBounds.x,
                y: this.displayBounds.y,
                width: this.displayBounds.width,
                height: this.displayBounds.height,
                thickFrame: !1,
                hasShadow: !1,
                fullscreen: !0,
                minimizable: !1,
                movable: !1,
                autoHideMenuBar: !0,
                frame: !1,
                transparent: !0,
                skipTaskbar: !0,
                enableLargerThanScreen: !0,
                alwaysOnTop: !0,
                webPreferences: {
                    devTools: !1,
                    nodeIntegration: !1,
                    sandbox: !1,
                    contextIsolation: !1,
                    enableRemoteModule: !1,
                    partition: "utools.screencapture",
                    preload: l().join(__dirname, "screencapture/preload.js")
                }
            }),
            this.captureWindow.setVisibleOnAllWorkspaces(!0),
            this.captureWindow.on("blur", (()=>{
                this.captureWindow.destroy(),
                this.free()
            }
            )),
            this.captureWindow.webContents.on("before-input-event", ((e,t)=>{
                "keyDown" === t.type && "Escape" === t.code && (this.captureWindow.destroy(),
                this.free())
            }
            )),
            this.captureWindow.once("closed", (()=>{
                this.captureWindow = null
            }
            )),
            this.captureWindow.loadFile(l().join(__dirname, "screencapture/index.html"))) : new t.Notification({
                title: "uTools",
                body: "截图失败"
            }).show()
        }
    }
    function ht(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class ut {
        constructor(e) {
            ht(this, "handleMacOsScreenColorPickerMouseMove", ((e,i,n)=>{
                this.mouseScreenX = e,
                this.mouseScreenY = i;
                const o = t.screen.getDisplayNearestPoint({
                    x: e,
                    y: i
                }).bounds
                  , s = e - this.workWindowWidth / 2;
                let r = i - 20
                  , a = !1;
                r + this.workWindowHeight > o.y + o.height && (r -= this.workWindowWidth + (this.workWindowHeight - this.workWindowWidth) / 2,
                a = !0),
                this.workWindow.setBounds({
                    width: this.workWindowWidth,
                    height: this.workWindowHeight,
                    x: s,
                    y: r
                });
                for (let e = 0; e < 9; e++)
                    for (let t = 0; t < 9; t++)
                        this.pickColors[e][t] = n[9 * e + t];
                this.workWindow.webContents.send("colors", this.pickColors, a)
            }
            )),
            ht(this, "handleLinuxScreenColorPickerMouseMove", ((e,i,n)=>{
                if (void 0 === e)
                    return;
                this.mouseScreenX = e,
                this.mouseScreenY = i;
                const o = Math.round(e / this.displayScaleFactor)
                  , s = Math.round(i / this.displayScaleFactor)
                  , r = t.screen.getDisplayNearestPoint({
                    x: o,
                    y: s
                })
                  , a = o - this.workWindowWidth / 2;
                let c = s - 20
                  , l = !1;
                if (c + this.workWindowHeight > r.bounds.y + r.bounds.height && (c -= this.workWindowWidth + (this.workWindowHeight - this.workWindowWidth) / 2,
                l = !0),
                this.workWindow.setBounds({
                    width: this.workWindowWidth,
                    height: this.workWindowHeight,
                    x: a,
                    y: c
                }),
                n) {
                    const e = [];
                    for (let t = 0; t < n.length; t += 4)
                        e.push(n[t + 2] + "," + n[t + 1] + "," + n[t]);
                    for (let t = 0; t < 9; t++)
                        for (let i = 0; i < 9; i++)
                            this.pickColors[t][i] = e[9 * t + i]
                } else
                    for (let e = 0; e < 9; e++) {
                        const e = [];
                        for (let t = 0; t < 9; t++)
                            e.push("0,0,0");
                        this.pickColors.push(e)
                    }
                this.workWindow.webContents.send("colors", this.pickColors, l)
            }
            )),
            ht(this, "handleWindowsScreenColorPickerMouseMove", ((e,i,n,o)=>{
                if (0 !== e) {
                    if (1 === e)
                        return this._workWindowBlurTimeout && clearTimeout(this._workWindowBlurTimeout),
                        void setImmediate((()=>{
                            this.workWindow ? this.handlePicker() : I().destroyNativeWindow(this.screenshotWindowId)
                        }
                        ));
                    if (2 === e) {
                        if (!this.workWindow)
                            return;
                        this.workWindow.destroy()
                    }
                } else {
                    if (!this.workWindow)
                        return;
                    this.mouseScreenX = i,
                    this.mouseScreenY = n;
                    const e = t.screen.screenToDipPoint({
                        x: i,
                        y: n
                    })
                      , s = t.screen.getDisplayNearestPoint(e)
                      , r = Math.round(e.x) - this.workWindowWidth / 2;
                    let a = Math.round(e.y) - 20
                      , c = !1;
                    a + this.workWindowHeight > s.bounds.y + s.bounds.height && (a -= this.workWindowWidth + (this.workWindowHeight - this.workWindowWidth) / 2,
                    c = !0),
                    this.workWindow.setBounds({
                        width: this.workWindowWidth,
                        height: this.workWindowHeight,
                        x: r,
                        y: a
                    });
                    for (let e = 0; e < 9; e++)
                        for (let t = 0; t < 9; t++)
                            this.pickColors[e][t] = o[9 * e + t];
                    this.workWindow.webContents.send("colors", this.pickColors, c)
                }
            }
            )),
            ht(this, "handlePicker", (()=>{
                if (this.workWindow && (this.windowCmp.isWindow ? I().destroyNativeWindow(this.screenshotWindowId) : this.workWindow.destroy(),
                "function" == typeof this.pickedCallback)) {
                    const e = this.pickColors[4][4]
                      , t = "#" + e.split(",").map((e=>{
                        const t = parseInt(e).toString(16);
                        return 1 === t.length ? "0" + t : t
                    }
                    )).join("")
                      , i = "rgb(" + e + ")";
                    this.pickedCallback({
                        hex: t,
                        rgb: i
                    })
                }
            }
            )),
            this.windowCmp = e,
            this.pickColors = [],
            this.workWindowWidth = 108,
            this.workWindowHeight = 188,
            this.mouseScreenX = 0,
            this.mouseScreenY = 0;
            for (let e = 0; e < 9; e++) {
                const e = [];
                for (let t = 0; t < 9; t++)
                    e.push("0,0,0");
                this.pickColors.push(e)
            }
        }
        action(e) {
            if (this.workWindow)
                return;
            if (this.windowCmp.isMacOs) {
                if (!I().isHadPrivilege())
                    return I().requestPrivilege();
                if (!I().isHadScreenCaptureAccess())
                    return new t.Notification({
                        body: "无屏幕录制权限，在「安全性与隐私」->「隐私」中允许屏幕录制权限"
                    }).show(),
                    void I().requestScreenCaptureAccess()
            } else
                this.windowCmp.isWindow && (this.screenshotWindowId = I().colorPickerScreenshot(this.handleWindowsScreenColorPickerMouseMove));
            this.pickedCallback = e;
            const i = {
                show: !1,
                alwaysOnTop: !0,
                resizable: !1,
                fullscreenable: !1,
                minimizable: !1,
                maximizable: !1,
                closable: !1,
                skipTaskbar: !0,
                autoHideMenuBar: !0,
                frame: !1,
                transparent: !0,
                enableLargerThanScreen: !0,
                hasShadow: !1,
                width: this.workWindowWidth,
                height: this.workWindowHeight,
                webPreferences: {
                    preload: l().join(__dirname, "screencolorpicker/pixelPreload.js"),
                    nodeIntegration: !1,
                    sandbox: !1,
                    contextIsolation: !1
                }
            };
            this.windowCmp.isLinux && (i.type = "dock"),
            this.workWindow = new t.BrowserWindow(i),
            this.workWindow.removeMenu(),
            this.workWindow.setAlwaysOnTop(!0, "screen-saver"),
            this.workWindow.loadFile(l().join(__dirname, "screencolorpicker", "pixel.html")),
            this.workWindow.once("ready-to-show", (()=>{
                const e = t.screen.getCursorScreenPoint();
                if (this.workWindow.show(),
                this.windowCmp.isWindow) {
                    const i = t.screen.dipToScreenPoint(e);
                    I().simulateMouseMove(Math.round(i.x), Math.round(i.y))
                } else
                    this.windowCmp.isMacOs ? (I().screenColorPickerMouseMoveEvent(this.handleMacOsScreenColorPickerMouseMove),
                    I().simulateMouseMove(e.x, e.y)) : this.windowCmp.isLinux && (I().screenColorPickerMouseMoveEvent(this.handleLinuxScreenColorPickerMouseMove),
                    setTimeout((()=>{
                        const i = t.screen.getDisplayNearestPoint(e);
                        this.displayScaleFactor = i.scaleFactor,
                        this.displayScaleFactor > 1 ? I().simulateMouseMove(Math.round(e.x * this.displayScaleFactor), Math.round(e.y * this.displayScaleFactor)) : I().simulateMouseMove(e.x, e.y)
                    }
                    ), 50))
            }
            )),
            this.workWindow.on("blur", (()=>{
                this.windowCmp.isWindow ? this._workWindowBlurTimeout = setTimeout((()=>{
                    I().destroyNativeWindow(this.screenshotWindowId)
                }
                ), 100) : this.workWindow.destroy()
            }
            )),
            this.workWindow.once("closed", (()=>{
                this.workWindow = null,
                this.windowCmp.isWindow ? this._workWindowBlurTimeout = null : I().stopScreenColorPickerMouseMoveEvent()
            }
            )),
            this.workWindow.webContents.on("before-input-event", ((e,i)=>{
                if (e.preventDefault(),
                "keyDown" === i.type)
                    if ("Escape" !== i.key)
                        if ("ArrowUp" !== i.key)
                            if ("ArrowDown" !== i.key)
                                if ("ArrowLeft" !== i.key)
                                    if ("ArrowRight" !== i.key)
                                        "Space" !== i.code && "Enter" !== i.code && "NumpadEnter" !== i.code || this.handlePicker();
                                    else {
                                        const e = t.screen.getCursorScreenPoint()
                                          , i = t.screen.getDisplayNearestPoint(e).bounds;
                                        if (e.x === i.x + i.width - 1)
                                            return;
                                        I().simulateMouseMove(this.mouseScreenX + 1, this.mouseScreenY)
                                    }
                                else {
                                    const e = t.screen.getCursorScreenPoint()
                                      , i = t.screen.getDisplayNearestPoint(e).bounds;
                                    if (e.x === i.x)
                                        return;
                                    I().simulateMouseMove(this.mouseScreenX - 1, this.mouseScreenY)
                                }
                            else {
                                const e = t.screen.getCursorScreenPoint()
                                  , i = t.screen.getDisplayNearestPoint(e).bounds;
                                if (e.y === i.y + i.height - 1)
                                    return;
                                I().simulateMouseMove(this.mouseScreenX, this.mouseScreenY + 1)
                            }
                        else {
                            const e = t.screen.getCursorScreenPoint()
                              , i = t.screen.getDisplayNearestPoint(e).bounds;
                            if (e.y === i.y)
                                return;
                            I().simulateMouseMove(this.mouseScreenX, this.mouseScreenY - 1)
                        }
                    else
                        this.windowCmp.isWindow ? I().destroyNativeWindow(this.screenshotWindowId) : this.workWindow.destroy()
            }
            ))
        }
    }
    class pt {
        constructor(e) {
            this.instance = e
        }
        registerMainServices() {
            const e = {}
              , i = this.instance.window
              , n = this.instance.voice;
            Object.values(this.instance).forEach((t=>{
                "object" == typeof t.mainServices && Object.assign(e, t.mainServices)
            }
            )),
            t.ipcMain.on("main.services", ((t,o,...s)=>{
                t.sender !== i.mainWindow.webContents && n.voiceWindow && n.voiceWindow.webContents !== t.sender ? t.returnValue = new Error("unauthorized") : e[o](t, ...s)
            }
            ))
        }
        registerVoiceServices() {
            const e = this.instance.voice;
            t.ipcMain.on("voice.services", ((t,i,...n)=>{
                e.voiceWindow && t.sender === e.voiceWindow.webContents ? e.voiceServices[i](t, ...n) : t.returnValue = new Error("unauthorized")
            }
            )),
            t.ipcMain.handle("voice.services", (async(t,i,...n)=>{
                if (!e.voiceWindow || t.sender !== e.voiceWindow.webContents)
                    throw new Error("unauthorized");
                return await e.voiceServices[i](...n)
            }
            ))
        }
        registerPluginApiServices() {
            const e = this.instance.window
              , i = this.instance.app
              , n = {};
            Object.assign(n, e.pluginApiServices, i.pluginApiServices, this.instance.account.pluginApiServices, this.instance.database.pluginApiServices, this.instance.pay.pluginApiServices);
            const o = i.pluginUtilApiServices;
            t.ipcMain.on("plugin.api", ((t,i,s)=>{
                if (i in n) {
                    const o = e.getPluginIdByWebContents(t.sender);
                    return o ? void n[i](t, o, s) : void (t.returnValue = new Error("未识别的插件应用"))
                }
                i in o ? o[i](t, s) : t.returnValue = new Error("未知接口")
            }
            )),
            t.ipcMain.handle("plugin.api", (async(t,i,s)=>{
                if (i in n) {
                    const o = e.getPluginIdByWebContents(t.sender);
                    if (!o)
                        throw new Error("未识别的插件应用");
                    return await n[i](o, s)
                }
                if (i in o)
                    return await o[i](s);
                throw new Error("未知接口")
            }
            ))
        }
        registerFFFFFFFFServices() {
            const e = {}
              , i = this.instance.window;
            Object.values(this.instance).forEach((t=>{
                "object" == typeof t.ffffffffServices && Object.assign(e, t.ffffffffServices)
            }
            )),
            t.ipcMain.on("ffffffff.services", ((t,n,...o)=>{
                t.sender === i.ffffffff.webContents ? e[n](t, ...o) : t.returnValue = new Error("unauthorized")
            }
            )),
            t.ipcMain.handle("ffffffff.services", (async(t,n,...o)=>{
                if (t.sender !== i.ffffffff.webContents)
                    throw new Error("unauthorized");
                return await e[n](...o)
            }
            ))
        }
        registerDetachServices() {
            const e = this.instance.window
              , i = this.instance.pluginmenu
              , n = {
                ...e.detachServices,
                ...i.detachServices
            };
            t.ipcMain.on("detach.services", ((i,o,...s)=>{
                const r = t.BrowserWindow.fromWebContents(i.sender);
                if (!r)
                    return void (i.returnValue = new Error("unauthorized"));
                let a;
                for (const t in e.runningPluginPool)
                    if (e.runningPluginPool[t].detachWindows.includes(r)) {
                        a = t;
                        break
                    }
                a ? n[o](i, a, r, ...s) : i.returnValue = new Error("unauthorized")
            }
            ))
        }
        registerPayServices() {
            const e = this.instance.pay;
            t.ipcMain.on("pay.services", ((t,i,...n)=>{
                const o = e.payServices[i];
                "function" == typeof o ? o(t, ...n) : t.returnValue = new Error("未知接口")
            }
            ))
        }
        registerClipboardServices() {
            const e = this.instance.clipboard
              , i = this.instance.window;
            t.ipcMain.handle("clipboard.services", (async(t,n,...o)=>{
                const s = i.getPluginIdByWebContents(t.sender);
                if ("clipboard" !== s && "dev_clipboard" !== s)
                    throw new Error("unauthorized");
                const r = e.clipboardServices[n];
                if ("function" != typeof r)
                    throw new Error("未知接口");
                return await r(...o)
            }
            ))
        }
        registerDeveloperServices() {
            const e = this.instance.developer
              , i = this.instance.window;
            t.ipcMain.on("developer.services", ((t,n,...o)=>{
                // if ("developer" !== i.getPluginIdByWebContents(t.sender))
                //     return void (t.returnValue = new Error("unauthorized"));
                const s = e.developerServices[n];
                "function" == typeof s ? s(t, ...o) : t.returnValue = new Error("未知接口")
            }
            )),
            t.ipcMain.handle("developer.services", (async(t,n,...o)=>{
                // if ("developer" !== i.getPluginIdByWebContents(t.sender))
                //     throw new Error("unauthorized");
                const s = e.developerServices[n];
                if ("function" != typeof s)
                    throw new Error("未知接口");
                return await s(...o)
            }
            ))
        }
        registerScreenCaptureServices() {
            const e = {
                ...this.instance.screencapture.screenCaptureServices
            };
            e.sendKeydown = (e,t)=>{
                e.sender.sendInputEvent({
                    type: "keyDown",
                    keyCode: t
                })
            }
            ,
            t.ipcMain.on("screencapture.services", ((t,i,...n)=>{
                const o = e[i];
                "function" == typeof o ? o(t, ...n) : t.returnValue = new Error("未知接口")
            }
            ))
        }
        init() {
            this.registerMainServices(),
            this.registerVoiceServices(),
            this.registerPluginApiServices(),
            this.registerFFFFFFFFServices(),
            this.registerDetachServices(),
            this.registerPayServices(),
            this.registerClipboardServices(),
            this.registerScreenCaptureServices(),
            this.registerDeveloperServices()
        }
    }
    const wt = require("stream");
    var mt = e.n(wt);
    class gt {
        constructor(e, t) {
            var i, n;
            n = {
                buildPluginUpxFile: async(e,t)=>await this.buildPluginUpxFile(e, t),
                getAccountToken: e=>{
                    e.returnValue = this.accountCmp.getAccountToken()
                }
                ,
                getLocalAccount: e=>{
                    const t = this.accountCmp.getAccountInfo();
                    t && delete t.db_secrect_key,
                    e.returnValue = t
                }
                ,
                isDev: e=>{
                    e.returnValue = r().dev()
                }
                ,
                runDevPlugin: (e,t,i)=>{
                    const n = this.pluginsCmp.mount({
                        pluginPath: l().dirname(t),
                        updateTime: Date.now()
                    }, i);
                    n instanceof Error ? e.returnValue = n : (this.windowCmp.refreshCmdSource(),
                    e.returnValue = null)
                }
                ,
                isRuningDevPlugin: (e,t)=>{
                    t = "dev_" + t,
                    e.returnValue = t in this.pluginsCmp.pluginContainer
                }
                ,
                stopDevPlugin: (e,t)=>{
                    if (t = "dev_" + t,
                    this.pluginsCmp.unmount(t))
                        return this.windowCmp.destroyPlugin(t),
                        this.windowCmp.refreshCmdSource(),
                        void (e.returnValue = !0);
                    e.returnValue = !1
                }
                ,
                isDevPluginOutKill: (e,t)=>{
                    e.returnValue = this.appCmp.pluginIsOutKill("dev_" + t)
                }
                ,
                toggleOutKillDevPlugin: (e,t,i)=>{
                    t = "dev_" + t,
                    i ? this.appCmp.addOutKillPlugin(t) : this.appCmp.removeOutKillPlugin(t),
                    e.returnValue = !0
                }
            },
            (i = "developerServices")in this ? Object.defineProperty(this, i, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : this[i] = n,
            this.windowCmp = e,
            this.pluginsCmp = e.pluginsCmp,
            this.accountCmp = e.accountCmp,
            this.appCmp = t
        }
        buildPluginUpxFile(e, i) {
            return new Promise(((n,o)=>{
                if (!x().existsSync(e))
                    return o(new Error("打包文件夹路径不存在"));
                try {
                    if (!x().statSync(e).isDirectory())
                        return o(new Error("打包文件夹路径不存在"))
                } catch (e) {
                    return o(new Error("打包文件夹路径无权限"))
                }
                const s = l().join(e, "plugin.json");
                if (!x().existsSync(s))
                    return o(new Error("不存在 plugin.json 文件"));
                try {
                    this.pluginsCmp.testPluginJsonFile(s, i)
                } catch (e) {
                    return o(e)
                }
                let r;
                try {
                    r = JSON.parse(x().readFileSync(s, "utf-8"))
                } catch (e) {
                    return o(new Error("plugin.json 文件解析失败"))
                }
                const a = JSON.stringify(Object.assign(r, i))
                  , c = t.app.getPath("temp")
                  , d = l().join(c, "utools-developer", E());
                b().createPackageWithOptions(e, d, {
                    transform: e=>{
                        if (e === s)
                            return new (mt().Transform)({
                                transform: function(e, t, i) {
                                    this.replaced || (this.replaced = !0,
                                    this.push(a)),
                                    i()
                                }
                            })
                    }
                }).then((()=>{
                    const e = x().createReadStream(d)
                      , t = l().join(c, "utools-developer", i.name + "-" + i.version + ".upx")
                      , s = x().createWriteStream(t)
                      , r = v().createGzip();
                    e.pipe(r).on("error", (()=>o(new Error("压缩错误")))).pipe(s).on("error", (()=>o(new Error("压缩写入错误")))).on("finish", (()=>{
                        try {
                            x().unlinkSync(d)
                        } catch (e) {}
                        n(t)
                    }
                    ))
                }
                )).catch((e=>{
                    o(e)
                }
                ))
            }
            ))
        }
    }
    function ft(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    class yt {
        constructor(e, i, n, o) {
            ft(this, "createPaymentWindow", ((e,i)=>{
                const n = e.getBounds()
                  , o = this.windowCmp.isMacOs ? 468 : 440
                  , s = Math.floor(n.x + n.width / 2 - 166)
                  , r = Math.floor(n.y + n.height / 2 - o / 2)
                  , a = new t.BrowserWindow({
                    show: !1,
                    focusable: !1,
                    resizable: !1,
                    fullscreenable: !1,
                    fullscreen: !1,
                    minimizable: !1,
                    maximizable: !1,
                    movable: !1,
                    autoHideMenuBar: !0,
                    frame: !1,
                    skipTaskbar: !0,
                    parent: e,
                    modal: !0,
                    width: 332,
                    height: o,
                    x: s,
                    y: r,
                    title: "uTools 支付",
                    backgroundColor: this.windowCmp.getWindowBackgroundColor(),
                    webPreferences: {
                        nodeIntegration: !1,
                        sandbox: !1,
                        contextIsolation: !1,
                        enableRemoteModule: !1,
                        partition: "utools.pay",
                        preload: l().join(__dirname, "pay/preload.js")
                    }
                });
                a.removeMenu();
                const c = this.windowCmp.isMacOs && this.windowCmp.mainWindow === e;
                c && this.windowCmp.mainWindow.setAlwaysOnTop(!0, "floating"),
                a.once("ready-to-show", (()=>{
                    a.show(),
                    i(a)
                }
                ));
                const d = ()=>{
                    a.isDestroyed() || a.destroy()
                }
                ;
                e.once("resize", d),
                e.once("blur", d),
                a.once("closed", (()=>{
                    e.removeListener("resize", d),
                    e.removeListener("blur", d),
                    c && this.windowCmp.mainWindow.setAlwaysOnTop(!0, "modal-panel", 1)
                }
                )),
                a.loadFile(l().join(__dirname, "pay", "index.html"))
            }
            )),
            ft(this, "pluginApiServices", {
                openPayment: (e,i,n)=>{
                    if (!n || "object" != typeof n || !n.goodsId)
                        return void (e.returnValue = new Error("参数错误"));
                    const o = e.sender
                      , s = t.BrowserWindow.fromWebContents(o);
                    if (!s)
                        return void (e.returnValue = new Error("未知窗口来源"));
                    const r = this.pluginsCmp.pluginContainer[i];
                    r ? (this.createPaymentWindow(s, (e=>{
                        const t = this.accountCmp.getAccountToken();
                        if (!t)
                            return void e.webContents.executeJavaScript('window.initRenderError("未登录 uTools 帐号")');
                        const {goodsId: s, outOrderId: a, attach: c, permanent: l} = n
                          , d = {
                            plugin_name: i,
                            goods_id: s,
                            out_order_id: a || "",
                            attach: c || ""
                        };
                        l && (d.forever = 1),
                        i.startsWith("dev_") && (d.plugin_name = i.replace("dev_", "")),
                        f(this.config.paymentsURL + t, d).then((i=>{
                            const n = i.order_id;
                            this.orderResHub[n] = {
                                pluginWebContents: o,
                                status: 0,
                                payStatusURL: this.config.payStatusURL.replace("{query}", n) + t
                            },
                            l && (this.orderResHub[n].permanent = 1),
                            e.once("closed", (()=>{
                                n in this.orderResHub && 0 === this.orderResHub[n].status && delete this.orderResHub[n]
                            }
                            ));
                            const s = {
                                pluginLogo: r.logo,
                                pluginName: r.pluginName,
                                payCodeURL: this.config.payCodeURL.replace("{query}", n) + t,
                                order: i
                            };
                            e.webContents.executeJavaScript(`window.initRender(${JSON.stringify(s)})`)
                        }
                        )).catch((t=>{
                            e.webContents.executeJavaScript(`window.initRenderError(${JSON.stringify(t.message)})`)
                        }
                        ))
                    }
                    )),
                    e.returnValue = !0) : e.returnValue = new Error("无运行中插件应用信息")
                }
                ,
                fetchUserPayments: async e=>{
                    e.startsWith("dev_") && (e = e.replace("dev_", ""));
                    const t = this.accountCmp.getAccountToken();
                    if (!t)
                        throw new Error("未登录 uTools 帐号");
                    return await g(this.config.paymentsURL + t, {
                        plugin_name: e
                    })
                }
                ,
                isPermanentUser: (e,t)=>{
                    const i = this.accountCmp.getAccountInfo();
                    if (i)
                        if (t.startsWith("dev_") && (t = t.replace("dev_", "")),
                        i.purchased && i.purchased.includes(t))
                            e.returnValue = !0;
                        else {
                            if (i.tryout) {
                                const n = i.tryout[t];
                                if (n && new Date(n) >= new Date((new Date).toDateString()))
                                    return void (e.returnValue = n)
                            }
                            e.returnValue = !1
                        }
                    else
                        e.returnValue = !1
                }
            }),
            ft(this, "ffffffffServices", {
                openPluginForeverPayment: (e,i)=>{
                    const n = e.sender
                      , o = t.BrowserWindow.fromWebContents(n);
                    o ? (this.createPaymentWindow(o, (e=>{
                        const t = this.accountCmp.getAccountToken();
                        if (!t)
                            return void e.webContents.executeJavaScript('window.initRenderError("未登录 uTools 帐号")');
                        const {pluginId: o, pluginLogo: s, pluginName: r, goodsId: a} = i;
                        f(this.config.paymentsURL + t, {
                            plugin_name: o,
                            goods_id: a,
                            out_order_id: "",
                            attach: "",
                            forever: 1
                        }).then((i=>{
                            const o = i.order_id;
                            this.orderResHub[o] = {
                                pluginWebContents: n,
                                status: 0,
                                payStatusURL: this.config.payStatusURL.replace("{query}", o) + t
                            },
                            e.once("closed", (()=>{
                                o in this.orderResHub && 0 === this.orderResHub[o].status && delete this.orderResHub[o]
                            }
                            ));
                            const a = {
                                pluginLogo: s,
                                pluginName: r,
                                payCodeURL: this.config.payCodeURL.replace("{query}", o) + t,
                                order: i
                            };
                            e.webContents.executeJavaScript(`window.initRender(${JSON.stringify(a)})`)
                        }
                        )).catch((t=>{
                            e.webContents.executeJavaScript(`window.initRenderError(${JSON.stringify(t.message)})`)
                        }
                        ))
                    }
                    )),
                    e.returnValue = !0) : e.returnValue = new Error("未知窗口来源")
                }
            }),
            ft(this, "payServices", {
                closeWindow: e=>{
                    t.BrowserWindow.fromWebContents(e.sender).destroy()
                }
                ,
                goBuyMember: e=>{
                    t.BrowserWindow.fromWebContents(e.sender).destroy(),
                    this.windowCmp.ffffffff.goAccountDb()
                }
                ,
                startLoopCheckOrderResult: (e,i)=>{
                    const n = this.orderResHub[i];
                    if (!n)
                        return;
                    n.status = 1;
                    const o = e.sender
                      , s = t.BrowserWindow.fromWebContents(o)
                      , r = 1e3
                      , a = Date.now()
                      , c = ()=>{
                        if (Date.now() - a > 3e5)
                            return s.isDestroyed() || s.destroy(),
                            void delete this.orderResHub[i];
                        g(n.payStatusURL).then((e=>{
                            if (1 !== e.message)
                                if (2 !== e.message) {
                                    if (10 !== e.message)
                                        s.isDestroyed() || s.destroy(),
                                        delete this.orderResHub[i];
                                    else if (new t.Notification({
                                        title: "uTools 支付",
                                        body: "支付成功"
                                    }).show(),
                                    s.isDestroyed() || s.destroy(),
                                    delete this.orderResHub[i],
                                    n.pluginWebContents && !n.pluginWebContents.isDestroyed() && n.pluginWebContents.executeJavaScript("\n              if (window.utools && window.utools.__event__ && typeof window.utools.__event__.openPaymentCallback === 'function') {\n                try { window.utools.__event__.openPaymentCallback() } catch(e) {} \n                delete window.utools.__event__.openPaymentCallback\n              }".trim()),
                                    n.permanent) {
                                        const e = this.accountCmp.getAccountToken();
                                        if (!e)
                                            return;
                                        this.accountCmp.remoteAccountInfo(e, (e=>{
                                            e && new t.Notification({
                                                title: "uTools 支付完成",
                                                body: "获取帐号数据出错了，请手动重启 uTools 程序 | " + e.message
                                            }).show()
                                        }
                                        ))
                                    }
                                } else
                                    setTimeout(c, r);
                            else
                                s.isDestroyed() ? delete this.orderResHub[i] : setTimeout(c, r)
                        }
                        )).catch((()=>{
                            setTimeout(c, r)
                        }
                        ))
                    }
                    ;
                    setTimeout(c, r)
                }
            }),
            this.config = e,
            this.accountCmp = i,
            this.pluginsCmp = n,
            this.windowCmp = o,
            this.orderResHub = {}
        }
    }
    const bt = require("https");
    var Ct = e.n(bt);
    class vt {
        constructor(e, t) {
            this.windowCmp = e,
            this.pluginsCmp = e.pluginsCmp,
            this.accountCmp = e.accountCmp,
            this.dbCmp = t
        }
        getWindowPos(e, i) {
            const n = t.screen.getCursorScreenPoint()
              , o = t.screen.getDisplayNearestPoint(n);
            return [o.bounds.x + Math.round((o.bounds.width - e) / 2), o.bounds.y + Math.round((o.bounds.height - i) / 2)]
        }
        help(e) {
            this.helpWindow && this.helpWindow.destroy();
            const [i,n] = this.getWindowPos(960, 680);
            this.helpWindow = new t.BrowserWindow({
                show: !1,
                alwaysOnTop: !!e,
                title: " uTools 新一代效率工具平台",
                autoHideMenuBar: !0,
                minWidth: 960,
                minHeight: 680,
                x: i,
                y: n,
                width: 960,
                height: 680,
                webPreferences: {
                    partition: "utools.helpboot",
                    nodeIntegration: !1,
                    sandbox: !1
                }
            }),
            this.helpWindow.loadFile(l().join(__dirname, "help", "index.html"), e ? {
                search: e
            } : void 0),
            this.helpWindow.once("closed", (()=>{
                this.helpWindow = null
            }
            )),
            this.helpWindow.once("ready-to-show", (()=>{
                this.helpWindow.show()
            }
            )),
            e && this.helpWindow.webContents.setWindowOpenHandler((({url: e})=>(/^https?:\/\//i.test(e) && t.shell.openExternal(e + (e.includes("?") ? "&" : "?") + "mid=" + this.accountCmp.machineId),
            {
                action: "deny"
            })))
        }
        boot() {
            if (this.bootWindow)
                return;
            const [e,i] = this.getWindowPos(800, 580);
            this.bootWindow = new t.BrowserWindow({
                show: !1,
                alwaysOnTop: !0,
                resizable: !1,
                fullscreenable: !1,
                minimizable: !1,
                maximizable: !1,
                closable: !1,
                skipTaskbar: !0,
                autoHideMenuBar: !0,
                frame: !1,
                enableLargerThanScreen: !0,
                x: e,
                y: i,
                width: 800,
                height: 580,
                webPreferences: {
                    partition: "utools.helpboot",
                    preload: l().join(__dirname, "boot/preload.js"),
                    nodeIntegration: !1,
                    sandbox: !1,
                    contextIsolation: !1
                }
            }),
            this.bootWindow.setAlwaysOnTop(!0, "main-menu"),
            this.bootWindow.loadFile(l().join(__dirname, "boot", "index.html")),
            this.bootWindow.once("closed", (()=>{
                this.bootWindow = null
            }
            )),
            this.bootWindow.once("ready-to-show", (()=>{
                this.bootWindow.show()
            }
            )),
            t.ipcMain.once("helpboot.services.done", (async(e,i)=>{
                if (!this.bootWindow)
                    return;
                if (this.bootWindow.destroy(),
                !i)
                    return this.windowCmp.ffffffff.goAccountDb();
                if (0 === i.length)
                    return;
                const n = t.app.getPath("temp")
                  , o = this.windowCmp.config.pluginDownloadURL + "?mid=" + this.accountCmp.machineId + "&nid=" + this.accountCmp.nativeId + "&helpboot=true"
                  , s = [];
                for (const e of i) {
                    const t = l().join(n, "utools-" + e.name + "-" + Date.now() + ".upx");
                    try {
                        await this.pluginDownload(o.replace("{query}", e.name), t),
                        await this.pluginsCmp.ffffffffServices.pluginInstall(e.name, t),
                        s.push(e.name),
                        u().unlinkSync(t)
                    } catch (e) {}
                }
                this.windowCmp.refreshCmdSource()
            }
            ))
        }
        pluginDownload(e, i) {
            return new Promise(((n,o)=>{
                if (!t.net.online)
                    return o(new Error("无网络"));
                Ct().get(e, (e=>{
                    if (200 === e.statusCode) {
                        const t = u().createWriteStream(i);
                        t.on("finish", (()=>n())),
                        t.on("error", (e=>{
                            t.close();
                            try {
                                u().unlinkSync(i)
                            } catch (e) {}
                            o(e)
                        }
                        )),
                        e.pipe(t)
                    } else
                        301 === e.statusCode || 302 === e.statusCode ? this.pluginDownload(e.headers.location, i).then((()=>n())).catch((e=>o(e))) : o(new Error("error status code: " + e.statusCode))
                }
                )).on("error", (e=>{
                    o(e)
                }
                ))
            }
            ))
        }
    }
    const Wt = require("net");
    var St = e.n(Wt);
    function Pt(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = i,
        e
    }
    const xt = 1e3;
    class kt {
        constructor(e, i, n, o) {
            if (Pt(this, "exitAllConnection", (()=>{
                this._UID_ = null,
                this._loopLocalOnlineHeartTimeout && (clearTimeout(this._loopLocalOnlineHeartTimeout),
                this._loopLocalOnlineHeartTimeout = null),
                this.listenServer && this.listenServer.close(),
                this._loopCheckOnlinePingTimeout && (clearTimeout(this._loopCheckOnlinePingTimeout),
                this._loopCheckOnlinePingTimeout = null);
                const e = Object.values(this.onlineConnectionDocDic);
                e.length > 0 && (this.removeRemoteSocketFeatures(e),
                this.onlineConnectionDocDic = {})
            }
            )),
            Pt(this, "checkOnlinePing", (()=>{
                this._loopCheckOnlinePingTimeout && (clearTimeout(this._loopCheckOnlinePingTimeout),
                this._loopCheckOnlinePingTimeout = null),
                this.loopCheckOnlinePing()
            }
            )),
            Pt(this, "loopCheckOnlinePing", (async()=>{
                if (!this._UID_)
                    return void (this._loopCheckOnlinePingTimeout = null);
                const e = [];
                for (const t in this.onlineConnectionDocDic) {
                    const i = this.onlineConnectionDocDic[t];
                    await this.ping(i) || e.push(i)
                }
                e.length > 0 && (e.forEach((e=>{
                    delete this.onlineConnectionDocDic[e._id]
                }
                )),
                this.removeRemoteSocketFeatures(e)),
                0 !== Object.keys(this.onlineConnectionDocDic).length ? this._loopCheckOnlinePingTimeout = setTimeout(this.loopCheckOnlinePing, 6e5) : this._loopCheckOnlinePingTimeout = null
            }
            )),
            Pt(this, "loopLocalOnlineHeart", (()=>{
                this._loopLocalOnlineHeartTimeout = setTimeout((()=>{
                    if (this._UID_) {
                        if (t.net.online) {
                            const e = Date.now();
                            e - this.localSocketDoc.onlineAt > 432e5 && (this.localSocketDoc.onlineAt = e,
                            this.putLocalSocketDoc())
                        }
                        this.loopLocalOnlineHeart()
                    }
                }
                ), 864e5)
            }
            )),
            Pt(this, "sendText", ((e,i,n)=>new Promise((o=>{
                if (!t.net.online || !this._UID_)
                    return o(!1);
                if (!e.lanip || !e.port)
                    return o(!1);
                const s = new (St().Socket);
                s.setTimeout(xt),
                s.setEncoding("utf-8"),
                s.connect(e.port, e.lanip, (()=>{
                    const e = Date.now()
                      , t = JSON.stringify({
                        timestamp: e,
                        from: this.localSocketKey,
                        secret: w().createHash("md5").update(e + this._UID_ + this.localSocketKey).digest("hex"),
                        method: i
                    });
                    "ping" === i ? s.end(t) : s.write(t)
                }
                ));
                let r = !1;
                s.once("data", (e=>{
                    "ping" === i ? r = "ok" === e.toString() : (r = !0,
                    s.end(n))
                }
                )),
                s.once("timeout", (()=>{
                    r = !1,
                    s.destroy()
                }
                )),
                s.once("error", (()=>{
                    r = !1,
                    s.destroy()
                }
                )),
                s.once("close", (()=>{
                    o(r)
                }
                ))
            }
            )))),
            Pt(this, "ping", (e=>this.sendText(e, "ping"))),
            Pt(this, "sendFile", ((e,i,n,o)=>new Promise((s=>{
                if (!t.net.online || !this._UID_)
                    return s(!1);
                if (!e.lanip || !e.port)
                    return s(!1);
                const r = new (St().Socket);
                r.setTimeout(xt),
                r.connect(e.port, e.lanip, (()=>{
                    const e = JSON.stringify({
                        timestamp: o,
                        from: this.localSocketKey,
                        secret: w().createHash("md5").update(o + this._UID_ + this.localSocketKey).digest("hex"),
                        method: "file",
                        fileName: i
                    });
                    r.write(e, "utf-8")
                }
                ));
                let a = !1;
                r.once("data", (e=>{
                    a = !0,
                    x().createReadStream(n).pipe(r, {
                        end: !0
                    })
                }
                )),
                r.once("timeout", (()=>{
                    a = !1,
                    r.destroy()
                }
                )),
                r.once("error", (()=>{
                    a = !1,
                    r.destroy()
                }
                )),
                r.once("close", (()=>{
                    s(a)
                }
                ))
            }
            )))),
            Pt(this, "readDirectoryFiles", ((e,i,n)=>{
                let o;
                try {
                    o = x().readdirSync(i)
                } catch (e) {}
                o && (0 !== o.length ? o.forEach((o=>{
                    const s = l().join(i, o);
                    let r;
                    try {
                        r = x().lstatSync(s)
                    } catch (e) {
                        return
                    }
                    if (r.isFile()) {
                        if (n.push({
                            name: e + "/" + o,
                            path: s
                        }),
                        1e3 === n.length && 1 === t.dialog.showMessageBoxSync({
                            buttons: ["继续", "取消发送"],
                            message: "已读取到 1000 个待发送文件，是否选择继续发送?",
                            defaultId: 1,
                            cancelId: 1
                        }))
                            throw new Error("取消发送")
                    } else
                        r.isDirectory() && this.readDirectoryFiles(e + "/" + o, s, n)
                }
                )) : n.push({
                    name: e
                }))
            }
            )),
            Pt(this, "sendFiles", (async(e,i)=>{
                const n = [];
                for (const e of i)
                    if (e.isFile)
                        n.push(e);
                    else if (e.isDirectory)
                        try {
                            this.readDirectoryFiles(e.name, e.path, n)
                        } catch (e) {
                            return
                        }
                if (0 === n.length)
                    return void new t.Notification({
                        body: "无文件可发送"
                    }).show();
                const o = Date.now();
                let s = 0;
                for (const t of n) {
                    let i;
                    if (i = t.path ? await this.sendFile(e, t.name, t.path, o) : await this.sendText(e, "folder", t.name),
                    !i)
                        break;
                    s++
                }
                if (n.length === s)
                    return new t.Notification({
                        body: s + " 个文件已发送到远端 " + R(e.platform) + " 「下载」目录"
                    }).show(),
                    void await this.sendText(e, "show-file", o + "-" + i[0].name);
                0 === s ? new t.Notification({
                    body: "发送失败"
                }).show() : new t.Notification({
                    body: "连接中断，" + s + " 个文件已发送到远端 " + R(e.platform) + " 「下载」目录，未发送 " + (n.length - s) + " 个"
                }).show(),
                this.checkOnlinePing()
            }
            )),
            Pt(this, "mainServices", {
                onlineTrigger: ()=>{
                    this.listenServer && (this._onlineTriggerTimeout && clearTimeout(this._onlineTriggerTimeout),
                    this._onlineTriggerTimeout = setTimeout((()=>{
                        this._onlineTriggerTimeout = null,
                        this.connectionInit()
                    }
                    ), 1e4))
                }
            }),
            Pt(this, "ffffffffServices", {
                detectConnection: async()=>{
                    if (!this.accountCmp.getAccountInfo()?.db_sync)
                        return {
                            type: "account",
                            message: "需要登录 uTools 帐号，并开启数据同步！"
                        };
                    if (!t.net.online)
                        return {
                            type: "error",
                            message: "本地网络未连接互联网！(需要同步你的设备信息)"
                        };
                    let e;
                    try {
                        e = await this.dbCmp.getRemoteDbDocCount()
                    } catch (e) {
                        return {
                            type: "error",
                            message: "获取云端文档数出错了！—— " + e.message
                        }
                    }
                    if (await this.dbCmp.dbInfoDocCount() !== e)
                        return {
                            type: "warning",
                            message: "你的数据(包含设备信息)正在同步中... 请等待 uTools 数据同步完成！"
                        };
                    const i = await this.connectionInit();
                    if (!i)
                        return {
                            type: "info",
                            message: "无其他设备信息！请在你的另一台电脑下载安装 uTools 并登录相同帐号！"
                        };
                    const n = [];
                    return i.forEach((e=>{
                        n.push({
                            ...e,
                            pingOk: e._id in this.onlineConnectionDocDic
                        })
                    }
                    )),
                    {
                        type: "connection",
                        data: n.sort(((e,t)=>t.onlineAt - e.onlineAt))
                    }
                }
            }),
            this.pluginsCmp = e,
            this.dbCmp = n,
            this.windowCmp = i,
            this.accountCmp = o,
            this.localSocketKey = "socket/" + this.accountCmp.machineId,
            this.windowCmp.isWindow)
                this.downloadsPath = I().getDownloadsFolderPath();
            else
                try {
                    this.downloadsPath = t.app.getPath("downloads")
                } catch (e) {}
            this.downloadsPath || (this.downloadsPath = t.app.getPath("desktop")),
            this.onlineConnectionDocDic = {}
        }
        async putLocalSocketDoc() {
            const e = await this.dbCmp.put("/", this.localSocketDoc);
            e.ok && (this.localSocketDoc._rev = e.rev)
        }
        init() {
            this.accountCmp.on("logout", this.exitAllConnection),
            this.accountCmp.on("undbsync", this.exitAllConnection),
            this._ignoreDbPull = !0,
            this.dbCmp.on("replicate-start", (()=>{
                this._ignoreDbPull = !0
            }
            )),
            this.dbCmp.on("replicate-complete", (()=>{
                this._loopLocalOnlineHeartTimeout || this.loopLocalOnlineHeart(),
                this.connectionInit().then((()=>{
                    this._ignoreDbPull = !1
                }
                ))
            }
            )),
            this.dbCmp.on("pull", (e=>{
                if (this._ignoreDbPull)
                    return;
                const t = e.filter((e=>e._id.startsWith("socket/") && !e._deleted && e._id !== this.localSocketKey));
                0 !== t.length && this.setRemoteSocketFeatures(t).then((()=>{
                    this.listenServer || this.createListenServer()
                }
                ))
            }
            ))
        }
        async connectionInit() {
            const e = this.accountCmp.getAccountInfo();
            if (!e)
                return;
            this._UID_ = w().createHash("md5").update(e.db_secrect_key + e.uid).digest("hex");
            const t = await this.dbCmp.allDocs("/", "socket/");
            if (this.localSocketDoc = t.find((e=>e._id === this.localSocketKey)),
            this.localSocketDoc ? t.splice(t.indexOf(this.localSocketDoc), 1) : this.localSocketDoc = {
                _id: this.localSocketKey,
                platform: process.platform
            },
            t.length > 0) {
                const e = Date.now() - 1728e5
                  , i = t.filter((t=>t.onlineAt < e));
                if (i.length > 0 && (i.forEach((e=>{
                    e._delete = !0,
                    t.splice(t.indexOf(e), 1)
                }
                )),
                await this.dbCmp.bulkDocs("/", i)),
                t.length > 0)
                    return await this.setRemoteSocketFeatures(t),
                    this.listenServer ? (this.localSocketDoc.lanip = await N(),
                    this.localSocketDoc.onlineAt = Date.now(),
                    this.putLocalSocketDoc()) : this.createListenServer(),
                    t
            }
            this.listenServer && this.listenServer.close(),
            this.localSocketDoc.hostname = S().hostname(),
            this.localSocketDoc.onlineAt = Date.now(),
            this.localSocketDoc.lanip = null,
            this.localSocketDoc.port = 0,
            this.putLocalSocketDoc()
        }
        async setRemoteSocketFeatures(e) {
            let t = !1;
            for (const i of e) {
                if (!i._id.startsWith("socket/") || i._id === this.localSocketKey)
                    continue;
                const e = this.onlineConnectionDocDic[i._id];
                if (!await this.ping(i)) {
                    e && (delete this.onlineConnectionDocDic[i._id],
                    this.pluginsCmp.removeFeature("", i._id + "@copy"),
                    this.pluginsCmp.removeFeature("", i._id + "@send"),
                    t || (t = !0));
                    continue
                }
                const n = "我的 " + R(i.platform) + "「" + i.hostname + "」";
                this.pluginsCmp.setFeature("", {
                    code: i._id + "@copy",
                    cmds: [{
                        type: "over",
                        label: "复制到" + n,
                        maxLength: 99999999
                    }, {
                        type: "img",
                        label: "复制到" + n
                    }],
                    explain: i.lanip,
                    icon: "res/native/" + i.platform + ".png"
                }, !0),
                this.pluginsCmp.setFeature("", {
                    code: i._id + "@send",
                    cmds: [{
                        type: "files",
                        label: "发送到" + n
                    }],
                    explain: i.lanip,
                    icon: "res/native/" + i.platform + ".png"
                }, !0),
                t || (t = !0),
                this.onlineConnectionDocDic[i._id] = i
            }
            t && (!this._loopCheckOnlinePingTimeout && Object.keys(this.onlineConnectionDocDic).length > 0 && (this._loopCheckOnlinePingTimeout = setTimeout(this.loopCheckOnlinePing, 6e5)),
            this.windowCmp.refreshCmdSource())
        }
        removeRemoteSocketFeatures(e) {
            0 !== e.length && (e.forEach((e=>{
                this.pluginsCmp.removeFeature("", e._id + "@copy"),
                this.pluginsCmp.removeFeature("", e._id + "@send")
            }
            )),
            this.windowCmp.refreshCmdSource())
        }
        async createListenServer() {
            this.listenServer && this.listenServer.close(),
            this.localSocketDoc.lanip = await N(),
            this.localSocketDoc.hostname = S().hostname(),
            this.listenServer = St().createServer((e=>{
                e.setTimeout(xt),
                e.once("timeout", (()=>{
                    e.destroy()
                }
                )),
                e.once("error", (()=>{
                    e.destroy()
                }
                )),
                e.once("data", (i=>{
                    let n;
                    try {
                        n = JSON.parse(i.toString("utf-8"))
                    } catch (t) {
                        return void e.destroy()
                    }
                    if (this._UID_)
                        if (n.secret === w().createHash("md5").update(n.timestamp + this._UID_ + n.from).digest("hex")) {
                            if (!(n.from in this.onlineConnectionDocDic)) {
                                let t = e.remoteAddress;
                                this._trySetRemoteOnlineTimeout && clearTimeout(this._trySetRemoteOnlineTimeout),
                                this._trySetRemoteOnlineTimeout = setTimeout((async()=>{
                                    if (this._trySetRemoteOnlineTimeout = null,
                                    n.from in this.onlineConnectionDocDic)
                                        return;
                                    if (St().isIPv6(t)) {
                                        const e = t.toLowerCase().replace("::ffff:", "").trim();
                                        St().isIPv4(e) && (t = e)
                                    }
                                    const e = await this.dbCmp.get("/", n.from);
                                    e && (e.lanip !== t && (e.lanip = t),
                                    this.setRemoteSocketFeatures([e]))
                                }
                                ), 3e3)
                            }
                            if ("ping" !== n.method) {
                                if ("text" === n.method) {
                                    const i = [];
                                    return e.on("data", (e=>{
                                        i.push(e)
                                    }
                                    )),
                                    e.on("end", (()=>{
                                        setTimeout((()=>{
                                            t.clipboard.writeText(Buffer.concat(i).toString())
                                        }
                                        ))
                                    }
                                    )),
                                    void e.write("ok")
                                }
                                if ("image" === n.method) {
                                    const i = [];
                                    return e.on("data", (e=>{
                                        i.push(e)
                                    }
                                    )),
                                    e.on("end", (()=>{
                                        setTimeout((()=>{
                                            t.clipboard.writeImage(t.nativeImage.createFromDataURL(Buffer.concat(i).toString()))
                                        }
                                        ))
                                    }
                                    )),
                                    void e.write("ok")
                                }
                                if ("folder" === n.method)
                                    return e.on("data", (e=>{
                                        const t = l().join(this.downloadsPath, e.toString());
                                        x().existsSync(t) || x().mkdirSync(t, {
                                            recursive: !0
                                        })
                                    }
                                    )),
                                    void e.write("ok");
                                if ("file" === n.method) {
                                    const t = l().join(this.downloadsPath, n.fileName + "." + n.timestamp);
                                    if (n.fileName.includes("/")) {
                                        const e = l().dirname(t);
                                        x().existsSync(e) || x().mkdirSync(e, {
                                            recursive: !0
                                        })
                                    }
                                    const i = x().createWriteStream(t);
                                    return e.once("end", (()=>{
                                        const e = l().join(this.downloadsPath, n.fileName);
                                        try {
                                            x().existsSync(e) ? x().renameSync(t, l().join(this.downloadsPath, n.timestamp + "-" + n.fileName)) : x().renameSync(t, e)
                                        } catch (e) {}
                                    }
                                    )),
                                    e.pipe(i, {
                                        end: !0
                                    }),
                                    void e.write("ok")
                                }
                                if ("show-file" === n.method)
                                    return e.on("data", (e=>{
                                        const i = e.toString();
                                        let n;
                                        (x().existsSync(n = l().join(this.downloadsPath, i)) || x().existsSync(n = l().join(this.downloadsPath, i.substr(14)))) && t.shell.showItemInFolder(n)
                                    }
                                    )),
                                    void e.write("ok");
                                e.destroy()
                            } else
                                e.end("ok")
                        } else
                            e.destroy();
                    else
                        e.destroy()
                }
                ))
            }
            )).listen((()=>{
                this.localSocketDoc.onlineAt = Date.now(),
                this.localSocketDoc.port = this.listenServer.address().port,
                this.putLocalSocketDoc()
            }
            )).on("close", (()=>{
                this.listenServer = null
            }
            ))
        }
        sendData(e, i, n) {
            const o = e.split("@")[0]
              , s = this.onlineConnectionDocDic[o];
            s && (this.windowCmp.hideMainWindow(),
            "over" === i ? this.sendText(s, "text", n).then((e=>{
                e ? new t.Notification({
                    body: "文本已复制到远端 " + R(s.platform) + " 剪贴板"
                }).show() : (new t.Notification({
                    body: "发送失败"
                }).show(),
                this.checkOnlinePing())
            }
            )) : "img" === i ? this.sendText(s, "image", n).then((e=>{
                e ? new t.Notification({
                    body: "图像已复制到远端 " + R(s.platform) + " 剪贴板"
                }).show() : (new t.Notification({
                    body: "发送失败"
                }).show(),
                this.checkOnlinePing())
            }
            )) : "files" === i && this.sendFiles(s, n))
        }
    }
    let Dt = t.app.getPath("userData")
      , _t = "https://open.u-tools.cn"
      , It = {
        protocol: "https",
        host: "db.u-tools.cn"
    };
    r().dev() && (Dt = l().join(t.app.getPath("appData"), "dev-utools"),
    u().existsSync(Dt) || u().mkdirSync(Dt),
    _t = "http://open.test.u-tools.cn",
    It = {
        protocol: "http",
        host: "192.168.2.119",
        port: "5984"
    });
    const Tt = {
        path: {
            root: Dt,
            plugins: l().join(Dt, "plugins"),
            database: l().join(Dt, "database"),
            settings: l().join(Dt, "settings"),
            clipboardData: l().join(Dt, "clipboard-data")
        },
        app: {
            redirectURL: _t + "/redirect?target=",
            downloadURL: "https://u.tools",
            feedbackURL: "https://yuanliao.info",
            newestVersionURL: "https://publish.u-tools.cn/version2/newest-version.json"
        },
        database: {
            sync: It
        },
        window: {
            backgroundColor: "#FFFFFF",
            darkBackgroundColor: "#303133",
            initHeight: 56,
            initWidth: 800,
            openPluginHeight: 600,
            pluginDownloadURL: _t + "/plugins/{query}/download"
        },
        plugin: {
            checkUpdateURL: _t + "/plugins/plugin_update_check",
            hashURL: _t + "/plugins/{query}/hash"
        },
        autoupdate: {
            linuxURL: "https://publish.u-tools.cn/version2/",
            linuxDownloadURL: "https://u.tools"
        },
        report: {
            logsURL: _t + "/logs?access_token=",
            interval: 6e4
        },
        account: {
            muserURL: _t + "/muser?access_token=",
            loginURL: _t + "/login",
            profileURL: _t + "/profile",
            dbSyncURL: _t + "/database/sync",
            logoutURL: _t + "/logout",
            temporaryToken: _t + "/temporary_token"
        },
        voice: {
            contentWidth: 255,
            initContentHeight: 56,
            translateURL: _t + "/translates?access_token="
        },
        pay: {
            paymentsURL: _t + "/payments?access_token=",
            payCodeURL: _t + "/payments/{query}/pay_code?access_token=",
            payStatusURL: _t + "/payments/{query}/pay_status?access_token="
        }
    };
    (new class extends o {
        launch() {
            if (!t.app.requestSingleInstanceLock())
                return void t.app.quit();
            t.app.on("second-instance", ((e,t,i)=>{
                try {
                    this.get("window").display.trigger(!0)
                } catch (e) {}
            }
            )),
            t.app.commandLine.appendSwitch("disable-http-cache"),
            t.app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer"),
            r().dev() && t.app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
            const e = Date.now();
            if (r().macOS()) {
                if (r().production() && !t.app.isInApplicationsFolder())
                    return void t.app.moveToApplicationsFolder();
                t.app.dock.hide()
            } else
                r().windows() ? (t.app.disableHardwareAcceleration(),
                t.app.setAppUserModelId("org.yuanli.utools")) : r().linux() && t.app.disableHardwareAcceleration();
            const i = !u().existsSync(Tt.path.settings);
            n().setPath(Tt.path.settings),
            t.app.on("ready", (()=>{
                new class {
                    constructor(e) {
                        this.container = e
                    }
                    register() {
                        this.container.set("config", (()=>{
                            const e = new class {
                                get(e=null, t=null) {
                                    return e ? this.getData(e, a, t) : a
                                }
                                set(e, t={}) {
                                    return "object" == typeof e ? this.setObject(a, e) : "string" == typeof e && "" !== e && void this.setData(e, a, t)
                                }
                                getData(e, t, i) {
                                    if (-1 === e.indexOf("."))
                                        return void 0 !== t[e] ? t[e] : i;
                                    {
                                        const n = e.split(".")
                                          , o = n.splice(0, 1)[0]
                                          , s = n.join(".");
                                        return this.getData(s, t[o], i)
                                    }
                                }
                                setData(e, t, i) {
                                    const n = e.split(".");
                                    if (-1 === e.indexOf("."))
                                        t[e] = i;
                                    else {
                                        const e = n.splice(0, 1)[0];
                                        "object" != typeof t[e] && (t[e] = {});
                                        const o = n.join(".");
                                        this.setData(o, t[e], i)
                                    }
                                }
                                setObject(e, t={}) {
                                    for (const i in t)
                                        "object" == typeof t[i] && "object" == typeof e && "object" == typeof e[i] ? e[i] = this.setObject(e[i], t[i]) : e[i] = t[i];
                                    return e
                                }
                            }
                            ;
                            return e.set(Tt),
                            e
                        }
                        ), !0),
                        this.container.set("account", (()=>{
                            const e = this.container.get("config").get("account");
                            return new Be(e)
                        }
                        ), !0),
                        this.container.set("report", (()=>{
                            const e = this.container.get("config").get("report")
                              , i = this.container.get("account");
                            return new class {
                                constructor(e, i) {
                                    this.config = e,
                                    this.accountCmp = i,
                                    this.reportQueue = [],
                                    this.appVersion = t.app.getVersion(),
                                    this.osRelease = S().release()
                                }
                                info(e, t) {
                                    if (t) {
                                        if (t.error) {
                                            const i = this.reportQueue.find((i=>i.event === e && i.error === t.error));
                                            if (i)
                                                return void i.count++;
                                            t.count = 1
                                        }
                                        this.reportQueue.push({
                                            ...t,
                                            event: e,
                                            "@timestamp": (new Date).toISOString()
                                        })
                                    } else
                                        this.reportQueue.push({
                                            event: e,
                                            "@timestamp": (new Date).toISOString()
                                        });
                                    this.netTimeout || (this.netTimeout = setTimeout((()=>{
                                        this.netTimeout = null,
                                        this.netPost()
                                    }
                                    ), this.config.interval))
                                }
                                netPost() {
                                    if (t.net.online && 0 !== this.reportQueue.length) {
                                        for (const e of this.reportQueue)
                                            e.machineId = this.accountCmp.machineId,
                                            e.nid = this.accountCmp.nativeId,
                                            e.platform = process.platform,
                                            e.arch = process.arch,
                                            e.appVersion = this.appVersion,
                                            e.osRelease = this.osRelease;
                                        f(this.config.logsURL + this.accountCmp.getAccountToken(), [...this.reportQueue]).catch((()=>{}
                                        )),
                                        this.reportQueue = []
                                    }
                                }
                            }
                            (e,i)
                        }
                        ), !0),
                        this.container.set("plugins", (()=>{
                            const e = this.container.get("config")
                              , t = this.container.get("report")
                              , i = this.container.get("account");
                            return new pe(l().join(__dirname, "plugins"),e.get("path.plugins"),e.get("plugin"),t,i)
                        }
                        ), !0),
                        this.container.set("clipboard", (()=>{
                            const e = this.container.get("config")
                              , t = this.container.get("plugins");
                            return new Oe(e.get("path.clipboardData"),t)
                        }
                        ), !0),
                        this.container.set("window", (()=>{
                            const e = this.container.get("config").get("window")
                              , i = this.container.get("plugins")
                              , o = this.container.get("clipboard")
                              , s = this.container.get("report")
                              , a = this.container.get("account");
                            return new class {
                                constructor(e, i, o, s, a) {
                                    be(this, "mainServices", {
                                        getPluginContainer: e=>{
                                            e.returnValue = this.pluginsCmp.pluginContainer
                                        }
                                        ,
                                        setExpendHeight: (e,t)=>{
                                            this.setExpendHeight(t),
                                            e.returnValue = !0
                                        }
                                        ,
                                        onWebcontensBlur: ()=>{
                                            this.mainWebContentsBlurTimestamp = Date.now()
                                        }
                                        ,
                                        enterPlugin: (e,t,i,n)=>{
                                            this.enterPlugin(t, i, n),
                                            e.returnValue = !0
                                        }
                                        ,
                                        getNativeWorkWindowInfo: e=>{
                                            e.returnValue = this.display.nativeWorkWindowInfo
                                        }
                                        ,
                                        recoverPlugin: e=>{
                                            null === this.recoverPlugin((()=>{
                                                e.returnValue = !0
                                            }
                                            )) && (e.returnValue = !1)
                                        }
                                        ,
                                        endPlugin: e=>{
                                            this.endPlugin(),
                                            e.returnValue = !0
                                        }
                                        ,
                                        detachPlugin: e=>{
                                            this.detachPlugin(),
                                            e.returnValue = !0
                                        }
                                        ,
                                        hideMainWindow: e=>{
                                            this.hideMainWindow(),
                                            e.returnValue = !0
                                        }
                                        ,
                                        setPosition: (e,t,i)=>{
                                            this.display.setPosition(t, i)
                                        }
                                        ,
                                        sendSubInputChangeEvent: (e,t)=>{
                                            const i = this.mainWindow.getBrowserView();
                                            i ? (this.triggerPluginViewEvent(i, "SubInputChange", {
                                                text: t
                                            }),
                                            e.returnValue = !0) : e.returnValue = !1
                                        }
                                        ,
                                        sendPluginSomeKeyDownEvent: (e,t,i)=>{
                                            if (!(t = ge[t]))
                                                return void (e.returnValue = !1);
                                            const n = this.mainWindow.getBrowserView();
                                            n?.webContents ? (Array.isArray(i) && i.length > 0 ? n.webContents.sendInputEvent({
                                                type: "keyDown",
                                                modifiers: i,
                                                keyCode: t
                                            }) : n.webContents.sendInputEvent({
                                                type: "keyDown",
                                                keyCode: t
                                            }),
                                            e.returnValue = !0) : e.returnValue = !1
                                        }
                                        ,
                                        isFFFFFFFFRuning: e=>{
                                            e.returnValue = "FFFFFFFF"in this.runningPluginPool
                                        }
                                    }),
                                    be(this, "detachServices", {
                                        setPosition: (e,t,i,n,o,s,r)=>{
                                            i.setBounds({
                                                width: s,
                                                height: r,
                                                x: n,
                                                y: o
                                            })
                                        }
                                        ,
                                        sendPluginSomeKeyDownEvent: (e,t,i,n,o)=>{
                                            if (!(n = ge[n]))
                                                return;
                                            const s = i.getBrowserView();
                                            s?.webContents && (Array.isArray(o) && o.length > 0 ? s.webContents.sendInputEvent({
                                                type: "keyDown",
                                                modifiers: o,
                                                keyCode: n
                                            }) : s.webContents.sendInputEvent({
                                                type: "keyDown",
                                                keyCode: n
                                            }))
                                        }
                                        ,
                                        sendSubInputChangeEvent: (e,t,i,n)=>{
                                            const o = i.getBrowserView();
                                            o && this.triggerPluginViewEvent(o, "SubInputChange", {
                                                text: n
                                            })
                                        }
                                        ,
                                        openDevTool: (e,t,i)=>{
                                            const n = i.getBrowserView();
                                            n && this.openPluginDevTools(n)
                                        }
                                        ,
                                        setAlwaysOnTop: (e,t,i,n)=>{
                                            i.setAlwaysOnTop(n)
                                        }
                                        ,
                                        closeWindow: (e,t,i)=>{
                                            i.close()
                                        }
                                        ,
                                        endFullScreen: (e,t,i)=>{
                                            i.isFullScreen() && i.setFullScreen(!1)
                                        }
                                        ,
                                        minimizeWindow: (e,t,i)=>{
                                            i.blur(),
                                            i.minimize()
                                        }
                                        ,
                                        maximizeWindow: (e,t,i)=>{
                                            if (this.isLinux)
                                                return i.emit(i.listenerCount("linux-unmaximize") > 0 ? "linux-unmaximize" : "linux-maximize");
                                            i.isMaximized() ? i.unmaximize() : i.maximize()
                                        }
                                        ,
                                        webContentsFocus: (e,t,i)=>{
                                            i.webContents.focus()
                                        }
                                    }),
                                    be(this, "ffffffffServices", {
                                        autoLoadPlugin: (e,t,i,n)=>{
                                            this.autoLoadPlugin(t, i, n)
                                        }
                                        ,
                                        destroyPlugin: (e,t)=>{
                                            this.destroyPlugin(t),
                                            e.returnValue = !0
                                        }
                                        ,
                                        refreshCmdSource: e=>{
                                            this.refreshCmdSource()
                                        }
                                        ,
                                        refreshAccountAvatar: e=>{
                                            this.refreshAccountInfo(this.accountCmp.getAccountInfo()),
                                            e.returnValue = !0
                                        }
                                        ,
                                        pluginIsRuning: (e,t)=>{
                                            e.returnValue = t in this.runningPluginPool
                                        }
                                        ,
                                        getPluginRuningOsPids: (e,i)=>{
                                            if (!(i in this.runningPluginPool))
                                                return void (e.returnValue = null);
                                            const n = t.webContents.getAllWebContents()
                                              , o = n.filter((e=>e.session === this.pluginSessionPool[i]))
                                              , s = o.filter((e=>"window" === e.getType()));
                                            if (i in this.pluginUBrowserSessionPool) {
                                                const e = n.filter((e=>e.session === this.pluginUBrowserSessionPool[i]));
                                                e.length > 0 && o.push(...e)
                                            }
                                            if (0 !== o.length) {
                                                if (s.length > 0) {
                                                    const e = n.filter((e=>"webview" === e.getType()));
                                                    if (e.length > 0) {
                                                        const i = s.map((e=>t.BrowserWindow.fromWebContents(e)))
                                                          , n = e.filter((e=>i.includes(t.BrowserWindow.fromWebContents(e))));
                                                        n.length > 0 && o.push(...n)
                                                    }
                                                }
                                                e.returnValue = o.map((e=>e.getOSProcessId()))
                                            } else
                                                e.returnValue = null
                                        }
                                        ,
                                        killPlugin: (e,t)=>{
                                            const i = this.runningPluginPool[t];
                                            if (i) {
                                                if (i.view) {
                                                    const e = this.mainWindow.getBrowserView();
                                                    e && e === i.view ? this.recoverPlugin((()=>{
                                                        this.emptyRecovery()
                                                    }
                                                    )) : i.view.webContents.isDestroyed() || i.view.webContents.destroy()
                                                }
                                                i.detachWindows.length > 0 && i.detachWindows.forEach((e=>e.close())),
                                                e.returnValue = !0
                                            } else
                                                e.returnValue = !1
                                        }
                                        ,
                                        getNativeWorkWindowInfo: e=>{
                                            const t = this.mainWindow.getBrowserView();
                                            t && t.webContents === e.sender ? e.returnValue = this.display.nativeWorkWindowInfo : e.returnValue = null
                                        }
                                    }),
                                    be(this, "pluginApiServices", {
                                        hideMainWindow: (e,t,i)=>{
                                            const n = this.mainWindow.getBrowserView();
                                            n && n.webContents === e.sender ? (this.hideMainWindow(i),
                                            e.returnValue = !0) : e.returnValue = !1
                                        }
                                        ,
                                        showMainWindow: (e,t)=>{
                                            const i = this.mainWindow.getBrowserView();
                                            i && i.webContents === e.sender ? (this.mainWindow.isVisible() || this.display.trigger(!0),
                                            e.returnValue = !0) : e.returnValue = !1
                                        }
                                        ,
                                        setExpendHeight: (e,i,n)=>{
                                            (n = 0 | parseInt(n)) < 1 && (n = 1);
                                            const o = t.BrowserWindow.fromWebContents(e.sender);
                                            if (!o)
                                                return void (e.returnValue = !1);
                                            if (o === this.mainWindow)
                                                return this.setExpendHeight(n),
                                                void (e.returnValue = !0);
                                            const s = this.runningPluginPool[i];
                                            s && s.detachWindows.includes(o) ? (o.setSize(o.getSize()[0], this.config.initHeight + n),
                                            e.returnValue = !0) : e.returnValue = !1
                                        }
                                        ,
                                        setSubInput: (e,t,{isFocus: i, placeholder: n})=>{
                                            const o = this.getWorkWebContentsBySender(e.sender);
                                            o ? o.executeJavaScript(`window.api.setSubInput(${JSON.stringify({
                                                placeholder: n,
                                                isFocus: i
                                            })})`).then((()=>{
                                                if (i) {
                                                    if (this.mainWindow.webContents === o && !this.mainWindow.isVisible())
                                                        return this._isMainInputFocus = !0,
                                                        void (e.returnValue = !0);
                                                    o.isFocused() || o.focus(),
                                                    o.executeJavaScript("window.api.subInputFocus()").finally((()=>{
                                                        e.returnValue = !0
                                                    }
                                                    )),
                                                    this.isMacOs && setTimeout((()=>{
                                                        o.isDestroyed() || o.isFocused() || o.focus()
                                                    }
                                                    ), 50)
                                                } else
                                                    e.returnValue = !0
                                            }
                                            )).catch((()=>{
                                                e.returnValue = !1
                                            }
                                            )) : e.returnValue = !1
                                        }
                                        ,
                                        removeSubInput: (e,t)=>{
                                            const i = this.getWorkWebContentsBySender(e.sender);
                                            i ? i.executeJavaScript("window.api.removeSubInput()").then((()=>{
                                                e.sender.isDestroyed() || e.sender.focus()
                                            }
                                            )).finally((()=>{
                                                e.returnValue = !0
                                            }
                                            )) : e.returnValue = !1
                                        }
                                        ,
                                        setSubInputValue: (e,t,i)=>{
                                            const n = this.getWorkWebContentsBySender(e.sender);
                                            n ? (i = String(i),
                                            n.executeJavaScript(`window.api.setSubInputValue(${JSON.stringify({
                                                value: i
                                            })})`).then((()=>{
                                                n.isFocused() || n.focus(),
                                                n.executeJavaScript("window.api.subInputFocus()").finally((()=>{
                                                    e.returnValue = !0
                                                }
                                                ))
                                            }
                                            )).catch((()=>{
                                                e.returnValue = !1
                                            }
                                            ))) : e.returnValue = !1
                                        }
                                        ,
                                        subInputFocus: (e,t)=>{
                                            const i = this.getWorkWebContentsBySender(e.sender);
                                            if (i) {
                                                if (this.mainWindow.webContents === i && !this.mainWindow.isVisible())
                                                    return this._isMainInputFocus = !0,
                                                    void (e.returnValue = !0);
                                                i.isFocused() || i.focus(),
                                                i.executeJavaScript("window.api.subInputFocus()").finally((()=>{
                                                    e.returnValue = !0
                                                }
                                                ))
                                            } else
                                                e.returnValue = !1
                                        }
                                        ,
                                        subInputSelect: (e,t)=>{
                                            const i = this.getWorkWebContentsBySender(e.sender);
                                            i ? (i.isFocused() || i.focus(),
                                            i.executeJavaScript("window.api.subInputSelect()").finally((()=>{
                                                e.returnValue = !0
                                            }
                                            ))) : e.returnValue = !1
                                        }
                                        ,
                                        subInputBlur: (e,t)=>{
                                            e.sender.focus(),
                                            e.returnValue = !0
                                        }
                                        ,
                                        outPlugin: (e,i)=>{
                                            const n = t.BrowserWindow.fromWebContents(e.sender);
                                            if (!n)
                                                return;
                                            const o = this.triggerPluginViewEventQueues[e.sender.id]
                                              , s = o && 1 === o.length && "PluginEnter" === o[0];
                                            if (n === this.mainWindow)
                                                return s ? void setTimeout((()=>{
                                                    this.outPlugin()
                                                }
                                                ), 250) : void this.outPlugin();
                                            const r = this.runningPluginPool[i];
                                            if (!r)
                                                return;
                                            if (!r.detachWindows.includes(n))
                                                return;
                                            const a = this.pluginIsOutKill(i);
                                            s ? setTimeout((()=>{
                                                a || n.setBrowserView(null),
                                                n.close()
                                            }
                                            ), 250) : (a || n.setBrowserView(null),
                                            n.close())
                                        }
                                        ,
                                        createBrowserWindow: (e,i,{url: n, options: o})=>{
                                            const s = n.split("?");
                                            if (!/\.html$/i.test(s[0]))
                                                return void (e.returnValue = new Error("加载的不是 html 文件"));
                                            const r = this.pluginsCmp.pluginContainer[i];
                                            if (!r)
                                                return void (e.returnValue = new Error("插件应用 ID 不存在"));
                                            const a = l().join(r.location, s[0]);
                                            if (!u().existsSync(a))
                                                return void (e.returnValue = new Error("html 文件不存在"));
                                            if (!(i in this.pluginSessionPool))
                                                return void (e.returnValue = new Error("插件应用未运行"));
                                            if ((o = o || {}).backgroundColor || (o.backgroundColor = this.getWindowBackgroundColor()),
                                            o.icon = (0,
                                            d.fileURLToPath)(r.logo),
                                            o.autoHideMenuBar = !0,
                                            o.webPreferences = o.webPreferences || {},
                                            o.webPreferences.partition = null,
                                            o.webPreferences.session = this.pluginSessionPool[i],
                                            o.webPreferences.nodeIntegration = !1,
                                            o.webPreferences.sandbox = !1,
                                            o.webPreferences.contextIsolation = !1,
                                            o.webPreferences.nodeIntegrationInWorker = !1,
                                            o.webPreferences.nodeIntegrationInSubFrames = !1,
                                            o.webPreferences.enableRemoteModule = !1,
                                            o.webPreferences.defaultFontFamily || (o.webPreferences.defaultFontFamily = {
                                                standard: "system-ui",
                                                serif: "system-ui"
                                            }),
                                            o.webPreferences.defaultFontSize || (o.webPreferences.defaultFontSize = 14),
                                            o.webPreferences.preload && !o.webPreferences.preload.startsWith(r.location) && (o.webPreferences.preload = l().join(r.location, o.webPreferences.preload),
                                            !u().existsSync(o.webPreferences.preload)))
                                                return void (e.returnValue = new Error("preload 文件不存在"));
                                            const c = new t.BrowserWindow(o);
                                            let h;
                                            c.removeMenu(),
                                            h = this.isMacOs ? (e,t)=>{
                                                !t.meta || "keyDown" !== t.type || "KeyW" !== t.code && "KeyQ" !== t.code || (e.preventDefault(),
                                                c.destroy())
                                            }
                                            : (e,t)=>{
                                                "keyDown" === t.type && (t.control && "KeyW" === t.code || t.alt && "F4" === t.code) && (e.preventDefault(),
                                                c.destroy())
                                            }
                                            ,
                                            c.webContents.on("before-input-event", h),
                                            c.webContents.on("did-attach-webview", ((e,t)=>{
                                                t.on("before-input-event", h)
                                            }
                                            )),
                                            c.webContents.once("render-process-gone", (()=>{
                                                c.destroy()
                                            }
                                            )),
                                            c.loadFile(a, s.length > 1 ? {
                                                search: s[1]
                                            } : void 0),
                                            c.webContents.on("dom-ready", (()=>{
                                                e.sender.isDestroyed() || (c.webContents.insertCSS('body { font-family: system-ui,"PingFang SC","Helvetica Neue","Microsoft Yahei",sans-serif; }'),
                                                e.sender.executeJavaScript("if (window.utools && window.utools.__event__ && typeof window.utools.__event__.createBrowserWindowCallback === 'function') {\n          try { window.utools.__event__.createBrowserWindowCallback() } catch(e) {} \n          delete window.utools.__event__.createBrowserWindowCallback}"))
                                            }
                                            )),
                                            this.isWindow && "FFFFFFFF" !== i && this.setPluginWindowAppDetails(c, r),
                                            e.returnValue = {
                                                id: c.id,
                                                methods: ye.windowMethods,
                                                invokes: ye.windowInvokes,
                                                webContents: {
                                                    id: c.webContents.id,
                                                    methods: ye.webContentsMethods,
                                                    invokes: ye.webContentsInvokes
                                                }
                                            }
                                        }
                                        ,
                                        pluginBrowserWindowMethod: (e,i,{id: n, target: o, method: s, args: r})=>{
                                            const a = t.BrowserWindow.fromId(n);
                                            if (!a)
                                                return "isDestroyed" === s ? void (e.returnValue = !0) : void (e.returnValue = new Error("window no exist"));
                                            if (this.getPluginIdByWebContents(a.webContents) === i)
                                                if ("webContents" !== o)
                                                    if (ye.windowMethods.includes(s))
                                                        try {
                                                            e.returnValue = a[s](...r)
                                                        } catch (t) {
                                                            e.returnValue = t
                                                        }
                                                    else
                                                        e.returnValue = new Error('BrowserWindow function "' + s + '" no found');
                                                else {
                                                    if (!ye.webContentsMethods.includes(s))
                                                        return void (e.returnValue = new Error('webContents function "' + s + '" no found'));
                                                    try {
                                                        e.returnValue = a.webContents[s](...r)
                                                    } catch (t) {
                                                        e.returnValue = t
                                                    }
                                                }
                                            else
                                                e.returnValue = new Error("window id error")
                                        }
                                        ,
                                        pluginBrowserWindowInvoke: async(e,{id: i, target: n, method: o, args: s})=>{
                                            const r = t.BrowserWindow.fromId(i);
                                            if (!r)
                                                throw new Error("window no exist");
                                            if (this.getPluginIdByWebContents(r.webContents) !== e)
                                                throw new Error("window id error");
                                            if ("webContents" === n) {
                                                if ("print" === o) {
                                                    const e = ()=>new Promise(((e,t)=>{
                                                        r.webContents.print(s[0] || null, ((i,n)=>{
                                                            if (i)
                                                                return e();
                                                            t(new Error("errorType " + n))
                                                        }
                                                        ))
                                                    }
                                                    ));
                                                    return await e()
                                                }
                                                if (!ye.webContentsInvokes.includes(o))
                                                    throw new Error('webContents function "' + o + '" no found');
                                                return await r.webContents[o](...s)
                                            }
                                            if (!ye.windowInvokes.includes(o))
                                                throw new Error('BrowserWindow function "' + o + '" no found');
                                            return await r[o](...s)
                                        }
                                    }),
                                    this.runningPluginPool = {},
                                    this.pluginSessionPool = {},
                                    this.pluginUBrowserSessionPool = {},
                                    this.triggerPluginViewEventQueues = {},
                                    this.webContentsId2PluginIdCache = {},
                                    this.config = e,
                                    this.pluginsCmp = i,
                                    this.clipboardCmp = o,
                                    this.clipboardCmp.runningPluginPool = this.runningPluginPool,
                                    this.reportCmp = s,
                                    this.accountCmp = a,
                                    this.pluginDetachHotKey = "",
                                    this.pluginOutTimer = 3,
                                    this.isMacOs = r().macOS(),
                                    this.isWindow = r().windows(),
                                    this.isLinux = r().linux(),
                                    this.isDev = r().dev(),
                                    this.osRelease = S().release(),
                                    this.appVersion = t.app.getVersion();
                                    const c = n().get("theme");
                                    c && ["system", "dark", "light"].includes(c) && (t.nativeTheme.themeSource = c),
                                    this.onMainWindowBlur = this.onMainWindowBlur.bind(this),
                                    this.onMainWindowHide = this.onMainWindowHide.bind(this),
                                    this.onMainWindowShow = this.onMainWindowShow.bind(this),
                                    this.setPluginWindowAppDetails = this.setPluginWindowAppDetails.bind(this),
                                    this.removeDbIconCache = this.removeDbIconCache.bind(this),
                                    this.getWindowBackgroundColor = this.getWindowBackgroundColor.bind(this),
                                    this.mainWindowBorderWidth = this.isMacOs ? 0 : 1
                                }
                                init() {
                                    this.initNativeIconHandler(),
                                    this.initMainWin(),
                                    this.listenAccountEvent()
                                }
                                initNativeIconHandler() {
                                    const e = ["unknow"];
                                    let i = null;
                                    this.isLinux ? (this.nativeIconHandler = (n,o)=>n in Ce ? o({
                                        mimeType: "image/png",
                                        data: Ce[n]
                                    }) : e.includes(n) ? o({
                                        mimeType: "image/png",
                                        data: i
                                    }) : void t.app.getFileIcon(n, {
                                        size: "large"
                                    }).then((t=>{
                                        if (t.isEmpty())
                                            return e.push(n),
                                            o({
                                                mimeType: "image/png",
                                                data: i
                                            });
                                        const s = t.toPNG();
                                        if (i.equals(s))
                                            return e.push(n),
                                            o({
                                                mimeType: "image/png",
                                                data: i
                                            });
                                        Ce[n] = s,
                                        o({
                                            mimeType: "image/png",
                                            data: s
                                        })
                                    }
                                    )).catch((()=>{
                                        e.push(n),
                                        o({
                                            mimeType: "image/png",
                                            data: i
                                        })
                                    }
                                    )),
                                    t.app.getFileIcon("unknow", {
                                        size: "large"
                                    }).then((e=>{
                                        i = e.toPNG()
                                    }
                                    ))) : (this.nativeIconHandler = (t,n)=>t in Ce ? n({
                                        mimeType: "image/png",
                                        data: Ce[t]
                                    }) : e.includes(t) ? n({
                                        mimeType: "image/png",
                                        data: i
                                    }) : void I().fetchFileIconAsPng(t, (o=>o ? i.equals(o) ? (o = null,
                                    e.push(t),
                                    n({
                                        mimeType: "image/png",
                                        data: i
                                    })) : (Ce[t] = o,
                                    void n({
                                        mimeType: "image/png",
                                        data: o
                                    })) : (e.push(t),
                                    n({
                                        mimeType: "image/png",
                                        data: i
                                    })))),
                                    I().fetchFileIconAsPng("unknow", (e=>{
                                        i = e || Buffer.alloc(5184, 0)
                                    }
                                    )))
                                }
                                setSessionIconProtocol(e) {
                                    e.protocol.registerBufferProtocol("nativeicon", ((e,t)=>{
                                        let i = e.url.substr(13);
                                        try {
                                            i = decodeURIComponent(i)
                                        } catch (e) {}
                                        this.nativeIconHandler(i, t)
                                    }
                                    )),
                                    e.protocol.registerBufferProtocol("dbicon", ((e,t)=>{
                                        let i = e.url.substr(9);
                                        try {
                                            i = decodeURIComponent(i)
                                        } catch (e) {}
                                        if (i in Ce)
                                            return t({
                                                mimeType: "image/png",
                                                data: Ce[i]
                                            });
                                        this.getDbAttachment("/", i, "icon").then((e=>{
                                            Ce[i] = e,
                                            t({
                                                mimeType: "image/png",
                                                data: e
                                            })
                                        }
                                        )).catch((()=>{
                                            t()
                                        }
                                        ))
                                    }
                                    ))
                                }
                                removeDbIconCache(e) {
                                    e in Ce && delete Ce[e]
                                }
                                getWindowBackgroundColor() {
                                    return t.nativeTheme.shouldUseDarkColors ? this.config.darkBackgroundColor : this.config.backgroundColor
                                }
                                getMainWindwoSession() {
                                    const e = t.session.fromPartition("persist:<utools>");
                                    return e.on("will-download", ((e,i,n)=>{
                                        if (i.setSavePath(l().join(t.app.getPath("temp"), E() + ".upx")),
                                        !this._updatePluginCmdCache)
                                            return e.preventDefault();
                                        const o = {
                                            ...this._updatePluginCmdCache
                                        };
                                        this._updatePluginCmdCache = null;
                                        const s = i.getURLChain()[0];
                                        if (!/\/plugins\/(\w+)\/download\?/.test(s))
                                            return e.preventDefault();
                                        const r = RegExp.$1;
                                        let a = null;
                                        i.on("updated", ((e,t)=>{
                                            "interrupted" !== t ? a || (a = setTimeout((()=>{
                                                a = null;
                                                const e = i.getTotalBytes()
                                                  , t = i.getReceivedBytes();
                                                if (!e || !t)
                                                    return;
                                                const n = Math.floor(t / e * 100);
                                                this.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.downloadProgressing(${n})`)
                                            }
                                            ), 200)) : i.cancel()
                                        }
                                        )),
                                        i.once("done", ((e,n)=>{
                                            a && clearTimeout(a);
                                            const s = i.getSavePath();
                                            if (o.pluginId !== r || !(r in this.pluginsCmp.pluginContainer)) {
                                                try {
                                                    u().unlinkSync(s)
                                                } catch (e) {}
                                                return void this.emptyRecovery()
                                            }
                                            if ("completed" !== n)
                                                return this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.endAssemblyPlugin()"),
                                                void this.reallyEnterPlugin(r, o.featureCode, o.inputCmd);
                                            this.destroyPlugin(r);
                                            const c = this.pluginsCmp.pluginUpdateSet.indexOf(r);
                                            c >= 0 && this.pluginsCmp.pluginUpdateSet.splice(c, 1),
                                            this.pluginsCmp.install(r, s, (e=>{
                                                e ? (this.reportCmp.info("plugin.update.fail", {
                                                    pluginId: r,
                                                    error: e.message
                                                }),
                                                new t.Notification({
                                                    body: "插件应用更新出错！" + e.message
                                                }).show()) : (this.refreshCmdSource(),
                                                this.reportCmp.info("plugin.update", {
                                                    pluginId: r,
                                                    pluginVersion: this.pluginsCmp.pluginContainer[r].version,
                                                    timeCost: Date.now() - o.timestamp
                                                })),
                                                this.reallyEnterPlugin(r, o.featureCode, o.inputCmd, !0);
                                                try {
                                                    u().unlinkSync(s)
                                                } catch (e) {}
                                            }
                                            ))
                                        }
                                        ))
                                    }
                                    )),
                                    this.setSessionIconProtocol(e),
                                    e
                                }
                                initMainWin() {
                                    this.mainWindow = new t.BrowserWindow({
                                        fullscreenable: !1,
                                        minimizable: !1,
                                        maximizable: !1,
                                        alwaysOnTop: !0,
                                        closable: !1,
                                        show: !1,
                                        backgroundColor: this.getWindowBackgroundColor(),
                                        resizable: !this.isLinux,
                                        frame: !this.isLinux,
                                        titleBarStyle: "hidden",
                                        enableLargerThanScreen: !0,
                                        skipTaskbar: !0,
                                        autoHideMenuBar: !0,
                                        type: this.isMacOs ? "panel" : "toolbar",
                                        webPreferences: {
                                            devTools: this.isDev,
                                            nodeIntegration: !1,
                                            sandbox: !1,
                                            contextIsolation: !1,
                                            session: this.getMainWindwoSession(),
                                            enableRemoteModule: !1,
                                            backgroundThrottling: !1,
                                            navigateOnDragDrop: !1,
                                            spellcheck: !1,
                                            webgl: !1,
                                            enableWebSQL: !1,
                                            preload: l().join(__dirname, "preload.js")
                                        }
                                    }),
                                    this.mainWindow.removeMenu(),
                                    this.mainWindowNativeWindowHandle = this.mainWindow.getNativeWindowHandle(),
                                    this.isWindow ? this.mainWindow.setAlwaysOnTop(!0, "pop-up-menu") : this.isMacOs && (this.mainWindow.setAlwaysOnTop(!0, "modal-panel", 1),
                                    this.mainWindow.setWindowButtonVisibility(!1),
                                    I().windowConvertToPanel(this.mainWindowNativeWindowHandle)),
                                    this.display = new me(this.mainWindow,this.mainWindowNativeWindowHandle,this.config.initWidth + 2 * this.mainWindowBorderWidth,this.config.initHeight + 2 * this.mainWindowBorderWidth),
                                    this.mainWindow.loadFile(l().join(__dirname, "index.html")),
                                    this.mainWindow.on("blur", this.onMainWindowBlur),
                                    this.mainWindow.on("hide", this.onMainWindowHide),
                                    this.mainWindow.on("show", this.onMainWindowShow),
                                    this.mainWindow.on("will-resize", (e=>{
                                        e.preventDefault(),
                                        this.mainWindow.getBrowserView() && this.detachPlugin()
                                    }
                                    )),
                                    this.mainWindow.webContents.setBackgroundThrottling(!1),
                                    this.mainWindow.webContents.once("dom-ready", (()=>{
                                        this.mainWindowBorderWidth > 0 && this.mainWindow.webContents.insertCSS(`.main { border-style: solid; border-width: ${this.mainWindowBorderWidth}px; }`)
                                    }
                                    )),
                                    this.mainWindow.webContents.on("before-input-event", ((e,t)=>{
                                        if ("keyDown" !== t.type || !(t.meta || t.control || t.shift || t.alt))
                                            return;
                                        const i = this.hotKeyAction(t);
                                        if (i) {
                                            if ("close" === i)
                                                return e.preventDefault(),
                                                void (this.mainWindow.getBrowserView() ? this.outPlugin() : this.hideMainWindow());
                                            if ("detach" !== i)
                                                return "setting" === i ? (e.preventDefault(),
                                                void this.ffffffff.goSetting()) : "select" === i ? (e.preventDefault(),
                                                void this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.mainInputSelect()")) : void ("dev" === i && (e.preventDefault(),
                                                this.openPluginDevTools()));
                                            this.mainWindow.getBrowserView() && (e.preventDefault(),
                                            process.nextTick((()=>{
                                                this.detachPlugin()
                                            }
                                            )))
                                        }
                                    }
                                    )),
                                    this.mainWindow.on("close", (e=>{
                                        e.preventDefault()
                                    }
                                    )),
                                    this.mainWindow.once("closed", (()=>{
                                        t.app.emit("exit")
                                    }
                                    )),
                                    this.mainWindow.webContents.once("render-process-gone", (()=>{
                                        t.app.emit("exit")
                                    }
                                    )),
                                    this.isMacOs && t.app.on("before-quit", (e=>{
                                        e.preventDefault(),
                                        Object.values(this.runningPluginPool).filter((e=>e.detachWindows.length > 0)).forEach((e=>{
                                            e.detachWindows.forEach((e=>{
                                                e.close()
                                            }
                                            ))
                                        }
                                        ))
                                    }
                                    )),
                                    this.ffffffff = fe.call(this)
                                }
                                onMainWindowBlur() {
                                    if (!(this.ignoreMainWindowBlurExpiryTime && Date.now() - this.ignoreMainWindowBlurExpiryTime < 0) && this.mainWindow.isVisible())
                                        return this.isWindow ? (this.display.mainWindowBlurTimestamp = Date.now(),
                                        this.display.mainWindowBlurTimestamp - this.display.mainWindowShowTimestamp < 250 ? (this.display.trigger(!0, !0),
                                        void setImmediate((()=>{
                                            this.mainWindow.isFocused() || this.hideMainWindow()
                                        }
                                        ))) : void setTimeout((()=>{
                                            I().isMouseLeftDown() ? this.win32CheckMouseLeftUp() : this.hideMainWindow()
                                        }
                                        ), 50)) : void (this.isMacOs && Date.now() - this.display.mainWindowShowTimestamp < 50 || this.hideMainWindow())
                                }
                                onMainWindowHide() {
                                    if (this.mainWindowHideTimeout && (clearTimeout(this.mainWindowHideTimeout),
                                    this.mainWindowHideTimeout = null),
                                    this.mainWindow.getBrowserView())
                                        if (this.isWindow)
                                            setTimeout((()=>{
                                                this._isMainInputFocus = this.display.mainWindowBlurTimestamp - this.mainWebContentsBlurTimestamp <= 0
                                            }
                                            ), 50);
                                        else if (this.isLinux) {
                                            const e = Date.now();
                                            setTimeout((()=>{
                                                this._isMainInputFocus = e - this.mainWebContentsBlurTimestamp <= 0
                                            }
                                            ), 50)
                                        } else
                                            setImmediate((()=>{
                                                this._isMainInputFocus = Date.now() - this.mainWebContentsBlurTimestamp < 50
                                            }
                                            ));
                                    else
                                        this._isMainInputFocus = !1;
                                    this.pluginOutTimer > 10 || (this.mainWindowHideTimeout = setTimeout((()=>{
                                        this.mainWindowHideTimeout = null,
                                        this.mainWindow.getBrowserView() ? this.outPlugin() : this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getEnterFeatureCmd()").then((e=>{
                                            e || this.emptyRecovery()
                                        }
                                        ))
                                    }
                                    ), this.pluginOutTimer > .1 ? 6e4 * this.pluginOutTimer : 50))
                                }
                                onMainWindowShow() {
                                    this.mainWindowHideTimeout && (clearTimeout(this.mainWindowHideTimeout),
                                    this.mainWindowHideTimeout = null),
                                    this.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.localWindowMatch(${JSON.stringify(this.display.nativeWorkWindowInfo || null)})`);
                                    const e = this.mainWindow.getBrowserView();
                                    e ? !0 !== this._isMainInputFocus || this.display.alwaysShow ? this.isLinux ? setTimeout((()=>{
                                        this.mainWindow.getBrowserView() === e && e.webContents?.focus()
                                    }
                                    ), 50) : setImmediate((()=>{
                                        this.mainWindow.getBrowserView() === e && e.webContents?.focus()
                                    }
                                    )) : (this.mainWindow.webContents.focus(),
                                    this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.mainInputSelect()")) : (this.mainWindow.webContents.focus(),
                                    this.display.alwaysShow || !this.clipboardCmp.isPreCopy() ? this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.mainInputSelect()") : this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.autoPaste()"))
                                }
                                win32CheckMouseLeftUp() {
                                    this.win32CheckMouseLeftUpTimer && clearTimeout(this.win32CheckMouseLeftUpTimer),
                                    this.win32CheckMouseLeftUpTimer = setTimeout((()=>{
                                        if (this.win32CheckMouseLeftUpTimer = null,
                                        I().isMouseLeftDown())
                                            return void this.win32CheckMouseLeftUp();
                                        const e = I().getCursorPosition();
                                        if (e) {
                                            const t = Math.round(e.x / this.display.currentDisplay.scaleFactor)
                                              , i = Math.round(e.y / this.display.currentDisplay.scaleFactor)
                                              , n = this.display.mainWindowBounds;
                                            if (t > n.x && t < n.x + n.width && i > n.y && i < n.y + n.height)
                                                return this.mainWindow.focus(),
                                                void (i > n.y + this.config.initHeight && this.mainWindow.getBrowserView()?.webContents?.focus());
                                            this.hideMainWindow()
                                        } else
                                            this.hideMainWindow()
                                    }
                                    ), 50)
                                }
                                hideMainWindow(e) {
                                    this.display.hide(e)
                                }
                                hotKeyAction(e) {
                                    const t = ge[e.code];
                                    if (!t)
                                        return !1;
                                    let i = "";
                                    if (e.meta && (i += this.isMacOs ? "Command+" : "Super+"),
                                    e.control && (i += "Control+"),
                                    e.shift && (i += "Shift+"),
                                    e.alt && (i += "Alt+"),
                                    !i)
                                        return !1;
                                    const n = i + t;
                                    if (this.isMacOs)
                                        switch (n) {
                                        case this.pluginDetachHotKey:
                                            return "detach";
                                        case "Command+Q":
                                        case "Command+W":
                                            return "close";
                                        case "Command+,":
                                            return "setting";
                                        case "Command+V":
                                            return "paste";
                                        case "Command+L":
                                            return "select";
                                        case "Command+Alt+I":
                                            return "dev"
                                        }
                                    else
                                        switch (n) {
                                        case this.pluginDetachHotKey:
                                            return "detach";
                                        case "Control+W":
                                        case "Alt+F4":
                                            return "close";
                                        case "Control+V":
                                            return "paste";
                                        case "Control+L":
                                            return "select";
                                        case "Control+Shift+I":
                                            return "dev"
                                        }
                                    return !1
                                }
                                setExpendHeight(e) {
                                    this.display.setHeight(this.config.initHeight + e + 2 * this.mainWindowBorderWidth)
                                }
                                reallyEnterPlugin(e, i, n, o) {
                                    const s = this.pluginsCmp.pluginContainer[e];
                                    if (!s)
                                        return void this.emptyRecovery();
                                   /* if (s.illegal)
                                        return new t.Notification({
                                            title: "uTools 安全检测",
                                            body: "当前安装的插件应用「" + s.pluginName + "」未通过安全验证，无法运行"
                                        }).show(),
                                        this.destroyPlugin(e),
                                        void this.emptyRecovery();*/ // chandlerver5
                                    if (!(i in s.featureDic))
                                        return o ? void setTimeout((()=>{
                                            this.reallyEnterPlugin(e, i, n)
                                        }
                                        ), 300) : (new t.Notification({
                                            body: "功能不存在，该功能已从插件应用「" + s.pluginName + "」中移除"
                                        }).show(),
                                        void this.emptyRecovery());
                                    if (s.isDev || this.reportCmp.info("plugin.enter", {
                                        pluginId: e,
                                        featureCode: i,
                                        way: n.way
                                    }),
                                    !(e in this.runningPluginPool))
                                        return this.setExpendHeight(0),
                                        void this.assemblyPlugin(s, i, n);
                                    const r = this.runningPluginPool[e];
                                    if (r.view)
                                        this.displayPlugin(r.view, s, i, n);
                                    else {
                                        if (0 === r.detachWindows.length)
                                            return this.setExpendHeight(0),
                                            void this.assemblyPlugin(s, i, n);
                                        if (s.pluginSetting.single) {
                                            this.setExpendHeight(0);
                                            const e = r.detachWindows[0];
                                            return r.detachWindows = [],
                                            r.view = e.getBrowserView(),
                                            void this.triggerPluginViewEvent(r.view, "PluginOut", !1, (()=>{
                                                e.setBrowserView(null),
                                                e.destroy(),
                                                this.displayPlugin(r.view, s, i, n)
                                            }
                                            ))
                                        }
                                        this.setExpendHeight(0),
                                        this.assemblyPlugin(s, i, n)
                                    }
                                }
                                enterPlugin(e, i, n) {
                                    if (!e)
                                        return void this.emptyRecovery();
                                    if (this.mainWindow.getBrowserView())
                                        return void this.recoverPlugin((()=>{
                                            this.enterPlugin(e, i, n)
                                        }
                                        ));
                                    if (!this.pluginsCmp.pluginUpdateSet.includes(e))
                                        return void this.reallyEnterPlugin(e, i, n);
                                    const o = this.pluginsCmp.pluginContainer[e]
                                      , s = this.runningPluginPool[e];
                                    o && s && !o.pluginSetting.single && s.detachWindows.length > 0 ? this.reallyEnterPlugin(e, i, n) : t.net.online ? (this.setExpendHeight(0),
                                    this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.startUpdatePlugin()"),
                                    this._updatePluginCmdCache = {
                                        pluginId: e,
                                        featureCode: i,
                                        inputCmd: n,
                                        timestamp: Date.now()
                                    },
                                    this.mainWindow.webContents.downloadURL(this.config.pluginDownloadURL.replace("{query}", e) + "?mid=" + this.accountCmp.machineId + "&nid=" + this.accountCmp.nativeId + "&update=true")) : this.reallyEnterPlugin(e, i, n)
                                }
                                getEnterPluginWinHeight(e) {
                                    const t = this.pluginsCmp.pluginContainer[e];
                                    return t.pluginSetting.height ? this.config.initHeight + t.pluginSetting.height + 2 * this.mainWindowBorderWidth : this.config.openPluginHeight + 2 * this.mainWindowBorderWidth
                                }
                                triggerPluginViewEvent(e, i, n, o) {
                                    if (!e.webContents || e.webContents.isDestroyed())
                                        return;
                                    const s = e.webContents.id;
                                    let r = this.triggerPluginViewEventQueues[s];
                                    if (r || (r = this.triggerPluginViewEventQueues[s] = []),
                                    r.length > 0 && "PluginOut" === i && r.find((e=>["PluginOut", "PluginEnter", "PluginReady"].includes(e))))
                                        return "function" == typeof o && o(),
                                        void setImmediate((()=>{
                                            if (e?.webContents && !e.webContents.isDestroyed()) {
                                                const i = this.getPluginIdByWebContents(e.webContents)
                                                  , n = t.BrowserWindow.fromBrowserView(e);
                                                if (e.webContents.destroy(),
                                                n && n !== this.mainWindow && !n.isDestroyed() && n.destroy(),
                                                i) {
                                                    const e = this.pluginsCmp.pluginContainer[i];
                                                    new t.Notification({
                                                        body: '插件应用 "' + e?.pluginName + '" 未响应，被强制完全退出'
                                                    }).show()
                                                }
                                            }
                                        }
                                        ));
                                    r.push(i);
                                    const a = ` if(window.utools && window.utools.__event__ && typeof window.utools.__event__.on${i} === 'function' ) {\n      try { window.utools.__event__.on${i}(${null == n ? "" : JSON.stringify(n)}) } catch(e) {} }`;
                                    e.webContents.executeJavaScript(a).then((()=>{
                                        const e = r.indexOf(i);
                                        -1 !== e && r.splice(e, 1),
                                        "function" == typeof o && o()
                                    }
                                    ))
                                }
                                displayPlugin(e, t, i, n, o=!1) {
                                    const s = this.pluginIsEnterDetach(t.name)
                                      , r = this.getEnterPluginWinHeight(t.name);
                                    let a = !1;
                                    "text" === n.type && n.subInputInput && (a = n.subInputInput);
                                    const c = {
                                        code: i,
                                        type: n.type,
                                        payload: n.payload
                                    };
                                    if (s) {
                                        const i = {
                                            ...this.display.mainWindowBounds
                                        };
                                        return i.height = r,
                                        void this.autoDetachPlugin(t.name, i, e, (t=>{
                                            o ? this.triggerPluginViewEvent(e, "PluginReady", null, (()=>{
                                                this.triggerPluginViewEvent(e, "PluginEnter", c, (()=>{
                                                    a && this.detachSubInputAutoInput(t, a),
                                                    this.triggerPluginViewEvent(e, "PluginDetach")
                                                }
                                                ))
                                            }
                                            )) : this.triggerPluginViewEvent(e, "PluginEnter", c, (()=>{
                                                a && this.detachSubInputAutoInput(t, a),
                                                this.triggerPluginViewEvent(e, "PluginDetach")
                                            }
                                            ))
                                        }
                                        ))
                                    }
                                    this.display.setHeight(r),
                                    e.webContents.setZoomFactor(1),
                                    this.mainWindow.setBrowserView(e),
                                    e.setBounds({
                                        x: o ? this.mainWindowBorderWidth : 1 - this.config.initWidth,
                                        y: this.config.initHeight + this.mainWindowBorderWidth,
                                        width: this.config.initWidth,
                                        height: this.display.mainWindowBounds.height - this.config.initHeight - 2 * this.mainWindowBorderWidth
                                    }),
                                    e.setAutoResize({
                                        width: !0,
                                        height: !0
                                    }),
                                    e.webContents.focus(),
                                    o ? this.triggerPluginViewEvent(e, "PluginReady", null, (()=>{
                                        this.triggerPluginViewEvent(e, "PluginEnter", c, (()=>{
                                            a && this.subInputAutoInput(a)
                                        }
                                        ))
                                    }
                                    )) : this.triggerPluginViewEvent(e, "PluginEnter", c, (()=>{
                                        a && this.subInputAutoInput(a),
                                        setTimeout((()=>{
                                            this.mainWindow.getBrowserView() === e && e.setBounds({
                                                x: this.mainWindowBorderWidth,
                                                y: this.config.initHeight + this.mainWindowBorderWidth,
                                                width: this.config.initWidth,
                                                height: this.display.mainWindowBounds.height - this.config.initHeight - 2 * this.mainWindowBorderWidth
                                            })
                                        }
                                        ), 50)
                                    }
                                    ))
                                }
                                assemblyPlugin(e, i, n) {
                                    if (void 0 !== i && this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.startAssemblyPlugin()"),
                                    !(e.name in this.pluginSessionPool)) {
                                        const i = t.session.fromPartition("<" + e.name + ">");
                                        this.pluginSessionPool[e.name] = i,
                                        e.isDev || i.webRequest.onBeforeSendHeaders(((e,t)=>{
                                            t({
                                                cancel: !e.url.startsWith("file://") && ("script" === e.resourceType || "stylesheet" === e.resourceType),
                                                requestHeaders: e.requestHeaders
                                            })
                                        }
                                        )),
                                        i.setPreloads([l().join(__dirname, "apisdk.js")])
                                    }
                                    const o = {
                                        textAreasAreResizable: !1,
                                        devTools: e.isDev || e.unsafe,
                                        nodeIntegration: !1,
                                        sandbox: !1,
                                        contextIsolation: !1,
                                        nodeIntegrationInWorker: !1,
                                        enableRemoteModule: !1,
                                        webSecurity: !1,
                                        allowRunningInsecureContent: !1,
                                        navigateOnDragDrop: !1,
                                        spellcheck: !1,
                                        enableWebSQL: !1,
                                        session: this.pluginSessionPool[e.name],
                                        defaultFontSize: 14,
                                        defaultFontFamily: {
                                            standard: "system-ui",
                                            serif: "system-ui"
                                        }
                                    };
                                    e.preload && (o.preload = e.preload);
                                    let s = new t.BrowserView({
                                        webPreferences: o
                                    });
                                    if ("FFFFFFFF" === e.name) {
                                        const e = !this.ffffffff.webContents;
                                        this.ffffffff.webContents = s.webContents,
                                        e && this.setSessionIconProtocol(this.ffffffff.webContents.session)
                                    }
                                    e.name in this.runningPluginPool ? this.runningPluginPool[e.name].view = s : this.runningPluginPool[e.name] = {
                                        view: s,
                                        detachWindows: []
                                    },
                                    e.isTpl ? s.webContents.loadFile(l().join(__dirname, "tpl", "index.html")) : s.webContents.loadURL(e.main);
                                    const a = s.webContents.id
                                      , c = ()=>{
                                        const i = t.webContents.getAllWebContents();
                                        i.filter((t=>t.session === this.pluginSessionPool[e.name] && "window" === t.getType())).forEach((e=>{
                                            const i = t.BrowserWindow.fromWebContents(e);
                                            i && i.destroy()
                                        }
                                        )),
                                        e.name in this.pluginUBrowserSessionPool && i.filter((t=>t.session === this.pluginUBrowserSessionPool[e.name])).forEach((e=>{
                                            const i = t.BrowserWindow.fromWebContents(e);
                                            i && i.destroy()
                                        }
                                        ))
                                    }
                                    ;
                                    s.webContents.once("destroyed", (()=>{
                                        delete this.webContentsId2PluginIdCache[a],
                                        delete this.triggerPluginViewEventQueues[a];
                                        const t = this.runningPluginPool[e.name];
                                        if (t) {
                                            if (t.view) {
                                                if (t.view !== s)
                                                    return void (s = null);
                                                t.view = null
                                            }
                                            if (t.detachWindows.length > 0)
                                                return void (s = null);
                                            delete this.runningPluginPool[e.name]
                                        }
                                        c(),
                                        s = null
                                    }
                                    )),
                                    s.webContents.once("render-process-gone", ((t,i)=>{
                                        const n = this.runningPluginPool[e.name];
                                        if (n) {
                                            if (n.view && n.view === s)
                                                n.view = null,
                                                this.mainWindow.getBrowserView() === s && (this.mainWindow.setBrowserView(null),
                                                this.mainWindow.webContents.focus(),
                                                this.emptyRecovery());
                                            else if (n.detachWindows.length > 0) {
                                                const e = n.detachWindows.find((e=>e.getBrowserView() === s));
                                                e && (n.detachWindows.splice(n.detachWindows.indexOf(e), 1),
                                                e.setBrowserView(null),
                                                e.destroy())
                                            }
                                            n.view || 0 !== n.detachWindows.length || (delete this.runningPluginPool[e.name],
                                            c())
                                        }
                                    }
                                    ));
                                    const d = setTimeout((()=>{
                                        this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getEnterFeatureCmd()").then((t=>{
                                            t && t.pluginId === e.name && this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.empty()")
                                        }
                                        )),
                                        s.webContents.destroy(),
                                        new t.Notification({
                                            body: '插件应用 "' + e.pluginName + '" 装配超时，被强制完全退出'
                                        }).show()
                                    }
                                    ), 15e3);
                                    s.webContents.once("dom-ready", (()=>{
                                        clearTimeout(d);
                                        let t = "\n        window.__EscTimestamp = 0;\n        window.addEventListener('keydown',(e)=>{\n          if(e.code==='Escape') window.__EscTimestamp=Date.now();\n        });\n        window.onpopstate = () => { history.pushState(null, null, null) }\n      ";
                                        if (e.isTpl && (this.isWindow ? t += `window.__WorkDir = ${JSON.stringify(e.location.replace(/\\/g, "/"))};` : t += `window.__WorkDir = ${JSON.stringify(e.location)};`),
                                        s.webContents.executeJavaScript(t).catch((()=>{}
                                        )),
                                        this.isMacOs ? s.webContents.insertCSS('body { font-family: system-ui,"PingFang SC","Helvetica Neue","Microsoft Yahei",sans-serif; }') : s.webContents.insertCSS('\n          ::-webkit-scrollbar-track-piece{ background-color: #fff; }\n          ::-webkit-scrollbar{ width: 8px; height: 8px; }\n          ::-webkit-scrollbar-thumb{ background-color: #e2e2e2; border-radius: 4px; border: 2px solid #fff; }\n          ::-webkit-scrollbar-thumb:hover{ background-color: #9f9f9f; }\n          body { font-family: system-ui,"PingFang SC","Helvetica Neue","Microsoft Yahei",sans-serif; }\n        '),
                                        void 0 === i)
                                            return this.triggerPluginViewEvent(s, "PluginReady");
                                        this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.endAssemblyPlugin()").then((t=>{
                                            e.name + i === t && this.displayPlugin(s, e, i, n, !0)
                                        }
                                        ))
                                    }
                                    )),
                                    r().production() && s.webContents.on("will-navigate", ((e,t)=>{
                                        e.preventDefault()
                                    }
                                    )),
                                    s.webContents.on("before-input-event", ((e,i)=>{
                                        if ("keyDown" !== i.type)
                                            return;
                                        if (!(i.meta || i.control || i.shift || i.alt)) {
                                            if ("Escape" === i.key) {
                                                const e = t.BrowserWindow.fromBrowserView(s);
                                                if (e !== this.mainWindow)
                                                    return void (e.isFullScreen() && e.setFullScreen(!1));
                                                let i = this.triggerPluginViewEventQueues[a];
                                                if (i && i.length > 0 && i.find((e=>["PluginOut", "PluginEnter", "PluginReady"].includes(e))))
                                                    return void setTimeout((()=>{
                                                        s && s.webContents && !s.webContents.isDestroyed() && (i = this.triggerPluginViewEventQueues[a],
                                                        i && i.length > 0 && i.find((e=>["PluginOut", "PluginEnter", "PluginReady"].includes(e))) && this.outPlugin())
                                                    }
                                                    ), 250);
                                                const n = Date.now();
                                                setTimeout((()=>{
                                                    s && s.webContents && !s.webContents.isDestroyed() && s.webContents.executeJavaScript("window.__EscTimestamp").then((e=>{
                                                        e - n < -50 || this.outPlugin()
                                                    }
                                                    ))
                                                }
                                                ), 50)
                                            }
                                            return
                                        }
                                        const n = this.hotKeyAction(i);
                                        if (n)
                                            if ("close" !== n)
                                                if ("detach" !== n) {
                                                    if ("paste" === n) {
                                                        const e = this.clipboardCmp.getPasteFormat();
                                                        if ("files" !== e && "img" !== e)
                                                            return;
                                                        const i = t.BrowserWindow.fromBrowserView(s);
                                                        return i === this.mainWindow ? void this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getEnterFeatureCmd()").then((t=>{
                                                            if (!t)
                                                                return;
                                                            const i = this.getCurrentPluginId();
                                                            if (!i)
                                                                return;
                                                            const n = this.pluginsCmp.pluginContainer[i].featureDic[t.featureCode];
                                                            n && n.cmds.find((t=>t.type === e)) && this.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.getPasteInputCmdForSameFeature(${JSON.stringify({
                                                                pluginId: i,
                                                                featureCode: t.featureCode
                                                            })})`).then((e=>{
                                                                e && this.triggerPluginViewEvent(s, "PluginOut", !1, (()=>{
                                                                    const t = this.triggerPluginViewEventQueues[a];
                                                                    t && t.length > 0 && t.includes("PluginOut") || this.triggerPluginViewEvent(s, "PluginEnter", e)
                                                                }
                                                                ))
                                                            }
                                                            ))
                                                        }
                                                        )) : void i.webContents.executeJavaScript("window.payload.featureCode").then((t=>{
                                                            if (!t)
                                                                return;
                                                            const i = this.getPluginIdByWebContents(s.webContents);
                                                            if (!i)
                                                                return;
                                                            const n = this.pluginsCmp.pluginContainer[i].featureDic[t];
                                                            n && n.cmds.find((t=>t.type === e)) && this.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.getPasteInputCmdForSameFeature(${JSON.stringify({
                                                                pluginId: i,
                                                                featureCode: t
                                                            })})`).then((e=>{
                                                                e && this.triggerPluginViewEvent(s, "PluginOut", !1, (()=>{
                                                                    const t = this.triggerPluginViewEventQueues[a];
                                                                    t && t.length > 0 && t.includes("PluginOut") || this.triggerPluginViewEvent(s, "PluginEnter", e)
                                                                }
                                                                ))
                                                            }
                                                            ))
                                                        }
                                                        ))
                                                    }
                                                    if ("select" !== n) {
                                                        if ("setting" === n)
                                                            return e.preventDefault(),
                                                            void this.ffffffff.goSetting();
                                                        "dev" === n && (e.preventDefault(),
                                                        this.openPluginDevTools(s))
                                                    } else {
                                                        e.preventDefault();
                                                        const i = t.BrowserWindow.fromBrowserView(s);
                                                        i === this.mainWindow ? (this.mainWindow.webContents.focus(),
                                                        this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.mainInputSelect()")) : (i.webContents.focus(),
                                                        i.webContents.executeJavaScript("window.api.subInputSelect()"))
                                                    }
                                                } else
                                                    s === this.mainWindow.getBrowserView() && (e.preventDefault(),
                                                    process.nextTick((()=>{
                                                        this.detachPlugin()
                                                    }
                                                    )));
                                            else {
                                                e.preventDefault();
                                                const i = t.BrowserWindow.fromBrowserView(s);
                                                i === this.mainWindow ? this.outPlugin() : i.close()
                                            }
                                    }
                                    ))
                                }
                                getCurrentPluginId() {
                                    const e = this.mainWindow.getBrowserView();
                                    if (null === e)
                                        return null;
                                    let t = null;
                                    for (const i in this.runningPluginPool)
                                        if (this.runningPluginPool[i].view === e) {
                                            t = i;
                                            break
                                        }
                                    return t
                                }
                                setPluginWindowAppDetails(e, i) {
                                    if ("string" == typeof i && (i = this.pluginsCmp.pluginContainer[i]),
                                    !i)
                                        return;
                                    const n = l().join(t.app.getPath("temp"), "utools-icons")
                                      , o = l().join(n, i.name + "-" + (i.version || "").replace(/\./g, "-") + ".ico");
                                    if (u().existsSync(o))
                                        e.setAppDetails({
                                            appId: "org.yuanli.utools." + i.name,
                                            appIconPath: o
                                        });
                                    else {
                                        if (!u().existsSync(n))
                                            try {
                                                u().mkdirSync(n)
                                            } catch {
                                                return
                                            }
                                        (0,
                                        we.png2WindowIco)((0,
                                        d.fileURLToPath)(i.logo)).then((t=>{
                                            u().writeFileSync(o, t),
                                            e.setAppDetails({
                                                appId: "org.yuanli.utools." + i.name,
                                                appIconPath: o
                                            })
                                        }
                                        ))
                                    }
                                }
                                outPlugin() {
                                    setImmediate((()=>{
                                        this.recoverPlugin((()=>{
                                            this.emptyRecovery()
                                        }
                                        ))
                                    }
                                    ))
                                }
                                recoverPlugin(e) {
                                    const t = this.getCurrentPluginId();
                                    if (!t)
                                        return null;
                                    const i = this.pluginIsOutKill(t);
                                    let n = this.mainWindow.getBrowserView();
                                    this.triggerPluginViewEvent(n, "PluginOut", i, (()=>{
                                        this.mainWindow.setBrowserView(null),
                                        this.mainWindow.webContents.focus(),
                                        i && n.webContents.destroy(),
                                        n = null,
                                        e()
                                    }
                                    ))
                                }
                                endPlugin() {
                                    if (!this.getCurrentPluginId())
                                        return;
                                    let e = this.mainWindow.getBrowserView();
                                    this.triggerPluginViewEvent(e, "PluginOut", !0, (()=>{
                                        this.mainWindow.setBrowserView(null),
                                        this.mainWindow.webContents.focus(),
                                        this.emptyRecovery(),
                                        e.webContents.destroy(),
                                        e = null
                                    }
                                    ))
                                }
                                detachPlugin() {
                                    const e = this.mainWindow.getBrowserView();
                                    if (!e)
                                        return;
                                    const t = this.getPluginIdByWebContents(e.webContents);
                                    if (!t)
                                        return;
                                    const i = e.webContents.isFocused()
                                      , n = {
                                        ...this.display.mainWindowBounds
                                    };
                                    this.mainWindow.setBrowserView(null),
                                    this.mainWindow.hide(),
                                    this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getEnterFeatureCmd()").then((o=>{
                                        o && (o.subInput ? this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getMainInputValue()").then((s=>{
                                            o.subInput.value = s,
                                            this.detachPluginLogic(t, o, n, e, i, (()=>{
                                                this.triggerPluginViewEvent(e, "PluginDetach")
                                            }
                                            ))
                                        }
                                        )) : this.detachPluginLogic(t, o, n, e, i, (()=>{
                                            this.triggerPluginViewEvent(e, "PluginDetach")
                                        }
                                        )))
                                    }
                                    ))
                                }
                                autoDetachPlugin(e, t, i, n) {
                                    this.mainWindow.hide(),
                                    this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getEnterFeatureCmd()").then((o=>{
                                        this.detachPluginLogic(e, o, t, i, !0, n)
                                    }
                                    ))
                                }
                                detachPluginLogic(e, i, n, o, s, r) {
                                    this.emptyRecovery();
                                    const a = this.pluginsCmp.pluginContainer[e];
                                    let c = a.logo;
                                    const h = a.featureDic[i.featureCode]?.icon;
                                    h && h.startsWith("file://") && (c = h);
                                    let u = new t.BrowserWindow({
                                        show: !1,
                                        frame: !this.isLinux,
                                        autoHideMenuBar: !0,
                                        titleBarStyle: "hidden",
                                        trafficLightPosition: {
                                            x: 12,
                                            y: 21
                                        },
                                        backgroundColor: this.getWindowBackgroundColor(),
                                        icon: (0,
                                        d.fileURLToPath)(a.logo),
                                        title: a.pluginName,
                                        enableLargerThanScreen: !0,
                                        x: n.x,
                                        y: n.y,
                                        width: n.width,
                                        height: n.height,
                                        webPreferences: {
                                            partition: "persist:<utools>",
                                            devTools: !1,
                                            nodeIntegration: !1,
                                            sandbox: !1,
                                            contextIsolation: !1,
                                            navigateOnDragDrop: !1,
                                            spellcheck: !1,
                                            webgl: !1,
                                            enableWebSQL: !1,
                                            preload: l().join(__dirname, "detach", "preload.js")
                                        }
                                    });
                                    u.removeMenu(),
                                    this.isWindow && "FFFFFFFF" !== e && this.setPluginWindowAppDetails(u, a),
                                    this.isMacOs && !t.app.dock.isVisible() && t.app.dock.show(),
                                    this.runningPluginPool[e].view = null,
                                    this.runningPluginPool[e].detachWindows.push(u),
                                    u.loadFile(l().join(__dirname, "detach", "index.html")),
                                    u.setMinimumSize(this.config.initWidth, this.config.initHeight + 1),
                                    u.webContents.executeJavaScript(`window.initRender(${JSON.stringify({
                                        pluginId: e,
                                        icon: c,
                                        label: i.label,
                                        subInput: i.subInput,
                                        featureCode: i.featureCode,
                                        isDev: a.isDev,
                                        isPluginInfo: true || "FFFFFFFF" !== e && !a.isDev
                                    })})`).then((([e,t])=>{
                                        e && e[0] > 0 && e[1] > 0 && (n.width = e[0],
                                        n.height = e[1]),
                                        u.setBounds(n),
                                        n.height > this.config.openPluginHeight / 2 && u.center(),
                                        u.show(),
                                        t && t >= 25 && t <= 500 ? o.webContents.setZoomFactor(t / 100) : o.webContents.setZoomFactor(1),
                                        u.setBrowserView(o),
                                        o.setBounds({
                                            x: 0,
                                            y: this.config.initHeight,
                                            width: n.width,
                                            height: n.height - this.config.initHeight
                                        }),
                                        o.setAutoResize({
                                            width: !0,
                                            height: !0
                                        }),
                                        s || !i.subInput ? o.webContents?.focus() : u.webContents.focus(),
                                        "function" == typeof r && r(u),
                                        e && 0 === e[0] && 0 === e[1] && (this.isWindow ? setImmediate((()=>{
                                            u.maximize()
                                        }
                                        )) : this.isMacOs ? setImmediate((()=>{
                                            u.setFullScreen(!0)
                                        }
                                        )) : this.isLinux && setImmediate((()=>{
                                            u.emit("linux-maximize")
                                        }
                                        )))
                                    }
                                    )),
                                    u.once("close", (t=>{
                                        t.preventDefault();
                                        const i = this.runningPluginPool[e].detachWindows;
                                        i.splice(i.indexOf(u), 1);
                                        const n = Boolean(u.getBrowserView());
                                        this.triggerPluginViewEvent(o, "PluginOut", n, (()=>{
                                            n ? (u.setBrowserView(null),
                                            o.webContents.destroy()) : this.runningPluginPool[e].view = o,
                                            u.destroy(),
                                            o = null,
                                            u = null
                                        }
                                        ))
                                    }
                                    )),
                                    u.once("closed", (()=>{
                                        if (o = null,
                                        u = null,
                                        this.isMacOs && !Object.values(this.runningPluginPool).find((e=>e.detachWindows.length > 0)))
                                            return this.mainWindow.isVisible() ? (t.app.dock.hide(),
                                            void setTimeout((()=>{
                                                this.mainWindow.isVisible() || this.display.trigger(!0)
                                            }
                                            ), 50)) : void t.app.dock.hide()
                                    }
                                    )),
                                    this.isWindow ? (u.on("maximize", (()=>{
                                        u.webContents.executeJavaScript("window.api.maximizeTrigger()");
                                        const e = u.getBrowserView();
                                        if (!e)
                                            return;
                                        const i = t.screen.getDisplayMatching(u.getBounds());
                                        e.setBounds({
                                            x: 0,
                                            y: this.config.initHeight,
                                            width: i.workArea.width,
                                            height: i.workArea.height - this.config.initHeight
                                        })
                                    }
                                    )),
                                    u.on("unmaximize", (()=>{
                                        u.webContents.executeJavaScript("window.api.unmaximizeTrigger()");
                                        const e = u.getBrowserView();
                                        if (!e)
                                            return;
                                        const i = u.getBounds()
                                          , n = t.screen.getDisplayMatching(i)
                                          , o = n.scaleFactor * i.width % 1 == 0 ? i.width : i.width - 2
                                          , s = n.scaleFactor * i.height % 1 == 0 ? i.height : i.height - 2;
                                        e.setBounds({
                                            x: 0,
                                            y: this.config.initHeight,
                                            width: o,
                                            height: s - this.config.initHeight
                                        })
                                    }
                                    ))) : this.isMacOs ? (u.on("enter-full-screen", (()=>{
                                        u.webContents.executeJavaScript("window.api.enterFullScreenTrigger()")
                                    }
                                    )),
                                    u.on("leave-full-screen", (()=>{
                                        u.webContents.executeJavaScript("window.api.leaveFullScreenTrigger()")
                                    }
                                    ))) : this.isLinux && u.on("linux-maximize", (()=>{
                                        const e = u.getBounds()
                                          , i = t.screen.getDisplayMatching(e);
                                        u.setBounds(i.workArea),
                                        u.setMovable(!1),
                                        u.setResizable(!1);
                                        const n = u.getBrowserView();
                                        n && (n.webContents.focus(),
                                        setTimeout((()=>{
                                            !u.isDestroyed() && u.listenerCount("linux-unmaximize") > 0 && n.setBounds({
                                                x: 0,
                                                y: this.config.initHeight,
                                                width: i.workArea.width,
                                                height: i.workArea.height - this.config.initHeight
                                            })
                                        }
                                        ), 250)),
                                        u.once("linux-unmaximize", (()=>{
                                            u.setBounds(e),
                                            u.setMovable(!0),
                                            u.setResizable(!0);
                                            const t = u.getBrowserView();
                                            t && t.webContents.focus(),
                                            u.webContents.executeJavaScript("window.api.unmaximizeTrigger()")
                                        }
                                        )),
                                        u.webContents.executeJavaScript("window.api.maximizeTrigger()")
                                    }
                                    )),
                                    u.on("page-title-updated", (e=>{
                                        e.preventDefault()
                                    }
                                    )),
                                    u.webContents.once("render-process-gone", (()=>{
                                        u.close()
                                    }
                                    )),
                                    u.on("blur", (()=>{
                                        u.webContents.executeJavaScript("window.subInputBlurTimestamp").then((e=>{
                                            s = !e || Date.now() - e > 100
                                        }
                                        ))
                                    }
                                    )),
                                    u.on("focus", (()=>{
                                        s && o.webContents?.focus()
                                    }
                                    )),
                                    a.isDev || this.reportCmp.info("plugin.detach", {
                                        pluginId: e
                                    })
                                }
                                destroyPlugin(e) {
                                    if (!(e in this.runningPluginPool))
                                        return;
                                    const t = this.runningPluginPool[e];
                                    if (t.view && (this.mainWindow.getBrowserView() === t.view ? this.endPlugin() : t.view.webContents.destroy()),
                                    t.detachWindows.length > 0)
                                        for (const e of t.detachWindows)
                                            e.close()
                                }
                                emptyRecovery() {
                                    this.setExpendHeight(0),
                                    this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.empty()")
                                }
                                restoreShowMainWindow(e) {
                                    if (!this.mainWindow.getBrowserView())
                                        return e && this.emptyRecovery(),
                                        this.display.trigger();
                                    this.recoverPlugin((()=>{
                                        this.setExpendHeight(0),
                                        this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.empty()").then((()=>{
                                            this.display.trigger()
                                        }
                                        ))
                                    }
                                    ))
                                }
                                refreshCmdSource() {
                                    this._refreshCmdSourceTimeout && clearTimeout(this._refreshCmdSourceTimeout),
                                    this._refreshCmdSourceTimeout = setTimeout((()=>{
                                        this._refreshCmdSourceTimeout = null,
                                        this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.refreshCmdSource()"),
                                        this.voiceRefreshCmdSource && this.voiceRefreshCmdSource()
                                    }
                                    ), 300)
                                }
                                refreshAccountInfo(e) {
                                    let t = null;
                                    e && (t = {
                                        ...e
                                    },
                                    delete t.db_secrect_key,
                                    1 === t.type && (t.mainPlaceholder = n().get("mainPlaceholder") || "")),
                                    this.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.changeAccount(${t ? JSON.stringify(t) : ""})`),
                                    this.voiceChangeAccount && this.voiceChangeAccount(t)
                                }
                                listenAccountEvent() {
                                    this.accountCmp.on("login", (e=>{
                                        this.refreshAccountInfo(e)
                                    }
                                    )),
                                    this.accountCmp.on("logout", (()=>{
                                        this.refreshAccountInfo()
                                    }
                                    )),
                                    this.accountCmp.on("logout_message", (e=>{
                                        t.dialog.showMessageBox({
                                            buttons: ["已知，关闭", "重新登录 uTools 帐号"],
                                            title: "  uTools 帐号退出提醒",
                                            message: e,
                                            detail: " 本地数据库已切换到游客数据",
                                            cancelId: 0,
                                            defaultId: 1
                                        }).then((({response: e})=>{
                                            1 === e && this.ffffffff.goAccountDb()
                                        }
                                        ))
                                    }
                                    ))
                                }
                                getPluginIdByWebContents(e) {
                                    if (!e || e.isDestroyed())
                                        return null;
                                    const t = this.webContentsId2PluginIdCache[e.id];
                                    if (t)
                                        return t;
                                    for (const t in this.pluginSessionPool)
                                        if (this.pluginSessionPool[t] === e.session)
                                            return this.webContentsId2PluginIdCache[e.id] = t,
                                            t;
                                    return null
                                }
                                pluginDatabasePullEvent(e) {
                                    for (const t in e)
                                        t in this.runningPluginPool && (this.runningPluginPool[t].view && this.triggerPluginViewEvent(this.runningPluginPool[t].view, "DbPull", e[t]),
                                        this.runningPluginPool[t].detachWindows.length > 0 && this.runningPluginPool[t].detachWindows.forEach((i=>{
                                            const n = i.getBrowserView();
                                            n && this.triggerPluginViewEvent(n, "DbPull", e[t])
                                        }
                                        )))
                                }
                                autoLoadPlugin(e, t, i, n, o) {
                                    e in this.pluginsCmp.pluginContainer && t in this.pluginsCmp.pluginContainer[e].featureDic && this.pluginsCmp.pluginContainer[e].featureDic[t].cmds.find((e=>"base" === e.type && e.label === i)) && (this.display.trigger(!0),
                                    this.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.autoLoadPlugin(${JSON.stringify({
                                        pluginId: e,
                                        featureCode: t,
                                        label: i,
                                        value: n,
                                        subInputInput: o
                                    })})`))
                                }
                                _killAllPlugin(e) {
                                    const t = {
                                        ...this.runningPluginPool
                                    };
                                    e && delete t.FFFFFFFF,
                                    Object.values(t).forEach((e=>{
                                        e.view && !e.view.webContents.isDestroyed() && e.view.webContents.destroy(),
                                        e.detachWindows.length > 0 && e.detachWindows.forEach((e=>e.close()))
                                    }
                                    ))
                                }
                                killAllPlugins(e) {
                                    if (this.mainWindow.getBrowserView())
                                        return e && this.mainWindow.getBrowserView().webContents === this.ffffffff.webContents ? this._killAllPlugin(e) : this.recoverPlugin((()=>{
                                            this.emptyRecovery(),
                                            this._killAllPlugin(e)
                                        }
                                        ));
                                    setImmediate((()=>this._killAllPlugin(e)))
                                }
                                subInputAutoInput(e) {
                                    setTimeout((()=>{
                                        this.mainWindow.getBrowserView() && this.mainWindow.webContents.executeJavaScript("window.rpcRenderer.getEnterFeatureCmd()").then((i=>{
                                            if (i && i.subInput && i.subInput.isFocus)
                                                if (!0 === e) {
                                                    if ("text/plain" !== t.clipboard.availableFormats()[0])
                                                        return;
                                                    const e = t.clipboard.readText().trim();
                                                    if (!e || e.length > 99)
                                                        return;
                                                    this.mainWindow.webContents.executeJavaScript(`window.api.setSubInputValue(${JSON.stringify({
                                                        value: e
                                                    })})`)
                                                } else if ("string" == typeof e) {
                                                    if (e.length > 99)
                                                        return;
                                                    this.mainWindow.webContents.executeJavaScript(`window.api.setSubInputValue(${JSON.stringify({
                                                        value: e
                                                    })})`)
                                                }
                                        }
                                        ))
                                    }
                                    ), 50)
                                }
                                detachSubInputAutoInput(e, i) {
                                    setTimeout((()=>{
                                        e.isDestroyed() || e.webContents.isDestroyed() || e.webContents.executeJavaScript("window.payload.subInput").then((n=>{
                                            if (n && n.isFocus)
                                                if (!0 === i) {
                                                    if ("text/plain" !== t.clipboard.availableFormats()[0])
                                                        return;
                                                    const i = t.clipboard.readText().trim();
                                                    if (!i || i.length > 99)
                                                        return;
                                                    e.webContents.executeJavaScript(`window.api.setSubInputValue(${JSON.stringify({
                                                        value: i
                                                    })})`)
                                                } else if ("string" == typeof i) {
                                                    if (i.length > 99)
                                                        return;
                                                    e.webContents.executeJavaScript(`window.api.setSubInputValue(${JSON.stringify({
                                                        value: i
                                                    })})`)
                                                }
                                        }
                                        ))
                                    }
                                    ), 50)
                                }
                                openPluginDevTools(e) {
                                    if (!(e = e || this.mainWindow.getBrowserView()))
                                        return;
                                    const i = this.getPluginIdByWebContents(e.webContents);
                                    if (!i)
                                        return;
                                    const n = this.pluginsCmp.pluginContainer[i];
                                    if (n && (n.isDev || n.unsafe))
                                        if (e.webContents.isDevToolsOpened())
                                            e.webContents.closeDevTools();
                                        else {
                                            const i = t.BrowserWindow.fromWebContents(e.webContents);
                                            if (!i)
                                                return;
                                            const n = i.getSize()[1] < this.config.openPluginHeight ? "detach" : "bottom";
                                            e.webContents.openDevTools({
                                                mode: n
                                            })
                                        }
                                }
                                getWorkWebContentsBySender(e) {
                                    const i = this.triggerPluginViewEventQueues[e.id];
                                    if (i && i.length > 0 && i.includes("PluginOut"))
                                        return null;
                                    const n = t.BrowserWindow.fromWebContents(e);
                                    if (!n)
                                        return null;
                                    if (n === this.mainWindow)
                                        return this.mainWindow.webContents;
                                    const o = this.getPluginIdByWebContents(e);
                                    if (!o)
                                        return null;
                                    const s = this.runningPluginPool[o];
                                    return s && s.detachWindows.includes(n) ? n.webContents : null
                                }
                            }
                            (e,i,o,s,a)
                        }
                        ), !0),
                        this.container.set("pay", (()=>{
                            const e = this.container.get("config").get("pay")
                              , t = this.container.get("account")
                              , i = this.container.get("plugins")
                              , n = this.container.get("window");
                            return new yt(e,t,i,n)
                        }
                        ), !0),
                        this.container.set("database", (()=>{
                            const e = this.container.get("config")
                              , t = this.container.get("window")
                              , i = this.container.get("account")
                              , n = this.container.get("report");
                            return new Pe(e.get("path.database"),e.get("database"),t,i,n)
                        }
                        ), !0),
                        this.container.set("voice", (()=>{
                            const e = this.container.get("config").get("voice")
                              , t = this.container.get("window")
                              , i = this.container.get("database");
                            return new qe(e,t,i)
                        }
                        ), !0),
                        this.container.set("screencapture", (()=>{
                            const e = this.container.get("window");
                            return new dt(e)
                        }
                        ), !0),
                        this.container.set("screencolorpicker", (()=>{
                            const e = this.container.get("window");
                            return new ut(e)
                        }
                        ), !0),
                        this.container.set("helpboot", (()=>{
                            const e = this.container.get("window")
                              , t = this.container.get("database");
                            return new vt(e,t)
                        }
                        ), !0),
                        this.container.set("app", (()=>{
                            const e = this.container.get("config").get("app")
                              , t = this.container.get("plugins")
                              , i = this.container.get("window")
                              , n = this.container.get("voice")
                              , o = this.container.get("database")
                              , s = this.container.get("screencapture")
                              , r = this.container.get("screencolorpicker")
                              , a = this.container.get("helpboot");
                            return new je(e,t,i,n,o,s,r,a)
                        }
                        ), !0),
                        this.container.set("featurehotkey", (()=>{
                            const e = this.container.get("window")
                              , t = this.container.get("database");
                            return new Je(e,t)
                        }
                        ), !0),
                        this.container.set("autoupdate", (()=>{
                            const e = this.container.get("config").get("autoupdate")
                              , i = this.container.get("window")
                              , n = this.container.get("voice")
                              , o = this.container.get("report");
                            return new class {
                                constructor(e, i, n, o) {
                                    Fe(this, "noticeUpdate", (e=>{
                                        this.windowCmp.mainWindow.webContents.executeJavaScript(`window.rpcRenderer.noticeUpdate(${e ? JSON.stringify(e) : ""})`),
                                        this.voiceCmp.voiceWindow && this.voiceCmp.voiceWindow.webContents.executeJavaScript(`window.bridge.noticeUpdate(${e ? JSON.stringify(e) : ""})`)
                                    }
                                    )),
                                    Fe(this, "linuxCheckForUpdate", ((e,i)=>{
                                        if (!t.net.online)
                                            return;
                                        const n = t.app.getVersion()
                                          , o = n.split("-")
                                          , s = t.net.request(this.config.linuxURL + (o[1] || "latest") + "-linux.yml");
                                        s.on("response", (t=>{
                                            200 === t.statusCode && t.on("data", (t=>{
                                                const o = t.toString();
                                                if (!/^version: (.*)$/m.test(o))
                                                    return;
                                                const s = RegExp.$1;
                                                U().gt(s, n) ? (this.newVersionIsDownloaded = !0,
                                                this.noticeUpdate(this.config.linuxDownloadURL),
                                                e && e(s)) : i && i()
                                            }
                                            ))
                                        }
                                        )),
                                        s.end()
                                    }
                                    )),
                                    Fe(this, "mainServices", {
                                        appUpdate: ()=>{
                                            this.newVersionIsDownloaded && (this._appUpdating || (this._appUpdating = !0,
                                            t.app.removeAllListeners("before-quit"),
                                            r().windows() ? t.app.once("before-quit", (()=>{
                                                I().exit()
                                            }
                                            )) : r().macOS() && (I().panelRestoreToWindow(this.windowCmp.mainWindow.getNativeWindowHandle()),
                                            this.voiceCmp.voiceWindow && I().panelRestoreToWindow(this.voiceCmp.voiceWindow.getNativeWindowHandle()),
                                            t.app.dock.hide(),
                                            t.app.hide()),
                                            I().stopClipboardWatch(),
                                            I().stopVoicePanelTriggerEvent(),
                                            I().stopFKeyTapEvent(),
                                            t.globalShortcut.unregisterAll(),
                                            setTimeout((()=>{
                                                t.webContents.getAllWebContents().forEach((e=>{
                                                    e.removeAllListeners("destroyed"),
                                                    e.removeAllListeners("render-process-gone")
                                                }
                                                )),
                                                t.BrowserWindow.getAllWindows().forEach((e=>{
                                                    e.removeAllListeners("close"),
                                                    e.removeAllListeners("closed"),
                                                    e.setClosable(!0)
                                                }
                                                )),
                                                ke.autoUpdater.quitAndInstall()
                                            }
                                            ), 300)))
                                        }
                                    }),
                                    this.config = e,
                                    this.windowCmp = i,
                                    this.voiceCmp = n,
                                    this.reportCmp = o,
                                    this.newVersionIsDownloaded = !1
                                }
                                init() {
                                    r().linux() ? setImmediate((()=>{
                                        this.linuxUpdateWatch()
                                    }
                                    )) : (this.registerEvent(),
                                    setImmediate((()=>{
                                        this.updateWatch()
                                    }
                                    ))),
                                    this.windowCmp.pluginsCmp.on("appupdate", this.noticeUpdate)
                                }
                                updateWatch() {
                                    this.newVersionIsDownloaded || (ke.autoUpdater.checkForUpdates().catch((e=>{
                                        e.message.startsWith("net::ERR_") || this.reportCmp.info("app.checkforupdate.error", {
                                            error: e.message
                                        })
                                    }
                                    )),
                                    setTimeout((()=>{
                                        this.updateWatch()
                                    }
                                    ), V(36e5, 36e6)))
                                }
                                registerEvent() {
                                    ke.autoUpdater.on("update-downloaded", (e=>{
                                        this.newVersionIsDownloaded = !0,
                                        this.noticeUpdate()
                                    }
                                    )),
                                    ke.autoUpdater.on("error", (e=>{
                                        e.message.startsWith("net::ERR_") || this.reportCmp.info("app.autoupdate.error", {
                                            error: e.message
                                        })
                                    }
                                    ))
                                }
                                linuxUpdateWatch() {
                                    this.newVersionIsDownloaded || (this.linuxCheckForUpdate(),
                                    setTimeout((()=>{
                                        this.linuxUpdateWatch()
                                    }
                                    ), V(36e5, 36e6)))
                                }
                            }
                            (e,i,n,o)
                        }
                        ), !0),
                        this.container.set("menu", (()=>new xe), !0),
                        this.container.set("preferences", (()=>new Ae(this.container.get("window"))), !0),
                        this.container.set("tray", (()=>{
                            const e = this.container.get("config").get("app")
                              , t = this.container.get("window")
                              , i = this.container.get("account")
                              , n = this.container.get("helpboot");
                            return new De(e,t,i,n)
                        }
                        ), !0),
                        this.container.set("pluginmenu", (()=>new Te(this.container.get("app"))), !0),
                        this.container.set("developer", (()=>{
                            const e = this.container.get("window")
                              , t = this.container.get("app");
                            return new gt(e,t)
                        }
                        ), !0),
                        this.container.set("connection", (()=>{
                            const e = this.container.get("plugins")
                              , t = this.container.get("window")
                              , i = this.container.get("database")
                              , n = this.container.get("account");
                            return new kt(e,t,i,n)
                        }
                        ), !0),
                        r().macOS() ? this.container.set("nativeapp", (()=>{
                            const e = this.container.get("plugins")
                              , t = this.container.get("window")
                              , i = this.container.get("report")
                              , n = this.container.get("app")
                              , o = this.container.get("connection");
                            return new ze(e,t,i,n,o)
                        }
                        ), !0) : r().windows() ? this.container.set("nativeapp", (()=>{
                            const e = this.container.get("plugins")
                              , t = this.container.get("window")
                              , i = this.container.get("report")
                              , n = this.container.get("app")
                              , o = this.container.get("connection");
                            return new ot(e,t,i,n,o)
                        }
                        ), !0) : r().linux() && this.container.set("nativeapp", (()=>{
                            const e = this.container.get("plugins")
                              , t = this.container.get("window")
                              , i = this.container.get("report")
                              , n = this.container.get("app")
                              , o = this.container.get("connection");
                            return new lt(e,t,i,n,o)
                        }
                        ), !0),
                        this.container.set("ipcservices", (()=>{
                            const e = this.container.mget("account", "report", "plugins", "clipboard", "window", "pay", "database", "voice", "screencapture", "app", "featurehotkey", "autoupdate", "preferences", "pluginmenu", "developer", "connection", "nativeapp");
                            return new pt(e)
                        }
                        ), !0)
                    }
                }
                (this).register(),
                this.get("ipcservices").init(),
                this.get("plugins").init(),
                this.get("window").init(),
                this.get("database").init(),
                this.get("voice").init(),
                this.get("app").init(i),
                this.get("featurehotkey").init(),
                r().linux() || this.get("menu").init(),
                this.get("preferences").init(),
                this.get("tray").init(),
                this.get("pluginmenu").init(),
                this.get("connection").init(),
                this.get("nativeapp").init(),
                this.get("account").init(),
                this.get("clipboard").init(),
                r().production() && this.get("autoupdate").init(),
                this.get("report").info("app.ready", {
                    timeCost: Date.now() - e
                })
            }
            )),
            process.on("uncaughtException", (e=>{
                e?.stack && !e.message.startsWith("net::ERR_") && (this.get("report").info("app.exception", {
                    error: e.stack.replaceAll(__dirname, "")
                }),
                r().dev() && console.log("UncaughtException-----------", e.message, e.stack))
            }
            ))
        }
    }
    ).launch()
}
)();
