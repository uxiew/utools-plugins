# 插件开发

可以借助我的[asar插件](https://github.com/ChandlerVer5/utools-plugin-asarer)，对官方插件源码进行查看、修改...

## 设置

官方插件开发模式：

1. `preload.js` 中只能使用`require`，需要挂载到`window`
2. `plugin.json` 中需要`name`字段
3. development 模式

plugin.json 中加入开发模式热重载：

```ts
  "development": {
    "main": "http://localhost:8080"
  },
```

为了方便快捷的开发，可以借助插件：[@ver5/vite-plugin-utools](https://github.com/ChandlerVer5/-ver5-vite-plugin-utools)，所有基于 vite 的项目都可以轻松转换为 utools 插件项目

## uTools 开发者工具

反编译：

```
asar p utools-dev-tool 85cdaab634dd9e3af404d827c53d2853.asar && mv -f 85cdaab634dd9e3af404d827c53d2853.asar /Users/bing/Library/Application\ Support/uTools/plugin
```

`85cdaab634dd9e3af404d827c53d2853.asar` 是 uTools 开发者工具 安装后的文件，需要自己寻找（可借助 asar 插件查看）

## 注意 ⚠️

1. `upx-开发者工具-1.1.0.upx`的安装：需要先安装原版，然后再进行替换 asar 文件。
