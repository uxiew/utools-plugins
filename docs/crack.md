# 修改 utools 源码

## 4.0

> 注意：utools 从`4.0`开始，增加了检测修改机制，导致直接更改源码的方式不再生效！

其中 addon 插件中，在被加载时，会自动检测 asar 文件的完整性，所以导致无法更改源码。

其中增加的方法：

```js
compareServerSignature: compareYuanliaoSignature（3.0）
```

> `utools-app/app/node_modules` 中保留着需要的库

_. 根据 `main.js`中的`chandlerver5`标记，进行注释。
_. `_showLogic` 中`this.mainWindow.show()`代码块可能会有问题...

## 先行准备

1. 安装 asar 模块：

```sh
$ bun add -g @electron/asar
```

2. 解压一个包：
   注意需要拷贝 utools 下`app.asar`、`app.asar.unpacked`目录，然后放置在同一目录下。

```sh
$ mkdir ./utools-app && cp -r /Applications/uTools.app/Contents/Resources/app.asar* ./utools-app
$ asar e ./utools-app/app.asar ./utools-app/app
```

3. 修改内容(查看如下)

4. 再压缩回去

```sh
$ asar p ./utools-app/app ./utools-app/app-new.asar && cp -fr ./utools-app/app-new.asar  /Applications/uTools.app/Contents/Resources/app.asar
```

用新的包替换原来的!

## 修改内容

借助 chrome DevTools ，修改里面的内容：

1. 开启会员专项
   `dist/main.js`：`getAccountInfo`函数调整返回值。

```js
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

2. **开放所有插件的 DevTool 调试功能**

- **替换 `assemblyPlugin`中的`e.isDev`为`!0`是重点**：

  ```
  this.pluginSessionPool[e.name] = i,
  !0 || (R() ? i.webRequest.onBeforeSendHeaders(((e,t)=>{
      t({
  ```

- `openPluginDevTools`方法中，注释掉下面这行：

  ```
  // if (n && (n.isDev || n.unsafe))
        if (e.webContents.isDevToolsOpened())
            e.webContents.closeDevTools();
  ```

- 启用所有`webPreferences` 中的 `devTools: !0,`：

  ```
  const o = {
      textAreasAreResizable: !1,
      // devTools: e.isDev || e.unsafe,
      devTools: !0,
      nodeIntegration: !1,
  ```

- 插件窗口中显示**开发者工具**按钮

  ```js
  const o = this.appCmp.pluginIsOutKill(i);
  this._mainPluginMenu.getMenuItemById('openDevTools').visible = true; //  设置为 true
  ```

- 分离的插件窗口中显示**开发者工具**按钮，`detachPluginLogic` 方法中
  ```js
  subInput: i.subInput,
  featureCode: i.featureCode,
  isDev: !0, // 设置为 true 或删除
  ```

1. 去除`illegal`检测

- 去除`mount`函数中的`illegal`设置

  ```js
  if (n.updateTime = e.updateTime,
    e.upxMd5 && (n.upxMd5 = e.upxMd5),
    // e.illegal && (n.illegal = e.illegal),
  ```

- 去除检测修改 `illegal` 字段状态的设置
  ```
    /*if (e.illegal_plugins?.length > 0)
                        for (const t of e.illegal_plugins) {
                            const e = this.pluginContainer[t];
                            e && !e.illegal && (e.illegal = !0,
                            this.setPluginDirNameIllegal(t),
                            this.emit("illegal", t))
                        }
  */
  ```

3. 对需要二次购买的插件，会员判断破解：
   搜索`isPurchasedUser`和`getUser`，对照修改为：

   ```js
     getUser: e => {

       const t = this.accountCmp.getAccountInfo()

       e.returnValue = {

         avatar: t?.avatar || '',

         nickname: t?.nickname || '',

         type: 1

       }

     }
     ...
     isPurchasedUser: (e, t) => {

         const i = this.accountCmp.getAccountInfo()

         if (i) {

           if ((t.startsWith('dev_') && (t = t.replace('dev_', '')), i.purchased_apps)) {

             const n = i.purchased_apps[t]

             if (!n) return void (e.returnValue = 1)

             if (!0 === n) return void (e.returnValue = !0)

             if (new Date(n) > new Date()) return void (e.returnValue = 1)

           } else if (i.purchased && Array.isArray(i.purchased) && i.purchased.includes(t))

             return void (e.returnValue = !0)

           e.returnValue = 1

         } else e.returnValue = 1

       }
   ```

4. **使不安全插件排在前面**

- `dist/plugins/ffffffff/index.js`：

  ```js
  n = Object.values(t)
    .filter((e) => e.name && 'FFFFFFFF' !== e.name && !e.isDev)
    .sort((e, t) => (e.unsafe ? -1 : t.updateTime - e.updateTime));
  ```

  - 防止删除插件不了
    `dist/main.js`:

  ```ts
  unmount(e) {
      if (!(e in this.pluginContainer))
          return !1;
      // if (this.pluginContainer[e].isDev)
      //     return delete this.pluginContainer[e],
      //     !0;
  ```

5. 去除 developer 限定错误，搜索`（"developer" !== `

```js
      registerDeveloperServices() {
          const e = this.instance.developer
            , i = this.instance.window;
          t.ipcMain.on("developer.services", ((t,n,...o)=>{
              // const s = i.getPluginIdByWebContents(t.sender);
              // if ("developer" !== s && "admin" !== s && "dev_developer" !== s && "dev_admin" !== s)
              //    return void (t.returnValue = new Error("unauthorized"));
              const s = e.developerServices[n];
              "function" == typeof s ? s(t, ...o) : t.returnValue = new Error("未知接口")
          }
          )),
          t.ipcMain.handle("developer.services", (async(t,n,...o)=>{
              // const s = i.getPluginIdByWebContents(t.sender);
              // if ("developer" !== s && "admin" !== s && "dev_developer" !== s && "dev_admin" !== s)
              //     throw new Error("unauthorized");
              const s = e.developerServices[n];
              if ("function" != typeof s)
                  throw new Error("未知接口");
              return await s(...o)
          }
          ))
      }
```

6. `goto`支持 html string 内容的页面，适用于 《一步到位》插件。

```js
    async goto(...e) {
      // chandlerver5 support html string
      if (!e[0] || "string" != typeof e[0])
        throw new Error("url error");
      let t;
```

7. 其他操作

- `main.js` 的 `init()` 中取消检查更新：

  ```js
  // setTimeout(this.checkUpdate, 5e3)
  ```

- `dist/plugins/ffffffff/index.js` 直接安装插件：
  `handleOpenDialog` -> `handleInstallPlugin`

  ```js
  ,onClick:this.handleInstallPlugin,startIcon:e.createElement(St.Z,null)},"安装插件应用")
  ```

- 添加开发者文档、打开社区，并且隐藏"隐私政策"、"用户协议"菜单。

  ```js
    label: "uTools 官网",
    click: ()=>{
        process.nextTick((()=>{
            t.shell.openExternal("https://u.tools")
        }
        ))
    }
  },
  // chandlerver5
  {
    label: "开发者文档",
    click: () => {
      process.nextTick((() => {
        t.shell.openExternal("https://u.tools/docs/developer/preload.html")
      }
      ))
    }
  },
  {
    label: "打开社区",
    click: ()=>{
        process.nextTick((()=>{
            t.shell.openExternal("https://yuanliao.info/")
        }
        ))
    }
  },
  ```

- 添加一个"删除插件"菜单
  `dist/main.js`的'隐藏后台'前：

  ```js
  ,{
      id: "remove",
      label: "删除插件",
      icon: l().join(__dirname, "res", "menu", "close@2x.png"),
      click: ()=>{
      ...
      }
    }, {
      type: "separator"
  }, {
      id: "out",
      label: "隐藏后台",
  ```

  `dist/main.js`:《插件市场》不显示”删除该插件“菜单：

  ```js
  const o = this.appCmp.pluginIsOutKill(i);
  this._mainPluginMenu.getMenuItemById("remove").visible = "FFFFFFFF" !== i,
  ```

- 新增“查看关键字”菜单
  `dist/main.js`:还要限制它不能在【插件市场】显示

  ```js
  }, {
      id: "pluginkeys",
      label: "查看关键字",
      icon: l().join(__dirname, "res", "menu", "info@2x.png"),
      click: ()=>{
        ...
      }
  }, {

  ...
  this._mainPluginMenu.getMenuItemById("remove").visible = "FFFFFFFF" !== i,
  ```

# 扩展插件的 api 时， 需要注意

- 将插件管理中的一些 api 扩展到插件的 api 里：
  `dist/main.js`：修改 `registerFFFFFFFFServices` 方法中，注释相关 `t.sender` 判断限制。

```js
t.ipcMain.handle("ffffffff.services", (async (t, n, ...o) => {
  /*if (t.sender !== i.ffffffff.webContents)
    throw new Error("unauthorized");*/
  return await e[n](...o)
}
```

# 其他

如果自己开发的插件（未发布到市场），非法插件（asarer 插件为例）会包含以下的字段

```json
{
  "location": "/Users/bing/Library/Application Support/uTools/plugins/unsafe-19f11c77905b5f96b5f8511f11821cda.asar",
  "isDev": true,
  "unsafe": true,
  "main": "file:///Users/bing/Library/Application%20Support/uTools/plugins/unsafe-19f11c77905b5f96b5f8511f11821cda.asar/index.html",
  "name": "C1Bh6Lcx",
  "pluginName": "asarer",
  "author": "ChandlerVer5",
  "homepage": "https://www.kancloud.cn/@chandler",
  "description": "ChandlerVer5 的upx插件😄",
  "version": "1.0.0",
  "preload": "/Users/bing/Library/Application Support/uTools/plugins/unsafe-19f11c77905b5f96b5f8511f11821cda.asar/preload.js",
  "logo": "file:///Users/bing/Library/Application%20Support/uTools/plugins/unsafe-19f11c77905b5f96b5f8511f11821cda.asar/logo.png",
  "pluginSetting": {
    "single": true
  },
  "mainPushPower": false,
  "featureDic": {
    "asarer": {
      "code": "asarer",
      "cmds": [
        {
          "trueType": "text",
          "type": "base",
          "match": "asar",
          "label": "asar"
        },
        {
          "trueType": "files",
          "type": "files",
          "label": "asar analyse",
          "match": "/.(asar|upx)$/",
          "fileType": "file",
          "maxLength": 1,
          "labelCmds": [
            {
              "trueType": "files",
              "type": "base",
              "match": "asar analyse",
              "label": "asar analyse"
            },
            {
              "trueType": "files",
              "type": "base",
              "match": "asaranalyse",
              "label": "asaranalyse",
              "weight": -10
            }
          ]
        }
      ],
      "explain": "asar助手、分析器"
    }
  },
  "updateTime": 1681615231482.1084,
  "upxMd5": "1d6c62247621a69b881da408196f6645",
  "illegal": true
}
```

# 修改后可能的问题 🙏

- [x] 格式化之后，如果不能正常运行，需要检测 `${XXX}` 这种字符串插值，可能会多出空格，而产生问题！！！

- [x] 内部会根据`window.utools.isDev()`判断是否使用内部测试网址：`http://open.test.u-tools.cn/` ，导致某些插件产生问题，例如 一步到位；

- [x] 插件删除后打开还是会存在？
