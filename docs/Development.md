# onExtensionMessage

为了扩展插件与 浏览器的交互能力！

1. 增加 `ws.js`
   依赖的 ws 库需要放在`node_modules`下

2. 启动 ws
   `main.js` 顶部加入

   ```js
   ws = require('./ws.js');
   ws.startWSS();
   ```

3. `main.js`中的`triggerPluginViewEvent` 方法中加入

   ```js
   if (i === 'PluginReady') {
     ws.listen(j.name, (msg) =>
       e.webContents.executeJavaScript(
         `if(window.utools?.__event__ && typeof window.utools.__event__.onExtensionMessage === 'function' ) { try { window.utools.__event__.onExtensionMessage(${msg})} catch(e) {} }`
       )
     );
   }
   if (i === 'PluginOut') {
     ws.removeListen(j.name);
   }
   ```

4. `rt(this, "pluginUtilApiServices", {` 代码块中加入：

```js
      getCopyedFiles: e => {
        e.returnValue = this.clipboardCmp.getCopyFiles()
      }
      ,
      wsSendMessage: (e) => ws.send(e),
```

5. `ver5/api.js` 中加入

```js
onExtensionMessage: (e) => {
  'function' == typeof e && (window.utools.__event__.onExtensionMessage = e);
},
sendExtensionMessage: (e) => {
  ipcInvoke('wsSendMessage', e)
},
```

## 使用

1. 安装 chrome 插件
   考虑过 [Native messaging](https://developer.chrome.com/docs/extensions/mv3/nativeMessaging/) 但是 electron 应用还不能很好支持，但是插件支持 ws 通信。

   > [Start Electron application from Chrome via Native Messaging? #14438](https://github.com/electron/electron/issues/14438)

2. 开发的插件中

   ```js
   // 监听消息，参数 `message` 消息 来自 chrome 插件
   utools.onExtensionMessage((message) => {
     console.log(message);
   });

   // 发送消息
   utools.sendExtensionMessage(data);
   ```

## TODO

- [] 在插件退出后，依然可以通过特定操作唤醒。（也许可以通过插件读取所有插件，显示一个插件列表，点击后，可配置插件是否可以直接启动等行为，然后根据）

- [] 需要持久化 Service Worker
  [Persistent Service Worker in Chrome Extension](https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension/66618269#)
