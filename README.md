# utools plugins

该项目只做个人学习使用！请勿用于非法用途！因使用本项目而产生的一切后果，均由您自行承担。
本人在此申明：本人不承担任何责任！

# 目录结构

```
---....
---utools-app/	# utools(v3.3.0) 的 app.asar 源代码学习分析
---upxs/		# 插件合集
---utools-template-react/  # react 开发插件的模版
---README.md	# 说明文档
```

# 修改 utools 源码

1. 安装 asar 模块：

```
$ npm install -g asar
```

2. 解压一个包：
   注意需要拷贝 utools 下 app.asar 文件、app.asar.unpacked 目录，然后放置在同一目录下。

```
$ mkdir ./utools-app && cp -r /Applications/uTools.app/Contents/Resources/app.asar* ./utools-app
$ asar extract ./utools-app/app.asar ./utools-app/app
```

3. 修改内容(查看如下)

4. 再压缩回去

```
$ asar pack ./utools-app/app ./utools-app/app-new.asar && cp -fr ./utools-app/app-new.asar  /Applications/uTools.app/Contents/Resources/app.asar
```

用新的包替换原来的!

## 修改内容

借助 chrome DevTools ，修改里面的内容：

1. **取消非官方商店插件的验证及运行限制**

`dist/main.js` 修改如下两处为：

```ts
/*if (s.illegal)
                                     return new t.Notification({
                                         title: "uTools 安全检测",
                                         body: "当前安装的插件应用「" + s.pluginName + "」未通过安全验证，无法运行"
                                     }).show(),
                                     this.destroyPlugin(e),
                                     void this.emptyRecovery();*/ // chandlerver5
```

```ts
/* if (e.illegal_plugins?.length > 0)
                        for (const t of e.illegal_plugins) {
                            const e = this.pluginContainer[t];
                            e && (e.illegal = !0,this.setPluginDirNameIllegal(t))
                        }
                        */
```

`dist/plugins/v5/index.js` 去除 ‘未通过安全验证，无法运行’ 提示

```ts
primary: e.createElement("div", {
                      className: "installed-plugin-name"
                  }, n.pluginName, e.createElement("span", null, "v", n.version), n.unsafe && e.createElement(ha, {
                      title: "非安全方式安装"
                  }, e.createElement(dh.Z, {
                      color: "warning"
                  }))),
```

> 注意：可能出现格式化的错误，请搜索并更正`let$`为`let $` ！

2. **开放所有插件的 DevTool 调试功能**
> 所有 非官方商店插件代码更改：`t.isDev` => `t.unsafe`。

> 所有 非官方商店插件标识更改：`dev` =>  `!`。

- `dist/main.js` mount 函数中：**添加的 `n.isDev = true` 是重点**

```ts
n.name in this.pluginContainer && R().lt(n.version, this.pluginContainer[n.name].version))
                  throw new Error("已存在版本 " + this.pluginContainer[n.name].version);
              return n.isDev = true,this.pluginContainer[n.name] = n,
              this.emit("mount", n.name),
```

- `dist/plugins/v5/index.js` 插件列表：调整 `!e.isDev` 为 `e.name.startsWith("dev_")` 判断区分 开发中的 插件 及其显示（暂时解决方案）。
  并且**使不安全插件排在前面**。

```ts
componentDidMount() {
              const e = window.services.getPluginUpdateSet()
                , t = window.services.getPluginContainer()
                , n = Object.values(t).filter((e=>e.name && "FFFFFFFF" !== e.name && !e.name.startsWith('dev_'))).sort(((e,t)=> e.unsafe ? -1 : t.updateTime - e.updateTime));
              let r;
```

- 区分正在开发中的插件，显示`dev`标识
`dist/index.js` 主搜索框的 Dev 显示：调整 `i.isDev` 为 `i['name'].startsWith("dev_")`。

```ts
  }, this.cmdLabel(t.cmd, t.indexAt, a), i.name.startsWith('dev_') && e.createElement("span", {
```

- 某些插件使用了`isDev`判断接口调用
`dist/index.js`：防止官方接口调用错误，比如《一步到位》插件，
```ts
Ue(this, "pluginUtilApiServices", {
    isDev: e=>{
        const t = this.windowCmp.getPluginIdByWebContents(e.sender);
        // <一步到位>插件名
        if(t === 'automation') e.returnValue = false
        else e.returnValue = !!t && !!this.pluginsCmp.pluginContainer[t]?.isDev
    }
```

- 《所有关键字》中插件列表
`dist/plugins/v5/index.js` 中：`t.isDev` => `t.unsafe`
```ts
                }), t.unsafe && e.createElement("span", {
    className: "feature-cmds-menus-dev"
}, "!")))))), e.createElement("div", {
```

- 《超级面板》中插件列表
`dist/voice/index.js` 中：`a.isDev` => `a.unsafe`
```ts
                }, e.createElement("div", null, this.cmdLabel(t.cmd, t.indexAt, l)), a.unsafe && e.createElement("div", {
    className: "dev"
}, e.createElement("span", null, "!"))))
```

- 《账号与数据》中插件列表
`n.isDev` =>  `!!n.pluginLogo.search('unsafe')`
```ts
        }, e.createElement(dh.Z, null))), e.createElement(Hd, {
primary: n.pluginLogo.search('unsafe') > 0 ? e.createElement("span", null, n.pluginName, e.createElement("span", {
    className: "account-db-dev-flag"
}, "!")) : e.createElement("span", null, n.pluginName),
secondary: n.num + " 份文档"
```

- 防止删除插件不了
`dist/index.js`:
```ts
unmount(e) {
    if (!(e in this.pluginContainer))
        return !1;
    // if (this.pluginContainer[e].isDev)
    //     return delete this.pluginContainer[e],
    //     !0;
```


3. 开启会员专项

`dist/main.js`：`getAccountInfo`函数调整返回值。

```ts
  getAccountInfo() {
          /*
          ...
          */
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
```

4. 去除 developer 限定错误，搜索`（"developer" !== `

```
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
```

5. 其他操作
- 去除多余信息
```
            // this.pluginsCmp.setFeature("", {
            //     code: "call:goHelp",
            //     icon: "res/native/help.png",
            //     explain: "视频介绍 uTools",
            //     cmds: ["uTools 介绍", "帮助", "Help"]
            // }),
```

- 添加一个"删除插件"菜单
方便快速删除
```
,{
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
  }, {
    type: "separator"
}, {
    id: "out",
    label: "隐藏后台",
```

*. 《插件市场》不显示”删除该插件“菜单
```
const o = this.appCmp.pluginIsOutKill(i);
this._mainPluginMenu.getMenuItemById("remove").visible = "FFFFFFFF" !== i,
```

- 新增“查看关键字”菜单
```
const o = this.appCmp.pluginIsOutKill(i);
this._mainPluginMenu.getMenuItemById("remove").visible = "FFFFFFFF" !== i,
```

- 分离窗口时显示“关于应用”菜单
追加：`true ||`
```
     u.webContents.executeJavaScript(`window.initRender(${JSON.stringify({
    pluginId: e,
    icon: c,
    label: i.label,
    subInput: i.subInput,
    featureCode: i.featureCode,
    isDev: a.isDev,
    isPluginInfo: true || "FFFFFFFF" !== e && !a.isDev
})})`).then((([e,t])=>{
```

# 插件开发

可以借助我的 [asar 插件](https://github.com/ChandlerVer5/utools-plugin-asarer)，对官方插件源码进行查看、修改...

非法插件会包含以下的字段

```json
{
  ...
  "unsafe": true,
  "main": "file:///Users/bing/Library/Application Support/uTools/plugins/unsafe-abe19672c5dd8c297c8a3028e1feea58.asar/index.html",
  "name": "oIeD1z8L",
  "pluginName": "npm-helper",
  "illegal": true
}
```

## 设置

1. `plugin.json` 中需要`name`字段
2. development 模式

plugin.json 中加入开发模式热重载：

```ts
  "development": {
    "main": "http://localhost:8080"
  },
```

## uTools 开发者工具

反编译：

```
asar p utools-dev-tool 85cdaab634dd9e3af404d827c53d2853.asar && mv -f 85cdaab634dd9e3af404d827c53d2853.asar /Users/bing/Library/Application\ Support/uTools/plugin
```

`85cdaab634dd9e3af404d827c53d2853.asar` 是 uTools 开发者工具 安装后的文件，需要自己寻找（可借助 asar 插件查看）

## 注意 ⚠️

1. `upx-开发者工具-1.1.0.upx`的安装：需要先安装原版，然后再进行替换 asar 文件。

# 修改后可能的问题

~~*. 内部会根据`window.utools.isDev()`判断是否使用内部测试网址：`http://open.test.u-tools.cn/` ，导致某些插件产生问题，例如 一步到位；~~

~~*. 插件删除后打开还是会存在？~~

# 想做的插件

- cdn;有些基于纯 Esbuild 来做线上 cjs -> esm 的 CDN 服务，比如 esm.sh 和 skypack:
- 快速查询 js、rust 语法文档--（目前在写的 devdocs-node 版，基本完成）
- 学习英语的插件
- 查询成语，汉字，诗集插件
- 直接查询 gitee,github,gitlab 资源,做 sourceviewer
- 项目源码分析插件
- [keepass 密码管理插件](https://github.com/ChandlerVer5/utools-plugin-keepass/)
- [chatgpt 插件](https://github.com/ChandlerVer5/utools-plugin-chat/)
- [utools 旧版翻译插件](https://github.com/ChandlerVer5/utools-plugin-translater/)

会陆续发布在 github 上

# 其他工具 🔧

## 猿如意

csdn 出品的 https://devbit.csdn.net/

插件基本和 utools 的无差别，简单修改可用；估计借鉴了 utools

## 相关配置

```
open ~/rubick
open /Users/bing/Library/Caches/rubick-downloads
```

## hapigo

https://hapigo.com/

## rubick

https://github.com/rubickCenter/rubick

## cerebro

https://github.com/cerebroapp/cerebro

## raycast

https://www.raycast.com/

[Raycast 搜索和启动软件程序](https://lemon.qq.com/lab/app/Raycast.html)

https://github.com/egoist/raycast-scripts

## 替代工具

https://hub.fastgit.org/oliverschwendener/ueli

https://hub.fastgit.org/tinytacoteam/zazu

https://hub.fastgit.org/KELiON/cerebro

https://hub.fastgit.org/hainproject/hain

https://github.com/hereappdev/Here-Plugins

[Alfred 的免费开源替代品 Zazu](https://zhuanlan.zhihu.com/p/66481006)
Fluent Search --windows store

# 开发资源

[FlatIcon](https://www.flaticon.com/)

[uTools Github](https://github.com/uTools-Labs)
