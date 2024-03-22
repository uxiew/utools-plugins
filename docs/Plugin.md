# 插件开发

可以借助我的[asar 插件](https://github.com/ChandlerVer5/utools-plugin-asarer)，对官方插件源码进行查看、修改...

## 设置

官方插件开发模式：

1. `preload.js` 中只能使用`require`，需要挂载到`window`
2. `plugin.json` 中需要`name`字段
3. development 模式

plugin.json 中加入开发模式热重载：

```json
  "development": {
    "main": "http://localhost:8080"
  },
```

为了方便快捷的开发，可以借助插件：[@ver5/vite-plugin-utools](https://github.com/ChandlerVer5/-ver5-vite-plugin-utools)，所有基于 vite 的项目都可以轻松转换为 utools 插件项目

## 插件安装后不能被篡改

`main.js`中的`setPluginDirName`方法会在，插件目录下生成了`install`文件

```js
const a = c().join(this.userPluginsPath, 'install');
```

然后在 `init()` 方法中进行检测：

```js
const i = c().join(this.userPluginsPath, "install");
if (d().existsSync(i)) {
```

> [在 main.js 中对插件的 md5 做了校验](https://www.horosama.com/archives/288)

## uTools 开发者工具

1. 由于`main.js`中的 `registerDeveloperServices` 函数中，限制了调用`developer.service`的插件名称

```js
if (
  'developer' !== s &&
  'admin' !== s &&
  'dev_developer' !== s &&
  'dev_admin' !== s
)
  throw new Error('unauthorized');
```

所以需要保持插件的`plugins.json`的`name`字段为这些字段名。

3. "安全限制，无法安装"。在 `mount` 函数中的 `if` 中去除下面条件：

```js
n.unsafe && ['admin', 'developer', 'clipboard'].includes(n.name);
```

反编译：

```sh
$ asar p utools-dev-tool 85cdaab634dd9e3af404d827c53d2853.asar && mv -f 85cdaab634dd9e3af404d827c53d2853.asar /Users/bing/Library/Application\ Support/uTools/plugin
```

`85cdaab634dd9e3af404d827c53d2853.asar` 是 uTools 开发者工具 安装后的文件，需要自己寻找（可借助 asar 插件查看）

## buildPluginUpxFile

`buildPluginUpxFile` 是构建 upx 插件文件的方法。

## 注意 ⚠️

1. `upx-开发者工具-1.1.0.upx`的安装：需要先安装原版，然后再进行替换 asar 文件。
