# onExtensionMessage

为了扩展插件与 浏览器的交互能力！

1. 增加 `ws.js`
   依赖的 ws 库需要放在`node_modules`下

2. `main.js`中的`triggerPluginViewEvent` 方法中

   ```js
   if (i === 'PluginReady') {
     ws.listen(j.name, (msg) =>
       e.webContents.executeJavaScript(
         `if(window.utools && window.utools.__event__ && typeof window.utools.__event__.onExtensionMessage === 'function' ) { try { window.utools.__event__.onExtensionMessage(${msg})} catch(e) {} }`
       )
     );
   }
   if (i === 'PluginOut') {
     ws.removeListen(j.name);
   }
   ```

3. `api.sdk.js` 中加入

```js
onExtensionMessage: (e) => {
  'function' == typeof e && (window.utools.__event__.onExtensionMessage = e);
},
```

## 使用

1. 安装 chrome 插件
   考虑过 [nativeMessage](https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendNativeMessage) 但是 electron 应用还不能很好支持。

2. 开发的插件中
   参数 `message` 消息 来自 chrome 插件
   ```js
   utools.onExtensionMessage((message) => {
     console.log(message);
   });
   ```
